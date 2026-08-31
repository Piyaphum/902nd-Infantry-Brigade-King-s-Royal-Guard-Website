/* ============================================================
   main.js — Public Site Logic — ร.๙๐๒ รอ.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ── Mobile nav toggle ───────────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.getElementById('navOverlay');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  /* ── Mobile dropdown accordion ───────────────────────────── */
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link && item.querySelector('.dropdown')) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  /* ── Hero background animation ───────────────────────────── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('animated'), 100);
  }

  /* ── Animate on scroll ───────────────────────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ── Dynamic Unit Age ────────────────────────────────────── */
  const unitAgeEl = document.getElementById('unit-age');
  if (unitAgeEl) {
    const currentYearBE = new Date().getFullYear() + 543;
    const foundedYearBE = 2493;
    const age = currentYearBE - foundedYearBE;
    unitAgeEl.setAttribute('data-target', age);
    unitAgeEl.textContent = age + ' ปี';
  }

  /* ── Counter animation ───────────────────────────────────── */
  const countEls = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObserver.observe(el));

  /* ── Active nav link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── Contact form submit (mock) ──────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✓ ส่งเรียบร้อยแล้ว';
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg, #28A745, #1e7e34)';
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    });
  }

});
