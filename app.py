import os
import shutil
import tempfile
import uuid
import subprocess
import logging
import re
import time
import threading
import sys
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, List, Dict

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, Field

try:
    from pydantic import field_validator
except ImportError:
    from pydantic import validator as field_validator

def _app_dir() -> str:
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

def _resource_dir() -> str:
    return getattr(sys, "_MEIPASS", _app_dir())

APP_DIR = _app_dir()
RESOURCE_DIR = _resource_dir()
BASE_DIR = APP_DIR

try:
    from dotenv import load_dotenv

    load_dotenv(os.path.join(APP_DIR, ".env"))
except Exception:
    pass

def _env_int(name: str, default: int, minimum: Optional[int] = None) -> int:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        value = int(raw)
    except ValueError:
        return default
    if minimum is not None:
        return max(minimum, value)
    return value

def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on", "sim"}

def _env_list(name: str, default: str) -> List[str]:
    raw = os.getenv(name, default)
    items = [item.strip() for item in raw.split(",") if item.strip()]
    return items or [default]

# ============================================================
# Catálogo de formatos e recomendações de bitrate
# ============================================================

AUDIO_FORMATS: Dict[str, Dict] = {
    # Lossy
    "mp3":  {"codec": "libmp3lame", "ext": "mp3", "category": "lossy"},
    "aac":  {"codec": "aac",         "ext": "m4a", "category": "lossy"},  # usa contêiner m4a
    "m4a":  {"codec": "aac",         "ext": "m4a", "category": "lossy"},
    "ogg":  {"codec": "libvorbis",   "ext": "ogg", "category": "lossy"},
    "opus": {"codec": "libopus",     "ext": "opus","category": "lossy"},
    "wma":  {"codec": "wmav2",       "ext": "wma", "category": "lossy"},  # pode não existir em todos builds do FFmpeg

    # Lossless
    "wav":  {"codec": "pcm_s16le",   "ext": "wav", "category": "lossless"},
    "flac": {"codec": "flac",        "ext": "flac","category": "lossless"},
    "alac": {"codec": "alac",        "ext": "m4a", "category": "lossless"},
}

RECOMMENDED_BITRATES = {
    "lossy":   [64, 96, 128, 160, 192, 224, 256, 320],
    "lossless": []  # ignorado (sem perdas)
}

MIN_BITRATE_KBPS = 32
MAX_BITRATE_KBPS = 512
APP_ENV = os.getenv("APP_ENV", "local").strip().lower()
APP_HOST = os.getenv("APP_HOST", "127.0.0.1")
APP_PORT = _env_int("APP_PORT", _env_int("PORT", 8000, minimum=1), minimum=1)
CORS_ORIGINS = _env_list("CORS_ORIGINS", "*")
CORS_ALLOW_CREDENTIALS = _env_bool("CORS_ALLOW_CREDENTIALS", False)
DEFAULT_MAX_DURATION_SEC = _env_int("DEFAULT_MAX_DURATION_SEC", 3 * 60 * 60, minimum=1)
MAX_UPLOAD_MB = _env_int("MAX_UPLOAD_MB", 250, minimum=1)
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024
FFMPEG_TIMEOUT_SEC = _env_int("FFMPEG_TIMEOUT_SEC", 30 * 60, minimum=1)
JOB_TTL_SEC = _env_int("JOB_TTL_SEC", 2 * 60 * 60, minimum=60)
JOB_WORKERS = _env_int("JOB_WORKERS", 2, minimum=1)
_FFMPEG_EXE: Optional[str] = None
JOB_EXECUTOR = ThreadPoolExecutor(max_workers=JOB_WORKERS)
JOBS: Dict[str, Dict] = {}
JOBS_LOCK = threading.Lock()

# ============================================================
# Modelos
# ============================================================

class URLConvertRequest(BaseModel):
    url: HttpUrl = Field(..., description="URL do vídeo (YouTube ou outras plataformas suportadas)")
    audio_format: str = Field(..., description="Formato de saída (mp3, aac, m4a, ogg, opus, wma, wav, flac, alac)")
    bitrate_kbps: Optional[int] = Field(None, description="Bitrate desejado (apenas para formatos 'lossy')")
    max_duration_sec: Optional[int] = Field(DEFAULT_MAX_DURATION_SEC, description="Limite opcional de duração do vídeo (segundos)")

    @field_validator("audio_format")
    @classmethod
    def validate_audio_format(cls, value: str) -> str:
        return _normalize_audio_format(value)

    @field_validator("bitrate_kbps")
    @classmethod
    def validate_bitrate(cls, value: Optional[int]) -> Optional[int]:
        return _validate_bitrate(value)

    @field_validator("max_duration_sec")
    @classmethod
    def validate_max_duration(cls, value: Optional[int]) -> Optional[int]:
        return _validate_max_duration(value)

class URLAnalyzeRequest(BaseModel):
    url: HttpUrl = Field(..., description="URL do vídeo para análise")
    max_duration_sec: Optional[int] = Field(DEFAULT_MAX_DURATION_SEC, description="Limite opcional de duração do vídeo (segundos)")

    @field_validator("max_duration_sec")
    @classmethod
    def validate_max_duration(cls, value: Optional[int]) -> Optional[int]:
        return _validate_max_duration(value)

# ============================================================
# App
# ============================================================

# Logger básico para acompanhar o fluxo de execução
logger = logging.getLogger("converter")
if not logging.getLogger().handlers:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)
logger.propagate = False


app = FastAPI(
    title="Video to Audio API",
    version="1.0.0",
    description="Converte vídeos (URL ou upload) em áudios com formato e bitrate configuráveis."
)

# CORS aberto por padrão para facilitar testes locais; ajuste para origens específicas em produção.
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "env": APP_ENV,
        "job_workers": JOB_WORKERS,
        "max_upload_mb": MAX_UPLOAD_MB,
        "default_max_duration_sec": DEFAULT_MAX_DURATION_SEC,
    }


@app.get("/", include_in_schema=False)
def serve_index():
    """
    Serve a página index.html na raiz, para ficar fácil de usar:
    http://127.0.0.1:8000/
    """
    index_path = os.path.join(RESOURCE_DIR, "index.html")
    if not os.path.exists(index_path):
        index_path = os.path.join(APP_DIR, "index.html")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=500, detail="index.html não encontrado no servidor.")
    return FileResponse(index_path, media_type="text/html")

@app.get("/formats")
def get_formats():
    """Lista formatos, categorias e bitrates recomendados."""
    by_category = {"lossy": [], "lossless": []}
    for fmt, meta in AUDIO_FORMATS.items():
        by_category[meta["category"]].append({
            "format": fmt,
            "codec": meta["codec"],
            "ext": meta["ext"]
        })
    return {
        "categories": {
            "lossy": {
                "formats": by_category["lossy"],
                "recommended_bitrates_kbps": RECOMMENDED_BITRATES["lossy"]
            },
            "lossless": {
                "formats": by_category["lossless"],
                "recommended_bitrates_kbps": RECOMMENDED_BITRATES["lossless"]
            }
        }
    }

# ============================================================
# Utilitários de conversão e limpeza
# ============================================================

def _normalize_audio_format(audio_format: str) -> str:
    fmt = (audio_format or "").lower().strip()
    if fmt not in AUDIO_FORMATS:
        raise ValueError(f"Formato não suportado: {audio_format}")
    return fmt

def _validate_bitrate(bitrate_kbps: Optional[int]) -> Optional[int]:
    if bitrate_kbps is None:
        return None
    bitrate = int(bitrate_kbps)
    if bitrate < MIN_BITRATE_KBPS or bitrate > MAX_BITRATE_KBPS:
        raise ValueError(f"Bitrate deve estar entre {MIN_BITRATE_KBPS} e {MAX_BITRATE_KBPS} kbps.")
    return bitrate

def _validate_max_duration(max_duration_sec: Optional[int]) -> Optional[int]:
    if max_duration_sec is not None and max_duration_sec <= 0:
        raise ValueError("max_duration_sec deve ser maior que zero.")
    return max_duration_sec

def _validate_upload_size(file_path: str):
    size = os.path.getsize(file_path)
    if size > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Arquivo excede o limite de upload ({MAX_UPLOAD_MB} MB).",
        )

def _safe_filename_part(value: Optional[str], default: str = "audio") -> str:
    name = os.path.splitext(os.path.basename(value or ""))[0].strip()
    name = re.sub(r"[^\w .-]+", "_", name, flags=re.UNICODE)
    name = re.sub(r"\s+", " ", name).strip(" .-_")
    return name[:120] or default

def _format_duration(seconds: Optional[int]) -> Optional[str]:
    if not seconds:
        return None
    total = int(seconds)
    hours, remainder = divmod(total, 3600)
    minutes, secs = divmod(remainder, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"

def _best_thumbnail(info: Dict) -> Optional[str]:
    if info.get("thumbnail"):
        return info["thumbnail"]
    thumbnails = info.get("thumbnails") or []
    thumbnails = [thumb for thumb in thumbnails if thumb.get("url")]
    if not thumbnails:
        return None
    thumbnails.sort(key=lambda thumb: (thumb.get("width") or 0, thumb.get("height") or 0), reverse=True)
    return thumbnails[0]["url"]

def _platform_name(info: Dict) -> str:
    extractor = (info.get("extractor_key") or info.get("extractor") or "generic").lower()
    if "youtube" in extractor:
        return "YouTube"
    if "tiktok" in extractor:
        return "TikTok"
    if "instagram" in extractor:
        return "Instagram"
    return info.get("extractor_key") or info.get("extractor") or "Generic"

def _build_url_analysis(url: str, info: Dict, max_duration_sec: Optional[int]) -> Dict:
    if info.get("_type") in {"playlist", "multi_video"} and info.get("entries"):
        raise HTTPException(status_code=400, detail="Playlists ainda não são suportadas. Envie a URL de um vídeo específico.")

    duration = info.get("duration")
    if max_duration_sec and duration and duration > max_duration_sec:
        logger.warning(f"Vídeo excede duração permitida: {duration}s > {max_duration_sec}s")
        raise HTTPException(
            status_code=400,
            detail=f"Vídeo excede a duração máxima permitida ({max_duration_sec}s)."
        )

    return {
        "url": url,
        "webpage_url": info.get("webpage_url") or url,
        "title": info.get("title") or "Sem título",
        "platform": _platform_name(info),
        "extractor": info.get("extractor"),
        "extractor_key": info.get("extractor_key"),
        "uploader": info.get("uploader") or info.get("channel") or info.get("creator"),
        "duration_sec": duration,
        "duration_text": _format_duration(duration),
        "thumbnail": _best_thumbnail(info),
        "is_live": bool(info.get("is_live")),
        "availability": info.get("availability"),
        "age_limit": info.get("age_limit"),
    }

def _get_ffmpeg_executable() -> str:
    global _FFMPEG_EXE
    if _FFMPEG_EXE:
        return _FFMPEG_EXE

    configured = os.getenv("FFMPEG_PATH")
    candidates = [configured] if configured else []
    path_candidate = shutil.which("ffmpeg")
    if path_candidate:
        candidates.append(path_candidate)

    for candidate in candidates:
        if not candidate:
            continue
        try:
            subprocess.run([candidate, "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
            _FFMPEG_EXE = candidate
            return _FFMPEG_EXE
        except Exception:
            logger.warning(f"ffmpeg inválido ou inacessível: {candidate}")

    try:
        import imageio_ffmpeg

        candidate = imageio_ffmpeg.get_ffmpeg_exe()
        subprocess.run([candidate, "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        _FFMPEG_EXE = candidate
        return _FFMPEG_EXE
    except Exception:
        logger.error("ffmpeg não encontrado no PATH, FFMPEG_PATH ou imageio-ffmpeg.")
        raise HTTPException(
            status_code=500,
            detail="FFmpeg não encontrado. Instale o FFmpeg, defina FFMPEG_PATH ou instale imageio-ffmpeg.",
        )

def _get_ffmpeg_location() -> str:
    ffmpeg_exe = _get_ffmpeg_executable()
    return os.path.dirname(ffmpeg_exe)

def _ensure_ffmpeg_available():
    ffmpeg_exe = _get_ffmpeg_executable()
    logger.info(f"ffmpeg OK encontrado: {ffmpeg_exe}")

def _ffmpeg_convert(input_path: str, target_fmt: str, bitrate_kbps: Optional[int]) -> str:
    """
    Converte arquivo de vídeo/áudio para o formato desejado usando ffmpeg.
    Retorna caminho do arquivo convertido (temporário).
    """
    target_fmt = target_fmt.lower().strip()
    if target_fmt not in AUDIO_FORMATS:
        raise HTTPException(status_code=400, detail=f"Formato não suportado: {target_fmt}")

    meta = AUDIO_FORMATS[target_fmt]
    codec = meta["codec"]
    ext = meta["ext"]
    category = meta["category"]

    out_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}.{ext}")
    ffmpeg_exe = _get_ffmpeg_executable()
    cmd = [ffmpeg_exe, "-y", "-i", input_path, "-vn", "-acodec", codec]

    # Bitrate apenas para 'lossy'
    if category == "lossy" and bitrate_kbps:
        # Para Vorbis, ideal seria qualidade (qscale), mas -b:a funciona de forma simples e direta.
        cmd += ["-b:a", f"{int(bitrate_kbps)}k"]

    # Ex.: para fixar taxa de amostragem, descomente:
    # cmd += ["-ar", "48000"]

    cmd += [out_path]

    logger.info(f"ffmpeg iniciando conversão: src={input_path} -> fmt={target_fmt} bitrate={bitrate_kbps} cmd={' '.join(cmd)}")
    try:
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=FFMPEG_TIMEOUT_SEC)
    except subprocess.TimeoutExpired:
        logger.error("ffmpeg excedeu o tempo máximo de conversão.")
        raise HTTPException(status_code=504, detail="A conversão excedeu o tempo máximo permitido.")
    if proc.returncode != 0 or not os.path.exists(out_path):
        err = proc.stderr.decode(errors="ignore")
        logger.error(f"ffmpeg falhou (code={proc.returncode}) err={err[:500]}")
        raise HTTPException(status_code=500, detail=f"Falha na conversão: {err[:800]}")
    logger.info(f"ffmpeg concluiu: out={out_path}")
    return out_path

def _cleanup(paths: List[str]):
    for p in paths:
        try:
            if not p:
                continue
            if os.path.isdir(p):
                shutil.rmtree(p, ignore_errors=True)
            elif os.path.exists(p):
                os.remove(p)
            logger.info(f"Limpeza concluída: {p}")
        except Exception:
            # evita quebrar o processo por erro de limpeza
            pass

def _job_snapshot(job: Dict) -> Dict:
    payload = {
        "id": job["id"],
        "kind": job["kind"],
        "status": job["status"],
        "stage": job["stage"],
        "progress": job["progress"],
        "message": job.get("message"),
        "error": job.get("error"),
        "filename": job.get("filename"),
        "analysis": job.get("analysis"),
        "created_at": job["created_at"],
        "updated_at": job["updated_at"],
    }
    if job["status"] == "completed":
        payload["download_url"] = f"/jobs/{job['id']}/download"
    return payload

def _update_job(job_id: str, **updates):
    with JOBS_LOCK:
        job = JOBS.get(job_id)
        if not job:
            return
        job.update(updates)
        job["updated_at"] = time.time()

def _cleanup_expired_jobs():
    cutoff = time.time() - JOB_TTL_SEC
    expired = []
    with JOBS_LOCK:
        for job_id, job in list(JOBS.items()):
            if job["status"] in {"completed", "failed"} and job["updated_at"] < cutoff:
                expired.append(JOBS.pop(job_id))

    for job in expired:
        _cleanup([job.get("output_path")] + job.get("cleanup_paths", []))

def _create_job(kind: str) -> Dict:
    _cleanup_expired_jobs()
    job_id = uuid.uuid4().hex
    now = time.time()
    job = {
        "id": job_id,
        "kind": kind,
        "status": "queued",
        "stage": "queued",
        "progress": 0,
        "message": "Job aguardando execução.",
        "created_at": now,
        "updated_at": now,
        "cleanup_paths": [],
    }
    with JOBS_LOCK:
        JOBS[job_id] = job
    return job

def _run_url_job(job_id: str, req: URLConvertRequest):
    dl_dir = tempfile.mkdtemp(prefix="job_dl_")
    input_path = None
    out_path = None
    final_out = None

    try:
        _update_job(job_id, status="running", stage="checking", progress=5, message="Preparando conversão.")
        _ensure_ffmpeg_available()

        try:
            from yt_dlp import YoutubeDL
        except Exception:
            raise HTTPException(status_code=500, detail="yt-dlp não está instalado. Instale com 'pip install yt-dlp'.")

        ydl_opts = {
            "outtmpl": os.path.join(dl_dir, "%(title)s.%(ext)s"),
            "format": "bestaudio/best",
            "noplaylist": True,
            "quiet": True,
            "no_warnings": True,
            "ffmpeg_location": _get_ffmpeg_location(),
        }

        _update_job(job_id, stage="analyzing", progress=15, message="Analisando metadados da URL.")
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(str(req.url), download=False)
            analysis = _build_url_analysis(str(req.url), info, req.max_duration_sec)
            _update_job(job_id, analysis=analysis)

            _update_job(job_id, stage="downloading", progress=35, message="Baixando o melhor áudio disponível.")
            info = ydl.extract_info(str(req.url), download=True)
            input_path = ydl.prepare_filename(info)

        _update_job(job_id, stage="converting", progress=75, message="Convertendo para o formato escolhido.")
        audio_format = req.audio_format
        out_path = _ffmpeg_convert(input_path, audio_format, req.bitrate_kbps)
        filename_base = _safe_filename_part(input_path)
        output_ext = AUDIO_FORMATS[audio_format]["ext"]
        filename = f"{filename_base}.{output_ext}"

        final_out = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}-{filename}")
        shutil.copyfile(out_path, final_out)

        _cleanup([dl_dir, input_path, out_path])
        _update_job(
            job_id,
            status="completed",
            stage="completed",
            progress=100,
            message="Conversão concluída.",
            filename=filename,
            output_path=final_out,
            cleanup_paths=[],
        )
        logger.info(f"job/url concluído job_id={job_id} out={final_out}")

    except HTTPException as exc:
        _cleanup([dl_dir, input_path, out_path, final_out])
        detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
        _update_job(job_id, status="failed", stage="failed", progress=100, message="Falha na conversão.", error=detail)
        logger.warning(f"job/url falhou job_id={job_id} detail={detail}")
    except Exception as exc:
        _cleanup([dl_dir, input_path, out_path, final_out])
        _update_job(job_id, status="failed", stage="failed", progress=100, message="Falha inesperada na conversão.", error=str(exc))
        logger.exception(f"Erro inesperado em job/url job_id={job_id}")

def _run_file_job(job_id: str, input_path: str, original_filename: str, audio_format: str, bitrate_kbps: Optional[int]):
    out_path = None
    final_out = None

    try:
        _update_job(job_id, status="running", stage="checking", progress=10, message="Preparando arquivo enviado.")
        _ensure_ffmpeg_available()

        _update_job(job_id, stage="converting", progress=65, message="Convertendo arquivo para o formato escolhido.")
        out_path = _ffmpeg_convert(input_path, audio_format, bitrate_kbps)

        base_name = _safe_filename_part(original_filename, default="audio")
        output_ext = AUDIO_FORMATS[audio_format]["ext"]
        filename = f"{base_name}.{output_ext}"

        final_out = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}-{filename}")
        shutil.copyfile(out_path, final_out)

        _cleanup([input_path, out_path])
        _update_job(
            job_id,
            status="completed",
            stage="completed",
            progress=100,
            message="Conversão concluída.",
            filename=filename,
            output_path=final_out,
            cleanup_paths=[],
        )
        logger.info(f"job/file concluído job_id={job_id} out={final_out}")

    except HTTPException as exc:
        _cleanup([input_path, out_path, final_out])
        detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
        _update_job(job_id, status="failed", stage="failed", progress=100, message="Falha na conversão.", error=detail)
        logger.warning(f"job/file falhou job_id={job_id} detail={detail}")
    except Exception as exc:
        _cleanup([input_path, out_path, final_out])
        _update_job(job_id, status="failed", stage="failed", progress=100, message="Falha inesperada na conversão.", error=str(exc))
        logger.exception(f"Erro inesperado em job/file job_id={job_id}")

# ============================================================
# Endpoints
# ============================================================

@app.post("/analyze/url")
def analyze_url(req: URLAnalyzeRequest):
    """
    Consulta metadados da URL sem baixar o vídeo.
    Útil para prévia antes de iniciar uma conversão.
    """
    try:
        from yt_dlp import YoutubeDL
    except Exception:
        raise HTTPException(status_code=500, detail="yt-dlp não está instalado. Instale com 'pip install yt-dlp'.")

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "skip_download": True,
        "socket_timeout": 20,
        "retries": 1,
    }

    try:
        logger.info(f"analyze/url iniciado url={req.url} max_dur={req.max_duration_sec}")
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(str(req.url), download=False)
        analysis = _build_url_analysis(str(req.url), info, req.max_duration_sec)
        logger.info(f"analyze/url OK platform={analysis['platform']} duration={analysis['duration_sec']}")
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Erro inesperado em /analyze/url")
        raise HTTPException(status_code=502, detail=f"Não foi possível analisar a URL: {str(e)}")

@app.post("/jobs/url")
def create_url_job(req: URLConvertRequest):
    """
    Cria um job assíncrono de conversão por URL.
    Consulte GET /jobs/{id} até status=completed e baixe em /jobs/{id}/download.
    """
    job = _create_job("url")
    JOB_EXECUTOR.submit(_run_url_job, job["id"], req)
    return _job_snapshot(job)

@app.post("/jobs/file")
async def create_file_job(
    file: UploadFile = File(...),
    audio_format: str = Form(...),
    bitrate_kbps: Optional[int] = Form(None)
):
    """
    Cria um job assíncrono de conversão para arquivo enviado.
    O upload acontece nesta requisição; a conversão segue em segundo plano.
    """
    try:
        audio_format = _normalize_audio_format(audio_format)
        bitrate_kbps = _validate_bitrate(bitrate_kbps)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    safe_upload_name = _safe_filename_part(file.filename, default="upload")
    original_ext = os.path.splitext(os.path.basename(file.filename or ""))[1][:16]
    tmp_in = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{safe_upload_name}{original_ext}")

    try:
        with open(tmp_in, "wb") as f:
            shutil.copyfileobj(file.file, f)
        _validate_upload_size(tmp_in)
    except Exception as exc:
        _cleanup([tmp_in])
        if isinstance(exc, HTTPException):
            raise exc
        raise HTTPException(status_code=500, detail=f"Não foi possível salvar o upload: {exc}")

    try:
        size_mb = os.path.getsize(tmp_in) / (1024 * 1024)
        logger.info(f"Upload para job salvo em {tmp_in} ({size_mb:.2f} MB)")
    except Exception:
        pass

    job = _create_job("file")
    _update_job(job["id"], original_filename=file.filename, message="Upload recebido. Job aguardando execução.")
    JOB_EXECUTOR.submit(_run_file_job, job["id"], tmp_in, file.filename or "audio", audio_format, bitrate_kbps)

    with JOBS_LOCK:
        return _job_snapshot(JOBS[job["id"]])

@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    _cleanup_expired_jobs()
    with JOBS_LOCK:
        job = JOBS.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job não encontrado ou expirado.")
        return _job_snapshot(job)

@app.get("/jobs/{job_id}/download")
def download_job(job_id: str):
    with JOBS_LOCK:
        job = JOBS.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job não encontrado ou expirado.")
        if job["status"] != "completed":
            raise HTTPException(status_code=409, detail="O job ainda não foi concluído.")
        output_path = job.get("output_path")
        filename = job.get("filename") or "audio"

    if not output_path or not os.path.exists(output_path):
        raise HTTPException(status_code=410, detail="Arquivo do job não está mais disponível.")

    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return FileResponse(output_path, media_type="application/octet-stream", filename=filename, headers=headers)

@app.post("/convert/url")
def convert_from_url(req: URLConvertRequest, bg: BackgroundTasks):
    """
    Faz download do melhor áudio disponível da URL (via yt-dlp) e converte para o formato desejado.
    """
    _ensure_ffmpeg_available()

    try:
        from yt_dlp import YoutubeDL
    except Exception:
        raise HTTPException(status_code=500, detail="yt-dlp não está instalado. Instale com 'pip install yt-dlp'.")

    dl_dir = tempfile.mkdtemp(prefix="dl_")
    input_path = None
    final_out = None
    out_path = None

    try:
        ydl_opts = {
            "outtmpl": os.path.join(dl_dir, "%(title)s.%(ext)s"),
            "format": "bestaudio/best",
            "noplaylist": True,
            "quiet": True,
            "no_warnings": True,
            "ffmpeg_location": _get_ffmpeg_location(),
        }

        logger.info(f"convert/url iniciado url={req.url} fmt={req.audio_format} br={req.bitrate_kbps} max_dur={req.max_duration_sec}")

        with YoutubeDL(ydl_opts) as ydl:
            # yt-dlp espera uma string comum; HttpUrl é um tipo pydantic
            logger.info("Consultando metadata (sem download)...")
            info = ydl.extract_info(str(req.url), download=False)

            duration = info.get("duration")
            if req.max_duration_sec and duration and duration > req.max_duration_sec:
                logger.warning(f"Vídeo excede duração permitida: {duration}s > {req.max_duration_sec}s")
                raise HTTPException(
                    status_code=400,
                    detail=f"Vídeo excede a duração máxima permitida ({req.max_duration_sec}s)."
                )
            logger.info(f"Metadata OK: duration={duration}s; iniciando download do melhor áudio...")
            info = ydl.extract_info(str(req.url), download=True)
            input_path = ydl.prepare_filename(info)
            logger.info(f"Download concluído: input_path={input_path} duration={duration}s")

        audio_format = req.audio_format
        out_path = _ffmpeg_convert(input_path, audio_format, req.bitrate_kbps)
        filename_base = _safe_filename_part(input_path)
        output_ext = AUDIO_FORMATS[audio_format]["ext"]
        filename = f"{filename_base}.{output_ext}"

        # Copia para um arquivo final que existirá até o envio da resposta
        final_out = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}-{filename}")
        shutil.copyfile(out_path, final_out)
        logger.info(f"Arquivo final preparado: {final_out}")

        # agenda limpeza pós-resposta
        bg.add_task(_cleanup, [dl_dir, input_path, out_path, final_out])

        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
        return FileResponse(final_out, media_type="application/octet-stream", filename=filename, headers=headers)

    except HTTPException:
        _cleanup([dl_dir, input_path, out_path, final_out])
        raise
    except Exception as e:
        _cleanup([dl_dir, input_path, out_path, final_out])
        logger.exception("Erro inesperado em /convert/url")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/convert/file")
async def convert_from_file(
    bg: BackgroundTasks,
    file: UploadFile = File(...),
    audio_format: str = Form(...),
    bitrate_kbps: Optional[int] = Form(None)
):
    """
    Recebe upload de arquivo de vídeo/áudio e converte para o formato desejado.
    """
    _ensure_ffmpeg_available()

    try:
        audio_format = _normalize_audio_format(audio_format)
        bitrate_kbps = _validate_bitrate(bitrate_kbps)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    safe_upload_name = _safe_filename_part(file.filename, default="upload")
    original_ext = os.path.splitext(os.path.basename(file.filename or ""))[1][:16]
    tmp_in = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}_{safe_upload_name}{original_ext}")
    out_path = None
    final_out = None
    try:
        logger.info(f"convert/file iniciado filename={file.filename} fmt={audio_format} br={bitrate_kbps}")
        with open(tmp_in, "wb") as f:
            shutil.copyfileobj(file.file, f)
        _validate_upload_size(tmp_in)
        try:
            size_mb = os.path.getsize(tmp_in) / (1024 * 1024)
            logger.info(f"Upload salvo em {tmp_in} ({size_mb:.2f} MB)")
        except Exception:
            pass

        out_path = _ffmpeg_convert(tmp_in, audio_format, bitrate_kbps)

        base_name = _safe_filename_part(file.filename, default="audio")
        output_ext = AUDIO_FORMATS[audio_format]["ext"]
        filename = f"{base_name}.{output_ext}"

        final_out = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4().hex}-{filename}")
        shutil.copyfile(out_path, final_out)
        logger.info(f"Arquivo final preparado: {final_out}")

        # agenda limpeza pós-resposta
        bg.add_task(_cleanup, [tmp_in, out_path, final_out])

        headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
        return FileResponse(final_out, media_type="application/octet-stream", filename=filename, headers=headers)

    except HTTPException:
        _cleanup([tmp_in, out_path, final_out])
        raise
    except Exception as e:
        _cleanup([tmp_in, out_path, final_out])
        logger.exception("Erro inesperado em /convert/file")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    """
    Permite rodar direto com: python app.py
    (útil em Windows para evitar usar uvicorn no comando)
    """
    import uvicorn

    is_frozen = getattr(sys, "frozen", False)
    uvicorn.run(
        app if is_frozen else "app:app",
        host=APP_HOST,
        port=APP_PORT,
        reload=APP_ENV == "local" and not is_frozen,
    )
