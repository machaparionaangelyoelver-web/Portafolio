document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ===============================
     1) Navbar: efecto scroll
  =============================== */
  const navbar = $(".navbar");
  const onNavScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();

  /* ===============================
     2) Menú móvil (sin estilos inline)
  =============================== */
  const menuToggle = $(".menu-toggle");
  const navLinks = $(".nav-links");

  const closeMenu = () => navLinks?.classList.remove("is-open");
  const toggleMenu = () => navLinks?.classList.toggle("is-open");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMenu();
    });

    // Cerrar al hacer click en un link
    navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeMenu();
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("is-open")) return;
      const inside = e.target.closest(".navbar-content");
      if (!inside) closeMenu();
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ===============================
     3) Scroll reveal (reveal-up/left/right)
  =============================== */
  const revealEls = $$(".reveal-up, .reveal-left, .reveal-right");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((ent) => {
          if (!ent.isIntersecting) return;
          ent.target.classList.add("active");
          obs.unobserve(ent.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  /* ===============================
     4) Nav activo según sección visible
  =============================== */
  const navAnchors = $$(".nav-links a[href^='#']");
  const sections = navAnchors
    .map((a) => {
      const id = a.getAttribute("href");
      return id ? $(id) : null;
    })
    .filter(Boolean);

  if (navAnchors.length && sections.length) {
    const setActiveLink = (id) => {
      navAnchors.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    };

    const navIO = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveLink(visible.target.id);
      },
      { threshold: [0.18, 0.35, 0.6] }
    );

    sections.forEach((sec) => navIO.observe(sec));
  }

  /* ===============================
     5) Lightbox (galería)
     - Tu HTML usa onclick="openLightbox(this)"
  =============================== */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#img01");
  const captionText = $("#caption");
  const closeBtn = $(".close-lightbox");

  const openLB = (src, caption = "") => {
    if (!lightbox || !lightboxImg) return;
    lightbox.style.display = "flex";
    lightboxImg.src = src;
    if (captionText) captionText.textContent = caption;
    document.body.style.overflow = "hidden";
  };

  const closeLB = () => {
    if (!lightbox) return;
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  };

  window.openLightbox = (cardEl) => {
    const img = cardEl?.querySelector("img");
    const title = cardEl?.querySelector("h4")?.textContent?.trim() || img?.alt || "Evidencia";
    if (img?.src) openLB(img.src, title);
  };

  if (closeBtn) closeBtn.addEventListener("click", closeLB);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      // clic fuera de la imagen cierra
      if (e.target === lightbox) closeLB();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLB();
  });

  /* ===============================
     6) Ribbon infinito (duplica logos para loop suave)
  =============================== */
  const track = $(".tool-ribbon__track");
  if (track && !track.dataset.cloned) {
    const items = [...track.children];
    if (items.length) {
      items.forEach((node) => track.appendChild(node.cloneNode(true)));
      track.dataset.cloned = "1";
    }
  }

  /* ===============================
     7) Glow rotativo (cada X segundos “se ilumina”)
     - Órbita del cohete
     - Stats (PHP/MySQL/Seguridad)
     - Ribbon (logos en cinta)
  =============================== */
  const rotateGlow = (elements, intervalMs = 2200) => {
    if (!elements || !elements.length) return;
    let i = 0;

    // limpiar primero
    elements.forEach((el) => el.classList.remove("is-glow"));

    setInterval(() => {
      const prev = elements[(i - 1 + elements.length) % elements.length];
      const curr = elements[i % elements.length];

      prev?.classList.remove("is-glow");
      curr?.classList.add("is-glow");

      i++;
    }, intervalMs);
  };

  const orbitIcons = $$(".orbit-icon");
  const statBoxes = $$(".stat-box");
  const ribbonPills = $$(".tool-pill");

  // ritmos distintos para que se sienta “vivo”
  rotateGlow(orbitIcons, 1600);
  rotateGlow(statBoxes, 2600);
  rotateGlow(ribbonPills, 1200);
});
