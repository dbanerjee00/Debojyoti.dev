import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ---- Theme toggle ----
  var headerThemeToggle = document.getElementById('headerThemeToggle');
  var themeIcon = headerThemeToggle ? headerThemeToggle.querySelector('.theme-icon') : null;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
  }

  var savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  if (headerThemeToggle) {
    headerThemeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Pill Nav animations ----
  var pills = document.querySelectorAll('.pill');
  var circles = [];
  var timelines = [];
  var activeTweens = [];
  var ease = 'power3.easeOut';

  function layout() {
    circles.forEach(function (circle, i) {
      var pill = circle.closest('.pill');
      if (!pill) return;

      var rect = pill.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;
      var R = ((w * w) / 4 + h * h) / (2 * h);
      var D = Math.ceil(2 * R) + 2;
      var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      var originY = D - delta;

      circle.style.width = D + 'px';
      circle.style.height = D + 'px';
      circle.style.bottom = '-' + delta + 'px';

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: '50% ' + originY + 'px'
      });

      var label = pill.querySelector('.pill-label');
      var hoverLabel = pill.querySelector('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

      if (timelines[i]) timelines[i].kill();

      var tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: ease, overwrite: 'auto' }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 2, ease: ease, overwrite: 'auto' }, 0);
      }

      if (hoverLabel) {
        gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: ease, overwrite: 'auto' }, 0);
      }

      timelines[i] = tl;
    });
  }

  function handleEnter(i) {
    var tl = timelines[i];
    if (!tl) return;
    if (activeTweens[i]) activeTweens[i].kill();
    activeTweens[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: ease,
      overwrite: 'auto'
    });
  }

  function handleLeave(i) {
    var tl = timelines[i];
    if (!tl) return;
    if (activeTweens[i]) activeTweens[i].kill();
    activeTweens[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: ease,
      overwrite: 'auto'
    });
  }

  function initPills() {
    circles = [];
    timelines = [];
    activeTweens = [];
    pills = document.querySelectorAll('.pill');

    pills.forEach(function (pill, i) {
      var circle = pill.querySelector('.hover-circle');
      if (!circle) return;
      circles.push(circle);

      pill.addEventListener('mouseenter', function () { handleEnter(i); });
      pill.addEventListener('mouseleave', function () { handleLeave(i); });
    });

    layout();
  }

  initPills();

  // Debounced resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });

  // ---- Mobile menu ----
  var mobileBtn = document.getElementById('mobileMenuBtn');
  var mobilePopover = document.getElementById('mobileMenuPopover');
  var isMobileOpen = false;

  if (mobileBtn && mobilePopover) {
    mobileBtn.addEventListener('click', function () {
      isMobileOpen = !isMobileOpen;

      var lines = mobileBtn.querySelectorAll('.hamburger-line');
      if (isMobileOpen) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: ease });
      }

      if (isMobileOpen) {
        gsap.set(mobilePopover, { visibility: 'visible' });
        gsap.fromTo(mobilePopover,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: ease }
        );
      } else {
        gsap.to(mobilePopover, {
          opacity: 0, y: 10, duration: 0.2, ease: ease,
          onComplete: function () {
            gsap.set(mobilePopover, { visibility: 'hidden' });
          }
        });
      }
    });

    // Close mobile menu on link click
    mobilePopover.addEventListener('click', function (e) {
      var link = e.target.closest('[data-page]');
      if (!link) return;
      isMobileOpen = false;
      var lines = mobileBtn.querySelectorAll('.hamburger-line');
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: ease });
      gsap.to(mobilePopover, {
        opacity: 0, y: 10, duration: 0.2, ease: ease,
        onComplete: function () {
          gsap.set(mobilePopover, { visibility: 'hidden' });
        }
      });
    });
  }

  // ---- Initial load animation ----
  var logo = document.querySelector('.header__logo');
  var navItems = document.getElementById('pillNavItems');

  if (logo) {
    gsap.set(logo, { scale: 0 });
    gsap.to(logo, { scale: 1, duration: 0.6, ease: ease });
  }

  if (navItems) {
    gsap.set(navItems, { width: 0, overflow: 'hidden' });
    gsap.to(navItems, { width: 'auto', duration: 0.6, ease: ease });
  }
});
