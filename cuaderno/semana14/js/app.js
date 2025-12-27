document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initReveal();
  initSmoothScroll();
  initMobileMenu();
  initScrollProgress();
  initActiveNavAndIndicator();
  initScrollCue();
  initBootText();
});

function initYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;
  yearSpan.textContent = String(new Date().getFullYear());
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((el) => io.observe(el));
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[data-scroll], a[href^="#"], button[data-scroll]');
  if (!links.length) return;

  links.forEach((el) => {
    el.addEventListener("click", (e) => {
      const selector = el.getAttribute("data-scroll") || el.getAttribute("href") || "";
      if (!selector.startsWith("#")) return;

      const target = document.querySelector(selector);
      if (!target) return;

      e.preventDefault();

      const topbar = document.querySelector(".topbar");
      const topH = topbar ? Math.round(topbar.getBoundingClientRect().height) : 0;
      const offset = topH + 10;

      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });

      if (history.pushState) history.pushState(null, "", selector);
    });
  });
}

function initMobileMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const pill = document.getElementById("navPill");
  if (!toggle || !pill) return;

  const setExpanded = (val) => {
    toggle.setAttribute("aria-expanded", String(val));
    pill.classList.toggle("is-open", val);
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded);
  });

  pill.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-link]");
    if (!a) return;
    setExpanded(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setExpanded(false);
  });
}

function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initActiveNavAndIndicator() {
  const pill = document.getElementById("navPill");
  if (!pill) return;

  const links = Array.from(pill.querySelectorAll("a[data-link]"));
  const indicator = pill.querySelector(".nav__indicator");

  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const setIndicatorTo = (link) => {
    if (!indicator || !link) return;
    const pillRect = pill.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const left = linkRect.left - pillRect.left;
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${left}px)`;
  };

  const setActive = (id) => {
    const activeLink = links.find((l) => l.getAttribute("href") === `#${id}`);
    if (!activeLink) return;
    links.forEach((l) => l.classList.toggle("is-active", l === activeLink));
    setIndicatorTo(activeLink);
  };

  const firstActive = pill.querySelector(".nav__link.is-active") || links[0];
  if (firstActive) setIndicatorTo(firstActive);

  if (!("IntersectionObserver" in window) || !sections.length) {
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY + 220;
        let current = sections[0]?.id;
        sections.forEach((sec) => {
          if (sec.offsetTop <= y) current = sec.id;
        });
        if (current) setActive(current);
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      const active = pill.querySelector(".nav__link.is-active") || links[0];
      setIndicatorTo(active);
    });

    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((s) => io.observe(s));

  window.addEventListener("resize", () => {
    const active = pill.querySelector(".nav__link.is-active") || links[0];
    setIndicatorTo(active);
  });

  links.forEach((l) => {
    l.addEventListener("click", () => setIndicatorTo(l));
  });
}

function initScrollCue() {
  const cue = document.querySelector(".scrollCue");
  if (!cue) return;

  cue.addEventListener("click", () => {
    const selector = cue.getAttribute("data-scroll") || "#introduccion";
    const target = document.querySelector(selector);
    if (!target) return;

    const topbar = document.querySelector(".topbar");
    const topH = topbar ? Math.round(topbar.getBoundingClientRect().height) : 0;

    const y = target.getBoundingClientRect().top + window.scrollY - (topH + 10);
    window.scrollTo({ top: y, behavior: "smooth" });
  });
}

function initBootText() {
  const el = document.getElementById("bootText");
  if (!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const steps = [
    "Verificando Apache y puertos…",
    "Cargando mod_wsgi y WSGI…",
    "Activando entorno Python y dependencias…",
    "Conectando Flask con MySQL…",
    "Listo para ejecutar la práctica",
  ];

  let i = 0;
  el.textContent = steps[i];

  const tick = () => {
    i = Math.min(i + 1, steps.length - 1);
    el.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-2px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 850, easing: "ease-in-out" }
    );
    el.textContent = steps[i];
  };

  const interval = setInterval(() => {
    tick();
    if (i === steps.length - 1) clearInterval(interval);
  }, 2300);
}
