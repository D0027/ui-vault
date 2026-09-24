import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMATED PANDA MASCOT ---
function PandaMascot({ eyesCovered }) {
  return (
    <motion.svg 
      viewBox="0 0 120 120" 
      className="w-24 h-24 drop-shadow-lg mx-auto"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="26" cy="26" r="16" fill="#1f1f24" />
      <circle cx="94" cy="26" r="16" fill="#1f1f24" />
      <circle cx="26" cy="26" r="8" fill="#3a3a42" />
      <circle cx="94" cy="26" r="8" fill="#3a3a42" />
      <circle cx="60" cy="62" r="46" fill="#ffffff" />
      <ellipse cx="40" cy="58" rx="14" ry="17" fill="#1f1f24" />
      <ellipse cx="80" cy="58" rx="14" ry="17" fill="#1f1f24" />

      <AnimatePresence mode="wait">
        {!eyesCovered ? (
          <motion.g
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <circle cx="40" cy="59" r="5" fill="#fff" />
            <circle cx="80" cy="59" r="5" fill="#fff" />
            <circle cx="41" cy="60" r="2.4" fill="#1f1f24" />
            <circle cx="81" cy="60" r="2.4" fill="#1f1f24" />
          </motion.g>
        ) : (
          <motion.g
            key="covered"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ellipse cx="40" cy="60" rx="15" ry="11" fill="#fdfdfd" stroke="#e2e2e8" strokeWidth="1.5" />
            <ellipse cx="80" cy="60" rx="15" ry="11" fill="#fdfdfd" stroke="#e2e2e8" strokeWidth="1.5" />
            <ellipse cx="40" cy="60" rx="5.5" ry="4" fill="#f1f1f4" />
            <ellipse cx="80" cy="60" rx="5.5" ry="4" fill="#f1f1f4" />
          </motion.g>
        )}
      </AnimatePresence>

      <ellipse cx="60" cy="80" rx="6" ry="4" fill="#1f1f24" />
      <path d="M60 84 Q60 90 52 92" stroke="#1f1f24" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M60 84 Q60 90 68 92" stroke="#1f1f24" strokeWidth="2" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

const STARS = Array.from({ length: 25 }).map((_, i) => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  size: Math.random() * 3 + 1,
}));

export default function PremiumLogin() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const eyesCovered = passwordFocused && !showPassword;

  // Staggered Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
    setTimeout(() => setStatus("idle"), 3500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative flex items-center justify-center min-h-[800px] w-full bg-gradient-to-br from-[#6C2BFF] to-[#A100FF] overflow-hidden p-4 sm:p-8 font-sans"
    >
      {/* Floating Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay, opacity: 0.4 }}
          />
        ))}
      </div>

      {/* Main Organic Blob Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="relative w-full max-w-[1000px] h-auto md:h-[650px] bg-white rounded-[40px] shadow-2xl shadow-[#3c1299]/50 overflow-hidden flex flex-col md:flex-row z-20"
      >
        {/* Organic SVG waves for top/bottom edge detailing */}
        <svg className="absolute -top-[50px] left-0 w-full h-[80px] z-10 hidden md:block" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 C150,120 250,20 400,50 C550,80 650,-20 800,20 C950,60 1050,120 1200,120 Z" fill="#ffffff" />
        </svg>

        {/* --- LEFT / RIGHT SLIDING LOGIC FOR DESKTOP --- */}
        {/* We use Flex-direction on mobile, and absolute positioning on desktop to slide */}

        {/* Sliding Form Panel */}
        <motion.div
          layout
          initial={false}
          animate={{ left: isSignIn ? "0%" : "50%" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="w-full md:absolute md:top-0 md:bottom-0 md:w-1/2 bg-white flex flex-col justify-center px-8 py-12 md:px-16 z-30 order-2 md:order-none"
        >
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignIn ? "signin" : "signup"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleAuth}
              className="flex flex-col items-center w-full"
            >
              <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
                {isSignIn ? "Hello!" : "Create Account"}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-sm text-gray-500 font-medium mb-8">
                {isSignIn ? "Sign in to your account" : "Register to get started"}
              </motion.p>

              <motion.div variants={itemVariants} className="mb-8 w-full">
                <PandaMascot eyesCovered={eyesCovered} />
              </motion.div>

              <div className="w-full space-y-4">
                {!isSignIn && (
                  <motion.div variants={itemVariants} className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-[#8e2de2]/20 focus-within:border-[#8e2de2] transition-all shadow-inner shadow-gray-100">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <input type="text" placeholder="Full Name" required className="bg-transparent w-full ml-3 outline-none text-sm text-gray-800 font-semibold placeholder-gray-400" />
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-[#8e2de2]/20 focus-within:border-[#8e2de2] transition-all shadow-inner shadow-gray-100">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input type="email" placeholder="Email Address" required className="bg-transparent w-full ml-3 outline-none text-sm text-gray-800 font-semibold placeholder-gray-400" />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-[#8e2de2]/20 focus-within:border-[#8e2de2] transition-all shadow-inner shadow-gray-100">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    required
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="bg-transparent w-full ml-3 outline-none text-sm text-gray-800 font-semibold placeholder-gray-400" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-[#8e2de2] transition-colors focus:outline-none">
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </motion.div>
              </div>

              {isSignIn && (
                <motion.div variants={itemVariants} className="w-full flex justify-between items-center mt-5 mb-8 px-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#8e2de2] focus:ring-[#8e2de2] accent-[#8e2de2]" />
                    <span className="text-sm text-gray-500 font-semibold group-hover:text-gray-700 transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-gray-400 hover:text-[#8e2de2] font-bold transition-colors">Forgot password?</button>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="w-full mt-4">
                <motion.button
                  whileHover={{ scale: status === "idle" ? 1.03 : 1 }}
                  whileTap={{ scale: status === "idle" ? 0.97 : 1 }}
                  type="submit"
                  className="relative w-full h-[56px] bg-gradient-to-r from-[#6C2BFF] to-[#A100FF] text-white font-extrabold text-sm tracking-wide rounded-full shadow-xl shadow-[#8e2de2]/30 flex items-center justify-center overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {status === "idle" && (
                      <motion.span key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {isSignIn ? "SIGN IN" : "SIGN UP"}
                      </motion.span>
                    )}
                    {status === "loading" && (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </motion.span>
                    )}
                    {status === "success" && (
                      <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Subtle shine sweep on hover */}
                  <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                </motion.button>
              </motion.div>

              <motion.p variants={itemVariants} className="text-sm text-gray-500 font-semibold mt-8">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => setIsSignIn(!isSignIn)} className="text-[#8e2de2] font-extrabold hover:underline transition-all">
                  {isSignIn ? "Create" : "Sign in"}
                </button>
              </motion.p>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Sliding Text Panel (Right Side Desktop) */}
        <motion.div
          layout
          initial={false}
          animate={{ left: isSignIn ? "50%" : "0%" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="hidden md:flex md:absolute md:top-0 md:bottom-0 md:w-1/2 bg-gray-50/50 flex-col items-center justify-center px-16 text-center z-20 overflow-hidden"
        >
          {/* Decorative blurred background shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#8e2de2]/10 rounded-full blur-3xl pointer-events-none"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignIn ? "signin-text" : "signup-text"}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }}
              className="relative z-10"
            >
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {isSignIn ? "Welcome Back!" : "Hello Friend!"}
              </h2>
              <p className="text-base text-gray-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                {isSignIn 
                  ? "Enter your personal details to access your dashboard and manage your account seamlessly." 
                  : "Start your journey with us today. It only takes a minute to get set up and explore."}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
      </motion.div>
    </motion.div>
  );
}