/* RunInvestingTR Akademi · platform başlangıç verisi (11 Eki 2026, 1903'ün "düzenlemeler" notu + tanıtım videosuna göre)
   Program ve ders adları hocanın kendi sitesinden birebir alındı; ders listesi olmayan programlara yönetici panelinden ders eklenir.
   SPL soruları ÖRNEKTİR: hocanın özgün ders notlarıyla yönetici panelinden büyütülür. */
window.RIT_VERI = {
  surum: 3,
  programlar: [
    { kod: "A", baslik: "Finansal Yatırım", aciklama: "Finansal yatırımın temel kavramları, finansal piyasaların işleyişi ve yatırım araçları.", gorsel: "../img/levent.jpg" },
    { kod: "B", baslik: "Finansal Piyasalarda Yatırımcı Olmak", aciklama: "Yatırımcı psikolojisi, yatırımcı davranışları, risk yönetimi ve yatırımcı disiplininin temel prensipleri.", gorsel: "../img/islem-odasi.jpg" },
    { kod: "C", baslik: "Finansal Okuryazarlık", aciklama: "Ekonomik ve finansal gelişmeleri doğru değerlendirebilmek için gerekli temel bilgiler.", gorsel: "../img/kutuphane.jpg" },
    { kod: "D", baslik: "Teknik Analiz", aciklama: "Grafik okuma, trend analizi, indikatörler, formasyonlar ve teknik analiz stratejileri.", gorsel: "../img/ekran-yakin.jpg" }
  ],
  // video: YouTube (liste dışı) bağlantısı; boşsa "Video yakında eklenecek". demo: ücretsiz üyenin izleyebildiği ders.
  dersler: [
    { id: "A1", program: "A", sira: 1, baslik: "Finansal Yatırım Nedir ve Finansal Piyasa Türleri", video: "", demo: true },
    { id: "A2", program: "A", sira: 2, baslik: "Finansal Piyasaların Fonksiyonları", video: "" },
    { id: "A3", program: "A", sira: 3, baslik: "Finansal Yatırım Araçları ve Ürünler", video: "" },
    { id: "A4", program: "A", sira: 4, baslik: "Para ve Sermaye Piyasaları ve Genel Bilgiler", video: "" },
    { id: "B1", program: "B", sira: 1, baslik: "Yatırımcı Psikolojisi", video: "", demo: true },
    { id: "B2", program: "B", sira: 2, baslik: "Yatırımcı Davranışları ve Yatırımcı Prensipleri", video: "" },
    { id: "B3", program: "B", sira: 3, baslik: "Piyasayla Birlikte Hareket Etmek", video: "" },
    { id: "B4", program: "B", sira: 4, baslik: "Risk Yönetimi", video: "" },
    { id: "B5", program: "B", sira: 5, baslik: "Yatırımcı Disiplininin Önemi", video: "" }
  ],
  dokumanKategorileri: ["Haftalık Analizler", "Makroekonomik Araştırmalar", "Finansal Eğitimler", "SPL 1. Düzey", "SPL 2. Düzey", "SPL 3. Düzey", "Türev Araçlar", "Videolu Anlatım"],
  dokumanlar: [
    { id: "d1", kategori: "Makroekonomik Araştırmalar", tarih: "2026-09-26", baslik: "Tera ve Pusula Fon Krizi: Haftalar Öncesinden Yaptığım Uyarılar ve Krizin Anatomisi", dosya: "dosya/tera-pusula-fon-krizi.pdf", demo: true }
  ],
  // erişim alanları: arsiv (video arşivi), dokuman, canli, forum, spl
  paketler: [
    { kod: "spl", ad: "SPL Soru Bankası", fiyat: "1.490 ₺", donem: "6 ay", vurgu: "Tüm düzeyler tek fiyat", erisim: ["spl"],
      maddeler: ["SPL 1, 2, 3. Düzey + Türev Araçlar", "Sınırsız 10 soruluk alıştırma", "25 soruluk gerçek sınav formatında denemeler", "Konu bazlı başarı analizi"], not: "Rakipler her düzeyi ayrı satıyor (1.200-1.600 ₺/düzey)." },
    { kod: "arsiv", ad: "Arşiv Paketi", fiyat: "4.900 ₺", donem: "1 yıl", vurgu: "Kendi hızınızda", erisim: ["arsiv", "dokuman"],
      maddeler: ["A-B-C-D programlarının tüm ders videoları", "Haftalık analizler ve makro araştırmalar", "Ders notları (PDF)", "Sertifika"], not: "Canlı eğitim ve forum dahil değildir." },
    { kod: "tam", ad: "Tam Paket", fiyat: "$500", donem: "1 yıl", vurgu: "En kapsamlı", erisim: ["arsiv", "dokuman", "canli", "forum", "spl"], one: true,
      maddeler: ["Haftalık canlı eğitimler", "Rütbeli yatırımcı forumu", "Tüm video arşivi ve dokümanlar", "SPL Soru Bankası dahil", "Kıdemli yatırımcıya ödüller"], not: "" }
  ],
  forumKategorileri: [
    { id: "altin", ad: "Altın", aciklama: "Altın ile ilgili analiz ve tartışmalar" },
    { id: "borsa", ad: "Borsa", aciklama: "Borsa İstanbul ve dünya borsaları ile ilgili tartışmalar" },
    { id: "egitim", ad: "Eğitim & Sorular", aciklama: "Derslerle ilgili sorular ve tartışmalar" },
    { id: "fx", ad: "FX", aciklama: "Döviz ve global piyasa enstrümanları" },
    { id: "genel", ad: "Genel Sohbet", aciklama: "Diğer her şey" }
  ],
  // puanlar (hocanın sistemi): paylaşım 5 · yorum 2 · beğeni almak 1 · beğeni vermek 1
  puan: { paylasim: 5, yorum: 2, begeniAl: 1, begeniVer: 1 },
  rutbeler: [
    { ad: "Acemi Yatırımcı", min: 0 }, { ad: "Yatırımcı", min: 30 }, { ad: "Deneyimli Yatırımcı", min: 100 },
    { ad: "Uzman Yatırımcı", min: 300 }, { ad: "Kıdemli Yatırımcı", min: 800, odul: "Kitap / ücretsiz SPL erişimi gibi ödüller" }
  ],
  splDuzeyler: [
    { kod: "spl1", ad: "SPL 1. Düzey" }, { kod: "spl2", ad: "SPL 2. Düzey" }, { kod: "spl3", ad: "SPL 3. Düzey" }, { kod: "turev", ad: "Türev Araçlar" }
  ],
  // c[0] doğru şık (gösterimde karışır) · a: açıklama · k: konu
  sorular: [
    { d: "spl1", k: "Mevzuat", s: "Sermaye Piyasası Kurulu'nun (SPK) temel amacı aşağıdakilerden hangisidir?", c: ["Sermaye piyasasının güvenilir, şeffaf ve istikrarlı işleyişini sağlamak ve yatırımcıları korumak", "Para politikasını belirlemek", "Bankaları denetlemek", "Vergi oranlarını belirlemek"], a: "SPK, 6362 sayılı Kanun kapsamında piyasanın güvenilir, şeffaf, etkin ve istikrarlı işleyişini ve yatırımcı haklarının korunmasını sağlar." },
    { d: "spl1", k: "Mevzuat", s: "Kaydileştirilmiş sermaye piyasası araçlarının hak sahipliği kayıtlarını tutan kuruluş hangisidir?", c: ["Merkezi Kayıt Kuruluşu (MKK)", "Takasbank", "Borsa İstanbul", "TCMB"], a: "MKK, kaydi sistemde hak sahipliğini elektronik ortamda izler." },
    { d: "spl1", k: "Mevzuat", s: "Borsa İstanbul pay piyasasında takas ve merkezi karşı taraf hizmetini sunan kuruluş hangisidir?", c: ["Takasbank", "MKK", "SPK", "BDDK"], a: "İstanbul Takas ve Saklama Bankası (Takasbank) takas ve MKT hizmetini verir." },
    { d: "spl1", k: "Mevzuat", s: "Pay piyasasında işlemlerin takas süresi genel olarak nedir?", c: ["T+2", "T+0", "T+1", "T+5"], a: "Pay piyasasında takas, işlem gününden sonraki 2. iş günü (T+2) gerçekleşir." },
    { d: "spl1", k: "Mevzuat", s: "Yatırımcı Tazmin Merkezi'nin temel işlevi nedir?", c: ["Yükümlülüğünü yerine getiremeyen yatırım kuruluşlarındaki yatırımcı alacaklarını belirli limitlerle karşılamak", "Halka arz fiyatını belirlemek", "Borsa endekslerini hesaplamak", "Şirketlere kredi vermek"], a: "YTM, yatırım kuruluşunun nakit ödeme veya araç teslim yükümlülüğünü yerine getirememesi halinde devreye girer." },
    { d: "spl1", k: "Mevzuat", s: "Halka arzda izahnamenin onaylanması hangi kurumun yetkisindedir?", c: ["SPK", "Borsa İstanbul", "Ticaret Bakanlığı", "TCMB"], a: "İzahname SPK tarafından onaylanır; onay, ihraççının veya aracın garantisi anlamına gelmez." },
    { d: "spl1", k: "Ekonomi", s: "Türkiye'de para politikasının uygulanmasından sorumlu kurum hangisidir?", c: ["TCMB", "SPK", "BDDK", "TÜİK"], a: "Fiyat istikrarını sağlamak ve para politikasını uygulamak TCMB'nin görevidir." },
    { d: "spl1", k: "Ekonomi", s: "Harcamalar yöntemiyle GSYH nasıl hesaplanır?", c: ["Tüketim + Yatırım + Kamu harcaması + (İhracat − İthalat)", "Ücretler + Faiz + Kira + Kâr", "Üretim − Ara malları", "İhracat + İthalat"], a: "GSYH = C + I + G + (X − M)." },
    { d: "spl1", k: "Ekonomi", s: "Merkez bankası politika faizini artırdığında genellikle ne beklenir?", c: ["Piyasa faizleri yükselir, kredi talebi azalır", "Enflasyon hemen artar", "Kredi talebi artar", "Döviz kuru mutlaka yükselir"], a: "Sıkı para politikası borçlanma maliyetini artırarak talebi yavaşlatır." },
    { d: "spl1", k: "Temel Finans", s: "10.000 TL yıllık %20 bileşik faizle 2 yıl değerlendirilirse vade sonu değeri kaç TL olur?", c: ["14.400", "14.000", "12.000", "14.800"], a: "10.000 × 1,20² = 14.400 TL." },
    { d: "spl1", k: "Temel Finans", s: "Nominal faiz %30, enflasyon %20 ise reel faiz yaklaşık yüzde kaçtır?", c: ["%8,33", "%10", "%50", "%6"], a: "Fisher: (1,30 / 1,20) − 1 ≈ %8,33." },
    { d: "spl1", k: "Muhasebe", s: "Bilançoda öz kaynaklar nasıl bulunur?", c: ["Toplam varlıklar − Yabancı kaynaklar", "Dönen varlıklar − Duran varlıklar", "Satışlar − Maliyetler", "Kâr − Temettü"], a: "Varlıklar = Yabancı kaynaklar + Öz kaynaklar eşitliğinden." },
    { d: "spl1", k: "Muhasebe", s: "Cari oran hangi formülle hesaplanır?", c: ["Dönen varlıklar / Kısa vadeli yabancı kaynaklar", "Toplam borç / Öz kaynak", "Net kâr / Satışlar", "Duran varlıklar / Öz kaynak"], a: "Cari oran kısa vadeli borç ödeme gücünü gösterir." },
    { d: "spl1", k: "Temel Finans", s: "Çeşitlendirme ile ortadan kaldırılamayan risk türü hangisidir?", c: ["Sistematik risk", "Firmaya özgü risk", "Sistematik olmayan risk", "Yönetim riski"], a: "Sistematik (piyasa) risk tüm piyasayı etkiler; çeşitlendirme ile giderilemez." },
    { d: "spl2", k: "Analiz", s: "Fiyat/Kazanç (F/K) oranı nasıl hesaplanır?", c: ["Hisse fiyatı / Hisse başına net kâr", "Net kâr / Öz kaynak", "Piyasa değeri / Satışlar", "Temettü / Fiyat"], a: "F/K, yatırımcının 1 TL kâr için ödediği fiyatı gösterir." },
    { d: "spl2", k: "Sabit Getirili", s: "Piyasa faizleri yükseldiğinde mevcut sabit kuponlu tahvillerin fiyatı ne olur?", c: ["Düşer", "Yükselir", "Değişmez", "Önce yükselir sonra düşer"], a: "Tahvil fiyatı ile faiz arasında ters ilişki vardır." },
    { d: "spl2", k: "Sabit Getirili", s: "Bir tahvilin durasyonu büyüdükçe faiz değişimlerine duyarlılığı nasıl değişir?", c: ["Artar", "Azalır", "Değişmez", "Sıfırlanır"], a: "Durasyon, fiyatın faize duyarlılığının ölçüsüdür." },
    { d: "spl2", k: "Portföy", s: "Beta katsayısı 1,5 olan bir hisse için doğru ifade hangisidir?", c: ["Piyasa hareketlerine piyasadan 1,5 kat daha duyarlıdır", "Piyasadan bağımsız hareket eder", "Riski piyasanın yarısıdır", "Her yıl %1,5 getiri sağlar"], a: "Beta, sistematik riskin ölçüsüdür; 1'in üzerindeki beta daha yüksek duyarlılık demektir." },
    { d: "spl2", k: "Portföy", s: "Sharpe oranı hangi formülle hesaplanır?", c: ["(Portföy getirisi − Risksiz getiri) / Standart sapma", "(Portföy getirisi − Risksiz getiri) / Beta", "Portföy getirisi / Piyasa getirisi", "Standart sapma / Getiri"], a: "Sharpe, toplam risk birimi başına ek getiriyi ölçer." },
    { d: "spl2", k: "Portföy", s: "Korelasyon katsayısı −1 olan iki varlıkla kurulan portföy için doğru ifade hangisidir?", c: ["Çeşitlendirme faydası en yüksektir", "Risk azaltılamaz", "Getiriler aynı yönde hareket eder", "Portföy riski iki varlığın riskinin toplamıdır"], a: "Tam ters korelasyonda uygun ağırlıklarla risk teorik olarak sıfırlanabilir." },
    { d: "spl2", k: "Araçlar", s: "Kira sertifikalarını ihraç eden kuruluş hangisidir?", c: ["Varlık kiralama şirketi", "Takasbank", "Yatırım fonu", "Portföy aracı kurumu"], a: "Kira sertifikaları varlık kiralama şirketlerince ihraç edilir." },
    { d: "spl2", k: "Araçlar", s: "Bir yatırım fonunun birim pay fiyatı nasıl bulunur?", c: ["Fon toplam değeri / Dolaşımdaki pay sayısı", "Fon kârı / Yatırımcı sayısı", "Fon portföyü / Kurucu sermayesi", "Endeks değeri / 100"], a: "Birim pay değeri = fon toplam değeri / dolaşımdaki pay sayısı." },
    { d: "spl2", k: "Teknik Analiz", s: "Teknik analizde \"destek\" seviyesi neyi ifade eder?", c: ["Düşüşün durması beklenen fiyat seviyesini", "Yükselişin durması beklenen seviyeyi", "Ortalama işlem hacmini", "Temettü verimini"], a: "Destek, alım talebinin yoğunlaştığı ve düşüşün yavaşlaması beklenen bölgedir." },
    { d: "spl2", k: "Teknik Analiz", s: "Kısa vadeli hareketli ortalamanın uzun vadeliyi aşağıdan yukarı kesmesi genellikle nasıl yorumlanır?", c: ["Al sinyali", "Sat sinyali", "Yatay piyasa", "Hacim düşüşü"], a: "Bu kesişim yükseliş eğiliminin başladığına işaret sayılır (\"altın kesişim\")." },
    { d: "spl2", k: "Analiz", s: "Temettü verimi nasıl hesaplanır?", c: ["Hisse başına temettü / Hisse fiyatı", "Temettü / Net kâr", "Net kâr / Fiyat", "Fiyat / Temettü"], a: "Temettü verimi, fiyat başına nakit getiri oranıdır." },
    { d: "spl3", k: "Portföy Yönetimi", s: "CAPM'e göre risksiz faiz %10, beta 1,2 ve piyasa getirisi %20 ise beklenen getiri yüzde kaçtır?", c: ["%22", "%24", "%20", "%12"], a: "E(R) = 10 + 1,2 × (20 − 10) = %22." },
    { d: "spl3", k: "Kurumsal Finansman", s: "Net bugünkü değeri (NBD) pozitif olan bir proje için genel karar nedir?", c: ["Kabul edilir", "Reddedilir", "Ertelenir", "Karar verilemez"], a: "Pozitif NBD, projenin sermaye maliyetinin üzerinde değer yarattığını gösterir." },
    { d: "spl3", k: "Kurumsal Finansman", s: "İç verim oranı (İVO) nedir?", c: ["NBD'yi sıfıra eşitleyen iskonto oranı", "Ağırlıklı ortalama sermaye maliyeti", "Risksiz faiz oranı", "Temettü büyüme oranı"], a: "İVO, nakit akışlarının bugünkü değerini başlangıç yatırımına eşitler." },
    { d: "spl3", k: "Değerleme", s: "Gordon büyüme modeline göre gelecek yıl temettüsü 5 TL, iskonto oranı %15, büyüme %5 olan hissenin değeri kaç TL'dir?", c: ["50", "33,3", "25", "100"], a: "P0 = D1 / (r − g) = 5 / 0,10 = 50 TL." },
    { d: "spl3", k: "Portföy Yönetimi", s: "Markowitz'in etkin sınırı neyi gösterir?", c: ["Her risk düzeyinde en yüksek beklenen getiriyi sunan portföyleri", "Risksiz varlıkların getirisini", "En düşük maliyetli fonları", "Piyasa endeksini"], a: "Etkin sınırın altındaki portföyler aynı riskte daha az getiri sunar." },
    { d: "spl3", k: "Performans", s: "Treynor oranının paydasında hangi risk ölçüsü yer alır?", c: ["Beta", "Standart sapma", "Varyans", "Takip hatası"], a: "Treynor = (Rp − Rf) / β; sistematik risk başına ek getiri." },
    { d: "spl3", k: "Performans", s: "Jensen alfası neyi ölçer?", c: ["Portföyün CAPM'e göre beklenen getirinin üzerinde sağladığı getiriyi", "Toplam riski", "Piyasa getirisini", "İşlem maliyetini"], a: "Pozitif alfa, yöneticinin piyasaya göre fazladan değer yarattığını gösterir." },
    { d: "spl3", k: "Kurumsal Finansman", s: "Vergisiz Modigliani-Miller yaklaşımına göre sermaye yapısı firma değerini nasıl etkiler?", c: ["Etkilemez", "Borç arttıkça değer artar", "Borç arttıkça değer azalır", "Yalnız temettüye bağlıdır"], a: "Vergisiz, mükemmel piyasa varsayımında firma değeri finansman bileşiminden bağımsızdır." },
    { d: "spl3", k: "Kurumsal Finansman", s: "Ağırlıklı ortalama sermaye maliyeti (AOSM/WACC) neyi ifade eder?", c: ["Borç ve öz kaynak maliyetlerinin ağırlıklı ortalamasını", "Yalnız kredi faizini", "Temettü verimini", "Risksiz faizi"], a: "AOSM, yatırımların aşması gereken asgari getiri oranıdır." },
    { d: "turev", k: "Vadeli İşlemler", s: "Futures (vadeli işlem) sözleşmelerini forward sözleşmelerden ayıran temel özellik hangisidir?", c: ["Standart olmaları, borsada işlem görmeleri ve takas kurumu güvencesi", "Tezgâh üstü olmaları", "Teminat gerektirmemeleri", "Vadelerinin olmaması"], a: "Futures borsada, standart koşullarla ve merkezi karşı taraf güvencesiyle işlem görür." },
    { d: "turev", k: "Opsiyonlar", s: "Alım (call) opsiyonu alıcısı hangi hakka sahiptir?", c: ["Dayanak varlığı belirlenen fiyattan satın alma hakkı (yükümlülük değil)", "Satma yükümlülüğü", "Satın alma yükümlülüğü", "Prim alma hakkı"], a: "Opsiyon alıcısı hak sahibidir; yükümlülük satıcıdadır." },
    { d: "turev", k: "Opsiyonlar", s: "Satım (put) opsiyonu satıcısının elde edebileceği en yüksek kazanç nedir?", c: ["Aldığı prim", "Sınırsız", "Kullanım fiyatı", "Dayanak varlığın fiyatı"], a: "Opsiyon satıcısının kazancı tahsil ettiği primle sınırlıdır." },
    { d: "turev", k: "Opsiyonlar", s: "Avrupa tipi opsiyon ne zaman kullanılabilir?", c: ["Yalnız vade sonunda", "Vade boyunca her gün", "Yalnız ilk gün", "Sadece seans arasında"], a: "Amerikan tipi vade boyunca, Avrupa tipi yalnız vade sonunda kullanılır." },
    { d: "turev", k: "VİOP", s: "VİOP'ta pozisyonların her gün uzlaşma fiyatına göre değerlenip kâr/zararın hesaba yansıtılmasına ne denir?", c: ["Günlük teminatlandırma (piyasaya göre değerleme)", "Erken kapanış", "Temerrüt", "Fiziki teslimat"], a: "Marking-to-market ile kâr/zarar günlük olarak teminat hesabına yansır." },
    { d: "turev", k: "VİOP", s: "Teminat, sürdürme teminatının altına düştüğünde ne olur?", c: ["Teminat tamamlama çağrısı yapılır", "Pozisyon otomatik ikiye katlanır", "Hiçbir şey olmaz", "Sözleşme vadesi uzar"], a: "Yatırımcıdan başlangıç teminatı seviyesine tamamlama istenir; yapılmazsa pozisyon kapatılabilir." },
    { d: "turev", k: "Fiyatlama", s: "Spot fiyat 100 TL, yıllık risksiz faiz %20 (basit) ise 6 ay vadeli teorik fiyat kaç TL'dir?", c: ["110", "120", "105", "100"], a: "F = 100 × (1 + 0,20 × 6/12) = 110 TL." },
    { d: "turev", k: "Stratejiler", s: "Elindeki varlığın fiyatının düşmesinden korunmak isteyen yatırımcı vadeli piyasada ne yapmalıdır?", c: ["Vadeli satış pozisyonu alır (kısa hedge)", "Vadeli alış pozisyonu alır", "Alım opsiyonu satar ve bekler", "Hiçbir şey yapmaz"], a: "Kısa hedge, spot tarafta uzun pozisyonu korur." },
    { d: "turev", k: "Opsiyonlar", s: "Kullanım fiyatı 50, prim 3 olan alım opsiyonunda vade sonu spot fiyat 58 ise alıcının net kârı kaç TL'dir?", c: ["5", "8", "3", "11"], a: "Kâr = (58 − 50) − 3 = 5 TL." },
    { d: "turev", k: "Swap", s: "Swap sözleşmesi temel olarak nedir?", c: ["Tarafların belirli dönemlerde nakit akışlarını değiştirmesi", "Tek seferlik spot alım", "Hisse halka arzı", "Bir mevduat türü"], a: "Faiz ve döviz swapları en yaygın türlerdir." }
  ],
  // ücretsiz üye kayıt anketi (hocanın sitesindeki sorular): yatırımcı profili verisi
  ilgiAlanlari: ["Borsa İstanbul", "ABD Borsaları", "Forex", "Altın", "Kripto", "Makro Ekonomi"],
  seviyeler: ["Başlangıç", "Orta", "İleri"]
};
