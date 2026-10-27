const formEl = document.getElementById("start-form");
const inputEl = document.getElementById("start-input");
const errorEl = document.getElementById("error-text");
const resultsEl = document.getElementById("results");
const statStepsEl = document.getElementById("stat-steps");
const statPeakEl = document.getElementById("stat-peak");
const statPeakStepEl = document.getElementById("stat-peak-step");
const chartEl = document.getElementById("chart");
const ctx = chartEl.getContext("2d");
const btnPlay = document.getElementById("btn-play");
const btnStep = document.getElementById("btn-step");
const btnResetPlay = document.getElementById("btn-reset-play");
const speedEl = document.getElementById("speed");
const currentStepEl = document.getElementById("current-step");
const sequenceLineEl = document.getElementById("sequence-line");

let sequence = [];
let playIndex = 0;
let playing = false;
let timer = null;

function showError(message) {
  if (!message) {
    errorEl.hidden = true;
    errorEl.textContent = "";
    return;
  }
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function apiDetail(data) {
  const detail = data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || String(item)).join(" ");
  }
  return "Request failed.";
}

function formatList(nums) {
  return nums.join(", ");
}

function delayMs() {
  return Math.round(180 - Number(speedEl.value) * 1.6);
}

function drawChart(highlightIndex) {
  const w = chartEl.width;
  const h = chartEl.height;
  const pad = { top: 16, right: 12, bottom: 28, left: 48 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  ctx.clearRect(0, 0, w, h);
  if (sequence.length < 2) return;

  const maxVal = Math.max(...sequence);
  const len = sequence.length;

  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.lineTo(w - pad.right, h - pad.bottom);
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px JetBrains Mono, monospace";
  ctx.fillText(String(maxVal), 4, pad.top + 10);
  ctx.fillText("1", 8, h - pad.bottom - 4);
  ctx.fillText("step", w - pad.right - 28, h - 6);

  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const x = pad.left + (i / (len - 1)) * innerW;
    const y = pad.top + innerH - (sequence[i] / maxVal) * innerH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const hi = Math.min(highlightIndex, len - 1);
  const hx = pad.left + (hi / (len - 1)) * innerW;
  const hy = pad.top + innerH - (sequence[hi] / maxVal) * innerH;
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(hx, hy, 5, 0, Math.PI * 2);
  ctx.fill();
}

function updatePlaybackUi() {
  if (!sequence.length) return;
  const value = sequence[playIndex];
  currentStepEl.textContent = `Step ${playIndex}: ${value.toLocaleString()}`;
  const shown = sequence.slice(0, playIndex + 1);
  const tail = sequence.length > shown.length ? ", …" : "";
  sequenceLineEl.textContent = formatList(shown) + tail;
  drawChart(playIndex);
}

function pause() {
  playing = false;
  btnPlay.textContent = "Play";
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function play() {
  if (!sequence.length) return;
  if (playing) {
    pause();
    return;
  }
  if (playIndex >= sequence.length - 1) {
    playIndex = 0;
  }
  playing = true;
  btnPlay.textContent = "Pause";
  timer = setInterval(() => {
    if (playIndex >= sequence.length - 1) {
      pause();
      return;
    }
    playIndex += 1;
    updatePlaybackUi();
  }, delayMs());
}

function applyResult(data) {
  sequence = data.sequence;
  playIndex = 0;
  pause();

  statStepsEl.textContent = data.steps.toLocaleString();
  statPeakEl.textContent = data.peak.toLocaleString();
  statPeakStepEl.textContent = data.peak_at_step.toLocaleString();

  resultsEl.hidden = false;
  updatePlaybackUi();
}

async function fetchSequence(start) {
  const res = await fetch("/api/sequence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(apiDetail(data));
  return data;
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("");
  pause();
  const start = Number(inputEl.value);
  try {
    const data = await fetchSequence(start);
    applyResult(data);
  } catch (err) {
    showError(err.message || "Could not generate sequence.");
  }
});

btnPlay.addEventListener("click", () => play());
btnStep.addEventListener("click", () => {
  pause();
  if (!sequence.length) return;
  if (playIndex < sequence.length - 1) {
    playIndex += 1;
    updatePlaybackUi();
  }
});
btnResetPlay.addEventListener("click", () => {
  pause();
  playIndex = 0;
  updatePlaybackUi();
});
speedEl.addEventListener("input", () => {
  if (playing) {
    pause();
    play();
  }
});

document.querySelectorAll("[data-help-jump]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("help-heading")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

formEl.dispatchEvent(new Event("submit"));
