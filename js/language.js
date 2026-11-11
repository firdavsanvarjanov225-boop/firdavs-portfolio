const SUPPORTED_LANGS = ["en", "ru", "uz", "ky"];
const DEFAULT_LANG = "en";
const STORAGE_KEY = "portfolio-lang";

let currentLang = DEFAULT_LANG;

// Сақланган тилни олиш (бўлмаса English)
const getSavedLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
  } catch (error) {
    return DEFAULT_LANG;
  }
};

const saveLang = (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    // storage ишламаса, тил фақат шу саҳифада сақланади
  }
};

// Калит бўйича таржимани олиш. Бошқа файллар ҳам ишлатади (масалан, contact.js)
window.t = (key) => {
  const dict = window.translations && window.translations[currentLang];
  return dict && dict[key] !== undefined ? dict[key] : key;
};

const applyLanguage = (lang) => {
  if (!window.translations || !window.translations[lang]) return;

  currentLang = lang;
  document.documentElement.lang = lang;

  // Оддий матнлар
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = window.t(el.dataset.i18n);
  });

  // Input ва textarea placeholder'лари
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = window.t(el.dataset.i18nPlaceholder);
  });

  // Фаол тил тугмасини белгилаш
  document.querySelectorAll(".lang__btn").forEach((btn) => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  saveLang(lang);
  document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
};

// Тугмалар босилганда тилни алмаштириш
document.querySelectorAll(".lang__btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

// Саҳифа очилганда сақланган тилни қўллаш
applyLanguage(getSavedLang());