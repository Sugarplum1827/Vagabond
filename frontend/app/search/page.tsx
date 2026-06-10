"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import Results from "@/components/Results";
import { searchUniversities, pingBackend, University } from "@/lib/api";

interface Filters {
  query: string;
  country: string;
  degree_level: string;
  field: string;
  max_budget: string;
}

const DEFAULT_FILTERS: Filters = {
  query: "",
  country: "",
  degree_level: "",
  field: "",
  max_budget: "",
};

export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [universities, setUniversities] = useState<University[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState("");
  const [userGPA, setUserGPA] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("vagabond_gpa");
    if (stored) setUserGPA(parseFloat(stored));
  }, []);

  useEffect(() => {
    const init = async () => {
      setWaking(true);
      await pingBackend();
      setWaking(false);
      doSearch();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await searchUniversities({
        query: filters.query || undefined,
        country: filters.country || undefined,
        degree_level: filters.degree_level || undefined,
        field: filters.field || undefined,
        max_budget: filters.max_budget ? Number(filters.max_budget) : undefined,
      });
      setUniversities(data.results);
      setTotal(data.total);
    } catch {
      setError(
        "Could not reach the server. It may be starting up — please wait a moment and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const clearGPA = () => {
    localStorage.removeItem("vagabond_gpa");
    setUserGPA(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-4">
        <div className="page-container">

          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-5 h-px bg-[var(--brush-red)] opacity-50" />
              <p className="text-[10px] font-mono text-[var(--brush-red)] uppercase tracking-[0.2em]">
                University Search
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div>
                <h1 className="font-display text-4xl text-[var(--ink)] leading-tight">
                  Find your university
                </h1>
                <p className="text-sm text-[var(--ink-pale)] mt-1.5">
                  Filter by country, degree level, field, and budget.
                </p>
              </div>

              {userGPA && (
                <div className="sm:ml-auto flex items-center gap-3 px-4 py-2.5 rounded-sm"
                  style={{ background: "rgba(184,150,12,0.08)", border: "1px solid rgba(184,150,12,0.2)" }}>
                  <div>
                    <p className="text-[10px] text-[#9A7A00] uppercase tracking-wider font-medium">Your GPA</p>
                    <p className="font-serif font-bold text-lg text-[#7A6200] leading-none mt-0.5">{userGPA}</p>
                  </div>
                  <button
                    onClick={clearGPA}
                    className="text-[#B8960C] hover:text-[#7A6200] text-lg leading-none ml-1"
                    title="Clear GPA"
                  >
                    ×
                  </button>
                </div>
              )}

              {!userGPA && (
                <a
                  href="/upload"
                  className="sm:ml-auto text-xs text-[var(--ink-pale)] underline underline-offset-2 hover:text-[var(--brush-red)] transition-colors"
                >
                  Upload transcript for GPA matching →
                </a>
              )}
            </div>
          </div>

          <div className="brush-divider mb-6" />

          {/* Waking up banner */}
          {waking && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-sm text-xs"
              style={{ background: "rgba(184,150,12,0.07)", border: "1px solid rgba(184,150,12,0.2)", color: "#7A6200" }}>
              <span className="w-3.5 h-3.5 border-2 border-[rgba(184,150,12,0.3)] border-t-[#B8960C] rounded-full animate-spin flex-shrink-0" />
              <span>Server is waking up — this can take up to 30 seconds on the free tier…</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-68 flex-shrink-0" style={{ width: "272px" }}>
              <SearchForm
                filters={filters}
                onChange={setFilters}
                onSearch={doSearch}
                loading={loading || waking}
              />
            </div>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {error && (
                <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-sm text-xs"
                  style={{ background: "rgba(139,26,15,0.06)", border: "1px solid rgba(139,26,15,0.2)", color: "var(--brush-red)" }}>
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              )}
              <Results
                universities={universities}
                total={total}
                loading={loading || waking}
                userGPA={userGPA}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
