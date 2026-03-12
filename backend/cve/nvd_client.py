"""NVD API client for CVE lookups."""

from typing import List

import httpx

from config import settings
from cve.models import CVEItem, CVEResponse


async def search_cves(
    keyword: str,
    results_per_page: int = 10,
) -> CVEResponse:
    """Query the NVD API for CVEs matching *keyword*."""
    items: List[CVEItem] = []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                settings.NVD_API_BASE,
                params={
                    "keywordSearch": keyword,
                    "resultsPerPage": results_per_page,
                },
            )
            resp.raise_for_status()
            data = resp.json()

            for vuln in data.get("vulnerabilities", []):
                cve = vuln.get("cve", {})
                cve_id = cve.get("id", "N/A")

                desc_list = cve.get("descriptions", [])
                description = next(
                    (d["value"] for d in desc_list if d.get("lang") == "en"),
                    "No description available.",
                )

                severity = None
                score = None
                metrics = cve.get("metrics", {})
                for key in ("cvssMetricV31", "cvssMetricV30", "cvssMetricV2"):
                    metric_list = metrics.get(key, [])
                    if metric_list:
                        cvss = metric_list[0].get("cvssData", {})
                        score = cvss.get("baseScore")
                        severity = cvss.get("baseSeverity")
                        break

                published = cve.get("published")
                items.append(
                    CVEItem(
                        cve_id=cve_id,
                        description=description,
                        severity=severity,
                        score=score,
                        published=published,
                    )
                )
    except (httpx.HTTPError, KeyError, ValueError):
        pass

    return CVEResponse(
        service=keyword,
        total_results=len(items),
        vulnerabilities=items,
    )
