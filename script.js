const WHATSAPP_NUMBER = "918848244831";
const WHATSAPP_MESSAGE = "Hello Rhytham Hearing Centre, I would like to enquire about an appointment.";
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.querySelectorAll(".js-whatsapp").forEach((link) => { link.href = waUrl; });

// Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
if (menuToggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };
  menuToggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  // Close the menu when tapping elsewhere or pressing Escape.
  document.addEventListener("pointerdown", (event) => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  // If the viewport returns to desktop sizing, never leave the mobile menu open.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setOpen(false);
  }, { passive: true });
}

document.querySelector("#year").textContent = new Date().getFullYear();

// Sound-wave band: bars follow a soft, layered curve, echoing the dotted pattern on the door glass
document.querySelectorAll(".wave").forEach((el) => {
  const count = Number(el.dataset.bars) || 60;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const h = 0.22 + 0.78 * Math.abs(Math.sin(t * Math.PI * 3.2) * 0.6 + Math.sin(t * Math.PI * 9 + 1) * 0.4);
    const bar = document.createElement("i");
    bar.style.setProperty("--h", `${Math.round(h * 100)}%`);
    bar.style.setProperty("--d", `${(-(i % 14) * 0.2).toFixed(2)}s`);
    frag.appendChild(bar);
  }
  el.appendChild(frag);
});

// Reveal on scroll
const revealTargets = document.querySelectorAll(".intro-grid, .section-heading, .care-card, .scope, .gallery-grid, .steps li, .visit-cta, .contact-grid");
revealTargets.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
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
