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

/* ── Active-chip count helper ── */
function activeCount(f: SearchFilters) {
  return [f.country, f.degree_level, f.field, f.max_budget].filter(Boolean).length;
}

const COUNTRIES = [
  "Australia","Austria","Belgium","Canada","Czech Republic","Denmark",
  "Finland","France","Germany","Italy","Japan","Netherlands","Norway",
  "Poland","Portugal","Singapore","South Korea","Spain","Sweden",
  "Switzerland","United Kingdom","USA",
];

const DEGREE_LEVELS = [
  { v: "Certificate",  t: "Certificate" },
  { v: "Diploma",      t: "Diploma" },
  { v: "Associate",    t: "Associate" },
  { v: "Bachelor",     t: "Bachelor's" },
  { v: "Master",       t: "Master's" },
  { v: "PhD",          t: "Doctorate / PhD" },
  { v: "Postdoc",      t: "Post-Doctoral" },
  { v: "Exchange",     t: "Exchange Program" },
  { v: "Short Course", t: "Short Course" },
];

const FIELDS = [
  "Architecture","Arts & Design","Business & Management",
  "Computer Science","Data Science","Engineering","Environmental Science",
  "Humanities","Law","Mathematics","Medicine & Health","Natural Sciences",
  "Political Science","Psychology","Social Sciences","Theology",
];

const BUDGETS = [
  { v: "0",     t: "Free tuition only" },
  { v: "3000",  t: "Up to €3,000 / yr" },
  { v: "8000",  t: "Up to €8,000 / yr" },
  { v: "15000", t: "Up to €15,000 / yr" },
  { v: "25000", t: "Up to €25,000 / yr" },
  { v: "40000", t: "Up to €40,000 / yr" },
  { v: "60000", t: "Up to €60,000 / yr" },
];

/* ── Individual filter block ── */
function FilterBlock({
  kanji, label, value, onChange, children,
}: {
  kanji: string; label: string; value: string;
  onChange: (v: string) => void; children: React.ReactNode;
}) {
  const active = Boolean(value);
  return (
    <div className="pb-5 mb-5 border-b border-[rgba(28,21,16,0.1)] last:border-0 last:mb-0 last:pb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-jp text-2xl font-black leading-none transition-colors ${active ? "text-[var(--red)]" : "text-[var(--ink)]"}`}>
            {kanji}
          </span>
          <span className="font-cinzel text-[8px] tracking-[0.22em] text-[var(--ink-pale)] uppercase">{label}</span>
        </div>
        {active && (
          <button onClick={() => onChange("")}
            className="font-cinzel text-[8px] text-[var(--red)] tracking-wider hover:opacity-70 transition-opacity">
            ✕ Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function SearchForm({ filters, onChange, onSearch, loading }: Props) {
  const set = (key: keyof SearchFilters, val: string) => onChange({ ...filters, [key]: val });
  const reset = () => onChange({ query: "", country: "", degree_level: "", field: "", max_budget: "" });
  const count = activeCount(filters);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[rgba(28,21,16,0.18)]">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-[10px] font-bold tracking-[0.25em] text-[var(--ink)] uppercase">Filters</span>
          {count > 0 && (
            <span className="w-4 h-4 rounded-full bg-[var(--red)] text-[var(--parch-light)] font-cinzel text-[8px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
        {count > 0 && (
          <button onClick={reset}
            className="flex items-center gap-1.5 font-cinzel text-[8px] tracking-[0.15em] text-[var(--ink-pale)] uppercase hover:text-[var(--red)] transition-colors">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1.5 4.5a3 3 0 105.5.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M7 2L7 5H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Reset All
          </button>
        )}
      </div>

      {/* ── COUNTRY ── */}
      <FilterBlock kanji="道" label="Country / Region" value={filters.country} onChange={v => set("country", v)}>
        <select className="filter-select" value={filters.country} onChange={e => set("country", e.target.value)}>
          <option value="">All Countries</option>
          <optgroup label="Asia-Pacific">
            {["Australia","Japan","Singapore","South Korea"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="Europe">
            {["Austria","Belgium","Czech Republic","Denmark","Finland","France",
              "Germany","Italy","Netherlands","Norway","Poland","Portugal",
              "Spain","Sweden","Switzerland","United Kingdom"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="Americas">
            {["Canada","USA"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
        </select>
      </FilterBlock>

      {/* ── DEGREE LEVEL ── */}
      <FilterBlock kanji="級" label="Degree Level" value={filters.degree_level} onChange={v => set("degree_level", v)}>
        <div className="flex flex-col gap-1.5">
          {DEGREE_LEVELS.map(({ v, t }) => {
            const active = filters.degree_level === v;
            return (
              <button
                key={v}
                onClick={() => set("degree_level", active ? "" : v)}
                className={`text-left px-3 py-2 rounded-sm text-[11px] font-cinzel tracking-[0.08em] transition-all border ${
                  active
                    ? "bg-[var(--ink)] text-[var(--parch-light)] border-[var(--ink)]"
                    : "text-[var(--ink-mid)] border-[rgba(28,21,16,0.18)] hover:border-[var(--red)] hover:text-[var(--red)] bg-transparent"
                }`}
              >
                {active && <span className="mr-1.5 text-[var(--gold)]">—</span>}
                {t}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      {/* ── FIELD OF STUDY ── */}
      <FilterBlock kanji="学" label="Field of Study" value={filters.field} onChange={v => set("field", v)}>
        <select className="filter-select" value={filters.field} onChange={e => set("field", e.target.value)}>
          <option value="">All Fields</option>
          {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </FilterBlock>

      {/* ── BUDGET ── */}
      <FilterBlock kanji="金" label="Max Annual Budget" value={filters.max_budget} onChange={v => set("max_budget", v)}>
        <div className="flex flex-col gap-1.5">
          {BUDGETS.map(({ v, t }) => {
            const active = filters.max_budget === v;
            return (
              <button
                key={v}
                onClick={() => set("max_budget", active ? "" : v)}
                className={`text-left px-3 py-2 rounded-sm text-[11px] font-cinzel tracking-[0.08em] transition-all border ${
                  active
                    ? "bg-[var(--ink)] text-[var(--parch-light)] border-[var(--ink)]"
                    : "text-[var(--ink-mid)] border-[rgba(28,21,16,0.18)] hover:border-[var(--red)] hover:text-[var(--red)] bg-transparent"
                }`}
              >
                {active && <span className="mr-1.5 text-[var(--gold)]">—</span>}
                {t}
              </button>
            );
          })}
        </div>
      </FilterBlock>

      {/* Apply button */}
      <button
        onClick={onSearch}
        disabled={loading}
        className="btn-dark w-full justify-center mt-2 gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22 6"/>
            </svg>
            Searching…
          </>
        ) : (
          <>Apply Filters</>
        )}
      </button>
    </div>
  );
}
