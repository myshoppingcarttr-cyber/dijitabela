/* RunInvestingTR Akademi · üye platformu · CANLI SÜRÜM (İ-1012-122, 12 Eki 2026)
   Veri Supabase'de (dijitabela projesi, 'rit' şeması; RLS ile korunur). Giriş: e-posta sihirli bağlantı ya da şifre.
   Kaynak: platform/app-canli.js (Dijitabela deposu) → derleme → /uye/app.js
   (platform/app.js tarayıcıda çalışan tanıtım prototipidir; canlıda kullanılmaz.) */
(function () {
  "use strict";
  var V = window.RIT_VERI;
  var $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  var esc = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var id = function (p) { return (p || "x") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
  var simdi = function () { return Date.now(); };
  var ALANLAR = { arsiv: "Video arşivi", dokuman: "Dokümanlar", canli: "Canlı eğitim", forum: "Forum", spl: "SPL soru bankası" };

  /* ---------- veri (Supabase) ---------- */
  // Publishable (anon) anahtar istemcide durabilir; yetkiyi RLS belirler. Gizli (sunucu) anahtar istemciye ASLA konmaz.
  var SB_URL = "https://ctlbhwbccqgwmtqbwtfs.supabase.co", SB_ANAHTAR = "sb_publishable_8MszpUT5gCp6cFhAKn-0VA_gW9_1hvy";
  var sb = window.supabase.createClient(SB_URL, SB_ANAHTAR, { db: { schema: "rit" }, auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit", storageKey: "rit-oturum" } });
  var DONUS = location.origin + location.pathname; // sihirli bağlantı dönüşü: https://runinvestingtr.com/uye/
  var ms = function (t) { return t ? new Date(t).getTime() : 0; };
  function bos() { return { oturum: null, uyeler: [], dersler: [], dokumanlar: [], sorular: [], soruSayisi: {}, terimSayisi: {}, terimler: [], canlilar: [], sohbet: {}, forum: { kategoriler: [], altlar: [], konular: [], yorumlar: [] }, sinavlar: [], tamamlanan: {}, odemeler: [], demoHak: {}, duyurular: [], hakkimizda: db && db.hakkimizda || "", yuklendi: false }; }
  var db = null; db = bos();
  function uyeCevir(r) { return { id: r.id, ad: r.ad || "", soyad: r.soyad || "", email: r.email || "", tel: r.tel || "", telegram: r.telegram || "", rol: r.rol || "uye", paketler: r.paketler || [], erisim: r.erisim || {}, seviye: r.seviye || "", alanlar: r.alanlar || [], epostaIzni: r.eposta_izni !== false, kayit: ms(r.kayit) }; }
  function hepsi(sorgu) { return sorgu.then(function (r) { if (r.error) throw r.error; return r.data || []; }); }
  var yukleSoz = null; // aynı anda tek yükleme (giriş + oturum dinleyicisi çakışmasın)
  function yukle() { if (!yukleSoz) yukleSoz = yukleAsil().finally(function () { yukleSoz = null; }); return yukleSoz; }
  async function yukleAsil() {
    var y = bos();
    var ayar = await sb.from("ayarlar").select("anahtar,deger"); (ayar.data || []).forEach(function (r) { if (r.anahtar === "hakkimizda") y.hakkimizda = r.deger; });
    var s = (await sb.auth.getSession()).data.session;
    if (!s) { db = y; db.yuklendi = true; return; }
    var uid = s.user.id;
    var ben_ = (await sb.from("uyeler").select("*").eq("id", uid).maybeSingle()).data;
    if (!ben_) { // hesap var, profil yok (ör. başka yoldan açılmış): kendi profilini tamamla
      var m = s.user.user_metadata || {};
      await sb.rpc("profil_tamamla", { p: { ad: m.ad || "", soyad: m.soyad || "", tel: m.tel || "", telegram: m.telegram || "", seviye: m.seviye || "", alanlar: m.alanlar || [], eposta_izni: m.eposta_izni !== false } });
      ben_ = (await sb.from("uyeler").select("*").eq("id", uid).maybeSingle()).data;
      if (!ben_) { db = y; db.yuklendi = true; tost("Profil oluşturulamadı; lütfen tekrar deneyin"); return; }
    }
    var yon = ben_.rol === "yonetici", eris = function (a) { return yon || !!(ben_.erisim || {})[a]; };
    var r = await Promise.all([
      yon ? hepsi(sb.from("uyeler").select("*")) : Promise.resolve([ben_]),
      hepsi(sb.rpc("uye_kartlari")),
      hepsi(sb.from("dersler").select("*")), hepsi(sb.from("ders_videolari").select("*")),
      hepsi(sb.from("dokumanlar").select("*")), hepsi(sb.from("dokuman_dosyalari").select("*")),
      hepsi(sb.from("canlilar").select("*")), eris("canli") ? hepsi(sb.from("canli_baglantilari").select("*")) : Promise.resolve([]),
      eris("spl") ? hepsi(sb.from("sorular").select("*").order("olusturma")) : Promise.resolve([]), hepsi(sb.rpc("soru_sayilari")),
      hepsi(sb.from("forum_kategoriler").select("*").order("sira")), hepsi(sb.from("forum_altlar").select("*")),
      hepsi(sb.from("forum_konular").select("*")), hepsi(sb.from("forum_yanitlar").select("*")), hepsi(sb.from("forum_begeniler").select("*")),
      hepsi(sb.from("sinavlar").select("*")), hepsi(sb.from("tamamlanan").select("*")), hepsi(sb.from("odemeler").select("*")),
      hepsi(sb.from("demo_hak").select("*")), hepsi(sb.from("duyurular").select("*").order("zaman", { ascending: false })),
      eris("spl") ? hepsi(sb.from("spl_terimler").select("*")).catch(function () { return []; }) : Promise.resolve([])
    ]);
    var tam = {}; r[0].forEach(function (u) { tam[u.id] = uyeCevir(u); }); tam[uid] = uyeCevir(ben_);
    y.uyeler = r[1].map(function (k) { return tam[k.id] || uyeCevir(k); });
    Object.keys(tam).forEach(function (i) { if (!y.uyeler.some(function (u) { return u.id === i; })) y.uyeler.push(tam[i]); });
    var vid = {}; r[3].forEach(function (v) { vid[v.ders_id] = v.video; });
    y.dersler = r[2].map(function (d) { return { id: d.id, program: d.program, sira: d.sira, baslik: d.baslik, demo: d.demo, video: vid[d.id] || "" }; });
    var dos = {}; r[5].forEach(function (f) { dos[f.dokuman_id] = f; });
    y.dokumanlar = r[4].map(function (d) { var f = dos[d.id] || {}; return { id: d.id, kategori: d.kategori, tarih: d.tarih, baslik: d.baslik, demo: d.demo, yol: f.yol || "", dosya: f.url || "" }; });
    var bag = {}; r[7].forEach(function (b) { bag[b.canli_id] = b.yayin; });
    y.canlilar = r[6].map(function (c) { return { id: c.id, baslik: c.baslik, aciklama: c.aciklama, zaman: ms(c.zaman), sure: c.sure, yayin: bag[c.id] || "" }; });
    y.sorular = r[8].map(function (q) { return { id: q.id, d: q.duzey, k: q.konu, s: q.soru, c: q.siklar, a: q.aciklama }; });
    r[9].forEach(function (x) { var n = +x.adet, t = x.terim != null ? +x.terim : Math.floor(n / 1000); if (x.terim == null) n = n % 1000; y.soruSayisi[x.duzey] = n; y.terimSayisi[x.duzey] = t; });
    y.terimler = r[20].map(function (t) { return { d: t.duzey, ders: t.ders, terim: t.terim, tanim: t.tanim }; });
    var beg = { k: {}, y: {} }; r[14].forEach(function (b) { (beg[b.tur][b.hedef] = beg[b.tur][b.hedef] || []).push(b.uye); });
    y.forum = {
      kategoriler: r[10], altlar: r[11],
      konular: r[12].map(function (k) { return { id: k.id, kat: k.kat, alt: k.alt, baslik: k.baslik, metin: k.metin, grafik: k.grafik, resim: k.resim, yazar: k.yazar, zaman: ms(k.zaman), begeni: beg.k[k.id] || [] }; }),
      yorumlar: r[13].map(function (c) { return { id: c.id, konu: c.konu, yazar: c.yazar, metin: c.metin, zaman: ms(c.zaman), begeni: beg.y[c.id] || [] }; })
    };
    y.sinavlar = r[15].map(function (x) { return { uye: x.uye, duzey: x.duzey, mod: x.mod, dogru: x.dogru, toplam: x.toplam, zaman: ms(x.zaman), konular: x.konular || {} }; });
    r[16].forEach(function (t) { (y.tamamlanan[t.uye] = y.tamamlanan[t.uye] || []).push(t.ders_id); });
    y.odemeler = r[17].map(function (o) { return { id: o.id, uye: o.uye, paket: o.paket, yontem: o.yontem, zaman: ms(o.zaman), durum: o.durum }; });
    r[18].forEach(function (d) { (y.demoHak[d.uye] = y.demoHak[d.uye] || []).push(d.duzey); });
    y.duyurular = r[19].map(function (d) { return { id: d.id, baslik: d.baslik, metin: d.metin, zaman: ms(d.zaman) }; });
    y.oturum = uid; y.yuklendi = true; db = y;
  }
  // yazma sarmalayıcı: hata varsa gösterir; başarılıysa veriyi tazeler ve sayfayı yeniden çizer
  async function yaz(is, mesaj, sonra) {
    try { var r = await is; if (r && r.error) throw r.error; } catch (e) { tost("İşlem yapılamadı: " + (e.message || e)); return false; }
    await yukle().catch(function () {}); if (mesaj) tost(mesaj); if (sonra) sonra(); else ciz(); return true;
  }
  var ben = function () { return db.uyeler.filter(function (u) { return u.id === db.oturum; })[0] || null; };
  var uye = function (i) { return db.uyeler.filter(function (u) { return u.id === i; })[0] || { ad: "Silinmiş", soyad: "üye", id: i }; };
  var yonetici = function (u) { return u && u.rol === "yonetici"; };
  var erisir = function (u, alan) { return !!u && (yonetici(u) || !!(u.erisim && u.erisim[alan])); };
  var adSoyad = function (u) { return u.ad + " " + (u.soyad || ""); };
  var bas = function (u) { return (u.ad || "?").charAt(0).toUpperCase(); };

  /* ---------- puan & rütbe ---------- */
  function puan(uid) {
    var f = db.forum, p = V.puan, n = 0;
    f.konular.forEach(function (k) { if (k.yazar === uid) n += p.paylasim + k.begeni.length * p.begeniAl; if (k.begeni.indexOf(uid) > -1) n += p.begeniVer; });
    f.yorumlar.forEach(function (y) { if (y.yazar === uid) n += p.yorum + y.begeni.length * p.begeniAl; if (y.begeni.indexOf(uid) > -1) n += p.begeniVer; });
    return n;
  }
  function rutbe(uid) { var p = puan(uid), r = V.rutbeler[0], s = null; V.rutbeler.forEach(function (x, i) { if (p >= x.min) { r = x; s = V.rutbeler[i + 1] || null; } }); return { r: r, sonraki: s, puan: p, yuzde: s ? Math.round((p - r.min) / (s.min - r.min) * 100) : 100 }; }
  var rozet = function (uid) { var r = rutbe(uid).r; var i = V.rutbeler.indexOf(r); return '<span class="etiket ' + ["", "mavi", "yesil", "altin", "kirmizi"][i] + '">' + esc(r.ad) + "</span>"; };

  /* ---------- yardımcılar ---------- */
  function tost(m) { var t = $("#tost"); t.textContent = m; t.classList.add("gor"); clearTimeout(t._z); t._z = setTimeout(function () { t.classList.remove("gor"); }, 2800); }
  var tarih = function (ms, saatli) { var d = new Date(ms); return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) + (saatli ? " · " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : ""); };
  var once = function (ms) { var s = Math.round((simdi() - ms) / 1000); if (s < 60) return "az önce"; if (s < 3600) return Math.floor(s / 60) + " dk önce"; if (s < 86400) return Math.floor(s / 3600) + " sa önce"; return Math.floor(s / 86400) + " gün önce"; };
  function yt(url) { var m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|live\/|shorts\/)([\w-]{11})/); return m ? m[1] : null; }
  function modal(html, bagla) {
    var m = document.createElement("div"); m.className = "modal"; m.innerHTML = '<div class="kart">' + html + "</div>";
    m.addEventListener("click", function (e) { if (e.target === m || e.target.closest("[data-kapat]")) m.remove(); });
    document.body.appendChild(m); if (bagla) bagla(m); return m;
  }
  function git(h) { location.hash = h; }
  function kilit(alan, metin) {
    return '<div class="kilit-perde"><div><div style="font-size:30px">🔒</div><b>' + esc(metin || ALANLAR[alan] + " paketinize dahil değil") + '</b><p class="s" style="font-size:14px;margin-bottom:12px">' + paketIcin(alan) + '</p><a class="btn ana kucuk" href="#/paketler">Paketleri gör →</a></div></div>';
  }
  function paketIcin(alan) { return V.paketler.filter(function (p) { return p.erisim.indexOf(alan) > -1; }).map(function (p) { return p.ad; }).join(" veya ") + " ile açılır."; }

  /* ---------- kabuk ---------- */
  var MENU = [["#/panel", "Panelim"], ["#/egitimler", "Eğitimler"], ["#/spl", "SPL"], ["#/dokumanlar", "Dokümanlar"], ["#/canli", "Canlı"], ["#/forum", "Forum"], ["#/paketler", "Paketler"], ["#/hakkimizda", "Hakkımızda"]];
  function kabuk() {
    var u = ben(), h = location.hash || "#/";
    $("#nav").innerHTML = MENU.concat(yonetici(u) ? [["#/yonetim", "Yönetim"]] : []).map(function (m) { return '<a href="' + m[0] + '" class="' + (h.indexOf(m[0]) === 0 ? "aktif" : "") + '">' + m[1] + "</a>"; }).join("");
    $("#kim").innerHTML = u ? '<a href="#/profil" class="satir" style="gap:10px"><span class="avatar">' + bas(u) + '</span><span class="ad-yazi" style="font-weight:700;font-size:14px">' + esc(u.ad) + '<br><span class="s" style="font-weight:500;font-size:12px">' + esc(yonetici(u) ? "Eğitmen · Yönetici" : rutbe(u.id).r.ad) + "</span></span></a>"
      : '<a href="#/giris" class="btn kucuk hayalet">Giriş</a><a href="#/kayit" class="btn kucuk ana">Üye Ol</a>';
    // 1903 (12 Eki 22:56): logo oturumu kapatmaz; girişliyken üye ana ekranına götürür. Ana siteye ayrı "Siteye dön" bağlantısı (oturum korunur).
    var lg = $(".ust .logo"); if (lg) { lg.setAttribute("href", u ? (yonetici(u) ? "#/yonetim" : "#/panel") : "#/"); lg.title = u ? "Üye ana ekranı" : "Üye platformu"; }
    $("#nav").insertAdjacentHTML("beforeend", '<a href="../" class="siteye-don">← Siteye dön</a>');
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("#menu-btn")) $("#nav").classList.toggle("acik");
    if (e.target.closest("#nav a")) $("#nav").classList.remove("acik");
  });

  /* ---------- sayfalar ---------- */
  var S = {};

  S.vitrin = function () { // ziyaretçi ana sayfa (platform tarafı): ücretsiz üye ol çağrısı
    return '<section class="sayfa-bas"><div><div class="mono">Üye platformu</div><h1 class="bas" style="margin-top:10px">Önce gir,<br><span class="k">sonra karar ver.</span></h1><p class="s">Ücretsiz üye olun: ilk dersleri izleyin, SPL denemesi çözün, analiz dokümanını okuyun. Beğendiğiniz paketi platformun içinden alın.</p><div class="satir" style="margin-top:22px"><a class="btn ana" href="#/kayit">Ücretsiz üye ol →</a><a class="btn" href="#/giris">Giriş yap</a></div></div></section>' +
      '<div class="izgara i3">' + [["🎓", "Eğitim arşivi", "4 program, sırayla ilerleyen dersler ve sertifika."], ["🧠", "SPL Soru Bankası", "10 soruluk alıştırmalar, 25 soruluk denemeler, konu analizi."], ["📡", "Canlı eğitim", "Haftalık canlı yayın, geri sayım, tek tıkla katılım."], ["📄", "Dokümanlar", "Haftalık analizler, makro araştırmalar, ders notları."], ["💬", "Rütbeli forum", "Paylaş, yorumla, beğeni topla; Acemi'den Kıdemli Yatırımcı'ya."], ["📈", "Canlı grafik", "TradingView grafiği forumun içinde, çizim araçlarıyla."]].map(function (x) { return '<div class="kart"><div style="font-size:28px">' + x[0] + "</div><h3 style='margin-top:10px'>" + x[1] + '</h3><p class="s">' + x[2] + "</p></div>"; }).join("") + "</div>";
  };

  S.kayit = function () {
    return '<div class="izgara i2" style="align-items:start"><div><div class="mono">Ücretsiz üyelik</div><h1 class="bas" style="margin-top:10px">Aramıza<br><span class="k">katılın</span></h1><p class="s" style="margin-top:14px">Üyelik ücretsizdir. Hemen ardından demo içeriklere erişirsiniz: ilk dersler, SPL alıştırması ve örnek analiz. Paketi istediğiniz zaman içeriden alırsınız.</p>' +
      '<div class="kart" style="margin-top:22px"><div class="mono">Ücretsiz üyelikte</div><ul style="margin-top:10px;padding-left:18px;display:grid;gap:6px"><li>Her programın ilk dersi</li><li>Her SPL düzeyinde 1 alıştırma (5 soru)</li><li>Örnek makro araştırma (PDF)</li><li>Canlı eğitim takvimi</li></ul></div></div>' +
      '<form class="kart form" id="f-kayit"><div class="izgara i2"><label>Ad<input type="text" name="ad" required></label><label>Soyad<input type="text" name="soyad" required></label></div>' +
      '<label>E-posta<input type="email" name="email" required></label><div class="izgara i2"><label>Telefon<input type="tel" name="tel" required></label><label>Telegram <span class="s">(isteğe bağlı)</span><input type="text" name="telegram"></label></div>' +
      '<label>Finans bilgi seviyeniz<select name="seviye" required><option value="">Seçiniz</option>' + V.seviyeler.map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select></label>" +
      '<div><div style="font-weight:700;font-size:14px;margin-bottom:8px">İlgilendiğiniz piyasalar</div><div class="secim">' + V.ilgiAlanlari.map(function (a) { return '<label><input type="checkbox" name="alan" value="' + a + '">' + a + "</label>"; }).join("") + "</div></div>" +
      '<div class="izgara i2"><label>Şifre<input type="password" name="sifre" minlength="6" required></label><label>Şifre tekrar<input type="password" name="sifre2" minlength="6" required></label></div>' +
      '<label class="onay"><input type="checkbox" required> KVKK aydınlatma metnini okudum, kabul ediyorum.</label><label class="onay"><input type="checkbox" required> Üyelik sözleşmesini kabul ediyorum.</label><label class="onay"><input type="checkbox" name="izin" checked> Eğitim, kampanya ve analizlerden e-posta ile haberdar olmak istiyorum.</label>' +
      '<button class="btn ana">Ücretsiz üye ol →</button><p class="s" style="font-size:13px">Zaten üye misiniz? <a href="#/giris" class="m">Giriş yapın</a></p></form></div>';
  };
  S.kayit.bagla = function () {
    $("#f-kayit").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target, v = function (n) { return f.elements[n].value.trim(); };
      if (v("sifre") !== v("sifre2")) return tost("Şifreler aynı değil");
      var meta = { uygulama: "rit", ad: v("ad"), soyad: v("soyad"), tel: v("tel"), telegram: v("telegram"), seviye: v("seviye"), alanlar: $$("input[name=alan]:checked", f).map(function (x) { return x.value; }), eposta_izni: f.elements.izin.checked };
      var dugme = $("button.ana", f); dugme.disabled = true;
      sb.auth.signUp({ email: v("email").toLowerCase(), password: v("sifre"), options: { data: meta, emailRedirectTo: DONUS } }).then(async function (r) {
        dugme.disabled = false;
        if (r.error) return tost(/registered|already/i.test(r.error.message) ? "Bu e-posta ile kayıtlı üye var: giriş yapın" : "Kayıt yapılamadı: " + r.error.message);
        if (r.data.user && r.data.user.identities && !r.data.user.identities.length) return tost("Bu e-posta ile kayıtlı üye var: giriş yapın");
        if (r.data.session) { await yukle(); tost("Hoş geldiniz " + meta.ad + "! Ücretsiz içerikleriniz açıldı."); git("#/panel"); ciz(); }
        else $("#sayfa").innerHTML = '<div class="kart" style="max-width:560px;margin:30px auto;text-align:center"><div style="font-size:34px">📩</div><h2 class="bas" style="margin:10px 0">E-postanızı onaylayın</h2><p class="s"><b style="color:#fff">' + esc(v("email")) + '</b> adresine bir onay bağlantısı gönderdik. Bağlantıya tıkladığınızda üyeliğiniz açılır.</p><p class="s" style="font-size:13px;margin-top:10px">Gelmediyse istenmeyen (spam) klasörüne bakın.</p></div>';
      });
    });
  };

  S.giris = function () {
    return '<div style="max-width:440px;margin:30px auto"><div class="mono">Üye girişi</div><h1 class="bas" style="margin:10px 0 22px">Giriş</h1><form class="kart form" id="f-giris"><label>E-posta<input type="email" name="email" required autocomplete="email"></label><label>Şifre <span class="s">(isteğe bağlı)</span><input type="password" name="sifre" autocomplete="current-password" placeholder="Boş bırakın: e-postanıza bağlantı gelir"></label><button class="btn ana" id="giris-dugme">Giriş yap</button><p class="s" style="font-size:13px">Şifrenizi bilmiyor musunuz? Şifre alanını boş bırakın: e-postanıza tek tıkla giriş bağlantısı göndeririz.</p><p class="s" style="font-size:13px">Hesabınız yok mu? <a class="m" href="#/kayit">Ücretsiz üye olun</a></p></form></div>';
  };
  S.giris.bagla = function () {
    var f = $("#f-giris"), sifre = f.elements.sifre, d = $("#giris-dugme");
    var etiket = function () { d.textContent = sifre.value ? "Giriş yap" : "Giriş bağlantısı gönder"; }; sifre.addEventListener("input", etiket); etiket();
    f.addEventListener("submit", async function (e) {
      e.preventDefault(); var m = f.elements.email.value.trim().toLowerCase(); d.disabled = true;
      if (sifre.value) {
        var r = await sb.auth.signInWithPassword({ email: m, password: sifre.value }); d.disabled = false;
        if (r.error) return tost(/confirm/i.test(r.error.message) ? "E-postanızı henüz onaylamadınız: gelen kutunuza bakın" : "E-posta ya da şifre hatalı");
        await yukle(); git(yonetici(ben()) ? "#/yonetim" : "#/panel"); ciz();
      } else {
        var o = await sb.auth.signInWithOtp({ email: m, options: { emailRedirectTo: DONUS, shouldCreateUser: true, data: { uygulama: "rit" } } }); d.disabled = false;
        if (o.error) return tost(/rate|seconds/i.test(o.error.message) ? "Çok sık denendi; biraz sonra tekrar deneyin" : "Bağlantı gönderilemedi: " + o.error.message);
        $("#sayfa").innerHTML = '<div class="kart" style="max-width:560px;margin:30px auto;text-align:center"><div style="font-size:34px">📩</div><h2 class="bas" style="margin:10px 0">E-postanıza bakın</h2><p class="s"><b style="color:#fff">' + esc(m) + '</b> adresine giriş bağlantısı gönderdik. Bağlantıya tıklayınca bu sayfada oturumunuz açılır.</p><p class="s" style="font-size:13px;margin-top:10px">Gelmediyse istenmeyen (spam) klasörüne bakın.</p></div>';
      }
    });
  };

  S.panel = function () {
    var u = ben(), r = rutbe(u.id), sinav = db.sinavlar.filter(function (s) { return s.uye === u.id; });
    var ort = sinav.length ? Math.round(sinav.reduce(function (a, s) { return a + s.dogru / s.toplam; }, 0) / sinav.length * 100) : null;
    var sonraki = db.canlilar.filter(function (c) { return c.zaman + c.sure * 60e3 > simdi(); }).sort(function (a, b) { return a.zaman - b.zaman; })[0];
    var biten = (db.tamamlanan[u.id] || []).length, top = db.dersler.length;
    var paketler = (u.paketler || []).map(function (k) { return V.paketler.filter(function (p) { return p.kod === k; })[0]; }).filter(Boolean);
    return '<div class="sayfa-bas"><div><div class="mono">Panelim</div><h1 class="bas" style="margin-top:8px">Merhaba, ' + esc(u.ad) + "</h1>" +
      '<p class="s">' + (paketler.length ? "Paketiniz: <b style='color:#fff'>" + paketler.map(function (p) { return p.ad; }).join(", ") + "</b>" : "Ücretsiz üyesiniz: demo içerikler açık. Tüm içerik için bir paket seçin.") + "</p></div>" + (paketler.length ? "" : '<a class="btn ana" href="#/paketler">Paket seç →</a>') + "</div>" +
      (!u.ad ? '<div class="uyari sari" style="margin-bottom:16px">Profilinizi tamamlayın: adınızı ve telefonunuzu <a class="m" href="#/profil">Profil</a> sayfasından ekleyin.</div>' : "") +
      (db.duyurular.length ? '<div class="izgara" style="margin-bottom:16px">' + db.duyurular.slice(0, 3).map(function (d) { return '<div class="kart"><div class="satir" style="justify-content:space-between"><span class="etiket kirmizi">Duyuru</span><span class="s" style="font-size:13px">' + tarih(d.zaman) + '</span></div><h3 style="margin-top:10px">' + esc(d.baslik) + '</h3>' + (d.metin ? '<p class="s" style="white-space:pre-wrap;margin-top:6px">' + esc(d.metin) + "</p>" : "") + "</div>"; }).join("") + "</div>" : "") +
      '<div class="izgara i4">' +
      '<div class="kart"><div class="mono">Rütbe</div><div style="margin:10px 0">' + rozet(u.id) + '</div><div class="sayi-buyuk">' + r.puan + ' <span class="s" style="font-size:16px">puan</span></div><div class="cubuk" style="margin-top:10px"><i style="width:' + r.yuzde + '%"></i></div><p class="s" style="font-size:13px;margin-top:6px">' + (r.sonraki ? r.sonraki.ad + " için " + (r.sonraki.min - r.puan) + " puan" : "En üst rütbe") + "</p></div>" +
      '<div class="kart"><div class="mono">Eğitim ilerlemesi</div><div class="sayi-buyuk" style="margin-top:10px">' + biten + '<span class="s" style="font-size:18px">/' + top + '</span></div><div class="cubuk" style="margin-top:10px"><i style="width:' + Math.round(biten / Math.max(1, top) * 100) + '%"></i></div><a class="m" style="font-size:13px;display:block;margin-top:8px" href="#/egitimler">Kaldığın yerden devam →</a></div>' +
      '<div class="kart"><div class="mono">SPL başarı ortalaması</div><div class="sayi-buyuk" style="margin-top:10px">' + (ort == null ? "—" : "%" + ort) + '</div><p class="s" style="font-size:13px;margin-top:8px">' + sinav.length + " sınav çözüldü</p><a class='m' style='font-size:13px' href='#/spl'>Soru çöz →</a></div>" +
      '<div class="kart"><div class="mono">Sıradaki canlı</div>' + (sonraki ? '<h3 style="margin-top:10px;font-size:16px">' + esc(sonraki.baslik) + '</h3><p class="s" style="font-size:13px">' + (sonraki.zaman <= simdi() ? '<span class="canli-nokta"></span> Şu an yayında' : tarih(sonraki.zaman, true)) + '</p><a class="m" style="font-size:13px" href="#/canli">Canlı eğitimler →</a>' : '<p class="s">Planlanmış yayın yok</p>') + "</div></div>" +
      '<h2 class="bas" style="margin:40px 0 16px">Erişimleriniz</h2><div class="izgara i3">' + Object.keys(ALANLAR).map(function (a) {
        var var_ = erisir(u, a); return '<a class="kart tik" href="' + { arsiv: "#/egitimler", dokuman: "#/dokumanlar", canli: "#/canli", forum: "#/forum", spl: "#/spl" }[a] + '"><div class="satir" style="justify-content:space-between"><h3>' + ALANLAR[a] + "</h3>" + (var_ ? '<span class="etiket yesil">Açık</span>' : '<span class="etiket">Demo</span>') + '</div><p class="s" style="font-size:14px;margin-top:6px">' + (var_ ? "Tam erişiminiz var." : paketIcin(a)) + "</p></a>";
      }).join("") + "</div>";
  };

  S.paketler = function () {
    var u = ben();
    return '<div class="sayfa-bas"><div><div class="mono">Üyelik paketleri</div><h1 class="bas" style="margin-top:8px">3 farklı erişim,<br><span class="k">ihtiyacınız kadar.</span></h1><p class="s">SPL hazırlığı tek başına alınabilir; eğitim arşivi ayrı, canlı eğitim ve forum Tam Pakette. Önce ücretsiz üye olun, paketi platformun içinden alın.</p></div></div>' +
      '<div class="izgara i3">' + V.paketler.map(function (p) {
        var sahip = u && (u.paketler || []).indexOf(p.kod) > -1, bekl = u && db.odemeler.some(function (o) { return o.uye === u.id && o.paket === p.kod && o.durum === "bekliyor"; });
        return '<div class="kart paket' + (p.one ? " one" : "") + '"><div class="satir" style="justify-content:space-between"><span class="etiket ' + (p.one ? "kirmizi" : "altin") + '">' + esc(p.vurgu) + '</span><span class="mono">' + esc(p.donem) + '</span></div><h3 style="font-size:22px">' + esc(p.ad) + '</h3><div class="fiyat">' + esc(p.fiyat) + "</div><ul>" + p.maddeler.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" + (p.not ? '<p class="s" style="font-size:13px">' + esc(p.not) + "</p>" : "") +
          (sahip ? '<span class="btn" style="pointer-events:none">✓ Paketiniz</span>' : bekl ? '<span class="btn hayalet" style="pointer-events:none">Ödeme onayı bekleniyor</span>' : '<button class="btn ' + (p.one ? "ana" : "") + '" data-al="' + p.kod + '">' + (u ? "Satın al" : "Üye ol ve al") + " →</button>") + "</div>";
      }).join("") + "</div>" +
      '<div class="tablo-kap" style="margin-top:34px"><table><thead><tr><th>Erişim</th>' + V.paketler.map(function (p) { return "<th>" + esc(p.ad) + "</th>"; }).join("") + "<th>Ücretsiz üye</th></tr></thead><tbody>" +
      Object.keys(ALANLAR).map(function (a) { return "<tr><td>" + ALANLAR[a] + "</td>" + V.paketler.map(function (p) { return "<td>" + (p.erisim.indexOf(a) > -1 ? '<span class="iyi">✓</span>' : '<span class="s">—</span>') + "</td>"; }).join("") + '<td class="s">' + { arsiv: "İlk dersler", dokuman: "Örnek analiz", canli: "Takvim", forum: "Okuma", spl: "Düzey başına 1 alıştırma" }[a] + "</td></tr>"; }).join("") + "</tbody></table></div>";
  };
  S.paketler.bagla = function () {
    $$("[data-al]").forEach(function (b) {
      b.addEventListener("click", function () {
        var u = ben(), p = V.paketler.filter(function (x) { return x.kod === b.dataset.al; })[0];
        if (!u) { tost("Önce ücretsiz üye olun"); return git("#/kayit"); }
        modal('<div class="mono">Satın alma</div><h3 style="font-size:22px;margin:8px 0">' + esc(p.ad) + " · " + esc(p.fiyat) + '</h3><p class="s">' + esc(p.donem) + " erişim. Ödeme sonrası erişiminiz anında açılır.</p>" +
          '<div class="form" style="margin-top:18px"><button class="btn" disabled>💳 Kartla ödeme (yakında)</button><button class="btn ana" data-yol="havale">🏦 Havale/EFT bildir</button><button class="btn hayalet kucuk" data-kapat>Vazgeç</button></div><p class="s" style="font-size:12px;margin-top:12px">Havale/EFT bildiriminiz yönetici onayına düşer; onaylanınca erişiminiz açılır. Ödeme bilgileri için bizimle iletişime geçin.</p>', function (m) {
          m.addEventListener("click", function (e) {
            var y = e.target.closest("[data-yol]"); if (!y || y.dataset.yol !== "havale") return; y.disabled = true;
            yaz(sb.from("odemeler").insert({ uye: u.id, paket: p.kod, yontem: "Havale/EFT" }), "Bildiriminiz alındı; onaylanınca erişiminiz açılır", function () { m.remove(); ciz(); });
          });
        });
      });
    });
  };

  /* eğitimler */
  S.egitimler = function (prm) {
    var u = ben(), sec = prm[0] || null, tam = (db.tamamlanan[u.id] || []);
    if (!sec) return '<div class="sayfa-bas"><div><div class="mono">Eğitim arşivi</div><h1 class="bas" style="margin-top:8px">Programlar</h1><p class="s">Dersler sırayla ilerler; her dersi bitirince işaretleyin.' + (erisir(u, "arsiv") ? "" : " Ücretsiz üyelikte her programın ilk dersi açıktır.") + '</p></div></div><div class="izgara i2">' +
      V.programlar.map(function (p) { var d = db.dersler.filter(function (x) { return x.program === p.kod; }), b = d.filter(function (x) { return tam.indexOf(x.id) > -1; }).length; return '<a class="kart program tik" href="#/egitimler/' + p.kod + '"><div class="gorsel" style="background-image:url(' + p.gorsel + ')"></div><div class="ic"><div class="mono">Program ' + p.kod + " · " + d.length + ' ders</div><h3 style="font-size:21px;margin:8px 0 6px">' + esc(p.baslik) + '</h3><p class="s" style="font-size:14px">' + esc(p.aciklama) + '</p><div class="cubuk" style="margin-top:14px"><i style="width:' + (d.length ? Math.round(b / d.length * 100) : 0) + '%"></i></div><p class="s" style="font-size:12px;margin-top:6px">' + (d.length ? b + "/" + d.length + " tamamlandı" : "Dersler yakında eklenecek") + "</p></div></a>"; }).join("") + "</div>";
    var p = V.programlar.filter(function (x) { return x.kod === sec; })[0]; if (!p) return S.yok();
    var d = db.dersler.filter(function (x) { return x.program === sec; }).sort(function (a, b) { return a.sira - b.sira; });
    return '<div class="sekmeler">' + V.programlar.map(function (x) { return '<a class="sekme' + (x.kod === sec ? " aktif" : "") + '" href="#/egitimler/' + x.kod + '">' + x.kod + " — " + esc(x.baslik.replace("Finansal Piyasalarda ", "")) + "</a>"; }).join("") + "</div>" +
      '<div class="sayfa-bas"><div><div class="mono">Program ' + p.kod + '</div><h1 class="bas" style="margin-top:8px">' + esc(p.baslik) + '</h1><p class="s">' + esc(p.aciklama) + "</p></div></div>" +
      (d.length ? '<div class="izgara">' + d.map(function (x) { var acik = erisir(u, "arsiv") || x.demo, b = tam.indexOf(x.id) > -1; return '<a class="kart ders tik" href="#/ders/' + x.id + '"><span class="no' + (b ? " bitti" : "") + '">' + (b ? "✓" : x.sira) + '</span><div><h3 style="font-size:17px">' + esc(x.baslik) + '</h3><p class="s" style="font-size:13px">Ders ' + x.sira + " · " + (yt(x.video) ? "Video hazır" : "Video yakında eklenecek") + (x.demo && !erisir(u, "arsiv") ? ' · <span class="iyi">Ücretsiz izle</span>' : "") + '</p></div><span class="ok">' + (acik ? "→" : "🔒") + "</span></a>"; }).join("") + "</div>"
        : '<div class="kart bos-durum">Bu programın ders listesi hocamız tarafından yüklenecek.' + (yonetici(u) ? '<br><a class="btn kucuk ana" style="margin-top:14px" href="#/yonetim/dersler">Ders ekle</a>' : "") + "</div>");
  };
  S.ders = function (prm) {
    var u = ben(), x = db.dersler.filter(function (d) { return d.id === prm[0]; })[0]; if (!x) return S.yok();
    var p = V.programlar.filter(function (q) { return q.kod === x.program; })[0], acik = erisir(u, "arsiv") || x.demo, v = yt(x.video), b = (db.tamamlanan[u.id] || []).indexOf(x.id) > -1;
    var liste = db.dersler.filter(function (d) { return d.program === x.program; }).sort(function (a, c) { return a.sira - c.sira; }), i = liste.indexOf(x), sonraki = liste[i + 1];
    return '<a class="m" href="#/egitimler/' + p.kod + '">← ' + esc(p.baslik) + '</a><div class="mono" style="margin-top:14px">Program ' + p.kod + " · Ders " + x.sira + '</div><h1 class="bas" style="font-size:clamp(30px,4vw,50px);margin:8px 0 20px">' + esc(x.baslik) + "</h1>" +
      '<div class="kilitli">' + (acik ? "" : kilit("arsiv")) + '<div class="video">' + (acik && v ? '<iframe src="https://www.youtube-nocookie.com/embed/' + v + '?rel=0&modestbranding=1" allow="accelerometer;encrypted-media;gyroscope;picture-in-picture" allowfullscreen title="' + esc(x.baslik) + '"></iframe>' : '<div class="bos"><div><div style="font-size:40px">▶</div><p class="s">' + (v ? "Video kilitli" : "Video yakında eklenecek") + "</p></div></div>") + "</div></div>" +
      '<div class="satir" style="margin-top:18px;justify-content:space-between"><button class="btn ' + (b ? "" : "mavi") + '" id="bitir"' + (acik ? "" : " disabled") + ">" + (b ? "✓ Tamamlandı" : "Dersi tamamladım") + "</button>" + (sonraki ? '<a class="btn hayalet" href="#/ders/' + sonraki.id + '">Sonraki: ' + esc(sonraki.baslik) + " →</a>" : "") + "</div>";
  };
  S.ders.bagla = function (prm) { var b = $("#bitir"); if (b) b.addEventListener("click", function () { var u = ben(), t = db.tamamlanan[u.id] || []; b.disabled = true; yaz(t.indexOf(prm[0]) > -1 ? sb.from("tamamlanan").delete().eq("uye", u.id).eq("ders_id", prm[0]) : sb.from("tamamlanan").insert({ uye: u.id, ders_id: prm[0] })); }); };

  /* SPL */
  var sinavDurum = null, demoYukleniyor = null;
  // kapasite: soru bankası + (1903 spl-sinav.php soru robotu) kavram havuzu ≥5 ise istenen her sayıda soru üretilebilir
  var soruSay = function (k) { return (db.terimSayisi[k] >= 5 ? 999 : 0) + (db.soruSayisi[k] || db.sorular.filter(function (s) { return s.d === k; }).length); };
  var soruEtiket = function (k) { var b = db.soruSayisi[k] || db.sorular.filter(function (s) { return s.d === k; }).length, t = db.terimSayisi[k] || 0; return (b ? b + " soru" : "") + (b && t ? " + " : "") + (t ? t + " kavram (soru robotu)" : ""); };
  // spl-sinav.php yeniSinavUret(): her kavram için 2 soru tipi (tanımdan kavram / kavramdan tanım), 4 çeldirici + doğru = 5 şık; gerekirse kavramlar tekrar karıştırılıp döngüye alınır
  function robotSorular(duzey, adet) {
    var havuz = db.terimler.filter(function (t) { return t.d === duzey; }); if (havuz.length < 2 || adet <= 0) return [];
    var komb = []; havuz.forEach(function (t) { komb.push([t, 0], [t, 1]); }); var sec = [];
    while (sec.length < adet) { komb = karistir(komb); for (var i = 0; i < komb.length && sec.length < adet; i++) sec.push(komb[i]); }
    return sec.map(function (x) { var t = x[0], tip = x[1], cel = karistir(havuz.filter(function (o) { return o !== t; })).slice(0, 4);
      return tip === 0 ? { s: "Aşağıdaki tanım hangi kavrama aittir?\n\n“" + t.tanim + "”", k: t.ders || "Kavramlar", a: t.terim + ": " + t.tanim, dogru: t.terim, c: karistir(cel.map(function (o) { return o.terim; }).concat([t.terim])) }
        : { s: "“" + t.terim + "” kavramının tanımı aşağıdakilerden hangisidir?", k: t.ders || "Kavramlar", a: t.terim + ": " + t.tanim, dogru: t.tanim, c: karistir(cel.map(function (o) { return o.tanim; }).concat([t.tanim])) }; });
  }
  S.spl = function (prm) {
    var u = ben();
    if (prm[0] && prm[1]) return splSinav(prm[0], prm[1]);
    var gecmis = db.sinavlar.filter(function (s) { return s.uye === u.id; }).sort(function (a, b) { return b.zaman - a.zaman; });
    var ort = gecmis.length ? Math.round(gecmis.reduce(function (a, s) { return a + s.dogru / s.toplam; }, 0) / gecmis.length * 100) : null;
    var konuTop = {}; gecmis.forEach(function (s) { Object.keys(s.konular || {}).forEach(function (k) { var t = konuTop[k] = konuTop[k] || [0, 0]; t[0] += s.konular[k][0]; t[1] += s.konular[k][1]; }); });
    return '<div class="sayfa-bas"><div><div class="mono">SPL &amp; sınav merkezi</div><h1 class="bas" style="margin-top:8px">Lisans sınavına<br><span class="k">çözerek hazırlan</span></h1><p class="s">Her sınavda sorular ve şıklar karışır. Alıştırma en çok 10, deneme en çok 25 soru (gerçek sınav formatı); bankada daha az soru varsa düğmede gerçek sayı yazar. Yalnız SPL paketi alanlar yalnız bu bölüme erişir.</p></div>' + (erisir(u, "spl") ? '<span class="etiket yesil">Tam erişim</span>' : '<span class="etiket altin">Demo: düzey başına 1 alıştırma</span>') + "</div>" +
      '<div class="izgara i3">' + V.splDuzeyler.map(function (d) {
        if (!soruSay(d.kod)) return '<div class="kart" style="opacity:.8"><span class="etiket mavi">Yakında</span><h3 style="font-size:20px;margin:10px 0 8px">' + (d.simge ? d.simge + " " : "") + esc(d.ad) + '</h3><p class="s" style="font-size:14px">Bu lisans için soru havuzu hazırlanıyor. Açıldığında SPL paketine dahil olacak.</p></div>';
        var n = soruSay(d.kod), demoKullandi = (db.demoHak[u.id] || []).indexOf(d.kod) > -1, tam = erisir(u, "spl");
        return '<div class="kart"><div class="mono">' + esc(soruEtiket(d.kod)) + '</div><h3 style="font-size:20px;margin:8px 0 14px">' + (d.simge ? d.simge + " " : "") + esc(d.ad) + '</h3><div class="form">' +
          '<a class="btn kucuk mavi' + (!tam && demoKullandi ? '" style="pointer-events:none;opacity:.45' : "") + '" href="#/spl/' + d.kod + '/alistirma">' + (tam ? "Alıştırma · " + Math.min(10, n) + " soru" : demoKullandi ? "Demo kullanıldı" : "Ücretsiz dene · " + Math.min(5, n) + " soru") + "</a>" +
          '<a class="btn kucuk' + (tam ? "" : '" style="pointer-events:none;opacity:.45') + '" href="#/spl/' + d.kod + '/deneme">' + (tam ? "Deneme · " + Math.min(25, n) + " soru" : "🔒 Deneme sınavı") + "</a></div></div>";
      }).join("") + "</div>" +
      '<div class="izgara i2" style="margin-top:22px"><div class="kart"><div class="mono">Başarı ortalaması</div><div class="sayi-buyuk" style="margin-top:8px">' + (ort == null ? "—" : "%" + ort) + '</div><div class="ayir"></div>' +
      (Object.keys(konuTop).length ? Object.keys(konuTop).map(function (k) { var t = konuTop[k], y = Math.round(t[0] / t[1] * 100); return '<div style="margin-bottom:10px"><div class="satir" style="justify-content:space-between;font-size:14px"><span>' + esc(k) + '</span><b class="' + (y >= 70 ? "iyi" : y >= 50 ? "alt" : "k") + '">%' + y + '</b></div><div class="cubuk"><i style="width:' + y + '%"></i></div></div>'; }).join("") : '<p class="s">Konu analizi ilk sınavdan sonra burada görünür.</p>') + "</div>" +
      '<div class="kart"><div class="mono">Son sınavlar</div>' + (gecmis.length ? gecmis.slice(0, 6).map(function (s) { var d = V.splDuzeyler.filter(function (x) { return x.kod === s.duzey; })[0]; return '<div class="satir" style="justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--cizgi);font-size:14px"><span>' + (d ? d.ad : s.duzey) + " · " + (s.mod === "deneme" ? "Deneme" : "Alıştırma") + '</span><span><b>' + s.dogru + "/" + s.toplam + '</b> <span class="s">' + once(s.zaman) + "</span></span></div>"; }).join("") : '<p class="s" style="margin-top:8px">Henüz sınav çözmediniz.</p>') + "</div></div>";
  };
  function karistir(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function splSinav(duzey, mod) {
    var u = ben(), tam = erisir(u, "spl"), d = V.splDuzeyler.filter(function (x) { return x.kod === duzey; })[0]; if (!d) return S.yok();
    if (!tam && (mod === "deneme" || (db.demoHak[u.id] || []).indexOf(duzey) > -1) && !(sinavDurum && sinavDurum.duzey === duzey)) return '<div class="kart kilitli" style="min-height:260px">' + kilit("spl", "Bu sınav SPL paketinde") + "</div>";
    if (!sinavDurum || sinavDurum.duzey !== duzey || sinavDurum.mod !== mod || sinavDurum.bitti === "eski") {
      var adet = !tam ? 5 : mod === "deneme" ? 25 : 10, kur = function (havuz) { sinavDurum = { duzey: duzey, mod: mod, i: 0, cevap: [], set: (function () { var s = karistir(havuz).slice(0, adet).map(function (q) { return { s: q.s, k: q.k, a: q.a, dogru: q.c[0], c: karistir(q.c) }; }); return tam ? karistir(s.concat(robotSorular(duzey, adet - s.length))) : s; })(), istenen: adet, bas: simdi(), sure: mod === "deneme" ? adet * 90 : 0 }; };
      if (tam) kur(db.sorular.filter(function (s) { return s.d === duzey; }));
      else { // ücretsiz deneme: sunucu düzey başına bir kez 5 soru verir (soru bankası istemciye inmez)
        if (demoYukleniyor !== duzey) { demoYukleniyor = duzey; sb.rpc("demo_sorular", { p_duzey: duzey }).then(function (r) { demoYukleniyor = null; (db.demoHak[u.id] = db.demoHak[u.id] || []).push(duzey); if (r.error) { tost(/demo_kullanildi/.test(r.error.message) ? "Bu düzeyin ücretsiz denemesini kullandınız" : "Sorular alınamadı"); sinavDurum = null; return ciz(); } kur((r.data || []).map(function (q) { return { d: q.duzey, k: q.konu, s: q.soru, c: q.siklar, a: q.aciklama }; })); ciz(); }); }
        return '<div class="kart bos-durum">Sorular hazırlanıyor…</div>';
      }
      if (!sinavDurum.set.length) { sinavDurum = null; return '<div class="kart bos-durum">Bu lisans için soru havuzu hazırlanıyor. <a class="m" href="#/spl">SPL ana sayfa</a></div>'; }
    }
    var S2 = sinavDurum, q = S2.set[S2.i];
    if (S2.bitti) return sinavSonuc();
    var ust = '<div class="satir" style="justify-content:space-between"><a class="m" href="#/spl" id="cik">← SPL</a><span class="mono">' + d.ad + " · " + (mod === "deneme" ? "Deneme" : "Alıştırma") + '</span>' + (S2.sure ? '<span class="sure" id="sure"></span>' : "") + "</div>" +
      (S2.set.length < S2.istenen ? '<div class="uyari sari" style="margin-top:12px">Bu düzeyin bankasında şu an ' + S2.set.length + " soru var; sınav " + S2.set.length + " soruyla yapılıyor. Hocamızın notları yüklendikçe " + S2.istenen + "'e tamamlanır.</div>" : "");
    return '<div class="sinav">' + ust + '<div class="cubuk" style="margin:18px 0"><i style="width:' + (S2.i / S2.set.length * 100) + '%"></i></div><div class="mono">Soru ' + (S2.i + 1) + " / " + S2.set.length + " · " + esc(q.k) + '</div><h2 style="font-size:22px;line-height:1.35;margin:10px 0 6px;white-space:pre-line">' + esc(q.s) + "</h2>" +
      q.c.map(function (c, j) { return '<button class="sik" data-sik="' + j + '">' + "ABCDE"[j] + ") " + esc(c) + "</button>"; }).join("") + '<div id="aciklama"></div></div>';
  }
  S.spl.bagla = function (prm) {
    if (!(prm[0] && prm[1]) || !sinavDurum) return;
    var S2 = sinavDurum;
    var sz = $("#sure"); if (sz) { clearInterval(S2._t); var tik = function () { var k = S2.sure - Math.floor((simdi() - S2.bas) / 1000); if (k <= 0) { clearInterval(S2._t); S2.bitti = true; sinavKaydet(); ciz(); return; } sz.textContent = "⏱ " + Math.floor(k / 60) + ":" + String(k % 60).padStart(2, "0"); }; tik(); S2._t = setInterval(tik, 1000); }
    $$(".sik").forEach(function (b) {
      b.addEventListener("click", function () {
        if (S2.cevaplandi) return; S2.cevaplandi = true;
        var q = S2.set[S2.i], sec = q.c[+b.dataset.sik], ok = sec === q.dogru; S2.cevap.push({ k: q.k, ok: ok });
        if (S2.mod === "alistirma") {
          $$(".sik").forEach(function (x) { var c = q.c[+x.dataset.sik]; if (c === q.dogru) x.classList.add("dogru"); else if (x === b) x.classList.add("yanlis"); });
          $("#aciklama").innerHTML = '<div class="uyari" style="margin-top:14px"><b>' + (ok ? "✓ Doğru" : "✗ Yanlış") + "</b> · " + esc(q.a) + '</div><button class="btn mavi" style="margin-top:14px" id="ileri">' + (S2.i + 1 < S2.set.length ? "Sonraki soru →" : "Sonucu gör") + "</button>";
          $("#ileri").addEventListener("click", ilerle);
        } else { b.classList.add("secili"); setTimeout(ilerle, 250); }
      });
    });
    function ilerle() { S2.cevaplandi = false; S2.i++; if (S2.i >= S2.set.length) { S2.bitti = true; clearInterval(S2._t); sinavKaydet(); } ciz(); }
  };
  function sinavKaydet() { var S2 = sinavDurum, k = {}; S2.cevap.forEach(function (c) { var t = k[c.k] = k[c.k] || [0, 0]; t[1]++; if (c.ok) t[0]++; }); var kayit = { uye: db.oturum, duzey: S2.duzey, mod: S2.mod, dogru: S2.cevap.filter(function (c) { return c.ok; }).length, toplam: S2.set.length, konular: k }; db.sinavlar.push(Object.assign({ zaman: simdi() }, kayit)); sb.from("sinavlar").insert(kayit).then(function (r) { if (r.error) tost("Sonuç kaydedilemedi: " + r.error.message); }); }
  function sinavSonuc() {
    var S2 = sinavDurum, d = S2.cevap.filter(function (c) { return c.ok; }).length, y = Math.round(d / S2.set.length * 100); S2.bitti = "eski";
    return '<div class="sinav kart" style="text-align:center;padding:40px 22px"><div class="mono">Sınav sonucu</div><div class="sayi-buyuk" style="font-size:90px;margin:12px 0" class="' + (y >= 70 ? "iyi" : "k") + '">%' + y + '</div><p style="font-size:18px">' + d + " / " + S2.set.length + " doğru · " + (y >= 70 ? "Geçer not seviyesindesiniz 👏" : "Biraz daha tekrar 💪") + '</p><div class="satir" style="justify-content:center;margin-top:20px"><a class="btn mavi" href="#/spl/' + S2.duzey + "/" + S2.mod + '" id="yeniden">Yeni soru seti</a><a class="btn" href="#/spl">SPL ana sayfa</a></div>' + (erisir(ben(), "spl") ? "" : '<div class="uyari sari" style="margin-top:20px">Demo hakkınızı kullandınız. Tüm düzeyler ve 25 soruluk denemeler için <a class="m" href="#/paketler">SPL Soru Bankası</a>.</div>') + "</div>";
  }

  /* dokümanlar */
  var dokFiltre = "Tümü";
  S.dokumanlar = function () {
    var u = ben(), acik = erisir(u, "dokuman"), say = function (k) { return db.dokumanlar.filter(function (d) { return k === "Tümü" || d.kategori === k; }).length; };
    var liste = db.dokumanlar.filter(function (d) { return dokFiltre === "Tümü" || d.kategori === dokFiltre; }).sort(function (a, b) { return String(b.tarih).localeCompare(a.tarih); });
    return '<div class="sayfa-bas"><div><div class="mono">Eğitim dokümanları</div><h1 class="bas" style="margin-top:8px">Analiz &amp; notlar</h1><p class="s">Toplam ' + db.dokumanlar.length + " doküman. " + (acik ? "" : "Ücretsiz üyelikte örnek analiz açıktır.") + "</p></div></div>" +
      '<div class="sekmeler">' + ["Tümü"].concat(V.dokumanKategorileri).map(function (k) { return '<button class="sekme' + (k === dokFiltre ? " aktif" : "") + '" data-kat="' + esc(k) + '">' + esc(k) + '<span class="rozet">' + say(k) + "</span></button>"; }).join("") + "</div>" +
      (liste.length ? '<div class="izgara">' + liste.map(function (d) { var ac = acik || d.demo; return '<div class="kart satir" style="justify-content:space-between"><div style="min-width:0;flex:1"><div class="satir" style="gap:8px"><span class="etiket altin">' + esc(d.kategori) + '</span><span class="s" style="font-size:13px">' + esc(d.tarih) + "</span>" + (d.demo && !acik ? '<span class="etiket yesil">Ücretsiz</span>' : "") + '</div><h3 style="margin-top:8px">' + esc(d.baslik) + "</h3></div>" + (ac ? '<button class="btn mavi kucuk" data-pdf="' + d.id + '">📄 PDF görüntüle</button>' : '<a class="btn kucuk hayalet" href="#/paketler">🔒 Paketle aç</a>') + "</div>"; }).join("") + "</div>" : '<div class="kart bos-durum">Bu kategoride henüz doküman yok.</div>');
  };
  S.dokumanlar.bagla = function () {
    $$("[data-kat]").forEach(function (b) { b.addEventListener("click", function () { dokFiltre = b.dataset.kat; ciz(); }); });
    $$("[data-pdf]").forEach(function (b) { b.addEventListener("click", function () { var d = db.dokumanlar.filter(function (x) { return x.id === b.dataset.pdf; })[0], ac = function (adres) { modal('<div class="satir" style="justify-content:space-between"><h3>' + esc(d.baslik) + '</h3><button class="btn kucuk hayalet" data-kapat>Kapat ✕</button></div><iframe src="' + esc(adres) + '" style="width:100%;height:70vh;border:0;margin-top:12px;border-radius:10px;background:#fff" title="PDF"></iframe><a class="m" style="font-size:13px" href="' + esc(adres) + '" target="_blank" rel="noopener">Yeni sekmede aç ↗</a>').querySelector(".kart").style.maxWidth = "1000px"; };
      if (!d.yol) return ac(d.dosya); // dış bağlantı ya da sitedeki örnek PDF
      sb.storage.from("rit-dokuman").createSignedUrl(d.yol, 3600).then(function (r) { if (r.error) return tost("Doküman açılamadı"); ac(r.data.signedUrl); }); }); });
  };

  /* canlı */
  S.canli = function (prm) {
    if (prm[0] === "oda") return canliOda(prm[1]);
    var u = ben(), acik = erisir(u, "canli"), lst = db.canlilar.slice().sort(function (a, b) { return a.zaman - b.zaman; });
    var yayinda = lst.filter(function (c) { return c.zaman <= simdi() && c.zaman + c.sure * 60e3 > simdi(); }), gelecek = lst.filter(function (c) { return c.zaman > simdi(); }), gecmis = lst.filter(function (c) { return c.zaman + c.sure * 60e3 <= simdi(); });
    var kart = function (c, durum) {
      return '<div class="kart"><div class="satir" style="justify-content:space-between"><span class="etiket ' + (durum === "yayinda" ? "kirmizi" : durum === "gelecek" ? "mavi" : "") + '">' + (durum === "yayinda" ? '<span class="canli-nokta"></span> Şu an yayında' : durum === "gelecek" ? "Planlandı" : "Tamamlandı") + '</span><span class="mono">' + c.sure + ' dk</span></div><h3 style="font-size:20px;margin:12px 0 4px">' + esc(c.baslik) + '</h3><p class="s" style="font-size:14px">' + esc(c.aciklama || "") + '</p><p style="font-size:14px;margin-top:8px">📅 ' + tarih(c.zaman, true) + "</p>" +
        (durum === "gelecek" ? '<div class="geri-sayim" data-sayac="' + c.zaman + '" style="margin-top:14px"></div>' : "") +
        '<div class="satir" style="margin-top:16px">' + (durum === "yayinda" ? (acik ? '<a class="btn ana" href="#/canli/oda/' + c.id + '">Oturuma katıl →</a>' : '<a class="btn hayalet" href="#/paketler">🔒 Tam Paket ile katıl</a>') : durum === "gelecek" ? '<button class="btn kucuk" data-ics="' + c.id + '">📅 Takvime ekle</button>' : (acik ? '<span class="s" style="font-size:13px">Kaydı arşive eklenir</span>' : "")) + "</div></div>";
    };
    return '<div class="sayfa-bas"><div><div class="mono">Canlı eğitimler</div><h1 class="bas" style="margin-top:8px">Haftalık<br><span class="k">canlı yayın</span></h1><p class="s">Saati gelince "Oturuma katıl" düğmesi açılır. Canlı eğitim Tam Pakete dahildir.</p></div></div>' +
      (yayinda.length ? '<div class="izgara i2" style="margin-bottom:16px">' + yayinda.map(function (c) { return kart(c, "yayinda"); }).join("") + "</div>" : "") +
      '<h2 class="bas" style="font-size:28px;margin:24px 0 14px">Planlanan</h2>' + (gelecek.length ? '<div class="izgara i2">' + gelecek.map(function (c) { return kart(c, "gelecek"); }).join("") + "</div>" : '<div class="kart bos-durum">Planlanmış yayın yok.</div>') +
      (gecmis.length ? '<h2 class="bas" style="font-size:28px;margin:34px 0 14px">Geçmiş</h2><div class="izgara i3">' + gecmis.map(function (c) { return kart(c, "gecmis"); }).join("") + "</div>" : "");
  };
  S.canli.bagla = function (prm) {
    if (prm[0] === "oda") return canliOdaBagla(prm[1]);
    var tik = function () { $$("[data-sayac]").forEach(function (el) { var k = Math.max(0, Math.floor((+el.dataset.sayac - simdi()) / 1000)); if (!k) { ciz(); return; } el.innerHTML = [[Math.floor(k / 86400), "GÜN"], [Math.floor(k % 86400 / 3600), "SAAT"], [Math.floor(k % 3600 / 60), "DK"], [k % 60, "SN"]].map(function (x) { return "<div><b>" + String(x[0]).padStart(2, "0") + "</b><span>" + x[1] + "</span></div>"; }).join(""); }); };
    tik(); sayacTik = setInterval(tik, 1000);
    $$("[data-ics]").forEach(function (b) { b.addEventListener("click", function () { var c = db.canlilar.filter(function (x) { return x.id === b.dataset.ics; })[0], f = function (t) { return new Date(t).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; }; var ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//RunInvestingTR//TR\r\nBEGIN:VEVENT\r\nUID:" + c.id + "@runinvestingtr\r\nDTSTAMP:" + f(simdi()) + "\r\nDTSTART:" + f(c.zaman) + "\r\nDTEND:" + f(c.zaman + c.sure * 60e3) + "\r\nSUMMARY:RunInvestingTR · " + c.baslik + "\r\nDESCRIPTION:" + (c.aciklama || "") + "\r\nEND:VEVENT\r\nEND:VCALENDAR"; var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "runinvestingtr-canli.ics"; a.click(); }); });
  };
  var sayacTik = null;
  function canliOda(cid) {
    var u = ben(), c = db.canlilar.filter(function (x) { return x.id === cid; })[0]; if (!c) return S.yok();
    if (!erisir(u, "canli")) return '<div class="kart kilitli" style="min-height:280px">' + kilit("canli") + "</div>";
    var v = yt(c.yayin);
    return '<a class="m" href="#/canli">← Canlı eğitimler</a><div class="satir" style="margin:12px 0 18px;justify-content:space-between"><h1 class="bas" style="font-size:clamp(28px,3.6vw,46px)">' + esc(c.baslik) + '</h1><span class="etiket kirmizi"><span class="canli-nokta"></span> Canlı</span></div>' +
      '<div class="oda"><div><div class="video">' + (v ? '<iframe src="https://www.youtube-nocookie.com/embed/' + v + '?autoplay=1&rel=0" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen title="Canlı yayın"></iframe>' : '<div class="bos"><div><div style="font-size:42px">📡</div><b>Yayın birazdan başlıyor</b><p class="s" style="font-size:14px;margin-top:6px">Hoca yayını başlatınca görüntü burada açılır.' + (yonetici(u) ? '<br>Yönetici: <a class="m" href="#/yonetim/canli">yayın bağlantısını ekleyin</a> (YouTube liste dışı canlı yayın).' : "") + "</p></div></div>") + "</div>" +
      '<div class="kart" style="margin-top:14px"><div class="mono">Canlı grafik</div><div class="tv" style="height:380px">' + tvIframe("OANDA:XAUUSD") + "</div></div></div>" +
      '<div class="kart sohbet"><div style="padding:14px 16px;border-bottom:1px solid var(--cizgi)"><b>Soru &amp; sohbet</b></div><div class="akis" id="akis"></div><form id="f-sohbet"><input type="text" name="m" placeholder="Sorunuzu yazın…" autocomplete="off" required><button class="btn ana kucuk">Gönder</button></form></div></div>';
  }
  function canliOdaBagla(cid) {
    var akisYukle = function () { sb.from("sohbet").select("*").eq("canli_id", cid).order("zaman").then(function (r) { db.sohbet[cid] = (r.data || []).map(function (m) { return { yazar: m.yazar, metin: m.metin, zaman: ms(m.zaman) }; }); akisCiz(); }); };
    var akisCiz = function () { var a = $("#akis"); if (!a) return; a.innerHTML = (db.sohbet[cid] || []).map(function (m) { var y = uye(m.yazar); return '<div><b style="font-size:13px' + (yonetici(y) ? ";color:var(--alt)" : "") + '">' + esc(y.ad) + (yonetici(y) ? " · Eğitmen" : "") + '</b> <span class="s" style="font-size:11px">' + once(m.zaman) + '</span><div style="font-size:14px">' + esc(m.metin) + "</div></div>"; }).join(""); a.scrollTop = a.scrollHeight; };
    akisYukle(); sayacTik = setInterval(akisYukle, 8000);
    var f = $("#f-sohbet"); if (f) f.addEventListener("submit", function (e) { e.preventDefault(); var metin = f.elements.m.value.trim(); f.reset(); sb.from("sohbet").insert({ canli_id: cid, yazar: db.oturum, metin: metin }).then(function (r) { if (r.error) return tost("Gönderilemedi"); akisYukle(); }); });
  }
  function tvIframe(sembol) { return '<iframe loading="lazy" title="TradingView grafik" src="https://s.tradingview.com/widgetembed/?symbol=' + encodeURIComponent(sembol) + '&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=13161d&theme=dark&style=1&timezone=Europe%2FIstanbul&withdateranges=1&locale=tr"></iframe>'; }

  /* forum */
  S.forum = function (prm) {
    var u = ben(), acik = erisir(u, "forum"), f = db.forum;
    if (prm[0] === "konu") return forumKonu(prm[1]);
    if (prm[0]) return forumKategori(prm[0], prm[1]);
    var lider = db.uyeler.map(function (x) { return { u: x, p: puan(x.id) }; }).filter(function (x) { return x.p > 0; }).sort(function (a, b) { return b.p - a.p; }).slice(0, 5);
    return '<div class="sayfa-bas"><div><div class="mono">Yatırımcı forumu</div><h1 class="bas" style="margin-top:8px">Forum</h1><p class="s">Bir kategori seçin; kategorinin içinde alt başlık açabilir ve paylaşım yapabilirsiniz. Paylaşım ' + V.puan.paylasim + " · yorum " + V.puan.yorum + " · beğeni almak " + V.puan.begeniAl + " · beğeni vermek " + V.puan.begeniVer + ' puan.</p></div>' + (yonetici(u) ? '<button class="btn mavi" id="yeni-kat">+ Yeni kategori aç</button>' : "") + "</div>" +
      (acik ? "" : '<div class="uyari sari" style="margin-bottom:16px">Forumu okuyabilirsiniz; paylaşım, yorum ve beğeni Tam Paket üyelerine açıktır. <a class="m" href="#/paketler">Paketler →</a></div>') +
      '<div class="izgara" style="grid-template-columns:minmax(0,1fr) 320px;align-items:start" id="forum-izgara"><div class="izgara">' + f.kategoriler.map(function (k) {
        var n = f.konular.filter(function (x) { return x.kat === k.id; }).length, a = f.altlar.filter(function (x) { return x.kat === k.id; }).length;
        return '<a class="kart konu-satir tik" href="#/forum/' + k.id + '"><div><h3 class="alt" style="font-size:19px">' + esc(k.ad) + '</h3><p class="s" style="font-size:14px">' + esc(k.aciklama) + '</p></div><div class="sag"><div class="sayi-buyuk alt" style="font-size:28px">' + n + '</div><div class="mono">paylaşım' + (a ? " · " + a + " alt başlık" : "") + "</div></div></a>";
      }).join("") + "</div>" +
      '<div class="izgara"><div class="kart"><div class="mono">Liderlik tablosu</div>' + lider.map(function (x, i) { return '<div class="satir" style="padding:10px 0;border-bottom:1px solid var(--cizgi)"><b style="width:18px">' + (i + 1) + '</b><span class="avatar">' + bas(x.u) + '</span><div style="flex:1;min-width:0"><div style="font-weight:700;font-size:14px">' + esc(adSoyad(x.u)) + "</div>" + rozet(x.u.id) + '</div><b class="alt">' + x.p + "</b></div>"; }).join("") + '</div><div class="kart"><div class="mono">Rütbeler</div>' + V.rutbeler.map(function (r) { return '<div class="satir" style="justify-content:space-between;font-size:14px;padding:6px 0"><span>' + esc(r.ad) + '</span><span class="s">' + r.min + "+ puan</span></div>"; }).join("") + '<p class="s" style="font-size:12px;margin-top:8px">Kıdemli Yatırımcılara ödül: ' + esc(V.rutbeler[V.rutbeler.length - 1].odul) + '.</p></div></div></div>';
  };
  function forumKategori(kid, altId) {
    var u = ben(), acik = erisir(u, "forum"), f = db.forum, k = f.kategoriler.filter(function (x) { return x.id === kid; })[0]; if (!k) return S.yok();
    var altlar = f.altlar.filter(function (x) { return x.kat === kid; }), alt = altId ? altlar.filter(function (x) { return x.id === altId; })[0] : null;
    var sonEt = function (x) { return f.yorumlar.reduce(function (m, c) { return c.konu === x.id && c.zaman > m ? c.zaman : m; }, x.zaman); };
    var konular = f.konular.filter(function (x) { return x.kat === kid && (alt ? x.alt === alt.id : true); }).sort(function (a, b) { return sonEt(b) - sonEt(a); });
    return '<a class="m" href="#/forum">← Forum</a>' + (alt ? ' <span class="s">/</span> <a class="m" href="#/forum/' + kid + '">' + esc(k.ad) + "</a>" : "") +
      '<div class="sayfa-bas" style="margin-top:12px"><div><h1 class="bas alt">' + esc(alt ? alt.ad : k.ad) + '</h1><p class="s">' + esc(alt ? k.ad + " kategorisinin alt başlığı" : k.aciklama + (altlar.length ? " · Alt başlıkları sekmelerden seçin." : "")) + '</p></div><div class="satir">' + (acik && !alt ? '<button class="btn hayalet" id="yeni-alt">+ Alt başlık aç</button>' : "") + (acik ? '<button class="btn mavi" id="yeni-konu">+ Yeni konu aç</button>' : "") + "</div></div>" +
      (altlar.length ? '<div class="sekmeler"><a class="sekme' + (alt ? "" : " aktif") + '" href="#/forum/' + kid + '">Tümü<span class="rozet">' + f.konular.filter(function (x) { return x.kat === kid; }).length + "</span></a>" + altlar.map(function (a) { var n = f.konular.filter(function (x) { return x.alt === a.id; }).length; return '<a class="sekme' + (alt && alt.id === a.id ? " aktif" : "") + '" href="#/forum/' + kid + "/" + a.id + '">' + esc(a.ad) + '<span class="rozet">' + n + "</span></a>"; }).join("") + "</div>" : "") +
      '<div id="konu-form"></div>' +
      (konular.length ? '<div class="izgara">' + konular.map(function (x) { var y = uye(x.yazar), n = f.yorumlar.filter(function (c) { return c.konu === x.id; }).length; return '<a class="kart konu-satir tik" href="#/forum/konu/' + x.id + '"><span class="avatar">' + bas(y) + '</span><div style="min-width:0"><h3 style="font-size:17px">' + esc(x.baslik) + '</h3><p class="s" style="font-size:13px">' + esc(adSoyad(y)) + " · " + once(x.zaman) + (!alt && x.alt ? " · " + esc((altlar.filter(function (a) { return a.id === x.alt; })[0] || { ad: "" }).ad) : "") + (x.resim ? " · 🖼 resimli grafik" : x.grafik ? " · 📈 " + esc(x.grafik) : "") + (n ? " · son yanıt " + once(sonEt(x)) : "") + '</p></div><div class="sag s" style="font-size:13px">💬 ' + n + "<br>❤ " + x.begeni.length + "</div></a>"; }).join("") + "</div>" : '<div class="kart bos-durum">Henüz paylaşım yok. İlk paylaşımı siz yapın.</div>');
  }
  function forumKonu(kid) {
    var u = ben(), acik = erisir(u, "forum"), f = db.forum, x = f.konular.filter(function (q) { return q.id === kid; })[0]; if (!x) return S.yok();
    var k = f.kategoriler.filter(function (q) { return q.id === x.kat; })[0] || { ad: "" }, yorumlar = f.yorumlar.filter(function (c) { return c.konu === kid; }).sort(function (a, b) { return a.zaman - b.zaman; });
    var gonderi = function (o, tur) { var y = uye(o.yazar), var_ = u && o.begeni.indexOf(u.id) > -1; return '<div class="kart gonderi"><div class="yazar"><span class="avatar" style="width:48px;height:48px;font-size:18px">' + bas(y) + '</span><div><b style="font-size:14px">' + esc(adSoyad(y)) + "</b><div>" + rozet(y.id) + '</div><div class="s" style="font-size:12px">' + puan(y.id) + ' puan</div></div></div><div class="metin"><div class="s" style="font-size:12px;margin-bottom:8px">' + tarih(o.zaman, true) + "</div>" + esc(o.metin) + (o.resim ? '<div class="gorsel-kap"><img class="gorsel" src="' + o.resim + '" alt="Paylaşılan grafik görüntüsü"></div>' : "") + (o.grafik ? '<div class="tv">' + tvIframe(o.grafik) + "</div>" : "") + '<div style="margin-top:14px"><button class="begeni' + (var_ ? " var" : "") + '" data-begen="' + tur + ":" + o.id + '"' + (acik && o.yazar !== (u && u.id) ? "" : " disabled") + ">❤ " + o.begeni.length + "</button>" + (yonetici(u) ? ' <button class="btn kucuk hayalet" data-sil-gonderi="' + tur + ":" + o.id + '">Sil</button>' : "") + "</div></div></div>"; };
    var ab = x.alt ? f.altlar.filter(function (q) { return q.id === x.alt; })[0] : null;
    return '<a class="m" href="#/forum">Forum</a> <span class="s">/</span> <a class="m" href="#/forum/' + x.kat + '">' + esc(k.ad) + "</a>" + (ab ? ' <span class="s">/</span> <a class="m" href="#/forum/' + x.kat + "/" + ab.id + '">' + esc(ab.ad) + "</a>" : "") + '<h1 class="bas" style="font-size:clamp(28px,3.6vw,44px);margin:12px 0 20px">' + esc(x.baslik) + '</h1><div class="izgara">' + gonderi(x, "k") + yorumlar.map(function (c) { return gonderi(c, "y"); }).join("") + "</div>" +
      (acik ? '<form class="kart form" id="f-yorum" style="margin-top:16px"><label>Yanıtınız <span class="s">(+' + V.puan.yorum + ' puan)</span><textarea name="m" required></textarea></label><button class="btn ana">Yanıtı gönder</button></form>' : '<div class="uyari sari" style="margin-top:16px">Yorum ve beğeni Tam Paket üyelerine açıktır.</div>');
  }
  S.forum.bagla = function (prm) {
    var u = ben(), f = db.forum;
    var yk = $("#yeni-kat"); if (yk) yk.addEventListener("click", function () { modal('<h3>Yeni kategori</h3><form class="form" style="margin-top:14px"><label>Kategori adı<input type="text" name="ad" required maxlength="40"></label><label>Açıklama<input type="text" name="ac" maxlength="90"></label><button class="btn mavi">Aç</button></form>', function (m) { $("form", m).addEventListener("submit", function (e) { e.preventDefault(); var ad = e.target.elements.ad.value.trim(); yaz(sb.from("forum_kategoriler").insert({ id: id("kat"), ad: ad, aciklama: e.target.elements.ac.value.trim() || ad + " ile ilgili paylaşımlar", sira: 100 + f.kategoriler.length }), "Kategori açıldı", function () { m.remove(); ciz(); }); }); }); });
    var ya = $("#yeni-alt"); if (ya) ya.addEventListener("click", function () { modal('<h3>Alt başlık aç</h3><form class="form" style="margin-top:14px"><label>Başlık<input type="text" name="ad" required maxlength="50"></label><button class="btn mavi">Aç</button></form>', function (m) { $("form", m).addEventListener("submit", function (e) { e.preventDefault(); var a = { id: id("a"), kat: prm[0], ad: e.target.elements.ad.value.trim(), acan: u.id }; yaz(sb.from("forum_altlar").insert(a), "Alt başlık açıldı", function () { m.remove(); git("#/forum/" + prm[0] + "/" + a.id); }); }); }); });
    var yko = $("#yeni-konu"); if (yko) yko.addEventListener("click", function () {
      $("#konu-form").innerHTML = '<form class="kart form" id="f-konu" style="margin-bottom:16px"><label>Başlık<input type="text" name="b" required maxlength="120"></label>' + (!prm[1] && f.altlar.some(function (x) { return x.kat === prm[0]; }) ? '<label>Alt başlık<select name="alt"><option value="">Genel (alt başlıksız)</option>' + f.altlar.filter(function (x) { return x.kat === prm[0]; }).map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.ad) + "</option>"; }).join("") + "</select></label>" : "") + '<label>Konu metni <span class="s">(+' + V.puan.paylasim + ' puan)</span><textarea name="m" required></textarea></label><fieldset class="grafik-sec"><legend>Grafik ekle <span class="s">(isteğe bağlı)</span></legend><div class="satir"><label class="onay"><input type="radio" name="gt" value="resim" checked> Resim yükle (JPG/PNG)</label><label class="onay"><input type="radio" name="gt" value="canli"> Canlı grafik (TradingView)</label><label class="onay"><input type="radio" name="gt" value="yok"> Grafik yok</label></div><div id="g-resim"><input type="file" name="gr" accept="image/jpeg,image/png"><span class="s" style="font-weight:500;font-size:12px">Grafiğinizin ekran görüntüsünü yükleyin; paylaşımda sabit resim olarak görünür. Büyük resimler otomatik küçültülür.</span><img id="g-onizle" alt="" hidden></div><div id="g-canli" hidden><input type="text" name="g" placeholder="ör. OANDA:XAUUSD, FX:EURUSD, NASDAQ:AAPL, BINANCE:BTCUSDT"><span class="s" style="font-weight:500;font-size:12px">Not: Borsa İstanbul (BIST) verisi TradingView lisansı gereği gömülü canlı grafikte gösterilmiyor; BIST için resim yükleyin.</span></div></fieldset><div class="satir"><button class="btn ana">Paylaş</button><button type="button" class="btn hayalet" id="vazgec">Vazgeç</button></div></form>';
      $("#vazgec").addEventListener("click", function () { $("#konu-form").innerHTML = ""; });
      var fk = $("#f-konu"), gSec = function () { var t = fk.elements.gt.value; $("#g-resim").hidden = t !== "resim"; $("#g-canli").hidden = t !== "canli"; };
      $$("input[name=gt]", fk).forEach(function (r) { r.addEventListener("change", gSec); });
      var kucult = function (dosya, bitti) { if (!/^image\/(jpeg|png)$/.test(dosya.type)) return tost("Yalnız JPG veya PNG yükleyin"); var r = new FileReader(); r.onerror = function () { tost("Resim okunamadı"); };
        r.onload = function () { var im = new Image(); im.onerror = function () { tost("Resim açılamadı"); }; im.onload = function () { var o = Math.min(1, 1400 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * o); c.height = Math.round(im.height * o); var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height); bitti(c.toDataURL("image/jpeg", .82)); }; im.src = r.result; }; r.readAsDataURL(dosya); };
      fk.elements.gr.addEventListener("change", function () { var d = this.files[0], on = $("#g-onizle"); if (!d) { on.hidden = true; return; } kucult(d, function (url) { on.src = url; on.hidden = false; }); });
      fk.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements, t = el.gt.value, k = { id: id("k"), kat: prm[0], alt: prm[1] || (el.alt && el.alt.value) || null, baslik: el.b.value.trim(), metin: el.m.value.trim(), grafik: t === "canli" ? el.g.value.trim().toUpperCase() : "", resim: "", yazar: u.id };
        $("button.ana", fk).disabled = true;
        var bitir = function () { yaz(sb.from("forum_konular").insert(k), "+" + V.puan.paylasim + " puan", function () { git("#/forum/konu/" + k.id); ciz(); }).then(function (ok) { if (!ok) $("button.ana", fk).disabled = false; }); };
        // grafik resmi: Storage rit-forum/<üye>/<konu>.jpg (herkese açık okunur), paylaşımda bağlantısı saklanır
        if (t === "resim" && el.gr.files[0]) kucult(el.gr.files[0], function (url) { fetch(url).then(function (x) { return x.blob(); }).then(function (blob) { var yol = u.id + "/" + k.id + ".jpg"; return sb.storage.from("rit-forum").upload(yol, blob, { contentType: "image/jpeg", upsert: false }).then(function (r) { if (r.error) throw r.error; k.resim = sb.storage.from("rit-forum").getPublicUrl(yol).data.publicUrl; bitir(); }); }).catch(function (e2) { $("button.ana", fk).disabled = false; tost("Resim yüklenemedi: " + (e2.message || e2)); }); }); else bitir(); });
    });
    $$("[data-begen]").forEach(function (b) { b.addEventListener("click", function () { var p = b.dataset.begen.split(":"), o = (p[0] === "k" ? f.konular : f.yorumlar).filter(function (x) { return x.id === p[1]; })[0], i = o.begeni.indexOf(u.id); b.disabled = true; yaz(i > -1 ? sb.from("forum_begeniler").delete().eq("tur", p[0]).eq("hedef", p[1]).eq("uye", u.id) : sb.from("forum_begeniler").insert({ tur: p[0], hedef: p[1], uye: u.id }), i > -1 ? "" : "+" + V.puan.begeniVer + " puan · yazara +" + V.puan.begeniAl); }); });
    $$("[data-sil-gonderi]").forEach(function (b) { b.addEventListener("click", function () { var p = b.dataset.silGonderi.split(":"); if (!confirm("Bu gönderi silinsin mi?")) return; var konu = p[0] === "k" ? f.konular.filter(function (x) { return x.id === p[1]; })[0] : null; yaz(sb.from(p[0] === "k" ? "forum_konular" : "forum_yanitlar").delete().eq("id", p[1]), "Silindi", function () { if (konu) git("#/forum/" + konu.kat); ciz(); }); }); });
    var fy = $("#f-yorum"); if (fy) fy.addEventListener("submit", function (e) { e.preventDefault(); yaz(sb.from("forum_yanitlar").insert({ id: id("y"), konu: prm[1], yazar: u.id, metin: e.target.elements.m.value.trim() }), "+" + V.puan.yorum + " puan"); });
  };

  S.hakkimizda = function () {
    return '<div class="izgara i2" style="align-items:center"><div><div class="mono">Hakkımızda</div><h1 class="bas" style="margin:10px 0 18px">Bilgi değere,<br><span class="k">disiplin başarıya.</span></h1><p style="white-space:pre-wrap;color:#c8ccd4">' + esc(db.hakkimizda) + '</p></div><div class="kart" style="padding:0;overflow:hidden"><img src="../img/sinif.jpg" alt="Akademi sınıfı" style="width:100%;height:340px;object-fit:cover"></div></div>' +
      '<div class="izgara i4" style="margin-top:34px">' + [["4", "eğitim programı"], ["SPL", "1-2-3. düzey + Türev"], ["Haftalık", "canlı eğitim"], ["5", "rütbeli forum seviyesi"]].map(function (x) { return '<div class="kart"><div class="sayi-buyuk">' + x[0] + '</div><p class="s">' + x[1] + "</p></div>"; }).join("") + "</div>" +
      '<div class="kart" style="margin-top:34px;text-align:center;padding:44px 22px;background:linear-gradient(135deg,rgba(229,50,45,.18),rgba(43,127,255,.12))"><h2 class="bas">Bize katılın</h2><p class="s" style="margin:10px auto 20px;max-width:520px">Ücretsiz üye olun, ilk dersleri izleyin, SPL denemesini çözün. Gerisine birlikte karar verelim.</p><a class="btn ana" href="#/kayit">Ücretsiz üye ol →</a></div>';
  };

  S.profil = function () {
    var u = ben(), r = rutbe(u.id);
    return '<div class="sayfa-bas"><div class="satir"><span class="avatar" style="width:64px;height:64px;font-size:26px">' + bas(u) + '</span><div><h1 class="bas" style="font-size:40px">' + esc(adSoyad(u)) + '</h1><div class="satir" style="gap:8px;margin-top:6px">' + rozet(u.id) + '<span class="s">' + r.puan + " puan</span></div></div></div><button class=\"btn hayalet\" id=\"cikis\">Çıkış yap</button></div>" +
      '<div class="izgara i2"><div class="kart"><div class="mono">Bilgilerim</div><p style="margin-top:10px">' + esc(u.email) + "<br>" + esc(u.tel || "") + '</p><p class="s" style="margin-top:8px">Seviye: ' + esc(u.seviye || "-") + "<br>İlgi: " + esc((u.alanlar || []).join(", ") || "-") + '</p></div><div class="kart"><div class="mono">Paketlerim</div>' + ((u.paketler || []).length ? u.paketler.map(function (k) { var p = V.paketler.filter(function (x) { return x.kod === k; })[0]; return '<p style="margin-top:10px"><span class="etiket yesil">' + esc(p ? p.ad : k) + "</span></p>"; }).join("") : '<p class="s" style="margin-top:10px">Ücretsiz üyelik</p><a class="btn kucuk ana" style="margin-top:12px" href="#/paketler">Paket seç</a>') + "</div></div>" +
      '<div class="izgara i2" style="margin-top:16px;align-items:start"><form class="kart form" id="f-profil"><div class="mono">Bilgilerimi düzenle</div><div class="izgara i2"><label>Ad<input type="text" name="ad" required value="' + esc(u.ad) + '"></label><label>Soyad<input type="text" name="soyad" value="' + esc(u.soyad) + '"></label></div><div class="izgara i2"><label>Telefon<input type="tel" name="tel" value="' + esc(u.tel) + '"></label><label>Telegram<input type="text" name="telegram" value="' + esc(u.telegram) + '"></label></div><label>Finans bilgi seviyeniz<select name="seviye">' + V.seviyeler.map(function (s) { return "<option" + (s === u.seviye ? " selected" : "") + ">" + s + "</option>"; }).join("") + '</select></label><label class="onay"><input type="checkbox" name="izin"' + (u.epostaIzni ? " checked" : "") + '> Eğitim ve kampanyalardan e-posta ile haberdar olmak istiyorum.</label><button class="btn ana">Kaydet</button></form>' +
      '<form class="kart form" id="f-sifre"><div class="mono">Şifre belirle / değiştir</div><p class="s" style="font-size:14px">E-posta bağlantısıyla girdiyseniz burada bir şifre belirleyip sonra şifreyle de girebilirsiniz.</p><label>Yeni şifre<input type="password" name="s1" minlength="6" required autocomplete="new-password"></label><label>Yeni şifre tekrar<input type="password" name="s2" minlength="6" required autocomplete="new-password"></label><button class="btn mavi">Şifreyi kaydet</button></form></div>';
  };
  S.profil.bagla = function () {
    $("#cikis").addEventListener("click", function () { sb.auth.signOut().then(async function () { sinavDurum = null; await yukle(); git("#/"); ciz(); }); });
    $("#f-profil").addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements; yaz(sb.from("uyeler").update({ ad: el.ad.value.trim(), soyad: el.soyad.value.trim(), tel: el.tel.value.trim(), telegram: el.telegram.value.trim(), seviye: el.seviye.value, eposta_izni: el.izin.checked }).eq("id", db.oturum), "Bilgileriniz kaydedildi"); });
    $("#f-sifre").addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements; if (el.s1.value !== el.s2.value) return tost("Şifreler aynı değil"); sb.auth.updateUser({ password: el.s1.value }).then(function (r) { if (r.error) return tost("Şifre kaydedilemedi: " + r.error.message); e.target.reset(); tost("Şifreniz kaydedildi; artık şifreyle de girebilirsiniz"); }); });
  };

  /* yönetim */
  var YSEK = [["ozet", "Özet"], ["uyeler", "Üyeler & erişim"], ["odemeler", "Ödeme onayları"], ["dersler", "Dersler & video"], ["dokumanlar", "Dokümanlar"], ["canli", "Canlı yayın"], ["sorular", "SPL soruları"], ["duyurular", "Duyurular"], ["pazarlama", "Pazarlama listesi"], ["ayarlar", "Hakkımızda"]];
  S.yonetim = function (prm) {
    var sek = prm[0] || "ozet", bek = db.odemeler.filter(function (o) { return o.durum === "bekliyor"; }).length;
    var ic = (Y[sek] || Y.ozet)();
    return '<div class="sayfa-bas"><div><div class="mono">Yönetici paneli</div><h1 class="bas" style="margin-top:8px">Akademi yönetimi</h1></div></div><div class="sekmeler">' + YSEK.map(function (s) { return '<a class="sekme' + (s[0] === sek ? " aktif" : "") + '" href="#/yonetim/' + s[0] + '">' + s[1] + (s[0] === "odemeler" && bek ? '<span class="rozet" style="background:var(--k);color:#fff">' + bek + "</span>" : "") + "</a>"; }).join("") + "</div>" + ic;
  };
  var Y = {};
  Y.ozet = function () {
    var uy = db.uyeler.filter(function (u) { return !yonetici(u); }), pk = function (k) { return uy.filter(function (u) { return (u.paketler || []).indexOf(k) > -1; }).length; }, ucretsiz = uy.filter(function (u) { return !(u.paketler || []).length; }).length;
    var son7 = uy.filter(function (u) { return simdi() - u.kayit < 7 * 864e5; }).length;
    return '<div class="izgara i4">' + [["Toplam üye", uy.length], ["Son 7 günde kayıt", son7], ["Ücretsiz (satın almayan)", ucretsiz], ["Bekleyen ödeme", db.odemeler.filter(function (o) { return o.durum === "bekliyor"; }).length]].map(function (x) { return '<div class="kart"><div class="mono">' + x[0] + '</div><div class="sayi-buyuk" style="margin-top:8px">' + x[1] + "</div></div>"; }).join("") + "</div>" +
      '<div class="izgara i3" style="margin-top:16px">' + V.paketler.map(function (p) { return '<div class="kart"><div class="mono">' + esc(p.ad) + '</div><div class="sayi-buyuk" style="margin-top:8px">' + pk(p.kod) + '</div><p class="s">üye · ' + esc(p.fiyat) + "</p></div>"; }).join("") + "</div>" +
      '<div class="izgara i2" style="margin-top:16px"><div class="kart"><div class="mono">İlgi alanları (kayıt anketi)</div>' + V.ilgiAlanlari.map(function (a) { var n = uy.filter(function (u) { return (u.alanlar || []).indexOf(a) > -1; }).length; return '<div style="margin-top:10px"><div class="satir" style="justify-content:space-between;font-size:14px"><span>' + a + "</span><b>" + n + '</b></div><div class="cubuk"><i style="width:' + Math.round(n / Math.max(1, uy.length) * 100) + '%"></i></div></div>'; }).join("") + '</div><div class="kart"><div class="mono">Bilgi seviyesi</div>' + V.seviyeler.map(function (s) { var n = uy.filter(function (u) { return u.seviye === s; }).length; return '<div style="margin-top:10px"><div class="satir" style="justify-content:space-between;font-size:14px"><span>' + s + "</span><b>" + n + '</b></div><div class="cubuk"><i style="width:' + Math.round(n / Math.max(1, uy.length) * 100) + '%"></i></div></div>'; }).join("") + '<div class="uyari" style="margin-top:16px;font-size:13px">Satın almayan ücretsiz üyeler "Pazarlama listesi" sekmesinde ilgi alanına göre süzülüp e-posta kampanyası için indirilebilir.</div></div></div>';
  };
  Y.uyeler = function () {
    var uy = db.uyeler.filter(function (u) { return !yonetici(u); }).sort(function (a, b) { return b.kayit - a.kayit; });
    return '<div class="uyari" style="margin-bottom:14px">Kutucuklarla her üyenin erişimini tek tek açıp kapatabilirsiniz (paketten bağımsız). Değişiklik anında geçerli olur.</div><div class="tablo-kap"><table><thead><tr><th>Üye</th><th>Kayıt</th><th>Paket</th>' + Object.keys(ALANLAR).map(function (a) { return "<th>" + ALANLAR[a] + "</th>"; }).join("") + "<th>Puan</th></tr></thead><tbody>" +
      uy.map(function (u) { return "<tr><td><b>" + esc(adSoyad(u)) + '</b><br><span class="s" style="font-size:12px">' + esc(u.email) + '</span></td><td class="s">' + tarih(u.kayit) + "</td><td>" + ((u.paketler || []).map(function (k) { var p = V.paketler.filter(function (x) { return x.kod === k; })[0]; return '<span class="etiket yesil">' + esc(p ? p.ad : k) + "</span>"; }).join(" ") || '<span class="etiket">Ücretsiz</span>') + "</td>" + Object.keys(ALANLAR).map(function (a) { return '<td><input type="checkbox" data-eris="' + u.id + ":" + a + '"' + (u.erisim[a] ? " checked" : "") + "></td>"; }).join("") + "<td>" + puan(u.id) + "</td></tr>"; }).join("") + "</tbody></table></div>";
  };
  Y.odemeler = function () {
    var l = db.odemeler.slice().sort(function (a, b) { return b.zaman - a.zaman; });
    return l.length ? '<div class="tablo-kap"><table><thead><tr><th>Üye</th><th>Paket</th><th>Yöntem</th><th>Tarih</th><th>Durum</th><th></th></tr></thead><tbody>' + l.map(function (o) { var u = uye(o.uye), p = V.paketler.filter(function (x) { return x.kod === o.paket; })[0]; return "<tr><td>" + esc(adSoyad(u)) + "</td><td>" + esc(p.ad) + " · " + esc(p.fiyat) + "</td><td>" + esc(o.yontem) + '</td><td class="s">' + tarih(o.zaman, true) + "</td><td>" + (o.durum === "bekliyor" ? '<span class="etiket altin">Bekliyor</span>' : o.durum === "onaylandi" ? '<span class="etiket yesil">Onaylandı</span>' : '<span class="etiket kirmizi">Reddedildi</span>') + "</td><td>" + (o.durum === "bekliyor" ? '<button class="btn kucuk mavi" data-odeme="' + o.id + ':onay">Onayla</button> <button class="btn kucuk hayalet" data-odeme="' + o.id + ':red">Reddet</button>' : "") + "</td></tr>"; }).join("") + "</tbody></table></div>" : '<div class="kart bos-durum">Ödeme kaydı yok.</div>';
  };
  Y.dersler = function () {
    return '<form class="kart form" id="f-ders"><div class="mono">Ders ekle / güncelle</div><div class="izgara i3"><label>Program<select name="p">' + V.programlar.map(function (p) { return '<option value="' + p.kod + '">' + p.kod + " — " + esc(p.baslik) + "</option>"; }).join("") + '</select></label><label>Sıra<input type="number" name="s" min="1" value="1" required></label><label class="onay" style="align-self:end"><input type="checkbox" name="demo"> Ücretsiz üyeye açık (demo)</label></div><label>Ders başlığı<input type="text" name="b" required></label><label>Video bağlantısı <span class="s">(YouTube liste dışı video; sunucu gerekmez)</span><input type="url" name="v" placeholder="https://youtu.be/…"></label><button class="btn ana">Kaydet</button></form>' +
      '<div class="tablo-kap" style="margin-top:16px"><table><thead><tr><th>Program</th><th>Sıra</th><th>Ders</th><th>Video</th><th>Demo</th><th></th></tr></thead><tbody>' + db.dersler.slice().sort(function (a, b) { return a.program.localeCompare(b.program) || a.sira - b.sira; }).map(function (d) { return "<tr><td>" + d.program + "</td><td>" + d.sira + "</td><td>" + esc(d.baslik) + "</td><td>" + (yt(d.video) ? '<span class="iyi">✓ bağlı</span>' : '<span class="s">yok</span>') + "</td><td>" + (d.demo ? "✓" : "") + '</td><td><button class="btn kucuk hayalet" data-ders-duz="' + d.id + '">Düzenle</button> <button class="btn kucuk hayalet" data-ders-sil="' + d.id + '">Sil</button></td></tr>'; }).join("") + "</tbody></table></div>";
  };
  Y.dokumanlar = function () {
    return '<form class="kart form" id="f-dok"><div class="mono">Doküman yükle</div><div class="izgara i2"><label>Kategori<select name="k">' + V.dokumanKategorileri.map(function (k) { return "<option>" + esc(k) + "</option>"; }).join("") + '</select></label><label>Tarih<input type="text" name="t" value="' + new Date().toISOString().slice(0, 10) + '"></label></div><label>Başlık<input type="text" name="b" required></label><label>PDF dosyası <span class="s">(en çok 50 MB; güvenli depoda saklanır, yalnız erişimi olan üyeler açar)</span><input type="file" name="f" accept="application/pdf"></label><label>ya da PDF bağlantısı<input type="url" name="u" placeholder="https://…/dosya.pdf"></label><label class="onay"><input type="checkbox" name="demo"> Ücretsiz üyeye açık (örnek)</label><button class="btn ana">Yükle</button></form>' +
      '<div class="izgara" style="margin-top:16px">' + db.dokumanlar.map(function (d) { return '<div class="kart satir" style="justify-content:space-between"><div><span class="etiket altin">' + esc(d.kategori) + '</span><h3 style="font-size:16px;margin-top:6px">' + esc(d.baslik) + '</h3></div><button class="btn kucuk hayalet" data-dok-sil="' + d.id + '">Sil</button></div>'; }).join("") + "</div>";
  };
  Y.canli = function () {
    return '<form class="kart form" id="f-canli"><div class="mono">Canlı eğitim planla</div><label>Başlık<input type="text" name="b" required></label><label>Açıklama<input type="text" name="a"></label><div class="izgara i2"><label>Tarih ve saat<input type="datetime-local" name="z" required></label><label>Süre (dk)<input type="number" name="s" value="90" min="15" required></label></div><label>Yayın bağlantısı <span class="s">(YouTube liste dışı canlı yayın; yayın günü de eklenebilir)</span><input type="url" name="y" placeholder="https://youtube.com/live/…"></label><button class="btn ana">Planla</button><p class="s" style="font-size:13px">Planlanan yayın üyelere geri sayımla görünür; saati gelince "Oturuma katıl" düğmesi açılır. Kendi sunucunuz kurulunca görüntülü oda (ekran paylaşımı, söz alma) aynı düğmeye bağlanır.</p></form>' +
      '<div class="tablo-kap" style="margin-top:16px"><table><thead><tr><th>Yayın</th><th>Zaman</th><th>Süre</th><th>Bağlantı</th><th></th></tr></thead><tbody>' + db.canlilar.slice().sort(function (a, b) { return a.zaman - b.zaman; }).map(function (c) { return "<tr><td>" + esc(c.baslik) + '</td><td class="s">' + tarih(c.zaman, true) + "</td><td>" + c.sure + " dk</td><td>" + (yt(c.yayin) ? '<span class="iyi">✓</span>' : '<button class="btn kucuk hayalet" data-canli-link="' + c.id + '">Bağlantı ekle</button>') + '</td><td><button class="btn kucuk hayalet" data-canli-sil="' + c.id + '">Sil</button></td></tr>'; }).join("") + "</tbody></table></div>";
  };
  Y.sorular = function () {
    return '<div class="izgara i3" style="margin-bottom:16px">' + V.splDuzeyler.map(function (d) { return '<div class="kart"><div class="mono">' + d.ad + '</div><div class="sayi-buyuk" style="margin-top:6px">' + (db.soruSayisi[d.kod] || 0) + '</div><p class="s" style="font-size:12px">' + esc(soruEtiket(d.kod) || "henüz soru yok") + "</p></div>"; }).join("") + "</div>" +
      '<form class="kart form" id="f-soru"><div class="mono">Soru ekle</div><div class="izgara i2"><label>Düzey<select name="d">' + V.splDuzeyler.map(function (d) { return '<option value="' + d.kod + '">' + d.ad + "</option>"; }).join("") + '</select></label><label>Konu<input type="text" name="k" placeholder="ör. Mevzuat" required></label></div><label>Soru<textarea name="s" required style="min-height:80px"></textarea></label><div class="izgara i2"><label>Doğru cevap<input type="text" name="c0" required></label><label>Yanlış şık 1<input type="text" name="c1" required></label><label>Yanlış şık 2<input type="text" name="c2" required></label><label>Yanlış şık 3<input type="text" name="c3" required></label></div><label>Açıklama (cevaptan sonra gösterilir)<input type="text" name="a"></label><button class="btn ana">Soruyu ekle</button><p class="s" style="font-size:13px">Şıklar her sınavda otomatik karışır. Canlı sürümde ders notlarınızı (PDF/Word) yükleyip yapay zekâya özgün soru taslağı ürettirebilir, onayladıklarınızı bankaya alabilirsiniz.</p></form>' +
      '<form class="kart form" id="f-terim" style="margin-top:16px"><div class="mono">Kavram ekle (soru robotu)</div><p class="s" style="font-size:13px">Eski sitenizdeki gibi: her kavram için sistem iki soru tipi üretir (tanımdan kavram, kavramdan tanım), diğer kavramlardan 4 çeldirici seçer. Bir lisansta en az 5 kavram olunca deneme sınavı 25 soruyla yapılır.</p><div class="izgara i2"><label>Lisans<select name="d">' + V.splDuzeyler.map(function (d) { return '<option value="' + d.kod + '">' + esc(d.ad) + "</option>"; }).join("") + '</select></label><label>Ders / konu<input type="text" name="ders" placeholder="ör. Sermaye Piyasası Mevzuatı"></label></div><label>Kavram<input type="text" name="t" required></label><label>Tanım<textarea name="ta" required style="min-height:70px"></textarea></label><button class="btn mavi">Kavramı ekle</button></form>';
  };
  Y.pazarlama = function () {
    var uy = db.uyeler.filter(function (u) { return !yonetici(u) && !(u.paketler || []).length; });
    return '<div class="uyari" style="margin-bottom:14px">Ücretsiz üye olup paket almayanlar. E-posta izni verenler kampanya listesine alınır (KVKK). Listeyi ilgi alanına göre süzüp CSV olarak indirebilirsiniz.</div><div class="satir" style="margin-bottom:14px"><select id="paz-alan" style="max-width:260px"><option value="">Tüm ilgi alanları</option>' + V.ilgiAlanlari.map(function (a) { return "<option>" + a + "</option>"; }).join("") + '</select><button class="btn mavi kucuk" id="paz-indir">⬇ CSV indir</button></div><div class="tablo-kap"><table><thead><tr><th>Üye</th><th>E-posta</th><th>Seviye</th><th>İlgi alanları</th><th>Kayıt</th><th>E-posta izni</th></tr></thead><tbody>' + uy.map(function (u) { return "<tr><td>" + esc(adSoyad(u)) + "</td><td>" + esc(u.email) + "</td><td>" + esc(u.seviye) + "</td><td>" + esc((u.alanlar || []).join(", ")) + '</td><td class="s">' + once(u.kayit) + "</td><td>" + (u.epostaIzni ? '<span class="iyi">✓</span>' : '<span class="k">✗</span>') + "</td></tr>"; }).join("") + "</tbody></table></div>";
  };
  Y.ayarlar = function () { return '<form class="kart form" id="f-hak"><label>Hakkımızda metni<textarea name="m" style="min-height:240px">' + esc(db.hakkimizda) + '</textarea></label><button class="btn ana">Kaydet</button></form>'; };
  Y.duyurular = function () {
    return '<form class="kart form" id="f-duyuru"><div class="mono">Duyuru yayınla</div><label>Başlık<input type="text" name="b" required maxlength="120"></label><label>Metin<textarea name="m"></textarea></label><button class="btn ana">Yayınla</button><p class="s" style="font-size:13px">Son 3 duyuru üyelerin Panelim sayfasında en üstte görünür.</p></form>' +
      '<div class="izgara" style="margin-top:16px">' + (db.duyurular.length ? db.duyurular.map(function (d) { return '<div class="kart satir" style="justify-content:space-between"><div><span class="s" style="font-size:13px">' + tarih(d.zaman, true) + '</span><h3 style="font-size:16px;margin-top:4px">' + esc(d.baslik) + '</h3></div><button class="btn kucuk hayalet" data-duyuru-sil="' + d.id + '">Sil</button></div>'; }).join("") : '<div class="kart bos-durum">Henüz duyuru yok.</div>') + "</div>";
  };
  S.yonetim.bagla = function () {
    var onay = function (m) { return confirm(m); };
    $$("[data-eris]").forEach(function (c) { c.addEventListener("change", function () { var p = c.dataset.eris.split(":"), u = uye(p[0]), e = Object.assign({}, u.erisim); e[p[1]] = c.checked; c.disabled = true; yaz(sb.from("uyeler").update({ erisim: e }).eq("id", p[0]), ALANLAR[p[1]] + (c.checked ? " açıldı" : " kapatıldı")); }); });
    $$("[data-odeme]").forEach(function (b) { b.addEventListener("click", function () { var p = b.dataset.odeme.split(":"); b.disabled = true;
      // onay: ödeme durumu + üyenin paket/erişimi (yalnız yönetici RLS ile yazabilir)
      var o = db.odemeler.filter(function (z) { return String(z.id) === p[0]; })[0], ok = p[1] === "onay";
      yaz(sb.from("odemeler").update({ durum: ok ? "onaylandi" : "reddedildi" }).eq("id", +p[0]).eq("durum", "bekliyor").select().then(function (r) {
        if (r.error || !ok) return r; if (!r.data.length) return { error: { message: "ödeme zaten işlenmiş" } };
        var u = uye(o.uye), pk = V.paketler.filter(function (z) { return z.kod === o.paket; })[0], e = Object.assign({}, u.erisim || {}); pk.erisim.forEach(function (a) { e[a] = true; });
        return sb.from("uyeler").update({ paketler: (u.paketler || []).indexOf(o.paket) > -1 ? u.paketler : (u.paketler || []).concat([o.paket]), erisim: e }).eq("id", o.uye);
      }), ok ? "Ödeme onaylandı, erişim açıldı" : "Reddedildi"); }); });
    var fd = $("#f-ders"); if (fd) {
      fd.addEventListener("submit", function (e) {
        e.preventDefault(); var el = e.target.elements, did = fd.dataset.duz || id("d");
        var satir = { id: did, program: el.p.value, sira: +el.s.value, baslik: el.b.value.trim(), demo: el.demo.checked };
        yaz(sb.from("dersler").upsert(satir).then(function (r) { return r.error ? r : sb.from("ders_videolari").upsert({ ders_id: did, video: el.v.value.trim() }); }), "Ders kaydedildi");
      });
      $$("[data-ders-duz]").forEach(function (b) { b.addEventListener("click", function () { var d = db.dersler.filter(function (x) { return x.id === b.dataset.dersDuz; })[0], el = fd.elements; el.p.value = d.program; el.s.value = d.sira; el.b.value = d.baslik; el.v.value = d.video || ""; el.demo.checked = !!d.demo; fd.dataset.duz = d.id; fd.scrollIntoView({ behavior: "smooth" }); }); });
      $$("[data-ders-sil]").forEach(function (b) { b.addEventListener("click", function () { if (onay("Ders silinsin mi?")) yaz(sb.from("dersler").delete().eq("id", b.dataset.dersSil), "Ders silindi"); }); });
    }
    var fk = $("#f-dok"); if (fk) {
      fk.addEventListener("submit", function (e) {
        e.preventDefault(); var el = e.target.elements, dosya = el.f.files[0], did = id("dk"), bag = el.u.value.trim();
        if (!dosya && !bag) return tost("PDF dosyası ya da bağlantı ekleyin");
        if (dosya && dosya.size > 50 * 1048576) return tost("Dosya 50 MB'tan büyük: bağlantı olarak ekleyin");
        $("button.ana", fk).disabled = true; tost(dosya ? "Yükleniyor…" : "Kaydediliyor…");
        var yol = did + ".pdf";
        var yukleme = dosya ? sb.storage.from("rit-dokuman").upload(yol, dosya, { contentType: "application/pdf" }) : Promise.resolve({});
        yaz(yukleme.then(function (r) { if (r.error) return r; return sb.from("dokumanlar").insert({ id: did, kategori: el.k.value, tarih: el.t.value, baslik: el.b.value.trim(), demo: el.demo.checked }); })
          .then(function (r) { if (r.error) return r; return sb.from("dokuman_dosyalari").insert(dosya ? { dokuman_id: did, yol: yol } : { dokuman_id: did, url: bag }); }), "Doküman yüklendi");
      });
      $$("[data-dok-sil]").forEach(function (b) { b.addEventListener("click", function () { if (!onay("Doküman silinsin mi?")) return; var d = db.dokumanlar.filter(function (x) { return x.id === b.dataset.dokSil; })[0]; yaz(sb.from("dokumanlar").delete().eq("id", d.id).then(function (r) { if (r.error || !d.yol) return r; return sb.storage.from("rit-dokuman").remove([d.yol]); }), "Doküman silindi"); }); });
    }
    var fc = $("#f-canli"); if (fc) {
      fc.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements, cid = id("c"); yaz(sb.from("canlilar").insert({ id: cid, baslik: el.b.value.trim(), aciklama: el.a.value.trim(), zaman: new Date(el.z.value).toISOString(), sure: +el.s.value }).then(function (r) { return r.error ? r : sb.from("canli_baglantilari").insert({ canli_id: cid, yayin: el.y.value.trim() }); }), "Yayın planlandı"); });
      $$("[data-canli-sil]").forEach(function (b) { b.addEventListener("click", function () { if (onay("Yayın silinsin mi?")) yaz(sb.from("canlilar").delete().eq("id", b.dataset.canliSil), "Yayın silindi"); }); });
      $$("[data-canli-link]").forEach(function (b) { b.addEventListener("click", function () { modal('<h3>Yayın bağlantısı</h3><form class="form" style="margin-top:12px"><label>YouTube canlı yayın bağlantısı<input type="url" name="y" required></label><button class="btn mavi">Kaydet</button></form>', function (m) { $("form", m).addEventListener("submit", function (e) { e.preventDefault(); yaz(sb.from("canli_baglantilari").upsert({ canli_id: b.dataset.canliLink, yayin: e.target.elements.y.value.trim() }), "Bağlantı kaydedildi", function () { m.remove(); ciz(); }); }); }); }); });
    }
    var fs = $("#f-soru"); if (fs) fs.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements; yaz(sb.from("sorular").insert({ duzey: el.d.value, konu: el.k.value.trim(), soru: el.s.value.trim(), siklar: [el.c0.value.trim(), el.c1.value.trim(), el.c2.value.trim(), el.c3.value.trim()], aciklama: el.a.value.trim() || "Doğru cevap: " + el.c0.value.trim() }), "Soru bankaya eklendi"); });
    var ft = $("#f-terim"); if (ft) ft.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements; yaz(sb.from("spl_terimler").insert({ duzey: el.d.value, ders: el.ders.value.trim(), terim: el.t.value.trim(), tanim: el.ta.value.trim() }), "Kavram eklendi"); });
    var pi = $("#paz-indir"); if (pi) pi.addEventListener("click", function () { var a = $("#paz-alan").value, l = db.uyeler.filter(function (u) { return !yonetici(u) && !(u.paketler || []).length && u.epostaIzni && (!a || (u.alanlar || []).indexOf(a) > -1); }); var csv = "﻿Ad;Soyad;E-posta;Telefon;Seviye;İlgi alanları;Kayıt\n" + l.map(function (u) { return [u.ad, u.soyad, u.email, u.tel, u.seviye, (u.alanlar || []).join(", "), new Date(u.kayit).toLocaleDateString("tr-TR")].map(function (x) { return '"' + String(x || "").replace(/"/g, '""') + '"'; }).join(";"); }).join("\n"); var x = document.createElement("a"); x.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); x.download = "pazarlama-listesi.csv"; x.click(); tost(l.length + " kişi indirildi"); });
    var fh = $("#f-hak"); if (fh) fh.addEventListener("submit", function (e) { e.preventDefault(); yaz(sb.from("ayarlar").upsert({ anahtar: "hakkimizda", deger: e.target.elements.m.value }), "Kaydedildi"); });
    var fdu = $("#f-duyuru"); if (fdu) fdu.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements; yaz(sb.from("duyurular").insert({ baslik: el.b.value.trim(), metin: el.m.value.trim() }), "Duyuru yayınlandı"); });
    $$("[data-duyuru-sil]").forEach(function (b) { b.addEventListener("click", function () { if (onay("Duyuru silinsin mi?")) yaz(sb.from("duyurular").delete().eq("id", +b.dataset.duyuruSil), "Duyuru silindi"); }); });
  };

  S.yok = function () { return '<div class="kart bos-durum"><h3>Sayfa bulunamadı</h3><a class="m" href="#/panel">Panele dön</a></div>'; };

  /* ---------- yönlendirici ---------- */
  var GIRIS_GEREK = ["panel", "egitimler", "ders", "spl", "dokumanlar", "canli", "forum", "profil", "yonetim"];
  function ciz() {
    clearInterval(sayacTik); if (sinavDurum && sinavDurum._t && !/^#\/spl\/\w+\/\w+/.test(location.hash)) clearInterval(sinavDurum._t);
    if (!db.yuklendi) { $("#sayfa").innerHTML = '<div class="kart bos-durum" style="max-width:520px;margin:30px auto;text-align:center">Yükleniyor…</div>'; return; }
    if (/access_token=|error_description=/.test(location.hash)) { if (/error_description=/.test(location.hash)) tost("Giriş bağlantısının süresi dolmuş ya da kullanılmış: yeniden isteyin"); history.replaceState(null, "", location.pathname + (ben() ? (yonetici(ben()) ? "#/yonetim" : "#/panel") : "#/giris")); }
    var p = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean), sayfa = p[0] || (ben() ? "panel" : "vitrin"), prm = p.slice(1);
    if (!S[sayfa]) sayfa = "yok";
    if (GIRIS_GEREK.indexOf(sayfa) > -1 && !ben()) { kabuk(); $("#sayfa").innerHTML = '<div style="max-width:520px;margin:30px auto;text-align:center" class="kart"><div style="font-size:34px">🔐</div><h2 class="bas" style="margin:10px 0">Önce giriş</h2><p class="s">Bu bölüm üyelere açık. Üyelik ücretsiz; demo içerikler hemen açılır.</p><div class="satir" style="justify-content:center;margin-top:18px"><a class="btn ana" href="#/kayit">Ücretsiz üye ol</a><a class="btn" href="#/giris">Giriş yap</a></div></div>'; return; }
    if (sayfa === "yonetim" && !yonetici(ben())) sayfa = "yok";
    kabuk(); $("#sayfa").innerHTML = S[sayfa](prm); if (S[sayfa].bagla) S[sayfa].bagla(prm); window.scrollTo(0, 0);
  }
  // açılış: oturum (sihirli bağlantı dönüşü dahil) çözülür, veri yüklenir, sonra çizilir
  var oncekiKul;
  sb.auth.onAuthStateChange(function (olay, s) { var k = s ? s.user.id : null; if (k === oncekiKul) return; oncekiKul = k; if (db.yuklendi && db.oturum === k && !yukleSoz) return; setTimeout(function () { yukle().then(ciz).catch(function (e) { tost("Bağlantı hatası: " + (e.message || e)); db.yuklendi = true; ciz(); }); }, 0); });
  window.addEventListener("hashchange", ciz); ciz();
})();
