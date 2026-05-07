const video = document.getElementById("scrollVideo");
const hero = document.getElementById("hero");

const isMobile =
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
  window.innerWidth <= 768;

video.muted = true;
video.playsInline = true;
video.setAttribute("playsinline", "");
video.setAttribute("webkit-playsinline", "");

if (isMobile) {
  video.autoplay = true;
  video.loop = true;

  const playVideo = () => {
    video.play().catch(() => {});
  };

  video.addEventListener("loadeddata", playVideo);
  document.addEventListener("touchstart", playVideo, { once: true });
  document.addEventListener("click", playVideo, { once: true });

  playVideo();

} else {
  video.pause();
  video.loop = false;

  let ticking = false;

  function updateVideoScroll() {
    const rect = hero.getBoundingClientRect();
    const scrollable = hero.offsetHeight - window.innerHeight;

    const progress = Math.min(
      Math.max(-rect.top / scrollable, 0),
      1
    );

    if (video.duration) {
      video.currentTime = progress * video.duration;
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateVideoScroll);
      ticking = true;
    }
  }

  video.addEventListener("loadedmetadata", updateVideoScroll);
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", updateVideoScroll);

  updateVideoScroll();
}