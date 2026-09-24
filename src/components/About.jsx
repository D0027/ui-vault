import { motion } from 'framer-motion';
import { Code2, Zap, Heart, Star } from 'lucide-react';

const points = [
  {
    icon: Code2,
    title: 'Copy-paste ready',
    text: 'Every component is hand-crafted with Tailwind and Framer Motion. Preview it live, copy the JSX, and drop it into your project.',
  },
  {
    icon: Zap,
    title: 'Built for speed',
    text: 'Skip the design tax. Ship polished, animated UI in minutes instead of spending days on details.',
  },
  {
    icon: Heart,
    title: 'Free and open source',
    text: 'No paywalls, no sign-ups. UI Vault is free to use and open to contributions from everyone.',
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-6 py-20 w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs tracking-widest text-accent uppercase mb-3">
          About
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink max-w-2xl">
          A vault of UI you can actually ship.
        </h2>
        <p className="text-mist mt-4 max-w-2xl leading-relaxed">
          UI Vault is a growing collection of interactive React components,
          from 3D checkouts to playful login screens. Everything is built to be
          copied, customized, and used in real projects.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
        {points.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="rounded-2xl bg-panel border border-border p-6 hover:-translate-y-1 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-4">
              <Icon size={20} />
            </div>
            <h3 className="font-display font-semibold text-ink mb-2">{title}</h3>
            <p className="text-sm text-mist leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </div>

      <motion.a
        href="https://github.com/D0027"
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 mt-10 px-5 py-2.5 rounded-lg bg-ink text-white text-sm font-medium"
      >
        <Star size={16} /> Star on GitHub
      </motion.a>
    </section>
  );
}