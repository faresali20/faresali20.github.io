document.querySelectorAll(".project-card").forEach((card) => {
  const button = card.querySelector(".details-button");
  const details = card.querySelector("p");

  if (!button || !details) {
    return;
  }

  details.hidden = true;
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    details.hidden = isExpanded;
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "Show details" : "Hide details";
  });
});

document.querySelectorAll(".message-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (status) {
      status.textContent = "This demo form isn't connected, so your message was not sent.";
    }
  });
});