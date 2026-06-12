/* Predx — Landing Page JavaScript */

// === Navbar scroll behavior ===
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// === Mobile burger menu ===
const burger = document.getElementById('navBurger');
if (burger && navbar) {
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.toggle('navbar--open');
  });
  document.querySelectorAll('.navbar__mobile-link, .navbar__mobile-actions a').forEach(el => {
    el.addEventListener('click', () => navbar.classList.remove('navbar--open'));
  });
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) navbar.classList.remove('navbar--open');
  });
}

// === Reveal on scroll ===
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// === Animated counters ===
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el, target, duration = 1800) {
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const isLarge = target >= 1000;

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * target);

    if (isLarge) {
      el.textContent = value.toLocaleString() + suffix;
    } else {
      el.textContent = value + suffix;
    }

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count, 10);
        if (!isNaN(target)) animateCounter(e.target, target);
        counterObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

// === FAQ Accordion ===
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  question?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach((i) => i.classList.remove('open'));

    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

// Force-reveal everything after 1.8s (handles headless/prerendering)
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    el.classList.add('visible');
  });
  document.querySelectorAll('[data-count]').forEach((el) => {
    if (!el._counted) {
      el._counted = true;
      const target = parseInt(el.dataset.count, 10);
      if (!isNaN(target)) animateCounter(el, target, 1200);
    }
  });
}, 1800);

// === Pending payment banner ===
// If the visitor left for the payment gateway and came back (or closed the
// tab mid-payment), offer a way back to the live confirmation page.
(function () {
  const PENDING_KEY = 'predx_pending_order';
  const MAX_AGE = 48 * 60 * 60 * 1000;

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); } catch {}
  if (!saved || !saved.order_id) return;
  if (Date.now() - (saved.ts || 0) > MAX_AGE) {
    try { localStorage.removeItem(PENDING_KEY); } catch {}
    return;
  }
  if (sessionStorage.getItem('predx_pending_banner_dismissed')) return;

  const banner = document.createElement('div');
  banner.className = 'pending-banner';
  banner.innerHTML = `
    <span class="pending-banner__dot"></span>
    <span data-i18n="banner-pending">Tienes un pago en proceso.</span>
    <a href="success.html?order_id=${encodeURIComponent(saved.order_id)}" class="pending-banner__link" data-i18n="banner-pending-link">Ver estado →</a>
    <button class="pending-banner__close" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
    </button>`;
  document.body.appendChild(banner);

  banner.querySelector('.pending-banner__close').addEventListener('click', () => {
    sessionStorage.setItem('predx_pending_banner_dismissed', '1');
    banner.remove();
  });
})();

// === Smooth scroll for anchor links ===
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
