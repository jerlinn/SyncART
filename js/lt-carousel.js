document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('[data-lt-carousel]');
  if (!carousels.length) return;

  carousels.forEach((root) => {
    const slides = Array.from(root.querySelectorAll('.lt-carousel-img'));
    const prevBtn = root.querySelector('.lt-carousel-prev');
    const nextBtn = root.querySelector('.lt-carousel-next');
    const dots = Array.from(root.querySelectorAll('.lt-carousel-dot'));

    if (slides.length < 2) return;

    let index = slides.findIndex((s) => s.classList.contains('is-active'));
    if (index < 0) index = 0;

    function setActive(nextIndex) {
      const total = slides.length;
      index = (nextIndex + total) % total;

      slides.forEach((img, i) => {
        const active = i === index;
        img.classList.toggle('is-active', active);
        img.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
        dot.tabIndex = active ? 0 : -1;
      });
    }

    // Initialize ARIA state
    slides.forEach((img, i) => img.setAttribute('aria-hidden', i === index ? 'false' : 'true'));
    dots.forEach((dot, i) => (dot.tabIndex = i === index ? 0 : -1));

    function step(direction) {
      setActive(index + direction);
    }

    prevBtn?.addEventListener('click', () => step(-1));
    nextBtn?.addEventListener('click', () => step(1));

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => setActive(i));
    });

    // Keyboard support (when focused inside)
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
    });

    // Swipe support (quiet, no inertia)
    let startX = 0;
    let startY = 0;
    let isDown = false;

    root.addEventListener('pointerdown', (e) => {
      // Don't hijack pointer events from interactive controls (arrows/dots).
      // Pointer capture can prevent buttons from receiving a click on mobile.
      if (e.target && e.target.closest?.('.lt-carousel-nav, .lt-carousel-dot')) return;

      // Only primary button / touch
      if (typeof e.button === 'number' && e.button !== 0) return;
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      root.setPointerCapture?.(e.pointerId);
    });

    root.addEventListener('pointerup', (e) => {
      if (!isDown) return;
      isDown = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Horizontal intent + threshold
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        step(dx > 0 ? -1 : 1);
      }
    });

    root.addEventListener('pointercancel', () => {
      isDown = false;
    });
  });
});


