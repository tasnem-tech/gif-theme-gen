// gif-theme-gen · main.js
// Project page UI wiring

(function() {

  // ── Hero background (subtle animated backdrop) ──
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    heroBg.width = heroBg.parentElement.offsetWidth || 1200;
    heroBg.height = heroBg.parentElement.offsetHeight || 800;
    const hEngine = GifThemeEngine.create(heroBg, {
      theme: 'neon', speed: 2, density: 4,
    });
    hEngine.start();
  }

  // ── Main demo canvas ──
  const mainCanvas = document.getElementById('mainCanvas');
  if (!mainCanvas) return;

  mainCanvas.width = 640;
  mainCanvas.height = 300;

  const engine = GifThemeEngine.create(mainCanvas, {
    theme: 'retro',
    speed: 5,
    density: 5,
    onFrame: (f) => {
      const el = document.getElementById('frameCount');
      if (el) el.textContent = String(f).padStart(4, '0');
    },
  });
  engine.start();

  // Theme buttons
  document.getElementById('themeGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-card');
    if (!btn) return;
    document.querySelectorAll('.theme-card').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    engine.setTheme(btn.dataset.theme);
    if (!engine.isPlaying()) engine.play();
  });

  // Sliders
  const speedRange = document.getElementById('speedRange');
  const densityRange = document.getElementById('densityRange');
  speedRange.addEventListener('input', e => {
    engine.setSpeed(+e.target.value);
    document.getElementById('speedVal').textContent = e.target.value;
  });
  densityRange.addEventListener('input', e => {
    engine.setDensity(+e.target.value);
    document.getElementById('densityVal').textContent = e.target.value;
  });

  // Play/Pause
  const playPauseBtn = document.getElementById('playPauseBtn');
  playPauseBtn.addEventListener('click', () => {
    const nowPlaying = engine.toggle();
    playPauseBtn.textContent = nowPlaying ? '⏸ Pause' : '▶ Play';
  });

  // Reset
  document.getElementById('resetBtn').addEventListener('click', () => {
    engine.reset();
    if (!engine.isPlaying()) { engine.play(); playPauseBtn.textContent = '⏸ Pause'; }
  });

  // ── Showcase mini canvases ──
  const previews = document.querySelectorAll('.showcase-preview[data-preview]');
  previews.forEach(el => {
    const themeName = el.dataset.preview;
    const c = document.createElement('canvas');
    c.width = 400; c.height = 120;
    el.appendChild(c);
    const mini = GifThemeEngine.create(c, {
      theme: themeName, speed: 4, density: 5,
    });
    mini.start();
  });

  // ── Smooth scroll for nav ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
