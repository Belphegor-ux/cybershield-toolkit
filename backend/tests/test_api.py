"""Basic API tests for CyberShield backend."""

import sys
import os

# Ensure backend package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_scan_history_empty():
    resp = client.get("/api/scans")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


if __name__ == "__main__":
    test_health_check()
    print("All tests passed.")
