/* Alanya Arsa Ofisi · etkileşimli konum bölümü (Dijitabela, 27 Eki 2026)
   MapLibre GL 4.7.1 (unpkg, sabit sürüm) yalnız bölüm ekrana yaklaşınca yüklenir.
   Altlıklar anahtarsız: OpenFreeMap (OSM) sokak, Esri World Imagery uydu, AWS Terrain Tiles (terrarium) arazi.
   Mesafeler kuş uçuşu (haversine); süreler yol katsayısı + ortalama hızla YAKLAŞIK tahmindir.
   Hedef koordinatları: havalimanları bilinen konumlar; plaj, hastane, okul ve AVM noktaları YAKLAŞIK/genel noktadır. */
(function () {
  "use strict";
  var ML_JS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js", ML_CSS = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
  var STIL = "https://tiles.openfreemap.org/styles/liberty";
  var DILLER = ["tr", "en", "ru", "de"];
  var K = {
    mod_harita: ["Harita", "Map", "Карта", "Karte"], mod_uydu: ["Uydu", "Satellite", "Спутник", "Satellit"], mod_3d: ["3D tur", "3D tour", "3D-облёт", "3D-Flug"],
    mod_hava: ["Havalimanı", "Airports", "Аэропорты", "Flughäfen"], mod_google: ["Google", "Google", "Google", "Google"],
    yukle: ["Harita yükleniyor…", "Loading map…", "Загрузка карты…", "Karte wird geladen…"],
    bekle: ["Harita bu bölüme gelince yüklenir", "The map loads when you reach this section", "Карта загрузится, когда вы дойдёте до этого раздела", "Die Karte lädt, sobald Sie diesen Abschnitt erreichen"],
    hata: ["Etkileşimli harita bu cihazda açılamadı; Google Haritalar görünümü gösteriliyor.", "The interactive map could not start on this device; showing Google Maps instead.", "Интерактивная карта не запустилась на этом устройстве; показываем Google Карты.", "Die interaktive Karte konnte auf diesem Gerät nicht starten; stattdessen wird Google Maps angezeigt."],
    not: ["Temsili parsel · konumlar yaklaşık", "Indicative plot · approximate locations", "Условные границы · расположение приблизительное", "Symbolische Parzelle · ungefähre Lage"],
    skor: ["Konum skoru", "Location score", "Оценка локации", "Lage-Score"],
    skor_p: ["Formül: deniz %35 · hizmetler %30 · merkez %20 · GZP havalimanı %15. Her bileşen mesafeye göre 0–1 arası puanlanır.", "Formula: sea 35% · services 30% · centre 20% · GZP airport 15%. Each component scores 0–1 based on distance.", "Формула: море 35% · инфраструктура 30% · центр 20% · аэропорт GZP 15%. Каждый компонент — от 0 до 1 в зависимости от расстояния.", "Formel: Meer 35 % · Versorgung 30 % · Zentrum 20 % · Flughafen GZP 15 %. Jeder Bestandteil zählt 0–1 je nach Entfernung."],
    b_deniz: ["Denize yakınlık", "Sea", "Море", "Meer"], b_hizmet: ["Hastane · okul · AVM", "Hospital · school · mall", "Больница · школа · ТЦ", "Klinik · Schule · Einkauf"],
    b_merkez: ["Merkeze yakınlık", "Centre", "Центр", "Zentrum"], b_hava: ["Havalimanı (GZP)", "Airport (GZP)", "Аэропорт (GZP)", "Flughafen (GZP)"],
    h_deniz: ["En yakın sahil", "Nearest beach", "Ближайший пляж", "Nächster Strand"], h_merkez: ["Alanya merkez (İskele)", "Alanya centre (harbour)", "Центр Алании (порт)", "Zentrum Alanya (Hafen)"],
    h_gzp: ["Gazipaşa-Alanya Havalimanı", "Gazipaşa-Alanya Airport", "Аэропорт Газипаша-Аланья", "Flughafen Gazipaşa-Alanya"], h_ayt: ["Antalya Havalimanı", "Antalya Airport", "Аэропорт Анталья", "Flughafen Antalya"],
    h_hastane: ["Hastane", "Hospital", "Больница", "Krankenhaus"], h_okul: ["Okul", "School", "Школа", "Schule"], h_avm: ["Alışveriş merkezi", "Shopping mall", "Торговый центр", "Einkaufszentrum"],
    k_deniz: ["Deniz", "Sea", "Море", "Meer"], k_merkez: ["Merkez", "Centre", "Центр", "Zentrum"], k_gzp: ["GZP", "GZP", "GZP", "GZP"], k_ayt: ["AYT", "AYT", "AYT", "AYT"],
    k_hastane: ["Hastane", "Hospital", "Больница", "Klinik"], k_okul: ["Okul", "School", "Школа", "Schule"], k_avm: ["AVM", "Mall", "ТЦ", "Einkauf"],
    genel: ["genel nokta", "approximate point", "приблизительная точка", "ungefährer Punkt"],
    arac: ["araçla ≈ {d} dk", "≈ {d} min by car", "≈ {d} мин на авто", "≈ {d} Min. Auto"], yuru: ["yürüyerek ≈ {d} dk", "≈ {d} min on foot", "≈ {d} мин пешком", "≈ {d} Min. zu Fuß"],
    dip: ["Mesafeler iki nokta arası kuş uçuşu (haversine) hesaplanır; süreler yol katsayısı ve ortalama hızla yapılmış yaklaşık tahminlerdir. Plaj, hastane, okul ve AVM noktaları genel noktalardır.", "Distances are straight-line (haversine) between two points; travel times are approximate estimates using a road factor and average speeds. Beach, hospital, school and mall points are approximate.", "Расстояния — по прямой (формула гаверсинуса); время в пути — приблизительная оценка с учётом коэффициента дорог и средней скорости. Точки пляжа, больницы, школы и ТЦ приблизительные.", "Entfernungen sind Luftlinie (Haversine); Fahrzeiten sind ungefähre Schätzungen mit Straßenfaktor und Durchschnittsgeschwindigkeit. Strand-, Klinik-, Schul- und Einkaufspunkte sind ungefähr."],
    kaynak: ["Harita: © OpenStreetMap katkıcıları · OpenFreeMap · Uydu: Esri World Imagery · Arazi: AWS Terrain Tiles", "Map: © OpenStreetMap contributors · OpenFreeMap · Satellite: Esri World Imagery · Terrain: AWS Terrain Tiles", "Карта: © участники OpenStreetMap · OpenFreeMap · Спутник: Esri World Imagery · Рельеф: AWS Terrain Tiles", "Karte: © OpenStreetMap-Mitwirkende · OpenFreeMap · Satellit: Esri World Imagery · Gelände: AWS Terrain Tiles"],
    google_ac: ["Google Haritalar'da aç", "Open in Google Maps", "Открыть в Google Картах", "In Google Maps öffnen"],
    ctrl: ["Haritayı yakınlaştırmak için Ctrl + kaydırma kullanın", "Use Ctrl + scroll to zoom the map", "Используйте Ctrl + колесо для масштабирования", "Strg + Scrollen zum Zoomen der Karte"],
    mac: ["Yakınlaştırmak için ⌘ + kaydırma kullanın", "Use ⌘ + scroll to zoom the map", "Используйте ⌘ + колесо для масштабирования", "⌘ + Scrollen zum Zoomen"],
    mobil: ["Haritayı iki parmakla kaydırın", "Use two fingers to move the map", "Двигайте карту двумя пальцами", "Karte mit zwei Fingern bewegen"]
  };
  function dil() { return window.AAO ? window.AAO.dil() : "tr"; }
  function k(a, v) { var s = K[a][DILLER.indexOf(dil())]; if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]); return s; }
  function A() { return window.AAO; }

  /* ---------- Hedef noktaları ---------- */
  var MERKEZ = { lat: 36.5385, lng: 31.9990 };
  var GZP = { lat: 36.299, lng: 32.300 }, AYT = { lat: 36.898, lng: 30.800 };
  var PLAJ = [[36.5545, 31.9709, "Kleopatra"], [36.5393, 32.0249, "Keykubat"], [36.5255, 32.0480, "Tosmur"], [36.5048, 32.0752, "Kestel"], [36.4877, 32.0958, "Mahmutlar"], [36.4585, 32.1221, "Kargıcak"]];
  var HASTANE = [[36.5480, 31.9940, "Saray"], [36.4935, 32.1020, "Mahmutlar"]];
  var OKUL = [[36.5470, 31.9960, "Saray"], [36.5395, 32.0400, "Oba"], [36.5500, 32.0270, "Cikcilli"], [36.5300, 32.0560, "Tosmur"], [36.5090, 32.0800, "Kestel"], [36.4920, 32.1020, "Mahmutlar"], [36.4630, 32.1270, "Kargıcak"], [36.5560, 32.1330, "Kuzyaka"], [36.5010, 32.1480, "Uzunöz"]];
  var AVM = [[36.5436, 32.0321, "Alanyum"], [36.4915, 32.0985, "Mahmutlar"]];
  var RENK = { deniz: "#5EC8F2", merkez: "#E2C48A", gzp: "#F2A65E", ayt: "#F2A65E", hastane: "#FF6B6B", okul: "#B9A4FF", avm: "#7FE0B0" };
  var IKON = {
    deniz: '<path d="M2 15c2 0 2-1.5 4-1.5S8 15 10 15s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M12 3v8m-4-4 4-4 4 4"/>',
    merkez: '<path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6"/>',
    gzp: '<path d="M2 16l20-6-3-2-7 2-5-5H5l3 6-4 1-2-2H1l1 6z"/>', ayt: '<path d="M2 16l20-6-3-2-7 2-5-5H5l3 6-4 1-2-2H1l1 6z"/>',
    hastane: '<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>', okul: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5"/>', avm: '<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>'
  };

  function hav(a, b) { var R = 6371, r = Math.PI / 180, dLa = (b.lat - a.lat) * r, dLo = (b.lng - a.lng) * r, x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLo / 2) * Math.sin(dLo / 2); return 2 * R * Math.asin(Math.sqrt(x)); }
  function yakin(p, liste) { var en = null; liste.forEach(function (q) { var o = { lat: q[0], lng: q[1], ad: q[2] }, d = hav(p, o); if (!en || d < en.d) { en = o; en.d = d; } }); return en; }
  function yon(a, b) { var r = Math.PI / 180, y = Math.sin((b.lng - a.lng) * r) * Math.cos(b.lat * r), x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lng - a.lng) * r); return (Math.atan2(y, x) / r + 360) % 360; }
  function puan(d, iyi, kotu) { return Math.max(0, Math.min(1, (kotu - d) / (kotu - iyi))); }
  function sure(d) { var yol = d * 1.3, hiz = yol < 8 ? 30 : yol < 30 ? 45 : 70, dk = yol / hiz * 60; return dk < 15 ? Math.max(1, Math.round(dk)) : Math.round(dk / 5) * 5; }
  function yuruSure(d) { var yol = d * 1.25; return yol <= 3 ? Math.max(1, Math.round(yol / 4.8 * 60)) : null; }
  function km(d) { var y = A() ? A().yerel() : "tr-TR"; return d < 1 ? Math.round(d * 1000 / 10) * 10 + " m" : d.toLocaleString(y, { maximumFractionDigits: d < 10 ? 1 : 0 }) + " km"; }

  function analiz(i) {
    var p = { lat: i.lat, lng: i.lng };
    var h = [
      { id: "deniz", n: yakin(p, PLAJ), genel: true },
      { id: "merkez", n: { lat: MERKEZ.lat, lng: MERKEZ.lng, ad: "İskele" } },
      { id: "hastane", n: yakin(p, HASTANE), genel: true },
      { id: "okul", n: yakin(p, OKUL), genel: true },
      { id: "avm", n: yakin(p, AVM), genel: true },
      { id: "gzp", n: { lat: GZP.lat, lng: GZP.lng, ad: "GZP" } },
      { id: "ayt", n: { lat: AYT.lat, lng: AYT.lng, ad: "AYT" } }
    ];
    h.forEach(function (x) { x.d = hav(p, x.n); x.arac = sure(x.d); x.yuru = yuruSure(x.d); x.yon = yon(p, x.n); });
    var by = {}; h.forEach(function (x) { by[x.id] = x; });
    var b = { deniz: puan(by.deniz.d, 0.3, 6), merkez: puan(by.merkez.d, 1, 15), hava: puan(by.gzp.d, 25, 60), hizmet: (puan(by.hastane.d, 0.5, 8) + puan(by.okul.d, 0.5, 8) + puan(by.avm.d, 0.5, 8)) / 3 };
    var skor = Math.round(b.deniz * 35 + b.hizmet * 30 + b.merkez * 20 + b.hava * 15);
    return { hedef: h, by: by, b: b, skor: skor, deniz: by.deniz.d, gzp: by.gzp.d };
  }

  /* ---------- Kütüphane yükleme ---------- */
  var mlSoz = null;
  function mlYukle() {
    if (window.maplibregl) return Promise.resolve(window.maplibregl);
    if (mlSoz) return mlSoz;
    mlSoz = new Promise(function (ok, red) {
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = ML_CSS; document.head.appendChild(l);
      var s = document.createElement("script"); s.src = ML_JS; s.async = true; s.onload = function () { window.maplibregl ? ok(window.maplibregl) : red(new Error("maplibre yok")); }; s.onerror = function () { mlSoz = null; red(new Error("maplibre yüklenemedi")); };
      document.head.appendChild(s);
    });
    return mlSoz;
  }
  function webglVar() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; } }
  var AZ = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DASH = [[0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5]];

  var ornekler = [];
  function kur(kok, ilan, opt) {
    opt = opt || {};
    var ben = { ilan: ilan, mod: "uydu", map: null, olu: false, gorunur: false, isaret: [], anim: 0, dash: 0, don: 0 };
    kok.innerHTML = '<div class="konum"><div class="k-harita"><div class="k-map"></div><div class="k-yukle"><span class="k-yukle-y"></span></div>' +
      '<div class="k-etiket"></div><span class="k-not"></span><div class="k-mod" role="group"></div></div><div class="k-yan"></div></div>';
    var el = { kap: kok.querySelector(".k-harita"), map: kok.querySelector(".k-map"), yukle: kok.querySelector(".k-yukle"), etiket: kok.querySelector(".k-etiket"), not: kok.querySelector(".k-not"), mod: kok.querySelector(".k-mod"), yan: kok.querySelector(".k-yan") };
    ben.el = el;

    function modlar() {
      el.mod.innerHTML = ["harita", "uydu", "3d", "hava", "google"].map(function (m) { return '<button type="button" data-mod="' + m + '" aria-pressed="' + (ben.mod === m) + '">' + k("mod_" + m) + "</button>"; }).join("");
    }
    function etiket() {
      var i = ben.ilan, a = A();
      el.etiket.innerHTML = '<div class="no">' + i.no + " · " + a.t(i.gercek ? "gercek_ilan" : "ornek_ilan") + '</div><div class="bas">' + a.baslik(i).replace(/</g, "&lt;") + '</div><div class="sat"><span><b>' + a.sayi(i.m2) + " m²</b></span><span><b>" + a.tl(i.fiyat) + "</b>" + (dil() !== "tr" ? " · " + a.eur(a.euroKarsilik(i.fiyat)) : "") + "</span><span>" + a.imarAd(i.imar) + "</span></div>";
      el.not.textContent = k("not");
    }
    function yan() {
      var an = analiz(ben.ilan); ben.an = an;
      var b = an.b, bil = [["b_deniz", b.deniz, 35], ["b_hizmet", b.hizmet, 30], ["b_merkez", b.merkez, 20], ["b_hava", b.hava, 15]];
      el.yan.innerHTML = '<div class="skor"><div class="halka" style="--p:' + an.skor + '"><div><b>' + an.skor + '</b><small>/ 100</small></div></div><div><h4>' + k("skor") + "</h4><p>" + k("skor_p") + "</p></div></div>" +
        '<div class="bilesen">' + bil.map(function (x) { return "<div><span>" + k(x[0]) + "</span><i><s style='width:" + Math.round(x[1] * 100) + "%'></s></i><em>" + Math.round(x[1] * x[2]) + "/" + x[2] + "</em></div>"; }).join("") + "</div>" +
        '<ul class="hedefler">' + an.hedef.map(function (h) {
          var alt = h.genel ? h.n.ad + " · " + k("genel") : h.id === "merkez" ? "" : h.n.ad;
          return '<li data-hedef="' + h.id + '"><span class="ik" style="color:' + RENK[h.id] + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">' + IKON[h.id] + '</svg></span><span class="ad">' + k("h_" + h.id) + (alt ? "<small>" + alt + "</small>" : "") + '</span><span class="mes">' + km(h.d) + "<small>" + (h.yuru ? k("yuru", { d: h.yuru }) : k("arac", { d: h.arac })) + "</small></span></li>";
        }).join("") + "</ul>" +
        '<p class="k-dip">' + k("dip") + '<br><a href="https://www.google.com/maps/search/?api=1&query=' + ben.ilan.lat + "," + ben.ilan.lng + '" target="_blank" rel="noopener">' + k("google_ac") + " ↗</a><br>" + k("kaynak") + "</p>";
    }
    function metinler() { modlar(); etiket(); yan(); el.kap.querySelector(".k-yukle-y").textContent = ben.map ? k("yukle") : k("bekle"); if (ben.map) etiketMarkerlari(); }
    ben.dilDegisti = metinler;
    metinler();

    /* ---------- Harita kurulumu ---------- */
    function googleGoster(acik) {
      var fr = el.kap.querySelector(".k-google");
      if (!acik) { if (fr) fr.remove(); return; }
      if (!fr) { fr = document.createElement("iframe"); fr.className = "k-google"; fr.loading = "lazy"; fr.referrerPolicy = "no-referrer-when-downgrade"; fr.title = "Google Maps"; el.kap.insertBefore(fr, el.etiket); }
      fr.src = "https://maps.google.com/maps?q=" + ben.ilan.lat + "," + ben.ilan.lng + "&z=15&t=k&output=embed";
    }
    function yedek() { el.yukle.querySelector(".k-yukle-y").textContent = k("hata"); ben.mod = "google"; modlar(); googleGoster(true); setTimeout(function () { el.yukle.style.display = "none"; }, 2500); }

    function baslat() {
      if (ben.map || ben.olu) return;
      if (!webglVar()) { yedek(); return; }
      el.yukle.querySelector(".k-yukle-y").textContent = k("yukle");
      mlYukle().then(function (ml) {
        if (ben.olu) return;
        var mobil = window.matchMedia("(max-width: 900px)").matches;
        try {
          ben.map = new ml.Map({ container: el.map, style: STIL, center: [ben.ilan.lng, ben.ilan.lat], zoom: 12.5, pitch: 0, maxPitch: 75, attributionControl: { compact: true },
            pixelRatio: Math.min(window.devicePixelRatio || 1, 2), cooperativeGestures: true, fadeDuration: 150,
            locale: { "CooperativeGesturesHandler.WindowsHelpText": k("ctrl"), "CooperativeGesturesHandler.MacHelpText": k("mac"), "CooperativeGesturesHandler.MobileHelpText": k("mobil") } });
        } catch (e) { yedek(); return; }
        var m = ben.map;
        m.addControl(new ml.NavigationControl({ visualizePitch: true, showCompass: true }), "top-right");
        m.on("error", function (e) { if (window.console && e && e.error && /style/i.test(String(e.error.message))) console.warn("harita:", e.error.message); });
        m.on("load", function () { if (ben.olu) return; katmanlar(ml); ben.hazir = true; tabanGoster(ben.mod === "harita" || ben.mod === "hava"); el.yukle.style.display = "none"; ciz(true); });
        ["mousedown", "touchstart", "wheel"].forEach(function (o) { m.on(o, function () { donDur(); }); });
      }).catch(function () { yedek(); });
    }

    function katmanlar(ml) {
      var m = ben.map, st = m.getStyle();
      ben.tabanKatman = st.layers.filter(function (l) { return l.type !== "symbol" && l.type !== "background"; }).map(function (l) { return l.id; });
      var ilkKatman = (st.layers[1] || {}).id;
      m.addSource("aao-esri", { type: "raster", tileSize: 256, maxzoom: 19, attribution: "Esri, Maxar, Earthstar Geographics", tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"] });
      m.addLayer({ id: "aao-esri", type: "raster", source: "aao-esri", layout: { visibility: "none" } }, ilkKatman);
      m.addSource("aao-dem", { type: "raster-dem", encoding: "terrarium", tileSize: 256, maxzoom: 14, tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"] });
      var bos = { type: "FeatureCollection", features: [] };
      ["aao-parsel", "aao-parsel-c", "aao-ok", "aao-uc", "aao-hedef"].forEach(function (s) { m.addSource(s, { type: "geojson", data: bos }); });
      m.addLayer({ id: "aao-parsel-dolgu", type: "fill", source: "aao-parsel", paint: { "fill-color": "#3DDC84", "fill-opacity": 0 } });
      m.addLayer({ id: "aao-parsel-golge", type: "line", source: "aao-parsel-c", paint: { "line-color": "#06210f", "line-width": 6, "line-opacity": 0.45 } });
      m.addLayer({ id: "aao-parsel-cizgi", type: "line", source: "aao-parsel-c", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#3DDC84", "line-width": 3.2 } });
      m.addLayer({ id: "aao-ok-golge", type: "line", source: "aao-ok", layout: { "line-cap": "round" }, paint: { "line-color": "#0B1220", "line-width": 5, "line-opacity": 0.45 } });
      m.addLayer({ id: "aao-ok-cizgi", type: "line", source: "aao-ok", paint: { "line-color": ["get", "renk"], "line-width": 2.6, "line-dasharray": [0, 4, 3] } });
      var c = document.createElement("canvas"); c.width = c.height = 36; var g = c.getContext("2d");
      g.beginPath(); g.moveTo(18, 3); g.lineTo(31, 31); g.lineTo(18, 24); g.lineTo(5, 31); g.closePath(); g.fillStyle = "#ffffff"; g.fill(); g.lineWidth = 2.5; g.strokeStyle = "#0B1220"; g.stroke();
      m.addImage("aao-ok", { width: 36, height: 36, data: new Uint8Array(g.getImageData(0, 0, 36, 36).data.buffer) }, { sdf: false });
      m.addLayer({ id: "aao-ok-bas", type: "symbol", source: "aao-uc", layout: { "icon-image": "aao-ok", "icon-size": 0.55, "icon-rotate": ["get", "yon"], "icon-rotation-alignment": "map", "icon-allow-overlap": true, "icon-ignore-placement": true } });
      m.addLayer({ id: "aao-hedef-n", type: "circle", source: "aao-hedef", paint: { "circle-radius": 6, "circle-color": ["get", "renk"], "circle-stroke-color": "#0B1220", "circle-stroke-width": 2, "circle-opacity": ["get", "op"], "circle-stroke-opacity": ["get", "op"] } });
      try { m.setSky && m.setSky({ "sky-color": "#9cc3e6", "horizon-color": "#e9d9b8", "fog-color": "#dfe6ee", "sky-horizon-blend": 0.5, "horizon-fog-blend": 0.6, "fog-ground-blend": 0.4 }); } catch (e) {}
    }

    function ignHtml() { return '<svg class="ml-igne" viewBox="0 0 34 44"><path d="M17 1C8.2 1 2 7.6 2 16c0 11 15 27 15 27s15-16 15-27C32 7.6 25.8 1 17 1z" fill="#D7263D" stroke="#fff" stroke-width="2.5"/><circle cx="17" cy="16" r="6" fill="#fff"/></svg>'; }
    function markerTemizle() { ben.isaret.forEach(function (x) { x.remove(); }); ben.isaret = []; ben.etiketler = []; }
    function etiketMarkerlari() {
      if (!ben.etiketler) return;
      ben.etiketler.forEach(function (x) { var h = ben.an.by[x.id]; x.el.innerHTML = "<b>" + k("k_" + x.id) + "</b> · " + km(h.d); });
    }
    function ciz(ilk) {
      var m = ben.map, ml = window.maplibregl, i = ben.ilan; if (!m) return;
      cancelAnimationFrame(ben.anim); markerTemizle();
      var an = ben.an || analiz(i), p = [i.lng, i.lat];
      var poly = A().parselKoord(i);
      m.getSource("aao-parsel").setData({ type: "Feature", geometry: { type: "Polygon", coordinates: [poly] } });
      m.setPaintProperty("aao-parsel-dolgu", "fill-opacity", 0);
      var pin = document.createElement("div"); pin.innerHTML = ignHtml();
      ben.isaret.push(new ml.Marker({ element: pin, anchor: "bottom" }).setLngLat(p).addTo(m));
      ben.etiketler = [];
      var hedefFC = [];
      an.hedef.forEach(function (h) {
        var e = document.createElement("div"); e.className = "ml-etiket"; e.style.opacity = "0"; e.style.transition = "opacity .5s";
        e.innerHTML = "<b>" + k("k_" + h.id) + "</b> · " + km(h.d);
        ben.etiketler.push({ id: h.id, el: e });
        var yy = h.yon, an2 = yy >= 45 && yy < 135 ? ["left", [10, 0]] : yy >= 135 && yy < 225 ? ["top", [0, 10]] : yy >= 225 && yy < 315 ? ["right", [-10, 0]] : ["bottom", [0, -10]];
        ben.isaret.push(new ml.Marker({ element: e, anchor: an2[0], offset: an2[1] }).setLngLat([h.n.lng, h.n.lat]).addTo(m));
        hedefFC.push({ type: "Feature", properties: { renk: RENK[h.id], op: 0 }, geometry: { type: "Point", coordinates: [h.n.lng, h.n.lat] } });
      });
      ben.hedefFC = hedefFC;
      var cevreKapsam = ben.mod === "3d" ? null : yakinPlan(i, poly);
      if (AZ || !cevreKapsam) gorusAyarla(true); else m.jumpTo(cevreKapsam);
      var fitYapildi = AZ || !cevreKapsam;
      // Çizim animasyonu: önce parsel sınırı (yeşil), sonra oklar sırayla
      var t0 = performance.now(), PD = AZ ? 1 : 1500, OB = AZ ? 0 : 450, OD = AZ ? 1 : 1300, AR = AZ ? 0 : 150;
      var cevre = []; for (var s = 0; s < poly.length - 1; s++) { var a = poly[s], b = poly[s + 1]; for (var u = 0; u < 12; u++) cevre.push([a[0] + (b[0] - a[0]) * u / 12, a[1] + (b[1] - a[1]) * u / 12]); } cevre.push(poly[0]);
      function kare(now) {
        if (ben.olu || !ben.map) return;
        var e = now - t0, pp = Math.min(1, e / PD), n = Math.max(2, Math.ceil(cevre.length * pp));
        if (!fitYapildi && e > PD + 250) { fitYapildi = true; gorusAyarla(false, 2000); }
        m.getSource("aao-parsel-c").setData({ type: "Feature", geometry: { type: "LineString", coordinates: cevre.slice(0, n) } });
        m.setPaintProperty("aao-parsel-dolgu", "fill-opacity", pp >= 1 ? Math.min(0.24, (e - PD) / 1500 * 0.24 + 0.02) : 0);
        var hatlar = [], uclar = [], bitti = pp >= 1;
        an.hedef.forEach(function (h, j) {
          var q = Math.max(0, Math.min(1, (e - PD - OB - j * AR) / OD)); if (q <= 0) { bitti = false; return; }
          var ez = 1 - Math.pow(1 - q, 3), uc = [p[0] + (h.n.lng - p[0]) * ez, p[1] + (h.n.lat - p[1]) * ez];
          hatlar.push({ type: "Feature", properties: { renk: RENK[h.id] }, geometry: { type: "LineString", coordinates: [p, uc] } });
          uclar.push({ type: "Feature", properties: { yon: h.yon }, geometry: { type: "Point", coordinates: uc } });
          if (q >= 1) { ben.hedefFC[j].properties.op = 1; ben.etiketler[j].el.style.opacity = "1"; } else bitti = false;
        });
        m.getSource("aao-ok").setData({ type: "FeatureCollection", features: hatlar });
        m.getSource("aao-uc").setData({ type: "FeatureCollection", features: uclar });
        m.getSource("aao-hedef").setData({ type: "FeatureCollection", features: ben.hedefFC });
        if (!bitti) ben.anim = requestAnimationFrame(kare); else { m.setPaintProperty("aao-parsel-dolgu", "fill-opacity", 0.24); kesikBaslat(); }
      }
      ben.anim = requestAnimationFrame(kare);
    }
    function kesikBaslat() {
      clearInterval(ben.dash); if (AZ) return;
      var adim = 0;
      ben.dash = setInterval(function () {
        if (!ben.map || !ben.gorunur || document.hidden) return;
        adim = (adim + 1) % DASH.length;
        try { ben.map.setPaintProperty("aao-ok-cizgi", "line-dasharray", DASH[adim]); } catch (e) {}
      }, 90);
    }
    function sinirlar(havaDahil) {
      var i = ben.ilan, an = ben.an, pts = [[i.lng, i.lat]];
      an.hedef.forEach(function (h) {
        if (!havaDahil && (h.id === "gzp" || h.id === "ayt" || (h.id === "merkez" && h.d > 4))) return;
        pts.push([h.n.lng, h.n.lat]);
        if (!havaDahil) pts.push([2 * i.lng - h.n.lng, 2 * i.lat - h.n.lat]); // simetrik: ilan ortada kalsın
      });
      var b = new window.maplibregl.LngLatBounds(pts[0], pts[0]); pts.forEach(function (q) { b.extend(q); }); return b;
    }
    function dolgu() { var mobil = el.kap.clientWidth < 640; return mobil ? { top: 110, bottom: 120, left: 30, right: 30 } : { top: 110, bottom: 90, left: 60, right: 70 }; }
    function gorusAyarla(ilk, sureMs) {
      var m = ben.map; if (!m) return;
      if (ben.mod === "3d") { ucBoyut(); return; }
      m.fitBounds(sinirlar(ben.mod === "hava"), { padding: dolgu(), pitch: 0, bearing: 0, duration: ilk ? 0 : (sureMs || 1200), maxZoom: 15, essential: true });
    }
    function yakinPlan(i, poly) {
      var W = el.kap.clientWidth || 600, H = el.kap.clientHeight || 500, lat = i.lat * Math.PI / 180;
      var xs = poly.map(function (q) { return q[0]; }), ys = poly.map(function (q) { return q[1]; });
      var gen = Math.max((Math.max.apply(0, xs) - Math.min.apply(0, xs)) * 111320 * Math.cos(lat), (Math.max.apply(0, ys) - Math.min.apply(0, ys)) * 111320);
      var mpp = gen / (Math.min(W, H) * 0.42), z = Math.log(40075016.686 * Math.cos(lat) / (512 * mpp)) / Math.LN2;
      return { center: [i.lng, i.lat], zoom: Math.min(18, Math.max(13, z)), pitch: 0, bearing: 0 };
    }
    function tabanGoster(goster) {
      var m = ben.map; (ben.tabanKatman || []).forEach(function (id) { try { m.setLayoutProperty(id, "visibility", goster ? "visible" : "none"); } catch (e) {} });
      m.setLayoutProperty("aao-esri", "visibility", goster ? "none" : "visible");
    }
    function donDur() { cancelAnimationFrame(ben.don); ben.don = 0; }
    function ucBoyut() {
      var m = ben.map, i = ben.ilan; donDur();
      try { m.setTerrain({ source: "aao-dem", exaggeration: 1.6 }); } catch (e) {}
      var yp = yakinPlan(i, A().parselKoord(i));
      m.flyTo({ center: [i.lng, i.lat], zoom: Math.min(16.5, yp.zoom - 1.1), pitch: 62, bearing: (m.getBearing() || 0) - 35, duration: AZ ? 0 : 2600, essential: true });
      if (AZ) return;
      m.once("moveend", function () {
        if (ben.mod !== "3d" || ben.olu) return;
        var son = performance.now();
        (function dondur(now) { if (ben.mod !== "3d" || ben.olu || !ben.map) return; var dt = now - son; son = now; if (ben.gorunur && !document.hidden) m.setBearing(m.getBearing() + dt * 0.006); ben.don = requestAnimationFrame(dondur); })(son);
      });
    }
    function modSec(mod) {
      if (mod === ben.mod && mod !== "3d") return;
      ben.mod = mod; modlar(); donDur();
      googleGoster(mod === "google");
      var m = ben.map; if (!m || mod === "google") return;
      if (mod !== "3d") { try { m.setTerrain(null); } catch (e) {} }
      tabanGoster(mod === "harita" || mod === "hava");
      gorusAyarla(false);
    }
    el.mod.addEventListener("click", function (e) { var b = e.target.closest("[data-mod]"); if (b) modSec(b.dataset.mod); });
    el.yan.addEventListener("click", function (e) {
      var li = e.target.closest("[data-hedef]"); if (!li || !ben.map) return;
      if (ben.mod === "google" || ben.mod === "3d") modSec("uydu");
      var h = ben.an.by[li.dataset.hedef], b = new window.maplibregl.LngLatBounds([ben.ilan.lng, ben.ilan.lat], [ben.ilan.lng, ben.ilan.lat]); b.extend([h.n.lng, h.n.lat]);
      ben.map.fitBounds(b, { padding: dolgu(), duration: 1200, maxZoom: 15.5 });
      el.kap.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    ben.ilanDegis = function (yeni) { if (!yeni) return; ben.ilan = yeni; ben.an = null; donDur(); metinler(); if (ben.mod === "google") googleGoster(true); if (ben.map && ben.hazir) { if (ben.mod === "3d") { ben.mod = "uydu"; modlar(); try { ben.map.setTerrain(null); } catch (e) {} } ciz(false); } };
    ben.yokEt = function () { ben.olu = true; donDur(); cancelAnimationFrame(ben.anim); clearInterval(ben.dash); if (ben.io) ben.io.disconnect(); if (ben.map) { try { ben.map.remove(); } catch (e) {} } ben.map = null; ornekler = ornekler.filter(function (x) { return x !== ben; }); };

    // Tembel yükleme: bölüm ekrana yaklaşınca
    if ("IntersectionObserver" in window) {
      ben.io = new IntersectionObserver(function (g) { g.forEach(function (x) { ben.gorunur = x.isIntersecting; if (x.isIntersecting) baslat(); }); }, { rootMargin: "300px 0px" });
      ben.io.observe(el.kap);
    } else { ben.gorunur = true; baslat(); }
    ornekler.push(ben);
    return ben;
  }

  window.AAOKonum = {
    kur: kur, analiz: analiz, km: km, _o: function () { return ornekler; },
    dilDegisti: function () { ornekler.forEach(function (o) { o.dilDegisti(); }); }
  };
  document.dispatchEvent(new Event("aao-konum-hazir"));
})();
