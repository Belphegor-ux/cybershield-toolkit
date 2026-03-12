"""CyberShield Toolkit — FastAPI application."""

import asyncio
import json
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Dict, List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from cve.nvd_client import search_cves
from db.database import get_scan, init_db, list_scans, save_scan
from scanner.models import PortInfo, ScanRequest, ScanResult
from scanner.service_detector import grab_banner, identify_service
from scanner.tcp_scanner import scan_ports


# ---------------------------------------------------------------------------
# Active-scan bookkeeping (in-memory)
# ---------------------------------------------------------------------------
active_scans: Dict[str, ScanResult] = {}
scan_events: Dict[str, List[dict]] = {}
scan_websockets: Dict[str, List[WebSocket]] = {}


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(_app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="CyberShield Toolkit", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
async def _broadcast(scan_id: str, event: dict) -> None:
    scan_events.setdefault(scan_id, []).append(event)
    for ws in scan_websockets.get(scan_id, []):
        try:
            await ws.send_json(event)
        except Exception:
            pass


async def _run_scan(scan_id: str, target: str, start: int, end: int) -> None:
    """Execute the scan, detect services, persist results."""
    result = active_scans[scan_id]
    semaphore = asyncio.Semaphore(settings.MAX_CONCURRENT)
    total = end - start + 1
    scanned = 0

    async def on_port_done(port: int, is_open: bool) -> None:
        nonlocal scanned
        scanned += 1
        event = {
            "type": "progress",
            "scan_id": scan_id,
            "port": port,
            "is_open": is_open,
            "scanned": scanned,
            "total": total,
            "percent": round(scanned / total * 100, 1),
        }
        await _broadcast(scan_id, event)

    # --- port scan ---
    async def _check(port: int) -> None:
        async with semaphore:
            try:
                reader, writer = await asyncio.wait_for(
                    asyncio.open_connection(target, port),
                    timeout=settings.DEFAULT_TIMEOUT,
                )
                writer.close()
                await writer.wait_closed()
                is_open = True
            except (asyncio.TimeoutError, OSError, ConnectionRefusedError):
                is_open = False

            if is_open:
                banner = await grab_banner(target, port)
                service = identify_service(port, banner)
                result.ports.append(
                    PortInfo(port=port, state="open", service=service, banner=banner)
                )
            await on_port_done(port, is_open)

    tasks = [_check(p) for p in range(start, end + 1)]
    await asyncio.gather(*tasks)

    result.ports.sort(key=lambda p: p.port)
    result.total_ports_scanned = total
    result.open_ports_count = len(result.ports)
    result.completed_at = datetime.now(timezone.utc).isoformat()

    await save_scan(result)
    await _broadcast(scan_id, {
        "type": "complete",
        "scan_id": scan_id,
        "open_ports_count": result.open_ports_count,
        "total_ports_scanned": result.total_ports_scanned,
    })


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/scan")
async def start_scan(req: ScanRequest):
    scan_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    result = ScanResult(scan_id=scan_id, target=req.target, started_at=now)
    active_scans[scan_id] = result
    asyncio.create_task(
        _run_scan(scan_id, req.target, req.port_range_start, req.port_range_end)
    )
    return {"scan_id": scan_id, "status": "started"}


@app.websocket("/ws/scan/{scan_id}")
async def ws_scan(websocket: WebSocket, scan_id: str):
    await websocket.accept()
    scan_websockets.setdefault(scan_id, []).append(websocket)

    # replay events that already happened
    for evt in scan_events.get(scan_id, []):
        await websocket.send_json(evt)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        scan_websockets.get(scan_id, []).remove(websocket)


@app.get("/api/scan/{scan_id}")
async def get_scan_result(scan_id: str):
    if scan_id in active_scans:
        return active_scans[scan_id].model_dump()
    result = await get_scan(scan_id)
    if result is None:
        return {"error": "Scan not found"}, 404
    return result.model_dump()


@app.get("/api/scans")
async def get_scan_history():
    return await list_scans()


@app.get("/api/cve/{service}")
async def get_cves(service: str):
    resp = await search_cves(service)
    return resp.model_dump()


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
