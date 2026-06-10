import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FEATURES = [
  {
    kanji: "書",
    title: "Upload Transcript",
    desc: "Auto-extract your GPA from PDF or image transcripts. No manual entry needed.",
  },
  {
    kanji: "探",
    title: "Smart Search",
    desc: "Filter universities by country, degree level, field of study, and budget.",
  },
  {
    kanji: "合",
    title: "GPA Matching",
    desc: "Instantly see which universities you qualify for based on your extracted GPA.",
  },
  {
    kanji: "道",
    title: "Direct Apply",
    desc: "One-click links straight to each university's official application portal.",
  },
];

const STATS = [
  { value: "20+", label: "Universities" },
  { value: "10+", label: "Countries" },
  { value: "0", label: "Cost to use" },
  { value: "100%", label: "Free & private" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden pt-24 pb-28 px-4"
          style={{ background: "var(--ink)" }}>

          {/* Parchment texture overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='600' height='600' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }} />

          {/* Large kanji watermark */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block">
            <span className="font-serif font-black text-[220px] leading-none text-white opacity-[0.03]">
              旅
            </span>
          </div>

          {/* Subtle ink-wash gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(139,26,15,0.08), transparent)" }} />

          <div className="page-container relative z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-10">
              <span className="w-6 h-px bg-[var(--aged-gold-light)] opacity-60" />
              <p className="text-[10px] font-mono text-[var(--aged-gold-light)] uppercase tracking-[0.25em] opacity-80">
                Free for Filipino students · No account required
              </p>
            </div>

            <div className="max-w-3xl">
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6 text-[var(--parchment)]">
                Find your university.{" "}
                <span style={{ color: "var(--aged-gold-light)" }}>Anywhere.</span>
              </h1>

              <p className="text-base text-[rgba(242,237,223,0.55)] max-w-lg mb-12 leading-relaxed font-light">
                Upload your transcript, get your GPA automatically, and discover
                universities worldwide — all in under two minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/upload" className="btn-primary text-sm py-3 px-7"
                  style={{ background: "var(--brush-red)", color: "var(--parchment)" }}>
                  Upload Transcript →
                </Link>
                <Link href="/search" className="btn-secondary text-sm py-3 px-7"
                  style={{
                    borderColor: "rgba(242,237,223,0.2)",
                    color: "rgba(242,237,223,0.75)",
                    background: "transparent"
                  }}>
                  Browse Universities
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats strip ─── */}
        <section style={{ background: "var(--parchment-dark)", borderBottom: "1px solid rgba(61,53,48,0.12)" }}>
          <div className="page-container">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(61,53,48,0.1)]">
              {STATS.map((s) => (
                <div key={s.label} className="text-center py-7 px-4">
                  <p className="font-display text-3xl text-[var(--brush-red)]">{s.value}</p>
                  <p className="text-xs text-[var(--ink-pale)] mt-1.5 tracking-wider uppercase font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="py-24 px-4">
          <div className="page-container">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-5 h-px bg-[var(--brush-red)] opacity-50" />
                <p className="text-[10px] font-mono text-[var(--brush-red)] uppercase tracking-[0.2em]">
                  How it works
                </p>
              </div>
              <h2 className="font-display text-4xl text-[var(--ink)] max-w-sm leading-tight">
                Your path, four steps
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="card p-6 group">
                  <div className="flex items-start justify-between mb-5">
                    {/* Kanji glyph */}
                    <span
                      className="font-serif text-3xl font-bold leading-none text-[var(--ink)] group-hover:text-[var(--brush-red)] transition-colors"
                    >
                      {f.kanji}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--mist)] group-hover:text-[var(--aged-gold)] transition-colors tracking-widest">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif font-semibold text-[var(--ink)] mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-[var(--ink-pale)] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Band ─── */}
        <section className="py-20 px-4" style={{ background: "var(--ink)" }}>
          <div className="page-container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                {/* Vertical kanji accent */}
                <div className="flex items-center gap-5">
                  <div className="hidden md:flex flex-col gap-0.5 opacity-20">
                    {["始","め","る"].map((k) => (
                      <span key={k} className="font-serif text-xs text-[var(--parchment)]">{k}</span>
                    ))}
                  </div>
                  <div>
                    <h2 className="font-display text-3xl md:text-4xl text-[var(--parchment)] mb-3">
                      Start your journey today
                    </h2>
                    <p className="text-sm text-[rgba(242,237,223,0.45)] max-w-sm leading-relaxed">
                      No sign-up. No fee. Upload your grades and find the university that&apos;s right for you.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/upload"
                className="btn-primary text-sm py-3 px-8 flex-shrink-0"
                style={{ background: "var(--brush-red)", color: "var(--parchment)" }}
              >
                Upload Transcript →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
