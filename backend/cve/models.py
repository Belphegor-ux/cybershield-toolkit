"""CVE Pydantic models."""

from typing import List, Optional

from pydantic import BaseModel


class CVEItem(BaseModel):
    cve_id: str
    description: str
    severity: Optional[str] = None
    score: Optional[float] = None
    published: Optional[str] = None


class CVEResponse(BaseModel):
    service: str
    total_results: int
    vulnerabilities: List[CVEItem]
