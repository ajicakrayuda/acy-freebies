// Page behaviour: theme switch, mobile menu, pricing toggle, FAQ, and sign-up form checks.
(function () {
  var $ = function (s) {
    return document.querySelector(s);
  };
  var root = document.documentElement;
  var P = '<svg viewBox="0 0 24 24" aria-hidden="true">';
  var features = [
    [
      "Papan Kanban",
      "Geser tugas dari satu kolom ke kolom lain, alur kerja langsung kelihatan.",
      '<path d="M4 5h4v14H4zM10 5h4v9h-4zM16 5h4v6h-4z"/>',
    ],
    [
      "Batas waktu &amp; pengingat",
      "Pengingat otomatis, jadi nggak ada tugas yang kelewat.",
      '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    ],
    [
      "Kerja bareng di satu tempat",
      "Komentar, mention, dan lampiran ada langsung di dalam tugasnya.",
      '<path d="M4 5h16v11H9l-5 4z"/>',
    ],
    [
      "Template proyek",
      "Mulai lebih cepat pakai template untuk sprint, kampanye, dan onboarding.",
      '<path d="M5 3h10l4 4v14H5zM14 3v5h5"/>',
    ],
    [
      "Laporan mingguan",
      "Ringkasan progres tim dikirim otomatis tiap Senin pagi.",
      '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    ],
    [
      "Aman &amp; privat",
      "Hak akses diatur per proyek, jadi informasi cuma dilihat orang yang berhak.",
      '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    ],
  ];
  $("#fitur-grid").innerHTML = features
    .map(function (f) {
      return (
        '<article class="panel"><div class="ico">' +
        P +
        f[2] +
        "</svg></div><h3>" +
        f[0] +
        "</h3><p>" +
        f[1] +
        "</p></article>"
      );
    })
    .join("");

  var plans = [
    {
      n: "Gratis",
      m: 0,
      y: 0,
      d: "Buat tim kecil yang baru mulai.",
      f: ["Sampai 5 orang", "3 proyek aktif", "Papan Kanban dasar"],
      c: "Mulai gratis",
    },
    {
      n: "Tim",
      m: 49000,
      y: 39000,
      d: "Buat tim yang lagi berkembang.",
      f: [
        "Jumlah orang bebas",
        "Jumlah proyek bebas",
        "Pengingat &amp; laporan mingguan",
        "Template proyek",
      ],
      c: "Pilih Tim",
      pop: 1,
    },
    {
      n: "Bisnis",
      m: 99000,
      y: 79000,
      d: "Buat perusahaan yang butuh lebih.",
      f: [
        "Semua fitur paket Tim",
        "Pengaturan hak akses lebih detail",
        "Riwayat aktivitas 1 tahun",
        "Bantuan diprioritaskan",
      ],
      c: "Pilih Bisnis",
    },
  ];
  var fmt = function (n) {
    return n === 0 ? "Rp0" : "Rp" + n.toLocaleString("id-ID");
  };
  var yearly = false;
  function renderPlans() {
    $("#plans").innerHTML = plans
      .map(function (p) {
        return (
          '<article class="panel plan' +
          (p.pop ? " pop" : "") +
          '"><h3>' +
          p.n +
          (p.pop ? ' <span class="badge">Populer</span>' : "") +
          "</h3><p>" +
          p.d +
          "</p>" +
          '<div class="price">' +
          fmt(yearly ? p.y : p.m) +
          " <small>/ orang / bulan</small></div>" +
          "<ul>" +
          p.f
            .map(function (x) {
              return "<li>" + x + "</li>";
            })
            .join("") +
          "</ul>" +
          '<a class="btn' +
          (p.pop ? "" : " ghost") +
          '" href="#daftar">' +
          p.c +
          "</a></article>"
        );
      })
      .join("");
  }
  renderPlans();
  $("#bill").addEventListener("click", function () {
    yearly = !yearly;
    this.setAttribute("aria-checked", yearly);
    renderPlans();
  });

  var faqs = [
    [
      "Nimbus beneran gratis?",
      "Iya. Paket Gratis bisa dipakai selamanya untuk tim sampai 5 orang. Paket berbayar isinya fitur tambahan.",
    ],
    [
      "Bisa ganti paket nggak?",
      "Bisa, kapan saja. Mau naik atau turun paket, tagihannya otomatis menyesuaikan.",
    ],
    [
      "Data saya aman?",
      "Aman. Data dienkripsi waktu disimpan dan dikirim, dan admin tim yang mengatur siapa boleh buka tiap proyek.",
    ],
    ["Ada aplikasi HP-nya?", "Belum ada, tapi Nimbus nyaman dibuka dari browser HP."],
  ];
  $("#faq-list").innerHTML = faqs
    .map(function (f, i) {
      return (
        '<div><h3><button class="q" type="button" aria-expanded="false" aria-controls="a' +
        i +
        '" id="q' +
        i +
        '">' +
        f[0] +
        "</button></h3>" +
        '<div class="a" id="a' +
        i +
        '" role="region" aria-labelledby="q' +
        i +
        '" hidden>' +
        f[1] +
        "</div></div>"
      );
    })
    .join("");
  $("#faq-list").addEventListener("click", function (e) {
    var b = e.target.closest(".q");
    if (!b) return;
    var open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", !open);
    document.getElementById(b.getAttribute("aria-controls")).hidden = open;
  });

  var mb = $("#menu-btn"),
    nav = $("#site-nav");
  function setMenu(o) {
    nav.classList.toggle("open", o);
    mb.setAttribute("aria-expanded", o);
    mb.setAttribute("aria-label", o ? "Tutup menu" : "Buka menu");
  }
  mb.addEventListener("click", function () {
    setMenu(mb.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mb.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      mb.focus();
    }
  });

  var tb = $("#theme-btn"),
    mq = window.matchMedia("(prefers-color-scheme: dark)");
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    tb.setAttribute("aria-pressed", t === "dark");
    tb.setAttribute("aria-label", t === "dark" ? "Ganti ke tema terang" : "Ganti ke tema gelap");
  }
  var saved = null;
  try {
    saved = localStorage.getItem("nimbus-theme");
  } catch (e) {}
  applyTheme(saved || (mq.matches ? "dark" : "light"));
  tb.addEventListener("click", function () {
    var t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(t);
    try {
      localStorage.setItem("nimbus-theme", t);
    } catch (e) {}
  });
  mq.addEventListener &&
    mq.addEventListener("change", function (e) {
      var s = null;
      try {
        s = localStorage.getItem("nimbus-theme");
      } catch (x) {}
      if (!s) applyTheme(e.matches ? "dark" : "light");
    });

  var form = $("#form"),
    email = $("#email"),
    msg = $("#email-msg");
  function show(t, c) {
    msg.textContent = t;
    msg.className = "msg " + c;
  }
  email.addEventListener("input", function () {
    email.removeAttribute("aria-invalid");
    if (msg.classList.contains("err")) show("", "");
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = email.value.trim();
    if (!v) {
      email.setAttribute("aria-invalid", "true");
      show("Emailnya belum diisi. Isi dulu ya.", "err");
      email.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      email.setAttribute("aria-invalid", "true");
      show("Email ini sepertinya belum benar. Contoh yang benar: nama@perusahaan.id", "err");
      email.focus();
      return;
    }
    email.removeAttribute("aria-invalid");
    show("Terima kasih! " + v + " sudah kami catat. Nanti kami kabari lewat email itu.", "ok");
    form.reset();
  });
  $("#year").textContent = new Date().getFullYear();
})();
