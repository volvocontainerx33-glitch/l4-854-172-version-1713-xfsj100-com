(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        var isOpen = mobileNav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var activeIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));

    function filterCards(value) {
      var query = String(value || '').trim().toLowerCase();
      var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-keywords') || card.textContent || '').toLowerCase();
        card.classList.toggle('hidden-card', query.length > 0 && text.indexOf(query) === -1);
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        filterCards(input.value);
      });
    });

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && inputs.length) {
      inputs[0].value = initialQuery;
      filterCards(initialQuery);
    }

    var searchForms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

    searchForms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var field = form.querySelector('input[name="q"]');
        if (!field || !field.value.trim()) {
          event.preventDefault();
          field && field.focus();
        }
      });
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));

    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('.play-overlay');
      var stream = player.getAttribute('data-stream');
      var initialized = false;
      var hls = null;

      function start() {
        if (!video || !stream) {
          return;
        }

        player.classList.add('is-playing');

        if (!initialized) {
          initialized = true;

          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(stream);
            hls.attachMedia(video);
          } else {
            video.src = stream;
          }
        }

        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            player.classList.remove('is-playing');
          });
        }
      }

      if (button) {
        button.addEventListener('click', start);
      }

      player.addEventListener('click', function (event) {
        if (event.target === player || event.target === button) {
          start();
        }
      });

      video && video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });

      video && video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
          player.classList.remove('is-playing');
        }
      });

      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
