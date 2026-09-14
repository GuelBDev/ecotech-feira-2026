@echo off
title EcoTech - Estande da Feira Escolar
chcp 65001 > nul
echo ========================================================
echo   🌱 Iniciando Plataforma Interativa do Estande...
echo   EcoTech: Engenharia & Inovacao Sustentavel
echo   Feira Multidisciplinar Escolar 2026
echo ========================================================
echo.
echo Abrindo o site no seu navegador...
start "" "http://localhost:8080/index.html"
echo.
echo Servidor ativo na porta 8080! Para encerrar, feche esta janela.
echo.
python -m http.server 8080
pause
