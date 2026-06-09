from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class Grade(BaseModel):
    subject: str
    grade: float
    scale: int


class University(BaseModel):
    id: Any  # Appwrite uses string IDs
    name: str
    country: str
    city: Optional[str] = None
    qs_ranking: Optional[int] = None
    min_gpa_4_0: Optional[float] = None
    ielts_requirement: Optional[float] = None
    tuition_eur: Optional[float] = None
    total_cost_eur: Optional[float] = None
    acceptance_rate: Optional[float] = None
    programs_offered: Optional[List[str]] = []
    fields_offered: Optional[List[str]] = []
    application_portal_url: Optional[str] = None
    website_url: Optional[str] = None
    source: Optional[str] = None
    updated_at: Optional[str] = None


class Scholarship(BaseModel):
    id: Any
    name: str
    country: Optional[str] = None
    amount: Optional[str] = None
    deadline: Optional[str] = None
    eligibility: Optional[str] = None
    url: Optional[str] = None
    source: Optional[str] = None
    updated_at: Optional[str] = None


class SearchResponse(BaseModel):
    success: bool
    results: List[University]
    total: int
    query_time: float


class ScholarshipResponse(BaseModel):
    success: bool
    results: List[Scholarship]
    total: int


class TranscriptUploadResponse(BaseModel):
    success: bool
    filename: str
    extracted_grades: List[Grade]
    gpa_4_0: Optional[float] = None
    message: Optional[str] = None


class DBStats(BaseModel):
    universities: int
    scholarships: int
    last_scrape: Optional[str] = None
    db_path: str
    countries: Dict[str, Any] = {}
