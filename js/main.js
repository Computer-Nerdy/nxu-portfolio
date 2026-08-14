import { initThreeHero } from './three-hero.js';
import { initDesktopEffects } from './desktop-fx.js';
import { initScrollVideo } from './scroll-video.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Hardware Model & Theatrical Engine
  try {
    initThreeHero();
  } catch (err) {
    console.warn("3D canvas initialization note:", err);
  }

  // 2. Initialize Scroll-Driven Video Theater (Option C Scrubbing)
  try {
    initScrollVideo();
  } catch (err) {
    console.warn("Scroll video engine note:", err);
  }

  // 3. Initialize Desktop Dynamics (Liquid Orbs, 3D Tilt, Cursor-Reactive Text, Scroll Reveals)
  try {
    initDesktopEffects();
  } catch (err) {
    console.warn("Desktop effects note:", err);
  }

  // 4. Mobile Menu Navigation
  initMobileNav();

  // 5. 1-Click Email Copy Feature
  initCopyEmail();
});

function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
      }
    });
  }
}

function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const copyIcon = document.getElementById('copy-icon');

  if (copyBtn && copyText && copyIcon) {
    copyBtn.addEventListener('click', async () => {
      const email = "harishragav987@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        copyText.textContent = "Copied to clipboard!";
        copyIcon.textContent = "✓";
        copyBtn.style.borderColor = "var(--color-emerald-500)";
        copyBtn.style.color = "var(--color-emerald-700)";

        setTimeout(() => {
          copyText.textContent = email;
          copyIcon.textContent = "📋";
          copyBtn.style.borderColor = "";
          copyBtn.style.color = "";
        }, 2200);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }
}
