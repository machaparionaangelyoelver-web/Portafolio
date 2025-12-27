document.addEventListener("DOMContentLoaded", () => {
  setYear();
  setupHardNavFallback();
  setupNavToggle();
  setupSmoothScroll();
  setupReveal();
  setupScrollProgress();
  setupActiveNav();
  setupNavIndicator();
  setupCardGlowAndTilt();
  setupSkyCanvas();
});

function setYear(){
  const el = document.getElementById("year");
  if(!el) return;
  el.textContent = `© ${new Date().getFullYear()}`;
}

function setupHardNavFallback(){
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-hardnav]");
    if(!a) return;
    const href = a.getAttribute("href") || "";
    if(!href || /^https?:\/\//i.test(href) || a.getAttribute("target") === "_blank") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.assign(href);
  }, true);
}

function setupNavToggle(){
  const toggle = document.querySelector(".nav__toggle");
  const pill = document.getElementById("navPill");
  if(!toggle || !pill) return;

  toggle.addEventListener("click", () => {
    const open = pill.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if(!pill.classList.contains("is-open")) return;
    const inside = e.target.closest(".nav");
    if(inside) return;
    pill.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });

  pill.addEventListener("click", (e) => {
    const link = e.target.closest("a.nav__link");
    if(!link) return;
    pill.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

function setupSmoothScroll(){
  const triggers = document.querySelectorAll("[data-scroll]");
  triggers.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sel = btn.getAttribute("data-scroll");
      if(!sel) return;
      const target = document.querySelector(sel);
      if(!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if(href.length < 2) return;
      const target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });
}

function scrollToTarget(target){
  const topbar = document.querySelector(".topbar");
  const offset = (topbar?.getBoundingClientRect().height || 0) + 10;
  const y = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function setupReveal(){
  const nodes = document.querySelectorAll(".reveal, .card, .statCard, .contactCard");
  if(!nodes.length) return;

  if(!("IntersectionObserver" in window)){
    nodes.forEach(n => n.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if(!en.isIntersecting) return;
      en.target.classList.add("is-visible");
      obs.unobserve(en.target);
    });
  }, { threshold: 0.14 });

  nodes.forEach(n => io.observe(n));
}

function setupScrollProgress(){
  const bar = document.getElementById("scrollProgress");
  if(!bar) return;

  const onScroll = () => {
    const h = document.documentElement;
    const scrollTop = h.scrollTop || document.body.scrollTop;
    const scrollHeight = h.scrollHeight - h.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupActiveNav(){
  const links = Array.from(document.querySelectorAll(".nav__link[data-link]"));
  if(!links.length) return;

  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if(!sections.length) return;

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
    moveIndicator();
  };

  let last = "";
  const onScroll = () => {
    const topbar = document.querySelector(".topbar");
    const offset = (topbar?.getBoundingClientRect().height || 0) + 20;

    let current = sections[0].id;
    for(const s of sections){
      const top = s.getBoundingClientRect().top;
      if(top - offset <= 0) current = s.id;
    }
    if(current !== last){
      last = current;
      setActive(current);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function moveIndicator(){
    const pill = document.getElementById("navPill");
    const indicator = pill?.querySelector(".nav__indicator");
    const active = pill?.querySelector(".nav__link.is-active");
    if(!pill || !indicator || !active) return;

    const p = pill.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    const x = a.left - p.left;
    indicator.style.transform = `translateX(${x}px)`;
    indicator.style.width = `${a.width}px`;
  }

  function setupNavIndicator(){
    const pill = document.getElementById("navPill");
    const indicator = pill?.querySelector(".nav__indicator");
    if(!pill || !indicator) return;
    moveIndicator();
    window.addEventListener("resize", moveIndicator);
  }

  setupNavIndicator();
}

function setupNavIndicator(){
  const pill = document.getElementById("navPill");
  const indicator = pill?.querySelector(".nav__indicator");
  if(!pill || !indicator) return;

  const move = () => {
    const active = pill.querySelector(".nav__link.is-active");
    if(!active) return;
    const p = pill.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    indicator.style.transform = `translateX(${a.left - p.left}px)`;
    indicator.style.width = `${a.width}px`;
  };

  move();
  window.addEventListener("resize", move);
}

function setupCardGlowAndTilt(){
  const cards = document.querySelectorAll(".card, .statCard, .contactCard");
  if(!cards.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty("--mx", `${mx}%`);
      card.style.setProperty("--my", `${my}%`);

      if(reduce) return;

      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const rx = (-dy * 4).toFixed(2);
      const ry = (dx * 5).toFixed(2);
      card.style.setProperty("--rx", `${rx}deg`);
      card.style.setProperty("--ry", `${ry}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function setupSkyCanvas(){
  const canvas = document.getElementById("sky");
  if(!canvas) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1;

  const stars = [];
  const meteors = [];

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars.length = 0;
    const count = Math.floor((w * h) / 18000);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        a: 0.18 + Math.random() * 0.35,
        tw: 0.004 + Math.random() * 0.012
      });
    }
  }

  function spawnMeteor(){
    if(reduce) return;
    const startX = -60;
    const startY = Math.random() * (h * 0.65);
    const angle = (-18 * Math.PI) / 180;
    const speed = 16 + Math.random() * 14;
    meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 160 + Math.random() * 120,
      a: 0.85,
      life: 0
    });
  }

  let lastMeteor = 0;

  function draw(){
    ctx.clearRect(0,0,w,h);

    for(const s of stars){
      s.a += (Math.random() - 0.5) * s.tw;
      s.a = Math.max(0.06, Math.min(0.50, s.a));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }

    for(let i = meteors.length - 1; i >= 0; i--){
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life += 1;
      m.a *= 0.992;

      const tx = m.x - m.vx * (m.len / 18);
      const ty = m.y - m.vy * (m.len / 18);

      const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
      grad.addColorStop(0, `rgba(74, 222, 128, ${m.a})`);
      grad.addColorStop(0.6, `rgba(16, 185, 129, ${m.a * 0.6})`);
      grad.addColorStop(1, `rgba(255,255,255,0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      if(m.x > w + 220 || m.y > h + 220 || m.a < 0.05 || m.life > 220){
        meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();

  function tickMeteor(time){
    const gap = reduce ? 999999 : 900 + Math.random() * 1200;
    if(time - lastMeteor > gap){
      lastMeteor = time;
      spawnMeteor();
    }
    requestAnimationFrame(tickMeteor);
  }
  requestAnimationFrame(tickMeteor);
}
