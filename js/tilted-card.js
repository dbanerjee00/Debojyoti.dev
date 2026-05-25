import gsap from 'gsap';

export function initTiltedCard(element) {
  const figure = element;
  const inner = figure.querySelector('.tilted-card-inner');
  const img = figure.querySelector('.tilted-card-img');
  const caption = figure.querySelector('.tilted-card-caption');
  
  if (!figure || !inner || !img) return;

  const rotateAmplitude = parseFloat(figure.dataset.rotateAmplitude) || 14;
  const scaleOnHover = parseFloat(figure.dataset.scaleOnHover) || 1.1;

  // Spring configurations for GSAP
  const springConfig = { duration: 0.8, ease: "power3.out" };

  let lastY = 0;

  function handleMouse(e) {
    const rect = figure.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    gsap.to(inner, {
      rotateX: rotationX,
      rotateY: rotationY,
      ...springConfig
    });

    if (caption) {
      const captionX = e.clientX - rect.left;
      const captionY = e.clientY - rect.top;
      
      const velocityY = offsetY - lastY;
      
      gsap.to(caption, {
        x: captionX,
        y: captionY,
        rotate: -velocityY * 0.6,
        duration: 0.4,
        ease: "power2.out"
      });
      
      lastY = offsetY;
    }
  }

  function handleMouseEnter() {
    gsap.to(inner, {
      scale: scaleOnHover,
      ...springConfig
    });
    if (caption) {
      gsap.to(caption, {
        opacity: 1,
        duration: 0.3
      });
    }
  }

  function handleMouseLeave() {
    gsap.to(inner, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      ...springConfig
    });
    if (caption) {
      gsap.to(caption, {
        opacity: 0,
        rotate: 0,
        duration: 0.3
      });
    }
  }

  figure.addEventListener('mousemove', handleMouse);
  figure.addEventListener('mouseenter', handleMouseEnter);
  figure.addEventListener('mouseleave', handleMouseLeave);
}

// Auto-init all elements with data-tilted-card attribute
function initAll() {
  document.querySelectorAll('[data-tilted-card]').forEach(initTiltedCard);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
