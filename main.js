// Initialize Vanta Halo effect once scripts are loaded
let vantaEffect;

function initVanta() {
  if (vantaEffect) return; // already initialized
  if (typeof VANTA === 'undefined' || !document.querySelector('#your-element-selector')) {
    return setTimeout(initVanta, 50);
  }
  vantaEffect = VANTA.HALO({
    el: '#your-element-selector',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    baseColor: 0x6b0087,
  backgroundColor: 0x000000,
    amplitudeFactor: 3.0,
    xOffset: 0.30,
    size: 3.0
  });
  if (!vantaEffect) {
    console.warn('Vanta effect did not initialize.');
  }
  // Fade in once a frame has likely rendered
  requestAnimationFrame(() => {
    const bg = document.getElementById('your-element-selector');
    if (bg) bg.classList.add('is-visible');
  });
}

// Initialize after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVanta);
} else {
  initVanta();
}

// Safety timeout: log if still not initialized after 3 seconds
setTimeout(() => {
  if (!vantaEffect) {
    console.warn('Vanta still not initialized after 3s. Check network (three.js & vanta) and element ID.');
  } else {
    // Safety: ensure class applied even if earlier RAF missed
    const bg = document.getElementById('your-element-selector');
    if (bg && !bg.classList.contains('is-visible')) {
      bg.classList.add('is-visible');
    }
  }
}, 3000);

// Optional: clean up if page uses SPA navigation (placeholder)
window.addEventListener('beforeunload', () => {
  if (vantaEffect && vantaEffect.destroy) {
    vantaEffect.destroy();
    vantaEffect = null;
  }
});
