import asyncio
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

# ──────────────────────────────────────────────────────────────
# CORS
# ──────────────────────────────────────────────────────────────

cors_origins = settings.get_cors_origins()

logger.info("CORS origins: %s", cors_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────
# Static files
# ──────────────────────────────────────────────────────────────

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=settings.UPLOAD_DIR),
    name="uploads",
)

# ──────────────────────────────────────────────────────────────
# API Routes
# ──────────────────────────────────────────────────────────────

app.include_router(
    router,
    prefix=settings.API_V1_PREFIX,
)

# ──────────────────────────────────────────────────────────────
# Root
# ──────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health",
    }

# ──────────────────────────────────────────────────────────────
# Background Scraper
# ──────────────────────────────────────────────────────────────

async def run_scrape_background():
    from app.services.scraper import run_full_scrape

    try:
        logger.info("Starting background scrape...")

        universities, scholarships = await asyncio.to_thread(
            run_full_scrape
        )

        logger.info(
            "Background scrape completed: %d universities, %d scholarships",
            universities,
            scholarships,
        )

    except Exception:
        logger.exception("Background scrape failed")

# ──────────────────────────────────────────────────────────────
# Startup
# ──────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():

    logger.info(
        "🎓 %s v%s starting up…",
        settings.APP_NAME,
        settings.APP_VERSION,
    )

    from app.services.scraper import (
        needs_scrape,
        get_stats,
        run_full_scrape,
    )

    # IMPORTANT:
    # Start server immediately.
    # Do NOT block startup with a long scrape.

    if needs_scrape():

        logger.info(
            "Data is stale or missing — launching background scrape."
        )

        asyncio.create_task(
            run_scrape_background()
        )

    else:

        stats = get_stats()

        logger.info(
            "DB is fresh. %d universities, %d scholarships. Last scrape: %s",
            stats["universities"],
            stats["scholarships"],
            stats["last_scrape"],
        )

    # Scheduler

    try:

        from apscheduler.schedulers.background import (
            BackgroundScheduler,
        )

        from apscheduler.triggers.interval import (
            IntervalTrigger,
        )

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

        app.state.scheduler = scheduler

        logger.info(
            "APScheduler started — next scrape in 24 hours."
        )

    except Exception:
        logger.exception(
            "Failed to start scheduler"
        )

# ──────────────────────────────────────────────────────────────
# Shutdown
# ──────────────────────────────────────────────────────────────

@app.on_event("shutdown")
async def shutdown_event():

    if hasattr(app.state, "scheduler"):

        app.state.scheduler.shutdown(
            wait=False
        )

        logger.info(
            "Scheduler stopped."
        )