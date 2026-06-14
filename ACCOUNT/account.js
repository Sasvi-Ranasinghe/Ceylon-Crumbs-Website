/* ============================================================
   Ceylon Crumbs — account.js
============================================================ */

/* ══════════════════════════════════════════════════════════
   CART UTILITIES
══════════════════════════════════════════════════════════ */
function getCart() {
  try { return JSON.parse(localStorage.getItem('ceylonCrumbsCart')) || []; }
  catch (e) { return []; }
}

function getCartCount() {
  return getCart().reduce(function(sum, i) { return sum + (i.qty || 1); }, 0);
}

function updateCartBadge() {
  var count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent   = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
var toastTimer = null;
function showToast(msg) {
  var toast = document.getElementById('cart-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 2800);
}

/* ══════════════════════════════════════════════════════════
   STICKY HEADER
══════════════════════════════════════════════════════════ */
function initStickyHeader() {
  var header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('stuck', window.scrollY > 80);
  });
}

/* ══════════════════════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var closeBtn  = document.getElementById('close-menu');
  var overlay   = document.getElementById('menu-overlay');
  var menu      = document.getElementById('main-menu');

  function openMenu()  { if(menu) menu.style.display='block'; if(overlay) overlay.classList.add('active'); if(hamburger) hamburger.classList.add('open'); }
  function closeMenu() { if(menu) menu.style.display='none';  if(overlay) overlay.classList.remove('active'); if(hamburger) hamburger.classList.remove('open'); }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);
}

/* ══════════════════════════════════════════════════════════
   SEARCH TOGGLE
══════════════════════════════════════════════════════════ */
function initSearchToggle() {
  var btn = document.getElementById('search-toggle');
  var box = document.getElementById('search-box');
  if (!btn || !box) return;

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    box.classList.toggle('open');
    if (box.classList.contains('open')) {
      var inp = box.querySelector('input');
      if (inp) inp.focus();
    }
  });

  document.addEventListener('click', function(e) {
    if (!box.contains(e.target) && e.target !== btn) {
      box.classList.remove('open');
    }
  });
}

/* ══════════════════════════════════════════════════════════
   USER DATA — localStorage helpers
══════════════════════════════════════════════════════════ */
var USERS_KEY   = 'ceylonCrumbsUsers';
var SESSION_KEY = 'ceylonCrumbsSession';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch (e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch (e) { return null; }
}

function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function findUser(email) {
  return getUsers().find(function(u) {
    return u.email.toLowerCase() === email.toLowerCase();
  }) || null;
}

/* ══════════════════════════════════════════════════════════
   VALIDATION HELPERS
══════════════════════════════════════════════════════════ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(fieldId, errId, msg) {
  var field = document.getElementById(fieldId);
  var err   = document.getElementById(errId);
  if (field) field.classList.add('input-error');
  if (field) field.classList.remove('input-ok');
  if (err)   err.textContent = msg;
}

function clearError(fieldId, errId) {
  var field = document.getElementById(fieldId);
  var err   = document.getElementById(errId);
  if (field) field.classList.remove('input-error');
  if (err)   err.textContent = '';
}

function setOk(fieldId) {
  var field = document.getElementById(fieldId);
  if (field) { field.classList.remove('input-error'); field.classList.add('input-ok'); }
}

/* ══════════════════════════════════════════════════════════
   PASSWORD STRENGTH
══════════════════════════════════════════════════════════ */
function checkStrength(pw) {
  var score = 0;
  if (pw.length >= 6)               score++;
  if (pw.length >= 10)              score++;
  if (/[A-Z]/.test(pw))            score++;
  if (/[0-9]/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw))     score++;
  return score;
}

function initPasswordStrength() {
  var input     = document.getElementById('signupPassword');
  var bar       = document.getElementById('pwStrengthBar');
  var label     = document.getElementById('pwStrengthLabel');
  var wrap      = document.getElementById('pwStrength');
  if (!input || !bar || !label || !wrap) return;

  var levels = [
    { label: 'Very Weak', color: '#C0392B', width: '20%' },
    { label: 'Weak',      color: '#E67E22', width: '40%' },
    { label: 'Fair',      color: '#F1C40F', width: '60%' },
    { label: 'Good',      color: '#27AE60', width: '80%' },
    { label: 'Strong',    color: '#1ABC9C', width: '100%' }
  ];

  input.addEventListener('input', function() {
    var pw    = input.value;
    wrap.style.display = pw.length ? 'block' : 'none';
    var score = Math.max(0, Math.min(4, checkStrength(pw) - 1));
    var lv    = levels[score];
    bar.style.width      = lv.width;
    bar.style.background = lv.color;
    label.textContent    = lv.label;
    label.style.color    = lv.color;
  });
}

/* ══════════════════════════════════════════════════════════
   PASSWORD SHOW / HIDE TOGGLE
══════════════════════════════════════════════════════════ */
function initPasswordToggles() {
  document.querySelectorAll('.pw-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.dataset.target;
      var input    = document.getElementById(targetId);
      if (!input) return;
      var isText   = input.type === 'text';
      input.type   = isText ? 'password' : 'text';
      btn.textContent = isText ? '👁' : '🙈';
    });
  });
}

/* ══════════════════════════════════════════════════════════
   LIVE VALIDATION — blur events
══════════════════════════════════════════════════════════ */
function initLiveValidation() {
  /* Login */
  var lEmail = document.getElementById('loginEmail');
  var lPw    = document.getElementById('loginPassword');

  if (lEmail) lEmail.addEventListener('blur', function() {
    if (!lEmail.value.trim()) { setError('loginEmail','loginEmailErr','Email is required'); }
    else if (!isValidEmail(lEmail.value)) { setError('loginEmail','loginEmailErr','Enter a valid email'); }
    else { clearError('loginEmail','loginEmailErr'); setOk('loginEmail'); }
  });

  if (lPw) lPw.addEventListener('blur', function() {
    if (!lPw.value) { setError('loginPassword','loginPasswordErr','Password is required'); }
    else { clearError('loginPassword','loginPasswordErr'); setOk('loginPassword'); }
  });

  /* Signup */
  var sName    = document.getElementById('signupName');
  var sEmail   = document.getElementById('signupEmail');
  var sPw      = document.getElementById('signupPassword');
  var sConfirm = document.getElementById('signupConfirm');

  if (sName) sName.addEventListener('blur', function() {
    if (!sName.value.trim()) { setError('signupName','signupNameErr','Full name is required'); }
    else { clearError('signupName','signupNameErr'); setOk('signupName'); }
  });

  if (sEmail) sEmail.addEventListener('blur', function() {
    if (!sEmail.value.trim()) { setError('signupEmail','signupEmailErr','Email is required'); }
    else if (!isValidEmail(sEmail.value)) { setError('signupEmail','signupEmailErr','Enter a valid email'); }
    else { clearError('signupEmail','signupEmailErr'); setOk('signupEmail'); }
  });

  if (sConfirm) sConfirm.addEventListener('blur', function() {
    if (!sConfirm.value) { setError('signupConfirm','signupConfirmErr','Please confirm your password'); }
    else if (sPw && sConfirm.value !== sPw.value) { setError('signupConfirm','signupConfirmErr','Passwords do not match'); }
    else { clearError('signupConfirm','signupConfirmErr'); setOk('signupConfirm'); }
  });
}

/* ══════════════════════════════════════════════════════════
   LOGIN FORM
══════════════════════════════════════════════════════════ */
function initLoginForm() {
  var form    = document.getElementById('loginForm');
  var success = document.getElementById('loginSuccess');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value.trim();
    var pw    = document.getElementById('loginPassword').value;
    var valid = true;

    /* Validate */
    if (!email) { setError('loginEmail','loginEmailErr','Email is required'); valid = false; }
    else if (!isValidEmail(email)) { setError('loginEmail','loginEmailErr','Enter a valid email'); valid = false; }
    else { clearError('loginEmail','loginEmailErr'); }

    if (!pw) { setError('loginPassword','loginPasswordErr','Password is required'); valid = false; }
    else { clearError('loginPassword','loginPasswordErr'); }

    if (!valid) return;

    /* Check user exists */
    var user = findUser(email);
    if (!user) {
      setError('loginEmail','loginEmailErr','No account found with this email');
      return;
    }
    if (user.password !== pw) {
      setError('loginPassword','loginPasswordErr','Incorrect password');
      return;
    }

    /* Remember me */
    var remember = document.getElementById('rememberMe');
    if (remember && remember.checked) {
      localStorage.setItem('ceylonCrumbsRemember', email);
    }

    /* Save session */
    saveSession({ name: user.name, email: user.email });

    /* Show success */
    if (success) success.style.display = 'flex';
    form.style.opacity = '0.4';
    showToast('\u2713 Welcome back, ' + user.name.split(' ')[0] + '!');

    /* Show dashboard */
    setTimeout(function() { showDashboard({ name: user.name, email: user.email }); }, 1200);
  });
}

/* ══════════════════════════════════════════════════════════
   SIGNUP FORM
══════════════════════════════════════════════════════════ */
function initSignupForm() {
  var form    = document.getElementById('signupForm');
  var success = document.getElementById('signupSuccess');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name    = document.getElementById('signupName').value.trim();
    var email   = document.getElementById('signupEmail').value.trim();
    var pw      = document.getElementById('signupPassword').value;
    var confirm = document.getElementById('signupConfirm').value;
    var terms   = document.getElementById('agreeTerms');
    var valid   = true;

    /* Name */
    if (!name) { setError('signupName','signupNameErr','Full name is required'); valid = false; }
    else        { clearError('signupName','signupNameErr'); setOk('signupName'); }

    /* Email */
    if (!email) { setError('signupEmail','signupEmailErr','Email is required'); valid = false; }
    else if (!isValidEmail(email)) { setError('signupEmail','signupEmailErr','Enter a valid email'); valid = false; }
    else if (findUser(email)) { setError('signupEmail','signupEmailErr','An account with this email already exists'); valid = false; }
    else { clearError('signupEmail','signupEmailErr'); setOk('signupEmail'); }

    /* Password */
    if (!pw) { setError('signupPassword','signupPasswordErr','Password is required'); valid = false; }
    else if (pw.length < 6) { setError('signupPassword','signupPasswordErr','Password must be at least 6 characters'); valid = false; }
    else { clearError('signupPassword','signupPasswordErr'); setOk('signupPassword'); }

    /* Confirm */
    if (!confirm) { setError('signupConfirm','signupConfirmErr','Please confirm your password'); valid = false; }
    else if (confirm !== pw) { setError('signupConfirm','signupConfirmErr','Passwords do not match'); valid = false; }
    else { clearError('signupConfirm','signupConfirmErr'); setOk('signupConfirm'); }

    /* Terms */
    if (terms && !terms.checked) {
      document.getElementById('agreeTermsErr').textContent = 'Please accept the terms to continue';
      valid = false;
    } else {
      var termsErr = document.getElementById('agreeTermsErr');
      if (termsErr) termsErr.textContent = '';
    }

    if (!valid) return;

    /* Save user */
    var users = getUsers();
    users.push({ name: name, email: email, password: pw, created: Date.now() });
    saveUsers(users);
    saveSession({ name: name, email: email });

    /* Show success */
    if (success) success.style.display = 'flex';
    form.style.opacity = '0.4';
    showToast('\u2713 Welcome to Ceylon Crumbs, ' + name.split(' ')[0] + '!');

    /* Show dashboard */
    setTimeout(function() { showDashboard({ name: name, email: email }); }, 1400);
  });
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════ */
function showDashboard(user) {
  var forms     = document.getElementById('authForms');
  var dashboard = document.getElementById('accountDashboard');
  var dashName  = document.getElementById('dashName');
  var dashEmail = document.getElementById('dashEmail');
  var dashAvatar = document.getElementById('dashAvatar');

  if (forms)     forms.style.display     = 'none';
  if (dashboard) dashboard.style.display = 'block';

  if (dashName)  dashName.textContent  = 'Welcome back, ' + user.name.split(' ')[0] + '!';
  if (dashEmail) dashEmail.textContent = user.email;

  /* Avatar initial */
  if (dashAvatar) dashAvatar.textContent = user.name.charAt(0).toUpperCase();
}

function initDashboard() {
  /* Check for existing session */
  var session = getSession();
  if (session) {
    showDashboard(session);
  }

  /* Logout */
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      clearSession();
      var forms     = document.getElementById('authForms');
      var dashboard = document.getElementById('accountDashboard');
      if (dashboard) dashboard.style.display = 'none';
      if (forms)     forms.style.display     = 'grid';
      showToast('You have been signed out');
      /* Reset forms */
      var lf = document.getElementById('loginForm');
      var sf = document.getElementById('signupForm');
      if (lf) { lf.reset(); lf.style.opacity = ''; }
      if (sf) { sf.reset(); sf.style.opacity = ''; }
      var ls = document.getElementById('loginSuccess');
      var ss = document.getElementById('signupSuccess');
      if (ls) ls.style.display = 'none';
      if (ss) ss.style.display = 'none';
    });
  }

  /* Pre-fill remembered email */
  var remembered = localStorage.getItem('ceylonCrumbsRemember');
  if (remembered) {
    var lEmail = document.getElementById('loginEmail');
    var rem    = document.getElementById('rememberMe');
    if (lEmail) lEmail.value   = remembered;
    if (rem)    rem.checked    = true;
  }
}


/* ══════════════════════════════════════════════════════════
   FORGOT PASSWORD (simple demo)
══════════════════════════════════════════════════════════ */
function initForgotPassword() {
  var link = document.querySelector('.forgot-link');
  if (!link) return;
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var emailInput = document.getElementById('loginEmail');
    var email      = emailInput ? emailInput.value.trim() : '';

    if (!email || !isValidEmail(email)) {
      setError('loginEmail','loginEmailErr','Enter your email above first');
      if (emailInput) emailInput.focus();
      return;
    }

    var user = findUser(email);
    if (user) {
      showToast('\uD83D\uDCE7 Password reset link sent to ' + email);
    } else {
      showToast('\u274C No account found for ' + email);
    }
  });
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initMobileMenu();
  initSearchToggle();
  updateCartBadge();
  initDashboard();
  initLoginForm();
  initSignupForm();
  initPanelSwitch();
  initPasswordToggles();
  initPasswordStrength();
  initLiveValidation();
  initForgotPassword();
});
