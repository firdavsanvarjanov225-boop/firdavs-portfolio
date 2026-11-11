const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(
    ".hero__inner, .section-title, .card, .timeline__item"
  );

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add("visible");
        obs.unobserve(el);

        // Анимациядан кейин вақтинчалик классларни олиб ташлаймиз,
        // шунда карточканинг hover эффекти бузилмайди
        setTimeout(() => el.classList.remove("reveal", "visible"), 800);
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}