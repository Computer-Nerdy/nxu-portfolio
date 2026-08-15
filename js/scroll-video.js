/* ==========================================================================
   PURE IMMERSIVE SCROLL-DRIVEN VIDEO SCRUB ENGINE
   - Zero Autoplay / Zero Controls — Purely driven by your scroll position
   - Frame-accurate hardware seek queue (listens to 'seeked' events for 60fps responsiveness)
   - Real-time Amber Scrubber Fill across the 480vh Sticky Track
   ========================================================================== */

export function initScrollVideo() {
  const track = document.getElementById('engineering-reel');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!track || !video) return;

  let isSeeking = false;
  let targetTime = 0;
  let isVideoReady = false;

  // Configure video for pure scroll scrubbing (Muted, Paused, Preloaded)
  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";
  video.pause();

  // Remove any leftover HUD pill
  const oldHud = document.getElementById('video-hud-pill');
  if (oldHud) oldHud.remove();

  function onVideoReady() {
    isVideoReady = true;
    updateScrollPosition();
  }

  video.addEventListener('loadedmetadata', onVideoReady);
  video.addEventListener('canplaythrough', onVideoReady);

  if (video.readyState >= 1) {
    onVideoReady();
  }

  // Pure seek queue: only seeks when decoder is ready for next frame
  function processSeek() {
    if (!isVideoReady || !video.duration || isSeeking) return;

    const timeDiff = Math.abs(targetTime - video.currentTime);
    if (timeDiff > 0.02) {
      isSeeking = true;
      if (video.fastSeek) {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    }
  }

  video.addEventListener('seeked', () => {
    isSeeking = false;
    processSeek();
  });

  // Calculate exact scroll progress through the 480vh track
  function updateScrollPosition() {
    const rect = track.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = track.offsetHeight - windowHeight;

    if (scrollDistance <= 0) return;

    // 1. Above section -> Clean reset to 0:00
    if (rect.top > 0) {
      targetTime = 0;
      if (video.currentTime > 0.05) {
        video.currentTime = 0;
      }
      if (progressBar) progressBar.style.width = '0%';
      return;
    }

    // 2. Below section -> Video at end
    if (rect.bottom < windowHeight) {
      if (video.duration) {
        targetTime = video.duration - 0.05;
        processSeek();
      }
      if (progressBar) progressBar.style.width = '100%';
      return;
    }

    // 3. Inside the Sticky Track (Active Scrub Zone)
    const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

    if (video.duration) {
      targetTime = progress * video.duration;
      processSeek();
    }

    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }
  }

  // Smooth High-Performance Scroll Listeners
  window.addEventListener('scroll', updateScrollPosition, { passive: true });
  window.addEventListener('resize', updateScrollPosition, { passive: true });

  // Reset when clicking navigation links
  const topLinks = document.querySelectorAll('a[href="#hero"], a[href="#about"], .brand-wrapper');
  topLinks.forEach(el => {
    el.addEventListener('click', () => {
      targetTime = 0;
      video.currentTime = 0;
      if (progressBar) progressBar.style.width = '0%';
    });
  });

  // Initial calculation
  updateScrollPosition();
}
