document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initMobileNav();
  initSmoothScroll();
  initScrollProgress();
  initReveal();
  initNavIndicator();
  initCardTilt();
  initMeteorShower();

  setActiveLink(); // estado inicial
  window.addEventListener("scroll", () => {
    setActiveLink();
  }, { passive: true });
});

/* ===== Footer year ===== */
function initYear(){
  const el = document.getElementById("year");
  if (!el) return;
  el.textContent = `© ${new Date().getFullYear()} · Angel Yoelver Macha Pariona`;
}

/* ===== Mobile nav ===== */
function initMobileNav(){
  const toggle = document.querySelector(".nav__toggle");
  const pill = document.getElementById("navPill");
  if (!toggle || !pill) return;

  toggle.addEventListener("click", () => {
    const open = pill.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!pill.classList.contains("is-open")) return;
    const inside = e.target.closest(".nav");
    if (!inside) {
      pill.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  pill.querySelectorAll("a[data-link]").forEach(a => {
    a.addEventListener("click", () => {
      pill.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ===== Smooth scroll (anchors + scrollCue) ===== */
function initSmoothScroll(){
  const links = document.querySelectorAll("[data-scroll], .nav__pill a, .scrollCue");
  links.forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetSel =
        el.getAttribute("data-scroll") ||
        (el.tagName.toLowerCase() === "a" ? el.getAttribute("href") : null);

      if (!targetSel || !targetSel.startsWith("#")) return;
      const target = document.querySelector(targetSel);
      if (!target) return;

      e.preventDefault();

      const topbar = document.querySelector(".topbar");
      const topH = topbar ? topbar.getBoundingClientRect().height : 0;

      const y = target.getBoundingClientRect().top + window.scrollY - (topH + 10);

      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
}

/* ===== Top progress bar ===== */
function initScrollProgress(){
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const val = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, val))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* ===== Reveal on scroll ===== */
function initReveal(){
  const nodes = document.querySelectorAll(".reveal, .card, .evRow, .contactCard, .statCard");
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(n => n.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((en, idx) => {
      if (!en.isIntersecting) return;

      const el = en.target;
      if (!el.style.getPropertyValue("--delay")) {
        el.style.setProperty("--delay", `${Math.min(260, idx * 55)}ms`);
      }
      el.classList.add("is-visible");
      obs.unobserve(el);
    });
  }, { threshold: 0.14 });

  nodes.forEach(n => io.observe(n));
}

/* ===== Active link + indicator ===== */
function initNavIndicator(){
  const pill = document.getElementById("navPill");
  const indicator = pill ? pill.querySelector(".nav__indicator") : null;
  if (!pill || !indicator) return;

  const move = () => {
    const active = pill.querySelector(".nav__link.is-active");
    if (!active) return;

    const rP = pill.getBoundingClientRect();
    const rA = active.getBoundingClientRect();

    const left = rA.left - rP.left;
    const width = rA.width;

    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left}px)`;
  };

  window.addEventListener("resize", move);
  window.addEventListener("scroll", move, { passive: true });

  pill.querySelectorAll(".nav__link").forEach(a => {
    a.addEventListener("mouseenter", () => {
      if (window.matchMedia("(max-width: 980px)").matches) return;
      pill.querySelectorAll(".nav__link").forEach(x => x.classList.remove("is-hover"));
      a.classList.add("is-hover");

      const rP = pill.getBoundingClientRect();
      const rA = a.getBoundingClientRect();
      indicator.style.width = `${rA.width}px`;
      indicator.style.transform = `translateX(${rA.left - rP.left}px)`;
    });
  });

  pill.addEventListener("mouseleave", move);

  move();
}

/* ===== Set active link by section in view ===== */
function setActiveLink(){
  const links = Array.from(document.querySelectorAll(".nav__pill a[data-link]"));
  if (!links.length) return;

  const topbar = document.querySelector(".topbar");
  const topH = topbar ? topbar.getBoundingClientRect().height : 0;

  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const y = window.scrollY + topH + 120;

  let current = sections[0]?.id || null;
  for (const sec of sections) {
    if (sec.offsetTop <= y) current = sec.id;
  }

  links.forEach(a => {
    const on = a.getAttribute("href") === `#${current}`;
    a.classList.toggle("is-active", on);
  });

  const pill = document.getElementById("navPill");
  const indicator = pill ? pill.querySelector(".nav__indicator") : null;
  if (pill && indicator && !window.matchMedia("(max-width: 980px)").matches) {
    const active = pill.querySelector(".nav__link.is-active");
    if (active) {
      const rP = pill.getBoundingClientRect();
      const rA = active.getBoundingClientRect();
      indicator.style.width = `${rA.width}px`;
      indicator.style.transform = `translateX(${rA.left - rP.left}px)`;
    }
  }
}

/* ===== Subtle 3D tilt (cards + evidence rows + contact cards) ===== */
function initCardTilt(){
  const items = document.querySelectorAll(".card, .evRow, .contactCard, .statCard");
  if (!items.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  items.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const px = (x / r.width) * 100;
      const py = (y / r.height) * 100;

      const ry = ((px - 50) / 50) * 6;
      const rx = ((50 - py) / 50) * 6;

      el.style.setProperty("--mx", `${px}%`);
      el.style.setProperty("--my", `${py}%`);
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--ty", `0px`);
      el.style.setProperty("--scale", `1`);
    });

    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
      el.style.setProperty("--mx", `50%`);
      el.style.setProperty("--my", `50%`);
    });
  });
}

/* ===== Meteor shower background ===== */
function initMeteorShower(){
  const layer = document.getElementById("meteorLayer");
  if (!layer) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const makeMeteor = () => {
    const m = document.createElement("div");
    m.className = "meteor";

    const y0 = Math.random() * 40 - 10;
    const y1 = y0 + (Math.random() * 60 + 20);

    m.style.setProperty("--x0", `${-(Math.random() * 30 + 10)}vw`);
    m.style.setProperty("--y0", `${y0}vh`);
    m.style.setProperty("--x1", `${(Math.random() * 40 + 110)}vw`);
    m.style.setProperty("--y1", `${y1}vh`);

    m.style.setProperty("--dur", `${(Math.random() * 1.6 + 2.2).toFixed(2)}s`);
    m.style.setProperty("--delay", `${(Math.random() * 2.6).toFixed(2)}s`);

    layer.appendChild(m);

    const ttl = 7000;
    setTimeout(() => {
      if (m && m.parentNode) m.parentNode.removeChild(m);
    }, ttl);
  };

  for (let i = 0; i < 10; i++) makeMeteor();

  setInterval(() => {
    const count = Math.random() < 0.55 ? 1 : 2;
    for (let i = 0; i < count; i++) makeMeteor();
  }, 900);
}
