# ◈ gif-theme-gen

> A zero-dependency canvas animation library with 6 hand-crafted themes. Drop it in, customize with sliders, export as GIF.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/badge/npm-0.1.0-brightgreen)](https://npmjs.com)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-success)](package.json)
[![gzipped](https://img.shields.io/badge/gzipped-4kb-informational)](src/themes.js)

---

## Themes

| Theme | Key |
|-------|-----|
| 📼 Retro Wave | `retro` |
| 🌆 Neon City | `neon` |
| 🌅 Sunset | `sunset` |
| 💻 Matrix | `matrix` |
| 🪐 Deep Space | `space` |
| 🌊 Ocean Deep | `ocean` |

---

## Installation

```bash
npm install gif-theme-gen
# or
yarn add gif-theme-gen
```

Or just drop `src/themes.js` into your HTML — no build step required.

---

## Usage

### Basic

```js
import GifTheme from 'gif-theme-gen';

const gen = new GifTheme({
  canvas: document.getElementById('myCanvas'),
  theme: 'neon',
  speed: 5,      // 1–10
  density: 7,    // 1–10
});

gen.play();
```

### Controls

```js
gen.pause();
gen.toggle();           // play/pause
gen.setTheme('matrix'); // switch theme live
gen.setSpeed(8);
gen.setDensity(3);
gen.reset();            // reset frame counter & particles
```

### Export as GIF

```js
// Requires gif.js (https://jnordberg.github.io/gif.js/)
gen.export({ fps: 24, duration: 3000 })
   .then(blob => saveAs(blob, 'animation.gif'));
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `canvas` | `HTMLCanvasElement` | required | Target canvas element |
| `theme` | `string` | `'retro'` | Initial theme name |
| `speed` | `number` | `5` | Animation speed (1–10) |
| `density` | `number` | `5` | Particle density (1–10) |
| `onFrame` | `function` | — | Callback on each frame with frame number |

---

## Custom Themes

```js
GifThemeEngine.THEMES['myTheme'] = {
  bg: '#0a0010',
  title: 'MY THEME',
  palette: ['#ff00ff', '#00ffff', '#ffff00'],
  render: (ctx, W, H, th, frame, speed, density, state) => {
    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, W, H);
    // your drawing code here
  },
};
```

---

## Project Structure

```
gif-theme-generator/
├── index.html        ← Project landing page
├── src/
│   ├── themes.js     ← Core animation engine
│   ├── main.js       ← Page UI wiring
│   └── style.css     ← Landing page styles
├── README.md
├── package.json
└── LICENSE
```

---

## Contributing

PRs welcome! To add a new theme:

1. Add a render function to `src/themes.js`
2. Register it in `GifThemeEngine.THEMES`
3. Add a card to the showcase in `index.html`

---

## License

MIT © 2025
