/* Personel Devam & Puantaj — örnek veri ve ortak yardımcılar (Dijitabela prototipi, 12 Eki 2026).
   Tüm kişi ve şube adları kurgusaldır. Veriler yalnız bu tarayıcı sekmesinde tutulur (sessionStorage); sunucuya gitmez. */
(function (w) {
  "use strict";
  var SUBELER = [
    { id: "merkez", ad: "Merkez Mutfak", konum: "Kadıköy", vardiya: "08:00-17:00" },
    { id: "sube2", ad: "Moda Şube", konum: "Moda", vardiya: "10:00-19:00" },
    { id: "sube3", ad: "Ataşehir Şube", konum: "Ataşehir", vardiya: "11:00-20:00" }
  ];
  var RENK = ["#F2B544", "#5BC0A8", "#7C8CF8", "#F07C6A", "#C58BE8", "#64B5F6", "#9CCC65", "#FF8A65", "#4DD0E1", "#BA68C8", "#FFD54F", "#81C784"];
  var KISILER = [
    ["Ayşe Demir", "Şef", "merkez"], ["Mehmet Kaya", "Aşçı", "merkez"], ["Elif Şahin", "Pastacı", "merkez"], ["Burak Yıldız", "Bulaşık", "merkez"],
    ["Zeynep Arslan", "Kasiyer", "sube2"], ["Emre Çelik", "Garson", "sube2"], ["Selin Koç", "Garson", "sube2"], ["Can Öztürk", "Barista", "sube2"],
    ["Deniz Aydın", "Şube Sorumlusu", "sube3"], ["Kerem Polat", "Garson", "sube3"], ["Ece Kurt", "Barista", "sube3"], ["Okan Er", "Kurye", "sube3"]
  ].map(function (k, i) {
    var ad = k[0].split(" ");
    return { id: "p" + (i + 1), ad: k[0], bas: ad[0][0] + ad[1][0], gorev: k[1], sube: k[2], renk: RENK[i], pin: String(1000 + i * 137).slice(-4), kart: "NFC-" + (4100 + i * 7) };
  });
  function sube(id) { return SUBELER.filter(function (s) { return s.id === id; })[0]; }
  function kisi(id) { return KISILER.filter(function (k) { return k.id === id; })[0]; }
  function iki(n) { return (n < 10 ? "0" : "") + n; }
  function saat(d) { return iki(d.getHours()) + ":" + iki(d.getMinutes()); }
  function dk2s(dk) { var s = Math.floor(dk / 60), m = Math.round(dk % 60); return s + " sa " + iki(m) + " dk"; }
  function vardiyaBas(sb) { var p = sube(sb).vardiya.split("-")[0].split(":"); return (+p[0]) * 60 + (+p[1]); }
  // Sahte ama tutarlı: tohumlu rastgele
  function tohum(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }

  // Bugünün olay kaydı (oturum boyunca)
  var ANAHTAR = "dj-puantaj-olay";
  function bugunBaslangic() {
    var simdi = new Date(), dk = simdi.getHours() * 60 + simdi.getMinutes(), olay = [];
    KISILER.forEach(function (k, i) {
      var r = tohum(k.id + simdi.toDateString()), bas = vardiyaBas(k.sube);
      if (k.id === "p4" || k.id === "p12") return;                 // henüz gelmedi
      var gec = r() < 0.25 ? Math.round(5 + r() * 25) : -Math.round(r() * 12);
      var giris = bas + gec;
      if (giris > dk) return;
      olay.push({ k: k.id, t: "giris", dk: giris, yol: r() < 0.5 ? "QR" : (r() < 0.5 ? "NFC" : "PIN") });
      if (dk > giris + 200 && r() < 0.55) { var m = giris + 180 + Math.round(r() * 60); if (m < dk) { olay.push({ k: k.id, t: "mola", dk: m, yol: "QR" }); if (m + 30 < dk || r() < 0.4) olay.push({ k: k.id, t: "donus", dk: Math.min(m + 30 + Math.round(r() * 15), dk), yol: "QR" }); } }
      if (dk > giris + 540) olay.push({ k: k.id, t: "cikis", dk: giris + 540 + Math.round(r() * 40), yol: "QR" });
    });
    return olay.sort(function (a, b) { return a.dk - b.dk; });
  }
  function olaylar() {
    try { var s = sessionStorage.getItem(ANAHTAR); if (s) return JSON.parse(s); } catch (e) {}
    var o = bugunBaslangic(); kaydet(o); return o;
  }
  function kaydet(o) { try { sessionStorage.setItem(ANAHTAR, JSON.stringify(o)); } catch (e) {} }
  function ekle(kid, tur, yol) { var o = olaylar(), d = new Date(); o.push({ k: kid, t: tur, dk: d.getHours() * 60 + d.getMinutes(), yol: yol || "QR" }); kaydet(o); return o; }
  function durum(kid, o) {
    o = o || olaylar(); var son = null;
    o.forEach(function (x) { if (x.k === kid) son = x; });
    if (!son) return { kod: "yok", ad: "Gelmedi" };
    if (son.t === "giris" || son.t === "donus") return { kod: "iceride", ad: "İçeride", dk: son.dk };
    if (son.t === "mola") return { kod: "molada", ad: "Molada", dk: son.dk };
    return { kod: "cikti", ad: "Çıktı", dk: son.dk };
  }
  function girisDk(kid, o) { o = o || olaylar(); for (var i = 0; i < o.length; i++) if (o[i].k === kid && o[i].t === "giris") return o[i].dk; return null; }
  function calisilanDk(kid, o) {
    o = (o || olaylar()).filter(function (x) { return x.k === kid; }); var d = new Date(), simdi = d.getHours() * 60 + d.getMinutes(), top = 0, ac = null;
    o.forEach(function (x) { if (x.t === "giris" || x.t === "donus") ac = x.dk; else if (ac !== null) { top += x.dk - ac; ac = null; } });
    if (ac !== null) top += simdi - ac; return Math.max(0, top);
  }
  // Aylık puantaj (geçmiş günler, tohumlu)
  function ay(yil, ayNo) {
    var gunSay = new Date(yil, ayNo + 1, 0).getDate(), bugun = new Date(), sonuc = {};
    KISILER.forEach(function (k) {
      var r = tohum(k.id + yil + "-" + ayNo), satir = [];
      for (var g = 1; g <= gunSay; g++) {
        var tarih = new Date(yil, ayNo, g), hg = tarih.getDay();
        if (tarih > bugun) { satir.push({ g: g, kod: "-", dk: 0 }); continue; }
        var izinGunu = (hg === (k.sube === "merkez" ? 0 : 1));
        if (izinGunu) { satir.push({ g: g, kod: "H", dk: 0 }); continue; }
        var x = r();
        if (x < 0.03) { satir.push({ g: g, kod: "R", dk: 0 }); continue; }
        if (x < 0.06) { satir.push({ g: g, kod: "Y", dk: 0 }); continue; }
        if (x < 0.08) { satir.push({ g: g, kod: "D", dk: 0 }); continue; }
        var fm = r() < 0.12, dk = 500 + Math.round((r() - 0.5) * 50) + (fm ? 90 + Math.round(r() * 60) : 0), gec = r() < 0.12 ? Math.round(6 + r() * 25) : 0;
        satir.push({ g: g, kod: fm ? "FM" : "N", dk: dk, gec: gec });
      }
      sonuc[k.id] = satir;
    });
    return sonuc;
  }
  w.PUANTAJ = { SUBELER: SUBELER, KISILER: KISILER, sube: sube, kisi: kisi, saat: saat, iki: iki, dk2s: dk2s, vardiyaBas: vardiyaBas,
    olaylar: olaylar, ekle: ekle, durum: durum, girisDk: girisDk, calisilanDk: calisilanDk, ay: ay, sifirla: function () { try { sessionStorage.removeItem(ANAHTAR); } catch (e) {} } };
})(window);
