const form = document.getElementById("contact-form");

if (form) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Ҳар бир майдон учун қоида ва хато матни
  const rules = [
    {
      id: "name",
      isValid: (value) => value.trim().length >= 2,
      message: "Please enter your full name (at least 2 characters).",
    },
    {
      id: "email",
      isValid: (value) => emailPattern.test(value.trim()),
      message: "Please enter a valid email address.",
    },
    {
      id: "subject",
      isValid: (value) => value.trim().length >= 3,
      message: "Please enter a subject (at least 3 characters).",
    },
    {
      id: "message",
      isValid: (value) => value.trim().length >= 10,
      message: "Message must be at least 10 characters long.",
    },
  ];

  const showError = (input, message) => {
    const group = input.closest(".form__group");
    let error = group.querySelector(".form__error");

    if (!error) {
      error = document.createElement("small");
      error.className = "form__error";
      group.appendChild(error);
    }

    error.textContent = message;
    input.classList.add("invalid");
  };

  const clearError = (input) => {
    const group = input.closest(".form__group");
    const error = group.querySelector(".form__error");

    if (error) error.remove();
    input.classList.remove("invalid");
  };

  // Статус хабари учун жой
  const status = document.createElement("p");
  status.className = "form__status";
  form.appendChild(status);

  // Ёзиш давомида хатони ўчириш
  rules.forEach((rule) => {
    const input = document.getElementById(rule.id);
    input.addEventListener("input", () => {
      clearError(input);
      status.textContent = "";
    });
  });

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

    // Telegram'га юбориш 8-босқичда қўшилади
    const data = {
      name: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      subject: form.elements["subject"].value.trim(),
      message: form.elements["message"].value.trim(),
    };

    console.log("Form data:", data);
    status.textContent = "Form is valid. Sending will be added in the next step.";
  });
}