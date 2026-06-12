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
  const [filters,        setFilters]        = useState<Filters>(DEFAULT);
  const [unis,           setUnis]           = useState<University[]>([]);
  const [total,          setTotal]          = useState(0);
  const [loading,        setLoading]        = useState(false);
  const [waking,         setWaking]         = useState(false);
  const [error,          setError]          = useState("");
  const [gpa,            setGpa]            = useState<number | null>(null);
  const [page,           setPage]           = useState(1);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("vagabond_gpa");
    if (s) setGpa(parseFloat(s));
  }, []);

  const doSearch = useCallback(async (currentFilters: Filters, p = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await searchUniversities({
        query:        currentFilters.query        || undefined,
        country:      currentFilters.country      || undefined,
        degree_level: currentFilters.degree_level || undefined,
        field:        currentFilters.field        || undefined,
        max_budget:   currentFilters.max_budget   ? Number(currentFilters.max_budget) : undefined,
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
  }, []);

  /* Boot: wake server then load */
  useEffect(() => {
    (async () => {
      setWaking(true);
      await pingBackend();
      setWaking(false);
      doSearch(DEFAULT);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Update filters state + immediately re-search */
  const handleFiltersChange = (f: Filters) => {
    setFilters(f);
    doSearch(f);
  };

  /* Explicit "Apply" or search-bar Enter */
  const handleApply = () => doSearch(filters);

  const activeFilterCount = [filters.country, filters.degree_level, filters.field, filters.max_budget].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--parch-light)" }}>
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Parchment base */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(160deg, #D8C9AD 0%, #CEBFA0 60%, #C4B394 100%)" }} />
        {/* Corner ink splashes */}
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-[0.09]"
          style={{ background: "radial-gradient(circle at 95% 5%, #1C1510 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-36 h-36 pointer-events-none opacity-[0.07]"
          style={{ background: "radial-gradient(circle at 5% 95%, #1C1510 0%, transparent 65%)" }} />
        {[[15,12],[78,8],[85,25],[92,18],[10,35]].map(([l,t],i) => (
          <span key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: 3+i, height: 3+i, left:`${l}%`, top:`${t}%`,
              background:"#1C1510", opacity: 0.08+i*0.02, filter:"blur(1px)" }} />
        ))}
        <div className="absolute bottom-8 right-8 pointer-events-none opacity-20 hidden lg:block">
          <div className="border-2 border-[var(--red)] w-12 h-12 flex items-center justify-center">
            <span className="font-jp text-xl font-black text-[var(--red)]">道</span>
          </div>
        </div>

        <div className="relative z-10 py-12 px-4">
          <div className="site-wrap">

            {/* Page heading */}
            <div className="text-center mb-10">
              <p className="font-jp text-xs text-[var(--red)] tracking-[0.18em] mb-2 opacity-80">道を見つける</p>
              <h1 className="font-cinzel font-black text-4xl text-[var(--ink)] tracking-[0.1em] uppercase mb-1">
                Discover Your Path
              </h1>
              <p className="font-fell italic text-sm text-[var(--ink-pale)]">
                Among The World&apos;s Great Schools
              </p>
            </div>

            {/* Search bar */}
            <div className="flex mb-6 max-w-2xl mx-auto shadow-sm">
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
                onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") doSearch({ ...filters, query: (e.target as HTMLInputElement).value }); }}
              />
              <button onClick={handleApply}
                className="btn-dark rounded-l-none px-6 text-[10px] tracking-[0.18em]">
                Search
              </button>
            </div>

            {/* Mobile: filter toggle pill */}
            <div className="flex items-center justify-center gap-3 mb-6 lg:hidden">
              <button
                onClick={() => setSidebarOpen(o => !o)}
                className="flex items-center gap-2 px-5 py-2.5 border border-[rgba(28,21,16,0.3)] rounded-sm font-cinzel text-[10px] tracking-[0.18em] text-[var(--ink)] uppercase hover:border-[var(--red)] transition-colors"
                style={{ background: "rgba(200,185,155,0.35)" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[var(--red)] text-[var(--parch-light)] text-[8px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => handleFiltersChange(DEFAULT)}
                  className="font-cinzel text-[9px] tracking-[0.15em] text-[var(--red)] uppercase"
                >
                  Clear all
                </button>
              )}
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

            {error && (
              <div className="mb-6 px-4 py-3 border border-[rgba(122,26,14,0.3)] text-xs font-cinzel text-[var(--red)] max-w-2xl mx-auto"
                style={{ background: "rgba(122,26,14,0.05)" }}>
                ⚠ {error}
              </div>
            )}

            {/* Main grid */}
            <div className="flex gap-8 items-start">

              {/* ── Sidebar ── */}
              <aside className={`flex-shrink-0 transition-all duration-300 ${
                sidebarOpen ? "block w-full mb-6" : "hidden"
              } lg:block lg:w-56 lg:mb-0`}>
                <div className="border border-[rgba(180,155,120,0.45)] rounded-sm p-5"
                  style={{ background: "rgba(218,205,180,0.6)", backdropFilter: "blur(4px)" }}>

                  {/* Vertical kanji decoration */}
                  <div className="flex items-start gap-3 mb-4 pb-4 border-b border-[rgba(28,21,16,0.1)]">
                    <div className="kanji-rail text-[11px] opacity-30">知は力なり</div>
                    <div className="w-4 h-4 border border-[var(--red)] flex items-center justify-center opacity-40 mt-0.5 flex-shrink-0">
                      <span className="font-jp text-[7px] text-[var(--red)]">智</span>
                    </div>
                  </div>

                  <SearchForm
                    filters={filters}
                    onChange={handleFiltersChange}
                    onSearch={handleApply}
                    loading={loading || waking}
                  />
                </div>
              </aside>

              {/* ── Results ── */}
              <div className="flex-1 min-w-0">
                <Results
                  universities={unis}
                  total={total}
                  loading={loading || waking}
                  userGPA={gpa}
                  page={page}
                  onPage={p => doSearch(filters, p)}
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
