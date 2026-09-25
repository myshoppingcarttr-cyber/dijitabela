// ===== Veri katmanı: başvuru → otomatik teklif → onay → ödeme (Supabase canlı / DEMO) =====
(function () {
  "use strict";
  var A = window.AJANS || {};
  var LIVE = !!(A.supabaseUrl && A.supabaseAnonKey);
  var P = function (x) { return new Promise(function (r) { setTimeout(function () { r(x); }, 120); }); };
  var token = function () { var a = new Uint8Array(12); (crypto || window.msCrypto).getRandomValues(a); return Array.from(a, function (b) { return b.toString(16).padStart(2, "0"); }).join(""); };
  var no = function () { var d = new Date(); return "T" + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + "-" + Math.floor(1000 + Math.random() * 9000); };

  // ----- DEMO: tarayıcıda saklanır -----
  function demo() {
    var K = "ajans_demo_v1";
    var db = (function () { try { return JSON.parse(localStorage.getItem(K)) || { teklifler: [] }; } catch (e) { return { teklifler: [] }; } })();
    if (!db.adaylar) db.adaylar = ORNEK_ADAYLAR();
    var save = function () { try { localStorage.setItem(K, JSON.stringify(db)); } catch (e) {} };
    var find = function (t) { return db.teklifler.find(function (x) { return x.token === t; }); };
    return {
      mode: "demo",
      basvuruGonder: function (b) {
        var h = FIYAT.hesapla(b.secim, b.olcek, b.acil);
        var t = { id: token(), token: token(), no: no(), durum: "gonderildi", olusturma: new Date().toISOString(),
          gecerlilik: new Date(Date.now() + 15 * 864e5).toISOString(), basvuru: b, hesap: h, odemeler: [] };
        db.teklifler.unshift(t); save(); return P(t);
      },
      teklifGetir: function (tk) { var t = find(tk); return t ? P(t) : Promise.reject(new Error("Teklif bulunamadı")); },
      teklifOnayla: function (tk) { var t = find(tk); t.durum = "onaylandi"; t.onay = new Date().toISOString(); save(); return P(t); },
      odemeBildir: function (tk, o) { var t = find(tk); t.odemeler.push(Object.assign({ tarih: new Date().toISOString() }, o)); if (o.yontem === "kart") t.durum = "odendi"; save(); return P(t); },
      // panel
      girisVar: function () { return P(!!sessionStorage.getItem("ajans_panel")); },
      girisYap: function (e, k) { if (k !== "123456") return Promise.reject(new Error("Demo kodu: 123456")); sessionStorage.setItem("ajans_panel", e); return P(true); },
      cikis: function () { sessionStorage.removeItem("ajans_panel"); return P(true); },
      tumTeklifler: function () { return P(db.teklifler.slice()); },
      teklifGuncelle: function (tk, alan) { var t = find(tk); Object.assign(t, alan); save(); return P(t); },
      sifirla: function () { db = { teklifler: [], adaylar: ORNEK_ADAYLAR() }; save(); return P(true); },
      // satış takibi
      adaylar: function () { return P(db.adaylar.slice()); },
      adayKaydet: function (a) {
        var now = new Date().toISOString();
        if (a.id) { var x = db.adaylar.find(function (y) { return y.id === a.id; }); Object.assign(x, a, { guncelleme: now }); save(); return P(x); }
        var n = Object.assign(ADAY_VARSAYILAN(), a, { id: token(), olusturma: now, guncelleme: now });
        db.adaylar.unshift(n); save(); return P(n);
      },
      adaySil: function (id) { db.adaylar = db.adaylar.filter(function (y) { return y.id !== id; }); save(); return P(true); },
      taslakIste: function (d) { db.adaylar.unshift(Object.assign(ADAY_VARSAYILAN(), { id: token(), olusturma: new Date().toISOString(), guncelleme: new Date().toISOString(), isletme: d.isletme, sektor: d.sektor, ilce: d.ilce, tel: d.tel, eposta: d.eposta || null, maps: d.maps || null, sonraki_adim: "Taslak talebi: prototip hazırla", sonraki_tarih: new Date().toISOString().slice(0, 10), notlar: [{ tarih: new Date().toISOString(), tur: "form", metin: "Siteden ücretsiz taslak talebi." }] })); save(); return P(true); },
      adaylarIceAktar: function (list) {
        list.forEach(function (a) {
          var x = a.slug && db.adaylar.find(function (y) { return y.slug === a.slug; });
          if (x) Object.assign(x, a); else db.adaylar.unshift(Object.assign(ADAY_VARSAYILAN(), a, { id: token(), olusturma: new Date().toISOString() }));
        });
        save(); return P(list.length);
      }
    };
  }

  function ADAY_VARSAYILAN() {
    return { asama: "yeni", mail_durum: "gonderilmedi", arama_durum: "aranmadi", sehir: "Antalya", notlar: [] };
  }
  // Demo için örnek adaylar (gerçek işletme değildir)
  function ORNEK_ADAYLAR() {
    var gun = function (d) { var t = new Date(); t.setDate(t.getDate() + d); return t.toISOString().slice(0, 10); };
    var o = function (x) { return Object.assign(ADAY_VARSAYILAN(), { id: token(), olusturma: new Date().toISOString(), guncelleme: new Date().toISOString() }, x); };
    return [
      o({ isletme: "Örnek Emlak Ofisi", sektor: "emlak", ilce: "Konyaaltı", tel: "0500 000 00 01", eposta: "ornek@emlak.test", puan: 4.8, yorum: 64, asama: "iletisim", mail_durum: "gonderildi", mail_tarih: new Date().toISOString(), sonraki_adim: "Telefonla ara", sonraki_tarih: gun(0) }),
      o({ isletme: "Örnek Oto Galeri", sektor: "galeri", ilce: "Kepez", tel: "0500 000 00 02", puan: 5, yorum: 120, asama: "gorusme", arama_durum: "gorusuldu", arama_tarih: new Date().toISOString(), sonraki_adim: "Dükkâna uğra, prototipi göster", sonraki_tarih: gun(2), tahmini_tutar: 49900,
        notlar: [{ tarih: new Date().toISOString(), tur: "arama", metin: "Sahibiyle konuştum, sahibinden.com dışında sitesi yok. Perşembe uğrayacağım." }] }),
      o({ isletme: "Örnek Diş Kliniği", sektor: "dis", ilce: "Muratpaşa", eposta: "ornek@klinik.test", puan: 4.9, yorum: 310, asama: "prototip", sonraki_adim: "Tanıtım e-postası gönder", sonraki_tarih: gun(-1) })
    ];
  }

  // ----- CANLI: Supabase (RPC'ler supabase/schema.sql içinde) -----
  function live() {
    var ready = new Promise(function (res, rej) {
      if (window.supabase) return res();
      var s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.onload = res; s.onerror = function () { rej(new Error("Bağlantı kurulamadı")); }; document.head.appendChild(s);
    }).then(function () { return window.supabase.createClient(A.supabaseUrl, A.supabaseAnonKey); });
    var q = function (fn) { return ready.then(fn).then(function (r) { if (r.error) throw new Error(r.error.message); return r.data; }); };
    return {
      mode: "live",
      basvuruGonder: function (b) { var h = FIYAT.hesapla(b.secim, b.olcek, b.acil); return q(function (sb) { return sb.rpc("basvuru_gonder", { p_basvuru: b, p_hesap: h }); }); },
      teklifGetir: function (tk) { return q(function (sb) { return sb.rpc("teklif_getir", { p_token: tk }); }).then(function (t) { if (!t) throw new Error("Teklif bulunamadı"); return t; }); },
      teklifOnayla: function (tk) { return q(function (sb) { return sb.rpc("teklif_onayla", { p_token: tk }); }); },
      odemeBildir: function (tk, o) { return q(function (sb) { return sb.rpc("odeme_bildir", { p_token: tk, p_odeme: o }); }); },
      girisVar: function () { return ready.then(function (sb) { return sb.auth.getSession(); }).then(function (r) { return !!r.data.session; }); },
      // Supabase varsayılan e-postası giriş BAĞLANTISI gönderir; şablona {{ .Token }} eklenince 6 haneli kod da çalışır.
      girisYap: function (e, k) { return q(function (sb) { return k ? sb.auth.verifyOtp({ email: e, token: k, type: "email" }) : sb.auth.signInWithOtp({ email: e, options: { shouldCreateUser: false, emailRedirectTo: location.href.split("#")[0].split("?")[0] } }); }); },
      cikis: function () { return q(function (sb) { return sb.auth.signOut(); }); },
      tumTeklifler: function () { return q(function (sb) { return sb.from("teklifler").select("*").order("olusturma", { ascending: false }); }); },
      teklifGuncelle: function (tk, alan) { return q(function (sb) { return sb.from("teklifler").update(alan).eq("token", tk).select().single(); }); },
      // satış takibi
      adaylar: function () { return q(function (sb) { return sb.from("adaylar").select("*").order("guncelleme", { ascending: false }); }); },
      adayKaydet: function (a) {
        var x = Object.assign({}, a); delete x.olusturma; delete x.guncelleme;
        return q(function (sb) { return a.id ? sb.from("adaylar").update(x).eq("id", a.id).select().single() : sb.from("adaylar").insert(x).select().single(); });
      },
      adaySil: function (id) { return q(function (sb) { return sb.from("adaylar").delete().eq("id", id); }); },
      taslakIste: function (d) { return q(function (sb) { return sb.rpc("taslak_iste", { p: d }); }); },
      adaylarIceAktar: function (list) { return q(function (sb) { return sb.from("adaylar").upsert(list, { onConflict: "slug" }).select("id"); }).then(function (r) { return (r || []).length; }); }
    };
  }
  // Giriş bağlantısı başka sekmede açılırsa bu sekme de oturumu alsın
  window.addEventListener("storage", function (ev) { if (ev.key && /^sb-.*-auth-token$/.test(ev.key) && ev.newValue && /panel\.html/.test(location.pathname)) location.reload(); });

  window.API = LIVE ? live() : demo();
  window.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
})();
