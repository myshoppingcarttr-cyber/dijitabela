/* bensay Mimarlık · evrensel sayfa çizici (30 Eki 2026)
   Aynı kod hem Node'da (önceden üretim: MUSTERILER/bensay/onuret.js) hem tarayıcıda (yönetim panelinden gelen içerikle yeniden çizim) çalışır.
   Girdi: icerik (veri/icerik.json ya da Supabase site_icerik.veri). Çıktı: sayfa parçaları ya da tam HTML belgesi. */
(function (kok) {
"use strict";
var SAYFALAR = {
  index: { dosya: "index.html", ad: "Anasayfa" }, kurumsal: { dosya: "kurumsal.html", ad: "Kurumsal" },
  hizmetler: { dosya: "hizmetler.html", ad: "Hizmetler" }, projeler: { dosya: "projelerimiz.html", ad: "Projeler" },
  proje: { dosya: "proje.html", ad: "Proje detay" }, maliyet: { dosya: "maliyet.html", ad: "Maliyet hesaplayıcı" },
  blog: { dosya: "blog.html", ad: "Blog" }, yazi: { dosya: "yazi.html", ad: "Blog yazısı" },
  iletisim: { dosya: "iletisim.html", ad: "İletişim" }, araclar: { dosya: "araclar.html", ad: "Araçlar" }, takip: { dosya: "takip.html", ad: "Proje takip" }
};
var BOLUM_TIPLERI = {
  kahraman: "Kahraman (açılış)", sayfaBasi: "Sayfa başlığı", anaHizmet: "Öne çıkan hizmet", hizmetler: "Hizmet kartları",
  sektorler: "Sektörler", projeler: "Proje kartları", maliyet: "Maliyet hesaplayıcı", markalar: "Kalite karşılaştırma (markalar)",
  surec: "Süreç adımları", sss: "Sık sorulan sorular", ekip: "Ekip", blog: "Blog yazıları", metin: "Metin + görsel",
  referanslar: "Referanslar (logo şeridi)", cta: "Çağrı bandı", iletisim: "İletişim bilgileri", kesifForm: "Keşif formu", projeDetay: "Proje detayı (sabit)",
  blogDetay: "Yazı detayı (sabit)", araclar: "Araçlar (sabit)", takip: "Proje takip (sabit)"
};

/* 7 Kas: sitedeki sabit yazılar — panelden ("Sabit yazılar" sekmesi) değiştirilebilir; boşsa buradaki varsayılan görünür */
var METINLER = {
  tumProjeler: ["Tüm projeler", "All projects", "Projeler · “Tüm projeler” düğmesi"],
  filtreTumu: ["Tümü", "All", "Projeler · filtre “Tümü” düğmesi"],
  filtreBos: ["Bu kategoride henüz proje yok.", "No projects in this category yet.", "Projeler · filtrede proje yoksa"],
  projeBilgiYok: ["Bilgiler hazırlanıyor", "Details in preparation", "Projeler · konum/yıl girilmemiş proje kartındaki not"],
  projeGorselYok: ["Proje görseli yakında", "Project image coming soon", "Projeler · görseli olmayan projede görünen yazı"],
  tumYazilar: ["Tüm yazılar", "All articles", "Blog · “Tüm yazılar” düğmesi"],
  blogBos: ["Yazılarımız hazırlanıyor; çok yakında burada.", "Our articles are being prepared and will appear here soon.", "Blog · yazı yokken görünen not"],
  blogGorselYok: ["Görsel yakında", "Image coming soon", "Blog · kapak görseli olmayan yazı kartındaki yazı"],
  blogaDon: ["Blog", "Blog", "Blog · yazı sayfasındaki “← Blog” geri bağlantısı"],
  yaziHazirlaniyor: ["Bu yazı hazırlanıyor.", "This article is being prepared.", "Blog · metni boş yazıda görünen not"],
  yaziYok: ["Yazı bulunamadı", "Article not found", "Blog · yazı bulunamazsa başlık"],
  yaziYokDon: ["Bloga dön", "Back to blog", "Blog · yazı bulunamazsa geri bağlantısı"],
  oncekiProje: ["Önceki proje", "Previous project", "Proje detay · “Önceki proje” düğmesi"],
  sonrakiProje: ["Sonraki proje", "Next project", "Proje detay · “Sonraki proje” düğmesi"],
  projelereDon: ["Projeler", "Projects", "Proje detay · geri dönüş bağlantısı"],
  dtProje: ["Proje", "Project", "Proje detay · kategorisi seçilmemiş projede üst etiket"],
  dtAciklamaYok: ["Bu projenin açıklaması, görselleri ve künyesi ofisimizden gelince burada yer alacak.", "The description, images and credits will appear here once provided.", "Proje detay · açıklaması boş projede görünen not"],
  dtKategori: ["Kategori", "Category", "Proje detay · künye “Kategori”"],
  dtKonum: ["Konum", "Location", "Proje detay · künye “Konum”"],
  dtYil: ["Yıl", "Year", "Proje detay · künye “Yıl”"],
  dtAlan: ["Alan", "Area", "Proje detay · künye “Alan”"],
  maliyetNotEt: ["Yaklaşık / ön teklif:", "Approximate / preliminary quote:", "Maliyet · alt not başlığı"],
  mhAlanTipi: ["Alan tipi", "Space type", "Maliyet · 1. adım başlığı"],
  mhAltTip: ["Alt tip", "Subtype", "Maliyet · alt tip listesi başlığı (tipe özel başlık yoksa)"],
  mhSecin: ["Seçin (isteğe bağlı)", "Choose (optional)", "Maliyet · alt tip seçim kutusunun ilk satırı"],
  mhBuyukluk: ["Büyüklük", "Size", "Maliyet · 2. adım başlığı"],
  mhMetrekare: ["Metrekare", "Area", "Maliyet · metrekare etiketi"],
  mhKalite: ["Malzeme kalitesi", "Material quality", "Maliyet · 3. adım başlığı"],
  mhMarkaLink: ["Hangi markaları kullanıyoruz? →", "Which brands do we use? →", "Maliyet · markalar bağlantısı"],
  mhSonuc: ["Yaklaşık ön teklif", "Approximate preliminary quote", "Maliyet · sonuç kutusu başlığı"],
  mhOrnek: ["örnek katsayılar", "sample rates", "Maliyet · “örnek katsayılar” etiketi"],
  mhAlanSatir: ["Alan", "Area", "Maliyet · döküm tablosunda “Alan” satırı"],
  mhKatsayi: ["Alan tipi katsayısı", "Space type factor", "Maliyet · döküm tablosunda katsayı satırı"],
  mhOrta: ["Orta değer", "Midpoint", "Maliyet · döküm tablosunda “Orta değer”"],
  mhWaDugme: ["Ön teklifi WhatsApp'tan gönder", "Send on WhatsApp", "Maliyet · WhatsApp düğmesi"],
  mhKesifDugme: ["Kesin fiyat için keşif iste", "Request a site visit", "Maliyet · keşif düğmesi"],
  mhWaGiris: ["Merhaba, sitenizdeki maliyet hesaplayıcıyı kullandım.", "Hello, I used the cost estimator on your website.", "Maliyet · WhatsApp mesajının ilk satırı"],
  mhWaSon: ["Keşif için görüşebilir miyiz?", "Can we arrange a site visit?", "Maliyet · WhatsApp mesajının son satırı"],
  mhYakinda: ["Hesaplayıcı yakında.", "Estimator coming soon.", "Maliyet · fiyat girilmemişken görünen not"],
  mkMalzeme: ["Malzeme", "Material", "Maliyet · marka tablosu ilk sütun başlığı"],
  mkMarka: ["Marka", "Brand", "Maliyet · marka tablosu hücre etiketi"],
  bilgiAdres: ["Adres", "Address", "İletişim bölümü · “Adres” satırı"],
  bilgiSehir: ["Şehir", "City", "İletişim bölümü · “Şehir” satırı"],
  bilgiTel: ["Telefon", "Phone", "İletişim bölümü ve alt bilgi · “Telefon”"],
  bilgiWa: ["WhatsApp", "WhatsApp", "İletişim bölümü · “WhatsApp” satırı"],
  bilgiEposta: ["E-posta", "Email", "İletişim bölümü · “E-posta” satırı"],
  bilgiSaat: ["Çalışma saatleri", "Opening hours", "İletişim bölümü · “Çalışma saatleri” satırı"],
  bilgiSosyal: ["Sosyal medya", "Social media", "İletişim bölümü · “Sosyal medya” satırı"],
  iletisimWa: ["WhatsApp", "WhatsApp", "İletişim bölümü · WhatsApp düğmesi"],
  haritaBos: ["Ofis adresi gelince harita burada yer alacak.", "A map will appear here once the office address is added.", "İletişim · harita yokken görünen not"],
  formAd: ["Ad soyad", "Full name", "Keşif formu · “Ad soyad”"],
  formTel: ["Telefonunuz", "Your phone", "Keşif formu · “Telefonunuz”"],
  formAlan: ["Alan tipi", "Space type", "Keşif formu · “Alan tipi”"],
  formHizmet: ["Hizmet", "Service", "Keşif formu · “Hizmet”"],
  formKonum: ["Konum (ilçe)", "Location (district)", "Keşif formu · “Konum (ilçe)”"],
  formGun: ["Tercih ettiğiniz gün", "Preferred day", "Keşif formu · “Tercih ettiğiniz gün”"],
  formNotEt: ["Kısa not (isteğe bağlı)", "Short note (optional)", "Keşif formu · “Kısa not”"],
  formKonumOrnek: ["Çankaya, Ankara", "e.g. Çankaya, Ankara", "Keşif formu · “Konum” kutusundaki gri örnek yazı"],
  formWaGiris: ["Merhaba, web sitenizden keşif talep ediyorum.", "Hello, I'd like to request a site visit via your website.", "Keşif formu · WhatsApp mesajının ilk satırı"],
  formGonder: ["WhatsApp'tan gönder", "Send on WhatsApp", "Keşif formu · gönder düğmesi"],
  formAra: ["Ara", "Call", "Keşif formu · “Ara” düğmesi"],
  formKvkk: ["Bilgileriniz yalnızca size dönüş yapmak için kullanılır.", "Your details are used only to get back to you.", "Keşif formu · alt not"],
  formOnizleme: ["Gönderilecek mesaj", "Message preview", "Keşif formu · mesaj önizleme başlığı"],
  takipKod: ["Proje kodu", "Project code", "Proje takip · “Proje kodu”"],
  takipDugme: ["Durumu göster", "Show status", "Proje takip · düğme"],
  takipBos: ["Kodunuzu girin.", "Enter your code.", "Proje takip · başlangıç notu"],
  altSayfalar: ["Sayfalar", "Pages", "Alt bilgi · “Sayfalar” başlığı"],
  altIletisim: ["İletişim", "Contact", "Alt bilgi · “İletişim” başlığı"],
  altAraclar: ["Araçlar", "Tools", "Alt bilgi · “Araçlar” bağlantısı"],
  altTakip: ["Proje takip", "Client portal", "Alt bilgi · “Proje takip” bağlantısı"],
  eklenecek: ["eklenecek", "to be added", "Boş bilgilerin yerinde görünen yazı"],
  atla: ["İçeriğe geç", "Skip to content", "Genel · klavyeyle gezenler için “İçeriğe geç” bağlantısı"],
  anaHizmetRozet: ["Ana hizmet", "Core service", "Hizmetler · öne çıkan hizmet kartındaki rozet"],
  tadilatGorselYok: ["Tadilat görseli yakında", "Renovation image coming soon", "Hizmetler · öne çıkan hizmette görsel yokken görünen yazı"],
  ekipUyesi: ["Ekip üyesi", "Team member", "Hizmetler · ekip kartında adı girilmemiş kişi"],
  aracPlanBaslik: ["Proje süre planlayıcı", "Project timeline planner", "Araçlar · süre planlayıcı başlığı"],
  aracPlanMetin: ["Projenizin türünü ve büyüklüğünü seçin; tahmini takviminiz aşama aşama çıksın.", "Choose your project type and size to see an estimated, phase-by-phase timeline.", "Araçlar · süre planlayıcı açıklaması"],
  aracOsBaslik: ["Önce / sonra cephe", "Facade before / after", "Araçlar · önce/sonra başlığı"],
  aracOsMetin: ["Çizgiyi sürükleyin ya da kaydırıcıyı kullanın.", "Drag the line or use the slider.", "Araçlar · önce/sonra açıklaması"],
  aracRuhsatBaslik: ["Ruhsat belge kontrol listesi", "Building permit checklist", "Araçlar · ruhsat listesi başlığı"],
  aracRuhsatMetin: ["Elinizde olanları işaretleyin; eksikleri tek tıkla bize sorun. Belediyeye göre farklılık gösterebilir.", "Tick what you already have and ask us about the rest.", "Araçlar · ruhsat listesi açıklaması"],
  aracStilBaslik: ["İç mimari stil seçici", "Interior style picker", "Araçlar · stil seçici başlığı"],
  aracStilMetin: ["Bir stil seçin; renk paleti ve önerilen malzemeler çıksın.", "Pick a style to see its colour palette and suggested materials.", "Araçlar · stil seçici açıklaması"],
  aracMenuPlan: ["Süre planlayıcı", "Timeline planner", "Araçlar · üst kısayol “Süre planlayıcı”"],
  aracMenuOs: ["Önce / sonra", "Before / after", "Araçlar · üst kısayol “Önce / sonra”"],
  aracMenuRuhsat: ["Ruhsat listesi", "Permit checklist", "Araçlar · üst kısayol “Ruhsat listesi”"],
  aracMenuStil: ["Stil seçici", "Style picker", "Araçlar · üst kısayol “Stil seçici”"],
  aracMenuMaliyet: ["Maliyet hesaplayıcı", "Cost estimator", "Araçlar · üst kısayol “Maliyet hesaplayıcı”"],
  aracTur: ["Proje türü", "Project type", "Araçlar · süre planlayıcı “Proje türü”"],
  aracAlan: ["Yaklaşık alan (m²)", "Approx. area (m²)", "Araçlar · süre planlayıcı “Yaklaşık alan”"],
  aracKat: ["Kat sayısı", "Number of floors", "Araçlar · süre planlayıcı “Kat sayısı”"],
  aracHizmetler: ["İstediğiniz hizmetler", "Services required", "Araçlar · süre planlayıcı “İstediğiniz hizmetler”"],
  aracTakvim: ["Tahmini takvim", "Estimated timeline", "Araçlar · süre planlayıcı sonuç başlığı"],
  aracTahminNot: ["Tahminidir; arsa, belediye ve onay süreçlerine göre değişir.", "Estimate only; varies with the site and approval processes.", "Araçlar · süre planlayıcı alt notu"],
  aracPlanDugme: ["Bu planı WhatsApp'tan gönder", "Send this plan on WhatsApp", "Araçlar · süre planlayıcı düğmesi"],
  aracOnce: ["ÖNCE", "BEFORE", "Araçlar · önce/sonra “ÖNCE” etiketi"],
  aracSonra: ["SONRA", "AFTER", "Araçlar · önce/sonra “SONRA” etiketi"],
  aracOrnek: ["örnek görsel", "sample image", "Araçlar · “örnek görsel” etiketi"],
  aracHazirlik: ["Hazırlık durumu", "Readiness", "Araçlar · ruhsat listesi sonuç başlığı"],
  aracRuhsatDugme: ["Eksiklerimi sor", "Ask about missing items", "Araçlar · ruhsat listesi düğmesi"],
  aracStilDugme: ["Bu stili konuşalım", "Let's discuss this style", "Araçlar · stil seçici düğmesi"],
  cerezMetin: ["Sitemizde deneyiminizi iyileştirmek ve ziyaretleri ölçmek için çerezler kullanılır.", "We use cookies to improve your experience and measure visits.", "Çerez bandı · varsayılan metin"],
  cerezKabul: ["Kabul et", "Accept", "Çerez bandı · kabul düğmesi"],
  cerezRed: ["Reddet", "Decline", "Çerez bandı · ret düğmesi"],
  cerezLink: ["Çerez politikası", "Cookie policy", "Çerez bandı · politika bağlantısı yazısı"]
};
var SOSYAL = [["instagram", "Instagram"], ["linkedin", "LinkedIn"], ["facebook", "Facebook"], ["youtube", "YouTube"], ["x", "X"], ["tiktok", "TikTok"], ["pinterest", "Pinterest"]];
var WA_MSJ = ["Merhaba, web sitenizden yazıyorum.", "Hello, I'm writing from your website."];

function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function tr(o) { return o == null ? "" : typeof o === "string" ? o : (o.tr || ""); }
function en(o) { return o == null ? "" : typeof o === "string" ? o : (o.en || o.tr || ""); }
function bos(o) { return !tr(o) && !(o && o.en); }
function T(o) { var a = tr(o), b = en(o); if (a === b) return esc(a); return '<span data-l="tr">' + esc(a) + '</span><span data-l="en" lang="en">' + esc(b) + "</span>"; }
function T2(a, b) { return T({ tr: a, en: b }); }
var IC_ = null; /* çizim sırasında geçerli içerik (sabit yazılar için) */
function Mx(k) { var d = METINLER[k], o = ((IC_ || {}).metinler || {})[k] || {}, a = String(tr(o) || "").trim() ? tr(o) : d[0], b = o && typeof o === "object" && String(o.en || "").trim() ? o.en : d[1]; return [a, b]; }
function M(k) { var x = Mx(k); return T2(x[0], x[1]); }
function bek() { return '<span class="bekliyor">' + M("eklenecek") + "</span>"; }
/* uzun metin: boş satır = paragraf, "## " = ara başlık, "- " = madde */
function paragraf(s) {
  var out = [], liste = [];
  function kapa() { if (liste.length) { out.push("<ul>" + liste.join("") + "</ul>"); liste = []; } }
  String(s || "").split(/\n\s*\n/).forEach(function (blok) {
    blok.split("\n").forEach(function (sat) {
      var t = sat.trim(); if (!t) return;
      if (/^- /.test(t)) { liste.push("<li>" + esc(t.slice(2)) + "</li>"); return; }
      kapa();
      if (/^## /.test(t)) out.push("<h2>" + esc(t.slice(3)) + "</h2>"); else out.push("<p>" + esc(t) + "</p>");
    });
    kapa();
  });
  return out.join("");
}
function P(o) { var a = tr(o), b = en(o); if (a === b) return paragraf(a); return '<div data-l="tr">' + paragraf(a) + '</div><div data-l="en" lang="en">' + paragraf(b) + "</div>"; }
function url(u) { u = String(u || "").trim(); return /^(javascript|data):/i.test(u) ? "#" : u; }

/* renkler */
function hex(h) { h = String(h || "").replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&"); var n = parseInt(h, 16); return isNaN(n) ? null : [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function karart(h, k) { var c = hex(h); if (!c) return h; return "#" + c.map(function (x) { return ("0" + Math.round(x * (1 - k)).toString(16)).slice(-2); }).join(""); }
function guvenliRenk(h, yedek) { return /^#[0-9a-fA-F]{3,6}$/.test(h || "") ? h : yedek; }
function renkCSS(ic) {
  var r = (ic.marka && ic.marka.renkler) || {};
  var y = guvenliRenk(r.yesil, "#253925"), b = guvenliRenk(r.bej, "#C2B59B"), z = guvenliRenk(r.zemin, "#F4F2EE"), t = guvenliRenk(r.yazi, "#161816");
  return ":root{--yesil:" + y + ";--yesil2:" + karart(y, .3) + ";--bej:" + b + ";--bej2:" + karart(b, .42) + ";--zemin:" + z + ";--yazi:" + t + "}" + EK_CSS;
}

/* 7 Kas panel eklentileri: yalnız panelden açılan özellikler bu sınıfları kullanır (varsayılan görünümü etkilemez) */
var KART_ = ":is(.kart,.pk,.panelk,.kk-tablo,.mh-form,.mh-sonuc,.form,.bos-kutu,.cipler,.ref-serit,.harita)";
var EK_CSS = ".bn-acik{color:#efe9dc}.bn-acik :is(h1,h2,h3,summary,b):not(" + KART_ + " *){color:#fff}.bn-acik :is(.acik,p,small,li,span):not(" + KART_ + " *):not(.dg *){color:rgba(239,233,220,.86)}.bn-acik .etiket{color:var(--bej)!important}.bn-acik .dg.i{color:#fff;border-color:rgba(255,255,255,.7)}" +
  ".bn-koyu{color:var(--yazi)}.bn-koyu :is(h1,h2,h3,summary,b):not(" + KART_ + " *){color:var(--yazi)!important}.bn-koyu :is(.acik,p,small,li):not(" + KART_ + " *){color:var(--soluk)!important}.bn-koyu .etiket{color:var(--bej2)!important}.bn-koyu .dg.i{color:var(--yazi);border-color:var(--yazi)}" +
  ".bn-zg{background-size:cover;background-position:center}.dg[data-ozel]:hover{filter:brightness(.9)}.dg.i[data-ozel]:hover{background:transparent;filter:none;opacity:.75}" +
  ".bn-duyuru{background:var(--yesil);color:#fff;text-align:center;font-size:.88rem;font-weight:600;padding:8px 16px;line-height:1.45}.bn-duyuru a{color:inherit;text-decoration:underline;text-underline-offset:3px}" +
  ".yuzen.sol{right:auto;left:16px}.bn-cerez{position:fixed;left:16px;right:88px;bottom:16px;max-width:560px;z-index:60;background:#1d201c;color:#e9e3d6;padding:16px 18px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-size:.9rem}.bn-cerez[hidden]{display:none}.bn-cerez a{color:#fff}.bn-cerez .dgs{margin-top:12px;gap:8px}.bn-cerez .dg{min-height:40px;padding:8px 16px;font-size:.9rem;background:var(--bej);border-color:var(--bej);color:#1d1d1b}.bn-cerez .dg.i{background:transparent;color:#fff;border-color:rgba(255,255,255,.6)}.yuzen.sol+.bn-cerez{left:88px;right:16px}";
function cssUrl(u) { return String(u).replace(/['"()\\\s<>]/g, function (c) { return "%" + ("0" + c.charCodeAt(0).toString(16).toUpperCase()).slice(-2); }); }
function sayfaDosya(id) { return (SAYFALAR[id] || {}).dosya || "index.html"; }
function dugme(ic, ad, sinif) {
  var d = (ic.dugmeler || {})[ad]; if (!d || bos(d.etiket)) return "";
  // 7 Kas: panelden dolgu/yazı/çerçeve rengi ve yeni sekmede açma (boşsa eski görünüm)
  var st = "";
  if (sinif === "i") { var c = guvenliRenk(d.cerceveRenk, ""); if (c) st = "color:" + c + ";border-color:" + c; }
  else { var r = guvenliRenk(d.renk, ""), y = guvenliRenk(d.yaziRenk, ""); if (r) st = "background:" + r + ";border-color:" + r; if (y) st += (st ? ";" : "") + "color:" + y; }
  return '<a class="dg' + (sinif ? " " + sinif : "") + '" href="' + esc(url(d.hedef)) + '"' + (st ? ' style="' + st + '" data-ozel=""' : "") + (d.yeniSekme ? ' target="_blank" rel="noopener"' : "") + ">" + T(d.etiket) + "</a>";
}
function logo(ic, sinif) {
  var m = ic.marka || {}, src = url(m.logo || "assets/bensay-kelime.png");
  if (m.logoMaske !== false) return '<span class="mark' + (sinif ? " " + sinif : "") + '" role="img" aria-label="' + esc(m.ad || "") + '" style="-webkit-mask-image:url(\'' + esc(src) + '\');mask-image:url(\'' + esc(src) + '\')"></span>';
  return '<img class="mark-img' + (sinif ? " " + sinif : "") + '" src="' + esc(src) + '" alt="' + esc(m.ad || "") + '">';
}
function waLink(ic) { return String((ic.iletisim || {}).wa || "").replace(/\D/g, ""); }

/* ---------- üst / alt ---------- */
function ust(ic, sayfa) {
  IC_ = ic; var dosya = sayfaDosya(sayfa), m = ic.marka || {};
  var alt = (m.altSatirlar || []).filter(function (x) { return !bos(x); }).map(function (x) { return "<span>" + T(x) + "</span>"; }).join("");
  var nav = (ic.menu || []).filter(function (x) { return x.gorunur !== false && !bos(x.ad); }).map(function (x) {
    var h = String(x.hedef || ""), akt = h.split("#")[0] === dosya && h.indexOf("#") < 0;
    return '<a href="' + esc(url(h)) + '"' + (akt ? ' aria-current="page"' : "") + ">" + T(x.ad) + "</a>";
  }).join("");
  var serit = (ic.site && ic.site.yayinda) ? "" : '<div class="onizleme" role="note">' + T2("Önizleme — yayın öncesi", "Preview — pre-launch") + "</div>";
  return serit + duyuru(ic) + '<header class="ust"><div class="kap">' +
    '<a class="logo" href="index.html" aria-label="' + esc(m.unvan || m.ad || "") + '">' + logo(ic) + (alt ? '<span class="logo-alt">' + alt + "</span>" : "") + "</a>" +
    '<nav class="menu" id="menu" aria-label="Ana menü">' + nav + dugme(ic, "kesif") + "</nav>" +
    ((ic.site || {}).dil2 !== false ? '<button class="dil" id="dil" type="button" aria-label="Switch to English">EN</button>' : "") +
    '<button class="ac-kapa" id="menuDg" type="button" aria-controls="menu" aria-expanded="false" aria-label="Menü" data-al-en="Menu">☰</button>' +
    "</div></header>";
}
// 7 Kas: panelden duyuru şeridi (kapalıysa hiçbir şey çizilmez)
function duyuru(ic) {
  var d = ic.duyuru || {}; if (!d.ac || bos(d.metin)) return "";
  if (d.bitis && /^\d{4}-\d{2}-\d{2}$/.test(d.bitis) && new Date().toISOString().slice(0, 10) > d.bitis) return "";
  var z = guvenliRenk(d.zemin, ""), y = guvenliRenk(d.yazi, ""), st = (z ? "background:" + z : "") + (z && y ? ";" : "") + (y ? "color:" + y : "");
  var ic_ = d.link ? '<a href="' + esc(url(d.link)) + '"' + (/^https?:/i.test(d.link) ? ' target="_blank" rel="noopener"' : "") + ">" + T(d.metin) + "</a>" : T(d.metin);
  return '<div class="bn-duyuru" role="note"' + (st ? ' style="' + st + '"' : "") + ">" + ic_ + "</div>";
}
function sosyalListe(il) { return SOSYAL.filter(function (s) { return il[s[0]]; }).map(function (s) { return '<a href="' + esc(url(il[s[0]])) + '" target="_blank" rel="noopener">' + s[1] + "</a>"; }); }
function waMesaj(ic) { var w = (ic.waDugme || {}).mesaj, a = String(tr(w) || "").trim() ? tr(w) : WA_MSJ[0], b = w && typeof w === "object" && String(w.en || "").trim() ? w.en : WA_MSJ[1]; return [a, b]; }
function waAttr(ic) { var m = waMesaj(ic); return 'data-wa="' + esc(m[0]) + '" data-wa-en="' + esc(m[1]) + '"'; }
function cerez(ic) {
  var c = ic.cerez || {}; if (!c.ac) return "";
  var t = bos(c.metin) ? M("cerezMetin") : T(c.metin);
  return '<div class="bn-cerez" id="bnCerez" role="region" aria-label="Çerez bildirimi" data-al-en="Cookie notice" hidden><p>' + t +
    (c.link ? ' <a href="' + esc(url(c.link)) + '">' + M("cerezLink") + "</a>" : "") + '</p><div class="dgs"><button class="dg" type="button" data-cerez="kabul">' + M("cerezKabul") + "</button>" +
    (c.redDugme ? '<button class="dg i" type="button" data-cerez="red">' + M("cerezRed") + "</button>" : "") + "</div></div>";
}
// 7 Kas: telefonu "0542 384 06 76" biçiminde göster, bağlantı +90 ile; ikinci numara (tel2) desteği
function telLink(n) {
  if (!n) return "";
  var d = String(n).replace(/\D/g, ""), g = n;
  if (d.length === 12 && d.indexOf("90") === 0) d = "0" + d.slice(2);
  if (d.length === 10 && d.charAt(0) !== "0") d = "0" + d;
  if (d.length === 11 && d.charAt(0) === "0") g = d.slice(0, 4) + " " + d.slice(4, 7) + " " + d.slice(7, 9) + " " + d.slice(9);
  var h = d.length === 11 && d.charAt(0) === "0" ? "+90" + d.slice(1) : String(n).replace(/\s/g, "");
  return '<a href="tel:' + esc(h) + '">' + esc(g) + "</a>";
}
function telHepsi(il) { return [telLink(il.tel), telLink(il.tel2)].filter(Boolean).join("<br>"); }
function alt(ic) {
  var m = ic.marka || {}, il = ic.iletisim || {}; IC_ = ic;
  var tel = telHepsi(il) || bek();
  var sos = sosyalListe(il).map(function (a) { return "<li>" + a + "</li>"; }).join("");
  var sayfalar = (ic.menu || []).filter(function (x) { return x.gorunur !== false && !bos(x.ad); }).slice(1).map(function (x) { return '<li><a href="' + esc(url(x.hedef)) + '">' + T(x.ad) + "</a></li>"; }).join("") +
    '<li><a href="araclar.html">' + M("altAraclar") + '</a></li><li><a href="takip.html">' + M("altTakip") + "</a></li>";
  return '<footer><div class="kap"><div class="ust-alt">' +
    "<div>" + logo(ic) + '<p style="margin-top:12px;max-width:360px">' + T(m.altMetin) + "</p></div>" +
    "<div><b>" + M("altSayfalar") + '</b><ul style="margin-top:8px">' + sayfalar + "</ul></div>" +
    "<div><b>" + M("altIletisim") + '</b><ul style="margin-top:8px"><li>' + M("bilgiTel") + ": " + tel + "</li>" +
    (il.eposta ? '<li><a href="mailto:' + esc(il.eposta) + '">' + esc(il.eposta) + "</a></li>" : "") + "<li>" + esc(il.sehir || "Ankara") + "</li>" + sos + "</ul></div>" +
    '</div><div class="son"><span>© ' + new Date().getFullYear() + " " + esc(m.unvan || m.ad || "") + "</span><span>" + T2("tasarım", "design") + ': <a href="https://dijitabela.com" target="_blank" rel="noopener">Dijitabela</a></span></div></div></footer>' +
    ((ic.waDugme || {}).gizle ? "" : '<div class="yuzen' + ((ic.waDugme || {}).konum === "sol" ? " sol" : "") + '"><a href="#" ' + waAttr(ic) + ' aria-label="WhatsApp ile yazın" data-al-en="Message us on WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg></a></div>') + cerez(ic);
}

/* ---------- bölümler ---------- */
var EV_SVG = '<svg class="cizgi-ev" viewBox="0 0 400 300" aria-hidden="true"><path d="M10 290h380M40 290V150L200 40l160 110v140M120 290V200h60v90M240 170h70v50h-70zM200 40V10M90 120h220"/><path d="M40 150h320" stroke-dasharray="4 6"/></svg>';
var KUCUK_EV = '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M8 82h104M18 82V40l42-30 42 30v42M42 82V56h20v26M74 48h16v14H74z"/><path d="M60 10v-6"/></svg>';
function yakinda(k) { return '<div class="yakinda">' + KUCUK_EV + "<span>" + M(k || "blogGorselYok") + "</span></div>"; }
/* 8 Kas: panelde değiştirilmiş sabit yazıyı veri özniteliği olarak ver (değişmemişse hiçbir şey eklenmez, HTML aynen kalır) */
function ozelAttr(k, ad) { var d = METINLER[k], x = Mx(k); return x[0] === d[0] && x[1] === d[1] ? "" : " data-" + ad + '="' + esc(x[0]) + '" data-' + ad + '-en="' + esc(x[1]) + '"'; }
function bas(b) {
  return (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") + (bos(b.baslik) ? "" : "<h2>" + T(b.baslik) + "</h2>") +
    (bos(b.metin) ? "" : '<p class="acik">' + T(b.metin) + "</p>");
}
function no(i) { return (i < 9 ? "0" : "") + (i + 1); }
function katAd(ic, id) { var k = (ic.projeKategorileri || []).filter(function (x) { return x.id === id; })[0]; return k ? k.ad : null; }
function projeKart(ic, p, i) {
  var g = (p.gorseller || [])[0], ad = bos(p.ad) ? { tr: "Proje " + no(i), en: "Project " + no(i) } : p.ad, k = katAd(ic, p.kategori);
  var alt_ = [k ? T(k) : "", esc(p.konum || ""), esc(p.yil || "")].filter(Boolean).join(" · ") || M("projeBilgiYok");
  return '<a class="pk" href="proje.html?p=' + esc(p.id) + '" data-kat="' + esc(p.kategori || "") + '"><div class="g">' +
    (g ? '<img src="' + esc(url(g)) + '" alt="' + esc(tr(ad)) + '" loading="lazy" width="800" height="600">' : yakinda("projeGorselYok")) +
    '</div><div class="m"><b>' + T(ad) + "</b><small>" + alt_ + "</small></div></a>";
}
function hizmetKart(h, i) {
  return '<article class="kart' + (h.oneCikan ? " one" : "") + '">' + (h.gorsel ? '<img class="kg" src="' + esc(url(h.gorsel)) + '" alt="' + esc(tr(h.baslik)) + '" loading="lazy">' : "") +
    '<div class="no">' + no(i) + (h.oneCikan ? ' · ' + M("anaHizmetRozet") : "") + "</div><h3>" + T(h.baslik) + '</h3><p class="acik" style="font-size:.97rem">' + T(h.ozet) + "</p>" +
    ((h.maddeler || []).length ? "<ul>" + h.maddeler.map(function (x) { return "<li>" + T(x) + "</li>"; }).join("") + "</ul>" : "") + "</article>";
}
function blogKart(y) {
  return '<a class="pk yk" href="yazi.html?y=' + esc(y.id) + '"><div class="g">' + (y.gorsel ? '<img src="' + esc(url(y.gorsel)) + '" alt="' + esc(tr(y.baslik)) + '" loading="lazy">' : yakinda()) +
    '</div><div class="m">' + (y.tarih ? "<small>" + esc(y.tarih) + "</small>" : "") + "<b>" + T(y.baslik) + "</b>" + (bos(y.ozet) ? "" : "<small>" + T(y.ozet) + "</small>") + "</div></a>";
}
function markaHucre(mk) {
  mk = mk || {};
  var ic = mk.logo ? '<img src="' + esc(url(mk.logo)) + '" alt="' + esc(mk.ad || "Marka") + '" loading="lazy">' + (mk.ad ? "<b>" + esc(mk.ad) + "</b>" : "") : mk.ad ? "<b>" + esc(mk.ad) + "</b>" : bek();
  return '<td><small class="mk-et">' + M("mkMarka") + '</small><span class="mk">' + ic + "</span></td>";
}
function tl(n) { return Math.round(Number(n) || 0).toLocaleString("tr-TR"); }

var BOLUM = {
  kahraman: function (ic, b) {
    // 7 Kas: panelden yazı renkleri, görsel örtüsü ve yazı gölgesi (alanlar boşsa eski görünüm aynen kalır)
    var KR = { beyaz: "#fff", yesil: "var(--yesil)", bej: "var(--bej)", koyu: "#161816" };
    function kr(v, o) { return v === "ozel" ? guvenliRenk(o, "") : (KR[v] || ""); }
    var cE = kr(b.renkEtiket, b.renkEtiketOzel), cB = kr(b.renkBaslik, b.renkBaslikOzel), cM = kr(b.renkMetin, b.renkMetinOzel);
    var gol = b.golge ? ";text-shadow:0 1px 3px rgba(0,0,0,.35)" : "";
    var st = function (c, kutu) { var k = kutu ? ";background:rgba(244,242,238,.9);padding:6px 12px;border-radius:2px" : ""; return c || gol || k ? ' style="' + (c ? "color:" + c : "") + (kutu ? "" : gol) + k + '"' : ""; };
    var ortu = b.gorsel && Number(b.ortu) > 0 ? '<div class="kah-ortu" style="position:absolute;inset:0;z-index:1;background:' + (b.ortuRenk === "yesil" ? "var(--yesil)" : "#000") + ";opacity:" + Math.min(80, Number(b.ortu)) / 100 + '"></div>' : "";
    return '<section class="kah' + (b.gorsel ? " gorselli" : "") + '" id="' + esc(b.id) + '">' + (b.gorsel ? '<img class="kah-g" src="' + esc(url(b.gorsel)) + '" alt="" fetchpriority="high">' : "") + ortu +
      '<div class="kap">' + (b.gorsel || b.evGizle ? "" : EV_SVG) + (bos(b.etiket) ? "" : '<div class="etiket"' + st(cE, b.etiketKutu) + ">" + T(b.etiket) + "</div>") + "<h1" + st(cB) + ">" + T(b.baslik) + "</h1>" + (bos(b.metin) ? "" : "<p" + st(cM) + ">" + T(b.metin) + "</p>") +
      '<div class="dgs">' + dugme(ic, "kesif") + dugme(ic, "planla", "i") + "</div></div></section>";
  },
  sayfaBasi: function (ic, b) {
    return '<section class="sayfa-bas" id="' + esc(b.id) + '"><div class="kap">' + (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") + "<h1>" + T(b.baslik) + "</h1>" + (bos(b.metin) ? "" : '<p class="acik">' + T(b.metin) + "</p>") + "</div></section>";
  },
  anaHizmet: function (ic, b) {
    var h = (ic.hizmetler || []).filter(function (x) { return x.id === b.hizmet; })[0] || (ic.hizmetler || []).filter(function (x) { return x.oneCikan; })[0];
    if (!h) return "";
    var g = b.gorsel || h.gorsel;
    return '<section class="bol ana-h" id="' + esc(b.id) + '"><div class="kap ah"><div>' + (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") +
      "<h2>" + T(h.baslik) + '</h2><p class="acik">' + T(h.ozet) + "</p>" + ((h.maddeler || []).length ? '<ol class="ah-l">' + h.maddeler.map(function (x) { return "<li>" + T(x) + "</li>"; }).join("") + "</ol>" : "") +
      '<div class="dgs">' + dugme(ic, "planla") + dugme(ic, "kesif", "i") + "</div></div>" +
      '<div class="ah-g">' + (g ? '<img src="' + esc(url(g)) + '" alt="' + esc(tr(h.baslik)) + '" loading="lazy">' : yakinda("tadilatGorselYok")) + "</div></div></section>";
  },
  hizmetler: function (ic, b) {
    var L = (ic.hizmetler || []).slice();
    if (b.sadeceDiger) L = L.filter(function (h) { return !h.oneCikan; });
    else L.sort(function (a, c) { return (c.oneCikan ? 1 : 0) - (a.oneCikan ? 1 : 0); });
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="hz' + (L.length === 3 ? " uc3" : "") + '">' + L.map(hizmetKart).join("") + "</div></div></section>";
  },
  sektorler: function (ic, b) {
    return '<section class="bol sek" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + (ic.sektorler || []).map(function (g) {
      return '<div class="sek-g"><h3>' + T(g.ad) + '</h3><ul class="cipler">' + (g.liste || []).map(function (x) { return "<li>" + T(x) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div></section>";
  },
  projeler: function (ic, b) {
    var P = ic.projeler || [], lim = Number(b.limit) || P.length;
    var fl = b.filtre ? '<div class="filtre" id="filtre" role="group" aria-label="Kategori"><button type="button" data-f="hepsi" aria-pressed="true">' + M("filtreTumu") + "</button>" +
      (ic.projeKategorileri || []).map(function (k) { return '<button type="button" data-f="' + esc(k.id) + '" aria-pressed="false">' + T(k.ad) + "</button>"; }).join("") + "</div>" : "";
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + fl + '<div class="izg" id="projeIzg">' + P.slice(0, lim).map(function (p, i) { return projeKart(ic, p, i); }).join("") + "</div>" +
      '<p class="acik bos-not" id="filtreBos" hidden>' + M("filtreBos") + "</p>" +
      (lim < P.length || (b.limit && sayfaVar(ic, "projeler")) ? '<div class="dgs"><a class="dg i" href="projelerimiz.html">' + M("tumProjeler") + " →</a></div>" : "") + "</div></section>";
  },
  maliyet: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="mh" id="maliyetHesap" data-bolum="' + esc(b.id) + '"><noscript><p class="acik">' + T2("Hesaplayıcı için JavaScript gerekir.", "The estimator requires JavaScript.") + "</p></noscript></div>" +
      '<p class="not mh-not"><b>' + M("maliyetNotEt") + "</b> " + T((ic.maliyet || {}).not) + "</p></div></section>";
  },
  markalar: function (ic, b) {
    var M_ = T2.apply(null, Mx("mkMalzeme")), M = ic.maliyet || {}, K = M.kaliteler || [];
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="kk-tablo"><table><thead><tr><th scope="col">' + M_ + "</th>" +
      K.map(function (k) { return '<th scope="col"><button type="button" class="kk-sec" data-kalite="' + esc(k.id) + '"><b>' + T(k.ad) + "</b><small>" + T(k.aciklama) + "</small></button></th>"; }).join("") + "</tr></thead><tbody>" +
      (M.malzemeler || []).map(function (m) { return '<tr><th scope="row">' + T(m.ad) + "</th>" + K.map(function (k) { return markaHucre((m.markalar || {})[k.id]); }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div></div></section>";
  },
  surec: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="surec">' + (ic.surec || []).map(function (s) { return "<div><b>" + T(s.ad) + "</b><p>" + T(s.metin) + "</p></div>"; }).join("") + "</div></div></section>";
  },
  sss: function (ic, b) {
    return '<section class="bol sss" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + (ic.sss || []).map(function (s) { return "<details><summary>" + T(s.soru) + "</summary>" + P(s.cevap) + "</details>"; }).join("") + "</div></section>";
  },
  ekip: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="ekip">' + (ic.ekip || []).map(function (k) {
      var bas_ = (k.ad || "").split(/\s+/).map(function (x) { return x.charAt(0); }).join("").slice(0, 2);
      return '<article class="kart" style="padding:0">' + (k.foto ? '<img class="foto" src="' + esc(url(k.foto)) + '" alt="' + esc(k.ad) + '" loading="lazy">' : '<div class="foto" aria-hidden="true">' + esc(bas_ || "+") + "</div>") +
        '<div style="padding:18px"><b>' + (k.ad ? esc(k.ad) : M("ekipUyesi")) + "</b><br><small>" + (bos(k.unvan) ? bek() : T(k.unvan)) + "</small></div></article>";
    }).join("") + "</div></div></section>";
  },
  blog: function (ic, b) {
    var Y = (ic.blog || []).filter(function (y) { return y.yayinda; }), lim = Number(b.limit) || Y.length;
    if (!Y.length && Number(b.limit)) return "";  /* özet bölümü: yayında yazı yoksa gizli */
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + (Y.length ? '<div class="izg">' + Y.slice(0, lim).map(blogKart).join("") + "</div>" +
      (b.limit && Y.length > lim ? '<div class="dgs"><a class="dg i" href="blog.html">' + M("tumYazilar") + " →</a></div>" : "") :
      '<div class="bos-kutu">' + M("blogBos") + "</div>") + "</div></section>";
  },
  metin: function (ic, b) {
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap ' + (b.gorsel ? "ah" : "iki") + '"><div>' + (bos(b.etiket) ? "" : '<div class="etiket">' + T(b.etiket) + "</div>") + (bos(b.baslik) ? "" : "<h2>" + T(b.baslik) + "</h2>") + "</div>" +
      '<div><div class="acik metin">' + P(b.metin) + "</div>" + (b.dugme ? '<div class="dgs">' + dugme(ic, b.dugme) + "</div>" : "") + "</div>" +
      (b.gorsel ? '<div class="ah-g"><img src="' + esc(url(b.gorsel)) + '" alt="" loading="lazy"></div>' : "") + "</div></section>";
  },
  referanslar: function (ic, b) {
    var L = (ic.referanslar || []).filter(function (r) { return r && r.logo; });
    if (!L.length) return "";  /* logo yoksa bölüm hiç görünmez (yer tutucu yok) */
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="ref-serit">' + L.map(function (r) {
      var img = '<img src="' + esc(url(r.logo)) + '" alt="' + esc(r.ad || "Referans") + '" loading="lazy">';
      return r.link ? '<a href="' + esc(url(r.link)) + '" target="_blank" rel="noopener" title="' + esc(r.ad || "") + '">' + img + "</a>" : '<div title="' + esc(r.ad || "") + '">' + img + "</div>";
    }).join("") + "</div></div></section>";
  },
  cta: function (ic, b) {
    return '<section class="cta" id="' + esc(b.id) + '"><div class="kap"><h2>' + T(b.baslik) + "</h2>" + (bos(b.metin) ? "" : '<p style="max-width:560px;color:rgba(239,233,220,.85)">' + T(b.metin) + "</p>") +
      '<div class="dgs">' + dugme(ic, "kesif") + dugme(ic, "planla", "i") + "</div></div></section>";
  },
  iletisim: function (ic, b) {
    var il = ic.iletisim || {};
    function s(k, v) { return "<li><span>" + M(k) + "</span><span>" + (v || bek()) + "</span></li>"; }
    var sos = sosyalListe(il).join(" · ");
    var harita = /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(il.harita || "") ? '<iframe class="harita" src="' + esc(il.harita) + '" loading="lazy" title="Harita" referrerpolicy="no-referrer-when-downgrade"></iframe>'
      : '<div class="harita">' + M("haritaBos") + "</div>";
    return '<section class="bol ilk" id="' + esc(b.id) + '"><div class="kap iki"><div>' + bas(b) + '<ul class="bilgi">' + s("bilgiAdres", esc(il.adres)) + s("bilgiSehir", esc(il.sehir || "Ankara")) +
      s("bilgiTel", telHepsi(il)) + s("bilgiWa", esc(il.wa)) +
      s("bilgiEposta", il.eposta ? '<a href="mailto:' + esc(il.eposta) + '">' + esc(il.eposta) + "</a>" : "") + s("bilgiSaat", bos(il.saatler) ? "" : T(il.saatler)) +
      s("bilgiSosyal", sos) + '</ul><div class="dgs">' + dugme(ic, "kesif") + '<a class="dg i" href="#" ' + waAttr(ic) + ">" + M("iletisimWa") + "</a></div></div>" + harita + "</div></section>";
  },
  kesifForm: function (ic, b) {
    var il = ic.iletisim || {};
    var turler = (ic.maliyet && ic.maliyet.tipler || []).map(function (t) { return "<option>" + esc(tr(t.ad)) + (en(t.ad) !== tr(t.ad) ? " / " + esc(en(t.ad)) : "") + "</option>"; }).join("");
    var hizm = (ic.hizmetler || []).map(function (h) { return "<option>" + esc(tr(h.baslik)) + "</option>"; }).join("");
    return '<section class="bol" id="' + esc(b.id) + '"><div class="kap">' + bas(b) + '<div class="arac"><form class="form" id="randevuForm"' + ozelAttr("formWaGiris", "giris") + ' novalidate>' +
      '<label for="rAd">' + M("formAd") + '</label><input id="rAd" autocomplete="name" required>' +
      '<label for="rTel">' + M("formTel") + '</label><input id="rTel" type="tel" autocomplete="tel" inputmode="tel">' +
      '<label for="rKonu">' + M("formAlan") + '</label><select id="rKonu">' + turler + "</select>" +
      '<label for="rHiz">' + M("formHizmet") + '</label><select id="rHiz">' + hizm + "</select>" +
      '<label for="rKonum">' + M("formKonum") + '</label><input id="rKonum" placeholder="' + esc(Mx("formKonumOrnek")[0]) + '" data-ph-en="' + esc(Mx("formKonumOrnek")[1]) + '">' +
      '<label for="rGun">' + M("formGun") + '</label><input id="rGun" type="date">' +
      '<label for="rNot">' + M("formNotEt") + '</label><textarea id="rNot"></textarea>' +
      '<div class="dgs"><a class="dg wa" id="rGonder" href="#" target="_blank" rel="noopener">' + M("formGonder") + "</a>" +
      (il.tel ? '<a class="dg i" href="tel:' + esc(il.tel.replace(/\s/g, "")) + '">' + M("formAra") + "</a>" : "") + "</div>" +
      '<p class="not">' + M("formKvkk") + "</p></form>" +
      '<div class="panelk"><div class="etiket">' + M("formOnizleme") + '</div><div class="mesaj" id="rMesaj" aria-live="polite"></div></div></div></div></section>';
  },
  projeDetay: function (ic, b, ctx) {
    var P = ic.projeler || [], id = ctx && ctx.p, i = Math.max(0, P.map(function (x) { return x.id; }).indexOf(id)), p = P[i] || {};
    var ad = bos(p.ad) ? { tr: "Proje " + no(i), en: "Project " + no(i) } : p.ad, k = katAd(ic, p.kategori);
    var G = (p.gorseller || []).length ? p.gorseller : [0, 0, 0], o = P[(i - 1 + P.length) % P.length] || {}, s = P[(i + 1) % P.length] || {};
    return '<section class="sayfa-bas" id="projeDetay"><div class="kap"><a href="projelerimiz.html" style="font-size:.9rem;color:var(--soluk)">← ' + M("projelereDon") + "</a>" +
      '<div class="dt-ust" style="margin-top:18px"><div><div class="etiket">' + (k ? T(k) : M("dtProje")) + "</div><h1>" + T(ad) + '</h1><div class="acik" style="margin-top:14px">' +
      (bos(p.ozet) ? "<p>" + M("dtAciklamaYok") + "</p>" : P(p.ozet)) + "</div></div>" +
      '<div class="kunye"><div><small>' + M("dtKategori") + "</small><span>" + (k ? T(k) : bek()) + "</span></div><div><small>" + M("dtKonum") + "</small><span>" + (p.konum ? esc(p.konum) : bek()) +
      "</span></div><div><small>" + M("dtYil") + "</small><span>" + (p.yil ? esc(p.yil) : bek()) + "</span></div><div><small>" + M("dtAlan") + "</small><span>" + (p.alan ? esc(p.alan) : bek()) + "</span></div></div></div>" +
      '<div class="galeri">' + G.map(function (g) { return g ? '<img src="' + esc(url(g)) + '" alt="' + esc(tr(ad)) + '" loading="lazy">' : yakinda("projeGorselYok"); }).join("") + "</div>" +
      '<div class="gezin"><a class="dg i" href="proje.html?p=' + esc(o.id || "") + '">← ' + M("oncekiProje") + '</a><a class="dg i" href="proje.html?p=' + esc(s.id || "") + '">' + M("sonrakiProje") + " →</a></div></div></section>";
  },
  blogDetay: function (ic, b, ctx) {
    var Y = (ic.blog || []).filter(function (y) { return y.yayinda || (ctx && ctx.onizleme); }), y = Y.filter(function (x) { return x.id === (ctx && ctx.y); })[0] || Y[0];
    if (!y) return '<section class="sayfa-bas"><div class="kap"><h1>' + M("yaziYok") + '</h1><p class="acik"><a href="blog.html">' + M("yaziYokDon") + "</a></p></div></section>";
    return '<article class="sayfa-bas yazi"><div class="kap dar"><a href="blog.html" style="font-size:.9rem;color:var(--soluk)">← ' + M("blogaDon") + '</a>' + (y.tarih ? '<div class="etiket" style="margin-top:18px">' + esc(y.tarih) + "</div>" : "") +
      "<h1>" + T(y.baslik) + "</h1>" + (bos(y.ozet) ? "" : '<p class="acik" style="margin-top:14px">' + T(y.ozet) + "</p>") +
      (y.gorsel ? '<img class="yazi-g" src="' + esc(url(y.gorsel)) + '" alt="' + esc(tr(y.baslik)) + '">' : "") + '<div class="govde">' + (bos(y.govde) ? "<p>" + M("yaziHazirlaniyor") + "</p>" : P(y.govde)) + "</div></div></article>";
  },
  takip: function () {
    return '<section class="bol ilk" style="padding-top:0"><div class="kap arac" style="margin-top:0"><div class="form"><label for="kod">' + M("takipKod") +
      '</label><input id="kod" placeholder="DEMO-2481" autocomplete="off"><button class="dg" id="kodBak" type="button" style="margin-top:14px">' + M("takipDugme") +
      '</button></div><div class="panelk portal" id="portal" aria-live="polite"><p class="acik">' + M("takipBos") + "</p></div></div></section>";
  },
  araclar: function (ic, b) {
    b = b || {}; var gOnce = url(b.onceGorsel) || "img/once.jpg", gSonra = url(b.sonraGorsel) || "img/sonra.jpg";
    function cb(v, a, c, x) { return '<label><input type="checkbox" value="' + v + '"' + (x ? " checked" : "") + ">" + T2(a, c) + "</label>"; }
    var BELGE = [["Tapu fotokopisi", "Copy of title deed"], ["İmar durumu belgesi", "Zoning status certificate"], ["Aplikasyon krokisi", "Plot application sketch"], ["Zemin etüdü raporu", "Geotechnical survey report"],
      ["Malik kimlik / vekâletname", "Owner ID / power of attorney"], ["Varsa eski ruhsat ve projeler", "Previous permits and drawings, if any"], ["Hisseli parselde muvafakatname", "Co-owner consent (shared plots)"], ["Yapı denetim sözleşmesi", "Building inspection contract"]];
    return '<div class="kap"><div class="arac-menu"><a href="#planlayici">' + M("aracMenuPlan") + '</a><a href="#once-sonra">' + M("aracMenuOs") + '</a><a href="#ruhsat">' + M("aracMenuRuhsat") +
      '</a><a href="#stil">' + M("aracMenuStil") + '</a><a href="maliyet.html">' + M("aracMenuMaliyet") + "</a></div></div>" +
      '<section class="bol" id="planlayici" style="margin-top:40px"><div class="kap"><div class="etiket">01</div><h2>' + M("aracPlanBaslik") + '</h2><p class="acik">' + M("aracPlanMetin") +
      '</p><div class="arac"><div class="form"><label for="tur">' + M("aracTur") + '</label><select id="tur"><option value="konut">Konut / Apartment</option><option value="villa">Villa / Detached house</option><option value="ticari">Ofis, ticari / Office, commercial</option><option value="ic">İç mimari, tadilat / Interior, renovation</option><option value="rest">Restorasyon, cephe / Restoration, facade</option></select>' +
      '<label for="m2">' + M("aracAlan") + '</label><input id="m2" type="number" inputmode="numeric" value="250" min="30" step="10"><label for="kat">' + M("aracKat") + '</label><input id="kat" type="number" inputmode="numeric" value="2" min="1" max="30">' +
      '<fieldset style="border:0"><legend style="font-weight:700;font-size:.9rem;margin:16px 0 8px">' + M("aracHizmetler") + '</legend><div class="secim" id="hizmetler">' + cb("avan", "Konsept + avan proje", "Concept + schematic design", 1) + cb("uyg", "Uygulama projesi", "Construction drawings", 1) + cb("ruh", "Ruhsat takibi", "Permit follow-up", 1) + cb("ic", "İç mimari", "Interior design") + cb("den", "Uygulama denetimi", "Site supervision") + "</div></fieldset></div>" +
      '<div class="panelk" aria-live="polite"><div class="etiket">' + M("aracTakvim") + '</div><div class="top" id="top">—</div><div id="asamalar"></div><p class="not">' + M("aracTahminNot") +
      '</p><a class="dg wa" id="planGonder" href="#" target="_blank" rel="noopener" style="margin-top:14px">' + M("aracPlanDugme") + "</a></div></div></div></section>" +
      '<section class="bol" id="once-sonra"><div class="kap"><div class="etiket">02</div><h2>' + M("aracOsBaslik") + '</h2><p class="acik">' + M("aracOsMetin") +
      '</p><div class="os" id="os"><img src="' + esc(gOnce) + '" alt="Yenileme öncesi cephe' + (b.ornekGizle ? "" : " (örnek görsel)") + '" width="1280" height="720" loading="lazy"><img class="sonra" src="' + esc(gSonra) + '" alt="Yenileme sonrası cephe' + (b.ornekGizle ? "" : " (örnek görsel)") + '" width="1280" height="720" loading="lazy"><div class="cz"></div><span class="e e1">' + M("aracOnce") + '</span><span class="e e2">' + M("aracSonra") + "</span>" + (b.ornekGizle ? "" : '<span class="ornek-et">' + M("aracOrnek") + "</span>") + "</div>" +
      '<input class="os-ar" id="osAr" type="range" min="0" max="100" value="50" aria-label="Önce / sonra karşılaştırma" data-al-en="Before / after comparison"></div></section>' +
      '<section class="bol" id="ruhsat"><div class="kap"><div class="etiket">03</div><h2>' + M("aracRuhsatBaslik") + '</h2><p class="acik">' + M("aracRuhsatMetin") +
      '</p><div class="arac"><ul class="liste" id="belgeler">' + BELGE.map(function (x) { return '<li><label><input type="checkbox">' + T2(x[0], x[1]) + "</label></li>"; }).join("") +
      '</ul><div class="panelk" aria-live="polite"><div class="etiket">' + M("aracHazirlik") + '</div><div class="top" id="hazir">0 / 8</div><div class="ilerleme"><i id="hazirCubuk"></i></div><p class="acik" id="hazirNot"></p><a class="dg wa" id="belgeSor" href="#" target="_blank" rel="noopener" style="margin-top:14px">' + M("aracRuhsatDugme") + "</a></div></div></div></section>" +
      '<section class="bol" id="stil"><div class="kap"><div class="etiket">04</div><h2>' + M("aracStilBaslik") + '</h2><p class="acik">' + M("aracStilMetin") +
      '</p><div class="arac"><div><div class="stiller" id="stiller" role="group" aria-label="Stil">' + [["Minimal", "Minimal"], ["Modern", "Modern"], ["Sıcak Doğal", "Warm Natural"], ["Klasik", "Classic"]].map(function (x) { return '<button type="button" aria-pressed="false">' + T2(x[0], x[1]) + "</button>"; }).join("") +
      '</div><div class="palet" id="palet"></div><p id="malzeme" class="acik"></p><a class="dg i" id="stilGonder" href="#" target="_blank" rel="noopener" style="margin-top:14px">' + M("aracStilDugme") + "</a></div>" +
      '<figure style="position:relative"><img id="stilGorsel" src="img/stil0.jpg" alt="" width="1200" height="900" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover"><figcaption id="stilEtiket" class="ornek-et"></figcaption></figure></div></div></section>';
  }
};
// 7 Kas: her bölüm için panelden arka plan rengi, arka plan görseli (+karartma) ve yazı tonu; alanlar boşsa bölüm aynen kalır
function bolumSar(b, h) {
  var z = guvenliRenk(b.zeminRenk, ""), g = b.tip !== "kahraman" && b.zeminGorsel ? url(b.zeminGorsel) : "", ton = b.tip === "kahraman" ? "" : b.yaziTon;
  var cls = ton === "acik" ? " bn-acik" : ton === "koyu" ? " bn-koyu" : "";
  if (!z && !g && !cls) return h;
  var st = [];
  if (z) st.push("background-color:" + z);
  if (g) { var o = Math.min(80, Math.max(0, Number(b.zeminOrtu) || 0)) / 100; st.push("background-image:" + (o ? "linear-gradient(rgba(0,0,0," + o + "),rgba(0,0,0," + o + ")),": "") + "url(" + cssUrl(g) + ")"); cls += " bn-zg"; }
  return h.replace(/^(<(?:section|article)\b)([^>]*)>/, function (_, a, at) {
    if (cls) at = /class="/.test(at) ? at.replace(/class="([^"]*)"/, function (_, c) { return 'class="' + c + cls + '"'; }) : at + ' class="' + cls.trim() + '"';
    if (st.length) { var s = esc(st.join(";")); at = /style="/.test(at) ? at.replace(/style="([^"]*)"/, function (_, x) { return 'style="' + x + ";" + s + '"'; }) : at + ' style="' + s + '"'; }
    return a + at + ">";
  });
}
function sayfaVar(ic, id) { return !!(ic.sayfalar && ic.sayfalar[id]); }

function ana(ic, sayfa, ctx) {
  var s = (ic.sayfalar || {})[sayfa] || { bolumler: [] };
  return (s.bolumler || []).filter(function (b) { return b && b.gorunur !== false && BOLUM[b.tip]; }).map(function (b) {
    try { IC_ = ic; return bolumSar(b, BOLUM[b.tip](ic, b, ctx || {})); } catch (e) { return "<!-- bölüm hatası: " + esc(b.tip) + " -->"; }
  }).join("\n");
}
function baslik(ic, sayfa) { var s = (ic.sayfalar || {})[sayfa] || {}; return s.baslik || { tr: (ic.marka || {}).unvan || "" }; }
function schema(ic) {
  var il = ic.iletisim || {}, m = ic.marka || {}, alan = (ic.site || {}).alan || "";
  var d = { "@context": "https://schema.org", "@type": "Architect", "@id": alan + "#ofis", name: m.unvan || m.ad, description: tr(m.altMetin), url: alan,
    areaServed: { "@type": "City", name: il.sehir || "Ankara" }, address: { "@type": "PostalAddress", streetAddress: il.adres || "", addressLocality: il.ilce || il.sehir || "Ankara", addressCountry: "TR" },
    telephone: il.tel || "", email: il.eposta || "", sameAs: SOSYAL.map(function (s) { return il[s[0]]; }).filter(Boolean) };
  return '<script type="application/ld+json">' + JSON.stringify(d).replace(/</g, "\\u003c") + "</script>";
}
// 7 Kas: favicon (marka.favicon), sosyal paylaşım görseli (sayfa.gorsel → site.paylasimGorseli), Google Search Console doğrulama kodu
function favAdres(ic) { return url((ic.marka || {}).favicon) || "assets/favicon.svg"; }
function favTip(u) { return /\.svg(\?|#|$)/i.test(u) ? "image/svg+xml" : /\.png(\?|#|$)/i.test(u) ? "image/png" : /\.ico(\?|#|$)/i.test(u) ? "image/x-icon" : ""; }
function favLink(ic) { var u = favAdres(ic), t = favTip(u); return '<link rel="icon" href="' + esc(u) + '"' + (t ? ' type="' + t + '"' : "") + ">"; }
function ogAdres(ic, sayfa) { var s = (ic.sayfalar || {})[sayfa] || {}; return url(s.gorsel || (ic.site || {}).paylasimGorseli || ""); }
function ogGorsel(ic, sayfa) { var u = ogAdres(ic, sayfa); return u ? '<meta property="og:image" content="' + esc(u) + '"><meta name="twitter:card" content="summary_large_image">\n' : ""; }
function gscKod(ic) { var k = String((ic.site || {}).gsc || "").trim(); return /^[A-Za-z0-9_-]{10,100}$/.test(k) ? k : ""; }
function gscMeta(ic) { var k = gscKod(ic); return k ? '<meta name="google-site-verification" content="' + k + '">\n' : ""; }
function metaYaz(ad, ozellik, deger) {
  var d = document, e = d.head.querySelector("meta[" + ozellik + '="' + ad + '"]');
  if (!deger) { if (e && e.hasAttribute("data-bn")) e.remove(); return; }
  if (!e) { e = d.createElement("meta"); e.setAttribute(ozellik, ad); e.setAttribute("data-bn", ""); d.head.appendChild(e); }
  e.setAttribute("content", deger);
}
function basGuncelle(ic, sayfa) {
  var d = document, b = baslik(ic, sayfa), ac = tr(((ic.sayfalar || {})[sayfa] || {}).aciklama);
  metaYaz("description", "name", ac); metaYaz("og:title", "property", tr(b)); metaYaz("og:description", "property", ac);
  var og = ogAdres(ic, sayfa); metaYaz("og:image", "property", og); metaYaz("twitter:card", "name", og ? "summary_large_image" : "");
  metaYaz("google-site-verification", "name", gscKod(ic));
  var f = d.head.querySelector('link[rel="icon"]'), u = favAdres(ic);
  if (f && f.getAttribute("href") !== u) { f.setAttribute("href", u); var t = favTip(u); if (t) f.setAttribute("type", t); else f.removeAttribute("type"); }
}
/* tam belge (Node önceden üretim) */
function belge(ic, sayfa, ops) {
  ops = ops || {};
  var dosya = sayfaDosya(sayfa), alan = (ic.site || {}).alan || "", can = alan + (dosya === "index.html" ? "" : dosya), b = baslik(ic, sayfa), ac = tr(((ic.sayfalar || {})[sayfa] || {}).aciklama);
  var yay = (ic.site || {}).yayinda, v = ops.surum || "2";
  return '<!doctype html>\n<html lang="tr" data-title-en="' + esc(en(b)) + '" data-sayfa="' + esc(sayfa) + '">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n' +
    (yay ? "" : '<meta name="robots" content="noindex, nofollow">\n') + "<title>" + esc(tr(b)) + '</title>\n<meta name="description" content="' + esc(ac) + '">\n<link rel="canonical" href="' + esc(can) + '">\n' +
    '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(tr(b)) + '"><meta property="og:description" content="' + esc(ac) + '"><meta property="og:url" content="' + esc(can) + '"><meta property="og:locale" content="tr_TR">\n' +
    '<meta name="theme-color" content="' + esc(guvenliRenk(((ic.marka || {}).renkler || {}).yesil, "#253925")) + '">\n' + favLink(ic) + "\n" + ogGorsel(ic, sayfa) + gscMeta(ic) +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,400..800&display=swap" rel="stylesheet">\n' +
    '<link rel="stylesheet" href="assets/site.css?v=' + v + '">\n<style id="bn-renk">' + renkCSS(ic) + "</style>\n" + (sayfa === "index" || sayfa === "iletisim" ? schema(ic) + "\n" : "") +
    "<script>window.BENSAY=" + JSON.stringify({ wa: waLink(ic), site: "bensay", sb: ops.sb || null, guncelleme: (ic.meta || {}).guncelleme || "" }).replace(/</g, "\\u003c") + ";</script>\n</head>\n<body>\n" +
    '<a class="atla" href="#icerik">' + M("atla") + "</a>\n" + '<div id="bn-ust">' + ust(ic, sayfa) + "</div>\n<main id=\"icerik\">\n" + ana(ic, sayfa, ops.ctx) + "\n</main>\n" + '<div id="bn-alt">' + alt(ic) + "</div>\n" +
    '<script src="assets/render.js?v=' + v + '" defer></script><script src="assets/maliyet.js?v=' + v + '" defer></script>' + (sayfa === "araclar" ? '<script src="assets/araclar.js?v=' + v + '" defer></script>' : "") +
    '<script src="assets/site.js?v=' + v + '" defer></script>\n</body>\n</html>\n';
}
/* tarayıcı: var olan sayfayı yeni içerikle yeniden çiz */
function yenidenCiz(ic, sayfa, ctx) {
  var d = document, b = baslik(ic, sayfa);
  var r = d.getElementById("bn-renk"); if (r) r.textContent = renkCSS(ic);
  var u = d.getElementById("bn-ust"); if (u) u.innerHTML = ust(ic, sayfa);
  var m = d.getElementById("icerik"); if (m) m.innerHTML = ana(ic, sayfa, ctx);
  var a = d.getElementById("bn-alt"); if (a) a.innerHTML = alt(ic);
  d.documentElement.setAttribute("data-title-en", en(b)); d.documentElement.setAttribute("data-title-tr", tr(b)); d.title = d.documentElement.classList.contains("en") ? en(b) : tr(b);
  if (window.BENSAY) window.BENSAY.wa = waLink(ic);
  try { basGuncelle(ic, sayfa); } catch (e) {}
}
var API = { SAYFALAR: SAYFALAR, BOLUM_TIPLERI: BOLUM_TIPLERI, METINLER: METINLER, SOSYAL: SOSYAL, WA_MSJ: WA_MSJ, belge: belge, yenidenCiz: yenidenCiz, ana: ana, renkCSS: renkCSS, esc: esc, tr: tr, en: en, T: T, tl: tl, sayfaDosya: sayfaDosya,
  /* 8 Kas: maliyet.js / site.js için panelden değişebilen sabit yazılar */
  metin: function (ic, k) { IC_ = ic; return M(k); }, metinDuz: function (ic, k) { IC_ = ic; return Mx(k); } };
if (typeof module !== "undefined" && module.exports) module.exports = API; else kok.BNRender = API;
})(typeof window !== "undefined" ? window : globalThis);
