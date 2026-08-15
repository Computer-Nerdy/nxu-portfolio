/* ==========================================================================
   BUTTERY-SMOOTH 60FPS GPU SCROLL VIDEO ENGINE (FORWARD PLAY-STREAM + SYNC)
   Eliminates HTML5 keyframe seek choppiness by utilizing GPU forward-stream
   playback scaled dynamically to scroll velocity & position difference.
   ========================================================================== */

export function initScrollVideo() {
  const track = document.getElementById('engineering-reel');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!track || !video) return;

  let isLoaded = false;
  let isPlaying = false;
  let targetProgress = 0;
  let rafId = null;
  let backwardSeekTimeout = null;

  // Configure video for native zero-latency GPU decoding
  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";
  video.pause();

  function onReady() {
    isLoaded = true;
    updateScroll();
  }

  video.addEventListener('loadedmetadata', onReady);
  video.addEventListener('canplay', onReady);
  if (video.readyState >= 2) onReady();

  function updateScroll() {
    const rect = track.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = track.offsetHeight - windowHeight;

    if (scrollDistance <= 0) return;

    // 1. Above section -> Reset cleanly to 0:00
    if (rect.top > 20 || window.scrollY < 80) {
      targetProgress = 0;
      if (isPlaying) {
        video.pause();
        isPlaying = false;
      }
      if (video.currentTime > 0.05) {
        video.currentTime = 0;
      }
      if (progressBar) progressBar.style.width = '0%';
      return;
    }

    // 2. Below section -> Video at end
    if (rect.bottom < windowHeight) {
      targetProgress = 1;
      if (isPlaying) {
        video.pause();
        isPlaying = false;
      }
      if (progressBar) progressBar.style.width = '100%';
      return;
    }

    // 3. Active Sticky Scrub Zone (0.0 to 1.0)
    targetProgress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

    if (progressBar) {
      progressBar.style.width = `${targetProgress * 100}%`;
    }
  }

  // 60FPS Velocity-Matching Synchronization Loop
  function tick() {
    if (isLoaded && video.duration) {
      const targetTime = targetProgress * video.duration;
      const diff = targetTime - video.currentTime;

      // FORWARD SCROLL: Fluid GPU Playback Stream (Zero Keyframe Stutter)
      if (diff > 0.04 && !video.ended) {
        // Dynamically scale playback rate according to how fast user is scrolling
        const dynamicRate = Math.min(2.8, Math.max(0.5, diff * 1.6));
        video.playbackRate = dynamicRate;

        if (!isPlaying) {
          const p = video.play();
          if (p !== undefined) {
            p.then(() => { isPlaying = true; }).catch(() => {});
          }
        }
      }
      // USER STOPPED OR CAUGHT UP: Smoothly Pause Video
      else if (diff <= 0.02 && diff >= -0.08) {
        if (isPlaying) {
          video.pause();
          isPlaying = false;
        }
      }
      // BACKWARD SCROLL: Gentle, Throttled Backward Step
      else if (diff < -0.12) {
        if (isPlaying) {
          video.pause();
          isPlaying = false;
        }
        if (!backwardSeekTimeout) {
          backwardSeekTimeout = setTimeout(() => {
            video.currentTime = Math.max(0, targetTime);
            backwardSeekTimeout = null;
          }, 40);
        }
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  // Start RAF loop
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);

  // Listeners
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });

  // Reset triggers
  const topLinks = document.querySelectorAll('a[href="#hero"], a[href="#about"], .brand-wrapper');
  topLinks.forEach(el => {
    el.addEventListener('click', () => {
      targetProgress = 0;
      if (isPlaying) {
        video.pause();
        isPlaying = false;
      }
      video.currentTime = 0;
      if (progressBar) progressBar.style.width = '0%';
    });
  });

  updateScroll();
}
