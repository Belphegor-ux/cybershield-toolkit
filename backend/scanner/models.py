"""Scanner Pydantic models."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    target: str
    port_range_start: int = Field(default=1, ge=1, le=65535)
    port_range_end: int = Field(default=1024, ge=1, le=65535)


class PortInfo(BaseModel):
    port: int
    state: str = "open"
    service: str = "unknown"
    banner: Optional[str] = None


class ScanResult(BaseModel):
    scan_id: str
    target: str
    started_at: str
    completed_at: Optional[str] = None
    ports: List[PortInfo] = Field(default_factory=list)
    total_ports_scanned: int = 0
    open_ports_count: int = 0
