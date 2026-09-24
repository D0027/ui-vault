import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.5 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight * 0.35);

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute w-[38rem] h-[38rem] rounded-full opacity-[0.4]"
        style={{
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, rgba(13,148,136,0.28) 0%, rgba(255,107,87,0.14) 45%, transparent 70%)',
        }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-25 blur-2xl"
        style={{
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle, #FF6B57 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}