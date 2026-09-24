import { motion } from 'framer-motion';

export default function ComponentCard({ item, setSelectedId }) {
  return (
    <motion.div
      // 🚀 Yahan se layoutId hata diya hai!
      onClick={() => setSelectedId(item)}
      whileHover={{ y: -5 }}
      className="group relative cursor-pointer rounded-2xl p-2 bg-white/40 border border-white/60 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(13,148,136,0.1)] transition-all duration-300"
    >
      {/* Mini Preview Window */}
      <div className="relative w-full h-48 rounded-xl bg-panel-soft border border-border/50 overflow-hidden">
        {/* Fake browser chrome header */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-white/70 backdrop-blur-sm border-b border-border/40 flex items-center gap-1.5 px-3 z-10">
          <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
          <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
          <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
        </div>

        <div className="absolute inset-0 top-6 bg-[#0a0a0a]">
          {item.previewVideo ? (
            <video 
              src={item.previewVideo} 
              autoPlay loop muted playsInline 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
            />
          ) : (
            <img 
              src={item.previewImage || 'https://via.placeholder.com/800x600/111/444?text=Preview'} 
              alt={item.title} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
            />
          )}
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-panel-soft to-transparent pointer-events-none" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-300 flex items-center justify-center z-20">
          <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 px-4 py-2 rounded-full bg-white text-ink text-xs font-semibold shadow-lg">
            Click to preview →
          </span>
        </div>
      </div>

      {/* Card Metadata */}
      <div className="p-4">
        <h3 className="font-bold text-ink text-lg">{item.title}</h3>
        <p className="text-sm text-mist mt-1 line-clamp-2">{item.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium border border-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}