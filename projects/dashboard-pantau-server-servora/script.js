// Server monitoring dashboard: sample data, SVG chart, filters, and theme switch.
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var POINTS = 72;
  var servers = [
    { name: "api-utama-01", region: "Jakarta", status: "online", cpu: 42, mem: 61, disk: 48, uptime: "41 hari" },
    { name: "api-utama-02", region: "Jakarta", status: "online", cpu: 38, mem: 57, disk: 46, uptime: "41 hari" },
    { name: "database-01", region: "Jakarta", status: "warning", cpu: 78, mem: 88, disk: 81, uptime: "97 hari" },
    { name: "cache-01", region: "Surabaya", status: "online", cpu: 21, mem: 44, disk: 22, uptime: "12 hari" },
    { name: "worker-01", region: "Surabaya", status: "online", cpu: 55, mem: 52, disk: 35, uptime: "23 hari" },
    { name: "backup-01", region: "Bandung", status: "offline", cpu: 0, mem: 0, disk: 93, uptime: "0 hari" },
    { name: "web-statis-01", region: "Bandung", status: "online", cpu: 14, mem: 29, disk: 18, uptime: "63 hari" },
    { name: "log-01", region: "Jakarta", status: "warning", cpu: 63, mem: 74, disk: 90, uptime: "5 hari" }
  ];
  var statusLabel = { online: "Online", warning: "Perlu dicek", offline: "Offline" };
  var state = { metric: "cpu", range: 36, query: "", status: "all", series: null };

  function $(id) {
    return document.getElementById(id);
  }

  function svgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
    return el;
  }

  // Seeded generator so the sample chart looks the same on every load.
  function makeSeries(base, seed) {
    var out = [];
    var x = seed;
    for (var i = 0; i < POINTS; i++) {
      x = (x * 9301 + 49297) % 233280;
      var wave = Math.sin(i / 7) * 8;
      out.push(Math.max(2, Math.min(98, Math.round(base + wave + (x / 233280) * 10 - 5))));
    }
    return out;
  }

  function loadTheme() {
    var saved = "auto";
    try {
      saved = localStorage.getItem("servora-theme") || "auto";
    } catch (e) {
      saved = "auto";
    }
    applyTheme(saved);
    $("theme-select").value = saved;
  }

  function applyTheme(value) {
    if (value === "light" || value === "dark") {
      document.documentElement.setAttribute("data-theme", value);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function showOnly(name) {
    $("state-loading").hidden = name !== "loading";
    $("state-error").hidden = name !== "error";
    $("dashboard").hidden = name !== "ready";
  }

  // The fake delay lets people see the loading state; real apps would call a server here.
  function load(shouldFail) {
    showOnly("loading");
    window.setTimeout(function () {
      if (shouldFail) {
        showOnly("error");
        $("retry-btn").focus();
        return;
      }
      state.series = {
        cpu: makeSeries(46, 7),
        mem: makeSeries(62, 21)
      };
      showOnly("ready");
      render();
      $("updated-at").textContent = "Terakhir dimuat " + new Date().toLocaleTimeString("id-ID") + ". Data contoh, nggak terhubung ke server sungguhan.";
    }, 700);
  }

  function renderSummary() {
    var online = servers.filter(function (s) { return s.status === "online"; }).length;
    var warn = servers.filter(function (s) { return s.status === "warning"; }).length;
    var off = servers.filter(function (s) { return s.status === "offline"; }).length;
    var items = [["Total server", servers.length], ["Online", online], ["Perlu dicek", warn], ["Offline", off]];
    var list = $("summary");
    list.textContent = "";
    items.forEach(function (it) {
      var li = document.createElement("li");
      var label = document.createElement("span");
      label.className = "label";
      label.textContent = it[0];
      var value = document.createElement("span");
      value.className = "value";
      value.textContent = String(it[1]);
      li.appendChild(label);
      li.appendChild(value);
      list.appendChild(li);
    });
  }

  function renderChart() {
    var svg = $("chart");
    var data = state.series[state.metric].slice(-state.range);
    var w = 640, h = 240, left = 36, right = 12, top = 12, bottom = 28;
    var plotW = w - left - right, plotH = h - top - bottom;
    Array.prototype.slice.call(svg.querySelectorAll("*:not(title)")).forEach(function (n) { n.remove(); });

    [0, 25, 50, 75, 100].forEach(function (v) {
      var y = top + plotH - (v / 100) * plotH;
      svg.appendChild(svgEl("line", { x1: left, x2: w - right, y1: y, y2: y, class: "grid-line" }));
      var t = svgEl("text", { x: left - 6, y: y + 4, "text-anchor": "end", class: "axis-text" });
      t.textContent = v + "%";
      svg.appendChild(t);
    });

    var pts = data.map(function (v, i) {
      return [left + (i / (data.length - 1)) * plotW, top + plotH - (v / 100) * plotH];
    });
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    svg.appendChild(svgEl("path", { d: line + " L" + pts[pts.length - 1][0] + " " + (top + plotH) + " L" + left + " " + (top + plotH) + " Z", class: "area" }));
    svg.appendChild(svgEl("path", { d: line, class: "series" }));
    var last = pts[pts.length - 1];
    svg.appendChild(svgEl("circle", { cx: last[0], cy: last[1], r: 4, class: "dot" }));

    var startText = svgEl("text", { x: left, y: h - 8, class: "axis-text" });
    startText.textContent = state.range * 5 + " menit lalu";
    var endText = svgEl("text", { x: w - right, y: h - 8, "text-anchor": "end", class: "axis-text" });
    endText.textContent = "Sekarang";
    svg.appendChild(startText);
    svg.appendChild(endText);

    var avg = Math.round(data.reduce(function (a, b) { return a + b; }, 0) / data.length);
    var name = state.metric === "cpu" ? "CPU" : "Memori";
    $("chart-summary").textContent = name + " rata-rata " + avg + "%, sekarang " + data[data.length - 1] + "%.";
  }

  function meter(label, value) {
    var row = document.createElement("div");
    row.className = "meter";
    var name = document.createElement("span");
    name.textContent = label;
    var svg = svgEl("svg", { viewBox: "0 0 100 8", preserveAspectRatio: "none", "aria-hidden": "true" });
    svg.appendChild(svgEl("rect", { x: 0, y: 0, width: 100, height: 8, rx: 4, class: "track" }));
    svg.appendChild(svgEl("rect", { x: 0, y: 0, width: Math.max(value, 1), height: 8, rx: 4, class: value >= 85 ? "fill is-high" : "fill" }));
    var num = document.createElement("span");
    num.className = "meter-value";
    num.textContent = value + "%";
    row.appendChild(name);
    row.appendChild(svg);
    row.appendChild(num);
    return row;
  }

  function renderList() {
    var q = state.query.trim().toLowerCase();
    var shown = servers.filter(function (s) {
      var okStatus = state.status === "all" || s.status === state.status;
      return okStatus && (s.name + " " + s.region).toLowerCase().indexOf(q) !== -1;
    });
    var list = $("server-list");
    list.textContent = "";
    $("state-empty").hidden = shown.length > 0;
    shown.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "server";
      var top = document.createElement("div");
      top.className = "server-top";
      var info = document.createElement("div");
      var name = document.createElement("div");
      name.className = "server-name";
      name.textContent = s.name;
      var meta = document.createElement("div");
      meta.className = "server-meta";
      meta.textContent = s.region + " - aktif " + s.uptime;
      info.appendChild(name);
      info.appendChild(meta);
      var badge = document.createElement("span");
      badge.className = "badge badge-" + s.status;
      badge.textContent = statusLabel[s.status];
      top.appendChild(info);
      top.appendChild(badge);
      var meters = document.createElement("div");
      meters.className = "meters";
      meters.appendChild(meter("CPU", s.cpu));
      meters.appendChild(meter("Memori", s.mem));
      meters.appendChild(meter("Disk", s.disk));
      li.appendChild(top);
      li.appendChild(meters);
      list.appendChild(li);
    });
  }

  function render() {
    renderSummary();
    renderChart();
    renderList();
  }

  function bindSegments(attr, key) {
    document.querySelectorAll("[data-" + attr + "]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state[key] = attr === "range" ? Number(btn.getAttribute("data-range")) : btn.getAttribute("data-metric");
        document.querySelectorAll("[data-" + attr + "]").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        renderChart();
      });
    });
  }

  $("theme-select").addEventListener("change", function (e) {
    applyTheme(e.target.value);
    try {
      localStorage.setItem("servora-theme", e.target.value);
    } catch (err) {
      // Storage can be blocked; the theme still works for this visit.
    }
  });
  $("refresh-btn").addEventListener("click", function () { load(false); });
  $("retry-btn").addEventListener("click", function () { load(false); });
  $("fail-btn").addEventListener("click", function () { load(true); });
  $("search").addEventListener("input", function (e) {
    state.query = e.target.value;
    renderList();
  });
  $("status-filter").addEventListener("change", function (e) {
    state.status = e.target.value;
    renderList();
  });
  $("reset-btn").addEventListener("click", function () {
    state.query = "";
    state.status = "all";
    $("search").value = "";
    $("status-filter").value = "all";
    renderList();
    $("search").focus();
  });

  bindSegments("metric", "metric");
  bindSegments("range", "range");
  loadTheme();
  load(false);
})();
