/* ============================================================
   ORGANISASI WEB — SCRIPT.JS
   ============================================================ */

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // respect custom delay via CSS var
      const delay = getComputedStyle(el).getPropertyValue('--d').trim() || '0s';
      el.style.transitionDelay = delay;
      el.classList.add('visible');
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

/* ── NAVBAR SCROLL STATE ───────────────────────────────────── */
const navbar = document.getElementById('navbar');
const links  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // active link highlight
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── HAMBURGER MENU ────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── SMOOTH ANCHOR SCROLL ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── MORPH CURSOR GLOW (desktop only) ─────────────────────── */
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed', width: '340px', height: '340px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,26,.06) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: '0',
    transform: 'translate(-50%,-50%)',
    transition: 'left .12s ease, top .12s ease',
    left: '-500px', top: '-500px'
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
