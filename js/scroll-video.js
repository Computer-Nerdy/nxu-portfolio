/* ==========================================================================
   SCROLL-DRIVEN FULLSCREEN VIDEO THEATER ENGINE (HIGH PERFORMANCE)
   Smooth Frame Scrubbing, Dynamic Edge-to-Edge Expansion & Native Fullscreen
   ========================================================================== */

export function initScrollVideo() {
  const container = document.getElementById('scroll-video-container');
  const video = document.getElementById('scroll-scrub-video');
  const progressText = document.getElementById('video-scrub-progress');
  const progressBar = document.getElementById('video-scrub-bar');
  const videoFrame = document.getElementById('video-glass-frame');
  const fullscreenBtn = document.getElementById('video-fullscreen-btn');

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
    updateScrollPosition();
  });

  video.addEventListener('seeked', () => {
    isSeeking = false;
  });

  if (video.readyState >= 1) {
    isLoaded = true;
  }

  // 1-Click Native Fullscreen Toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (videoFrame.requestFullscreen) {
          videoFrame.requestFullscreen();
        } else if (videoFrame.webkitRequestFullscreen) {
          videoFrame.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
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

    // Dynamic Edge-to-Edge Theater Expansion as user scrolls
    if (videoFrame) {
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // Active in sticky view: expand to full cinematic theater
        const expansion = Math.min(1, Math.max(0, -rect.top / (totalDistance * 0.2)));
        videoFrame.style.maxWidth = `${68 + expansion * 28}rem`;
        videoFrame.style.borderRadius = `${Math.max(0.5, 1.75 - expansion * 1.25)}rem`;
      } else {
        videoFrame.style.maxWidth = '68rem';
        videoFrame.style.borderRadius = '1.75rem';
      }
    }
  }

  // Smooth jitter-free seek loop
  function renderLoop() {
    if (isLoaded && video.duration && !isSeeking) {
      const diff = targetTime - currentTime;

      if (Math.abs(diff) > 0.015) {
        currentTime += diff * 0.12;

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

  window.addEventListener('scroll', updateScrollPosition, { passive: true });
  window.addEventListener('resize', updateScrollPosition, { passive: true });

  renderLoop();
}
