/* ==========================================================================
   SCROLL-LOCKED THEATRICAL VIDEO REEL ENGINE
   Locks website scrolling when entering the video section until the video
   playback finishes 100% of its duration. Auto-unlocks to continue scrolling.
   ========================================================================== */

export function initScrollVideo() {
  const container = document.getElementById('scroll-video-container');
  const section = document.getElementById('engineering-reel');
  const video = document.getElementById('scroll-scrub-video');
  const progressBar = document.getElementById('video-scrub-bar');

  if (!container || !video || !section) return;

  let isPlaying = false;
  let scrollTimeout = null;
  let isVideoComplete = false;

  video.muted = true;
  video.playsInline = true;
  video.autoplay = false;
  video.preload = "auto";
  video.pause();

  function resetVideoToBeginning() {
    if (isPlaying) {
      video.pause();
      isPlaying = false;
    }
    video.currentTime = 0;
    isVideoComplete = false;
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }

  // Wheel & Touch Interceptor for Scroll-Lock
  window.addEventListener('wheel', (e) => {
    const rect = section.getBoundingClientRect();
    const isAtSection = rect.top <= 80 && rect.bottom >= window.innerHeight - 80;

    if (isAtSection) {
      const isComplete = video.duration && (video.currentTime >= video.duration - 0.15 || video.ended);

      // Downward scroll while video has not completed -> Lock scroll & play video forward
      if (e.deltaY > 0 && !isComplete) {
        e.preventDefault();

        // Scale playback speed dynamically to wheel velocity
        const delta = Math.min(Math.abs(e.deltaY), 150);
        video.playbackRate = Math.min(2.5, Math.max(0.8, delta * 0.02));

        if (!isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              isPlaying = true;
            }).catch(() => {});
          }
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (isPlaying) {
            video.pause();
            isPlaying = false;
          }
        }, 140);
      } 
      // Upward scroll when at the beginning -> Allow normal scrolling back to landing page
      else if (e.deltaY < 0 && video.currentTime <= 0.2) {
        resetVideoToBeginning();
        // Allow default scroll back up to hero
      }
      // Upward scroll while mid-video -> Lock and gently step backward
      else if (e.deltaY < 0 && !isComplete && video.currentTime > 0.2) {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 0.25);
        if (progressBar && video.duration) {
          progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
        }
      }
      // If complete and scrolling down -> naturally lets the user scroll past into Projects!
    } else if (rect.top > 120 || window.scrollY < 100) {
      // Reset if scrolled back up to hero landing
      if (video.currentTime > 0) {
        resetVideoToBeginning();
      }
    }
  }, { passive: false });

  // Touch device swipe handling for mobile/trackpad
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const rect = section.getBoundingClientRect();
    const isAtSection = rect.top <= 80 && rect.bottom >= window.innerHeight - 80;

    if (isAtSection) {
      const touchCurrentY = e.touches[0].clientY;
      const touchDeltaY = touchStartY - touchCurrentY;
      const isComplete = video.duration && (video.currentTime >= video.duration - 0.15 || video.ended);

      if (touchDeltaY > 0 && !isComplete) {
        e.preventDefault();
        video.playbackRate = 1.2;
        if (!isPlaying) {
          video.play().then(() => { isPlaying = true; }).catch(() => {});
        }
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (isPlaying) {
            video.pause();
            isPlaying = false;
          }
        }, 150);
      }
    }
  }, { passive: false });

  video.addEventListener('timeupdate', () => {
    if (progressBar && video.duration) {
      const progress = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${progress}%`;
      if (video.currentTime >= video.duration - 0.15) {
        isVideoComplete = true;
      }
    }
  });

  video.addEventListener('ended', () => {
    isPlaying = false;
    isVideoComplete = true;
  });

  // Hook navigation links to hero/about or brand logo
  const heroTriggers = document.querySelectorAll('a[href="#hero"], a[href="#about"], .brand-wrapper');
  heroTriggers.forEach(el => {
    el.addEventListener('click', () => {
      resetVideoToBeginning();
    });
  });
}
