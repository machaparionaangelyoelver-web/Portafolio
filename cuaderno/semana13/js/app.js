document.addEventListener("DOMContentLoaded", () => {
  // ===== Boot line =====
  const bootSteps = [
    "Inicializando entorno…",
    "Cargando interfaz React…",
    "Levantando API Laravel…",
    "Conectando MySQL…",
    "Servicios listos ✓"
  ];
  const bootEl = document.getElementById("bootText");

  // ===== Typing title =====
  const typedTitleEl = document.getElementById("typedTitle");
  const titleText = "Sistema CRUD Empleados Movistar";

  // ===== Nav underline (Apple) =====
  const pill = document.getElementById("navPill");
  const links = document.querySelectorAll(".nav__link[data-link]");
  const indicator = document.querySelector(".nav__indicator");

  // ===== Mobile nav =====
  const toggle = document.querySelector(".nav__toggle");

  // ===== Scroll progress =====
  const progress = document.getElementById("scrollProgress");

  // ===== Smooth scroll buttons =====
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-scroll");
      const el = document.querySelector(sel);
      if (!el) return;
      const topbarH = document.querySelector(".topbar")?.offsetHeight || 0;
      const y = el.getBoundingClientRect().top + window.scrollY - topbarH - 12;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  // Boot sequence
  if (bootEl) {
    let i = 0;
    const delays = [650, 720, 820, 900, 650];
    (function run() {
      bootEl.textContent = bootSteps[i];
      const d = delays[i] ?? 750;
      i++;
      if (i < bootSteps.length) setTimeout(run, d);
    })();
  }

  // Typing title
  async function typeText(el, text, speed = 30) {
    el.textContent = "";
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      await new Promise(r => setTimeout(r, speed));
    }
  }
  if (typedTitleEl) typeText(typedTitleEl, titleText, 28);

  // Underline move
  function moveIndicatorTo(link) {
    if (!pill || !indicator || !link) return;
    const pillRect = pill.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const left = linkRect.left - pillRect.left;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${left}px)`;
  }

  function setActive(link) {
    links.forEach(a => a.classList.remove("is-active"));
    link.classList.add("is-active");
    moveIndicatorTo(link);
  }

  // init underline
  const initial = document.querySelector(".nav__link.is-active") || links[0];
  if (initial) requestAnimationFrame(() => moveIndicatorTo(initial));

  // smooth nav with offset
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      setActive(link);

      const topbarH = document.querySelector(".topbar")?.offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - topbarH - 12;
      window.scrollTo({ top: y, behavior: "smooth" });

      // ✅ FIX: cerrar menú móvil correctamente (la clase va en .nav__pill)
      if (pill?.classList.contains("is-open")) {
        pill.classList.remove("is-open");
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  });

  // scroll spy (incluye Integración + Conclusiones)
  const sectionIds = ["#introduccion", "#integracion", "#evidencias", "#conclusiones", "#contacto"];
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

  const spy = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    const id = `#${visible.target.id}`;
    const navLink = document.querySelector(`.nav__link[href="${id}"]`);
    if (navLink) setActive(navLink);
  }, { threshold: [0.28, 0.45, 0.6] });

  sections.forEach(s => spy.observe(s));

  // reveal
  const revealEls = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("is-visible");
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));

  // progress bar
  function updateProgress() {
    if (!progress) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    progress.style.width = `${pct}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ✅ FIX: mobile toggle abre/cierra navPill (no .nav)
  if (toggle && pill) {
    toggle.addEventListener("click", () => {
      const open = pill.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const act = document.querySelector(".nav__link.is-active");
        if (act) moveIndicatorTo(act);
      }
    });
  }

  // reposition underline
  window.addEventListener("resize", () => {
    const act = document.querySelector(".nav__link.is-active");
    if (act) moveIndicatorTo(act);
  });

  // ===== Lightbox evidencias =====
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");

  function openLightbox(src, alt, cap){
    if (!lb || !lbImg || !lbCap) return;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    lbImg.src = src;
    lbImg.alt = alt || "Evidencia";
    lbCap.textContent = cap || "";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    if (lbImg) lbImg.src = "";
    document.body.style.overflow = "";
  }

  // click en evidencia
  document.querySelectorAll(".evCard").forEach(card => {
    const img = card.querySelector("img");
    if (!img) return;
    card.style.cursor = "zoom-in";
    card.addEventListener("click", () => {
      const cap = card.getAttribute("data-cap") || card.querySelector("figcaption p")?.textContent || "";
      openLightbox(img.currentSrc || img.src, img.alt, cap);
    });
  });

  // cerrar por backdrop o botón
  document.querySelectorAll("[data-lb-close]").forEach(el => {
    el.addEventListener("click", closeLightbox);
  });

  // cerrar con ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb?.classList.contains("is-open")) closeLightbox();
  });
});
