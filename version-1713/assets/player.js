(function () {
  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('.player-cover');
    var streamUrl = shell.getAttribute('data-stream');
    var started = false;
    var hlsInstance = null;

    function start() {
      if (!video || !streamUrl) {
        return;
      }

      if (!started) {
        started = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      }

      if (cover) {
        cover.classList.add('is-hidden');
      }

      video.controls = true;
      video.play().catch(function () {});
    }

    if (cover) {
      cover.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!started) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(setupPlayer);
}());
