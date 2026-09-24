import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    title: 'Browse',
    desc: 'Scroll through categories — buttons, cards, forms, loaders, and more.',
    icon: '🔍',
  },
  {
    n: '02',
    title: 'Preview live',
    desc: 'Every component renders for real, right on the card. No guessing what it looks like.',
    icon: '👁️',
  },
  {
    n: '03',
    title: 'Copy & ship',
    desc: 'One click copies clean HTML + Tailwind. Paste it straight into your project.',
    icon: '🚀',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="categories"
      className="relative max-w-7xl mx-auto px-4 md:px-6 py-24 border-t border-border/70"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
        className="text-xs font-mono text-accent tracking-wider mb-3"
      >
        HOW IT WORKS
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl md:text-4xl font-bold text-ink max-w-lg mb-16 tracking-tight"
      >
        Three steps between you and shipped UI.
      </motion.h2>

      <div className="relative grid md:grid-cols-3 gap-6 md:gap-10">
        {/* Connecting line — desktop only, sits behind the badges */}
        <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-px">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="url(#step-line-gradient)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <defs>
              <linearGradient id="step-line-gradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#FF6B57" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group relative p-7 pt-8 rounded-2xl border border-border bg-panel/70 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_20px_45px_-15px_rgba(13,148,136,0.18)] hover:border-accent/30"
          >
            {/* Numbered badge circle — sits on the connecting line */}
            <div className="relative z-10 w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center mb-5 shadow-sm group-hover:border-accent/40 group-hover:shadow-[0_0_0_4px_rgba(13,148,136,0.08)] transition-all duration-300">
              <span className="font-display text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-coral">
                {s.n}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-base leading-none">{s.icon}</span>
              <h3 className="font-display font-bold text-lg text-ink">{s.title}</h3>
            </div>

            <p className="text-sm text-mist leading-relaxed">{s.desc}</p>

            {/* Subtle corner accent on hover */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/0 group-hover:bg-accent/[0.04] rounded-2xl transition-colors duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}