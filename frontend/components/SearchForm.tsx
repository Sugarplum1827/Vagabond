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
  onChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading: boolean;
}

const COUNTRIES = [
  "Austria","Belgium","Czech Republic","Denmark","Finland","France","Germany",
  "Italy","Netherlands","Norway","Poland","Portugal","Spain","Sweden",
  "Switzerland","United Kingdom","Canada","USA","Australia","Japan",
  "Singapore","South Korea",
];

const DEGREE_LEVELS = ["Associate","Diploma","Certificate","Bachelor","Master","PhD","Postdoc"];

const FIELDS = [
  "Architecture","Arts","Business","Computer Science","Design","Engineering",
  "Humanities","Law","Mathematics","Medicine","Natural Sciences",
  "Political Science","Social Sciences",
];

export default function SearchForm({ filters, onChange, onSearch, loading }: Props) {
  const update = (key: keyof SearchFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="card p-6">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="font-serif text-base text-[var(--ink-soft)] opacity-40">絞</span>
        <h2 className="text-xs font-semibold text-[var(--ink-pale)] uppercase tracking-[0.15em]">
          Filters
        </h2>
      </div>

      <div className="brush-divider mb-5" />

      {/* Keyword search */}
      <div className="mb-4">
        <label className="block text-[10px] font-semibold text-[var(--ink-pale)] mb-1.5 uppercase tracking-wider">
          Search
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., Computer Science Germany…"
          value={filters.query}
          onChange={(e) => update("query", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      {/* Country */}
      <div className="mb-4">
        <label className="block text-[10px] font-semibold text-[var(--ink-pale)] mb-1.5 uppercase tracking-wider">
          Country
        </label>
        <select
          className="form-input"
          value={filters.country}
          onChange={(e) => update("country", e.target.value)}
        >
          <option value="">All Countries</option>
          <optgroup label="Europe">
            {COUNTRIES.slice(0, 16).map((c) => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Americas">
            {COUNTRIES.slice(16, 18).map((c) => <option key={c} value={c}>{c}</option>)}
          </optgroup>
          <optgroup label="Asia-Pacific">
            {COUNTRIES.slice(18).map((c) => <option key={c} value={c}>{c}</option>)}
          </optgroup>
        </select>
      </div>

      {/* Degree */}
      <div className="mb-4">
        <label className="block text-[10px] font-semibold text-[var(--ink-pale)] mb-1.5 uppercase tracking-wider">
          Degree Level
        </label>
        <select
          className="form-input"
          value={filters.degree_level}
          onChange={(e) => update("degree_level", e.target.value)}
        >
          <option value="">All Levels</option>
          {DEGREE_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Field */}
      <div className="mb-4">
        <label className="block text-[10px] font-semibold text-[var(--ink-pale)] mb-1.5 uppercase tracking-wider">
          Field of Study
        </label>
        <select
          className="form-input"
          value={filters.field}
          onChange={(e) => update("field", e.target.value)}
        >
          <option value="">All Fields</option>
          {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <label className="block text-[10px] font-semibold text-[var(--ink-pale)] mb-1.5 uppercase tracking-wider">
          Max Annual Cost (EUR)
        </label>
        <input
          type="number"
          className="form-input"
          placeholder="e.g., 20000"
          value={filters.max_budget}
          onChange={(e) => update("max_budget", e.target.value)}
          min={0}
          step={1000}
        />
      </div>

      <button
        onClick={onSearch}
        disabled={loading}
        className="btn-primary w-full text-sm"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-[rgba(242,237,223,0.3)] border-t-[var(--parchment)] rounded-full animate-spin" />
            Searching…
          </>
        ) : (
          <>Search Universities</>
        )}
      </button>
    </div>
  );
}
