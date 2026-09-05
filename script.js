// ============================================================
// Srinivas Bandi — Portfolio interactions
// 1) Dark / light theme toggle (persisted, respects system default)
// 2) One orchestrated background: a sparse node/graph field
// 3) Scrollspy for the index rail / mobile nav
// 4) Metric bars fill in once when their card scrolls into view
// ============================================================

// -------------------- theme toggle --------------------
(function theme(){
  const root = document.documentElement;
  const STORAGE_KEY = 'srinivas-portfolio-theme';
  const buttons = [...document.querySelectorAll('[data-theme-choice]')];

  const apply = (mode) => {
    root.setAttribute('data-theme', mode);
    buttons.forEach(b => {
      const isActive = b.dataset.themeChoice === mode;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
  };

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

  const prefersLight = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;

  apply(saved || (prefersLight ? 'light' : 'dark'));

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.themeChoice;
      apply(mode);
      try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* ignore */ }
    });
  });
})();

(function buildNodeGrid(){
  const svg = document.getElementById('bgGrid');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const w = window.innerWidth, h = window.innerHeight;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');

  const cols = Math.max(6, Math.round(w / 140));
  const rows = Math.max(6, Math.round(h / 140));
  const points = [];

  for (let r = 0; r <= rows; r++){
    for (let c = 0; c <= cols; c++){
      const jitterX = (Math.random() - 0.5) * 60;
      const jitterY = (Math.random() - 0.5) * 60;
      points.push({
        x: (c / cols) * w + jitterX,
        y: (r / rows) * h + jitterY
      });
    }
  }

  const frag = document.createDocumentFragment();
  const lineGroup = document.createElementNS(NS, 'g');
  lineGroup.setAttribute('stroke', '#1c2a30');
  lineGroup.setAttribute('stroke-width', '1');

  // connect each point to its nearest right/below neighbour sparsely
  points.forEach((p, i) => {
    if (Math.random() > 0.35) return;
    const candidates = points.filter(q => q !== p &&
      Math.hypot(q.x - p.x, q.y - p.y) < 170);
    if (!candidates.length) return;
    const q = candidates[Math.floor(Math.random() * candidates.length)];
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', p.x); line.setAttribute('y1', p.y);
    line.setAttribute('x2', q.x); line.setAttribute('y2', q.y);
    lineGroup.appendChild(line);
  });
  frag.appendChild(lineGroup);

  const dotGroup = document.createElementNS(NS, 'g');
  points.forEach(p => {
    if (Math.random() > 0.5) return;
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
    c.setAttribute('r', Math.random() > 0.85 ? 2 : 1.2);
    c.setAttribute('fill', Math.random() > 0.9 ? '#ffb454' : '#2a3a41');
    dotGroup.appendChild(c);
  });
  frag.appendChild(dotGroup);

  svg.appendChild(frag);
})();

// -------------------- scrollspy --------------------
(function scrollspy(){
  const sections = [...document.querySelectorAll('main section[id]')];
  const railLinks = [...document.querySelectorAll('#railNav a')];
  const mobileLinks = [...document.querySelectorAll('#mobileNav a')];

  if (!sections.length) return;

  const setActive = (id) => {
    [...railLinks, ...mobileLinks].forEach(a => {
      a.classList.toggle('active', a.dataset.sec === id);
    });
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => io.observe(sec));
})();

// -------------------- metric bar reveal --------------------
(function metricReveal(){
  const metrics = [...document.querySelectorAll('.metric[data-pct]')];
  if (!metrics.length) return;

  metrics.forEach(m => {
    m.style.setProperty('--pct', m.dataset.pct + '%');
  });

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  metrics.forEach(m => io.observe(m));
})();
