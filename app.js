document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
  );

  targets.forEach((t) => observer.observe(t));
});
