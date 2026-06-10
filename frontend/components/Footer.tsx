export default function Footer() {
  return (
    <footer className="border-t border-[rgba(61,53,48,0.12)] mt-20"
      style={{ background: "rgba(232,224,204,0.5)" }}>
      <div className="page-container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-6 h-6 flex items-center justify-center rounded-sm text-[var(--parchment)] text-[10px] font-serif font-bold"
                style={{ background: "var(--ink)" }}
              >
                旅
              </span>
              <p className="font-display text-lg text-[var(--ink)]">Vagabond</p>
            </div>
            <p className="text-sm text-[var(--ink-pale)] mt-1 ml-8">
              Search scholarships &amp; universities worldwide for Filipino students
            </p>
          </div>

          {/* Vertical kanji decoration */}
          <div className="hidden md:flex flex-col items-center gap-1 opacity-20 select-none">
            {["旅","道","学","世","界"].map((k) => (
              <span key={k} className="font-serif text-xs text-[var(--ink-soft)]">{k}</span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-[var(--ink-pale)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[var(--ink-pale)] opacity-60" />
              No account required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[var(--ink-pale)] opacity-60" />
              Transcripts auto-deleted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[var(--ink-pale)] opacity-60" />
              100% free
            </span>
          </div>
        </div>

        <div className="brush-divider my-6" />

        <p className="text-xs text-[var(--ink-pale)] opacity-60 max-w-2xl">
          Data sourced from publicly available university information. Always verify requirements directly with institutions.
          Vagabond is not affiliated with any university.
        </p>
      </div>
    </footer>
  );
}
