(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-nav.prev');
  var next = document.querySelector('.hero-nav.next');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  function startSlider() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function resetSlider() {
    if (timer) {
      window.clearInterval(timer);
    }

    startSlider();
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
      resetSlider();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
      resetSlider();
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-slide')) || 0);
      resetSlider();
    });
  });

  startSlider();

  var filterCards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));
  var filterInput = document.querySelector('.filter-input');
  var selects = Array.prototype.slice.call(document.querySelectorAll('.filter-select'));

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    var keyword = normalize(filterInput ? filterInput.value : '');
    var filters = {};

    selects.forEach(function (select) {
      filters[select.getAttribute('data-filter')] = normalize(select.value);
    });

    filterCards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-type')
      ].join(' '));

      var visible = !keyword || haystack.indexOf(keyword) !== -1;

      Object.keys(filters).forEach(function (key) {
        var expected = filters[key];
        var actual = normalize(card.getAttribute('data-' + key));

        if (expected && actual !== expected) {
          visible = false;
        }
      });

      card.style.display = visible ? '' : 'none';
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilters);

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query) {
      filterInput.value = query;
      applyFilters();
    }
  }

  selects.forEach(function (select) {
    select.addEventListener('change', applyFilters);
  });

  var toTop = document.querySelector('.to-top');

  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 520);
    });

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}());
