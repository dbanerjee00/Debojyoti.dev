(function () {
  'use strict';

  // ---- Creative cursor tracker ----
  var creativeCursor = document.createElement('div');
  creativeCursor.className = 'creative-cursor';
  creativeCursor.innerHTML =
    '<span class="creative-cursor__ring"></span>' +
    '<span class="creative-cursor__dot"></span>' +
    '<span class="creative-cursor__spark"></span>' +
    '<span class="creative-cursor__spark"></span>' +
    '<span class="creative-cursor__spark"></span>';
  document.body.appendChild(creativeCursor);
  document.body.classList.add('creative-cursor-enabled');

  var cursorDot = creativeCursor.querySelector('.creative-cursor__dot');
  var cursorRing = creativeCursor.querySelector('.creative-cursor__ring');
  var cursorSparks = Array.prototype.slice.call(creativeCursor.querySelectorAll('.creative-cursor__spark'));
  var interactiveSelector = 'a, button, input, select, textarea, .work__card, .faq__question, .stepper__indicator';
  var cursorX = window.innerWidth / 2;
  var cursorY = window.innerHeight / 2;
  var targetCursorX = cursorX;
  var targetCursorY = cursorY;
  var sparkPoints = cursorSparks.map(function () {
    return { x: cursorX, y: cursorY };
  });

  function cursorLerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function updateCreativeTarget(element) {
    var isTarget = Boolean(element && element.closest && element.closest(interactiveSelector));
    creativeCursor.classList.toggle('is-target', isTarget);
  }

  function moveCreativeCursor(x, y, element) {
    targetCursorX = x;
    targetCursorY = y;
    updateCreativeTarget(element || document.elementFromPoint(x, y));
  }

  function renderCreativeCursor() {
    cursorX = cursorLerp(cursorX, targetCursorX, 0.24);
    cursorY = cursorLerp(cursorY, targetCursorY, 0.24);
    creativeCursor.style.transform = 'translate3d(' + cursorX + 'px, ' + cursorY + 'px, 0)';

    cursorSparks.forEach(function (spark, index) {
      var previous = index === 0 ? { x: cursorX, y: cursorY } : sparkPoints[index - 1];
      sparkPoints[index].x = cursorLerp(sparkPoints[index].x, previous.x, 0.18 - index * 0.035);
      sparkPoints[index].y = cursorLerp(sparkPoints[index].y, previous.y, 0.18 - index * 0.035);
      var size = 7 - index * 1.3;
      spark.style.width = size + 'px';
      spark.style.height = size + 'px';
      spark.style.opacity = String(0.42 - index * 0.1);
      spark.style.transform =
        'translate(' + (sparkPoints[index].x - cursorX - size / 2) + 'px, ' + (sparkPoints[index].y - cursorY - size / 2) + 'px)';
    });

    cursorRing.style.transform = 'translate(-50%, -50%) rotate(' + (Date.now() * 0.04) + 'deg)';
    cursorDot.style.transform = creativeCursor.classList.contains('is-pressed')
      ? 'translate(-50%, -50%) scale(0.78)'
      : 'translate(-50%, -50%) scale(1)';

    requestAnimationFrame(renderCreativeCursor);
  }

  window.addEventListener('pointermove', function (event) {
    moveCreativeCursor(event.clientX, event.clientY, event.target);
  });

  window.addEventListener('touchstart', function (event) {
    if (!event.touches.length) return;
    moveCreativeCursor(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('touchmove', function (event) {
    if (!event.touches.length) return;
    moveCreativeCursor(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('scroll', function () {
    updateCreativeTarget(document.elementFromPoint(targetCursorX, targetCursorY));
  }, { passive: true });

  window.addEventListener('pointerdown', function () {
    creativeCursor.classList.add('is-pressed');
  });

  window.addEventListener('pointerup', function () {
    creativeCursor.classList.remove('is-pressed');
  });

  renderCreativeCursor();

  // ---- Hero rotating text ----
  var rotatingText = document.getElementById('rotatingText');
  var rotatingWords = [
    'responsive websites',
    'clean interfaces',
    'smooth interactions',
    'modern web apps'
  ];
  var rotatingIndex = 0;

  if (rotatingText) {
    setInterval(function () {
      rotatingText.classList.add('is-exiting');

      setTimeout(function () {
        rotatingIndex = (rotatingIndex + 1) % rotatingWords.length;
        rotatingText.textContent = rotatingWords[rotatingIndex];
        rotatingText.classList.remove('is-exiting');
        rotatingText.classList.remove('is-entering');
        void rotatingText.offsetWidth;
        rotatingText.classList.add('is-entering');
      }, 520);
    }, 3500);
  }

  // ---- Current year in footer ----
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- Contact stepper ----
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    var stepperSteps = Array.prototype.slice.call(contactForm.querySelectorAll('.stepper__step'));
    var stepperIndicators = Array.prototype.slice.call(contactForm.querySelectorAll('.stepper__indicator'));
    var stepperConnectors = Array.prototype.slice.call(contactForm.querySelectorAll('.stepper__connector'));
    var stepperBack = contactForm.querySelector('.stepper__back');
    var stepperNext = contactForm.querySelector('.stepper__next');
    var stepperSubmit = contactForm.querySelector('.stepper__submit');
    var currentStepperStep = 1;

    function validateStepperStep(step) {
      var fields = stepperSteps[step - 1].querySelectorAll('input, textarea, select');
      for (var i = 0; i < fields.length; i += 1) {
        if (!fields[i].checkValidity()) {
          fields[i].reportValidity();
          return false;
        }
      }
      return true;
    }

    function showStepperStep(step) {
      currentStepperStep = step;

      stepperSteps.forEach(function (item, index) {
        item.classList.toggle('active', index + 1 === step);
      });

      stepperIndicators.forEach(function (indicator, index) {
        var stepNumber = index + 1;
        indicator.classList.toggle('active', stepNumber === step);
        indicator.classList.toggle('complete', stepNumber < step);
      });

      stepperConnectors.forEach(function (connector, index) {
        connector.classList.toggle('complete', index + 1 < step);
      });

      stepperBack.classList.toggle('visible', step > 1);
      stepperNext.classList.toggle('hidden', step === stepperSteps.length);
      stepperSubmit.classList.toggle('visible', step === stepperSteps.length);
    }

    stepperNext.addEventListener('click', function () {
      if (!validateStepperStep(currentStepperStep)) return;
      showStepperStep(Math.min(currentStepperStep + 1, stepperSteps.length));
    });

    stepperBack.addEventListener('click', function () {
      showStepperStep(Math.max(currentStepperStep - 1, 1));
    });

    stepperIndicators.forEach(function (indicator) {
      indicator.addEventListener('click', function () {
        var targetStep = Number(this.getAttribute('data-step-target'));
        if (targetStep > currentStepperStep && !validateStepperStep(currentStepperStep)) return;
        showStepperStep(targetStep);
      });
    });

    showStepperStep(currentStepperStep);
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq__item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq__item').forEach(function (el) {
        el.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // ---- Scroll reveal animation ----
  var revealEls = document.querySelectorAll(
    '.section, .work__card, .experience__card, .about__stats, .timeline, .skills, .contact__grid, .faq'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
})();
