(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var backTop = document.querySelector("[data-back-top]");

  if (backTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 520) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }
    });

    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll("[data-filter-root]").forEach(function (root) {
    var input = root.querySelector("[data-search-input]");
    var chips = Array.prototype.slice.call(root.querySelectorAll("[data-filter-value]"));
    var scope = root.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
    var activeValue = "all";

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : "";

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-filter-text") || "").toLowerCase();
        var category = card.getAttribute("data-category") || "";
        var region = card.getAttribute("data-region") || "";
        var year = card.getAttribute("data-year") || "";
        var valueMatch = activeValue === "all" || category === activeValue || region === activeValue || year === activeValue || text.indexOf(activeValue.toLowerCase()) !== -1;
        var queryMatch = query === "" || text.indexOf(query) !== -1;

        if (valueMatch && queryMatch) {
          card.classList.remove("hidden-by-filter");
        } else {
          card.classList.add("hidden-by-filter");
        }
      });
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (item) {
          item.classList.remove("active");
        });
        chip.classList.add("active");
        activeValue = chip.getAttribute("data-filter-value") || "all";
        applyFilter();
      });
    });
  });

  document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === current;
        slide.classList.toggle("active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    show(0);
    start();
  });
})();
