import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, RefreshCcw } from 'lucide-react';

// Ye teri separate file hai jisme saara Box aur Van ka animation hoga
import PackagingSequence from './components/PackagingSequence';

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

/* ------------------------------------------------------------------ */
/* Idle State Sneaker Component (Front Page Only)                     */
/* ------------------------------------------------------------------ */
const SneakerImages = ({ activeIdx }) => (
  <div className="relative w-full h-full flex items-center justify-center drop-shadow-[0_25px_20px_rgba(0,0,0,0.35)]">
    {COLORS.map((c, i) => (
      <motion.img
        key={c.id}
        src={c.image}
        alt={`${c.name} Sneaker`}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        initial={false}
        animate={{ opacity: activeIdx === i ? 1 : 0, scale: activeIdx === i ? 1 : 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Main Full-Screen Component                                         */
/* ------------------------------------------------------------------ */

export default function VeloCheckoutFullScreen() {
  const [colorIdx, setColorIdx] = useState(0); 
  const [status, setStatus] = useState('idle'); // 'idle' | 'packing' | 'success'
  const color = COLORS[colorIdx];

  const handleBuyClick = () => {
    if (status !== 'idle') return;
    setStatus('packing'); // Hides front page and starts the sequence!
  };

  const reset = () => {
    setStatus('idle');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex font-sans bg-[#fdfcfb] selection:bg-zinc-800 selection:text-white">
      
      {/* Soft background gradient overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 80% 20%, #f6ebe3 0%, transparent 60%)' }}
      />

      {/* ---------------- ROAD BACKGROUND (Bottom 15%) ---------------- */}
      <div className="absolute bottom-0 left-0 right-0 h-[15vh] min-h-[120px] bg-gradient-to-b from-[#2e3b3c] to-[#1c2728] z-0 flex items-start border-t-[5px] border-[#233132] pt-8">
        <div 
          className="w-full h-[6px] opacity-30"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 40px, transparent 40px, transparent 80px)' }}
        />
      </div>

      {/* ---------------- IDLE STATE: THE PERFECT FRONT PAGE ---------------- */}
      <AnimatePresence>
        {status === 'idle' && (
          <>
            {/* LEFT SIDE: Pedestal & Hovering Shoe */}
            <motion.div 
              className="absolute left-0 top-0 w-full lg:w-1/2 h-[85vh] flex flex-col items-center justify-center z-10 pb-10"
              exit={{ opacity: 0, x: -50, transition: { duration: 0.5 } }}
            >
              {/* Circular Light Glow */}
              <div className={`absolute w-[45vw] max-w-[550px] aspect-square rounded-full bg-gradient-to-br ${color.circle} shadow-[0_30px_60px_rgba(0,0,0,0.03)]`} />

              {/* The Hovering Sneaker */}
              <motion.div 
                className="relative z-20 w-[380px] h-[220px] -mt-10"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                <SneakerImages activeIdx={colorIdx} />
              </motion.div>

              {/* 3D Pedestal */}
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

            {/* RIGHT SIDE: Content & Buy Button */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, filter: 'blur(8px)', transition: { duration: 0.4 } }}
              className="absolute right-0 top-0 w-full lg:w-1/2 h-[85vh] flex flex-col justify-center pl-[5%] pr-[10%] z-40 pb-10"
            >
              <div className="max-w-xl">
                {/* Badge */}
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

                {/* Color Selector */}
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

                {/* Buy Now Button */}
                <motion.button
                  onClick={handleBuyClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full max-w-[340px] flex items-center justify-center text-white font-bold text-xl py-5 rounded-full transition-shadow focus:outline-none overflow-hidden"
                  style={{ backgroundColor: color.hex, boxShadow: `0 20px 40px -10px ${color.hex}90, inset 0 2px 0 rgba(255,255,255,0.2)` }}
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

      {/* ---------------- PACKING STATE: SEPARATE COMPONENT ---------------- */}
      {status === 'packing' && (
        <PackagingSequence 
          color={color} 
          activeColorIdx={colorIdx}
          colors={COLORS}
          onSequenceComplete={() => setStatus('success')} 
        />
      )}

      {/* ---------------- UPDATED SUCCESS MODAL (Matches new screenshots) ---------------- */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...SPRING_SNAP, delay: 0.1 }}
            className="fixed z-[100] w-full max-w-[480px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-zinc-900 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-zinc-100"
          >
            {/* Top Premium Gradient Line */}
            <div className="h-[6px] w-full bg-gradient-to-r from-[#4f3b82] via-[#10b981] to-[#10b981]" />

            <div className="p-8 pb-10">
              {/* Header Area */}
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

              {/* Product Summary Card (With colored background tint) */}
              <div 
                className="flex items-center gap-4 p-4 rounded-[20px] mb-10 shadow-sm"
                style={{ backgroundColor: color.hex + '1A' }} // Light tint of the selected shoe color
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

              {/* Animated Progress Timeline with Mini Van */}
              <div className="relative mb-10 mt-8 px-4">
                
                {/* Timeline Track Container */}
                <div className="relative h-[6px] w-full flex items-center">
                  {/* Background Gray Line */}
                  <div className="absolute w-full h-full bg-[#e5e0d8] rounded-full" />
                  
                  {/* Filled Animated Gradient Line */}
                  <motion.div 
                    className="absolute h-full bg-gradient-to-r from-[#10b981] to-[#5f4796] rounded-full origin-left z-0" 
                    initial={{ width: 0 }} 
                    animate={{ width: '55%' }} // Animates exactly past the middle dot
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }} 
                  />

                  {/* Nodes (Dots) */}
                  {/* Node 1: Packed */}
                  <div className="absolute left-0 w-4 h-4 bg-[#10b981] rounded-full border-[3px] border-white ring-2 ring-[#10b981]/30 z-10" />
                  <div className="absolute left-0 top-7 -translate-x-1/2 text-[#10b981] text-[13px] font-bold">Packed</div>

                  {/* Node 2: Shipped */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#10b981] rounded-full border-[3px] border-white ring-2 ring-[#10b981]/30 z-10" />
                  <div className="absolute left-1/2 top-7 -translate-x-1/2 text-[#10b981] text-[13px] font-bold">Shipped</div>

                  {/* Node 3: Arrives */}
                  <div className="absolute right-0 w-4 h-4 bg-[#d6d1c9] rounded-full border-[3px] border-white ring-2 ring-[#e5e0d8] z-10" />
                  <div className="absolute right-0 top-7 translate-x-4 text-zinc-800 text-[13px] font-bold w-max">Arrives Thu, 16 Jul</div>

                  {/* Moving Mini Van Icon */}
                  <motion.div 
                    className="absolute top-[-16px] z-20"
                    initial={{ left: '0%' }}
                    animate={{ left: '55%' }} // Drives perfectly on top of the gradient line
                    transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                  >
                    <svg className="w-5 h-5 text-zinc-900 -ml-2" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M236.7,112.5l-33.8-37.4A16,16,0,0,0,191,69.2H168V56a16,16,0,0,0-16-16H24A16,16,0,0,0,8,56V184a8,8,0,0,0,8,8H33.4a28,28,0,0,0,53.2,0h66.8a28,28,0,0,0,53.2,0H240a8,8,0,0,0,8-8V120A8,8,0,0,0,236.7,112.5ZM60,200a12,12,0,1,1,12-12A12,12,0,0,1,60,200Zm120,0a12,12,0,1,1,12-12A12,12,0,0,1,180,200ZM168,85.2h23l24.2,26.8H168Z"/>
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Animated Action Button (Order another) */}
              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-2 bg-white text-[#0f172a] border-[1.5px] border-zinc-200 py-[10px] px-6 rounded-full font-bold text-[14px] transition-colors w-max mt-14"
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