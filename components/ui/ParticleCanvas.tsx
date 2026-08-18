'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  burstTrigger?: number;
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  hue: number;
  flickerSpeed: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export default function ParticleCanvas({
  burstTrigger = 0,
  density = 'medium',
  className = '',
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const prevBurst = useRef<number>(burstTrigger);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const count = density === 'low' ? 12 : density === 'medium' ? 20 : 35;
    particlesRef.current = [];

    const createParticle = (initialRandomY = false): Particle => {
      const maxLife = 160 + Math.random() * 200;
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.3 + Math.random() * 0.7),
        size: 1.5 + Math.random() * 2.5,
        alpha: 0,
        maxAlpha: 0.3 + Math.random() * 0.4,
        life: initialRandomY ? Math.random() * maxLife : 0,
        maxLife,
        hue: 280 + Math.random() * 50,
        flickerSpeed: 0.03 + Math.random() * 0.04,
      };
    };

    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(true));
    }

    const triggerBurstExplosion = () => {
      const burstCount = 60;
      const centerX = width / 2;
      const centerY = height / 2;
      const colors = ['#E100FF', '#F472B6', '#C084FC', '#F7F7F7'];

      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.0 + Math.random() * 6.0;
        sparksRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 3.5,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    if (burstTrigger > prevBurst.current) {
      triggerBurstExplosion();
      prevBurst.current = burstTrigger;
    }

    let lastTime = 0;
    const render = (time: number) => {
      animationFrameId.current = requestAnimationFrame(render);
      // Throttle rendering for max smoothness
      if (time - lastTime < 24) return;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Render floating ethereal embers
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.maxAlpha;
        } else if (progress > 0.8) {
          p.alpha = ((1 - progress) / 0.2) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha * (0.85 + 0.15 * Math.sin(p.life * p.flickerSpeed));
        }

        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > width + 20) {
          particlesRef.current[i] = createParticle(false);
        }
      }

      // Render burst sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.vy += 0.06;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [density, burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transform-gpu ${className}`}
      aria-hidden="true"
    />
  );
}
