import { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion';

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 1,
  duration: Math.random() * 18 + 14,
  delay: Math.random() * 8,
  color: i % 3 === 0 ? '#FF6B57' : '#0D9488',
}));

export default function GlobalBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [viewport, setViewport] = useState({ w: 2000, h: 1000 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 22, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 22, mass: 0.5 });

  const heavyX = useSpring(mouseX, { stiffness: 28, damping: 26, mass: 0.7 });
  const heavyY = useSpring(mouseY, { stiffness: 28, damping: 26, mass: 0.7 });

  const parallaxX = useTransform(heavyX, [0, viewport.w], [40, -40]);
  const parallaxY = useTransform(heavyY, [0, viewport.h], [40, -40]);
  const parallaxXReverse = useTransform(heavyX, [0, viewport.w], [-55, 55]);
  const parallaxYReverse = useTransform(heavyY, [0, viewport.h], [-55, 55]);

  const tiltX1 = useTransform(heavyY, [0, viewport.h], [6, -6]);
  const tiltY1 = useTransform(heavyX, [0, viewport.w], [-6, 6]);
  const tiltX2 = useTransform(heavyY, [0, viewport.h], [-5, 5]);
  const tiltY2 = useTransform(heavyX, [0, viewport.w], [5, -5]);

  const flareX = useTransform(springX, (x) => x - 128);
  const flareY = useTransform(springY, (y) => y - 128);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let raf;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });

    handleResize();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  const midParticles = useMemo(() => PARTICLES.filter((p) => p.id % 3 !== 0), []);
  const farParticles = useMemo(() => PARTICLES.filter((p) => p.id % 3 === 0), []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-paper">

      {/* 1. Noise */}
      <div
        className="absolute inset-0 z-[-1] opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* 2. Aurora — slow, cheap (opacity/position only, no blur animation) */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full bg-accent/[0.10] blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-coral/[0.08] blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* 3. Particle field — pure CSS keyframe motion, no JS per-frame cost */}
      <div className="absolute inset-0 blur-[0.5px] opacity-40">
        {farParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size * 2, height: p.size * 2, background: p.color }}
            animate={{ y: [0, -24, 0], opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </div>
      <div className="absolute inset-0">
        {midParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color }}
            animate={{ y: [0, -50, 0], opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: p.duration * 0.75, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
          />
        ))}
      </div>

      {/* 4. Grid spotlight */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#10201B1A_1px,transparent_1px),linear-gradient(to_bottom,#10201B1A_1px,transparent_1px)] bg-[size:64px_64px]"
        style={{
          maskImage: useMotionTemplate`radial-gradient(850px circle at ${springX}px ${springY}px, black, transparent 80%)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(850px circle at ${springX}px ${springY}px, black, transparent 80%)`,
        }}
      />

      {/* 5. Cursor flare — single layer, cheap */}
      <motion.div
        className="absolute w-64 h-64 bg-accent/20 rounded-full blur-3xl mix-blend-screen"
        style={{ x: flareX, y: flareY }}
      />

      {/* 6. Node graph */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <motion.path d="M 200 800 Q 400 500 800 600 T 1400 300" fill="transparent" stroke="url(#gradient)" strokeWidth="1.5" strokeDasharray="5 5" animate={{ strokeDashoffset: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
        <motion.path d="M 100 200 Q 600 400 900 100" fill="transparent" stroke="url(#gradient-coral)" strokeWidth="1" strokeDasharray="4 8" animate={{ strokeDashoffset: [0, 100] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
        <motion.circle cx="800" cy="600" r="3" fill="#0D9488" animate={{ r: [3, 6, 3], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="900" cy="100" r="3" fill="#FF6B57" animate={{ r: [3, 6, 3], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }} />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0" /><stop offset="50%" stopColor="#0D9488" stopOpacity="1" /><stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient-coral" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B57" stopOpacity="0" /><stop offset="50%" stopColor="#FF6B57" stopOpacity="0.8" /><stop offset="100%" stopColor="#FF6B57" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 7. Drifting code blocks */}
      <motion.div animate={{ y: [0, -100], opacity: [0, 0.3, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute top-[60%] left-[10%] font-mono text-[10px] text-mist/60 leading-tight">
        <pre>{`{\n  "status": "active",\n  "nodes": 1024,\n  "render": true\n}`}</pre>
      </motion.div>
      <motion.div animate={{ y: [0, -80], opacity: [0, 0.4, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 5 }} className="absolute top-[20%] right-[15%] font-mono text-[10px] text-accent/50 leading-tight">
        <pre>{`const engine = useMotion();\nawait graph.compile();`}</pre>
      </motion.div>

      {/* 8. Glass Dashboard — light-sweep border instead of rotating conic (much cheaper) */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY, rotateX: tiltX1, rotateY: tiltY1, perspective: 1000 }}
        animate={{ y: [0, -18, 0], rotate: [-8, -4, -8] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-16 -left-12 w-[520px] h-[340px] rounded-3xl border border-white/90 shadow-[0_30px_60px_-15px_rgba(13,148,136,0.2)] bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-2xl flex p-6 gap-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_8s_infinite]" />
        <div className="w-24 h-full bg-accent/5 rounded-2xl border border-accent/10 flex flex-col gap-3 p-3">
          <div className="w-full h-8 bg-accent/15 rounded-lg" />
          <div className="w-full h-4 bg-accent/10 rounded-md mt-4" />
          <div className="w-2/3 h-4 bg-accent/10 rounded-md" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="w-full h-12 bg-accent/5 rounded-2xl border border-accent/10 flex items-center px-4 justify-between">
            <div className="w-32 h-4 bg-accent/15 rounded-md" />
            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-coral/40" /><div className="w-3 h-3 rounded-full bg-accent/40" /></div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 h-28 bg-accent/5 rounded-2xl border border-accent/10 flex items-end p-4">
              <motion.div className="w-full bg-accent/15 rounded-t-lg" animate={{ height: ['50%', '80%', '35%', '65%', '50%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
            <div className="flex-1 h-28 bg-accent/5 rounded-2xl border border-accent/10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent/60 animate-spin" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 9. 3D Stacked Cards */}
      <motion.div
        style={{ x: parallaxXReverse, y: parallaxYReverse, rotateX: tiltX2, rotateY: tiltY2, perspective: 1000 }}
        animate={{ y: [0, 26, 0], rotate: [12, 16, 12] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[55%] -right-16 w-[420px] h-[360px]"
      >
        <div className="absolute inset-0 translate-x-8 translate-y-8 rounded-3xl border border-coral/30 bg-white/10 backdrop-blur-md shadow-2xl" />
        <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-coral/40 bg-white/20 backdrop-blur-lg shadow-2xl" />
        <div className="absolute inset-0 rounded-3xl border-2 border-white shadow-[0_40px_80px_-20px_rgba(255,107,87,0.25)] bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-3xl flex flex-col p-8 gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-coral/10 rounded-bl-full blur-2xl" />
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral/20 to-coral/5 border border-coral/30 shadow-inner flex items-center justify-center">
              <div className="w-6 h-6 rounded-md bg-coral/40 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="w-3/4 h-5 bg-coral/20 rounded-md" />
              <div className="w-1/2 h-4 bg-coral/10 rounded-md" />
            </div>
          </div>
          <div className="w-full h-px bg-coral/15 my-2 z-10" />
          <div className="flex flex-col gap-4 z-10">
            <div className="w-full h-12 bg-coral/5 rounded-xl border border-coral/20" />
            <div className="w-full h-12 bg-coral/5 rounded-xl border border-coral/20" />
          </div>
        </div>
      </motion.div>

      {/* 10. Floating status chip */}
      <motion.div
        animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[15%] left-[45%] flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg text-[10px] font-mono text-accent/70"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        synced
      </motion.div>

      {/* 11. Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(16,32,27,0.15)_100%)]" />
    </div>
  );
}