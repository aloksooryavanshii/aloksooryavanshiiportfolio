/**
 * ALOK KUMAR — CONTENT WRITER PORTFOLIO
 * script.js | All Interactions & Animations
 */

/* ================================================================
   1. DARK MODE TOGGLE
   ================================================================ */
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', saved);

  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();


/* ================================================================
   2. NAVBAR: Scroll Shadow + Hamburger Menu
   ================================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Scroll: add .scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = navLinks.querySelector(`a[href="#${id}"]`);
      if (link) {
        link.style.color = y >= top && y < bottom ? 'var(--accent)' : '';
      }
    });
  }, { passive: true });
})();


/* ================================================================
   3. SCROLL REVEAL ANIMATION
   ================================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.closest('.services-grid, .portfolio-grid, .expertise-grid, .skills-tags, .testimonials-track');
        const delay = siblings
          ? Array.from(siblings.children).indexOf(entry.target) * 80
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ================================================================
   4. HERO: ROLE CYCLER
   ================================================================ */
(function initRoleCycler() {
  const roles = [
    'Content Writer',
    'Blog Writer',
    'Article Writer',
    'SEO Content Creator',
    'Brand Storyteller',
  ];
  const el = document.getElementById('roleCycle');
  if (!el) return;

  let i = 0;

  function cycle() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

    setTimeout(() => {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 380);
  }

  setInterval(cycle, 2600);
})();


/* ================================================================
   5. ANIMATED STAT COUNTERS
   ================================================================ */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOutCubic(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(num => observer.observe(num));
})();


/* ================================================================
   6. SKILLS BAR ANIMATION
   ================================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width;
        setTimeout(() => {
          entry.target.style.width = target + '%';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ================================================================
   7. TESTIMONIALS SLIDER
   ================================================================ */
(function initSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let current = 0;
  let autoInterval;

  // Detect slides per view
  function getSlidesPerView() {
    return window.innerWidth <= 768 ? 1 : 2;
  }

  function getMaxIndex() {
    return total - getSlidesPerView();
  }

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = getMaxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    const max = getMaxIndex();
    current = Math.max(0, Math.min(index, max));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function startAuto() {
    autoInterval = setInterval(() => {
      const max = getMaxIndex();
      goTo(current >= max ? 0 : current + 1);
    }, 5000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
  });

  buildDots();
  startAuto();
  window.addEventListener('resize', () => { buildDots(); goTo(current); });
})();


/* ================================================================
   8. CONTACT FORM VALIDATION
   ================================================================ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    el.classList.remove('visible');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Clear all
    ['nameError', 'emailError', 'messageError'].forEach(clearError);

    if (!name) { showError('nameError', 'Please enter your name.'); valid = false; }
    if (!email) {
      showError('emailError', 'Please enter your email address.'); valid = false;
    } else if (!validateEmail(email)) {
      showError('emailError', 'Please enter a valid email address.'); valid = false;
    }
    if (!message) { showError('messageError', 'Please enter your message.'); valid = false; }

    if (!valid) return;

    // Simulate submission
    const btn = document.getElementById('submitText');
    btn.textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message ✦';
      const success = document.getElementById('formSuccess');
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1200);
  });

  // Inline validation on blur
  ['name', 'email', 'message'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        showError(id + 'Error', `Please fill in this field.`);
      } else {
        clearError(id + 'Error');
      }
    });
    input.addEventListener('input', () => clearError(id + 'Error'));
  });
})();


/* ================================================================
   9. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'), 10) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ================================================================
   10. PORTFOLIO CARD HOVER EFFECT (Tilt)
   ================================================================ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.portfolio-card:not(.portfolio-card--hire)');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });
})();


/* ================================================================
   11. FOOTER: CURRENT YEAR
   ================================================================ */
(function updateYear() {
  const yearEls = document.querySelectorAll('.footer-year');
  const year = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = year; });
  // Also update static year in footer if present
  const footerText = document.querySelector('.footer-bottom p');
  if (footerText) {
    footerText.textContent = footerText.textContent.replace(/\d{4}/, year);
  }
})();
