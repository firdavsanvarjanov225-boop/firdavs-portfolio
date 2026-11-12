const form = document.getElementById("contact-form");

if (form) {
  const t = (key) => (window.t ? window.t(key) : key);
  const API_URL = "/api/contact";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = [
    { id: "name", isValid: (v) => v.trim().length >= 2, message: "form.err.name" },
    { id: "email", isValid: (v) => emailPattern.test(v.trim()), message: "form.err.email" },
    { id: "subject", isValid: (v) => v.trim().length >= 3, message: "form.err.subject" },
    { id: "message", isValid: (v) => v.trim().length >= 10, message: "form.err.message" },
  ];

  const submitBtn = form.querySelector('button[type="submit"]');
  let isSending = false;

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

  // Юбориш натижаси учун хабар жойи
  const status = document.createElement("p");
  status.className = "form__status";
  status.setAttribute("role", "status");
  form.appendChild(status);

  const setStatus = (key, type) => {
    status.textContent = key ? t(key) : "";
    status.className = "form__status" + (type ? " form__status--" + type : "");
  };

  const clearAll = () => {
    rules.forEach((rule) => clearError(document.getElementById(rule.id)));
    setStatus("");
  };

  // Ёзиш давомида хатони ўчириш
  rules.forEach((rule) => {
    const input = document.getElementById(rule.id);
    input.addEventListener("input", () => {
      clearError(input);
      setStatus("");
    });
  });

  // Тил алмашганда эски тилдаги хабарларни тозалаш
  document.addEventListener("languagechange", clearAll);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSending) return;

    // 1) Браузерда текшириш
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
      setStatus("");
      return;
    }

    // 2) Маълумотни йиғиш
    const data = {
      name: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      subject: form.elements["subject"].value.trim(),
      message: form.elements["message"].value.trim(),
      website: form.elements["website"]?.value || "",
    };

    // 3) Серверга юбориш
    isSending = true;
    submitBtn.disabled = true;
    setStatus("form.sending", "info");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }

      form.reset();
      setStatus("form.success", "success");
    } catch (error) {
      console.error(error);
      setStatus("form.fail", "error");
    } finally {
      isSending = false;
      submitBtn.disabled = false;
    }
  });
}