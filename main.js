/* ================================================================
   main.js — Loading Screen & Animasi Scroll
   
   Berisi:
   1. Loading screen (hilang setelah halaman siap)
   2. Animasi fade-in-up saat elemen masuk viewport
================================================================ */


/* ================================================================
   1. LOADING SCREEN
   Halaman loading akan menghilang 1.2 detik setelah window.load
================================================================ */
window.addEventListener("load", function () {
  setTimeout(function () {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }
  }, 1200); // Delay dalam milidetik — ubah jika perlu (1200 = 1.2 detik)
});


/* ================================================================
   2. ANIMASI FADE-IN-UP SAAT SCROLL
   Setiap elemen dengan class "fade-in-up" akan muncul dengan
   animasi ketika elemen tersebut masuk ke area tampilan layar.
================================================================ */
(function () {
  // Ambil semua elemen yang perlu dianimasikan
  const animatedElements = document.querySelectorAll(".fade-in-up");

  if (!animatedElements.length) return; // Keluar jika tidak ada elemen

  // Buat IntersectionObserver untuk memantau posisi elemen
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Elemen masuk layar → tambahkan class "visible" agar animasi berjalan
          entry.target.classList.add("visible");
          // Hentikan pengamatan setelah animasi berjalan (efisiensi)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,      // Animasi mulai saat 12% elemen terlihat
      rootMargin: "0px 0px -40px 0px" // Sedikit offset dari bawah layar
    }
  );

  // Daftarkan setiap elemen ke observer
  animatedElements.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================================
   MUSIK LATAR — Kontrol play/pause otomatis
   
   Cara kerja:
   - Musik otomatis play saat pengunjung pertama klik/tap layar
     (Browser modern memblokir autoplay sebelum ada interaksi)
   - Tombol ▶/⏸ di pojok kanan bawah untuk kontrol manual
============================================================ */

const bgMusic  = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
const musicIcon = document.getElementById("music-icon");

// *** GANTI: Volume musik (0.0 = mati, 1.0 = penuh) ***
bgMusic.volume = 0.4;

// Fungsi untuk play musik
function playMusic() {
  bgMusic.play();
  musicBtn.classList.add("playing");
  musicIcon.textContent = "⏸";  // Ikon pause
}

// Fungsi untuk pause musik
function pauseMusic() {
  bgMusic.pause();
  musicBtn.classList.remove("playing");
  musicIcon.textContent = "▶";  // Ikon play
}

// Toggle play/pause saat tombol diklik
musicBtn.addEventListener("click", function () {
  if (bgMusic.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
});

// Auto-play saat pengunjung pertama kali interaksi dengan halaman
// (klik, scroll, atau sentuh layar)
let autoPlayTriggered = false;

function triggerAutoPlay() {
  if (!autoPlayTriggered) {
    autoPlayTriggered = true;
    playMusic();
    // Hapus event listener setelah dijalankan sekali
    document.removeEventListener("click", triggerAutoPlay);
    document.removeEventListener("scroll", triggerAutoPlay);
    document.removeEventListener("touchstart", triggerAutoPlay);
  }
}

document.addEventListener("click",      triggerAutoPlay);
document.addEventListener("scroll",     triggerAutoPlay);
document.addEventListener("touchstart", triggerAutoPlay);