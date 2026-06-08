/* Predx — Payment Page JavaScript */

const API_BASE = 'http://localhost:3001';

function getLang() {
  return (window.predxI18n ? window.predxI18n.getLang() : null) ||
         localStorage.getItem('predx_lang') || 'es';
}
function t(key) {
  return window.predxI18n ? window.predxI18n.t(key) : key;
}

const PLANS_DATA = {
  basic: {
    nameKey:  'pjs-basic-name',
    priceKey: 'pjs-price-basic',
    badgeKey: 'pjs-badge-basic',
    featured: false,
    featureKeys: ['pjs-basic-f1','pjs-basic-f2','pjs-basic-f3','pjs-basic-f4'],
  },
  premium: {
    nameKey:  'pjs-prem-name',
    priceKey: 'pjs-price-prem',
    badgeKey: 'pjs-badge-prem',
    featured: true,
    featureKeys: ['pjs-prem-f1','pjs-prem-f2','pjs-prem-f3','pjs-prem-f4','pjs-prem-f5','pjs-prem-f6'],
  },
};

const params  = new URLSearchParams(window.location.search);
const planKey = params.get('plan')?.toLowerCase();

if (!planKey || !PLANS_DATA[planKey]) {
  window.location.href = 'index.html#plans';
}

const planData = PLANS_DATA[planKey];

function renderPlanSummary() {
  const badgeEl    = document.getElementById('planBadge');
  const nameEl     = document.getElementById('planName');
  const priceEl    = document.getElementById('planPrice');
  const featuresEl = document.getElementById('planFeatures');

  const badgeClass = planData.featured ? 'badge--green' : 'badge--chrome';
  const popularHtml = planData.featured
    ? `<span class="badge badge--chrome" style="margin-bottom:8px;">${t('pjs-popular')}</span><br />` : '';

  badgeEl.innerHTML = `${popularHtml}<span class="badge ${badgeClass}">${t(planData.badgeKey)}</span>`;
  nameEl.textContent  = t(planData.nameKey);
  priceEl.textContent = t(planData.priceKey);

  featuresEl.innerHTML = '';
  planData.featureKeys.forEach(key => {
    const el = document.createElement('div');
    el.className  = 'plan-summary-feature';
    el.textContent = t(key);
    featuresEl.appendChild(el);
  });
}

// Initial render
renderPlanSummary();

// Re-render when language changes
document.addEventListener('predx:langchange', () => {
  renderPlanSummary();
  // Also update button text if not in loading state
  if (!submitBtn.disabled) btnText.textContent = t('pjs-pay-btn');
});

// === Form Submission ===
const form       = document.getElementById('paymentForm');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const errorBanner = document.getElementById('errorBanner');
const errorText  = document.getElementById('errorText');

function showError(msg) {
  errorText.textContent = msg;
  errorBanner.style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideError() { errorBanner.style.display = 'none'; }

function setLoading(loading) {
  submitBtn.disabled    = loading;
  btnText.textContent   = loading ? t('pjs-processing') : t('pjs-pay-btn');
  btnSpinner.style.display = loading ? 'inline-block' : 'none';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();

  const fullName = document.getElementById('fullName').value.trim();
  const email    = document.getElementById('email').value.trim();

  let hasError = false;

  const nameInput = document.getElementById('fullName');
  const nameError = document.getElementById('nameError');
  if (fullName.length < 2) {
    nameInput.classList.add('error');
    nameError.classList.add('show');
    hasError = true;
  } else {
    nameInput.classList.remove('error');
    nameError.classList.remove('show');
  }

  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailInput.classList.add('error');
    emailError.classList.add('show');
    hasError = true;
  } else {
    emailInput.classList.remove('error');
    emailError.classList.remove('show');
  }

  if (hasError) return;

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey, full_name: fullName, email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      showError(data.error || t('pjs-error-gen'));
      return;
    }

    window.location.href = data.payment_url;
  } catch {
    setLoading(false);
    showError(t('pjs-error-conn'));
  }
});

['fullName', 'email'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', hideError);
});
