"""
FastAPI app — Collatz Sequence.

Run: uvicorn main:app --reload --port 3017
"""

from __future__ import annotations

import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

_DEMO_ROOT = Path(__file__).resolve().parent.parent
if str(_DEMO_ROOT) not in sys.path:
    sys.path.insert(0, str(_DEMO_ROOT))

from collatz_core import (  # noqa: E402
    MAX_START,
    MIN_START,
    collatz_sequence,
    public_result,
)

app = FastAPI(title="Collatz Sequence")
templates = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))
app.mount("/static", StaticFiles(directory=str(Path(__file__).parent / "static")), name="static")


class SequenceRequest(BaseModel):
    start: int = Field(..., ge=MIN_START, le=MAX_START)


@app.get("/", response_class=HTMLResponse)
async def index(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(
        request,
        "index.html",
        {"min_start": MIN_START, "max_start": MAX_START},
    )


@app.post("/api/sequence")
async def api_sequence(body: SequenceRequest) -> JSONResponse:
    try:
        sequence = collatz_sequence(body.start)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return JSONResponse(public_result(body.start, sequence))
