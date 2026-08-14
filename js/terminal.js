// ==========================================
// INTERACTIVE SERIAL CLI TERMINAL MODULE
// ==========================================

export function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  const triggerBtn = document.getElementById('terminal-trigger');
  const heroBtn = document.getElementById('hero-cli-btn');
  const closeBtn = document.getElementById('close-terminal-btn');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  if (!modal || !input || !output) return;

  const openTerminal = () => {
    modal.classList.remove('hidden');
    input.focus();
  };

  const closeTerminal = () => {
    modal.classList.add('hidden');
  };

  if (triggerBtn) triggerBtn.addEventListener('click', openTerminal);
  if (heroBtn) heroBtn.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  // Close on Escape or Background Click
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || (e.key === '~' && e.shiftKey)) {
      if (modal.classList.contains('hidden')) openTerminal();
      else closeTerminal();
    } else if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeTerminal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerminal();
  });

  // Handle Command Submissions
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      input.value = '';
      if (!rawCmd) return;

      appendOutput(`harish@esp32:~$ ${rawCmd}`, 'text-copper font-bold');
      executeCommand(rawCmd.toLowerCase());
    }
  });

  function executeCommand(cmd) {
    switch (cmd) {
      case 'help':
        appendOutput(`
Available Commands:
  • help          - Display this command manual
  • cat about     - Display Harish's engineering story
  • ls projects   - List active engineering builds & repositories
  • read sensors  - Query simulated I2C sensor bus telemetry
  • stack         - View verified silicon & software capabilities
  • contact       - Print direct email & LinkedIn uplink
  • clear         - Clear the serial terminal buffer
  • sudo hire     - Instant transmission prompt
        `, 'text-slate-300');
        break;

      case 'cat about':
      case 'about':
        appendOutput(`
Harish Ragav V. · B.Tech CSE (IoT) @ SRM IST Ramapuram
Engineering Creed: "Build → Break → Understand → Improve → Repeat"
Focus: Bridging low-level hardware registers, edge AI inference (TinyML), and real-time 3D WebGL interfaces.
        `, 'text-copper-glow');
        break;

      case 'ls projects':
      case 'projects':
        appendOutput(`
[01] QuantumLens              - Interactive 3D WebGL Engine & Asset Pipeline
[02] Edge-AI Pothole Mapper   - Local IMU Sensor Fusion & Autonomous Hazard Mapping
[03] ESP32 Stress Indicator   - Biometric GSR + PPG Multi-Sensor Physical Computing
[04] Custom ECU Telemetry     - Real-time engine telemetry rig on ESP32 silicon
        `, 'text-mint');
        break;

      case 'read sensors':
      case 'sensors':
        appendOutput(`
[I2C BUS 0x68] MPU-6050 Accelerometer: X=0.04g, Y=0.01g, Z=0.98g
[I2C BUS 0x3C] SSD1306 OLED Display: Active @ 400kHz Fast-Mode
[ADC CH 0]     GSR Bio-Resistance: 482 kOhm [Calm]
[PWM CH 2]     WS2812B LED Array: 24 Pixels @ 800kHz Telemetry
[CORE CLOCK]   Xtensa LX7 @ 240.00 MHz · FreeRTOS Tick: 1000Hz
        `, 'text-yellow-400');
        break;

      case 'stack':
        appendOutput(`
Silicon: ESP32 (S3/P4), Raspberry Pi 5 / Zero 2 W, ARM
Languages: C, C++, Python, JavaScript (ES6+), Java, Bash
Graphics: Three.js, WebGL, GLSL Shaders, Blender 3D (GLB)
AI: TinyML, TensorFlow Lite Micro, OpenCV, Edge Vision
        `, 'text-twilight-blue');
        break;

      case 'contact':
      case 'sudo hire':
        appendOutput(`
Email: harishragav987@gmail.com
LinkedIn: https://www.linkedin.com/in/harish-ragav-ab92bb287
GitHub: https://github.com/Computer-Nerdy
Transmission ready. Check your default mail client!
        `, 'text-mint font-bold');
        break;

      case 'clear':
        output.innerHTML = '';
        return;

      default:
        appendOutput(`bash: ${cmd}: command not found. Type 'help' for options.`, 'text-red-400');
    }

    output.scrollTop = output.scrollHeight;
  }

  function appendOutput(text, colorClass = 'text-slate-300') {
    const div = document.createElement('div');
    div.className = `${colorClass} whitespace-pre-wrap leading-relaxed`;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }
}
