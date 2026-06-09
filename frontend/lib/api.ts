import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s — Render free tier can take 50s to cold-start
});

// ─── Types ───────────────────────────────────────────────────

export interface Grade {
  subject: string;
  grade: number;
  scale: number;
}

export interface TranscriptResult {
  success: boolean;
  filename: string;
  extracted_grades: Grade[];
  gpa_4_0: number | null;
  message: string | null;
}

export interface University {
  id: number;
  name: string;
  country: string;
  city: string | null;
  qs_ranking: number | null;
  min_gpa_4_0: number | null;
  ielts_requirement: number | null;
  tuition_eur: number | null;
  total_cost_eur: number | null;
  acceptance_rate: number | null;
  filipino_acceptance_rate: number | null;
  programs_offered: string[];
  fields_offered: string[];
  application_portal_url: string | null;
}

export interface SearchResponse {
  success: boolean;
  results: University[];
  total: number;
  query_time: number;
}

export interface SearchParams {
  query?: string;
  country?: string;
  degree_level?: string;
  field?: string;
  max_budget?: number;
  limit?: number;
}

// ─── Wake-up ping (Render free tier cold starts) ─────────────

let backendReady = false;

export async function pingBackend(): Promise<void> {
  if (backendReady) return;
  try {
    await client.get("/health", { timeout: 60000 });
    backendReady = true;
  } catch {
    // ignore — search will show its own error if it truly fails
  }
}

// ─── API calls ───────────────────────────────────────────────

export async function uploadTranscript(file: File): Promise<TranscriptResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await client.post<TranscriptResult>("/upload-transcript", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return res.data;
}

export async function searchUniversities(
  params: SearchParams
): Promise<SearchResponse> {
  const cleanParams: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== "" && v !== undefined && v !== null) {
      cleanParams[k] = v;
    }
  }
  const res = await client.get<SearchResponse>("/universities", {
    params: cleanParams,
    timeout: 60000,
  });
  return res.data;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await client.get("/health", { timeout: 60000 });
    return res.data.status === "healthy";
  } catch {
    return false;
  }
}
