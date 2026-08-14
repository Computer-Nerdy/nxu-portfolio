/* ==========================================================================
   CINEMATIC REAL-TIME BACKGROUND IMAGE SLIDESHOW ENGINE
   Visibly striking, high-tech generative dark scenes with smooth cross-dissolve,
   Ken Burns slow zoom drift, and responsive cursor parallax.
   ========================================================================== */

export function initBackgroundSlideshow() {
  let container = document.getElementById('bg-slideshow-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'bg-slideshow-container';
    container.className = 'bg-slideshow-wrapper';
    document.body.prepend(container);
  }

  container.innerHTML = '';

  // 4 Ultra-High-Definition Cinematic Tech Backgrounds
  const scenes = [
    // Scene 1: Quantum Superconductor Gold Cryostat & Lattice
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="qg1" cx="60%" cy="35%" r="75%"><stop offset="0%" stop-color="%231E2235"/><stop offset="50%" stop-color="%230C101D"/><stop offset="100%" stop-color="%2304060B"/></radialGradient><linearGradient id="qGold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F59E0B" stop-opacity="0.6"/><stop offset="50%" stop-color="%23D97706" stop-opacity="0.3"/><stop offset="100%" stop-color="%2378350F" stop-opacity="0.05"/></linearGradient><pattern id="qGrid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="%23F59E0B" stroke-width="0.75" stroke-opacity="0.12"/></pattern></defs><rect width="1920" height="1080" fill="url(%23qg1)"/><rect width="1920" height="1080" fill="url(%23qGrid)"/><g stroke="url(%23qGold)" stroke-width="2" fill="none"><circle cx="1100" cy="480" r="280" stroke-dasharray="10,6"/><circle cx="1100" cy="480" r="420" stroke-opacity="0.3"/><circle cx="1100" cy="480" r="560" stroke-opacity="0.15" stroke-dasharray="4,8"/><path d="M100,480 H1820 M1100,50 V950 M400,100 L1800,860 M400,860 L1800,100" stroke-opacity="0.35"/><circle cx="1100" cy="200" r="18" fill="%23F59E0B" fill-opacity="0.5"/><circle cx="1100" cy="760" r="18" fill="%230EA5E9" fill-opacity="0.5"/><circle cx="680" cy="480" r="18" fill="%2310B981" fill-opacity="0.5"/><circle cx="1520" cy="480" r="18" fill="%23F59E0B" fill-opacity="0.5"/></g></svg>`,

    // Scene 2: Silicon Microchip Wafer Matrix & Copper Trace Routing
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="qg2" cx="30%" cy="60%" r="80%"><stop offset="0%" stop-color="%23132347"/><stop offset="50%" stop-color="%23091024"/><stop offset="100%" stop-color="%2302050D"/></radialGradient><linearGradient id="qCyan" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338BDF8" stop-opacity="0.55"/><stop offset="50%" stop-color="%230284C7" stop-opacity="0.25"/><stop offset="100%" stop-color="%23082F49" stop-opacity="0.05"/></linearGradient><pattern id="cGrid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M 80 0 L 0 0 0 80" fill="none" stroke="%2338BDF8" stroke-width="0.8" stroke-opacity="0.1"/></pattern></defs><rect width="1920" height="1080" fill="url(%23qg2)"/><rect width="1920" height="1080" fill="url(%23cGrid)"/><g stroke="url(%23qCyan)" stroke-width="1.8" fill="none"><rect x="420" y="200" width="980" height="680" rx="30" stroke-dasharray="16,8"/><rect x="520" y="280" width="780" height="520" rx="20"/><path d="M80,320 H420 M1400,320 H1840 M80,760 H420 M1400,760 H1840 M600,50 V200 M1220,50 V200 M600,880 V1030 M1220,880 V1030" stroke-width="2"/><circle cx="910" cy="540" r="140" stroke="%23F59E0B" stroke-opacity="0.6" stroke-dasharray="6,6"/></g></svg>`,

    // Scene 3: RF Spectrum Harmonics & Antenna Array Waveforms
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="qg3" cx="50%" cy="50%" r="80%"><stop offset="0%" stop-color="%2308332E"/><stop offset="50%" stop-color="%23041F1C"/><stop offset="100%" stop-color="%23020A09"/></radialGradient><linearGradient id="qEmerald" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2334D399" stop-opacity="0.6"/><stop offset="50%" stop-color="%23059669" stop-opacity="0.3"/><stop offset="100%" stop-color="%23022C22" stop-opacity="0.05"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23qg3)"/><g stroke="url(%23qEmerald)" stroke-width="2.2" fill="none"><path d="M0,540 Q240,160 480,540 T960,540 T1440,540 T1920,540" stroke-width="3"/><path d="M0,540 Q240,320 480,540 T960,540 T1440,540 T1920,540" stroke-opacity="0.65"/><path d="M0,540 Q240,80 480,540 T960,540 T1440,540 T1920,540" stroke-opacity="0.45"/><line x1="960" y1="50" x2="960" y2="1030" stroke="%23F59E0B" stroke-opacity="0.4" stroke-dasharray="6,6"/><circle cx="960" cy="540" r="220" stroke="%2334D399" stroke-opacity="0.3" stroke-dasharray="12,6"/></g></svg>`,

    // Scene 4: Deep Quantum Matrix & Superconducting Resonator
    `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%"><defs><radialGradient id="qg4" cx="50%" cy="30%" r="75%"><stop offset="0%" stop-color="%232A133D"/><stop offset="50%" stop-color="%2312061C"/><stop offset="100%" stop-color="%23040108"/></radialGradient><linearGradient id="qViolet" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23C084FC" stop-opacity="0.6"/><stop offset="50%" stop-color="%237E22CE" stop-opacity="0.3"/><stop offset="100%" stop-color="%233B0764" stop-opacity="0.05"/></linearGradient></defs><rect width="1920" height="1080" fill="url(%23qg4)"/><g stroke="url(%23qViolet)" stroke-width="2" fill="none"><polygon points="960,120 1520,440 1520,920 960,1040 400,920 400,440"/><polygon points="960,260 1360,490 1360,840 960,940 560,840 560,490" stroke-dasharray="8,8"/><circle cx="960" cy="620" r="160" stroke="%23F59E0B" stroke-opacity="0.5"/><path d="M400,440 L1520,920 M400,920 L1520,440" stroke-opacity="0.25"/></g></svg>`
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

  // Real-time smooth cinematic cross-fade every 5.5 seconds
  setInterval(() => {
    slideElements[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slideElements.length;
    slideElements[currentIdx].classList.add('active');
  }, 5500);

  // Parallax subtle drift with mouse coordinates
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 45;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 45;
    container.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.05)`;
  });
}
