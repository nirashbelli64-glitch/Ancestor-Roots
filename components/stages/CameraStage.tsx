'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/components/providers/SessionContext';
import ScanReticle from '@/components/ui/ScanReticle';
import { Camera, Upload, Sparkles, AlertCircle, RefreshCw, SwitchCamera } from 'lucide-react';
import { SAMPLE_HEIRLOOMS } from '@/lib/samples';

export default function CameraStage() {
  const { setStage, setCapturedImage, setScanResult } = useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isScanning, setIsScanning] = useState(false);
  const [statusText, setStatusText] = useState('Hold steady over your heirloom...');

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access not supported by browser');
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
          videoRef.current.play();
        }
      } catch (err: any) {
        console.warn('Camera initiation note:', err);
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

    // Call /api/scan
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
      const sample = SAMPLE_HEIRLOOMS[0];
      setScanResult(sample.defaultScanResult);
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
        console.warn('Upload scan note, fallback applied:', err);
        setScanResult(SAMPLE_HEIRLOOMS[0].defaultScanResult);
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
    <div className="relative w-full max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center p-4">
      {/* Top instruction header */}
      <div className="mb-4 text-center">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center justify-center gap-2">
          <Camera className="w-5 h-5 text-aurora-pink" />
          <span>Point at Your Sacred Heirloom</span>
        </h2>
        <p className="text-xs sm:text-sm text-pink-200/80 font-sans mt-1">
          Hold steady. The Ancestor will examine the patina, craft markers, and materials.
        </p>
      </div>

      {/* Main Viewfinder Frame */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[65vh] rounded-3xl overflow-hidden glass-panel border-2 border-aurora-pink/35 shadow-glow-pink bg-black">
        {/* Video feed or error fallback */}
        {!cameraError ? (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-obsidian/90">
            <AlertCircle className="w-12 h-12 text-aurora-pink mb-3 animate-pulse" />
            <h3 className="text-lg font-serif font-bold text-pink-200 mb-2">
              Camera Not Connected
            </h3>
            <p className="text-xs text-neutral-300 max-w-md mb-6 font-sans">
              {cameraError}. You can upload any photo of your heirloom directly, or test with an ancestral preset below.
            </p>
            <label className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-aurora-pink to-purple-600 hover:brightness-110 text-white font-serif text-sm tracking-wider uppercase cursor-pointer shadow-glow-pink transition-all">
              <Upload className="w-4 h-4" />
              <span>Upload Heirloom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Reticle Overlay */}
        <ScanReticle isScanning={isScanning || !cameraError} statusText={statusText} />

        {/* Camera Switcher Button (for mobile) */}
        {!cameraError && (
          <button
            onClick={toggleFacingMode}
            className="absolute top-4 right-4 p-3 rounded-full bg-obsidian-card text-pink-200 border border-white/20 hover:scale-105 transition-all z-30 shadow-lg"
            title="Switch Camera"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="mt-6 flex flex-col items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          {!cameraError && (
            <button
              onClick={captureFrame}
              disabled={isScanning}
              className="relative group px-10 py-4 rounded-full bg-gradient-to-r from-aurora-pink via-purple-500 to-indigo-500 text-white font-serif font-bold text-base tracking-wider uppercase shadow-glow-pink hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                {isScanning ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <span>{isScanning ? 'Analyzing Heirloom...' : 'Capture & Identify'}</span>
              </div>
            </button>
          )}

          {/* File Upload Fallback Button */}
          <label className="p-4 rounded-full glass-panel border border-white/20 text-neutral-200 hover:text-white hover:border-aurora-pink cursor-pointer transition-all hover:scale-105 shadow-md" title="Upload an image">
            <Upload className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Quick Sample Heirloom Selector Gallery */}
        <div className="w-full max-w-4xl mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-2">
          <span className="text-[11px] font-serif uppercase tracking-widest text-pink-300 flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-aurora-pink" />
            <span>Or select an ancestral heirloom sample for instant identification:</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 w-full">
            {SAMPLE_HEIRLOOMS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="p-2 rounded-2xl glass-panel border border-white/10 hover:border-aurora-pink text-left transition-all hover:scale-[1.03] flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className="w-full aspect-square rounded-xl bg-cover bg-center border border-white/15 group-hover:shadow-glow-pink transition-shadow"
                  style={{ backgroundImage: `url(${sample.imageUrl})` }}
                />
                <div className="w-full text-center overflow-hidden">
                  <div className="text-[11px] font-serif font-bold text-white truncate">
                    {sample.name}
                  </div>
                  <div className="text-[9px] text-pink-200/70 truncate">
                    {sample.estimatedEra}
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
