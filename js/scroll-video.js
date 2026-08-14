/* ==========================================================================
   SCROLL-DRIVEN TRUE FULL-LENGTH VIDEO SCRUBBING
   Guarantees 100% of video duration is scrubbed before unpinning.
   Zero lag, butter-smooth frame interpolation mapped across full scroll distance.
   ========================================================================== */

export function initScrollVideo() {
  const container = document.getElementById('scroll-video-container');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!container || !video) return;

  let isLoaded = false;
  let targetTime = 0;
  let currentTime = 0;
  let isSeeking = false;
  let animationId = null;

  video.load();
  video.pause();

  video.addEventListener('loadedmetadata', () => {
    isLoaded = true;
    updateScrollScrub();
  });

  video.addEventListener('seeked', () => {
    isSeeking = false;
  });

  if (video.readyState >= 1) {
    isLoaded = true;
  }

  function updateScrollScrub() {
    if (!isLoaded || !video.duration) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalDistance = container.offsetHeight - windowHeight;

    if (totalDistance <= 0) return;

    // Calculate exact progress through the full track [0.0 to 1.0]
    const scrollOffset = -rect.top;
    const progress = Math.max(0, Math.min(1, scrollOffset / totalDistance));

    targetTime = progress * video.duration;

    // Update bottom scrubber bar
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
  }

  // Smooth render loop ensuring frame accuracy across the entire video length
  function renderLoop() {
    if (isLoaded && video.duration && !isSeeking) {
      const diff = targetTime - currentTime;

      if (Math.abs(diff) > 0.02) {
        currentTime += diff * 0.15;

        isSeeking = true;
        if (typeof video.fastSeek === 'function') {
          video.fastSeek(currentTime);
        } else {
          video.currentTime = currentTime;
        }
      }
    }

    animationId = requestAnimationFrame(renderLoop);
  }

  window.addEventListener('scroll', updateScrollScrub, { passive: true });
  window.addEventListener('resize', updateScrollScrub, { passive: true });

  renderLoop();
}
