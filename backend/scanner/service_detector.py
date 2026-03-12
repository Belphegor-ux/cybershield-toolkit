"""Service detection via banner grabbing and signature matching."""

import asyncio
from typing import Optional

from config import COMMON_PORTS

_SIGNATURES = {
    b"SSH": "SSH",
    b"HTTP/": "HTTP",
    b"220 ": "FTP",
    b"250 ": "SMTP",
    b"+OK": "POP3",
    b"* OK": "IMAP",
    b"\x00\x00\x00": "MySQL",
    b"-ERR": "Redis",
    b"MongoDB": "MongoDB",
}

_PROBE = b"HEAD / HTTP/1.0\r\n\r\n"


async def grab_banner(
    host: str,
    port: int,
    timeout: float = 2.0,
) -> Optional[str]:
    """Connect to host:port, send a probe, and return the banner string."""
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=timeout,
        )
        writer.write(_PROBE)
        await writer.drain()
        data = await asyncio.wait_for(reader.read(1024), timeout=timeout)
        writer.close()
        await writer.wait_closed()
        if data:
            return data.decode("utf-8", errors="replace").strip()
    except (asyncio.TimeoutError, OSError, ConnectionRefusedError):
        pass
    return None


def identify_service(port: int, banner: Optional[str] = None) -> str:
    """Identify the service from a banner or fall back to well-known ports."""
    if banner:
        raw = banner.encode("utf-8", errors="replace")
        for sig, name in _SIGNATURES.items():
            if sig in raw:
                return name
    return COMMON_PORTS.get(port, "unknown")
