@echo off
setlocal
REM =====================================================
REM Inicia o executavel gerado pelo build_exe.bat
REM =====================================================

cd /d "%~dp0"

if not exist "dist\AudioStudio.exe" (
    echo [ERRO] dist\AudioStudio.exe nao encontrado.
    echo Rode build_exe.bat primeiro.
    pause
    exit /b 1
)

if not exist "dist\.env" (
    if exist "dist\.env.example" (
        copy "dist\.env.example" "dist\.env" >nul
    ) else if exist ".env.example" (
        copy ".env.example" "dist\.env" >nul
    )
)

echo Iniciando Audio Studio...
echo Acesse: http://127.0.0.1:8000
echo Feche esta janela para encerrar.
cd /d "%~dp0dist"
AudioStudio.exe

pause
endlocal
