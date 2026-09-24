import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { components } from '../data/components.jsx';

// UPDATE THIS ONE LINE once your repo is live — that's it, nothing else to change.
// Example: 'your-username/ui-vault'
const GITHUB_REPO = null; // e.g. 'dhruv/ui-vault'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [starCount, setStarCount] = useState(null);

  const githubUrl = GITHUB_REPO ? `https://github.com/${GITHUB_REPO}` : 'https://github.com';

  // Fetch live star count once a real repo is set
  useEffect(() => {
    if (!GITHUB_REPO) return;
    let cancelled = false;
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.stargazers_count === 'number') {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const navLinks = [
    { name: 'Components', href: '#components' },
    { name: 'Categories', href: '#categories' },
    { name: 'About', href: '#about' }
  ];

  // Detect scroll to trigger the glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track which section is currently in view for active nav highlight
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace('#', ''));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Cmd+K / Ctrl+K to open search, Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : 'unset';
    if (!searchOpen) setSearchQuery('');
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return components;
    return components.filter((c) => {
      const titleMatch = c.title.toLowerCase().includes(q);
      const tagMatch = c.tags.some((t) => t.toLowerCase().includes(q));
      return titleMatch || tagMatch;
    });
  }, [searchQuery]);

  const handleResultClick = () => {
    setSearchOpen(false);
    const el = document.getElementById('components');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-4 px-4 pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`relative flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]'
              : 'bg-transparent border border-transparent'
          }`}
        >
          {/* LEFT: Logo & Brand */}
          <a href="#" className="flex items-center gap-3 group relative z-10">
            <div className="w-8 h-8 rounded-[10px] bg-ink text-paper font-mono font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-105 group-hover:shadow-lg group-hover:bg-accent transition-all duration-300">
              V
            </div>
            <span className="font-display font-bold text-ink text-lg tracking-tight">
              UI Vault
            </span>
          </a>

          {/* CENTER: Magnetic Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 relative z-10">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-accent' : 'text-mist hover:text-ink'
                  }`}
                >
                  {hoveredLink === link.name && (
                    <motion.div
                      layoutId="navbar-hover-pill"
                      className="absolute inset-0 bg-panel-soft rounded-lg shadow-sm border border-border/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </div>

          {/* RIGHT: Action Controls */}
          <div className="hidden md:flex items-center gap-4 relative z-10">
            {/* Interactive Command Palette Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-12 px-3 py-1.5 rounded-lg bg-panel-soft/80 border border-border/60 hover:bg-white hover:border-border hover:shadow-sm transition-all duration-300"
            >
              <span className="text-sm text-mist group-hover:text-ink transition-colors">
                Search
              </span>
              <kbd className="flex items-center justify-center px-1.5 py-0.5 rounded bg-white border border-border/60 text-[10px] text-mist font-sans shadow-[0_2px_0_rgba(225,232,226,0.6)] group-hover:text-ink transition-colors">
                Ctrl K
              </kbd>
            </button>

            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-mist hover:text-ink transition-colors px-2"
            >
              GitHub
              {starCount !== null && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-panel-soft border border-border/60 text-[11px] text-ink font-mono">
                  ★ {starCount}
                </span>
              )}
            </a>

            <a
              href="#components"
              className="px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 transition-all shadow-[0_4px_12px_rgba(16,32,27,0.15)] hover:shadow-[0_6px_16px_rgba(16,32,27,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              Browse UI
            </a>
          </div>

          {/* MOBILE: Hamburger Button */}
          <button
            className="md:hidden relative z-50 p-2 text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="flex flex-col gap-1.5 items-end">
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-current rounded-full block transition-transform"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-0.5 bg-current rounded-full block transition-opacity"
              />
              <motion.span
                animate={
                  mobileMenuOpen
                    ? { rotate: -45, y: -8, width: 24 }
                    : { rotate: 0, y: 0, width: 16 }
                }
                className="h-0.5 bg-current rounded-full block transition-all"
              />
            </div>
          </button>
        </motion.nav>

        {/* MOBILE: Animated Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden md:hidden pointer-events-auto"
            >
              <div className="p-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl hover:bg-panel-soft text-ink font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="h-px w-full bg-border/50 my-2" />
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-panel-soft border border-border/60 text-ink font-medium w-full text-left"
                >
                  <span>Search components...</span>
                  <span className="text-xs text-mist">Ctrl K</span>
                </button>
                <div className="flex gap-2 mt-2">
                  <a
                    href={githubUrl}
                    className="flex-1 px-4 py-3 rounded-xl border border-border/60 text-ink text-center font-medium hover:bg-panel-soft transition-colors"
                  >
                    GitHub{starCount !== null ? ` (★ ${starCount})` : ''}
                  </a>
                  <a
                    href="#components"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-ink text-white text-center font-medium hover:bg-ink/90 transition-colors shadow-md"
                  >
                    Browse UI
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COMMAND PALETTE / SEARCH MODAL */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[200] pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-white rounded-2xl border border-border shadow-2xl z-[201] pointer-events-auto overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <span className="text-mist text-sm">Search</span>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search components..."
                  className="flex-1 bg-transparent outline-none text-sm text-ink placeholder-mist"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-panel-soft border border-border text-[10px] text-mist">
                  Esc
                </kbd>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-mist text-center py-8">
                    No components match "{searchQuery}"
                  </p>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={handleResultClick}
                      className="w-full flex flex-col items-start text-left px-3 py-2.5 rounded-xl hover:bg-panel-soft transition-colors"
                    >
                      <span className="text-sm font-medium text-ink">{item.title}</span>
                      <span className="text-xs text-mist">{item.category}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}