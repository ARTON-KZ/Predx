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
