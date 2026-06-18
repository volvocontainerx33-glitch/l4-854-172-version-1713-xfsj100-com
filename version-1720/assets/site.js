(function() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", function() {
            mobileNav.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var activeHero = 0;
    var heroTimer = null;

    function showHero(index) {
        if (!slides.length) {
            return;
        }

        activeHero = (index + slides.length) % slides.length;

        slides.forEach(function(slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeHero);
        });

        dots.forEach(function(dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeHero);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }

        heroTimer = window.setInterval(function() {
            showHero(activeHero + 1);
        }, 5200);
    }

    dots.forEach(function(dot, index) {
        dot.addEventListener("click", function() {
            if (heroTimer) {
                window.clearInterval(heroTimer);
            }

            showHero(index);
            startHero();
        });
    });

    showHero(0);
    startHero();

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]")).forEach(function(root) {
        var input = root.querySelector("[data-filter-input]");
        var yearSelect = root.querySelector("[data-filter-year]");
        var regionSelect = root.querySelector("[data-filter-region]");
        var cards = Array.prototype.slice.call(root.querySelectorAll("[data-movie-card]"));
        var empty = root.querySelector("[data-empty-message]");

        function applyFilters() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var year = yearSelect ? yearSelect.value : "";
            var region = regionSelect ? regionSelect.value : "";
            var visible = 0;

            cards.forEach(function(card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var cardRegion = card.getAttribute("data-region") || "";
                var ok = true;

                if (query && text.indexOf(query) === -1) {
                    ok = false;
                }

                if (year && cardYear !== year) {
                    ok = false;
                }

                if (region && cardRegion !== region) {
                    ok = false;
                }

                card.hidden = !ok;

                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener("input", applyFilters);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilters);
        }

        if (regionSelect) {
            regionSelect.addEventListener("change", applyFilters);
        }

        applyFilters();
    });

    var player = document.querySelector("[data-player]");
    if (player) {
        var video = player.querySelector("video");
        var cover = player.querySelector("[data-player-cover]");
        var startButton = player.querySelector("[data-player-start]");
        var stream = player.getAttribute("data-stream");
        var hlsInstance = null;
        var ready = false;

        function attachStream() {
            if (!video || !stream || ready) {
                return;
            }

            ready = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            }
        }

        function beginPlayback() {
            if (!video) {
                return;
            }

            attachStream();

            if (cover) {
                cover.classList.add("hidden");
            }

            video.controls = true;

            var playTask = video.play();
            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function() {});
            }
        }

        if (cover) {
            cover.addEventListener("click", beginPlayback);
        }

        if (startButton) {
            startButton.addEventListener("click", function(event) {
                event.stopPropagation();
                beginPlayback();
            });
        }

        if (video) {
            video.addEventListener("click", function() {
                if (video.paused) {
                    beginPlayback();
                } else {
                    video.pause();
                }
            });
        }

        window.addEventListener("beforeunload", function() {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    var backTop = document.querySelector("[data-backtop]");
    if (backTop) {
        window.addEventListener("scroll", function() {
            backTop.classList.toggle("is-visible", window.scrollY > 420);
        });

        backTop.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
})();
