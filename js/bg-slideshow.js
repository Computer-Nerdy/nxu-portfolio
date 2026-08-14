/* ==========================================================================
   CINEMATIC BACKGROUND IMAGE SLIDESHOW (REAL-TIME TRANSITIONS & PARALLAX)
   Smooth cross-dissolve between ultra-high-definition dark engineering aesthetics
   ========================================================================== */

export function initBackgroundSlideshow() {
  const container = document.createElement('div');
  container.id = 'bg-slideshow-container';
  container.className = 'bg-slideshow-wrapper';
  document.body.prepend(container);

  // 4 Thematic High-Tech Dark Vector Blueprint & Circuit Scenes
  const scenes = [
    // Scene 1: Quantum Circuit Topology & Golden Waveguides
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="g1" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="%231E293B"/><stop offset="60%" stop-color="%230F172A"/><stop offset="100%" stop-color="%23060913"/></radialGradient><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F59E0B" stop-opacity="0.35"/><stop offset="100%" stop-color="%23D97706" stop-opacity="0.05"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23g1)"/><g stroke="url(%23gold)" stroke-width="1.5" fill="none"><circle cx="960" cy="540" r="300" stroke-dasharray="8,8"/><circle cx="960" cy="540" r="450" stroke-opacity="0.2"/><path d="M200,540 H1720 M960,100 V980 M400,200 L1520,880 M400,880 L1520,200"/><circle cx="960" cy="240" r="16" fill="%23F59E0B" fill-opacity="0.4"/><circle cx="960" cy="840" r="16" fill="%230EA5E9" fill-opacity="0.4"/><circle cx="460" cy="540" r="16" fill="%2310B981" fill-opacity="0.4"/><circle cx="1460" cy="540" r="16" fill="%23F59E0B" fill-opacity="0.4"/></g></svg>`,

    // Scene 2: Silicon Microchip Wafer & Interconnect Matrix
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="g2" cx="70%" cy="40%" r="80%"><stop offset="0%" stop-color="%23172554"/><stop offset="50%" stop-color="%230B1329"/><stop offset="100%" stop-color="%2303060C"/></radialGradient><linearGradient id="cyan" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338BDF8" stop-opacity="0.3"/><stop offset="100%" stop-color="%230284C7" stop-opacity="0.05"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23g2)"/><g stroke="url(%23cyan)" stroke-width="1.2" fill="none"><rect x="560" y="240" width="800" height="600" rx="30" stroke-dasharray="12,6"/><rect x="660" y="340" width="600" height="400" rx="15"/><path d="M100,300 H560 M1360,300 H1820 M100,780 H560 M1360,780 H1820 M700,50 V240 M1220,50 V240 M700,840 V1030 M1220,840 V1030"/><circle cx="960" cy="540" r="80" stroke="%23F59E0B" stroke-opacity="0.4"/></g></svg>`,

    // Scene 3: RF Spectrum Harmonics & Antenna Phase Array
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="g3" cx="30%" cy="60%" r="80%"><stop offset="0%" stop-color="%23064E3B"/><stop offset="50%" stop-color="%23042F2E"/><stop offset="100%" stop-color="%23020617"/></radialGradient><linearGradient id="emerald" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2334D399" stop-opacity="0.3"/><stop offset="100%" stop-color="%23059669" stop-opacity="0.05"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23g3)"/><g stroke="url(%23emerald)" stroke-width="1.5" fill="none"><path d="M0,540 Q240,240 480,540 T960,540 T1440,540 T1920,540" stroke-width="2"/><path d="M0,540 Q240,360 480,540 T960,540 T1440,540 T1920,540" stroke-opacity="0.5"/><path d="M0,540 Q240,120 480,540 T960,540 T1440,540 T1920,540" stroke-opacity="0.3"/><line x1="960" y1="100" x2="960" y2="980" stroke="%23F59E0B" stroke-opacity="0.3" stroke-dasharray="4,4"/></g></svg>`,

    // Scene 4: Deep Cosmic Matrix & Superconducting Resonator
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="g4" cx="50%" cy="50%" r="75%"><stop offset="0%" stop-color="%23311042"/><stop offset="50%" stop-color="%23130722"/><stop offset="100%" stop-color="%23060913"/></radialGradient><linearGradient id="purple" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23C084FC" stop-opacity="0.35"/><stop offset="100%" stop-color="%237E22CE" stop-opacity="0.05"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23g4)"/><g stroke="url(%23purple)" stroke-width="1.5" fill="none"><polygon points="960,180 1440,460 1440,900 960,1020 480,900 480,460"/><polygon points="960,300 1300,500 1300,820 960,920 620,820 620,500" stroke-dasharray="6,6"/><circle cx="960" cy="620" r="120" stroke="%23F59E0B" stroke-opacity="0.4"/></g></svg>`
  ];

  const slideElements = [];

  scenes.forEach((svgData, idx) => {
    const slide = document.createElement('div');
    slide.className = `bg-slide ${idx === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${svgData}')`;
    container.appendChild(slide);
    slideElements.push(slide);
  });

  let currentIdx = 0;

  // Real-time smooth cross-fade transition every 6.5 seconds
  setInterval(() => {
    slideElements[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slideElements.length;
    slideElements[currentIdx].classList.add('active');
  }, 6500);

  // Parallax subtle drift with mouse
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 35;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 35;
    container.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.04)`;
  });
}
