/* ==========================================================================
   ADVANCED HYBRID SCROLL & CINEMATIC VIDEO PLAYBACK ENGINE
   - Frame-accurate hardware scrub synchronized with scroll progress
   - Click/Tap anywhere to Toggle Continuous Play/Pause
   - Floating Obsidian Glass HUD status pill
   - Real-time Amber Scrubber Fill
   ========================================================================== */

export function initScrollVideo() {
  const track = document.getElementById('engineering-reel');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');
  const theater = document.querySelector('.fullscreen-video-theater');

  if (!track || !video) return;

  let isLoaded = false;
  let isManualPlaying = false;
  let targetProgress = 0;
  let currentProgress = 0;
  let isSeeking = false;
  let rafId = null;

  // Configure video for native zero-latency GPU decoding
  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";

  // Create Interactive HUD Pill if not present
  let hudPill = document.getElementById('video-hud-pill');
  if (!hudPill && theater) {
    hudPill = document.createElement('div');
    hudPill.id = 'video-hud-pill';
    hudPill.style.cssText = `
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(245, 158, 11, 0.35);
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      color: #FDE68A;
      font-family: var(--font-mono, monospace);
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      z-index: 30;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
    `;
    hudPill.innerHTML = `<span>▶ Click to Auto-Play</span><span style="font-size: 0.65rem; opacity: 0.7;">(or Scroll to Scrub)</span>`;
    theater.appendChild(hudPill);

    // Toggle Continuous Playback on Click
    hudPill.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleManualPlay();
    });

    theater.style.cursor = 'pointer';
    theater.addEventListener('click', () => {
      toggleManualPlay();
    });
  }

  function toggleManualPlay() {
    if (video.paused) {
      video.play().then(() => {
        isManualPlaying = true;
        if (hudPill) {
          hudPill.innerHTML = `<span>⏸ Pause Video</span><span style="font-size: 0.65rem; opacity: 0.7;">[ Playing ]</span>`;
          hudPill.style.borderColor = 'rgba(16, 185, 129, 0.6)';
          hudPill.style.color = '#6EE7B7';
        }
      }).catch(() => {});
    } else {
      video.pause();
      isManualPlaying = false;
      if (hudPill) {
        hudPill.innerHTML = `<span>▶ Click to Auto-Play</span><span style="font-size: 0.65rem; opacity: 0.7;">(or Scroll to Scrub)</span>`;
        hudPill.style.borderColor = 'rgba(245, 158, 11, 0.35)';
        hudPill.style.color = '#FDE68A';
      }
    }
  }

  video.addEventListener('loadedmetadata', () => {
    isLoaded = true;
    updateTargetProgress();
  });

  if (video.readyState >= 1) {
    isLoaded = true;
  }

  function resetVideo() {
    isManualPlaying = false;
    video.pause();
    video.currentTime = 0;
    targetProgress = 0;
    currentProgress = 0;
    if (progressBar) progressBar.style.width = '0%';
    if (hudPill) {
      hudPill.innerHTML = `<span>▶ Click to Auto-Play</span><span style="font-size: 0.65rem; opacity: 0.7;">(or Scroll to Scrub)</span>`;
      hudPill.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      hudPill.style.color = '#FDE68A';
    }
  }

  function updateTargetProgress() {
    const rect = track.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const scrollDistance = track.offsetHeight - windowHeight;

    if (scrollDistance <= 0) return;

    // Above section -> Reset
    if (rect.top > 50 || window.scrollY < 80) {
      if (video.currentTime > 0.1) {
        resetVideo();
      }
      return;
    }

    // Inside Sticky Track
    const inStickyZone = rect.top <= 0 && rect.bottom >= windowHeight;
    if (inStickyZone) {
      targetProgress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
    }
  }

  // Smooth RAF Lerp Scrub Loop
  function tick() {
    if (!isManualPlaying && isLoaded && video.duration) {
      // Smooth interpolation for zero-jitter frame scrubbing
      currentProgress += (targetProgress - currentProgress) * 0.18;

      const targetTime = currentProgress * video.duration;
      const diff = Math.abs(targetTime - video.currentTime);

      if (diff > 0.03 && !isSeeking) {
        isSeeking = true;
        if (video.fastSeek) {
          video.fastSeek(targetTime);
        } else {
          video.currentTime = targetTime;
        }
        isSeeking = false;
      }
    }

    // Real-time progress bar sync
    if (progressBar && video.duration) {
      const p = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${p}%`;
    }

    rafId = requestAnimationFrame(tick);
  }

  // Start RAF loop
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);

  // Listeners
  window.addEventListener('scroll', updateTargetProgress, { passive: true });
  window.addEventListener('resize', updateTargetProgress, { passive: true });

  // Reset triggers on landing page / logo click
  const heroTriggers = document.querySelectorAll('a[href="#hero"], a[href="#about"], .brand-wrapper');
  heroTriggers.forEach(el => {
    el.addEventListener('click', resetVideo);
  });
}
