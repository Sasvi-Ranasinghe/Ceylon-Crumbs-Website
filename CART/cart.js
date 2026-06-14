/* ============================================================
   Ceylon Crumbs — cart.js
============================================================ */

/* ══════════════════════════════════════════════════════════
   CART UTILITIES
══════════════════════════════════════════════════════════ */
function getCart() {
  try { return JSON.parse(localStorage.getItem('ceylonCrumbsCart')) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem('ceylonCrumbsCart', JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce(function(sum, item) {
    return sum + (item.qty || 1);
  }, 0);
}

/* ══════════════════════════════════════════════════════════
   PRICE PARSER — fix Rs. 200.00 → 200
══════════════════════════════════════════════════════════ */
function parsePrice(val) {
  if (!val) return 0;
  /* Remove "Rs.", spaces, commas — keep digits and dot only */
  var clean = val.toString()
    .replace(/Rs\.?/gi, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
  /* If range "200.00 – 500.00" — take first number */
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
   NAVBAR BADGE
══════════════════════════════════════════════════════════ */
function updateCartBadge() {
  var count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = count;
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
  toastTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 2500);
}

/* ══════════════════════════════════════════════════════════
   HTML ESCAPE
══════════════════════════════════════════════════════════ */
function escHtml(str) {
  return (str || '').toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ══════════════════════════════════════════════════════════
   BUILD CART ITEM ELEMENT — DOM method (no innerHTML quotes issue)
══════════════════════════════════════════════════════════ */
function buildCartItemEl(item, index) {
  var price     = parsePrice(item.price);
  var qty       = item.qty || 1;
  var lineTotal = price * qty;
  var category  = item.category || 'Ceylon Crumbs';

  /* ── Wrapper ── */
  var row = document.createElement('div');
  row.className   = 'cart-item';
  row.dataset.idx = index;

  /* ── Image ── */
  var img = document.createElement('img');
  img.className = 'cart-item-img';
  img.alt       = item.name || 'Product';

  /* Fallback SVG if no image or image fails */
  var fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Crect width='90' height='90' fill='%23FFF8EF'/%3E%3Ctext x='50%25' y='55%25' font-size='32' text-anchor='middle' fill='%23C9933A'%3E%F0%9F%A7%81%3C/text%3E%3C/svg%3E";
  img.src         = (item.img && item.img.trim()) ? item.img : fallbackSrc;
  img.onerror     = function() { this.src = fallbackSrc; this.onerror = null; };

  /* ── Details ── */
  var details = document.createElement('div');
  details.className = 'cart-item-details';

  var name = document.createElement('div');
  name.className   = 'cart-item-name';
  name.textContent = item.name || 'Product';

  var cat = document.createElement('div');
  cat.className   = 'cart-item-category';
  cat.textContent = category;

  var priceEl = document.createElement('div');
  priceEl.className   = 'cart-item-price';
  priceEl.textContent = formatPrice(lineTotal);

  var unitEl = document.createElement('div');
  unitEl.className   = 'cart-item-unit-price';
  unitEl.textContent = formatPrice(price) + ' each';

  details.appendChild(name);
  details.appendChild(cat);
  details.appendChild(priceEl);
  details.appendChild(unitEl);

  /* ── Controls ── */
  var controls = document.createElement('div');
  controls.className = 'cart-item-controls';

  /* Qty Stepper */
  var stepper = document.createElement('div');
  stepper.className = 'qty-stepper';

  var minusBtn = document.createElement('button');
  minusBtn.className        = 'qty-btn qty-minus';
  minusBtn.dataset.idx      = index;
  minusBtn.textContent      = '−';
  minusBtn.setAttribute('aria-label', 'Decrease quantity');

  var qtyInput = document.createElement('input');
  qtyInput.type             = 'number';
  qtyInput.className        = 'qty-value';
  qtyInput.value            = qty;
  qtyInput.min              = '1';
  qtyInput.max              = '99';
  qtyInput.dataset.idx      = index;
  qtyInput.setAttribute('aria-label', 'Quantity');

  var plusBtn = document.createElement('button');
  plusBtn.className         = 'qty-btn qty-plus';
  plusBtn.dataset.idx       = index;
  plusBtn.textContent       = '+';
  plusBtn.setAttribute('aria-label', 'Increase quantity');

  stepper.appendChild(minusBtn);
  stepper.appendChild(qtyInput);
  stepper.appendChild(plusBtn);

  /* Remove Button */
  var removeBtn = document.createElement('button');
  removeBtn.className        = 'remove-btn';
  removeBtn.dataset.idx      = index;
  removeBtn.innerHTML        = '🗑 Remove';
  removeBtn.setAttribute('aria-label', 'Remove item');

  controls.appendChild(stepper);
  controls.appendChild(removeBtn);

  /* ── Assemble row ── */
  row.appendChild(img);
  row.appendChild(details);
  row.appendChild(controls);

  return row;
}

/* ══════════════════════════════════════════════════════════
   RENDER CART
══════════════════════════════════════════════════════════ */
function renderCart() {
  var cart       = getCart();
  var emptyEl    = document.getElementById('emptyCart');
  var contentEl  = document.getElementById('cartContent');
  var listEl     = document.getElementById('cartItemsList');
  var itemCountEl = document.getElementById('itemCount');

  if (!listEl) return;

  /* Empty state */
  if (cart.length === 0) {
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (contentEl) contentEl.style.display = 'none';
    updateSummary();
    updateCartBadge();
    return;
  }

  /* Has items */
  if (emptyEl)   emptyEl.style.display   = 'none';
  if (contentEl) contentEl.style.display = 'grid';

  /* Total qty count */
  var totalQty = cart.reduce(function(s, i) { return s + (i.qty || 1); }, 0);
  if (itemCountEl) {
    itemCountEl.textContent = totalQty + ' item' + (totalQty !== 1 ? 's' : '');
  }

  /* Clear & rebuild list */
  listEl.innerHTML = '';
  cart.forEach(function(item, index) {
    listEl.appendChild(buildCartItemEl(item, index));
  });

  updateSummary();
  updateCartBadge();
  attachItemEvents();
}

/* ══════════════════════════════════════════════════════════
   ORDER SUMMARY
══════════════════════════════════════════════════════════ */
function updateSummary() {
  var cart     = getCart();
  var totalQty = cart.reduce(function(s, i) { return s + (i.qty || 1); }, 0);
  var subtotal = cart.reduce(function(s, i) {
    return s + parsePrice(i.price) * (i.qty || 1);
  }, 0);

  var itemCountEl = document.getElementById('summaryItemCount');
  var subtotalEl  = document.getElementById('summarySubtotal');
  var totalEl     = document.getElementById('summaryTotal');
  var checkoutBtn = document.getElementById('checkoutBtn');

  if (itemCountEl) itemCountEl.textContent = totalQty;
  if (subtotalEl)  subtotalEl.textContent  = formatPrice(subtotal);
  if (totalEl)     totalEl.textContent     = formatPrice(subtotal);
  if (checkoutBtn) {
    checkoutBtn.style.opacity      = cart.length === 0 ? '0.5' : '1';
    checkoutBtn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
  }
}

/* ══════════════════════════════════════════════════════════
   ITEM EVENTS
══════════════════════════════════════════════════════════ */
function attachItemEvents() {

  /* Minus */
  document.querySelectorAll('.qty-minus').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx  = parseInt(btn.dataset.idx);
      var cart = getCart();
      if (!cart[idx]) return;
      if (cart[idx].qty > 1) {
        cart[idx].qty -= 1;
      }
      saveCart(cart);
      renderCart();
      showToast('Quantity updated');
    });
  });

  /* Plus */
  document.querySelectorAll('.qty-plus').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx  = parseInt(btn.dataset.idx);
      var cart = getCart();
      if (!cart[idx]) return;
      cart[idx].qty = (cart[idx].qty || 1) + 1;
      saveCart(cart);
      renderCart();
      showToast('Quantity updated');
    });
  });

  /* Manual input */
  document.querySelectorAll('.qty-value').forEach(function(input) {
    input.addEventListener('change', function() {
      var idx  = parseInt(input.dataset.idx);
      var val  = parseInt(input.value);
      var cart = getCart();
      if (!cart[idx]) return;
      if (isNaN(val) || val < 1) val = 1;
      if (val > 99) val = 99;
      cart[idx].qty = val;
      saveCart(cart);
      renderCart();
      showToast('Quantity updated');
    });
  });

  /* Remove */
  document.querySelectorAll('.remove-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx  = parseInt(btn.dataset.idx);
      var cart = getCart();
      if (!cart[idx]) return;
      var name = cart[idx].name;
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
      showToast('\u2713 "' + name + '" removed');
    });
  });
}

/* ══════════════════════════════════════════════════════════
   UPDATE CART BUTTON
══════════════════════════════════════════════════════════ */
function initUpdateCart() {
  var btn = document.getElementById('updateCartBtn');
  if (!btn) return;
  btn.addEventListener('click', function() {
    renderCart();
    showToast('\u2713 Cart updated!');
    btn.textContent       = '\u2713 Updated!';
    btn.style.background  = '#4CAF50';
    btn.style.color       = '#fff';
    btn.style.borderColor = '#4CAF50';
    setTimeout(function() {
      btn.textContent       = '\uD83D\uDD04 Update Cart';
      btn.style.background  = '';
      btn.style.color       = '';
      btn.style.borderColor = '';
    }, 1800);
  });
}

/* ══════════════════════════════════════════════════════════
   CHECKOUT BUTTON
══════════════════════════════════════════════════════════ */
function initCheckout() {
  var btn = document.getElementById('checkoutBtn');
  if (!btn) return;
  btn.addEventListener('click', function(e) {
    if (getCart().length === 0) {
      e.preventDefault();
      showToast('Your cart is empty!');
    }
  });
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

  function openMenu() {
    if (menu)      menu.style.display = 'block';
    if (overlay)   overlay.classList.add('active');
    if (hamburger) hamburger.classList.add('open');
  }
  function closeMenu() {
    if (menu)      menu.style.display = 'none';
    if (overlay)   overlay.classList.remove('active');
    if (hamburger) hamburger.classList.remove('open');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);
}

/* ══════════════════════════════════════════════════════════
   SEARCH TOGGLE
══════════════════════════════════════════════════════════ */
function initSearchToggle() {
  var toggleBtn = document.getElementById('search-toggle');
  var searchBox = document.getElementById('search-box');
  if (!toggleBtn || !searchBox) return;

  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    searchBox.classList.toggle('open');
    if (searchBox.classList.contains('open')) {
      var inp = searchBox.querySelector('input');
      if (inp) inp.focus();
    }
  });

  document.addEventListener('click', function(e) {
    if (!searchBox.contains(e.target) && e.target !== toggleBtn) {
      searchBox.classList.remove('open');
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
  renderCart();
  initUpdateCart();
  initCheckout();
});
