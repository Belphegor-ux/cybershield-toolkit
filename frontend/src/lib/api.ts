import type { ScanRequest, ScanResult, ScanHistoryItem, CVEResponse } from './types';

const BASE = '/api';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function startScan(body: ScanRequest) {
  return request<{ scan_id: string; status: string }>('/scan', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getScanResult(scanId: string) {
  return request<ScanResult>(`/scan/${scanId}`);
}

export function getScans() {
  return request<ScanHistoryItem[]>('/scans');
}

export function getCVEs(service: string) {
  return request<CVEResponse>(`/cve/${encodeURIComponent(service)}`);
}
