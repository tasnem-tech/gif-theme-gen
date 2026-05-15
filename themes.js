// gif-theme-gen · themes.js
// Core animation engine & theme definitions

window.GifThemeEngine = (function() {

  const THEMES = {
    retro: {
      bg: '#1a0033', title: 'RETRO WAVE',
      palette: ['#ff00ff','#00ffff','#ffff00','#ff8800','#ff00aa'],
      render: renderRetro,
    },
    neon: {
      bg: '#050510', title: 'NEON CITY',
      palette: ['#00f5ff','#ff0080','#7000ff','#00ff99','#ff6600'],
      render: renderNeon,
    },
    sunset: {
      bg: '#1a0505', title: 'SUNSET',
      palette: ['#ff5500','#ff9900','#ffdd00','#ff2288','#ff7700'],
      render: renderSunset,
    },
    matrix: {
      bg: '#000500', title: 'MATRIX',
      palette: ['#00ff41','#00cc33','#009922','#00ff88','#66ff66'],
      render: renderMatrix,
    },
    space: {
      bg: '#00000d', title: 'DEEP SPACE',
      palette: ['#ffffff','#aaaaff','#88aaff','#ffaaff','#aaffff'],
      render: renderSpace,
    },
    ocean: {
      bg: '#000d1a', title: 'OCEAN DEEP',
      palette: ['#0066ff','#00aaff','#00ddff','#0044cc','#33ccff'],
      render: renderOcean,
    },
  };

  // ── Particle pools ──
  function makeRainCols(W) {
    return Array.from({length: Math.ceil(W/20)}, (_,i) => ({
      x: i*20, y: Math.random()*300
    }));
  }
  const MAT_CHARS = '01アイウエオカキクケコサシ₿Ω∞'.split('');

  function makeStars(W, H, n=200) {
    return Array.from({length: n}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.5+0.3,
      speed: Math.random()*0.5+0.1,
      twinkle: Math.random()*Math.PI*2,
      ci: Math.floor(Math.random()*5),
    }));
  }

  function makeBubbles(W, H, n=40) {
    return Array.from({length: n}, () => ({
      x: Math.random()*W, y: H+Math.random()*60,
      r: Math.random()*8+2,
      speed: Math.random()*0.8+0.3,
      drift: (Math.random()-0.5)*0.4,
    }));
  }

  function makeDots(W, H, n=60) {
    return Array.from({length: n}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*4+1,
      vx: (Math.random()-0.5)*1.5,
      vy: (Math.random()-0.5)*1.5,
      ci: Math.floor(Math.random()*5),
    }));
  }

  // ── Shared draw helpers ──
  function drawTitle(ctx, W, title, pal, frame) {
    ctx.save();
    ctx.textAlign = 'center';
    const pulse = 1 + Math.sin(frame*0.05)*0.015;
    ctx.font = `bold ${Math.floor(22*pulse)}px 'Space Mono', monospace`;
    ctx.shadowColor = pal[0];
    ctx.shadowBlur = 14 + Math.sin(frame*0.08)*6;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(title, W/2, 38);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawScanlines(ctx, W, H) {
    ctx.save();
    for (let y = 0; y < H; y += 4) {
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(0, y, W, 2);
    }
    ctx.restore();
  }

  function drawWave(ctx, W, H, pal, frame, alpha='44', yFrac=0.62) {
    ctx.save();
    const y0 = H * yFrac;
    for (let w = 0; w < 3; w++) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 4) {
        const wave = Math.sin((x/80) + frame*0.04 + w*1.1)*18 +
                     Math.sin((x/30) + frame*0.06 + w)*8;
        ctx.lineTo(x, y0 + wave + w*18);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = pal[w % pal.length] + alpha;
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGrid(ctx, W, H, pal) {
    ctx.save();
    ctx.strokeStyle = pal[0] + '33';
    ctx.lineWidth = 0.5;
    const vx = W/2, vy = H*0.56;
    for (let i = 0; i <= 12; i++) {
      const x = (i/12)*W;
      ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let i = 0; i < 8; i++) {
      const yt = vy + (H-vy)*Math.pow(i/7, 0.5);
      ctx.beginPath(); ctx.moveTo(0, yt); ctx.lineTo(W, yt); ctx.stroke();
    }
    ctx.restore();
  }

  // ── Theme renderers ──
  function renderRetro(ctx, W, H, th, frame, speed, density, state) {
    if (!state.dots) state.dots = makeDots(W, H, 60);
    ctx.fillStyle = th.bg; ctx.fillRect(0,0,W,H);
    const n = Math.floor(state.dots.length * density/10);
    for (let i = 0; i < n; i++) {
      const d = state.dots[i];
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle = th.palette[d.ci % th.palette.length];
      ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1;
      d.x += d.vx * speed * 0.2; d.y += d.vy * speed * 0.2;
      if (d.x<0||d.x>W) d.vx*=-1;
      if (d.y<0||d.y>H) d.vy*=-1;
    }
    drawWave(ctx, W, H, th.palette, frame);
    drawScanlines(ctx, W, H);
    drawTitle(ctx, W, th.title, th.palette, frame);
  }

  function renderNeon(ctx, W, H, th, frame, speed, density, state) {
    ctx.fillStyle = th.bg; ctx.fillRect(0,0,W,H);
    drawGrid(ctx, W, H, th.palette);
    const n = Math.floor(density * 4);
    for (let i = 0; i < n; i++) {
      const ang = (i/n)*Math.PI*2 + frame*0.01;
      const cx = W/2 + Math.sin(frame*0.007+i)*80;
      const cy = H/2 + Math.cos(frame*0.009+i*0.7)*55;
      const len = 38 + Math.sin(frame*0.05+i)*18;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang)*len, cy + Math.sin(ang)*len);
      ctx.lineTo(cx - Math.cos(ang)*len, cy - Math.sin(ang)*len);
      ctx.strokeStyle = th.palette[i%th.palette.length]+'88';
      ctx.lineWidth = 1; ctx.stroke();
    }
    drawTitle(ctx, W, th.title, th.palette, frame);
  }

  function renderSunset(ctx, W, H, th, frame, speed, density, state) {
    if (!state.dots) state.dots = makeDots(W, H, 40);
    // Sky gradient
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,'#220000');
    grad.addColorStop(0.4,'#cc4400');
    grad.addColorStop(0.58,'#ff8800');
    grad.addColorStop(1,'#1a0005');
    ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
    // Sun
    const sx = W/2 + Math.sin(frame*0.01)*35;
    const sy = H*0.42 + Math.sin(frame*0.008)*7;
    const sg = ctx.createRadialGradient(sx,sy,0,sx,sy,55);
    sg.addColorStop(0,'#ffff88'); sg.addColorStop(0.3,'#ffcc00'); sg.addColorStop(1,'transparent');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx,sy,55,0,Math.PI*2); ctx.fill();
    // Orbs
    const n = Math.floor(state.dots.length * density/10);
    for (let i = 0; i < n; i++) {
      const d = state.dots[i];
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle = th.palette[d.ci % th.palette.length];
      ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha=1;
      d.x += d.vx*speed*0.2; d.y += d.vy*speed*0.2;
      if(d.x<0||d.x>W) d.vx*=-1;
      if(d.y<0||d.y>H) d.vy*=-1;
    }
    drawWave(ctx, W, H, th.palette, frame, '44', 0.65);
    drawTitle(ctx, W, th.title, th.palette, frame);
  }

  function renderMatrix(ctx, W, H, th, frame, speed, density, state) {
    if (!state.rain) state.rain = makeRainCols(W);
    ctx.fillStyle = th.bg + 'cc'; ctx.fillRect(0,0,W,H);
    ctx.font = '12px monospace';
    state.rain.forEach((col, ci) => {
      if (density < 8 && ci % Math.max(1, Math.floor(10/density)) !== 0) return;
      const char = MAT_CHARS[Math.floor(Math.random()*MAT_CHARS.length)];
      ctx.fillStyle = ci%4===0 ? '#88ff88' : th.palette[0];
      ctx.globalAlpha = Math.random()*0.8+0.2;
      ctx.fillText(char, col.x, col.y);
      ctx.globalAlpha = 1;
      col.y += 16 + speed*0.5;
      if (col.y > H+20) col.y = -20;
    });
    drawTitle(ctx, W, th.title, th.palette, frame);
  }

  function renderSpace(ctx, W, H, th, frame, speed, density, state) {
    if (!state.stars) state.stars = makeStars(W, H, 200);
    ctx.fillStyle = th.bg; ctx.fillRect(0,0,W,H);
    // Nebula
    ctx.save(); ctx.globalAlpha = 0.07;
    for (let i = 0; i < 3; i++) {
      const ng = ctx.createRadialGradient(W*(0.2+i*0.3),H*(0.3+i*0.2),0,W*(0.2+i*0.3),H*(0.3+i*0.2),110);
      ng.addColorStop(0, th.palette[i]); ng.addColorStop(1,'transparent');
      ctx.fillStyle = ng; ctx.fillRect(0,0,W,H);
    }
    ctx.restore();
    state.stars.forEach(s => {
      const twinkle = 0.5 + 0.5*Math.sin(s.twinkle + frame*0.04);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r*twinkle, 0, Math.PI*2);
      ctx.fillStyle = th.palette[Math.floor(s.x/W*th.palette.length)];
      ctx.globalAlpha = twinkle; ctx.fill(); ctx.globalAlpha = 1;
      s.x -= s.speed * speed * 0.15;
      if (s.x < 0) { s.x = W; s.y = Math.random()*H; }
    });
    drawTitle(ctx, W, th.title, th.palette, frame);
  }

  function renderOcean(ctx, W, H, th, frame, speed, density, state) {
    if (!state.bubbles) state.bubbles = makeBubbles(W, H, 40);
    ctx.fillStyle = th.bg; ctx.fillRect(0,0,W,H);
    drawWave(ctx, W, H, th.palette, frame, '55', 0.6);
    const n = Math.floor(state.bubbles.length * density/10);
    for (let i = 0; i < n; i++) {
      const b = state.bubbles[i];
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.strokeStyle = th.palette[i%th.palette.length]+'aa';
      ctx.lineWidth = 1; ctx.stroke();
      b.y -= b.speed * speed * 0.2; b.x += b.drift;
      if (b.y < -b.r*2) { b.y = H+b.r; b.x = Math.random()*W; }
    }
    drawTitle(ctx, W, th.title, th.palette, frame);
  }

  // ── Public API ──
  function create(canvas, opts) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let frame = 0, raf = null, playing = true;
    let themeName = opts.theme || 'retro';
    let speed = opts.speed || 5;
    let density = opts.density || 5;
    let state = {};

    function tick() {
      const th = THEMES[themeName];
      if (th) th.render(ctx, W, H, th, frame, speed, density, state);
      frame += speed * 0.4;
      if (opts.onFrame) opts.onFrame(Math.floor(frame/2));
      if (playing) raf = requestAnimationFrame(tick);
    }

    return {
      play() { if (!playing) { playing = true; raf = requestAnimationFrame(tick); } },
      pause() { playing = false; cancelAnimationFrame(raf); },
      toggle() { playing ? this.pause() : this.play(); return playing; },
      setTheme(name) { themeName = name; state = {}; frame = 0; },
      setSpeed(v) { speed = v; },
      setDensity(v) { density = v; },
      reset() { frame = 0; state = {}; },
      isPlaying() { return playing; },
      start() { tick(); },
    };
  }

  return { create, THEMES };
})();
