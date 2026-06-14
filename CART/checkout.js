/* ============================================================
   Ceylon Crumbs — checkout.js
============================================================ */

/* ══════════════════════════════════════════════════════════
   CART UTILITIES
══════════════════════════════════════════════════════════ */
function getCart() {
  try { return JSON.parse(localStorage.getItem('ceylonCrumbsCart')) || []; }
  catch (e) { return []; }
}

function clearCart() {
  localStorage.removeItem('ceylonCrumbsCart');
}

function getCartCount() {
  return getCart().reduce(function(s, i) { return s + (i.qty || 1); }, 0);
}

function updateCartBadge() {
  var count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent   = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   PRICE PARSER
══════════════════════════════════════════════════════════ */
function parsePrice(val) {
  if (!val) return 0;
  var clean = val.toString()
    .replace(/Rs\.?/gi, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
  var match = clean.match(/[\d]+\.?\d*/);
  return match ? parseFloat(match[0]) : 0;
}

function formatPrice(num) {
  return 'Rs. ' + num.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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
   RENDER ORDER SUMMARY
══════════════════════════════════════════════════════════ */
function renderSummary() {
  var cart        = getCart();
  var itemsEl     = document.getElementById('summaryItems');
  var qtyEl       = document.getElementById('summaryQty');
  var subtotalEl  = document.getElementById('summarySubtotal');
  var totalEl     = document.getElementById('summaryTotal');

  if (!itemsEl) return;

  /* Empty cart */
  if (cart.length === 0) {
    document.getElementById('emptyCheckout').style.display  = 'block';
    document.getElementById('checkoutLayout').style.display = 'none';
    return;
  }

  /* Build items */
  itemsEl.innerHTML = '';

  var totalQty  = 0;
  var subtotal  = 0;

  var fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52'%3E%3Crect width='52' height='52' fill='%23FFF8EF'/%3E%3Ctext x='50%25' y='55%25' font-size='22' text-anchor='middle' fill='%23C9933A'%3E%F0%9F%A7%81%3C/text%3E%3C/svg%3E";

  cart.forEach(function(item) {
    var qty       = item.qty || 1;
    var price     = parsePrice(item.price);
    var lineTotal = price * qty;

    totalQty += qty;
    subtotal += lineTotal;

    var row = document.createElement('div');
    row.className = 'summary-item';

    var img = document.createElement('img');
    img.className = 'summary-item-img';
    img.alt       = item.name || 'Product';
    img.src       = (item.img && item.img.trim()) ? item.img : fallback;
    img.onerror   = function() { this.src = fallback; this.onerror = null; };

    var info = document.createElement('div');
    info.className = 'summary-item-info';

    var name = document.createElement('div');
    name.className   = 'summary-item-name';
    name.textContent = item.name || 'Product';

    var qtyLabel = document.createElement('div');
    qtyLabel.className   = 'summary-item-qty';
    qtyLabel.textContent = 'Qty: ' + qty;

    info.appendChild(name);
    info.appendChild(qtyLabel);

    var priceEl = document.createElement('div');
    priceEl.className   = 'summary-item-price';
    priceEl.textContent = formatPrice(lineTotal);

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(priceEl);
    itemsEl.appendChild(row);
  });

  /* Totals */
  if (qtyEl)      qtyEl.textContent      = totalQty;
  if (subtotalEl) subtotalEl.textContent  = formatPrice(subtotal);
  if (totalEl)    totalEl.textContent     = formatPrice(subtotal);
}

/* ══════════════════════════════════════════════════════════
   PAYMENT METHOD TOGGLE
══════════════════════════════════════════════════════════ */
function initPaymentToggle() {
  var radios      = document.querySelectorAll('input[name="payment"]');
  var cardDetails = document.getElementById('cardDetails');
  var codOption   = document.getElementById('codOption');
  var cardOption  = document.getElementById('cardOption');

  radios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      /* Update selected styles */
      if (codOption)  codOption.classList.toggle('selected',  radio.value === 'cod'  && radio.checked);
      if (cardOption) cardOption.classList.toggle('selected', radio.value === 'card' && radio.checked);

      /* All options: remove selected, then add to checked */
      document.querySelectorAll('.payment-option').forEach(function(opt) {
        var inp = opt.querySelector('input[type="radio"]');
        opt.classList.toggle('selected', inp && inp.checked);
      });

      /* Show/hide card details */
      if (cardDetails) {
        cardDetails.style.display = (radio.value === 'card' && radio.checked) ? 'block' : 'none';
      }
    });
  });

  /* Clicking the label */
  document.querySelectorAll('.payment-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      var inp = opt.querySelector('input[type="radio"]');
      if (inp) inp.dispatchEvent(new Event('change'));
    });
  });
}

/* ══════════════════════════════════════════════════════════
   CARD NUMBER FORMATTING
══════════════════════════════════════════════════════════ */
function initCardFormatting() {
  var cardNum = document.getElementById('cardNumber');
  var expiry  = document.getElementById('cardExpiry');

  if (cardNum) {
    cardNum.addEventListener('input', function() {
      var val = cardNum.value.replace(/\D/g, '').substring(0, 16);
      cardNum.value = val.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  if (expiry) {
    expiry.addEventListener('input', function() {
      var val = expiry.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        expiry.value = val.substring(0, 2) + ' / ' + val.substring(2);
      } else {
        expiry.value = val;
      }
    });
  }
}

/* ══════════════════════════════════════════════════════════
   VALIDATION HELPERS
══════════════════════════════════════════════════════════ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim());
}

function setError(inputId, errId, msg) {
  var inp = document.getElementById(inputId);
  var err = document.getElementById(errId);
  if (inp) { inp.classList.add('input-error'); inp.classList.remove('input-ok'); }
  if (err) err.textContent = msg;
}

function clearError(inputId, errId) {
  var inp = document.getElementById(inputId);
  var err = document.getElementById(errId);
  if (inp) { inp.classList.remove('input-error'); }
  if (err) err.textContent = '';
}

function setOk(inputId) {
  var inp = document.getElementById(inputId);
  if (inp) { inp.classList.remove('input-error'); inp.classList.add('input-ok'); }
}

/* ── Live validation on blur ── */
function initLiveValidation() {
  var fields = [
    { id: 'fullName',   errId: 'fullNameErr',   check: function(v) { return v.trim() ? '' : 'Full name is required'; } },
    { id: 'email',      errId: 'emailErr',       check: function(v) { return !v.trim() ? 'Email is required' : !isValidEmail(v) ? 'Enter a valid email' : ''; } },
    { id: 'phone',      errId: 'phoneErr',       check: function(v) { return !v.trim() ? 'Phone number is required' : !isValidPhone(v) ? 'Enter a valid phone number' : ''; } },
    { id: 'address1',   errId: 'address1Err',    check: function(v) { return v.trim() ? '' : 'Address is required'; } },
    { id: 'city',       errId: 'cityErr',        check: function(v) { return v.trim() ? '' : 'City is required'; } },
    { id: 'postalCode', errId: 'postalCodeErr',  check: function(v) { return v.trim() ? '' : 'Postal code is required'; } }
  ];

  fields.forEach(function(f) {
    var inp = document.getElementById(f.id);
    if (!inp) return;
    inp.addEventListener('blur', function() {
      var msg = f.check(inp.value);
      if (msg) { setError(f.id, f.errId, msg); }
      else      { clearError(f.id, f.errId); setOk(f.id); }
    });
    inp.addEventListener('input', function() {
      if (inp.classList.contains('input-error')) {
        var msg = f.check(inp.value);
        if (!msg) { clearError(f.id, f.errId); setOk(f.id); }
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════
   VALIDATE ALL FIELDS
══════════════════════════════════════════════════════════ */
function validateForm() {
  var valid = true;

  /* Full Name */
  var fullName = document.getElementById('fullName');
  if (!fullName || !fullName.value.trim()) {
    setError('fullName', 'fullNameErr', 'Full name is required'); valid = false;
  } else { clearError('fullName', 'fullNameErr'); setOk('fullName'); }

  /* Email */
  var email = document.getElementById('email');
  if (!email || !email.value.trim()) {
    setError('email', 'emailErr', 'Email address is required'); valid = false;
  } else if (!isValidEmail(email.value)) {
    setError('email', 'emailErr', 'Enter a valid email address'); valid = false;
  } else { clearError('email', 'emailErr'); setOk('email'); }

  /* Phone */
  var phone = document.getElementById('phone');
  if (!phone || !phone.value.trim()) {
    setError('phone', 'phoneErr', 'Phone number is required'); valid = false;
  } else if (!isValidPhone(phone.value)) {
    setError('phone', 'phoneErr', 'Enter a valid phone number'); valid = false;
  } else { clearError('phone', 'phoneErr'); setOk('phone'); }

  /* Address 1 */
  var address1 = document.getElementById('address1');
  if (!address1 || !address1.value.trim()) {
    setError('address1', 'address1Err', 'Address is required'); valid = false;
  } else { clearError('address1', 'address1Err'); setOk('address1'); }

  /* City */
  var city = document.getElementById('city');
  if (!city || !city.value.trim()) {
    setError('city', 'cityErr', 'City is required'); valid = false;
  } else { clearError('city', 'cityErr'); setOk('city'); }

  /* Postal Code */
  var postal = document.getElementById('postalCode');
  if (!postal || !postal.value.trim()) {
    setError('postalCode', 'postalCodeErr', 'Postal code is required'); valid = false;
  } else { clearError('postalCode', 'postalCodeErr'); setOk('postalCode'); }

  return valid;
}

/* ══════════════════════════════════════════════════════════
   GENERATE ORDER ID
══════════════════════════════════════════════════════════ */
function generateOrderId() {
  var ts   = Date.now().toString(36).toUpperCase();
  var rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return 'CC-' + ts + '-' + rand;
}

/* ══════════════════════════════════════════════════════════
   PLACE ORDER
══════════════════════════════════════════════════════════ */
function placeOrder(btn) {
  if (!validateForm()) {
    /* Scroll to first error */
    var firstError = document.querySelector('.input-error');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Please fill in all required fields');
    return;
  }

  /* Loading state */
  btn.classList.add('btn-loading');
  btn.textContent = 'Processing';
  btn.disabled    = true;

  /* Collect form data */
  var payment = document.querySelector('input[name="payment"]:checked');
  var order = {
    id:        generateOrderId(),
    timestamp: new Date().toISOString(),
    customer: {
      name:       document.getElementById('fullName').value.trim(),
      email:      document.getElementById('email').value.trim(),
      phone:      document.getElementById('phone').value.trim()
    },
    delivery: {
      address1:   document.getElementById('address1').value.trim(),
      address2:   document.getElementById('address2') ? document.getElementById('address2').value.trim() : '',
      city:       document.getElementById('city').value.trim(),
      postalCode: document.getElementById('postalCode').value.trim()
    },
    notes:     document.getElementById('orderNotes') ? document.getElementById('orderNotes').value.trim() : '',
    payment:   payment ? payment.value : 'cod',
    items:     getCart(),
    subtotal:  getCart().reduce(function(s, i) { return s + parsePrice(i.price) * (i.qty || 1); }, 0)
  };

  /* Save order to localStorage */
  try {
    var orders = JSON.parse(localStorage.getItem('ceylonCrumbsOrders') || '[]');
    orders.push(order);
    localStorage.setItem('ceylonCrumbsOrders', JSON.stringify(orders));
    localStorage.setItem('ceylonCrumbsLastOrder', JSON.stringify(order));
  } catch (e) {
    console.warn('Could not save order:', e);
  }

  /* Simulate processing delay */
  setTimeout(function() {
    /* Clear cart */
    clearCart();
    updateCartBadge();

    /* Show success */
    document.getElementById('checkoutLayout').style.display = 'none';
    var successEl = document.getElementById('orderSuccess');
    successEl.style.display = 'block';

    /* Show order ID */
    var orderIdEl = document.getElementById('successOrderId');
    if (orderIdEl) orderIdEl.textContent = 'Order Reference: ' + order.id;

    /* Scroll to success */
    successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    showToast('\u2713 Order placed! Order ID: ' + order.id);

    btn.classList.remove('btn-loading');
    btn.disabled    = false;
  }, 1800);
}

/* ══════════════════════════════════════════════════════════
   INIT PLACE ORDER BUTTONS
══════════════════════════════════════════════════════════ */
function initPlaceOrder() {
  var desktop = document.getElementById('placeOrderDesktop');
  var mobile  = document.getElementById('placeOrderMobile');

  if (desktop) desktop.addEventListener('click', function() { placeOrder(desktop); });
  if (mobile)  mobile.addEventListener('click',  function() { placeOrder(mobile);  });
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initMobileMenu();
  initSearchToggle();
  updateCartBadge();
  renderSummary();
  initPaymentToggle();
  initCardFormatting();
  initLiveValidation();
  initPlaceOrder();
});
