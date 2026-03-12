"""SQLite persistence for scan results."""

import json
from typing import List, Optional

import aiosqlite

from config import settings
from scanner.models import ScanResult


async def init_db() -> None:
    """Create the scans table if it does not exist."""
    async with aiosqlite.connect(settings.DB_PATH) as db:
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS scans (
                id            TEXT PRIMARY KEY,
                target        TEXT NOT NULL,
                started_at    TEXT NOT NULL,
                completed_at  TEXT,
                results_json  TEXT NOT NULL
            )
            """
        )
        await db.commit()


async def save_scan(result: ScanResult) -> None:
    """Insert or replace a scan result."""
    async with aiosqlite.connect(settings.DB_PATH) as db:
        await db.execute(
            """
            INSERT OR REPLACE INTO scans (id, target, started_at, completed_at, results_json)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                result.scan_id,
                result.target,
                result.started_at,
                result.completed_at,
                result.model_dump_json(),
            ),
        )
        await db.commit()


async def get_scan(scan_id: str) -> Optional[ScanResult]:
    """Retrieve a single scan by id."""
    async with aiosqlite.connect(settings.DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT results_json FROM scans WHERE id = ?", (scan_id,)
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return ScanResult.model_validate_json(row["results_json"])


async def list_scans(limit: int = 20) -> List[dict]:
    """Return recent scans (summary only)."""
    async with aiosqlite.connect(settings.DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT id, target, started_at, completed_at, results_json "
            "FROM scans ORDER BY started_at DESC LIMIT ?",
            (limit,),
        )
        rows = await cursor.fetchall()
        summaries = []
        for row in rows:
            data = json.loads(row["results_json"])
            summaries.append(
                {
                    "scan_id": row["id"],
                    "target": row["target"],
                    "started_at": row["started_at"],
                    "completed_at": row["completed_at"],
                    "open_ports_count": data.get("open_ports_count", 0),
                    "total_ports_scanned": data.get("total_ports_scanned", 0),
                }
            )
        return summaries
