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
  size: 2.0 // start smaller, will animate to 3.0
  });
  if (!vantaEffect) {
    console.warn('Vanta effect did not initialize.');
  }
  // Do NOT fade in yet; wait until typing finished.
}

// Initialize after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVanta);
} else {
  initVanta();
}

// Safety timeout: log if still not initialized after 3 seconds
// Removed early safety fade-in: background reveals only after typing completion.

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
  // Notify rest of UI that typing finished
  document.dispatchEvent(new CustomEvent('typing:complete'));
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

// Reveal subtitle after typing completes
document.addEventListener('typing:complete', () => {
  const sub = document.querySelector('.hero__subtitle');
  if (sub) {
    sub.classList.add('reveal-from-bottom');
  }
  // Trigger background fade-in now
  const bg = document.getElementById('your-element-selector');
  if (bg) bg.classList.add('is-visible');
  // Animate size from 2 -> 3 while fading in
  animateVantaSize(1.3, 3, 1400);
});

// Smoothly animate the Vanta size parameter
function animateVantaSize(from, to, duration) {
  const startTime = performance.now();
  function easeInOutQuad(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function step(now) {
    if (!vantaEffect) return; // effect not ready
    const t = Math.min(1, (now - startTime) / duration);
    const eased = easeInOutQuad(t);
    const val = from + (to - from) * eased;
    applyVantaSize(val);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function applyVantaSize(val) {
  try {
    if (!vantaEffect) return;
    if (typeof vantaEffect.setOptions === 'function') {
      vantaEffect.setOptions({ size: val });
    } else if (vantaEffect.options) {
      vantaEffect.options.size = val;
    }
  } catch (e) {
    // Silently ignore—non-critical visual enhancement
  }
}
