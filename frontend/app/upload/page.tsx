import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TranscriptUpload from "@/components/TranscriptUpload";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Transcript — Vagabond",
  description: "Upload your transcript to automatically extract your GPA",
};

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="page-container max-w-2xl">

          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-5 h-px bg-[var(--brush-red)] opacity-50" />
              <p className="text-[10px] font-mono text-[var(--brush-red)] uppercase tracking-[0.2em]">
                Step 1 of 2
              </p>
            </div>
            <h1 className="font-display text-4xl text-[var(--ink)] mb-3 leading-tight">
              Upload your transcript
            </h1>
            <p className="text-sm text-[var(--ink-pale)] leading-relaxed max-w-md">
              We&apos;ll automatically extract your grades and calculate your GPA on a
              4.0 scale, ready for university matching.
            </p>
          </div>

          <div className="brush-divider mb-8" />

          {/* Upload component */}
          <TranscriptUpload />

          {/* Tips */}
          <div className="mt-10 card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif text-sm text-[var(--ink-pale)] opacity-40">助</span>
              <h3 className="text-xs font-semibold text-[var(--ink-pale)] uppercase tracking-wider">
                Tips for best results
              </h3>
            </div>
            <ul className="space-y-2.5">
              {[
                "Use a clear, high-resolution scan or PDF export from your school",
                "Ensure all grade columns are visible — subject, numerical grade, and units",
                "Official transcripts work best; informal grade sheets may vary",
                "Files are deleted immediately after extraction — we store nothing",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-xs text-[var(--ink-pale)] leading-relaxed">
                  <span className="text-[var(--brush-red)] opacity-50 flex-shrink-0 mt-0.5">—</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
