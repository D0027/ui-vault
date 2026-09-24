import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// --- BULLETPROOF INLINE ICONS ---
const MailIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const LockIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const UserIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const EyeIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);
const EyeOffIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>);
const StickFigure = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="5" r="2"/><path d="M12 7v8"/><path d="m9 10 3-3 3 3"/><path d="m9 22 3-7 3 7"/></svg>);
const GiftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M12 5a3 3 0 1 0-3 3"/><path d="M12 5a3 3 0 1 1 3 3"/><path d="M12 5v17"/><path d="M3 8h18"/></svg>);

// --- ANIMATION VARIANTS ---
const formStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const formItem = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function BambooPandaLogin() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'walking' | 'loading' | 'success'

  // Mouse Tracking for Panda Eyes
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const pupilX = useTransform(mouseX, [-1, 1], [-5, 5]);
  const pupilY = useTransform(mouseY, [-1, 1], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitState !== 'idle') return;

    setSubmitState('walking');
    setTimeout(() => setSubmitState('loading'), 1400);
    setTimeout(() => setSubmitState('success'), 3000);
    setTimeout(() => {
      setSubmitState('idle');
      if (authMode === 'register') setAuthMode('login');
    }, 4500);
  };

  const toggleAuthMode = () => {
    if (submitState !== 'idle') return;
    setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#050605] overflow-hidden font-sans selection:bg-[#34d399] selection:text-[#070908]">

      {/* ================= ULTRA PREMIUM BACKGROUND ================= */}

      {/* Base deep gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 0%, #0a0f0c 0%, #050605 55%, #020302 100%)' }} />

      {/* Animated aurora mesh blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none mix-blend-screen blur-[110px]"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.30) 0%, rgba(16,185,129,0) 70%)' }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0], opacity: isLightOn ? 0.9 : 0.35 }}
        transition={{ x: { duration: 18, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 22, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 1.2 } }}
      />
      <motion.div
        className="absolute -bottom-52 -right-32 w-[620px] h-[620px] rounded-full pointer-events-none mix-blend-screen blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.22) 0%, rgba(52,211,153,0) 70%)' }}
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0], opacity: isLightOn ? 0.8 : 0.28 }}
        transition={{ x: { duration: 24, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 20, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 1.2 } }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[380px] h-[380px] rounded-full pointer-events-none mix-blend-screen blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(252,211,77,0.16) 0%, rgba(252,211,77,0) 70%)' }}
        animate={{ opacity: isLightOn ? [0.4, 0.7, 0.4] : 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Fine perspective grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.14) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
          transform: 'perspective(500px) rotateX(55deg)',
          transformOrigin: 'bottom'
        }}
      />

      {/* Drifting bokeh particles */}
      {[...Array(14)].map((_, i) => {
        const size = 2 + (i % 4);
        const left = (i * 37) % 100;
        const delay = (i * 1.3) % 10;
        const duration = 14 + (i % 6) * 3;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${left}%`,
              bottom: '-10px',
              width: size,
              height: size,
              background: i % 3 === 0 ? 'rgba(252,211,77,0.55)' : 'rgba(16,185,129,0.45)',
              boxShadow: i % 3 === 0 ? '0 0 8px rgba(252,211,77,0.6)' : '0 0 8px rgba(16,185,129,0.5)'
            }}
            animate={{ y: [0, -700], opacity: [0, 0.8, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
          />
        );
      })}

      {/* Subtle grain/noise texture for premium tactility */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] mix-blend-overlay">
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Twinkling starfield */}
      {[...Array(30)].map((_, i) => {
        const top = (i * 53) % 100;
        const left = (i * 29) % 100;
        const delay = (i * 0.37) % 5;
        const dur = 2.5 + (i % 5) * 0.6;
        const size = i % 5 === 0 ? 2 : 1;
        return (
          <motion.span
            key={`star-${i}`}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{ top: `${top}%`, left: `${left}%`, width: size, height: size }}
            animate={{ opacity: [0.1, 0.9, 0.1] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}

      {/* Sweeping conic sheen */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-[0.05]"
        style={{ background: 'conic-gradient(from 0deg at 50% 30%, transparent 0deg, rgba(16,185,129,0.5) 40deg, transparent 90deg)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 220px 90px rgba(0,0,0,0.85)' }} />

      {/* Warm room glow toggled by lamp */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isLightOn ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,0.08) 0%, rgba(0,0,0,0) 60%)' }}
      />
      {/* ================= /BACKGROUND ================= */}

      <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-around gap-12 px-6 py-12 z-10">

        {/* ---------------------------------------------------- */}
        {/* LEFT SIDE: PHYSICS LAMP                              */}
        {/* ---------------------------------------------------- */}
        <div className="relative flex flex-col items-center md:mr-10 -mt-12 md:-mt-12 self-start" style={{ marginTop: 'calc(-3rem - 48px)' }}>

          {/* Ceiling mount — anchors the wire to the very top of the viewport */}
          <div className="relative flex flex-col items-center z-20">
            <motion.div
              className="w-14 h-3 rounded-b-md"
              animate={{
                backgroundColor: isLightOn ? '#3f3f46' : '#18181b',
                boxShadow: isLightOn ? '0 4px 18px rgba(252,211,77,0.35)' : '0 4px 10px rgba(0,0,0,0.6)'
              }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              className="w-2.5 h-2.5 rounded-full -mt-[2px]"
              animate={{
                backgroundColor: isLightOn ? '#fcd34d' : '#27272a',
                boxShadow: isLightOn ? '0 0 10px rgba(252,211,77,0.8)' : 'none'
              }}
              transition={{ duration: 0.8 }}
            />
          </div>

          <AnimatePresence>
            {!isLightOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-24 -right-4 pointer-events-none"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -25, -45], x: [0, 10, 25], opacity: [0, 1, 0], scale: [0.6, 1, 1.4] }}
                    transition={{ repeat: Infinity, duration: 3.5, delay: i * 1.2, ease: "easeOut" }}
                    className="absolute text-zinc-600 font-black text-sm drop-shadow-md"
                  >
                    Z
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`w-1.5 h-48 md:h-64 transition-colors duration-1000 ${isLightOn ? 'bg-[#fcd34d]' : 'bg-[#18181b]'}`} />

          <div className="relative flex justify-center z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
            <motion.div
              animate={{
                backgroundColor: isLightOn ? '#fcd34d' : '#18181b',
                boxShadow: isLightOn
                  ? '0px 0px 50px rgba(252,211,77,0.5), inset 0px -10px 20px rgba(217,119,6,0.6)'
                  : 'inset 0px -10px 20px rgba(0,0,0,0.8)'
              }}
              transition={{ duration: 0.8 }}
              className="w-40 h-28 relative flex items-center justify-center rounded-sm"
              style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1 flex flex-col items-center">
                {!isLightOn ? (
                  <div className="flex gap-5">
                    <div className="w-4 h-2 border-b-[3.5px] border-[#09090b] rounded-b-full opacity-60" />
                    <div className="w-4 h-2 border-b-[3.5px] border-[#09090b] rounded-b-full opacity-60" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 mt-2">
                    <div className="flex gap-5">
                      <div className="w-4 h-2 border-t-[3.5px] border-[#78350f] rounded-t-full" />
                      <div className="w-4 h-2 border-t-[3.5px] border-[#78350f] rounded-t-full" />
                    </div>
                    <div className="w-5 h-2.5 border-b-[3.5px] border-[#78350f] rounded-b-full mt-0.5 bg-[#ea580c]" />
                  </div>
                )}
              </div>
            </motion.div>

            <div className={`absolute -bottom-1 w-32 h-3 rounded-full blur-[2px] transition-colors duration-1000 ${
              isLightOn ? 'bg-[#fef3c7]' : 'bg-[#09090b]'
            }`} />
          </div>

          <AnimatePresence>
            {isLightOn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-[240px] md:top-[304px] w-[600px] h-[600px] origin-top z-0 pointer-events-none mix-blend-screen"
                style={{
                  background: 'linear-gradient(to bottom, rgba(252, 211, 77, 0.35) 0%, rgba(252, 211, 77, 0) 100%)',
                  clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0% 100%)'
                }}
              />
            )}
          </AnimatePresence>

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 60 }}
            dragElastic={0.2}
            dragSnapToOrigin={true}
            onDragEnd={(e, info) => {
              if (info.offset.y > 35) setIsLightOn((prev) => !prev);
            }}
            className="relative flex flex-col items-center cursor-grab active:cursor-grabbing z-20 pt-1"
          >
            <div className={`w-[2.5px] h-16 transition-colors duration-1000 ${isLightOn ? 'bg-[#fde68a]' : 'bg-[#27272a]'}`} />
            <div className={`w-4 h-4 rounded-full shadow-lg border-2 transition-colors duration-1000 ${
              isLightOn ? 'bg-[#fef3c7] border-[#d97706]' : 'bg-[#18181b] border-[#27272a]'
            }`} />
            <AnimatePresence>
              {!isLightOn && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute top-24 text-[10px] font-black text-zinc-500 tracking-[0.2em] whitespace-nowrap"
                >
                  PULL THE CORD
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* RIGHT SIDE: PANDA & FORM                             */}
        {/* ---------------------------------------------------- */}
        <motion.div
          className="relative w-full max-w-[400px] z-10"
          initial={false}
          animate={{
            opacity: isLightOn ? 1 : 0.08,
            scale: isLightOn ? 1 : 0.95,
            filter: isLightOn ? 'blur(0px)' : 'blur(2px)'
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Panda Avatar */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[120px] h-[100px] z-20 pointer-events-none"
          >
            {/* Ears */}
            <div className="absolute top-2 -left-2 w-11 h-11 rounded-full bg-[#18181b] shadow-inner" />
            <div className="absolute top-2 -right-2 w-11 h-11 rounded-full bg-[#18181b] shadow-inner" />

            {/* Head */}
            <div className="absolute inset-0 rounded-[45%] bg-[#f8fafc] border-[3px] border-[#e2e8f0] shadow-xl overflow-hidden">

              {/* Left Eye */}
              <div className="absolute top-10 left-3 w-[32px] h-[42px] rounded-full -rotate-12 bg-[#18181b] shadow-inner flex items-center justify-center overflow-hidden">
                <div className="w-[16px] h-[16px] bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <motion.div
                    style={{ x: isPasswordFocused ? 0 : pupilX, y: isPasswordFocused ? 5 : pupilY }}
                    className="w-2.5 h-2.5 bg-[#0f172a] rounded-full"
                  />
                </div>
                {/* Closing eyelid on password focus */}
                <motion.div
                  initial={false}
                  animate={{ height: isPasswordFocused ? '100%' : '0%' }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute top-0 left-0 w-full bg-[#18181b]"
                />
              </div>

              {/* Right Eye */}
              <div className="absolute top-10 right-3 w-[32px] h-[42px] rounded-full rotate-12 bg-[#18181b] shadow-inner flex items-center justify-center overflow-hidden">
                <div className="w-[16px] h-[16px] bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <motion.div
                    style={{ x: isPasswordFocused ? 0 : pupilX, y: isPasswordFocused ? 5 : pupilY }}
                    className="w-2.5 h-2.5 bg-[#0f172a] rounded-full"
                  />
                </div>
                {/* Closing eyelid on password focus */}
                <motion.div
                  initial={false}
                  animate={{ height: isPasswordFocused ? '100%' : '0%' }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute top-0 left-0 w-full bg-[#18181b]"
                />
              </div>

              {/* Blinking Animation Overlay */}
              <motion.div
                animate={{ scaleY: [1, 1, 0, 1, 1] }}
                transition={{ repeat: Infinity, duration: 5, times: [0, 0.48, 0.5, 0.52, 1] }}
                className="absolute inset-0 bg-[#f8fafc] origin-top mix-blend-color z-10"
              />

              {/* Blush */}
              <div className="absolute top-[64px] left-1 w-5 h-2.5 bg-pink-400/40 rounded-full blur-[2px]" />
              <div className="absolute top-[64px] right-1 w-5 h-2.5 bg-pink-400/40 rounded-full blur-[2px]" />

              {/* Nose & Mouth */}
              <div className="absolute top-[66px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-3.5 h-2 bg-[#0f172a] rounded-full" />
                <div className="w-4 h-2 border-b-[2px] border-[#0f172a] rounded-b-full mt-px" />
              </div>
            </div>

            {/* Paws (Covering Eyes) */}
            <div className="absolute -bottom-2 left-0 w-full flex justify-center gap-5 z-30">
              <motion.div
                initial={false}
                animate={{
                  y: isPasswordFocused ? (showPassword ? -55 : -75) : 30,
                  rotate: isPasswordFocused ? (showPassword ? -10 : 15) : 0,
                  scale: isPasswordFocused ? 1 : 0.8
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="w-11 h-16 rounded-full bg-[#18181b] shadow-2xl relative flex justify-center border border-[#27272a]"
              >
                <div className="absolute top-2 flex gap-1 px-1">
                  <div className="w-2 h-3 bg-[#3f3f46] rounded-full opacity-90" />
                  <div className="w-2 h-3 bg-[#3f3f46] rounded-full opacity-90 -mt-1" />
                  <div className="w-2 h-3 bg-[#3f3f46] rounded-full opacity-90" />
                </div>
                <div className="absolute top-7 w-[22px] h-5 bg-[#3f3f46] rounded-[50%] opacity-90" />
              </motion.div>

              <motion.div
                initial={false}
                animate={{
                  y: isPasswordFocused ? -75 : 30,
                  rotate: isPasswordFocused ? -15 : 0,
                  scale: isPasswordFocused ? 1 : 0.8
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="w-11 h-16 rounded-full bg-[#18181b] shadow-2xl relative flex justify-center border border-[#27272a]"
              >
                <div className="absolute top-2 flex gap-1 px-1">
                  <div className="w-2 h-3 bg-[#3f3f46] rounded-full opacity-90" />
                  <div className="w-2 h-3 bg-[#3f3f46] rounded-full opacity-90 -mt-1" />
                  <div className="w-2 h-3 bg-[#3f3f46] rounded-full opacity-90" />
                </div>
                <div className="absolute top-7 w-[22px] h-5 bg-[#3f3f46] rounded-[50%] opacity-90" />
              </motion.div>
            </div>
          </motion.div>

          {/* Glass Form Card */}
          <motion.div
            layout
            className="w-full bg-[#131916]/90 backdrop-blur-xl border border-[#1f2924] rounded-[32px] p-8 pt-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="text-center mb-6">
              <h2 className="text-[28px] font-black text-[#10b981] tracking-tight">Bamboo</h2>
              <p className="text-[11px] text-[#9ca3af] font-medium mt-1">
                {authMode === 'login' ? "Welcome back. Your panda's keeping watch." : "Create an account. We'll keep it safe."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {authMode === 'register' && (
                  <motion.div key="name" variants={formItem} initial="hidden" animate="visible" exit="hidden" className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider pl-1">Name</label>
                    <div className="flex items-center px-4 py-3 rounded-xl bg-[#090b0a] border border-[#1f2924] focus-within:border-[#10b981] transition-colors shadow-inner">
                      <UserIcon className="mr-3 text-[#52525b]" />
                      <input type="text" required placeholder="John Doe" onFocus={() => setIsPasswordFocused(false)} className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-[#3f3f46]" />
                    </div>
                  </motion.div>
                )}

                {authMode === 'register' && (
                  <motion.div key="email" variants={formItem} initial="hidden" animate="visible" exit="hidden" className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider pl-1">Email</label>
                    <div className="flex items-center px-4 py-3 rounded-xl bg-[#090b0a] border border-[#1f2924] focus-within:border-[#10b981] transition-colors shadow-inner">
                      <MailIcon className="mr-3 text-[#52525b]" />
                      <input type="email" required placeholder="you@example.com" onFocus={() => setIsPasswordFocused(false)} className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-[#3f3f46]" />
                    </div>
                  </motion.div>
                )}

                <motion.div key="username" variants={formItem} initial="hidden" animate="visible" exit="hidden" className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider pl-1">Username</label>
                  <div className="flex items-center px-4 py-3 rounded-xl bg-[#090b0a] border border-[#1f2924] focus-within:border-[#10b981] transition-colors shadow-inner">
                    <UserIcon className="mr-3 text-[#52525b]" />
                    <input type="text" required placeholder="pandalovers" onFocus={() => setIsPasswordFocused(false)} className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-[#3f3f46]" />
                  </div>
                </motion.div>

                <motion.div key="password" variants={formItem} initial="hidden" animate="visible" exit="hidden" className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider pl-1">Password</label>
                  <div className="flex items-center px-4 py-3 rounded-xl bg-[#090b0a] border border-[#1f2924] focus-within:border-[#10b981] transition-colors shadow-inner">
                    <LockIcon className="mr-3 text-[#52525b]" />
                    <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-[#3f3f46] tracking-[0.2em]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-[#52525b] hover:text-[#10b981] transition-colors focus:outline-none">
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </motion.div>

                {authMode === 'register' && (
                  <motion.div key="confirm" variants={formItem} initial="hidden" animate="visible" exit="hidden" className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider pl-1">Confirm Password</label>
                    <div className="flex items-center px-4 py-3 rounded-xl bg-[#090b0a] border border-[#1f2924] focus-within:border-[#10b981] transition-colors shadow-inner">
                      <LockIcon className="mr-3 text-[#52525b]" />
                      <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-[#3f3f46] tracking-[0.2em]" />
                    </div>
                  </motion.div>
                )}

                {authMode === 'login' && (
                  <motion.div key="options" variants={formItem} initial="hidden" animate="visible" exit="hidden" className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-3.5 h-3.5 border-[1.5px] border-[#52525b] rounded-sm checked:bg-[#10b981] checked:border-[#10b981] cursor-pointer transition-colors" />
                        <svg className="absolute w-2.5 h-2.5 text-[#070908] pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-[11px] font-medium text-[#9ca3af] group-hover:text-white transition-colors">Remember me</span>
                    </label>
                    <a href="#" className="text-[11px] font-medium text-[#9ca3af] hover:text-[#10b981] transition-colors">Forgot password?</a>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitState !== 'idle'}
                  className="w-full relative h-[52px] flex items-center justify-between px-6 bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 transition-all rounded-xl group shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-hidden cursor-pointer disabled:opacity-90 disabled:cursor-default"
                >
                  <span className="text-[#022c22] font-extrabold text-sm tracking-wide z-10 relative">
                    {submitState === 'success' ? "Success!" : submitState === 'loading' ? "Please wait..." : authMode === 'login' ? "Sign in" : "Create account"}
                  </span>

                  <div className="relative w-7 h-8 border-[1.5px] border-[#022c22]/40 rounded-sm flex items-end justify-start overflow-hidden bg-[#064e3b]">
                    <div className="absolute inset-0 bg-[#fde047] opacity-0 shadow-[0_0_15px_#fde047] transition-opacity duration-300" style={{ opacity: submitState === 'walking' ? 1 : 0 }} />
                    <motion.div
                      initial={false}
                      animate={{ rotateY: submitState === 'walking' ? -95 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 bg-[#059669] border-r-[1.5px] border-[#022c22]/40 origin-left z-20 flex items-center justify-end"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="w-[2px] h-[6px] bg-[#022c22]/60 rounded-full mr-1" />
                    </motion.div>
                    <motion.div
                      initial={false}
                      animate={{
                        x: submitState === 'walking' ? 20 : 0,
                        scale: submitState === 'walking' ? 0.6 : 1,
                        opacity: submitState === 'walking' ? 0 : 1
                      }}
                      transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                      className="relative z-10 text-[#022c22] ml-1.5 mb-1"
                    >
                      {authMode === 'login' ? <StickFigure /> : <GiftIcon />}
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {submitState === 'loading' && (
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: "100%" }} exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-[#fef08a]"
                      />
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-[#1f2924] text-center">
              <p className="text-[11px] text-[#9ca3af]">
                {authMode === 'login' ? "New to Bamboo?" : "Already have an account?"}{' '}
                <button onClick={toggleAuthMode} disabled={submitState !== 'idle'} className="font-bold text-[#10b981] hover:text-[#34d399] transition-colors focus:outline-none">
                  {authMode === 'login' ? "Create account" : "Sign in"}
                </button>
              </p>
            </div>

          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}