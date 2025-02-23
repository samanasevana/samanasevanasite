function accordionSetup() {
  const accordionMenus = document.querySelectorAll(".accordion");

  accordionMenus.forEach((accordionMenu) => {
    const accordionButton = accordionMenu.querySelector(".accordion__button");
    const accordionChevron = accordionMenu.querySelector(".accordion__chevron");
    const accordionContent = accordionMenu.querySelector(".accordion__content");

    if (accordionButton && accordionContent && accordionChevron) {
      // Remove any existing event listeners before adding a new one
      const newButton = accordionButton.cloneNode(true);
      accordionButton.replaceWith(newButton);

      newButton.addEventListener("click", (event) => {
        if (!accordionMenu.classList.contains("active")) {
          accordionMenu.classList.add("active");
          newButton.setAttribute("aria-expanded", "true");

          accordionContent.classList.remove("hidden");
          accordionContent.style.maxHeight =
            accordionContent.scrollHeight + "px";
          accordionChevron.classList.add("rotate-180");
        } else {
          accordionMenu.classList.remove("active");
          newButton.setAttribute("aria-expanded", "false");

          accordionContent.style.maxHeight = "0px";
          accordionChevron.classList.remove("rotate-180");

          setTimeout(() => {
            accordionContent.classList.add("hidden");
          }, 300);
        }
        event.preventDefault();
        return false;
      });
    }
  });
}

// Initial setup
accordionSetup();

//   // Ensure it re-runs after Astro view transitions
document.addEventListener("astro:after-swap", accordionSetup);
