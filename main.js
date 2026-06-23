/* ================================================================
   main.js — Loading Screen, Animasi Scroll & Autoplay Audio

   Berisi:
   1. Loading screen (hilang setelah DOM siap)
   2. Animasi fade-in-up saat elemen scroll masuk viewport
   3. Musik latar — autoplay otomatis tanpa tombol
================================================================ */

(function () {
  'use strict';

  /* ==============================================================
     1. LOADING SCREEN
     Hilang setelah DOM siap (pakai DOMContentLoaded agar cepat)
  ============================================================== */
  var loadingScreen = document.getElementById('loading-screen');

  function hideLoading() {
    if (!loadingScreen) return;
    setTimeout(function () {
      loadingScreen.classList.add('hidden');
      loadingScreen.addEventListener('transitionend', function () {
        if (loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, { once: true });
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoading);
  } else {
    hideLoading();
  }


  /* ==============================================================
     2. ANIMASI FADE-IN-UP SAAT SCROLL
     IntersectionObserver — efisien, tidak blokir main thread
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
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    animatedEls.forEach(function (el) { observer.observe(el); });
  } else {
    animatedEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ==============================================================
     3. MUSIK LATAR — Autoplay Otomatis (tanpa tombol)

     Strategi (mengatasi kebijakan autoplay modern browser):
     a) <audio> di HTML diberi atribut `muted` → browser izinkan autoplay
     b) Setelah play() berhasil, langsung unmute + set volume
     c) Jika browser masih blokir (rare), coba saat interaksi pertama
  ============================================================== */
  var bgMusic = document.getElementById('bg-music');
  if (!bgMusic) return;

  var TARGET_VOLUME = 0.45; /* Volume 0.0 – 1.0. *** GANTI jika perlu *** */

  /* Fungsi unmute + set volume setelah play berhasil */
  function onPlaySuccess() {
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;
  }

  /* Coba autoplay segera (audio masih muted → browser izinkan) */
  var playPromise = bgMusic.play();

  if (playPromise !== undefined) {
    playPromise
      .then(onPlaySuccess)   /* Berhasil → unmute */
      .catch(function () {   /* Diblokir → tunggu interaksi pertama */
        var events = ['click', 'touchstart', 'keydown', 'scroll'];
        function tryPlay() {
          bgMusic.muted = false;
          bgMusic.volume = TARGET_VOLUME;
          bgMusic.play().catch(function () { });
          events.forEach(function (e) {
            document.removeEventListener(e, tryPlay);
          });
        }
        events.forEach(function (e) {
          document.addEventListener(e, tryPlay, { passive: true, once: true });
        });
      });
  }

  /* Jaga volume agar tidak terlalu pelan dari luar */
  bgMusic.addEventListener('volumechange', function () {
    if (!bgMusic.muted && bgMusic.volume < 0.15) {
      bgMusic.volume = 0.15;
    }
  });

})();