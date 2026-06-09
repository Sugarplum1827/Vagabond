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
  // Europe
  "Austria",
  "Belgium",
  "Czech Republic",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Italy",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom",
  // Americas
  "Canada",
  "USA",
  // Asia-Pacific
  "Australia",
  "Japan",
  "Singapore",
  "South Korea",
];

const DEGREE_LEVELS = [
  "Associate",
  "Diploma",
  "Certificate",
  "Bachelor",
  "Master",
  "PhD",
  "Postdoc",
];

const FIELDS = [
  "Architecture",
  "Arts",
  "Business",
  "Computer Science",
  "Design",
  "Engineering",
  "Humanities",
  "Law",
  "Mathematics",
  "Medicine",
  "Natural Sciences",
  "Political Science",
  "Social Sciences",
];

export default function SearchForm({ filters, onChange, onSearch, loading }: Props) {
  const update = (key: keyof SearchFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold text-[#6b7a99] uppercase tracking-wider mb-4">
        Filters
      </h2>

      {/* Keyword search */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#6b7a99] mb-1.5">
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
        <label className="block text-xs font-semibold text-[#6b7a99] mb-1.5">
          Country
        </label>
        <select
          className="form-input"
          value={filters.country}
          onChange={(e) => update("country", e.target.value)}
        >
          <option value="">All Countries</option>
          <optgroup label="Europe">
            {COUNTRIES.slice(0, 16).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="Americas">
            {COUNTRIES.slice(16, 18).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
          <optgroup label="Asia-Pacific">
            {COUNTRIES.slice(18).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Degree */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#6b7a99] mb-1.5">
          Degree Level
        </label>
        <select
          className="form-input"
          value={filters.degree_level}
          onChange={(e) => update("degree_level", e.target.value)}
        >
          <option value="">All Levels</option>
          {DEGREE_LEVELS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Field */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#6b7a99] mb-1.5">
          Field of Study
        </label>
        <select
          className="form-input"
          value={filters.field}
          onChange={(e) => update("field", e.target.value)}
        >
          <option value="">All Fields</option>
          {FIELDS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-[#6b7a99] mb-1.5">
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
        className="btn-primary w-full"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching…
          </>
        ) : (
          <>🔍 Search Universities</>
        )}
      </button>
    </div>
  );
}
