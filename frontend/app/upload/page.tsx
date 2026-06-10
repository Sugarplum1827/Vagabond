import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TranscriptUpload from "@/components/TranscriptUpload";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Present Your Scroll — Vagabond",
  description: "Upload your academic transcript to begin your journey",
};

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--parch-light)" }}>
      <Header />
      <main className="flex-1 relative overflow-hidden">

        {/* Parchment gradient bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, #D8C9AD 0%, #CEBFA0 50%, #C4B394 100%)" }} />

        {/* Ink splash top corners */}
        <div className="absolute top-0 left-0 w-40 h-40 pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle at 10% 10%, #1C1510 0%, transparent 70%)" }} />
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle at 90% 5%, #1C1510 0%, transparent 65%)" }} />

        {/* Samurai silhouette */}
        <div className="absolute right-8 top-0 bottom-0 w-[38%] flex items-center justify-end pointer-events-none hidden lg:flex">
          <svg viewBox="0 0 320 500" width="320" height="500" className="opacity-[0.75]"
            style={{ filter: "contrast(1.3)" }}>
            <ellipse cx="175" cy="370" rx="65" ry="115" fill="#2A1E14" opacity="0.88"/>
            <ellipse cx="172" cy="130" rx="85" ry="20" fill="#1C1510"/>
            <ellipse cx="172" cy="124" rx="46" ry="14" fill="#2A1E14"/>
            <ellipse cx="172" cy="152" rx="27" ry="32" fill="#1C1510" opacity="0.9"/>
            <path d="M150 170 Q133 230 130 305 Q128 345 133 385" stroke="#1C1510" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M196 170 Q205 225 202 280 Q200 335 197 375" stroke="#1C1510" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6"/>
            <rect x="214" y="265" width="3.5" height="165" rx="2" fill="#1C1510" transform="rotate(-7 214 265)" opacity="0.85"/>
            <rect x="206" y="298" width="14" height="5" rx="2" fill="#2A1E14" transform="rotate(-7 206 298)"/>
            <circle cx="140" cy="115" r="2.5" fill="#1C1510" opacity="0.4"/>
            <circle cx="255" cy="155" r="1.8" fill="#1C1510" opacity="0.3"/>
            <circle cx="260" cy="138" r="3.5" fill="#1C1510" opacity="0.25"/>
            <rect x="260" y="85" width="14" height="260" rx="7" fill="#1C1510" opacity="0.18"/>
            <ellipse cx="267" cy="88" rx="24" ry="62" fill="#1C1510" opacity="0.15"/>
            <ellipse cx="175" cy="488" rx="105" ry="20" fill="#1C1510" opacity="0.12"/>
          </svg>
        </div>

        {/* Left vertical kanji */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
          <div className="kanji-rail text-[11px]">一歩一歩が道をつくる</div>
          <div className="mt-4 w-6 h-6 border-2 border-[var(--red)] flex items-center justify-center mx-auto opacity-50">
            <span className="font-jp text-[8px] text-[var(--red)] font-bold">練</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 py-14 pl-16 pr-4 lg:pr-[44%]">
          <div className="max-w-lg">
            {/* Subtitle */}
            <p className="font-jp text-xs text-[var(--red)] tracking-[0.2em] mb-2 opacity-80">
              旅 の 記録
            </p>
            <h1 className="font-cinzel font-black text-3xl text-[var(--ink)] tracking-[0.08em] uppercase mb-2">
              Present Your Scroll
            </h1>
            <hr className="ink-rule mb-4" style={{ width: "140px" }} />
            <p className="font-fell italic text-[var(--ink-mid)] text-sm mb-8 leading-relaxed">
              Upload your academic records<br/>and begin your journey.
            </p>

            <TranscriptUpload />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
