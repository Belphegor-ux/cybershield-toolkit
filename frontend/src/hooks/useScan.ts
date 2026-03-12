import { useState, useCallback, useEffect } from 'react';
import type { ScanResult, PortInfo, WsProgressEvent } from '../lib/types';
import { startScan as apiStartScan, getScanResult } from '../lib/api';
import { useWebSocket } from './useWebSocket';

export function useScan() {
  const [scanning, setScanning] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [portFeed, setPortFeed] = useState<PortInfo[]>([]);

  const { events, lastEvent, reset: resetWs } = useWebSocket(scanId);

  useEffect(() => {
    if (!lastEvent) return;
    if (lastEvent.type === 'progress') {
      const evt = lastEvent as WsProgressEvent;
      setProgress(evt.percent);
      if (evt.is_open) {
        setPortFeed((prev) => [
          ...prev,
          { port: evt.port, state: 'open', service: 'detecting...', banner: null },
        ]);
      }
    }
    if (lastEvent.type === 'complete' && scanId) {
      getScanResult(scanId).then((r) => {
        setResults(r);
        setScanning(false);
      });
    }
  }, [lastEvent, scanId]);

  const scan = useCallback(async (target: string, start: number, end: number) => {
    setScanning(true);
    setResults(null);
    setProgress(0);
    setPortFeed([]);
    resetWs();

    const resp = await apiStartScan({
      target,
      port_range_start: start,
      port_range_end: end,
    });
    setScanId(resp.scan_id);
  }, [resetWs]);

  return { scanning, scanId, results, progress, portFeed, startScan: scan, events };
}
