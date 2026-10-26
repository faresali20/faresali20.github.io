document.querySelectorAll(".cards-container .card").forEach((card) => {
  const button = card.querySelector("button");
  const details = card.querySelector("p");

  if (!button || !details) {
    return;
  }

  button.textContent = "Hide details";
  button.setAttribute("aria-expanded", "true");
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    details.hidden = isExpanded;
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "Show details" : "Hide details";
  });
});