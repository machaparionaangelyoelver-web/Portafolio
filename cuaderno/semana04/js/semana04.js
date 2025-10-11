/* ===========================
   Semana 04 · JS principal
   =========================== */

/* --- Typing (texto animado) --- */
function typeLoop(el, lines, speed = 46, pause = 1200) {
  if (!el || !Array.isArray(lines) || !lines.length) return;
  let i = 0, j = 0, del = false;

  function tick() {
    const t = lines[i];
    if (!del) {
      el.textContent = t.slice(0, j++) + " ";
      if (j <= t.length) return setTimeout(tick, speed);
      del = true;
      return setTimeout(tick, pause);
    } else {
      el.textContent = t.slice(0, --j) + " ";
      if (j > 0) return setTimeout(tick, speed / 1.15);
      del = false;
      i = (i + 1) % lines.length;
      return setTimeout(tick, 360);
    }
  }
  tick();
}

/* --- Arranque principal --- */
document.addEventListener('DOMContentLoaded', () => {
  // Frases animadas
  typeLoop(document.getElementById('typing'), [
    "Variables • Flujo • DOM • Eventos • Async/Fetch"
  ], 44, 1100);

  typeLoop(document.getElementById('typing2'), [
    "Aprende con ejemplos claros de básico a avanzado"
  ], 38, 1300);

  /* ===== HERO: activar animaciones cuando entra en viewport ===== */
  const wrap = document.querySelector('.heroWrap.hero--lamp');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startHero = () => {
    if (!wrap || prefersReduced) return;
    wrap.classList.remove('run');       // reinicia animaciones
    void wrap.offsetWidth;              // reflow
    wrap.classList.add('run');
  };

  if (wrap) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          startHero();
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(wrap);
    if (window.scrollY < 40) startHero();
  }

  /* ===== Meteoritos aleatorios por el héroe ===== */
  const shooting = document.querySelector('.shooting');
  if (shooting && !prefersReduced) {
    const count = 28; // cantidad de meteoros
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const delay = (Math.random() * 8).toFixed(2);
      const dur = (5 + Math.random() * 5).toFixed(2);
      const top = Math.floor(Math.random() * 95);
      const left = Math.floor(55 + Math.random() * 45);
      s.style.top = `${top}%`;
      s.style.left = `${left}%`;
      s.style.animationDelay = `${delay}s`;
      s.style.animationDuration = `${dur}s`;
      shooting.appendChild(s);
    }
  }

  /* ===== Cards accesibles (temario) ===== */
  document.querySelectorAll('[data-card]').forEach(card => {
    const reveal = card.querySelector('.card__reveal');
    const id = 'reveal-' + Math.random().toString(36).slice(2);
    if (reveal) {
      reveal.id = id;
      card.setAttribute('aria-controls', id);
    }
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const opened = card.classList.toggle('open');
      card.setAttribute('aria-expanded', String(opened));
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ===== Lazy defensivo en imágenes ===== */
  document.querySelectorAll('.card__media img, .practiceMedia img').forEach(img => {
    if (!img.hasAttribute('loading')) img.loading = 'lazy';
  });
});

/* === HARD NAV: forzar navegación en enlaces “Cuaderno”
   Evita que otros listeners con preventDefault bloqueen el click. */
(function () {
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[data-hardnav], a#btnCuaderno');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    if (!href || href === '#') return;

    // Si es externo o target=_blank, no interferimos
    const isExternal = /^https?:\/\//i.test(href);
    const isBlank = a.getAttribute('target') === '_blank';
    if (isExternal || isBlank) return;

    // Forzamos la navegación interna (p.ej. ../../cuaderno.html)
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.assign(href);
  }, true); // capture: true => se ejecuta ANTES que otros handlers
})();
