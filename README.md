# Audio Studio

API e interface web para analisar, baixar e converter vídeos ou arquivos locais para áudio em vários formatos e qualidades.

O projeto usa **FastAPI**, **yt-dlp** e **FFmpeg**. A interface web já vem embutida no backend e pode ser acessada pelo navegador.

## Recursos

- Conversão por URL com suporte via `yt-dlp` para YouTube e várias outras plataformas.
- Suporte best effort para TikTok, Instagram e outras plataformas suportadas pelo `yt-dlp`.
- Upload de arquivos locais de vídeo/áudio para conversão.
- Análise prévia de URL com título, plataforma, autor, duração e thumbnail.
- Conversão por jobs com status, progresso e download ao concluir.
- Formatos lossy: `mp3`, `aac`, `m4a`, `ogg`, `opus`, `wma`.
- Formatos lossless: `wav`, `flac`, `alac`.
- Fallback de FFmpeg via `imageio-ffmpeg`, sem depender obrigatoriamente de FFmpeg instalado no PATH.
- Configuração por `.env`.
- Build Windows em `.exe` com PyInstaller.

## Estrutura

```text
app.py              Backend FastAPI e lógica de conversão
index.html          Interface web
requirements.txt    Dependências Python
.env.example        Modelo de configuração
setup_and_run.bat   Prepara venv e roda localmente
build_exe.bat       Gera dist\AudioStudio.exe
run_exe.bat         Roda o executável gerado
```

Pastas geradas:

```text
.venv/              Ambiente virtual local
build/              Artefatos intermediários do PyInstaller
dist/               Executável final
__pycache__/        Cache Python
```

## Requisitos

- Windows com Python 3 instalado no PATH.
- Conexão com internet para instalar dependências e baixar/analisar URLs.
- FFmpeg externo é opcional. O projeto tenta usar:
  1. `FFMPEG_PATH` definido no `.env`;
  2. `ffmpeg` no PATH;
  3. binário fornecido por `imageio-ffmpeg`.

## Instalação Local

No PowerShell, dentro da pasta do projeto:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Crie o arquivo `.env`:

```powershell
copy .env.example .env
```

## Executar Localmente

Opção simples:

```powershell
.\setup_and_run.bat
```

Ou manualmente:

```powershell
.\.venv\Scripts\activate
python app.py
```

Acesse no navegador:

```text
http://127.0.0.1:8000
```

Documentação automática da API:

```text
http://127.0.0.1:8000/docs
```

## Gerar Executável

Para gerar o `.exe`:

```powershell
.\build_exe.bat
```

Ao final, o executável será criado em:

```text
dist\AudioStudio.exe
```

Para iniciar o executável gerado:

```powershell
.\run_exe.bat
```

Ou execute diretamente:

```powershell
.\dist\AudioStudio.exe
```

Depois acesse:

```text
http://127.0.0.1:8000
```

## Configuração `.env`

Copie `.env.example` para `.env` e ajuste conforme necessário.

```env
APP_ENV=local
APP_HOST=127.0.0.1
APP_PORT=8000
CORS_ORIGINS=*
CORS_ALLOW_CREDENTIALS=false
DEFAULT_MAX_DURATION_SEC=10800
MAX_UPLOAD_MB=250
FFMPEG_TIMEOUT_SEC=1800
JOB_TTL_SEC=7200
JOB_WORKERS=2
FFMPEG_PATH=
```

Principais variáveis:

- `APP_ENV`: use `local` para desenvolvimento; use `production` para execução sem reload.
- `APP_HOST`: host do servidor.
- `APP_PORT`: porta do servidor.
- `CORS_ORIGINS`: origens permitidas. Use `*` apenas localmente.
- `DEFAULT_MAX_DURATION_SEC`: duração máxima padrão para vídeos por URL.
- `MAX_UPLOAD_MB`: tamanho máximo de upload.
- `FFMPEG_TIMEOUT_SEC`: tempo máximo de uma conversão.
- `JOB_TTL_SEC`: tempo que arquivos concluídos ficam disponíveis para download.
- `JOB_WORKERS`: quantidade de conversões simultâneas.
- `FFMPEG_PATH`: caminho absoluto opcional para o executável do FFmpeg.

## Deploy No Render Pelo GitHub

O projeto já inclui um arquivo `render.yaml`, então você pode criar o serviço no Render usando Blueprint.

Passo a passo:

1. Envie o projeto para o GitHub.
2. Acesse o Render Dashboard.
3. Clique em **New +** e escolha **Blueprint**.
4. Conecte o repositório `HiraSanchez/API-Conversor-de-Video`.
5. Confirme a criação do serviço.

O Render usará estas configurações do `render.yaml`:

```text
Build Command: pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
Health Check: /health
```

Observações importantes para produção:

- O Render define a porta automaticamente pela variável `PORT`; o app já está preparado para isso.
- O plano gratuito pode hibernar após períodos sem uso.
- O armazenamento local do Render é temporário. Arquivos convertidos e jobs em memória podem desaparecer quando o serviço reiniciar.
- Para produção pública, os próximos passos recomendados são fila externa, armazenamento externo para downloads, autenticação, rate limit e políticas de uso.

## Como Usar

### Converter por URL

1. Abra `http://127.0.0.1:8000`.
2. Selecione **Via URL**.
3. Cole a URL do vídeo.
4. Clique em **Analisar URL** para ver a prévia.
5. Escolha formato e bitrate.
6. Clique em **Converter URL**.
7. Aguarde o job terminar; o download começa automaticamente.

### Converter arquivo local

1. Abra `http://127.0.0.1:8000`.
2. Selecione **Via Arquivo**.
3. Arraste um arquivo ou clique para selecionar.
4. Escolha formato e bitrate.
5. Clique em **Converter Arquivo**.
6. Aguarde upload, conversão e download automático.

## Endpoints Principais

```text
GET  /health
GET  /formats
POST /analyze/url
POST /jobs/url
POST /jobs/file
GET  /jobs/{job_id}
GET  /jobs/{job_id}/download
POST /convert/url
POST /convert/file
```

Os endpoints `/convert/url` e `/convert/file` continuam disponíveis por compatibilidade, mas a interface usa o fluxo novo de jobs.

## Exemplos De API

Analisar URL:

```powershell
$body = @{
  url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://127.0.0.1:8000/analyze/url" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Criar job por URL:

```powershell
$body = @{
  url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  audio_format = "mp3"
  bitrate_kbps = 192
} | ConvertTo-Json

$job = Invoke-RestMethod `
  -Uri "http://127.0.0.1:8000/jobs/url" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

$job
```

Consultar job:

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/jobs/$($job.id)"
```

## Observações Sobre Plataformas

O suporte a plataformas depende do `yt-dlp` e pode mudar conforme YouTube, TikTok, Instagram e outros sites alteram seus sistemas. Conteúdos públicos tendem a funcionar melhor. Conteúdos privados, com login, restrição regional ou proteção extra podem falhar.

Use apenas conteúdo próprio, autorizado ou permitido pela plataforma.

## Solução De Problemas

### Porta 8000 em uso

Altere `APP_PORT` no `.env`:

```env
APP_PORT=8010
```

### FFmpeg não encontrado

Normalmente o app usa `imageio-ffmpeg`. Se quiser apontar um FFmpeg externo:

```env
FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
```

### Dependências ausentes

Reinstale:

```powershell
.\.venv\Scripts\activate
python -m pip install -r requirements.txt
```

### YouTube/TikTok/Instagram falhando

Atualize `yt-dlp`:

```powershell
.\.venv\Scripts\activate
python -m pip install --upgrade yt-dlp
```

Depois reinicie o servidor.

## Limitações Atuais

- Jobs ficam em memória. Se o servidor reiniciar, os jobs desaparecem.
- Não há autenticação de usuários.
- Não há rate limit por IP.
- Não há fila externa como Redis/Celery.
- O build atual é voltado para Windows.

Esses pontos são próximos passos naturais caso o projeto vá para produção pública.
