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
  hue: number; // 280-330 for pink/purple/magenta
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = density === 'low' ? 30 : density === 'medium' ? 55 : 90;
    particlesRef.current = [];

    const createParticle = (initialRandomY = false): Particle => {
      const maxLife = 180 + Math.random() * 240;
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(0.4 + Math.random() * 1.0),
        size: 1.5 + Math.random() * 3.0,
        alpha: 0,
        maxAlpha: 0.35 + Math.random() * 0.55,
        life: initialRandomY ? Math.random() * maxLife : 0,
        maxLife,
        hue: 275 + Math.random() * 55, // pink to purple/violet (275 to 330)
        flickerSpeed: 0.03 + Math.random() * 0.05,
      };
    };

    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(true));
    }

    const triggerBurstExplosion = () => {
      const burstCount = 140;
      const centerX = width / 2;
      const centerY = height / 2;
      const colors = ['#E100FF', '#F472B6', '#C084FC', '#F7F7F7', '#38BDF8'];

      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 8.5;
        sparksRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2 + Math.random() * 4.5,
          alpha: 1,
          decay: 0.008 + Math.random() * 0.018,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    if (burstTrigger > prevBurst.current) {
      triggerBurstExplosion();
      prevBurst.current = burstTrigger;
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render floating ethereal embers
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx + Math.sin(p.life * 0.02) * 0.4;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.maxAlpha;
        } else if (progress > 0.75) {
          p.alpha = ((1 - progress) / 0.25) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha * (0.8 + 0.2 * Math.sin(p.life * p.flickerSpeed));
        }

        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        gradient.addColorStop(0, `hsla(${p.hue}, 95%, 75%, ${p.alpha})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 90%, 60%, ${p.alpha * 0.6})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife || p.y < -30 || p.x < -30 || p.x > width + 30) {
          particlesRef.current[i] = createParticle(false);
        }
      }

      // Render burst sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.vy += 0.08;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.shadowBlur = 12;
        ctx.shadowColor = s.color;
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

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
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
