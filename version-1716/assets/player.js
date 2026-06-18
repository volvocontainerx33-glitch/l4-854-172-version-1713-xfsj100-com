(function () {
  function setupPlayer(player) {
    var video = player.querySelector("video");
    var trigger = player.querySelector("[data-play-trigger]");
    var hlsUrl = player.getAttribute("data-hls");
    var hlsInstance = null;
    var initialized = false;

    function initialize() {
      if (initialized || !video || !hlsUrl) {
        return;
      }
      initialized = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(hlsUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = hlsUrl;
      }
      player.hlsInstance = hlsInstance;
    }

    function play() {
      initialize();
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
      if (video) {
        var playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(function () {
            if (trigger) {
              trigger.classList.remove("is-hidden");
            }
          });
        }
      }
    }

    if (trigger) {
      trigger.addEventListener("click", play);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (!initialized) {
          play();
        }
      });
    }
  }

  document.querySelectorAll("[data-player]").forEach(setupPlayer);
})();
