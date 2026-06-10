"use client";
import { University } from "@/lib/api";

interface Props {
  universities: University[];
  total: number;
  loading: boolean;
  userGPA: number | null;
  page: number;
  onPage: (p: number) => void;
}

const PER_PAGE = 8;

function SkeletonCard() {
  return (
    <div className="uni-card p-5 flex items-center gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-full loading-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 loading-pulse rounded-sm w-3/5" />
        <div className="h-3 loading-pulse rounded-sm w-2/5" />
        <div className="h-3 loading-pulse rounded-sm w-1/4 mt-1" />
      </div>
      <div className="w-20 h-8 loading-pulse rounded-sm flex-shrink-0" />
    </div>
  );
}

function countryFlag(c: string): string {
  const m: Record<string, string> = {
    Japan: "🇯🇵", Germany: "🇩🇪", Singapore: "🇸🇬",
    "South Korea": "🇰🇷", "United Kingdom": "🇬🇧", Netherlands: "🇳🇱",
    Finland: "🇫🇮", Canada: "🇨🇦", Australia: "🇦🇺",
    Sweden: "🇸🇪", Norway: "🇳🇴", Denmark: "🇩🇰", USA: "🇺🇸",
  };
  return m[c] || "🌍";
}

function matchScore(uni: University, gpa: number | null): number {
  if (!gpa || !uni.min_gpa_4_0) return Math.floor(65 + Math.random() * 25);
  const ratio = gpa / uni.min_gpa_4_0;
  return Math.min(99, Math.floor(ratio * 75 + 20));
}

export default function Results({ universities, total, loading, userGPA, page, onPage }: Props) {
  const totalPages = Math.ceil(total / PER_PAGE);

  if (loading) {
    return <div className="space-y-3">{[1,2,3,4].map(i => <SkeletonCard key={i}/>)}</div>;
  }

  if (universities.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="font-jp text-6xl block mb-4 text-[var(--ink)] opacity-15">空</span>
        <p className="font-cinzel text-sm font-semibold text-[var(--ink)] tracking-wider mb-2">No Destinations Found</p>
        <p className="font-fell italic text-sm text-[var(--ink-pale)]">Try broadening your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Count */}
      <p className="font-cinzel text-[10px] tracking-[0.18em] text-[var(--ink-pale)] uppercase mb-5">
        <span className="font-black text-[var(--ink)] text-sm">{total}</span>{" "}Destinations Found
      </p>

      {/* Cards */}
      <div className="space-y-3">
        {universities.map((uni) => {
          const score = matchScore(uni, userGPA);
          const tuitionFree = uni.tuition_eur === 0;
          const tuitionText = uni.tuition_eur !== null
            ? tuitionFree
              ? "Free"
              : `€${(uni.tuition_eur).toLocaleString()}`
            : "—";

          return (
            <div key={uni.id} className="uni-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 anim-fade-up">

              {/* Match badge */}
              <div className="match-badge flex-shrink-0">
                <span className="font-cinzel text-lg font-black text-[var(--red)] leading-none">{score}</span>
                <span className="font-cinzel text-[7px] tracking-[0.15em] text-[var(--ink-pale)] uppercase">Match</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="font-cinzel font-bold text-sm text-[var(--ink)] leading-snug">
                    {uni.name}
                  </h3>
                  {uni.qs_ranking && (
                    <span className="font-cinzel text-[8px] tracking-wider text-[var(--ink-pale)] border border-[rgba(107,92,78,0.4)] px-1.5 py-0.5 rounded-sm">
                      QS #{uni.qs_ranking}
                    </span>
                  )}
                </div>
                {/* Japanese name placeholder for known universities */}
                {(uni.country === "Japan") && (
                  <p className="font-jp text-[10px] text-[var(--ink-pale)] opacity-60 mb-1">{uni.name}</p>
                )}
                <p className="font-fell italic text-xs text-[var(--ink-pale)] mb-2">
                  {countryFlag(uni.country)} {uni.city}, {uni.country}
                </p>

                {/* Tags row */}
                <div className="flex flex-wrap gap-2">
                  {uni.programs_offered?.slice(0,2).map(p => (
                    <span key={p} className="font-cinzel text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 border border-[rgba(107,92,78,0.3)] text-[var(--ink-pale)]">
                      {p}
                    </span>
                  ))}
                  {uni.fields_offered?.slice(0,2).map(f => (
                    <span key={f} className="font-cinzel text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 text-[var(--red)] border border-[rgba(122,26,14,0.25)]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right column — tuition + programs + CTA */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0 min-w-[130px]">
                <div className="text-right">
                  <p className="font-cinzel text-[8px] tracking-[0.15em] text-[var(--ink-pale)] uppercase">Tuition</p>
                  <p className="font-cinzel text-sm font-bold text-[var(--ink)]">{tuitionText} / year</p>
                </div>
                {uni.programs_offered && (
                  <div className="text-right">
                    <p className="font-cinzel text-[8px] tracking-[0.15em] text-[var(--ink-pale)] uppercase">Programs</p>
                    <p className="font-cinzel text-sm font-bold text-[var(--ink)]">{uni.programs_offered.length}</p>
                  </div>
                )}
                {uni.application_portal_url && (
                  <a href={uni.application_portal_url} target="_blank" rel="noopener noreferrer"
                    className="btn-dark text-[9px] py-2 px-4 mt-1">
                    View Path
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            className="w-9 h-9 flex items-center justify-center border border-[rgba(28,21,16,0.25)] rounded-sm font-cinzel text-sm text-[var(--ink-mid)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >←</button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = i + 1;
            const active = p === page;
            return (
              <button key={p} onClick={() => onPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-sm font-cinzel text-xs transition-colors ${
                  active
                    ? "bg-[var(--ink)] text-[var(--parch-light)]"
                    : "border border-[rgba(28,21,16,0.25)] text-[var(--ink-mid)] hover:border-[var(--red)] hover:text-[var(--red)]"
                }`}>
                {p}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="font-cinzel text-xs text-[var(--ink-pale)]">…</span>
              <button onClick={() => onPage(totalPages)}
                className="w-9 h-9 flex items-center justify-center border border-[rgba(28,21,16,0.25)] rounded-sm font-cinzel text-xs text-[var(--ink-mid)] hover:border-[var(--red)]">
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            className="w-9 h-9 flex items-center justify-center border border-[rgba(28,21,16,0.25)] rounded-sm font-cinzel text-sm text-[var(--ink-mid)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >→</button>
        </div>
      )}
    </div>
  );
}
