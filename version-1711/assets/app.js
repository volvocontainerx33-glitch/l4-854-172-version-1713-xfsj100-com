(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector(".mobile-toggle");
    var menu = document.querySelector(".mobile-menu");

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function auto() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function restart() {
      window.clearInterval(timer);
      auto();
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        restart();
      });
    });

    if (slides.length > 1) {
      auto();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initFilters() {
    var roots = Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]"));

    roots.forEach(function (root) {
      var input = root.querySelector(".search-input");
      var selects = Array.prototype.slice.call(root.querySelectorAll(".filter-select"));
      var reset = root.querySelector(".filter-reset");
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
      var empty = root.querySelector(".empty-state");

      function apply() {
        var query = normalize(input ? input.value : "");
        var activeFilters = {};
        var shown = 0;

        selects.forEach(function (select) {
          activeFilters[select.getAttribute("data-filter")] = normalize(select.value);
        });

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-search"));
          var ok = !query || haystack.indexOf(query) !== -1;

          Object.keys(activeFilters).forEach(function (key) {
            var value = activeFilters[key];
            var cardValue = normalize(card.getAttribute("data-" + key));

            if (value && cardValue.indexOf(value) === -1) {
              ok = false;
            }
          });

          card.hidden = !ok;
          if (ok) {
            shown += 1;
          }
        });

        if (empty) {
          empty.hidden = shown !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      selects.forEach(function (select) {
        select.addEventListener("change", apply);
      });

      if (reset) {
        reset.addEventListener("click", function () {
          if (input) {
            input.value = "";
          }

          selects.forEach(function (select) {
            select.value = "";
          });

          apply();
        });
      }
    });
  }

  function initPlayer() {
    var shell = document.querySelector("[data-player]");

    if (!shell) {
      return;
    }

    var video = shell.querySelector("video");
    var button = shell.querySelector("[data-play]");
    var stream = shell.getAttribute("data-stream");
    var hls = null;

    if (!video || !button || !stream) {
      return;
    }

    function attach() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        if (!video.src) {
          video.src = stream;
        }
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!hls) {
          hls = new window.Hls();
          hls.loadSource(stream);
          hls.attachMedia(video);
        }
        return;
      }

      if (!video.src) {
        video.src = stream;
      }
    }

    function play() {
      attach();
      button.classList.add("is-hidden");
      var result = video.play();

      if (result && typeof result.catch === "function") {
        result.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    }

    button.addEventListener("click", play);

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        button.classList.remove("is-hidden");
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
