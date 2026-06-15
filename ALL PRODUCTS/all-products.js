
/* ── Cart Utilities ──────────────────────────────────────── */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('ceylonCrumbsCart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('ceylonCrumbsCart', JSON.stringify(cart));
}

function getCartCount() {
  return getCart().reduce(function(sum, item) { return sum + (item.qty || 1); }, 0);
}

function updateCartBadge() {
  var count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(id, name, price, imgSrc, category, weight) {

  var cart = getCart();

  var existing = cart.find(function(item) {
    return item.id === id && item.weight === weight;
  });

  if (existing) {

    existing.qty = (existing.qty || 1) + 1;

  } else {

    cart.push({
      id       : id,
      name     : name,
      price    : price,
      qty      : 1,
      img      : imgSrc || '',
      category : category || 'CEYLON CRUMBS',
      weight   : weight || ''
    });

  }

  saveCart(cart);
  updateCartBadge();

  showToast('✓ "' + name + '" added to cart');
}

/* ── Toast Notification ──────────────────────────────────── */

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

/* ── Sticky Header ───────────────────────────────────────── */

function initStickyHeader() {
  var header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('stuck', window.scrollY > 90);
  });
}

/* ── Mobile Menu ─────────────────────────────────────────── */

function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var overlay   = document.getElementById('menu-overlay');
  var menu      = document.getElementById('main-menu');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      if (menu) menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      if (overlay) overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      if (menu) menu.style.display = 'none';
      overlay.classList.remove('active');
      if (hamburger) hamburger.classList.remove('open');
    });
  }
}

/* ── Search Toggle ───────────────────────────────────────── */

function initSearchToggle() {
  var toggleBtn = document.getElementById('search-toggle');
  var searchBox = document.getElementById('search-box');
  if (!toggleBtn || !searchBox) return;

  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    searchBox.classList.toggle('open');
    if (searchBox.classList.contains('open')) {
      var input = searchBox.querySelector('input');
      if (input) input.focus();
    }
  });

  document.addEventListener('click', function(e) {
    if (!searchBox.contains(e.target) && e.target !== toggleBtn) {
      searchBox.classList.remove('open');
    }
  });
}

/* ── Get Category from Section ───────────────────────────── */

function getCategoryFromSection(card) {
  var section = card ? card.closest('section[id]') : null;
  if (!section) return 'CEYLON CRUMBS';
  var id = section.id.toLowerCase();
  var map = {
    'savoury'               : 'SAVOURY',
    'cake'                  : 'CAKE',
    'gateau'                : 'GATEAU',
    'sweet'                 : 'SWEET',
    'lunch'                 : 'LUNCH',
    'beverages'             : 'BEVERAGES',
    'cheesecakeandbentocake': 'CHEESECAKE & BENTO'
  };
  return map[id] || 'CEYLON CRUMBS';
}

/* ── Get Image Path ──────────────────────────────────────── */

function getRelativeImgPath(imgEl) {
  if (!imgEl) return '';
  /* Prefer the src attribute (relative path) over .src (absolute) */
  return imgEl.getAttribute('src') || imgEl.src || '';
}

/* ── Add-to-Cart Buttons ─────────────────────────────────── */

function initAddToCart() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.ajax_add_to_cart, .atc-btn');
    if (!btn) return;

    var card    = btn.closest('.box, .product-card, .product-small');
    var nameEl  = card ? card.querySelector('.product-title, .product-name') : null;
    var priceEl = card ? card.querySelector('.price, .product-price') : null;
    var imgEl   = card ? card.querySelector('img') : null;

    var name     = nameEl  ? nameEl.textContent.trim()  : 'Product';
    var price    = priceEl ? priceEl.textContent.trim() : 'Rs. 0.00';
    var weight = '';

var weightSel = card ? card.querySelector('.option-select') : null;

if(weightSel){

  weight = weightSel.value;

  var selectedOpt =
    weightSel.options[weightSel.selectedIndex];

  if(selectedOpt && selectedOpt.dataset.price){

    price =
      'Rs. ' +
      parseFloat(selectedOpt.dataset.price)
      .toLocaleString('en-LK',{
        minimumFractionDigits:2,
        maximumFractionDigits:2
      });

  }

}
    var imgSrc   = getRelativeImgPath(imgEl);
    var category = getCategoryFromSection(card);

    /* Use product_id for consistent ID across pages */
    var id = btn.dataset.product_id || btn.dataset.id || name.toLowerCase().replace(/\s+/g, '-');

    addToCart(
  id,
  name,
  price,
  imgSrc,



  category,
  weight
);

    btn.textContent = 'Added \u2713';
    btn.classList.add('added');
    btn.disabled = true;
    setTimeout(function() {
      btn.textContent = 'Add to cart';
      btn.classList.remove('added');
      btn.disabled = false;
    }, 1400);
  });
}

/* ── Select Options → Product Detail Page ───────────────── */

function initSelectOptions() {

  document.addEventListener('click', function(e) {

    var btn = e.target.closest('.select-options-btn');

    if (!btn) return;

    e.preventDefault();

    var optionsPanel =
      btn.parentElement.querySelector('.product-options');

    if (optionsPanel) {
      optionsPanel.classList.toggle('active');
    }

  });
}

/* ── Sorting Functionality ───────────────────────────────── */

function sortProducts(sortType){

  document.querySelectorAll('.products-grid').forEach(function(grid){

    const cards = Array.from(
      grid.querySelectorAll('.product-small.box')
    );

    cards.sort(function(a,b){

      const nameA =
        (a.querySelector('.product-title')?.textContent || '')
        .trim()
        .toLowerCase();

      const nameB =
        (b.querySelector('.product-title')?.textContent || '')
        .trim()
        .toLowerCase();

      const priceA =
        parseFloat(
          (a.querySelector('.price')?.textContent || '0')
          .replace(/Rs\./g,'')
          .replace(/,/g,'')
        ) || 0;

      const priceB =
        parseFloat(
          (b.querySelector('.price')?.textContent || '0')
          .replace(/Rs\./g,'')
          .replace(/,/g,'')
        ) || 0;

      if(sortType === 'price-asc'){
        return priceA - priceB;
      }

      if(sortType === 'price-desc'){
        return priceB - priceA;
      }

      if(sortType === 'name-asc'){
        return nameA.localeCompare(nameB);
      }

      return 0;
    });

    cards.forEach(function(card){
      grid.appendChild(card);
    });

  });

}
      
  /* Handle product card clicks for detail page navigation */
  document.addEventListener('click', function(e) {
    var card = e.target.closest('.product-card');
    if (!card) return;

    var nameEl = card.querySelector('.product-name');
    var imgEl = card.querySelector('img');
    var priceEl = card.querySelector('.product-price');
    var selectedPrice = priceEl ? priceEl.textContent.trim() : '';
    var selectedWeight = '';

    var onSale = card.classList.contains('on-sale');

    /* Get correct image src — use attribute not .src to keep relative path */
    var imgSrc = imgEl ? (imgEl.getAttribute('src') || imgEl.src || '') : '';

    /* Save all product data to sessionStorage for product detail page */
    sessionStorage.setItem('selectedProduct', JSON.stringify({
      name    : nameEl ? nameEl.textContent.trim() : 'Product',
      price   : selectedPrice,
      img     : imgSrc,
      weight  : selectedWeight,
      category: getCategoryFromSection(card),
      onSale  : onSale
    }));

    /* Navigate to product detail page */
    window.location.href = '../PRODUCT/product-detail.html';
  });


/* ── Filter Bar ──────────────────────────────────────────── */

function initFilterBar() {
  var filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  var sections = document.querySelectorAll('.category-anchor');
  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY + 180;
    sections.forEach(function(sec) {
      if (sec.offsetTop <= scrollY && sec.offsetTop + sec.offsetHeight > scrollY) {
        var id = sec.id;
        filterBtns.forEach(function(b) {
          b.classList.toggle('active', b.getAttribute('href') === '#' + id);
        });
      }
    });
  });
}


/* ── Smooth Scroll ───────────────────────────────────────── */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── Init ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
  initStickyHeader();
  initMobileMenu();
  initSearchToggle();
  initAddToCart();
  initSelectOptions();
  initFilterBar();
  initSmoothScroll();
  updateCartBadge();

});

const sortSelect = document.getElementById('sort-select');

if (sortSelect) {
  sortSelect.addEventListener('change', function () {
    sortProducts(this.value);
  });
}
