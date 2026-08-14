/* ==========================================================================
   ULTRA-SMOOTH HARDWARE-ACCELERATED SCROLL-DRIVEN VIDEO ENGINE
   Auto-resets to 0:00 whenever scrolling back up to landing page / hero section
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
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }

  function onScroll() {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    const currentTime = performance.now();

    // Reset video whenever user scrolls back up to landing page / above video section
    if (rect.top > 20 || currentScrollY < 120) {
      if (video.currentTime > 0) {
        resetVideoToBeginning();
      }
    }

    const inViewport = rect.top <= 0 && rect.bottom >= windowHeight;

    if (inViewport) {
      const scrollDelta = currentScrollY - lastScrollY;
      const timeDelta = Math.max(1, currentTime - lastScrollTime);
      const velocity = Math.abs(scrollDelta) / timeDelta;

      if (scrollDelta > 0 && !video.ended) {
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

      clearTimeout(scrollTimeout);

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

  // Hook navigation links to hero/about or brand logo
  const heroTriggers = document.querySelectorAll('a[href="#hero"], a[href="#about"], .brand-wrapper');
  heroTriggers.forEach(el => {
    el.addEventListener('click', () => {
      resetVideoToBeginning();
    });
  });

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
