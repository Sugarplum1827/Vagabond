"use client";
import { University } from "@/lib/api";

interface Props {
  universities: University[];
  total: number;
  loading: boolean;
  userGPA: number | null;
}

function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-lg loading-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 loading-shimmer rounded w-2/3" />
          <div className="h-4 loading-shimmer rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-6 w-20 loading-shimmer rounded-full" />
            <div className="h-6 w-20 loading-shimmer rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    Germany: "🇩🇪",
    Japan: "🇯🇵",
    Singapore: "🇸🇬",
    "South Korea": "🇰🇷",
    "United Kingdom": "🇬🇧",
    UK: "🇬🇧",
    Netherlands: "🇳🇱",
    Finland: "🇫🇮",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    Sweden: "🇸🇪",
    Norway: "🇳🇴",
    Denmark: "🇩🇰",
  };
  return flags[country] || "🌍";
}

function costLabel(eur: number): string {
  if (eur === 0) return "Free";
  return `€${(eur / 1000).toFixed(0)}k/yr`;
}

export default function Results({ universities, total, loading, userGPA }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className="card p-12 text-center">
        <span className="text-5xl block mb-4">🔍</span>
        <h3 className="text-lg font-semibold text-[#0d0d14] mb-2">No universities found</h3>
        <p className="text-sm text-[#6b7a99]">
          Try removing some filters, or broaden your search.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-[#6b7a99]">
          <span className="font-bold text-[#0d0d14] text-base">{total}</span> universities found
        </p>
        {userGPA && (
          <div className="flex items-center gap-2 bg-[#fffbea] border border-[#f5c842] text-[#7a6000] text-xs font-semibold px-3 py-1.5 rounded-full">
            <span>🎯</span>
            <span>Your GPA: {userGPA}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {universities.map((uni) => {
          const qualifies = userGPA !== null && uni.min_gpa_4_0 !== null && userGPA >= (uni.min_gpa_4_0 ?? 0);
          const gpaUnknown = !userGPA;
          const tuitionFree = uni.tuition_eur === 0;

          return (
            <div key={uni.id} className="card p-6 animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Rank badge */}
                {uni.qs_ranking && (
                  <div className="rank-badge">
                    #{uni.qs_ranking}
                  </div>
                )}

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#0d0d14] text-lg leading-tight">
                      {uni.name}
                    </h3>
                    {!gpaUnknown && (
                      <span
                        className={`tag text-xs ${
                          qualifies ? "tag-green" : "tag-coral"
                        }`}
                      >
                        {qualifies ? "✅ You qualify" : "⚠️ GPA too low"}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#6b7a99] mb-3">
                    {countryFlag(uni.country)} {uni.city}, {uni.country}
                  </p>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {uni.min_gpa_4_0 && (
                      <div className="text-center">
                        <p className="text-xs text-[#9ba3be] uppercase tracking-wider">Min GPA</p>
                        <p className="font-semibold text-[#0d0d14] text-sm">{uni.min_gpa_4_0}</p>
                      </div>
                    )}
                    {uni.ielts_requirement && (
                      <div className="text-center">
                        <p className="text-xs text-[#9ba3be] uppercase tracking-wider">IELTS</p>
                        <p className="font-semibold text-[#0d0d14] text-sm">{uni.ielts_requirement}</p>
                      </div>
                    )}
                    {uni.acceptance_rate && (
                      <div className="text-center">
                        <p className="text-xs text-[#9ba3be] uppercase tracking-wider">Acceptance</p>
                        <p className="font-semibold text-[#0d0d14] text-sm">{uni.acceptance_rate}%</p>
                      </div>
                    )}
                    {uni.filipino_acceptance_rate && (
                      <div className="text-center">
                        <p className="text-xs text-[#9ba3be] uppercase tracking-wider">PH Accept.</p>
                        <p className="font-semibold text-[#0d0d14] text-sm">{uni.filipino_acceptance_rate}%</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {uni.tuition_eur !== null && (
                      <span className={`tag ${tuitionFree ? "tag-green" : ""}`}>
                        💰 {tuitionFree ? "Free tuition" : `€${(uni.tuition_eur || 0).toLocaleString()}/yr tuition`}
                      </span>
                    )}
                    {uni.total_cost_eur && (
                      <span className="tag">
                        🏠 {costLabel(uni.total_cost_eur)} total
                      </span>
                    )}
                    {uni.programs_offered?.map((p) => (
                      <span key={p} className="tag">{p}</span>
                    ))}
                    {uni.fields_offered?.slice(0, 2).map((f) => (
                      <span key={f} className="tag tag-coral">{f}</span>
                    ))}
                  </div>

                  {/* Apply link */}
                  {uni.application_portal_url && (
                    <a
                      href={uni.application_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm py-2 px-4 inline-flex"
                    >
                      Apply at {uni.name.split(" ")[0]} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
