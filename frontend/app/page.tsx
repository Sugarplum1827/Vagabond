import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ── Inline SVG ink-splash dots ── */
function InkDot({ size, top, left, right, opacity = 0.18 }: {
  size: number; top?: string; left?: string; right?: string; opacity?: number;
}) {
  return (
    <span className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        top, left, right,
        background: "#1C1510",
        opacity,
        filter: "blur(1px)",
      }} />
  );
}

/* ── Enso circle stat ── */
function Stat({ kanji, value, label }: { kanji: string; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 px-6">
      <span className="font-jp text-4xl font-black text-[var(--ink)]">{kanji}</span>
      {/* Enso — hand-drawn circle feel */}
      <span className="relative flex items-center justify-center w-5 h-5">
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="var(--red)" strokeWidth="1.8"
            strokeDasharray="42 4" strokeLinecap="round"/>
        </svg>
      </span>
      <div className="text-center">
        <p className="font-cinzel text-2xl font-bold text-[var(--ink)] tracking-wider">{value}</p>
        <p className="font-cinzel text-[9px] tracking-[0.2em] text-[var(--ink-pale)] uppercase mt-1">{label}</p>
      </div>
    </div>
  );
}

const STEPS = [
  { n: "01", icon: "📄", title: "UPLOAD\nTRANSCRIPT", desc: "Present your records." },
  { n: "02", icon: "🧠", title: "GPA\nANALYSIS",   desc: "Our system interprets your achievements." },
  { n: "03", icon: "🌍", title: "DISCOVER\nUNIVERSITIES", desc: "Explore institutions across the world." },
  { n: "04", icon: "⛩️", title: "BEGIN YOUR\nJOURNEY", desc: "Apply directly and take the next step." },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--parch-light)" }}>
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "540px" }}>
        {/* Parchment bg */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #D8C9AD 0%, #CEBFA0 40%, #C4B394 100%)" }} />

        {/* Ink splash background top-right */}
        <div className="absolute top-0 right-0 w-[55%] h-full pointer-events-none"
          style={{ opacity: 0.12,
            background: "radial-gradient(ellipse at 80% 20%, #1C1510 0%, transparent 65%)" }} />

        {/* Samurai silhouette SVG — ink-wash style */}
        <div className="absolute right-0 top-0 bottom-0 w-[52%] flex items-center justify-end pointer-events-none">
          <svg viewBox="0 0 400 560" width="400" height="560" className="opacity-[0.82]"
            style={{ filter: "contrast(1.3) brightness(0.85)" }}>
            {/* Body/robes */}
            <ellipse cx="220" cy="420" rx="80" ry="130" fill="#2A1E14" opacity="0.9"/>
            {/* Wide-brim hat */}
            <ellipse cx="215" cy="148" rx="95" ry="22" fill="#1C1510"/>
            <ellipse cx="215" cy="142" rx="55" ry="16" fill="#2A1E14"/>
            {/* Head */}
            <ellipse cx="215" cy="175" rx="32" ry="38" fill="#1C1510" opacity="0.9"/>
            {/* Long hair */}
            <path d="M190 195 Q170 260 165 340 Q162 380 168 420" stroke="#1C1510" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M245 195 Q255 250 252 310 Q250 370 245 420" stroke="#1C1510" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.6"/>
            {/* Katana */}
            <rect x="268" y="300" width="4" height="180" rx="2" fill="#1C1510" transform="rotate(-8 268 300)" opacity="0.85"/>
            <rect x="258" y="340" width="16" height="6" rx="2" fill="#2A1E14" transform="rotate(-8 258 340)"/>
            {/* Robe sash */}
            <ellipse cx="218" cy="340" rx="30" ry="8" fill="#3A2A1C" opacity="0.5"/>
            {/* Ink splatter marks */}
            <circle cx="180" cy="130" r="3" fill="#1C1510" opacity="0.4"/>
            <circle cx="310" cy="180" r="2" fill="#1C1510" opacity="0.3"/>
            <circle cx="330" cy="160" r="4" fill="#1C1510" opacity="0.25"/>
            <circle cx="155" cy="200" r="2.5" fill="#1C1510" opacity="0.35"/>
            <circle cx="160" cy="215" r="1.5" fill="#1C1510" opacity="0.3"/>
            {/* Trees behind */}
            <rect x="320" y="100" width="18" height="300" rx="9" fill="#1C1510" opacity="0.2"/>
            <ellipse cx="329" cy="105" rx="28" ry="70" fill="#1C1510" opacity="0.18"/>
            <rect x="350" y="150" width="12" height="250" rx="6" fill="#1C1510" opacity="0.15"/>
            {/* Ground mist */}
            <ellipse cx="230" cy="545" rx="130" ry="25" fill="#1C1510" opacity="0.12"/>
          </svg>
        </div>

        {/* Ink dots scattered */}
        <InkDot size={6}  top="18%" left="45%"  opacity={0.2}/>
        <InkDot size={3}  top="12%" left="48%"  opacity={0.15}/>
        <InkDot size={8}  top="8%"  left="52%"  opacity={0.12}/>
        <InkDot size={4}  top="22%" right="46%" opacity={0.18}/>
        <InkDot size={5}  top="35%" right="44%" opacity={0.14}/>

        {/* Left vertical kanji rail */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="kanji-rail text-[11px]">全ての旅は一歩から始まる</div>
          {/* Seal stamp */}
          <div className="mt-4 w-7 h-7 border-2 border-[var(--red)] flex items-center justify-center mx-auto opacity-60">
            <span className="font-jp text-[10px] text-[var(--red)] font-bold">辣</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 site-wrap pt-16 pb-20 pl-20">
          <div className="max-w-[48%]">
            <h1 className="font-cinzel font-black text-[var(--ink)] leading-[1.0] mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.5rem)" }}>
              FORGE YOUR<br/>PATH BEYOND<br/>BORDERS.
            </h1>
            <hr className="ink-rule mb-5" />
            <p className="font-fell text-[var(--ink-mid)] text-base mb-8 leading-relaxed max-w-xs italic">
              Upload your transcript and discover universities across the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/upload" className="btn-dark gap-2">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 9V2M3 5l3.5-3L10 5M1 11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Begin Journey
              </Link>
              <Link href="/search" className="btn-outline gap-2">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M6.5 3.5v1M6.5 9V8M3.5 6.5h1M9.5 6.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
                </svg>
                Explore Paths
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="stats-strip">
        <div className="site-wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[rgba(28,21,16,0.12)]">
            <Stat kanji="旅" value="20+"    label="Destinations" />
            <Stat kanji="道" value="10+"    label="Nations"      />
            <Stat kanji="無" value="Zero"   label="Cost"         />
            <Stat kanji="誠" value="Private &amp; Secure" label="&amp; Secure" />
          </div>
        </div>
        {/* Mountain silhouette at bottom of stats */}
        <div className="w-full overflow-hidden h-10 pointer-events-none" style={{ marginTop: "-4px" }}>
          <svg viewBox="0 0 1200 40" width="100%" preserveAspectRatio="none" className="opacity-[0.08]">
            <path d="M0 40 L200 10 L280 22 L400 5 L500 18 L620 2 L720 16 L840 8 L960 20 L1080 6 L1200 15 L1200 40 Z" fill="#1C1510"/>
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 relative overflow-hidden">
        {/* Subtle bg */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ background: "radial-gradient(ellipse at center, #1C1510 0%, transparent 70%)" }} />

        <div className="site-wrap">
          {/* Section heading with enso */}
          <div className="flex flex-col items-center mb-14">
            <div className="relative flex items-center justify-center mb-3">
              <svg viewBox="0 0 80 80" width="72" height="72" fill="none" className="opacity-50">
                <path d="M40 8 C18 8 8 24 8 40 C8 58 22 72 40 72 C58 72 72 56 70 38 C68 22 58 12 44 10"
                  stroke="#1C1510" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              {/* Tiny samurai seal inside enso */}
              <span className="absolute font-jp text-[11px] text-[var(--red)] font-bold border border-[var(--red)] w-5 h-5 flex items-center justify-center"
                style={{ fontSize: "8px" }}>侍</span>
            </div>
            <h2 className="font-cinzel text-2xl font-bold tracking-[0.25em] text-[var(--ink)] uppercase">
              How It Works
            </h2>
          </div>

          {/* Scroll cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex flex-col items-center">
                <div className="scroll-card w-full px-5 pt-10 pb-10 flex flex-col items-center gap-4 mx-3">
                  <span className="font-cinzel text-xs text-[var(--ink-pale)] tracking-widest">{step.n}</span>
                  {/* Icon in enso */}
                  <div className="relative flex items-center justify-center w-16 h-16">
                    <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
                      <circle cx="32" cy="32" r="27" stroke="var(--ink)" strokeWidth="1.5"
                        strokeDasharray="156 12" strokeLinecap="round"/>
                    </svg>
                    <span className="absolute text-2xl">{step.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className="font-cinzel text-xs font-bold tracking-[0.12em] text-[var(--ink)] whitespace-pre-line leading-relaxed uppercase">
                      {step.title}
                    </p>
                    <p className="font-fell italic text-xs text-[var(--ink-pale)] mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {/* Arrow between cards */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute"
                    style={{ transform: `translateX(${i === 0 ? "284px" : i === 1 ? "570px" : "855px"}) translateY(-200px)` }}>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Arrows between scroll cards — positioned manually */}
          <div className="hidden lg:flex justify-around px-20 mt-[-200px] mb-[160px] pointer-events-none relative z-10">
            {[0,1,2].map(i => (
              <span key={i} className="font-cinzel text-2xl text-[var(--ink-pale)] opacity-50 mt-[-20px]">→</span>
            ))}
          </div>
        </div>

        {/* Ink splatter decoration */}
        <div className="absolute bottom-8 left-8 pointer-events-none opacity-15">
          <svg viewBox="0 0 60 60" width="60" height="60" fill="#1C1510">
            <circle cx="30" cy="30" r="14"/>
            <circle cx="10" cy="20" r="4"/>
            <circle cx="50" cy="15" r="5"/>
            <circle cx="48" cy="45" r="3"/>
            <circle cx="5"  cy="48" r="6"/>
            <circle cx="20" cy="52" r="2"/>
          </svg>
        </div>
      </section>

      {/* ── QUOTE FOOTER BAND ── */}
      <section className="py-14 relative overflow-hidden"
        style={{ background: "var(--parch-dark)", borderTop: "1px solid rgba(28,21,16,0.2)" }}>
        {/* Mountain range silhouette left */}
        <div className="absolute left-0 bottom-0 pointer-events-none opacity-20">
          <svg viewBox="0 0 220 120" width="220" height="120" fill="#1C1510">
            <path d="M0 120 L40 50 L70 75 L110 20 L150 60 L190 35 L220 55 L220 120 Z"/>
          </svg>
        </div>
        {/* Bonsai silhouette right */}
        <div className="absolute right-12 bottom-0 pointer-events-none opacity-20">
          <svg viewBox="0 0 100 130" width="100" height="130" fill="#1C1510">
            <rect x="45" y="80" width="10" height="50" rx="5"/>
            <ellipse cx="50" cy="60" rx="35" ry="50"/>
            <ellipse cx="20" cy="55" rx="20" ry="30"/>
            <ellipse cx="80" cy="50" rx="22" ry="32"/>
          </svg>
        </div>

        <div className="site-wrap flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-fell italic text-[var(--ink-mid)] text-base leading-relaxed max-w-lg">
              &ldquo;The world is wide, and the path is long.<br/>
              Walk with purpose, and let your journey write your story.&rdquo;
            </p>
            <p className="font-cinzel text-[9px] tracking-[0.35em] text-[var(--ink-pale)] mt-3 uppercase">
              — Vagabond —
            </p>
          </div>
          {/* 浪人 seal */}
          <div className="flex flex-col items-center gap-0.5 opacity-55">
            <span className="font-jp text-5xl font-black text-[var(--ink)] leading-none">浪</span>
            <span className="font-jp text-5xl font-black text-[var(--ink)] leading-none">人</span>
            <div className="w-8 h-8 border-2 border-[var(--red)] flex items-center justify-center mt-1">
              <span className="font-jp text-[9px] text-[var(--red)] font-bold">印</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
