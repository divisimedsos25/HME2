/* ══════════════════════════════════════════════
   script.js — OrganisasiKu
   Tema: Modern Elegant | Oranye × Hitam × Putih
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ═══════════════════════════════════════════
     1. CUSTOM CURSOR
  ═══════════════════════════════════════════ */
  var dot  = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');

  var mx = 0, my = 0;   // mouse
  var rx = 0, ry = 0;   // ring (lagged)

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    // Dot follows instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring lerp loop
  (function lerp() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    // Ring positioned so its center = cursor
    ring.style.left = (rx - 20) + 'px';
    ring.style.top  = (ry - 20) + 'px';
    requestAnimationFrame(lerp);
  })();

  // Hover state
  document.querySelectorAll('a, button, .doc-card, .vm-card, .nilai-card, .dc-btn, .btn-orange, .btn-outline').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      dot.classList.add('hov');
      ring.classList.add('hov');
    });
    el.addEventListener('mouseleave', function () {
      dot.classList.remove('hov');
      ring.classList.remove('hov');
    });
  });

  // Click shrink
  document.addEventListener('mousedown', function () { dot.classList.add('click'); });
  document.addEventListener('mouseup',   function () { dot.classList.remove('click'); });

  // Hide when leaving window
  document.addEventListener('mouseleave', function () {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });


  /* ═══════════════════════════════════════════
     2. NAVBAR — shrink on scroll + active link
  ═══════════════════════════════════════════ */
  var navbar   = document.getElementById('navbar');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateNav() {
    // Shrink
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link
    var current = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });

    // Parallax hero bg word
    parallaxHero();
  }

  window.addEventListener('scroll', updateNav, { passive: true });


  /* ═══════════════════════════════════════════
     3. SMOOTH SCROLL
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var id = this.getAttribute('href');
      var target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ═══════════════════════════════════════════
     4. REVEAL ON SCROLL (Intersection Observer)
  ═══════════════════════════════════════════ */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObs.observe(el);
  });


  /* ═══════════════════════════════════════════
     5. PARALLAX — hero bg word
  ═══════════════════════════════════════════ */
  var bgWord = document.querySelector('.hero-bg-word');

  function parallaxHero() {
    if (!bgWord) return;
    bgWord.style.transform = 'translate(-50%, calc(-48% + ' + (window.scrollY * 0.25) + 'px))';
  }


  /* ═══════════════════════════════════════════
     6. HERO RINGS — subtle mouse tilt
  ═══════════════════════════════════════════ */
  var rings = document.querySelectorAll('.ring');

  document.addEventListener('mousemove', function (e) {
    var cx = window.innerWidth  / 2;
    var cy = window.innerHeight / 2;
    var dx = (e.clientX - cx) / cx;
    var dy = (e.clientY - cy) / cy;

    rings.forEach(function (r, i) {
      var f = (i + 1) * 5;
      r.style.marginLeft = (dx * f) + 'px';
      r.style.marginTop  = (dy * f) + 'px';
    });
  });


  /* ═══════════════════════════════════════════
     7. CARD 3D TILT on hover
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.doc-card, .vm-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var dx   = (e.clientX - cx) / (rect.width  / 2);
      var dy   = (e.clientY - cy) / (rect.height / 2);

      card.style.transition = 'transform 0.1s ease, border-color 0.4s';
      card.style.transform  =
        'translateY(-6px) perspective(900px) rotateX(' + (dy * -5) + 'deg) rotateY(' + (dx * 5) + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), border-color 0.4s';
      card.style.transform  = '';
    });
  });


  /* ═══════════════════════════════════════════
     8. RIPPLE on buttons
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.btn-orange, .dc-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var el   = document.createElement('span');
      el.classList.add('ripple-el');
      el.style.left = (e.clientX - rect.left)  + 'px';
      el.style.top  = (e.clientY - rect.top)   + 'px';
      btn.appendChild(el);
      setTimeout(function () { el.remove(); }, 700);
    });
  });


  /* ═══════════════════════════════════════════
     9. FLOATING PARTICLES in hero
  ═══════════════════════════════════════════ */
  var hero = document.getElementById('hero');
  if (hero) {
    for (var i = 0; i < 22; i++) {
      var p    = document.createElement('div');
      p.classList.add('particle');
      var size = Math.random() * 4 + 2;
      var dur  = Math.random() * 14 + 8;
      var del  = Math.random() * 8;
      var col  = i % 3 === 0
        ? 'rgba(255,106,0,0.55)'
        : 'rgba(255,255,255,0.18)';

      p.style.cssText =
        'width:'  + size + 'px;' +
        'height:' + size + 'px;' +
        'left:'   + (Math.random() * 100) + '%;' +
        'top:'    + (Math.random() * 100) + '%;' +
        'background:' + col + ';' +
        'animation-duration:' + dur + 's;' +
        'animation-delay:'   + del + 's;';

      hero.appendChild(p);
    }
  }


  /* ═══════════════════════════════════════════
     10. MAGNETIC BUTTONS (CTA)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.btn-orange, .btn-outline').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var dx   = (e.clientX - rect.left - rect.width  / 2) * 0.22;
      var dy   = (e.clientY - rect.top  - rect.height / 2) * 0.22;
      btn.style.transition = 'transform 0.15s ease';
      btn.style.transform  = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform 0.5s ease, background 0.3s, box-shadow 0.3s';
      btn.style.transform  = '';
    });
  });


  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */
  updateNav();

});
