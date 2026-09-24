import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Hero({ total = 14 }) {
  const [activeTab, setActiveTab] = useState('preview');

  // 3D Tilt Physics for the inner card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.3]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative pt-32 pb-20 max-w-7xl mx-auto px-4 md:px-6 w-full z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: Main Value Proposition */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-soft border border-accent/20 text-accent text-xs font-semibold shadow-[0_0_15px_rgba(13,148,136,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {total}+ Free Production Components
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.1]">
            Copy-paste UI, <br />
            {/* Animated Shimmer Text */}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-ink via-mist to-ink bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
              without the design tax.
            </span>
          </h1>

          <p className="text-mist text-base sm:text-lg max-w-xl leading-relaxed">
            A free, open-source vault of hand-crafted Tailwind & Framer Motion components. Preview live, hit copy, and ship your next idea faster.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
            {/* Advanced Glow Button */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-emerald-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <a
                href="#components"
                className="relative flex items-center justify-center px-6 py-3.5 rounded-xl bg-accent text-white font-medium text-sm transition-all group-hover:scale-[1.02] group-active:scale-95"
              >
                Browse Components
              </a>
            </div>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-panel border border-border text-ink font-medium text-sm hover:bg-panel-soft transition-all hover:shadow-md active:scale-95"
            >
              Star on GitHub
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Code Preview Window with Apple Glow */}
        <div className="lg:col-span-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl p-4 sm:p-6 border border-white/80 bg-white/60 backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(13,148,136,0.25)] relative overflow-hidden"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm" />
              </div>

              <div className="relative flex bg-white/50 backdrop-blur-sm p-1 rounded-lg border border-border/50 text-xs font-medium shadow-inner">
                {['preview', 'code'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-1.5 rounded-md z-10 transition-colors duration-300 ${
                      activeTab === tab ? 'text-ink' : 'text-mist hover:text-ink/70'
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="active-tab-indicator"
                        className="absolute inset-0 bg-white rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-border/40"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span className="relative z-20 capitalize">
                      {tab === 'preview' ? 'Live Preview' : 'JSX Code'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Window Body */}
            <div className="pt-6 min-h-[280px] flex items-center justify-center [perspective:1000px]">
              {activeTab === 'preview' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-4 py-10 bg-gradient-to-br from-paper/30 to-panel/10 rounded-xl border border-dashed border-border/60 relative"
                >
                  
                  {/* 3D Interactive Card Component */}
                  <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="relative p-6 rounded-2xl bg-white border border-border/80 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] flex items-center gap-4 cursor-pointer group"
                  >
                    {/* Dynamic Glare Overlay */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-b from-white/80 to-transparent"
                      style={{ opacity: glareOpacity, y: glareY }}
                    />
                    
                    <motion.div 
                      style={{ transform: "translateZ(40px)" }}
                      className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xl shadow-inner"
                    >
                      ✨
                    </motion.div>
                    
                    <motion.div style={{ transform: "translateZ(30px)" }}>
                      <h4 className="font-bold text-base text-ink">3D Spatial Card</h4>
                      <p className="text-xs text-mist mt-0.5">Move your cursor to tilt</p>
                    </motion.div>
                  </motion.div>

                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="w-full relative rounded-xl overflow-hidden border border-border/60 shadow-inner"
                >
                  <div className="absolute top-0 left-0 w-full h-8 bg-panel-soft/80 border-b border-border/50 flex items-center px-4">
                    <span className="text-[10px] font-mono text-mist uppercase tracking-widest">TiltCard.jsx</span>
                  </div>
                  <pre className="w-full text-left font-mono text-[11px] leading-relaxed text-ink/80 pt-12 pb-4 px-4 bg-panel-soft/50 overflow-x-auto">
                    <code>{`<motion.div\n  style={{ rotateX, rotateY }}\n  onMouseMove={handleMouse}\n  className="glass-card"\n>\n  {/* Content here */}\n</motion.div>`}</code>
                  </pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}