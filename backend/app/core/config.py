from pydantic_settings import BaseSettings
from typing import List
import os
import json


class Settings(BaseSettings):
    APP_NAME: str = "Vagabond API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 10000

    BACKEND_CORS_ORIGINS: str = (
        '["https://vagabond-frontend.onrender.com"]'
    )

    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    UPLOAD_DIR: str = "./uploads"
    API_V1_PREFIX: str = "/api/v1"

    # ── Appwrite ──────────────────────────────────────────────
    APPWRITE_ENDPOINT:       str = "https://sgp.cloud.appwrite.io/v1"
    APPWRITE_PROJECT_ID:     str = "APPWRITE_PROJECT_ID"
    APPWRITE_API_KEY:        str = "APPWRITE_API_KEY"
    APPWRITE_DATABASE_ID:    str = "vagabond"
    APPWRITE_UNI_COL_ID:     str = "universities"
    APPWRITE_SCH_COL_ID:     str = "scholarships"
    APPWRITE_META_COL_ID:    str = "meta"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def get_cors_origins(self) -> List[str]:
        raw = self.BACKEND_CORS_ORIGINS.strip()
        if raw.startswith("["):
            try:
                origins = json.loads(raw)
                return [o.rstrip("/") for o in origins]
            except json.JSONDecodeError:
                pass
        return [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]


settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.UPLOAD_DIR, "temp"), exist_ok=True)
