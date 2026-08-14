// ==========================================
// REAL-TIME REACTIVE OSCILLOSCOPE DOCK
// ==========================================

export function initOscilloscope() {
  const canvas = document.getElementById('dock-scope-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  let time = 0;
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    scrollVelocity = Math.min(Math.abs(currentY - lastScrollY) * 0.1, 15);
    lastScrollY = currentY;
  }, { passive: true });

  function renderScope() {
    requestAnimationFrame(renderScope);
    time += 0.04 + scrollVelocity * 0.02;
    scrollVelocity *= 0.92; // Decay

    ctx.clearRect(0, 0, width, height);

    // Subtle Grid Lines
    ctx.strokeStyle = 'rgba(132, 182, 228, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height);
    ctx.stroke();

    // Channel 1: Primary Copper Sine Wave
    ctx.strokeStyle = '#F2A86B';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < width; x += 3) {
      const freq = 0.03;
      const amp = 10 + Math.sin(time * 0.5) * 4 + scrollVelocity * 2;
      const y = (height / 2) + Math.sin(x * freq + time) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Channel 2: Digital Clock Square-Wave (Mint)
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 0; x < width; x += 4) {
      const squareVal = Math.sin(x * 0.05 + time * 1.5) > 0 ? 8 : -8;
      const y = (height / 2) + squareVal;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  renderScope();

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });
}
