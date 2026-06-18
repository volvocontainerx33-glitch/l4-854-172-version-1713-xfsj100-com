(function() {
  function prepare(video, address) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = address;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(address);
      hls.attachMedia(video);
      return;
    }
    video.src = address;
  }

  window.initMoviePlayer = function(video, cover, address) {
    if (!video || !cover || !address) {
      return;
    }
    prepare(video, address);
    var begin = function() {
      cover.classList.add('hidden');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function() {});
      }
    };
    cover.addEventListener('click', begin);
    video.addEventListener('play', function() {
      cover.classList.add('hidden');
    });
  };
})();
