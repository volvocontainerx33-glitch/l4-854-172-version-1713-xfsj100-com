(function () {
  function setup(mediaUrl, videoId, overlayId) {
    var video = document.getElementById(videoId || "moviePlayer");
    var overlay = document.getElementById(overlayId || "playOverlay");
    var hls = null;
    var prepared = false;

    if (!video || !mediaUrl) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }

      prepared = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(mediaUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hls) {
            try {
              hls.destroy();
            } catch (error) {
              hls = null;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = mediaUrl;
      }
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add("hidden");
      }
    }

    function showOverlay() {
      if (overlay && video.paused) {
        overlay.classList.remove("hidden");
      }
    }

    function playVideo() {
      prepare();
      hideOverlay();
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          video.addEventListener("canplay", function onceReady() {
            video.removeEventListener("canplay", onceReady);
            video.play().then(hideOverlay).catch(showOverlay);
          });
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", playVideo);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener("play", hideOverlay);
    video.addEventListener("pause", showOverlay);
    video.addEventListener("ended", showOverlay);

    prepare();

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.AppPlayer = {
    setup: setup
  };
})();
