/* ================================================================
   main.js — Loading, Scroll Animation, Autoplay Audio, Preload

   1. Loading screen — fade-out cepat tanpa menahan render
   2. Fade-in-up saat scroll (IntersectionObserver)
   3. Musik latar — autoplay + event listener fallback
   4. Preload gambar galeri agar tampil instan
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
     4. MUSIK LATAR — autoplay instan + fallback interaksi

     Strategi:
     a) atribut autoplay muted playsinline di HTML → browser izinkan
     b) play() segera saat script jalan
     c) unmute setelah play berhasil
     d) jika diblokir → coba lagi saat tap/scroll pertama
  ============================================================== */
  var bgMusic = document.getElementById('bg-music');
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

  function startMusic() {
    if (audioStarted) return;
    bgMusic.volume = TARGET_VOLUME;

    var promise = bgMusic.play();
    if (promise === undefined) {
      bgMusic.muted = false;
      audioStarted = true;
      return;
    }

    promise
      .then(function () {
        bgMusic.muted = false;
        audioStarted = true;
      })
      .catch(function () {
        /* Fallback: mulai saat interaksi pertama pengunjung */
        var events = ['click', 'touchstart', 'keydown', 'scroll'];
        function tryPlay() {
          bgMusic.muted = false;
          bgMusic.volume = TARGET_VOLUME;
          bgMusic.play()
            .then(function () { audioStarted = true; })
            .catch(function () {});
          events.forEach(function (e) {
            document.removeEventListener(e, tryPlay);
          });
        }
        events.forEach(function (e) {
          document.addEventListener(e, tryPlay, { passive: true, once: true });
        });
      });
  }

  /* Coba play segera */
  startMusic();

  /* Pastikan play saat metadata audio siap (jika belum mulai) */
  bgMusic.addEventListener('canplaythrough', startMusic, { once: true });
  bgMusic.addEventListener('loadeddata', startMusic, { once: true });

})();
