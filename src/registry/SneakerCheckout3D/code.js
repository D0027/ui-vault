export const sneakerCheckout3DCode = `import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RefreshCcw } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Data & Configuration                                               */
/* ------------------------------------------------------------------ */

export const COLORS = [
  { id: 'terracotta', name: 'Terracotta', hex: '#c1652e', dark: '#8a4620', circle: 'from-[#f9dacd] to-[#fdf1eb]', badge: 'bg-[#dcfce7] text-[#065f46]', image: 'terracotta.png' },
  { id: 'teal',       name: 'Teal',       hex: '#1f8a7a', dark: '#155e54', circle: 'from-[#c5f5e8] to-[#e2fdf5]', badge: 'bg-[#dceefc] text-[#065f57]', image: 'teal.png' },
  { id: 'lilac',      name: 'Lilac',      hex: '#8b6bcf', dark: '#5f4796', circle: 'from-[#e1c5f5] to-[#f1e2fd]', badge: 'bg-[#ebdcfc] text-[#2c065f]', image: 'lilac.png' },
  { id: 'sage',       name: 'Sage',       hex: '#7ea338', dark: '#566f26', circle: 'from-[#e4f5c5] to-[#f3fde2]', badge: 'bg-[#f0fcdc] text-[#345f06]', image: 'sage.png' },
];

const SPRING_SNAP = { type: 'spring', stiffness: 260, damping: 24, mass: 0.8 };
const SPRING_FOLD = { type: 'spring', stiffness: 120, damping: 14, mass: 1 };

// Box Dimensions
const boxW = 220; 
const boxD = 110; 
const boxH = 70;  

/* ------------------------------------------------------------------ */
/* Shared Components                                                  */
/* ------------------------------------------------------------------ */

const SneakerImages = ({ activeIdx, colors = COLORS }) => (
  <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_25px_20px_rgba(0,0,0,0.35)]">
    {colors.map((c, i) => (
      <motion.img
        key={c.id}
        src={c.image}
        alt={c.name + " Sneaker"}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        initial={false}
        animate={{ opacity: activeIdx === i ? 1 : 0, scale: activeIdx === i ? 1 : 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Delivery Van (With Left-Shooting Wind Waves)
// ---------------------------------------------------------------------------
const DeliveryVan = ({ step }) => {
  const isEntering = step === 6;
  const isPresent = step >= 6 && step <= 10;
  const doorOpen = step >= 7 && step <= 8;
  const headlightsOn = step >= 10;
  const smokeActive = step >= 10 && step <= 11;
  const isDeparting = step >= 11;
  const speedLinesActive = step >= 11; 

  return (
    <motion.div
      className="absolute bottom-[14vh] mb-[-10px] left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      initial={{ x: '-150vw' }}
      animate={{ x: isDeparting ? '150vw' : isPresent ? '-45%' : '-150vw' }}
      transition={isEntering ? { type: 'spring', stiffness: 40, damping: 13 } : { duration: 1.4, ease: 'easeInOut' }}
    >
      <div className="w-[660px] h-[280px] bg-gradient-to-b from-[#1b353a] to-[#0e1c1f] rounded-t-3xl rounded-br-3xl rounded-bl-lg relative shadow-[40px_40px_80px_rgba(0,0,0,0.7),inset_0_2px_10px_rgba(255,255,255,0.15)] border-b-4 border-zinc-950 overflow-visible">
        
        {/* Front Cabin */}
        <div className="absolute right-0 top-0 w-[190px] h-full bg-gradient-to-b from-[#14282c] to-[#0a1416] rounded-tr-3xl rounded-br-3xl border-l border-white/5 shadow-[-10px_0_20px_rgba(0,0,0,0.4)]">
          <div className="absolute top-[70px] left-[-8px] w-[14px] h-[35px] bg-[#0c1618] rounded-l-md shadow-lg border border-white/10" />
          
          <div className="absolute top-10 right-3 w-[95px] h-[85px] bg-gradient-to-br from-[#0c1618] to-[#05090a] rounded-tr-2xl rounded-tl-sm border-b-[5px] border-l-[5px] border-[#080f10] shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-tr-2xl" />
          </div>

          <motion.div
            className="absolute bottom-[40px] right-[-4px] w-[14px] h-[30px] bg-[#ffe16b] rounded-l-full z-10 border border-yellow-300/30"
            animate={{
              boxShadow: headlightsOn ? '10px 0 60px 20px rgba(253,224,71,0.8)' : '0px 0 0px 0px rgba(253,224,71,0)',
              backgroundColor: headlightsOn ? '#fff2a8' : '#8c7b39',
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute bottom-[-10px] right-[-300px] w-[300px] h-[120px] pointer-events-none origin-left z-0"
            style={{ background: 'linear-gradient(90deg, rgba(253,224,71,0.4) 0%, rgba(253,224,71,0) 100%)', clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)' }}
            animate={{ opacity: headlightsOn ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute bottom-12 left-0 w-[8px] h-[28px] bg-red-600 rounded-r-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
        </div>

        {/* Typography */}
        <div className="absolute top-[80px] left-[40px] flex flex-col drop-shadow-xl z-0">
          <span className="text-white font-black text-[20px] leading-none tracking-[0.1em] opacity-95">DELIVERY</span>
          <span className="text-white/60 font-bold text-[10px] tracking-[0.4em] ml-1 mt-1">VAN</span>
        </div>

        <div className="absolute bottom-[75px] left-0 right-0 h-4 bg-gradient-to-r from-[#7e57c2] to-[#5f4796] shadow-md border-y border-white/10" />

        {/* Sliding Door */}
        <div className="absolute bottom-[80px] left-[190px] w-[180px] h-[180px] overflow-hidden rounded-t-xl z-10">
          <div className="absolute inset-0 bg-[#050809] shadow-[inset_0_20px_60px_rgba(0,0,0,1)]" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#182d30] to-[#122225] border-2 border-[#0d1a1c] rounded-t-xl flex flex-col items-center justify-end pb-6 shadow-[inset_0_2px_5px_rgba(255,255,255,0.05)]"
            initial={false}
            animate={{ x: doorOpen ? '95%' : '0%' }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0 }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-[40px] bg-[#0a1214] rounded-full shadow-inner" />
          </motion.div>
        </div>

        {/* 3D Wheels */}
        <div className="absolute -bottom-12 left-[65px] w-[115px] h-[115px] bg-[#0c0c0c] rounded-full border-[12px] border-[#1a1a1a] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_10px_20px_rgba(0,0,0,0.8)]">
          <div className="w-12 h-12 bg-gradient-to-br from-zinc-500 to-zinc-800 rounded-full border-4 border-zinc-900 shadow-inner" />
        </div>
        <div className="absolute -bottom-12 right-[65px] w-[115px] h-[115px] bg-[#0c0c0c] rounded-full border-[12px] border-[#1a1a1a] flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_10px_20px_rgba(0,0,0,0.8)]">
          <div className="w-12 h-12 bg-gradient-to-br from-zinc-500 to-zinc-800 rounded-full border-4 border-zinc-900 shadow-inner" />
        </div>

        {/* Smoke */}
        <AnimatePresence>
          {smokeActive && (
            <div className="absolute -bottom-10 -left-20 w-32 h-32 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={"smoke-" + i}
                  className="absolute bottom-4 left-16 w-12 h-12 bg-gray-300 rounded-full blur-xl"
                  initial={{ opacity: 0.6, scale: 0.5, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 3, x: -120 - Math.random() * 60, y: -20 - Math.random() * 40 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Speed Wind Waves */}
        <AnimatePresence>
          {speedLinesActive && (
            <div className="absolute top-[20%] left-[-60px] w-[500px] h-[150px] pointer-events-none z-[-1]">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={"wind-" + i}
                  className="absolute h-[3px] bg-zinc-400/60 rounded-full"
                  style={{ top: (10 + i * 18) + "px" }}
                  initial={{ opacity: 0, width: 0, x: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    width: [0, 150 + Math.random() * 100, 0],
                    x: [0, -450 - Math.random() * 200] 
                  }}
                  transition={{ 
                    duration: 0.4 + Math.random() * 0.2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: Math.random() * 0.3
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// 3D Wall Assembly
// ---------------------------------------------------------------------------
function Wall({ axis, edge, size, color, flapColor, up, flapIn, flapAxis, flapEdge, flapSize, delay = 0 }) {
  const isX = axis === 'X';
  const wallStyle = isX ? { width: size.w, height: size.h, [edge]: 0 } : { width: size.w, height: size.h, [edge]: 0 };

  return (
    <motion.div
      className="absolute border"
      style={{
        ...wallStyle,
        backgroundColor: color,
        borderColor: 'rgba(0,0,0,0.15)',
        transformStyle: 'preserve-3d',
        transformOrigin: isX ? (edge === 'top' ? 'top' : 'bottom') : (edge === 'left' ? 'left' : 'right'),
      }}
      animate={{
        rotateX: isX ? (up ? (edge === 'top' ? 90 : -90) : 0) : 0,
        rotateY: !isX ? (up ? (edge === 'left' ? -90 : 90) : 0) : 0,
      }}
      transition={{ ...SPRING_FOLD, delay }}
    >
      {flapAxis && (
        <motion.div
          className="absolute border"
          style={{
            width: flapSize.w,
            height: flapSize.h,
            [flapEdge]: 0,
            backgroundColor: flapColor,
            borderColor: 'rgba(0,0,0,0.15)',
            transformStyle: 'preserve-3d',
            transformOrigin: flapAxis === 'X' ? (flapEdge === 'top' ? 'top' : 'bottom') : (flapEdge === 'left' ? 'left' : 'right'),
          }}
          animate={{
            rotateX: flapAxis === 'X' ? (flapEdge === 'top' ? (flapIn ? -90 : 90) : (flapIn ? 90 : -90)) : flapAxis === 'Y' ? (flapEdge === 'left' ? (flapIn ? -90 : 90) : (flapIn ? 90 : -90)) : 0,
            rotateY: 0,
          }}
          transition={{ ...SPRING_FOLD, delay: delay + 0.15 }}
        />
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Packaging Sequence Component
// ---------------------------------------------------------------------------
function PackagingSequence({ color, activeColorIdx, colors, onSequenceComplete }) {
  const [step, setStep] = useState(0);
  const safeColor = color || (colors && colors[0]) || { hex: '#7e57c2', circle: 'from-[#e1c5f5] to-[#f1e2fd]' };

  useEffect(() => {
    let active = true;
    const runAnimationTimeline = async () => {
      await new Promise((r) => setTimeout(r, 100));
      if (!active) return;

      setStep(1); await new Promise((r) => setTimeout(r, 600)); 
      setStep(2); await new Promise((r) => setTimeout(r, 900)); 
      setStep(3); await new Promise((r) => setTimeout(r, 550)); 
      setStep(4); await new Promise((r) => setTimeout(r, 500)); 
      setStep(5); await new Promise((r) => setTimeout(r, 800)); 
      setStep(6); await new Promise((r) => setTimeout(r, 1200)); 
      setStep(7); await new Promise((r) => setTimeout(r, 600)); 
      setStep(8); await new Promise((r) => setTimeout(r, 800)); 
      setStep(9); await new Promise((r) => setTimeout(r, 500)); 
      setStep(10); await new Promise((r) => setTimeout(r, 400)); 
      setStep(11); await new Promise((r) => setTimeout(r, 1200)); 

      onSequenceComplete();
    };

    runAnimationTimeline();
    return () => { active = false; };
  }, [onSequenceComplete]);

  const boxVisible = step >= 1;
  const wallsUp = step >= 1; 
  const isShoeDropped = step >= 2;
  const sideFlapsIn = step >= 3;
  const lidClosed = step >= 4;
  const isTaped = step >= 5;
  const boxJumping = step === 8;
  const isLoaded = step >= 9;
  const isIsometric = step >= 1 && step <= 8;

  const shadowOpacity = useMemo(() => (boxJumping ? [0.5, 0.15, 0] : isLoaded ? 0 : 0.5), [boxJumping, isLoaded]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <DeliveryVan step={step} />

      <div className="absolute left-0 top-0 w-full lg:w-1/2 h-[85vh] flex flex-col items-center justify-center z-30 pb-10">
        <motion.div
          className={"absolute w-[45vw] max-w-[550px] aspect-square rounded-full bg-gradient-to-br " + safeColor.circle + " shadow-[0_30px_60px_rgba(0,0,0,0.03)]"}
          animate={{ opacity: boxJumping || isLoaded ? 0 : 1, scale: boxJumping || isLoaded ? 0.8 : 1, y: '-5%' }}
          transition={{ duration: 0.6 }}
        />

        <motion.div
          className="absolute rounded-[100%] bg-black blur-xl"
          style={{ width: 260, height: 50, bottom: 30 }}
          animate={{ opacity: shadowOpacity, scaleX: boxJumping ? [1, 0.6, 0.3] : 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* 3D STAGE */}
        <div className="relative z-30 flex items-center justify-center w-[420px] h-[280px] -mt-10" style={{ perspective: '1600px', perspectiveOrigin: '50% 30%' }}>
          <motion.div
            className="relative flex items-center justify-center w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              rotateX: isLoaded ? 0 : boxJumping ? [58, 20, 0] : isIsometric ? 58 : 0,
              rotateZ: isLoaded ? 180 : boxJumping ? [-32, 90, 180] : isIsometric ? -32 : 0,
              y: isLoaded ? '10vh' : boxJumping ? ['10vh', '-25vh', '10vh'] : isIsometric ? '10vh' : 0,
              x: isLoaded ? '28vw' : boxJumping ? ['0vw', '14vw', '28vw'] : 0,
              scale: isLoaded ? 0 : boxJumping ? [1, 0.9, 0] : 1,
              opacity: isLoaded ? 0 : boxJumping ? [1, 1, 0] : 1,
            }}
            transition={boxJumping ? { duration: 0.85, ease: 'easeInOut' } : { duration: 1, ease: 'easeInOut' }}
          >
            <motion.div
              className="relative"
              style={{
                width: boxW, height: boxD, backgroundColor: '#a67c52',
                border: '0.5px solid rgba(139,101,75,0.4)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15)',
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: boxVisible ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <Wall axis="Y" edge="left" size={{ w: boxH, h: boxD }} color="#b28451" flapColor="#c29562" up={wallsUp} flapAxis="Y" flapEdge="right" flapIn={sideFlapsIn} flapSize={{ w: boxW / 2 - 6, h: boxD - 16 }} delay={0.1} />
              <Wall axis="Y" edge="right" size={{ w: boxH, h: boxD }} color="#b28451" flapColor="#c29562" up={wallsUp} flapAxis="Y" flapEdge="left" flapIn={sideFlapsIn} flapSize={{ w: boxW / 2 - 6, h: boxD - 16 }} delay={0.15} />
              <Wall axis="X" edge="top" size={{ w: boxW, h: boxH }} color="#c29562" flapColor="#d2a679" up={wallsUp} flapAxis="X" flapEdge="bottom" flapIn={lidClosed} flapSize={{ w: boxW, h: boxD / 2 + 4 }} delay={0} />
              <Wall axis="X" edge="bottom" size={{ w: boxW, h: boxH }} color="#c29562" flapColor="#d2a679" up={wallsUp} flapAxis="X" flapEdge="top" flapIn={lidClosed} flapSize={{ w: boxW, h: boxD / 2 + 4 }} delay={0.05} />

              <motion.div
                className="absolute left-[-20px] right-[-20px] top-[43px] h-[24px] z-50 origin-left"
                style={{ backgroundColor: safeColor.hex, translateZ: boxH + 2 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isTaped ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              <motion.div
                className="absolute top-[20px] right-[25px] w-[50px] h-[35px] bg-white rounded-sm shadow-sm z-50 p-1 flex flex-col gap-[3px]"
                style={{ translateZ: boxH + 3 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: isTaped ? 1 : 0, scale: isTaped ? 1 : 0.5 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="w-full h-1.5 bg-[#5f4796] rounded-[1px]" />
                <div className="w-3/4 h-1 bg-zinc-300 rounded-[1px]" />
                <div className="w-1/2 h-1 bg-zinc-300 rounded-[1px]" />
                <div className="mt-auto w-full border-t border-zinc-400 border-dashed" />
              </motion.div>

              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ translateZ: isShoeDropped ? 14 : 260, rotateX: -90, rotateY: 15, opacity: lidClosed ? 0 : 1 }}
                transition={{ duration: 0.7, type: 'spring', bounce: 0.25 }}
              >
                <div className="w-[280px] h-[160px]">
                  <SneakerImages activeIdx={activeColorIdx || 0} colors={colors} />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute rounded-[100%] z-10"
          animate={{ opacity: isLoaded || boxJumping ? 0 : 1 }}
          style={{ bottom: '0', width: 380, height: 80, background: 'linear-gradient(180deg, #dfc1a9 0%, #b38b6d 100%)', borderBottom: '16px solid #8b654b', boxShadow: '0 30px 40px rgba(0,0,0,0.15)' }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Full-Screen Component                                         */
/* ------------------------------------------------------------------ */

export default function VeloCheckoutFullScreen() {
  const [colorIdx, setColorIdx] = useState(0); 
  const [status, setStatus] = useState('idle'); 
  const color = COLORS[colorIdx];

  const handleBuyClick = () => {
    if (status !== 'idle') return;
    setStatus('packing'); 
  };

  const reset = () => {
    setStatus('idle');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex font-sans bg-[#fdfcfb] selection:bg-zinc-800 selection:text-white">
      
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 20%, #f6ebe3 0%, transparent 60%)' }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-[15vh] min-h-[120px] bg-gradient-to-b from-[#2e3b3c] to-[#1c2728] z-0 flex items-start border-t-[5px] border-[#233132] pt-8">
        <div 
          className="w-full h-[6px] opacity-30"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 40px, transparent 40px, transparent 80px)' }}
        />
      </div>

      <AnimatePresence>
        {status === 'idle' && (
          <>
            <motion.div 
              className="absolute left-0 top-0 w-full lg:w-1/2 h-[85vh] flex flex-col items-center justify-center z-10 pb-10"
              exit={{ opacity: 0, x: -50, transition: { duration: 0.5 } }}
            >
              <div className={"absolute w-[45vw] max-w-[550px] aspect-square rounded-full bg-gradient-to-br " + color.circle + " shadow-[0_30px_60px_rgba(0,0,0,0.03)]"} />

              <motion.div 
                className="relative z-20 w-[380px] h-[220px] -mt-10"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <SneakerImages activeIdx={colorIdx} colors={COLORS} />
              </motion.div>

              <div
                className="absolute rounded-[100%] z-0"
                style={{
                  bottom: '0', 
                  width: 380, height: 80,
                  background: 'linear-gradient(180deg, #dfc1a9 0%, #b38b6d 100%)',
                  borderBottom: '16px solid #8b654b',
                  boxShadow: '0 30px 40px rgba(0,0,0,0.15)',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, filter: 'blur(8px)', transition: { duration: 0.4 } }}
              className="absolute right-0 top-0 w-full lg:w-1/2 h-[85vh] flex flex-col justify-center pl-[5%] pr-[10%] z-40 pb-10"
            >
              <div className="max-w-xl">
                <div className="mb-6 flex">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e3f4ec] text-[#166560] text-[11px] font-extrabold tracking-[0.1em] uppercase shadow-sm border border-[#d1ebe0]">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    In stock - Ships today
                  </div>
                </div>

                <h1 className="text-[130px] font-black text-[#111] tracking-tighter leading-[0.8] mb-3">VELO</h1>
                <h2 className="text-[18px] font-black tracking-[0.2em] uppercase mb-8" style={{ color: color.dark }}>
                  Runner 01 — {color.name}
                </h2>

                <p className="text-[#52525b] text-[18px] leading-relaxed mb-10">
                  Hand-finished calfskin on a cloud-foam sole. <br />
                  Made in Italy, 40 pairs a week.
                </p>

                <div className="flex gap-5 mb-14 items-center">
                  {COLORS.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setColorIdx(i)}
                      className="relative w-12 h-12 rounded-full focus:outline-none"
                      style={{ backgroundColor: c.hex }}
                    >
                      {colorIdx === i && (
                        <motion.span layoutId="swatch-ring" className="absolute inset-[-6px] rounded-full border-[3px]" style={{ borderColor: c.hex }} />
                      )}
                      {colorIdx === i && (
                        <span className="absolute inset-0 rounded-full border-[3px] border-white pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="text-[#111] text-[64px] font-black tracking-tight mb-10">$695</div>

                <motion.button
                  onClick={handleBuyClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full max-w-[340px] flex items-center justify-center text-white font-bold text-xl py-5 rounded-full transition-shadow focus:outline-none overflow-hidden"
                  style={{ backgroundColor: color.hex, boxShadow: "0 20px 40px -10px " + color.hex + "90, inset 0 2px 0 rgba(255,255,255,0.2)" }}
                >
                  Buy Now
                </motion.button>

                <p className="text-[13px] text-[#9ca3af] mt-5 ml-4 font-medium tracking-wide">
                  Free 2-day delivery · 30-day returns
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {status === 'packing' && (
        <PackagingSequence 
          color={color} 
          activeColorIdx={colorIdx}
          colors={COLORS}
          onSequenceComplete={() => setStatus('success')} 
        />
      )}

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...SPRING_SNAP, delay: 0.1 }}
            className="fixed z-[100] w-full max-w-[480px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-zinc-900 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-zinc-100"
          >
            <div className="h-[6px] w-full bg-gradient-to-r from-[#4f3b82] via-[#10b981] to-[#10b981]" />

            <div className="p-8 pb-10">
              <div className="flex flex-col items-start text-left mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                    className="w-11 h-11 rounded-full bg-[#e6fbf1] text-[#059669] flex items-center justify-center border border-[#a7f3d0]/50"
                  >
                    <Check className="w-6 h-6" strokeWidth={3} />
                  </motion.div>
                  <h2 className="text-[24px] font-bold tracking-tight text-zinc-900">Order confirmed</h2>
                </div>
                <p className="text-[13px] text-zinc-500 ml-[60px]">Order <strong className="text-zinc-800">#VL-2291</strong> - paid with Visa — 4417</p>
              </div>

              <div 
                className="flex items-center gap-4 p-4 rounded-[20px] mb-10 shadow-sm"
                style={{ backgroundColor: color.hex + '1A' }} 
              >
                <div className="w-[72px] h-[72px] bg-white shadow-sm rounded-xl p-1.5 flex items-center justify-center">
                  <img src={color.image} alt={color.name} className="w-full h-full object-contain" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-[17px] leading-tight text-zinc-900">VELO Runner 01</h4>
                  <p className="text-[13px] font-semibold mt-1" style={{ color: color.dark }}>{color.name} - Size 42</p>
                </div>
                <div className="font-black text-[22px] text-zinc-900 mr-2">$695</div>
              </div>

              <div className="relative mb-10 mt-8 px-4">
                <div className="relative h-[6px] w-full flex items-center">
                  <div className="absolute w-full h-full bg-[#e5e0d8] rounded-full" />
                  
                  <motion.div 
                    className="absolute h-full bg-gradient-to-r from-[#10b981] to-[#5f4796] rounded-full origin-left z-0" 
                    initial={{ width: 0 }} 
                    animate={{ width: '55%' }} 
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }} 
                  />

                  <div className="absolute left-0 w-4 h-4 bg-[#10b981] rounded-full border-[3px] border-white ring-2 ring-[#10b981]/30 z-10" />
                  <div className="absolute left-0 top-7 -translate-x-1/2 text-[#10b981] text-[13px] font-bold">Packed</div>

                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#10b981] rounded-full border-[3px] border-white ring-2 ring-[#10b981]/30 z-10" />
                  <div className="absolute left-1/2 top-7 -translate-x-1/2 text-[#10b981] text-[13px] font-bold">Shipped</div>

                  <div className="absolute right-0 w-4 h-4 bg-[#d6d1c9] rounded-full border-[3px] border-white ring-2 ring-[#e5e0d8] z-10" />
                  <div className="absolute right-0 top-7 translate-x-4 text-zinc-800 text-[13px] font-bold w-max">Arrives Thu, 16 Jul</div>

                  <motion.div 
                    className="absolute top-[-16px] z-20"
                    initial={{ left: '0%' }}
                    animate={{ left: '55%' }} 
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                  >
                    <svg className="w-5 h-5 text-zinc-900 -ml-2" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M236.7,112.5l-33.8-37.4A16,16,0,0,0,191,69.2H168V56a16,16,0,0,0-16-16H24A16,16,0,0,0,8,56V184a8,8,0,0,0,8,8H33.4a28,28,0,0,0,53.2,0h66.8a28,28,0,0,0,53.2,0H240a8,8,0,0,0,8-8V120A8,8,0,0,0,236.7,112.5ZM60,200a12,12,0,1,1,12-12A12,12,0,0,1,60,200Zm120,0a12,12,0,1,1,12-12A12,12,0,0,1,180,200ZM168,85.2h23l24.2,26.8H168Z"/>
                    </svg>
                  </motion.div>
                </div>
              </div>

              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-2 bg-white text-[#0f172a] border-[1.5px] border-zinc-200 py-[10px] px-6 rounded-full font-bold text-[14px] shadow-sm transition-colors w-max mt-14"
              >
                Order another <RefreshCcw className="w-3.5 h-3.5 text-zinc-400 stroke-[3]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;