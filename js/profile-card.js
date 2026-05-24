(function () {
  'use strict';

  var wrapper = document.getElementById('profileCard');
  var shell = document.getElementById('pcCardShell');
  if (!wrapper || !shell) return;

  var wrapEl = wrapper;
  var shellEl = shell;

  // ---- Tilt Engine ----
  var ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    ENTER_TRANSITION_MS: 180
  };

  var clamp = function (v, min, max) {
    return Math.min(Math.max(v, min), max);
  };

  var round = function (v, precision) {
    if (precision === void 0) precision = 3;
    return parseFloat(v.toFixed(precision));
  };

  var adjust = function (v, fMin, fMax, tMin, tMax) {
    return round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));
  };

  var getOffsets = function (evt, el) {
    var rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  var setVarsFromXY = function (x, y) {
    var width = shellEl.clientWidth || 1;
    var height = shellEl.clientHeight || 1;

    var percentX = clamp((100 / width) * x);
    var percentY = clamp((100 / height) * y);

    var centerX = percentX - 50;
    var centerY = percentY - 50;

    var properties = {
      '--pointer-x': percentX + '%',
      '--pointer-y': percentY + '%',
      '--background-x': adjust(percentX, 0, 100, 35, 65) + '%',
      '--background-y': adjust(percentY, 0, 100, 35, 65) + '%',
      '--pointer-from-center': clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1),
      '--pointer-from-top': percentY / 100,
      '--pointer-from-left': percentX / 100,
      '--rotate-x': round(-(centerX / 7)) + 'deg',
      '--rotate-y': round(centerY / 6) + 'deg'
    };

    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        wrapEl.style.setProperty(key, properties[key]);
      }
    }
  };

  // ---- State ----
  var rafId = null;
  var running = false;
  var lastTs = 0;
  var currentX = 0;
  var currentY = 0;
  var targetX = 0;
  var targetY = 0;
  var initialUntil = 0;
  var DEFAULT_TAU = 0.14;
  var INITIAL_TAU = 0.6;

  var enterTimer = null;
  var leaveRaf = null;

  var step = function (ts) {
    if (!running) return;
    if (lastTs === 0) lastTs = ts;
    var dt = (ts - lastTs) / 1000;
    lastTs = ts;

    var tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
    var k = 1 - Math.exp(-dt / tau);

    currentX += (targetX - currentX) * k;
    currentY += (targetY - currentY) * k;

    setVarsFromXY(currentX, currentY);

    var stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

    if (stillFar) {
      rafId = requestAnimationFrame(step);
    } else {
      running = false;
      lastTs = 0;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };

  var start = function () {
    if (running) return;
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(step);
  };

  var tiltEngine = {
    setImmediate: function (x, y) {
      currentX = x;
      currentY = y;
      setVarsFromXY(currentX, currentY);
    },
    setTarget: function (x, y) {
      targetX = x;
      targetY = y;
      start();
    },
    toCenter: function () {
      this.setTarget(shellEl.clientWidth / 2, shellEl.clientHeight / 2);
    },
    beginInitial: function (durationMs) {
      initialUntil = performance.now() + durationMs;
      start();
    },
    getCurrent: function () {
      return { x: currentX, y: currentY, tx: targetX, ty: targetY };
    },
    cancel: function () {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      running = false;
      lastTs = 0;
    }
  };

  // ---- Event Handlers ----
  var handlePointerEnter = function (e) {
    shellEl.classList.add('active');
    shellEl.classList.add('entering');
    if (enterTimer) window.clearTimeout(enterTimer);
    enterTimer = window.setTimeout(function () {
      shellEl.classList.remove('entering');
    }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

    var off = getOffsets(e, shellEl);
    tiltEngine.setTarget(off.x, off.y);
  };

  var handlePointerMove = function (e) {
    var off = getOffsets(e, shellEl);
    tiltEngine.setTarget(off.x, off.y);
  };

  var handlePointerLeave = function () {
    tiltEngine.toCenter();

    var checkSettle = function () {
      var state = tiltEngine.getCurrent();
      var settled = Math.hypot(state.tx - state.x, state.ty - state.y) < 0.6;
      if (settled) {
        shellEl.classList.remove('active');
        leaveRaf = null;
      } else {
        leaveRaf = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRaf) cancelAnimationFrame(leaveRaf);
    leaveRaf = requestAnimationFrame(checkSettle);
  };

  // ---- Init ----
  var init = function () {
    shellEl.addEventListener('pointerenter', handlePointerEnter);
    shellEl.addEventListener('pointermove', handlePointerMove);
    shellEl.addEventListener('pointerleave', handlePointerLeave);

    var initialX = (shellEl.clientWidth || 400) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    var initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);
  };

  init();

  // ---- Theme update ----
  var updateThemeVars = function () {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      wrapEl.style.setProperty('--behind-glow-color', 'rgba(125, 190, 255, 0.5)');
    } else {
      wrapEl.style.setProperty('--behind-glow-color', 'rgba(110, 119, 167, 0.4)');
    }
  };

  updateThemeVars();
  var themeObserver = new MutationObserver(function () {
    updateThemeVars();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // ---- Page change cleanup ----
  window.addEventListener('pagechange', function () {
    if (leaveRaf) cancelAnimationFrame(leaveRaf);
    leaveRaf = null;
    tiltEngine.cancel();
    shellEl.classList.remove('active', 'entering');
    // Re-init after short delay to allow DOM settle
    setTimeout(function () {
      var cx = shellEl.clientWidth / 2;
      var cy = shellEl.clientHeight / 2;
      tiltEngine.setImmediate(cx, cy);
    }, 100);
  });
})();
