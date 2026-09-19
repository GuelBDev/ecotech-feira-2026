import subprocess
import re
import sys
import os

brave_path = r"C:\Users\migue\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe"

print("==========================================================")
print("🚀 PUBLICADOR ECOTECH NA VERCEL")
print("Destino: https://mundoverdecesc.vercel.app")
print("==========================================================")

# 1. Verificar se já está autenticado
print("\n[1/2] Verificando autenticação na Vercel...")
check_proc = subprocess.run(["npx.cmd", "vercel", "whoami"], capture_output=True, text=True)

if check_proc.returncode != 0:
    print("\nNecessário autenticar. Abrindo login no Brave Browser...")
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
        if match and not opened and os.path.exists(brave_path):
            url = match.group(1)
            print(f"\n>>> [!] Abrindo autenticação no Brave Browser: {url} <<<\n")
            subprocess.Popen([brave_path, url])
            opened = True

    proc.stdout.close()
    login_code = proc.wait()
    if login_code != 0:
        print("\n❌ Falha na autenticação.")
        sys.exit(login_code)
else:
    print(f"✓ Conectado como: {check_proc.stdout.strip()}")

# 2. Publicar em produção
print("\n[2/2] Publicando site na Vercel em modo Produção...")
deploy_proc = subprocess.run(["npx.cmd", "vercel", "deploy", "--prod", "--yes"])

if deploy_proc.returncode == 0:
    print("\n==========================================================")
    print("✅ Publicação concluída com sucesso!")
    print("🔗 Acesse em: https://mundoverdecesc.vercel.app")
    print("==========================================================")
    sys.exit(0)
else:
    print("\n❌ Erro durante o deploy.")
    sys.exit(deploy_proc.returncode)
