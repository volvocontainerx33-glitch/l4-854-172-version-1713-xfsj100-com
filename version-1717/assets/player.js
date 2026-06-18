import { H as Hls } from './hls-vendor-dru42stk.js';

var initializePlayer = function (frame) {
  var video = frame.querySelector('video');
  var playButton = frame.querySelector('[data-player-play]');
  var status = frame.querySelector('[data-player-status]');
  var source = video ? video.getAttribute('data-src') : '';

  if (!video || !source) {
    return;
  }

  var setStatus = function (message) {
    if (status) {
      status.textContent = message;
    }
  };

  var markReady = function () {
    frame.classList.add('is-ready');
  };

  if (source.indexOf('.m3u8') !== -1 && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      markReady();
    });
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data && data.fatal) {
        setStatus('播放源正在切换');
        video.src = video.getAttribute('src') || '';
      }
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.addEventListener('loadedmetadata', markReady, { once: true });
  } else {
    markReady();
  }

  var togglePlay = function () {
    if (video.paused) {
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {
          setStatus('请再次点击播放');
        });
      }
    } else {
      video.pause();
    }
  };

  if (playButton) {
    playButton.addEventListener('click', function (event) {
      event.preventDefault();
      togglePlay();
    });
  }

  video.addEventListener('play', function () {
    frame.classList.add('is-playing');
  });

  video.addEventListener('pause', function () {
    frame.classList.remove('is-playing');
  });

  video.addEventListener('canplay', markReady);
};

Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initializePlayer);
