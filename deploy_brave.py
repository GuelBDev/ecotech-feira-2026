import subprocess
import re
import sys
import os

brave_path = r"C:\Users\migue\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe"

print("==========================================================")
print("1. Conectando login da Vercel via Brave Browser...")
print("==========================================================")

proc = subprocess.Popen(
    ["npx.cmd", "vercel", "login"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

opened = False

for line in iter(proc.stdout.readline, ''):
    sys.stdout.write(line)
    sys.stdout.flush()

    match = re.search(r'(https://vercel\.com/oauth/device\?user_code=[A-Z0-9-]+)', line)
    if match and not opened:
        url = match.group(1)
        print(f"\n>>> [!] Abrindo autenticação no Brave Browser: {url} <<<\n")
        subprocess.Popen([brave_path, url])
        opened = True

proc.stdout.close()
login_code = proc.wait()
print(f"\nLogin concluido com status: {login_code}")

if login_code == 0:
    print("\n==========================================================")
    print("2. Publicando site na Vercel (https://mundoverdecesc.vercel.app)...")
    print("==========================================================")
    deploy_proc = subprocess.run(["npx.cmd", "vercel", "deploy", "--prod", "--yes"])
    sys.exit(deploy_proc.returncode)
else:
    print("\nFalha na autenticacao.")
    sys.exit(login_code)

