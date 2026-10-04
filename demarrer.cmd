@echo off
rem Blackstart CRM - version equipe : double-cliquez sur ce fichier (ou tapez demarrer dans CMD).
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Blackstart CRM

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js n'est pas installe.
  echo  Installez la version LTS depuis https://nodejs.org puis relancez ce fichier.
  start "" https://nodejs.org/fr/download
  pause
  exit /b 1
)

for /f "tokens=1,2 delims=v." %%a in ('node -v') do (set NODE_MAJ=%%a& set NODE_MIN=%%b)
if %NODE_MAJ% LSS 22 goto vieux
if %NODE_MAJ% EQU 22 if %NODE_MIN% LSS 5 goto vieux
goto ok
:vieux
echo.
echo  Node.js 22.5 ou plus recent est requis. Version installee :
node -v
echo  Installez la version LTS depuis https://nodejs.org puis relancez ce fichier.
start "" https://nodejs.org/fr/download
pause
exit /b 1
:ok

if not exist "node_modules\express" (
  echo  Premiere installation des dependances, une minute...
  call npm install --omit=dev --no-audit --no-fund
  if errorlevel 1 (
    echo  L'installation a echoue : verifiez votre connexion Internet.
    pause
    exit /b 1
  )
)

if "%PORT%"=="" set PORT=3000
echo.
echo  Blackstart CRM demarre sur http://localhost:%PORT%
echo  Laissez cette fenetre ouverte. Pour arreter : Ctrl+C ou fermez la fenetre.
echo.
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:%PORT%"
node --experimental-sqlite --disable-warning=ExperimentalWarning server\src\index.js
echo.
echo  Le serveur s'est arrete.
pause
