/* ============================================================
   SMA NUSANTARA UNGGUL — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR: SCROLL EFFECT ────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── NAVBAR: HAMBURGER ────────────────────────────────── */
  const hamburger   = document.querySelector('.navbar__hamburger');
  const mobileMenu  = document.querySelector('.navbar__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // close on link click
    mobileMenu.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── ACTIVE NAV LINK ──────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── SCROLL FADE-UP ANIMATION ─────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = +el.dataset.count;
          const suffix = el.dataset.suffix || '';
          const dur    = 1800;
          const step   = 16;
          const inc    = target / (dur / step);
          let current  = 0;

          const tick = () => {
            current = Math.min(current + inc, target);
            el.textContent = Math.floor(current) + suffix;
            if (current < target) requestAnimationFrame(tick);
          };
          tick();
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ── CONTACT FORM VALIDATION ──────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fields = {
      name    : { el: contactForm.querySelector('#name'),    rule: v => v.trim().length >= 3,    msg: 'Nama minimal 3 karakter.' },
      email   : { el: contactForm.querySelector('#email'),   rule: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Masukkan email yang valid.' },
      subject : { el: contactForm.querySelector('#subject'), rule: v => v !== '',                 msg: 'Pilih topik pesan.' },
      message : { el: contactForm.querySelector('#message'), rule: v => v.trim().length >= 20,   msg: 'Pesan minimal 20 karakter.' },
    };

    const getErrEl = field => {
      let err = field.el.parentNode.querySelector('.form-error');
      if (!err) {
        err = document.createElement('span');
        err.className = 'form-error';
        field.el.parentNode.appendChild(err);
      }
      return err;
    };

    const validate = key => {
      const f   = fields[key];
      const val = f.el.value;
      const ok  = f.rule(val);
      f.el.classList.toggle('error', !ok);
      getErrEl(f).textContent = ok ? '' : f.msg;
      return ok;
    };

    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validate(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) validate(key);
      });
    });

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const allValid = Object.keys(fields).map(k => validate(k)).every(Boolean);
      if (allValid) {
        const btn     = contactForm.querySelector('.btn-primary');
        const success = document.getElementById('formSuccess');
        btn.disabled     = true;
        btn.textContent  = 'Mengirim...';
        setTimeout(() => {
          contactForm.reset();
          Object.keys(fields).forEach(k => fields[k].el.classList.remove('error'));
          btn.disabled    = false;
          btn.textContent = 'Kirim Pesan';
          if (success) { success.classList.add('show'); }
          setTimeout(() => { if (success) success.classList.remove('show'); }, 5000);
        }, 1500);
      }
    });
  }

  /* ── SMOOTH PAGE TRANSITION ───────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      !href.startsWith('tel')
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity .25s ease';
        setTimeout(() => { window.location.href = href; }, 250);
      });
    }
  });

  // Fade in on load
  document.body.style.opacity   = '0';
  document.body.style.transition = 'opacity .35s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });

});
