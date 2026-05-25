'use strict';

/* ============================================
   Logo Loop — Dual-Row Infinite Marquee
   Row 1: Core frontend (→ forward)
   Row 2: Tooling & design (← reverse)
   Each logo carries a brand glow color injected
   as a CSS custom property on the pill element.
   ============================================ */

// Row 1 — Core frontend languages & frameworks
const LOGOS_ROW1 = [
  {
    title: 'HTML5',
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    glow: 'rgba(228,77,38,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3l2.2 24.8L16 30l8.8-2.2L27 3H5z" fill="#E44D26"/>
      <path d="M16 27.6l7.1-1.8 1.9-21.3H16v23.1z" fill="#F16529"/>
      <path d="M11.2 13h4.8V9.5H7.6l.8 8.5H16v-3.5h-.8l-.4-1.5H11.2zM12 23.2l-1-.3-.3-3.1H7.2l.6 6.2 8 2.2v-3.7l-3.8-1.3z" fill="#EBEBEB"/>
      <path d="M16 13h4.8l-.5 5H16v3.5h4l-.5 4.7-3.5 1V31l8-2.2.6-6.2H16V13z" fill="#fff"/>
    </svg>`
  },
  {
    title: 'CSS3',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    glow: 'rgba(38,77,228,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 3l2.2 24.8L16 30l8.8-2.2L27 3H5z" fill="#264DE4"/>
      <path d="M16 27.6l7.1-1.8 1.9-21.3H16v23.1z" fill="#2965F1"/>
      <path d="M16 13.5H11l.3 3.5H16V13.5zM10.5 9.5H16V6H7.5l2 17.5 6.5 1.8V22l-4.5-1.2-1-8.8z" fill="#EBEBEB"/>
      <path d="M16 13.5v3.5h4.5l-.4 4.8L16 23v3.3l6.5-1.8 2-17.5H16v4z" fill="#fff"/>
    </svg>`
  },
  {
    title: 'JavaScript',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    glow: 'rgba(247,223,30,0.4)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="5" fill="#F7DF1E"/>
      <path d="M18.8 24.4c.5.9 1.2 1.5 2.4 1.5 1 0 1.6-.5 1.6-1.2 0-.8-.6-1.1-1.7-1.6l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.4-3 1.5 0 2.5.5 3.3 1.8l-1.8 1.2c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.4 1.4l.6.3c2 .9 3.1 1.7 3.1 3.7 0 2.1-1.6 3.2-3.8 3.2-2.1 0-3.5-1-4.2-2.4l1.7-1.1zM9.5 24.6c.4.6.7 1.1 1.5 1.1.7 0 1.2-.3 1.2-1.4v-7.8h2.2v7.8c0 2.3-1.3 3.3-3.3 3.3-1.8 0-2.8-.9-3.3-2l1.7-1z" fill="#000"/>
    </svg>`
  },
  {
    title: 'TypeScript',
    href: 'https://www.typescriptlang.org',
    glow: 'rgba(49,120,198,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="5" fill="#3178C6"/>
      <path d="M18.2 17.4h3.1v.8h-1.1v5.4h-1v-5.4h-1v-.8zM15.2 18.1c.4.5.6 1 .6 1.8 0 .9-.3 1.6-.9 2.1-.5.4-1.2.6-2 .6-.7 0-1.3-.1-1.8-.4v-1c.3.2.6.3.9.4.3.1.6.1.9.1.5 0 .9-.1 1.2-.4.3-.3.4-.7.4-1.3 0-.6-.1-1-.4-1.2-.3-.3-.7-.4-1.2-.4-.2 0-.4 0-.7.1-.2 0-.5.1-.7.2l-.5-.3.3-3.5h3.7v.9h-2.8l-.2 2c.2-.1.4-.1.6-.1h.5c.8 0 1.4.2 1.9.7z" fill="#fff"/>
    </svg>`
  },
  {
    title: 'React',
    href: 'https://react.dev',
    glow: 'rgba(97,218,251,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="2.6" fill="#61DAFB"/>
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" stroke-width="1.4" fill="none"/>
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" stroke-width="1.4" fill="none" transform="rotate(60 16 16)"/>
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" stroke-width="1.4" fill="none" transform="rotate(120 16 16)"/>
    </svg>`
  },
  {
    title: 'Next.js',
    href: 'https://nextjs.org',
    glow: 'rgba(200,200,200,0.2)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#000"/>
      <circle cx="16" cy="16" r="14" fill="url(#nj-border)" opacity="0.15"/>
      <path d="M19.6 22.3L11 10.8H9v10.8h1.9V13l7.8 10h1.5V10.8h-1.9v9.9z" fill="#fff"/>
      <path d="M21.5 10.8h-1.9v10.8h1.9V10.8z" fill="url(#nj-grad)"/>
      <defs>
        <linearGradient id="nj-grad" x1="21.5" y1="10.8" x2="21.5" y2="21.6" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fff"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="nj-border" cx="50%" cy="50%" r="50%">
          <stop stop-color="#fff"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
      </defs>
    </svg>`
  },
  {
    title: 'Vue',
    href: 'https://vuejs.org',
    glow: 'rgba(65,184,131,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 28L2 5h5.5L16 20l8.5-15H30L16 28z" fill="#41B883"/>
      <path d="M16 28L9 16h4l3 5 3-5h4L16 28z" fill="#35495E"/>
    </svg>`
  },
  {
    title: 'Svelte',
    href: 'https://svelte.dev',
    glow: 'rgba(255,62,0,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.5 4.8C23.8 1 18.6.1 14.9 2.6L7.5 7.5A8.5 8.5 0 005.1 17a8.2 8.2 0 00-1.1 4.2 8.5 8.5 0 0014.5 6l7.4-4.9A8.5 8.5 0 0028.3 13a8.2 8.2 0 00-1.8-8.2z" fill="#FF3E00"/>
      <path d="M14.1 27.2a5.5 5.5 0 01-5.8-1.9 5.1 5.1 0 01-.9-4.3l.3-.9.8.5a13.1 13.1 0 003.9 1.6l.4.1-.1.4a1.6 1.6 0 00.3 1.4 1.7 1.7 0 001.8.6 1.5 1.5 0 00.5-.2l7.4-4.9a1.5 1.5 0 00.7-1 1.6 1.6 0 00-.3-1.2 1.7 1.7 0 00-1.8-.6l-.5.2-2.8 1.8a5.2 5.2 0 01-1.6.6 5.5 5.5 0 01-5.8-1.9 5.1 5.1 0 01-.9-4.3 5 5 0 012.3-3.2l7.4-4.9a5.2 5.2 0 011.6-.6 5.5 5.5 0 015.8 1.9 5.1 5.1 0 01.9 4.3l-.3.9-.8-.5A13.1 13.1 0 0023 9.7l-.4-.1.1-.4a1.6 1.6 0 00-.3-1.4 1.7 1.7 0 00-1.8-.6 1.5 1.5 0 00-.5.2l-7.4 4.9a1.5 1.5 0 00-.7 1 1.6 1.6 0 00.3 1.2 1.7 1.7 0 001.8.6l.5-.2 2.8-1.8a5.2 5.2 0 011.6-.6 5.5 5.5 0 015.8 1.9 5.1 5.1 0 01.9 4.3 5 5 0 01-2.3 3.2l-7.4 4.9a5.2 5.2 0 01-1.6.6z" fill="#fff"/>
    </svg>`
  },
  {
    title: 'Vite',
    href: 'https://vitejs.dev',
    glow: 'rgba(189,52,254,0.32)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28.6 5.6L16.9 27.2a.8.8 0 01-1.4 0L3.4 5.6a.8.8 0 01.8-1.2l11.7 2.1 11.9-2.1a.8.8 0 01.8 1.2z" fill="url(#vite-g1)"/>
      <path d="M21.1 3.2L13.2 5l-.5 8.9 2.5-.5.6-5.1 5.9-1.1-.6-4z" fill="url(#vite-g2)"/>
      <defs>
        <linearGradient id="vite-g1" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stop-color="#BD34FE"/>
          <stop offset="1" stop-color="#FF3D00"/>
        </linearGradient>
        <linearGradient id="vite-g2" x1="13" y1="3" x2="22" y2="14" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFE83D"/>
          <stop offset="1" stop-color="#FFE83D" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    title: 'GSAP',
    href: 'https://gsap.com',
    glow: 'rgba(136,206,64,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#0E100F"/>
      <path d="M8 16a8 8 0 1016 0 8 8 0 00-16 0z" fill="#88CE40"/>
      <path d="M16 11v5h5" stroke="#0E100F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
];

// Row 2 — Styling, tooling & design ecosystem
const LOGOS_ROW2 = [
  {
    title: 'Tailwind',
    href: 'https://tailwindcss.com',
    glow: 'rgba(56,189,248,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 13c.8-3.2 2.8-4.8 6-4.8 4.8 0 5.4 3.6 7.8 4.2 1.6.4 3-.2 4.2-1.8-.8 3.2-2.8 4.8-6 4.8-4.8 0-5.4-3.6-7.8-4.2C11.6 10.8 10.2 11.4 9 13zm-6 7.5c.8-3.2 2.8-4.8 6-4.8 4.8 0 5.4 3.6 7.8 4.2 1.6.4 3-.2 4.2-1.8-.8 3.2-2.8 4.8-6 4.8-4.8 0-5.4-3.6-7.8-4.2C5.6 18.3 4.2 18.9 3 20.5z" fill="#38BDF8"/>
    </svg>`
  },
  {
    title: 'Sass',
    href: 'https://sass-lang.com',
    glow: 'rgba(204,102,153,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#CC6699"/>
      <path d="M22.4 18.1c-.7 0-1.3.2-1.8.4l-.3-.5c-.4-.7-.9-1.3-1-2.3 1.7-2 2.8-5.2 2.4-8.3-.3-2.2-1.5-3-2.4-3-.5 0-1.3.2-1.7 1.3-.9 2.4 0 5.9 1.5 8.3-1.3 3.4-3.2 5.1-4.1 5.1-.5 0-1-.4-1-.9 0-1.4 2-2.2 2-3.4 0-.6-.4-1.3-1.3-1.3-.9 0-2.1 1-2.1 2.5 0 1 .4 1.7.4 1.7-1 1.7-2.2 2.4-3 2.4-.5 0-.9-.4-.9-1.4 0-2.2 2.3-4.2 2.3-5.3 0-.5-.4-.9-1-.9-.9 0-2.2.8-3.2 2.8-.4.8-.6 1.7-.6 2.4 0 2 1 3 2.4 3 1.7 0 3.3-1.3 4.4-3.2.6.9 1.4 1.4 2.2 1.4.8 0 1.9-.5 2.9-2.3.2.4.5.8.8 1.1-.8.5-2.1 1.5-2.1 2.8 0 .9.7 1.6 1.6 1.6 2 0 4-2.8 4-5.4.2.2.3.4.3.8 0 2.2-1.5 4-1.5 5 0 .6.4 1 1 1 1.6 0 3.1-2.2 3.1-4.8 0-.5-.1-1-.3-1.4.3-.1.5-.1.7-.1.8 0 1.3.5 1.3 1.3 0 1.4-1.4 2.2-1.4 3 0 .4.3.7.7.7 1 0 2.4-1.3 2.4-3.3 0-1.6-1.1-2.6-2.6-2.6zm-6.8-11.6c.2-.5.5-.8.8-.8.7 0 1.3.8 1.5 2.1.2 1.9-.5 4.2-1.6 5.8-1.1-2.3-1.1-5.7-.7-7.1z" fill="#fff"/>
    </svg>`
  },
  {
    title: 'Figma',
    href: 'https://figma.com',
    glow: 'rgba(162,89,255,0.3)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 3h5v5.5h-5A2.75 2.75 0 0111 3z" fill="#F24E1E"/>
      <path d="M16 3h5a2.75 2.75 0 010 5.5h-5V3z" fill="#FF7262"/>
      <path d="M11 8.5h5V14h-5a2.75 2.75 0 010-5.5z" fill="#A259FF"/>
      <path d="M16 8.5h5a2.75 2.75 0 010 5.5h-5V8.5z" fill="#1ABCFE"/>
      <path d="M11 14h5v5.5h-5A2.75 2.75 0 0111 14z" fill="#0ACF83"/>
      <circle cx="18.5" cy="16.75" r="2.75" fill="#1ABCFE"/>
    </svg>`
  },
  {
    title: 'Framer',
    href: 'https://framer.com',
    glow: 'rgba(5,102,255,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4h18v10H16L7 4z" fill="#0566FF"/>
      <path d="M7 14h9l9 10H7V14z" fill="#0566FF" opacity="0.6"/>
      <path d="M16 14l9 10H16V14z" fill="#0566FF" opacity="0.85"/>
    </svg>`
  },
  {
    title: 'Three.js',
    href: 'https://threejs.org',
    glow: 'rgba(180,180,180,0.2)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3L4 27h24L16 3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M10 19l6-8 6 8H10z" fill="currentColor" opacity="0.5"/>
      <path d="M16 11l3 5h-6l3-5z" fill="currentColor"/>
    </svg>`
  },
  {
    title: 'Webflow',
    href: 'https://webflow.com',
    glow: 'rgba(67,83,255,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.6 10s-3.7 9.1-3.9 9.9c-.1-.8-1.7-9.9-1.7-9.9h-3.8S12.4 19.3 12.2 20c-.2-.7-1.8-10-1.8-10H5L9.7 26h4.1l2-9.3L17.6 26h4.1L26.9 10h-3.3z" fill="#4353FF"/>
    </svg>`
  },
  {
    title: 'Astro',
    href: 'https://astro.build',
    glow: 'rgba(255,93,1,0.32)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 20.9c-1-.5-1.5-1.4-1.5-2.6 0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5V20l1.5 7-4.5-2.5-4.5 2.5 1.5-7-.5-.6z" fill="#FF5D01"/>
      <path d="M16 4L8.5 19.5c-.3.5-.5 1-.5 1.5 0 1.5 1.2 2.5 2.5 2.5H16V4z" fill="#FF5D01" opacity="0.7"/>
      <path d="M16 4l7.5 15.5c.3.5.5 1 .5 1.5 0 1.5-1.2 2.5-2.5 2.5H16V4z" fill="#FF5D01"/>
    </svg>`
  },
  {
    title: 'Storybook',
    href: 'https://storybook.js.org',
    glow: 'rgba(255,71,133,0.35)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3.5l.6 18.9L16 24l7.4-1.6.6-18.9-2.4.1-.2 4.1-1.8-.1.2-4.1L8 3.5z" fill="#FF4785"/>
      <path d="M8 3.5l.6 18.9L16 24l7.4-1.6.6-18.9-2.4.1-.2 4.1-1.8-.1.2-4.1L8 3.5z" fill="url(#sb-grad)" opacity="0.5"/>
      <path d="M13 12.5c0 1.1 3.5 1.4 3.5 3.8 0 1.9-1.5 3-3.7 3-1.5 0-3-.6-3.8-1.5l1-1.6c.7.8 1.7 1.2 2.8 1.2.7 0 1.2-.3 1.2-.8 0-1.3-3.5-1.2-3.5-3.7 0-1.8 1.4-3 3.5-3 1.3 0 2.6.5 3.3 1.2l-1 1.5c-.6-.6-1.5-1-2.3-1-.7 0-1 .3-1 .9z" fill="#fff"/>
      <defs>
        <linearGradient id="sb-grad" x1="8" y1="3.5" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fff" stop-opacity="0.3"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>`
  },
  {
    title: 'PostCSS',
    href: 'https://postcss.org',
    glow: 'rgba(221,56,48,0.32)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" fill="#DD3830"/>
      <path d="M9 13h5c1.7 0 2.5.9 2.5 2.2S15.7 17.5 14 17.5h-2.5V21H9V13zm5 3.2c.6 0 .9-.3.9-.8s-.3-.8-.9-.8h-2.5v1.6H14zM18.5 19.8l1.5-1.3c.5.8 1.3 1.1 2.2 1.1.7 0 1.1-.3 1.1-.7 0-.5-.5-.7-1.5-1-1.6-.5-2.8-1.1-2.8-2.6 0-1.5 1.2-2.5 3-2.5 1.3 0 2.4.5 3 1.3l-1.4 1.2c-.4-.6-1-.9-1.7-.9-.6 0-.9.3-.9.7 0 .5.4.7 1.6 1 1.7.5 2.7 1.2 2.7 2.7 0 1.6-1.3 2.5-3.2 2.5-1.5 0-2.8-.6-3.6-1.5z" fill="#fff"/>
    </svg>`
  },
  {
    title: 'GraphQL',
    href: 'https://graphql.org',
    glow: 'rgba(225,0,152,0.32)',
    svg: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 21.8L16 4l10.5 17.8H5.5z" stroke="#E1007F" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
      <path d="M5.5 21.8h21" stroke="#E1007F" stroke-width="1.5"/>
      <circle cx="16" cy="4" r="2" fill="#E1007F"/>
      <circle cx="5.5" cy="21.8" r="2" fill="#E1007F"/>
      <circle cx="26.5" cy="21.8" r="2" fill="#E1007F"/>
      <circle cx="16" cy="15" r="2" fill="#E1007F" opacity="0.5"/>
    </svg>`
  },
];

class LogoLoop {
  constructor(trackEl, logos) {
    this.track = trackEl;
    this.logos = logos;
    this._render();
  }

  _buildItem({ title, href, svg, glow }) {
    const a = document.createElement('a');
    a.className = 'logo-loop__item';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = title;
    a.setAttribute('aria-label', title);
    // Inject brand glow as CSS var for hover effect
    if (glow) a.style.setProperty('--logo-glow', glow);

    const icon = document.createElement('span');
    icon.className = 'logo-loop__icon';
    icon.innerHTML = svg;

    const label = document.createElement('span');
    label.className = 'logo-loop__label';
    label.textContent = title;

    a.appendChild(icon);
    a.appendChild(label);
    return a;
  }

  _buildSet() {
    const frag = document.createDocumentFragment();
    this.logos.forEach(logo => {
      frag.appendChild(this._buildItem(logo));
    });
    return frag;
  }

  _render() {
    // Two copies so translateX(-50%) loops seamlessly
    this.track.appendChild(this._buildSet());
    this.track.appendChild(this._buildSet());
  }
}

function initLogoLoop() {
  const row1 = document.querySelector('.logo-loop--forward .logo-loop__track');
  const row2 = document.querySelector('.logo-loop--reverse .logo-loop__track');
  if (row1) new LogoLoop(row1, LOGOS_ROW1);
  if (row2) new LogoLoop(row2, LOGOS_ROW2);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLogoLoop);
} else {
  initLogoLoop();
}
