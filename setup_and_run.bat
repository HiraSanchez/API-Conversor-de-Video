@echo off
setlocal
REM =====================================================
REM Script simples para preparar ambiente e rodar a API
REM Uso: duplo-clique neste arquivo (Windows)
REM Pre-requisitos: Python 3 no PATH
REM =====================================================

cd /d "%~dp0"

echo.
echo === Audio Studio - setup e inicializacao ===

REM Verifica Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado. Instale o Python 3 e tente novamente.
    pause
    exit /b 1
)

REM Cria ambiente virtual se ainda nao existir
if not exist ".venv" (
    echo Criando ambiente virtual .venv...
    python -m venv .venv
)

REM Ativa ambiente virtual
call .venv\Scripts\activate
if errorlevel 1 (
    echo [ERRO] Nao foi possivel ativar a venv.
    pause
    exit /b 1
)

echo Instalando dependencias (pode demorar na primeira vez)...
.venv\Scripts\python.exe -m pip install --upgrade pip
.venv\Scripts\python.exe -m pip install -r requirements.txt

if not exist ".env" (
    if exist ".env.example" (
        echo Criando .env a partir de .env.example...
        copy ".env.example" ".env" >nul
    )
)

REM Checa ffmpeg externo. O app tambem tenta usar imageio-ffmpeg da venv.
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ATENCAO] ffmpeg nao foi encontrado no PATH.
    echo O app tentara usar o FFmpeg empacotado por imageio-ffmpeg.
    echo Para producao, voce tambem pode definir FFMPEG_PATH no arquivo .env.
)

echo.
echo Iniciando servidor em http://127.0.0.1:8000 ...
echo (Feche esta janela para encerrar o servidor)
.venv\Scripts\python.exe app.py

pause
endlocal
