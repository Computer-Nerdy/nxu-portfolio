/* ==========================================================================
   REAL-TIME BACKGROUND IMAGE SLIDESHOW (2K RENDER SCENES)
   Loads authentic 2K background scenes with smooth cross-dissolve,
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

  // 4 High-Fidelity Background Scenes
  const imageSources = [
    'images/bg_quantum.jpeg',
    'images/bg_silicon.jpeg',
    'images/bg_rf.jpeg',
    'images/bg_workbench.jpeg'
  ];

  const slideElements = [];

  imageSources.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = `bg-slide ${idx === 0 ? 'active' : ''}`;
    slide.style.backgroundImage = `url('${src}')`;
    container.appendChild(slide);
    slideElements.push(slide);
  });

  let currentIdx = 0;

  // Real-time smooth cinematic cross-fade every 6 seconds
  setInterval(() => {
    slideElements[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slideElements.length;
    slideElements[currentIdx].classList.add('active');
  }, 6000);

  // Parallax subtle drift with mouse coordinates
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 45;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 45;
    container.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1.05)`;
  });
}
