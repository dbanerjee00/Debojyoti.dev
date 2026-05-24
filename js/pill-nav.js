import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ---- Theme toggle inside nav ----
  var pillThemeToggle = document.getElementById('pillThemeToggle');
  var pillThemeIcon = document.getElementById('pillThemeIcon');
  var mobileThemeBtn = document.getElementById('mobileThemeBtn');
  var mobileThemeText = mobileThemeBtn ? mobileThemeBtn.querySelector('.mobile-theme-text') : null;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (pillThemeIcon) pillThemeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (mobileThemeText) mobileThemeText.textContent = theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
    localStorage.setItem('theme', theme);
  }

  var savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  pillThemeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  if (mobileThemeBtn) {
    mobileThemeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
      closeMobileMenu();
    });
  }

  // ---- Mobile menu ----
  var mobileMenuBtn = document.getElementById('mobileMenuBtn');
  var mobileMenuPopover = document.getElementById('mobileMenuPopover');

  function openMobileMenu() {
    mobileMenuBtn.classList.add('open');
    mobileMenuPopover.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuBtn.classList.remove('open');
    mobileMenuPopover.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      if (mobileMenuPopover.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  document.querySelectorAll('.mobile-menu-link').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---- GSAP hover circles ----
  var pills = document.querySelectorAll('.pill:not(.pill-toggle)');
  var timelines = [];

  pills.forEach(function (pill) {
    var circle = pill.querySelector('.hover-circle');
    var label = pill.querySelector('.pill-label');
    var hoverLabel = pill.querySelector('.pill-label-hover');
    if (!circle || !label || !hoverLabel) return;

    var rect = pill.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var R = ((w * w) / 4 + h * h) / (2 * h);
    var D = Math.ceil(2 * R) + 2;
    var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
    var originY = D - delta;

    circle.style.width = D + 'px';
    circle.style.height = D + 'px';
    circle.style.bottom = -delta + 'px';

    gsap.set(circle, {
      xPercent: -50,
      scale: 0,
      transformOrigin: '50% ' + originY + 'px'
    });

    gsap.set(hoverLabel, {
      y: h + 8,
      opacity: 0
    });

    var tl = gsap.timeline({ paused: true });
    tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.out' }, 0);
    tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.out' }, 0);
    tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: 'power3.out' }, 0);

    timelines.push({ pill: pill, tl: tl });

    pill.addEventListener('mouseenter', function () {
      tl.tweenTo(tl.totalDuration(), { duration: 0.3, ease: 'power2.out' });
    });

    pill.addEventListener('mouseleave', function () {
      tl.tweenTo(0, { duration: 0.2, ease: 'power2.out' });
    });
  });

  // ---- Active pill on scroll ----
  var sections = document.querySelectorAll('section[id]');
  var navPills = document.querySelectorAll('.pill-list a.pill');
  var mobileLinks = document.querySelectorAll('.mobile-menu-link');

  function updateActivePill() {
    var scrollY = window.scrollY + 120;
    var current = 'hero';

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navPills.forEach(function (pill) {
      var href = pill.getAttribute('href');
      pill.classList.toggle('is-active', href === '#' + current);
    });

    mobileLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href) {
        link.classList.toggle('is-active', href === '#' + current);
      }
    });
  }

  window.addEventListener('scroll', updateActivePill);
  updateActivePill();
});
