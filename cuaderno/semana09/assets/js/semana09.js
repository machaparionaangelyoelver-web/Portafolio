/* ==========================================================
   Semana 09 — JS principal (sin dependencias)
   Incluye: año, progreso scroll, reveal, parallax, tilt,
   typewriter, estrellas+meteoritos, action-panels,
   Logo Drop (corregido) y Copiar comandos.
========================================================== */

"use strict";

/* Utilidades */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const prefersReduceMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Año en footer */
(() => {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* Barra de progreso en topbar */
(() => {
  const bar = $("#scrollProgress");
  if (!bar) return;

  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop || window.scrollY || 0;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    bar.style.width = pct.toFixed(2) + "%";
  };

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
})();

/* Reveal-on-scroll */
(() => {
  const els = $$("[data-reveal]");
  if (!els.length) return;

  els.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = "opacity .45s ease, transform .45s ease";
  });

  const show = (el, delay = 0) => {
    window.setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, delay);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const delay = Number(e.target.getAttribute("data-delay") || 0);
          show(e.target, delay);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el, i) => show(el, i * 60));
  }
})();

/* Parallax leve en hero */
(() => {
  const wrap = $("[data-parallax]");
  if (!wrap || prefersReduceMotion()) return;

  addEventListener(
    "mousemove",
    (e) => {
      const r = wrap.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      wrap.style.transform = `translate3d(${dx * 10}px, ${dy * 10}px, 0)`;
    },
    { passive: true }
  );
})();

/* Tilt suave */
(() => {
  const cards = $$("[data-tilt]");
  if (!cards.length || prefersReduceMotion()) return;

  cards.forEach((card) => {
    let rect = null;

    const on = (e) => {
      rect ||= card.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const rx = ((cy / rect.height) - 0.5) * -8;
      const ry = ((cx / rect.width) - 0.5) * 8;

      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      card.style.boxShadow = "0 14px 28px rgba(15,23,42,.15)";
    };

    const out = () => {
      card.style.transform = "";
      card.style.boxShadow = "";
      rect = null;
    };

    card.addEventListener("mousemove", on, { passive: true });
    card.addEventListener("mouseleave", out);
  });
})();

/* Typewriter loop (configurable por data-attributes)
   HTML recomendado:
   <span class="typewriter"
     data-typewriter='["Texto..."]'
     data-tw-speed="90"
     data-tw-delete="45"
     data-tw-pause="1400"
     data-tw-erasepause="650"></span>
*/
(() => {
  const els = $$(".typewriter");
  if (!els.length) return;

  els.forEach((el) => {
    let listRaw = el.getAttribute("data-typewriter") || "[]";
    let list;

    try {
      list = JSON.parse(listRaw);
    } catch {
      // fallback: "a|b|c"
      list = String(listRaw).replace(/^\[|\]$/g, "").split("|");
    }

    list = (Array.isArray(list) ? list : [String(list)])
      .map((s) => String(s).trim())
      .filter(Boolean);

    if (!list.length) return;

    // Reduced motion: muestra solo el 1er texto y ya
    if (prefersReduceMotion()) {
      el.textContent = list[0];
      return;
    }

    const speedWrite = parseInt(el.dataset.twSpeed || "70", 10);        // ms por letra
    const speedErase = parseInt(el.dataset.twDelete || "40", 10);       // ms por letra (borrado)
    const pause      = parseInt(el.dataset.twPause || "1400", 10);      // pausa al completar
    const erasePause = parseInt(el.dataset.twErasepause || "650", 10);  // pausa al borrar

    let i = 0;      // index texto
    let j = 0;      // index letra
    let dir = 1;    // 1 escribir, -1 borrar

    const tick = () => {
      const cur = list[i];

      if (dir > 0) {
        j++;
        el.textContent = cur.slice(0, j);

        if (j >= cur.length) {
          dir = -1;
          return setTimeout(tick, pause);
        }
        return setTimeout(tick, speedWrite);
      } else {
        j--;
        el.textContent = cur.slice(0, Math.max(0, j));

        if (j <= 0) {
          i = (i + 1) % list.length;
          dir = 1;
          return setTimeout(tick, erasePause);
        }
        return setTimeout(tick, speedErase);
      }
    };

    el.textContent = "";
    tick();
  });
})();

/* ==========================================================
   Fondo hero: Estrellas + Destellos + Meteoritos (Canvas)
========================================================== */
(() => {
  const canvas = /** @type {HTMLCanvasElement|null} */ (document.getElementById("fx-meteors"));
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let W = 0, H = 0;
  let DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let raf = 0;

  let stars = [];
  let glints = [];
  let meteors = [];

  const mouse = { x: 0, y: 0, has: false };

  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  const spawnAll = () => {
    const starCount = Math.max(40, Math.round((W * H) / 90000));
    const glintCount = Math.max(6, Math.round(starCount * 0.05));
    const meteorCount = Math.max(3, Math.round((W * H) / 180000));

    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: rand(0.6, 1.8),
      baseA: rand(0.25, 0.5),
      tw: rand(0.4, 1.2),
      z: rand(0.2, 1.0),
    }));

    glints = Array.from({ length: glintCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: rand(20, 48),
      a: rand(0.05, 0.12),
      t: rand(0, Math.PI * 2),
      s: rand(0.002, 0.006),
    }));

    meteors = Array.from({ length: meteorCount }, () => {
      const len = rand(80, 200);
      const speed = rand(0.6, 1.6);
      const size = rand(0.8, 1.8);
      const alpha = rand(0.22, 0.38);
      const angle = Math.PI / 4 + rand(-0.18, 0.18);
      return { x: Math.random() * W, y: Math.random() * H, len, speed, size, alpha, angle };
    });
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = Math.floor(r.width * DPR);
    H = Math.floor(r.height * DPR);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = r.width + "px";
    canvas.style.height = r.height + "px";
    spawnAll();
  };

  const onMove = (cx, cy) => {
    mouse.x = lerp(mouse.x, cx * DPR, 0.15);
    mouse.y = lerp(mouse.y, cy * DPR, 0.15);
    mouse.has = true;
  };

  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    onMove(e.clientX - r.left, e.clientY - r.top);
  });

  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches?.[0]) return;
      const r = canvas.getBoundingClientRect();
      onMove(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    },
    { passive: true }
  );

  const draw = (t) => {
    ctx.clearRect(0, 0, W, H);

    const px = mouse.has ? (mouse.x - W / 2) * 0.01 : 0;
    const py = mouse.has ? (mouse.y - H / 2) * 0.01 : 0;

    // Estrellas
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const s of stars) {
      const tw = Math.sin((t * 0.003 + s.tw) * Math.PI) * 0.5 + 0.5;
      const a = clamp(s.baseA * (0.6 + tw * 0.8), 0, 1);
      const x = s.x + px * s.z;
      const y = s.y + py * s.z;

      const g = ctx.createRadialGradient(x, y, 0, x, y, s.r * 3);
      g.addColorStop(0, `rgba(180,195,255,${a})`);
      g.addColorStop(1, `rgba(180,195,255,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = a;
      ctx.fillStyle = "#cfe1ff";
      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // Destellos
    ctx.save();
    for (const g of glints) {
      g.t += g.s;
      const pulse = Math.sin(g.t) * 0.5 + 0.5;
      const a = g.a * (0.5 + pulse * 0.6);
      const x = g.x + px * 0.4;
      const y = g.y + py * 0.4;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, g.r);
      grad.addColorStop(0, `rgba(169,196,255,${a})`);
      grad.addColorStop(1, `rgba(169,196,255,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, g.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Meteoritos
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const m of meteors) {
      m.x += Math.cos(m.angle) * m.speed * 2.0;
      m.y += Math.sin(m.angle) * m.speed * 2.0;

      if (m.x > W + 60 || m.y > H + 60) {
        m.x = -60 - Math.random() * W * 0.2;
        m.y = Math.random() * H * 0.7;
      }

      const ex = m.x - Math.cos(m.angle) * m.len;
      const ey = m.y - Math.sin(m.angle) * m.len;

      const grad = ctx.createLinearGradient(ex, ey, m.x, m.y);
      grad.addColorStop(0, "rgba(159,182,255,0)");
      grad.addColorStop(1, `rgba(159,182,255,${m.alpha})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.size;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      ctx.fillStyle = `rgba(173,197,255,${m.alpha})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    raf = requestAnimationFrame(draw);
  };

  const start = () => {
    resize();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  };
  const stop = () => cancelAnimationFrame(raf);

  const init = () => (prefersReduceMotion() ? stop() : start());
  init();

  let rto;
  addEventListener(
    "resize",
    () => {
      clearTimeout(rto);
      rto = setTimeout(() => {
        if (!prefersReduceMotion()) resize();
      }, 120);
    },
    { passive: true }
  );

  const mql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  if (mql) {
    if (mql.addEventListener) mql.addEventListener("change", init);
    else if (mql.addListener) mql.addListener(init);
  }
})();

/* Action-cards: mostrar/ocultar panel */
(() => {
  const cards = $$(".action-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const btn = card.querySelector('[data-action="toggle"]');
    const panel = card.querySelector(".action-panel");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const open = card.getAttribute("data-open") === "true";
      card.setAttribute("data-open", open ? "false" : "true");
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.setAttribute("aria-hidden", open ? "true" : "false");
    });

    // estado inicial accesible
    btn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  });
})();

/* ==========================================================
   Logo Drop (Java, Maven, Tomcat) — CORREGIDO
   - Coordenadas calculadas RELATIVAS al contenedor .logo-drop
   - No usa window.scrollX/Y (evita desajustes)
   - Funciona si .logo-drop es position: relative y .logo-fly absolute
========================================================== */
(() => {
  const section = document.querySelector("#stack, #logos"); // por si cambiaste el id
  if (!section) return;

  const stage = section.querySelector(".logo-drop");
  const dockJava = section.querySelector("#dock-java");
  const dockMaven = section.querySelector("#dock-maven");
  const dockTom = section.querySelector("#dock-tomcat");

  const flyers = {
    java: section.querySelector('[data-drop-logo="java"]'),
    maven: section.querySelector('[data-drop-logo="maven"]'),
    tomcat: section.querySelector('[data-drop-logo="tomcat"]'),
  };

  if (!stage || !dockJava || !dockMaven || !dockTom || !flyers.java || !flyers.maven || !flyers.tomcat) return;

  const rand = (a, b) => a + Math.random() * (b - a);

  const waitImages = async () => {
    const imgs = Object.values(flyers);
    await Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            })
      )
    );
  };

  const centerRel = (el) => {
    const r = el.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return {
      x: r.left - s.left + r.width / 2,
      y: r.top - s.top + r.height / 2,
    };
  };

  const getLogoSize = (img) => {
    const r = img.getBoundingClientRect();
    return { w: r.width || img.width || 84, h: r.height || img.height || 84 };
  };

  const seedStart = () => {
    const sr = stage.getBoundingClientRect();
    const pad = 44;

    Object.values(flyers).forEach((img) => {
      const { w, h } = getLogoSize(img);

      // Asegura posicionamiento consistente
      img.style.position = "absolute";
      img.style.left = "0";
      img.style.top = "0";
      img.style.willChange = "transform, opacity";

      const x = rand(pad, Math.max(pad, sr.width - pad));
      const y = -rand(110, 200); // arriba del contenedor

      img.style.opacity = "0";
      img.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px)`;
    });
  };

  const placeNoMotion = () => {
    const targets = {
      java: centerRel(dockJava),
      maven: centerRel(dockMaven),
      tomcat: centerRel(dockTom),
    };

    Object.entries(flyers).forEach(([k, img]) => {
      const { w, h } = getLogoSize(img);
      img.style.position = "absolute";
      img.style.left = "0";
      img.style.top = "0";
      img.style.opacity = "1";
      img.style.transform = `translate(${targets[k].x - w / 2}px, ${targets[k].y - h / 2}px)`;
    });
  };

  const animateIn = () => {
    const targets = {
      java: centerRel(dockJava),
      maven: centerRel(dockMaven),
      tomcat: centerRel(dockTom),
    };

    const parseTranslate = (tr) => {
      const m = String(tr || "").match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
      return { x: parseFloat(m?.[1] || "0"), y: parseFloat(m?.[2] || "0") };
    };

    const timingBase = {
      duration: 1350,
      easing: "cubic-bezier(.22,.9,.22,1)",
      fill: "forwards",
    };

    const order = ["java", "maven", "tomcat"];

    order.forEach((name, idx) => {
      const img = flyers[name];
      const { w, h } = getLogoSize(img);

      const from = parseTranslate(img.style.transform);
      const toX = targets[name].x - w / 2;
      const toY = targets[name].y - h / 2;

      img.animate(
        [
          { transform: `translate(${from.x}px, ${from.y}px) scale(1)`, opacity: 0 },
          { transform: `translate(${toX}px, ${toY - 18}px) scale(1.06)`, opacity: 1, offset: 0.78 },
          { transform: `translate(${toX}px, ${toY}px) scale(1)`, opacity: 1 },
        ],
        { ...timingBase, delay: idx * 220 }
      );
    });

    // por si algún navegador no “fija” opacity al final
    setTimeout(() => {
      Object.entries(flyers).forEach(([k, img]) => {
        const { w, h } = getLogoSize(img);
        img.style.opacity = "1";
        img.style.transform = `translate(${targets[k].x - w / 2}px, ${targets[k].y - h / 2}px)`;
      });
    }, 220 * 2 + timingBase.duration + 80);
  };

  let alreadyRan = false;

  const run = async () => {
    if (alreadyRan) return;
    alreadyRan = true;

    await waitImages();
    if (prefersReduceMotion()) return placeNoMotion();

    seedStart();
    animateIn();
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          run();
          io.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    io.observe(section);
  } else {
    run();
  }

  addEventListener(
    "resize",
    () => {
      // Si reduce motion, reubica. Si ya corrió la animación, también reubica a los docks.
      if (prefersReduceMotion() || alreadyRan) placeNoMotion();
    },
    { passive: true }
  );

  const mql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  if (mql) {
    const onChange = () => placeNoMotion();
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else if (mql.addListener) mql.addListener(onChange);
  }
})();

/* Copiar bloques de comandos (.cmd [data-copy]) */
(() => {
  const btns = $$("[data-copy]");
  if (!btns.length) return;

  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch {
      // fallback simple
      try {
        const ta = document.createElement("textarea");
        ta.value = txt;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  };

  btns.forEach((b) => {
    b.addEventListener("click", async () => {
      const pre = b.parentElement?.querySelector("pre");
      const code = pre?.innerText ?? "";
      if (!code) return;

      const ok = await copy(code);
      const old = b.textContent;

      b.textContent = ok ? "Copiado ✓" : "Error";
      if (ok) b.classList.add("btn--primary");

      setTimeout(() => {
        b.textContent = old;
        b.classList.remove("btn--primary");
      }, 1300);
    });
  });
})();
