# 🎓 Vagabond

**Search scholarships & universities worldwide for Filipino students**

> Upload your transcript → auto-extract GPA → find matching universities → apply directly.

No account required. No cost. Transcript deleted immediately after extraction.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15.2.3 + React 19 + Tailwind CSS 3.4.17 |
| Backend | Python 3.13.2 + FastAPI 0.115.12 |
| Deployment | Render.com (FREE tier) |
| OCR | PyPDF2 (PDFs) + Tesseract via pytesseract (images) |

---

## Features

- **Transcript Upload** — drag-and-drop PDF or image (JPG/PNG), auto-extracts grades & GPA
- **University Search** — filter by country, degree level, field, and max annual cost
- **GPA Matching** — marks each result ✅ or ⚠️ based on your extracted GPA
- **Direct Apply Links** — links straight to official application portals
- **21 Universities** across Germany, Japan, Singapore, South Korea, Netherlands, Finland, UK, Canada, Australia, Sweden

---

## Local Development

### Prerequisites

- Node.js 22+
- Python 3.13+
- Tesseract OCR (optional, for image transcripts): `brew install tesseract` / `apt install tesseract-ocr`

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Bootstrap university CSV
python -c "from app.services.scraper import ScraperService; ScraperService().scrape_universities()"

# Start API
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000/docs
```

### 2. Frontend

```bash
cd frontend
npm install
# Edit .env.local → NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm run dev
# → http://localhost:3000
```

---

## Deploy to Render (FREE)

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Vagabond MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vagabond.git
git push -u origin main
```

### Step 2 — Deploy via Blueprint

1. Go to [render.com](https://render.com) → sign in with GitHub
2. Click **New +** → **Blueprint**
3. Connect your repo, point to `deployment/render/render.yaml`
4. Click **Deploy Blueprint** — wait ~5 minutes

### Step 3 — Update URLs

After first deploy, Render gives you two URLs:

- Backend: `https://vagabond-backend.onrender.com`
- Frontend: `https://vagabond-frontend.onrender.com`

Update in Render dashboard:
- **Backend** env var `BACKEND_CORS_ORIGINS` → `["https://vagabond-frontend.onrender.com"]`
- **Frontend** env var `NEXT_PUBLIC_API_URL` → `https://vagabond-backend.onrender.com/api/v1`

Trigger a redeploy for both services.

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/health` | GET | Health check |
| `/api/v1/universities` | GET | Search universities (query, country, degree_level, field, max_budget, limit) |
| `/api/v1/upload-transcript` | POST | Upload transcript file → returns grades + GPA |
| `/docs` | GET | Interactive Swagger docs |

---

## Project Structure

```
vagabond/
├── frontend/          Next.js app
│   ├── app/           Pages (layout, home, upload, search)
│   ├── components/    Header, Footer, TranscriptUpload, SearchForm, Results
│   └── lib/api.ts     Typed API client
├── backend/           FastAPI app
│   ├── app/
│   │   ├── main.py    App entry + CORS
│   │   ├── api/       Route handlers
│   │   ├── core/      Config (pydantic-settings)
│   │   ├── models/    Pydantic schemas
│   │   └── services/  OCR + university data
│   └── data/          universities.csv (auto-generated)
└── deployment/render/ render.yaml blueprint
```

---

## Privacy

Uploaded transcripts are read into memory for OCR, then discarded. No file is persisted after the API response is sent. No user accounts or personal data are stored.

---

## License

MIT — free to fork, modify, and deploy.
