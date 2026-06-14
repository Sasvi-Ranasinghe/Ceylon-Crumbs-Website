/* ═══════════════════════════════════════════════════════════
   Ceylon Crumbs — index.js 
═══════════════════════════════════════════════════════════ */
function initMobileMenu(){

  const hamburger =
    document.getElementById("hamburger");

  const menu =
    document.getElementById("main-menu");

  const overlay =
    document.getElementById("menu-overlay");

  const closeBtn =
    document.getElementById("close-menu");

  if(hamburger){

    hamburger.addEventListener("click",()=>{

      menu.classList.add("active");
      overlay.classList.add("active");

    });

  }

  if(closeBtn){

    closeBtn.addEventListener("click",()=>{

      menu.classList.remove("active");
      overlay.classList.remove("active");

    });

  }

  if(overlay){

    overlay.addEventListener("click",()=>{

      menu.classList.remove("active");
      overlay.classList.remove("active");

    });

  }

}

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
  return getCart().reduce(function(sum, item) {
    return sum + (item.qty || 1);
  }, 0);
}

function updateCartBadge() {
  var count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(function(el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ── FIX: addToCart now saves img + category ── */
function addToCart(id, name, price, imgSrc, category) {
  var cart     = getCart();
  var existing = null;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) { existing = cart[i]; break; }
  }

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      id:       id,
      name:     name,
      price:    price,
      qty:      1,
      img:      imgSrc   || '',           
      category: category || '',
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast('\u2713 "' + name + '" added to cart');
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

/* ── FIX: Image path — relative path extract ── */
function getRelativeImgPath(imgEl) {
  if (!imgEl) return '';

  /* src attribute — relative path first */
  var src = imgEl.getAttribute('src') || '';

  /* If already relative (starts with Slider/, ../, etc) use as-is */
  if (src && !src.startsWith('http') && !src.startsWith('file') && !src.startsWith('C:') && !src.startsWith('c:')) {
    return src;
  }

  /* If absolute file:// path — extract filename */
  if (src && (src.indexOf('Slider') > -1 || src.indexOf('slider') > -1)) {
    var filename = src.split('/').pop().split('\\').pop();
    return 'Slider/' + filename;
  }

  if (src && src.indexOf('Products Photos') > -1) {
    var fname = src.split('/').pop().split('\\').pop();
    return '../ALL PRODUCTS/Products Photos/' + fname;
  }

  /* Fallback */
  return src;
}

/* ── FIX: Category detect from section ── */
function getCategoryFromSection(card) {
  var section = card ? card.closest('section[id], div[id]') : null;
  if (!section) return 'Ceylon Crumbs';
  var id = section.id.toLowerCase();
  var map = {
    'savoury'               : 'Savoury',
    'cake'                  : 'Cake',
    'gateau'                : 'Gateau',
    'sweet'                 : 'Sweet',
    'lunch'                 : 'Lunch',
    'beverages'             : 'Beverages',
    'cheesecakeandbentocake': 'Cheesecake & Bento',
    'featured'              : 'Featured',
    'bestsellers'           : 'Best Sellers',
    'new'                   : 'New Arrivals'
  };
  return map[id] || 'Ceylon Crumbs';
}

/* ── Hero Slider ─────────────────────────────────────────── */

function initSlider(wrapperId) {
  var wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  var track = wrapper.querySelector('.hero-slides');
  if (!track) return;

  var dots    = wrapper.querySelectorAll('.slider-dot');
  var slides  = track.querySelectorAll('.hero-slide');
  var total   = slides.length;
  var current = 0;
  var autoplay;

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function resetAuto() {
    clearInterval(autoplay);
    autoplay = setInterval(function() { goTo(current + 1); }, 4000);
  }

  var prevBtn = wrapper.querySelector('.slider-arrow.prev');
  var nextBtn = wrapper.querySelector('.slider-arrow.next');
  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); resetAuto(); });

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); resetAuto(); });
  });

  /* Touch swipe for Mobile*/
  var touchStartX = 0;
  track.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
      resetAuto();
    }
  }, { passive: true });

  goTo(0);
  resetAuto();
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

/* ── Add-to-Cart Buttons ─────────────────────────────────── */
function initCartButtons() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.ajax_add_to_cart, .atc-btn');
    if (!btn) return;

    var id    = btn.dataset.product_id || btn.dataset.id || 'unknown';
    var card  = btn.closest('.box, .product-card, .product-small');
    var nameEl  = card ? card.querySelector('.product-title, .product-name') : null;
    var priceEl = card ? card.querySelector('.price, .product-price') : null;
    var imgEl   = card ? card.querySelector('img') : null;

    var name  = nameEl  ? nameEl.textContent.trim()  : 'Product';
    var price = priceEl ? priceEl.textContent.trim() : '';
    var img   = btn.dataset.img || (imgEl ? imgEl.src : '');

    var cart = getCart();
    var existing = cart.find(function(i) { return i.id === id; });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: id, name: name, price: price, qty: 1, category: 'CEYLON CRUMBS', img: img });
    }
    saveCart(cart);
    updateCartBadge();
    showToast('\u2713 "' + name + '" added to cart');

    btn.textContent = 'Added \u2713';
    btn.classList.add('added');
    setTimeout(function() {
      btn.textContent = 'Add to cart';
      btn.classList.remove('added');
    }, 1400);
  });
}

/* ── Sticky Header ───────────────────────────────────────── */

function initStickyHeader() {
  var header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('stuck', window.scrollY > 90);
  });
}

/* ── Init ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
  initSlider('hero-desktop');
  initStickyHeader();
  initSearchToggle();
  initCartButtons();
  updateCartBadge();        
});

document.addEventListener("DOMContentLoaded",()=>{

  initMobileMenu();

});