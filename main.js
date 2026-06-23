/* ================================================================
   main.js — Loading Screen, Animasi Scroll & Audio Controller

   Berisi:
   1. Loading screen (hilang secepat mungkin)
   2. Animasi fade-in-up saat elemen masuk viewport (IntersectionObserver)
   3. Musik latar otomatis (autoplay + fallback interaksi pertama)
================================================================ */

(function () {
  'use strict';

  /* ==============================================================
     1. LOADING SCREEN
     Hilang setelah halaman siap (DOMContentLoaded + window.load),
     mana yang lebih cepat lebih baik.
  ============================================================== */
  var loadingScreen = document.getElementById('loading-screen');

  function hideLoading() {
    if (!loadingScreen) return;
    // Delay singkat agar loading animation sempat terlihat
    setTimeout(function () {
      loadingScreen.classList.add('hidden');
      // Hapus dari DOM setelah transisi selesai agar tidak memakan memori
      loadingScreen.addEventListener('transitionend', function () {
        if (loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, { once: true });
    }, 800);
  }

  // Pakai DOMContentLoaded dulu (lebih cepat dari window.load)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoading);
  } else {
    // DOM sudah siap (script di-defer)
    hideLoading();
  }


  /* ==============================================================
     2. ANIMASI FADE-IN-UP SAAT SCROLL
     IntersectionObserver — zero-jank, tidak menghalangi main thread
  ============================================================== */
  var animatedElements = document.querySelectorAll('.fade-in-up');

  if (animatedElements.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Hentikan setelah animasi
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: langsung tampilkan jika IntersectionObserver tidak tersedia
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ==============================================================
     3. MUSIK LATAR — Autoplay Agresif + UX Tombol
     
     Strategi autoplay:
     a) Audio di HTML diberi atribut `muted` agar browser izinkan autoplay
     b) Setelah play berhasil, langsung unmute + set volume
     c) Jika browser blokir, tetap coba saat interaksi pertama pengguna
  ============================================================== */
  var bgMusic  = document.getElementById('bg-music');
  var musicBtn = document.getElementById('music-btn');
  var musicIcon = document.getElementById('music-icon');

  if (!bgMusic || !musicBtn) return;

  // Volume target (0.0 – 1.0)
  var TARGET_VOLUME = 0.45;
  var isPlaying = false;

  /* --- Update tampilan tombol --- */
  function syncButtonState(playing) {
    isPlaying = playing;
    if (playing) {
      musicBtn.classList.add('playing');
      musicIcon.className = 'bi bi-pause-fill';
      musicBtn.setAttribute('aria-label', 'Pause Musik');
      musicBtn.title = 'Pause Musik';
    } else {
      musicBtn.classList.remove('playing');
      musicIcon.className = 'bi bi-music-note-beamed';
      musicBtn.setAttribute('aria-label', 'Play Musik');
      musicBtn.title = 'Play Musik';
    }
  }

  /* --- Mulai putar musik (unmute setelah play) --- */
  function startMusic() {
    if (isPlaying) return;
    bgMusic.muted = false;
    bgMusic.volume = TARGET_VOLUME;

    var promise = bgMusic.play();
    if (promise !== undefined) {
      promise
        .then(function () {
          syncButtonState(true);
        })
        .catch(function () {
          // Autoplay diblokir browser — tunggu interaksi
          bgMusic.muted = true; // Mute kembali agar siap autoplay
        });
    } else {
      // Tidak mengembalikan promise (browser lama) — anggap berhasil
      syncButtonState(true);
    }
  }

  /* --- Hentikan musik --- */
  function stopMusic() {
    bgMusic.pause();
    syncButtonState(false);
  }

  /* --- Toggle Play/Pause oleh tombol --- */
  musicBtn.addEventListener('click', function () {
    if (isPlaying) {
      stopMusic();
    } else {
      bgMusic.muted = false;
      bgMusic.volume = TARGET_VOLUME;
      startMusic();
    }
  });

  /* --- Sinkronisasi jika audio berhenti dari luar (misal: tab di-hide) --- */
  bgMusic.addEventListener('pause', function () {
    if (isPlaying) {
      syncButtonState(false);
    }
  });

  bgMusic.addEventListener('play', function () {
    syncButtonState(true);
  });

  /* --- Jaga volume tidak terlalu pelan --- */
  bgMusic.addEventListener('volumechange', function () {
    if (!bgMusic.muted && bgMusic.volume < 0.2) {
      bgMusic.volume = 0.2;
    }
  });

  /* --- AUTOPLAY: Coba segera saat script jalan --- */
  // Trik: audio sudah muted di HTML, jadi browser izinkan autoplay
  var autoPlayPromise = bgMusic.play();
  if (autoPlayPromise !== undefined) {
    autoPlayPromise
      .then(function () {
        // Berhasil → unmute dan set volume nyata
        bgMusic.muted = false;
        bgMusic.volume = TARGET_VOLUME;
        syncButtonState(true);
      })
      .catch(function () {
        // Diblokir → tunggu interaksi pertama pengguna
        syncButtonState(false);
      });
  }

  /* --- Fallback: play saat interaksi pertama pengguna --- */
  var interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'];
  function onFirstInteraction() {
    if (!isPlaying) {
      bgMusic.muted = false;
      bgMusic.volume = TARGET_VOLUME;
      var p = bgMusic.play();
      if (p !== undefined) {
        p.then(function () { syncButtonState(true); }).catch(function () {});
      }
    }
    interactionEvents.forEach(function (ev) {
      document.removeEventListener(ev, onFirstInteraction);
    });
  }

  interactionEvents.forEach(function (ev) {
    document.addEventListener(ev, onFirstInteraction, { passive: true });
  });

})();