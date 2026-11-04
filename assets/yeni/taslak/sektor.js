// 427 sektörün hizmet satırları. Biçim: Ad[,Ad2]@kategori[@foto]>Hizmet:örnekFiyat[/birim];Hizmet2...  Fiyat yoksa "teklifle" görünür. Fiyatlar örnektir.
window.TV = window.TV || {};
TV.S = `Oto servis,Oto tamirci@oto>Periyodik bakım:6500;Fren balatası değişimi:3200;Arıza tespiti:1200;Debriyaj değişimi:14000;Triger seti değişimi:16000;Yağ ve filtre değişimi:3800
Oto elektrik@oto>Elektrik arıza tespiti:1200;Marş ve şarj dinamosu:3500;Akü testi ve değişimi:4500;Far ve aydınlatma tamiri:1500;Kablo tesisatı onarımı:2500
Oto kaporta boya@oto>Lokal boya:3500/adet;Kaporta düzeltme:5000;Boyasız göçük düzeltme:2500/adet;Tampon onarımı:3000;Komple boya:60000
Lastikçi@oto>Lastik değişimi:800;Balans ayarı:600;Rot ayarı:1200;Lastik tamiri:400;Mevsimlik lastik saklama:3000
Oto yıkama@oto@otoyikama>İç dış yıkama:450;Detaylı iç temizlik:1800;Motor temizliği:900;Koltuk yıkama:1500;Pasta cila:3500
Oto ekspertiz@oto>Tam ekspertiz raporu:3500;Kaporta boya kontrolü:1500;Motor ve mekanik kontrol:1800;Yol testi:800
Oto cam@oto>Ön cam değişimi:7500;Yan cam değişimi:3500;Taş izi tamiri:800;Cam filmi:4500
Oto döşeme@oto>Koltuk döşeme:18000;Tavan kaplama:6000;Direksiyon kaplama:2500;Paspas ve taban kaplama:4000
Egzoz servisi@oto>Egzoz tamiri:2500;Susturucu değişimi:4500;Katalizör kontrolü:1500;Emisyon hazırlığı:1500
Akü servisi@oto>Akü testi:300;Akü değişimi:4500;Yerinde akü takviyesi:1200;Şarj sistemi kontrolü:800
Motosiklet servisi@oto>Periyodik bakım:3000;Lastik değişimi:800;Zincir ve dişli seti:3500;Fren bakımı:1200;Motor arıza tespiti:1000
Oto klima@oto>Klima gazı dolumu:1800;Klima bakımı:1500;Polen filtresi değişimi:700;Kompresör onarımı:6500
Rot balans@oto>Rot ayarı:1200;Balans ayarı:600;Lastik değişimi:800;Alt takım kontrolü:800
Oto yedek parça@magaza@oto>Parça sorgulama;Şasi numarasıyla doğru parça;Fren ve filtre grubu;Motor ve şanzıman parçaları;Aynı gün kargo
Çekici hizmeti@usta@oto>Şehir içi çekme:2500;Şehirler arası çekme:60/km;Yol yardımı:1500;Kaza yerinden kurtarma
Oto kuaför@oto@otoyikama>Pasta cila:3500;İç detay temizliği:2500;Far parlatma:1200;Koltuk temizliği:1500;Boya koruma:6000
Seramik kaplama@oto@otoyikama>Boya hazırlığı ve pasta:4500;Seramik kaplama:15000;Cam kaplama:2500;İç yüzey koruma:3000
Araç kaplama@oto@otoyikama>Tam kaplama:45000;Tavan kaplama:6000;Krom karartma:3500;Şeffaf koruma filmi:30000
Motor rektifiye@oto>Silindir kapak işleme:9000;Komple rektifiye;Krank taşlama:7000;Motor sökme takma:15000
Şanzıman servisi@oto>Şanzıman yağı değişimi:4500;Otomatik şanzıman arıza tespiti:1500;Şanzıman onarımı;Debriyaj seti:14000
Oto anahtar@oto>Yedek anahtar kopyalama:3500;İmmobilizer programlama:3000;Kumanda değişimi:2000;Araç kapısı açma:1500
LPG servisi@oto>LPG montajı:32000;LPG bakımı:1800;Periyodik muayene belgesi:1500;Enjektör ve regülatör değişimi:3500
Oto aksesuar@magaza@oto>Multimedya ekran;Geri görüş kamerası;Paspas ve bagaj havuzu;Cam filmi;Montaj hizmeti
Oto galeri@galeri>Satılık araçlar;Araç alımı ve takas;Kredi ön başvurusu;Ekspertiz raporu;Noter işlemleri
İkinci el araç@galeri>Ekspertizli araçlar;Değerinde araç alımı;Takas;Kredi seçenekleri;Noter desteği
Rent a car,Araç kiralama@galeri>Ekonomik sınıf günlük kiralama:1800;Orta sınıf günlük kiralama:2600;SUV günlük kiralama:3800;Havalimanı teslim;Aylık kiralama
Motosiklet bayi@galeri>Sıfır motosikletler;İkinci el motosikletler;Test sürüşü;Taksitli satış;Tescil işlemleri
Karavan kiralama@galeri>Çekme karavan:4000/gün;Motokaravan:8000/gün;Kullanım eğitimi;Kamp noktası önerisi
Tekne kiralama@tur@tur>Günlük tekne:28000/gün;Kaptanlı tur;Saatlik kiralama:4500/saat;Özel gün organizasyonu
Bisiklet satışı@magaza@magaza>Şehir bisikletleri;Dağ bisikletleri;Çocuk bisikletleri;Bakım ve ayar;Aksesuar
Araç transfer,VIP transfer@ulasim>Havalimanı karşılama:2500;Şehir içi transfer:1500;VIP araç saatlik:1800/saat;Şehirler arası transfer
Taksi durağı@ulasim>Durak çağrısı;Havalimanı yolculuğu;Şehir dışı yolculuk;Düzenli müşteri hesabı
Sürücü kursu@egitim>B sınıfı ehliyet:25000;A sınıfı ehliyet:15000;Ek direksiyon dersi:1500/ders;Direksiyon sınavı hazırlığı
Oto bayi@galeri>Sıfır araçlar;Test sürüşü;Kredi ve taksit;Takas değerlendirmesi;Servis randevusu
Diş kliniği@klinik@dis>Muayene;Dolgu;Kanal tedavisi;Diş beyazlatma;İmplant;Ortodonti
Ortodonti@klinik@dis>Ortodontik muayene;Telli tedavi;Şeffaf plak;Çocukta erken müdahale;Pekiştirme takibi
Göz kliniği@klinik>Göz muayenesi;Katarakt değerlendirmesi;Glokom takibi;Çocuk göz muayenesi;Lazer uygunluk testi
Estetik cerrahi@klinik>Ön görüşme;Burun estetiği değerlendirmesi;Yüz estetiği değerlendirmesi;Vücut estetiği değerlendirmesi;Ameliyat sonrası kontrol
Saç ekimi@klinik>Saç analizi;FUE değerlendirmesi;DHI değerlendirmesi;Kaş ve sakal ekimi değerlendirmesi;Ekim sonrası takip
Fizik tedavi,Fizyoterapist@klinik>Fizyoterapi değerlendirmesi;Bel ve boyun programı;Spor yaralanması programı;Ameliyat sonrası rehabilitasyon;Ev programı
Diyetisyen@klinik>İlk görüşme;Kişiye özel beslenme planı;Online takip;Kilo kontrolü;Sporcu beslenmesi
Psikolog@klinik>İlk görüşme;Bireysel terapi;Çift terapisi;Ergen danışmanlığı;Online seans
Psikiyatrist@klinik>Psikiyatrik değerlendirme;İlaç takibi;Bireysel görüşme;Kontrol randevusu
Dermatoloji@klinik>Cilt muayenesi;Ben kontrolü;Akne tedavisi;Saç ve tırnak hastalıkları;Kozmetik dermatoloji
Kadın doğum@klinik>Jinekolojik muayene;Gebelik takibi;Ultrason;Yıllık kontrol;Menopoz danışmanlığı
Çocuk doktoru@klinik>Çocuk muayenesi;Aşı takibi;Büyüme ve gelişme kontrolü;Yenidoğan takibi
Muayenehane@klinik>Muayene;Kontrol randevusu;Tahlil yorumlama;Tedavi planı
Tıp merkezi@klinik>Dahiliye muayenesi;Check-up programı;Laboratuvar tetkikleri;Görüntüleme yönlendirmesi;Uzman randevusu
Laboratuvar@saglikurun@klinik>Kan tahlili;Hormon testleri;Check-up paketi;Evden numune alma;Sonuçlar için dijital rapor
Görüntüleme merkezi@saglikurun@klinik>MR;Tomografi;Ultrason;Röntgen;Sonuçlar için dijital rapor
Eczane@saglikurun@eczane>Reçeteli ilaç;Dermokozmetik ürünler;Vitamin ve takviye;Tansiyon ölçümü;Nöbet bilgisi
Optik,Gözlükçü@saglikurun@optik>Numaralı gözlük;Güneş gözlüğü;Lens;Çerçeve ayarı ve onarım;Çocuk gözlükleri
İşitme cihazı@saglikurun@klinik>Duyma testi;Cihaz denemesi;Kulak içi cihazlar;Pil ve bakım;Ayar kontrolü
Evde bakım@klinik>Yaşlı bakımı;Hasta bakımı;Refakatçi;Gece bakımı;Evde değerlendirme
Hemşirelik hizmeti@klinik>Evde serum takibi;Enjeksiyon;Pansuman;Sonda bakımı;Tansiyon ve şeker takibi
Sağlık turizmi@klinik>Tedavi planı danışmanlığı;Klinik yönlendirmesi;Havalimanı karşılama;Konaklama planı;Tercüman desteği
Konuşma terapisti@klinik>Dil ve konuşma değerlendirmesi;Kekemelik terapisi;Çocuk dil gelişimi;Artikülasyon terapisi
Ergoterapi@klinik>Ergoterapi değerlendirmesi;Duyu bütünleme;Çocuk programı;Günlük yaşam becerileri
Akupunktur@klinik>Ön görüşme;Akupunktur seansı;Ağrı programı;Kontrol görüşmesi
Kulak burun boğaz@klinik>KBB muayenesi;Sinüzit takibi;Burun tıkanıklığı değerlendirmesi;Kulak temizliği;Çocukta geniz eti takibi
Ortopedi@klinik>Ortopedi muayenesi;Eklem ağrısı değerlendirmesi;Spor yaralanmaları;Kırık takibi;Omurga değerlendirmesi
Kardiyoloji@klinik>Kardiyoloji muayenesi;EKG;Efor testi;Ekokardiyografi;Tansiyon takibi
Üroloji@klinik>Üroloji muayenesi;Prostat değerlendirmesi;Taş hastalığı takibi;Ultrason;Kontrol randevusu
Diyaliz merkezi@klinik>Hemodiyaliz seansı;Seans planlama;Hasta nakil bilgisi;Diyet danışmanlığı;Misafir hasta kabulü
Veteriner,Veteriner kliniği@veteriner>Muayene:900;Karma aşı:1100;Kuduz aşısı:700;Parazit uygulaması:600;Kısırlaştırma:6500;Tıraş ve bakım:1400
Pet kuaför@pet@veteriner>Banyo ve kurutma:800;Komple tıraş:1400;Tırnak kesimi:250;Kulak temizliği:250;Tüy bakımı:1000
Pet shop@magaza@veteriner>Kedi ve köpek maması;Kum ve hijyen ürünleri;Oyuncak ve tasma;Kuş ve kemirgen ürünleri;Eve teslim
Köpek eğitimi@pet@veteriner>Temel itaat eğitimi:18000;Yavru eğitimi:12000;Davranış danışmanlığı:2500/seans;Eve gelen eğitmen:2500/ders
Hayvan oteli,Kedi oteli@pet@veteriner>Günlük konaklama:700/gün;Haftalık konaklama:4200;Servis;Mama takibi;Fotoğraflı günlük bilgi
Akvaryumcu@magaza@magaza>Akvaryum kurulumu;Süs balıkları;Filtre ve ekipman;Canlı bitki;Periyodik bakım
Evcil hayvan maması@magaza@veteriner>Kedi maması;Köpek maması;Abonelik sipariş;Eve teslim;Mama danışmanlığı
Güzellik merkezi@guzellik>Cilt bakımı:1800;Lazer epilasyon:1100/seans;Kaş tasarımı:600;Manikür:500;Medikal cilt analizi;Kirpik lifting:900
Kuaför,Kadın kuaförü@guzellik>Saç kesimi:700;Fön:400;Dip boya:1400;Röfle:3500;Keratin bakım:4000;Gelin başı:6000
Nail art,Manikür pedikür@guzellik>Manikür:500;Pedikür:600;Kalıcı oje:600;Protez tırnak:1400;Nail art tasarımı:150/adet
Kalıcı makyaj@guzellik>Kaş kontür:6000;Dudak renklendirme:5500;Eyeliner:4500;Rötuş:2000
Lazer epilasyon@guzellik>Tüm vücut:4500/seans;Bacak:1800/seans;Koltuk altı:500/seans;Yüz:600/seans;Seans paketi
Cilt bakımı@guzellik>Klasik cilt bakımı:1500;Hydrafacial:3000;Kimyasal peeling:2500;Cilt analizi:500
Masaj salonu@guzellik>Klasik masaj:1800;Aromaterapi masajı:2200;Derin doku masajı:2400;Çift masajı:3800
Spa,Hamam@guzellik>Kese köpük:1200;Masaj:1800;Sauna ve buhar:700;Çift paketi:3800;Günlük spa paketi:3200
Kirpik uzatma@guzellik>İpek kirpik:1400;Volume kirpik:1800;Kirpik lifting:900;Bakım seansı:700
Kaş tasarımı@guzellik>Kaş alma:250;Kaş laminasyonu:800;Kaş boyama:300;Microblading:6000
Solaryum@guzellik>Dakika paketi:600/seans;Yüz solaryumu:200;Bronzlaştırıcı ürünler;Seans paketi
Gelin başı@guzellik>Gelin başı:6000;Prova:1500;Nişan saçı:3000;Yerinde hazırlık:2500;Refakatçi saçı:1000/kişi
Makyöz@guzellik>Gelin makyajı:7000;Özel gün makyajı:2500;Prova:1500;Yerinde makyaj:1500
Dövme stüdyosu@guzellik>Küçük dövme:2500;Orta boy dövme:6000;Örtme dövmesi;Kişiye özel çizim;Bakım önerisi
Piercing@guzellik>Kulak piercing:800;Burun piercing:900;Takı değişimi:200;Bakım kontrolü
Saç bakım merkezi@guzellik>Saç analizi:500;Keratin bakım:4000;PRP uygunluk görüşmesi;Saç dökülmesi bakımı:1500
Zayıflama merkezi@guzellik>Ölçüm ve analiz;Bölgesel incelme:1200/seans;Selülit programı:1400/seans;Beslenme yönlendirmesi
Berber,Erkek kuaförü@berber>Saç kesimi:500;Sakal tıraşı:300;Saç ve sakal:700;Çocuk tıraşı:350;Cilt bakımı:500;Damat tıraşı:2500
Sakal tasarımı@berber>Sakal şekillendirme:350;Ustura tıraş:350;Sakal boyama:400;Sıcak havlu bakımı:200
Çocuk berberi@berber>Çocuk tıraşı:350;İlk tıraş hatırası:500;Bebek tıraşı:400;Anne baba tıraşı:500
Kafe,Kahveci@kafe>Filtre kahve:110;Espresso bazlı içecekler:130;Sandviç:220;Tatlı:190;Çekirdek satışı:520;Masa rezervasyonu
Pastane@kafe@pastane>Yaş pasta:1400;Kuru pasta:520/kg;Börek çeşitleri:420/kg;Doğum günü pastası:1700;Toplu sipariş
Çay bahçesi@kafe>Çay:30;Tost:150;Kahvaltı tabağı:350;Aile masası rezervasyonu
Nargile kafe@kafe>Nargile:300;Türk kahvesi:90;Soğuk içecekler:90;Masa rezervasyonu
Bar,Kokteyl bar@kafe>Klasik kokteyller:450;İmza kokteyller:520;Yerli içki seçkisi:320;Aperatif tabağı:400;Masa rezervasyonu
Dondurmacı@kafe@pastane>Top dondurma:60;Kilo dondurma:650/kg;Sütlü tatlı:180;Soğuk içecek:90
Waffle@kafe@pastane>Klasik waffle:280;Meyveli waffle:330;Çikolatalı waffle:310;Soğuk içecek:90
Kumpir@restoran>Klasik kumpir:220;Kaşarlı özel kumpir:260;Ek malzeme:30/adet;Paket servis
Tatlıcı,Baklavacı@kafe@pastane>Fıstıklı baklava:1450/kg;Künefe:220;Sütlü tatlılar:150;Şerbetli tatlılar:520/kg;Kutu hediye
Bubble tea@kafe>Klasik sütlü çay:160;Meyveli çay:170;Ek top:30;Paket servis
Kitap kafe@kafe>Filtre kahve:110;Sandviç:210;Okuma köşesi;Etkinlik takvimi
Oyun kafe@eglence@eglence>Saatlik masa:120/saat;Masa oyunları kütüphanesi;Grup etkinliği;Atıştırmalıklar
Restoran@restoran>Ana yemekler:450;Mezeler:190;Paket servis;Grup menüsü:900/kişi;Masa rezervasyonu
Lokanta@restoran>Günün yemeği:220;Tencere yemeği:190;Çorba:90;Paket servis;Toplu sipariş
Kebapçı@restoran>Adana kebap:420;Urfa kebap:420;Beyti:480;Lahmacun:120;Paket servis
Pideci@restoran>Kıymalı pide:230;Kuşbaşılı pide:300;Kaşarlı pide:220;Lahmacun:120;Paket servis
Pizzacı@restoran>Margarita:280;Karışık pizza:360;Mevsim pizza:340;Paket servis;Çocuk menüsü:200
Burger@restoran>Klasik burger:300;Peynirli burger:330;Duble burger:430;Patates:120;Paket servis
Balık restoranı@restoran>Günün balığı:750;Meze tabağı:320;Deniz mahsulleri:650;Masa rezervasyonu;Özel gün menüsü:1500/kişi
Meyhane@restoran>Meze çeşitleri:180;Sıcak başlangıçlar:220;Balık:750;Fasıl gecesi;Masa rezervasyonu
Çiğ köfteci@restoran>Dürüm:120;Porsiyon:180;Kilo çiğ köfte:520/kg;Paket servis
Dönerci@restoran>Et döner porsiyon:380;Tavuk döner porsiyon:260;Dürüm:230;İskender:430;Paket servis
Kahvaltı salonu@restoran@kafe>Serpme kahvaltı:550/kişi;Kahvaltı tabağı:320;Menemen:180;Masa rezervasyonu
Ev yemekleri@restoran>Günün menüsü:230;Tencere yemeği:190;Sebze yemekleri:150;Haftalık abonelik;Paket servis
Catering@restoran>Toplantı ikramı:350/kişi;Düğün yemeği:750/kişi;Kokteyl menüsü:450/kişi;Şirket yemeği:230/kişi
Mantı evi@restoran>Kayseri mantısı:280;Fırın mantı:300;Çiğ mantı:520/kg;Paket servis
Köfteci@restoran>Izgara köfte:350;Piyaz:120;Köfte ekmek:180;Paket servis
Sushi@restoran>Maki seti:520;Nigiri seti:680;Karma tabak:980;Paket servis
Vegan restoran@restoran>Günün vegan tabağı:360;Vegan burger:330;Glutensiz seçenekler;Tatlı:190;Paket servis
Paket servis@restoran>Günün menüsü:260;Öğrenci menüsü:190;Toplu sipariş;Şirketlere abonelik
Kokoreççi@restoran>Yarım kokoreç:220;Çeyrek kokoreç:150;Midye:120;Paket servis
Lahmacun salonu@restoran>Lahmacun:110;Fındık lahmacun:230;Ayran:40;Paket servis
Steakhouse@restoran>Antrikot:1250;Dana bonfile:1400;Burger:480;Masa rezervasyonu;Özel gün menüsü:2200/kişi
Ocakbaşı@restoran>Karışık ızgara:780;Kuzu şiş:560;Mezeler:180;Masa rezervasyonu
Otel@otel>Standart oda:2800/gece;Deniz manzaralı oda:3800/gece;Aile odası:4600/gece;Kahvaltı;Havalimanı transferi:1800
Butik otel@otel>Bahçe odası:3200/gece;Taş oda:3900/gece;Süit:5500/gece;Serpme kahvaltı;Havalimanı transferi:1800
Pansiyon@otel>Çift kişilik oda:1800/gece;Aile odası:2800/gece;Kahvaltı:300/kişi;Otopark
Apart otel@otel>Stüdyo daire:2400/gece;1+1 daire:3200/gece;2+1 daire:4200/gece;Aylık konaklama;Temizlik hizmeti
Villa kiralama@otel@emlak>Havuzlu villa:9000/gece;Muhafazakâr villa:10500/gece;Haftalık kiralama;Havalimanı transferi:2200;Temizlik dahil
Bungalov@otel@tur>Çift kişilik bungalov:3000/gece;Şömineli bungalov:3800/gece;Kahvaltı;Doğa yürüyüşü
Kamp alanı@otel@tur>Çadır alanı:400/kişi;Karavan alanı:800/gün;Ekipman kiralama;Duş ve elektrik
Hostel@otel>Karma oda yatağı:600/gece;Kadın odası yatağı:650/gece;Özel oda:1600/gece;Ortak mutfak
Tatil köyü@otel>Herşey dahil oda:5200/gece;Aile odası:6800/gece;Çocuk kulübü;Havalimanı transferi:1800
Tur şirketi@tur>Günübirlik tur:1400/kişi;Hafta sonu turu:6500/kişi;Yurt dışı tur;Kurumsal gezi
Seyahat acentesi@tur>Uçak bileti;Otel rezervasyonu;Vize desteği;Paket tur;Kurumsal seyahat
Turist rehberi@tur>Şehir turu:6000/gün;Ören yeri gezisi:7000/gün;Yürüyüş turu:800/kişi;Çok dilli rehberlik
Yat turu@tur>Günlük yat turu:1800/kişi;Özel yat kiralama:45000/gün;Gün batımı turu:1500/kişi;Öğle yemeği dahil
Dalış okulu@tur>Tanışma dalışı:2800;Open Water eğitimi:18000;Rehberli dalış:2200;Ekipman kiralama
Yamaç paraşütü@tur>Tandem uçuş:4500;Video ve fotoğraf:1000;Otelden alma;Grup uçuşu
Rafting@tur>Günlük rafting:1600/kişi;Rafting ve öğle yemeği:1900/kişi;Otelden alma;Grup programı
Günübirlik tur@tur>Tekne turu:1400/kişi;Jeep safari:1600/kişi;Antik kent gezisi:1500/kişi;Otelden alma
Emlak ofisi@emlak>Satılık konutlar;Kiralık konutlar;Ücretsiz ön değerleme;Kiracı bulma;Tapu işlemleri
Gayrimenkul danışmanı@emlak>Kişisel portföy danışmanlığı;Satış planı;Yatırım değerlendirmesi;Kiralama;Tapu takibi
Site yönetimi,Apartman yönetimi@emlak@emlak>Aidat takibi;Gelir gider raporu;Personel yönetimi;Bakım planı;Toplantı ve karar defteri
Değerleme uzmanı@emlak>Taşınmaz değerleme raporu;Kredi için değerleme;Miras ve dava raporu;Yatırım analizi
Konut projesi@emlak@insaat>Daire seçenekleri;Kat planları;Ödeme planı;Örnek daire gezisi;Teslim takvimi
Ofis kiralama@emlak@ofis>Hazır ofis:18000/ay;Sanal ofis:1500/ay;Toplantı odası:600/saat;Ortak çalışma alanı:4500/ay
Depo kiralama@emlak@nakliyat>Küçük depo:3000/ay;Orta boy depo:6000/ay;Büyük depo:14000/ay;Eşya taşıma;7/24 giriş
Arsa satışı@emlak@tarim>Konut imarlı arsa;Yatırımlık arazi;Tapu ve imar kontrolü;Parselasyon bilgisi;Yerinde gezi
İnşaat firması,Müteahhit@insaat>Anahtar teslim konut;Kat karşılığı inşaat;Proje ve ruhsat;Kaba inşaat;İnce işler
Tadilat@insaat>Komple ev tadilatı:6500/m²;Banyo tadilatı:90000;Mutfak yenileme:110000;Boya:320/m²;Parke:750/m²;Fayans döşeme:850/m²
Boya badana@insaat>İç cephe boya:320/m²;Tavan boya:280/m²;Dekoratif boya:650/m²;Dış cephe boya:380/m²;Alçı tamiri:250/m²
Alçı ustası@insaat>Alçı sıva:300/m²;Saten alçı:220/m²;Alçıpan tavan:650/m²;Kartonpiyer:250/metre
Fayans ustası@insaat>Fayans döşeme:850/m²;Yer seramiği:750/m²;Banyo yenileme:90000;Derz yenileme:250/m²
Parke ustası@insaat>Laminat döşeme:550/m²;Masif parke döşeme:1000/m²;Parke cilası:650/m²;Süpürgelik:150/metre
Mantolama@insaat>Dış cephe mantolama:1300/m²;Çatı yalıtımı:900/m²;İskele kurulumu;Isı kaybı keşfi
Çatı ustası@insaat>Çatı aktarma:1400/m²;Kiremit değişimi:600/m²;Oluk ve dere:500/metre;Çatı yalıtımı:900/m²
Su yalıtımı@insaat>Teras yalıtımı:900/m²;Bodrum yalıtımı:1200/m²;Banyo yalıtımı:800/m²;Rutubet tespiti:1500
İç mimar@insaat@mobilya>İç mekân projesi;3D görselleştirme;Malzeme seçimi;Uygulama takibi;Ofis ve mağaza tasarımı
Mimarlık ofisi@insaat>Mimari proje;Ruhsat dosyası;Tadilat projesi;Rölöve;Uygulama takibi
Peyzaj@insaat@tarim>Bahçe tasarımı;Çim ve ekim:450/m²;Otomatik sulama:600/m²;Bitki bakımı;Sert zemin kaplama:1100/m²
Havuz yapımı@insaat@otel>Betonarme havuz;Prefabrik havuz;Havuz ekipmanı;Havuz bakımı:3500/ay;Keşif ve proje
Prefabrik@insaat>Prefabrik ev;Şantiye ofisi;Bahçe ofisi;Nakliye ve montaj;Temel projesi
Çelik konstrüksiyon@insaat@uretim>Çelik yapı projesi;Depo ve hangar;Çatı konstrüksiyonu;İmalat ve montaj;Statik hesap
Hazır beton@insaat>C25 beton:3800/ton;C30 beton:4100/ton;Pompa hizmeti;Şantiye sevkiyatı;Beton numune takibi
Hafriyat@insaat>Kazı işleri;Temel hafriyatı;Moloz taşıma;İş makinesi kiralama:3500/saat;Saha düzenleme
Yapı denetim@insaat>Proje incelemesi;Şantiye denetimi;Numune takibi;Hakediş ve rapor;Kurum yazışmaları
Mühendislik bürosu@insaat@ofis>Statik proje;Elektrik projesi;Mekanik proje;Güçlendirme raporu;Danışmanlık
Mutfak dolabı@insaat@mobilya>Ölçü ve çizim;Lake mutfak dolabı:18000/metre;Membran dolap:12000/metre;Tezgâh;Montaj
Banyo tadilatı@insaat>Komple banyo yenileme:90000;Fayans döşeme:850/m²;Vitrifiye değişimi:18000;Duşakabin montajı:4500;Tesisat yenileme:15000
Tesisatçı@usta>Su kaçağı tespiti:2500;Tıkanıklık açma:1500;Musluk ve batarya:900;Pis su tesisatı;Kalorifer tesisatı
Elektrikçi@usta>Arıza tespiti:1000;Priz ve anahtar:300/adet;Sigorta panosu;Aydınlatma montajı:600;Tesisat yenileme
Kombi servisi@usta>Yıllık kombi bakımı:1800;Arıza tespiti:900;Petek temizliği:2500;Kombi değişimi;Parça değişimi
Klima servisi@usta>Klima bakımı:1200;Gaz dolumu:2200;Montaj:2800;Sökme ve taşıma:1500;Arıza tespiti:800
Beyaz eşya servisi@usta>Çamaşır makinesi tamiri;Bulaşık makinesi tamiri;Buzdolabı tamiri;Fırın tamiri;Arıza tespiti:800
Çilingir@usta>Kapı açma:1500;Çelik kapı açma:2500;Kilit değişimi:1800;Kasa açma;Araç kapısı açma:1500
Marangoz@usta@uretim>Ölçüye özel dolap;Kapı tamiri:1200;Mobilya onarımı;Raf ve kitaplık;Ahşap kaplama
Camcı@usta>Cam kesimi:600/m²;Isıcam değişimi:1500/m²;Duşakabin;Vitrin camı;Ayna montajı
PVC pencere@usta>PVC pencere:6500/m²;Sineklik:1200/m²;Panjur;Eski pencere sökümü;Isıcam değişimi
Alüminyum doğrama@usta@uretim>Alüminyum doğrama;Kış bahçesi;Cephe giydirme;Giyotin cam;Keşif ve ölçü
Demirci@usta@uretim>Korkuluk;Bahçe kapısı;Ferforje;Çelik merdiven;Kaynaklı onarım
Kaynakçı@usta@uretim>Yerinde kaynak;Argon kaynak;Demir doğrama;Kaynaklı onarım;Şantiye işleri
Asansör servisi@usta>Aylık bakım sözleşmesi;Arıza çağrısı;Yıllık muayene hazırlığı;Revizyon;Kapı ve panel değişimi
Güvenlik kamerası@usta>4 kameralı set kurulumu:18000;Kayıt cihazı;Telefondan izleme;Bakım ve arıza;Alarm sistemi
Uydu anten@usta>Çanak anten montajı:1500;Merkezi sistem;Çoklu daire kurulumu;Sinyal ayarı:600
Jeneratör@usta@uretim>Jeneratör satışı;Yıllık bakım:6500;Arıza servisi;Kiralama;Otomatik transfer panosu
Güneş enerjisi@usta@insaat>Çatı GES keşfi;Bağ evi sistemi;Akü ve invertör;Panel temizliği;Kurulum ve izin süreci
Doğalgaz tesisatı@usta>Doğalgaz projesi;Daire tesisatı;Kombi bağlantısı;Sızdırmazlık testi;Abonelik işlemleri
Su arıtma@usta>Arıtma cihazı montajı:3500;Filtre değişimi:1500;Yıllık bakım:1800;Sebil kiralama
Böcek ilaçlama@usta@temizlik>Ev ilaçlama:1800;İş yeri ilaçlama;Hamam böceği uygulaması:1500;Haşere kontrol sözleşmesi;Bahçe ilaçlama
Bilgisayar servisi@dukkan@yazilim>Format ve kurulum:1000;Donanım değişimi;Veri kurtarma;Laptop ekran değişimi;Yerinde servis:1200
Telefon tamiri@dukkan@yazilim>Ekran değişimi:3500;Batarya değişimi:1800;Şarj soketi:1200;Yazılım kurulumu:800;Sıvı teması kontrolü:900
Saat tamiri@dukkan@kuyumcu>Pil değişimi:250;Kordon değişimi:400;Bakım ve ayar:1500;Su geçirmezlik testi:500
Ayakkabı tamiri@dukkan@uretim>Pençe değişimi:600;Topuk onarımı:300;Fermuar değişimi:400;Boyama:500;Çanta onarımı:600
Terzi@dukkan@magaza>Paça kısaltma:200;Bel daraltma:300;Fermuar değişimi:250;Ceket kol ayarı:500;Özel dikim
Kuru temizleme@dukkan@temizlik>Takım elbise:400;Gömlek:120;Abiye:800;Mont:450;Perde:120/m²
Halı yıkama@dukkan@temizlik>Makine halısı:70/m²;El dokuma halı:150/m²;Yerinde koltuk yıkama:1600;Servisle alma ve teslim
Mobilya tamiri@dukkan@mobilya>Koltuk tamiri:2500;Sandalye onarımı:600;Döşeme değişimi:4500;Ahşap vernik;Yerinde montaj
Perde montajı@usta@mobilya>Perde montajı:300/adet;Stor perde ölçüsü;Korniş takma:250/metre;Yerinde ölçü
Butik,Giyim mağazası@magaza>Yeni sezon;Elbise ve bluz;Ceket ve mont;Beden sorgulama;Rezerve etme
Ayakkabıcı@magaza>Kadın ayakkabı;Erkek ayakkabı;Spor ayakkabı;Numara sorgulama;Rezerve etme
Çanta mağazası@magaza>Kadın çanta;Sırt çantası;Valiz;Cüzdan;Rezerve etme
Kuyumcu@magaza@kuyumcu>Altın alım satım;Tek taş ve pırlanta;Alyans;Günlük kur bilgisi;Takı onarımı
Saatçi@magaza@kuyumcu>Kol saatleri;Kordon ve pil;Bakım;Marka sorgulama;Hediye paketi
Çiçekçi@magaza@cicekci>Mevsim buketi:750;Saksı çiçeği:550;Düğün ve nişan:4500;Çelenk:2500;Aynı gün teslimat
Hediyelik eşya@magaza>Kişiye özel hediyeler;Doğum günü seçkisi;Kurumsal hediye;Hediye paketi;Şehir içi teslim
Kırtasiye@magaza>Okul listesi hazırlama;Fotokopi ve çıktı:3/sayfa;Ofis malzemeleri;Hediyelik kalem;Kitap kaplama
Kitapçı@magaza>Roman ve edebiyat;Çocuk kitapları;Sınav kitapları;Sipariş kitap;Okul listesi
Oyuncakçı@magaza>Yaşa göre oyuncak;Eğitici oyunlar;Peluş ve figür;Hediye paketi;Stok sorgulama
Spor mağazası@magaza>Spor ayakkabı;Kıyafet;Fitness ekipmanı;Kulüp formaları;Stok sorgulama
Elektronik mağazası@magaza@yazilim>Telefon ve tablet;Bilgisayar;Televizyon;Küçük ev aletleri;Taksit seçenekleri
Telefoncu@magaza@yazilim>Sıfır telefon;İkinci el telefon;Aksesuar;Hat işlemleri;Ekran koruyucu:600
Beyaz eşya bayi@magaza@mobilya>Buzdolabı;Çamaşır makinesi;Bulaşık makinesi;Taksit;Montaj ve eski ürün alımı
Mobilya mağazası@magaza@mobilya>Koltuk takımı;Yatak odası;Yemek odası;Teslimat ve montaj;Ölçüye özel üretim
Ev tekstili,Perdeci@magaza@mobilya>Perde:900/metre;Nevresim;Havlu;Yerinde ölçü;Dikim
Halı mağazası@magaza@mobilya>Makine halısı;Yolluk;Kilim;Ölçüye özel kesim;Eve teslim
Züccaciye@magaza@mobilya>Tencere ve tava;Yemek takımı;Cam ürünler;Küçük ev aletleri;Çeyiz paketi
Hırdavat,Nalbur@magaza@usta>Vida ve bağlantı;El aletleri;Elektrik malzemesi;Tesisat malzemesi;Boya ve fırça
Boya bayi@magaza@insaat>İç cephe boyaları;Dış cephe boyaları;Renk karışımı;Fırça ve rulo;Metraj hesabı
Market,Bakkal@magaza@market>Günlük ürünler;Temel gıda;Temizlik ürünleri;Eve teslim;Veresiye defteri yerine kayıt
Kasap@magaza@market>Dana kıyma:850/kg;Kuzu pirzola:1400/kg;Kuşbaşı:900/kg;Sucuk ve pastırma;Kurban hizmeti
Manav@magaza@market>Mevsim sebzeleri;Mevsim meyveleri;Yeşillik;Eve teslim;Toptan sipariş
Şarküteri@magaza@market>Peynir çeşitleri;Zeytin çeşitleri;Şarküteri ürünleri;Hediye sepeti;Eve teslim
Kuruyemişçi,Baharatçı,Aktar@magaza@market>Kuruyemiş çeşitleri;Baharat;Bitki çayları;Kuru meyve;Kilo ile satış
Tekel bayi@magaza@market>Soğuk içecekler;Atıştırmalık;Sigara ve tütün;Gece açık saatler
Zeytinyağı satışı@magaza@gida>Natürel sızma zeytinyağı:520/kg;5 litre teneke:2400;Zeytin çeşitleri;Kargo
Bal satışı@magaza@gida>Süzme çiçek balı:650/kg;Petek bal:900/kg;Çam balı:750/kg;Kargo
Antikacı@magaza@mobilya>Antika mobilya;Eski saat ve eşya;Ekspertiz görüşmesi;Alım satım;Koleksiyon sorgulama
Müzik aleti@magaza@muzik>Gitar ve yaylılar;Piyano ve klavye;Bağlama;Bakım ve tel değişimi;Ders yönlendirme
Bisikletçi@magaza@magaza>Şehir bisikletleri;Dağ bisikletleri;Bakım:1200;Lastik ve iç lastik;Yedek parça
Av malzemeleri,Kamp malzemeleri@magaza@tur>Çadır ve uyku tulumu;Ocak ve mutfak;Giyim ve ayakkabı;Sırt çantası;Ruhsatlı ürün bilgisi
Gelinlik,Abiye,Damatlık@magaza@etkinlik>Yeni koleksiyon;Kiralama;Kişiye özel dikim;Prova randevusu;Aksesuar
Kozmetik mağazası,Parfümeri@magaza@guzellik>Cilt bakım ürünleri;Makyaj ürünleri;Parfüm;Marka sorgulama;Hediye paketi
Tesettür giyim@magaza>Yeni sezon;Tunik ve elbise;Eşarp ve şal;Beden sorgulama;Rezerve etme
Çocuk giyim,Bebek mağazası@magaza>Yaşa göre kıyafet;Bebek bakım ürünleri;Hediye seti;Beden sorgulama;Rezerve etme
İç giyim@magaza>İç giyim;Pijama;Çorap;Beden önerisi;Rezerve etme
Gümüşçü@magaza@kuyumcu>Gümüş kolye;Yüzük ve bileklik;Set takılar;Kişiye özel isim kolye;Takı onarımı
E-ticaret,Online butik,Instagram mağazası,Pazaryeri satıcısı,Dropshipping@eticaret>Yeni ürünler;Kargo takibi;Kolay iade;Kapıda ödeme;Çoklu kanal stok
El yapımı ürün@eticaret@uretim>El yapımı koleksiyon;Kişiye özel sipariş;Hediye paketi;Kargo takibi
Takı tasarımı@eticaret@kuyumcu>Tasarım takılar;Kişiye özel kolye;Hediye kutusu;Toptan sipariş;Kargo takibi
Doğal kozmetik@eticaret@guzellik>Doğal sabun;Cilt bakım yağları;Şampuan;Set ürünler;Kargo takibi
Organik ürün@eticaret@gida>Organik bakliyat;Zeytinyağı ve bal;Kuru gıda;Sertifika bilgisi;Kargo takibi
Kahve satışı@eticaret@kafe>Taze çekirdek:520;Filtre kahve:420;Espresso harmanı:560;Abonelik;Kargo takibi
Yöresel ürün@eticaret@gida>Yöresel peynir;Pekmez ve reçel;Kuru gıda;Sipariş kolisi;Kargo takibi
Dijital ürün@yaratici@yazilim>Dijital ürün mağazası;Otomatik teslim;Lisans anahtarı;Fatura ve abonelik;Destek
Mali müşavir@danisman@mali>Aylık defter ve beyanname;Şirket kuruluşu;Bordro ve SGK;e-Dönüşüm;Teşvik danışmanlığı
Muhasebe bürosu@danisman@mali>Ön muhasebe;Beyanname hazırlığı;Bordro;e-Fatura kurulumu;Aylık rapor
Avukat,Hukuk bürosu@danisman@hukuk>Ön görüşme;Aile hukuku;İş hukuku;Ceza hukuku;Gayrimenkul hukuku
Noter@danisman@hukuk>Vekâletname;Araç satış işlemi;Evrak onayı;Yeminli tercüme onayı;Randevu ve evrak bilgisi
Arabulucu@danisman@hukuk>Arabuluculuk başvurusu;İş uyuşmazlıkları;Ticari uyuşmazlıklar;Kira uyuşmazlıkları;Anlaşma tutanağı
Sigorta acentesi@danisman@ofis>Trafik sigortası;Kasko;Konut sigortası;Sağlık sigortası;Hasar takibi
Danışmanlık@danisman@ofis>İlk görüşme;Durum analizi;Yol haritası;Aylık takip;Eğitim
İnsan kaynakları@danisman@ofis>İşe alım;Ücret ve özlük dosyası;Performans sistemi;Eğitim planı;Dış kaynak İK
Tercüme bürosu@danisman@ofis>Yeminli tercüme:450/sayfa;Noter onaylı tercüme:650/sayfa;Teknik tercüme:550/sayfa;Apostil takibi
Patent ve marka@danisman@hukuk>Marka araştırması:1500;Marka tescili;Patent başvurusu;Tasarım tescili;İzleme hizmeti
Gümrük müşaviri@danisman@nakliyat>İthalat beyannamesi;İhracat beyannamesi;Gümrük danışmanlığı;Belge kontrolü;Antrepo takibi
İhracat danışmanı@danisman@nakliyat>Pazar araştırması;Devlet destekleri;Belge süreci;Alıcı bulma;Fuar hazırlığı
Yatırım danışmanı@danisman@mali>Yatırım profili görüşmesi;Portföy değerlendirmesi;Risk raporu;Yetki belgesi bilgisi
Emlak hukuku@danisman@hukuk>Ön görüşme;Tapu davaları;Kira uyuşmazlıkları;Kat karşılığı sözleşme;Ortaklığın giderilmesi
Vize danışmanlığı@danisman@ofis>Evrak listesi;Schengen başvuru takibi;Randevu desteği;Çalışma vizesi bilgisi;Form hazırlığı
Reklam ajansı@yaratici@ofis>Marka stratejisi;Sosyal medya yönetimi;Reklam yönetimi;Tasarım işleri;Aylık rapor
Matbaa@yaratici@uretim>Kartvizit:1500;Broşür:3500;Afiş:300/adet;Ambalaj baskı;Kurumsal evrak
Fotoğrafçı@yaratici@fotograf>Düğün çekimi:30000;Ürün çekimi:800/adet;Vesikalık:300;Aile çekimi:6000;Kurumsal çekim
Video prodüksiyon@yaratici@fotograf>Tanıtım filmi;Reels paketi;Drone çekimi:8000;Kurgu ve renk;Etkinlik çekimi
Grafik tasarım@yaratici@yazilim>Logo tasarımı:6500;Kurumsal kimlik;Sosyal medya şablonu:4500;Ambalaj tasarımı;Sunum tasarımı
Yazılım firması@yaratici@yazilim>Web uygulaması;Mobil uygulama;Otomasyon;Entegrasyon;Bakım ve destek
Bilişim@yaratici@yazilim>Ağ kurulumu;Sunucu ve yedekleme;Siber güvenlik kontrolü;Aylık bakım;Yerinde destek
Güvenlik şirketi@danisman@ofis>Özel güvenlik görevlisi;Etkinlik güvenliği;Kamera izleme;Alarm takibi;Risk analizi
Kargo şubesi@nakliyat>Gönderi kabul;Kargo takibi;Şubeden teslim;Kurumsal gönderi;Fiyat sorgulama
Dershane,Etüt merkezi@egitim>LGS programı;YKS programı;Etüt;Deneme sınavları;Veli bilgilendirme
Özel ders@egitim>Matematik:900/ders;Fizik:900/ders;İngilizce:850/ders;Online ders:700/ders;Seviye görüşmesi
Dil kursu@egitim>Genel İngilizce:6500/ay;Konuşma kulübü:2500/ay;IELTS hazırlık:8000/ay;Almanca:6000/ay;Seviye tespiti
Müzik kursu@egitim@muzik>Piyano:4800/ay;Gitar:4200/ay;Keman:4800/ay;Şan:5000/ay;Tanışma dersi
Dans okulu@egitim@spor>Salsa:3200/ay;Bale:3400/ay;Hip hop:3000/ay;Düğün dansı:4500;Tanışma dersi
Resim kursu@egitim@muzik>Çocuk resim:2800/ay;Yetişkin resim:3200/ay;Karakalem:3000/ay;Güzel sanatlar hazırlık:5500/ay
Kodlama kursu,Robotik kodlama@egitim@yazilim>Blok kodlama:3800/ay;Python:4500/ay;Robotik set:6000;Yaz kampı;Tanışma dersi
Anaokulu,Kreş@egitim>Tanışma ziyareti;Yarım gün program;Tam gün program;Beslenme menüsü;Servis
Özel okul@egitim>Kayıt görüşmesi;Okul gezisi;Burs bilgisi;Yabancı dil programı;Servis
Yüzme kursu@egitim@spor>Çocuk grup dersi:3200/ay;Yetişkin grup dersi:3600/ay;Özel ders:1000/ders;Seviye tespiti
Satranç kulübü@egitim>Başlangıç grubu:2200/ay;Turnuva hazırlığı:2800/ay;Özel ders:800/ders;Turnuva takvimi
Mesleki kurs@egitim>Belgeli meslek programı;Muhasebe kursu;Aşçılık kursu;Kuaförlük kursu;Sertifika bilgisi
Rehberlik merkezi@egitim>Rehberlik görüşmesi;Tercih danışmanlığı;Sınav kaygısı çalışması;Veli görüşmesi
Online eğitim@egitim@yazilim>Canlı dersler;Kayıtlı ders arşivi;Deneme sınavı;Sertifika;Kurumsal eğitim
Yoga eğitimi,Yoga stüdyosu@spor>Grup yoga:2800/ay;Özel ders:1200/ders;Eğitmenlik programı;Hamile yogası:3000/ay
Matematik kursu@egitim>LGS matematik:3200/ay;YKS matematik:3600/ay;Birebir ders:900/ders;Seviye tespiti
Spor salonu,Fitness@spor>Aylık üyelik:2400;3 aylık üyelik:6300;Kişisel antrenör:1100/ders;Grup dersi;Soyunma ve duş
Pilates stüdyosu@spor>Mat pilates:3000/ay;Aletli pilates:6500/ay;Özel ders:1400/ders;Hamile pilatesi:3200/ay
Crossfit@spor>Aylık üyelik:3600;Başlangıç programı:2500;Kişisel koçluk:1200/ders;Yarışma hazırlığı
Kişisel antrenör@spor>Ön değerlendirme;Birebir antrenman:1200/ders;Online program:3500/ay;Beslenme yönlendirmesi
Dövüş sanatları@spor>Çocuk grubu:2200/ay;Yetişkin grubu:2600/ay;Özel ders:1000/ders;Kuşak sınavı
Boks salonu@spor>Grup boks:2600/ay;Özel ders:1100/ders;Kondisyon programı:2200/ay;Ekipman
Tenis kulübü@spor@saha>Kort kiralama:600/saat;Çocuk tenis okulu:3500/ay;Özel ders:1300/ders;Üyelik
Halı saha@spor@saha>Saat kiralama:1800/saat;Hafta sonu kiralama:2200/saat;Lig organizasyonu;Abonelik
Yüzme havuzu@spor>Tek giriş:300;Aylık üyelik:2600;Çocuk kursu:3200/ay;Özel ders:1000/ders
Binicilik@spor@saha>Başlangıç dersi:1800/ders;Çocuk binicilik:1600/ders;At bakım programı;Doğa binişi:2200
Golf@spor@saha>Başlangıç dersi:2500/ders;Saha kullanımı:3500;Üyelik;Ekipman kiralama
Dans stüdyosu@spor>Salsa:3200/ay;Bale:3400/ay;Düğün dansı:4500;Özel ders:1200/ders
Basketbol okulu,Futbol okulu@spor@saha>Yaş grubu antrenmanı:2500/ay;Kaleci ya da pota çalışması:1200/ders;Kamp programı;Deneme antrenmanı
Nakliyat,Evden eve nakliyat@nakliyat>2+1 ev taşıma:18000;3+1 ev taşıma:25000;Asansörlü taşıma:4500;Paketleme hizmeti:3500;Şehirler arası taşıma
Ofis taşıma@nakliyat>Ofis taşıma;Bilişim ekipmanı taşıma;Hafta sonu taşıma;Paketleme;Kurulum desteği
Parça eşya taşıma@nakliyat>Tek parça eşya:2500;Beyaz eşya taşıma:3000;Koli taşıma:400/koli;Şehir içi aynı gün
Depolama@nakliyat>Eşya depolama:4000/ay;Paketleme;Taşıma;Sigorta bilgisi;Aylık raporlama
Kurye@nakliyat>Moto kurye:350;Aynı gün teslim;Evrak gönderimi;Kurumsal abonelik
Lojistik,Yük taşıma@nakliyat>Parsiyel yük;Tam kamyon;Depolama;Araç takibi;Kurumsal sevkiyat
Asansörlü taşıma@nakliyat>Dış cephe asansör:4500;Ev eşyası taşıma;Kat yüksekliği keşfi;Saatlik kiralama:2500/saat
Vinç kiralama,Forklift kiralama@nakliyat@insaat>Saatlik kiralama:3500/saat;Günlük kiralama:18000/gün;Operatörlü hizmet;Şantiye keşfi
Soğuk zincir@nakliyat>Frigorifik araç;Sıcaklık kaydı;Gıda sevkiyatı;İlaç sevkiyatı;Kurumsal sözleşme
Temizlik şirketi@temizlik>Ofis temizliği;Ev temizliği:3200;İnşaat sonrası temizlik;Cam silme;Aylık sözleşme
Ev temizliği@temizlik>2+1 ev temizliği:2600;3+1 ev temizliği:3200;Boş ev temizliği:3800;Haftalık plan;Koltuk yıkama:1600
Ofis temizliği@temizlik>Günlük ofis temizliği;Haftalık plan;Halı yıkama:70/m²;Cam silme;Aylık sözleşme
Koltuk yıkama@temizlik>3+2+1 takım:2200;Köşe koltuk:2600;Yatak yıkama:1200;Araç koltuğu:1500
Cam silme@temizlik>Daire camları:1400;Dış cephe cam:80/m²;Mağaza vitrini;Aylık plan
İnşaat sonrası temizlik@temizlik>Daire kaba temizlik:90/m²;İnce temizlik:60/m²;Moloz alımı;Cam ve fayans
Dezenfeksiyon@temizlik>Ev dezenfeksiyonu:2200;İş yeri dezenfeksiyonu;Klima hattı temizliği;Belgeli uygulama
Bahçe bakımı@temizlik@tarim>Çim biçme:1400;Ağaç budama:1800;Sulama bakımı;Aylık bahçe planı:3500/ay
Havuz bakımı@temizlik@otel>Aylık bakım:3500/ay;Su analizi:800;Kimyasal dengeleme;Filtre temizliği:1400
Çamaşırhane@dukkan@temizlik>Yıkama ve kurutma:180/kg;Ütü:40/adet;Otel ve restoran sözleşmesi;Servisle alma
Ütü hizmeti@dukkan@temizlik>Gömlek ütüsü:60/adet;Kilo ile ütü:120/kg;Perde ütüsü;Servisle alma
Yat temizliği@temizlik@tur>Yat iç temizliği;Güverte yıkama;Sezon açılış temizliği;Marina içi hizmet
Fırın@gida@pastane>Günlük ekmek;Köy ekmeği;Simit ve poğaça;Toplu sipariş;Servis
Simitçi,Unlu mamuller@gida@pastane>Simit:25;Poğaça:30;Açma:30;Toplu sipariş;Sabah servisi
Toptan gıda@gida@market>Temel gıda listesi;Koli fiyatları;Restoran ve otel tedariği;Haftalık sevkiyat;Vadeli hesap
Su bayi@gida@market>19 litrelik damacana:90;Küçük pet su koli:220;Abonelik;Sebil montajı;Eve teslim
Tüp bayi@gida@market>12 kg mutfak tüpü:900;Küçük tüp:400;Eve teslim;Dedektör montajı
Süt ürünleri,Peynirci@gida>Köy peyniri:420/kg;Tulum peyniri:520/kg;Süt ve yoğurt;Tereyağı:900/kg;Eve teslim
Et ürünleri,Tavukçu@gida@market>Bütün tavuk:190/kg;Tavuk göğsü:310/kg;Kıyma:850/kg;Sucuk;Toptan sipariş
Balıkçı@gida@market>Günün balığı:550/kg;Temizleme ve fileto;Levrek ve çipura;Meze çeşitleri;Sipariş
Yumurta satışı@gida>Gezen tavuk yumurtası:180/koli;30'lu viyol;Abonelik;Toptan
Organik pazar@gida@market>Organik sebze;Organik meyve;Sertifikalı ürünler;Eve teslim;Haftalık kutu
Çiftlik@gida@tarim>Süt ve peynir;Köy yumurtası;Çiftlik gezisi;Haftalık kutu;Mevsim ürünleri
Sera@gida@tarim>Sezon domatesi;Biber ve salatalık;Toptan satış;Fide;Kasa fiyatı
Fidancı@gida@tarim>Meyve fidanı:180/adet;Süs bitkileri;Bahçe çiçekleri;Dikim hizmeti;Yerinde teslim
Tarım ilaçları,Yem bayi@gida@tarim>Tohum ve gübre;Zirai ilaç;Hayvan yemi;Reçeteli ürün bilgisi;Köye teslim
Arıcı@gida@gida>Süzme bal:650/kg;Petek bal:900/kg;Polen;Arı sütü;Kargo
Zeytin işleme@gida@gida>Zeytin sıkımı;Sızma zeytinyağı:520/kg;Sofralık zeytin;Toptan satış;Fabrika gezisi
Şarap evi@gida@gida>Bağ gezisi;Tadım programı;Bağ ürünleri;Yerinde satış bilgisi
Kurutulmuş meyve,Lokum ve şekerleme@gida@pastane>Kuru meyve:540/kg;Lokum:420/kg;Hediye kutusu;Toptan;Kargo
Düğün salonu,Kır düğünü@etkinlik>Düğün paketi:1100/kişi;Nişan paketi:750/kişi;Kına gecesi:650/kişi;Salon gezisi;Tarih sorgulama
Organizasyon firması@etkinlik>Düğün organizasyonu;Nişan ve söz;Açılış organizasyonu;Şirket etkinliği;Süsleme
Doğum günü organizasyonu@etkinlik>Temalı doğum günü:9000;Animatör:3500;Pasta ve ikram:500/kişi;Evde süsleme:4500
Nişan organizasyonu@etkinlik>Nişan süsleme:12000;Söz tepsisi:2500;Masa düzeni:400/kişi;Fotoğraf köşesi:3500
DJ@etkinlik@muzik>Düğün DJ performansı:18000;Şirket etkinliği:15000;Doğum günü:9000;Ses sistemi:7000
Orkestra@etkinlik@muzik>Düğün orkestrası:40000;Akustik ekip:18000;Fasıl ekibi:25000;Ses sistemi:7000
Ses ışık sistemi@etkinlik@muzik>Ses sistemi kiralama:7000;Işık paketi:8000;LED ekran:15000;Teknik ekip
Çadır kiralama,Masa sandalye kiralama@etkinlik>Çadır kiralama:90/m²;Masa ve sandalye:220/kişi;Kurulum ve söküm;Şehir içi taşıma
Balon süsleme@etkinlik>Balon takı:4500;Doğum günü seti:3500;Açılış süslemesi:6500;Yerinde kurulum
Davetiye@etkinlik@uretim>Baskılı davetiye:45/adet;Dijital davetiye:1800;Nikâh şekeri:60/adet;Tasarım
Gelin arabası@etkinlik@galeri>Araç kiralama:7500;Süsleme:2500;Şoförlü hizmet;Fotoğraf turu
Fotoğraf stüdyosu@yaratici@fotograf>Vesikalık:300;Aile çekimi:6000;Stüdyo kiralama:1500/saat;Ürün çekimi:800/adet
Toplantı salonu,Konferans salonu@etkinlik@ofis>Saatlik salon kiralama:2500/saat;Tam gün paket:18000;Projeksiyon ve ses;Kahve molası:220/kişi
Kaçış oyunu@eglence>Oyun seansı:550/kişi;Grup oyunu;Şirket etkinliği;Doğum günü paketi
Oyun salonu@eglence>Oyun jetonu:15/adet;Saatlik kart:250/saat;Parti paketi:900/kişi;Çocuk alanı
Bowling@eglence>Tek oyun:300/kişi;Kulvar kiralama:1200/saat;Parti paketi;Şirket turnuvası
Sinema@eglence>Bilet:220;Gösterim saatleri;Salon kiralama;Sınıf gösterimi
Lunapark@eglence@cocuk>Tek biniş:120;Günlük bilet:550;Aile paketi:1800;Doğum günü
Çocuk oyun alanı@eglence@cocuk>Saatlik giriş:220/saat;Doğum günü paketi:650/kişi;Güvenli oyun alanı;Kafe alanı
Atölye@uretim>Numune;Küçük seri üretim;Özel sipariş;Ölçüye göre imalat
Üretim tesisi@uretim>Seri üretim;Fason üretim;Kalite kontrol;Sevkiyat planı;Tesis gezisi
Tekstil atölyesi,Konfeksiyon@uretim>Kesim ve dikim;Numune;Fason üretim;Baskı ve nakış;Paketleme
Mobilya üretimi@uretim@mobilya>Ölçüye özel üretim;Ofis mobilyası;Mutfak ve dolap;Otel projeleri;Montaj
Metal işleme,CNC işleme@uretim>CNC torna;CNC freze;Lazer kesim;Kaynak;Yüzey işlem
3D baskı@uretim@yazilim>Prototip baskı:6/gram;Küçük seri;Tasarım desteği;Reçine baskı;Son işlem
Plastik enjeksiyon@uretim>Kalıp tasarımı;Seri üretim;Numune;Renk ayarı;Paketleme
Ambalaj@uretim>Karton kutu;Oluklu koli;Etiket;Baskılı poşet;Toptan sipariş
Gıda üretimi@uretim@gida>Fason gıda üretimi;Özel etiket;Numune;Analiz takibi;Toptan sevkiyat
Kozmetik üretimi@uretim@guzellik>Fason kozmetik;Formül geliştirme;Ambalaj ve etiket;Ürün dosyası takibi;Numune
Kalıpçı@uretim>Plastik kalıp;Sac kalıp;Kalıp tamiri;Teknik çizim;Numune baskı
Lazer kesim@uretim>Sac lazer kesim:25/dakika;Ahşap kesim;Pleksi kesim;Teknik çizim;Toplu sipariş
Tabela üretimi,Reklam tabelası@uretim@magaza>Işıklı tabela;Kutu harf;Araç giydirme;Vinil kesim;Montaj
Promosyon ürünleri@uretim@eticaret>Baskılı kalem:15/adet;Kupa ve termos;Tişört baskı;Ajanda;Toplu teslim
Cam işleme@uretim>Isıcam üretimi;Temperli cam;Kumlama;Ölçüye kesim
Mermer işleme@uretim@insaat>Mutfak tezgâhı:6500/metre;Basamak;Banyo mermeri;Yerinde ölçü;Montaj
Seramik atölyesi@uretim>El yapımı seramik;Tornada seramik dersi:1200/ders;Kişiye özel sipariş;Toplu hediye
Deri atölyesi@uretim>El yapımı çanta;Cüzdan ve kemer;Kişiye özel üretim;Deri onarımı`;
