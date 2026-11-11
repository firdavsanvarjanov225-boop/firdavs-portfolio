// Жорий саҳифа номи (about.html -> "about", бўш йўл -> "index")
const getPageName = (path) => {
  return path.split("/").pop().replace(".html", "") || "index";
};

// Менюда жорий саҳифани автоматик белгилаш
const currentPage = getPageName(window.location.pathname);

document.querySelectorAll(".nav__link").forEach((link) => {
  const linkPage = getPageName(link.getAttribute("href"));
  link.classList.toggle("active", linkPage === currentPage);
});

// Скролл қилинганда Header'га соя қўшиш
const header = document.querySelector(".header");

if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}