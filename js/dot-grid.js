'use strict';

const themeConfigs = {
  dark: {
    baseColor: { r: 167, g: 139, b: 250, a: 0.22 }, // Brighter lavender baseline
    activeColor: { r: 168, g: 85, b: 247, a: 0.95 } // Vivid electric purple hover
  },
  light: {
    baseColor: { r: 99, g: 102, b: 241, a: 0.15 },  // Indigo baseline
    activeColor: { r: 79, g: 70, b: 229, a: 0.9 }   // Vibrant deep indigo hover
  }
};

export class DotGrid {
  constructor(containerEl, options = {}) {
    if (!containerEl) return;

    this.container = containerEl;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'dot-grid-canvas';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Props / Options
    this.dotSize = options.dotSize || 3;
    this.gap = options.gap || 24;
    this.proximity = options.proximity || 120;
    this.shockRadius = options.shockRadius || 220;
    this.shockStrength = options.shockStrength || 7;
    
    // Physics constants
    this.springK = options.springK || 0.04;
    this.damping = options.damping || 0.88;

    this.dots = [];
    this.pointer = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      speed: 0,
      lastX: -1000,
      lastY: -1000,
      lastTime: 0
    };

    this.activeTheme = 'dark';
    this.isActive = true;
    this.rafId = null;

    this.init();
  }

  init() {
    this.detectTheme();
    this.buildGrid();

    // Event Listeners
    this.resizeObserver = new ResizeObserver(() => this.buildGrid());
    this.resizeObserver.observe(this.container);

    // Track mouse on the whole hero or window
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
      heroEl.addEventListener('mouseleave', () => this.handleMouseLeave(), { passive: true });
      heroEl.addEventListener('click', (e) => this.handleClick(e));
    }

    // Monitor theme changes
    this.themeObserver = new MutationObserver(() => this.detectTheme());
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Monitor page transitions to pause/resume
    window.addEventListener('pagechange', () => this.handlePageChange());

    // Start rendering
    this.tick();
  }

  detectTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.activeTheme = theme;
  }

  handlePageChange() {
    const homePage = document.querySelector('.page[data-page="home"]');
    if (homePage) {
      const isHomeActive = homePage.classList.contains('active');
      if (isHomeActive) {
        this.resume();
      } else {
        this.pause();
      }
    }
  }

  buildGrid() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const cell = this.dotSize + this.gap;
    const cols = Math.floor((width + this.gap) / cell);
    const rows = Math.floor((height + this.gap) / cell);

    const gridW = cell * cols - this.gap;
    const gridH = cell * rows - this.gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + this.dotSize / 2;
    const startY = extraY / 2 + this.dotSize / 2;

    this.dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        this.dots.push({
          cx,
          cy,
          x: cx,
          y: cy,
          vx: 0,
          vy: 0
        });
      }
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const now = performance.now();
    const pr = this.pointer;
    
    if (pr.lastTime > 0) {
      const dt = Math.max(1, now - pr.lastTime);
      const dx = mx - pr.lastX;
      const dy = my - pr.lastY;
      
      pr.vx = (dx / dt) * 1000;
      pr.vy = (dy / dt) * 1000;
      pr.speed = Math.hypot(pr.vx, pr.vy);
    }

    pr.lastX = mx;
    pr.lastY = my;
    pr.lastTime = now;
    pr.x = mx;
    pr.y = my;
  }

  handleMouseLeave() {
    this.pointer.x = -1000;
    this.pointer.y = -1000;
    this.pointer.speed = 0;
    this.pointer.vx = 0;
    this.pointer.vy = 0;
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const shockSq = this.shockRadius * this.shockRadius;

    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];
      const dx = dot.x - cx;
      const dy = dot.y - cy;
      const distSq = dx * dx + dy * dy;

      if (distSq < shockSq) {
        const dist = Math.sqrt(distSq) || 0.1;
        const falloff = 1 - dist / this.shockRadius;
        const angle = Math.atan2(dy, dx);
        const push = falloff * this.shockStrength * 4.5;
        
        dot.vx += Math.cos(angle) * push;
        dot.vy += Math.sin(angle) * push;
      }
    }
  }

  pause() {
    this.isActive = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (!this.isActive) {
      this.isActive = true;
      this.tick();
    }
  }

  tick() {
    if (!this.isActive) return;

    this.updatePhysics();
    this.draw();

    this.rafId = requestAnimationFrame(() => this.tick());
  }

  updatePhysics() {
    const px = this.pointer.x;
    const py = this.pointer.y;
    const pSpeed = this.pointer.speed;
    const pvx = this.pointer.vx;
    const pvy = this.pointer.vy;
    const proxSq = this.proximity * this.proximity;

    const speedTrigger = 120; // threshold for inertia

    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];

      // 1. Spring restoring force
      const ax = (dot.cx - dot.x) * this.springK;
      const ay = (dot.cy - dot.y) * this.springK;
      dot.vx += ax;
      dot.vy += ay;

      // 2. Damping
      dot.vx *= this.damping;
      dot.vy *= this.damping;

      // 3. Mouse influence (Inertia Push)
      if (px > 0 && py > 0) {
        const dx = dot.x - px;
        const dy = dot.y - py;
        const distSq = dx * dx + dy * dy;

        if (distSq < proxSq) {
          const dist = Math.sqrt(distSq) || 0.1;
          const factor = 1 - dist / this.proximity;
          const angle = Math.atan2(dy, dx);

          // Force scales with mouse movement speed
          let push = factor * 0.9;
          if (pSpeed > speedTrigger) {
            const speedFactor = Math.min(pSpeed / 800, 2.5);
            push += factor * speedFactor * 3.5;
          }

          // Apply velocity push
          dot.vx += Math.cos(angle) * push;
          dot.vy += Math.sin(angle) * push;
        }
      }

      // Update positions
      dot.x += dot.vx;
      dot.y += dot.vy;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const px = this.pointer.x;
    const py = this.pointer.y;
    const proxSq = this.proximity * this.proximity;

    const config = themeConfigs[this.activeTheme] || themeConfigs.dark;
    const baseColor = config.baseColor;
    const activeColor = config.activeColor;

    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];

      let r = baseColor.r;
      let g = baseColor.g;
      let b = baseColor.b;
      let a = baseColor.a;
      let radius = this.dotSize / 2;

      // Calculate hover glow interpolation
      if (px > 0 && py > 0) {
        const dx = dot.x - px;
        const dy = dot.y - py;
        const distSq = dx * dx + dy * dy;

        if (distSq < proxSq) {
          const dist = Math.sqrt(distSq) || 0.1;
          const t = 1 - dist / this.proximity;

          // Lerp colors & alpha
          r = Math.round(baseColor.r + (activeColor.r - baseColor.r) * t);
          g = Math.round(baseColor.g + (activeColor.g - baseColor.g) * t);
          b = Math.round(baseColor.b + (activeColor.b - baseColor.b) * t);
          a = baseColor.a + (activeColor.a - baseColor.a) * t;

          // Scale dot up slightly on hover for tactile luxury
          radius = (this.dotSize / 2) * (1 + t * 0.8);
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      this.ctx.fill();
    }
  }
}

// Auto init when imported
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hero-dot-grid');
  if (container) {
    window.dotGrid = new DotGrid(container);
  }
});
