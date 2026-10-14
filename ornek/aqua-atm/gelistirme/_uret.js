// Geliştirme prototipi 1: eski 1-bayilik-merkezi sayfasını Aqua ATM'nin mevcut site görünümüne (üst menü + DM Sans) çevirir.
const fs = require("fs"), path = require("path");
const K = __dirname, ESKI = path.join(K, "..", "1-bayilik-merkezi", "index.html");
const ust = (akt) => `<header class="site-ust"><div class="kap"><a class="site-logo" href="#"><img src="../img/logo-ikon.png" alt="Aqua ATM">AQUA <span>ATM</span></a>
<nav class="site-men"><a href="#">Ana Sayfa</a><a href="#">Hakkımızda</a><a href="#">Çalışma Prensibi</a><a class="yeni${akt === 1 ? " akt" : ""}" href="../1-site-bayilik/">Bayilik</a><a class="yeni${akt === 2 ? " akt" : ""}" href="../2-atm-bul-uygulama/">Su Noktaları</a><a class="yeni" href="../1-site-bayilik/#blog">Blog</a><a href="#">Referanslar</a><a href="#">Sertifikalar</a><a href="#">S.S.S.</a><a href="#">İletişim</a></nav>
<span class="dil">TR · EN</span></div></header>`;
let h = fs.readFileSync(ESKI, "utf8");
h = h.replace(/<title>[^<]*<\/title>/, "<title>Aqua ATM · Bayilik sayfası (mevcut sitenize eklenir) · Geliştirme 1</title>")
  .replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet">')
  .replace('href="../ortak/aqua.css">', 'href="../../ortak/aqua.css"><link rel="stylesheet" href="../tema.css">')
  .replace(/\.\.\/img\//g, "../../img/")
  .replace(/<header class="ust-bar">[\s\S]*?<\/header>/, ust(1) + `
<div class="kap" style="padding-top:16px"><div class="yeni-bant"><b>YENİ SAYFA</b><span>Bu sayfa mevcut <b style="background:none;color:inherit;padding:0">aquaatm.com.tr</b> sitenize <b style="background:none;color:inherit;padding:0">/bayilik/</b> adresiyle eklenir. Var olan sayfalarınız, tasarımınız ve yönetim paneliniz (WordPress) aynen kalır. Menüde turuncu "YENİ" işaretli bölümler eklenecek olanlardır.</span></div></div>`)
  .replace("Başvuru, ilinize bakan bölge distribütörüne otomatik iletilir (Prototip 3'teki panelde görünür). WhatsApp'tan da yazabilirsiniz.", "Başvuru, ilinize bakan bölge distribütörüne ve merkeze WhatsApp + e-posta ile anında iletilir; WordPress panelinizde liste olarak da görünür.")
  .replace('<a href="../index.html">tüm öneriler</a>', '<a href="../index.html">teklif sayfası</a>');
fs.writeFileSync(path.join(K, "1-site-bayilik", "index.html"), h);
console.log("1-site-bayilik yazıldı", h.length);
