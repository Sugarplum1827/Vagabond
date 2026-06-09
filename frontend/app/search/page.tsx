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

  // Load GPA from localStorage (set by upload page)
  useEffect(() => {
    const stored = localStorage.getItem("vagabond_gpa");
    if (stored) setUserGPA(parseFloat(stored));
  }, []);

  // Ping backend to wake it up on free tier, then load all universities
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
            <p className="text-xs font-semibold text-[#ff5c47] uppercase tracking-widest mb-2">
              University Search
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div>
                <h1 className="font-display text-4xl text-[#0d0d14]">
                  Find your university
                </h1>
                <p className="text-[#6b7a99] mt-1">
                  Filter by country, degree level, field, and budget.
                </p>
              </div>

              {userGPA && (
                <div className="sm:ml-auto flex items-center gap-3 bg-[#fffbea] border border-[#f5c842] text-[#7a6000] px-4 py-2.5 rounded-xl">
                  <div>
                    <p className="text-xs text-[#b38b00]">Your GPA</p>
                    <p className="font-bold text-lg leading-none">{userGPA}</p>
                  </div>
                  <button
                    onClick={clearGPA}
                    className="text-[#b38b00] hover:text-[#7a6000] text-lg leading-none"
                    title="Clear GPA"
                  >
                    ×
                  </button>
                </div>
              )}

              {!userGPA && (
                <a
                  href="/upload"
                  className="sm:ml-auto text-sm text-[#6b7a99] underline underline-offset-2 hover:text-[#ff5c47]"
                >
                  Upload transcript for GPA matching →
                </a>
              )}
            </div>
          </div>

          {/* Waking up banner */}
          {waking && (
            <div className="mb-4 flex items-center gap-2 bg-[#fff8e6] border border-[#f5c842] text-[#7a6000] px-4 py-3 rounded-xl text-sm">
              <span className="w-4 h-4 border-2 border-[#f5c842] border-t-[#7a6000] rounded-full animate-spin flex-shrink-0" />
              <span>Server is waking up — this can take up to 30 seconds on the free tier…</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters */}
            <div className="lg:w-72 flex-shrink-0">
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
                <div className="mb-4 flex items-center gap-2 bg-[#fff0ee] border border-[#ffccc7] text-[#cc2200] px-4 py-3 rounded-xl text-sm">
                  <span>⚠️</span>
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
