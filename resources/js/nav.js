document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const hamburger = header.querySelector(".header__hamburger");
  const nav = header.querySelector(".header__nav");
  const overlay = header.querySelector(".header__overlay");
  const navItems = nav.querySelectorAll(".header__nav-item");

  let savedScrollY = 0;

  function lockBody() {
    // 1. Calculate how wide the scrollbar is right now
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    savedScrollY = window.scrollY || window.pageYOffset;

    // 2. Add that width as padding so content doesn't jump
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // 3. Lock the body
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockBody() {
    const top = document.body.style.top;

    // 1. Remove the artificial padding
    document.body.style.paddingRight = "";

    // 2. Unlock the body
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    // 3. Restore scroll position
    const y = top ? Math.abs(parseInt(top, 10)) : 0;
    window.scrollTo(0, y);
  }

  function toggleMenu(open) {
    const isOpen = open ?? !header.classList.contains("is-open");

    header.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen) lockBody();
    else unlockBody();
  }

  // Event Listeners
  hamburger.addEventListener("click", () => toggleMenu());
  overlay.addEventListener("click", () => toggleMenu(false));
  navItems.forEach((item) => item.addEventListener("click", () => toggleMenu(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMenu(false);
    }
  });
});
