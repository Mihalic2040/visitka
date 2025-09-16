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

// ===================== Typing Animation =====================
function startTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;
  let frames;
  try {
    frames = JSON.parse(el.getAttribute('data-frames'));
  } catch (e) {
    frames = [el.textContent.trim()];
  }
  if (!Array.isArray(frames) || frames.length === 0) return;

  const cursor = document.querySelector('.cursor');
  const typeDelay = 85; // per character
  const framePause = 800; // after frame complete
  const deleteSpeed = 38; // per char when deleting (if we ever add deletion)
  let frameIndex = 0;
  let charIndex = 0;
  let current = '';
  let baseCompleted = false;

  function typeFrame() {
    if (frameIndex === 0) {
      const target = frames[0];
      if (charIndex <= target.length) {
        current = target.slice(0, charIndex);
        el.textContent = current;
        charIndex++;
        return void setTimeout(typeFrame, typeDelay);
      }
      // first frame finished
      baseCompleted = true;
      frameIndex = 1;
      charIndex = frames[0].length; // start from existing length
      return setTimeout(typeFrame, framePause);
    } else if (frameIndex === 1) {
      const full = frames[1];
      // Only type the extra characters beyond base length
      if (charIndex < full.length) {
        charIndex++;
        el.textContent = full.slice(0, charIndex);
        return void setTimeout(typeFrame, typeDelay);
      }
      // Done all
      cursor && (cursor.style.opacity = '1');
      return; // stop
    }
  }

  // slight initial delay to let layout settle
  setTimeout(typeFrame, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startTyping);
} else {
  startTyping();
}
