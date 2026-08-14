/* ==========================================================================
   UNIVERSAL STICKY SCROLL-LOCKED VIDEO ENGINE
   Works seamlessly with manual scrolling, scrollbar dragging, autoscroll & nav links.
   Sticky viewport locks for 300vh while video plays from 0:00 to 100% duration.
   ========================================================================== */

export function initScrollVideo() {
  const track = document.getElementById('engineering-reel');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!track || !video) return;

  let isLoaded = false;
  let targetTime = 0;
  let isSeeking = false;

  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";

  video.addEventListener('loadedmetadata', () => {
    isLoaded = true;
    onScrollUpdate();
  });

  video.addEventListener('seeked', () => {
    isSeeking = false;
  });

  if (video.readyState >= 1) {
    isLoaded = true;
  }

  function resetVideo() {
    video.pause();
    video.currentTime = 0;
    if (progressBar) progressBar.style.width = '0%';
  }

  function onScrollUpdate() {
    const rect = track.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = track.offsetHeight - windowHeight;

    if (scrollDistance <= 0) return;

    // Above section / landing page -> Reset to 0:00
    if (rect.top > 40 || window.scrollY < 120) {
      if (video.currentTime > 0) {
        resetVideo();
      }
      return;
    }

    // Inside sticky track [0.0 -> 1.0]
    const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

    if (isLoaded && video.duration) {
      targetTime = scrollProgress * video.duration;

      // Update progress bar
      if (progressBar) {
        progressBar.style.width = `${scrollProgress * 100}%`;
      }
    }
  }

  // Smooth RAF loop syncing video position with hardware acceleration
  function syncLoop() {
    if (isLoaded && video.duration && !isSeeking) {
      const diff = targetTime - video.currentTime;

      if (Math.abs(diff) > 0.04) {
        isSeeking = true;
        const nextTime = video.currentTime + diff * 0.25;

        if (typeof video.fastSeek === 'function') {
          video.fastSeek(nextTime);
        } else {
          video.currentTime = nextTime;
        }
      }
    }

    requestAnimationFrame(syncLoop);
  }

  // Reset triggers on landing page / logo click
  const heroTriggers = document.querySelectorAll('a[href="#hero"], a[href="#about"], .brand-wrapper');
  heroTriggers.forEach(el => {
    el.addEventListener('click', () => {
      resetVideo();
    });
  });

  window.addEventListener('scroll', onScrollUpdate, { passive: true });
  window.addEventListener('resize', onScrollUpdate, { passive: true });

  syncLoop();
}
