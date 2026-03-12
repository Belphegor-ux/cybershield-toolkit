export interface ScanRequest {
  target: string;
  port_range_start: number;
  port_range_end: number;
}

export interface PortInfo {
  port: number;
  state: string;
  service: string;
  banner: string | null;
}

export interface ScanResult {
  scan_id: string;
  target: string;
  started_at: string;
  completed_at: string | null;
  ports: PortInfo[];
  total_ports_scanned: number;
  open_ports_count: number;
}

export interface CVEItem {
  cve_id: string;
  description: string;
  severity: string | null;
  score: number | null;
  published: string | null;
}

export interface CVEResponse {
  service: string;
  total_results: number;
  vulnerabilities: CVEItem[];
}

export interface ScanHistoryItem {
  scan_id: string;
  target: string;
  started_at: string;
  completed_at: string | null;
  open_ports_count: number;
  total_ports_scanned: number;
}

export interface WsProgressEvent {
  type: 'progress';
  scan_id: string;
  port: number;
  is_open: boolean;
  scanned: number;
  total: number;
  percent: number;
}

export interface WsCompleteEvent {
  type: 'complete';
  scan_id: string;
  open_ports_count: number;
  total_ports_scanned: number;
}

export type WsEvent = WsProgressEvent | WsCompleteEvent;
