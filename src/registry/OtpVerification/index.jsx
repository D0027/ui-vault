import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumOTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  // Countdown timer logic
  useEffect(() => {
    let interval;
    if (timer > 0 && status === "idle") {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer, status]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are typed
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when complete
    if (newOtp.every((digit) => digit !== "")) {
      verifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, 3);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === 4) {
      verifyOTP(pastedData);
    }
  };

  const verifyOTP = (code) => {
    setStatus("loading");
    // Simulate API Call
    setTimeout(() => {
      if (code === "0000") {
        // Demo error state if user enters 0000
        setStatus("error");
        setTimeout(() => {
          setStatus("idle");
          setOtp(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }, 1500);
      } else {
        setStatus("success");
      }
    }, 1200);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      setOtp(["", "", "", ""]);
      setStatus("idle");
      inputRefs.current[0]?.focus();
    }
  };

  // --- Animation Variants ---
  const containerVars = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25, staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const shakeAnimation = status === "error" ? { x: [-10, 10, -10, 10, -5, 5, 0], transition: { duration: 0.4 } } : {};

  return (
    <div className="flex items-center justify-center min-h-[700px] w-full bg-[#080808] font-sans overflow-hidden p-4">
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ 
            opacity: status === "success" ? 0.15 : 0,
            scale: status === "success" ? 1.5 : 1,
            backgroundColor: status === "success" ? "#22C55E" : "#FF6B35"
          }}
          transition={{ duration: 1 }}
          className="w-96 h-96 blur-[100px] rounded-full transition-colors duration-700"
        />
      </div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        layout
        className={`relative w-full max-w-[380px] bg-[#151515] rounded-[36px] shadow-2xl p-8 backdrop-blur-xl border transition-colors duration-500 ${
          status === "success" ? "border-[#22C55E]/20" : status === "error" ? "border-[#EF4444]/30" : "border-white/[0.08]"
        }`}
        style={{
          boxShadow: status === "success" ? "0 20px 40px rgba(34, 197, 94, 0.1)" : "0 20px 40px rgba(0,0,0,0.5)"
        }}
      >
        {/* Hardware speaker cutout detail */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10 shadow-inner" />

        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div key="form" exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }} transition={{ duration: 0.3 }}>
              
              <motion.div variants={itemVars}>
                <h1 className="text-[32px] font-bold text-white tracking-tight leading-tight mb-3">
                  Let's verify<br/>your number
                </h1>
                <p className="text-[16px] text-[#A1A1AA] font-medium leading-relaxed mb-10">
                  We've sent a 4-digit code to your phone.<br/>It'll auto verify once entered.
                </p>
              </motion.div>

              <motion.div variants={itemVars} animate={shakeAnimation} className="flex justify-between gap-3 mb-10 relative">
                
                {/* Error message overlay */}
                <AnimatePresence>
                  {status === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: -30 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-0 right-0 text-center text-[#EF4444] text-sm font-semibold"
                    >
                      Invalid code. Try again.
                    </motion.div>
                  )}
                </AnimatePresence>

                {otp.map((digit, index) => (
                  <motion.div key={index} className="relative group">
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      disabled={status === "loading" || status === "success"}
                      className={`w-[68px] h-[76px] rounded-[24px] bg-black/50 text-center text-[28px] font-bold text-white outline-none transition-all duration-300 backdrop-blur-sm border-2
                        ${status === "error" ? "border-[#EF4444]/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-[#EF4444]" : "border-white/[0.08] focus:border-[#FF6B35] focus:shadow-[0_0_20px_rgba(255,107,53,0.25)]"}
                        ${status === "loading" ? "opacity-50" : ""}
                      `}
                    />
                    
                    {/* Animated Loading Ring per input (simulated processing) */}
                    {status === "loading" && (
                      <motion.div 
                        className="absolute inset-0 border-2 border-[#FF6B35] rounded-[24px]"
                        style={{ borderTopColor: "transparent" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: index * 0.1 }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={itemVars} className="text-center">
                <p className="text-[15px] font-semibold text-[#A1A1AA]">
                  Didn't receive the code?{" "}
                  <button 
                    onClick={handleResend}
                    disabled={timer > 0 || status === "loading"}
                    className={`transition-colors duration-300 ml-1 relative group ${
                      timer === 0 ? "text-[#FF6B35] hover:text-white" : "text-[#555] cursor-not-allowed"
                    }`}
                  >
                    Resend {timer > 0 && `(${timer}s)`}
                    
                    {/* Hover Underline */}
                    {timer === 0 && (
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                    )}
                  </button>
                </p>
              </motion.div>
            </motion.div>
          ) : (
            
            /* --- SUCCESS STATE --- */
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="relative w-24 h-24 mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="absolute inset-0 bg-[#22C55E]/10 rounded-full"
                />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  className="absolute inset-2 bg-[#22C55E]/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                >
                  <svg className="w-10 h-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </motion.div>
              </div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[24px] font-bold text-white mb-2"
              >
                Verified successfully
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[15px] font-medium text-[#A1A1AA] text-center"
              >
                Your phone number has been secured.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}