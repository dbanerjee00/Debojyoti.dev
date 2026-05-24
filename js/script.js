(function () {
  'use strict';

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
  var revealObserver;
  var revealSelector = '.section, .work__card, .experience__card, .about__stats, .timeline, .skills, .contact__grid, .faq';

  function initRevealObserver() {
    if (revealObserver) {
      revealObserver.disconnect();
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(revealSelector).forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    revealObserver = new IntersectionObserver(
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

    var activePage = document.querySelector('.page.active') || document;
    var els = activePage.querySelectorAll(revealSelector);

    els.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(el);
    });
  }

  initRevealObserver();

  window.addEventListener('pagechange', initRevealObserver);
})();
