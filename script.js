/* ══════════════════════════════════════════════
   script.js — OrganisasiKu
   Responsive: Mobile + Laptop
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  var isTouch = (window.matchMedia('(pointer: coarse)').matches);

  /* ═══════════════════════════════════════════
     1. CUSTOM CURSOR — desktop/mouse only
  ═══════════════════════════════════════════ */
  if (!isTouch) {
    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function lerp() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = (rx - 20) + 'px';
      ring.style.top  = (ry - 20) + 'px';
      requestAnimationFrame(lerp);
    })();

    // Hover glow
    document.querySelectorAll('a, button, .doc-card, .vm-card, .nilai-card').forEach(function (el) {
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

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
  }


  /* ═══════════════════════════════════════════
     2. HAMBURGER MENU (mobile)
  ═══════════════════════════════════════════ */
  var hamburger    = document.getElementById('hamburger');
  var drawer       = document.getElementById('mobileDrawer');
  var overlay      = document.getElementById('mobileOverlay');
  var drawerClose  = document.getElementById('drawerClose');
  var drawerLinks  = document.querySelectorAll('.drawer-link');
  var drawerOpen   = false;

  function openDrawer() {
    drawer.classList.add('show');
    overlay.classList.add('show');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawerOpen = true;
  }

  function closeDrawer() {
    drawer.classList.remove('show');
    overlay.classList.remove('show');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    drawerOpen = false;
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      drawerOpen ? closeDrawer() : openDrawer();
    });
  }
  if (drawerClose)  drawerClose.addEventListener('click', closeDrawer);
  if (overlay)      overlay.addEventListener('click', closeDrawer);

  // Close on drawer link click
  drawerLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeDrawer();
    });
  });

  // ESC key closes drawer
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawerOpen) closeDrawer();
  });


  /* ═══════════════════════════════════════════
     3. NAVBAR — shrink + active link
  ═══════════════════════════════════════════ */
  var navbar   = document.getElementById('navbar');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateNav() {
    // Shrink
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link
    var current = '';
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', id === current);
    });

    // Parallax
    parallaxHero();
  }

  window.addEventListener('scroll', updateNav, { passive: true });


  /* ═══════════════════════════════════════════
     4. SMOOTH SCROLL (for all anchor links)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ═══════════════════════════════════════════
     5. REVEAL ON SCROLL (Intersection Observer)
  ═══════════════════════════════════════════ */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    io.observe(el);
  });


  /* ═══════════════════════════════════════════
     6. PARALLAX — hero bg word (desktop only)
  ═══════════════════════════════════════════ */
  var bgWord = document.querySelector('.hero-bg-word');

  function parallaxHero() {
    if (!bgWord) return;
    if (window.innerWidth < 768) {
      bgWord.style.transform = 'translate(-50%, -48%)';
      return;
    }
    bgWord.style.transform =
      'translate(-50%, calc(-48% + ' + (window.scrollY * 0.22) + 'px))';
  }


  /* ═══════════════════════════════════════════
     7. HERO RINGS — mouse tilt (desktop only)
  ═══════════════════════════════════════════ */
  if (!isTouch) {
    var rings = document.querySelectorAll('.ring');
    document.addEventListener('mousemove', function (e) {
      var cx = window.innerWidth  / 2;
      var cy = window.innerHeight / 2;
      var dx = (e.clientX - cx) / cx;
      var dy = (e.clientY - cy) / cy;
      rings.forEach(function (r, i) {
        var f = (i + 1) * 4;
        r.style.marginLeft = (dx * f) + 'px';
        r.style.marginTop  = (dy * f) + 'px';
      });
    });
  }


  /* ═══════════════════════════════════════════
     8. CARD 3D TILT — desktop only
  ═══════════════════════════════════════════ */
  if (!isTouch) {
    document.querySelectorAll('.doc-card, .vm-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx   = rect.left + rect.width  / 2;
        var cy   = rect.top  + rect.height / 2;
        var dx   = (e.clientX - cx) / (rect.width  / 2);
        var dy   = (e.clientY - cy) / (rect.height / 2);
        card.style.transition = 'transform 0.1s ease, border-color 0.4s';
        card.style.transform  =
          'translateY(-6px) perspective(900px) rotateX(' + (dy * -4) + 'deg) rotateY(' + (dx * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), border-color 0.4s';
        card.style.transform  = '';
      });
    });
  }


  /* ═══════════════════════════════════════════
     9. RIPPLE — buttons
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.btn-orange, .dc-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var el   = document.createElement('span');
      el.classList.add('ripple-el');
      el.style.left = (e.clientX - rect.left) + 'px';
      el.style.top  = (e.clientY - rect.top)  + 'px';
      btn.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
    });
  });


  /* ═══════════════════════════════════════════
     10. FLOATING PARTICLES — hero
  ═══════════════════════════════════════════ */
  var hero = document.getElementById('hero');
  if (hero) {
    var count = window.innerWidth < 640 ? 10 : 22;
    for (var i = 0; i < count; i++) {
      var p    = document.createElement('div');
      p.classList.add('particle');
      var size = Math.random() * 3 + 2;
      var dur  = Math.random() * 14 + 8;
      var del  = Math.random() * 8;
      var col  = i % 3 === 0
        ? 'rgba(255,106,0,0.5)'
        : 'rgba(255,255,255,0.15)';
      p.style.cssText =
        'width:'  + size + 'px;' +
        'height:' + size + 'px;' +
        'left:'   + (Math.random() * 100) + '%;' +
        'top:'    + (Math.random() * 100) + '%;' +
        'background:' + col + ';' +
        'animation-duration:'  + dur + 's;' +
        'animation-delay:'     + del + 's;';
      hero.appendChild(p);
    }
  }


  /* ═══════════════════════════════════════════
     11. MAGNETIC BUTTONS — desktop only
  ═══════════════════════════════════════════ */
  if (!isTouch) {
    document.querySelectorAll('.btn-orange, .btn-outline').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var dx   = (e.clientX - rect.left - rect.width  / 2) * 0.2;
        var dy   = (e.clientY - rect.top  - rect.height / 2) * 0.2;
        btn.style.transition = 'transform 0.15s ease';
        btn.style.transform  = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.5s ease, background .3s, box-shadow .3s';
        btn.style.transform  = '';
      });
    });
  }


  /* ═══════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════ */
  updateNav();

});
