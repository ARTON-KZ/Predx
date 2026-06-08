/* Predx — Auth Utilities */

const API_BASE = 'http://localhost:3001';
const TOKEN_KEY      = 'predx_member_token';
const MEMBER_KEY     = 'predx_member_info';
const TEMP_TOKEN_KEY = 'predx_temp_token';

function getToken()  { return localStorage.getItem(TOKEN_KEY); }
function getMember() {
  try { return JSON.parse(localStorage.getItem(MEMBER_KEY)); } catch { return null; }
}
function saveAuth(token, member) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(MEMBER_KEY, JSON.stringify(member));
}
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(MEMBER_KEY);
  localStorage.removeItem(TEMP_TOKEN_KEY);
}

// === Login Page (two-step) ===
const step1El = document.getElementById('step1');
if (step1El) {

  // Already logged in → skip to member page
  if (getToken()) { window.location.href = 'member.html'; }

  // ── Step 1 elements ──
  const step1Form    = document.getElementById('step1Form');
  const step1Btn     = document.getElementById('step1Btn');
  const step1BtnText = document.getElementById('step1BtnText');
  const step1Spinner = document.getElementById('step1Spinner');
  const step1Error   = document.getElementById('step1Error');
  const step1ErrTxt  = document.getElementById('step1ErrorText');

  // ── Step 2 elements ──
  const step2El      = document.getElementById('step2');
  const step2Form    = document.getElementById('step2Form');
  const step2Btn     = document.getElementById('step2Btn');
  const step2BtnText = document.getElementById('step2BtnText');
  const step2Spinner = document.getElementById('step2Spinner');
  const step2Error   = document.getElementById('step2Error');
  const step2ErrTxt  = document.getElementById('step2ErrorText');
  const backBtn      = document.getElementById('backBtn');
  const otpInput     = document.getElementById('otp');

  function setStep(n) {
    step1El.style.display = n === 1 ? 'block' : 'none';
    step2El.style.display = n === 2 ? 'block' : 'none';
  }

  function _t(key) { return window.predxI18n ? window.predxI18n.t(key) : key; }

  function setLoading1(loading) {
    step1Btn.disabled        = loading;
    step1BtnText.textContent = loading ? (_t('login-continue') === 'Continuar' ? 'Verificando...' : 'Checking...') : _t('login-continue');
    step1Spinner.style.display = loading ? 'inline-block' : 'none';
  }

  function setLoading2(loading) {
    step2Btn.disabled        = loading;
    step2BtnText.textContent = loading ? (_t('otp-signin') === 'Iniciar Sesión' ? 'Verificando...' : 'Verifying...') : _t('otp-signin');
    step2Spinner.style.display = loading ? 'inline-block' : 'none';
  }

  // Auto-uppercase OTP input
  otpInput?.addEventListener('input', () => {
    const pos = otpInput.selectionStart;
    otpInput.value = otpInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    otpInput.setSelectionRange(pos, pos);
  });

  // Back button returns to step 1
  backBtn?.addEventListener('click', () => {
    localStorage.removeItem(TEMP_TOKEN_KEY);
    step2Error.style.display = 'none';
    setStep(1);
  });

  // ── Step 1 submit: email + password ──
  step1Form.addEventListener('submit', async (e) => {
    e.preventDefault();
    step1Error.style.display = 'none';

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      step1ErrTxt.textContent = 'Please fill in all fields.';
      step1Error.style.display = 'flex';
      return;
    }

    setLoading1(true);

    try {
      const res  = await fetch(`${API_BASE}/api/auth/prelogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading1(false);
        step1ErrTxt.textContent = data.error || 'Incorrect email or password.';
        step1Error.style.display = 'flex';
        return;
      }

      localStorage.setItem(TEMP_TOKEN_KEY, data.temp_token);
      setLoading1(false);
      setStep(2);
      otpInput?.focus();
    } catch {
      setLoading1(false);
      step1ErrTxt.textContent = 'Cannot connect to server. Please try again.';
      step1Error.style.display = 'flex';
    }
  });

  // ── Step 2 submit: OTP ──
  step2Form.addEventListener('submit', async (e) => {
    e.preventDefault();
    step2Error.style.display = 'none';

    const otp        = otpInput.value.trim().toUpperCase();
    const temp_token = localStorage.getItem(TEMP_TOKEN_KEY);

    if (!otp || otp.length !== 8) {
      step2ErrTxt.textContent = 'Please enter your 8-character access code.';
      step2Error.style.display = 'flex';
      return;
    }

    if (!temp_token) {
      setStep(1);
      return;
    }

    setLoading2(true);

    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, temp_token }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoading2(false);
        // If temp token expired, go back to step 1
        if (res.status === 401 && data.error?.includes('expired')) {
          localStorage.removeItem(TEMP_TOKEN_KEY);
          step2ErrTxt.textContent = 'Session expired. Please log in again.';
          step2Error.style.display = 'flex';
          setTimeout(() => setStep(1), 1800);
          return;
        }
        step2ErrTxt.textContent = data.error || 'Invalid access code.';
        step2Error.style.display = 'flex';
        return;
      }

      saveAuth(data.token, data.member);
      window.location.href = 'member.html';
    } catch {
      setLoading2(false);
      step2ErrTxt.textContent = 'Cannot connect to server. Please try again.';
      step2Error.style.display = 'flex';
    }
  });
}
