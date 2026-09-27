// Demo timer for hackathon judging. No libraries; works offline.

// OwlHacks '26 invite: lands in #welcome, grants OwlHacks '26 + Neighbor, never expires.
const COMMUNITY_URL = "https://discord.gg/fxUfeSbFZM";

const WARNING_SECONDS = 10;

// timer.html?s=5 starts from 5 seconds, so the bell can be tested quickly.
function readStartSeconds() {
  const param = Number(new URLSearchParams(location.search).get("s"));
  return Number.isFinite(param) && param > 0 ? Math.floor(param) : 120;
}

const display = document.getElementById("display");
const toggleButton = document.getElementById("toggle");
const resetButton = document.getElementById("reset");
const presetButtons = document.querySelectorAll(".preset");

document.getElementById("community-link").href = COMMUNITY_URL;

// State. remainingMs is the source of truth while paused; endTime while running.
let totalMs = readStartSeconds() * 1000;
let remainingMs = totalMs;
let endTime = null;
let tickId = null;
let audioContext = null;

function format(ms) {
  const seconds = Math.ceil(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ":" + String(s).padStart(2, "0");
}

function render() {
  const seconds = Math.ceil(remainingMs / 1000);
  display.textContent = format(remainingMs);
  display.classList.toggle("warning", seconds > 0 && seconds <= WARNING_SECONDS);
  display.classList.toggle("done", seconds === 0);
  document.title = format(remainingMs) + " · Demo Timer";

  const running = tickId !== null;
  toggleButton.textContent = running ? "Pause" : remainingMs < totalMs && remainingMs > 0 ? "Resume" : "Start";
  toggleButton.disabled = remainingMs === 0;
  presetButtons.forEach((b) => {
    b.disabled = running;
    b.setAttribute("aria-pressed", String(Number(b.dataset.seconds) * 1000 === totalMs));
  });
}

// Count against the clock, not the number of ticks, so a slow tab never drifts.
function tick() {
  remainingMs = Math.max(0, endTime - Date.now());
  if (remainingMs === 0) {
    stopTicking();
    ringBell();
  }
  render();
}

function start() {
  // Browsers only allow sound after a user action. This click is that action.
  if (!audioContext) audioContext = new AudioContext();
  endTime = Date.now() + remainingMs;
  tickId = setInterval(tick, 100);
  render();
}

function stopTicking() {
  clearInterval(tickId);
  tickId = null;
}

function pause() {
  stopTicking();
  remainingMs = Math.max(0, endTime - Date.now());
  render();
}

function reset() {
  stopTicking();
  remainingMs = totalMs;
  render();
}

function toggle() {
  if (remainingMs === 0) return;
  tickId === null ? start() : pause();
}

const BELL_STRIKES = 3;
const STRIKE_GAP_SECONDS = 1;

// One strike: three sine tones played together, fading out. No audio file needed.
function strike(at) {
  [880, 1320, 1760].forEach((frequency, i) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.4 / (i + 1), at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + 2.5);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(at);
    oscillator.stop(at + 2.5);
  });
}

// Ring like a boxing bell: three strikes, one second apart, so a presenter can't miss it.
function ringBell() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  for (let i = 0; i < BELL_STRIKES; i++) {
    strike(now + i * STRIKE_GAP_SECONDS);
  }
}

toggleButton.addEventListener("click", toggle);
resetButton.addEventListener("click", reset);

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    totalMs = Number(button.dataset.seconds) * 1000;
    reset();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.target.closest("a")) return;
  if (event.code === "Space") {
    event.preventDefault();
    toggle();
  } else if (event.key === "r" || event.key === "R") {
    reset();
  } else if (event.key === "f" || event.key === "F") {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
  }
});

render();
