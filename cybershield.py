import socket
import sys
import time
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.panel import Panel

console = Console()

def print_banner():
    banner = """
    [bold yellow]
     ▄████▄   ▓██   ██▓ ▄▄▄▄    ▓█████  ██▀███    ██████  ██░ ██  ██▓▓█████  ██▓     ▓█████▄ 
    ▒██▀ ▀█    ▒██  ██▒▓█████▄  ▓█   ▀ ▓██ ▒ ██▒▒██    ▒ ▓██░ ██ ▒██▒▓█   ▀ ▓██▒     ▒██▀ ██▌
    ▒▓█    ▄    ▒██ ██░▒██▒ ▄██ ▒███   ▓██ ░▄█ ▒░ ▓██▄   ▒██▀▀██ ▒██▒▒███   ▒██░     ░██   █▌
    ▒▓▓▄ ▄██▒   ░ ▐██▓░▒██░█▀   ▒▓█  ▄ ▒██▀▀█▄    ▒   ██▒░▓█ ░██ ░██░▒▓█  ▄ ▒██░     ░██   █▌
    ▒ ▓███▀ ░   ░ ██▒▓░░▓█  ▀█▓ ░▒████▒░██▓ ▒██▒▒██████▒▒░▓█▒░██▓░██░░▒████▒░██████▒░██████  
    ░ ░▒ ▒  ░    ██▒▒▒ ░▒▓███▀▒ ░░ ▒░ ░░ ▒▓ ░▒▓░▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒░▓  ░░ ▒░ ░░ ▒░▓  ░░ ▒░▓  ░ 
      ░  ▒     ▓██ ░▒░  ▒░▒   ░  ░ ░  ░  ░▒ ░ ▒░░ ░▒  ░ ░ ▒ ░▒░ ░ ▒ ░ ░ ░  ░░ ░ ▒  ░░ ░ ▒  ░ 
    ░        ▒ ▒ ░░    ░    ░    ░     ░░   ░ ░  ░  ░   ░  ░░ ░ ▒ ░   ░     ░ ░     ░ ░    
    ░ ░      ░ ░       ░         ░  ░   ░           ░     ░  ░ ░ ░     ░  ░   ░  ░    ░    
    ░                  ░                                                               ░   
    [/bold yellow]
    [bold cyan]Nano-Banana Cybersecurity Toolkit v1.0.0[/bold cyan]
    """
    console.print(Panel(banner, border_style="yellow"))

def scan_port(ip, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.5)
            if s.connect_ex((ip, port)) == 0:
                return True
    except:
        pass
    return False

def run_scanner(target):
    print_banner()
    console.print(f"[bold cyan]Target:[/bold cyan] {target}\n")
    
    common_ports = {
        21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 
        53: "DNS", 80: "HTTP", 443: "HTTPS", 3306: "MySQL", 
        3389: "RDP", 8080: "HTTP-Proxy"
    }
    
    table = Table(title=f"Scan Results for {target}", border_style="yellow")
    table.add_column("Port", style="cyan", no_wrap=True)
    table.add_column("Service", style="magenta")
    table.add_column("Status", style="green")
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True,
    ) as progress:
        task = progress.add_task("[yellow]Scanning ports...", total=len(common_ports))
        
        for port, service in common_ports.items():
            if scan_port(target, port):
                table.add_row(str(port), service, "[bold green]OPEN[/bold green]")
            progress.update(task, advance=1)
            time.sleep(0.1)

    console.print(table)
    console.print("\n[bold green]✔[/bold green] Scan complete.")

if __name__ == "__main__":
    target = "127.0.0.1"
    if len(sys.argv) > 1:
        target = sys.argv[1]
    run_scanner(target)
