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
  const [error, setError] = useState("");
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setFileName(file.name);
      setLoading(true);
      setError("");
      setResult(null);

      try {
        const data = await uploadTranscript(file);
        setResult(data);
        onResult?.(data);
        if (data.gpa_4_0) {
          localStorage.setItem("vagabond_gpa", String(data.gpa_4_0));
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } else {
          setError("Upload failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [onResult]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  });

  const reset = () => {
    setResult(null);
    setError("");
    setFileName("");
  };

  return (
    <div>
      {/* Privacy notice */}
      <div className="flex items-center gap-3 text-xs text-[var(--ink-pale)] px-4 py-3 rounded-sm mb-5"
        style={{ background: "rgba(30,100,55,0.06)", border: "1px solid rgba(30,100,55,0.15)" }}>
        <span className="font-serif text-base opacity-50">鍵</span>
        <span>Your transcript is processed securely. No file is stored after extraction.</span>
      </div>

      {/* Dropzone */}
      {!result && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="relative z-10">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[rgba(61,53,48,0.15)] border-t-[var(--brush-red)] animate-spin" />
                <p className="text-[var(--ink-pale)] text-sm font-medium">
                  Extracting grades from {fileName}…
                </p>
                <p className="text-xs text-[var(--mist)]">This may take a moment</p>
              </div>
            ) : isDragActive ? (
              <div className="flex flex-col items-center gap-2">
                <span className="font-serif text-4xl text-[var(--brush-red)] opacity-80">書</span>
                <p className="text-sm font-semibold text-[var(--brush-red)]">Drop it here</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="font-serif text-5xl text-[var(--ink)] opacity-15">文</span>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    Drag &amp; drop your transcript
                  </p>
                  <p className="text-xs text-[var(--ink-pale)] mt-1">
                    or{" "}
                    <span className="text-[var(--brush-red)] font-medium underline underline-offset-2 cursor-pointer">
                      click to browse
                    </span>
                  </p>
                </div>
                <p className="text-[10px] text-[var(--ink-pale)] font-mono bg-[rgba(61,53,48,0.05)] px-3 py-1.5 rounded-sm tracking-wider">
                  PDF · JPG · PNG — max 10 MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 px-4 py-3 rounded-sm text-xs"
          style={{ background: "rgba(139,26,15,0.06)", border: "1px solid rgba(139,26,15,0.2)", color: "var(--brush-red)" }}>
          <span className="font-serif text-base opacity-60">×</span>
          <div>
            <p className="font-semibold mb-0.5">Extraction failed</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result?.success && (
        <div className="mt-4 animate-ink-drop">
          {/* GPA Banner */}
          <div className="flex items-center justify-between px-6 py-5 rounded-sm mb-4"
            style={{ background: "var(--ink)" }}>
            <div>
              <p className="text-[10px] font-mono text-[var(--aged-gold-light)] uppercase tracking-[0.2em] mb-1.5">
                Extracted GPA
              </p>
              <p className="font-display text-5xl text-[var(--parchment)]">{result.gpa_4_0}</p>
              <p className="text-[10px] text-[rgba(242,237,223,0.4)] mt-1.5">on a 4.0 scale</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[rgba(242,237,223,0.5)]">
                {result.extracted_grades?.length || 0} subjects found
              </p>
              <p className="text-[10px] text-[rgba(242,237,223,0.3)] mt-1 font-mono">{fileName}</p>
              <span className="font-serif text-4xl text-[rgba(242,237,223,0.06)] block mt-2">合</span>
            </div>
          </div>

          {/* Grades Table */}
          {result.extracted_grades && result.extracted_grades.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-[rgba(61,53,48,0.1)]"
                style={{ background: "rgba(61,53,48,0.03)" }}>
                <p className="text-[10px] font-semibold text-[var(--ink-pale)] uppercase tracking-wider">
                  Extracted Grades
                </p>
              </div>
              <div className="divide-y divide-[rgba(61,53,48,0.07)]">
                {result.extracted_grades.map((grade, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <span className="text-xs font-medium text-[var(--ink)]">{grade.subject}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[var(--ink-pale)]">
                        {grade.grade}/{grade.scale}
                      </span>
                      <span className={`tag ${
                        grade.grade / grade.scale >= 0.9
                          ? "tag-green"
                          : grade.grade / grade.scale >= 0.8
                          ? "tag-gold"
                          : "tag-coral"
                      }`}>
                        {grade.grade / grade.scale >= 0.9
                          ? "Excellent"
                          : grade.grade / grade.scale >= 0.8
                          ? "Good"
                          : "Average"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <a href="/search" className="btn-primary flex-1 text-sm"
              style={{ background: "var(--brush-red)" }}>
              Find matching universities →
            </a>
            <button onClick={reset} className="btn-secondary px-4 text-sm">
              Upload another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
