(function() {
  var menuButton = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function() {
      menu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var index = 0;
    var showSlide = function(next) {
      index = next;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        showSlide(i);
      });
    });
    window.setInterval(function() {
      showSlide((index + 1) % slides.length);
    }, 5000);
  }

  var forms = document.querySelectorAll('.global-search-form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var query = input ? input.value.trim() : '';
      var url = './search.html';
      if (query) {
        url += '?q=' + encodeURIComponent(query);
      }
      window.location.href = url;
    });
  });

  var searchInputs = document.querySelectorAll('.movie-search');
  searchInputs.forEach(function(input) {
    var scope = input.closest('.search-scope') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var filters = Array.prototype.slice.call(scope.querySelectorAll('.movie-filter'));
    var empty = scope.querySelector('.empty-state');

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && !input.value) {
      input.value = query;
    }

    var apply = function() {
      var text = input.value.trim().toLowerCase();
      var activeFilters = filters.map(function(filter) {
        return {
          key: filter.getAttribute('data-key'),
          value: filter.value
        };
      });
      var visible = 0;
      cards.forEach(function(card) {
        var matchedText = !text || (card.getAttribute('data-search') || '').toLowerCase().indexOf(text) !== -1;
        var matchedFilters = activeFilters.every(function(filter) {
          return !filter.value || card.getAttribute('data-' + filter.key) === filter.value;
        });
        var matched = matchedText && matchedFilters;
        card.classList.toggle('hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    };

    input.addEventListener('input', apply);
    filters.forEach(function(filter) {
      filter.addEventListener('change', apply);
    });
    apply();
  });
})();
