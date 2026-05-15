/* Scroll-triggered fade-up reveals.
   Auto-tags key elements, staggers siblings within the same parent, and
   uses IntersectionObserver — no library needed. */
(() => {
  // Inject styles once.
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition:
        opacity 0.7s ease,
        transform 0.7s cubic-bezier(.2,.7,.2,1);
      will-change: opacity, transform;
    }
    .reveal.in { opacity: 1; transform: none; }
    @media (prefers-reduced-motion: reduce) {
      .reveal, .reveal.in {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Selectors that should fade up. Irrelevant ones on a given page no-op.
  const SELECTORS = [
    '.hero > *',
    '.page-head > *',
    '.section-head > *',
    '.map-wrap',
    '.blog-grid > *',
    '.bio > *',
    '.stats-head > *',
    '.stats > *',
    '.newsletter > *',
    '.meta-bar',
    '.pagination',
    'footer > *',
  ];

  const tag = (el) => el.classList.add('reveal');
  SELECTORS.forEach(sel => document.querySelectorAll(sel).forEach(tag));

  // Stagger by order among reveal siblings within the same parent.
  const counters = new Map();
  document.querySelectorAll('.reveal').forEach(el => {
    const p = el.parentElement;
    const i = counters.get(p) ?? 0;
    // Cap delay so a very long row doesn't take forever.
    el.style.transitionDelay = Math.min(i * 90, 540) + 'ms';
    counters.set(p, i + 1);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
