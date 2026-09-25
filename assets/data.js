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
      sifirla: function () { db = { teklifler: [] }; save(); return P(true); }
    };
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
      girisYap: function (e, k) { return q(function (sb) { return k ? sb.auth.verifyOtp({ email: e, token: k, type: "email" }) : sb.auth.signInWithOtp({ email: e, options: { shouldCreateUser: false } }); }); },
      cikis: function () { return q(function (sb) { return sb.auth.signOut(); }); },
      tumTeklifler: function () { return q(function (sb) { return sb.from("teklifler").select("*").order("olusturma", { ascending: false }); }); },
      teklifGuncelle: function (tk, alan) { return q(function (sb) { return sb.from("teklifler").update(alan).eq("token", tk).select().single(); }); }
    };
  }

  window.API = LIVE ? live() : demo();
  window.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
})();
