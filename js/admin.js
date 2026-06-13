/* Predx — Admin Dashboard JavaScript */

const API_BASE = window.API_BASE || 'http://localhost:3001';
const ADMIN_TOKEN_KEY = 'predx_admin_token';

let allMembers = [];
let currentFilter = 'all';

function getToken() { return localStorage.getItem(ADMIN_TOKEN_KEY); }
function setToken(t) { localStorage.setItem(ADMIN_TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(ADMIN_TOKEN_KEY); }

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

// === Screens ===
const loginScreen = document.getElementById('loginScreen');
const dashboard   = document.getElementById('dashboard');

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboard.style.display = 'block';
  loadMembers();
}

function showLogin() {
  dashboard.style.display = 'none';
  loginScreen.style.display = 'flex';
}

if (getToken()) showDashboard(); else showLogin();

// === Login ===
const loginForm    = document.getElementById('loginForm');
const loginError   = document.getElementById('loginError');
const loginErrText = document.getElementById('loginErrorText');
const loginBtn     = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginSpinner = document.getElementById('loginSpinner');

function setLoginLoading(loading) {
  loginBtn.disabled = loading;
  loginBtnText.textContent = loading ? 'Logging in...' : 'Access Dashboard';
  loginSpinner.style.display = loading ? 'inline-block' : 'none';
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.style.display = 'none';
  const password = document.getElementById('adminPassword').value;
  setLoginLoading(true);

  try {
    const res  = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setLoginLoading(false);
      loginErrText.textContent = data.error || 'Incorrect password.';
      loginError.style.display = 'flex';
      return;
    }

    setToken(data.token);
    setLoginLoading(false);
    showDashboard();
  } catch {
    setLoginLoading(false);
    loginErrText.textContent = 'Cannot connect to server. Make sure the backend is running.';
    loginError.style.display = 'flex';
  }
});

document.getElementById('logoutBtn')?.addEventListener('click', () => { clearToken(); showLogin(); });
document.getElementById('refreshBtn')?.addEventListener('click', () => {
  if (currentPage === 'predictions') loadPredictions(); else loadMembers();
});

// === Page Tab Switching (Members ↔ Predictions) ===
let currentPage = 'members';

document.querySelectorAll('.page-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentPage = btn.dataset.page;
    document.querySelectorAll('.page-tab').forEach(b => {
      b.style.background   = b === btn ? 'var(--elevated)' : 'transparent';
      b.style.color        = b === btn ? 'var(--text)'     : 'var(--text-sub)';
    });
    document.getElementById('membersPanel').style.display     = currentPage === 'members'     ? 'block' : 'none';
    document.getElementById('predictionsPanel').style.display = currentPage === 'predictions' ? 'block' : 'none';
    if (currentPage === 'predictions' && allPredictions.length === 0) loadPredictions();
  });
});

// === Filter tabs ===
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTable();
  });
});

// === Load Members ===
async function loadMembers() {
  document.getElementById('tableLoading').style.display = 'block';
  document.getElementById('tableWrap').style.display = 'none';

  try {
    const res  = await fetch(`${API_BASE}/api/admin/users`, { headers: authHeaders() });
    const data = await res.json();

    if (res.status === 401) { clearToken(); showLogin(); return; }

    allMembers = data.users || [];
    updateStats();
    renderTable();
    document.getElementById('tableLoading').style.display = 'none';
    document.getElementById('tableWrap').style.display = 'block';
  } catch {
    document.getElementById('tableLoading').innerHTML =
      '<p style="font-size:14px; color:var(--red);">Failed to load members. Check that the backend server is running.</p>';
  }
}

function updateStats() {
  const total   = allMembers.length;
  const issued  = allMembers.filter(m => m.otp_issued).length;
  const pending = total - issued;
  document.getElementById('statTotal').textContent   = total;
  document.getElementById('statIssued').textContent  = issued;
  document.getElementById('statPending').textContent = pending;
}

// === Render Table ===
function renderTable() {
  const body  = document.getElementById('membersBody');
  const empty = document.getElementById('tableEmpty');
  body.innerHTML = '';

  const filtered = allMembers.filter(m => {
    if (currentFilter === 'issued')  return m.otp_issued === 1;
    if (currentFilter === 'pending') return m.otp_issued === 0;
    return true;
  });

  if (filtered.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  filtered.forEach(member => {
    const tr = document.createElement('tr');
    if (member.otp_issued) tr.classList.add('issued');

    const date = member.created_at
      ? new Date(member.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';

    tr.innerHTML = `
      <td class="td-name">${escHtml(member.full_name || '—')}</td>
      <td>${escHtml(member.email || '—')}</td>
      <td><span class="td-plan ${member.plan}">${escHtml((member.plan || '').toUpperCase())}</span></td>
      <td>${date}</td>
      <td id="otpCell-${member.id}">${renderOtpCell(member)}</td>
      <td id="statusCell-${member.id}">${renderStatusCell(member)}</td>
    `;
    body.appendChild(tr);
  });
}

function renderOtpCell(member) {
  if (!member.otp) {
    return `<button class="btn btn--outline" style="font-size:12px; padding:6px 14px;" onclick="generateCredentials(${member.id})">Generate Code</button>`;
  }
  return `
    <div class="otp-box">
      <span class="otp-code">${escHtml(member.otp)}</span>
      <button class="copy-btn" id="copyOtpBtn-${member.id}" onclick="copyCode('${escHtml(member.otp)}', 'copyOtpBtn-${member.id}')">Copy</button>
    </div>
  `;
}

function renderStatusCell(member) {
  if (!member.otp) {
    return '<span style="font-size:12px; color:var(--text-dim);">No code yet</span>';
  }
  if (member.otp_issued) {
    return '<span class="issue-btn issued" style="cursor:default;">✓ Issued</span>';
  }
  return `<button class="issue-btn" onclick="markIssued(${member.id})">Mark as Issued</button>`;
}

// === Generate access code (OTP). The customer's password is set at checkout. ===
async function generateCredentials(id) {
  const otpCell = document.getElementById(`otpCell-${id}`);
  const origOtp = otpCell.innerHTML;
  otpCell.innerHTML = '<span style="color:var(--text-dim);font-size:13px;">Generating...</span>';

  try {
    const res  = await fetch(`${API_BASE}/api/admin/generate-credentials/${id}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    const data = await res.json();

    if (!res.ok) {
      otpCell.innerHTML = origOtp;
      alert(data.error || 'Failed to generate access code.');
      return;
    }

    const member = allMembers.find(m => m.id === id);
    if (member) member.otp = data.otp;

    otpCell.innerHTML = renderOtpCell({ id, otp: data.otp });
    document.getElementById(`statusCell-${id}`).innerHTML =
      renderStatusCell({ id, otp: data.otp, otp_issued: 0 });
    updateStats();
  } catch {
    otpCell.innerHTML = origOtp;
    alert('Connection error. Please try again.');
  }
}

// === Copy to Clipboard ===
function copyCode(text, btnId) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }).finally(() => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// === Mark as Issued ===
async function markIssued(id) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/mark-issued/${id}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!res.ok) { alert((await res.json()).error || 'Failed.'); return; }

    const member = allMembers.find(m => m.id === id);
    if (member) member.otp_issued = 1;

    document.querySelector(`#statusCell-${id}`)?.closest('tr')?.classList.add('issued');
    document.getElementById(`statusCell-${id}`).innerHTML =
      renderStatusCell({ id, otp: member?.otp, otp_issued: 1 });
    updateStats();
  } catch {
    alert('Connection error. Please try again.');
  }
}

// === Predictions ===
let allPredictions = [];

// Pre-fill today's date in the add form
const predDateInput = document.getElementById('predDate');
if (predDateInput) {
  predDateInput.value = new Date().toISOString().slice(0, 10);
}

async function loadPredictions() {
  document.getElementById('predTableLoading').style.display = 'block';
  document.getElementById('predTableWrap').style.display    = 'none';

  try {
    const res  = await fetch(`${API_BASE}/api/admin/predictions`, { headers: authHeaders() });
    const data = await res.json();
    if (res.status === 401) { clearToken(); showLogin(); return; }
    allPredictions = data.predictions || [];
    renderPredictions();
    document.getElementById('predTableLoading').style.display = 'none';
    document.getElementById('predTableWrap').style.display    = 'block';
  } catch {
    document.getElementById('predTableLoading').innerHTML =
      '<p style="font-size:14px; color:var(--red);">Failed to load predictions. Check that the backend is running.</p>';
  }
}

function renderPredictions() {
  const body  = document.getElementById('predBody');
  const empty = document.getElementById('predEmpty');
  body.innerHTML = '';

  if (allPredictions.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  allPredictions.forEach(p => {
    const tr = document.createElement('tr');
    tr.id = `predRow-${p.id}`;
    const resultHtml = renderResultBadge(p.result);
    tr.innerHTML = `
      <td style="white-space:nowrap;">${escHtml(p.match_date)}</td>
      <td style="white-space:nowrap;">${escHtml(p.home_team)} vs ${escHtml(p.away_team)}</td>
      <td style="color:var(--text-sub); font-size:13px;">${escHtml(p.league || '—')}</td>
      <td>${escHtml(p.prediction)}</td>
      <td style="text-align:center;">${p.odds ? escHtml(p.odds) : '—'}</td>
      <td><span class="td-plan ${escHtml(p.plan)}">${escHtml(p.plan.toUpperCase())}</span></td>
      <td id="predResult-${p.id}">${resultHtml}</td>
      <td id="predActions-${p.id}">${renderPredActions(p)}</td>
    `;
    body.appendChild(tr);
  });
}

function renderResultBadge(result) {
  const map = {
    win:     { label: '✓ WIN',     color: '#22C55E' },
    loss:    { label: '✗ LOSS',    color: '#EF4444' },
    pending: { label: '• PENDING', color: '#9CA3AF' },
  };
  const r = map[result] || map.pending;
  return `<span style="font-size:12px; font-weight:700; letter-spacing:0.04em; color:${r.color}; background:${r.color}18; border:1px solid ${r.color}40; border-radius:6px; padding:3px 9px;">${r.label}</span>`;
}

function renderPredActions(p) {
  const winActive  = p.result === 'win';
  const lossActive = p.result === 'loss';
  return `
    <div style="display:flex; gap:var(--sp-2); align-items:center;">
      <button title="Mark Win"
        style="font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; border:1px solid #22C55E40; background:${winActive ? '#22C55E22' : 'transparent'}; color:#22C55E; cursor:pointer; transition:all var(--ease);"
        onclick="setPredResult(${p.id}, '${winActive ? 'pending' : 'win'}')">W</button>
      <button title="Mark Loss"
        style="font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; border:1px solid #EF444440; background:${lossActive ? '#EF444422' : 'transparent'}; color:#EF4444; cursor:pointer; transition:all var(--ease);"
        onclick="setPredResult(${p.id}, '${lossActive ? 'pending' : 'loss'}')">L</button>
      <button title="Delete"
        style="font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px; border:1px solid var(--border); background:transparent; color:var(--text-dim); cursor:pointer; transition:all var(--ease);"
        onclick="deletePrediction(${p.id})">✕</button>
    </div>
  `;
}

// Add prediction form submit
document.getElementById('predForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById('predFormError').style.display   = 'none';
  document.getElementById('predFormSuccess').style.display = 'none';

  const btn     = document.getElementById('predSubmitBtn');
  const btnText = document.getElementById('predSubmitText');
  const spinner = document.getElementById('predSubmitSpinner');
  btn.disabled = true;
  btnText.textContent = 'Adding...';
  spinner.style.display = 'inline-block';

  const body = {
    match_date: document.getElementById('predDate').value,
    home_team:  document.getElementById('predHome').value.trim(),
    away_team:  document.getElementById('predAway').value.trim(),
    league:     document.getElementById('predLeague').value.trim(),
    prediction: document.getElementById('predTip').value.trim(),
    odds:       document.getElementById('predOdds').value.trim(),
    plan:       document.getElementById('predPlan').value,
  };

  try {
    const res  = await fetch(`${API_BASE}/api/admin/predictions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json();

    btn.disabled = false;
    btnText.textContent = 'Add Prediction';
    spinner.style.display = 'none';

    if (!res.ok) {
      document.getElementById('predFormErrorText').textContent = data.error || 'Failed to add.';
      document.getElementById('predFormError').style.display = 'flex';
      return;
    }

    document.getElementById('predFormSuccess').style.display = 'flex';
    setTimeout(() => { document.getElementById('predFormSuccess').style.display = 'none'; }, 3000);

    // Reset form but keep date
    const dateVal = document.getElementById('predDate').value;
    document.getElementById('predForm').reset();
    document.getElementById('predDate').value = dateVal;

    // Prepend new row to predictions list
    const newPred = { id: data.id, result: 'pending', ...body };
    allPredictions.unshift(newPred);
    renderPredictions();
  } catch {
    btn.disabled = false;
    btnText.textContent = 'Add Prediction';
    spinner.style.display = 'none';
    document.getElementById('predFormErrorText').textContent = 'Connection error. Please try again.';
    document.getElementById('predFormError').style.display = 'flex';
  }
});

async function setPredResult(id, result) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/predictions/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ result }),
    });
    if (!res.ok) { alert((await res.json()).error || 'Failed.'); return; }
    const pred = allPredictions.find(p => p.id === id);
    if (pred) pred.result = result;
    document.getElementById(`predResult-${id}`).innerHTML  = renderResultBadge(result);
    document.getElementById(`predActions-${id}`).innerHTML = renderPredActions({ id, result });
  } catch {
    alert('Connection error. Please try again.');
  }
}

async function deletePrediction(id) {
  if (!confirm('Delete this prediction?')) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/predictions/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) { alert((await res.json()).error || 'Failed.'); return; }
    allPredictions = allPredictions.filter(p => p.id !== id);
    document.getElementById(`predRow-${id}`)?.remove();
    if (allPredictions.length === 0) {
      document.getElementById('predEmpty').style.display = 'block';
    }
  } catch {
    alert('Connection error. Please try again.');
  }
}

// === Helpers ===
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
