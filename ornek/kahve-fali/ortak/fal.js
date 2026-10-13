/* Fincan Falı - ortak motor (demo). Gerçek sunucu yok: tüm veri bu tarayıcının localStorage'ında.
   Marka adı: aşağıdaki CFG.marka. Logo: SVG'si logoSvg() içinde, renkleri --logo-1 / --logo-2 değişkenleri.
   Sayfada <div data-modul="..."> yer tutucuları doldurulur; her tema bunları kendi yerleşiminde dizer. */
(function () {
  "use strict";
  var CFG = { marka: "Fincan Falı", anahtar: "fincanfali1013_", hazirMs: 7000 };
  var Q = function (s, r) { return (r || document).querySelector(s); };
  var QA = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var mem = {};
  function ls(k, v) {
    try { if (v === undefined) { var r = localStorage.getItem(CFG.anahtar + k); return r ? JSON.parse(r) : null; } localStorage.setItem(CFG.anahtar + k, JSON.stringify(v)); return true; }
    catch (e) { if (v === undefined) return mem[k] || null; mem[k] = v; return false; }
  }
  var uid = 0;
  function rk(n) { var h = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < n; i++) s += h[Math.floor(Math.random() * h.length)]; return s; }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }

  /* ---------- Veri ---------- */
  function varsayilan() {
    return {
      jeton: 0, hediyeAlindi: false, davet: "FAL-" + rk(5), davetKullanildi: false, profil: { dogum: "", iliski: "" },
      turler: { kahve: { ad: "Kahve falı", jeton: 2, fiyat: "" }, tarot: { ad: "Tarot falı", jeton: 1, fiyat: "" }, el: { ad: "El falı", jeton: 1, fiyat: "" }, yildizname: { ad: "Yıldızname", jeton: 3, fiyat: "" } },
      falcilar: [
        { id: "f1", ad: "Ayla Hanım", uz: "Kahve falı · aşk ve ilişkiler", turler: ["kahve", "tarot"], puan: 4.9, online: true, aktif: true, tip: "sal", sk: "#e8b98f", sc: "#6b3fa0", kl: "#2f6b5e", b1: "#3b2257", b2: "#8a5a2b", kisa: "Yirmi yılı aşkın fincan okur; sevgi ve evlilik sorularında detaycıdır." },
        { id: "f2", ad: "Melek", uz: "Tarot · kariyer ve karar", turler: ["tarot", "kahve"], puan: 4.8, online: true, aktif: true, tip: "uzun", sk: "#f0c8a4", sc: "#2a1608", kl: "#8c2f4b", b1: "#2d1b4a", b2: "#6b3fa0", kisa: "Kartlarla net, uygulanabilir yorumlar yapar." },
        { id: "f3", ad: "Nehir", uz: "El falı · çizgi okuma", turler: ["el"], puan: 4.7, online: false, aktif: true, tip: "uzun", sk: "#d9a679", sc: "#7a3b1d", kl: "#2b4f7a", b1: "#1d3a4a", b2: "#6b3fa0", kisa: "Avuç çizgilerinden karakter ve yaşam yolu okur." },
        { id: "f4", ad: "Zehra", uz: "Yıldızname · burç haritası", turler: ["yildizname", "tarot"], puan: 4.9, online: true, aktif: true, tip: "sal", sk: "#f3d1b0", sc: "#c79a3c", kl: "#3b2257", b1: "#1d0f2e", b2: "#5a3a16", kisa: "Doğum tarihinize göre yıllık gidişat çıkarır." },
        { id: "f5", ad: "Derya", uz: "Kahve falı · para ve iş", turler: ["kahve"], puan: 4.6, online: true, aktif: true, tip: "uzun", sk: "#e5b48a", sc: "#4a2a14", kl: "#b8862f", b1: "#3b2257", b2: "#2d1b12", kisa: "İş değişikliği ve maddi konularda yoğunlaşır." },
        { id: "f6", ad: "Murat Usta", uz: "Kahve ve tarot · genel yorum", turler: ["kahve", "tarot", "el"], puan: 4.8, online: false, aktif: true, tip: "kisa", sk: "#d9a679", sc: "#3a2a22", kl: "#5a3a16", b1: "#2a1608", b2: "#6b3fa0", kisa: "Sakin anlatımıyla genel gidişatı yorumlar." }
      ],
      paketler: [
        { id: "p1", ad: "Başlangıç", jeton: 3, bonus: 0, rozet: "", aktif: true },
        { id: "p2", ad: "Popüler", jeton: 10, bonus: 2, rozet: "En çok tercih edilen", aktif: true },
        { id: "p3", ad: "Mistik", jeton: 25, bonus: 7, rozet: "", aktif: true }
      ],
      kodlar: [{ kod: "HOSGELDIN", jeton: 1, aktif: true }, { kod: "MISTIK2", jeton: 2, aktif: true }], kullanilanKodlar: [],
      fallar: [], odemeler: [], secFalci: null
    };
  }
  var S = (function () { var s = varsayilan(), k = ls("durum"); if (k) for (var a in k) s[a] = k[a]; return s; })();
  function kaydet() { ls("durum", S); yenile(); }
  function falci(id) { return S.falcilar.filter(function (f) { return f.id === id; })[0]; }
  function fal(id) { return S.fallar.filter(function (f) { return f.id === id; })[0]; }
  function sifirla() { try { localStorage.removeItem(CFG.anahtar + "durum"); } catch (e) {} mem = {}; location.reload(); }

  /* ---------- Burç ---------- */
  var BURC = { "Koç": "♈", "Boğa": "♉", "İkizler": "♊", "Yengeç": "♋", "Aslan": "♌", "Başak": "♍", "Terazi": "♎", "Akrep": "♏", "Yay": "♐", "Oğlak": "♑", "Kova": "♒", "Balık": "♓" };
  var BURC_SIRA = ["Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"];
  function burcHesapla(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); if (!m) return null;
    var ay = +m[2], gun = +m[3]; if (ay < 1 || ay > 12 || gun < 1 || gun > 31) return null;
    var bas = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
    var adlar = ["Kova", "Balık", "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak", "Terazi", "Akrep", "Yay", "Oğlak"];
    return gun >= bas[ay - 1] ? adlar[ay - 1] : adlar[(ay + 10) % 12];
  }
  function glif(b) { return (BURC[b] || "✦") + "︎"; }

  /* ---------- SVG çizimleri ---------- */
  function logoSvg() {
    return '<svg class="fc-logo" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="none" stroke-width="2" style="stroke:var(--logo-1)"/><path d="M13 22h20c0 9-4 14-10 14s-10-5-10-14z" style="fill:var(--logo-1)"/><path d="M33 24c5-1 6 6 0 8" fill="none" stroke-width="2.4" style="stroke:var(--logo-1)"/><path d="M24 5l1.7 3.8 4.1.4-3.1 2.8.9 4.1L24 14l-3.6 2.1.9-4.1-3.1-2.8 4.1-.4z" style="fill:var(--logo-2)"/><ellipse cx="23" cy="39" rx="12" ry="2.3" style="fill:var(--logo-2)"/></svg>';
  }
  function avatar(p) {
    var id = "av" + (++uid), t = p.tip, sk = p.sk, sc = p.sc, kl = p.kl, g = "";
    g += '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + p.b1 + '"/><stop offset="1" stop-color="' + p.b2 + '"/></linearGradient></defs><rect width="100" height="100" fill="url(#' + id + ')"/>';
    g += '<circle cx="20" cy="18" r="1.4" fill="#f2d391"/><circle cx="82" cy="26" r="1.1" fill="#f2d391"/><circle cx="76" cy="12" r="1.6" fill="#f2d391" opacity=".7"/>';
    if (t === "sal") g += '<path d="M50 13c-21 0-31 15-31 35 0 15 4 25 8 31h46c4-6 8-16 8-31 0-20-10-35-31-35z" fill="' + sc + '"/>';
    if (t === "uzun") g += '<path d="M27 50c0-22 9-35 23-35s23 13 23 35v34H27z" fill="' + sc + '"/>';
    g += '<path d="M10 100c0-19 17-27 40-27s40 8 40 27z" fill="' + kl + '"/><path d="M42 80l8 8 8-8" fill="none" stroke="#f2d391" stroke-width="1.6" opacity=".8"/>';
    g += '<rect x="44" y="62" width="12" height="16" rx="4" fill="' + sk + '"/><rect x="44" y="62" width="12" height="16" rx="4" fill="#000" opacity=".12"/>';
    g += '<ellipse cx="50" cy="48" rx="17" ry="21" fill="' + sk + '"/>';
    if (t === "sal") g += '<path d="M31 46c2-17 12-23 19-23s17 6 19 23c-6-9-13-13-19-13s-13 4-19 13z" fill="' + sc + '"/><path d="M50 27l1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.5-2.5 1.5.6-2.8-2.1-1.9 2.8-.3z" fill="#f2d391"/>';
    if (t === "uzun") g += '<path d="M32 46c1-13 9-18 18-18s17 5 18 18c-6-5-11-10-18-10s-12 5-18 10z" fill="' + sc + '"/>';
    if (t === "kisa") g += '<path d="M32 44c0-14 8-21 18-21s18 7 18 21c-6-5-12-8-18-8s-12 3-18 8z" fill="' + sc + '"/><path d="M33 54c0 14 7 21 17 21s17-7 17-21c-4 7-10 9-17 9s-13-2-17-9z" fill="' + sc + '"/>';
    g += '<path d="M41 50q3-3.4 6 0M53 50q3-3.4 6 0" stroke="#2a1608" fill="none" stroke-width="1.7" stroke-linecap="round"/><path d="M45 60q5 4 10 0" stroke="#8a3b3b" fill="none" stroke-width="1.8" stroke-linecap="round"/>';
    g += '<circle cx="33.5" cy="57" r="2" fill="#f2d391"/><circle cx="66.5" cy="57" r="2" fill="#f2d391"/>';
    return '<svg class="fc-av" viewBox="0 0 100 100" role="img" aria-label="' + esc(p.ad) + ' (çizim avatar)">' + g + '</svg>';
  }
  var TUR_IKON = {
    kahve: '<svg viewBox="0 0 40 40"><path d="M7 14h22c0 10-4 16-11 16S7 24 7 14z" fill="currentColor" opacity=".9"/><path d="M29 16c6-1 7 7 0 9" fill="none" stroke="currentColor" stroke-width="2.4"/><ellipse cx="18" cy="34" rx="13" ry="2.4" fill="currentColor" opacity=".5"/><path d="M14 5c-2 2 2 3 0 6M21 5c-2 2 2 3 0 6" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round"/></svg>',
    tarot: '<svg viewBox="0 0 40 40"><rect x="9" y="4" width="22" height="32" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 11l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6-5-2.9-5 2.9 1.2-5.6-4.2-3.8 5.6-.6z" fill="currentColor"/></svg>',
    el: '<svg viewBox="0 0 40 40"><path d="M12 36V19l-3-6c-.6-1.4 1.2-2.4 2.2-1.2L14 15V7c0-1.6 2.4-1.6 2.4 0v7V5c0-1.6 2.4-1.6 2.4 0v9V6c0-1.6 2.4-1.6 2.4 0v9V9c0-1.6 2.4-1.6 2.4 0v14c0 6-2 13-6 13z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 25q4-2 8 2" stroke="currentColor" fill="none" stroke-width="1.4"/></svg>',
    yildizname: '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 3"/><path d="M20 12l1.6 5 5.2.1-4.2 3.1 1.6 5-4.2-3-4.2 3 1.6-5-4.2-3.1 5.2-.1z" fill="currentColor"/></svg>'
  };
  var FOTO_IKON = '<svg viewBox="0 0 40 40"><path d="M5 12h8l3-4h8l3 4h8v22H5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="22" r="6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  function demoFoto(ad) { // yalnız çizim: kullanıcı fotoğraf yüklemek istemezse
    var m = { fincan: '<ellipse cx="60" cy="60" rx="38" ry="38" fill="#f4e9d8"/><ellipse cx="60" cy="60" rx="30" ry="30" fill="#3a2214"/><path d="M40 56c10-14 24-10 28 2s-12 20-24 12" stroke="#1a0f0a" stroke-width="5" fill="none"/>', tabak: '<ellipse cx="60" cy="60" rx="46" ry="46" fill="#e9d9c0"/><ellipse cx="60" cy="60" rx="30" ry="30" fill="#f4e9d8" stroke="#d9ab55" stroke-width="3"/><circle cx="52" cy="54" r="5" fill="#4a2a14"/><circle cx="68" cy="66" r="7" fill="#3a2214"/>', telve: '<rect width="120" height="120" fill="#2a1608"/><path d="M10 40c20 10 30-10 50 0s30 20 50 5M15 80c20-10 35 10 55 0s25-12 40 0" stroke="#7a4b24" stroke-width="7" fill="none" stroke-linecap="round"/>', el: '<rect width="120" height="120" fill="#e5b48a"/><path d="M30 30q30 30 60 10M35 60q30 15 52 0M40 85q25-5 40-22" stroke="#9a6236" stroke-width="3" fill="none"/>' };
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#5a3a24"/>' + (m[ad] || m.fincan) + '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
  }
  function yildizlar(p) { var s = ""; for (var i = 1; i <= 5; i++) s += '<i class="' + (p >= i - 0.25 ? "d" : "") + '">★</i>'; return '<span class="fc-yildiz" aria-label="Puan ' + p + '">' + s + "</span>"; }

  /* ---------- Metin üretimi (örnek yorum) ---------- */
  var GENEL = ["Önümüzdeki günlerde ertelediğiniz bir konu hareketleniyor.", "Bir haber, beklemediğiniz bir yerden size ulaşacak.", "Yakın çevrenizden biri size yardım elini uzatacak.", "Uzun süredir taşıdığınız bir yük hafifliyor.", "Bu hafta sezgileriniz her zamankinden güçlü.", "Küçük bir yolculuk ya da görüşme tüm gidişatı değiştirebilir.", "Eski bir dostun adı gündeminize girecek.", "Sabrınızın karşılığını almaya çok yakınsınız."];
  var ASK = ["Kalbinizde yeni bir sayfa açılıyor.", "İlişkinizde açık konuşma, iyi bir sonuç getirecek.", "Beklediğiniz mesaj gecikse de gelecek.", "Kendinize duyduğunuz sevgi çevrenize de yansıyacak.", "Eski bir kırgınlık yerini anlayışa bırakıyor.", "Yeni biriyle tanışma ihtimali yüksek.", "Duygularınızı saklamayın; karşılık bulacaksınız.", "Aile içinde güzel bir buluşma görünüyor."];
  var IS = ["Maddi konularda toparlanma görünüyor.", "Yeni bir iş teklifi ya da proje kapınızı çalabilir.", "Emeğinizin takdir edildiği bir dönem başlıyor.", "Bütçenizde plan yapmak size iyi gelecek.", "Bir ortaklık ya da iş birliği gündeme gelebilir.", "Gelen fırsatı hemen değil, düşünerek değerlendirin.", "Küçük bir ek kazanç yolu görünüyor.", "Zamanı iyi yönetirseniz haftayı rahat kapatırsınız."];
  var RENK = ["Mor", "Altın sarısı", "Zümrüt yeşili", "Bordo", "Lacivert", "Krem", "Turuncu", "Gümüş"];
  var BURC_NOT = { "Koç": "Enerjiniz yüksek; acele etmeden ilerlemek avantaj.", "Boğa": "İstikrarınız sizi ayakta tutuyor; konfor alanınızdan küçük bir adım atın.", "İkizler": "Zihniniz çok hızlı; tek bir işe odaklanmak verim getirir.", "Yengeç": "Duygusal çevrenizi korumak size güç verecek.", "Aslan": "Sahnede olmak istiyorsunuz; nezaket kapıları açar.", "Başak": "Detayları iyi görüyorsunuz; mükemmeliyetçiliği biraz gevşetin.", "Terazi": "Karar vermekte zorlanabilirsiniz; ilk içgüdünüz doğru.", "Akrep": "Derin hisleriniz doğru insanı gösterecek.", "Yay": "Özgürlük arzunuz artıyor; plan yapmak size iyi gelecek.", "Oğlak": "Disiplininiz meyvesini veriyor; dinlenmeyi de ihmal etmeyin.", "Kova": "Sıradışı fikirleriniz ilgi görecek.", "Balık": "Hayalleriniz ile gerçekleri dengelemek için güzel bir gün." };
  function gunlukYorum(burc, tarih) {
    var r = rng(hash(burc + (tarih || new Date().toISOString().slice(0, 10))));
    return { burc: burc, giris: BURC_NOT[burc] || "", genel: pick(r, GENEL), ask: pick(r, ASK), is: pick(r, IS), renk: pick(r, RENK), sayi: 1 + Math.floor(r() * 9) };
  }
  var SEMBOL = ["bir kuş", "uzun bir yol", "bir balık", "bir yüzük", "bir kalp", "bir dağ", "bir anahtar", "bir ağaç", "bir kapı", "bir at"];
  var ACILIS = {
    kahve: ["Fincanınızı çevirdiğimde telvenin kenara doğru uzun bir yol çizdiğini gördüm.", "Fincanınızın ağız kısmında ince, parlak çizgiler var; bu iyi bir haber işareti.", "Telve fincanın içine dengeli yayılmış; ruh haliniz bugünlerde toparlanıyor."],
    tarot: ["Çektiğiniz üç kart, geçmişten bugüne uzanan bir dönüşümü anlatıyor.", "Kartlar ilk bakışta yeni başlangıçlardan söz ediyor.", "Masada Yıldız ve Güneş kartları yan yana geldi; umutlu bir tablo var."],
    el: ["Hayat çizginiz derin ve kesintisiz; sağlam bir yapınız var.", "Kalp çizginiz uzun; duygularınızı içten yaşıyorsunuz.", "Akıl çizginiz net; kararlarınızı düşünerek veriyorsunuz."],
    yildizname: ["Doğum tarihinize göre bu yıl gezegenler sizden yana dönüyor.", "Doğum haritanızda Ay'ın konumu sezgilerinizi öne çıkarıyor.", "Yıldızlar bu dönemde yeni bir döngü başlatmanızı öneriyor."]
  };
  function yorumUret(f) {
    var r = rng(hash(f.id + f.tur)), sem = pick(r, SEMBOL), b = f.burc, p = [];
    p.push(pick(r, ACILIS[f.tur] || ACILIS.kahve) + (b ? " " + (BURC_NOT[b] || "") : ""));
    p.push("Görünenler arasında " + sem + " dikkat çekiyor. " + pick(r, GENEL));
    var nt = (f.not || "").trim();
    p.push((nt ? "Niyetinizde \"" + nt.slice(0, 90) + "\" demişsiniz. " : "") + "Aşk ve ilişkiler tarafında: " + pick(r, ASK) + (f.iliski ? " (" + f.iliski + " olduğunuzu da göz önüne aldım.)" : ""));
    p.push("İş ve para tarafında: " + pick(r, IS) + " Şans rengi: " + pick(r, RENK).toLowerCase() + ".");
    p.push("Bu yorum eğlence amaçlıdır; kararlarınızı yalnızca fala bağlamayın. Gönül rahatlığıyla, güzel günler dilerim.");
    return p;
  }

  /* ---------- Bildirim, GSAP yardımcıları ---------- */
  function gsapVar() { return typeof window.gsap !== "undefined"; }
  var AZ = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var toastEl, toastZ;
  function toast(baslik, metin, dugme, tikla) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "fc-toast"; toastEl.hidden = true; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4c-6 0-10 5-10 11v8l-3 4h26l-3-4v-8c0-6-4-11-10-11z" fill="#d9ab55"/><circle cx="20" cy="33" r="3" fill="#9b72d0"/></svg><div style="flex:1"><b>' + esc(baslik) + '</b><span>' + esc(metin) + '</span></div>' + (dugme ? '<button class="fc-btn kucuk" type="button">' + esc(dugme) + '</button>' : '');
    toastEl.hidden = false; clearTimeout(toastZ);
    var b = Q("button", toastEl); if (b) b.onclick = function () { toastEl.hidden = true; if (tikla) tikla(); };
    if (gsapVar() && !AZ) {
      gsap.fromTo(toastEl, { y: -90, autoAlpha: 0, scale: .9 }, { y: 0, autoAlpha: 1, scale: 1, duration: .8, ease: "back.out(1.7)" });
      gsap.fromTo(Q("svg", toastEl), { rotation: -25 }, { rotation: 0, duration: 1.2, ease: "elastic.out(1,.3)", transformOrigin: "50% 10%" });
      var yz = []; for (var i = 0; i < 10; i++) { var s = document.createElement("span"); s.textContent = "✦"; s.style.cssText = "position:absolute;left:50%;top:50%;color:#f2d391;pointer-events:none;font-size:" + (10 + Math.random() * 12) + "px"; toastEl.appendChild(s); yz.push(s); }
      gsap.to(yz, { x: function () { return gsap.utils.random(-170, 170); }, y: function () { return gsap.utils.random(-60, 70); }, autoAlpha: 0, duration: 1.2, ease: "power2.out", onComplete: function () { yz.forEach(function (e) { e.remove(); }); } });
    } else toastEl.style.opacity = 1;
    toastZ = setTimeout(function () { if (gsapVar() && !AZ) gsap.to(toastEl, { autoAlpha: 0, y: -40, duration: .5, onComplete: function () { toastEl.hidden = true; } }); else toastEl.hidden = true; }, 11000);
  }
  function modal(html, sinif) {
    var m = document.createElement("div"); m.className = "fc-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true");
    m.innerHTML = '<div class="fc-kutu ' + (sinif || "") + '"><button class="kapat" type="button" aria-label="Kapat">×</button>' + html + "</div>";
    document.body.appendChild(m);
    var kapat = function () { m.remove(); document.removeEventListener("keydown", esck); };
    var esck = function (e) { if (e.key === "Escape") kapat(); };
    document.addEventListener("keydown", esck);
    Q(".kapat", m).onclick = kapat; m.addEventListener("click", function (e) { if (e.target === m) kapat(); });
    if (gsapVar() && !AZ) gsap.fromTo(Q(".fc-kutu", m), { y: 30, autoAlpha: 0, scale: .96 }, { y: 0, autoAlpha: 1, scale: 1, duration: .45, ease: "power3.out" });
    m.kapat = kapat; return m;
  }

  /* ---------- Fal akışı ---------- */
  function git(ad) {
    var ev = new CustomEvent("fal:git", { detail: ad, cancelable: true });
    if (document.dispatchEvent(ev)) { var h = Q('[data-modul="' + ad + '"]') || document.getElementById(ad); if (h) h.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }
  function gonderFal(o) {
    var f = { id: "k" + Date.now().toString(36) + rk(2), tur: o.tur, falciId: o.falciId, foto: o.foto || [], not: o.not || "", dogum: o.dogum || "", burc: burcHesapla(o.dogum) || "", iliski: o.iliski || "", tarih: Date.now(), durum: "bekliyor", yanit: null, kaynak: "", odeme: o.odeme, taksit: o.taksit || 0 };
    S.fallar.push(f); S.profil.dogum = o.dogum || S.profil.dogum; S.profil.iliski = o.iliski || S.profil.iliski; kaydet();
    setTimeout(hazirKontrol, CFG.hazirMs + 200);
    return f;
  }
  function hazirKontrol() {
    var ch = false, now = Date.now();
    S.fallar.forEach(function (f) {
      if (f.durum === "bekliyor" && now - f.tarih >= CFG.hazirMs) { f.yanit = yorumUret(f); f.kaynak = "otomatik"; f.durum = "hazir"; ch = true; }
    });
    if (ch) kaydet();
    bildirimKontrol();
  }
  function bildirimKontrol() {
    var yeni = S.fallar.filter(function (f) { return f.durum === "hazir" && !f.bildirildi; });
    if (!yeni.length) return;
    yeni.forEach(function (f) { f.bildirildi = true; }); ls("durum", S); yenile();
    var f = yeni[0], fc = falci(f.falciId);
    toast("Falım hazır!", (fc ? fc.ad : "Falcınız") + " yorumunu gönderdi.", "Falı oku", function () { sonucAc(f.id); });
    document.dispatchEvent(new CustomEvent("fal:hazir", { detail: f.id }));
  }
  function bekleyenZamanla() {
    var kalan = 1e9; S.fallar.forEach(function (f) { if (f.durum === "bekliyor") kalan = Math.min(kalan, CFG.hazirMs - (Date.now() - f.tarih)); });
    if (kalan < 1e9) setTimeout(hazirKontrol, Math.max(300, kalan + 150));
  }

  function sonucAc(id) {
    var f = fal(id); if (!f) return; var fc = falci(f.falciId) || { ad: "Falcı", tip: "sal", sk: "#e8b98f", sc: "#6b3fa0", kl: "#2f6b5e", b1: "#3b2257", b2: "#8a5a2b" };
    f.okundu = true; ls("durum", S); yenile();
    var hazir = f.durum === "hazir", par = hazir ? f.yanit : ["Falınız " + fc.ad + " tarafından hazırlanıyor. Hazır olunca bildirim gelecek."];
    var m = modal('<div class="fc-sonuc"><div class="fc-sh">' + avatar(fc) + '<div><h3 style="margin:0">' + esc((S.turler[f.tur] || {}).ad || "Fal") + '</h3><span style="color:var(--soluk)">' + esc(fc.ad) + (f.burc ? " · " + esc(f.burc) + " " + glif(f.burc) : "") + '</span></div></div>' +
      '<div class="fc-metin">' + par.map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + "</div>" +
      (hazir ? '<div class="fc-uyari">Fal eğlence amaçlıdır; tıbbi, hukuki ya da mali tavsiye değildir.</div><div><b>Falı puanlayın</b><div class="fc-puanla">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-p="' + n + '" class="' + (f.puan >= n ? "d" : "") + '" aria-label="' + n + ' yıldız">★</button>'; }).join("") + '</div><textarea class="fc-in" placeholder="Yorumunuz (isteğe bağlı)" maxlength="300">' + esc(f.yorum || "") + '</textarea><button class="fc-btn kucuk" type="button" data-kayit style="margin-top:8px">Puan ve yorumu kaydet</button> <span class="fc-ok" data-msg></span></div>' : "") + "</div>");
    if (hazir && gsapVar() && !AZ) gsap.from(QA(".fc-metin p", m), { y: 18, autoAlpha: 0, duration: .7, stagger: .35, delay: .25, ease: "power2.out" });
    var puan = f.puan || 0;
    QA("[data-p]", m).forEach(function (b) { b.onclick = function () { puan = +b.getAttribute("data-p"); QA("[data-p]", m).forEach(function (x) { x.classList.toggle("d", +x.getAttribute("data-p") <= puan); }); }; });
    var kb = Q("[data-kayit]", m); if (kb) kb.onclick = function () { f.puan = puan; f.yorum = Q("textarea", m).value.slice(0, 300); ls("durum", S); yenile(); Q("[data-msg]", m).textContent = "Teşekkürler, kaydedildi."; };
  }

  /* ---------- Ödeme (DEMO) ---------- */
  function odemeAc(o) { // o: {baslik, ozet, tip, onTamam(taksit)}
    var tak = 12;
    var m = modal('<h3>' + esc(o.baslik) + '</h3><p style="color:var(--soluk);margin:0 0 6px">' + esc(o.ozet) + '</p>' +
      '<div class="fc-uyari"><b>Demo:</b> gerçek ödeme alınmaz. Form hiçbir yere gönderilmez; kurulumda PayTR / iyzico bağlanır.</div>' +
      '<form class="fc-oform" autocomplete="off" novalidate><div class="fc-ckart"><div class="ch"><span>' + esc(CFG.marka) + '</span>' + logoSvg() + '</div>' +
      '<input class="fc-in" data-k="no" inputmode="numeric" maxlength="19" placeholder="Kart numarası" autocomplete="off"><input class="fc-in" data-k="ad" placeholder="Kart üzerindeki ad" autocomplete="off"><div class="sr"><input class="fc-in" data-k="skt" inputmode="numeric" maxlength="5" placeholder="AA/YY" autocomplete="off"><input class="fc-in" data-k="cvc" inputmode="numeric" maxlength="4" placeholder="CVC" autocomplete="off"></div></div>' +
      '<label class="fc-et">Taksit seçin</label><div class="fc-taksit">' + [["1", "Tek çekim"], ["3", "3 taksit"], ["6", "6 taksit"], ["9", "9 taksit"], ["12", "Kredi kartına 12 taksit"]].map(function (t) { return '<button type="button" data-t="' + t[0] + '" class="' + (t[0] === "12" ? "on12 sec" : "") + '">' + t[1] + "</button>"; }).join("") + '</div>' +
      '<p class="fc-uyari" data-tozet style="margin-top:8px"></p><div class="fc-hata" data-h></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="fc-btn" type="submit">Öde (demo)</button><button class="fc-btn alt kucuk" type="button" data-ornek>Örnek kart doldur</button></div></form>', "fc-odeme");
    var ozet = Q("[data-tozet]", m), h = Q("[data-h]", m);
    function tz() { ozet.textContent = tak === 1 ? "Tek çekim seçildi. Tutar ve komisyon, ödeme altyapısı kurulumunda sizin belirlediğiniz fiyata göre hesaplanır." : tak + " taksit seçildi. Aylık tutar, kurulumda ödeme altyapısı (PayTR / iyzico) ve fiyatınıza göre hesaplanır."; }
    tz();
    QA("[data-t]", m).forEach(function (b) { b.onclick = function () { tak = +b.getAttribute("data-t"); QA("[data-t]", m).forEach(function (x) { x.classList.toggle("sec", x === b); }); tz(); }; });
    var no = Q('[data-k="no"]', m), sk = Q('[data-k="skt"]', m);
    no.addEventListener("input", function () { no.value = no.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); });
    sk.addEventListener("input", function () { var v = sk.value.replace(/\D/g, "").slice(0, 4); sk.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v; });
    Q("[data-ornek]", m).onclick = function () { no.value = "4242 4242 4242 4242"; Q('[data-k="ad"]', m).value = "DEMO KULLANICI"; sk.value = "12/30"; Q('[data-k="cvc"]', m).value = "123"; };
    Q("form", m).addEventListener("submit", function (e) {
      e.preventDefault(); // hiçbir yere gönderilmez
      var d = no.value.replace(/\D/g, ""), ad = Q('[data-k="ad"]', m).value.trim(), cvc = Q('[data-k="cvc"]', m).value;
      if (d.length < 13) { h.textContent = "Kart numarası eksik (demo: Örnek kart doldur düğmesini kullanabilirsiniz)."; return; }
      if (ad.length < 3) { h.textContent = "Kart üzerindeki adı yazın."; return; }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(sk.value)) { h.textContent = "Son kullanma tarihi AA/YY biçiminde olmalı."; return; }
      if (!/^\d{3,4}$/.test(cvc)) { h.textContent = "CVC 3 veya 4 haneli olmalı."; return; }
      h.textContent = ""; var btn = Q("[type=submit]", m); btn.disabled = true; btn.textContent = "Demo ödeme işleniyor…";
      setTimeout(function () {
        S.odemeler.push({ t: Date.now(), tip: o.tip || "jeton", taksit: tak }); kaydet(); m.kapat(); o.onTamam(tak);
      }, 1100);
    });
  }

  /* ---------- Modüller ---------- */
  var MOD = {}, yenilenecek = [];
  function yenile() {
    QA("[data-jeton]").forEach(function (e) { e.textContent = S.jeton; });
    var yeni = S.fallar.filter(function (f) { return f.durum === "hazir" && !f.okundu; }).length;
    QA("[data-bildirim]").forEach(function (e) { e.textContent = yeni; e.hidden = !yeni; });
    yenilenecek.forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  MOD["jeton-bar"] = function (h) {
    function ciz() {
      h.innerHTML = '<span class="fc-jt">Jetonum: <b data-jeton>' + S.jeton + '</b></span> <span class="fc-zil" title="Hazır fallar">Bildirim <b data-bildirim hidden>0</b></span> ' + (S.hediyeAlindi ? "" : '<button class="fc-btn kucuk" type="button" data-hediye>Hoş geldin hediyesi: 2 jeton</button>');
      var b = Q("[data-hediye]", h); if (b) b.onclick = function () { S.hediyeAlindi = true; S.jeton += 2; kaydet(); toast("Hediye jeton", "İlk falınız için 2 jeton hesabınıza eklendi."); };
      yenile2();
    }
    function yenile2() { var y = S.fallar.filter(function (f) { return f.durum === "hazir" && !f.okundu; }).length, z = Q("[data-bildirim]", h); if (z) { z.textContent = y; z.hidden = !y; } var j = Q("[data-jeton]", h); if (j) j.textContent = S.jeton; }
    ciz(); yenilenecek.push(function () { if ((!S.hediyeAlindi) !== !!Q("[data-hediye]", h)) ciz(); else yenile2(); });
  };

  MOD["falcilar"] = function (h) {
    function ciz() {
      var l = S.falcilar.filter(function (f) { return f.aktif; });
      h.innerHTML = '<div class="fc-grid fc-g3">' + l.map(function (f) {
        return '<article class="fc-kart fc-falci' + (S.secFalci === f.id ? " sec" : "") + '"><div class="ust">' + avatar(f) + '<div><h3>' + esc(f.ad) + '</h3><span class="fc-online' + (f.online ? "" : " off") + '">' + (f.online ? "Çevrimiçi" : "Şu an çevrimdışı") + '</span><div>' + yildizlar(f.puan) + ' <small>' + f.puan + '</small></div></div></div>' +
          '<p>' + esc(f.kisa) + '</p><div>' + f.turler.map(function (t) { return '<span class="fc-chip">' + esc((S.turler[t] || {}).ad || t) + "</span>"; }).join("") + '</div><p><small>' + esc(f.uz) + " · örnek profil</small></p>" +
          '<button class="fc-btn' + (S.secFalci === f.id ? " alt" : "") + ' kucuk" type="button" data-sec="' + f.id + '">' + (S.secFalci === f.id ? "Seçildi · fal gönder" : "Bu falcıya fal gönder") + "</button></article>";
      }).join("") + "</div>";
      QA("[data-sec]", h).forEach(function (b) { b.onclick = function () { S.secFalci = b.getAttribute("data-sec"); kaydet(); document.dispatchEvent(new CustomEvent("fal:falci")); ciz(); git("fal-gonder"); }; });
    }
    ciz(); yenilenecek.push(function () { var a = QA(".fc-falci", h).length, b = S.falcilar.filter(function (f) { return f.aktif; }).length; if (a !== b) ciz(); });
  };

  MOD["fal-gonder"] = function (h) {
    var st = { tur: "kahve", foto: {}, ode: "jeton" };
    var FOTO = { kahve: [["fincan", "Fincan"], ["tabak", "Tabak"], ["telve", "Telve"]], el: [["el", "Avuç içi"]], tarot: [], yildizname: [] };
    h.innerHTML = '<form class="fc-fal-form" autocomplete="off" novalidate>' +
      '<div class="fc-adimb"><b>1</b><h4>Fal türü</h4></div><div class="fc-turlar">' + Object.keys(S.turler).map(function (k) { return '<label class="fc-tur"><input type="radio" name="tur" value="' + k + '"' + (k === "kahve" ? " checked" : "") + '><span>' + TUR_IKON[k] + esc(S.turler[k].ad) + "<small>" + S.turler[k].jeton + " jeton</small></span></label>"; }).join("") + "</div>" +
      '<div class="fc-adimb"><b>2</b><h4>Falcınız</h4></div><div class="fc-minis" data-fc></div>' +
      '<div class="fc-adimb"><b>3</b><h4>Fotoğraflar</h4></div><p class="fc-uyari" style="margin-top:6px">Fotoğraflar yalnızca bu tarayıcıda önizlenir; demoda hiçbir sunucuya yüklenmez.</p><div class="fc-fotolar" data-ft></div><div style="margin-top:8px"><button type="button" class="fc-btn alt kucuk" data-demofoto>Demo için çizimle doldur</button></div>' +
      '<div class="fc-adimb"><b>4</b><h4>Niyetiniz ve bilgileriniz</h4></div>' +
      '<label class="fc-et" for="fc-not">Niyet notu</label><textarea id="fc-not" class="fc-in" maxlength="400" placeholder="Aklınızdaki soruyu ya da niyetinizi yazın…"></textarea>' +
      '<div class="fc-grid fc-g2"><div><label class="fc-et" for="fc-dogum">Doğum tarihi</label><input id="fc-dogum" type="date" class="fc-in" max="2015-12-31"><div class="fc-ok" data-burc style="margin-top:6px;min-height:1.5em"></div></div>' +
      '<div><label class="fc-et" for="fc-iliski">İlişki durumu</label><select id="fc-iliski" class="fc-in"><option value="">Seçmek istemiyorum</option><option>Bekâr</option><option>İlişkisi var</option><option>Evli</option><option>Ayrılmış</option><option>Karışık / belirsiz</option></select></div></div>' +
      '<div class="fc-adimb"><b>5</b><h4>Ödeme</h4></div><div class="fc-ode"><label><input type="radio" name="ode" value="jeton" checked><span><b>Jetonla öde</b><small data-gerek></small></span></label><label><input type="radio" name="ode" value="kart"><span><b>Kredi kartıyla tek seferlik öde</b> <span class="fc-rozet12">12 taksite kadar</span><small>Demo ödeme ekranı açılır; gerçek ödeme alınmaz.</small></span></label></div>' +
      '<label class="fc-chk"><input type="checkbox" data-kvkk><span>Kişisel verilerimin (doğum tarihi, fotoğraf, not) fal yorumu amacıyla işlenmesine ilişkin <a href="#kvkk" data-kvkk-ac>KVKK aydınlatma metnini</a> okudum ve onaylıyorum.</span></label>' +
      '<div class="fc-uyari"><b>Fal eğlence amaçlıdır.</b> Yorumlar kesin bilgi, sağlık, hukuk ya da yatırım tavsiyesi değildir.</div>' +
      '<div class="fc-hata" data-h role="alert"></div><button class="fc-btn" type="submit">Falı gönder</button></form><div class="fc-gonderildi" hidden></div>';
    var form = Q("form", h), fcB = Q("[data-fc]", h), ftB = Q("[data-ft]", h), hata = Q("[data-h]", h);
    function falcilarCiz() {
      var u = S.falcilar.filter(function (f) { return f.aktif && f.turler.indexOf(st.tur) > -1; });
      if (!u.some(function (f) { return f.id === S.secFalci; })) S.secFalci = u.length ? (u.filter(function (f) { return f.online; })[0] || u[0]).id : null;
      fcB.innerHTML = u.map(function (f) { return '<button type="button" class="fc-mini' + (f.id === S.secFalci ? " sec" : "") + '" data-f="' + f.id + '">' + avatar(f) + "<span>" + esc(f.ad) + (f.online ? ' <small class="fc-ok">· çevrimiçi</small>' : "") + "</span></button>"; }).join("") || "<span>Bu tür için aktif falcı yok.</span>";
      QA("[data-f]", fcB).forEach(function (b) { b.onclick = function () { S.secFalci = b.getAttribute("data-f"); ls("durum", S); falcilarCiz(); }; });
    }
    function fotoCiz() {
      var l = FOTO[st.tur] || [];
      ftB.innerHTML = l.length ? l.map(function (x) { var v = st.foto[x[0]]; return '<label class="fc-foto' + (v ? " dolu" : "") + '">' + (v ? '<img alt="' + x[1] + ' önizleme" src="' + v + '">' : FOTO_IKON + "<span>" + x[1] + "</span>") + '<input type="file" accept="image/*" data-ff="' + x[0] + '"></label>'; }).join("") : '<p class="fc-uyari" style="grid-column:1/-1">Bu fal türünde fotoğraf gerekmez.</p>';
      QA("[data-ff]", ftB).forEach(function (i) { i.onchange = function () { var fl = i.files && i.files[0]; if (!fl) return; kucult(fl, function (d) { st.foto[i.getAttribute("data-ff")] = d; fotoCiz(); }); }; });
    }
    function kucult(file, cb) {
      var r = new FileReader(); r.onload = function () { var im = new Image(); im.onload = function () { var k = Math.min(1, 360 / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL("image/jpeg", .6)); }; im.onerror = function () { hata.textContent = "Bu dosya görsel olarak açılamadı."; }; im.src = r.result; }; r.readAsDataURL(file);
    }
    function gerekCiz() { var c = S.turler[st.tur].jeton; Q("[data-gerek]", h).textContent = "Bu fal " + c + " jeton. Bakiyeniz: " + S.jeton + " jeton."; }
    QA("[name=tur]", form).forEach(function (r) { r.onchange = function () { st.tur = r.value; st.foto = {}; falcilarCiz(); fotoCiz(); gerekCiz(); }; });
    QA("[name=ode]", form).forEach(function (r) { r.onchange = function () { st.ode = r.value; }; });
    Q("[data-demofoto]", h).onclick = function () { (FOTO[st.tur] || []).forEach(function (x) { st.foto[x[0]] = demoFoto(x[0]); }); fotoCiz(); };
    var dg = Q("#fc-dogum", h), bi = Q("#fc-iliski", h);
    if (S.profil.dogum) dg.value = S.profil.dogum; if (S.profil.iliski) bi.value = S.profil.iliski;
    function burcCiz() { var b = burcHesapla(dg.value); Q("[data-burc]", h).textContent = b ? "Burcunuz: " + b + " " + glif(b) : ""; }
    dg.addEventListener("change", burcCiz); dg.addEventListener("input", burcCiz); burcCiz();
    document.addEventListener("fal:falci", falcilarCiz);
    yenilenecek.push(gerekCiz);
    Q("[data-kvkk-ac]", h).onclick = function (e) { e.preventDefault(); modal('<h3>KVKK aydınlatma (örnek metin)</h3><p>Bu bir demo metnidir. Gerçek kurulumda, markanızın unvanı ve veri sorumlusu bilgileriyle hukuk danışmanınızın onayladığı aydınlatma metni burada yer alır.</p><p>Fotoğraf, doğum tarihi ve niyet notu yalnızca fal yorumu amacıyla işlenir; talep halinde silinir.</p>'); };
    form.addEventListener("submit", function (e) {
      e.preventDefault(); hata.textContent = "";
      var l = FOTO[st.tur] || [];
      if (!S.secFalci) { hata.textContent = "Lütfen bir falcı seçin."; return; }
      if (l.some(function (x) { return !st.foto[x[0]]; })) { hata.textContent = "Lütfen " + l.length + " fotoğrafı da ekleyin (" + l.map(function (x) { return x[1].toLowerCase(); }).join(", ") + "). Denemek için \"Demo için çizimle doldur\" düğmesini kullanabilirsiniz."; return; }
      if (!Q("[data-kvkk]", h).checked) { hata.textContent = "Devam etmek için KVKK onay kutusunu işaretleyin."; return; }
      var o = { tur: st.tur, falciId: S.secFalci, foto: l.map(function (x) { return st.foto[x[0]]; }), not: Q("#fc-not", h).value, dogum: dg.value, iliski: bi.value, odeme: st.ode };
      if (st.ode === "jeton") {
        var c = S.turler[st.tur].jeton;
        if (S.jeton < c) { hata.innerHTML = 'Jetonunuz yetersiz (gereken ' + c + '). <a href="#paketler" data-pk>Jeton paketlerine gidin</a> ya da kredi kartıyla tek seferlik ödeyin.'; Q("[data-pk]", hata).onclick = function (ev) { ev.preventDefault(); git("paketler"); }; return; }
        S.jeton -= c; bitti(gonderFal(o));
      } else odemeAc({ baslik: "Tekil fal ödemesi", ozet: (S.turler[st.tur].ad) + " · fiyat sizin kurulumda belirlediğiniz tekil fal ücretidir (demo).", tip: "tekil", onTamam: function (tk) { o.taksit = tk; bitti(gonderFal(o)); } });
    });
    function bitti(f) {
      var fc = falci(f.falciId); form.hidden = true; var g = Q(".fc-gonderildi", h); g.hidden = false;
      g.innerHTML = '<div class="fc-kart" style="text-align:center">' + (fc ? avatar(fc).replace('class="fc-av"', 'class="fc-av" style="margin:0 auto 10px"') : "") + '<h3>Falınız gönderildi</h3><p>' + esc(fc ? fc.ad : "Falcınız") + ' falınızı yorumluyor. Hazır olduğunda "Falım hazır" bildirimi gelecek (demoda birkaç saniye).</p><div class="fc-bekle" style="font-size:2rem;color:var(--altin)">✦ ✦ ✦</div><div style="margin-top:12px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="fc-btn alt kucuk" type="button" data-yeni>Yeni fal gönder</button><button class="fc-btn kucuk" type="button" data-gec>Fallarıma git</button></div></div>';
      if (gsapVar() && !AZ) gsap.fromTo(QA(".fc-bekle", g), { opacity: .2 }, { opacity: 1, duration: .6, repeat: -1, yoyo: true });
      Q("[data-yeni]", g).onclick = function () { g.hidden = true; form.hidden = false; st.foto = {}; fotoCiz(); gerekCiz(); };
      Q("[data-gec]", g).onclick = function () { git("gecmis"); };
      g.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    falcilarCiz(); fotoCiz(); gerekCiz();
  };

  MOD["paketler"] = function (h) {
    function ciz() {
      h.innerHTML = '<div class="fc-taksitbant"><svg viewBox="0 0 40 40" aria-hidden="true"><rect x="3" y="9" width="34" height="22" rx="4" fill="none" stroke="#d9ab55" stroke-width="2"/><path d="M3 15h34" stroke="#d9ab55" stroke-width="3"/><rect x="7" y="23" width="10" height="3" rx="1" fill="#9b72d0"/></svg><div><b>Kredi kartına 12 taksit</b><br><small>Tek çekim, 3, 6, 9 ve 12 taksit seçeneği (demo ödeme ekranı).</small></div></div>' +
        '<div class="fc-grid fc-g3">' + S.paketler.filter(function (p) { return p.aktif; }).map(function (p) {
          return '<div class="fc-kart fc-paket">' + (p.rozet ? '<span class="rz">' + esc(p.rozet) + "</span>" : "") + "<h3>" + esc(p.ad) + '</h3><div class="jt">' + p.jeton + '</div><div>jeton' + (p.bonus ? ' <span class="fc-chip">+' + p.bonus + " bonus</span>" : "") + '</div><div class="fy">Fiyat: teklifte</div><button class="fc-btn" type="button" data-p="' + p.id + '">Jeton al (demo)</button></div>';
        }).join("") + '</div><div class="fc-kart" style="margin-top:16px"><b>Kampanya kodu</b><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><input class="fc-in" style="flex:1;min-width:160px" data-kod placeholder="Kodunuz" autocomplete="off"><button class="fc-btn alt" type="button" data-kodok>Uygula</button></div><div class="fc-hata" data-kh></div><small style="color:var(--soluk)">Deneyin: HOSGELDIN</small></div>' +
        '<p class="fc-uyari">Tekil fal ödemesi: fal gönderirken "Kredi kartıyla tek seferlik öde" seçeneğini kullanabilirsiniz.</p>';
      QA("[data-p]", h).forEach(function (b) { b.onclick = function () {
        var p = S.paketler.filter(function (x) { return x.id === b.getAttribute("data-p"); })[0]; var tot = p.jeton + (p.bonus || 0);
        odemeAc({ baslik: p.ad + " paketi", ozet: tot + " jeton hesabınıza eklenecek.", tip: "paket", onTamam: function () { S.jeton += tot; kaydet(); toast("Jeton eklendi", tot + " jeton hesabınızda."); } });
      }; });
      Q("[data-kodok]", h).onclick = function () {
        var k = Q("[data-kod]", h).value.trim().toUpperCase(), kh = Q("[data-kh]", h), kd = S.kodlar.filter(function (x) { return x.kod === k && x.aktif; })[0];
        if (!kd) { kh.textContent = "Geçersiz ya da pasif kod."; return; }
        if (S.kullanilanKodlar.indexOf(k) > -1) { kh.textContent = "Bu kodu zaten kullandınız."; return; }
        S.kullanilanKodlar.push(k); S.jeton += kd.jeton; kaydet(); ciz(); Q("[data-kh]", h).innerHTML = '<span class="fc-ok">Kod uygulandı: +' + kd.jeton + " jeton.</span>";
      };
    }
    ciz(); yenilenecek.push(function () { var n = QA(".fc-paket", h).length; if (n !== S.paketler.filter(function (p) { return p.aktif; }).length) ciz(); });
  };

  MOD["gecmis"] = function (h) {
    function ciz() {
      var l = S.fallar.slice().reverse();
      h.innerHTML = l.length ? '<div class="fc-liste">' + l.map(function (f) {
        var fc = falci(f.falciId) || { ad: "Falcı", tip: "sal", sk: "#e8b98f", sc: "#6b3fa0", kl: "#2f6b5e", b1: "#3b2257", b2: "#8a5a2b" }, hz = f.durum === "hazir";
        return '<div class="fc-kart fc-fal"><div class="bil">' + avatar(fc) + "<div><b>" + esc((S.turler[f.tur] || {}).ad || f.tur) + "</b> · " + esc(fc.ad) + "<br><small style=\"color:var(--soluk)\">" + new Date(f.tarih).toLocaleString("tr-TR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }) + (f.puan ? " · " + "★".repeat(f.puan) : "") + '</small></div></div><div><span class="fc-durum ' + (hz ? "h" : "b") + '">' + (hz ? (f.okundu ? "Yanıtlandı" : "Yeni · hazır") : "Falcıda, bekliyor") + '</span> <button class="fc-btn kucuk' + (hz ? "" : " alt") + '" type="button" data-o="' + f.id + '">' + (hz ? "Falı oku" : "Durum") + "</button></div></div>";
      }).join("") + "</div>" : '<div class="fc-kart fc-bos">Henüz falınız yok. Bir fal gönderdiğinizde burada görünür.<br><button class="fc-btn kucuk" type="button" data-bas style="margin-top:12px">Fal gönder</button></div>';
      QA("[data-o]", h).forEach(function (b) { b.onclick = function () { sonucAc(b.getAttribute("data-o")); }; });
      var bs = Q("[data-bas]", h); if (bs) bs.onclick = function () { git("fal-gonder"); };
    }
    ciz(); var son = ""; yenilenecek.push(function () { var s = JSON.stringify(S.fallar.map(function (f) { return [f.id, f.durum, f.okundu, f.puan]; })); if (s !== son) { son = s; ciz(); } });
  };

  MOD["burc-gunluk"] = function (h) {
    var sec = burcHesapla(S.profil.dogum) || "Koç";
    function ciz() {
      var y = gunlukYorum(sec);
      h.innerHTML = '<div class="fc-burclar">' + BURC_SIRA.map(function (b) { return '<button type="button" class="fc-burc' + (b === sec ? " sec" : "") + '" data-b="' + b + '"><span>' + glif(b) + "</span><small>" + b + "</small></button>"; }).join("") + '</div><div class="fc-kart fc-bugun"><h3>' + glif(sec) + " " + sec + " · bugün</h3><p style=\"margin:0\">" + esc(y.giris) + "</p><dl><dt>Genel</dt><dd>" + esc(y.genel) + "</dd><dt>Aşk</dt><dd>" + esc(y.ask) + "</dd><dt>İş / para</dt><dd>" + esc(y.is) + "</dd><dt>Şans</dt><dd>" + esc(y.renk) + " renk · sayı " + y.sayi + '</dd></dl><div class="fc-uyari">Günlük burç yorumu eğlence amaçlıdır.</div></div>';
      QA("[data-b]", h).forEach(function (b) { b.onclick = function () { sec = b.getAttribute("data-b"); ciz(); if (gsapVar() && !AZ) gsap.from(Q(".fc-bugun", h), { y: 14, autoAlpha: 0, duration: .5 }); }; });
    }
    ciz();
  };

  MOD["davet"] = function (h) {
    h.innerHTML = '<div class="fc-kart"><h3>Arkadaşını davet et</h3><p style="margin:0">Davet kodunuzu paylaşın; arkadaşınız kodu girince ikinize de 1 jeton hediye (demo).</p><div class="fc-davetk" data-kod>' + esc(S.davet) + '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="fc-btn kucuk" type="button" data-kopya>Kodu kopyala</button> <span class="fc-ok" data-m style="align-self:center"></span></div><label class="fc-et">Arkadaşımın kodu var</label><div style="display:flex;gap:8px"><input class="fc-in" data-ak placeholder="FAL-XXXXX" autocomplete="off"><button class="fc-btn alt kucuk" type="button" data-ako>Kullan</button></div><div class="fc-hata" data-h></div></div>';
    var m = Q("[data-m]", h);
    Q("[data-kopya]", h).onclick = function () {
      var t = S.davet;
      function ok() { m.textContent = "Kopyalandı: " + t; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, function () { sec(); });
      else sec();
      function sec() { var r = document.createRange(); r.selectNodeContents(Q("[data-kod]", h)); var s = getSelection(); s.removeAllRanges(); s.addRange(r); try { document.execCommand("copy"); ok(); } catch (e) { m.textContent = "Kodu seçtik, kopyalayabilirsiniz."; } }
    };
    Q("[data-ako]", h).onclick = function () {
      var v = Q("[data-ak]", h).value.trim().toUpperCase(), er = Q("[data-h]", h);
      if (S.davetKullanildi) { er.textContent = "Davet kodunu zaten kullandınız."; return; }
      if (!/^FAL-[A-Z0-9]{5}$/.test(v)) { er.textContent = "Kod FAL-XXXXX biçiminde olmalı."; return; }
      if (v === S.davet) { er.textContent = "Kendi kodunuzu kullanamazsınız."; return; }
      S.davetKullanildi = true; S.jeton += 1; kaydet(); er.innerHTML = '<span class="fc-ok">Davet kodu geçerli: +1 jeton.</span>';
    };
  };

  var yukle = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); yukle = e; QA("[data-yukle]").forEach(function (b) { b.dataset.hazir = "1"; }); });
  MOD["pwa-kur"] = function (h) {
    h.innerHTML = '<div class="fc-kart"><h3>Telefonuna uygulama gibi ekle</h3><div class="fc-kurulum"><button class="fc-btn" type="button" data-yukle>Ana ekrana ekle</button><span class="fc-not">Sonraki adım: App Store / Google Play mobil uygulaması</span></div><div class="fc-pwa-ipucu" data-ip hidden></div></div>';
    Q("[data-yukle]", h).onclick = function () {
      var ip = Q("[data-ip]", h);
      if (yukle) { yukle.prompt(); yukle.userChoice.then(function () { yukle = null; }); return; }
      ip.hidden = false; var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      ip.innerHTML = ios ? "iPhone / iPad: Safari'de <b>Paylaş</b> simgesine dokunun, ardından <b>Ana Ekrana Ekle</b>'yi seçin." : "Tarayıcı menüsünü (⋮) açıp <b>Ana ekrana ekle</b> ya da <b>Uygulamayı yükle</b> seçeneğini kullanın. Masaüstünde adres çubuğundaki yükle simgesi de çalışır.";
    };
  };

  MOD["fincan"] = function (h) {
    var u = ++uid;
    h.className += " fc-fincan";
    h.innerHTML = '<svg viewBox="0 0 320 300" role="img" aria-label="Fincan ve tabak çizimi"><defs><linearGradient id="fg' + u + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--altin2)"/><stop offset="1" style="stop-color:var(--altin)"/></linearGradient><linearGradient id="fb' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4e9d8"/><stop offset="1" stop-color="#cdb593"/></linearGradient><radialGradient id="fs' + u + '"><stop offset="0" stop-color="#d9ab55" stop-opacity=".35"/><stop offset="1" stop-color="#d9ab55" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="160" cy="150" r="140" fill="url(#fs' + u + ')"/>' +
      '<g class="st"></g>' +
      '<ellipse cx="160" cy="250" rx="120" ry="20" fill="#3b2257"/><ellipse cx="160" cy="246" rx="120" ry="20" fill="url(#fb' + u + ')"/><ellipse cx="160" cy="244" rx="82" ry="11" fill="#cdb593"/><ellipse cx="160" cy="246" rx="120" ry="20" fill="none" stroke="url(#fg' + u + ')" stroke-width="2"/>' +
      '<g class="cup"><path d="M246 140c40-6 42 42 0 50" fill="none" stroke="url(#fg' + u + ')" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M84 124h152c0 62-26 108-76 108S84 186 84 124z" fill="url(#fb' + u + ')"/><path d="M92 156h136c-2 8-4 14-7 20H99c-3-6-5-12-7-20z" fill="#3b2257" opacity=".9"/>' +
      '<path d="M104 166l4 4 4-4M134 166l4 4 4-4M164 166l4 4 4-4M194 166l4 4 4-4" stroke="#d9ab55" fill="none" stroke-width="1.6"/>' +
      '<ellipse cx="160" cy="124" rx="76" ry="14" fill="#e6d4b6"/><ellipse class="kahve" cx="160" cy="125" rx="68" ry="10.5" fill="#2a1608"/>' +
      '<g class="telve" opacity="0" fill="none" stroke="#3a2214" stroke-width="7" stroke-linecap="round"><path d="M100 128c0 22 6 40 4 62"/><path d="M130 130c-2 30 6 52 2 78"/><path d="M172 131c2 26-4 46 0 76"/><path d="M204 129c4 20 0 36 4 58"/><path d="M226 127c0 16-2 28 0 40"/></g></g></svg>' +
      '<div class="fc-yazi" aria-live="polite">Niyetini tut; fincanı çevirelim.</div><button class="fc-btn alt kucuk" type="button">Fincanı çevir</button>';
    if (!gsapVar()) return;
    var st = Q(".st", h), parts = [];
    for (var i = 0; i < 9; i++) { var c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); c.setAttribute("cx", 130 + (i % 3) * 30); c.setAttribute("cy", 110); c.setAttribute("r", 8 + (i % 4) * 2); c.setAttribute("fill", "rgba(255,244,222,.5)"); c.style.filter = "blur(3px)"; st.appendChild(c); parts.push(c); }
    var ac = AZ ? null : parts.map(function (c, i) {
      var tl = gsap.timeline({ repeat: -1, delay: i * .45 });
      tl.fromTo(c, { y: 0, opacity: 0, scale: .4 }, { opacity: .55, duration: .9, ease: "sine.out" }).to(c, { y: -110, x: gsap.utils.random(-26, 26), scale: 1.9, duration: 3.4, ease: "sine.out" }, 0).to(c, { opacity: 0, duration: 1.5 }, ">-1.5");
      return tl;
    });
    var cup = Q(".cup", h), yazi = Q(".fc-yazi", h), btn = Q("button", h), tel = Q(".telve", h), kahve = Q(".kahve", h), busy = false;
    gsap.set(cup, { svgOrigin: "160 178" });
    btn.onclick = function () {
      if (busy) return; busy = true; btn.disabled = true;
      var tl = gsap.timeline({ onComplete: function () { busy = false; btn.disabled = false; btn.textContent = "Bir daha çevir"; } });
      tl.add(function () { yazi.textContent = "Fincan tabağa kapatılıyor…"; })
        .to(cup, { y: -60, rotation: -8, duration: .6, ease: "power2.out" })
        .to(cup, { rotation: 180, duration: 1.1, ease: "power2.inOut" })
        .to(cup, { y: 0, duration: .45, ease: "bounce.out" })
        .to(kahve, { opacity: 0, duration: .2 }, "<")
        .add(function () { yazi.textContent = "Telve soğuyor, fincan şekil çiziyor…"; })
        .set(tel, { opacity: 1 })
        .from(QA("path", tel), { strokeDasharray: 120, strokeDashoffset: 120, duration: 1.4, stagger: .25, ease: "power1.out" })
        .add(function () { yazi.textContent = "Şekiller hazır; bir falcı yorumlasın."; }, "+=.4")
        .to(cup, { y: -50, duration: .5, delay: 1.4 })
        .to(cup, { rotation: 360, duration: 1, ease: "power2.inOut" })
        .to(cup, { y: 0, duration: .4, ease: "bounce.out" })
        .set(cup, { rotation: 0 }).set(tel, { opacity: 0 }).set(kahve, { opacity: 1 })
        .add(function () { yazi.textContent = "Hazır: fotoğraflarını yükle, falın gelsin."; });
    };
  };

  MOD["parcacik"] = function (h) {
    if (AZ) return;
    var cv = document.createElement("canvas"); cv.className = "fc-parcacik"; h.appendChild(cv); var x = cv.getContext("2d"), P = [], W, H;
    function boyut() { W = cv.width = h.clientWidth; H = cv.height = h.clientHeight; }
    boyut(); addEventListener("resize", boyut);
    var n = innerWidth < 700 ? 28 : 56;
    for (var i = 0; i < n; i++) P.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 2.2, v: .01 + Math.random() * .05, f: Math.random() * 6.3, t: Math.random() < .55 ? 0 : 1 });
    function ciz(t) {
      x.clearRect(0, 0, W, H);
      for (var k = 0; k < P.length; k++) {
        var p = P[k]; p.y += p.t ? -p.v * .0016 : p.v * .0009; p.x += Math.sin(t / 2000 + p.f) * .0003;
        if (p.y < -.05) p.y = 1.05; if (p.y > 1.05) p.y = -.05;
        var px = p.x * W, py = p.y * H;
        if (p.t) { var a = .35 + .5 * Math.sin(t / 700 + p.f); x.fillStyle = "rgba(242,211,145," + Math.max(0, a) + ")"; x.beginPath(); x.moveTo(px, py - p.r * 2.2); x.lineTo(px + p.r * .6, py - p.r * .6); x.lineTo(px + p.r * 2.2, py); x.lineTo(px + p.r * .6, py + p.r * .6); x.lineTo(px, py + p.r * 2.2); x.lineTo(px - p.r * .6, py + p.r * .6); x.lineTo(px - p.r * 2.2, py); x.lineTo(px - p.r * .6, py - p.r * .6); x.fill(); }
        else { x.fillStyle = "rgba(90,52,26,.55)"; x.beginPath(); x.arc(px, py, p.r * 1.4, 0, 6.3); x.fill(); }
      }
    }
    if (gsapVar()) gsap.ticker.add(function (t) { ciz(t * 1000); }); else (function l(t) { ciz(t); requestAnimationFrame(l); })(0);
  };

  /* ---------- Başlatma ---------- */
  function sw() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    var kok = document.body.getAttribute("data-kok") || "../";
    navigator.serviceWorker.register(kok + "sw.js").catch(function () {});
  }
  function reveal() {
    if (!gsapVar() || AZ || /statik=1/.test(location.search)) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); else return;
    var l = QA(".fc-rev"); if (!l.length) return;
    gsap.set(l, { autoAlpha: 0, y: 40 });
    ScrollTrigger.batch(l, { start: "top 94%", once: true, onEnter: function (e) { gsap.to(e, { autoAlpha: 1, y: 0, duration: .9, stagger: .12, ease: "power3.out" }); } });
    setTimeout(function () { ScrollTrigger.refresh(); }, 800);
  }
  function init() {
    QA("[data-marka]").forEach(function (e) { e.textContent = CFG.marka; });
    QA("[data-logo]").forEach(function (e) { e.innerHTML = logoSvg(); });
    QA("[data-modul]").forEach(function (e) { var f = MOD[e.getAttribute("data-modul")]; if (f) f(e); });
    yenile(); hazirKontrol(); bekleyenZamanla(); sw(); reveal();
    window.addEventListener("storage", function (e) {
      if (e.key !== CFG.anahtar + "durum") return; var k = ls("durum"); if (!k) return; for (var a in k) S[a] = k[a]; yenile(); bildirimKontrol();
    });
    QA("[data-sifirla]").forEach(function (b) { b.onclick = sifirla; });
    if (/[?&]test=1/.test(location.search)) selfTest();
    if (/[?&]olc=1/.test(location.search)) setTimeout(function () { var p = document.createElement("pre"); p.id = "fc-olc"; p.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;background:#fff;color:#c00;font:11px monospace;white-space:pre-wrap;margin:0"; var w = document.documentElement.clientWidth, en = []; QA("body *").forEach(function (e) { var r = e.getBoundingClientRect(); if (r.width && r.right > w + 1 && !e.closest(".djr,.fc-toast")) en.push(e.tagName + "." + e.className + ":" + Math.round(r.right)); }); p.textContent = "OLC iw=" + innerWidth + " cw=" + w + " sw=" + document.documentElement.scrollWidth + " tasan=" + en.slice(0, 6).join(" | "); document.body.appendChild(p); }, 2500);
    if (/[?&]odeme=1/.test(location.search)) odemeAc({ baslik: "Mistik paketi", ozet: "9 jeton hesabınıza eklenecek.", tip: "paket", onTamam: function () {} });
  }
  function selfTest() {
    CFG.hazirMs = 600; var r = { adim: [] };
    try {
      r.adim.push("burc 1990-03-25 = " + burcHesapla("1990-03-25")); r.adim.push("burc 1988-12-23 = " + burcHesapla("1988-12-23")); r.adim.push("burc 1991-01-05 = " + burcHesapla("1991-01-05"));
      S.jeton += 5; var f = gonderFal({ tur: "kahve", falciId: "f1", foto: [demoFoto("fincan"), demoFoto("tabak"), demoFoto("telve")], not: "Yeni iş", dogum: "1990-03-25", iliski: "Evli", odeme: "jeton" }); S.jeton -= 2; kaydet();
      r.adim.push("fal gonderildi, durum=" + f.durum);
      setTimeout(function () {
        hazirKontrol(); var g = fal(f.id); r.adim.push("0.9sn sonra durum=" + g.durum + " kaynak=" + g.kaynak + " paragraf=" + (g.yanit || []).length);
        r.adim.push("toast gorunur=" + (toastEl && !toastEl.hidden)); r.adim.push("jeton=" + S.jeton); if (/[?&]sonuc=1/.test(location.search)) sonucAc(f.id);
        var pre = document.createElement("pre"); pre.id = "fc-test"; pre.textContent = JSON.stringify(r); document.body.appendChild(pre);
      }, 1500);
    } catch (e) { r.hata = String(e); var pre = document.createElement("pre"); pre.id = "fc-test"; pre.textContent = JSON.stringify(r); document.body.appendChild(pre); }
  }
  window.FAL = { CFG: CFG, S: S, ls: ls, esc: esc, kaydet: kaydet, falci: falci, fal: fal, avatar: avatar, logoSvg: logoSvg, yildizlar: yildizlar, yorumUret: yorumUret, burcHesapla: burcHesapla, glif: glif, toast: toast, modal: modal, git: git, sonucAc: sonucAc, yenile: yenile, yenilenecek: yenilenecek, sifirla: sifirla, rk: rk, bildirimKontrol: bildirimKontrol, odemeAc: odemeAc, tur: TUR_IKON, MOD: MOD };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
