import { motion } from 'framer-motion';

export default function Sidebar({ categories, active, setActive, counts, total }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-56 shrink-0 hidden md:flex flex-col gap-1 py-10 pr-4 border-r border-border sticky top-16 self-start"
    >
      <div className="px-3 mb-4">
        <p className="text-xs font-semibold text-mist uppercase tracking-wider">Categories</p>
      </div>

      <button
        onClick={() => setActive('All')}
        className={`relative text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between ${
          active === 'All' ? 'text-accent' : 'text-mist hover:bg-panel-soft hover:text-ink'
        }`}
      >
        {active === 'All' && (
          <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-accent-soft rounded-lg" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
        )}
        <span className="relative z-10">All components</span>
        <span className="relative z-10 opacity-70">{total}</span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`relative text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between ${
            active === cat ? 'text-accent' : 'text-mist hover:bg-panel-soft hover:text-ink'
          }`}
        >
          {active === cat && (
            <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-accent-soft rounded-lg" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
          )}
          <span className="relative z-10">{cat}</span>
          <span className="relative z-10 opacity-70">{counts[cat]}</span>
        </button>
      ))}
    </motion.aside>
  );
}