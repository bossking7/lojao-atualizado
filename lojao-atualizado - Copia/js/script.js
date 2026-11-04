(function () {
  var navigation = performance.getEntriesByType('navigation')[0];
  if (window.matchMedia('(max-width: 900px)').matches && !window.location.hash) {
    window.addEventListener('pageshow', function (event) {
      if (!event.persisted && (!navigation || navigation.type !== 'back_forward')) {
        window.scrollTo(0, 0);
      }
    });
  }

  var productDisplay = document.querySelector('.product-display');
  var productImage = productDisplay.querySelector('.products-visual img');
  var productDetails = productDisplay.querySelector('.product-details');
  var productImagePlaceholder = document.createComment('product-display');
  var mobileProductLayout = window.matchMedia('(max-width: 759px)');
  var productImageRequest = 0;
  productDisplay.parentNode.insertBefore(productImagePlaceholder, productDisplay);
  window.addEventListener('resize', function () {
    if (!mobileProductLayout.matches) {
      productImagePlaceholder.parentNode.insertBefore(productDisplay, productImagePlaceholder.nextSibling);
    }
  });

  document.querySelectorAll('.product-category[data-product]').forEach(function (button) {
    button.addEventListener('click', function () {
      var product = button.dataset.product;
      productDisplay.dataset.product = product;
      var imagePath = button.dataset.image;
      var imageRequest = ++productImageRequest;
      productDisplay.classList.remove('is-entering');
      productDisplay.classList.add('is-loading');
      productImage.alt = button.dataset.alt;
      productDetails.querySelector('h3').textContent = button.dataset.alt;
      productDetails.querySelector('p').textContent = button.dataset.description;

      if (mobileProductLayout.matches) {
        button.insertAdjacentElement('afterend', productDisplay);
        button.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
      }

      function revealProduct() {
        if (imageRequest !== productImageRequest) return;
        productImage.onload = null;
        productImage.onerror = null;
        productDisplay.classList.remove('is-loading');
        void productDisplay.offsetWidth;
        productDisplay.classList.add('is-entering');
      }

      productImage.onload = revealProduct;
      productImage.onerror = revealProduct;
      productImage.src = imagePath;
      if (productImage.complete) revealProduct();

      document.querySelectorAll('.product-category[data-product]').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in') });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  var hero = document.querySelector('.hero-image');
  if (hero && window.innerWidth > 900) {
    var raf = 0;
    window.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        hero.style.backgroundPosition = 'center calc(50% + ' + (window.scrollY * 0.12) + 'px)';
      });
    }, { passive: true });
  }
})();
