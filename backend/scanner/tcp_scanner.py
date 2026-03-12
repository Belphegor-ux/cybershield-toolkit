"""Async TCP connect scanner."""

import asyncio
from typing import Callable, List, Optional


async def scan_port(
    host: str,
    port: int,
    timeout: float = 1.5,
) -> bool:
    """Return True if the TCP port is open."""
    try:
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=timeout,
        )
        writer.close()
        await writer.wait_closed()
        return True
    except (asyncio.TimeoutError, OSError, ConnectionRefusedError):
        return False


async def scan_ports(
    host: str,
    start: int,
    end: int,
    timeout: float = 1.5,
    semaphore: Optional[asyncio.Semaphore] = None,
    callback: Optional[Callable[[int, bool], None]] = None,
) -> List[int]:
    """Scan a range of ports and return list of open ports."""
    if semaphore is None:
        semaphore = asyncio.Semaphore(100)

    open_ports: List[int] = []

    async def _check(port: int) -> None:
        async with semaphore:
            is_open = await scan_port(host, port, timeout)
            if is_open:
                open_ports.append(port)
            if callback is not None:
                callback(port, is_open)

    tasks = [_check(p) for p in range(start, end + 1)]
    await asyncio.gather(*tasks)

    return sorted(open_ports)
