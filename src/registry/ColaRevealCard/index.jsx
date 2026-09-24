import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Flavor Profiles                                                    */
/* ------------------------------------------------------------------ */
const FLAVORS = [
  { 
    id: "original", dot: "#dc2626", theme: "red", label: "ORIGINAL TASTE", price: "2.40", 
    bgGrad: "linear-gradient(135deg, #4a0404 0%, #0a0000 100%)",
    glow: "radial-gradient(circle, rgba(220,38,38,0.5) 0%, transparent 70%)",
    textHighlight: "#ef4444"
  },
  { 
    id: "berry", dot: "#831843", theme: "red", label: "WILD BERRY", price: "2.50", 
    bgGrad: "linear-gradient(135deg, #38081c 0%, #0a0000 100%)",
    glow: "radial-gradient(circle, rgba(157,23,77,0.5) 0%, transparent 70%)",
    textHighlight: "#f43f5e"
  },
  { 
    id: "dark", dot: "#171717", theme: "dark", label: "ZERO SUGAR", price: "2.40", 
    bgGrad: "linear-gradient(135deg, #1f1f1f 0%, #000000 100%)",
    glow: "radial-gradient(circle, rgba(100,100,100,0.4) 0%, transparent 70%)",
    textHighlight: "#a3a3a3"
  },
  { 
    id: "lime", dot: "#22c55e", theme: "green", label: "LIME TWIST", price: "2.60", 
    bgGrad: "linear-gradient(135deg, #062a14 0%, #020a05 100%)",
    glow: "radial-gradient(circle, rgba(34,197,94,0.5) 0%, transparent 70%)",
    textHighlight: "#4ade80"
  },
];

const springPremium = { type: "spring", stiffness: 300, damping: 25, mass: 1 };
const easeCinematic = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ */
/* Full-Screen Ambient Soda Bubbles                                   */
/* ------------------------------------------------------------------ */
function useBubbles(n = 45) {
  return useMemo(() => Array.from({ length: n }, (_, i) => ({
    id: i, 
    x: Math.random() * 100, 
    size: 2 + Math.random() * 6, 
    dur: 10 + Math.random() * 15,
    delay: Math.random() * 10, 
    drift: (Math.random() - 0.5) * 30,
  })), [n]);
}

/* ------------------------------------------------------------------ */
/* 3D Delivery Van (No Dust, Dynamic Shadow)                          */
/* ------------------------------------------------------------------ */
function Van3D({ isJumping }) {
  return (
    <div className="relative flex items-center justify-center w-[70px] h-[45px]">
      
      {/* Detached Dynamic Shadow */}
      <motion.div 
        className="absolute bottom-1 w-[45px] h-[6px] bg-black/60 blur-[3px] rounded-[100%]"
        animate={{ 
          scale: isJumping ? 0.5 : 1, 
          opacity: isJumping ? 0.15 : 0.8,
          y: isJumping ? 25 : 0 
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />

      {/* The 3D Van SVG */}
      <svg viewBox="0 0 56 38" className="w-[56px] h-[38px] relative z-10 drop-shadow-xl" fill="none">
        <defs>
          <linearGradient id="vanBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="vanGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>

        <path d="M6 3 L32 3 L35 7 L5 7 Z" fill="#f8fafc" />
        <path d="M32 3 L43 12 L46 16 L35 7 Z" fill="#e2e8f0" />
        <path d="M5 7 C5 5.895 5.895 5 7 5 H33 C34.105 5 35 5.895 35 7 V22 H5 V7 Z" fill="url(#vanBody)" />
        <path d="M35 16 H46 L50 19 V26 H35 V16 Z" fill="url(#vanBody)" />
        <path d="M5 22 H50 V26 C50 27.105 49.105 28 48 28 H7 C5.895 28 5 27.105 5 26 V22 Z" fill="#94a3b8" />
        <rect x="5" y="19" width="30" height="4.5" fill="url(#vanGreen)" />
        <rect x="35" y="21" width="15" height="4.5" fill="url(#vanGreen)" />
        <rect x="37" y="15" width="8" height="5" rx="1.5" fill="#7dd3fc" />
        <path d="M37 15 L41 20 H37 Z" fill="#bae6fd" opacity="0.6" />
        <rect x="11" y="10" width="12" height="6" rx="1" fill="#d4aa70" />
        <rect x="11" y="12" width="12" height="2" fill="#b48a50" /> 
        <circle cx="14" cy="28" r="5" fill="#0f172a" />
        <circle cx="14" cy="28" r="2" fill="#cbd5e1" />
        <circle cx="41" cy="28" r="5" fill="#0f172a" />
        <circle cx="41" cy="28" r="2" fill="#cbd5e1" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Realistic 3D SVG Can Component (Enhanced)                          */
/* ------------------------------------------------------------------ */
function Can({ theme }) {
  const isGreen = theme === "green", isDark = theme === "dark";
  const bodyTop = isGreen ? "#123a1f" : isDark ? "#222" : "#5c0b12";
  const bodyMid = isGreen ? "#1fae4d" : isDark ? "#444" : "#c31432";
  const bodyBot = isGreen ? "#071c0c" : isDark ? "#0a0a0a" : "#2e0307"; // Darkened bottom for 3D depth
  
  return (
    <svg viewBox="0 0 160 320" className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]">
      <defs>
        <linearGradient id={`bodyGrad-${theme}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={bodyTop} />
          <stop offset="15%" stopColor={bodyMid} />
          <stop offset="35%" stopColor={isGreen ? "#3fe673" : isDark ? "#666" : "#f0435c"} /> {/* Brighter reflection */}
          <stop offset="60%" stopColor={bodyMid} />
          <stop offset="100%" stopColor={bodyBot} />
        </linearGradient>
        <radialGradient id="topShade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f2f4f6" />
          <stop offset="100%" stopColor="#7a7f84" />
        </radialGradient>
      </defs>
      
      {/* Main Cylinder */}
      <rect x="18" y="40" width="124" height="250" rx="16" fill={`url(#bodyGrad-${theme})`} />
      
      {/* 3D Edge Shadows to make it look cylindrical */}
      <rect x="18" y="40" width="16" height="250" rx="8" fill="#000" opacity="0.35" />
      <rect x="126" y="40" width="16" height="250" rx="8" fill="#000" opacity="0.6" />

      {/* Top Rim */}
      <ellipse cx="80" cy="40" rx="62" ry="16" fill="url(#topShade)" stroke="#555" strokeWidth="1.5" />
      
      {/* Bottom Rim */}
      <ellipse cx="80" cy="290" rx="62" ry="14" fill="#050505" opacity="0.85" />
      
      {/* White Label Band */}
      <rect x="18" y="145" width="124" height="55" fill="#ffffff" />
      
      {/* 3D Shadows on the white band */}
      <rect x="18" y="145" width="16" height="55" fill="#000" opacity="0.2" />
      <rect x="126" y="145" width="16" height="55" fill="#000" opacity="0.3" />

      {/* Brand Text - Updated to Cola */}
      <text 
        x="80" y="184" textAnchor="middle" 
        fontFamily="Georgia, serif" fontStyle="italic" fontWeight="900" fontSize="36" 
        fill={isGreen ? "#0b6b2c" : isDark ? "#000" : "#c31432"} letterSpacing="-1"
      >
        Cola
      </text>

      {/* Hard Glossy Highlights */}
      <rect x="34" y="46" width="8" height="238" rx="4" fill="#ffffff" opacity="0.45" />
      <rect x="114" y="46" width="4" height="238" rx="2" fill="#ffffff" opacity="0.15" />
      
      {/* Condensation Detail */}
      <circle cx="50" cy="90" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="100" cy="110" r="2.5" fill="#fff" opacity="0.4" />
      <circle cx="60" cy="230" r="1.5" fill="#fff" opacity="0.5" />
      <circle cx="110" cy="260" r="2" fill="#fff" opacity="0.3" />
      <circle cx="45" cy="200" r="2" fill="#fff" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Main Interactive Card Component                                    */
/* ------------------------------------------------------------------ */
export default function ColaRevealCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [qty, setQty] = useState(1);
  const [cartStatus, setCartStatus] = useState("idle"); // idle | drop | driving | done
  const [cartItems, setCartItems] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  
  const timers = useRef([]);
  const bubbles = useBubbles(45);
  const currentFlavor = FLAVORS[selectedFlavor];

  const clearTimers = () => timers.current.forEach(clearTimeout);
  useEffect(() => () => clearTimers(), []);

  const clearCart = useCallback(() => {
    setCartItems(0);
    setIsCartOpen(false);
  }, []);

  const handleOpen = () => setIsOpen(true);
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedFlavor(0);
      setQty(1);
      setCartStatus("idle");
      setIsCartOpen(false);
      setCartItems(0); 
    }, 500); 
  };

  const runAddToCart = () => {
    if (cartStatus !== "idle") return;
    clearTimers();
    
    setCartStatus("drop"); 
    
    const t1 = setTimeout(() => {
      setCartStatus("driving");
    }, 1000); 

    const t2 = setTimeout(() => setIsJumping(true), 1000 + 750); 
    const t3 = setTimeout(() => setIsJumping(false), 1000 + 1250); 
    
    const t4 = setTimeout(() => {
      setCartStatus("done");
      setCartItems((c) => c + qty);
      setQty(1);
    }, 2800); 
    
    const t5 = setTimeout(() => setCartStatus("idle"), 5000); 
    
    timers.current.push(t1, t2, t3, t4, t5);
  };

  return (
    <div className="relative w-full min-h-[700px] flex items-center justify-center bg-[#050505] overflow-hidden p-6 font-sans">
      
      {/* --- Ambient Full-Screen Bubbles --- */}
      {bubbles.map((b) => (
        <motion.span
          key={b.id} 
          className="absolute rounded-full bg-white/20 blur-[1px] pointer-events-none z-0 border border-white/30"
          style={{ left: `${b.x}%`, bottom: `-10%`, width: b.size, height: b.size }}
          animate={{ y: [0, -1000], x: [0, b.drift, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* --- CARD CONTAINER --- */}
      <motion.div
        layout className="relative rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.9)] border border-white/10 z-10"
        animate={{ width: isOpen ? 720 : 280, height: isOpen ? 440 : 380 }}
        transition={springPremium}
      >
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
          <motion.div className="absolute inset-0" animate={{ background: isOpen ? currentFlavor.bgGrad : FLAVORS[0].bgGrad }} transition={{ duration: 0.8 }} />
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className="absolute right-[-40px] top-[20px] w-[400px] h-[400px] rounded-full mix-blend-screen" 
                animate={{ background: currentFlavor.glow }} transition={{ duration: 0.8 }} 
              />
            )}
          </AnimatePresence>
        </div>

        {/* --- CLOSED STATE --- */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="closed-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group z-20" onClick={handleOpen}
            >
              <div className="absolute top-6 left-6 flex justify-between pointer-events-none">
                <span className="text-xs font-black tracking-widest text-red-500">COLA'</span>
              </div>
              <motion.div className="w-32 h-56" animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <Can theme="red" />
              </motion.div>
              <motion.div className="absolute bottom-8 flex flex-col items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-red-400/80 uppercase" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> Tap to open
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- EXPANDED STATE --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="expanded-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }} className="absolute inset-0 flex z-20"
            >
              <div className="flex-1 flex flex-col justify-center pl-12 pr-4 z-20">
                <div className="flex flex-col mb-4">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-red-500 mb-1">COLA'</span>
                  <motion.span key={currentFlavor.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: currentFlavor.textHighlight }}>
                    {currentFlavor.label}
                  </motion.span>
                </div>
                <h2 className="text-white text-[64px] leading-none font-bold tracking-tight mb-3">Cola</h2>
                <p className="text-neutral-400 text-sm tracking-wide mb-6">330 ml · <span className="font-bold text-white">35 g</span> sugar · 32 mg caffeine</p>

                <div className="flex items-center gap-3 mb-8">
                  {FLAVORS.map((f, i) => (
                    <button key={f.id} onClick={() => setSelectedFlavor(i)} className="relative w-[22px] h-[22px] flex items-center justify-center rounded-full">
                      <motion.div className="w-[14px] h-[14px] rounded-full" style={{ backgroundColor: f.dot }} animate={{ scale: selectedFlavor === i ? 1 : 0.85 }} />
                      {selectedFlavor === i && <motion.div layoutId="activeRing" className="absolute inset-0 rounded-full border-[1.5px] border-white/80" transition={springPremium} />}
                    </button>
                  ))}
                </div>

                {/* --- ADD TO CART CONTROLS --- */}
                <div className="flex items-center gap-4 relative z-30">
                  <div className="flex items-center justify-between bg-black/20 border border-white/10 rounded-full h-[46px] w-[100px] px-2 backdrop-blur-sm relative z-10 shrink-0">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-full text-white/70 hover:text-white flex items-center justify-center text-lg focus:outline-none">−</button>
                    <motion.span key={qty} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-white font-bold text-sm w-4 text-center">{qty}</motion.span>
                    <button onClick={() => setQty(q => Math.min(9, q + 1))} className="w-8 h-full text-white/70 hover:text-white flex items-center justify-center text-lg focus:outline-none">+</button>
                  </div>

                  <div className="relative h-[46px] flex items-center shrink-0 w-[175px]">
                    <motion.button
                      onClick={runAddToCart} disabled={cartStatus !== "idle"}
                      whileHover={cartStatus === "idle" ? { scale: 1.02 } : {}} whileTap={cartStatus === "idle" ? { scale: 0.97 } : {}}
                      className="absolute inset-y-0 left-0 flex items-center justify-center overflow-hidden rounded-full shadow-lg z-10"
                      style={{ backgroundColor: cartStatus === "idle" || cartStatus === "drop" ? "#ffffff" : cartStatus === "done" ? "#16a34a" : "#022c22" }}
                      animate={{ width: cartStatus === "idle" ? 175 : cartStatus === "drop" ? 64 : cartStatus === "driving" ? 175 : 140 }}
                      transition={springPremium}
                    >
                      {cartStatus === "driving" && (
                        <motion.div className="absolute left-0 top-0 bottom-0 bg-[#4ade80]" initial={{ width: "10%" }} animate={{ width: "100%" }} transition={{ duration: 1.8, ease: easeCinematic }} />
                      )}

                      <AnimatePresence mode="wait">
                        {cartStatus === "idle" && (
                          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-between w-full px-5 text-[#0f172a]">
                            <span className="font-bold text-[14px]">Add to cart</span>
                            <span className="opacity-70 font-semibold">${(parseFloat(currentFlavor.price) * qty).toFixed(2)}</span>
                          </motion.div>
                        )}
                        {cartStatus === "drop" && (
                          <motion.div key="drop" className="relative flex items-center justify-center w-full h-full text-[#0f172a]" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                            <motion.div className="absolute w-2.5 h-2.5 bg-[#16a34a] rounded-[3px] z-0" initial={{ y: -30, opacity: 0, rotate: -20 }} animate={{ y: 2, opacity: [0, 1, 1, 0], rotate: 0 }} transition={{ duration: 0.6, ease: "easeIn", delay: 0.1 }} />
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 relative z-10 bg-white">
                              <circle cx="9" cy="21" r="1.5" /><circle cx="20" cy="21" r="1.5" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                          </motion.div>
                        )}
                        {cartStatus === "done" && (
                          <motion.div key="done" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={springPremium} className="flex items-center gap-2 text-[#022c22] px-3 z-10">
                            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12.5l3 3L16 8.5" /></svg>
                            <span className="font-bold text-[14px] tracking-wide">Added</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <AnimatePresence>
                      {(cartStatus === "driving" || cartStatus === "done") && (
                        <motion.div 
                          key="van" className="absolute top-0 bottom-0 flex items-center justify-center z-50 pointer-events-none" 
                          initial={{ left: 10, y: 0, opacity: 0, rotate: 0 }} 
                          animate={{ 
                            left: [10, 140, 190, 800], 
                            y: [0, 0, -35, 10],        
                            rotate: [0, 0, 15, 0],     
                            opacity: [0, 1, 1, 0]
                          }} 
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 2.8, 
                            times: [0, 0.35, 0.45, 1], 
                            ease: "easeInOut"
                          }}
                        >
                          <Van3D isJumping={isJumping} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Right Can Display */}
              <div className="flex-1 relative flex items-center justify-center pointer-events-none">
                <motion.div className="relative w-44 h-[300px] z-10" initial={{ y: 15, opacity: 0 }} animate={{ y: [0, -8, 0], opacity: 1, rotate: [2, -2, 2] }} transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.5 } }}>
                  <Can theme={currentFlavor.theme} />
                </motion.div>
              </div>

              {/* Top Controls: Close 'X' & Cart Popover */}
              <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
                <div className="relative">
                  <motion.button onClick={() => setIsCartOpen(!isCartOpen)} className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="9" cy="21" r="1.5" /><circle cx="20" cy="21" r="1.5" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                    <AnimatePresence>
                      {cartItems > 0 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1 -right-1 w-4 h-4 bg-[#22c55e] text-[#022c22] text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                          {cartItems}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <AnimatePresence>
                    {isCartOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={springPremium} className="absolute top-12 right-0 w-60 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 origin-top-right overflow-hidden">
                        <h3 className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4">Your Cart</h3>
                        {cartItems > 0 ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-white">
                              <div><p className="text-sm font-bold">Cola ({currentFlavor.theme})</p><p className="text-xs text-white/50">Qty: {cartItems}</p></div>
                              <span className="font-bold text-[#4ade80]">${(cartItems * parseFloat(currentFlavor.price)).toFixed(2)}</span>
                            </div>
                            <button onClick={clearCart} className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                              Clear Cart
                            </button>
                          </div>
                        ) : (<div className="text-center py-4 text-white/40 text-sm">Cart is empty.</div>)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={handleClose} aria-label="Close" className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}