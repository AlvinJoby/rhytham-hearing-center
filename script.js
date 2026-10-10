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

// Clarity slider: blur + fade text, softly
const range = document.querySelector("#clarity-range");
const blurText = document.querySelector("#blur-text");
function applyClarity() {
  const v = Number(range.value);
  const blur = (1 - v / 100) * 5.5;
  blurText.style.filter = `blur(${blur.toFixed(2)}px)`;
  blurText.style.opacity = (0.45 + (v / 100) * 0.55).toFixed(2);
  range.style.setProperty("--fill", v + "%");
}
if (range && blurText) {
  range.addEventListener("input", applyClarity);
  applyClarity();
}

// Gentle questions
const chips = document.querySelectorAll(".q-chip");
const qResult = document.querySelector("#q-result");
function updateChips() {
  const n = document.querySelectorAll(".q-chip.on").length;
  if (n === 0) qResult.textContent = "Tap any that sound like you.";
  else if (n === 1) qResult.textContent = "You're not alone.";
  else qResult.textContent = "Worth a conversation.";
}
chips.forEach((chip) => chip.addEventListener("click", () => {
  const on = chip.classList.toggle("on");
  chip.setAttribute("aria-pressed", String(on));
  updateChips();
}));

// Equalizer bar timing
document.querySelectorAll(".eq i").forEach((bar, i) => {
  bar.style.animationDelay = (-(i * 0.17) % 1.6).toFixed(2) + "s";
  bar.style.animationDuration = (0.9 + ((i * 37) % 9) / 10).toFixed(2) + "s";
});

// Reveal on scroll
const revealTargets = document.querySelectorAll(".intro-grid, .section-heading, .care-card, .visit-grid, .contact-grid, .sounds-grid, .questions, .scope, .gallery-grid");
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
