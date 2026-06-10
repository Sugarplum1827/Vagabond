export default function Footer() {
  return (
    <footer className="border-t border-[rgba(28,21,16,0.15)] py-6"
      style={{ background: "var(--parch-dark)" }}>
      <div className="site-wrap flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-jp text-xl font-black text-[var(--ink)] opacity-60">旅</span>
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-[var(--ink-pale)] uppercase">
            Vagabond · Free for Filipino Students
          </span>
        </div>
        <p className="font-cinzel text-[9px] text-[var(--ink-pale)] tracking-widest opacity-50">
          No data stored · No account required
        </p>
      </div>
    </footer>
  );
}
