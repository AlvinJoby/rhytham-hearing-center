const WHATSAPP_NUMBER = "918848244831";
const WHATSAPP_MESSAGE = "Hello Rhytham Hearing Centre, I would like to enquire about an appointment.";
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll(".js-whatsapp").forEach((link) => { link.href = waUrl; });

// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();

// Reveal on scroll
const revealTargets = document.querySelectorAll(".intro-grid, .section-heading, .care-card, .visit-grid, .contact-grid, .scope, .gallery-grid");
revealTargets.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("visible"));
}

// Photo lightbox
const lb = document.querySelector("#lightbox");
const lbImg = document.querySelector("#lb-img");
const lbCap = document.querySelector("#lb-cap");
function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }
document.querySelectorAll(".g-item").forEach((fig) => {
  fig.tabIndex = 0;
  fig.setAttribute("role", "button");
  const open = () => {
    const img = fig.querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.textContent = fig.querySelector("figcaption").textContent;
    lb.hidden = false; document.body.style.overflow = "hidden";
  };
  fig.addEventListener("click", open);
  fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
});
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });
