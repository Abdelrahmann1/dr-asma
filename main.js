/* ===================================================
   DR. ASMAA AL-HADDAD — MAIN.JS
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── AOS INIT ─────────────────────────────────── */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  /* ── NAVBAR: SCROLL EFFECT ────────────────────── */
  const navbar = document.getElementById('mainNav');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── NAVBAR: ACTIVE LINK ON SCROLL ───────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ── NAVBAR: CLOSE MOBILE MENU ON LINK CLICK ── */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.getElementById('navbarNav');
      const bsCollapse = bootstrap.Collapse.getInstance(collapse);
      if (bsCollapse) bsCollapse.hide();
    });
  });

  /* ── SMOOTH SCROLL ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── CONTACT FORM SUBMIT ─────────────────────── */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> جارٍ الإرسال...';

      // Simulate sending (replace with real fetch/API call)
      setTimeout(() => {
        form.style.display = 'none';
        successMsg.classList.remove('d-none');
        successMsg.style.animation = 'fadeInUp 0.5s ease';
      }, 1500);
    });
  }

  /* ── PARTICLES (hero background dots) ─────────── */
  const canvas = document.createElement('canvas');
  const container = document.getElementById('particles');
  if (container) {
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 22000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x:    Math.random() * canvas.width,
          y:    Math.random() * canvas.height,
          r:    Math.random() * 1.8 + 0.5,
          vx:   (Math.random() - 0.5) * 0.25,
          vy:   (Math.random() - 0.5) * 0.25,
          a:    Math.random() * 0.5 + 0.1,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${p.a})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      resize();
      createParticles();
      drawParticles();
    });
  }

  /* ── COUNTER ANIMATION ───────────────────────── */
  function animateCount(el, target, suffix) {
    let current = 0;
    const step  = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = (suffix === '+' ? '+' : '') + current + (suffix === '%' ? '%' : '');
    }, 30);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let counted = false;

  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNums.forEach(el => {
          const text = el.textContent.trim();
          if (text.startsWith('+')) {
            animateCount(el, parseInt(text.replace('+', '')), '+');
          } else if (text.endsWith('%')) {
            animateCount(el, parseInt(text.replace('%', '')), '%');
          }
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  /* ── SERVICE CARD TILT EFFECT ─────────────────── */
  document.querySelectorAll('.service-card:not(.service-card-featured)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── TESTIMONIALS: HIGHLIGHT HOVERED ─────────── */
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.testimonial-card').forEach(c => {
        if (c !== card && !c.classList.contains('testimonial-featured')) {
          c.style.opacity = '0.6';
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      document.querySelectorAll('.testimonial-card').forEach(c => {
        c.style.opacity = '';
      });
    });
  });

});
