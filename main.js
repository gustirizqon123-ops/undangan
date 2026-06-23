/* ================================================================
   main.js — Loading, Scroll Animation, Autoplay Audio, Preload

   1. Loading screen — fade-out cepat tanpa menahan render
   2. Fade-in-up saat scroll (IntersectionObserver)
   3. Musik latar — muted autoplay → unmute setelah play berhasil
   4. Tombol #music-btn — toggle ▶ / ⏸ (elemen di HTML)
   5. Preload gambar galeri agar tampil instan
================================================================ */

(function () {
  'use strict';

  var cfg = window.WEDDING_CONFIG || {};

  /* ==============================================================
     1. PRELOAD GAMBAR GALERI — tampil instan tanpa delay
  ============================================================== */
  var galleryList = cfg.galleryImages || [
    'img/gallery-1.jpg', 'img/gallery-2.jpg', 'img/gallery-3.jpg',
    'img/gallery-4.jpg', 'img/gallery-5.jpg', 'img/gallery-6.jpg'
  ];

  galleryList.forEach(function (src) {
    var img = new Image();
    img.decoding = 'async';
    img.src = src;
  });


  /* ==============================================================
     2. LOADING SCREEN — fade-out cepat (300ms), tidak blokir konten
  ============================================================== */
  var loadingScreen = document.getElementById('loading-screen');

  function hideLoading() {
    if (!loadingScreen) return;
    loadingScreen.classList.add('hidden');
    loadingScreen.addEventListener('transitionend', function () {
      if (loadingScreen.parentNode) loadingScreen.remove();
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoading);
  } else {
    hideLoading();
  }


  /* ==============================================================
     3. ANIMASI FADE-IN-UP SAAT SCROLL (kecuali galeri)
  ============================================================== */
  var animatedEls = document.querySelectorAll('.fade-in-up');

  if (animatedEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    animatedEls.forEach(function (el) { observer.observe(el); });
  } else {
    animatedEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ==============================================================
     4. MUSIK LATAR + TOMBOL #music-btn

     Autoplay (trik browser modern):
     a) <audio muted autoplay playsinline> di HTML
     b) play() → unmute + set volume setelah promise resolve
     c) jika diblokir → coba lagi saat interaksi pertama
     d) tombol ▶/⏸ sinkron dengan status play/pause
  ============================================================== */
  var bgMusic = document.getElementById('bg-music');
  var musicBtn = document.getElementById('music-btn');
  var musicBtnIcon = document.getElementById('music-btn-icon');

  if (!bgMusic) return;

  var TARGET_VOLUME = cfg.audioVolume != null ? cfg.audioVolume : 0.45;
  var audioStarted = false;

  if (cfg.audioSrc) {
    var sourceEl = bgMusic.querySelector('source');
    if (sourceEl && sourceEl.getAttribute('src') !== cfg.audioSrc) {
      sourceEl.src = cfg.audioSrc;
      bgMusic.load();
    }
  }

  /* Perbarui ikon tombol: ▶ = jeda, ⏸ = sedang putar */
  function syncMusicBtn() {
    if (!musicBtn || !musicBtnIcon) return;

    var isPlaying = !bgMusic.paused && !bgMusic.muted;

    if (isPlaying) {
      musicBtnIcon.textContent = '\u23F8'; /* ⏸ */
      musicBtn.setAttribute('aria-label', 'Jeda musik');
      musicBtn.setAttribute('title', 'Jeda musik');
      musicBtn.classList.add('is-playing');
    } else {
      musicBtnIcon.textContent = '\u25B6'; /* ▶ */
      musicBtn.setAttribute('aria-label', 'Putar musik');
      musicBtn.setAttribute('title', 'Putar musik');
      musicBtn.classList.remove('is-playing');
    }
  }

  /* Unmute setelah play() berhasil */
  function onPlaySuccess() {
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
    audioStarted = true;
    syncMusicBtn();
  }

  function startMusic() {
    if (audioStarted && !bgMusic.paused) return;

    bgMusic.volume = TARGET_VOLUME;
    var promise = bgMusic.play();

    if (promise === undefined) {
      onPlaySuccess();
      return;
    }

    promise
      .then(onPlaySuccess)
      .catch(function () {
        syncMusicBtn();
        var events = ['click', 'touchstart', 'keydown', 'scroll'];
        function tryPlay() {
          bgMusic.volume = TARGET_VOLUME;
          bgMusic.play()
            .then(onPlaySuccess)
            .catch(function () { syncMusicBtn(); });
          events.forEach(function (e) {
            document.removeEventListener(e, tryPlay);
          });
        }
        events.forEach(function (e) {
          document.addEventListener(e, tryPlay, { passive: true, once: true });
        });
      });
  }

  /* Toggle play/pause via tombol HTML */
  if (musicBtn) {
    musicBtn.addEventListener('click', function () {
      if (bgMusic.paused || bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.volume = TARGET_VOLUME;
        bgMusic.play()
          .then(onPlaySuccess)
          .catch(function () { syncMusicBtn(); });
      } else {
        bgMusic.pause();
        syncMusicBtn();
      }
    });
  }

  bgMusic.addEventListener('play', syncMusicBtn);
  bgMusic.addEventListener('pause', syncMusicBtn);

  syncMusicBtn();
  startMusic();

  bgMusic.addEventListener('canplaythrough', startMusic, { once: true });
  bgMusic.addEventListener('loadeddata', startMusic, { once: true });

})();
