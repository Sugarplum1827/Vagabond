"""
Appwrite database layer for Vagabond.

Collections (all inside DATABASE_ID = "vagabond"):
  universities  — one doc per university
  scholarships  — one doc per scholarship
  meta          — single doc tracking last_scrape timestamp

Appwrite document limit per query is 100; we paginate with cursor.

Setup (run once in Appwrite Console or via this module's bootstrap()):
  - Create Database:   vagabond
  - Create Collection: universities  (with attributes below)
  - Create Collection: scholarships  (with attributes below)
  - Create Collection: meta          (with attributes below)
"""

import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from appwrite.query import Query
from appwrite.exception import AppwriteException

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Attribute definitions (for bootstrap) ────────────────────────────────────

UNI_ATTRS = [
    ("name",                   "string",  255,   True),
    ("country",                "string",  100,   True),
    ("city",                   "string",  100,   False),
    ("qs_ranking",             "integer", None,  False),
    ("min_gpa_4_0",            "float",   None,  False),
    ("ielts_requirement",      "float",   None,  False),
    ("tuition_eur",            "float",   None,  False),
    ("total_cost_eur",         "float",   None,  False),
    ("acceptance_rate",        "float",   None,  False),
    ("programs_offered",       "string",  2000,  False),   # JSON array as string
    ("fields_offered",         "string",  2000,  False),   # JSON array as string
    ("application_portal_url", "string",  500,   False),
    ("website_url",            "string",  500,   False),
    ("source",                 "string",  50,    False),
    ("updated_at",             "string",  50,    False),
]

SCH_ATTRS = [
    ("name",        "string",  500,  True),
    ("country",     "string",  100,  False),
    ("amount",      "string",  200,  False),
    ("deadline",    "string",  100,  False),
    ("eligibility", "string",  500,  False),
    ("url",         "string",  500,  False),
    ("source",      "string",  100,  False),
    ("updated_at",  "string",  50,   False),
]

META_ATTRS = [
    ("key",   "string", 100, True),
    ("value", "string", 500, True),
]


# ── Client factory ────────────────────────────────────────────────────────────

def _get_db() -> Databases:
    client = Client()
    client.set_endpoint(settings.APPWRITE_ENDPOINT)
    client.set_project(settings.APPWRITE_PROJECT_ID)
    client.set_key(settings.APPWRITE_API_KEY)
    return Databases(client)


# ── Bootstrap (create DB + collections + attributes if missing) ───────────────

def bootstrap():
    """
    Idempotent setup — safe to call on every startup.
    Creates the database, collections, and attributes if they don't already exist.
    """
    if not settings.APPWRITE_PROJECT_ID or not settings.APPWRITE_API_KEY:
        logger.error(
            "APPWRITE_PROJECT_ID and APPWRITE_API_KEY must be set. "
            "Add them as environment variables in Render."
        )
        return False

    db = _get_db()
    did = settings.APPWRITE_DATABASE_ID

    # Create database
    try:
        db.create(database_id=did, name="Vagabond")
        logger.info("Created Appwrite database: %s", did)
    except AppwriteException as e:
        if "already exists" in str(e).lower() or e.code == 409:
            logger.info("Database '%s' already exists.", did)
        else:
            logger.error("Failed to create database: %s", e)
            return False

    # Create collections + attributes
    for col_id, col_name, attrs in [
        (settings.APPWRITE_UNI_COL_ID,  "Universities",  UNI_ATTRS),
        (settings.APPWRITE_SCH_COL_ID,  "Scholarships",  SCH_ATTRS),
        (settings.APPWRITE_META_COL_ID, "Meta",          META_ATTRS),
    ]:
        try:
            db.create_collection(
                database_id=did,
                collection_id=col_id,
                name=col_name,
                permissions=["read(\"any\")"],
            )
            logger.info("Created collection: %s", col_id)
        except AppwriteException as e:
            if "already exists" in str(e).lower() or e.code == 409:
                logger.info("Collection '%s' already exists.", col_id)
            else:
                logger.error("Failed to create collection %s: %s", col_id, e)
                continue

        for attr in attrs:
            attr_key, attr_type, size, required = attr
            try:
                if attr_type == "string":
                    db.create_string_attribute(
                        database_id=did, collection_id=col_id,
                        key=attr_key, size=size, required=required,
                    )
                elif attr_type == "integer":
                    db.create_integer_attribute(
                        database_id=did, collection_id=col_id,
                        key=attr_key, required=required,
                    )
                elif attr_type == "float":
                    db.create_float_attribute(
                        database_id=did, collection_id=col_id,
                        key=attr_key, required=required,
                    )
            except AppwriteException as e:
                if "already exists" in str(e).lower() or e.code == 409:
                    pass  # attribute exists, skip
                else:
                    logger.warning("Attr %s.%s: %s", col_id, attr_key, e)

    logger.info("Appwrite bootstrap complete.")
    return True


# ── Write helpers ─────────────────────────────────────────────────────────────

def _chunk(lst: list, n: int):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


def upsert_universities(records: List[Dict]):
    """
    Upsert universities in bulk.
    Strategy: list existing docs by (name, country), update if found, create if not.
    Appwrite has no native upsert, so we batch-check then write.
    """
    if not records:
        return

    db  = _get_db()
    did = settings.APPWRITE_DATABASE_ID
    cid = settings.APPWRITE_UNI_COL_ID
    now = datetime.now(timezone.utc).isoformat()

    # Build a lookup of existing docs: (name_lower, country_lower) -> doc_id
    existing: Dict[tuple, str] = {}
    cursor = None
    while True:
        queries = [Query.limit(100)]
        if cursor:
            queries.append(Query.cursor_after(cursor))
        try:
            resp = db.list_documents(database_id=did, collection_id=cid, queries=queries)
        except AppwriteException as e:
            logger.error("Failed to list universities: %s", e)
            break
        docs = resp["documents"]
        for doc in docs:
            key = (doc.get("name", "").lower(), doc.get("country", "").lower())
            existing[key] = doc["$id"]
        if len(docs) < 100:
            break
        cursor = docs[-1]["$id"]

    logger.info("Found %d existing university docs in Appwrite.", len(existing))

    created = updated = errors = 0
    for rec in records:
        key = (rec.get("name", "").lower(), rec.get("country", "").lower())
        data = {
            "name":                   rec.get("name", "")[:255],
            "country":                rec.get("country", "")[:100],
            "city":                   (rec.get("city") or "")[:100] or None,
            "qs_ranking":             rec.get("qs_ranking"),
            "min_gpa_4_0":            rec.get("min_gpa_4_0"),
            "ielts_requirement":      rec.get("ielts_requirement"),
            "tuition_eur":            rec.get("tuition_eur"),
            "total_cost_eur":         rec.get("total_cost_eur"),
            "acceptance_rate":        rec.get("acceptance_rate"),
            "programs_offered":       json.dumps(rec.get("programs_offered", []))[:2000],
            "fields_offered":         json.dumps(rec.get("fields_offered", []))[:2000],
            "application_portal_url": (rec.get("application_portal_url") or "")[:500] or None,
            "website_url":            (rec.get("website_url") or "")[:500] or None,
            "source":                 (rec.get("source") or "unknown")[:50],
            "updated_at":             now[:50],
        }
        try:
            if key in existing:
                db.update_document(
                    database_id=did, collection_id=cid,
                    document_id=existing[key], data=data,
                )
                updated += 1
            else:
                db.create_document(
                    database_id=did, collection_id=cid,
                    document_id=ID.unique(), data=data,
                )
                created += 1
        except AppwriteException as e:
            logger.debug("Upsert failed for %s: %s", rec.get("name"), e)
            errors += 1

    logger.info(
        "Universities — created: %d, updated: %d, errors: %d",
        created, updated, errors,
    )


def upsert_scholarships(records: List[Dict]):
    if not records:
        return

    db  = _get_db()
    did = settings.APPWRITE_DATABASE_ID
    cid = settings.APPWRITE_SCH_COL_ID
    now = datetime.now(timezone.utc).isoformat()

    # For scholarships we just recreate — they change frequently
    # Delete all first, then insert fresh batch
    cursor = None
    while True:
        queries = [Query.limit(100)]
        if cursor:
            queries.append(Query.cursor_after(cursor))
        try:
            resp = db.list_documents(database_id=did, collection_id=cid, queries=queries)
        except AppwriteException:
            break
        docs = resp["documents"]
        for doc in docs:
            try:
                db.delete_document(database_id=did, collection_id=cid, document_id=doc["$id"])
            except AppwriteException:
                pass
        if len(docs) < 100:
            break
        cursor = docs[-1]["$id"] if docs else None

    created = 0
    for rec in records:
        try:
            db.create_document(
                database_id=did, collection_id=cid,
                document_id=ID.unique(),
                data={
                    "name":        (rec.get("name") or "")[:500],
                    "country":     (rec.get("country") or "")[:100] or None,
                    "amount":      (rec.get("amount") or "")[:200] or None,
                    "deadline":    (rec.get("deadline") or "")[:100] or None,
                    "eligibility": (rec.get("eligibility") or "")[:500] or None,
                    "url":         (rec.get("url") or "")[:500] or None,
                    "source":      (rec.get("source") or "")[:100] or None,
                    "updated_at":  now[:50],
                },
            )
            created += 1
        except AppwriteException as e:
            logger.debug("Scholarship insert failed: %s", e)

    logger.info("Scholarships created: %d", created)


def set_meta(key: str, value: str):
    db  = _get_db()
    did = settings.APPWRITE_DATABASE_ID
    cid = settings.APPWRITE_META_COL_ID
    try:
        resp = db.list_documents(
            database_id=did, collection_id=cid,
            queries=[Query.equal("key", key), Query.limit(1)],
        )
        if resp["documents"]:
            db.update_document(
                database_id=did, collection_id=cid,
                document_id=resp["documents"][0]["$id"],
                data={"key": key, "value": value},
            )
        else:
            db.create_document(
                database_id=did, collection_id=cid,
                document_id=ID.unique(),
                data={"key": key, "value": value},
            )
    except AppwriteException as e:
        logger.warning("set_meta failed: %s", e)


def get_meta(key: str) -> Optional[str]:
    db  = _get_db()
    did = settings.APPWRITE_DATABASE_ID
    cid = settings.APPWRITE_META_COL_ID
    try:
        resp = db.list_documents(
            database_id=did, collection_id=cid,
            queries=[Query.equal("key", key), Query.limit(1)],
        )
        if resp["documents"]:
            return resp["documents"][0].get("value")
    except AppwriteException:
        pass
    return None


# ── Read helpers ──────────────────────────────────────────────────────────────

def load_universities(
    country:      Optional[str]   = None,
    degree_level: Optional[str]   = None,
    field:        Optional[str]   = None,
    max_budget:   Optional[float] = None,
    query:        Optional[str]   = None,
    limit:        int             = 100,
) -> List[Dict]:

    db  = _get_db()
    did = settings.APPWRITE_DATABASE_ID
    cid = settings.APPWRITE_UNI_COL_ID

    results: List[Dict] = []
    cursor = None
    fetch_limit = min(limit * 6, 500)  # over-fetch so Python filters work

    while len(results) < fetch_limit:
        queries = [Query.limit(100)]
        if country:
            queries.append(Query.equal("country", country))
        if max_budget is not None:
            queries.append(Query.less_than_equal("total_cost_eur", max_budget))
        if cursor:
            queries.append(Query.cursor_after(cursor))

        try:
            resp = db.list_documents(database_id=did, collection_id=cid, queries=queries)
        except AppwriteException as e:
            logger.error("load_universities query failed: %s", e)
            break

        docs = resp["documents"]
        for doc in docs:
            r = _doc_to_uni(doc)

            # Python-side filters (Appwrite doesn't support array-contains)
            if query:
                q = query.lower()
                haystack = f"{r['name']} {r['city']} {r['fields_offered']}".lower()
                if q not in haystack:
                    continue
            if degree_level:
                if degree_level not in r.get("programs_offered", []):
                    continue
            if field:
                if field not in r.get("fields_offered", []):
                    continue

            results.append(r)
            if len(results) >= limit:
                return results

        if len(docs) < 100:
            break
        cursor = docs[-1]["$id"]

    # Sort: ranked first, then alphabetical
    results.sort(key=lambda u: (
        u["qs_ranking"] if u.get("qs_ranking") else 99999,
        u["name"],
    ))
    return results[:limit]


def load_scholarships(country: Optional[str] = None, limit: int = 50) -> List[Dict]:
    db  = _get_db()
    did = settings.APPWRITE_DATABASE_ID
    cid = settings.APPWRITE_SCH_COL_ID

    results = []
    cursor  = None

    while len(results) < limit:
        queries = [Query.limit(100)]
        if cursor:
            queries.append(Query.cursor_after(cursor))
        try:
            resp = db.list_documents(database_id=did, collection_id=cid, queries=queries)
        except AppwriteException as e:
            logger.error("load_scholarships failed: %s", e)
            break

        docs = resp["documents"]
        for doc in docs:
            r = dict(doc)
            r["id"] = r.pop("$id", None)
            if country and r.get("country") not in (country, "Multiple", None):
                continue
            results.append(r)
            if len(results) >= limit:
                return results

        if len(docs) < 100:
            break
        cursor = docs[-1]["$id"]

    return results


def get_stats() -> Dict[str, Any]:
    db  = _get_db()
    did = settings.APPWRITE_DATABASE_ID
    try:
        uni_count = db.list_documents(
            database_id=did,
            collection_id=settings.APPWRITE_UNI_COL_ID,
            queries=[Query.limit(1)],
        ).get("total", 0)
        sch_count = db.list_documents(
            database_id=did,
            collection_id=settings.APPWRITE_SCH_COL_ID,
            queries=[Query.limit(1)],
        ).get("total", 0)
    except AppwriteException:
        uni_count = sch_count = 0

    last_scrape = get_meta("last_scrape")

    return {
        "universities": uni_count,
        "scholarships": sch_count,
        "last_scrape":  last_scrape,
        "db_path":      f"Appwrite / project={settings.APPWRITE_PROJECT_ID} / db={did}",
        "countries":    {},
    }


# ── Internal helpers ──────────────────────────────────────────────────────────

def _doc_to_uni(doc: Dict) -> Dict:
    r = dict(doc)
    r["id"] = r.pop("$id", 0)
    # parse JSON arrays back to lists
    for col in ("programs_offered", "fields_offered"):
        raw = r.get(col, "[]")
        try:
            r[col] = json.loads(raw) if isinstance(raw, str) else raw or []
        except Exception:
            r[col] = []
    return r
