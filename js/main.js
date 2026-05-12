(function() {
  'use strict';

  // =================== REVEAL ON SCROLL ===================
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // =================== STICKY NAV ===================
  const nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // =================== TABS ===================
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.querySelector(`.tab-panel[data-panel="${tab}"]`)?.classList.add('active');
    });
  });

  // =================== ANIMATED COUNTERS ===================
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 2200;
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.round(target * eased).toLocaleString();
            el.textContent = val + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    countEls.forEach(el => countObserver.observe(el));
  }

  // =================== MODAL ===================
  const modal = document.getElementById('quoteModal');
  const triggers = document.querySelectorAll('[data-modal]');
  const closeBtn = document.getElementById('modalClose');

  if (modal && triggers.length) {
    triggers.forEach(t => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => modal.classList.add('show'));
      });
    });

    const hide = () => {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = '';
        document.body.style.overflow = '';
      }, 400);
    };

    closeBtn?.addEventListener('click', hide);
    modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  }

  // =================== FORM SUBMIT ===================
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', () => {
      setTimeout(() => {
        const btn = form.querySelector('.form-submit');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      }, 50);
    });
  }

  // =================== BEFORE / AFTER SLIDER ===================
  const bA = document.getElementById('beforeAfter');
  if (bA) {
    const afterImg = bA.querySelector('.after-img');
    const slider = bA.querySelector('.ba-slider');
    let isDragging = false;

    const update = (x) => {
      const rect = bA.getBoundingClientRect();
      let pct = (x - rect.left) / rect.width;
      pct = Math.max(0, Math.min(1, pct));
      afterImg.style.width = (pct * 100) + '%';
      slider.style.left = (pct * 100) + '%';
    };

    const start = (e) => { isDragging = true; };
    const move = (e) => { if (!isDragging) return; update(e.type.includes('touch') ? e.touches[0].clientX : e.clientX); };
    const end = () => { isDragging = false; };

    bA.addEventListener('mousedown', (e) => { start(e); update(e.clientX); });
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);
    bA.addEventListener('touchstart', (e) => { start(e); update(e.touches[0].clientX); }, { passive: true });
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', end);
  }

  // =================== SMOOTH SCROLL ===================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();