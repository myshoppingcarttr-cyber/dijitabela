/* StokPazarı prototip demo verisi (Dijitabela). Tüm firma ve kişi adları uydurmadır. */
(function () {
  var KATEGORI = [
    { id: "gida", ad: "Gıda", buyuk: "GIDA", renk: "#D9691F", on: "GD", uye: 412, ikon: "cuval" },
    { id: "mobilya", ad: "Mobilya", buyuk: "MOBİLYA", renk: "#8A5A36", on: "MB", uye: 268, ikon: "koltuk" },
    { id: "otomotiv", ad: "Otomotiv", buyuk: "OTOMOTİV", renk: "#2C5C8F", on: "OT", uye: 335, ikon: "lastik" },
    { id: "kozmetik", ad: "Kozmetik", buyuk: "KOZMETİK", renk: "#BE3F74", on: "KZ", uye: 187, ikon: "krem" },
    { id: "makina", ad: "Makina", buyuk: "MAKİNA", renk: "#4B5768", on: "MK", uye: 296, ikon: "disli" },
    { id: "tekstil", ad: "Tekstil", buyuk: "TEKSTİL", renk: "#6A4BA3", on: "TX", uye: 354, ikon: "kumas" },
    { id: "ambalaj", ad: "Ambalaj", buyuk: "AMBALAJ", renk: "#A9801F", on: "AM", uye: 221, ikon: "koli" },
    { id: "elektrik", ad: "Elektrik", buyuk: "ELEKTRİK", renk: "#D19A00", on: "EL", uye: 243, ikon: "ampul" },
    { id: "yapi", ad: "Yapı Malzemesi", buyuk: "YAPI MALZEMESİ", renk: "#7B6650", on: "YP", uye: 198, ikon: "seramik" },
    { id: "kimya", ad: "Kimya & Temizlik", buyuk: "KİMYA & TEMİZLİK", renk: "#1E8A6E", on: "KM", uye: 164, ikon: "bidon" }
  ];

  /* [id, ad, kategoriler, il, ilçe, kuruluş, paket, yetkili, unvan, uzmanlık, katıldı(gün önce), telOk, epostaOk] */
  var F = [
    ["toroslu", "Toroslu Mobilya San. ve Tic. Ltd. Şti.", ["mobilya"], "Kayseri", "Melikgazi", 1998, "kurumsal", "Murat Toroslu", "Satış Müdürü", "otel, ofis ve restoran mobilyası üretimi", 41, 1, 1],
    ["camlibel", "Çamlıbel Unlu Mamuller A.Ş.", ["gida"], "Konya", "Selçuklu", 2004, "kurumsal", "Hatice Çamlıbel", "Genel Müdür Yardımcısı", "ekmeklik ve pastalık un, unlu mamul hammaddesi", 2, 1, 1],
    ["gokdere", "Gökdere Tarım Ürünleri Ltd. Şti.", ["gida"], "Antalya", "Kumluca", 2011, "basic", "Serkan Gökdere", "Kurucu Ortak", "sera ürünleri, kuru meyve ve salça", 3, 1, 1],
    ["kizilirmak", "Kızılırmak Oto Yedek Parça", ["otomotiv"], "Ankara", "Yenimahalle", 1993, "kurumsal", "Levent Aydemir", "Satın Alma ve Satış Sorumlusu", "hafif ticari araç yedek parçası ve madeni yağ", 5, 1, 1],
    ["lavandula", "Lavandula Doğal Kozmetik", ["kozmetik"], "Isparta", "Merkez", 2016, "kurumsal", "Elif Sandıkçı", "Marka Müdürü", "lavanta ve gül bazlı doğal bakım ürünleri", 6, 1, 1],
    ["demirag", "Demirağ Hidrolik Makina San.", ["makina"], "Bursa", "Nilüfer", 2001, "kurumsal", "Cengiz Demirağ", "Fabrika Müdürü", "hidrolik pres, silindir ve güç üniteleri", 8, 1, 1],
    ["ipekyolu", "İpekyolu Örme Tekstil Ltd. Şti.", ["tekstil"], "Denizli", "Merkezefendi", 2007, "kurumsal", "Burcu Ateşli", "İhracat Müdürü", "penye, ribana ve interlok örme kumaş", 9, 1, 1],
    ["sedirpak", "Sedirpak Ambalaj San. Tic.", ["ambalaj"], "Gaziantep", "Şehitkamil", 2012, "basic", "Ömer Faruk Sedir", "İşletme Sahibi", "oluklu mukavva koli ve kutu", 11, 1, 0],
    ["ilgin", "Ilgın Elektrik Malzemeleri Tic.", ["elektrik"], "İzmir", "Bornova", 2009, "kurumsal", "Tolga Ilgın", "Bölge Satış Sorumlusu", "anahtarlama, sigorta ve pano malzemesi", 12, 1, 1],
    ["tasdelen", "Taşdelen Yapı Malzemeleri", ["yapi"], "Eskişehir", "Odunpazarı", 1996, "basic", "Ramazan Taşdelen", "İşletme Sahibi", "alçı, sıva ve kaba yapı malzemesi", 14, 1, 1],
    ["berrak", "Berrak Kimya ve Temizlik Ürünleri", ["kimya"], "Kocaeli", "Gebze", 2010, "kurumsal", "Deniz Okumuş", "Satış Müdürü", "endüstriyel temizlik ve hijyen ürünleri", 15, 1, 1],
    ["saricam", "Sarıçam Ahşap Tasarım", ["mobilya"], "Bursa", "İnegöl", 2005, "kurumsal", "Yusuf Sarıçam", "Tasarım Ortağı", "masif ahşap yemek odası ve oturma grupları", 17, 1, 1],
    ["ilgaz", "Ilgaz Bakliyat ve Gıda", ["gida"], "Çorum", "Merkez", 1989, "kurumsal", "Mehmet Ali Ilgaz", "Ticaret Müdürü", "bakliyat, pirinç ve leblebi", 18, 1, 1],
    ["erguven", "Ergüven Oto Lastik", ["otomotiv"], "İstanbul", "Başakşehir", 2003, "kurumsal", "Gökhan Ergüven", "Toptan Satış Sorumlusu", "binek ve hafif ticari lastik toptan satışı", 20, 1, 1],
    ["nergis", "Nergis Kişisel Bakım", ["kozmetik"], "İstanbul", "Esenyurt", 2013, "kurumsal", "Aslı Yener", "Kanal Müdürü", "otel ve kişisel bakım ürünleri fason üretimi", 21, 1, 1],
    ["kocyigit", "Koçyiğit CNC Makina", ["makina"], "Konya", "Karatay", 2008, "basic", "Hasan Koçyiğit", "Teknik Müdür", "CNC takım tezgâhı aparatları ve takım tutucu", 23, 1, 1],
    ["akkus", "Akkuş Konfeksiyon", ["tekstil"], "Bursa", "Osmangazi", 2000, "kurumsal", "Kemal Akkuş", "İşletme Müdürü", "örme üst giyim ve ihracat konfeksiyonu", 24, 1, 1],
    ["zeytindali", "Zeytindalı Ambalaj ve Matbaa", ["ambalaj"], "İzmir", "Kemalpaşa", 2014, "kurumsal", "Seda Karaman", "Müşteri Temsilcisi", "kâğıt torba, etiket ve baskılı ambalaj", 26, 1, 1],
    ["parlak", "Parlak Aydınlatma Sistemleri", ["elektrik"], "Ankara", "Ostim", 2006, "kurumsal", "Barış Uçar", "Satış Müdürü", "LED panel ve endüstriyel aydınlatma", 27, 1, 1],
    ["yildiztepe", "Yıldıztepe Seramik ve Yapı", ["yapi"], "Kütahya", "Merkez", 1999, "kurumsal", "Nurhan Yıldıztepe", "Pazarlama Müdürü", "porselen ve duvar seramiği", 29, 1, 1],
    ["egedamla", "Ege Damla Zeytinyağı", ["gida"], "Balıkesir", "Ayvalık", 2002, "kurumsal", "Zeynep Damlacı", "Dış Ticaret Sorumlusu", "sızma zeytinyağı ve sofralık zeytin", 30, 1, 1],
    ["mavisehir", "Mavişehir Otel Ekipmanları", ["mobilya", "makina"], "Antalya", "Muratpaşa", 2010, "kurumsal", "Caner Erol", "Proje Satın Alma Müdürü", "otel ve endüstriyel mutfak ekipmanı", 32, 1, 1],
    ["unalti", "Ünaltı Otomotiv Aksesuar", ["otomotiv"], "Antalya", "Kepez", 2015, "basic", "İbrahim Ünaltı", "İşletme Sahibi", "oto aksesuar ve sarf malzemesi", 33, 1, 1],
    ["defne", "Defne Sabun ve Kozmetik", ["kozmetik"], "Hatay", "Antakya", 1987, "kurumsal", "Mustafa Defneli", "Üretim Sorumlusu", "zeytinyağlı ve defne yağlı geleneksel sabun", 35, 1, 1],
    ["tekinoglu", "Tekinoğlu Tarım Makinaları", ["makina"], "Adana", "Seyhan", 1994, "kurumsal", "Ahmet Tekinoğlu", "Bayi Kanalı Müdürü", "pülverizatör ve toprak işleme ekipmanı", 36, 1, 1],
    ["gulbahar", "Gülbahar Ev Tekstili", ["tekstil"], "Uşak", "Merkez", 2001, "kurumsal", "Gülşen Bahar", "Kurucu", "havlu, nevresim ve otel tekstili", 38, 1, 1],
    ["polifilm", "Polifilm Plastik Ambalaj", ["ambalaj"], "Adana", "Sarıçam", 2011, "basic", "Volkan Erdem", "Satış Sorumlusu", "streç film ve endüstriyel ambalaj filmi", 39, 1, 0],
    ["akim", "Akım Kablo ve Elektrik", ["elektrik"], "Kayseri", "Kocasinan", 2004, "kurumsal", "Selim Akım", "Ticaret Müdürü", "enerji ve tesisat kablosu", 42, 1, 1],
    ["ardic", "Ardıç Yapı Malzemeleri", ["yapi"], "Antalya", "Döşemealtı", 2012, "kurumsal", "Erdal Ardıç", "Şantiye Satış Sorumlusu", "kapı, pencere ve iç mekân doğrama", 44, 1, 1],
    ["sedef", "Sedef Endüstriyel Temizlik", ["kimya"], "Mersin", "Akdeniz", 2007, "kurumsal", "Ayşegül Sedef", "Bölge Müdürü", "endüstriyel mutfak ve çamaşırhane kimyasalları", 45, 1, 1],
    ["karaburun", "Karaburun Su Ürünleri", ["gida"], "İzmir", "Karaburun", 2009, "kurumsal", "Halil Denizci", "İhracat Sorumlusu", "levrek, çipura ve dondurulmuş deniz ürünleri", 47, 1, 1],
    ["selimiye", "Selimiye Süt Ürünleri", ["gida"], "Edirne", "Merkez", 1991, "kurumsal", "Fatma Er", "Satış Müdürü", "beyaz peynir, kaşar ve tereyağı", 49, 1, 1],
    ["altinoluk", "Altınoluk Paletleme ve Lojistik", ["ambalaj"], "Mersin", "Tarsus", 2016, "basic", "Uğur Kandemir", "Operasyon Sorumlusu", "ahşap palet, kasa ve paletleme", 51, 1, 1],
    ["erkam", "Erkam Oto Elektrik", ["otomotiv", "elektrik"], "Gaziantep", "Şahinbey", 2005, "kurumsal", "Erkan Kamış", "İşletme Sahibi", "akü, oto ampul ve oto elektrik malzemesi", 53, 1, 1],
    ["buyukdere", "Büyükdere Kimya", ["kimya"], "İstanbul", "Tuzla", 1997, "kurumsal", "Sinan Büyükdere", "Genel Müdür", "endüstriyel kimyasal hammadde", 55, 1, 1],
    ["selvi", "Selvi Mobilya Aksesuar", ["mobilya"], "Kayseri", "Kocasinan", 2008, "kurumsal", "Oya Selvi", "Satış Sorumlusu", "menteşe, ray, kulp ve mobilya aksesuarı", 58, 1, 1]
  ];
  var CADDE = ["Organize Sanayi Bölgesi 4. Cadde No: 12", "Sanayi Mah. 1203. Sokak No: 7", "OSB 2. Kısım, 18. Cadde No: 3", "Küçük Sanayi Sitesi C Blok No: 21", "Ticaret Merkezi, Atatürk Bulvarı No: 145", "Organize Sanayi Bölgesi, 9. Sokak No: 28"];
  var FIRMA = F.map(function (r, i) {
    return {
      id: r[0], ad: r[1], kat: r[2], il: r[3], ilce: r[4], yil: r[5], paket: r[6], yetkili: r[7], unvan: r[8], uzman: r[9], katildi: r[10],
      telOk: !!r[11], epostaOk: !!r[12], no: i + 1,
      adres: CADDE[i % CADDE.length] + ", " + r[4] + " / " + r[3],
      tel: "05" + (30 + (i * 7) % 26) + " " + (100 + (i * 73) % 900) + " ** " + (10 + (i * 37) % 90),
      eposta: r[7].split(" ")[0].toLocaleLowerCase("tr").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c") + "@" + r[0] + ".ornek",
      tarihce: r[5] + " yılında " + r[3] + " " + r[4] + "'de küçük bir atölye olarak kurulan firma, bugün " + r[9] + " alanında bölgesinin tanınan tedarikçilerinden biri. " +
        (2026 - r[5]) + " yıllık geçmişinde yurt içinde " + (40 + (i * 13) % 60) + " ilde bayi ve kurumsal müşteriye hizmet verdi; üretim ve sipariş fazlası ürünlerini StokPazarı üzerinden firmalara doğrudan teklifle satıyor."
    };
  });

  /* [id, ad, kat, firma, birim, fiyat, stok, min, hemenAl%, durum(a/s/r), ilan(gün önce), ikon, kondisyon, açıklama, satış(saat önce)] */
  var U = [
    ["p1", "Kırmızı mercimek (futbol) 25 kg çuval", "gida", "ilgaz", "çuval", 1450, 180, 10, 10, "a", 0.2, "cuval", "Yeni hasat", "2026 hasadı, elenmiş ve taşı ayıklanmış futbol mercimek. Analiz raporu ve fatura ile teslim. Çorum depodan araca yükleme bizden."],
    ["p2", "Natürel sızma zeytinyağı 5 L teneke", "gida", "egedamla", "teneke", 1890, 240, 12, 8, "a", 0.4, "teneke", "Yeni sezon", "Erken hasat, asit oranı 0,4 altında. İhracat siparişinden kalan etiketsiz teneke. Palette 120 teneke."],
    ["p3", "Tip 550 ekmeklik un 50 kg", "gida", "camlibel", "çuval", 1320, 400, 20, 5, "a", 0.6, "cuval", "Yeni", "Protein %11,5, kül oranı 0,55. Fırın ve unlu mamul üreticileri için. Konya merkez teslim, şehirler arası nakliye alıcıya aittir."],
    ["p4", "Gün kurusu kayısı 5 kg koli", "gida", "gokdere", "koli", 1150, 90, 5, 0, "a", 1.1, "koli", "Yeni", "Malatya kökenli, kükürtsüz gün kurusu kayısı. Jumbo boy, ihracat ambalajında 5 kg koli."],
    ["p5", "Tam yağlı beyaz peynir 17 kg teneke", "gida", "selimiye", "teneke", 3400, 60, 4, 10, "a", 1.3, "teneke", "SKT 03/2027", "Edirne tipi inek peyniri, 6 ay olgunlaştırılmış. Soğuk zincir ile teslim, son tüketim tarihi Mart 2027."],
    ["p6", "Domates salçası 830 g × 12 cam kavanoz", "gida", "gokdere", "koli", 720, 300, 10, 5, "s", 2.4, "kavanoz", "Yeni", "Güneşte kurutulmuş domatesten, katkısız salça. Market zincirine üretilen fazla parti.", 30],
    ["p7", "Dondurulmuş levrek fileto (IQF)", "gida", "karaburun", "kg", 465, 850, 50, 0, "a", 1.8, "balik", "Dondurulmuş", "Derisi soyulmuş, kılçıksız levrek fileto, 180–220 g parçalar. 10 kg master koli, frigorifik araçla gönderim."],
    ["p8", "Baldo pirinç 5 kg × 4 balya", "gida", "ilgaz", "balya", 980, 150, 10, 8, "a", 2.2, "cuval", "Yeni", "Kızılırmak havzası baldo pirinç. Toptan satış, 20 kg balya. Restoran ve toplu yemek firmalarına uygun."],
    ["p9", "Otel odası komodin (ceviz, fazla üretim)", "mobilya", "toroslu", "adet", 2750, 64, 4, 10, "a", 0.9, "komodin", "Fazla üretim", "Bir otel projesinden kalan, kullanılmamış ceviz kaplama komodin. 2 çekmeceli, yumuşak kapanan ray. 50 × 40 × 55 cm."],
    ["p10", "Ergonomik ofis koltuğu, file sırtlı", "mobilya", "toroslu", "adet", 3900, 38, 2, 8, "a", 1.6, "koltuk", "Yeni", "Bel destekli, ayarlı kol ve senkron mekanizma. Kurumsal siparişten iade dönen, ambalajı açılmamış ürünler."],
    ["p11", "Masif meşe yemek masası 180 × 90", "mobilya", "saricam", "adet", 18500, 12, 1, 5, "a", 2.8, "masa", "Yeni", "4 cm kalınlığında masif meşe tabla, doğal yağ cila. Showroom değişimi nedeniyle stok eritme."],
    ["p12", "Yazı tablalı konferans sandalyesi", "mobilya", "mavisehir", "adet", 1650, 220, 20, 10, "s", 3.5, "sandalye", "Fazla stok", "Katlanır yazı tablalı, istiflenebilir konferans sandalyesi. Otel toplantı salonu projesinden kalan.", 18],
    ["p13", "Frenli mobilya menteşesi 35 mm (200'lü kutu)", "mobilya", "selvi", "kutu", 1240, 75, 5, 0, "a", 3.1, "mentese", "Yeni", "Yumuşak kapanan, tak-çıkar frenli menteşe. 110° açılım. Mutfak ve dolap üreticileri için toptan."],
    ["p14", "Metal ayaklı restoran sandalyesi (sezon sonu)", "mobilya", "toroslu", "adet", 1180, 140, 10, 10, "s", 4.2, "sandalye", "Sezon sonu", "Toz boyalı metal iskelet, suni deri oturak. Sezon sonu stok eritme. Antrasit renk.", 31],
    ["p15", "Kadife lobi koltuk takımı 3+1+1", "mobilya", "saricam", "takım", 42000, 4, 1, 5, "a", 4.6, "kanepe", "Yeni", "Otel lobisi ve bekleme alanları için kadife kaplı takım. Gürgen iskelet, yüksek yoğunluklu sünger."],
    ["p16", "205/55 R16 yaz lastiği (2025 üretim)", "otomotiv", "erguven", "adet", 2650, 320, 8, 8, "a", 0.3, "lastik", "2025 üretim", "Binek araç yaz lastiği, 91V. Depo devri nedeniyle 2025 üretimi stok. Fatura ve garanti belgesiyle."],
    ["p17", "Ön fren balatası seti (hafif ticari)", "otomotiv", "kizilirmak", "set", 890, 410, 10, 10, "a", 0.8, "balata", "Yeni", "Panelvan ve hafif ticari araçlarla uyumlu ön balata seti. ECE R90 onaylı. Uyumlu araç listesi talep üzerine."],
    ["p18", "12V 72Ah akü", "otomotiv", "erkam", "adet", 3150, 85, 5, 5, "s", 2.0, "aku", "Yeni", "Bakım gerektirmeyen kalsiyum teknolojili akü, 680 A soğuk marş. Üretim tarihi Eylül 2026.", 9],
    ["p19", "Muz tipi silecek süpürgesi 600 mm", "otomotiv", "unalti", "adet", 145, 2400, 50, 0, "a", 2.6, "silecek", "Yeni", "Evrensel adaptörlü muz tipi silecek. Oto aksesuar ve servisler için koli içi 50 adet."],
    ["p20", "10W-40 motor yağı 4 L (ambalajı ezik)", "otomotiv", "kizilirmak", "bidon", 820, 260, 12, 10, "a", 3.2, "bidon", "Hasarlı ambalaj", "Sevkiyatta kolisi ezilen, ürüne zarar gelmemiş yarı sentetik motor yağı. Bidonlar sızdırmazlık kontrolünden geçti."],
    ["p21", "H7 LED far ampulü seti", "otomotiv", "erkam", "set", 640, 500, 10, 8, "a", 3.9, "ampul", "Yeni", "6500K, fansız LED far ampulü seti. Oto elektrik ve aksesuar bayileri için kutulu."],
    ["p22", "Lavanta yağlı el kremi 75 ml", "kozmetik", "lavandula", "adet", 68, 6000, 200, 10, "a", 0.5, "krem", "SKT 2028", "Isparta lavantası yağı içeren el kremi. Otel, kurumsal hediye ve eczane kanalı için. Barkodlu, Türkçe etiketli."],
    ["p23", "Zeytinyağlı kalıp sabun 125 g", "kozmetik", "defne", "adet", 24, 18000, 500, 5, "s", 1.9, "sabun", "Yeni", "Soğuk işlem zeytinyağlı sabun. Kâğıt ambalajlı, etiketsiz özel üretim fazlası.", 44],
    ["p24", "Saç bakım şampuanı 400 ml (etiket değişimi)", "kozmetik", "nergis", "adet", 72, 4800, 240, 10, "a", 2.7, "sise", "Etiket değişimi", "Marka etiketi yenilendiği için eski etiketli kalan şampuanlar. Ürün içeriği aynı, SKT 2028."],
    ["p25", "Gül suyu tonik 250 ml", "kozmetik", "lavandula", "adet", 95, 2200, 100, 0, "a", 3.4, "sise", "Yeni", "Damask gülü distilasyonundan, alkolsüz tonik. Sprey kapaklı cam şişe."],
    ["p26", "Otel tipi şampuan / duş jeli 30 ml (500'lü koli)", "kozmetik", "nergis", "koli", 2350, 120, 4, 8, "a", 4.4, "sise", "Yeni", "Otel buklet seti için mini şişe. Koli içi 500 adet, nötr etiketli; logo baskısı ayrıca yapılabilir."],
    ["p27", "50 ton hidrolik pres (2. el, bakımlı)", "makina", "demirag", "adet", 385000, 1, 1, 5, "a", 1.2, "pres", "2. el", "2019 model, 50 ton C tipi hidrolik pres. Yeni conta ve hortum takımı ile bakımı yapıldı. Yerinde çalışırken görülebilir."],
    ["p28", "BT40 takım tutucu seti (12 parça)", "makina", "kocyigit", "set", 6800, 25, 1, 0, "a", 2.1, "disli", "Yeni", "BT40 pens, freze ve matkap tutucu set. Balanslı, G2.5 / 25.000 dev/dk. Ahşap kutuda."],
    ["p29", "Endüstriyel hamur yoğurma makinesi 50 kg", "makina", "mavisehir", "adet", 96000, 3, 1, 5, "a", 3.0, "mikser", "Yeni", "Çift hızlı spiral hamur yoğurma makinesi, 50 kg hamur kapasitesi. Proje iptali nedeniyle kutusunda."],
    ["p30", "Hidrolik silindir Ø80 × 500 strok", "makina", "demirag", "adet", 9400, 18, 1, 10, "a", 4.1, "silindir", "Yeni", "Çift etkili, krom kaplı mil. Flanşlı bağlantı. Seri üretimden kalan stok."],
    ["p31", "Çekilir tip pülverizatör 600 L", "makina", "tekinoglu", "adet", 74500, 6, 1, 8, "s", 2.9, "pulverizator", "Yeni", "12 m hidrolik bomlu, membran pompalı pülverizatör. Bayi stok fazlası.", 52],
    ["p32", "Penye kumaş 30/1 süprem", "tekstil", "ipekyolu", "kg", 285, 3200, 100, 10, "a", 0.7, "kumas", "Yeni", "%100 pamuk, 30/1 süprem, 150 g/m². Ham ve boyalı seçenek. Top halinde, numune gönderilebilir."],
    ["p33", "Otel havlusu 50 × 90 beyaz", "tekstil", "gulbahar", "adet", 165, 5000, 200, 8, "a", 1.5, "havlu", "Yeni", "%100 pamuk, 500 g/m² otel tipi el-yüz havlusu. Kenarı satenli, 60 °C yıkamaya uygun."],
    ["p34", "Polo yaka erkek tişört (ihracat fazlası)", "tekstil", "akkus", "adet", 210, 2600, 100, 10, "a", 2.3, "tisort", "İhracat fazlası", "Pike kumaş, 4 renk, S–XXL asorti. Avrupa siparişinden kalan, etiketsiz."],
    ["p35", "Pamuklu nevresim takımı çift kişilik", "tekstil", "gulbahar", "takım", 890, 400, 20, 5, "a", 3.6, "havlu", "Yeni", "Ranforce, 4 parça çift kişilik nevresim takımı. Desen seçenekleri fotoğraflarda."],
    ["p36", "Oluklu mukavva koli 40 × 30 × 30 (3 kat)", "ambalaj", "sedirpak", "adet", 18.5, 25000, 1000, 10, "a", 0.4, "koli", "Yeni", "B dalga, 3 katlı kraft koli. E-ticaret ve gıda sevkiyatı için. Paletli teslim."],
    ["p37", "El tipi streç film 17 mikron 50 cm", "ambalaj", "polifilm", "rulo", 210, 1800, 36, 8, "a", 1.0, "film", "Yeni", "Şeffaf, yüksek yapışmalı el tipi streç film, rulo başına 2,4 kg."],
    ["p38", "Euro palet 80 × 120 (2. el, sağlam)", "ambalaj", "altinoluk", "adet", 340, 900, 50, 5, "s", 2.5, "palet", "2. el", "EPAL damgalı, ısıl işlemli 2. el euro palet. Kırık ve eksiği ayıklanmış.", 12],
    ["p39", "Kulplu kraft kâğıt torba 26 × 35", "ambalaj", "zeytindali", "adet", 6.8, 40000, 2000, 0, "a", 3.3, "torba", "Yeni", "90 g kraft, burgu kulplu kâğıt torba. Baskısız; baskı ayrıca teklif edilir."],
    ["p40", "NYM kablo 3 × 2,5 mm² (100 m)", "elektrik", "akim", "top", 4250, 140, 5, 8, "a", 0.9, "kablo", "Yeni", "TSE belgeli antigron kablo, 100 m makara. Şantiye fazlası, ambalajı açılmamış."],
    ["p41", "LED panel 60 × 60 40 W", "elektrik", "parlak", "adet", 395, 1100, 20, 10, "a", 1.7, "panel", "Yeni", "Sıva altı, 4000K günışığı, UGR<19 ofis paneli. Koli içi 4 adet."],
    ["p42", "Otomatik sigorta C16 (12'li kutu)", "elektrik", "ilgin", "kutu", 780, 230, 5, 5, "a", 2.8, "sigorta", "Yeni", "6 kA, C eğrisi 16 A otomatik sigorta. IEC 60898 uyumlu."],
    ["p43", "Porselen yer seramiği 60 × 60 (2. kalite)", "yapi", "yildiztepe", "m²", 285, 1800, 50, 10, "a", 1.4, "seramik", "2. kalite", "Mat, açık gri porselen seramik. Hafif ton farkı nedeniyle 2. kalite. Kutu 1,44 m²."],
    ["p44", "Alçı sıva 30 kg", "yapi", "tasdelen", "torba", 205, 2000, 50, 5, "s", 3.0, "cuval", "Yeni", "Makine ve el uygulamasına uygun perlitli alçı sıva.", 26],
    ["p45", "Kompozit iç kapı (ölçü dışı kalan)", "yapi", "ardic", "adet", 6400, 22, 1, 8, "a", 3.7, "kapi", "Fazla üretim", "Bir konut projesinde ölçü değişikliği nedeniyle kalan beyaz lake kompozit kapılar. 90 × 210 cm, kasalı."],
    ["p46", "Yüzey dezenfektanı 5 L", "kimya", "berrak", "bidon", 285, 1500, 24, 10, "a", 0.6, "bidon", "SKT 2028", "Alkol bazlı, hızlı kuruyan yüzey dezenfektanı. Biyosidal ruhsatlı. Koli içi 4 bidon."],
    ["p47", "Endüstriyel bulaşık deterjanı 20 kg", "kimya", "sedef", "bidon", 1150, 300, 6, 8, "a", 2.0, "bidon", "Yeni", "Endüstriyel bulaşık makineleri için sıvı deterjan. Otel ve restoran mutfakları için."],
    ["p48", "Kostik soda pul 25 kg", "kimya", "buyukdere", "çuval", 960, 400, 10, 0, "a", 4.0, "cuval", "Yeni", "%98 saflıkta pul kostik. Sabun ve kimya üreticileri için. MSDS ile teslim."],
    ["p49", "Kumaş kaplı yatak başlığı 160 cm", "mobilya", "toroslu", "adet", 4600, 26, 2, 10, "a", 2.4, "baslik", "Fazla üretim", "Otel projesi fazlası, keten görünümlü kumaş kaplı yatak başlığı. Duvara montaj aparatı dahil."],
    ["p50", "Melamin çalışma masası 140 × 70", "mobilya", "toroslu", "adet", 2300, 45, 2, 0, "a", 5.0, "masa", "Yeni", "Metal ayaklı, kablo kanallı çalışma masası. Ceviz / beyaz seçenek."],
    ["p51", "Otel lobisi sehpa seti (3'lü)", "mobilya", "toroslu", "takım", 7400, 12, 1, 8, "s", 6.0, "masa", "Fazla üretim", "Ceviz kaplama, metal ayaklı orta ve yan sehpa seti. Otel projesi fazlası.", 50],
    ["p52", "Restoran masası 80 × 80 compact tabla", "mobilya", "toroslu", "adet", 2150, 60, 4, 10, "s", 6.5, "masa", "Sezon sonu", "Compact laminat tablalı, döküm ayaklı restoran masası. Sezon sonu stok.", 64],
    ["p53", "Otel odası bagaj sehpası", "mobilya", "toroslu", "adet", 1350, 70, 5, 10, "a", 3.8, "komodin", "Fazla üretim", "Ceviz kaplama, metal korumalı bagaj sehpası. 90 × 45 × 50 cm. Otel projesinden kalan stok."],
    ["p54", "Kumaş kaplı toplantı sandalyesi", "mobilya", "toroslu", "adet", 1980, 96, 6, 8, "a", 4.9, "sandalye", "Yeni", "Krom ayaklı, kumaş kaplı toplantı sandalyesi. Gri ve lacivert renk seçeneği."],
    ["p55", "Resepsiyon bankosu 240 cm (showroom)", "mobilya", "toroslu", "adet", 38500, 1, 1, 5, "a", 7.2, "masa", "Showroom ürünü", "Showroom değişimi nedeniyle satılık, LED aydınlatmalı resepsiyon bankosu. Çok az kullanıldı."],
    ["p56", "Ahşap kahve masası 120 × 60", "mobilya", "toroslu", "adet", 3250, 30, 2, 0, "a", 8.0, "masa", "Yeni", "Masif ceviz tabla, siyah metal ayak. Kafe ve otel lobileri için."],
    /* arşiv: 3 günden önce satılmış, yayından kalkmış, firma sayfasında "önceden satılanlar" */
    ["r1", "Otel odası gardırop 2 kapaklı", "mobilya", "toroslu", "adet", 6900, 30, 2, 10, "r", 40, "komodin", "Fazla üretim", "Otel projesi fazlası gardırop.", 720],
    ["r2", "Lobi bekleme koltuğu tekli", "mobilya", "toroslu", "adet", 5200, 18, 2, 8, "r", 60, "kanepe", "Yeni", "Bekleme alanı tekli koltuk.", 1100],
    ["r3", "Toplantı masası 240 × 120", "mobilya", "toroslu", "adet", 14500, 6, 1, 5, "r", 75, "masa", "Yeni", "Laminat tablalı toplantı masası.", 1500],
    ["r4", "Bar taburesi ahşap oturaklı", "mobilya", "toroslu", "adet", 1450, 80, 10, 10, "r", 95, "sandalye", "Sezon sonu", "Ahşap oturaklı bar taburesi.", 1900],
    ["r15", "Otel odası çalışma masası", "mobilya", "toroslu", "adet", 3100, 40, 4, 8, "r", 110, "masa", "Fazla üretim", "Otel odası çalışma masası.", 2300],
    ["r16", "Lobi kanepe 3'lü kadife", "mobilya", "toroslu", "adet", 16800, 6, 1, 5, "r", 130, "kanepe", "Yeni", "Kadife lobi kanepesi.", 2700],
    ["r5", "Pastalık un tip 650 50 kg", "gida", "camlibel", "çuval", 1390, 300, 20, 5, "r", 30, "cuval", "Yeni", "Pastalık un.", 500],
    ["r6", "Kaşar peyniri 2 kg teker", "gida", "selimiye", "adet", 1180, 120, 10, 8, "r", 25, "teneke", "Yeni", "Taze kaşar.", 400],
    ["r7", "185/65 R15 kış lastiği", "otomotiv", "erguven", "adet", 2380, 200, 8, 8, "r", 50, "lastik", "2025 üretim", "Kış lastiği.", 900],
    ["r8", "Ribana kumaş 1×1", "tekstil", "ipekyolu", "kg", 310, 1500, 100, 10, "r", 35, "kumas", "Yeni", "Ribana kumaş.", 600],
    ["r9", "Pizza kutusu 33 cm", "ambalaj", "sedirpak", "adet", 7.2, 30000, 1000, 10, "r", 45, "koli", "Yeni", "Pizza kutusu.", 800],
    ["r10", "Hidrolik güç ünitesi 7,5 kW", "makina", "demirag", "adet", 68000, 2, 1, 5, "r", 70, "pres", "Yeni", "Güç ünitesi.", 1300],
    ["r11", "Lavanta sabunu 100 g", "kozmetik", "lavandula", "adet", 32, 8000, 500, 10, "r", 28, "sabun", "Yeni", "Lavanta sabunu.", 450],
    ["r12", "LED projektör 100 W", "elektrik", "parlak", "adet", 690, 400, 10, 8, "r", 33, "ampul", "Yeni", "Projektör.", 560],
    ["r13", "Banyo duvar seramiği 30 × 60", "yapi", "yildiztepe", "m²", 240, 1200, 50, 10, "r", 55, "seramik", "2. kalite", "Duvar seramiği.", 1000],
    ["r14", "Endüstriyel kireç çözücü 20 kg", "kimya", "sedef", "bidon", 940, 150, 6, 8, "r", 38, "bidon", "Yeni", "Kireç çözücü.", 650]
  ];
  function ean(base) {
    var s = 0; for (var i = 0; i < 12; i++) s += (+base[i]) * (i % 2 ? 3 : 1);
    return base + ((10 - s % 10) % 10);
  }
  var kOn = {}; KATEGORI.forEach(function (k) { kOn[k.id] = k.on; });
  var BIREYSEL = [{ id: "selin", ad: "Selin Arıkan", kat: ["gida", "ambalaj"], il: "Antalya", ilce: "Kepez", yil: 2026, paket: "bireysel", yetkili: "Selin Arıkan", unvan: "Bireysel üye", uzman: "", katildi: 22, telOk: true, epostaOk: true, no: 77, adres: "Kepez / Antalya", tel: "0533 412 ** 18", eposta: "selin.arikan@eposta.ornek", tarihce: "Bireysel üye. Elinde kalan ürünleri ilan ediyor, faaliyet alanındaki ilanları takip ediyor." }];
  var fNo = {}; FIRMA.concat(BIREYSEL).forEach(function (f) { fNo[f.id] = f.no; });
  /* Müşterinin düzeltme dosyasındaki 140 TL'lik çuval örneği ve bireysel üyenin örnek ilanları */
  U = U.concat([
    ["p57", "Mısır kırığı 25 kg çuval", "gida", "ilgaz", "çuval", 140, 200, 1, 5, "a", 0.1, "cuval", "Yeni", "Örnek senaryo ilanı: liste fiyatı 140 TL. Yem ve hayvancılık işletmeleri için çuvallı ürün, parti hâlinde teslim.", 0],
    ["b1", "Kullanılmamış elektronik tartı 150 kg", "makina", "selin", "adet", 4200, 1, 1, 0, "a", 27, "pres", "Kullanılmamış", "Bireysel üye ilanı (örnek). Kutusunda, kullanılmamış endüstriyel tartı.", 0],
    ["b2", "Fazla kalan kraft koli 500 adet", "ambalaj", "selin", "adet", 9, 500, 1, 0, "a", 85, "koli", "Yeni", "Bireysel üye ilanı (örnek). Taşınma sonrası elde kalan kullanılmamış koliler.", 0]
  ]);
  var URUN = U.map(function (r, i) {
    var n = i + 1;
    return {
      id: r[0], ad: r[1], kat: r[2], firma: r[3], birim: r[4], fiyat: r[5], stok: r[6], hemenAl: r[8], hemenUst: r[0] === "p57" ? 10 : r[8] > 0 ? 5 : 0,
      durum: r[9] === "a" ? "aktif" : r[9] === "s" ? "satildi" : "arsiv", gun: r[10], ikon: r[11], kondisyon: r[12], aciklama: r[13],
      satisSaat: r[14] || 0,
      kod: kOn[r[2]] + "-" + (24000 + n * 137),
      barkod: ean("869" + ("000" + fNo[r[3]]).slice(-4) + ("0000" + (n * 211)).slice(-5)),
      teklifSay: (n * 7) % 13 + (r[9] === "a" ? 1 : 3), izlenme: 120 + (n * 97) % 900
    };
  });

  /* Toroslu Mobilya'ya gelen teklifler: [id, ürün, teklif veren firma, birim fiyat, adet, dakika önce, durum] */
  var TEKLIF = [
    ["t1", "p10", "mavisehir", 3450, 20, 95, "bekliyor"],
    ["t2", "p9", "gulbahar", 2300, 30, 310, "bekliyor"],
    ["t3", "p49", "mavisehir", 4050, 16, 1500, "bekliyor"],
    ["t4", "p50", "akkus", 2050, 10, 26, "bekliyor"],
    ["t5", "p10", "kizilirmak", 3200, 6, 190, "bekliyor"],
    ["t6", "p9", "ardic", 2380, 40, 660, "bekliyor"],
    ["t10", "p53", "mavisehir", 1150, 40, 48, "bekliyor"],
    ["t11", "p54", "selimiye", 1700, 24, 520, "bekliyor"],
    ["t12", "p55", "ardic", 33000, 1, 2100, "bekliyor"],
    ["t13", "p56", "egedamla", 2800, 6, 2900, "bekliyor"],
    ["t7", "p14", "mavisehir", 1100, 140, 1860, "kabul-otomatik"],
    ["t14", "p51", "mavisehir", 6900, 12, 3000, "kabul-otomatik"],
    ["t15", "p52", "karaburun", 1950, 60, 3840, "kabul"],
    ["t16", "p54", "nergis", 1500, 30, 6100, "reddedildi"],
    ["t8", "p10", "unalti", 2900, 4, 4300, "reddedildi"],
    ["t9", "p49", "egedamla", 3600, 8, 5200, "reddedildi"]
  ].map(function (r) { return { id: r[0], urun: r[1], firma: r[2], fiyat: r[3], adet: r[4], dk: r[5], durum: r[6] }; });

  /* Toroslu'nun başka ilanlara verdiği teklifler */
  var VERILEN = [
    ["v1", "p13", 1150, 20, 140, "bekliyor", ""],
    ["v2", "p37", 200, 72, 2900, "kabul", ""],
    ["v3", "p40", 3900, 10, 1700, "reddedildi", "Merhaba Murat Bey, 3.900 TL'den veremiyoruz ama 10 top için 4.050 TL'den hemen sevk edebilirim. Uygunsa ilana tekrar teklif verin, onaylayayım."],
    ["v4", "p33", 150, 400, 600, "bekliyor", ""],
    ["v5", "p41", 345, 120, 3600, "reddedildi", "Teşekkürler, 360 TL'nin altına inemiyoruz. 360 TL'ye 120 adet ayırabilirim."]
  ].map(function (r) { return { id: r[0], urun: r[1], fiyat: r[2], adet: r[3], dk: r[4], durum: r[5], mesaj: r[6] }; });

  /* Satılmış Toroslu ilanına gelen alım talepleri */
  var TALEP = [
    ["a1", "p14", "ardic", 60, 1150, 300, "Antalya şantiye ofisi için 60 adet; aynı modelden üretim varsa 3 hafta beklerim."],
    ["a2", "p14", "mavisehir", 120, 1120, 880, "İkinci otel projemiz için aynı renk, 120 adet."],
    ["a3", "p14", "selimiye", 24, 1180, 1400, "Fabrika yemekhanesi için 24 adet."],
    ["a4", "p51", "gulbahar", 4, 7200, 1900, "Uşak'taki showroom'umuz için 4 takım; ceviz tonunda olursa iyi olur."],
    ["a5", "p52", "egedamla", 30, 2050, 2500, "Ayvalık'ta açacağımız tadım salonu için 30 masa, Aralık başında teslim."],
    ["a6", "p52", "sedef", 12, 2100, 3300, "Mersin ofis yemekhanesi için 12 adet, aynı tabla rengi."]
  ].map(function (r) { return { id: r[0], urun: r[1], firma: r[2], adet: r[3], fiyat: r[4], dk: r[5], not: r[6] }; });

  var MESAJ = {
    kurumsal: [
      { id: "m1", kim: "akim", konu: "NYM kablo 3 × 2,5 teklifiniz", dk: 1700, okunmadi: true, akis: [["ben", "Merhaba Selim Bey, Kayseri'deki yeni atölye tesisatı için 10 top NYM 3 × 2,5 lazım. 3.900 TL'den teklif verdim, uygun mudur?"], ["o", "Merhaba Murat Bey, 3.900 TL'den veremiyoruz ama 10 top için 4.050 TL'den hemen sevk edebilirim. Uygunsa ilana tekrar teklif verin, onaylayayım."], ["ben", "Teslim Kocasinan'dan mı olur, yoksa kargo mu?"], ["o", "Kocasinan depodan kendi aracımızla getiririz, aynı şehirdeyiz. 4.050 TL'ye nakliye dahil."]] },
      { id: "m5", kim: "mavisehir", konu: "Ofis koltuğu: 20 adet teklif", dk: 95, okunmadi: true, akis: [["o", "Merhaba Murat Bey, Antalya'daki otelimizin idari ofisi için 20 koltuğa 3.450 TL teklif verdik. Fatura Ocak ayına kesilebilir mi?"], ["ben", "Merhaba Caner Bey, faturayı istediğiniz aya kesebiliriz. Teklifinizi panelden değerlendirip bugün dönüyorum."]] },
      { id: "m6", kim: "gulbahar", konu: "Komodin teklifi ve renk seçeneği", dk: 310, okunmadi: false, akis: [["o", "30 komodin için 2.300 TL teklif verdim. Ceviz dışında beyaz renk var mı?"], ["ben", "Stokta yalnız ceviz var Gülşen Hanım. Beyaz için yeni üretim gerekir, termin 3 hafta."], ["o", "Anladım, ceviz olabilir. Teklifimizi değerlendirirseniz sevinirim."]] },
      { id: "m2", kim: "parlak", konu: "LED panel teklifi", dk: 3600, okunmadi: true, akis: [["ben", "120 adet için 345 TL düşünüyoruz."], ["o", "Teşekkürler, 360 TL'nin altına inemiyoruz. 360 TL'ye 120 adet ayırabilirim."]] },
      { id: "m3", kim: "unalti", konu: "Ofis koltuğu teklifiniz reddedildi", dk: 4300, okunmadi: false, akis: [["o", "4 adet koltuk için 2.900 TL teklif vermiştim."], ["ben", "Merhaba İbrahim Bey, 2.900 TL bizim maliyetimizin altında. 3.600 TL'den 4 adedi ayırabilirim, ilana bu fiyattan teklif verirseniz hemen onaylarım."]] },
      { id: "m4", kim: "polifilm", konu: "Streç film satışı tamamlandı", dk: 2900, okunmadi: false, akis: [["o", "Teklifiniz kabul edildi, 72 rulo yarın Adana'dan çıkıyor. İrsaliye e-postanıza gelecek."], ["ben", "Teşekkürler Volkan Bey, teslim adresi fabrika, 08:00–17:00 arası."]] }
    ],
    bireysel: [
      { id: "b1", kim: "sedirpak", konu: "Koli ilanı hakkında", dk: 240, okunmadi: true, akis: [["o", "Merhaba Selin Hanım, faaliyet alanınızda yeni koli ilanımız var. 2.000 adet üstü siparişte 17 TL yapabiliyoruz. Kurumsal hesapla teklif verebilirsiniz."]] },
      { id: "b2", kim: "camlibel", konu: "Tip 550 un ilanı", dk: 2600, okunmadi: false, akis: [["o", "Merhaba, takip ettiğiniz Gıda kategorisine yeni un ilanı girdik. Fiyat ve teslim için ilan sayfasına bakabilirsiniz."]] },
      { id: "b3", kim: "egedamla", konu: "Zeytinyağı stoğu", dk: 5000, okunmadi: false, akis: [["o", "Yeni sezon zeytinyağımız 240 teneke olarak yayında. Uygun teklifleri hızlıca değerlendiriyoruz."]] },
      { id: "b4", kim: "zeytindali", konu: "Kraft torba ilanınız", dk: 7200, okunmadi: false, akis: [["o", "Merhaba Selin Hanım, kraft koli ilanınızı gördük. Baskılı kâğıt torba ihtiyacınız olursa 2.000 adet üstünde 6,20 TL'ye yapabiliyoruz."]] },
      { id: "b5", kim: "selimiye", konu: "Beyaz peynir: kategori duyurusu", dk: 9800, okunmadi: false, akis: [["o", "Gıda kategorisini takip eden üyelerimize: 17 kg teneke tam yağlı beyaz peynir 60 teneke olarak yayında. Son tüketim Mart 2027, soğuk zincirle teslim."]] }
    ]
  };

  var KISI = {
    selin: { kat: ["gida", "ambalaj"] },
    toroslu: { kat: ["mobilya", "tekstil", "ambalaj"] },
    gokdere: { kat: ["gida"] }
  };
  /* Müşterinin üyelikte onaylatılmasını istediği bilgilendirme metni (site düzeltmeler.docx, aynen) */
  var BILGI = {
    giris: ["Web sitemiz sadece alıcı ile satıcıyı buluşturan bir platformdur. Bu nedenle satıcı ve alıcı arasındaki para trafiği ve malları alma ve satmayla ilgili hiçbir sorumluluğu bulunmamaktadır. Herkes kendi mal alım ve satımından kendisi sorumludur.", "İnsanları dolandırmaya yönelik eylemlerden kaçınmak için para göndermeden önce mutlaka aşağıdaki adımları izleyin."],
    adim: ["Satıcının elindeki malın deposunda olduğunu gidip görün yada görüntülü arama ile size ürünleri göstermesini isteyin.", "Sadece satan kişinin kendi hesabına yada firmanın resmi hesabına ödemeyi gönderin. Satıcı başka bir hesaba ödemeyi göndermenizi isterse ödemeyi göndermeyin.", "Mal faturasını size kesmesini isteyin ve fatura karşılığında mal bedelini firmanın resmi hesabına gönderin.", "Güvenmediğiniz kişilerden alışveriş yapmayın. Bu nedenle kapora göndermeden önce mutlaka ilgili kişi ile telefonla yada yüz yüze görüşün.", "Şüpheli bir şey sezdiğinizde mutlaka durumu bize iletmenizi rica ederiz."],
    son: "Dolandırmaya yönelik işlem yapanlar polise ihbar edilecektir ve bu kişiler web sitemizdeki kara listeye eklenecek ve Türkiye’deki bütün ticaret odalarına bu bilgi gönderilecektir. Ağır cezalar ve yaptırımlara maruz kalmamak için bu tarz yollara tevessül etmemenizi önemle hatırlatırız."
  };

  var BLOG = [
    { id: "fazla-stok-nakit", baslik: "Fazla stoğu nakde çevirmenin 7 yolu", ozet: "Depoda bekleyen her koli, her gün biraz daha değer kaybeder. Üretim fazlasını, iade ve sezon sonu ürünlerini zarar etmeden satmanın yollarını derledik.", kat: "Satış", tarih: "28 Ekim 2026", dk: 6, ikon: "koli", renk: "#A9801F", metin: [
      "Türkiye'de üretici ve toptancıların büyük kısmı yıl sonunda depo sayımında aynı tabloyla karşılaşır: iptal edilen bir siparişten kalan parti, sezonu kaçmış ürünler, etiketi değişen ambalajlar. Bu stok hem depo alanı hem de bağlı sermaye demektir.",
      "1. Önce stoğu sınıflandırın. Yeni ve kusursuz ürün, ambalajı hasarlı ürün, ikinci kalite ve son tüketim tarihi yaklaşan ürün ayrı fiyatlanmalı. Alıcı neyi neden ucuza aldığını bildiğinde pazarlık kısalır.",
      "2. Ürün kodu ve barkodu eksiksiz yazın. Kurumsal alıcılar satın alma sistemine kodla girer; kodsuz ilan ikinci plana düşer.",
      "3. Stoğun tamamını tek alıcıya satmaya hazır olun. Doğru fiyatlı ilan, alıcının 'Satın al' ile hepsini almasını kolaylaştırır; parça alım isteyenler de teklif verir.",
      "4. Kategorinizdeki üyelere duyurun. StokPazarı kurumsal hesabında, ilanınızı o kategoriyi takip eden bireysel ve kurumsal üyelere e-postayla tek tıkla bildirebilirsiniz.",
      "5. Satılanları gizlemeyin. Firma sayfanızdaki 'satıldı' ilanları, yeni alıcılar için en güçlü referanstır.",
      "6. Reddettiğiniz teklifi kaybetmeyin. Teklif verene 'şu fiyattan verebilirim' diye yazmak, satışı çoğu zaman aynı gün kapatır.",
      "7. Satıldıktan sonra ilanı pasife alın. Güncel olmayan ilan alıcıyı yorar; sistem 3 gün içinde pasife alınmayan satılmış ilanları zaten otomatik kaldırır."
    ] },
    { id: "teklif-verirken", baslik: "Teklif verirken nelere dikkat edilmeli?", ozet: "Satın almadan önce depoyu görmekten doğru miktarı yazmaya kadar, teklifinizin ciddiye alınmasını sağlayan kısa bir kontrol listesi.", kat: "Rehber", tarih: "21 Ekim 2026", dk: 5, ikon: "disli", renk: "#2C5C8F", metin: [
      "Bir üründe iki yolunuz var: stoğun tamamını ilan fiyatından satın almak ya da istediğiniz miktar için teklif vermek. Teklifte fiyat ve miktarı siz yazarsınız.",
      "Teklifiniz kabul edilirse satış kesinleşir, iki tarafa da bilgilendirme gider. Kabul edilmezse satıcı size kendi fiyatını yazabilir; pazarlık buradan devam eder.",
      "Para göndermeden önce malın depoda olduğunu görün ya da görüntülü aramayla gösterilmesini isteyin. Ödemeyi yalnız satıcının kendi hesabına ya da firmanın resmi hesabına yapın.",
      "Faturayı isteyin ve fatura karşılığında ödeyin. Şüpheli bir durum sezdiğinizde bize iletin."
    ] },
    { id: "satildi-etiketi", baslik: "'Satıldı' etiketi neden ilanınızda kalmalı?", ozet: "Satılan ürünü hemen silmek alışkanlıktır; ama satıldı ilanları hem güven verir hem de alım talebiyle yeni satışlar getirir.", kat: "Platform", tarih: "14 Ekim 2026", dk: 4, ikon: "komodin", renk: "#8A5A36", metin: [
      "Bir alıcı firmanızı ilk kez gördüğünde 'bu firma gerçekten satış yapıyor mu?' diye sorar. Firma sayfanızın altındaki satıldı işaretli ilanlar bu sorunun cevabıdır.",
      "StokPazarı'nda satılan ürün listeden kalkmaz; resmin üstünde SATILDI etiketiyle görünmeye devam eder. Aynı ürünü almak isteyenler 'Alım talebi gönder' butonuyla adet ve istedikleri fiyatı size iletir.",
      "Böylece bir satış biter gibi görünse de yeni üretim ya da benzer stok için talep toplamaya devam edersiniz.",
      "İsterseniz firma ayarlarınızdaki 'Önceden satılanları göster' anahtarıyla bu bölümü dilediğiniz zaman gizleyebilirsiniz."
    ] },
    { id: "kurumsal-teklif", baslik: "Kurumsal hesapla teklif almak: pazarlığı kaybetmeden satış", ozet: "Teklif, kabul, ret ve karşı teklif mesajı: kurumsal hesabın satış akışını adım adım gösteriyoruz.", kat: "Rehber", tarih: "7 Ekim 2026", dk: 5, ikon: "koltuk", renk: "#6A4BA3", metin: [
      "Kurumsal hesapta ilanlarınıza gelen her teklif satıcı panelinize düşer: teklif veren firma, birim fiyat, adet ve toplam tutar tek satırda.",
      "Bir teklifi reddettiğinizde sistem size bir mesaj kutusu açar. 'Sen 88 TL verdin ama 90 TL'den sana satabilirim' gibi kısa bir mesaj, satışı devam ettirir.",
      "Satış gerçekleştiğinde hem alıcıya hem size otomatik e-posta gider; ürün SATILDI olarak işaretlenir ve 3 günlük pasife alma süresi başlar.",
      "Bireysel üyeler de teklif verir ve teklif alır; mesajlarınızı alabilir ama serbest mesaj gönderemez."
    ] },
    { id: "skt-yaklasan-gida", baslik: "Son tüketim tarihi yaklaşan gıdada doğru ilan nasıl yazılır?", ozet: "SKT'si yaklaşan ürünü saklamadan, açıkça belirterek satmak hem güven verir hem de doğru alıcıyı bulur.", kat: "Sektör", tarih: "30 Eylül 2026", dk: 4, ikon: "teneke", renk: "#D9691F", metin: [
      "Gıda stoklarında en büyük risk zamanla yarışmaktır. Son tüketim tarihine 3–6 ay kalan ürün için toplu yemek, catering ve otel mutfakları en doğru alıcıdır.",
      "İlan başlığına ve kondisyon alanına SKT'yi açıkça yazın (ör. 'SKT 03/2027'). Saklanan bilgi, satış sonrasında iade ve güven sorununa döner.",
      "Soğuk zincir gerektiren ürünlerde teslim şeklini ve sorumluluğu ilanda belirtin. Alıcının aklındaki ilk soru budur.",
      "Gıda kategorisini takip eden üyelere duyuru göndermek, kısa sürede satılması gereken ürünlerde en hızlı yoldur."
    ] }
  ];

  var SSS = [
    ["Satış nasıl gerçekleşiyor, ödeme sitede mi yapılıyor?", "Hayır. Site alıcı ile satıcıyı buluşturur; sepet ve ödeme yoktur. Alıcı stoğun tamamını ilan fiyatından satın alır ya da istediği miktar için teklif verir. Ödeme ve sevkiyat iki taraf arasında yapılır."],
    ["Bireysel hesap gerçekten ücretsiz mi?", "Evet. Yılda 3 ilan hakkı vardır; teklif verebilir, teklif alabilir ve alım talebi gönderebilirsiniz. Her ilan 30 gün yayında kalır, 2 kez yenilenebilir (en fazla 90 gün). Daha fazlası için kurumsal üyeliğe geçilir."],
    ["Kurumsal ilanların süresi nasıl işliyor?", "Her ilan 30 gün sonunda pasife alınır; isterseniz güncelleyip tekrar yayına alırsınız. Bir ilan en fazla 1 yıl yayında kalabilir, sonrasında yeni ilan girilir. Satılan ilan tekrar yayına alınamaz."],
    ["Basic ve Gold arasındaki fark nedir?", "Basic'te aynı anda 10 ilan yayında olabilir; logo, üst banner ve 1 tanıtım resmi vardır. Gold'da aynı anda 25 ilan yayında olabilir; logo, üst banner ve kayan slayt şeklinde 5 tanıtım resmi vardır."],
    ["Kurumsal ilan hakkı yıllık mı?", "Hayır. 10 ve 25 ilan, aynı anda yayında tutabileceğiniz ilan sayısıdır. İlanı pasife aldığınızda, ilan satıldığında ya da 30 günü dolup pasife düştüğünde hakkınız geri açılır. Bireysel üyelikte ise yılda 3 ilan kuralı geçerlidir; bireysel ilanı kaldırmak hakkı geri açmaz."],
    ["Doğrulama neden gerekli?", "İlan verebilmek için telefon ve e-posta doğrulaması şarttır. Doğrulanan bilgiler profilinizde yeşil tik ile gösterilir; bu, alıcıların güvenini artırır."]
  ];

  window.SP_VERI = { BILGI: BILGI, BIREYSEL: BIREYSEL, KATEGORI: KATEGORI, FIRMA: FIRMA, URUN: URUN, TEKLIF: TEKLIF, VERILEN: VERILEN, TALEP: TALEP, MESAJ: MESAJ, KISI: KISI, BLOG: BLOG, SSS: SSS };
})();
