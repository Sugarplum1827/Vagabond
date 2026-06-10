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

const DEFAULT: Filters = { query: "", country: "", degree_level: "", field: "", max_budget: "" };

export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT);
  const [unis,    setUnis]    = useState<University[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [waking,  setWaking]  = useState(false);
  const [error,   setError]   = useState("");
  const [gpa,     setGpa]     = useState<number | null>(null);
  const [page,    setPage]    = useState(1);

  useEffect(() => {
    const s = localStorage.getItem("vagabond_gpa");
    if (s) setGpa(parseFloat(s));
  }, []);

  const doSearch = useCallback(async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await searchUniversities({
        query: filters.query || undefined,
        country: filters.country || undefined,
        degree_level: filters.degree_level || undefined,
        field: filters.field || undefined,
        max_budget: filters.max_budget ? Number(filters.max_budget) : undefined,
        limit: 8,
      });
      setUnis(data.results);
      setTotal(data.total);
      setPage(p);
    } catch {
      setError("Could not reach the server. Please wait a moment and try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    (async () => {
      setWaking(true);
      await pingBackend();
      setWaking(false);
      doSearch();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--parch-light)" }}>
      <Header />
      <main className="flex-1 relative overflow-hidden">

        {/* Parchment base */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(160deg, #D8C9AD 0%, #CEBFA0 60%, #C4B394 100%)" }} />

        {/* Ink splash corners */}
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-[0.09]"
          style={{ background: "radial-gradient(circle at 95% 5%, #1C1510 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-36 h-36 pointer-events-none opacity-[0.07]"
          style={{ background: "radial-gradient(circle at 5% 95%, #1C1510 0%, transparent 65%)" }} />
        {/* Tiny ink dots scattered */}
        {[[15,12],[78,8],[85,25],[92,18],[10,35]].map(([l,t],i) => (
          <span key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: 3+i, height: 3+i, left: `${l}%`, top: `${t}%`,
              background: "#1C1510", opacity: 0.08 + i * 0.02, filter: "blur(1px)" }} />
        ))}

        {/* Seal stamp bottom-right */}
        <div className="absolute bottom-8 right-8 pointer-events-none opacity-20 hidden lg:block">
          <div className="border-2 border-[var(--red)] w-12 h-12 flex items-center justify-center">
            <span className="font-jp text-xl font-black text-[var(--red)]">道</span>
          </div>
        </div>

        <div className="relative z-10 py-12 px-4">
          <div className="site-wrap">

            {/* Page heading */}
            <div className="text-center mb-10">
              <p className="font-jp text-xs text-[var(--red)] tracking-[0.18em] mb-2 opacity-80">
                道を見つける
              </p>
              <h1 className="font-cinzel font-black text-4xl text-[var(--ink)] tracking-[0.1em] uppercase mb-1">
                Discover Your Path
              </h1>
              <p className="font-fell italic text-sm text-[var(--ink-pale)]">
                Among The World&apos;s Great Schools
              </p>
            </div>

            {/* Search bar */}
            <div className="flex mb-10 max-w-2xl mx-auto shadow-sm">
              <span className="flex items-center px-3 border border-r-0 border-[rgba(180,155,120,0.5)] rounded-l-sm"
                style={{ background: "rgba(200,185,155,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="var(--ink-pale)" strokeWidth="1.3"/>
                  <path d="M10 10l2.5 2.5" stroke="var(--ink-pale)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Search for universities or programs…"
                value={filters.query}
                onChange={(e) => setFilters(f => ({ ...f, query: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
              />
              <button onClick={() => doSearch()}
                className="btn-dark rounded-l-none px-6 text-[10px] tracking-[0.18em]">
                Search
              </button>
            </div>

            {/* Waking banner */}
            {waking && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 border border-[rgba(196,149,42,0.35)] text-xs font-cinzel tracking-wider text-[var(--gold)] max-w-2xl mx-auto"
                style={{ background: "rgba(196,149,42,0.06)" }}>
                <svg className="animate-spin flex-shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22 6"/>
                </svg>
                Server is waking up — may take ~30 seconds on free tier…
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 border border-[rgba(122,26,14,0.3)] text-xs font-cinzel text-[var(--red)] max-w-2xl mx-auto"
                style={{ background: "rgba(122,26,14,0.05)" }}>
                ⚠ {error}
              </div>
            )}

            {/* Main grid: sidebar + results */}
            <div className="flex gap-8 items-start">

              {/* Filter sidebar */}
              <div className="w-48 flex-shrink-0 hidden lg:block">
                <SearchForm
                  filters={filters}
                  onChange={setFilters}
                  onSearch={() => doSearch()}
                  loading={loading || waking}
                />
              </div>

              {/* Results */}
              <div className="flex-1 min-w-0">
                <Results
                  universities={unis}
                  total={total}
                  loading={loading || waking}
                  userGPA={gpa}
                  page={page}
                  onPage={(p) => doSearch(p)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
