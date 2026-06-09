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
        '["http://localhost:3000","https://vagabond-frontend.onrender.com"]'
    )

    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    UPLOAD_DIR: str = "./uploads"
    API_V1_PREFIX: str = "/api/v1"

    # ── Appwrite ──────────────────────────────────────────────
    APPWRITE_ENDPOINT:       str = "https://cloud.appwrite.io/v1"
    APPWRITE_PROJECT_ID:     str = "6a27dff9000f1487086c"
    APPWRITE_API_KEY:        str = "standard_a8ff1a9e701c0ff9203d7ff1523e26ce93c9f213ca6fd26bfc9a4acda5dc262ee16a080f270dfa8f9146d3b01de6eecec1735379b1c81450ffa39b81bc58c41704ad8d39aa9d15ba5b64a814c9050c74e4568e1566ef0d523459c81cab9b78a18a2a9ef2715372e8afbdd31b23058b0afcfdf5b437324ce7bef64cc585c8db89"
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
