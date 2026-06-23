/* ================================================================
   countdown.js — Countdown Timer Akurat (Real-Time)

   Tanggal diambil dari config.js → WEDDING_CONFIG.weddingDateISO
   Fallback: ubah WEDDING_DATE_FALLBACK jika config.js tidak dimuat
================================================================ */

(function () {
  'use strict';

  /* *** GANTI jika tidak memakai config.js *** */
  var WEDDING_DATE_FALLBACK = '2026-07-05T08:00:00';

  var cfg = window.WEDDING_CONFIG || {};
  var WEDDING_TIMESTAMP = new Date(cfg.weddingDateISO || WEDDING_DATE_FALLBACK).getTime();

  var elTimer = document.getElementById('countdown-timer');
  var elDone = document.getElementById('countdown-done');
  var elDays = document.getElementById('countdown-days');
  var elHours = document.getElementById('countdown-hours');
  var elMins = document.getElementById('countdown-minutes');
  var elSecs = document.getElementById('countdown-seconds');

  if (!elTimer || !elDone || !elDays || !elHours || !elMins || !elSecs) return;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  var prevValues = { d: null, h: null, m: null, s: null };
  var finished = false;

  function showDone() {
    if (finished) return;
    finished = true;
    elTimer.hidden = true;
    elDone.hidden = false;
  }

  function updateCountdown() {
    var diff = WEDDING_TIMESTAMP - Date.now();

    if (diff <= 0) {
      showDone();
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    if (days !== prevValues.d) { elDays.textContent = pad(days); prevValues.d = days; }
    if (hours !== prevValues.h) { elHours.textContent = pad(hours); prevValues.h = hours; }
    if (minutes !== prevValues.m) { elMins.textContent = pad(minutes); prevValues.m = minutes; }
    if (seconds !== prevValues.s) { elSecs.textContent = pad(seconds); prevValues.s = seconds; }
  }

  /* Jalankan segera — tanpa menunggu DOMContentLoaded (script di akhir body) */
  updateCountdown();

  /* Sinkron ke detik berikutnya, koreksi drift agar tetap akurat */
  function scheduleTick() {
    var msToNextSecond = 1000 - (Date.now() % 1000);

    setTimeout(function tick() {
      updateCountdown();
      if (!finished) setTimeout(tick, 1000);
    }, msToNextSecond);
  }

  scheduleTick();

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') updateCountdown();
  });

})();
