@echo off
chcp 65001 > nul
title Publicar EcoTech na Vercel (mundoverdecesc.vercel.app)
echo ===================================================================
echo       🚀 PUBLICADOR ECOTECH NA VERCEL (PRODUCAO VIA BRAVE)
echo ===================================================================
echo.
echo  Link de Destino: https://mundoverdecesc.vercel.app
echo.
python deploy_brave.py
echo.
echo ===================================================================
pause

