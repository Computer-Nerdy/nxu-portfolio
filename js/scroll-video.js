/* ==========================================================================
   SCROLL-DRIVEN TRUE FULLSCREEN VIDEO REEL (ZERO CHOPPINESS NATIVE PLAYBACK)
   Plays smoothly while scrolling down, pauses when idle, unpins when done.
   No backward seeking, no telemetry, true 100vw x 100vh fullscreen.
   ========================================================================== */

export function initScrollVideo() {
  const container = document.getElementById('scroll-video-container');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!container || !video) return;

  let isPlaying = false;
  let scrollTimeout = null;
  let lastScrollY = window.scrollY;

  // Video settings for instant GPU hardware playback
  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.pause();

  function onScroll() {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    // Check if user is inside the sticky video section
    const inViewport = rect.top <= 0 && rect.bottom >= windowHeight;

    if (inViewport) {
      // If scrolling down and video isn't ended, smoothly play
      if (isScrollingDown && !video.ended) {
        if (!isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              isPlaying = true;
            }).catch(() => {});
          }
        }
      }

      // Reset idle timer to pause when scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isPlaying) {
          video.pause();
          isPlaying = false;
        }
      }, 140);
    } else {
      // Outside sticky area -> pause
      if (isPlaying) {
        video.pause();
        isPlaying = false;
      }
    }

    // Update bottom scrubber progress bar
    if (progressBar && video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

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
