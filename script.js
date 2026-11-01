const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const readingProgress = document.querySelector(".reading-progress");
const languageTitle = document.querySelector("[data-language-title]");

if (languageTitle && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const languagePrompts = [
    "Escolha seu idioma",
    "Choose your language",
    "Elige tu idioma",
  ];
  let promptIndex = 0;

  window.setInterval(() => {
    languageTitle.classList.add("is-changing");
    window.setTimeout(() => {
      promptIndex = (promptIndex + 1) % languagePrompts.length;
      languageTitle.textContent = languagePrompts[promptIndex];
      languageTitle.classList.remove("is-changing");
    }, 240);
  }, 3200);
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    }
  });
}

if (readingProgress) {
  const updateReadingProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    readingProgress.style.width = `${Math.min(progress, 100)}%`;
  };

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("resize", updateReadingProgress);
  updateReadingProgress();
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".aside-slide"));
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-to]"));

  if (slides.length === 0 || slides.length !== dots.length) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
      dots[slideIndex].classList.toggle("is-active", isActive);
      if (isActive) {
        dots[slideIndex].setAttribute("aria-current", "true");
      } else {
        dots[slideIndex].removeAttribute("aria-current");
      }
    });
  };

  carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
  });
  carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
  });
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });
});
