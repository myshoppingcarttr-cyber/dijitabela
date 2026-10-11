/* RunInvestingTR Akademi · üye platformu (11 Eki 2026). 1903'ün düzenleme notuna göre:
   - Önce ücretsiz üyelik (demo içerik), sonra platform içinden paket satın alma.
   - 3 ayrı erişim: Tam Paket (canlı + forum + arşiv + doküman + SPL), Arşiv Paketi (video arşivi + doküman), SPL Soru Bankası (yalnız SPL).
   - Yönetici paneli: üye onayı, üye bazında erişim kutucukları, ders videosu (YouTube liste dışı bağlantı), PDF doküman, canlı eğitim planlama, SPL soru ekleme, pazarlama listesi.
   - Forum: kategori + alt başlık açma, paylaşım/yorum/beğeni puanı, rütbe; TradingView grafik.
   Bu prototipte veri tarayıcıda (localStorage) tutulur; canlı sürümde aynı yapı sunucu veritabanına taşınır. */
(function () {
  "use strict";
  var V = window.RIT_VERI, ANAHTAR = "rit-platform-v1";
  var $ = function (s, k) { return (k || document).querySelector(s); }, $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  var esc = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var id = function (p) { return (p || "x") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };
  var simdi = function () { return Date.now(); };
  var ALANLAR = { arsiv: "Video arşivi", dokuman: "Dokümanlar", canli: "Canlı eğitim", forum: "Forum", spl: "SPL soru bankası" };

  /* ---------- veri ---------- */
  function tohum() {
    var t = simdi(), gun = 864e5, saat = 36e5;
    var hoca = { id: "hoca", ad: "Hoca", soyad: "(Yönetici)", email: "yonetici@runinvestingtr.com", rol: "yonetici", kayit: t - 40 * gun, erisim: { arsiv: true, dokuman: true, canli: true, forum: true, spl: true }, paketler: ["tam"], alanlar: [], seviye: "İleri" };
    var u = function (o) { return Object.assign({ rol: "uye", kayit: t - 10 * gun, erisim: { arsiv: false, dokuman: false, canli: false, forum: false, spl: false }, paketler: [], alanlar: [], seviye: "Başlangıç", epostaIzni: true, tel: "", telegram: "" }, o); };
    var uyeler = [hoca,
      u({ id: "u1", ad: "Mert", soyad: "Kaya", email: "mert@ornek.com", seviye: "Orta", alanlar: ["Borsa İstanbul", "Altın"], paketler: ["tam"], erisim: { arsiv: true, dokuman: true, canli: true, forum: true, spl: true }, kayit: t - 21 * gun }),
      u({ id: "u2", ad: "Ayşe", soyad: "Yılmaz", email: "ayse@ornek.com", seviye: "Başlangıç", alanlar: ["Makro Ekonomi"], paketler: ["spl"], erisim: { arsiv: false, dokuman: false, canli: false, forum: false, spl: true }, kayit: t - 9 * gun }),
      u({ id: "u3", ad: "Can", soyad: "Demir", email: "can@ornek.com", seviye: "Başlangıç", alanlar: ["Kripto", "Forex"], kayit: t - 3 * gun }),
      u({ id: "u4", ad: "Selin", soyad: "Arslan", email: "selin@ornek.com", seviye: "Orta", alanlar: ["ABD Borsaları", "Borsa İstanbul"], paketler: ["tam"], erisim: { arsiv: true, dokuman: true, canli: true, forum: true, spl: true }, kayit: t - 15 * gun }),
      u({ id: "u5", ad: "Burak", soyad: "Şahin", email: "burak@ornek.com", seviye: "İleri", alanlar: ["Forex", "Altın"], kayit: t - 1 * gun, epostaIzni: false })
    ];
    var gelecekSali = (function () { var d = new Date(); d.setHours(21, 0, 0, 0); var g = (2 - d.getDay() + 7) % 7 || 7; d.setDate(d.getDate() + g); return d.getTime(); })();
    return {
      surum: V.surum, oturum: null, uyeler: uyeler,
      dersler: JSON.parse(JSON.stringify(V.dersler)), dokumanlar: JSON.parse(JSON.stringify(V.dokumanlar)), sorular: JSON.parse(JSON.stringify(V.sorular)),
      hakkimizda: "RunInvestingTR Akademi; finansal piyasaları ezberle değil, mantığıyla öğretmek için kuruldu. Programlarımız yatırımın temel kavramlarından yatırımcı psikolojisine, finansal okuryazarlıktan teknik analize kadar uzanır. Haftalık canlı eğitimler, analizler ve SPL hazırlık sistemiyle bilginin değere, disiplinin başarıya dönüştüğü bir topluluk kuruyoruz.\n\n(Eğitmen biyografisi yönetim panelinden düzenlenir.)",
      canlilar: [
        { id: "c1", baslik: "Haftalık Piyasa Değerlendirmesi", aciklama: "BIST, altın ve global piyasalarda haftanın özeti; soru-cevap.", zaman: t - 15 * 60e3, sure: 90, yayin: "" },
        { id: "c2", baslik: "Teknik Analiz Atölyesi: Trend ve Formasyonlar", aciklama: "Canlı grafik üzerinde trend çizimi ve formasyon okuma.", zaman: gelecekSali, sure: 90, yayin: "" },
        { id: "c3", baslik: "Yatırımcı Psikolojisi: Kriz Anında Disiplin", aciklama: "Tera ve Pusula örneği üzerinden risk yönetimi.", zaman: gelecekSali + 7 * gun, sure: 75, yayin: "" }
      ],
      sohbet: { c1: [{ yazar: "u1", metin: "Hocam altında 2.400 direnci için ne düşünüyorsunuz?", zaman: t - 8 * 60e3 }, { yazar: "hoca", metin: "Birazdan grafikte birlikte bakacağız 👍", zaman: t - 7 * 60e3 }] },
      forum: {
        kategoriler: JSON.parse(JSON.stringify(V.forumKategorileri)),
        altlar: [{ id: "a1", kat: "fx", ad: "EUR/USD", acan: "u1" }, { id: "a2", kat: "fx", ad: "USD/TRY", acan: "u4" }, { id: "a3", kat: "fx", ad: "Parite stratejileri", acan: "u1" }, { id: "a4", kat: "fx", ad: "Merkez bankası kararları", acan: "u4" }],
        konular: [
          { id: "k1", kat: "borsa", alt: null, baslik: "BIST100'de 10.000 seviyesi kalıcı olur mu?", metin: "Son iki haftadır endeks 10.000 civarında sıkıştı. Hacim düşük. Sizce kırılım hangi yöne olur? Ben bankacılık endeksine bakıyorum.", grafik: "", yazar: "u1", zaman: t - 2 * gun, begeni: ["u4", "hoca"] },
          { id: "k2", kat: "altin", alt: null, baslik: "Ons altında haftalık görünüm", metin: "Fed sonrası ons altın yeni zirve denemesi yaptı. Ben kademeli alım planlıyorum, stop seviyelerinizi paylaşır mısınız?", grafik: "OANDA:XAUUSD", yazar: "u4", zaman: t - 1 * gun, begeni: ["u1"] },
          { id: "k3", kat: "egitim", alt: null, baslik: "B programı 4. ders: pozisyon büyüklüğü sorusu", metin: "Risk laboratuvarında %2 kuralını denedim. Stop mesafesi büyüyünce lot küçülüyor, bunu her işlemde mi hesaplamalıyız?", grafik: "", yazar: "u1", zaman: t - 5 * saat, begeni: [] },
          { id: "k4", kat: "fx", alt: "a1", baslik: "EUR/USD 1,10 direnci", metin: "ECB tutanakları sonrası parite 1,10'u test ediyor. Kısa vadede geri çekilme bekliyorum.", grafik: "FX:EURUSD", yazar: "u4", zaman: t - 30 * saat, begeni: ["u1", "hoca"] },
          { id: "k5", kat: "genel", alt: null, baslik: "Kendinizi tanıtın 👋", metin: "Akademiye yeni katılanlar burada kendini tanıtabilir. Hangi piyasalarla ilgileniyorsunuz?", grafik: "", yazar: "hoca", zaman: t - 12 * gun, begeni: ["u1", "u4"] }
        ],
        yorumlar: [
          { id: "y1", konu: "k1", yazar: "u4", metin: "Hacim gelmeden kırılıma güvenmem. Bankacılık 9.500 desteğini koruyorsa yukarı ihtimal daha yüksek.", zaman: t - 40 * saat, begeni: ["u1"] },
          { id: "y2", konu: "k1", yazar: "hoca", metin: "Güzel tespit. Canlı yayında hacim profiline birlikte bakalım.", zaman: t - 38 * saat, begeni: ["u1", "u4"] },
          { id: "y3", konu: "k3", yazar: "hoca", metin: "Evet, her işlemde: risk tutarı / stop mesafesi = adet. Laboratuvar bunu sizin yerinize hesaplıyor.", zaman: t - 4 * saat, begeni: ["u1"] },
          { id: "y4", konu: "k5", yazar: "u1", metin: "Merhaba, ben Mert. BIST ve altınla ilgileniyorum.", zaman: t - 11 * gun, begeni: ["hoca"] }
        ]
      },
      sinavlar: [
        { uye: "u2", duzey: "spl1", mod: "alistirma", dogru: 7, toplam: 10, zaman: t - 2 * gun, konular: { Mevzuat: [3, 4], Ekonomi: [2, 3], "Temel Finans": [2, 3] } },
        { uye: "u2", duzey: "spl1", mod: "deneme", dogru: 10, toplam: 14, zaman: t - 1 * gun, konular: { Mevzuat: [5, 6], Ekonomi: [2, 3], "Temel Finans": [2, 3], Muhasebe: [1, 2] } }
      ],
      tamamlanan: { u1: ["A1", "A2", "B1"] }, izlenen: {},
      odemeler: [{ id: "o1", uye: "u3", paket: "arsiv", yontem: "Havale/EFT", zaman: t - 3 * saat, durum: "bekliyor" }],
      demoHak: {}
    };
  }
  var db;
  function yukle() { try { db = JSON.parse(localStorage.getItem(ANAHTAR)); } catch (e) { db = null; } if (!db || db.surum !== V.surum) { db = tohum(); kaydet(); } }
  function kaydet() { try { localStorage.setItem(ANAHTAR, JSON.stringify(db)); } catch (e) { tost("Tarayıcı belleği dolu: büyük PDF yerine bağlantı kullanın."); } }
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
    $("#demo-serit").innerHTML = "Tanıtım sürümü · rol değiştirerek deneyin:" +
      '<button data-demo="hoca">Yönetici (Hoca)</button>·<button data-demo="u1">Tam paket üyesi</button>·<button data-demo="u2">Yalnız SPL alan üye</button>·<button data-demo="u3">Ücretsiz üye</button>·<button data-demo="cikis">Ziyaretçi</button>';
  }
  document.addEventListener("click", function (e) {
    var d = e.target.closest("[data-demo]"); if (d) { db.oturum = d.dataset.demo === "cikis" ? null : d.dataset.demo; kaydet(); tost(db.oturum ? adSoyad(ben()) + " olarak girdiniz" : "Çıkış yapıldı"); git(db.oturum ? (db.oturum === "hoca" ? "#/yonetim" : "#/panel") : "#/"); ciz(); }
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
      if (db.uyeler.some(function (u) { return u.email.toLowerCase() === v("email").toLowerCase(); })) return tost("Bu e-posta ile kayıtlı üye var");
      var u = { id: id("u"), ad: v("ad"), soyad: v("soyad"), email: v("email"), tel: v("tel"), telegram: v("telegram"), seviye: v("seviye"), alanlar: $$("input[name=alan]:checked", f).map(function (x) { return x.value; }), epostaIzni: f.elements.izin.checked, rol: "uye", kayit: simdi(), paketler: [], erisim: { arsiv: false, dokuman: false, canli: false, forum: false, spl: false } };
      db.uyeler.push(u); db.oturum = u.id; kaydet(); tost("Hoş geldiniz " + u.ad + "! Demo içerikleriniz açıldı."); git("#/panel");
    });
  };

  S.giris = function () {
    return '<div style="max-width:440px;margin:30px auto"><div class="mono">Üye girişi</div><h1 class="bas" style="margin:10px 0 22px">Giriş</h1><form class="kart form" id="f-giris"><label>E-posta<input type="email" name="email" required></label><label>Şifre<input type="password" name="sifre" required></label><button class="btn ana">Giriş yap</button><p class="s" style="font-size:13px">Hesabınız yok mu? <a class="m" href="#/kayit">Ücretsiz üye olun</a></p></form><div class="uyari" style="margin-top:14px">Tanıtım sürümünde şifre denetimi yoktur; üstteki şeritten rol seçerek de girebilirsiniz.</div></div>';
  };
  S.giris.bagla = function () {
    $("#f-giris").addEventListener("submit", function (e) { e.preventDefault(); var m = e.target.elements.email.value.trim().toLowerCase(), u = db.uyeler.filter(function (x) { return x.email.toLowerCase() === m; })[0]; if (!u) return tost("Bu e-posta ile üye bulunamadı"); db.oturum = u.id; kaydet(); git(yonetici(u) ? "#/yonetim" : "#/panel"); });
  };

  S.panel = function () {
    var u = ben(), r = rutbe(u.id), sinav = db.sinavlar.filter(function (s) { return s.uye === u.id; });
    var ort = sinav.length ? Math.round(sinav.reduce(function (a, s) { return a + s.dogru / s.toplam; }, 0) / sinav.length * 100) : null;
    var sonraki = db.canlilar.filter(function (c) { return c.zaman + c.sure * 60e3 > simdi(); }).sort(function (a, b) { return a.zaman - b.zaman; })[0];
    var biten = (db.tamamlanan[u.id] || []).length, top = db.dersler.length;
    var paketler = (u.paketler || []).map(function (k) { return V.paketler.filter(function (p) { return p.kod === k; })[0]; }).filter(Boolean);
    return '<div class="sayfa-bas"><div><div class="mono">Panelim</div><h1 class="bas" style="margin-top:8px">Merhaba, ' + esc(u.ad) + "</h1>" +
      '<p class="s">' + (paketler.length ? "Paketiniz: <b style='color:#fff'>" + paketler.map(function (p) { return p.ad; }).join(", ") + "</b>" : "Ücretsiz üyesiniz: demo içerikler açık. Tüm içerik için bir paket seçin.") + "</p></div>" + (paketler.length ? "" : '<a class="btn ana" href="#/paketler">Paket seç →</a>') + "</div>" +
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
          '<div class="form" style="margin-top:18px"><button class="btn ana" data-yol="kart">💳 Kartla öde (12 taksit)</button><button class="btn" data-yol="havale">🏦 Havale/EFT bildir</button><button class="btn hayalet kucuk" data-kapat>Vazgeç</button></div><p class="s" style="font-size:12px;margin-top:12px">Tanıtım sürümünde kart ödemesi simüle edilir; canlıda PayTR/iyzico sanal POS bağlanır. Havale bildirimi yönetici onayına düşer.</p>', function (m) {
          m.addEventListener("click", function (e) {
            var y = e.target.closest("[data-yol]"); if (!y) return;
            if (y.dataset.yol === "kart") { paketVer(u, p.kod); db.odemeler.push({ id: id("o"), uye: u.id, paket: p.kod, yontem: "Kart", zaman: simdi(), durum: "onaylandi" }); kaydet(); m.remove(); tost("Ödeme alındı · " + p.ad + " açıldı"); git("#/panel"); }
            else { db.odemeler.push({ id: id("o"), uye: u.id, paket: p.kod, yontem: "Havale/EFT", zaman: simdi(), durum: "bekliyor" }); kaydet(); m.remove(); tost("Bildiriminiz alındı; onaylanınca erişiminiz açılır"); ciz(); }
          });
        });
      });
    });
  };
  function paketVer(u, kod) { var p = V.paketler.filter(function (x) { return x.kod === kod; })[0]; if ((u.paketler || []).indexOf(kod) < 0) (u.paketler = u.paketler || []).push(kod); p.erisim.forEach(function (a) { u.erisim[a] = true; }); }

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
  S.ders.bagla = function (prm) { var b = $("#bitir"); if (b) b.addEventListener("click", function () { var u = ben(), t = db.tamamlanan[u.id] = db.tamamlanan[u.id] || []; var i = t.indexOf(prm[0]); if (i > -1) t.splice(i, 1); else t.push(prm[0]); kaydet(); ciz(); }); };

  /* SPL */
  var sinavDurum = null;
  S.spl = function (prm) {
    var u = ben();
    if (prm[0] && prm[1]) return splSinav(prm[0], prm[1]);
    var gecmis = db.sinavlar.filter(function (s) { return s.uye === u.id; }).sort(function (a, b) { return b.zaman - a.zaman; });
    var ort = gecmis.length ? Math.round(gecmis.reduce(function (a, s) { return a + s.dogru / s.toplam; }, 0) / gecmis.length * 100) : null;
    var konuTop = {}; gecmis.forEach(function (s) { Object.keys(s.konular || {}).forEach(function (k) { var t = konuTop[k] = konuTop[k] || [0, 0]; t[0] += s.konular[k][0]; t[1] += s.konular[k][1]; }); });
    return '<div class="sayfa-bas"><div><div class="mono">SPL &amp; sınav merkezi</div><h1 class="bas" style="margin-top:8px">Lisans sınavına<br><span class="k">çözerek hazırlan</span></h1><p class="s">Her sınavda sorular ve şıklar karışır. Alıştırma 10 soru, deneme 25 soru (gerçek sınav formatı). Yalnız SPL paketi alanlar yalnız bu bölüme erişir.</p></div>' + (erisir(u, "spl") ? '<span class="etiket yesil">Tam erişim</span>' : '<span class="etiket altin">Demo: düzey başına 1 alıştırma</span>') + "</div>" +
      '<div class="izgara i3">' + V.splDuzeyler.map(function (d) {
        if (d.yakinda && !db.sorular.some(function (s) { return s.d === d.kod; })) return '<div class="kart" style="opacity:.8"><span class="etiket mavi">Yakında</span><h3 style="font-size:20px;margin:10px 0 8px">' + d.ad + '</h3><p class="s" style="font-size:14px">Soru bankası hazırlanıyor. Açıldığında SPL paketine dahil olacak.</p></div>';
        var n = db.sorular.filter(function (s) { return s.d === d.kod; }).length, demoKullandi = (db.demoHak[u.id] || []).indexOf(d.kod) > -1, tam = erisir(u, "spl");
        return '<div class="kart"><div class="mono">' + n + ' soru</div><h3 style="font-size:20px;margin:8px 0 14px">' + d.ad + '</h3><div class="form">' +
          '<a class="btn kucuk mavi' + (!tam && demoKullandi ? '" style="pointer-events:none;opacity:.45' : "") + '" href="#/spl/' + d.kod + '/alistirma">' + (tam ? "Alıştırma · 10 soru" : demoKullandi ? "Demo kullanıldı" : "Ücretsiz dene · 5 soru") + "</a>" +
          '<a class="btn kucuk' + (tam ? "" : '" style="pointer-events:none;opacity:.45') + '" href="#/spl/' + d.kod + '/deneme">' + (tam ? "Deneme sınavı · 25 soru" : "🔒 Deneme sınavı") + "</a></div></div>";
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
      var havuz = db.sorular.filter(function (s) { return s.d === duzey; }), adet = !tam ? 5 : mod === "deneme" ? 25 : 10;
      sinavDurum = { duzey: duzey, mod: mod, i: 0, cevap: [], set: karistir(havuz).slice(0, adet).map(function (q) { return { s: q.s, k: q.k, a: q.a, dogru: q.c[0], c: karistir(q.c) }; }), istenen: adet, bas: simdi(), sure: mod === "deneme" ? adet * 90 : 0 };
      if (!tam) { (db.demoHak[u.id] = db.demoHak[u.id] || []).push(duzey); kaydet(); }
    }
    var S2 = sinavDurum, q = S2.set[S2.i];
    if (S2.bitti) return sinavSonuc();
    var ust = '<div class="satir" style="justify-content:space-between"><a class="m" href="#/spl" id="cik">← SPL</a><span class="mono">' + d.ad + " · " + (mod === "deneme" ? "Deneme" : "Alıştırma") + '</span>' + (S2.sure ? '<span class="sure" id="sure"></span>' : "") + "</div>" +
      (S2.set.length < S2.istenen ? '<div class="uyari sari" style="margin-top:12px">Bu düzeyin bankasında şu an ' + S2.set.length + " soru var; sınav " + S2.set.length + " soruyla yapılıyor. Hocamızın notları yüklendikçe " + S2.istenen + "'e tamamlanır.</div>" : "");
    return '<div class="sinav">' + ust + '<div class="cubuk" style="margin:18px 0"><i style="width:' + (S2.i / S2.set.length * 100) + '%"></i></div><div class="mono">Soru ' + (S2.i + 1) + " / " + S2.set.length + " · " + esc(q.k) + '</div><h2 style="font-size:22px;line-height:1.35;margin:10px 0 6px">' + esc(q.s) + "</h2>" +
      q.c.map(function (c, j) { return '<button class="sik" data-sik="' + j + '">' + "ABCD"[j] + ") " + esc(c) + "</button>"; }).join("") + '<div id="aciklama"></div></div>';
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
  function sinavKaydet() { var S2 = sinavDurum, k = {}; S2.cevap.forEach(function (c) { var t = k[c.k] = k[c.k] || [0, 0]; t[1]++; if (c.ok) t[0]++; }); db.sinavlar.push({ uye: db.oturum, duzey: S2.duzey, mod: S2.mod, dogru: S2.cevap.filter(function (c) { return c.ok; }).length, toplam: S2.set.length, zaman: simdi(), konular: k }); kaydet(); }
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
    $$("[data-pdf]").forEach(function (b) { b.addEventListener("click", function () { var d = db.dokumanlar.filter(function (x) { return x.id === b.dataset.pdf; })[0]; modal('<div class="satir" style="justify-content:space-between"><h3>' + esc(d.baslik) + '</h3><button class="btn kucuk hayalet" data-kapat>Kapat ✕</button></div><iframe src="' + esc(d.dosya) + '" style="width:100%;height:70vh;border:0;margin-top:12px;border-radius:10px;background:#fff" title="PDF"></iframe><a class="m" style="font-size:13px" href="' + esc(d.dosya) + '" target="_blank" rel="noopener">Yeni sekmede aç ↗</a>').querySelector(".kart").style.maxWidth = "1000px"; }); });
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
    var akisCiz = function () { var a = $("#akis"); if (!a) return; a.innerHTML = (db.sohbet[cid] || []).map(function (m) { var y = uye(m.yazar); return '<div><b style="font-size:13px' + (yonetici(y) ? ";color:var(--alt)" : "") + '">' + esc(y.ad) + (yonetici(y) ? " · Eğitmen" : "") + '</b> <span class="s" style="font-size:11px">' + once(m.zaman) + '</span><div style="font-size:14px">' + esc(m.metin) + "</div></div>"; }).join(""); a.scrollTop = a.scrollHeight; };
    akisCiz(); var f = $("#f-sohbet"); if (f) f.addEventListener("submit", function (e) { e.preventDefault(); (db.sohbet[cid] = db.sohbet[cid] || []).push({ yazar: db.oturum, metin: f.elements.m.value.trim(), zaman: simdi() }); kaydet(); f.reset(); akisCiz(); });
  }
  function tvIframe(sembol) { return '<iframe loading="lazy" title="TradingView grafik" src="https://s.tradingview.com/widgetembed/?symbol=' + encodeURIComponent(sembol) + '&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=13161d&theme=dark&style=1&timezone=Europe%2FIstanbul&withdateranges=1&locale=tr"></iframe>'; }

  /* forum */
  S.forum = function (prm) {
    var u = ben(), acik = erisir(u, "forum"), f = db.forum;
    if (prm[0] === "konu") return forumKonu(prm[1]);
    if (prm[0]) return forumKategori(prm[0], prm[1]);
    var lider = db.uyeler.map(function (x) { return { u: x, p: puan(x.id) }; }).filter(function (x) { return x.p > 0; }).sort(function (a, b) { return b.p - a.p; }).slice(0, 5);
    return '<div class="sayfa-bas"><div><div class="mono">Yatırımcı forumu</div><h1 class="bas" style="margin-top:8px">Forum</h1><p class="s">Bir kategori seçin, alt başlık açın, paylaşım yapın. Paylaşım ' + V.puan.paylasim + " · yorum " + V.puan.yorum + " · beğeni almak " + V.puan.begeniAl + " · beğeni vermek " + V.puan.begeniVer + ' puan.</p></div>' + (acik ? '<button class="btn mavi" id="yeni-kat">+ Yeni kategori aç</button>' : "") + "</div>" +
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
    var konular = f.konular.filter(function (x) { return x.kat === kid && (alt ? x.alt === alt.id : true); }).sort(function (a, b) { return b.zaman - a.zaman; });
    return '<a class="m" href="#/forum">← Forum</a>' + (alt ? ' <span class="s">/</span> <a class="m" href="#/forum/' + kid + '">' + esc(k.ad) + "</a>" : "") +
      '<div class="sayfa-bas" style="margin-top:12px"><div><h1 class="bas alt">' + esc(alt ? alt.ad : k.ad) + '</h1><p class="s">' + esc(alt ? k.ad + " altında açılmış başlık" : k.aciklama) + '</p></div><div class="satir">' + (acik && !alt ? '<button class="btn hayalet" id="yeni-alt">+ Alt başlık aç</button>' : "") + (acik ? '<button class="btn mavi" id="yeni-konu">+ Paylaşım yap</button>' : "") + "</div></div>" +
      (!alt && altlar.length ? '<div class="sekmeler">' + altlar.map(function (a) { var n = f.konular.filter(function (x) { return x.alt === a.id; }).length; return '<a class="sekme" href="#/forum/' + kid + "/" + a.id + '">' + esc(a.ad) + '<span class="rozet">' + n + "</span></a>"; }).join("") + "</div>" : "") +
      '<div id="konu-form"></div>' +
      (konular.length ? '<div class="izgara">' + konular.map(function (x) { var y = uye(x.yazar), n = f.yorumlar.filter(function (c) { return c.konu === x.id; }).length; return '<a class="kart konu-satir tik" href="#/forum/konu/' + x.id + '"><span class="avatar">' + bas(y) + '</span><div style="min-width:0"><h3 style="font-size:17px">' + esc(x.baslik) + '</h3><p class="s" style="font-size:13px">' + esc(adSoyad(y)) + " · " + once(x.zaman) + (x.grafik ? " · 📈 " + esc(x.grafik) : "") + '</p></div><div class="sag s" style="font-size:13px">💬 ' + n + "<br>❤ " + x.begeni.length + "</div></a>"; }).join("") + "</div>" : '<div class="kart bos-durum">Henüz paylaşım yok. İlk paylaşımı siz yapın.</div>');
  }
  function forumKonu(kid) {
    var u = ben(), acik = erisir(u, "forum"), f = db.forum, x = f.konular.filter(function (q) { return q.id === kid; })[0]; if (!x) return S.yok();
    var k = f.kategoriler.filter(function (q) { return q.id === x.kat; })[0] || { ad: "" }, yorumlar = f.yorumlar.filter(function (c) { return c.konu === kid; }).sort(function (a, b) { return a.zaman - b.zaman; });
    var gonderi = function (o, tur) { var y = uye(o.yazar), var_ = u && o.begeni.indexOf(u.id) > -1; return '<div class="kart gonderi"><div class="yazar"><span class="avatar" style="width:48px;height:48px;font-size:18px">' + bas(y) + '</span><div><b style="font-size:14px">' + esc(adSoyad(y)) + "</b><div>" + rozet(y.id) + '</div><div class="s" style="font-size:12px">' + puan(y.id) + ' puan</div></div></div><div class="metin"><div class="s" style="font-size:12px;margin-bottom:8px">' + tarih(o.zaman, true) + "</div>" + esc(o.metin) + (o.grafik ? '<div class="tv">' + tvIframe(o.grafik) + "</div>" : "") + '<div style="margin-top:14px"><button class="begeni' + (var_ ? " var" : "") + '" data-begen="' + tur + ":" + o.id + '"' + (acik && o.yazar !== (u && u.id) ? "" : " disabled") + ">❤ " + o.begeni.length + "</button></div></div></div>"; };
    return '<a class="m" href="#/forum/' + x.kat + '">← ' + esc(k.ad) + '</a><h1 class="bas" style="font-size:clamp(28px,3.6vw,44px);margin:12px 0 20px">' + esc(x.baslik) + '</h1><div class="izgara">' + gonderi(x, "k") + yorumlar.map(function (c) { return gonderi(c, "y"); }).join("") + "</div>" +
      (acik ? '<form class="kart form" id="f-yorum" style="margin-top:16px"><label>Yorumunuz <span class="s">(+' + V.puan.yorum + ' puan)</span><textarea name="m" required></textarea></label><button class="btn ana">Yorum yap</button></form>' : '<div class="uyari sari" style="margin-top:16px">Yorum ve beğeni Tam Paket üyelerine açıktır.</div>');
  }
  S.forum.bagla = function (prm) {
    var u = ben(), f = db.forum;
    var yk = $("#yeni-kat"); if (yk) yk.addEventListener("click", function () { modal('<h3>Yeni kategori</h3><form class="form" style="margin-top:14px"><label>Kategori adı<input type="text" name="ad" required maxlength="40"></label><label>Açıklama<input type="text" name="ac" maxlength="90"></label><button class="btn mavi">Aç</button></form>', function (m) { $("form", m).addEventListener("submit", function (e) { e.preventDefault(); var ad = e.target.elements.ad.value.trim(); f.kategoriler.push({ id: id("kat"), ad: ad, aciklama: e.target.elements.ac.value.trim() || ad + " ile ilgili paylaşımlar" }); kaydet(); m.remove(); ciz(); tost("Kategori açıldı"); }); }); });
    var ya = $("#yeni-alt"); if (ya) ya.addEventListener("click", function () { modal('<h3>Alt başlık aç</h3><form class="form" style="margin-top:14px"><label>Başlık<input type="text" name="ad" required maxlength="50"></label><button class="btn mavi">Aç</button></form>', function (m) { $("form", m).addEventListener("submit", function (e) { e.preventDefault(); var a = { id: id("a"), kat: prm[0], ad: e.target.elements.ad.value.trim(), acan: u.id }; f.altlar.push(a); kaydet(); m.remove(); git("#/forum/" + prm[0] + "/" + a.id); }); }); });
    var yko = $("#yeni-konu"); if (yko) yko.addEventListener("click", function () {
      $("#konu-form").innerHTML = '<form class="kart form" id="f-konu" style="margin-bottom:16px"><label>Başlık<input type="text" name="b" required maxlength="120"></label><label>Paylaşımınız <span class="s">(+' + V.puan.paylasim + ' puan)</span><textarea name="m" required></textarea></label><label>Grafik ekle <span class="s">(isteğe bağlı, TradingView sembolü)</span><input type="text" name="g" placeholder="ör. OANDA:XAUUSD, FX:EURUSD, NASDAQ:AAPL, BINANCE:BTCUSDT"><span class="s" style="font-weight:500;font-size:12px">Not: Borsa İstanbul (BIST) verisi TradingView lisansı gereği gömülü grafikte gösterilmiyor; BIST için grafik görüntüsü ekleyin ya da yorumda belirtin.</span></label><div class="satir"><button class="btn ana">Paylaş</button><button type="button" class="btn hayalet" id="vazgec">Vazgeç</button></div></form>';
      $("#vazgec").addEventListener("click", function () { $("#konu-form").innerHTML = ""; });
      $("#f-konu").addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements, k = { id: id("k"), kat: prm[0], alt: prm[1] || null, baslik: el.b.value.trim(), metin: el.m.value.trim(), grafik: el.g.value.trim().toUpperCase(), yazar: u.id, zaman: simdi(), begeni: [] }; f.konular.push(k); kaydet(); tost("+" + V.puan.paylasim + " puan"); git("#/forum/konu/" + k.id); });
    });
    $$("[data-begen]").forEach(function (b) { b.addEventListener("click", function () { var p = b.dataset.begen.split(":"), o = (p[0] === "k" ? f.konular : f.yorumlar).filter(function (x) { return x.id === p[1]; })[0], i = o.begeni.indexOf(u.id); if (i > -1) o.begeni.splice(i, 1); else { o.begeni.push(u.id); tost("+" + V.puan.begeniVer + " puan · yazara +" + V.puan.begeniAl); } kaydet(); ciz(); }); });
    var fy = $("#f-yorum"); if (fy) fy.addEventListener("submit", function (e) { e.preventDefault(); f.yorumlar.push({ id: id("y"), konu: prm[1], yazar: u.id, metin: e.target.elements.m.value.trim(), zaman: simdi(), begeni: [] }); kaydet(); tost("+" + V.puan.yorum + " puan"); ciz(); });
  };

  S.hakkimizda = function () {
    return '<div class="izgara i2" style="align-items:center"><div><div class="mono">Hakkımızda</div><h1 class="bas" style="margin:10px 0 18px">Bilgi değere,<br><span class="k">disiplin başarıya.</span></h1><p style="white-space:pre-wrap;color:#c8ccd4">' + esc(db.hakkimizda) + '</p></div><div class="kart" style="padding:0;overflow:hidden"><img src="../img/sinif.jpg" alt="Akademi sınıfı" style="width:100%;height:340px;object-fit:cover"></div></div>' +
      '<div class="izgara i4" style="margin-top:34px">' + [["4", "eğitim programı"], ["SPL", "1-2-3. düzey + Türev"], ["Haftalık", "canlı eğitim"], ["5", "rütbeli forum seviyesi"]].map(function (x) { return '<div class="kart"><div class="sayi-buyuk">' + x[0] + '</div><p class="s">' + x[1] + "</p></div>"; }).join("") + "</div>" +
      '<div class="kart" style="margin-top:34px;text-align:center;padding:44px 22px;background:linear-gradient(135deg,rgba(229,50,45,.18),rgba(43,127,255,.12))"><h2 class="bas">Bize katılın</h2><p class="s" style="margin:10px auto 20px;max-width:520px">Ücretsiz üye olun, ilk dersleri izleyin, SPL denemesini çözün. Gerisine birlikte karar verelim.</p><a class="btn ana" href="#/kayit">Ücretsiz üye ol →</a></div>';
  };

  S.profil = function () {
    var u = ben(), r = rutbe(u.id);
    return '<div class="sayfa-bas"><div class="satir"><span class="avatar" style="width:64px;height:64px;font-size:26px">' + bas(u) + '</span><div><h1 class="bas" style="font-size:40px">' + esc(adSoyad(u)) + '</h1><div class="satir" style="gap:8px;margin-top:6px">' + rozet(u.id) + '<span class="s">' + r.puan + " puan</span></div></div></div><button class=\"btn hayalet\" id=\"cikis\">Çıkış yap</button></div>" +
      '<div class="izgara i2"><div class="kart"><div class="mono">Bilgilerim</div><p style="margin-top:10px">' + esc(u.email) + "<br>" + esc(u.tel || "") + '</p><p class="s" style="margin-top:8px">Seviye: ' + esc(u.seviye || "-") + "<br>İlgi: " + esc((u.alanlar || []).join(", ") || "-") + '</p></div><div class="kart"><div class="mono">Paketlerim</div>' + ((u.paketler || []).length ? u.paketler.map(function (k) { var p = V.paketler.filter(function (x) { return x.kod === k; })[0]; return '<p style="margin-top:10px"><span class="etiket yesil">' + esc(p ? p.ad : k) + "</span></p>"; }).join("") : '<p class="s" style="margin-top:10px">Ücretsiz üyelik</p><a class="btn kucuk ana" style="margin-top:12px" href="#/paketler">Paket seç</a>') + "</div></div>";
  };
  S.profil.bagla = function () { $("#cikis").addEventListener("click", function () { db.oturum = null; kaydet(); git("#/"); }); };

  /* yönetim */
  var YSEK = [["ozet", "Özet"], ["uyeler", "Üyeler & erişim"], ["odemeler", "Ödeme onayları"], ["dersler", "Dersler & video"], ["dokumanlar", "Dokümanlar"], ["canli", "Canlı yayın"], ["sorular", "SPL soruları"], ["pazarlama", "Pazarlama listesi"], ["ayarlar", "Hakkımızda"]];
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
    return '<form class="kart form" id="f-dok"><div class="mono">Doküman yükle</div><div class="izgara i2"><label>Kategori<select name="k">' + V.dokumanKategorileri.map(function (k) { return "<option>" + esc(k) + "</option>"; }).join("") + '</select></label><label>Tarih<input type="text" name="t" value="' + new Date().toISOString().slice(0, 10) + '"></label></div><label>Başlık<input type="text" name="b" required></label><label>PDF dosyası <span class="s">(tanıtım sürümünde en çok ~3 MB; büyük dosyaya bağlantı verin)</span><input type="file" name="f" accept="application/pdf"></label><label>ya da PDF bağlantısı<input type="url" name="u" placeholder="https://…/dosya.pdf"></label><label class="onay"><input type="checkbox" name="demo"> Ücretsiz üyeye açık (örnek)</label><button class="btn ana">Yükle</button></form>' +
      '<div class="izgara" style="margin-top:16px">' + db.dokumanlar.map(function (d) { return '<div class="kart satir" style="justify-content:space-between"><div><span class="etiket altin">' + esc(d.kategori) + '</span><h3 style="font-size:16px;margin-top:6px">' + esc(d.baslik) + '</h3></div><button class="btn kucuk hayalet" data-dok-sil="' + d.id + '">Sil</button></div>'; }).join("") + "</div>";
  };
  Y.canli = function () {
    return '<form class="kart form" id="f-canli"><div class="mono">Canlı eğitim planla</div><label>Başlık<input type="text" name="b" required></label><label>Açıklama<input type="text" name="a"></label><div class="izgara i2"><label>Tarih ve saat<input type="datetime-local" name="z" required></label><label>Süre (dk)<input type="number" name="s" value="90" min="15" required></label></div><label>Yayın bağlantısı <span class="s">(YouTube liste dışı canlı yayın; yayın günü de eklenebilir)</span><input type="url" name="y" placeholder="https://youtube.com/live/…"></label><button class="btn ana">Planla</button><p class="s" style="font-size:13px">Planlanan yayın üyelere geri sayımla görünür; saati gelince "Oturuma katıl" düğmesi açılır. Kendi sunucunuz kurulunca görüntülü oda (ekran paylaşımı, söz alma) aynı düğmeye bağlanır.</p></form>' +
      '<div class="tablo-kap" style="margin-top:16px"><table><thead><tr><th>Yayın</th><th>Zaman</th><th>Süre</th><th>Bağlantı</th><th></th></tr></thead><tbody>' + db.canlilar.slice().sort(function (a, b) { return a.zaman - b.zaman; }).map(function (c) { return "<tr><td>" + esc(c.baslik) + '</td><td class="s">' + tarih(c.zaman, true) + "</td><td>" + c.sure + " dk</td><td>" + (yt(c.yayin) ? '<span class="iyi">✓</span>' : '<button class="btn kucuk hayalet" data-canli-link="' + c.id + '">Bağlantı ekle</button>') + '</td><td><button class="btn kucuk hayalet" data-canli-sil="' + c.id + '">Sil</button></td></tr>'; }).join("") + "</tbody></table></div>";
  };
  Y.sorular = function () {
    return '<div class="izgara i3" style="margin-bottom:16px">' + V.splDuzeyler.map(function (d) { return '<div class="kart"><div class="mono">' + d.ad + '</div><div class="sayi-buyuk" style="margin-top:6px">' + db.sorular.filter(function (s) { return s.d === d.kod; }).length + "</div></div>"; }).join("") + "</div>" +
      '<form class="kart form" id="f-soru"><div class="mono">Soru ekle</div><div class="izgara i2"><label>Düzey<select name="d">' + V.splDuzeyler.map(function (d) { return '<option value="' + d.kod + '">' + d.ad + "</option>"; }).join("") + '</select></label><label>Konu<input type="text" name="k" placeholder="ör. Mevzuat" required></label></div><label>Soru<textarea name="s" required style="min-height:80px"></textarea></label><div class="izgara i2"><label>Doğru cevap<input type="text" name="c0" required></label><label>Yanlış şık 1<input type="text" name="c1" required></label><label>Yanlış şık 2<input type="text" name="c2" required></label><label>Yanlış şık 3<input type="text" name="c3" required></label></div><label>Açıklama (cevaptan sonra gösterilir)<input type="text" name="a"></label><button class="btn ana">Soruyu ekle</button><p class="s" style="font-size:13px">Şıklar her sınavda otomatik karışır. Canlı sürümde ders notlarınızı (PDF/Word) yükleyip yapay zekâya özgün soru taslağı ürettirebilir, onayladıklarınızı bankaya alabilirsiniz.</p></form>';
  };
  Y.pazarlama = function () {
    var uy = db.uyeler.filter(function (u) { return !yonetici(u) && !(u.paketler || []).length; });
    return '<div class="uyari" style="margin-bottom:14px">Ücretsiz üye olup paket almayanlar. E-posta izni verenler kampanya listesine alınır (KVKK). Listeyi ilgi alanına göre süzüp CSV olarak indirebilirsiniz.</div><div class="satir" style="margin-bottom:14px"><select id="paz-alan" style="max-width:260px"><option value="">Tüm ilgi alanları</option>' + V.ilgiAlanlari.map(function (a) { return "<option>" + a + "</option>"; }).join("") + '</select><button class="btn mavi kucuk" id="paz-indir">⬇ CSV indir</button></div><div class="tablo-kap"><table><thead><tr><th>Üye</th><th>E-posta</th><th>Seviye</th><th>İlgi alanları</th><th>Kayıt</th><th>E-posta izni</th></tr></thead><tbody>' + uy.map(function (u) { return "<tr><td>" + esc(adSoyad(u)) + "</td><td>" + esc(u.email) + "</td><td>" + esc(u.seviye) + "</td><td>" + esc((u.alanlar || []).join(", ")) + '</td><td class="s">' + once(u.kayit) + "</td><td>" + (u.epostaIzni ? '<span class="iyi">✓</span>' : '<span class="k">✗</span>') + "</td></tr>"; }).join("") + "</tbody></table></div>";
  };
  Y.ayarlar = function () { return '<form class="kart form" id="f-hak"><label>Hakkımızda metni<textarea name="m" style="min-height:240px">' + esc(db.hakkimizda) + '</textarea></label><button class="btn ana">Kaydet</button></form><div class="kart" style="margin-top:16px"><div class="mono">Tanıtım verisi</div><p class="s" style="margin:8px 0 12px;font-size:14px">Bu tarayıcıdaki tüm deneme kayıtlarını silip başlangıç verisine döner.</p><button class="btn kucuk hayalet" id="sifirla">Başlangıç verisine dön</button></div>'; };
  S.yonetim.bagla = function () {
    $$("[data-eris]").forEach(function (c) { c.addEventListener("change", function () { var p = c.dataset.eris.split(":"); uye(p[0]).erisim[p[1]] = c.checked; kaydet(); tost(ALANLAR[p[1]] + (c.checked ? " açıldı" : " kapatıldı")); }); });
    $$("[data-odeme]").forEach(function (b) { b.addEventListener("click", function () { var p = b.dataset.odeme.split(":"), o = db.odemeler.filter(function (x) { return x.id === p[0]; })[0]; o.durum = p[1] === "onay" ? "onaylandi" : "reddedildi"; if (p[1] === "onay") paketVer(uye(o.uye), o.paket); kaydet(); tost(p[1] === "onay" ? "Ödeme onaylandı, erişim açıldı" : "Reddedildi"); ciz(); }); });
    var fd = $("#f-ders"); if (fd) {
      fd.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements, d = db.dersler.filter(function (x) { return x.id === fd.dataset.duz; })[0]; var v = { program: el.p.value, sira: +el.s.value, baslik: el.b.value.trim(), video: el.v.value.trim(), demo: el.demo.checked }; if (d) Object.assign(d, v); else db.dersler.push(Object.assign({ id: id("d") }, v)); kaydet(); tost("Ders kaydedildi"); ciz(); });
      $$("[data-ders-duz]").forEach(function (b) { b.addEventListener("click", function () { var d = db.dersler.filter(function (x) { return x.id === b.dataset.dersDuz; })[0], el = fd.elements; el.p.value = d.program; el.s.value = d.sira; el.b.value = d.baslik; el.v.value = d.video || ""; el.demo.checked = !!d.demo; fd.dataset.duz = d.id; fd.scrollIntoView({ behavior: "smooth" }); }); });
      $$("[data-ders-sil]").forEach(function (b) { b.addEventListener("click", function () { db.dersler = db.dersler.filter(function (x) { return x.id !== b.dataset.dersSil; }); kaydet(); ciz(); }); });
    }
    var fk = $("#f-dok"); if (fk) {
      fk.addEventListener("submit", function (e) {
        e.preventDefault(); var el = e.target.elements, dosya = el.f.files[0], ekle = function (yol) { db.dokumanlar.push({ id: id("d"), kategori: el.k.value, tarih: el.t.value, baslik: el.b.value.trim(), dosya: yol, demo: el.demo.checked }); kaydet(); tost("Doküman yüklendi"); ciz(); };
        if (dosya) { if (dosya.size > 3.2e6) return tost("Dosya büyük: bağlantı olarak ekleyin"); var r = new FileReader(); r.onload = function () { ekle(r.result); }; r.readAsDataURL(dosya); } else if (el.u.value.trim()) ekle(el.u.value.trim()); else tost("PDF dosyası ya da bağlantı ekleyin");
      });
      $$("[data-dok-sil]").forEach(function (b) { b.addEventListener("click", function () { db.dokumanlar = db.dokumanlar.filter(function (x) { return x.id !== b.dataset.dokSil; }); kaydet(); ciz(); }); });
    }
    var fc = $("#f-canli"); if (fc) {
      fc.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements; db.canlilar.push({ id: id("c"), baslik: el.b.value.trim(), aciklama: el.a.value.trim(), zaman: new Date(el.z.value).getTime(), sure: +el.s.value, yayin: el.y.value.trim() }); kaydet(); tost("Yayın planlandı"); ciz(); });
      $$("[data-canli-sil]").forEach(function (b) { b.addEventListener("click", function () { db.canlilar = db.canlilar.filter(function (x) { return x.id !== b.dataset.canliSil; }); kaydet(); ciz(); }); });
      $$("[data-canli-link]").forEach(function (b) { b.addEventListener("click", function () { modal('<h3>Yayın bağlantısı</h3><form class="form" style="margin-top:12px"><label>YouTube canlı yayın bağlantısı<input type="url" name="y" required></label><button class="btn mavi">Kaydet</button></form>', function (m) { $("form", m).addEventListener("submit", function (e) { e.preventDefault(); db.canlilar.filter(function (x) { return x.id === b.dataset.canliLink; })[0].yayin = e.target.elements.y.value.trim(); kaydet(); m.remove(); ciz(); }); }); }); });
    }
    var fs = $("#f-soru"); if (fs) fs.addEventListener("submit", function (e) { e.preventDefault(); var el = e.target.elements; db.sorular.push({ d: el.d.value, k: el.k.value.trim(), s: el.s.value.trim(), c: [el.c0.value.trim(), el.c1.value.trim(), el.c2.value.trim(), el.c3.value.trim()], a: el.a.value.trim() || "Doğru cevap: " + el.c0.value.trim() }); kaydet(); tost("Soru bankaya eklendi"); ciz(); });
    var pi = $("#paz-indir"); if (pi) pi.addEventListener("click", function () { var a = $("#paz-alan").value, l = db.uyeler.filter(function (u) { return !yonetici(u) && !(u.paketler || []).length && u.epostaIzni && (!a || (u.alanlar || []).indexOf(a) > -1); }); var csv = "﻿Ad;Soyad;E-posta;Telefon;Seviye;İlgi alanları;Kayıt\n" + l.map(function (u) { return [u.ad, u.soyad, u.email, u.tel, u.seviye, (u.alanlar || []).join(", "), new Date(u.kayit).toLocaleDateString("tr-TR")].map(function (x) { return '"' + String(x || "").replace(/"/g, '""') + '"'; }).join(";"); }).join("\n"); var x = document.createElement("a"); x.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); x.download = "pazarlama-listesi.csv"; x.click(); tost(l.length + " kişi indirildi"); });
    var fh = $("#f-hak"); if (fh) fh.addEventListener("submit", function (e) { e.preventDefault(); db.hakkimizda = e.target.elements.m.value; kaydet(); tost("Kaydedildi"); });
    var sf = $("#sifirla"); if (sf) sf.addEventListener("click", function () { localStorage.removeItem(ANAHTAR); yukle(); db.oturum = "hoca"; kaydet(); tost("Başlangıç verisi yüklendi"); ciz(); });
  };

  S.yok = function () { return '<div class="kart bos-durum"><h3>Sayfa bulunamadı</h3><a class="m" href="#/panel">Panele dön</a></div>'; };

  /* ---------- yönlendirici ---------- */
  var GIRIS_GEREK = ["panel", "egitimler", "ders", "spl", "dokumanlar", "canli", "forum", "profil", "yonetim"];
  function ciz() {
    clearInterval(sayacTik); if (sinavDurum && sinavDurum._t && !/^#\/spl\/\w+\/\w+/.test(location.hash)) clearInterval(sinavDurum._t);
    var p = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean), sayfa = p[0] || (ben() ? "panel" : "vitrin"), prm = p.slice(1);
    if (!S[sayfa]) sayfa = "yok";
    if (GIRIS_GEREK.indexOf(sayfa) > -1 && !ben()) { kabuk(); $("#sayfa").innerHTML = '<div style="max-width:520px;margin:30px auto;text-align:center" class="kart"><div style="font-size:34px">🔐</div><h2 class="bas" style="margin:10px 0">Önce giriş</h2><p class="s">Bu bölüm üyelere açık. Üyelik ücretsiz; demo içerikler hemen açılır.</p><div class="satir" style="justify-content:center;margin-top:18px"><a class="btn ana" href="#/kayit">Ücretsiz üye ol</a><a class="btn" href="#/giris">Giriş yap</a></div></div>'; return; }
    if (sayfa === "yonetim" && !yonetici(ben())) sayfa = "yok";
    kabuk(); $("#sayfa").innerHTML = S[sayfa](prm); if (S[sayfa].bagla) S[sayfa].bagla(prm); window.scrollTo(0, 0);
  }
  yukle(); window.addEventListener("hashchange", ciz); ciz();
})();
