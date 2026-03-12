# Cybershield Toolkit (Nano-Banana Edition) 

A modular, high-speed Python toolkit for security auditing and network reconnaissance. Designed with a "flashy" CLI interface for terminal-based SecOps.

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Security](https://img.shields.io/badge/Security-Red?style=for-the-badge&logo=shoppay&logoColor=white)
![Rich CLI](https://img.shields.io/badge/Rich-CLI-green?style=for-the-badge&logo=pyup&logoColor=yellow)

## Features
- **Flashy CLI:** Stunning ASCII banners and real-time "Banana Spinner" status updates.
- **Fast Port Scanner:** High-speed socket-based scanning for common security audit ports.
- **Nano-Banana Tech:** Minimalist overhead using Python's `Rich` library for data-rich terminal tables.
- **Dynamic Targets:** Easily switch between localhost or remote targets via CLI arguments.

## Quick Start

### Prerequisites
- [Python 3.10+](https://www.python.org/)

### Installation
```bash
git clone https://github.com/Belphegor-ux/cybershield-toolkit.git
cd cybershield-toolkit
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
# Install dependencies
pip install rich requests
```

### Running the Scanner
```bash
# Default (localhost scan)
python cybershield.py

# Custom target
python cybershield.py 8.8.8.8
```

## Tech Stack
- **Language:** Python 3.10+
- **Visuals:** [Rich](https://github.com/Textualize/rich)
- **Networking:** Native Sockets
- **Recon:** Shodan/Nmap compatible ports list

## Disclaimer
This tool is for educational and authorized security auditing purposes only. Use it only on networks you own or have permission to scan.

---
Built with 🍌 by [Belphegor-ux](https://github.com/Belphegor-ux)
