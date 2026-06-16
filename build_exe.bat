@echo off
setlocal
REM =====================================================
REM Gera um executavel unico (.exe) usando PyInstaller
REM Pre-requisitos: Python 3 no PATH
REM Uso: duplo-clique neste arquivo ou rode via terminal
REM =====================================================

cd /d "%~dp0"

if not exist ".venv" (
    echo Criando ambiente virtual .venv...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERRO] Nao foi possivel criar a venv.
        pause
        exit /b 1
    )
)

call .venv\Scripts\activate
if errorlevel 1 (
    echo [ERRO] Nao foi possivel ativar a venv.
    pause
    exit /b 1
)

echo Instalando dependencias...
.venv\Scripts\python.exe -m pip install --upgrade pip
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m pip install --upgrade pyinstaller

echo.
echo Gerando executavel unico (AudioStudio.exe)...
.venv\Scripts\python.exe -m PyInstaller ^
  --clean ^
  --onefile ^
  --name AudioStudio ^
  --add-data "index.html;." ^
  --add-data ".env.example;." ^
  --collect-all yt_dlp ^
  --collect-all imageio_ffmpeg ^
  --hidden-import imageio_ffmpeg ^
  app.py

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao gerar o executavel.
    pause
    exit /b 1
)

if not exist "dist\.env.example" (
    copy ".env.example" "dist\.env.example" >nul
)

echo.
echo Concluido!
echo O executavel esta em: dist\AudioStudio.exe
echo Configure dist\.env se quiser alterar porta, CORS, limites ou FFMPEG_PATH.
pause
endlocal


