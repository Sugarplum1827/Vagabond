"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { uploadTranscript, TranscriptResult } from "@/lib/api";

interface Props {
  onResult?: (result: TranscriptResult) => void;
}

export default function TranscriptUpload({ onResult }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [result,  setResult]  = useState<TranscriptResult | null>(null);
  const [file,    setFile]    = useState<File | null>(null);

  const onDrop = useCallback(async (accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 1,
  });

  const handleAnalyse = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await uploadTranscript(file);
      setResult(data);
      onResult?.(data);
      if (data.gpa_4_0) localStorage.setItem("vagabond_gpa", String(data.gpa_4_0));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Analysis failed. Please try again.");
      } else {
        setError("Analysis failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div>
      {/* Dropzone — scroll frame style */}
      {!result && (
        <div
          {...getRootProps()}
          className={`drop-zone mb-6 ${isDragActive ? "over" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {/* Enso icon */}
            <div className="relative flex items-center justify-center w-16 h-16">
              <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
                <circle cx="32" cy="32" r="26" stroke="var(--ink-mid)" strokeWidth="1.5"
                  strokeDasharray="148 14" strokeLinecap="round"/>
              </svg>
              <span className="absolute text-2xl opacity-70">
                {loading ? (
                  <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="var(--ink-pale)" strokeWidth="2" strokeDasharray="60 20"/>
                  </svg>
                ) : "📄"}
              </span>
            </div>

            {loading ? (
              <>
                <p className="font-cinzel text-xs font-bold tracking-[0.15em] text-[var(--ink)] uppercase">
                  Analysing {file?.name}…
                </p>
                <p className="font-fell italic text-xs text-[var(--ink-pale)]">
                  Extracting your records
                </p>
              </>
            ) : isDragActive ? (
              <p className="font-cinzel text-xs font-bold tracking-[0.12em] text-[var(--red)] uppercase">
                Release to present your scroll
              </p>
            ) : (
              <>
                <p className="font-cinzel text-xs font-bold tracking-[0.12em] text-[var(--ink)] uppercase">
                  Drag &amp; Drop Your Transcript Here
                </p>
                <p className="font-fell italic text-xs text-[var(--ink-pale)]">or</p>
                <button className="btn-dark text-[10px] py-2.5 px-6">Choose File</button>
                <p className="font-cinzel text-[9px] tracking-[0.12em] text-[var(--ink-pale)] uppercase">
                  PDF · DOCX · TXT &nbsp;·&nbsp; Max file size: 20MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* YOUR SCROLL — file preview panel */}
      {file && !result && !loading && (
        <div className="mb-5">
          <h3 className="font-cinzel text-[10px] font-bold tracking-[0.22em] text-[var(--ink)] uppercase mb-3 text-center">
            Your Scroll
          </h3>
          <hr className="ink-rule mb-4" />
          <div className="border border-[rgba(180,155,120,0.5)] rounded-sm p-4 flex items-center justify-between gap-4"
            style={{ background: "rgba(200,185,155,0.3)" }}>
            <div className="flex items-center gap-3">
              {/* PDF icon */}
              <div className="w-10 h-12 rounded-sm flex items-end justify-center pb-1.5"
                style={{ background: "var(--red)", opacity: 0.85 }}>
                <span className="font-cinzel text-[8px] font-bold text-white tracking-wider">PDF</span>
              </div>
              <div>
                <p className="font-cinzel text-xs font-semibold text-[var(--ink)] truncate max-w-[160px]">
                  {file.name}
                </p>
                <p className="font-fell italic text-[10px] text-[var(--ink-pale)] mt-0.5">
                  Size: {(file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-cinzel text-[8px] tracking-[0.15em] text-[var(--ink-pale)] uppercase">Status</p>
              <p className="font-cinzel text-[10px] font-bold text-[var(--red)] tracking-wider mt-0.5">
                Ready for Analysis
              </p>
              {/* Checkmark circle */}
              <div className="ml-auto mt-1 w-6 h-6 rounded-full border-2 border-[var(--ink-mid)] flex items-center justify-center opacity-70">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.5l2 2 4-4" stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 text-xs font-cinzel tracking-wider text-[var(--red)] border border-[rgba(122,26,14,0.3)] rounded-sm"
          style={{ background: "rgba(122,26,14,0.05)" }}>
          {error}
        </div>
      )}

      {/* Begin Analysis button */}
      {file && !result && !loading && (
        <div className="flex flex-col items-center gap-3">
          <button onClick={handleAnalyse} className="btn-dark w-full justify-center gap-2">
            Begin Analysis
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="font-fell italic text-[10px] text-[var(--ink-pale)] flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="4" width="10" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M4 4V3a2 2 0 114 0v1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            Your data is private and secure.
          </p>
        </div>
      )}

      {/* Result */}
      {result?.success && (
        <div className="anim-ink-drop">
          {/* GPA display */}
          <div className="border border-[rgba(180,155,120,0.5)] rounded-sm p-6 mb-4 text-center"
            style={{ background: "rgba(28,21,16,0.95)" }}>
            <p className="font-cinzel text-[9px] tracking-[0.28em] text-[var(--gold)] uppercase mb-2">
              Extracted GPA
            </p>
            <p className="font-cinzel font-black text-6xl text-[var(--parch-light)] leading-none">
              {result.gpa_4_0}
            </p>
            <p className="font-fell italic text-[10px] text-[rgba(226,213,190,0.45)] mt-2">
              on a 4.0 scale · {result.extracted_grades?.length || 0} subjects extracted
            </p>
          </div>

          {/* Grades table */}
          {result.extracted_grades && result.extracted_grades.length > 0 && (
            <div className="border border-[rgba(180,155,120,0.45)] rounded-sm overflow-hidden mb-5">
              <div className="px-4 py-2.5 border-b border-[rgba(180,155,120,0.3)]"
                style={{ background: "rgba(180,155,120,0.2)" }}>
                <p className="font-cinzel text-[9px] tracking-[0.2em] text-[var(--ink-pale)] uppercase">
                  Extracted Grades
                </p>
              </div>
              <div className="divide-y divide-[rgba(180,155,120,0.2)]">
                {result.extracted_grades.map((g, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-2.5">
                    <span className="font-fell italic text-xs text-[var(--ink)]">{g.subject}</span>
                    <span className="font-cinzel text-[10px] font-bold text-[var(--ink-mid)] tracking-wider">
                      {g.grade}/{g.scale}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <a href="/search" className="btn-dark flex-1 justify-center" style={{ background: "var(--red)" }}>
              Discover Universities →
            </a>
            <button onClick={reset} className="btn-outline px-4">Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
