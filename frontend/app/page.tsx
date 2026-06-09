import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FEATURES = [
  {
    icon: "📄",
    title: "Upload Transcript",
    desc: "Auto-extract your GPA from PDF or image transcripts. No manual entry needed.",
  },
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Filter universities by country, degree level, field of study, and budget.",
  },
  {
    icon: "🎯",
    title: "GPA Matching",
    desc: "Instantly see which universities you qualify for based on your extracted GPA.",
  },
  {
    icon: "🚀",
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
        <section className="relative overflow-hidden bg-[#0d0d14] text-white pt-24 pb-20 px-4">
          {/* decorative blobs */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at center, #ff5c47 0%, transparent 70%)",
            }}
          />
          <div className="page-container relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#f5c842] animate-pulse" />
              Free for Filipino students · No account required
            </div>

            <h1 className="font-display text-5xl md:text-7xl leading-none mb-6 max-w-4xl mx-auto">
              Find your university.{" "}
              <span className="text-[#ff5c47]">Anywhere.</span>
            </h1>

            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
              Upload your transcript, get your GPA automatically, and search
              universities worldwide — all in under 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload" className="btn-primary text-base py-3 px-8">
                Upload Transcript →
              </Link>
              <Link
                href="/search"
                className="btn-secondary text-base py-3 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white hover:border-white/30"
              >
                Browse Universities
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="bg-white border-b border-[#e2e4ef]">
          <div className="page-container">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e2e4ef]">
              {STATS.map((s) => (
                <div key={s.label} className="text-center py-6 px-4">
                  <p className="font-display text-3xl text-[#ff5c47]">{s.value}</p>
                  <p className="text-sm text-[#6b7a99] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="py-20 px-4">
          <div className="page-container">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-[#ff5c47] uppercase tracking-widest mb-3">
                How it works
              </p>
              <h2 className="font-display text-4xl text-[#0d0d14]">
                Three steps to your future
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="card p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{f.icon}</span>
                    <span className="font-mono text-xs text-[#c8cce0] group-hover:text-[#ff5c47] transition-colors">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#0d0d14] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#6b7a99] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Band ─── */}
        <section className="bg-[#ff5c47] py-16 px-4">
          <div className="page-container text-center text-white">
            <h2 className="font-display text-4xl mb-4">
              Start your journey today
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              No sign-up. No fee. Just upload your grades and find the university that&apos;s right for you.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-[#0d0d14] text-white font-semibold text-base py-3 px-8 rounded-xl hover:bg-black transition-colors"
            >
              Upload Transcript →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
