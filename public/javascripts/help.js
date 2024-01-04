
const submitButton = document.querySelector("#submitButton");
const form = document.querySelector("#dataForm");

form.addEventListener("submit", function onFormSubmitted(event) {
  document.querySelector("#dataForm").classList.add("was-validated");

  form.querySelectorAll("input").forEach((element) => {
    if (!element.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      const feedback = element.parentElement.querySelector(".invalid-feedback");
      feedback.textContent = element.validationMessage;
    }
  });
});