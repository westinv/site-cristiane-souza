export function initReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute('data-in', '');
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12 },
  );

  const observe = (root: ParentNode = document) => {
    root.querySelectorAll('[data-rv]:not([data-in])').forEach((el) => io.observe(el));
  };

  observe();

  document.addEventListener('reveal:refresh', () => observe());
}
