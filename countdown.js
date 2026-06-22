/* ================================================================
   countdown.js — Countdown Timer Real-Time
   
   CARA MENGUBAH TANGGAL ACARA:
   Ganti nilai variabel weddingDate di bawah ini.
   Format: "YYYY-MM-DDTHH:MM:SS"
   Contoh: "2026-12-25T08:00:00" → 25 Desember 2026, pukul 08.00
================================================================ */

// *** GANTI: Tanggal dan waktu akad/resepsi ***
const weddingDate = new Date("2026-07-05T08:00:00");

// ===== Jangan ubah kode di bawah ini =====

function padTwo(num) {
  // Tambahkan angka nol di depan jika satu digit (misal: 9 → "09")
  return String(num).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now; // Selisih waktu dalam milidetik

  if (diff <= 0) {
    // Acara sudah berlangsung — sembunyikan timer, tampilkan pesan
    document.getElementById("countdown-timer").style.display = "none";
    document.getElementById("countdown-done").style.display = "block";
    return;
  }

  // Konversi milidetik → hari, jam, menit, detik
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Update tampilan di HTML
  document.getElementById("countdown-days").textContent = padTwo(days);
  document.getElementById("countdown-hours").textContent = padTwo(hours);
  document.getElementById("countdown-minutes").textContent = padTwo(minutes);
  document.getElementById("countdown-seconds").textContent = padTwo(seconds);
}

// Jalankan langsung saat halaman dimuat
updateCountdown();

// Update setiap 1 detik
setInterval(updateCountdown, 1000);