/* ==========================================================================
   SCROLL-DRIVEN VIDEO THEATER ENGINE (APPLE-TIER SCRUBBING)
   Frames play forward on scroll-down, reverse on scroll-up, and stop when idle
   ========================================================================== */

export function initScrollVideo() {
  const container = document.getElementById('scroll-video-container');
  const video = document.getElementById('scroll-scrub-video');
  const progressText = document.getElementById('video-scrub-progress');
  const progressBar = document.getElementById('video-scrub-bar');
  const videoFrame = document.getElementById('video-glass-frame');

  if (!container || !video) return;

  let isLoaded = false;
  let targetTime = 0;
  let currentTime = 0;
  let animationId = null;

  // Ensure video is ready for frame scrubbing
  video.load();
  video.pause();

  video.addEventListener('loadedmetadata', () => {
    isLoaded = true;
    updateScrollPosition();
  });

  // Handle metadata already cached
  if (video.readyState >= 1) {
    isLoaded = true;
  }

  function updateScrollPosition() {
    if (!isLoaded || !video.duration) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalDistance = container.offsetHeight - windowHeight;

    if (totalDistance <= 0) return;

    // Calculate progress within pinned scroll track [0.0 to 1.0]
    const scrollOffset = -rect.top;
    const progress = Math.max(0, Math.min(1, scrollOffset / totalDistance));

    targetTime = progress * video.duration;

    // Update Progress UI Indicators
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    if (progressText) {
      const percentage = Math.round(progress * 100);
      progressText.textContent = `${percentage}% COMPLETE`;
    }

    // Dynamic scale-in transition when entering view
    if (videoFrame) {
      if (rect.top > 0) {
        const entryProgress = Math.max(0, 1 - rect.top / windowHeight);
        videoFrame.style.opacity = `${0.4 + entryProgress * 0.6}`;
        videoFrame.style.transform = `scale(${0.92 + entryProgress * 0.08})`;
      } else {
        videoFrame.style.opacity = '1';
        videoFrame.style.transform = 'scale(1)';
      }
    }
  }

  // Smooth lerp loop for jitter-free 60fps video frame seeking
  function renderLoop() {
    if (isLoaded && video.duration) {
      currentTime += (targetTime - currentTime) * 0.15;

      if (Math.abs(currentTime - video.currentTime) > 0.02) {
        video.currentTime = currentTime;
      }
    }

    animationId = requestAnimationFrame(renderLoop);
  }

  window.addEventListener('scroll', updateScrollPosition, { passive: true });
  window.addEventListener('resize', updateScrollPosition, { passive: true });

  renderLoop();
}
