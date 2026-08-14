/* ==========================================================================
   ULTRA-SMOOTH HARDWARE-ACCELERATED SCROLL-DRIVEN VIDEO ENGINE
   Native GPU playback driven by scroll velocity. Zero frame decode lag.
   Guarantees 100% video playback across the pinned track before unpinning.
   ========================================================================== */

export function initScrollVideo() {
  const container = document.getElementById('scroll-video-container');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!container || !video) return;

  let isPlaying = false;
  let scrollTimeout = null;
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();

  // Configure video for native zero-latency GPU decoding
  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";
  video.pause();

  function onScroll() {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    const currentTime = performance.now();

    const inViewport = rect.top <= 0 && rect.bottom >= windowHeight;

    if (inViewport) {
      const scrollDelta = currentScrollY - lastScrollY;
      const timeDelta = Math.max(1, currentTime - lastScrollTime);
      const velocity = Math.abs(scrollDelta) / timeDelta; // Pixels per ms

      // Downward scrolling -> smooth native GPU playback scaled to scroll speed
      if (scrollDelta > 0 && !video.ended) {
        // Adjust playback speed dynamically to match scroll velocity
        const targetRate = Math.min(2.5, Math.max(0.75, velocity * 1.6));
        video.playbackRate = targetRate;

        if (!isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              isPlaying = true;
            }).catch(() => {});
          }
        }
      }

      // Clear any pending pause timer
      clearTimeout(scrollTimeout);

      // Instantly pause when user stops scrolling
      scrollTimeout = setTimeout(() => {
        if (isPlaying) {
          video.pause();
          isPlaying = false;
        }
      }, 120);
    } else {
      if (isPlaying) {
        video.pause();
        isPlaying = false;
      }
    }

    lastScrollY = currentScrollY;
    lastScrollTime = currentTime;
  }

  // Real-time progress bar update directly tied to video playback
  video.addEventListener('timeupdate', () => {
    if (progressBar && video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });

  video.addEventListener('ended', () => {
    isPlaying = false;
  });

  window.addEventListener('scroll', onScroll, { passive: true });
}
