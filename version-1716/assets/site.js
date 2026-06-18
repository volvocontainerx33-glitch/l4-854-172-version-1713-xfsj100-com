(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-site-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", menu.classList.contains("is-open"));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
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

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
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
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });
    if (slides.length > 1) {
      restart();
    }
  }

  function setupFilter() {
    var input = document.querySelector("[data-filter-input]");
    if (!input) {
      return;
    }
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-filter-item]"));
    input.addEventListener("input", function () {
      var keyword = input.value.trim().toLowerCase();
      items.forEach(function (item) {
        var text = (item.getAttribute("data-search-text") || item.textContent || "").toLowerCase();
        item.classList.toggle("is-filtered-out", keyword && text.indexOf(keyword) === -1);
      });
    });
  }

  function createSearchCard(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");
    return "<article class=\"movie-card\">" +
      "<a href=\"" + escapeHtml(movie.url) + "\">" +
      "<figure><img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\"></figure>" +
      "<div class=\"card-body\">" +
      "<div class=\"card-tags\">" + tags + "</div>" +
      "<h2>" + escapeHtml(movie.title) + "</h2>" +
      "<p>" + escapeHtml(movie.oneLine) + "</p>" +
      "<div class=\"card-meta\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span></div>" +
      "</div></a></article>";
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>\"]/g, function (match) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
      }[match];
    });
  }

  function setupSearch() {
    var input = document.getElementById("movieSearchInput");
    var output = document.querySelector("[data-search-results]");
    var data = window.MOVIE_SEARCH_DATA || [];
    if (!input || !output || !data.length) {
      return;
    }

    function render() {
      var keyword = input.value.trim().toLowerCase();
      var matched = data.filter(function (movie) {
        if (!keyword) {
          return true;
        }
        return movie.searchText.indexOf(keyword) !== -1;
      }).slice(0, 80);
      output.innerHTML = matched.map(createSearchCard).join("");
    }

    input.addEventListener("input", render);
    render();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilter();
    setupSearch();
  });
})();
