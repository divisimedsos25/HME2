/* ═══════════════════════════════════════════════
   script.js — OrganisasiKu
   Modern Elegant | Orange × Black × White
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────── */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  const cursorRing  = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateCursor() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    cursorRing.style.left  = (trailX - 18) + 'px';
    cursorRing.style.top   = (trailY - 18) + 'px';
    requestAnimationFrame(animateCursor);
  })();

  const hoverTargets = document.querySelectorAll(
    'a, button, .doc-card, .vm-card, .nilai-item, .doc-btn, .btn-primary, .btn-ghost'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hov');
      cursorRing.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hov');
      cursorRing.classList.remove('hov');
    });
  });

  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('click'));

  document.addEventListener('mouseleave', () => {
    [cursor, cursorTrail, cursorRing].forEach(el => el.style.opacity = '0');
  });
  document.addEventListener('mouseenter', () => {
    [cursor, cursorTrail, cursorRing].forEach(el => el.style.opacity = '1');
  });


  /* ─────────────────────────────────────────
     2. NAVBAR — scroll shrink + active link
  ───────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    parallaxBgText();
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─────────────────────────────────────────
     3. SMOOTH SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ─────────────────────────────────────────
     4. MORPH REVEAL — Intersection Observer
  ───────────────────────────────────────── */
  const morphObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        morphObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-morph]').forEach(el => morphObserver.observe(el));


  /* ─────────────────────────────────────────
     5. PARALLAX — hero background text
  ───────────────────────────────────────── */
  const bgText = document.querySelector('.hero-bg-text');

  function parallaxBgText() {
    if (bgText) bgText.style.transform = `translateY(${window.scrollY * 0.28}px)`;
  }


  /* ─────────────────────────────────────────
     6. HERO RINGS — mouse tilt parallax
  ───────────────────────────────────────── */
  const rings = document.querySelectorAll('.hero-ring');

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    rings.forEach((ring, i) => {
      const factor = (i + 1) * 5;
      ring.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });


  /* ─────────────────────────────────────────
     7. CARD TILT — 3D hover on cards
  ───────────────────────────────────────── */
  document.querySelectorAll('.doc-card, .vm-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);

      card.style.transform  = `translateY(-6px) perspective(800px) rotateX(${dy * -5}deg) rotateY(${dx * 5}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });


  /* ─────────────────────────────────────────
     8. RIPPLE EFFECT — buttons
  ───────────────────────────────────────── */
  document.querySelectorAll('.doc-btn, .btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top  = (e.clientY - rect.top)  + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });


  /* ─────────────────────────────────────────
     9. FLOATING PARTICLES — hero section
  ───────────────────────────────────────── */
  const hero = document.querySelector('.hero');
  if (hero) {
    for (let i = 0; i < 20; i++) {
      const p    = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:  ${size}px;
        height: ${size}px;
        left:   ${Math.random() * 100}%;
        top:    ${Math.random() * 100}%;
        animation-duration:  ${Math.random() * 14 + 8}s;
        animation-delay:     ${Math.random() * 8}s;
        background: ${i % 3 === 0 ? 'rgba(255,106,0,0.55)' : 'rgba(255,255,255,0.2)'};
      `;
      hero.appendChild(p);
    }
  }


  /* ─────────────────────────────────────────
     10. MAGNETIC EFFECT — CTA buttons
  ───────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.25;
      const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      btn.style.transform  = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 0.15s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.5s ease';
    });
  });


  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  onScroll();

});
