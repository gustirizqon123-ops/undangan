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
   MUSIK LATAR — Auto play, tidak bisa di-pause pengunjung
============================================================ */

const bgMusic = document.getElementById("bg-music");

// Volume musik (0.0 - 1.0)
bgMusic.volume = 0.4;

// Fungsi play musik
function playMusic() {
  bgMusic.play().catch(function () {
    // Browser blokir autoplay — tunggu interaksi pertama
  });
}

// Auto play saat halaman dimuat
playMusic();

// Jika browser blokir, coba play saat pertama kali ada interaksi
document.addEventListener("click",      playMusic, { once: true });
document.addEventListener("scroll",     playMusic, { once: true });
document.addEventListener("touchstart", playMusic, { once: true });

// Jika musik berhenti karena alasan apapun, langsung play lagi
bgMusic.addEventListener("pause", function () {
  bgMusic.play();
});

// Pastikan musik tidak bisa di-mute atau diganti volume dari luar
bgMusic.addEventListener("volumechange", function () {
  if (bgMusic.volume < 0.4) {
    bgMusic.volume = 0.4;
  }
});