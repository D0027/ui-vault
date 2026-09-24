export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-ink flex items-center justify-center">
            <span className="text-white text-[10px] font-bold font-display">V</span>
          </div>
          <span className="font-display font-bold text-sm text-ink">UI Vault</span>
        </div>
        <p className="text-xs text-mist">Free forever. Built for developers who'd rather ship than style.</p>
        <div className="flex items-center gap-5 text-sm text-mist">
          <a href="#" className="hover:text-ink transition-colors">GitHub</a>
          <a href="#" className="hover:text-ink transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}