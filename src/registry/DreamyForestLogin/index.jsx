import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

// --- INLINE SVG ASSETS ---
const Icons = {
  User: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Lock: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Eye: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  EyeOff: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  ),
  Google: (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
  Apple: (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.45 3.09.45.71 0 2.04-.43 3.44-.4 1.73.04 3.02.68 3.75 1.7-3.18 1.93-2.61 6.18.52 7.33-.76 1.76-1.74 3.12-2.8 3.89zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  ),
  Leaf: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 12c0 0 2-8.5 9.5-9.5 0 0 1 8.5-7.5 10-1.5.25-2-.5-2-.5z" />
      <path d="M12 2.5c0 0 8.5 2 9.5 9.5 0 0-8.5 1-10-7.5-.25-1.5.5-2 .5-2z" />
    </svg>
  ),
};

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

// --- BACKGROUND COMPONENTS ---
const Fireflies = () => {
  const [fireflies, setFireflies] = useState([]);
  useEffect(() => {
    const generateFireflies = () => {
      return Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }));
    };
    setFireflies(generateFireflies());
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {fireflies.map((ff) => (
        <motion.div
          key={ff.id}
          className="absolute rounded-full bg-yellow-300 shadow-[0_0_10px_2px_rgba(253,224,71,0.8)]"
          style={{ width: ff.size, height: ff.size, top: ff.top, left: ff.left }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: ff.duration,
            repeat: Infinity,
            delay: ff.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const FloatingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  useEffect(() => {
    const generateLeaves = () => {
      return Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 15 + 10,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 10,
        rotation: Math.random() * 360,
      }));
    };
    setLeaves(generateLeaves());
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-green-900/30"
          style={{ left: leaf.left, width: leaf.size, height: leaf.size }}
          initial={{ y: "-10vh", rotate: leaf.rotation, opacity: 0 }}
          animate={{
            y: "110vh",
            x: ["-5vw", "5vw", "-5vw"],
            rotate: leaf.rotation + 360,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            y: { duration: leaf.duration, repeat: Infinity, ease: "linear", delay: leaf.delay },
            x: { duration: leaf.duration / 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: leaf.duration, repeat: Infinity, ease: "linear" },
            opacity: { duration: leaf.duration, repeat: Infinity, ease: "linear" },
          }}
        >
          <Icons.Leaf className="w-full h-full drop-shadow-lg" />
        </motion.div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DreamyForestLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 75, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-4deg", "4deg"]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["-100%", "200%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["-100%", "200%"]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - left) / width - 0.5;
    const yPct = (e.clientY - top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a1610]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Procedural Forest Background (No external images) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Deep base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1f3d2a_0%,#0a1610_80%)]" />

        {/* Volumetric Light Rays (Bloom) */}
        <motion.div
          animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] left-[20%] w-[80vw] h-[80vw] bg-[radial-gradient(circle,rgba(134,239,172,0.15)_0%,transparent_60%)] blur-[100px] rounded-full mix-blend-screen"
        />
        
        {/* Secondary Light source */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(250,250,230,0.1)_0%,transparent_60%)] blur-[100px] rounded-full mix-blend-screen"
        />

        {/* Abstract Fog Layers */}
        <motion.div
          animate={{ x: ["-10%", "10%", "-10%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(200,255,220,0.1)_0%,transparent_70%)] blur-[60px]"
        />
        <motion.div
          animate={{ x: ["5%", "-5%", "5%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-[#0a1610] via-green-950/40 to-transparent blur-[40px]"
        />
      </div>

      <Fireflies />
      <FloatingLeaves />

      {/* 2. Login Card Container */}
      <div className="relative z-30 w-full max-w-[420px] px-6 perspective-[1000px]" ref={containerRef}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-[40px] p-8"
        >
          {/* Glass Background & Borders */}
          <div className="absolute inset-0 rounded-[40px] bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.12] shadow-[0_32px_64px_rgba(0,40,20,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden">
            {/* Animated Glass Glare */}
            <motion.div
              style={{ left: glareX, top: glareY }}
              className="absolute w-[200%] h-[200%] bg-gradient-to-br from-white/[0.1] via-white/[0.02] to-transparent rotate-45 pointer-events-none"
            />
            {/* Fine Noise Texture for Premium Look */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjAxIi8+Cjwvc3ZnPg==')]" />
          </div>

          {/* Form Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="relative z-10 flex flex-col gap-6"
            style={{ transform: "translateZ(30px)" }} // 3D push forward
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="text-center mb-2">
              <h1 className="text-3xl font-semibold text-white tracking-tight mb-2 drop-shadow-md">
                Welcome back
              </h1>
              <p className="text-white/60 text-sm font-medium">
                Step into the magical realm
              </p>
            </motion.div>

            {/* Inputs */}
            <motion.div variants={fadeUp} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-purple-400 transition-colors">
                  <Icons.User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Username or Email"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-black/30 transition-all duration-300 backdrop-blur-md shadow-inner"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-purple-400 transition-colors">
                  <Icons.Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-black/30 transition-all duration-300 backdrop-blur-md shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <Icons.EyeOff className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Options */}
            <motion.div variants={fadeUp} className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-5 h-5 rounded-md border border-white/20 bg-black/20 flex items-center justify-center group-hover:border-purple-400/50 transition-colors">
                  <input type="checkbox" className="peer sr-only" />
                  <motion.svg
                    className="w-3 h-3 text-purple-400 opacity-0 peer-checked:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                </div>
                <span className="text-white/70 select-none group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-white/70 hover:text-purple-400 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-purple-400 after:transition-transform after:duration-300">
                Forgot password?
              </a>
            </motion.div>

            {/* Primary Button */}
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-[length:200%_auto] p-[1px] group overflow-hidden shadow-[0_8px_20px_rgba(139,92,246,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 animate-[gradient_3s_linear_infinite]" />
              <div className="relative w-full h-full bg-black/10 rounded-2xl py-3.5 flex items-center justify-center backdrop-blur-sm transition-colors group-hover:bg-transparent">
                <span className="font-semibold text-white tracking-wide">Sign In</span>
              </div>
            </motion.button>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 my-2">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-white/40 text-xs font-medium uppercase tracking-wider">or continue with</span>
              <div className="h-px bg-white/10 flex-1" />
            </motion.div>

            {/* Social Buttons */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 font-medium transition-all backdrop-blur-md"
              >
                <Icons.Google className="w-5 h-5" />
                Google
              </motion.button>
              <motion.button
                whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 font-medium transition-all backdrop-blur-md"
              >
                <Icons.Apple className="w-5 h-5" />
                Apple
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.div variants={fadeUp} className="text-center mt-4">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <a href="#" className="text-white font-medium hover:text-purple-400 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-purple-400 after:transition-transform after:duration-300">
                  Create account
                </a>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Global styles for background animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />
    </div>
  );
}