const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  burger.setAttribute("aria-expanded", "false");

  const closeMenu = () => {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.textContent = "☰";
  };

  // ☰ тугмаси: менюни очиш / ёпиш
  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.textContent = isOpen ? "✕" : "☰";
  });

  // Ҳавола босилганда ёпиш
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Менюдан ташқарига босилганда ёпиш
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !burger.contains(event.target)) {
      closeMenu();
    }
  });

  // Esc босилганда ёпиш
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Экран катталашганда ёпиш
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}