const form = document.getElementById("contact-form");

if (form) {
  const t = (key) => (window.t ? window.t(key) : key);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Ҳар бир майдон учун қоида ва таржима калити
  const rules = [
    { id: "name", isValid: (v) => v.trim().length >= 2, message: "form.err.name" },
    { id: "email", isValid: (v) => emailPattern.test(v.trim()), message: "form.err.email" },
    { id: "subject", isValid: (v) => v.trim().length >= 3, message: "form.err.subject" },
    { id: "message", isValid: (v) => v.trim().length >= 10, message: "form.err.message" },
  ];

  const showError = (input, messageKey) => {
    const group = input.closest(".form__group");
    let error = group.querySelector(".form__error");

    if (!error) {
      error = document.createElement("small");
      error.className = "form__error";
      group.appendChild(error);
    }

    error.textContent = t(messageKey);
    input.classList.add("invalid");
  };

  const clearError = (input) => {
    const group = input.closest(".form__group");
    const error = group.querySelector(".form__error");

    if (error) error.remove();
    input.classList.remove("invalid");
  };

  const status = document.createElement("p");
  status.className = "form__status";
  form.appendChild(status);

  const clearAll = () => {
    rules.forEach((rule) => clearError(document.getElementById(rule.id)));
    status.textContent = "";
  };

  // Ёзиш давомида хатони ўчириш
  rules.forEach((rule) => {
    const input = document.getElementById(rule.id);
    input.addEventListener("input", () => {
      clearError(input);
      status.textContent = "";
    });
  });

  // Тил алмашганда эски тилдаги хабарларни тозалаш
  document.addEventListener("languagechange", clearAll);

  // Юборишда текшириш
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let formIsValid = true;

    rules.forEach((rule) => {
      const input = document.getElementById(rule.id);

      if (rule.isValid(input.value)) {
        clearError(input);
      } else {
        showError(input, rule.message);
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      status.textContent = "";
      return;
    }

    // Telegram'га юбориш 8B босқичда қўшилади
    const data = {
      name: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      subject: form.elements["subject"].value.trim(),
      message: form.elements["message"].value.trim(),
    };

    console.log("Form data:", data);
    status.textContent = t("form.ok");
  });
}