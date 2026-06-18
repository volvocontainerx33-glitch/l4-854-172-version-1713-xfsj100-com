(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var searchInput = document.querySelector('[data-search-input]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var searchScope = document.querySelector('[data-search-scope]');
  var emptyState = document.querySelector('[data-empty-state]');

  var normalize = function (value) {
    return (value || '').toString().trim().toLowerCase();
  };

  var applyFilters = function () {
    if (!searchScope) {
      return;
    }
    var cards = Array.prototype.slice.call(searchScope.querySelectorAll('[data-title]'));
    var query = normalize(searchInput && searchInput.value);
    var region = normalize(regionFilter && regionFilter.value);
    var type = normalize(typeFilter && typeFilter.value);
    var year = normalize(yearFilter && yearFilter.value);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year')
      ].join(' '));
      var matchesQuery = !query || haystack.indexOf(query) !== -1;
      var matchesRegion = !region || normalize(card.getAttribute('data-region')) === region;
      var matchesType = !type || normalize(card.getAttribute('data-type')) === type;
      var matchesYear = !year || normalize(card.getAttribute('data-year')) === year;
      var matched = matchesQuery && matchesRegion && matchesType && matchesYear;
      card.setAttribute('data-hidden', matched ? 'false' : 'true');
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  };

  if (searchInput || regionFilter || typeFilter || yearFilter) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');
    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }
    [searchInput, regionFilter, typeFilter, yearFilter].forEach(function (field) {
      if (field) {
        field.addEventListener('input', applyFilters);
        field.addEventListener('change', applyFilters);
      }
    });
    applyFilters();
  }
})();
