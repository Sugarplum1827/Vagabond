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
            <p className="text-xs font-semibold text-[#ff5c47] uppercase tracking-widest mb-2">
              Step 1
            </p>
            <h1 className="font-display text-4xl text-[#0d0d14] mb-3">
              Upload your transcript
            </h1>
            <p className="text-[#6b7a99]">
              We&apos;ll automatically extract your grades and calculate your GPA on a
              4.0 scale, ready for university matching.
            </p>
          </div>

          {/* Upload component */}
          <TranscriptUpload />

          {/* Tips */}
          <div className="mt-10 bg-white rounded-2xl border border-[#e2e4ef] p-6">
            <h3 className="font-semibold text-[#0d0d14] mb-3 text-sm">
              Tips for best results
            </h3>
            <ul className="space-y-2 text-sm text-[#6b7a99]">
              <li className="flex gap-2">
                <span>✔</span>
                <span>Use a clear, high-resolution scan or PDF export from your school</span>
              </li>
              <li className="flex gap-2">
                <span>✔</span>
                <span>Ensure all grade columns are visible — subject, numerical grade, and units</span>
              </li>
              <li className="flex gap-2">
                <span>✔</span>
                <span>Official transcripts work best; informal grade sheets may vary</span>
              </li>
              <li className="flex gap-2">
                <span>✔</span>
                <span>Files are deleted immediately after extraction — we store nothing</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
