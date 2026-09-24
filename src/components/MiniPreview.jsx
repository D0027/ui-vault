import React from 'react';

const items = [
  { id: 'btn', node: <button className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors">Get started</button> },
  { id: 'badge', node: <span className="px-2.5 py-1 rounded-full bg-accent-soft text-accent text-xs font-medium border border-accent/20">Active</span> },
  { id: 'toggle', node: <div className="w-9 h-5 rounded-full bg-accent relative cursor-pointer"><div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" /></div> },
  { id: 'avatars', node: <div className="flex -space-x-2"><div className="w-6 h-6 rounded-full bg-accent/60 border-2 border-white" /><div className="w-6 h-6 rounded-full bg-coral/60 border-2 border-white" /><div className="w-6 h-6 rounded-full bg-ink/30 border-2 border-white" /></div> },
  { id: 'search', node: <div className="px-3 py-1.5 rounded-lg border border-border text-xs text-mist w-24 bg-white/50">Search...</div> },
  { id: 'skeleton', node: <div className="px-3 py-2 rounded-lg border border-border bg-white text-xs shadow-sm w-24"><div className="w-full h-2 rounded bg-panel-soft mb-1.5" /><div className="w-2/3 h-2 rounded bg-panel-soft" /></div> },
  { id: 'progress', node: <div className="w-20 h-1.5 rounded-full bg-panel-soft overflow-hidden"><div className="w-3/4 h-full bg-coral" /></div> },
  { id: 'tag', node: <span className="px-2 py-1 rounded-md bg-coral-soft text-coral text-[11px] font-mono">#gradient</span> },
];

export default function MiniPreview() {
  return (
    // 🚀 Added 'group' class to track hover state on the container
    <div className="relative w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] group">
      
      {/* 🚀 Added 'group-hover:[animation-play-state:paused]' and 'will-change-transform' */}
      <div className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
        
        {/* SET 1: Original Items */}
        {items.map((it) => (
          <div 
            key={`orig-${it.id}`} 
            className="shrink-0 flex items-center justify-center h-16 px-5 rounded-xl border border-border/50 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-border transition-all duration-300 cursor-default"
          >
            {it.node}
          </div>
        ))}

        {/* SET 2: Duplicate Items (for infinite loop) */}
        {/* 🚀 Added aria-hidden="true" so screen readers ignore the duplicates */}
        {items.map((it) => (
          <div 
            key={`dup-${it.id}`} 
            aria-hidden="true"
            className="shrink-0 flex items-center justify-center h-16 px-5 rounded-xl border border-border/50 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-border transition-all duration-300 cursor-default"
          >
            {it.node}
          </div>
        ))}
        
      </div>
    </div>
  );
}