/* ==========================================================================
   CINEMATIC GPU-ACCELERATED STICKY SCROLL VIDEO ENGINE
   Calibrated natural playback speed (0.6x to 1.15x max) with generous scroll travel.
   ========================================================================== */

export function initScrollVideo() {
  const track = document.getElementById('engineering-reel');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!track || !video) return;

  let isLoaded = false;
  let isPlaying = false;
  let targetProgress = 0;
  let pauseDebounce = null;
  let lastScrollY = window.scrollY;

  // Configure video for native zero-latency GPU decoding
  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";
  video.pause();

  video.addEventListener('loadedmetadata', () => {
    isLoaded = true;
    onScroll();
  });

  if (video.readyState >= 1) {
    isLoaded = true;
  }

  function resetVideo() {
    if (isPlaying) {
      video.pause();
      isPlaying = false;
    }
    video.currentTime = 0;
    if (progressBar) progressBar.style.width = '0%';
  }

  function onScroll() {
    const rect = track.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = track.offsetHeight - windowHeight;
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (scrollDistance <= 0) return;

    // 1. Above section / Return to hero -> Reset to 0:00
    if (rect.top > 40 || currentScrollY < 100) {
      if (video.currentTime > 0) {
        resetVideo();
      }
      return;
    }

    // 2. Inside Sticky Track
    const inStickyZone = rect.top <= 0 && rect.bottom >= windowHeight;

    if (inStickyZone) {
      targetProgress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

      if (isLoaded && video.duration) {
        const targetTime = targetProgress * video.duration;
        const timeDiff = targetTime - video.currentTime;

        // Downward scroll: Calm, cinematic natural-speed GPU playback
        if (scrollDelta > 0 && timeDiff > 0.04 && !video.ended) {
          // Calibrated smooth natural playback rate (capped at 1.15x max)
          const naturalRate = Math.min(1.15, Math.max(0.65, 0.75 + timeDiff * 0.4));
          video.playbackRate = naturalRate;

          if (!isPlaying) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(() => {
                isPlaying = true;
              }).catch(() => {});
            }
          }

          clearTimeout(pauseDebounce);
          pauseDebounce = setTimeout(() => {
            if (isPlaying) {
              video.pause();
              isPlaying = false;
            }
          }, 140);
        }
        // Backward scroll: Gentle position alignment
        else if (scrollDelta < 0 && timeDiff < -0.1) {
          if (isPlaying) {
            video.pause();
            isPlaying = false;
          }
          video.currentTime = Math.max(0, targetTime);
        }
      }
    } else {
      if (isPlaying) {
        video.pause();
        isPlaying = false;
      }
    }
  }

  // Real-time progress bar sync directly with video playback
  video.addEventListener('timeupdate', () => {
    if (progressBar && video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${progress}%`;
    }
  });

  video.addEventListener('ended', () => {
    isPlaying = false;
  });

  // Reset triggers on landing page / logo click
  const heroTriggers = document.querySelectorAll('a[href="#hero"], a[href="#about"], .brand-wrapper');
  heroTriggers.forEach(el => {
    el.addEventListener('click', () => {
      resetVideo();
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}
