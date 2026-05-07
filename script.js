const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");
const hero = document.getElementById("hero");

const frameCount = 240;
const images = [];
let currentFrameIndex = 1;
let ticking = false;
let firstFrameLoaded = false;

function currentFrame(index) {
  return `./frames/frame_${String(index).padStart(4, "0")}.jpg`;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  render();
}

function drawImageCover(img) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const scale = Math.max(width / img.width, height / img.height / img.height)* 0.78;

  const x = width / 2 - img.width * scale / 2;
  const y = height / 2 - img.height * scale / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function render() {
  const img = images[currentFrameIndex - 1];

  if (!img || !img.complete || img.naturalWidth === 0) return;

  drawImageCover(img);
}

function updateFrameOnScroll() {
  const rect = hero.getBoundingClientRect();
  const scrollable = hero.offsetHeight - window.innerHeight;

  const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);

  currentFrameIndex = Math.min(
    frameCount,
    Math.max(1, Math.round(progress * (frameCount - 1)) + 1)
  );

  render();
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(updateFrameOnScroll);
    ticking = true;
  }
}

function loadFrames() {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);

    if (i === 1) {
      img.onload = () => {
        firstFrameLoaded = true;
        resizeCanvas();
        render();
      };

      img.onerror = () => {
        console.error("No se pudo cargar:", currentFrame(i));
        alert("No se pudo cargar frame_0001.jpg. Revisa la carpeta frames.");
      };
    }

    images.push(img);
  }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", onScroll);
window.addEventListener("load", () => {
  loadFrames();
  resizeCanvas();
  updateFrameOnScroll();
});