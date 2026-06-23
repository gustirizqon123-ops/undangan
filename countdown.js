/* ================================================================
   countdown.js — Countdown Timer Real-Time (High Accuracy)

   CARA MENGUBAH TANGGAL ACARA:
   Ganti nilai variabel WEDDING_TIMESTAMP di bawah ini.
   Gunakan format ISO 8601: "YYYY-MM-DDTHH:MM:SS"
   Contoh: "2026-12-25T08:00:00" → 25 Desember 2026, pukul 08.00

   Keunggulan versi ini:
   - Menggunakan Date.now() (lebih akurat, tidak bergantung sistem clock drift)
   - Koreksi otomatis jika tab di-minimize lalu dibuka kembali
   - Tidak ada delay palsu meskipun halaman di-refresh
================================================================ */

(function () {
  'use strict';

  /* *** GANTI: Tanggal dan waktu akad/resepsi *** */
  var WEDDING_TIMESTAMP = new Date('2026-07-05T08:00:00').getTime();

  /* ===== Jangan ubah kode di bawah ini ===== */

  var elTimer = document.getElementById('countdown-timer');
  var elDone = document.getElementById('countdown-done');
  var elDays = document.getElementById('countdown-days');
  var elHours = document.getElementById('countdown-hours');
  var elMins = document.getElementById('countdown-minutes');
  var elSecs = document.getElementById('countdown-seconds');

  if (!elTimer || !elDone || !elDays || !elHours || !elMins || !elSecs) return;

  /* Tambah nol di depan angka satu digit: 9 → "09" */
  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  /* Variabel untuk track apakah tampilan sudah diperbarui */
  var prevValues = { d: null, h: null, m: null, s: null };

  function updateCountdown() {
    var now = Date.now(); // Milidetik sejak epoch — lebih akurat dari new Date()
    var diff = WEDDING_TIMESTAMP - now;

    if (diff <= 0) {
      /* Acara sudah lewat */
      elTimer.style.display = 'none';
      elDone.style.display = 'block';
      return;
    }

    /* Konversi milidetik → komponen waktu */
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    /* Update DOM hanya jika nilai berubah → mengurangi reflow */
    if (days !== prevValues.d) { elDays.textContent = pad(days); prevValues.d = days; }
    if (hours !== prevValues.h) { elHours.textContent = pad(hours); prevValues.h = hours; }
    if (minutes !== prevValues.m) { elMins.textContent = pad(minutes); prevValues.m = minutes; }
    if (seconds !== prevValues.s) { elSecs.textContent = pad(seconds); prevValues.s = seconds; }
  }

  /* ----------------------------------------------------------------
     Jalankan pertama kali SEGERA (tanpa delay 1 detik)
  ---------------------------------------------------------------- */
  updateCountdown();

  /* ----------------------------------------------------------------
     Update setiap tepat 1000 ms menggunakan koreksi drift.
     Teknik ini menjaga interval tetap akurat meski tab dibiarkan
     di background lama lalu dibuka kembali.
  ---------------------------------------------------------------- */
  var expectedTime;
  var tickInterval;

  function scheduleTick() {
    var now = Date.now();
    /* Hitung berapa ms tersisa hingga detik berikutnya */
    var nextSecond = 1000 - (now % 1000);
    expectedTime = now + nextSecond;

    setTimeout(function onTick() {
      var drift = Date.now() - expectedTime; // Koreksi keterlambatan
      updateCountdown();

      /* Cegah drift terakumulasi */
      expectedTime += 1000;
      var delay = Math.max(0, 1000 - drift);
      setTimeout(onTick, delay);
      expectedTime = Date.now() + delay;
    }, nextSecond);
  }

  scheduleTick();

  /* ----------------------------------------------------------------
     Sinkronisasi saat tab kembali aktif (Page Visibility API)
     Ini memastikan countdown langsung akurat begitu pengguna
     kembali ke tab setelah lama meninggalkan halaman.
  ---------------------------------------------------------------- */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      updateCountdown();
    }
  });

})();