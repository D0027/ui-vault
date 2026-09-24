export const origamiShoppingBagCode = `import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const SPARKS = Array.from({ length: 16 }).map((_, i) => ({
  id: \`spark-\${i}\`,
  angle: (i * 360) / 16,
  distance: Math.random() * 40 + 40,
  size: Math.random() * 3 + 2,
}));

const BUTTERFLIES = Array.from({ length: 8 }).map((_, i) => ({
  id: \`bf-\${i}\`,
  x: Math.random() * 100 - 50,
  y: -Math.random() * 100 - 50,
  delay: Math.random() * 0.5,
  rotation: Math.random() * 360,
}));

export default function QuantumOrigamiButton() {
  const [step, setStep] = useState(0);
  const buttonRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (step !== 0 || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.2);
    mouseY.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    if (step !== 0) return;
    mouseX.set(0);
    mouseY.set(0);
    
    setStep(1);
    setTimeout(() => setStep(2), 700);  
    setTimeout(() => setStep(3), 1600); 
    setTimeout(() => setStep(4), 2500); 
    setTimeout(() => setStep(5), 3600); 
    
    setTimeout(() => setStep(0), 7500); 
  };

  return (
    <div className="relative flex items-center justify-center min-h-[600px] w-full bg-[#FAFAFA] font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.01)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: magneticX, y: magneticY }}
        className="relative z-10 flex items-center justify-center"
      >
        <motion.button
          onClick={handleClick}
          layout
          initial={false}
          animate={{
            width: step === 0 || step === 5 ? 260 : 160,
            height: step === 0 || step === 5 ? 72 : 160,
            borderRadius: step === 0 || step === 5 ? 36 : 16,
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
          whileHover={{ scale: step === 0 ? 1.02 : 1 }}
          whileTap={{ scale: step === 0 ? 0.98 : 1 }}
          className={\`relative flex items-center justify-center p-0 bg-white group will-change-transform outline-none overflow-visible \${
            step === 5 
              ? "shadow-[0_20px_60px_rgba(34,197,94,0.2)]" 
              : "shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
          }\`}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <motion.div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden z-20">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg]"
            />
          </motion.div>

          <AnimatePresence>
            {step === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute -inset-[1px] rounded-[inherit] z-[-1] overflow-hidden opacity-50 mask-image-gradient"
                style={{
                  background: "conic-gradient(from 0deg, transparent, rgba(0,0,0,0.1), transparent)",
                  WebkitMaskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                }}
              >
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(0,0,0,0.2)_50%,transparent_100%)]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex items-center justify-center w-full h-full z-10">
            <motion.div 
              layout
              className="absolute flex items-center justify-center pointer-events-none"
              animate={{
                x: step === 0 || step === 5 ? -80 : 0,
                scale: step === 0 || step === 5 ? 0.4 : 1,
              }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
            >
              <motion.div
                animate={{ 
                  y: step === 3 ? [0, 15, -5, 0] : 0, 
                  scaleY: step === 3 ? [1, 0.85, 1.05, 1] : 1 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.2 }}
                className="relative w-[120px] h-[120px] overflow-visible"
              >
                <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible drop-shadow-xl">
                  <motion.path
                    d="M 40 45 V 25 C 40 10 80 10 80 25 V 45"
                    fill="none" stroke={step === 5 ? "#22C55E" : "#111"} strokeWidth="4" strokeLinecap="round"
                    initial={false}
                    animate={{ pathLength: step >= 1 && step <= 4 ? 0 : 1, opacity: step >= 1 && step <= 4 ? 0 : 1, y: step === 3 ? 5 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  <motion.path
                    d="M 30 45 Q 60 55 90 45 Q 60 35 30 45 Z"
                    fill="#E5E7EB"
                    initial={{ opacity: 0 }} animate={{ opacity: step === 2 || step === 3 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.rect
                    x="45" y="-30" width="30" height="30" rx="4" fill="url(#cubeGradient)"
                    initial={{ opacity: 0, y: -60, scale: 0 }}
                    animate={{ opacity: step === 3 ? [0, 1, 1, 0] : 0, y: step === 3 ? [-60, 25] : -60, scale: step === 3 ? [0, 1.2, 1, 0.8] : 0, rotate: step === 3 ? [0, 180] : 0 }}
                    transition={{ duration: 0.6, ease: "easeIn" }}
                  />
                  <defs>
                    <linearGradient id="cubeGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#111" />
                      <stop offset="100%" stopColor="#444" />
                    </linearGradient>
                  </defs>

                  <motion.path
                    initial={false}
                    animate={{
                      d: step === 1 ? "M 10 10 L 110 10 L 110 110 L 10 110 Z" : "M 30 45 L 90 45 L 85 105 C 85 110 80 115 60 115 C 40 115 35 110 35 105 Z",
                      fill: step === 1 ? "#FFFFFF" : (step >= 2 ? "#FAFAFA" : "transparent"),
                      stroke: step === 5 ? "#22C55E" : (step >= 1 && step <= 4 ? "#E5E7EB" : "#111"),
                      strokeWidth: step === 0 || step === 5 ? 6 : 2,
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />

                  <motion.path
                    d="M 30 45 L 60 115 M 90 45 L 60 115 M 30 45 L 60 75 L 90 45"
                    fill="none" stroke="#E5E7EB" strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: step >= 2 && step <= 4 ? 1 : 0, opacity: step >= 2 && step <= 4 ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />

                  <motion.path
                    d="M 30 45 L 60 70 L 90 45 Z"
                    fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" style={{ transformOrigin: "60px 45px" }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: step >= 4 ? 1 : 0, opacity: step >= 4 ? 1 : 0 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                  />

                  <motion.g
                    stroke="#111" strokeWidth="6" strokeLinecap="square"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: step >= 4 ? 1 : 0, opacity: step >= 4 ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: step === 4 ? 0.3 : 0, ease: "easeOut" }}
                  >
                    <motion.path d="M 60 45 V 115" />
                    <motion.path d="M 33 80 H 87" />
                  </motion.g>

                  <motion.circle
                    cx="60" cy="80" r="16" fill="#D4AF37" style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.2))" }}
                    initial={{ scale: 0 }} animate={{ scale: step >= 4 ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: step === 4 ? 0.7 : 0 }}
                  />

                  <motion.path
                    d="M 53 80 L 58 85 L 68 73"
                    fill="none" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: step >= 5 ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: step === 5 ? 0.2 : 0 }}
                  />
                </svg>

                <div className="absolute top-[80px] left-[60px] pointer-events-none z-50">
                  <AnimatePresence>
                    {step === 4 && SPARKS.map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                        animate={{ x: Math.cos((c.angle * Math.PI) / 180) * c.distance, y: Math.sin((c.angle * Math.PI) / 180) * c.distance, opacity: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                        className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[0.5px]"
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            <div className="absolute left-[90px] right-0 flex items-center justify-start pointer-events-none">
              <AnimatePresence mode="popLayout">
                {step === 0 && (
                  <motion.span
                    key="idle-text"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.4 }}
                    className="text-[#111] font-semibold text-lg tracking-wide"
                  >
                    Add to Bag
                  </motion.span>
                )}
                {step === 5 && (
                  <motion.span
                    key="success-text"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-[#22C55E] font-semibold text-lg tracking-wide whitespace-nowrap drop-shadow-sm"
                  >
                    Added Successfully
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <AnimatePresence>
                {step === 5 && BUTTERFLIES.map((bf) => (
                  <motion.div
                    key={bf.id}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotateX: 0, rotateY: 0 }}
                    animate={{ opacity: [0, 1, 0], x: bf.x, y: bf.y, scale: [0, 1, 0.5], rotateX: 360, rotateY: 360, rotateZ: bf.rotation }}
                    transition={{ duration: 2.5, ease: "easeOut", delay: bf.delay }}
                    className="absolute w-3 h-3 bg-white shadow-sm border border-black/5"
                    style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                  />
                ))}
              </AnimatePresence>
            </div>

          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
`;