import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Box Dimensions
const boxW = 220; 
const boxD = 110; 
const boxH = 70;  

const SPRING_FOLD = { type: 'spring', stiffness: 120, damping: 14, mass: 1 };

// ---------------------------------------------------------------------------
// Crossfading sneaker images
// ---------------------------------------------------------------------------
const SneakerImages = ({ activeIdx, colors }) => (
  <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_20px_15px_rgba(0,0,0,0.35)]">
    {colors?.map((c, i) => (
      <motion.img
        key={c.id}
        src={c.image}
        alt={`${c.name} Sneaker`}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        initial={false}
        animate={{ opacity: activeIdx === i ? 1 : 0, scale: activeIdx === i ? 1 : 0.95 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Delivery Van (Updated text alignment and scale to fit perfectly)
// ---------------------------------------------------------------------------
const DeliveryVan = ({ step }) => {
  const isEntering = step === 6;
  const isPresent = step >= 6 && step <= 10;
  const doorOpen = step >= 7 && step <= 8;
  const headlightsOn = step >= 10;
  const smokeActive = step >= 10 && step <= 11;
  const isDeparting = step >= 11;
  const speedLinesActive = step >= 11; // Activates wind waves when driving away

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
          {/* Side Mirror */}
          <div className="absolute top-[70px] left-[-8px] w-[14px] h-[35px] bg-[#0c1618] rounded-l-md shadow-lg border border-white/10" />
          
          {/* Window */}
          <div className="absolute top-10 right-3 w-[95px] h-[85px] bg-gradient-to-br from-[#0c1618] to-[#05090a] rounded-tr-2xl rounded-tl-sm border-b-[5px] border-l-[5px] border-[#080f10] shadow-[inset_0_5px_15px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-tr-2xl" />
          </div>

          {/* Headlights */}
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

        {/* Updated Typography */}
        <div className="absolute top-[80px] left-[40px] flex flex-col drop-shadow-xl z-0">
          <span className="text-white font-black text-[20px] leading-none tracking-[0.1em] opacity-95">DELIVERY</span>
          <span className="text-white/60 font-bold text-[10px] tracking-[0.4em] ml-1 mt-1">VAN</span>
        </div>

        {/* Purple Stripe */}
        <div className="absolute bottom-[75px] left-0 right-0 h-4 bg-gradient-to-r from-[#7e57c2] to-[#5f4796] shadow-md border-y border-white/10" />

        {/* Sliding Door Area */}
        <div className="absolute bottom-[80px] left-[190px] w-[180px] h-[180px] overflow-hidden rounded-t-xl z-10">
          <div className="absolute inset-0 bg-[#050809] shadow-[inset_0_20px_60px_rgba(0,0,0,1)]" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#182d30] to-[#122225] border-2 border-[#0d1a1c] rounded-t-xl flex flex-col items-center justify-end pb-6 shadow-[inset_0_2px_5px_rgba(255,255,255,0.05)]"
            initial={false}
            animate={{ x: doorOpen ? '95%' : '0%' }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0 }}
          >
            {/* Door Handle */}
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
                  key={i}
                  className="absolute bottom-4 left-16 w-12 h-12 bg-gray-300 rounded-full blur-xl"
                  initial={{ opacity: 0.6, scale: 0.5, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: 3, x: -120 - Math.random() * 60, y: -20 - Math.random() * 40 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Speed Wind Waves (Perfectly shooting towards the LEFT) */}
        <AnimatePresence>
          {speedLinesActive && (
            <div className="absolute top-[20%] left-[-50px] w-[500px] h-[150px] pointer-events-none z-[-1]">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`wind-${i}`}
                  className="absolute h-[3px] bg-zinc-400/60 rounded-full"
                  style={{ top: `${10 + i * 18}px` }}
                  initial={{ opacity: 0, width: 0, x: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    width: [0, 150 + Math.random() * 100, 0],
                    x: [0, -400 - Math.random() * 200] // Moves strictly to the LEFT
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
// Main sequence
// ---------------------------------------------------------------------------
export default function PackagingSequence({ color, activeColorIdx, colors, onSequenceComplete }) {
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
          className={`absolute w-[45vw] max-w-[550px] aspect-square rounded-full bg-gradient-to-br ${safeColor.circle} shadow-[0_30px_60px_rgba(0,0,0,0.03)]`}
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