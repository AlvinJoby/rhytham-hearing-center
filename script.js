const WHATSAPP_NUMBER = "918848244831";
const WHATSAPP_MESSAGE = "Hello Rhytham Hearing Centre, I would like to enquire about an appointment.";
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// Optional: to receive form submissions by email instead of WhatsApp, paste a Formspree
// (or similar) endpoint here, e.g. "https://formspree.io/f/xxxxxxxx". Leave empty to use WhatsApp.
const FORM_ENDPOINT = "";

// Start filling the offline cache while the branded loading screen is visible.
// The timeout prevents a slow or unsupported browser from holding the page open.
let offlineCacheReady = Promise.resolve();
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  const cacheTimeout = new Promise((resolve) => window.setTimeout(resolve, 3200));
  offlineCacheReady = Promise.race([
    navigator.serviceWorker.register("./service-worker.js").then(() => navigator.serviceWorker.ready),
    cacheTimeout
  ]).catch((error) => {
    console.warn("Offline caching could not be enabled:", error);
  });
}

// The short minimum makes the brand animation feel intentional without imposing a fixed wait.
const siteLoader = document.querySelector("#site-loader");
if (siteLoader) {
  const loaderStartedAt = performance.now();
  const dismissLoader = async () => {
    const minDisplay = new Promise((resolve) => {
      window.setTimeout(resolve, Math.max(0, 650 - (performance.now() - loaderStartedAt)));
    });
    await Promise.all([minDisplay, offlineCacheReady]);
    siteLoader.classList.add("is-hidden");
    window.setTimeout(() => siteLoader.remove(), 500);
  };
  if (document.readyState === "complete") dismissLoader();
  else window.addEventListener("load", dismissLoader, { once: true });
}

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
  document.addEventListener("pointerdown", (event) => {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setOpen(false);
  }, { passive: true });
}

document.querySelector("#year").textContent = new Date().getFullYear();

// Sound-wave bars in the photo frame
document.querySelectorAll(".frame-wave").forEach((el) => {
  const count = Number(el.dataset.bars) || 9;
  const heights = [34, 58, 82, 50, 100, 62, 86, 44, 30];
  for (let i = 0; i < count; i++) {
    const bar = document.createElement("i");
    bar.style.setProperty("--h", `${heights[i % heights.length]}%`);
    bar.style.setProperty("--d", `${(-i * 0.27).toFixed(2)}s`);
    el.appendChild(bar);
  }
});

// Opening hours: highlight today and show an Open / Closed badge (Indian Standard Time)
(function hours() {
  const list = document.querySelector("#hours");
  const badge = document.querySelector("#open-badge");
  if (!list) return;
  const updateHours = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
    }).formatToParts(new Date());
    const get = (type) => parts.find((part) => part.type === type).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    const mins = (Number(get("hour")) % 24) * 60 + Number(get("minute"));

    list.querySelectorAll("[data-day]").forEach((row) => row.classList.toggle("today", Number(row.dataset.day) === day));
    const isOpen = day !== 0 && mins >= 9 * 60 && mins < 18 * 60;
    if (badge) {
      badge.hidden = false;
      badge.textContent = isOpen ? "Open now" : "Closed now";
      badge.classList.toggle("is-open", isOpen);
      badge.classList.toggle("is-closed", !isOpen);
    }
  };

  updateHours();
  // Keep the live status accurate if a visitor leaves the page open across a closing time.
  window.setInterval(updateHours, 60_000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateHours();
  });
})();

// Reveal on scroll
const revealTargets = document.querySelectorAll(".intro-grid, .section-heading, .service-card, .gallery-grid, .steps li, .contact-grid");
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

// Contact form
(function contactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const done = document.querySelector("#form-done");
  const note = document.querySelector("#form-note");
  const dateInput = form.elements.date;

  // Earliest selectable day is today; Sundays are not available.
  const t = new Date();
  dateInput.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;

  const setError = (input, msg) => {
    const field = input.closest(".field");
    field.classList.toggle("invalid", Boolean(msg));
    const err = field.querySelector(".err");
    if (err) err.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  const validators = {
    name: (v) => (v.trim().length < 2 ? "Please tell us your name." : ""),
    phone: (v) => (v.replace(/\D/g, "").length < 10 ? "Please enter a valid phone number." : ""),
    email: (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "That email doesn’t look right." : ""),
    date: (v) => {
      if (!v) return "";
      const d = new Date(v + "T00:00:00");
      return d.getDay() === 0 ? "We are closed on Sundays. Please pick Monday to Saturday." : "";
    }
  };

  const validate = (input) => {
    const fn = validators[input.name];
    if (!fn) return true;
    const msg = fn(input.value);
    setError(input, msg);
    return !msg;
  };

  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("blur", () => validate(input));
    input.addEventListener("input", () => { if (input.closest(".field").classList.contains("invalid")) validate(input); });
    input.addEventListener("change", () => validate(input));
  });

  const buildMessage = (data) => {
    const lines = [
      "Hello Rhytham Hearing Centre,",
      "",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
    ];
    if (data.email) lines.push(`Email: ${data.email}`);
    lines.push(`Interested in: ${data.service}`);
    if (data.date) {
      const nice = new Date(data.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      lines.push(`Preferred day: ${nice}`);
    }
    if (data.message.trim()) lines.push("", data.message.trim());
    return lines.join("\n");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("input, select")];
    const results = inputs.map(validate);
    if (results.includes(false)) {
      form.querySelector(".invalid input, .invalid select").focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector("button[type=submit]");

    if (FORM_ENDPOINT) {
      btn.disabled = true;
      btn.firstChild.textContent = "Sending… ";
      try {
        const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error("bad response");
        form.hidden = true; done.hidden = false;
      } catch (err) {
        note.textContent = "Sorry, that didn’t send. Please try again or call us on 88482 44831.";
      } finally {
        btn.disabled = false;
        btn.firstChild.textContent = "Send message ";
      }
      return;
    }

    // No backend configured: open WhatsApp with the details filled in.
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(data))}`;
    window.open(url, "_blank", "noopener");
    form.hidden = true;
    done.hidden = false;
    done.querySelector("p").textContent = "Your message is ready in WhatsApp. Just press send and we will call you back to confirm a time.";
  });

  document.querySelector("#form-reset").addEventListener("click", () => {
    form.reset();
    form.querySelectorAll(".field").forEach((f) => { f.classList.remove("invalid"); const er = f.querySelector(".err"); if (er) er.textContent = ""; });
    done.hidden = true; form.hidden = false;
  });
})();

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
