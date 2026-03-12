"""CyberShield Toolkit — Configuration."""

from dataclasses import dataclass, field
from typing import Dict


COMMON_PORTS: Dict[int, str] = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    111: "RPCbind",
    135: "MSRPC",
    139: "NetBIOS-SSN",
    143: "IMAP",
    443: "HTTPS",
    445: "Microsoft-DS",
    993: "IMAPS",
    995: "POP3S",
    1433: "MSSQL",
    1521: "Oracle",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    5900: "VNC",
    6379: "Redis",
    8080: "HTTP-Proxy",
    8443: "HTTPS-Alt",
    27017: "MongoDB",
}


@dataclass(frozen=True)
class Settings:
    DEFAULT_TIMEOUT: float = 1.5
    MAX_CONCURRENT: int = 100
    DB_PATH: str = "scans.db"
    NVD_API_BASE: str = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000


settings = Settings()
