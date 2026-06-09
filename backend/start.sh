#!/bin/bash
set -e

echo "Starting Vagabond API..."

# Create required directories
mkdir -p uploads/temp
mkdir -p data

# Bootstrap CSV if it doesn't exist
if [ ! -f data/universities.csv ]; then
  echo "Bootstrapping universities.csv..."
  python -c "from app.services.scraper import ScraperService; ScraperService().scrape_universities(); print('CSV created.')"
fi

# Start server
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-10000}"
