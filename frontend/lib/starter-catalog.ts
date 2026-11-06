import type { SearchParams, University } from "./api";
import entries from "./starter-universities.json";

const universities: University[] = entries.map((entry) => ({
  ...entry,
  qs_ranking: null,
  min_gpa_4_0: null,
  ielts_requirement: null,
  tuition_eur: null,
  total_cost_eur: null,
  acceptance_rate: null,
  filipino_acceptance_rate: null,
}));

export function searchStarterCatalog(params: SearchParams): University[] {
  const normalize = (value: string) => value.trim().toLowerCase();
  const query = normalize(params.query ?? "");
  const country = normalize(params.country ?? "");
  const degree = normalize(params.degree_level ?? "");
  const field = normalize(params.field ?? "");
  return universities.filter((item) =>
    (!country || normalize(item.country) === country) &&
    (!degree || item.programs_offered.some((level) => normalize(level) === degree)) &&
    (!field || item.fields_offered.some((name) => normalize(name) === field)) &&
    (params.max_budget === undefined || (item.total_cost_eur !== null && item.total_cost_eur <= params.max_budget)) &&
    [item.name, item.city, item.country, ...item.programs_offered, ...item.fields_offered].join(" ").toLowerCase().includes(query)
  );
}
