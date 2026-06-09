import time
import logging
from typing import Optional

from fastapi import APIRouter, UploadFile, File, HTTPException, Query

from app.models.schemas import (
    University, Scholarship, SearchResponse, ScholarshipResponse,
    TranscriptUploadResponse, DBStats,
)
from app.services.ocr import OCRService
from app.services import scraper as db

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_CONTENT_TYPES = {
    "application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp",
}
MAX_FILE_SIZE = 10 * 1024 * 1024


# ── Universities ──────────────────────────────────────────────────────────────

@router.get("/universities", response_model=SearchResponse)
async def search_universities(
    query:        Optional[str]   = Query(None),
    country:      Optional[str]   = Query(None),
    degree_level: Optional[str]   = Query(None),
    field:        Optional[str]   = Query(None),
    max_budget:   Optional[float] = Query(None),
    limit:        int             = Query(100, ge=1, le=500),
):
    start = time.time()
    try:
        rows = db.load_universities(
            country=country,
            degree_level=degree_level,
            field=field,
            max_budget=max_budget,
            query=query,
            limit=limit,
        )
    except Exception as exc:
        logger.error("DB query failed: %s", exc)
        raise HTTPException(status_code=500, detail="Database error — try again shortly.")

    results = []
    for r in rows:
        try:
            results.append(University(**r))
        except Exception as exc:
            logger.debug("Skipping malformed row %s: %s", r.get("name"), exc)

    return SearchResponse(
        success=True,
        results=results,
        total=len(results),
        query_time=round(time.time() - start, 4),
    )


# ── Scholarships ──────────────────────────────────────────────────────────────

@router.get("/scholarships", response_model=ScholarshipResponse)
async def get_scholarships(
    country: Optional[str] = Query(None),
    limit:   int           = Query(50, ge=1, le=200),
):
    rows = db.load_scholarships(country=country, limit=limit)
    results = []
    for r in rows:
        try:
            results.append(Scholarship(**r))
        except Exception as exc:
            logger.debug("Skipping scholarship row: %s", exc)
    return ScholarshipResponse(success=True, results=results, total=len(results))


# ── Upload Transcript ─────────────────────────────────────────────────────────

@router.post("/upload-transcript", response_model=TranscriptUploadResponse)
async def upload_transcript(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{file.content_type}'. Upload PDF, JPG, or PNG.",
        )
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10 MB.")
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    is_pdf = file.content_type == "application/pdf"
    text = (
        OCRService.extract_text_from_pdf(file_bytes)
        if is_pdf
        else OCRService.extract_text_from_image(file_bytes)
    )
    grades = OCRService.parse_grades_from_text(text)
    gpa    = OCRService.calculate_gpa_4_0(grades)
    logger.info("Transcript processed: %s | %d grades | GPA %.2f",
                file.filename, len(grades), gpa or 0)

    return TranscriptUploadResponse(
        success=True,
        filename=file.filename or "transcript",
        extracted_grades=grades,
        gpa_4_0=gpa,
        message=f"Successfully extracted {len(grades)} grade{'s' if len(grades) != 1 else ''}.",
    )


# ── Health + Stats ────────────────────────────────────────────────────────────

@router.get("/health")
async def health():
    stats = db.get_stats()
    return {
        "status":       "healthy",
        "service":      "vagabond-api",
        "universities": stats["universities"],
        "scholarships": stats["scholarships"],
        "last_scrape":  stats["last_scrape"],
        "db_path":      stats["db_path"],
    }


@router.get("/stats", response_model=DBStats)
async def get_db_stats():
    return DBStats(**db.get_stats())


@router.post("/scrape", status_code=202)
async def trigger_scrape():
    """Manually trigger a full re-scrape (returns immediately, runs in background)."""
    import threading
    t = threading.Thread(target=db.run_full_scrape, daemon=True)
    t.start()
    return {"message": "Scrape started in background. Check /api/v1/stats for progress."}
