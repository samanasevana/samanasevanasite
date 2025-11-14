function setupWeekCarousel() {
  const carousel = document.querySelector("[data-week-carousel]");
  if (!carousel) return;

  const buttons = Array.from(
    carousel.querySelectorAll("[data-week-index]")
  );
  const panels = Array.from(
    document.querySelectorAll("[data-week-panel]")
  );

  if (!buttons.length || !panels.length) return;

  const setActive = (index) => {
    buttons.forEach((button) => {
      const isActive = Number(button.dataset.weekIndex) === index;
      button.dataset.active = String(isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isMatch = Number(panel.dataset.weekPanel) === index;
      panel.hidden = !isMatch;
    });
  };

  buttons.forEach((button) => {
    if (button.dataset.listenerAttached === "true") return;
    button.dataset.listenerAttached = "true";
    button.addEventListener("click", () => {
      setActive(Number(button.dataset.weekIndex));
      button.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });
  });
}

setupWeekCarousel();
document.addEventListener("astro:after-swap", setupWeekCarousel);
