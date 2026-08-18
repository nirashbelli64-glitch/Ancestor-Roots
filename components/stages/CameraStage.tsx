'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/components/providers/SessionContext';
import ScanReticle from '@/components/ui/ScanReticle';
import { Camera, Upload, Sparkles, RefreshCw, SwitchCamera, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_HEIRLOOMS } from '@/lib/samples';
import { classifyImageArtifact } from '@/lib/visionClassifier';

export default function CameraStage() {
  const { setStage, setCapturedImage, setScanResult } = useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState(false);
  const [statusText, setStatusText] = useState('Hold steady over your heirloom...');
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);
        setCameraReady(false);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access not supported by this browser');
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              setCameraReady(true);
            }).catch((e) => {
              console.warn('Video play note:', e);
              setCameraReady(true);
            });
          };
        }
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError(err.message || 'Unable to access camera device');
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleRetryCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;
    setIsScanning(true);
    setStatusText('Aligning spectral optic sensors...');

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedImage(base64Image);

    try {
      setStatusText('Identifying visual craft signatures & patina...');
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error(`Scan API error ${response.status}`);
      }

      const scanData = await response.json();
      setScanResult(scanData);
      setStage('tags');
    } catch (err) {
      console.warn('Live scan note, dynamic classification applied:', err);
      const classified = classifyImageArtifact(base64Image);
      setScanResult(classified);
      setStage('tags');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setStatusText('Reading visual relic from file...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result as string;
      setCapturedImage(base64Image);

      try {
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });
        const scanData = await response.json();
        setScanResult(scanData);
        setStage('tags');
      } catch (err) {
        console.warn('Upload scan note, dynamic classification applied:', err);
        const classified = classifyImageArtifact(base64Image);
        setScanResult(classified);
        setStage('tags');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_HEIRLOOMS[0]) => {
    setCapturedImage(sample.imageUrl);
    setScanResult(sample.defaultScanResult);
    setStage('tags');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 z-10">
      {/* Top instruction header */}
      <div className="mb-3 text-center">
        <h2 className="text-lg sm:text-2xl font-serif font-bold text-white flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-aurora-pink" />
          <span>Point Camera or Upload Heirloom Photo</span>
        </h2>
        <p className="text-xs text-pink-200/80 font-sans mt-0.5">
          Hold steady or upload any image. The Ancestor will examine the patina and craftsmanship.
        </p>
      </div>

      {/* Main Viewfinder Frame (Compact & responsive) */}
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[400px] max-w-3xl rounded-3xl overflow-hidden glass-panel border-2 border-aurora-pink/40 shadow-glow-pink bg-black flex items-center justify-center">
        {/* Video feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover ${cameraError ? 'hidden' : 'block'}`}
        />

        {/* Camera Permission / Error Overlay */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-obsidian/95 z-20">
            <ShieldAlert className="w-10 h-10 text-aurora-pink mb-2 animate-pulse" />
            <h3 className="text-base font-serif font-bold text-pink-200 mb-1">
              Camera Access Restricted
            </h3>
            <p className="text-xs text-neutral-300 max-w-sm mb-4 font-sans leading-relaxed">
              If your camera is blocked or shutter is closed, you can upload any photo directly or choose a preset below.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-aurora-pink to-purple-600 hover:brightness-110 text-white font-serif text-xs tracking-wider uppercase cursor-pointer shadow-glow-pink transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleRetryCamera}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-panel text-pink-200 hover:text-white text-xs font-serif transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Reticle Overlay */}
        <ScanReticle isScanning={isScanning || (!cameraError && cameraReady)} statusText={statusText} />

        {/* Camera Switcher Button */}
        {!cameraError && (
          <button
            onClick={toggleFacingMode}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-obsidian-card text-pink-200 border border-white/20 hover:scale-105 transition-all z-30 shadow-lg cursor-pointer"
            title="Switch Camera"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary Action Controls Bar */}
      <div className="mt-4 flex flex-col items-center gap-3 w-full">
        <div className="flex items-center justify-center gap-3 w-full max-w-md">
          {/* Main Capture Button */}
          <button
            onClick={captureFrame}
            disabled={isScanning || !!cameraError}
            className={`flex-1 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-serif font-bold text-sm tracking-wider uppercase transition-all shadow-glow-pink ${
              cameraError
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-aurora-pink via-purple-500 to-indigo-500 text-white hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            {isScanning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            <span>{isScanning ? 'Analyzing...' : 'Capture Photo'}</span>
          </button>

          {/* Upload Photo Button */}
          <label
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl glass-panel border border-aurora-pink/40 text-pink-200 hover:text-white hover:border-aurora-pink cursor-pointer transition-all hover:scale-105 shadow-md text-xs font-serif uppercase tracking-wider"
            title="Upload from device"
          >
            <Upload className="w-4 h-4 text-aurora-pink" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Quick Sample Heirloom Selector Gallery */}
        <div className="w-full max-w-3xl mt-2 pt-3 border-t border-white/10 flex flex-col items-center gap-2">
          <span className="text-[11px] font-serif uppercase tracking-widest text-pink-300 flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-aurora-pink" />
            <span>Or try an ancestral heirloom preset:</span>
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
            {SAMPLE_HEIRLOOMS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="p-1.5 rounded-xl glass-panel border border-white/10 hover:border-aurora-pink text-left transition-all hover:scale-[1.04] flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div
                  className="w-full aspect-square rounded-lg bg-cover bg-center border border-white/15 group-hover:shadow-glow-pink transition-shadow"
                  style={{ backgroundImage: `url(${sample.imageUrl})` }}
                />
                <div className="w-full text-center overflow-hidden">
                  <div className="text-[10px] font-serif font-bold text-white truncate">
                    {sample.name.split(' ')[0]} {sample.name.split(' ')[1] || ''}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
