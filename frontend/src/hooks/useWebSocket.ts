import { useEffect, useRef, useState, useCallback } from 'react';
import type { WsEvent } from '../lib/types';

export function useWebSocket(scanId: string | null) {
  const [events, setEvents] = useState<WsEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WsEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (!scanId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}://${host}/ws/scan/${scanId}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    ws.onmessage = (msg) => {
      try {
        const evt: WsEvent = JSON.parse(msg.data);
        setLastEvent(evt);
        setEvents((prev) => [...prev, evt]);
      } catch {
        // ignore malformed messages
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [scanId]);

  const reset = useCallback(() => {
    setEvents([]);
    setLastEvent(null);
  }, []);

  return { events, isConnected, lastEvent, disconnect, reset };
}
