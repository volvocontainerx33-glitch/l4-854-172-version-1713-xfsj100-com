
const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  const prev = hero.querySelector('[data-hero-prev]');
  const next = hero.querySelector('[data-hero-next]');
  let current = 0;
  let timer = null;

  const activate = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => activate(current + 1), 5200);
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      activate(index);
      start();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      activate(current - 1);
      start();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      activate(current + 1);
      start();
    });
  }

  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);
  start();
}

const mobileToggle = document.querySelector('[data-mobile-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('is-open');
  });
}

const backTop = document.querySelector('[data-back-top]');

if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('is-visible', window.scrollY > 520);
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const playerShells = Array.from(document.querySelectorAll('.js-player'));
let hlsModulePromise = null;

const loadHls = () => {
  if (!hlsModulePromise) {
    hlsModulePromise = import('./hls-vendor-dru42stk.js').then((module) => module.H);
  }

  return hlsModulePromise;
};

playerShells.forEach((shell) => {
  const video = shell.querySelector('video');
  const source = shell.getAttribute('data-source');
  const toggles = Array.from(shell.querySelectorAll('[data-player-toggle]'));
  const mute = shell.querySelector('[data-player-mute]');
  const full = shell.querySelector('[data-player-fullscreen]');
  const state = shell.querySelector('[data-player-state]');
  let ready = false;
  let hls = null;

  const setState = (text) => {
    if (!state) {
      return;
    }

    state.textContent = text || '';
    state.classList.toggle('is-visible', Boolean(text));
  };

  const attach = async () => {
    if (ready || !video || !source) {
      return;
    }

    setState('加载中');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      ready = true;
      setState('');
      return;
    }

    try {
      const Hls = await loadHls();

      if (Hls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => setState(''));
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data && data.fatal) {
            setState('暂时无法播放');
          }
        });
        ready = true;
        return;
      }

      video.src = source;
      ready = true;
      setState('');
    } catch (error) {
      setState('暂时无法播放');
    }
  };

  const play = async () => {
    await attach();

    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        setState('点击播放');
      }
    } else {
      video.pause();
    }
  };

  attach();

  toggles.forEach((button) => {
    button.addEventListener('click', play);
  });

  if (video) {
    video.addEventListener('click', play);
    video.addEventListener('play', () => shell.classList.add('is-playing'));
    video.addEventListener('pause', () => shell.classList.remove('is-playing'));
    video.addEventListener('ended', () => shell.classList.remove('is-playing'));
  }

  if (mute && video) {
    mute.addEventListener('click', () => {
      video.muted = !video.muted;
      mute.textContent = video.muted ? '取消静音' : '静音';
    });
  }

  if (full && video) {
    full.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    if (hls) {
      hls.destroy();
    }
  });
});

const scrollPlayer = document.querySelector('[data-scroll-player]');

if (scrollPlayer) {
  scrollPlayer.addEventListener('click', (event) => {
    event.preventDefault();
    const player = document.querySelector('.js-player');

    if (player) {
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

const searchPage = document.querySelector('.js-search-page');

if (searchPage && window.MOVIE_SEARCH_INDEX) {
  const form = searchPage.querySelector('[data-search-form]');
  const input = searchPage.querySelector('[data-search-input]');
  const results = searchPage.querySelector('[data-search-results]');
  const status = searchPage.querySelector('[data-search-status]');
  const tags = Array.from(searchPage.querySelectorAll('[data-search-tag]'));
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';

  const htmlEscape = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const renderCard = (movie) => {
    const tagsHtml = (movie.tags || []).slice(0, 2).map((tag) => `<span>${htmlEscape(tag)}</span>`).join('');

    return `
        <article class="movie-card">
          <a href="${htmlEscape(movie.url)}" class="movie-cover">
            <img src="${htmlEscape(movie.image)}" alt="${htmlEscape(movie.title)}" loading="lazy">
            <span class="movie-shade"></span>
          </a>
          <div class="movie-info">
            <div class="tag-row">${tagsHtml}</div>
            <h3><a href="${htmlEscape(movie.url)}">${htmlEscape(movie.title)}</a></h3>
            <p>${htmlEscape(movie.oneLine)}</p>
            <div class="meta-row">
              <span>${htmlEscape(movie.region)}</span>
              <span>${htmlEscape(movie.year)}</span>
            </div>
          </div>
        </article>`;
  };

  const render = (query) => {
    const text = String(query || '').trim().toLowerCase();
    const pool = window.MOVIE_SEARCH_INDEX;
    const matched = text
      ? pool.filter((movie) => [
          movie.title,
          movie.region,
          movie.year,
          movie.type,
          movie.genre,
          movie.category,
          ...(movie.tags || []),
          movie.oneLine,
        ].join(' ').toLowerCase().includes(text))
      : pool.slice(0, 48);
    const visible = matched.slice(0, 96);

    if (results) {
      results.innerHTML = visible.map(renderCard).join('');
    }

    if (status) {
      status.textContent = text ? `搜索结果：${htmlEscape(query)}` : '热门影片';
    }
  };

  if (input) {
    input.value = initialQuery;
    input.addEventListener('input', () => render(input.value));
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      render(input ? input.value : '');
    });
  }

  tags.forEach((tag) => {
    tag.addEventListener('click', () => {
      const value = tag.getAttribute('data-search-tag') || '';
      if (input) {
        input.value = value;
      }
      render(value);
    });
  });

  render(initialQuery);
}
