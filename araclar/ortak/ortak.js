/* Dijitabela Araçlar: tarayıcı/uygulama ortak hizmetleri. Üçüncü taraf çağrısı yok; girilen veri cihazdan çıkmaz. */
(function () {
  "use strict";
  var bellek = {}, depoSorun = false;
  var DT = window.DT = {};
  var eklenti = function (ad) {
    var C = window.Capacitor;
    if (!C || !C.isNativePlatform || !C.isNativePlatform()) return null;
    if (C.Plugins && C.Plugins[ad]) return C.Plugins[ad];
    return C.registerPlugin ? C.registerPlugin(ad) : null;
  };
  DT.yerel = function () { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); };

  DT.depo = {
    oku: function (k, varsayilan) {
      try { var v = window.localStorage.getItem(k); return v === null ? (k in bellek ? bellek[k] : varsayilan) : JSON.parse(v); }
      catch (e) { if (!(e instanceof SyntaxError)) depoSorun = true; return k in bellek ? bellek[k] : varsayilan; }
    },
    yaz: function (k, v) {
      bellek[k] = v;
      try { window.localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { depoSorun = true; return false; }
    },
    sorunlu: function () { return depoSorun; }
  };

  DT.oranlar = window.DT_ORAN;
  // Oran tablosu çevrim içi yenilenir; yalnız veri okunur, kod değil. Biçim bozuksa yok sayılır.
  DT.oranDogrula = function (o) {
    try {
      if (!o || typeof o.surum !== "string" || !o.kira || !Array.isArray(o.zam) || !o.ceza2026 || !Array.isArray(o.ceza2026.gruplar)) return false;
      var kk = Object.keys(o.kira);
      if (!kk.length || !o.zam.length) return false;
      for (var i = 0; i < kk.length; i++) {
        if (!/^\d{4}-\d{2}$/.test(kk[i]) || typeof o.kira[kk[i]].o !== "number" || o.kira[kk[i]].o < 0 || o.kira[kk[i]].o > 200) return false;
      }
      if (!o.ceza2026.gruplar.every(function (g) { return g && typeof g.id === "string" && typeof g.ad === "string" && typeof g.d1 === "number" && typeof g.ozel === "number"; })) return false;
      return o.zam.every(function (z) { return typeof z.o === "number" && z.o > 0 && z.o < 30 && /^\d{4}-\d{2}-\d{2}$/.test(z.t); });
    } catch (e) { return false; }
  };
  DT.oranYenile = function (adres, sonra) {
    var kayit = DT.depo.oku("dt-oran", null);
    if (kayit && DT.oranDogrula(kayit) && kayit.surum > DT.oranlar.surum) { DT.oranlar = kayit; if (sonra) sonra(); }
    if (!window.fetch) return;
    fetch(adres, { cache: "no-cache" }).then(function (y) { return y.ok ? y.json() : null; }).then(function (o) {
      if (o && DT.oranDogrula(o) && o.surum > DT.oranlar.surum) { DT.oranlar = o; DT.depo.yaz("dt-oran", o); if (sonra) sonra(); }
    }).catch(function () { /* çevrimdışı: gömülü tablo kullanılır */ });
  };

  // Tablo 45 günden eskiyse kullanıcı uyarılır: oran bayatlamış olabilir
  DT.oranBayat = function () { var k = Date.parse(DT.oranlar.kontrol); return !isNaN(k) && Date.now() - k > 45 * 86400000; };
  DT.bildir = function (metin, tur) {
    var b = document.getElementById("dt-bildirim");
    if (!b) { b = document.createElement("div"); b.id = "dt-bildirim"; b.setAttribute("role", "status"); b.setAttribute("aria-live", "polite"); document.body.appendChild(b); }
    b.textContent = metin; b.className = "goster" + (tur ? " " + tur : "");
    clearTimeout(DT._bz); DT._bz = setTimeout(function () { b.className = ""; }, 3200);
  };
  DT.kopyala = function (metin) {
    function yedek() {
      var t = document.createElement("textarea");
      t.value = metin; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.top = "0"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(t);
      DT.bildir(ok ? "Kopyalandı" : "Kopyalanamadı. Metni elle seçin.", ok ? "" : "kotu");
      return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(metin).then(function () { DT.bildir("Kopyalandı"); return true; }, yedek);
    }
    return Promise.resolve(yedek());
  };
  DT.paylas = function (baslik, metin) {
    var S = eklenti("Share");
    if (S) return S.share({ title: baslik, text: metin, dialogTitle: baslik }).catch(function () {});
    if (navigator.share) return navigator.share({ title: baslik, text: metin }).catch(function () {});
    return DT.kopyala(metin);
  };
  DT.indir = function (ad, icerik, tur) {
    var F = eklenti("Filesystem"), S = eklenti("Share");
    if (F && S) {
      return F.writeFile({ path: ad, data: icerik, directory: "CACHE", encoding: "utf8" }).then(function (r) {
        return S.share({ title: ad, url: r.uri, dialogTitle: ad });
      }).catch(function () { DT.bildir("Dosya hazırlanamadı.", "kotu"); });
    }
    try {
      var a = document.createElement("a"), u = URL.createObjectURL(new Blob([icerik], { type: tur + ";charset=utf-8" }));
      a.href = u; a.download = ad; document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
      DT.bildir("İndirildi: " + ad);
    } catch (e) { DT.bildir("İndirilemedi.", "kotu"); }
    return Promise.resolve();
  };
  function kimlik(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000000; return h * 10; }
  // Hatırlatma: uygulamada cihaz bildirimi (yenilemeden 30 ve 3 gün önce 09:00), sitede takvim dosyası
  DT.hatirlat = function (no, baslik, govde, isoTarih) {
    var L = eklenti("LocalNotifications"), p = isoTarih.split("-");
    if (L) {
      var bugun = Date.now(), plan = [30, 3].map(function (g, i) {
        return { id: kimlik(String(no)) + i + 1, title: baslik, body: g + " gün sonra: " + govde, schedule: { at: new Date(+p[0], +p[1] - 1, +p[2] - g, 9, 0, 0), allowWhileIdle: true } };
      }).filter(function (x) { return x.schedule.at.getTime() > bugun; });
      if (!plan.length) { DT.bildir("Tarih çok yakın; hatırlatma kurulmadı.", "kotu"); return Promise.resolve(false); }
      return L.requestPermissions().then(function (iz) {
        if (iz.display !== "granted") { DT.bildir("Bildirim izni verilmedi. Telefon ayarlarından açabilirsiniz.", "kotu"); return false; }
        return L.schedule({ notifications: plan }).then(function () { DT.bildir(plan.length + " hatırlatma kuruldu"); return true; });
      }).catch(function () { DT.bildir("Hatırlatma kurulamadı.", "kotu"); return false; });
    }
    var kaca = function (s) { return String(s).replace(/([,;\\])/g, "\\$1").replace(/\r?\n/g, "\\n"); };
    var d = isoTarih.replace(/-/g, ""), son = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + 1)).toISOString().slice(0, 10).replace(/-/g, "");
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Dijitabela//Araclar//TR", "BEGIN:VEVENT", "UID:" + kimlik(String(no)) + "@dijitabela.com",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]|\.\d{3}/g, ""), "DTSTART;VALUE=DATE:" + d, "DTEND;VALUE=DATE:" + son,
      "SUMMARY:" + kaca(baslik), "DESCRIPTION:" + kaca(govde),
      "BEGIN:VALARM", "TRIGGER:-P30D", "ACTION:DISPLAY", "DESCRIPTION:" + kaca(baslik), "END:VALARM",
      "BEGIN:VALARM", "TRIGGER:-P3D", "ACTION:DISPLAY", "DESCRIPTION:" + kaca(baslik), "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return DT.indir("kira-yenileme-" + d + ".ics", ics, "text/calendar").then(function () { return true; });
  };
  // Küçük DOM yardımcısı: metin her zaman textContent ile girer
  DT.el = function (etiket, oz) {
    var e = document.createElement(etiket); oz = oz || {};
    Object.keys(oz).forEach(function (k) {
      if (k === "metin") e.textContent = oz[k];
      else if (k === "sinif") e.className = oz[k];
      else if (k === "tik") e.addEventListener("click", oz[k]);
      else if (k === "ic") oz[k].forEach(function (c) { if (c) e.appendChild(c); });
      else if (k === "deger") e.value = oz[k];
      else e.setAttribute(k, oz[k]);
    });
    return e;
  };
  DT.onayliDugme = function (etiket, onayEtiket, sinif, yap) { // ilk dokunuş sorar, ikincisi yapar; 4 sn sonra döner
    var z, b = DT.el("button", { type: "button", sinif: sinif, metin: etiket });
    b.addEventListener("click", function () {
      if (b.dataset.bekle) { clearTimeout(z); delete b.dataset.bekle; b.textContent = etiket; yap(); return; }
      b.dataset.bekle = "1"; b.textContent = onayEtiket;
      z = setTimeout(function () { delete b.dataset.bekle; b.textContent = etiket; }, 4000);
    });
    return b;
  };
  DT.sw = function (yol) {
    if (DT.yerel() || !("serviceWorker" in navigator) || (location.protocol !== "https:" && location.hostname !== "localhost")) return;
    try { navigator.serviceWorker.register(yol, { scope: yol.replace(/sw\.js$/, "") }).catch(function () {}); } catch (e) {}
  };
})();
