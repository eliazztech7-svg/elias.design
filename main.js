/**
 * LANDINGPRO — main.js
 * Clean, modular ES6+ JavaScript
 * No frameworks. No dependencies.
 */

'use strict';

/* ═══════════════════════════════════════════════════════
   1. NAVBAR — sticky + blur on scroll
═══════════════════════════════════════════════════════ */
const initNavbar = () => {
  const navbar  = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 20;

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
};

/* ═══════════════════════════════════════════════════════
   2. MOBILE MENU — toggle
═══════════════════════════════════════════════════════ */
const initMobileMenu = () => {
  const toggle = document.getElementById('menuToggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    toggle.classList.add('is-open');
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    isOpen = false;
    toggle.classList.remove('is-open');
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
};

/* ═══════════════════════════════════════════════════════
   3. REVEAL ANIMATIONS — Intersection Observer
═══════════════════════════════════════════════════════ */
const initRevealAnimations = () => {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Respect user's motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Fire once
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
};

/* ═══════════════════════════════════════════════════════
   4. SMOOTH SCROLL — for anchor links
═══════════════════════════════════════════════════════ */
const initSmoothScroll = () => {
  const NAVBAR_H = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '72',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_H - 16;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });

      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
};

/* ═══════════════════════════════════════════════════════
   5. WHATSAPP FLOAT BUTTON — show after scroll
═══════════════════════════════════════════════════════ */
const initWAFloat = () => {
  const btn = document.getElementById('waFloat');
  if (!btn) return;

  const SHOW_AFTER = 400; // pixels

  const onScroll = () => {
    btn.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

/* ═══════════════════════════════════════════════════════
   6. FAQ ACCORDION — accessible with keyboard
═══════════════════════════════════════════════════════ */
const initFAQ = () => {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const summary = item.querySelector('summary');
    if (!summary) return;

    // Keyboard support: Space & Enter already native on <details>
    // Add arrow navigation
    summary.addEventListener('keydown', (e) => {
      const allSummaries = [...document.querySelectorAll('.faq-item summary')];
      const idx = allSummaries.indexOf(summary);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        allSummaries[Math.min(idx + 1, allSummaries.length - 1)]?.focus();
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        allSummaries[Math.max(idx - 1, 0)]?.focus();
      }
    });
  });
};

/* ═══════════════════════════════════════════════════════
   7. ACTIVE NAV LINK — highlight on scroll
═══════════════════════════════════════════════════════ */
const initActiveNavLink = () => {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const NAVBAR_H = 80;

  const onScroll = () => {
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - NAVBAR_H - 60;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      link.style.background = '';

      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--accent-bright)';
        link.style.background = 'rgba(59,130,246,0.08)';
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

/* ═══════════════════════════════════════════════════════
   8. HERO PARALLAX — subtle parallax on hero bg
═══════════════════════════════════════════════════════ */
const initHeroParallax = () => {
  const glow1 = document.querySelector('.hero__glow--1');
  const glow2 = document.querySelector('.hero__glow--2');
  if (!glow1 || !glow2) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        glow1.style.transform = `translateX(-50%) translateY(${y * 0.15}px)`;
        glow2.style.transform = `translateY(${y * -0.08}px)`;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
};

/* ═══════════════════════════════════════════════════════
   9. SERVICE CARDS — subtle tilt on hover (desktop)
═══════════════════════════════════════════════════════ */
const initCardTilt = () => {
  const isMobile = window.matchMedia('(hover: none)').matches;
  if (isMobile) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const cards = document.querySelectorAll('.portfolio-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -3;
      const rotateY = ((x - cx) / cx) * 3;

      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.25s ease, box-shadow 0.25s ease';
    });
  });
};

/* ═══════════════════════════════════════════════════════
   10. COUNTERS — animated number count-up
═══════════════════════════════════════════════════════ */
const initCounters = () => {
  const proofItems = document.querySelectorAll('.proof__item strong');
  if (!proofItems.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const parseValue = (str) => {
    const match = str.match(/[\d]+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const animateCounter = (el, target, duration = 1200) => {
    const start     = performance.now();
    const original  = el.textContent;
    const prefix    = original.replace(/[\d]+/, '').split(/[\d]+/)[0] || '';
    const suffix    = original.replace(/[\d]+/, '').split(/[\d]+/)[1] || '';

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseValue(el.textContent);
          if (target !== null) {
            animateCounter(el, target);
          }
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  proofItems.forEach(el => observer.observe(el));
};

/* ═══════════════════════════════════════════════════════
   INIT — Run all modules on DOM ready
═══════════════════════════════════════════════════════ */
const init = () => {
  initNavbar();
  initMobileMenu();
  initRevealAnimations();
  initSmoothScroll();
  initWAFloat();
  initFAQ();
  initActiveNavLink();
  initHeroParallax();
  initCardTilt();
  initCounters();
};

// DOMContentLoaded guard
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
