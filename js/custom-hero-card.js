import gsap from 'gsap';

export function initCustomHeroCard() {
  const wrapper = document.querySelector('.custom-hero-wrapper');
  if (!wrapper) return;

  const shell = wrapper.querySelector('.custom-hero-shell');
  const card = wrapper.querySelector('.custom-hero-card');
  const glare = wrapper.querySelector('.custom-hero-glare');
  const orb = wrapper.querySelector('.custom-hero-orb');
  const avatar = wrapper.querySelector('.border-glow-card');
  const info = wrapper.querySelector('.custom-hero-info');

  // Entrance Animation - Elegant and cinematic
  const tl = gsap.timeline();
  
  gsap.set([shell, orb], { opacity: 0, scale: 0.95 });
  if (avatar) gsap.set(avatar, { opacity: 0, y: 20 });
  if (info) gsap.set(info, { opacity: 0, y: 20 });

  tl.to(orb, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' })
    .to(shell, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }, '-=1.0')
    .to(avatar, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '-=1.0')
    .to(info, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '-=0.8');

  // Interactive 3D Tilt - Smooth and subtle
  let rect;
  
  const handleMouseMove = (e) => {
    if (!rect) rect = wrapper.getBoundingClientRect();
    
    // Calculate mouse position relative to center of wrapper (-1 to 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    // Subtle tilt max 8 degrees
    const rotateX = y * -8;
    const rotateY = x * 8;

    // Glare position
    const glareX = x * 50;
    const glareY = y * 50;

    gsap.to(shell, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 1.2,
      ease: 'power3.out',
      overwrite: 'auto'
    });

    gsap.to(glare, {
      x: `${glareX}%`,
      y: `${glareY}%`,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseEnter = () => {
    rect = wrapper.getBoundingClientRect();
    gsap.to(shell, { scale: 1.02, duration: 0.8, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(shell, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out'
    });
    gsap.to(glare, {
      x: '-100%',
      y: '-100%',
      duration: 1.0,
      ease: 'power2.out'
    });
  };

  // Only run interaction if the window is wide enough (not mobile)
  if (window.innerWidth > 768) {
    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseenter', handleMouseEnter);
    wrapper.addEventListener('mouseleave', handleMouseLeave);
  }
}

// Auto init
document.addEventListener('DOMContentLoaded', initCustomHeroCard);
// Fallback if already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initCustomHeroCard, 1);
}
