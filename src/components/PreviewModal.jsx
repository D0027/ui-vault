import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreviewModal({ selectedItem, onClose }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false); 
  const [isClosing, setIsClosing] = useState(false); 

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      setActiveTab('preview');
      setIsFullyOpen(false);
      setIsClosing(false); 
      
      // 🚀 Faster 3D load kyunki ab shrink animation nahi hai
      const timer = setTimeout(() => setIsFullyOpen(true), 200); 
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      setIsFullyOpen(false);
    }
  }, [selectedItem]);

  const handleCopy = () => {
    if (!selectedItem) return;
    navigator.clipboard.writeText(selectedItem.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimpleClose = () => {
    setIsClosing(true); 
    setTimeout(() => onClose(), 10); 
  };

  return (
    <AnimatePresence>
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          
          <motion.div 
            // 🚀 SIMPLE FIX: Ye hai wo smooth fade in / fade out!
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden pointer-events-auto flex flex-col"
          >
            
            <div className="flex-1 w-full h-full relative overflow-hidden bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px]">
              
              {/* PREVIEW TAB */}
              {activeTab === 'preview' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isFullyOpen && !isClosing ? (
                    <Suspense fallback={
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                         <p className="text-mist font-mono text-xs animate-pulse">Rendering 3D Experience...</p>
                      </div>
                    }>
                      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                        {selectedItem.component}
                      </div>
                    </Suspense>
                  ) : (
                     <div className="flex flex-col items-center gap-4">
                       <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                       <p className="text-mist font-mono text-xs animate-pulse">
                         {isClosing ? 'Closing...' : 'Setting up environment...'}
                       </p>
                     </div>
                  )}
                </motion.div>
              )}

              {/* CODE TAB */}
              {activeTab === 'code' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#0a0a0a] p-8 md:p-12 overflow-auto pb-32"
                >
                  <pre className="text-sm font-mono text-emerald-400">
                    <code>{selectedItem.code}</code>
                  </pre>
                </motion.div>
              )}
            </div>

            {/* BOTTOM NAVIGATION BAR */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ delay: 0.05 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[110] flex items-center p-1.5 bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            >
              
              <div className="hidden sm:flex items-center px-5 border-r border-white/10">
                 <span className="text-white font-medium text-sm whitespace-nowrap">{selectedItem.title}</span>
              </div>

              <div className="flex items-center gap-1 px-3 border-r border-white/10">
                {['preview', 'code'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="modal-tab-indicator"
                        className="absolute inset-0 bg-white/15 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span className="relative z-10 capitalize">{tab}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pl-3 pr-1">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent hover:bg-accent/80 text-white text-sm font-semibold transition-colors active:scale-95"
                >
                  {copied ? '✨ Copied' : '📋 Copy'}
                </button>
                
                <button 
                  onClick={handleSimpleClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 text-neutral-300 hover:text-white transition-all active:scale-95"
                >
                  ✕
                </button>
              </div>
              
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}