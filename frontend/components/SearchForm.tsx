"use client";

interface SearchFilters {
  query: string;
  country: string;
  degree_level: string;
  field: string;
  max_budget: string;
}
interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

const FILTER_GROUPS = [
  {
    kanji: "道", label: "REGION",
    key: "country" as const,
    options: [
      { v: "", t: "All Regions" },
      { v: "Germany", t: "Germany" },
      { v: "Japan", t: "Japan" },
      { v: "Singapore", t: "Singapore" },
      { v: "South Korea", t: "South Korea" },
      { v: "United Kingdom", t: "United Kingdom" },
      { v: "Netherlands", t: "Netherlands" },
      { v: "Finland", t: "Finland" },
      { v: "Canada", t: "Canada" },
      { v: "Australia", t: "Australia" },
      { v: "Sweden", t: "Sweden" },
    ],
  },
  {
    kanji: "学", label: "DISCIPLINE",
    key: "field" as const,
    options: [
      { v: "", t: "All Disciplines" },
      { v: "Computer Science", t: "Computer Science" },
      { v: "Engineering", t: "Engineering" },
      { v: "Business", t: "Business" },
      { v: "Medicine", t: "Medicine" },
      { v: "Arts", t: "Arts" },
      { v: "Law", t: "Law" },
      { v: "Natural Sciences", t: "Natural Sciences" },
    ],
  },
  {
    kanji: "金", label: "TUITION",
    key: "max_budget" as const,
    options: [
      { v: "", t: "All Tuition" },
      { v: "0", t: "Free / €0" },
      { v: "5000", t: "Up to €5,000" },
      { v: "15000", t: "Up to €15,000" },
      { v: "30000", t: "Up to €30,000" },
      { v: "50000", t: "Up to €50,000" },
    ],
  },
  {
    kanji: "並順", label: "SORT BY",
    key: "degree_level" as const,
    options: [
      { v: "", t: "Best Match" },
      { v: "Bachelor", t: "Bachelor" },
      { v: "Master", t: "Master" },
      { v: "PhD", t: "PhD" },
    ],
  },
];

export default function SearchForm({ filters, onChange, onSearch, loading }: Props) {
  const update = (key: keyof SearchFilters, val: string) =>
    onChange({ ...filters, [key]: val });

  const reset = () =>
    onChange({ query: "", country: "", degree_level: "", field: "", max_budget: "" });

  return (
    <div className="flex flex-col gap-0">
      {/* Vertical kanji accent */}
      <div className="flex items-start gap-3 mb-6">
        <div className="hidden lg:block kanji-rail text-[13px] leading-loose pt-1 opacity-35">
          知は力なり
        </div>
        <div className="w-4 h-4 border border-[var(--red)] flex items-center justify-center opacity-50 mt-1">
          <span className="font-jp text-[7px] text-[var(--red)]">智</span>
        </div>
      </div>

      <h2 className="font-cinzel text-[10px] font-bold tracking-[0.22em] text-[var(--ink-pale)] uppercase mb-5 border-b border-[rgba(28,21,16,0.15)] pb-3">
        Filters
      </h2>

      {FILTER_GROUPS.map((g) => (
        <div key={g.key} className="mb-5">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-jp text-xl font-bold text-[var(--ink)] leading-none">{g.kanji}</span>
          </div>
          <p className="font-cinzel text-[8px] tracking-[0.2em] text-[var(--ink-pale)] uppercase mb-2">{g.label}</p>
          <select
            className="filter-select"
            value={filters[g.key]}
            onChange={(e) => update(g.key, e.target.value)}
          >
            {g.options.map((o) => (
              <option key={o.v} value={o.v}>{o.t}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Reset */}
      <button
        onClick={reset}
        className="flex items-center gap-2 text-[10px] font-cinzel tracking-[0.15em] text-[var(--ink-pale)] uppercase hover:text-[var(--red)] transition-colors mt-2"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5a3 3 0 105.9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M8 2.5L7.9 5.5 5 5.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Reset Filters
      </button>
    </div>
  );
}
