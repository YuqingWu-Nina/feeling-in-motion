// Program state: each new mark remembers its brush and intensity.
let selectedBrush = "pulsing";
let intensity = 50;
let isAnimating = false;
let strokes = [];

const canvas = document.getElementById("drawingCanvas");
const context = canvas.getContext("2d");
const intensityInput = document.getElementById("intensity");
const intensityValue = document.getElementById("intensityValue");
const animateButton = document.getElementById("animateButton");
const pauseButton = document.getElementById("pauseButton");
const clearButton = document.getElementById("clearButton");
const statusMessage = document.getElementById("statusMessage");
let isDrawing = false;
let lastPoint = null;
let animationStart = null;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();
  canvas.width = Math.round(bounds.width * ratio);
  canvas.height = Math.round(bounds.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawScene(performance.now());
}

// Smoothly mixes pale yellow, orange, and red for the chosen intensity.
function colorForIntensity(value) {
  const stops = value < 50
    ? [[247, 230, 163], [239, 145, 53], value / 50]
    : [[239, 145, 53], [181, 46, 43], (value - 50) / 50];
  const [from, to, amount] = stops;
  return `rgb(${from.map((number, index) => Math.round(number + (to[index] - number) * amount)).join(",")})`;
}

function drawBodyGuide(width, height) {
  const center = width / 2;
  const scale = Math.min(width / 520, height / 585);
  context.save();
  context.strokeStyle = "rgba(244, 214, 190, .16)";
  context.lineWidth = 1.35;
  context.setLineDash([5, 9]);
  // A larger, deliberately abstract body guide behind the participant's marks.
  context.beginPath();
  context.arc(center, 82 * scale, 59 * scale, 0, Math.PI * 2);
  context.moveTo(center - 34 * scale, 140 * scale);
  context.bezierCurveTo(center - 154 * scale, 165 * scale, center - 134 * scale, 268 * scale, center - 74 * scale, 309 * scale);
  context.bezierCurveTo(center - 40 * scale, 359 * scale, center - 48 * scale, 425 * scale, center - 68 * scale, 561 * scale);
  context.moveTo(center + 34 * scale, 140 * scale);
  context.bezierCurveTo(center + 154 * scale, 165 * scale, center + 134 * scale, 268 * scale, center + 74 * scale, 309 * scale);
  context.bezierCurveTo(center + 40 * scale, 359 * scale, center + 48 * scale, 425 * scale, center + 68 * scale, 561 * scale);
  context.moveTo(center - 33 * scale, 147 * scale);
  context.bezierCurveTo(center - 62 * scale, 215 * scale, center - 42 * scale, 276 * scale, center - 16 * scale, 333 * scale);
  context.moveTo(center + 33 * scale, 147 * scale);
  context.bezierCurveTo(center + 62 * scale, 215 * scale, center + 42 * scale, 276 * scale, center + 16 * scale, 333 * scale);
  context.moveTo(center - 16 * scale, 333 * scale);
  context.bezierCurveTo(center - 72 * scale, 394 * scale, center - 55 * scale, 475 * scale, center - 52 * scale, 571 * scale);
  context.moveTo(center + 16 * scale, 333 * scale);
  context.bezierCurveTo(center + 72 * scale, 394 * scale, center + 55 * scale, 475 * scale, center + 52 * scale, 571 * scale);
  context.stroke();
  context.restore();
}

function drawPulsing(mark, amount) {
  const size = 11 + mark.intensity * .11 + Math.sin(amount) * mark.intensity * .13;
  context.globalAlpha = .76;
  context.beginPath(); context.arc(mark.x, mark.y, size, 0, Math.PI * 2); context.fill();
  context.globalAlpha = .3;
  context.beginPath(); context.arc(mark.x, mark.y, size * 1.55, 0, Math.PI * 2); context.stroke();
}

function drawBurning(mark, amount) {
  const shake = Math.sin(amount * 5.2) * mark.intensity * .13;
  const flare = Math.abs(Math.sin(amount * 2.6)) * mark.intensity * .11;
  const size = 13 + mark.intensity * .13;
  // Angular, broken bolts make burning visually distinct from soreness waves.
  context.globalAlpha = .9; context.lineWidth = 2.1 + mark.intensity * .024;
  context.beginPath();
  context.moveTo(mark.x - size, mark.y + shake);
  context.lineTo(mark.x - size * .33, mark.y - size - flare);
  context.lineTo(mark.x - size * .13, mark.y - size * .16 + shake);
  context.lineTo(mark.x + size * .27, mark.y - size * .75 - flare);
  context.lineTo(mark.x + size, mark.y + shake);
  context.stroke();
  context.globalAlpha = .48; context.lineWidth *= .58;
  context.beginPath();
  context.moveTo(mark.x - size * .72, mark.y + size * .55 - shake);
  context.lineTo(mark.x - size * .18, mark.y + size * .06 + flare);
  context.lineTo(mark.x + size * .12, mark.y + size * .62 - shake);
  context.lineTo(mark.x + size * .68, mark.y + size * .1 + flare);
  context.stroke();
}

function drawBlockage(mark, amount) {
  const compression = 1 - Math.sin(amount * 2.9) * mark.intensity * .0045;
  const distance = (5 + mark.intensity * .055) * compression;
  context.globalAlpha = .72;
  for (let index = 0; index < 9; index += 1) {
    const angle = (Math.PI * 2 * index) / 9 + mark.seed;
    const radius = index % 2 ? distance : distance * .45;
    context.beginPath();
    context.arc(mark.x + Math.cos(angle) * radius, mark.y + Math.sin(angle) * radius, 2.7 + mark.intensity * .018, 0, Math.PI * 2);
    context.fill();
  }
}

function drawSoreness(mark, amount) {
  const width = 15 + mark.intensity * .13;
  const wave = Math.sin(amount * 1.9) * mark.intensity * .18;
  context.lineWidth = 2.7 + mark.intensity * .018;
  [-6, 6].forEach((offset, index) => {
    context.globalAlpha = index === 0 ? .74 : .36;
    context.beginPath();
    context.moveTo(mark.x - width, mark.y + offset + wave * .18);
    context.bezierCurveTo(mark.x - width * .62, mark.y - 15 - wave + offset, mark.x - width * .25, mark.y + 15 + wave + offset, mark.x, mark.y + offset);
    context.bezierCurveTo(mark.x + width * .3, mark.y - 15 - wave + offset, mark.x + width * .64, mark.y + 13 + wave + offset, mark.x + width, mark.y + offset - wave * .18);
    context.stroke();
  });
}

function drawMark(mark, time) {
  const movement = isAnimating ? time / 720 : 0;
  context.save();
  context.strokeStyle = colorForIntensity(mark.intensity);
  context.fillStyle = colorForIntensity(mark.intensity);
  // The shadow gives each sensation a soft spreading halo, even while still.
  context.shadowColor = colorForIntensity(mark.intensity);
  context.shadowBlur = 7 + mark.intensity * .16;
  if (mark.brush === "pulsing") drawPulsing(mark, movement);
  if (mark.brush === "burning") drawBurning(mark, movement);
  if (mark.brush === "blockage") drawBlockage(mark, movement);
  if (mark.brush === "soreness") drawSoreness(mark, movement);
  context.restore();
}

function drawScene(time) {
  const bounds = canvas.getBoundingClientRect();
  context.clearRect(0, 0, bounds.width, bounds.height);
  drawBodyGuide(bounds.width, bounds.height);
  strokes.forEach(mark => drawMark(mark, time));
}

function animate(time) {
  if (!isAnimating) return;
  drawScene(time);
  requestAnimationFrame(animate);
}

function canvasPoint(event) {
  const bounds = canvas.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function addMark(event) {
  const point = canvasPoint(event);
  if (lastPoint && Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) < 13) return;
  strokes.push({ x: point.x, y: point.y, brush: selectedBrush, intensity, seed: Math.random() * Math.PI * 2 });
  lastPoint = point;
  drawScene(performance.now());
}

document.querySelectorAll(".brush").forEach(button => {
  button.addEventListener("click", () => {
    selectedBrush = button.dataset.brush;
    document.querySelectorAll(".brush").forEach(item => item.classList.toggle("selected", item === button));
    statusMessage.textContent = `${button.querySelector("strong").textContent} brush selected.`;
  });
});

intensityInput.addEventListener("input", () => {
  intensity = Number(intensityInput.value);
  intensityValue.value = intensity;
  intensityValue.textContent = intensity;
});

canvas.addEventListener("pointerdown", event => {
  isDrawing = true; lastPoint = null; canvas.setPointerCapture(event.pointerId); addMark(event);
});
canvas.addEventListener("pointermove", event => { if (isDrawing) addMark(event); });
canvas.addEventListener("pointerup", () => { isDrawing = false; lastPoint = null; });
canvas.addEventListener("pointercancel", () => { isDrawing = false; lastPoint = null; });

animateButton.addEventListener("click", () => {
  if (!isAnimating) { isAnimating = true; animationStart = performance.now(); requestAnimationFrame(animate); }
  animateButton.disabled = true; pauseButton.disabled = false;
  statusMessage.textContent = "The sensations are in motion.";
});
pauseButton.addEventListener("click", () => {
  isAnimating = false; animateButton.disabled = false; pauseButton.disabled = true;
  drawScene(animationStart || performance.now());
  statusMessage.textContent = "Motion paused. Your marks remain.";
});
clearButton.addEventListener("click", () => {
  strokes = []; isAnimating = false; animateButton.disabled = false; pauseButton.disabled = true;
  drawScene(performance.now()); statusMessage.textContent = "Canvas cleared. The body guide remains.";
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
