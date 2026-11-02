const clamp = (v: number) => Math.max(0, Math.min(1, v));

export function initScrollFx() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const words = document.querySelector<HTMLElement>('[data-words]');
  const wordSpans = words ? [...words.querySelectorAll<HTMLElement>('[data-w]')] : [];
  const stacks = [...document.querySelectorAll<HTMLElement>('[data-stack]')].map((el) => ({
    inner: el.querySelector<HTMLElement>('[data-stack-inner]'),
    next: el.nextElementSibling?.hasAttribute('data-stack') ? (el.nextElementSibling as HTMLElement) : null,
  }));
  const hz = document.querySelector<HTMLElement>('[data-hz]');
  const track = hz?.querySelector<HTMLElement>('[data-track]');

  let lastLit = -1;

  const tick = () => {
    raf = 0;
    const vh = innerHeight;

    if (hero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0) hero.style.setProperty('--p', clamp(scrollY / vh).toFixed(4));
    }

    if (words && wordSpans.length) {
      const r = words.getBoundingClientRect();
      const p = clamp((vh * 0.8 - r.top) / (r.height * 0.9));
      const n = wordSpans.length;
      let lit = 0;
      while (lit < n && (lit + 1) / n <= p + 0.02) lit++;
      if (lit !== lastLit) {
        wordSpans.forEach((w, i) => w.toggleAttribute('data-lit', i < lit));
        lastLit = lit;
      }
    }

    for (const { inner, next } of stacks) {
      if (!inner) continue;
      const p = next ? clamp(1 - next.getBoundingClientRect().top / vh) : 0;
      inner.style.transform = `scale(${(1 - p * 0.1).toFixed(4)})`;
      inner.style.filter = p > 0 ? `brightness(${(1 - p * 0.6).toFixed(3)})` : '';
      inner.style.borderRadius = `${(p * 28).toFixed(1)}px`;
    }

    if (hz && track) {
      const r = hz.getBoundingClientRect();
      const total = hz.offsetHeight - vh;
      const p = total > 0 ? clamp(-r.top / total) : 0;
      const max = Math.max(0, track.scrollWidth - innerWidth);
      track.style.transform = `translate3d(${(-p * max).toFixed(1)}px,0,0)`;
    }
  };

  let raf = 0;
  const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };

  document.documentElement.setAttribute('data-fx', '');
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  tick();
}
