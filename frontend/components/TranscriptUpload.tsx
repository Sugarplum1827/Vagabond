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
        // Persist GPA to localStorage for the search page
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
      {/* Privacy Banner */}
      <div className="flex items-center gap-2 bg-[#edfaf3] text-[#1a8a4a] text-sm font-medium px-4 py-3 rounded-xl mb-5">
        <span>🔒</span>
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
                <div className="w-12 h-12 rounded-full border-4 border-[#e2e4ef] border-t-[#ff5c47] animate-spin" />
                <p className="text-[#6b7a99] font-medium">Extracting grades from {fileName}...</p>
                <p className="text-xs text-[#9ba3be]">This may take a moment</p>
              </div>
            ) : isDragActive ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl">📂</span>
                <p className="text-lg font-semibold text-[#ff5c47]">Drop it here</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="text-5xl">📄</span>
                <div>
                  <p className="text-lg font-semibold text-[#0d0d14]">
                    Drag &amp; drop your transcript
                  </p>
                  <p className="text-sm text-[#6b7a99] mt-1">
                    or{" "}
                    <span className="text-[#ff5c47] font-semibold underline underline-offset-2 cursor-pointer">
                      click to browse
                    </span>
                  </p>
                </div>
                <p className="text-xs text-[#9ba3be] font-mono bg-[#f4f5fa] px-3 py-1.5 rounded-lg">
                  PDF, JPG, PNG — max 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-start gap-3 bg-[#fff0ee] border border-[#ffccc7] text-[#cc2200] p-4 rounded-xl">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-sm">Extraction failed</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result?.success && (
        <div className="mt-4 animate-fade-up">
          {/* GPA Banner */}
          <div className="flex items-center justify-between bg-[#0d0d14] text-white px-6 py-5 rounded-2xl mb-4">
            <div>
              <p className="text-xs font-mono text-[#f5c842] uppercase tracking-widest mb-1">
                Extracted GPA
              </p>
              <p className="text-5xl font-bold">{result.gpa_4_0}</p>
              <p className="text-xs text-white/60 mt-1">on a 4.0 scale</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">
                {result.extracted_grades?.length || 0} subjects found
              </p>
              <p className="text-xs text-white/40 mt-0.5">{fileName}</p>
            </div>
          </div>

          {/* Grades Table */}
          {result.extracted_grades && result.extracted_grades.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-[#e2e4ef] bg-[#fafbff]">
                <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wider">
                  Extracted Grades
                </p>
              </div>
              <div className="divide-y divide-[#e2e4ef]">
                {result.extracted_grades.map((grade, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm font-medium text-[#0d0d14]">
                      {grade.subject}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-[#6b7a99]">
                        {grade.grade}/{grade.scale}
                      </span>
                      <span
                        className={`tag ${
                          grade.grade / grade.scale >= 0.9
                            ? "tag-green"
                            : grade.grade / grade.scale >= 0.8
                            ? "tag-gold"
                            : "tag-coral"
                        }`}
                      >
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
            <a href="/search" className="btn-primary flex-1">
              Find matching universities →
            </a>
            <button onClick={reset} className="btn-secondary px-4">
              Upload another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
