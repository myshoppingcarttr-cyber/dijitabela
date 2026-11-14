/* Dijitabela · önizleme 1411 · Canlı kurulum: yazılan ada ve sektöre özel ana sayfa taslağı tarayıcının içinde kurulur.
   Sunucu yok, kayıt yok, dış kaynak yok. Yorum, fotoğraf ve harita alanları açıkça "yer tutucu"dur; uydurma yorum/puan üretilmez. */
(function () {
  "use strict";
  var W = window, D = document, C = W.F14 || {}, kap = D.getElementById("kur"); if (!kap) return;
  var $ = function (s) { return kap.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(kap.querySelectorAll(s)); };
  var AZ = W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var mutlak = function (y) { try { return new URL(C.kok + y, location.href).href; } catch (e) { return y; } };

  var IK = {
    oto: "M21 7a5 5 0 0 1-6.6 4.7L6 20a2 2 0 0 1-3-3l8.3-8.4A5 5 0 0 1 17 2l-3 3 1 3 3 1z", klinik: "M9 3h6v6h6v6h-6v6H9v-6H3V9h6z", guzellik: "M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z",
    restoran: "M7 2v8a2 2 0 0 0 2 2v10M5 2v6M9 2v6M17 2c-2 2-3 5-3 8h3v12", emlak: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z", mali: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
    avukat: "M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z", usta: "M14 4l6 6-3 3-2-2-9 9a2 2 0 0 1-3-3l9-9-2-2z"
  };
  var S = {
    oto: { tur: "Oto servis", ton: [8, 24, 212, 38], bas: "Aracınız emin ellerde.", alt: "Periyodik bakım, arıza tespiti ve onarım. Randevunuzu alın; aracınızın ne zaman hazır olacağını baştan bilin.", cta: "Servis randevusu al", hb: "Hizmetler",
      hz: [["Periyodik bakım", "Yağ, filtre ve kontroller tek randevuda."], ["Arıza tespiti", "Cihazla okuma ve yol testi."], ["Fren ve balata", "Disk, balata ve hidrolik kontrolü."], ["Motor ve mekanik", "Triger, debriyaj, alt takım."], ["Elektrik ve akü", "Şarj, marş ve aydınlatma."], ["Klima bakımı", "Gaz dolumu ve polen filtresi."]],
      oz: ["Randevulu servis", "İşlem öncesi fiyat bilgisi", "Bakım zamanı hatırlatması"], fb: "Servis randevusu", fa: ["Ad soyad", "Telefon", "Araç marka ve model", "Şikâyetiniz"] },
    klinik: { tur: "Klinik", ton: [188, 204, 168, 222], bas: "Randevunuz bir dokunuş uzakta.", alt: "Size uygun günü ve saati seçin. Randevunuzdan önce hatırlatma mesajı gelir; sorunuz olursa yazarsınız.", cta: "Randevu al", hb: "Hizmetler",
      hz: [["Muayene", "İlk görüşme ve değerlendirme."], ["Kontrol ve takip", "Düzenli kontrol randevuları."], ["Tedavi planı", "Adımlar ve süre yazılı verilir."], ["Görüntüleme", "Gerekli tetkiklerin planlanması."], ["Hızlı randevu", "Aynı hafta içinde uygun saat."], ["Ön görüşme", "Gelmeden önce kısa bilgi alın."]],
      oz: ["Randevu hatırlatması", "Yol tarifi ve otopark bilgisi", "Sorular için WhatsApp hattı"], fb: "Randevu talebi", fa: ["Ad soyad", "Telefon", "Tercih ettiğiniz gün", "Kısaca şikâyetiniz"] },
    guzellik: { tur: "Güzellik salonu", ton: [338, 322, 18, 280], bas: "Kendinize ayırdığınız saat.", alt: "Saç, cilt ve tırnak bakımı için yerinizi ayırtın. Beklemeden, size ayrılan saatte.", cta: "Randevu al", hb: "Hizmetler",
      hz: [["Saç kesimi", "Kesim, fön ve şekillendirme."], ["Saç boyama", "Renk, röfle ve bakım."], ["Cilt bakımı", "Cildinize göre bakım programı."], ["Manikür ve pedikür", "Kalıcı oje ve bakım."], ["Kaş ve kirpik", "Şekillendirme ve bakım."], ["Özel gün", "Gelin başı ve davet hazırlığı."]],
      oz: ["Çevrim içi randevu", "Randevudan önce hatırlatma", "Fiyat listesi sitede"], fb: "Randevu talebi", fa: ["Ad soyad", "Telefon", "İstediğiniz işlem", "Tercih ettiğiniz gün"] },
    restoran: { tur: "Restoran", ton: [14, 28, 42, 352], bas: "Sofranız hazır.", alt: "Menüye göz atın, masanızı ayırtın ya da siparişinizi verin. Günün yemekleri her sabah burada.", cta: "Masa ayırt", hb: "Menüden",
      hz: [["Kahvaltı", "Serpme ve tabak seçenekleri."], ["Ana yemekler", "Günlük pişen ev yemekleri."], ["Izgaralar", "Közde, sipariş üzerine."], ["Tatlılar", "Günlük yapılan tatlılar."], ["İçecekler", "Sıcak ve soğuk içecekler."], ["Paket servis", "Telefonla ya da WhatsApp'tan."]],
      oz: ["QR menü", "Masa ayırtma", "WhatsApp'tan sipariş"], fb: "Masa ayırtma", fa: ["Ad soyad", "Telefon", "Kişi sayısı", "Gün ve saat"] },
    emlak: { tur: "Emlak ofisi", ton: [152, 208, 30, 224], bas: "Doğru ev, doğru fiyat.", alt: "Satılık ve kiralık portföyümüzü inceleyin. Aradığınızı yazın; uygun ilan çıktığında ilk siz haber alın.", cta: "Portföyü gör", hb: "Neler yapıyoruz",
      hz: [["Satılık konut", "Daire, villa ve müstakil ev."], ["Kiralık konut", "Eşyalı ve eşyasız seçenekler."], ["İş yeri", "Dükkân, ofis ve depo."], ["Arsa ve tarla", "İmar durumu bilgisiyle."], ["Değerleme görüşmesi", "Mülkünüzün piyasadaki yeri."], ["Kira yönetimi", "Kiracı bulma ve takip."]],
      oz: ["Güncel portföy", "İlan talebi bırakma", "Yer gösterme randevusu"], fb: "Aradığınızı yazın", fa: ["Ad soyad", "Telefon", "Satılık mı, kiralık mı", "Bölge ve bütçe"] },
    mali: { tur: "Mali müşavirlik", ton: [216, 232, 162, 200], bas: "Defteriniz düzenli, aklınız rahat.", alt: "Kuruluştan beyannameye bütün süreç tek elden. Eksik belgenizi ve yaklaşan tarihleri önceden bilirsiniz.", cta: "Görüşme planla", hb: "Hizmetler",
      hz: [["Şirket kuruluşu", "Şahıs ve sermaye şirketleri."], ["Defter tutma", "Aylık kayıt ve mutabakat."], ["Beyannameler", "Zamanında verilir, size bildirilir."], ["Bordro", "Maaş, SGK ve bildirgeler."], ["E-fatura geçişi", "Kurulum ve ilk ay desteği."], ["Danışmanlık", "Vergi ve teşvik soruları."]],
      oz: ["Eksik belge bildirimi", "Yaklaşan tarih hatırlatması", "Belgeyi telefondan gönderme"], fb: "Görüşme talebi", fa: ["Ad soyad", "Telefon", "Şirket türü", "Konu"] },
    avukat: { tur: "Hukuk bürosu", ton: [28, 222, 350, 160], sade: 1, bas: "Çalışma alanlarımız ve iletişim.", alt: "Büromuzun çalışma alanlarını, adresini ve görüşme saatlerini bu sayfada bulabilirsiniz.", cta: "İletişim", hb: "Çalışma alanları",
      hz: [["Aile hukuku", ""], ["İş hukuku", ""], ["Ceza hukuku", ""], ["Gayrimenkul hukuku", ""], ["Ticaret ve şirketler hukuku", ""], ["İcra ve iflas hukuku", ""]],
      oz: ["Sade ve bilgi veren düzen", "Görüşme talebi formu", "Adres ve yol tarifi"], fb: "Görüşme talebi", fa: ["Ad soyad", "Telefon", "Konu başlığı", "Uygun olduğunuz gün"] },
    usta: { tur: "Tadilat ve usta", ton: [32, 204, 12, 48], bas: "İşiniz zamanında, temiz teslim.", alt: "Boya, tesisat, elektrik ve yenileme işleri. Keşif isteyin; kapsamı ve fiyatı yazılı alın.", cta: "Keşif iste", hb: "Hizmetler",
      hz: [["Boya ve badana", "İç ve dış cephe."], ["Su tesisatı", "Kaçak, tıkanıklık, yenileme."], ["Elektrik", "Arıza, pano ve aydınlatma."], ["Mutfak ve banyo", "Baştan sona yenileme."], ["Zemin", "Parke, seramik ve laminat."], ["Küçük onarımlar", "Montaj ve tamir işleri."]],
      oz: ["Yazılı fiyat", "İş takvimi baştan belli", "Önce ve sonra fotoğrafları"], fb: "Keşif talebi", fa: ["Ad soyad", "Telefon", "Yapılacak iş", "Adres / semt"] }
  };
  var DIL = { a: "Keskin", b: "Sıcak", c: "Sade" };

  function kar(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function hsl(h, s, l) { s /= 100; l /= 100; var k = function (n) { return (n + h / 30) % 12; }, a = s * Math.min(l, 1 - l), f = function (n) { var v = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return ("0" + Math.round(v * 255).toString(16)).slice(-2); }; return "#" + f(0) + f(8) + f(4); }
  function isik(x) { var c = [1, 3, 5].map(function (i) { var v = parseInt(x.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function zit(a, b) { var x = isik(a), y = isik(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function palet(ad, sek, kay) {
    var k = kar(ad.toLocaleLowerCase("tr") || "x"), t = S[sek].ton, h = (t[(k + kay) % t.length] + ((k >> 4) % 13) - 6 + 360) % 360, sade = S[sek].sade;
    var doy = sade ? 34 : 72, l = 44, koyu = hsl(h, doy, l); while (zit(koyu, "#ffffff") < 4.6 && l > 16) { l -= 2; koyu = hsl(h, doy, l); }
    var l2 = 60, parlak = hsl(h, sade ? 46 : 88, l2), zemA = hsl(h, 16, 7); while (zit(parlak, zemA) < 7 && l2 < 86) { l2 += 2; parlak = hsl(h, sade ? 46 : 88, l2); }
    return { h: h, koyu: koyu, parlak: parlak, zemA: zemA, panA: hsl(h, 14, 11), cizA: hsl(h, 12, 20), yumA: hsl(h, 10, 68), zemB: hsl((h + 28) % 360, 46, 95), panB: hsl((h + 28) % 360, 50, 98), cizB: hsl((h + 28) % 360, 30, 85), murB: hsl(h, 30, 14), yumB: hsl(h, 12, 36), tinC: hsl(h, 60, 96), cizC: hsl(h, 16, 89), murC: hsl(h, 22, 12), yumC: hsl(h, 8, 40) };
  }
  function bas(ad) { var k = ad.trim().split(/\s+/).filter(Boolean); return ((k[0] ? Array.from(k[0])[0] : "A") + (k[1] ? Array.from(k[1])[0] : "")).toLocaleUpperCase("tr"); }
  function logo(ad, kay, boy) {
    var b = bas(ad), v = (kar(ad.toLocaleLowerCase("tr") || "x") + kay) % 5, fs = b.length > 1 ? 17 : 22;
    var sekil = ['<rect x="2" y="2" width="36" height="36" rx="9"/>', '<circle cx="20" cy="20" r="18"/>', '<path d="M20 1.5l16 9.2v18.6L20 38.5 4 29.3V10.7z"/>', '<path d="M3 20C3 9 10 2 20 2s17 7 17 18v18H3z"/>', '<path d="M2 2h26l10 10v26H2z"/>'][v];
    return '<svg class="mk" viewBox="0 0 40 40" width="' + (boy || 40) + '" height="' + (boy || 40) + '" aria-hidden="true"><g fill="var(--a)">' + sekil + '</g><text x="20" y="' + (20 + fs * 0.36) + '" text-anchor="middle" font-family="Archivo,Arial Narrow,Arial,sans-serif" font-weight="900" font-size="' + fs + '" fill="var(--at)" style="font-stretch:75%">' + esc(b) + "</text>" + (v === 4 ? '<circle cx="33" cy="7" r="2.4" fill="var(--at)"/>' : "") + "</svg>";
  }
  function adres(ad) { var m = { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u" }; return (ad.toLocaleLowerCase("tr").replace(/[çğıöşüâîû]/g, function (c) { return m[c]; }).replace(/[^a-z0-9]+/g, "").slice(0, 28) || "isletmeniz") + ".com"; }

  var CSS = function (p) { return "" +
    "@font-face{font-family:Archivo;src:url(" + mutlak("assets/fable/font/archivo.woff2") + ") format('woff2');font-weight:600 900;font-stretch:62% 100%;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+2000-206F}" +
    "@font-face{font-family:Archivo;src:url(" + mutlak("assets/fable/font/archivo-ext.woff2") + ") format('woff2');font-weight:600 900;font-stretch:62% 100%;font-display:swap;unicode-range:U+0100-02BA,U+1E00-1E9F}" +
    "@font-face{font-family:Jak;src:url(" + mutlak("assets/fable/font/jakarta.woff2") + ") format('woff2');font-weight:400 700;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+2000-206F}" +
    "@font-face{font-family:Jak;src:url(" + mutlak("assets/fable/font/jakarta-ext.woff2") + ") format('woff2');font-weight:400 700;font-display:swap;unicode-range:U+0100-02BA,U+1E00-1E9F}" +
    ".d-a{--bg:" + p.zemA + ";--pan:" + p.panA + ";--ink:#F4F4F1;--soft:" + p.yumA + ";--line:" + p.cizA + ";--a:" + p.parlak + ";--at:" + p.zemA + ";--r:0px;--hf:Archivo,'Arial Narrow',Arial,sans-serif}" +
    ".d-b{--bg:" + p.zemB + ";--pan:" + p.panB + ";--ink:" + p.murB + ";--soft:" + p.yumB + ";--line:" + p.cizB + ";--a:" + p.koyu + ";--at:#fff;--r:20px;--hf:Georgia,'Times New Roman',serif}" +
    ".d-c{--bg:#fff;--pan:" + p.tinC + ";--ink:" + p.murC + ";--soft:" + p.yumC + ";--line:" + p.cizC + ";--a:" + p.koyu + ";--at:#fff;--r:12px;--hf:Jak,system-ui,sans-serif}" +
    "*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font:400 16px/1.6 Jak,system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);background:var(--bg);-webkit-font-smoothing:antialiased;transition:background .35s,color .35s}" +
    "a{color:inherit;text-decoration:none}svg{display:block}.w{width:min(100% - 40px,1120px);margin-inline:auto}h1,h2,h3,p{margin:0}" +
    ".tas{font:700 10.5px/1.35 ui-monospace,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;text-align:center;padding:7px 12px;color:var(--soft);border-bottom:1px dashed var(--line)}" +
    ".u{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}.u .w{display:flex;align-items:center;gap:18px;min-height:64px}.lg{display:flex;align-items:center;gap:10px;font-weight:700;font-size:17px;letter-spacing:-.01em;min-width:0}.lg b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".u nav{margin-left:auto;display:flex;gap:22px;font-size:14.5px;color:var(--soft);font-weight:600}.b{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border:1.5px solid var(--ink);border-radius:var(--r);font-weight:700;font-size:15px;white-space:nowrap}.b.ana{background:var(--a);border-color:var(--a);color:var(--at)}" +
    ".h .w{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center;padding-block:72px}.k{font:700 12px/1.2 ui-monospace,Consolas,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--a);margin-bottom:18px}" +
    "h1{font-family:var(--hf);font-size:clamp(38px,6.2vw,84px);line-height:1;letter-spacing:-.02em}h2{font-family:var(--hf);font-size:clamp(28px,3.6vw,46px);line-height:1.05;letter-spacing:-.015em}h3{font-size:18px;line-height:1.25}" +
    ".h p.a{font-size:18px;color:var(--soft);margin-top:20px;max-width:52ch}.bs{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.oz{list-style:none;padding:0;margin:30px 0 0;display:flex;flex-wrap:wrap;gap:8px 22px;font-size:14.5px;font-weight:600}.oz li::before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--a);margin-right:8px}" +
    ".hg{position:relative;aspect-ratio:4/4.4;border-radius:var(--r);background:var(--pan);border:1px solid var(--line);overflow:hidden;display:grid;place-items:center}.hg .sus{position:absolute;inset:0;width:100%;height:100%}.hg .ik{position:relative;width:38%;height:auto;color:var(--a)}" +
    ".yt{position:absolute;left:12px;bottom:12px;font:700 10px/1 ui-monospace,Consolas,monospace;letter-spacing:.1em;text-transform:uppercase;background:var(--bg);color:var(--soft);border:1px dashed var(--line);padding:6px 8px;border-radius:4px}" +
    ".s{padding-block:64px;border-top:1px solid var(--line)}.sb{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:30px}.sb p{color:var(--soft);max-width:44ch}" +
    ".hz{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.hz div{background:var(--pan);border:1px solid var(--line);border-radius:var(--r);padding:22px}.hz i{font:700 12px/1 ui-monospace,Consolas,monospace;color:var(--a);font-style:normal;display:block;margin-bottom:14px}.hz p{color:var(--soft);font-size:14.5px;margin-top:6px}" +
    ".r .w{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}.r p{color:var(--soft);margin-top:14px}form{background:var(--pan);border:1px solid var(--line);border-radius:var(--r);padding:24px;display:grid;gap:12px}label{font-size:13px;font-weight:700;display:grid;gap:6px}.al{height:46px;border:1.5px solid var(--line);border-radius:calc(var(--r)*.5);background:var(--bg)}small{color:var(--soft);font-size:12.5px}" +
    ".yr{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.yr div{border:1.5px dashed var(--line);border-radius:var(--r);padding:22px;display:grid;gap:10px}.yr span{height:10px;border-radius:5px;background:var(--line)}.yr span:nth-child(1){width:42%;height:12px}.yr span:nth-child(3){width:86%}.yr span:nth-child(4){width:64%}.n{font-size:13.5px;color:var(--soft);margin-top:16px}" +
    ".i .w{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:stretch}.hr{position:relative;min-height:300px;border-radius:var(--r);border:1px solid var(--line);background:var(--pan);overflow:hidden}.hr svg{position:absolute;inset:0;width:100%;height:100%}" +
    "table{border-collapse:collapse;width:100%;margin-top:18px;font-size:15px}td{padding:10px 0;border-bottom:1px solid var(--line)}td:last-child{text-align:right;color:var(--soft)}.bos{color:var(--soft);border-bottom:1.5px dashed var(--line)}" +
    "footer{border-top:1px solid var(--line);padding:28px 0 96px;font-size:13.5px;color:var(--soft)}footer .w{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}" +
    ".wa{display:none}" +
    /* Keskin */
    ".d-a h1,.d-a h2{font-weight:900;font-stretch:62%;text-transform:uppercase;line-height:.92;letter-spacing:0}.d-a h1{font-size:clamp(46px,8.4vw,116px)}.d-a h1 em{font-style:normal;color:var(--a)}.d-a .hz{grid-template-columns:1fr 1fr;gap:0;border-top:2px solid var(--ink)}.d-a .hz div{background:none;border:0;border-bottom:1px solid var(--line);padding:20px 16px 20px 0;display:grid;grid-template-columns:44px 1fr;column-gap:6px}.d-a .hz i{grid-row:span 2;margin:4px 0 0}.d-a .hz h3{font:900 24px/1 var(--hf);font-stretch:62%;text-transform:uppercase}.d-a .hg{aspect-ratio:4/3.6}.d-a .b{text-transform:uppercase;font:900 17px/1 var(--hf);font-stretch:75%;letter-spacing:.02em}.d-a .lg{font:900 22px/1 var(--hf);font-stretch:62%;text-transform:uppercase;letter-spacing:.01em}" +
    /* Sıcak */
    ".d-b h1,.d-b h2{font-weight:400}.d-b h1 em{font-style:italic;color:var(--a)}.d-b .hg{border-radius:999px 999px var(--r) var(--r);aspect-ratio:4/5}.d-b .b{border-radius:999px}.d-b .hz div{box-shadow:0 1px 0 var(--line),0 18px 40px -28px rgba(60,40,20,.35);border-color:transparent}.d-b .hz i{width:38px;height:38px;border-radius:50%;background:var(--bg);display:grid;place-items:center;font-size:11px}.d-b .lg{font-family:var(--hf);font-size:20px;font-weight:400}.d-b .u{border-bottom-color:transparent}.d-b form{box-shadow:0 30px 60px -40px rgba(60,40,20,.45);border-color:transparent}" +
    /* Sade */
    ".d-c .h .w{grid-template-columns:1fr;text-align:center;justify-items:center;padding-block:84px 56px;gap:44px}.d-c .h p.a{margin-inline:auto}.d-c .bs,.d-c .oz{justify-content:center}.d-c h1,.d-c h2{font-weight:600;letter-spacing:-.035em}.d-c h1 em{font-style:normal;color:var(--a)}.d-c .hg{aspect-ratio:auto;height:300px;width:100%;border:0}.d-c .hg .ik{width:120px}.d-c .b{border-radius:999px;border-width:1px}.d-c .hz{grid-template-columns:1fr 1fr;gap:0 48px}.d-c .hz div{background:none;border:0;border-top:1px solid var(--line);border-radius:0;padding:20px 0;display:grid;grid-template-columns:1fr 1.2fr;gap:12px;align-items:baseline}.d-c .hz i{display:none}.d-c .hz p{margin:0}.d-c .sb{flex-direction:column;align-items:start}.d-c form{border:0}" +
    "@media (max-width:760px){.u nav,.u .b{display:none}.h .w,.r .w,.i .w{grid-template-columns:1fr;gap:28px;padding-block:44px}.s{padding-block:44px}.hz,.yr,.d-a .hz,.d-c .hz{grid-template-columns:1fr}.yr div:nth-child(n+2){display:none}.sb{flex-direction:column;align-items:start}.d-c .hz div{grid-template-columns:1fr;gap:4px}.hg{aspect-ratio:4/3!important;height:auto!important}.d-b .hg{border-radius:140px 140px var(--r) var(--r)}.hr{min-height:220px}" +
    ".wa{display:grid;grid-template-columns:1fr 1fr;gap:8px;position:fixed;left:0;right:0;bottom:0;padding:10px 12px;background:var(--bg);border-top:1px solid var(--line);z-index:6}.wa .b{min-height:48px}}" +
    "@media (prefers-reduced-motion:no-preference){.kur .h .w>*,.kur .s{animation:g .7s cubic-bezier(.2,.8,.2,1) both}.kur .h .w>*:nth-child(2){animation-delay:.12s}.kur .s:nth-of-type(2){animation-delay:.2s}.kur .s:nth-of-type(3){animation-delay:.3s}@keyframes g{from{opacity:0;transform:translateY(22px)}}}";
  };

  function sus(k) {      // fotoğraf yerine ada göre değişen soyut düzen
    var o = "", r = function (n) { k = (Math.imul(k, 1103515245) + 12345) >>> 0; return (k >>> 8) % n; };
    for (var i = 0; i < 5; i++) { var x = r(400), y = r(440), b = 60 + r(150); o += i % 2 ? '<circle cx="' + x + '" cy="' + y + '" r="' + b + '" fill="none" stroke="var(--a)" stroke-opacity=".28" stroke-width="1.5"/>' : '<rect x="' + (x - b / 2) + '" y="' + (y - b / 2) + '" width="' + b + '" height="' + b + '" fill="var(--a)" fill-opacity=".07" transform="rotate(' + r(45) + " " + x + " " + y + ')"/>'; }
    return '<svg class="sus" viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + o + "</svg>";
  }
  var HARITA = '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="var(--line)" stroke-width="10" fill="none" stroke-linecap="round"><path d="M-20 80h440M-20 210h440M90-20v340M270-20v340"/><path d="M-20 300L190-20M210 320l230-250" stroke-width="6"/></g><g transform="translate(200 132)"><path d="M0 34C-18 10-24 0-24-12a24 24 0 0 1 48 0c0 12-6 22-24 46z" fill="var(--a)"/><circle cy="-12" r="8" fill="var(--at)"/></g></svg>';

  function belge(d) {
    var s = S[d.sek], p = palet(d.ad, d.sek, d.renk), ad = esc(d.ad), sehir = esc(d.sehir || "Şehriniz");
    var parca = s.bas.split(" "), son = parca.pop(), baslik = esc(parca.join(" ")) + " <em>" + esc(son) + "</em>";
    return "<!DOCTYPE html><html lang=tr><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><meta name=robots content='noindex,nofollow'><title>" + ad + " · taslak</title><style>" + CSS(p) + "</style></head><body class='d-" + d.dil + (d.kur ? " kur" : "") + "'>" +
      "<div class=tas>Taslak · örnek metinler · fotoğraf, yorum ve adres gerçek sitede sizinkilerle dolar</div>" +
      "<header class=u><div class=w><a class=lg href='#ust'>" + logo(d.ad, d.renk) + "<b>" + ad + "</b></a><nav><a href='#hizmet'>" + esc(s.hb) + "</a>" + (s.sade ? "" : "<a href='#yorum'>Yorumlar</a>") + "<a href='#iletisim'>İletişim</a></nav><a class='b ana' href='#form'>" + esc(s.cta) + "</a></div></header>" +
      "<section class=h id=ust><div class=w><div><p class=k>" + sehir + " · " + esc(s.tur) + "</p><h1>" + baslik + "</h1><p class=a>" + esc(s.alt) + "</p><div class=bs><a class='b ana' href='#form'>" + esc(s.cta) + "</a><a class=b href='#iletisim'>WhatsApp'tan yazın</a></div><ul class=oz>" + s.oz.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
      "<div class=hg>" + sus(kar(d.ad + d.sek)) + "<svg class=ik viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='" + IK[d.sek] + "'/></svg><span class=yt>Fotoğraf yeri</span></div></div></section>" +
      "<section class=s id=hizmet><div class=w><div class=sb><h2>" + esc(s.hb) + "</h2><p>Liste örnektir; gerçek sitede sizin yaptığınız işler ve fiyat bilginiz yazılır.</p></div><div class=hz>" + s.hz.map(function (x, i) { return "<div><i>0" + (i + 1) + "</i><h3>" + esc(x[0]) + "</h3>" + (x[1] ? "<p>" + esc(x[1]) + "</p>" : "") + "</div>"; }).join("") + "</div></div></section>" +
      "<section class='s r' id=form><div class=w><div><h2>" + esc(s.fb) + "</h2><p>Form gerçek sitede çalışır: gelen talep telefonunuza ve WhatsApp'ınıza düşer, müşteriye onay mesajı gider.</p></div><form>" + s.fa.map(function (x) { return "<label>" + esc(x) + "<span class=al></span></label>"; }).join("") + "<span class='b ana'>" + esc(s.cta) + "</span><small>Taslakta form gönderilmez.</small></form></div></section>" +
      (s.sade ? "" : "<section class=s id=yorum><div class=w><div class=sb><h2>Müşterileriniz ne diyor?</h2><p>Yorum yeri. Buraya hiçbir zaman uydurma yorum yazılmaz.</p></div><div class=yr><div><span></span><span></span><span></span><span></span></div><div><span></span><span></span><span></span><span></span></div><div><span></span><span></span><span></span><span></span></div></div><p class=n>Gerçek sitede Google yorumlarınız olduğu gibi, iyisiyle kötüsüyle görünür.</p></div></section>") +
      "<section class='s i' id=iletisim><div class=w><div class=hr>" + HARITA + "<span class=yt>Harita yeri</span></div><div><h2>" + ad + "</h2><table><tr><td>Adres</td><td class=bos>Adresiniz</td></tr><tr><td>Telefon</td><td class=bos>Numaranız</td></tr><tr><td>Hafta içi</td><td class=bos>Saatleriniz</td></tr><tr><td>Cumartesi</td><td class=bos>Saatleriniz</td></tr></table><div class=bs><span class='b ana'>Ara</span><span class=b>Yol tarifi</span></div></div></div></section>" +
      "<footer><div class=w><span>© " + ad + " · " + sehir + "</span><span>" + (s.sade ? "Meslek kurallarına uygun, sade düzen · " : "") + "Taslak: Dijitabela</span></div></footer><div class=wa><span class='b ana'>WhatsApp</span><span class=b>Ara</span></div></body></html>";
  }

  /* ---- Arayüz ---- */
  var gAd = $("#k-ad"), gSehir = $("#k-sehir"), mas = $("#k-mas"), tel = $("#k-tel"), durum = $("#k-durum"), url = $("#k-url"), kimlik = $("#k-kimlik"), gercek = $("#k-gercek"), sahne = $(".kur-sahne"), ort = $(".kur-ort");
  var hAd = D.getElementById("ad"), hSek = D.getElementById("sek");
  var d = { ad: "", sehir: "", sek: "oto", dil: "a", renk: 0, kur: 0 }, ilk = true, son = "";
  function secili(n) { var x = kap.querySelector('input[name="' + n + '"]:checked'); return x ? x.value : null; }
  function oku() { d.ad = (gAd.value || "").replace(/\s+/g, " ").trim().slice(0, 34); d.sehir = (gSehir.value || "").replace(/\s+/g, " ").trim().slice(0, 24); d.sek = secili("k-sek") || "oto"; d.dil = secili("k-dil") || "a"; }
  function olcek() { [[mas, 1280, 800], [tel, 390, 790]].forEach(function (x) { var f = x[0]; if (!f) return; var k = f.parentNode, g = k.clientWidth; if (!g) return; var o = g / x[1]; f.style.width = x[1] + "px"; f.style.height = x[2] + "px"; f.style.transform = "scale(" + o.toFixed(4) + ")"; k.style.height = Math.round(x[2] * o) + "px"; }); }
  function yaz(animasyon) {
    oku();
    var v = { ad: d.ad || "İşletmenizin Adı", sehir: d.sehir, sek: d.sek, dil: d.dil, renk: d.renk, kur: animasyon && !AZ ? 1 : 0 };
    var t0 = performance.now(), h = belge(v), ms = performance.now() - t0; son = h;
    if (mas) mas.srcdoc = h; if (tel) tel.srcdoc = h;
    var p = palet(v.ad, v.sek, v.renk);
    if (url) url.textContent = adres(v.ad);
    if (kimlik) kimlik.innerHTML = '<span style="--a:' + p.koyu + ';--at:#fff">' + logo(v.ad, v.renk, 44) + "</span><span class=\"renk\">" + [p.koyu, p.parlak, p.zemB, p.zemA].map(function (c) { return '<i style="background:' + c + '" title="' + c + '"></i>'; }).join("") + '</span><small>' + (d.ad ? "Adınızdan üretildi" : "Adınızı yazınca size özel olur") + "</small>";
    if (durum) durum.textContent = (d.ad ? "“" + d.ad + "” için " : "Örnek ") + S[v.sek].tur.toLocaleLowerCase("tr") + " taslağı " + (ms < 1 ? "1 ms'den kısa sürede" : Math.round(ms) + " ms'de") + " kuruldu · " + DIL[v.dil] + " dil · " + (S[v.sek].sade ? 4 : 5) + " bölüm";
    if (gercek) gercek.href = "teklif.html?ad=" + encodeURIComponent(d.ad) + "&sektor=" + d.sek + "&dil=" + d.dil + (d.sehir ? "&sehir=" + encodeURIComponent(d.sehir) : "");
    kap.setAttribute("data-dolu", d.ad ? "1" : "0");
    W.F14KUR.son = { ad: d.ad, sek: d.sek, dil: d.dil, ms: ms, uzunluk: h.length };
  }
  function dilDegis() {      // kaydırma konumunu bozmadan anında geçiş
    oku(); var oldu = false;
    [mas, tel].forEach(function (f) { try { var b = f && f.contentDocument && f.contentDocument.body; if (b && b.className.indexOf("d-") > -1) { b.className = "d-" + d.dil; oldu = true; } } catch (e) {} });
    if (!oldu) return yaz(false);
    if (durum) durum.textContent = DIL[d.dil] + " tasarım diline geçildi · içerik aynı, yerleşim ve yazı karakteri değişti";
    if (gercek) gercek.href = gercek.href.replace(/dil=[abc]/, "dil=" + d.dil);
    son = son.replace(/<body class='d-[abc][^']*'>/, "<body class='d-" + d.dil + "'>");
  }
  var ADIM = ["Ad okunuyor", "Logo işareti ve renkler üretiliyor", "Sektör bölümleri diziliyor", "Telefon ve masaüstü görünümü kuruluyor"];
  function kurGoster() {
    if (AZ || !ort) return yaz(false);
    ort.hidden = false; ort.innerHTML = "<p>Kuruluyor</p><ol>" + ADIM.map(function (a) { return "<li>" + a + "</li>"; }).join("") + "</ol>"; sahne.classList.add("kuruyor");
    var li = ort.querySelectorAll("li"), i = 0;
    var z = setInterval(function () { if (li[i]) li[i].className = "tamam"; i++; if (i === 2) yaz(true); if (i >= li.length) { clearInterval(z); setTimeout(function () { ort.hidden = true; sahne.classList.remove("kuruyor"); }, 260); } }, 330);
  }
  var zt = 0;
  function degisti(agir) { clearTimeout(zt); zt = setTimeout(function () { if (ilk && gAd.value.trim()) { ilk = false; kurGoster(); } else yaz(agir); }, 220); }
  gAd.addEventListener("input", function () { if (hAd && hAd.value !== gAd.value) { hAd.value = gAd.value; if (W.F14LED) W.F14LED.yaz(gAd.value); } degisti(false); });
  gSehir.addEventListener("input", function () { degisti(false); });
  $$('input[name="k-sek"]').forEach(function (x) { x.addEventListener("change", function () { if (hSek) hSek.value = x.value; yaz(true); }); });
  $$('input[name="k-dil"]').forEach(function (x) { x.addEventListener("change", dilDegis); });
  var rb = $("#k-renk"); if (rb) rb.addEventListener("click", function () { d.renk = (d.renk + 1) % 4; yaz(false); });
  var tb = $("#k-tam"); if (tb) tb.addEventListener("click", function () { try { var u = URL.createObjectURL(new Blob([son], { type: "text/html" })); W.open(u, "_blank", "noopener"); setTimeout(function () { URL.revokeObjectURL(u); }, 60000); } catch (e) {} });
  $$("[data-kg]").forEach(function (b) { b.addEventListener("click", function () { sahne.setAttribute("data-g", b.getAttribute("data-kg")); $$("[data-kg]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); olcek(); }); });
  if ("ResizeObserver" in W && sahne) new ResizeObserver(olcek).observe(sahne); W.addEventListener("resize", olcek);
  if (W.innerWidth < 761 && sahne) sahne.setAttribute("data-g", "tel");

  /* Kahramandaki formdan gelen ad ve sektör */
  W.F14KUR = { son: null, kur: function (ad, sek) {
    if (ad != null) gAd.value = ad;
    if (sek && S[sek]) { var r = kap.querySelector('input[name="k-sek"][value="' + sek + '"]'); if (r) r.checked = true; }
    ilk = false; if (gAd.value.trim()) kurGoster(); else yaz(false);
  } };
  try { var q = new URLSearchParams(location.search); if (q.get("ad")) gAd.value = q.get("ad").slice(0, 34); } catch (e) {}
  olcek(); yaz(false); if (gAd.value.trim()) ilk = false;
})();
