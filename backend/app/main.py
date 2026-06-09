import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.endpoints import router

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Vagabond API — university search for Filipino students",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
cors_origins = settings.get_cors_origins()
logger.info("CORS origins: %s", cors_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static files (uploads) ────────────────────────────────────────────────────
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs":    "/docs",
        "health":  f"{settings.API_V1_PREFIX}/health",
    }


@app.on_event("startup")
async def startup_event():
    logger.info("🎓 %s v%s starting up…", settings.APP_NAME, settings.APP_VERSION)

    from app.services.scraper import run_full_scrape, needs_scrape, get_stats

    # ── Initial scrape (only if DB is missing or stale) ──────────────────────
    if needs_scrape():
        logger.info("Data is stale or missing — running initial scrape…")
        try:
            unis, scholarships = run_full_scrape()
            logger.info("Initial scrape done: %d universities, %d scholarships", unis, scholarships)
        except Exception as exc:
            logger.error("Initial scrape failed: %s", exc)
    else:
        stats = get_stats()
        logger.info(
            "DB is fresh. %d universities, %d scholarships. Last scrape: %s",
            stats["universities"], stats["scholarships"], stats["last_scrape"]
        )

    # ── Schedule 24-hour refresh ──────────────────────────────────────────────
    try:
        from apscheduler.schedulers.background import BackgroundScheduler
        from apscheduler.triggers.interval import IntervalTrigger

        scheduler = BackgroundScheduler()
        scheduler.add_job(
            run_full_scrape,
            trigger=IntervalTrigger(hours=24),
            id="full_scrape",
            name="24-hour university & scholarship refresh",
            replace_existing=True,
            max_instances=1,
        )
        scheduler.start()
        logger.info("APScheduler started — next scrape in 24 hours.")

        # Store reference so it doesn't get GC'd
        app.state.scheduler = scheduler

    except Exception as exc:
        logger.error("Failed to start scheduler: %s", exc)


@app.on_event("shutdown")
async def shutdown_event():
    if hasattr(app.state, "scheduler"):
        app.state.scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped.")
