export const lampLoginCode = `import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Generate random dust particles for Variant 2
const PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: \`\${Math.random() * 100}%\`,
  top: \`\${Math.random() * 100}%\`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 5 + 3,
  delay: Math.random() * 2,
}));

export default function CombinedLampLogin() {
  const [variant, setVariant] = useState(1);

  return (
    <div 
      className="relative w-full min-h-[850px] flex flex-col font-sans transition-colors duration-500 overflow-hidden" 
      style={{ backgroundColor: variant === 1 ? "#050505" : "#090909" }}
    >
      {/* --- UI TOGGLE SWITCH --- */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] flex gap-2 bg-[#151515] p-1.5 rounded-full border border-white/10 shadow-2xl">
        <button
          onClick={() => setVariant(1)}
          className={\`px-6 py-2 rounded-full text-sm font-bold transition-all \${
            variant === 1 ? "bg-white text-black" : "text-neutral-500 hover:text-white"
          }\`}
        >
          Variant 1
        </button>
        <button
          onClick={() => setVariant(2)}
          className={\`px-6 py-2 rounded-full text-sm font-bold transition-all \${
            variant === 2 ? "bg-white text-black" : "text-neutral-500 hover:text-white"
          }\`}
        >
          Variant 2
        </button>
      </div>

      {/* --- RENDER SELECTED VARIANT --- */}
      <AnimatePresence mode="wait">
        {variant === 1 && (
          <motion.div key="v1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 w-full h-full">
            <VariantOne />
          </motion.div>
        )}
        {variant === 2 && (
          <motion.div key="v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 w-full h-full">
            <VariantTwo />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// VARIANT 1: Side-by-Side Drag Cord
// ==========================================
function VariantOne() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[850px] flex flex-col md:flex-row items-center justify-center">
      
      {/* LEFT SIDE: The Massive Lamp */}
      <div className="relative w-full md:w-1/2 h-full flex flex-col items-center justify-start pt-24 md:pt-32 z-20">
        <div className="w-1.5 h-32 md:h-48 bg-neutral-800" />
        
        <div className="w-32 h-10 bg-neutral-900 rounded-t-xl border-b-4 border-neutral-800 relative z-10 flex justify-center">
          <motion.div 
            animate={{ 
              backgroundColor: isOn ? "#fbbf24" : "#262626", 
              boxShadow: isOn ? "0px 10px 40px rgba(251,191,36,0.6)" : "none" 
            }}
            transition={{ duration: 0.2 }}
            className="w-20 h-2.5 absolute -bottom-1.5 rounded-full blur-[2px] will-change-transform"
          />
        </div>

        {/* DRAG CORD */}
        <motion.div 
          className="relative cursor-grab active:cursor-grabbing group flex flex-col items-center -mt-2 z-50 will-change-transform"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.4}
          onDragEnd={(e, info) => {
            if (info.offset.y > 20) {
              setIsOn(!isOn);
            }
          }}
        >
          <div className="w-0.5 h-24 bg-neutral-700 group-hover:bg-neutral-500 transition-colors pointer-events-none" />
          <div className="w-5 h-5 rounded-full bg-neutral-600 group-hover:bg-amber-400 transition-colors shadow-lg pointer-events-none" />
        </motion.div>
        
        <motion.p 
          animate={{ opacity: isOn ? 0 : 1 }}
          className="text-xs text-neutral-600 mt-8 tracking-[0.4em] uppercase font-semibold will-change-opacity"
        >
          Drag down to login
        </motion.p>
        
        {/* LIGHT CONE */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-[320px] md:top-[400px] w-[800px] h-[600px] bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent blur-xl pointer-events-none z-10 will-change-transform"
              style={{ clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0% 100%)" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT SIDE: The Glassmorphic Login Form */}
      <div className="relative w-full md:w-1/2 h-full flex items-center justify-center p-8 z-30 pt-16 md:pt-8">
        <AnimatePresence>
          {isOn && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 120 }}
              className="w-full max-w-md p-10 rounded-3xl bg-neutral-900/80 backdrop-blur-lg border border-neutral-800 shadow-[0_20px_60px_-15px_rgba(251,191,36,0.15)] will-change-transform"
            >
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-neutral-400 text-sm mb-8">Please enter your details to sign in.</p>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                   <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Email</label>
                   <input 
                     type="email" 
                     placeholder="name@example.com" 
                     className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-neutral-800 text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all" 
                   />
                </div>
                
                <div className="flex flex-col gap-1.5">
                   <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold flex justify-between">
                      Password
                      <a href="#" className="text-amber-500/80 hover:text-amber-400 normal-case tracking-normal">Forgot?</a>
                   </label>
                   <input 
                     type="password" 
                     placeholder="••••••••" 
                     className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-neutral-800 text-white placeholder-neutral-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all" 
                   />
                </div>

                <button className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm hover:from-amber-400 hover:to-amber-300 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-95">
                  SIGN IN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// VARIANT 2: Centered Click Lamp with Particles
// ==========================================
function VariantTwo() {
  const [isLightOn, setIsLightOn] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); 

  const toggleLamp = () => {
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 800);
    setIsLightOn(!isLightOn);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
    setTimeout(() => {
      setStatus("idle");
    }, 3000);
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-[850px] h-full w-full">
      
      {/* HANGING LAMP */}
      <motion.div
        className="relative z-50 flex flex-col items-center cursor-pointer origin-top pt-12"
        style={{ transformOrigin: "top center" }}
        animate={ isSwinging ? { rotate: [0, 8, -6, 4, -2, 0] } : { rotate: [-1, 1, -1] } }
        transition={ isSwinging ? { duration: 1.5, ease: "easeOut" } : { duration: 5, repeat: Infinity, ease: "easeInOut" } }
        onClick={toggleLamp}
      >
        <div className="w-[2px] h-[100px] bg-neutral-800 shadow-[inset_1px_0_0_rgba(255,255,255,0.1)]"></div>
        <div className="w-4 h-6 bg-gradient-to-b from-neutral-700 to-neutral-900 rounded-sm shadow-md"></div>
        <div className="w-24 h-12 bg-gradient-to-b from-neutral-800 to-black rounded-t-full relative flex justify-center items-end pb-1 shadow-xl overflow-hidden border-b border-white/5">
           <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-full"></div>
           <motion.div 
              className="w-8 h-4 rounded-b-full shadow-inner"
              animate={{ backgroundColor: isLightOn ? "#FFD66B" : "#222", boxShadow: isLightOn ? "0 4px 20px 5px rgba(255, 214, 107, 0.8)" : "0 0 0 0px rgba(0,0,0,0)" }}
              transition={{ duration: 0.4 }}
           />
        </div>
        <div className="absolute right-6 top-[180px] flex flex-col items-center pointer-events-none">
          <div className="w-[1px] h-12 bg-neutral-600"></div>
          <div className="w-2 h-2 rounded-full bg-neutral-500"></div>
        </div>
      </motion.div>

      {/* VOLUMETRIC LIGHT CONE & PARTICLES */}
      <AnimatePresence>
        {isLightOn && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.5, y: -50 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.8, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-[180px] left-1/2 -translate-x-1/2 w-[800px] h-[750px] pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse at top, rgba(255, 214, 107, 0.15) 0%, rgba(255, 214, 107, 0.02) 40%, transparent 70%)",
              clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
            }}
          >
            {PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute bg-[#FFD66B] rounded-full blur-[1px]"
                style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
                animate={{ y: [0, -100], x: [0, Math.random() * 40 - 20], opacity: [0, 0.6, 0] }}
                transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "linear" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOOR GLOW REFLECTION */}
      <AnimatePresence>
        {isLightOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-[#FFD66B]/5 rounded-[100%] blur-3xl pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* GLASSMORPHISM LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md mt-12 px-4 pb-16">
        <AnimatePresence>
          {isLightOn && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full bg-[rgba(25,25,25,0.65)] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] p-8"
            >
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Welcome Back</h1>
                <p className="text-sm text-[#A1A1AA] font-medium">Sign in to continue</p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div variants={itemVariants} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#A1A1AA] group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-white/20 focus:bg-black/60 transition-all shadow-inner" 
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#A1A1AA] group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    required 
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pl-11 pr-11 text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-white/20 focus:bg-black/60 transition-all shadow-inner" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A1A1AA] hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    )}
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-between items-center text-xs px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-black/40 text-[#A855F7] focus:ring-[#A855F7]/50 accent-[#A855F7]" />
                    <span className="text-[#A1A1AA] group-hover:text-white transition-colors font-medium">Remember me</span>
                  </label>
                  <button type="button" className="text-[#A1A1AA] hover:text-[#A855F7] transition-colors font-medium">Forgot Password?</button>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <motion.button 
                    whileHover={{ scale: status === "idle" ? 1.02 : 1 }} 
                    whileTap={{ scale: status === "idle" ? 0.98 : 1 }} 
                    type="submit" 
                    className="relative w-full h-[50px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center overflow-hidden transition-shadow hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                  >
                    <AnimatePresence mode="wait">
                      {status === "idle" && (
                        <motion.span key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                          Sign In
                        </motion.span>
                      )}
                      {status === "loading" && (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </motion.span>
                      )}
                      {status === "success" && (
                        <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  </motion.button>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center pt-2">
                  <p className="text-xs text-[#A1A1AA] font-medium">
                    Don't have an account? <button type="button" className="text-white hover:text-[#A855F7] font-semibold transition-colors">Sign up</button>
                  </p>
                </motion.div>
                
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
`;