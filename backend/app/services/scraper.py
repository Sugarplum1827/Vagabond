"""
Dynamic university + scholarship scraper.

Data sources:
  1. ETER API       — All registered European universities
  2. Wikidata SPARQL — Universities in USA, Canada, Japan, South Korea, Singapore, Australia
  3. QS Rankings    — Enrichment with ranking numbers
  4. Scholarship sites — DAAD, JASSO, StudyInKorea, Scholars4Dev, etc.

Storage: Appwrite (cloud DB — persists across Render restarts & redeploys)
  Database:    vagabond
  Collections: universities, scholarships, meta

Scheduler: APScheduler runs run_full_scrape() every 24 hours.
"""

import json
import logging
import os
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional

import requests
from bs4 import BeautifulSoup

from app.services import appwrite_db as adb

logger = logging.getLogger(__name__)

# ── Country config ────────────────────────────────────────────────────────────

EUROPEAN_COUNTRIES = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
    "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania",
    "Luxembourg", "Malta", "Netherlands", "Norway", "Poland", "Portugal",
    "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland",
    "United Kingdom",
]

WIKIDATA_QIDS: Dict[str, str] = {
    "USA":         "Q30",
    "Canada":      "Q16",
    "Japan":       "Q17",
    "South Korea": "Q884",
    "Singapore":   "Q334",
    "Australia":   "Q408",
}

ETER_ISO: Dict[str, str] = {
    "Austria": "AT", "Belgium": "BE", "Bulgaria": "BG", "Croatia": "HR",
    "Cyprus": "CY", "Czech Republic": "CZ", "Denmark": "DK", "Estonia": "EE",
    "Finland": "FI", "France": "FR", "Germany": "DE", "Greece": "GR",
    "Hungary": "HU", "Iceland": "IS", "Ireland": "IE", "Italy": "IT",
    "Latvia": "LV", "Liechtenstein": "LI", "Lithuania": "LT",
    "Luxembourg": "LU", "Malta": "MT", "Netherlands": "NL", "Norway": "NO",
    "Poland": "PL", "Portugal": "PT", "Romania": "RO", "Slovakia": "SK",
    "Slovenia": "SI", "Spain": "ES", "Sweden": "SE", "Switzerland": "CH",
    "United Kingdom": "GB",
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# ── Source 1: ETER ────────────────────────────────────────────────────────────

def scrape_eter() -> List[Dict]:
    logger.info("Fetching ETER API…")
    try:
        resp = requests.get(
            "https://www.eter-project.com/api/HEI",
            timeout=60, headers={"Accept": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as exc:
        logger.warning("ETER fetch failed: %s", exc)
        return []

    iso_to_country = {v: k for k, v in ETER_ISO.items()}
    records = []
    for item in data:
        iso = item.get("country_code") or item.get("Country_Code", "")
        country = iso_to_country.get(iso)
        if not country:
            continue
        name = (
            item.get("name_english") or item.get("Name_English")
            or item.get("name_local") or item.get("Name_Local", "")
        ).strip()
        if not name:
            continue

        inst_type = str(item.get("inst_cat") or item.get("Inst_Category", "")).lower()
        if "bachelor" in inst_type or "univ" in inst_type:
            programs = ["Bachelor", "Master", "PhD"]
        elif "college" in inst_type:
            programs = ["Associate", "Bachelor"]
        else:
            programs = ["Bachelor", "Master"]

        website = item.get("website_url") or item.get("Website_URL") or item.get("url")
        records.append({
            "name":                  name,
            "country":               country,
            "city":                  item.get("city") or item.get("City"),
            "programs_offered":      programs,
            "fields_offered":        _infer_fields(name),
            "application_portal_url": website,
            "website_url":           website,
            "source":                "ETER",
        })

    logger.info("ETER → %d European universities", len(records))
    return records


# ── Source 2: Wikidata SPARQL ─────────────────────────────────────────────────

SPARQL_QUERY = """
SELECT DISTINCT ?uni ?uniLabel ?cityLabel ?website WHERE {{
  ?uni wdt:P31/wdt:P279* wd:Q3918 ;
       wdt:P17 wd:{qid} .
  OPTIONAL {{ ?uni wdt:P856 ?website . }}
  OPTIONAL {{ ?uni wdt:P131 ?city . }}
  SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
}}
ORDER BY ?uniLabel
LIMIT 2000
"""

def scrape_wikidata_country(country: str, qid: str) -> List[Dict]:
    logger.info("Wikidata: %s (QID=%s)…", country, qid)
    try:
        resp = requests.get(
            "https://query.wikidata.org/sparql",
            params={"query": SPARQL_QUERY.format(qid=qid), "format": "json"},
            headers={"User-Agent": "Vagabond/1.0 (educational project)"},
            timeout=60,
        )
        resp.raise_for_status()
        bindings = resp.json()["results"]["bindings"]
    except Exception as exc:
        logger.warning("Wikidata failed for %s: %s", country, exc)
        return []

    records = []
    seen: set = set()
    for b in bindings:
        name = b.get("uniLabel", {}).get("value", "").strip()
        if not name or name in seen:
            continue
        if name.startswith("Q") and name[1:].isdigit():
            continue
        seen.add(name)
        website = b.get("website", {}).get("value")
        records.append({
            "name":                  name,
            "country":               country,
            "city":                  b.get("cityLabel", {}).get("value"),
            "programs_offered":      ["Bachelor", "Master", "PhD"],
            "fields_offered":        _infer_fields(name),
            "application_portal_url": website,
            "website_url":           website,
            "source":                "Wikidata",
        })

    logger.info("  → %d universities for %s", len(records), country)
    return records


# ── Source 3: QS Rankings ─────────────────────────────────────────────────────

def fetch_qs_rankings() -> Dict[str, int]:
    logger.info("Fetching QS rankings…")
    try:
        resp = requests.get(
            "https://www.topuniversities.com/sites/default/files/qs-rankings-data/en/3740566.txt",
            timeout=30,
            headers={"User-Agent": "Mozilla/5.0", "Referer": "https://www.topuniversities.com/"},
        )
        resp.raise_for_status()
        rankings: Dict[str, int] = {}
        for item in resp.json().get("data", []):
            title = item.get("title", "").lower().strip()
            rank_raw = item.get("rank_display") or item.get("overall_rank", "")
            try:
                rank = int(str(rank_raw).replace("=", "").split("-")[0])
                if title:
                    rankings[title] = rank
            except (ValueError, TypeError):
                pass
        logger.info("QS rankings: %d entries", len(rankings))
        return rankings
    except Exception as exc:
        logger.warning("QS rankings fetch failed: %s", exc)
        return {}


def enrich_with_qs(records: List[Dict], rankings: Dict[str, int]) -> List[Dict]:
    for r in records:
        key = r["name"].lower().strip()
        if key in rankings:
            r["qs_ranking"] = rankings[key]
        else:
            for rk, rv in rankings.items():
                if key[:30] in rk or rk[:30] in key:
                    r["qs_ranking"] = rv
                    break
    return records


# ── Source 4: Scholarships ────────────────────────────────────────────────────

SCHOLARSHIP_SOURCES = [
    {"country": "Germany",     "url": "https://www.daad.de/en/study-and-research-in-germany/scholarships/",     "source": "DAAD"},
    {"country": "Netherlands", "url": "https://www.studyinholland.nl/scholarships",                             "source": "StudyInHolland"},
    {"country": "Sweden",      "url": "https://www.studyinsweden.se/scholarships/",                             "source": "StudyInSweden"},
    {"country": "South Korea", "url": "https://www.studyinkorea.go.kr/en/sub/gks/allnew_Mscholar.do",          "source": "StudyInKorea"},
    {"country": "Japan",       "url": "https://www.jasso.or.jp/en/study_j/scholarships/",                      "source": "JASSO"},
    {"country": "Multiple",    "url": "https://www.scholars4dev.com/category/scholarships-for-filipinos/",      "source": "Scholars4Dev"},
    {"country": "Multiple",    "url": "https://www.afterschoolafrica.com/scholarships/philippines/",            "source": "AfterSchoolAfrica"},
]

def _scrape_scholarships_page(src: Dict) -> List[Dict]:
    try:
        resp = requests.get(src["url"], timeout=30, headers=HEADERS)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")
        items = []
        for tag in soup.select("h2 a, h3 a, h4 a, .scholarship-title a, .entry-title a"):
            name = tag.get_text(strip=True)
            href = tag.get("href", "")
            if not name or len(name) < 10:
                continue
            if href and not href.startswith("http"):
                from urllib.parse import urljoin
                href = urljoin(src["url"], href)
            items.append({
                "name":        name,
                "country":     src["country"],
                "eligibility": "Filipino students eligible",
                "url":         href or src["url"],
                "source":      src["source"],
            })
        logger.info("  %s → %d scholarships", src["source"], len(items))
        return items[:50]
    except Exception as exc:
        logger.warning("Scholarship scrape failed (%s): %s", src["source"], exc)
        return []

def scrape_all_scholarships() -> List[Dict]:
    all_items: List[Dict] = []
    for src in SCHOLARSHIP_SOURCES:
        all_items.extend(_scrape_scholarships_page(src))
    return all_items


# ── Field inference ───────────────────────────────────────────────────────────

_FIELD_KEYWORDS: Dict[str, List[str]] = {
    "Engineering":      ["engineer", "technical", "polytechnic", "technology"],
    "Medicine":         ["medicine", "medical", "health", "nursing", "pharma"],
    "Business":         ["business", "management", "economics", "commerce"],
    "Law":              ["law", "legal", "jurisprudence"],
    "Arts":             ["art", "music", "design", "creative", "fine"],
    "Computer Science": ["computing", "informatics", "digital", "software", "computer"],
    "Natural Sciences": ["science", "physics", "chemistry", "biology", "natural"],
    "Social Sciences":  ["social", "political", "sociology", "psychology"],
    "Architecture":     ["architect"],
    "Education":        ["education", "pedagog", "teaching"],
    "Agriculture":      ["agri", "veterinary", "forest"],
}

def _infer_fields(name: str) -> List[str]:
    name_l = name.lower()
    matched = [f for f, kws in _FIELD_KEYWORDS.items() if any(k in name_l for k in kws)]
    return matched if matched else ["General"]


# ── Orchestrator ──────────────────────────────────────────────────────────────

def run_full_scrape():
    """
    Full pipeline:
      1. Bootstrap Appwrite collections (idempotent)
      2. Fetch ETER (Europe) + Wikidata (non-EU)
      3. Enrich with QS rankings
      4. Upsert all universities to Appwrite
      5. Scrape + upsert scholarships
      6. Save last_scrape timestamp to Appwrite meta collection
    """
    logger.info("=" * 60)
    logger.info("Full scrape started — %s", datetime.now(timezone.utc).isoformat())
    logger.info("=" * 60)

    adb.bootstrap()

    all_unis: List[Dict] = []

    # European universities
    all_unis.extend(scrape_eter())

    # Non-EU universities
    for country, qid in WIKIDATA_QIDS.items():
        all_unis.extend(scrape_wikidata_country(country, qid))
        time.sleep(1)

    logger.info("Total raw records: %d", len(all_unis))

    # QS enrichment
    rankings = fetch_qs_rankings()
    if rankings:
        all_unis = enrich_with_qs(all_unis, rankings)

    # Persist universities
    adb.upsert_universities(all_unis)

    # Scholarships
    scholarships = scrape_all_scholarships()
    adb.upsert_scholarships(scholarships)

    # Timestamp
    adb.set_meta("last_scrape", datetime.now(timezone.utc).isoformat())

    logger.info("=" * 60)
    logger.info("Scrape complete — %d universities, %d scholarships → Appwrite", len(all_unis), len(scholarships))
    logger.info("=" * 60)
    return len(all_unis), len(scholarships)


def needs_scrape() -> bool:
    last = adb.get_meta("last_scrape")
    if not last:
        return True
    try:
        ts = datetime.fromisoformat(last)
        age_hours = (datetime.now(timezone.utc) - ts).total_seconds() / 3600
        return age_hours >= 24
    except Exception:
        return True


# Re-export DB helpers so endpoints import from one place
load_universities  = adb.load_universities
load_scholarships  = adb.load_scholarships
get_stats          = adb.get_stats
