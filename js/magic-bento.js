import { gsap } from 'gsap';

var GLOW_COLOR = '83, 92, 145';
var PARTICLE_COUNT = 30;
var MOBILE_BREAKPOINT = 768;

function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function createParticles(card, cx, cy) {
  var particles = [];
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var p = document.createElement('span');
    p.className = 'particle';
    var angle = Math.random() * Math.PI * 2;
    var dist = 10 + Math.random() * 30;
    var startX = cx + Math.cos(angle) * dist;
    var startY = cy + Math.sin(angle) * dist;
    p.style.left = startX + 'px';
    p.style.top = startY + 'px';
    var rotation = Math.random() * 360;
    p.style.setProperty('--particle-rotation', rotation + 'deg');
    p.style.transform = 'rotate(' + rotation + 'deg)';
    var size = 3 + Math.random() * 4;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    card.appendChild(p);
    particles.push(p);

    var travelAngle = Math.random() * Math.PI * 2;
    var travelDist = 40 + Math.random() * 80;
    gsap.to(p, {
      x: Math.cos(travelAngle) * travelDist,
      y: Math.sin(travelAngle) * travelDist,
      opacity: 0,
      scale: 0,
      rotation: rotation + 180 + Math.random() * 180,
      duration: 0.5 + Math.random() * 0.4,
      ease: 'power2.out',
      delay: Math.random() * 0.15,
      onComplete: function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }
    });
  }
  return particles;
}

function setupCard(card) {
  var disable = isMobile();
  var activeParticles = [];
  var mouseInside = false;
  var raf = null;

  function onEnter(e) {
    if (disable) return;
    mouseInside = true;
    var rect = card.getBoundingClientRect();
    var cx = e.clientX - rect.left;
    var cy = e.clientY - rect.top;
    activeParticles = createParticles(card, cx, cy);
  }

  function onLeave() {
    mouseInside = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    activeParticles.forEach(function (p) {
      gsap.killTweensOf(p);
      if (p.parentNode) p.parentNode.removeChild(p);
    });
    activeParticles = [];
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
    card.style.setProperty('--glow-intensity', '0');
  }

  function onMove(e) {
    if (disable || !mouseInside) return;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      if (!mouseInside) return;
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;

      var rotateX = ((y - cy) / cy) * -8;
      var rotateY = ((x - cx) / cx) * 8;
      var deltaX = (x - cx) * 0.06;
      var deltaY = (y - cy) * 0.06;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        x: deltaX,
        y: deltaY,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      var maxDist = Math.sqrt(cx * cx + cy * cy);
      var dist = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
      var intensity = Math.max(0, 1 - dist / maxDist);

      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
      card.style.setProperty('--glow-intensity', intensity);
    });
  }

  function onRipple(e) {
    if (disable) return;
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    card.appendChild(ripple);
    gsap.fromTo(ripple,
      { scale: 0, opacity: 0.4 },
      {
        scale: 5,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: function () {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }
      }
    );
  }

  card.addEventListener('mouseenter', onEnter);
  card.addEventListener('mouseleave', onLeave);
  card.addEventListener('mousemove', onMove);
  card.addEventListener('click', onRipple);

  return {
    destroy: function () {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('click', onRipple);
      activeParticles.forEach(function (p) {
        gsap.killTweensOf(p);
        if (p.parentNode) p.parentNode.removeChild(p);
      });
    }
  };
}

function setupSpotlight(grid) {
  var spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  document.body.appendChild(spotlight);

  var isInside = false;
  var raf = null;

  function updateSpotlight(x, y) {
    spotlight.style.setProperty('--spotlight-x', x + 'px');
    spotlight.style.setProperty('--spotlight-y', y + 'px');
  }

  grid.addEventListener('mouseenter', function () {
    if (isMobile()) return;
    isInside = true;
    spotlight.style.opacity = '1';
  });

  grid.addEventListener('mouseleave', function () {
    isInside = false;
    spotlight.style.opacity = '0';
  });

  grid.addEventListener('mousemove', function (e) {
    if (isMobile() || !isInside) return;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      if (!isInside) return;
      updateSpotlight(e.clientX, e.clientY);
    });
  });

  return {
    destroy: function () {
      if (spotlight.parentNode) spotlight.parentNode.removeChild(spotlight);
    }
  };
}

function init() {
  var grid = document.querySelector('.card-grid');
  if (!grid) return;

  var cardInstances = [];
  var spotlightInstance = null;

  grid.querySelectorAll('.magic-bento-card').forEach(function (card) {
    cardInstances.push(setupCard(card));
  });

  if (!isMobile()) {
    spotlightInstance = setupSpotlight(grid);
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var mobile = isMobile();
      cardInstances.forEach(function (inst) { inst.destroy(); });
      cardInstances = [];
      if (spotlightInstance) { spotlightInstance.destroy(); spotlightInstance = null; }

      grid.querySelectorAll('.magic-bento-card').forEach(function (card) {
        cardInstances.push(setupCard(card));
      });

      if (!mobile) {
        spotlightInstance = setupSpotlight(grid);
      }
    }, 250);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
