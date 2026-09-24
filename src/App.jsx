import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { components } from './data/components.jsx';
import ComponentCard from './components/ComponentCard.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';
import GlobalBackground from './components/GlobalBackground.jsx';
import PreviewModal from './components/PreviewModal.jsx';


function App() {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  
  // NEW: State to track which component is currently expanded
  const [selectedId, setSelectedId] = useState(null);

  const categories = useMemo(
    () => [...new Set(components.map((c) => c.category))].sort(),
    []
  );

  const counts = useMemo(() => {
    const c = {};
    for (const item of components) c[item.category] = (c[item.category] || 0) + 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    return components.filter((item) => {
      const matchCat = active === 'All' || item.category === active;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [active, query]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <GlobalBackground />
      <Navbar />
      <Hero total={components.length} />
      <HowItWorks />
      <About />

      <div id="components" className="max-w-7xl mx-auto px-4 md:px-6 flex gap-8 border-t border-border/70 w-full">
        <Sidebar
          categories={categories}
          active={active}
          setActive={setActive}
          counts={counts}
          total={components.length}
        />

        <main className="flex-1 py-10 min-w-0">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h2 className="font-display text-xl font-bold text-ink">
              {active === 'All' ? 'All components' : active}
            </h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components..."
              className="px-4 py-2.5 rounded-lg bg-panel border border-border text-ink text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent-soft transition-all w-full sm:w-64"
            />
          </div>

          <div className="flex gap-2 mb-6 md:hidden overflow-x-auto pb-1">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  active === cat
                    ? 'bg-accent text-white border-accent'
                    : 'border-border text-mist'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 rounded-2xl border border-dashed border-border">
              <p className="text-mist text-sm">
                {components.length === 0
                  ? 'No components yet — add your first one in src/data/components.jsx'
                  : `No components match "${query}" yet.`}
              </p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-16">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <ComponentCard 
                    key={item.id} 
                    item={item} 
                    delay={i * 0.03} 
                    setSelectedId={setSelectedId} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      <Footer />

      {/* NEW: Render the full-screen modal outside the main document flow */}
      <PreviewModal selectedItem={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}

export default App;