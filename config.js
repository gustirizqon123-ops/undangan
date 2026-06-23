/* ================================================================
   config.js — SATU TEMPAT UNTUK MENGUBAH DATA UNDANGAN

   Cara pakai:
   1. Ganti nilai di bawah sesuai acara Anda
   2. Simpan file — tidak perlu ubah file lain (kecuali teks panjang di HTML)
   3. Format tanggal: "YYYY-MM-DDTHH:MM:SS" (24 jam, zona lokal browser)

   *** GANTI bagian yang ditandai ***
================================================================ */
window.WEDDING_CONFIG = {
  /* --- Nama pasangan --- */
  groomName: 'Gusti Ahmad Al Ghifari Rizqon',
  brideName: 'Someone',
  shortNames: 'Al & Someone',

  /* --- Tanggal acara (untuk countdown) --- */
  weddingDateISO: '2026-07-05T08:00:00',

  /* --- Tampilan hero --- */
  heroDateLabel: 'Minggu, 05 Juli 2026',
  couplePhoto: 'img/couple.jpg',

  /* --- Musik latar --- */
  audioSrc: 'audio/lagu.mp3',
  audioVolume: 0.45,

  /* --- Footer --- */
  copyrightYear: 2026,

  /* --- Galeri (untuk preload — pastikan file ada di folder img/) --- */
  galleryImages: [
    'img/gallery-1.jpg',
    'img/gallery-2.jpg',
    'img/gallery-3.jpg',
    'img/gallery-4.jpg',
    'img/gallery-5.jpg',
    'img/gallery-6.jpg'
  ]
};
