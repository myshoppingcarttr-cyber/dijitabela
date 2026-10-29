/* Alanya Arsa Ofisi · premium örnek site (Dijitabela, 27 Eki 2026)
   Veri + 4 dil (TR/EN/RU/DE) + portföy, favori, karşılaştırma, asistan, formlar, hesaplayıcı, panel maketi.
   Dışarıya veri GÖNDERİLMEZ: formlar ve asistan yalnız bu sayfada çalışır. WhatsApp bağlantıları firmanın kendi hattına gider. */
(function () {
  "use strict";
  var WA = "905321552911", KUR = 50, DILLER = ["tr", "en", "ru", "de"];
  var YEREL = { tr: "tr-TR", en: "en-GB", ru: "ru-RU", de: "de-DE" };

  /* ---------- Sözlük: anahtar → [TR, EN, RU, DE] ---------- */
  var S = {
    nav_portfoy: ["Portföy", "Properties", "Объекты", "Immobilien"],
    nav_konum: ["Konum analizi", "Location", "Локация", "Lage"],
    nav_deger: ["Değerleme", "Valuation", "Оценка", "Bewertung"],
    nav_hesap: ["Hesapla", "Calculators", "Калькуляторы", "Rechner"],
    nav_rehber: ["Tapu rehberi", "Title deed guide", "Как купить", "Kaufratgeber"],
    nav_iletisim: ["İletişim", "Contact", "Контакты", "Kontakt"],
    fav: ["Favoriler", "Favourites", "Избранное", "Favoriten"],
    hero_ust: ["Alanya · Arsa · Konut · Yatırım", "Alanya · Land · Homes · Investment", "Алания · Участки · Жильё · Инвестиции", "Alanya · Grundstücke · Wohnungen · Investment"],
    hero_h1: ["Alanya'da doğru arsa, <em>temiz tapu.</em>", "The right plot in Alanya, <em>a clean title deed.</em>", "Верный участок в Алании, <em>чистое тапу.</em>", "Das richtige Grundstück in Alanya, <em>sauberes Grundbuch.</em>"],
    hero_p: ["Saray Mahallesi'ndeki ofisimizden Mahmutlar'dan Kargıcak'a arsa, daire ve yatırım arayanlara yerinde danışmanlık. İmar, tapu ve ödeme planını en baştan konuşuruz.",
      "From our office in Saray, we advise buyers looking for land, apartments and investments from Mahmutlar to Kargıcak. Zoning, title deed and payment plan are discussed from day one.",
      "Из нашего офиса в районе Сарай помогаем с выбором участков, квартир и инвестиций — от Махмутлара до Каргыджака. Зонирование, тапу и план оплаты обсуждаем с самого начала.",
      "Von unserem Büro in Saray aus beraten wir Käufer von Grundstücken, Wohnungen und Investments – von Mahmutlar bis Kargıcak. Bebauungsplan, Grundbuch und Zahlungsplan klären wir von Anfang an."],
    f_bolge: ["Bölge", "Area", "Район", "Gegend"],
    f_tur: ["Tür", "Type", "Тип", "Art"],
    ara_butce: ["Bütçe", "Budget", "Бюджет", "Budget"],
    tum_bolge: ["Tüm bölgeler", "All areas", "Все районы", "Alle Gegenden"],
    tum: ["Tümü", "All", "Все", "Alle"],
    arsa: ["Arsa", "Land", "Участок", "Grundstück"],
    daire: ["Daire", "Apartment", "Квартира", "Wohnung"],
    tarla: ["Tarla", "Farmland", "С/х земля", "Ackerland"],
    villa: ["Villa", "Villa", "Вилла", "Villa"],
    butce_hepsi: ["Fark etmez", "Any", "Любой", "Beliebig"],
    ara_btn: ["İlanları göster", "Show listings", "Показать объекты", "Angebote anzeigen"],
    hero_wa: ["WhatsApp'tan hızlı bilgi", "Quick info on WhatsApp", "Быстрый ответ в WhatsApp", "Schnelle Info per WhatsApp"],
    acik: ["Şu an açık", "Open now", "Сейчас открыто", "Jetzt geöffnet"],
    kapali: ["Şu an kapalı · WhatsApp'tan yazabilirsiniz", "Closed now · message us on WhatsApp", "Сейчас закрыто · пишите в WhatsApp", "Jetzt geschlossen · schreiben Sie uns per WhatsApp"],
    saat_kisa: ["Pzt–Cmt 08:30–18:00", "Mon–Sat 08:30–18:00", "Пн–Сб 08:30–18:00", "Mo–Sa 08:30–18:00"],
    saat_uzun: ["Pazartesi–Cumartesi 08:30–18:00 · Pazar kapalı", "Monday–Saturday 08:30–18:00 · Sunday closed", "Понедельник–суббота 08:30–18:00 · воскресенье выходной", "Montag–Samstag 08:30–18:00 · Sonntag geschlossen"],
    foto_firma: ["Fotoğraf: firma arşivi", "Photo: company archive", "Фото: архив компании", "Foto: Firmenarchiv"],
    ofis_ust: ["Ofisimiz", "Our office", "Наш офис", "Unser Büro"],
    ofis_h: ["Gerçek ofis, gerçek adres. Kahvemiz hazır.", "A real office at a real address. The coffee is on us.", "Настоящий офис по реальному адресу. Кофе за нами.", "Ein echtes Büro an einer echten Adresse. Der Kaffee geht auf uns."],
    ofis_p: ["Saray Mahallesi Gülen Sokak'taki ofisimizde ilanları haritada birlikte inceler, tapu kaydını ve imar durumunu masada gösteririz.",
      "At our office on Gülen Street in Saray, we go through listings on the map together and show you the land registry record and zoning status at the table.",
      "В нашем офисе на улице Гюлен (район Сарай) мы вместе смотрим объекты на карте и прямо за столом показываем выписку из реестра и статус зонирования.",
      "In unserem Büro in der Gülen-Straße (Saray) sehen wir uns die Angebote gemeinsam auf der Karte an und zeigen Ihnen Grundbuchauszug und Bebauungsstatus direkt am Tisch."],
    d1_h: ["Arsa uzmanlığı", "Land expertise", "Специализация на участках", "Grundstücksexpertise"],
    d1_p: ["Alanya ve çevresindeki arsa yatırımlarında imar, yol ve altyapı kontrolüyle destek.", "Support with land investments in and around Alanya, including checks on zoning, road access and utilities.", "Сопровождение инвестиций в землю в Алании и окрестностях: проверка зонирования, подъезда и коммуникаций.", "Begleitung bei Grundstücksinvestments in und um Alanya – inklusive Prüfung von Bebauungsplan, Zufahrt und Erschließung."],
    d2_h: ["Konut ve kiralama", "Homes and rentals", "Жильё и аренда", "Wohnen und Vermietung"],
    d2_p: ["Satılık ve kiralık daire seçenekleri; aidat, site imkânları ve kira potansiyeli açıkça.", "Apartments for sale and rent, with service charges, amenities and rental potential stated clearly.", "Квартиры на продажу и в аренду: прозрачно о взносах, инфраструктуре комплекса и доходе от аренды.", "Wohnungen zum Kauf und zur Miete – Hausgeld, Ausstattung der Anlage und Mietpotenzial klar dargestellt."],
    d3_h: ["Şeffaf süreç", "Transparent process", "Прозрачный процесс", "Transparenter Ablauf"],
    d3_p: ["Seçimden tapu devrine her adımda bilgilendirme; yabancı alıcılara kendi dillerinde.", "Updates at every step from choosing a property to the title transfer – for foreign buyers in their own language.", "Информируем на каждом этапе — от выбора до переоформления тапу, иностранным покупателям на их языке.", "Information bei jedem Schritt bis zur Grundbuchumschreibung – für ausländische Käufer in ihrer Sprache."],
    d4_h: ["Takas ve tek tapu", "Trade-ins and sole titles", "Обмен и единоличное тапу", "Tausch und Alleineigentum"],
    d4_p: ["Takasa açık ilanları ve hisseli olmayan tek tapulu arsaları ayrı işaretleriz.", "We clearly mark listings open to trade-ins and plots with a sole title (no shared ownership).", "Отдельно отмечаем объекты, где возможен обмен, и участки с единоличным тапу (без долей).", "Wir kennzeichnen Angebote, bei denen ein Tausch möglich ist, und Grundstücke im Alleineigentum (ohne Miteigentumsanteile)."],
    ofis_yol: ["Yol tarifi al", "Get directions", "Проложить маршрут", "Route planen"],
    foto_gercek: ["Bu bölümdeki fotoğraflar ofisimizin gerçek fotoğraflarıdır.", "The photos in this section are real photos of our office.", "Фотографии в этом разделе — реальные снимки нашего офиса.", "Die Fotos in diesem Abschnitt sind echte Aufnahmen unseres Büros."],
    p_ust: ["Portföy", "Properties", "Объекты", "Immobilien"],
    p_h: ["Arsa ve daireler, imar ve tapu bilgisiyle.", "Land and apartments, with zoning and title details.", "Участки и квартиры — со сведениями о зонировании и тапу.", "Grundstücke und Wohnungen – mit Bebauungs- und Grundbuchangaben."],
    p_p: ["Bölgeye, bütçeye ve imar durumuna göre süzün; beğendiklerinizi kaydedin, üç ilanı yan yana karşılaştırın.", "Filter by area, budget and zoning; save your favourites and compare up to three listings side by side.", "Фильтруйте по району, бюджету и зонированию; сохраняйте понравившиеся и сравнивайте до трёх объектов рядом.", "Filtern Sie nach Gegend, Budget und Bebauung; speichern Sie Favoriten und vergleichen Sie bis zu drei Angebote nebeneinander."],
    f_m2: ["Alan (m²)", "Area (m²)", "Площадь (м²)", "Fläche (m²)"],
    f_fiyat: ["Fiyat (TL)", "Price (TL)", "Цена (TL)", "Preis (TL)"],
    f_imar: ["İmar durumu", "Zoning status", "Зонирование", "Bebauungsstatus"],
    f_min: ["En az", "Min", "От", "Min."],
    f_max: ["En çok", "Max", "До", "Max."],
    f_sirala: ["Sırala", "Sort", "Сортировка", "Sortieren"],
    s_oner: ["Önerilen", "Recommended", "Рекомендуемые", "Empfohlen"],
    s_ucuz: ["Fiyat (artan)", "Price (low to high)", "Цена (по возрастанию)", "Preis (aufsteigend)"],
    s_pahali: ["Fiyat (azalan)", "Price (high to low)", "Цена (по убыванию)", "Preis (absteigend)"],
    s_m2: ["Alan (büyükten küçüğe)", "Area (largest first)", "Площадь (по убыванию)", "Fläche (größte zuerst)"],
    f_fav: ["Yalnız favoriler", "Favourites only", "Только избранное", "Nur Favoriten"],
    f_takas: ["Takasa açık", "Trade-in possible", "Возможен обмен", "Tausch möglich"],
    f_tek: ["Tek tapu", "Sole title", "Единоличное тапу", "Alleineigentum"],
    f_temizle: ["Filtreleri temizle", "Clear filters", "Сбросить фильтры", "Filter zurücksetzen"],
    bos: ["Bu ölçütlere uyan ilan yok. Filtreleri genişletin ya da WhatsApp'tan sorun; portföy dışındaki ilanlara da bakarız.", "No listings match these criteria. Widen the filters or ask us on WhatsApp – we also check properties outside our portfolio.", "Нет объектов по этим критериям. Расширьте фильтры или напишите в WhatsApp — подберём и вне каталога.", "Keine Angebote für diese Kriterien. Erweitern Sie die Filter oder fragen Sie per WhatsApp – wir suchen auch außerhalb unseres Portfolios."],
    ornek_ilan: ["Örnek ilan", "Sample listing", "Пример объявления", "Beispielangebot"],
    gorsel_not: ["Kendi ilan görselleriniz buraya gelecek", "Your own listing photos will go here", "Здесь будут ваши фото объектов", "Hier erscheinen Ihre eigenen Objektfotos"],
    p_not: ["Tüm ilanlar sunum için hazırlanmış örnek ilanlardır; fiyatlar temsilîdir. Euro karşılıkları örnek kurla (1 € ≈ 50 TL) hesaplanır.", "All listings are samples prepared for this presentation; prices are indicative. Euro amounts use an example rate (€1 ≈ 50 TL).", "Все объявления — примеры для презентации; цены ориентировочные. Суммы в евро рассчитаны по примерному курсу (1 € ≈ 50 TL).", "Alle Angebote sind Beispiele für diese Präsentation; Preise sind Richtwerte. Euro-Beträge zum Beispielkurs (1 € ≈ 50 TL)."],
    detay: ["İncele", "View details", "Подробнее", "Details"],
    wa_ilan: ["Bu ilan için WhatsApp'tan bilgi al", "Ask about this listing on WhatsApp", "Узнать об этом объекте в WhatsApp", "Zu diesem Angebot per WhatsApp anfragen"],
    fav_ekle: ["Favorilere ekle", "Add to favourites", "В избранное", "Zu Favoriten hinzufügen"],
    fav_cikar: ["Favorilerden çıkar", "Remove from favourites", "Убрать из избранного", "Aus Favoriten entfernen"],
    karsilastir: ["Karşılaştır", "Compare", "Сравнить", "Vergleichen"],
    kars_bar: ["Karşılaştırma", "Comparison", "Сравнение", "Vergleich"],
    kars_gor: ["Yan yana gör", "Side by side", "Сравнить", "Nebeneinander"],
    kars_max: ["En fazla 3 ilan karşılaştırabilirsiniz", "You can compare up to 3 listings", "Можно сравнить не более 3 объектов", "Sie können bis zu 3 Angebote vergleichen"],
    kars_az: ["Karşılaştırmak için en az 2 ilan seçin", "Select at least 2 listings to compare", "Выберите минимум 2 объекта", "Wählen Sie mindestens 2 Angebote aus"],
    kars_bas: ["İlan karşılaştırma", "Listing comparison", "Сравнение объектов", "Angebotsvergleich"],
    kars_iyi: ["Yeşil: bu satırdaki en avantajlı değer", "Green: the most favourable value in this row", "Зелёным — самое выгодное значение в строке", "Grün: der günstigste Wert in dieser Zeile"],
    kapat: ["Kapat", "Close", "Закрыть", "Schließen"],
    im_konut: ["Konut imarlı", "Residential zoning", "Под жилую застройку", "Wohnbauland"],
    im_villa: ["Villa imarlı", "Zoned for villas", "Под строительство вилл", "Bauland für Villen"],
    im_tarla: ["İmarsız (tarla)", "Unzoned (farmland)", "Без зонирования (с/х земля)", "Nicht ausgewiesen (Ackerland)"],
    im_kat: ["Kat mülkiyetli tapu", "Full condominium title", "Тапу на квартиру (кат мюлькиети)", "Wohnungseigentum (Kat Mülkiyeti)"],
    im_irtifak: ["Kat irtifaklı tapu", "Construction servitude title", "Тапу на стадии строительства (кат иртифакы)", "Bau-Grundbuch (Kat İrtifakı)"],
    rz_takas: ["Takas olur", "Trade-in possible", "Возможен обмен", "Tausch möglich"],
    rz_tek: ["Tek tapu", "Sole title", "Единоличное тапу", "Alleineigentum"],
    rz_yeni: ["Yeni proje", "New build", "Новостройка", "Neubau"],
    d_fiyat: ["Fiyat", "Price", "Цена", "Preis"],
    d_m2: ["Alan", "Area", "Площадь", "Fläche"],
    d_m2fiyat: ["m² fiyatı", "Price per m²", "Цена за м²", "Preis pro m²"],
    d_oda: ["Oda", "Rooms", "Комнаты", "Zimmer"],
    d_kat: ["Kat", "Floor", "Этаж", "Etage"],
    d_yil: ["Yapım yılı", "Year built", "Год постройки", "Baujahr"],
    d_tur: ["Tür", "Type", "Тип", "Art"],
    d_bolge: ["Bölge", "Area", "Район", "Gegend"],
    d_imar: ["İmar / tapu", "Zoning / title", "Зонирование / тапу", "Bebauung / Grundbuch"],
    d_emsal: ["Emsal (KAKS)", "Floor area ratio (KAKS)", "Коэффициент застройки (KAKS)", "Geschossflächenzahl (KAKS)"],
    d_ada: ["Ada / parsel", "Block / parcel", "Квартал / участок", "Flur / Flurstück"],
    d_ada_v: ["Örnek ilanda gösterilmez", "Not shown for sample listings", "Не указывается в примере", "Bei Beispielangeboten nicht angegeben"],
    d_takas: ["Takas", "Trade-in", "Обмен", "Tausch"],
    d_tek: ["Tapu türü", "Title type", "Тип тапу", "Eigentumsform"],
    d_tek_v: ["Tek tapu (hissesiz)", "Sole title (no shares)", "Единоличное (без долей)", "Alleineigentum (ohne Anteile)"],
    d_hisse_v: ["Hisseli değil · kat mülkiyeti", "Not shared · condominium", "Без долей · квартира в собственности", "Keine Anteile · Wohnungseigentum"],
    evet: ["Evet", "Yes", "Да", "Ja"],
    hayir: ["Hayır", "No", "Нет", "Nein"],
    d_ozellik: ["Özellikler", "Features", "Особенности", "Ausstattung"],
    d_odeme: ["Ödeme planı", "Payment plan", "План оплаты", "Zahlungsplan"],
    d_pesinat: ["Peşinat", "Down payment", "Первый взнос", "Anzahlung"],
    d_taksit: ["Aylık taksit", "Monthly instalment", "Ежемесячный платёж", "Monatsrate"],
    d_vade: ["Vade", "Term", "Срок", "Laufzeit"],
    d_tapuda: ["Tapuda kalan", "Balance at title transfer", "Остаток при оформлении тапу", "Rest bei Umschreibung"],
    d_pesin: ["Peşin ödeme", "Full payment", "Полная оплата", "Komplettzahlung"],
    d_pesin_n: ["Tapu devrinde", "At title transfer", "При оформлении тапу", "Bei Umschreibung"],
    d_odeme_not: ["Örnek plandır; nihai koşullar satıcıyla yazılı olarak belirlenir.", "Sample plan; final terms are agreed in writing with the seller.", "Пример; окончательные условия фиксируются письменно с продавцом.", "Beispielplan; die endgültigen Konditionen werden schriftlich mit dem Verkäufer vereinbart."],
    d_tapu_not: ["Tapu ve imar bilgileri örnektir. Gerçek ilanlarda belediye imar durum belgesi ve güncel tapu kaydıyla doğrulanır.", "Title and zoning details are illustrative. For real listings they are verified with the municipal zoning certificate and a current land registry record.", "Данные о тапу и зонировании приведены для примера. В реальных объявлениях они подтверждаются справкой муниципалитета и актуальной выпиской из реестра.", "Grundbuch- und Bebauungsangaben sind beispielhaft. Bei echten Angeboten werden sie durch die Bebauungsauskunft der Gemeinde und einen aktuellen Grundbuchauszug belegt."],
    d_konum: ["Konum, mesafeler ve 3D görünüm", "Location, distances and 3D view", "Расположение, расстояния и 3D-вид", "Lage, Entfernungen und 3D-Ansicht"],
    d_randevu: ["Yer gösterme iste", "Request a viewing", "Записаться на просмотр", "Besichtigung anfragen"],
    ay: ["ay", "months", "мес.", "Monate"],
    yil: ["yıl", "years", "лет", "Jahre"],
    oz_havuz: ["Havuz", "Pool", "Бассейн", "Pool"],
    oz_otopark: ["Kapalı otopark", "Covered parking", "Крытый паркинг", "Tiefgarage"],
    oz_asansor: ["Asansör", "Lift", "Лифт", "Aufzug"],
    oz_guvenlik: ["7/24 güvenlik", "24/7 security", "Охрана 24/7", "24/7-Sicherheitsdienst"],
    oz_denizm: ["Deniz manzarası", "Sea view", "Вид на море", "Meerblick"],
    oz_golm: ["Göl manzarası", "Lake view", "Вид на озеро", "Seeblick"],
    oz_kalem: ["Kale manzarası", "Castle view", "Вид на крепость", "Burgblick"],
    oz_fitness: ["Fitness salonu", "Gym", "Тренажёрный зал", "Fitnessraum"],
    oz_esyali: ["Eşyalı", "Furnished", "С мебелью", "Möbliert"],
    oz_teras: ["Çatı terası", "Roof terrace", "Терраса на крыше", "Dachterrasse"],
    oz_bahce: ["Bahçe", "Garden", "Сад", "Garten"],
    oz_yol: ["Asfalt yola cephe", "Paved road frontage", "Выход на асфальтированную дорогу", "Lage an asphaltierter Straße"],
    oz_elektrik: ["Elektrik ve su yakın", "Power and water nearby", "Электричество и вода рядом", "Strom und Wasser in der Nähe"],
    oz_zeytin: ["Zeytin ağaçları", "Olive trees", "Оливковые деревья", "Olivenbäume"],
    oz_meyve: ["Meyve ağaçları", "Fruit trees", "Фруктовые деревья", "Obstbäume"],
    oz_su: ["Sulama suyu", "Irrigation water", "Вода для полива", "Bewässerungswasser"],
    k_ust: ["Konum analizi", "Location analysis", "Анализ локации", "Lageanalyse"],
    k_h: ["Denize, merkeze, havalimanına kaç dakika?", "How many minutes to the sea, the centre and the airport?", "Сколько минут до моря, центра и аэропорта?", "Wie viele Minuten zum Meer, ins Zentrum und zum Flughafen?"],
    k_p: ["Her ilanda temsili parsel sınırı, denize ve havalimanlarına mesafe okları, konum skoru ve 3D kuşbakışı görünüm. Alıcı ofise gelmeden konumu anlar.", "Every listing comes with an indicative plot boundary, distance arrows to the sea and the airports, a location score and a 3D bird's-eye view. Buyers understand the location before they visit.", "У каждого объекта — условные границы участка, стрелки расстояний до моря и аэропортов, оценка локации и 3D-вид с высоты. Покупатель понимает расположение ещё до визита.", "Jedes Angebot zeigt eine symbolische Grundstücksgrenze, Entfernungspfeile zum Meer und zu den Flughäfen, einen Lage-Score und eine 3D-Vogelperspektive. Käufer verstehen die Lage schon vor dem Besuch."],
    k_f1h: ["Mesafe okları", "Distance arrows", "Стрелки расстояний", "Entfernungspfeile"],
    k_f1p: ["Deniz, merkez, GZP ve AYT havalimanı, hastane, okul, AVM.", "Sea, centre, GZP and AYT airports, hospital, school, shopping mall.", "Море, центр, аэропорты GZP и AYT, больница, школа, ТЦ.", "Meer, Zentrum, Flughäfen GZP und AYT, Krankenhaus, Schule, Einkaufszentrum."],
    k_f2h: ["Konum skoru", "Location score", "Оценка локации", "Lage-Score"],
    k_f2p: ["0–100 arası; formülü açık, her bileşen ayrı gösterilir.", "0–100 with a transparent formula; every component is shown.", "От 0 до 100, формула открыта, каждый компонент показан отдельно.", "0–100 mit offener Formel; jeder Bestandteil wird einzeln gezeigt."],
    k_f3h: ["3D kuşbakışı", "3D bird's-eye view", "3D-вид с высоты", "3D-Vogelperspektive"],
    k_f3p: ["Uydu ve arazi kabartmasıyla eğik açı, otomatik tur.", "Tilted satellite view with terrain relief and an automatic fly-around.", "Наклонный спутниковый вид с рельефом и автоматическим облётом.", "Geneigte Satellitenansicht mit Geländerelief und automatischem Rundflug."],
    k_sec: ["İlan seçin", "Choose a listing", "Выберите объект", "Angebot wählen"],
    a_ust: ["7/24 çok dilli asistan", "24/7 multilingual assistant", "Многоязычный ассистент 24/7", "Mehrsprachiger Assistent 24/7"],
    a_h: ["Gece yarısı gelen soru cevapsız kalmaz.", "A question at midnight never goes unanswered.", "Вопрос, заданный в полночь, не останется без ответа.", "Auch die Frage um Mitternacht bleibt nicht unbeantwortet."],
    a_p: ["Asistan fiyat, tapu, oturum izni, kredi ve yer gösterme sorularını alıcının kendi dilinde yanıtlar; konuşmayı özetleyip WhatsApp'ta danışmana devreder.", "The assistant answers questions about prices, title deeds, residence permits, mortgages and viewings in the buyer's own language, then hands the conversation over to an adviser on WhatsApp.", "Ассистент отвечает на вопросы о ценах, тапу, ВНЖ, кредитах и просмотрах на языке покупателя и передаёт разговор консультанту в WhatsApp.", "Der Assistent beantwortet Fragen zu Preisen, Grundbuch, Aufenthaltserlaubnis, Finanzierung und Besichtigungen in der Sprache des Käufers und übergibt das Gespräch per WhatsApp an einen Berater."],
    a_l1: ["Soru hangi dilde yazılırsa o dilde yanıt verir.", "It replies in whatever language the question is written in.", "Отвечает на том языке, на котором задан вопрос.", "Er antwortet in der Sprache, in der die Frage gestellt wird."],
    a_l2: ["Bilmediği konuda uydurmaz; danışmana yönlendirir.", "It never makes things up – if unsure, it refers to an adviser.", "Не выдумывает: если не знает ответа, направляет к консультанту.", "Er erfindet nichts – im Zweifel verweist er an einen Berater."],
    a_l3: ["Her konuşma yönetici panelinde kaynağı ve diliyle görünür.", "Every conversation appears in the admin panel with its source and language.", "Каждый диалог виден в панели управления с источником и языком.", "Jedes Gespräch erscheint im Verwaltungspanel mit Quelle und Sprache."],
    a_dene: ["Deneyin: aşağıdaki sorulardan birine dokunun ya da kendi sorunuzu yazın.", "Try it: tap one of the questions below or type your own.", "Попробуйте: нажмите на вопрос ниже или напишите свой.", "Probieren Sie es aus: Tippen Sie auf eine Frage oder schreiben Sie Ihre eigene."],
    a_balon: ["Sorunuz mu var?", "Got a question?", "Есть вопрос?", "Eine Frage?"],
    a_balon2: ["Asistan · 7/24 · 4 dil", "Assistant · 24/7 · 4 languages", "Ассистент · 24/7 · 4 языка", "Assistent · 24/7 · 4 Sprachen"],
    a_ad: ["Alanya Arsa Ofisi asistanı", "Alanya Arsa Ofisi assistant", "Ассистент Alanya Arsa Ofisi", "Assistent von Alanya Arsa Ofisi"],
    a_durum: ["Çevrimiçi · demo", "Online · demo", "Онлайн · демо", "Online · Demo"],
    a_yaz: ["Sorunuzu yazın…", "Type your question…", "Напишите вопрос…", "Ihre Frage…"],
    a_gonder: ["Gönder", "Send", "Отправить", "Senden"],
    a_temizle: ["Yeniden başlat", "Restart", "Начать заново", "Neu starten"],
    c_fiyat: ["Fiyatlar", "Prices", "Цены", "Preise"],
    c_tapu: ["Tapu süreci", "Title deed", "Оформление тапу", "Grundbuch"],
    c_oturum: ["Oturum izni", "Residence permit", "ВНЖ", "Aufenthaltserlaubnis"],
    c_kredi: ["Kredi", "Mortgage", "Ипотека", "Finanzierung"],
    c_randevu: ["Yer gösterme", "Viewing", "Просмотр", "Besichtigung"],
    c_wa: ["WhatsApp'tan devam et", "Continue on WhatsApp", "Продолжить в WhatsApp", "Weiter per WhatsApp"],
    c_portfoy: ["İlanlara git", "See listings", "К объектам", "Zu den Angeboten"],
    c_rehber: ["Tapu rehberini aç", "Open the guide", "Открыть инструкцию", "Ratgeber öffnen"],
    c_hesap: ["Kredi hesaplayıcı", "Mortgage calculator", "Кредитный калькулятор", "Kreditrechner"],
    c_form: ["Randevu formu", "Viewing form", "Форма записи", "Besichtigungsformular"],
    c_bolge: ["Bu bölgedeki ilanlar", "Listings in this area", "Объекты в этом районе", "Angebote in dieser Gegend"],
    v_ust: ["Arsanızı değerleyelim", "Free valuation", "Оценим ваш участок", "Kostenlose Bewertung"],
    v_h: ["Arsanız bugün kaç eder?", "What is your land worth today?", "Сколько сегодня стоит ваш участок?", "Was ist Ihr Grundstück heute wert?"],
    v_p: ["Mahalle, alan ve imar bilgisini yazın; bölgedeki emsal satışlara ve imar durumuna bakarak size bir fiyat aralığı ve satış süresi öngörüsü hazırlayalım.", "Tell us the area, size and zoning – we'll prepare a price range and an estimated time to sell, based on comparable sales and the zoning status.", "Укажите район, площадь и зонирование — по сопоставимым продажам и статусу участка подготовим диапазон цены и прогноз срока продажи.", "Nennen Sie Gegend, Fläche und Bebauungsstatus – anhand vergleichbarer Verkäufe erstellen wir eine Preisspanne und eine Einschätzung der Verkaufsdauer."],
    v_a1: ["Formu doldurun (ada/parsel biliyorsanız ekleyin).", "Fill in the form (add the block/parcel number if you know it).", "Заполните форму (добавьте номер квартала/участка, если знаете).", "Füllen Sie das Formular aus (mit Flur/Flurstück, falls bekannt)."],
    v_a2: ["Tapu ve imar kaydını kontrol ederiz.", "We check the land registry and zoning records.", "Проверяем реестр и данные о зонировании.", "Wir prüfen Grundbuch und Bebauungsunterlagen."],
    v_a3: ["Emsal satışlarla fiyat aralığını çıkarırız.", "We derive a price range from comparable sales.", "Определяем диапазон цены по сопоставимым сделкам.", "Wir ermitteln eine Preisspanne anhand vergleichbarer Verkäufe."],
    v_a4: ["Seçtiğiniz dilde, yazılı olarak iletiriz.", "We send it to you in writing, in your chosen language.", "Отправляем письменно на выбранном вами языке.", "Sie erhalten das Ergebnis schriftlich in Ihrer Sprache."],
    v_tur: ["Taşınmaz türü", "Property type", "Тип недвижимости", "Objektart"],
    v_ada_ph: ["isteğe bağlı", "optional", "необязательно", "optional"],
    v_gonder: ["Değerleme iste", "Request a valuation", "Запросить оценку", "Bewertung anfordern"],
    v_diger: ["Diğer mahalle", "Other area", "Другой район", "Andere Gegend"],
    ad: ["Ad soyad", "Full name", "Имя и фамилия", "Vor- und Nachname"],
    tel: ["Telefon / WhatsApp", "Phone / WhatsApp", "Телефон / WhatsApp", "Telefon / WhatsApp"],
    tercih_dil: ["Yanıt dili", "Reply language", "Язык ответа", "Antwortsprache"],
    kvkk: ["Bilgilerimin yalnız bu talep için işlenmesini kabul ediyorum (KVKK).", "I agree that my details are processed only for this request.", "Я согласен(на) на обработку моих данных только для этого запроса.", "Ich bin einverstanden, dass meine Angaben nur für diese Anfrage verarbeitet werden."],
    demo_not: ["Demo: form hiçbir yere gönderilmez, yalnız bu sayfadaki panel maketine eklenir.", "Demo: the form is not sent anywhere – it only appears in the admin panel mock-up on this page.", "Демо: форма никуда не отправляется, а только появляется в макете панели на этой странице.", "Demo: Das Formular wird nirgendwohin gesendet, es erscheint nur im Panel-Entwurf auf dieser Seite."],
    e_ad: ["Lütfen adınızı yazın.", "Please enter your name.", "Пожалуйста, укажите имя.", "Bitte geben Sie Ihren Namen ein."],
    e_tel: ["Lütfen geçerli bir telefon numarası yazın.", "Please enter a valid phone number.", "Пожалуйста, укажите корректный номер телефона.", "Bitte geben Sie eine gültige Telefonnummer ein."],
    e_kvkk: ["Devam etmek için onay kutusunu işaretleyin.", "Please tick the consent box to continue.", "Отметьте согласие, чтобы продолжить.", "Bitte bestätigen Sie die Einwilligung."],
    e_tarih: ["Lütfen bugünden sonraki bir tarih seçin.", "Please choose a date after today.", "Выберите дату после сегодняшнего дня.", "Bitte wählen Sie ein Datum nach heute."],
    e_pazar: ["Pazar günü ofisimiz kapalı; lütfen başka bir gün seçin.", "Our office is closed on Sundays – please choose another day.", "В воскресенье офис закрыт — выберите другой день.", "Sonntags ist unser Büro geschlossen – bitte wählen Sie einen anderen Tag."],
    t_alindi: ["Talebiniz alındı", "Request received", "Заявка принята", "Anfrage erhalten"],
    t_tesekkur: ["Teşekkürler", "Thank you", "Спасибо", "Vielen Dank"],
    t_deger_p: ["Danışmanımız 24 saat içinde seçtiğiniz dilde size dönecek.", "Our adviser will get back to you within 24 hours in your chosen language.", "Консультант свяжется с вами в течение 24 часов на выбранном языке.", "Unser Berater meldet sich innerhalb von 24 Stunden in Ihrer Sprache."],
    t_rnd_p: ["Randevunuzu teyit etmek için sizi arayacağız. Görüşmek üzere!", "We'll call you to confirm the viewing. See you soon!", "Мы позвоним, чтобы подтвердить просмотр. До встречи!", "Wir rufen Sie zur Bestätigung an. Bis bald!"],
    t_no: ["Talep no", "Request no.", "№ заявки", "Anfrage-Nr."],
    t_demo: ["Bu bir demodur: bilgileriniz hiçbir yere gönderilmedi, yalnız aşağıdaki panel maketine eklendi.", "This is a demo: your details were not sent anywhere, they were only added to the panel mock-up below.", "Это демо: данные никуда не отправлены, они только добавлены в макет панели ниже.", "Dies ist eine Demo: Ihre Angaben wurden nirgendwohin gesendet, nur in den Panel-Entwurf unten eingetragen."],
    t_panel: ["Panelde gör", "See it in the panel", "Посмотреть в панели", "Im Panel ansehen"],
    t_yeni: ["Yeni talep", "New request", "Новая заявка", "Neue Anfrage"],
    h_ust: ["Yatırım hesaplayıcı", "Investment calculator", "Инвестиционный калькулятор", "Investitionsrechner"],
    h_h: ["Kira getirisini ve kredi taksidini şimdi görün.", "See your rental yield and mortgage payment now.", "Узнайте доходность аренды и платёж по кредиту.", "Mietrendite und Kreditrate sofort sehen."],
    h_p: ["Rakamları kaydırın, sonuç anında değişsin.", "Move the sliders and the result updates instantly.", "Двигайте ползунки — результат меняется сразу.", "Schieben Sie die Regler – das Ergebnis ändert sich sofort."],
    h_kira: ["Kira getirisi", "Rental yield", "Доходность аренды", "Mietrendite"],
    h_kredi: ["Kredi ödemesi", "Mortgage payment", "Платёж по кредиту", "Kreditrate"],
    h_alim: ["Alım fiyatı", "Purchase price", "Цена покупки", "Kaufpreis"],
    h_kiray: ["Aylık kira", "Monthly rent", "Аренда в месяц", "Monatsmiete"],
    h_dol: ["Yıllık doluluk", "Annual occupancy", "Загрузка за год", "Jährliche Auslastung"],
    h_gider: ["Yıllık giderler (aidat, vergi, sigorta)", "Annual costs (fees, tax, insurance)", "Расходы в год (взносы, налог, страховка)", "Jährliche Kosten (Hausgeld, Steuer, Versicherung)"],
    h_brut: ["Brüt getiri", "Gross yield", "Валовая доходность", "Bruttorendite"],
    h_net: ["Net getiri", "Net yield", "Чистая доходность", "Nettorendite"],
    h_yillik: ["Yıllık net gelir", "Annual net income", "Чистый доход в год", "Jährlicher Nettoertrag"],
    h_amorti: ["Geri dönüş süresi", "Payback period", "Срок окупаемости", "Amortisationszeit"],
    h_not1: ["Tahmini hesaptır; vergi durumunuz ve kira piyasası değişkenlik gösterir.", "This is an estimate; your tax situation and the rental market may vary.", "Расчёт ориентировочный; налоги и рынок аренды могут меняться.", "Dies ist eine Schätzung; Steuersituation und Mietmarkt können variieren."],
    h_tutar: ["Kredi tutarı", "Loan amount", "Сумма кредита", "Kreditbetrag"],
    h_faiz: ["Aylık faiz oranı (örnek)", "Monthly interest rate (example)", "Ежемесячная ставка (пример)", "Monatlicher Zinssatz (Beispiel)"],
    h_vade: ["Vade", "Term", "Срок", "Laufzeit"],
    h_taksit: ["Aylık taksit", "Monthly payment", "Ежемесячный платёж", "Monatsrate"],
    h_toplam: ["Toplam geri ödeme", "Total repayment", "Всего к выплате", "Gesamtrückzahlung"],
    h_tfaiz: ["Toplam faiz", "Total interest", "Всего процентов", "Zinsen gesamt"],
    h_not2: ["Örnek faizle hesaplanır; banka masrafları ve sigortalar dahil değildir. Koşullar bankaya ve alıcının durumuna göre değişir.", "Calculated with an example rate; bank fees and insurance are not included. Terms vary by bank and by the buyer's situation.", "Рассчитано по примерной ставке; комиссии банка и страховки не включены. Условия зависят от банка и заёмщика.", "Berechnet mit Beispielzins; Bankgebühren und Versicherungen sind nicht enthalten. Konditionen variieren je nach Bank und Käufer."],
    r_ust: ["Yabancılar için tapu rehberi", "Title deed guide for foreigners", "Покупка недвижимости иностранцами", "Grundbuch-Ratgeber für Ausländer"],
    r_h: ["Türkiye'de tapu almak: adım adım.", "Buying property in Turkey: step by step.", "Покупка недвижимости в Турции: шаг за шагом.", "Immobilienkauf in der Türkei: Schritt für Schritt."],
    r_p: ["Yabancı uyruklu alıcıların sık sorduğu süreç, sade bir dille. Her adımda tercüman ve danışman desteği veririz.", "The process foreign buyers ask about most, in plain language. We provide interpreter and adviser support at every step.", "Процесс, о котором чаще всего спрашивают иностранцы, простым языком. На каждом этапе — поддержка переводчика и консультанта.", "Der Ablauf, nach dem ausländische Käufer am häufigsten fragen – einfach erklärt. Bei jedem Schritt unterstützen wir mit Dolmetscher und Berater."],
    r_uyari: ["Bu rehber genel bilgilendirmedir. Harç, değerleme ve ikamet koşulları zaman zaman değişir; işlem öncesinde güncel mevzuatı tapu müdürlüğü ve ilgili kurumlarla birlikte teyit ederiz.", "This guide is general information. Fees, valuation and residence rules change from time to time; before any transaction we confirm the current regulations with the land registry and the relevant authorities.", "Это общая информация. Сборы, требования к оценке и правила ВНЖ периодически меняются; перед сделкой мы сверяем актуальные нормы с кадастровым управлением и профильными ведомствами.", "Dieser Ratgeber dient der allgemeinen Information. Gebühren, Bewertungs- und Aufenthaltsregeln ändern sich von Zeit zu Zeit; vor jedem Kauf prüfen wir die aktuelle Rechtslage mit dem Grundbuchamt und den zuständigen Behörden."],
    y_ust: ["Yer gösterme randevusu", "Book a viewing", "Запись на просмотр", "Besichtigungstermin"],
    y_h: ["Arsayı yerinde görün. Gününü siz seçin.", "See the property in person. You pick the day.", "Посмотрите объект на месте. День выбираете вы.", "Sehen Sie das Objekt vor Ort. Den Tag wählen Sie."],
    y_p: ["İlanı, tarihi, saati ve konuşmak istediğiniz dili seçin. Danışmanımız randevuyu teyit için sizi arar; gerekirse ofisten birlikte yola çıkarız.", "Choose the listing, date, time and the language you'd like to speak. Our adviser will call to confirm; if you like, we set off together from the office.", "Выберите объект, дату, время и язык общения. Консультант позвонит для подтверждения; при желании поедем вместе из офиса.", "Wählen Sie Angebot, Datum, Uhrzeit und Gesprächssprache. Unser Berater ruft zur Bestätigung an; auf Wunsch fahren wir gemeinsam vom Büro los."],
    y_a1: ["Pazartesi–Cumartesi, 08:30–18:00 arası.", "Monday to Saturday, 08:30–18:00.", "С понедельника по субботу, 08:30–18:00.", "Montag bis Samstag, 08:30–18:00 Uhr."],
    y_a2: ["Yabancı alıcılara İngilizce, Rusça veya Almanca destek.", "Support in English, Russian or German for foreign buyers.", "Поддержка на английском, русском или немецком.", "Betreuung auf Englisch, Russisch oder Deutsch."],
    y_a3: ["Tapu ve imar belgeleri yer gösterimde yanımızda.", "We bring the title and zoning documents to the viewing.", "Документы тапу и зонирования берём с собой на просмотр.", "Grundbuch- und Bebauungsunterlagen bringen wir zur Besichtigung mit."],
    y_ilan: ["İlan", "Listing", "Объект", "Angebot"],
    y_karar: ["Henüz karar vermedim", "Not decided yet", "Пока не выбрал(а)", "Noch nicht entschieden"],
    y_tarih: ["Tarih", "Date", "Дата", "Datum"],
    y_saat: ["Saat", "Time", "Время", "Uhrzeit"],
    y_dil: ["Görüşme dili", "Language", "Язык общения", "Gesprächssprache"],
    y_gonder: ["Randevu talep et", "Request a viewing", "Записаться", "Termin anfragen"],
    g_ust: ["Google ve Instagram", "Google and Instagram", "Google и Instagram", "Google und Instagram"],
    g_h: ["Memnun kaldıysanız iki satır yeter.", "Happy with us? Two lines are enough.", "Понравилось? Достаточно пары строк.", "Zufrieden? Zwei Zeilen genügen."],
    g_puan: ["Google'daki işletme puanımız", "Our business rating on Google", "Наш рейтинг в Google", "Unsere Bewertung bei Google"],
    g_deger: ["Google'da değerlendirin", "Review us on Google", "Оставить отзыв в Google", "Bei Google bewerten"],
    g_qr_h: ["Telefonla okutun, yorum ekranı açılsın.", "Scan with your phone to open our Google listing.", "Отсканируйте телефоном — откроется наша страница в Google.", "Mit dem Handy scannen – unser Google-Eintrag öffnet sich."],
    g_qr_p: ["Bu kod ofis masasında, kartvizitte ve tapu dosyasında durur. Yorum bağlantısı her müşteriye gönderilir.", "This code sits on the office desk, on business cards and in the title deed folder. The review link is sent to every customer.", "Этот код стоит на столе в офисе, на визитках и в папке с документами. Ссылку на отзыв получает каждый клиент.", "Dieser Code liegt auf dem Bürotisch, auf Visitenkarten und in der Grundbuchmappe. Den Bewertungslink erhält jeder Kunde."],
    ornek_gor: ["Örnek görünüm", "Sample view", "Пример", "Beispielansicht"],
    g_ornek_h: ["Google yorumlarınız burada otomatik listelenir", "Your Google reviews are listed here automatically", "Здесь автоматически отображаются ваши отзывы из Google", "Hier erscheinen Ihre Google-Bewertungen automatisch"],
    g_ornek_p: ["Yayında gerçek Google yorumları ve işletme yanıtları gösterilir; bu alanda uydurma yorum yer almaz.", "On the live site, real Google reviews and your replies are shown here; no invented reviews.", "На рабочем сайте здесь показываются настоящие отзывы и ответы компании; никаких выдуманных отзывов.", "Auf der Live-Seite stehen hier echte Google-Bewertungen und Ihre Antworten – keine erfundenen Bewertungen."],
    ig_p: ["Instagram'da arsa turları ve yeni ilanlar", "Plot tours and new listings on Instagram", "Обзоры участков и новые объекты в Instagram", "Grundstücksrundgänge und neue Angebote auf Instagram"],
    ig_takip: ["Profili aç", "Open profile", "Открыть профиль", "Profil öffnen"],
    ig_not: ["Örnek görünüm: yayında hesabınızın son Reels videoları burada görünür.", "Sample view: on the live site, your account's latest Reels appear here.", "Пример: на рабочем сайте здесь появятся последние Reels вашего аккаунта.", "Beispielansicht: Auf der Live-Seite erscheinen hier die neuesten Reels Ihres Kontos."],
    ig_1: ["Ofisten: bu haftanın yeni ilanları", "From the office: new listings this week", "Из офиса: новые объекты недели", "Aus dem Büro: neue Angebote der Woche"],
    ig_2: ["Göl manzaralı hobi bahçeleri", "Hobby gardens with lake views", "Садовые участки с видом на озеро", "Freizeitgärten mit Seeblick"],
    ig_3: ["Havuzlu sitede 60 saniyelik tur", "60-second tour of a complex with pool", "60-секундный обзор комплекса с бассейном", "60-Sekunden-Rundgang durch eine Anlage mit Pool"],
    ig_4: ["Tapu günü nasıl geçer?", "What happens on title deed day?", "Как проходит день оформления тапу?", "Wie läuft der Grundbuchtermin ab?"],
    pn_ust: ["Yönetici paneli önizleme", "Admin panel preview", "Превью панели управления", "Vorschau Verwaltungspanel"],
    pn_h: ["Hangi talep nereden, hangi dilde geldi? Tek ekranda.", "Which enquiry came from where, in which language? On one screen.", "Откуда и на каком языке пришла заявка? На одном экране.", "Welche Anfrage kam woher, in welcher Sprache? Auf einem Bildschirm."],
    pn_p: ["Asistan, WhatsApp, formlar ve Instagram'dan gelen her talep kaynağı ve diliyle panele düşer. Bu sayfadaki formları doldurursanız satırınız aşağıda canlı belirir.", "Every enquiry from the assistant, WhatsApp, forms and Instagram lands in the panel with its source and language. Fill in a form on this page and your row appears below live.", "Каждая заявка из ассистента, WhatsApp, форм и Instagram попадает в панель с источником и языком. Заполните форму на этой странице — и ваша строка появится ниже.", "Jede Anfrage aus Assistent, WhatsApp, Formularen und Instagram landet mit Quelle und Sprache im Panel. Füllen Sie ein Formular auf dieser Seite aus – Ihre Zeile erscheint unten live."],
    maket: ["Maket · örnek veri", "Mock-up · sample data", "Макет · пример данных", "Entwurf · Beispieldaten"],
    pn_m1: ["Talepler", "Enquiries", "Заявки", "Anfragen"],
    pn_m2: ["İlanlar", "Listings", "Объекты", "Angebote"],
    pn_m3: ["Randevular", "Viewings", "Просмотры", "Besichtigungen"],
    pn_m4: ["Değerlemeler", "Valuations", "Оценки", "Bewertungen"],
    pn_m5: ["Raporlar", "Reports", "Отчёты", "Berichte"],
    pn_k1: ["Bu hafta talep", "Enquiries this week", "Заявок за неделю", "Anfragen diese Woche"],
    pn_k1s: ["örnek", "sample", "пример", "Beispiel"],
    pn_k2: ["Yabancı alıcı", "Foreign buyers", "Иностранцы", "Ausländische Käufer"],
    pn_k3: ["Randevu", "Viewings", "Просмотры", "Besichtigungen"],
    pn_k4: ["İlk yanıt (asistan)", "First reply (assistant)", "Первый ответ (ассистент)", "Erste Antwort (Assistent)"],
    pn_kaynak: ["Kaynağa göre", "By source", "По источнику", "Nach Quelle"],
    pn_dil: ["Dile göre", "By language", "По языку", "Nach Sprache"],
    pn_son: ["Son talepler", "Latest enquiries", "Последние заявки", "Neueste Anfragen"],
    pn_t1: ["Zaman", "Time", "Время", "Zeit"],
    pn_t2: ["Kişi", "Contact", "Клиент", "Kontakt"],
    pn_t3: ["Kaynak", "Source", "Источник", "Quelle"],
    pn_t4: ["Dil", "Language", "Язык", "Sprache"],
    pn_t5: ["İlgi", "Interest", "Интерес", "Interesse"],
    pn_t6: ["Durum", "Status", "Статус", "Status"],
    ks_wa: ["WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp"],
    ks_yz: ["YZ asistan", "AI assistant", "ИИ-ассистент", "KI-Assistent"],
    ks_form: ["Değerleme formu", "Valuation form", "Форма оценки", "Bewertungsformular"],
    ks_rnd: ["Randevu formu", "Viewing form", "Запись на просмотр", "Besichtigungsformular"],
    ks_ig: ["Instagram", "Instagram", "Instagram", "Instagram"],
    du_y: ["Yeni", "New", "Новая", "Neu"],
    du_a: ["Yanıtlandı", "Answered", "Отвечено", "Beantwortet"],
    du_t: ["Randevu verildi", "Viewing booked", "Просмотр назначен", "Termin vereinbart"],
    zm_simdi: ["Şimdi", "Just now", "Только что", "Gerade eben"],
    zm_bugun: ["Bugün", "Today", "Сегодня", "Heute"],
    zm_dun: ["Dün", "Yesterday", "Вчера", "Gestern"],
    il_deger: ["Değerleme", "Valuation", "Оценка", "Bewertung"],
    il_oturum: ["Oturum izni", "Residence permit", "ВНЖ", "Aufenthalt"],
    il_genel: ["Genel bilgi", "General info", "Общий вопрос", "Allgemein"],
    i_ust: ["İletişim", "Contact", "Контакты", "Kontakt"],
    i_h: ["Saray Mahallesi, Gülen Sokak. Bekleriz.", "Saray, Gülen Street. We look forward to seeing you.", "Сарай, улица Гюлен. Ждём вас.", "Saray, Gülen-Straße. Wir freuen uns auf Sie."],
    i_adres: ["Adres", "Address", "Адрес", "Adresse"],
    i_saat: ["Saatler", "Hours", "Часы работы", "Öffnungszeiten"],
    i_tel: ["Telefon", "Phone", "Телефон", "Telefon"],
    i_harita: ["Harita", "Map", "Карта", "Karte"],
    i_sokak: ["360° sokak görünümü", "360° street view", "Панорама улицы 360°", "360°-Straßenansicht"],
    kardes: ["Kardeş markamız", "Sister brand", "Наш второй бренд", "Schwestermarke"],
    dj_ornek: ["İlanlar, panel verileri ve asistan yanıtları örnektir; formlar hiçbir yere gönderilmez.", "Listings, panel data and assistant replies are samples; forms are not sent anywhere.", "Объявления, данные панели и ответы ассистента — примеры; формы никуда не отправляются.", "Angebote, Panel-Daten und Assistenten-Antworten sind Beispiele; Formulare werden nirgendwohin gesendet."],
    dj_diger: ["Diğer tasarım seçenekleri", "Other design options", "Другие варианты дизайна", "Weitere Designvarianten"],
    wa_ipucu: ["WhatsApp'tan yazın · 0532 155 29 11", "Message us on WhatsApp", "Напишите нам в WhatsApp", "Schreiben Sie uns per WhatsApp"],
    wa_genel: ["Merhaba, web sitenizden yazıyorum. Alanya'da arsa ve daire seçenekleri hakkında bilgi almak istiyorum.", "Hello, I'm writing from your website. I'd like some information about land and apartments in Alanya.", "Здравствуйте! Пишу с вашего сайта. Хочу узнать о вариантах участков и квартир в Алании.", "Guten Tag, ich schreibe Ihnen über Ihre Website. Ich hätte gern Informationen zu Grundstücken und Wohnungen in Alanya."],
    wa_ilan_m: ["Merhaba, {no} numaralı “{b}” ilanı hakkında bilgi almak istiyorum.", "Hello, I'd like more information about listing {no}: “{b}”.", "Здравствуйте! Хочу узнать подробнее об объекте {no}: «{b}».", "Guten Tag, ich interessiere mich für das Angebot {no}: „{b}“. Bitte senden Sie mir weitere Informationen."],
    tost_fav: ["Favorilere eklendi", "Added to favourites", "Добавлено в избранное", "Zu Favoriten hinzugefügt"],
    tost_fav0: ["Favorilerden çıkarıldı", "Removed from favourites", "Удалено из избранного", "Aus Favoriten entfernt"],
    tost_favyok: ["Henüz favori ilanınız yok", "You have no favourites yet", "В избранном пока пусто", "Noch keine Favoriten"],
    kt_skor: ["Konum skoru", "Location score", "Оценка локации", "Lage-Score"],
    kt_deniz: ["Denize (kuş uçuşu)", "To the sea (straight line)", "До моря (по прямой)", "Zum Meer (Luftlinie)"],
    kt_gzp: ["GZP havalimanı", "GZP airport", "Аэропорт GZP", "Flughafen GZP"],
    gercek_ilan: ["Gerçek ilan", "Real listing", "Реальный объект", "Echtes Angebot"],
    ofis_bilgi: ["Ofisten bilgi alınız", "Please ask our office", "Уточняйте в офисе", "Bitte im Büro erfragen"],
    d_kat_izin: ["Kat sayısı", "Number of floors", "Этажность", "Geschosszahl"],
    d_deniz: ["Denize uzaklık", "Distance to the sea", "До моря", "Entfernung zum Meer"],
    d_deniz_v: ["Yaklaşık 4 km (ilan bilgisi)", "Approx. 4 km (per the listing)", "Около 4 км (по данным объявления)", "Ca. 4 km (laut Inserat)"],
    d_altyapi: ["Altyapı", "Utilities", "Коммуникации", "Erschließung"],
    d_altyapi_v: ["Yol, su ve elektrik mevcut", "Road, water and electricity available", "Есть дорога, вода и электричество", "Straße, Wasser und Strom vorhanden"],
    d_hafriyat: ["Hafriyat", "Excavation", "Земляные работы", "Erdaushub"],
    d_hafriyat_v: ["Hafriyat masrafı yok", "No excavation costs", "Без затрат на земляные работы", "Keine Aushubkosten"],
    d_tarih: ["İlan tarihi", "Listing date", "Дата объявления", "Inseriert am"],
    d_tek_m: ["Müstakil tapu (tek tapu, hisse yok)", "Sole title deed (no shared ownership)", "Отдельное тапу (без долей)", "Eigene Grundbuchurkunde (keine Anteile)"],
    d_gercek_not: ["İlan bilgileri ofisimizin ilanından alınmıştır. Videodaki konum ve inşaat görselleştirmesi temsilîdir.", "Details are taken from our office's listing. The location and construction visualisation in the video are illustrative.", "Данные взяты из объявления нашего офиса. Расположение и визуализация застройки в видео приведены условно.", "Die Angaben stammen aus dem Inserat unseres Büros. Lage- und Bauvisualisierung im Video sind symbolisch."],
    d_odeme_ofis: ["Ödeme koşulları için ofisten bilgi alınız.", "Please ask our office about payment terms.", "Об условиях оплаты уточняйте в офисе.", "Zu den Zahlungsbedingungen fragen Sie bitte im Büro nach."],
    d_video: ["İlan videosu", "Listing video", "Видео объекта", "Objektvideo"],
    rz_video: ["Video", "Video", "Видео", "Video"],
    oz_fullm: ["Full deniz manzarası", "Full sea view", "Панорамный вид на море", "Voller Meerblick"],
    oz_yolsifir: ["Yola sıfır", "Directly on the road", "Прямо у дороги", "Direkt an der Straße"],
    oz_altyapi: ["Yol, su, elektrik mevcut", "Road, water, electricity available", "Дорога, вода, электричество", "Straße, Wasser, Strom vorhanden"],
    oz_hafriyat: ["Hafriyat masrafı yok", "No excavation costs", "Без затрат на земляные работы", "Keine Aushubkosten"],
    vt_ust: ["Gerçek ilan · video", "Real listing · video", "Реальный объект · видео", "Echtes Angebot · Video"],
    vt_h: ["Her ilana drone + 3D inşaat videosu", "A drone + 3D construction video for every listing", "Видео с дрона и 3D-визуализацией для каждого объекта", "Drohnen- und 3D-Bauvideo für jedes Angebot"],
    vt_p: ["Ofisimizin Mahmutlar'daki 528 m² arsa ilanı için hazırlanan video. Alıcı, arsayı görmeye gelmeden konumu, altyapıyı ve olası yapıyı anlar.", "The video made for our 528 m² plot listing in Mahmutlar. Buyers understand the location, utilities and a possible building before they visit.", "Видео к нашему объявлению об участке 528 м² в Махмутларе. Покупатель понимает расположение, коммуникации и возможную застройку ещё до просмотра.", "Das Video zu unserem 528-m²-Grundstücksangebot in Mahmutlar. Käufer verstehen Lage, Erschließung und mögliche Bebauung schon vor der Besichtigung."],
    vt_1: ["Drone ile konum: arsanın yeri, denize ve merkeze uzaklığı havadan.", "Drone location shots: where the plot is and how far it is from the sea and the centre.", "Съёмка с дрона: где участок и как далеко до моря и центра.", "Drohnenaufnahmen: Lage des Grundstücks, Entfernung zu Meer und Zentrum aus der Luft."],
    vt_2: ["Altyapı tek bakışta: yol, su ve elektrik bilgisi videoda.", "Utilities at a glance: road, water and electricity shown in the video.", "Коммуникации сразу видны: дорога, вода и электричество в ролике.", "Erschließung auf einen Blick: Straße, Wasser und Strom im Video."],
    vt_3: ["Gerçekçi inşaat görselleştirmesi: arsaya neler yapılabileceğini gösterir.", "Realistic construction visualisation: shows what could be built on the plot.", "Реалистичная визуализация застройки: что можно построить на участке.", "Realistische Bauvisualisierung: zeigt, was auf dem Grundstück entstehen könnte."],
    vt_4: ["Sosyal medyaya hazır dikey format: Reels, TikTok ve WhatsApp durumu için.", "Vertical format ready for social media: Reels, TikTok and WhatsApp Status.", "Вертикальный формат для соцсетей: Reels, TikTok и статусы WhatsApp.", "Hochformat für Social Media: Reels, TikTok und WhatsApp-Status."],
    vt_dg: ["Bu ilanı incele", "View this listing", "Открыть объявление", "Dieses Angebot ansehen"],
    vt_not: ["Konum ve inşaat görselleştirmesi temsilîdir.", "Location and construction visualisation are illustrative.", "Расположение и визуализация застройки приведены условно.", "Lage- und Bauvisualisierung sind symbolisch."],
    tl_karsilik: ["≈ {e}", "≈ {e}", "≈ {e}", "≈ {e}"]
  };

  /* ---------- Bölgeler ve imar ---------- */
  var BOLGE = {
    merkez: ["Merkez (Saray)", "Centre (Saray)", "Центр (Сарай)", "Zentrum (Saray)"],
    oba: ["Oba", "Oba", "Оба", "Oba"],
    cikcilli: ["Cikcilli", "Cikcilli", "Джикджилли", "Cikcilli"],
    tosmur: ["Tosmur", "Tosmur", "Тосмур", "Tosmur"],
    kestel: ["Kestel", "Kestel", "Кестель", "Kestel"],
    mahmutlar: ["Mahmutlar", "Mahmutlar", "Махмутлар", "Mahmutlar"],
    kargicak: ["Kargıcak", "Kargıcak", "Каргыджак", "Kargıcak"],
    dim: ["Dim Vadisi", "Dim Valley", "Долина Дим", "Dim-Tal"],
    uzunoz: ["Uzunöz", "Uzunöz", "Узуноз", "Uzunöz"]
  };
  var IMAR = ["konut", "villa", "tarla", "kat", "irtifak"];

  /* ---------- Örnek ilanlar (fiyatlar TL; € = TL / KUR) ----------
     Koordinatlar mahalle düzeyinde YAKLAŞIK; gerçek ilanlarda tapu koordinatı kullanılır. */
  var ILAN = [
    { no: "MAH-528", gercek: true, tur: "arsa", bolge: "mahmutlar", m2: 528, fiyat: 5500000, imar: "", tek: true, takas: true, tarih: "2026-09-03",
      lat: 36.5132, lng: 32.1274, kapak: "video/mahmutlar-528-kapak.jpg", video: "video/mahmutlar-528.mp4", oz: ["fullm", "yolsifir", "altyapi", "hafriyat"],
      b: ["Mahmutlar'da full deniz manzaralı 528 m² arsa", "528 m² plot with full sea view in Mahmutlar", "Участок 528 м² с панорамным видом на море, Махмутлар", "528 m² Grundstück mit vollem Meerblick in Mahmutlar"],
      o: ["Müstakil tapulu (hisse yok), yola sıfır arsa. Yol, su ve elektrik mevcut, hafriyat masrafı yok. Denize yaklaşık 4 km. Takas olur.", "Plot with its own title deed (no shared ownership), directly on the road. Road, water and electricity available; no excavation costs. Approx. 4 km to the sea. Trade-in possible.", "Участок с отдельным тапу (без долей), прямо у дороги. Есть дорога, вода и электричество, затрат на земляные работы нет. До моря около 4 км. Возможен обмен.", "Grundstück mit eigener Grundbuchurkunde (keine Anteile), direkt an der Straße. Straße, Wasser und Strom vorhanden, keine Aushubkosten. Ca. 4 km zum Meer. Tausch möglich."] },
    { no: "AAO-101", tur: "daire", bolge: "mahmutlar", m2: 110, oda: "2+1", kat: "5/9", yil: 2019, fiyat: 8250000, imar: "kat", lat: 36.4925, lng: 32.1005, img: ["stok-k9.jpg", "s1.jpg", "s4.jpg"], oz: ["havuz", "otopark", "asansor", "guvenlik", "fitness", "denizm"], plan: "pesin",
      b: ["Mahmutlar'da denize yakın, havuzlu sitede 2+1", "2-bed flat near the beach in Mahmutlar, complex with pool", "2+1 у моря в Махмутларе, комплекс с бассейном", "2+1 nahe am Strand in Mahmutlar, Anlage mit Pool"],
      o: ["Plaja yürüme mesafesinde, güney cepheli, eşyasız teslim. Site aidatı aylık ödenir; kiraya uygun.", "Walking distance to the beach, south-facing, sold unfurnished. Monthly service charge; well suited for letting.", "В пешей доступности от пляжа, окна на юг, без мебели. Ежемесячный взнос за обслуживание; подходит для сдачи в аренду.", "Strand fußläufig erreichbar, Südausrichtung, unmöbliert. Monatliches Hausgeld; gut vermietbar."] },
    { no: "AAO-102", tur: "daire", bolge: "oba", m2: 180, oda: "3+1", kat: "4–5/5", yil: 2026, fiyat: 14750000, imar: "irtifak", takas: true, yeni: true, lat: 36.5410, lng: 32.0420, img: ["s3.jpg", "s2.jpg", "s1.jpg"], oz: ["havuz", "otopark", "asansor", "guvenlik", "denizm", "teras"], plan: "taksit24",
      b: ["Oba'da yeni projede 3+1 dubleks, çatı terası", "New-build 3-bed duplex in Oba with roof terrace", "Дуплекс 3+1 в новостройке в Обе, терраса на крыше", "Neubau-Maisonette 3+1 in Oba mit Dachterrasse"],
      o: ["Proje aşamasından alım: %30 peşinat, kalanı 24 ay taksit. Teslimde kat mülkiyetine geçilir. Takas teklifleri değerlendirilir.", "Off-plan purchase: 30% down payment, balance over 24 months. Converted to full condominium title on completion. Trade-in offers considered.", "Покупка на этапе строительства: взнос 30%, остаток в рассрочку на 24 месяца. После сдачи — тапу кат мюлькиети. Рассматриваем обмен.", "Kauf in der Bauphase: 30 % Anzahlung, Rest in 24 Monatsraten. Nach Fertigstellung Umschreibung in Wohnungseigentum. Tauschangebote willkommen."] },
    { no: "AAO-103", tur: "arsa", bolge: "kestel", m2: 1250, fiyat: 10500000, imar: "konut", emsal: "0,60", tek: true, lat: 36.5150, lng: 32.0830, oz: ["denizm", "yol", "elektrik"], plan: "arsa50",
      b: ["Kestel'de deniz manzaralı 1.250 m² konut imarlı arsa", "1,250 m² residential plot with sea view in Kestel", "Участок 1 250 м² под жильё с видом на море, Кестель", "1.250 m² Wohnbaugrundstück mit Meerblick in Kestel"],
      o: ["Yamaçta, güneye bakan tek tapulu parsel; asfalt yola cepheli, elektrik ve su hattı yakın. Küçük bir apart ya da iki villa için uygun.", "South-facing hillside plot with a sole title, fronting a paved road, power and water nearby. Suitable for a small apartment block or two villas.", "Участок на южном склоне с единоличным тапу, выход на асфальтированную дорогу, электричество и вода рядом. Подходит для небольшого дома или двух вилл.", "Südhang-Grundstück im Alleineigentum an asphaltierter Straße, Strom und Wasser in der Nähe. Geeignet für ein kleines Apartmenthaus oder zwei Villen."] },
    { no: "AAO-104", tur: "daire", bolge: "cikcilli", m2: 60, oda: "1+1", kat: "2/6", yil: 2022, fiyat: 4950000, imar: "kat", lat: 36.5490, lng: 32.0300, img: ["s4.jpg", "stok-k9.jpg", "s1.jpg"], oz: ["havuz", "fitness", "guvenlik", "esyali"], plan: "pesin",
      b: ["Cikcilli'de eşyalı 1+1, kira getirisine uygun", "Furnished 1-bed flat in Cikcilli, ideal for rental income", "Квартира 1+1 с мебелью в Джикджилли — под сдачу в аренду", "Möblierte 1+1-Wohnung in Cikcilli – ideal zur Vermietung"],
      o: ["Eşyalı teslim; havuz, fitness ve 7/24 güvenlikli site. Uzun dönem kiralamaya hazır; yönetim ve aidat bilgisini ilk görüşmede paylaşırız.", "Sold furnished; complex with pool, gym and 24/7 security. Ready for long-term letting; we share management and fee details at the first meeting.", "Продаётся с мебелью; в комплексе бассейн, тренажёрный зал и охрана 24/7. Готова к долгосрочной аренде; данные об управлении и взносах — на первой встрече.", "Möbliert; Anlage mit Pool, Fitnessraum und 24/7-Sicherheitsdienst. Bereit zur Langzeitvermietung; Infos zu Verwaltung und Hausgeld beim ersten Gespräch."] },
    { no: "AAO-105", tur: "arsa", bolge: "kargicak", m2: 3400, fiyat: 17000000, imar: "villa", emsal: "0,30", tek: true, takas: true, lat: 36.4700, lng: 32.1300, oz: ["denizm", "yol", "elektrik", "zeytin"], plan: "arsa50",
      b: ["Kargıcak'ta panoramik deniz manzaralı 3.400 m² villa arsası", "3,400 m² villa plot with panoramic sea views in Kargıcak", "Участок 3 400 м² под виллы с панорамным видом на море, Каргыджак", "3.400 m² Villengrundstück mit Panorama-Meerblick in Kargıcak"],
      o: ["Zeytin ağaçlı, teraslanabilir eğimli arazi; tek tapu. Villa projesi için ön fizibiliteyi birlikte çıkarabiliriz. Takasa açık.", "Sloping land with olive trees that can be terraced; sole title. We can prepare an initial feasibility study for a villa project together. Open to trade-ins.", "Участок с уклоном и оливковыми деревьями, можно террасировать; единоличное тапу. Предварительный расчёт проекта вилл подготовим вместе. Возможен обмен.", "Hanggrundstück mit Olivenbäumen, terrassierbar; Alleineigentum. Eine erste Machbarkeitsstudie für ein Villenprojekt erstellen wir gemeinsam. Tausch möglich."] },
    { no: "AAO-106", tur: "daire", bolge: "tosmur", m2: 95, oda: "2+1", kat: "3/5", yil: 2017, fiyat: 6750000, imar: "kat", takas: true, lat: 36.5310, lng: 32.0530, img: ["stok-k8.jpg", "s1.jpg", "stok-k9.jpg"], oz: ["havuz", "otopark", "bahce"], plan: "pesin",
      b: ["Tosmur'da Dimçayı'na yakın 2+1, bahçeli site", "2-bed flat in Tosmur near the Dim River, garden complex", "2+1 в Тосмуре рядом с рекой Димчай, комплекс с садом", "2+1 in Tosmur nahe dem Dim-Fluss, Anlage mit Garten"],
      o: ["Sakin bir sokakta, aile için ideal. Okul ve market yürüme mesafesinde. Araç takası konuşulabilir.", "On a quiet street, ideal for families. School and supermarket within walking distance. A car trade-in can be discussed.", "Тихая улица, удобно для семьи. Школа и магазины в пешей доступности. Обсуждаем обмен на автомобиль.", "Ruhige Straße, ideal für Familien. Schule und Supermarkt fußläufig. Ein Autotausch ist verhandelbar."] },
    { no: "AAO-107", tur: "daire", bolge: "merkez", m2: 150, oda: "3+1", kat: "6/8", yil: 2021, fiyat: 16000000, imar: "kat", lat: 36.5500, lng: 31.9870, img: ["s2.jpg", "s1.jpg", "s4.jpg"], oz: ["asansor", "otopark", "kalem", "denizm", "guvenlik"], plan: "pesin",
      b: ["Merkezde, Kleopatra Plajı'na yakın 3+1, kale manzaralı", "3-bed flat in the centre near Cleopatra Beach, castle views", "3+1 в центре у пляжа Клеопатры, вид на крепость", "3+1 im Zentrum nahe dem Kleopatra-Strand, Burgblick"],
      o: ["Çarşıya, sahile ve ofisimize yürüme mesafesinde; geniş balkon, kapalı otopark.", "Walking distance to the shops, the seafront and our office; large balcony, covered parking.", "Пешком до магазинов, набережной и нашего офиса; большой балкон, крытый паркинг.", "Zu Fuß zu Geschäften, Strandpromenade und unserem Büro; großer Balkon, Tiefgarage."] },
    { no: "AAO-108", tur: "arsa", bolge: "oba", m2: 600, fiyat: 7750000, imar: "konut", emsal: "0,60", takas: true, lat: 36.5470, lng: 32.0480, oz: ["yol", "elektrik"], plan: "arsa50",
      b: ["Oba'da yola cepheli 600 m² konut imarlı arsa", "600 m² residential plot with road frontage in Oba", "Участок 600 м² под жильё с выходом на дорогу, Оба", "600 m² Wohnbaugrundstück mit Straßenanbindung in Oba"],
      o: ["Altyapısı tamam bir mahallede, düz parsel. Müteahhitle kat karşılığı ve takas teklifleri değerlendirilir.", "Level plot in a fully serviced neighbourhood. Land-for-flats deals with a developer and trade-ins are considered.", "Ровный участок в районе с готовой инфраструктурой. Рассматриваем обмен на квартиры с застройщиком и другие варианты обмена.", "Ebenes Grundstück in voll erschlossenem Viertel. Bauträger-Tausch gegen Wohnungen und andere Tauschangebote möglich."] },
    { no: "AAO-110", tur: "daire", bolge: "cikcilli", m2: 220, oda: "4+1", kat: "7/7", yil: 2024, fiyat: 19250000, imar: "kat", lat: 36.5520, lng: 32.0250, img: ["s3.jpg", "stok-k9.jpg", "s2.jpg"], oz: ["havuz", "fitness", "guvenlik", "otopark", "teras", "kalem", "denizm"], plan: "taksit12",
      b: ["Cikcilli'de 4+1 çatı dubleksi, kale ve deniz manzaralı", "4-bed penthouse in Cikcilli with castle and sea views", "Пентхаус 4+1 в Джикджилли с видом на крепость и море", "4+1-Penthouse in Cikcilli mit Burg- und Meerblick"],
      o: ["Özel çatı terası ve jakuzi; sitede kapalı ve açık havuz. %30 peşinat ve 12 ay taksit seçeneği.", "Private roof terrace with jacuzzi; indoor and outdoor pools in the complex. Option of 30% down and 12 monthly instalments.", "Собственная терраса с джакузи; в комплексе крытый и открытый бассейны. Возможен взнос 30% и рассрочка на 12 месяцев.", "Eigene Dachterrasse mit Whirlpool; Innen- und Außenpool in der Anlage. Optional 30 % Anzahlung und 12 Monatsraten."] },
    { no: "AAO-111", tur: "arsa", bolge: "dim", m2: 1100, fiyat: 2650000, imar: "tarla", tek: true, hobi: true, lat: 36.5650, lng: 32.1250, oz: ["golm", "meyve", "su", "yol"], plan: "pesin",
      b: ["Dim Vadisi'nde göl manzaralı 1.100 m² hobi bahçesi", "1,100 m² hobby garden with lake view in the Dim Valley", "Садовый участок 1 100 м² с видом на озеро, долина Дим", "1.100 m² Freizeitgarten mit Seeblick im Dim-Tal"],
      o: ["Baraj gölüne bakan, meyve ağaçlı tarla; sulama suyu ve yol var. Hafta sonu bahçesi için ideal; tek tapu.", "Farmland with fruit trees overlooking the reservoir; irrigation water and road access. Ideal as a weekend garden; sole title.", "Земля с фруктовыми деревьями и видом на водохранилище; есть вода для полива и подъезд. Идеально для сада на выходные; единоличное тапу.", "Ackerland mit Obstbäumen und Blick auf den Stausee; Bewässerungswasser und Zufahrt vorhanden. Ideal als Wochenendgarten; Alleineigentum."] },
    { no: "AAO-112", tur: "arsa", bolge: "uzunoz", m2: 4800, fiyat: 3600000, imar: "tarla", tek: true, takas: true, lat: 36.5000, lng: 32.1500, oz: ["zeytin", "yol", "denizm"], plan: "pesin",
      b: ["Uzunöz'de tek tapu 4.800 m² zeytinlik", "4,800 m² olive grove with sole title in Uzunöz", "Оливковая роща 4 800 м² с единоличным тапу, Узуноз", "4.800 m² Olivenhain im Alleineigentum in Uzunöz"],
      o: ["Hisseli değil, tek tapu. Uzak deniz manzaralı, yola cepheli zeytinlik; uzun vadeli yatırım için. Takasa açık. Tarım arazisinde yabancı alıcılar için ek şartlar bulunur; ön kontrolü biz yaparız.", "Not shared – sole title. Olive grove with a distant sea view and road frontage, for long-term investment. Open to trade-ins. Extra conditions apply to foreign buyers of farmland; we run the preliminary check.", "Без долей — единоличное тапу. Оливковая роща с дальним видом на море и выходом на дорогу, для долгосрочных вложений. Возможен обмен. Для иностранцев при покупке с/х земли действуют дополнительные условия — предварительную проверку берём на себя.", "Keine Anteile – Alleineigentum. Olivenhain mit fernem Meerblick und Straßenanbindung, für langfristige Anlage. Tausch möglich. Für ausländische Käufer von Agrarland gelten zusätzliche Bedingungen; die Vorprüfung übernehmen wir."] }
  ];

  /* ---------- Tapu rehberi (8 adım × 4 dil) ---------- */
  var REHBER = [
    [["Taşınmazı seçin, kaydı kontrol edelim", "Tapu kaydı, takyidatlar (ipotek, haciz, şerh) ve belediyeden imar durumu sorgulanır. Arsada yol, eğim ve hisse durumu da kontrol edilir."],
     ["Choose the property, we check the records", "We check the land registry record, any encumbrances (mortgage, seizure, annotations) and the zoning status with the municipality. For land, we also check road access, slope and shared ownership."],
     ["Выбор объекта и проверка документов", "Проверяем запись в реестре, обременения (ипотека, арест, отметки) и статус зонирования в муниципалитете. Для участков — также подъезд, уклон и наличие долей."],
     ["Objekt wählen, Unterlagen prüfen", "Wir prüfen den Grundbucheintrag, Belastungen (Hypothek, Pfändung, Vermerke) und den Bebauungsstatus bei der Gemeinde. Bei Grundstücken auch Zufahrt, Hangneigung und Miteigentum."]],
    [["Vergi numarası alın", "Pasaportunuzla vergi dairesinden (ya da elektronik ortamda) yabancılara özel vergi numarası alınır. Tapu, banka ve abonelik işlemlerinde gerekir."],
     ["Get a tax number", "With your passport you obtain a tax number for foreigners from the tax office (or online). It is needed for the title deed, the bank and utility contracts."],
     ["Получите налоговый номер", "По паспорту в налоговой инспекции (или онлайн) оформляется налоговый номер для иностранцев. Он нужен для тапу, банка и договоров на коммунальные услуги."],
     ["Steuernummer beantragen", "Mit Ihrem Reisepass erhalten Sie beim Finanzamt (oder online) eine Steuernummer für Ausländer. Sie wird für Grundbuch, Bank und Versorgungsverträge benötigt."]],
    [["Banka hesabı ve ödeme kaydı", "Ödemenin banka üzerinden yapılması önerilir. Döviz ile yapılan ödemelerde bankanın düzenlediği belgeler dosyada saklanır."],
     ["Bank account and payment records", "Paying through a bank is recommended. For payments in foreign currency, the documents issued by the bank are kept on file."],
     ["Банковский счёт и подтверждение оплаты", "Рекомендуем проводить оплату через банк. При оплате в валюте документы, выданные банком, сохраняются в деле."],
     ["Bankkonto und Zahlungsnachweis", "Wir empfehlen die Zahlung über eine Bank. Bei Zahlungen in Fremdwährung werden die Bankbelege in der Akte aufbewahrt."]],
    [["Ekspertiz (değerleme) raporu", "Yabancı alıcıların tapu işlemlerinde, SPK lisanslı bir değerleme şirketinden alınan güncel değerleme raporu istenir."],
     ["Valuation report", "For title transfers to foreign buyers, a current valuation report from a valuation company licensed by the Capital Markets Board (SPK) is required."],
     ["Отчёт об оценке (экспертиза)", "При оформлении тапу на иностранца требуется актуальный отчёт об оценке от компании, лицензированной Советом по рынкам капитала (SPK)."],
     ["Wertgutachten", "Bei der Umschreibung auf ausländische Käufer wird ein aktuelles Gutachten eines von der Kapitalmarktaufsicht (SPK) lizenzierten Bewertungsunternehmens verlangt."]],
    [["Askeri ve güvenlik bölgesi kontrolü", "Tapu müdürlüğü, taşınmazın askeri yasak ya da güvenlik bölgesinde olup olmadığını ilgili kurumlara sorar. Bu kontrolün süresi bölgeye göre değişebilir."],
     ["Military and security zone check", "The land registry asks the relevant authorities whether the property lies in a military or security zone. How long this takes can vary by area."],
     ["Проверка военных и охранных зон", "Кадастровое управление запрашивает у ведомств, не находится ли объект в военной или охранной зоне. Срок проверки зависит от района."],
     ["Prüfung militärischer Sperrgebiete", "Das Grundbuchamt fragt bei den Behörden an, ob das Objekt in einem militärischen Sperr- oder Sicherheitsgebiet liegt. Die Dauer kann je nach Gegend variieren."]],
    [["Tapu randevusu ve harçlar", "Başvuru tapu müdürlüğüne ya da Web Tapu üzerinden yapılır. Tapu harcı ve döner sermaye bedeli resmi tarifeye göre hesaplanır ve imzadan önce ödenir."],
     ["Land registry appointment and fees", "The application is made at the land registry office or via Web Tapu. The title deed fee and service charge are calculated according to the official tariff and paid before signing."],
     ["Запись в кадастр и сборы", "Заявка подаётся в кадастровое управление или через Web Tapu. Сбор за тапу и сервисный платёж рассчитываются по официальному тарифу и оплачиваются до подписания."],
     ["Termin beim Grundbuchamt und Gebühren", "Der Antrag wird beim Grundbuchamt oder über Web Tapu gestellt. Grundbuchgebühr und Bearbeitungsgebühr richten sich nach dem amtlichen Tarif und werden vor der Unterschrift bezahlt."]],
    [["İmza günü", "Türkçe bilmeyen alıcı için yeminli tercüman bulunur. Pasaport, vesikalık fotoğraf ve değerleme raporuyla imza atılır; tapu senedi genellikle aynı gün teslim edilir. Türkiye'de bulunamıyorsanız noterden verilecek vekâletnameyle işlem yürütülebilir."],
     ["Signing day", "A sworn interpreter attends for buyers who don't speak Turkish. You sign with your passport, passport photos and the valuation report; the title deed is usually handed over the same day. If you can't be in Turkey, the purchase can be completed with a notarised power of attorney."],
     ["День подписания", "Для покупателя, не владеющего турецким, присутствует присяжный переводчик. Подписание — с паспортом, фотографиями и отчётом об оценке; тапу обычно выдаётся в тот же день. Если вы не можете приехать, сделку можно провести по нотариальной доверенности."],
     ["Unterschriftstermin", "Für Käufer ohne Türkischkenntnisse ist ein vereidigter Dolmetscher anwesend. Unterschrieben wird mit Reisepass, Passfotos und Wertgutachten; die Tapu wird meist am selben Tag ausgehändigt. Sind Sie nicht in der Türkei, ist der Kauf per notarieller Vollmacht möglich."]],
    [["Sonrası: DASK, abonelik, ikamet", "Zorunlu deprem sigortası (DASK) yaptırılır, elektrik ve su abonelikleri devralınır, emlak vergisi beyanı belediyeye yapılır. Dilerseniz konut sahipliğine dayalı ikamet izni başvurusunda da destek oluruz."],
     ["Afterwards: DASK, utilities, residence", "Compulsory earthquake insurance (DASK) is taken out, electricity and water contracts are transferred, and the property tax declaration is filed with the municipality. If you wish, we also help with a residence permit application based on property ownership."],
     ["После сделки: DASK, коммунальные услуги, ВНЖ", "Оформляется обязательная страховка от землетрясений (DASK), переоформляются договоры на электричество и воду, подаётся декларация по налогу на недвижимость в муниципалитет. По желанию поможем с ВНЖ на основании владения жильём."],
     ["Danach: DASK, Versorger, Aufenthalt", "Die Pflicht-Erdbebenversicherung (DASK) wird abgeschlossen, Strom- und Wasserverträge werden übernommen und die Grundsteuererklärung bei der Gemeinde eingereicht. Auf Wunsch helfen wir auch beim Antrag auf Aufenthaltserlaubnis über Wohneigentum."]]
  ];

  /* ---------- Yardımcılar ---------- */
  var dil = "tr";
  function di() { return DILLER.indexOf(dil); }
  function t(k, v) { var s = S[k] ? S[k][di()] : k; if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]); return s; }
  function L(arr) { return arr[di()]; }
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function yerel() { return YEREL[dil]; }
  function sayi(n, d) { return Number(n).toLocaleString(yerel(), { maximumFractionDigits: d || 0, minimumFractionDigits: d && d > 0 ? d : 0 }); }
  function tlYaz(n, loc) { return Math.round(n).toLocaleString(loc, { maximumFractionDigits: 0 }) + " TL"; }
  function tl(n) { return tlYaz(n, yerel()); }
  function eur(n) { return new Intl.NumberFormat(yerel(), { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }
  function kisa(n) { try { return new Intl.NumberFormat(yerel(), { notation: "compact", maximumFractionDigits: 1 }).format(n) + " TL"; } catch (e) { return sayi(n) + " TL"; } }
  function euroKarsilik(tlTutar) { return Math.round(tlTutar / KUR / 1000) * 1000; }
  function bolgeAd(k) { return BOLGE[k] ? L(BOLGE[k]) : k; }
  function imarAd(k) { return k ? t("im_" + k) : t("ofis_bilgi"); }
  function turAd(i) { return i.hobi ? (dil === "tr" ? "Hobi bahçesi" : dil === "en" ? "Hobby garden" : dil === "ru" ? "Садовый участок" : "Freizeitgarten") : i.imar === "tarla" ? t("tarla") : t(i.tur); }
  function baslik(i) { return L(i.b); }
  function waLink(metin) { return "https://wa.me/" + WA + "?text=" + encodeURIComponent(metin); }
  function waIlan(i) { return waLink(t("wa_ilan_m", { no: i.no, b: baslik(i) })); }
  function depoOku(k, v) { try { var x = localStorage.getItem(k); return x == null ? v : JSON.parse(x); } catch (e) { return v; } }
  function depoYaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function tost(m) { var e = $("#tost"); e.textContent = m; e.classList.add("acik"); clearTimeout(tost.z); tost.z = setTimeout(function () { e.classList.remove("acik"); }, 2200); }
  function ilanBul(no) { for (var k = 0; k < ILAN.length; k++) if (ILAN[k].no === no) return ILAN[k]; return null; }
  function fiyatHtml(i, kucuk) {
    var h = "<b>" + tl(i.fiyat) + "</b>";
    if (dil !== "tr") h += "<span>" + t("tl_karsilik", { e: eur(euroKarsilik(i.fiyat)) }) + "</span>";
    return h;
  }
  function ozetSatir(i) {
    var a = ['<span><b>' + sayi(i.m2) + "</b> m²</span>"];
    if (i.tur === "daire") a.push("<span><b>" + i.oda + "</b></span>", "<span>" + t("d_kat") + " " + i.kat + "</span>");
    else a.push("<span>" + imarAd(i.imar) + "</span>");
    return a.join("");
  }
  function etiketIlan(i) { return i.gercek ? '<span class="rz gercek">' + t("gercek_ilan") + "</span>" : '<span class="rz ornek">' + t("ornek_ilan") + "</span>"; }
  function tarihYaz(d) { return new Date(d + "T12:00:00").toLocaleDateString(yerel(), { day: "numeric", month: "long", year: "numeric" }); }
  function videoHtml(i, sinif) { return '<div class="video-kap ' + (sinif || "") + '"><video src="' + i.video + '" poster="' + i.kapak + '" controls playsinline preload="metadata" data-video="' + i.no + '"></video></div>'; }
  function rozetler(i) {
    var r = [i.imar ? '<span class="rz mavi">' + imarAd(i.imar) + "</span>" : ""];
    if (i.video) r.push('<span class="rz">▶ ' + t("rz_video") + "</span>");
    if (i.tek) r.push('<span class="rz yesil">' + t("rz_tek") + "</span>");
    if (i.takas) r.push('<span class="rz altin">' + t("rz_takas") + "</span>");
    if (i.yeni) r.push('<span class="rz">' + t("rz_yeni") + "</span>");
    return r.join("");
  }

  /* ---------- Temsili parsel geometrisi (konum.js ile ortak) ---------- */
  function tohum(s) { var h = 2166136261; for (var k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619); } return function () { h += 0x6D2B79F5; var x = h; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
  function parselMetre(i) {
    var r = tohum(i.no), A = i.tur === "daire" ? 2200 : i.m2, oran = 1.15 + r() * 0.6, w = Math.sqrt(A * oran), h = A / w, aci = (r() * 50 - 25) * Math.PI / 180;
    var pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(function (p) { return [p[0] * (0.9 + r() * 0.2), p[1] * (0.9 + r() * 0.2)]; });
    if (A > 1500) pts.splice(3, 0, [w * (0.1 - r() * 0.2), h / 2 * (1.08 + r() * 0.12)]);
    return pts.map(function (p) { return [p[0] * Math.cos(aci) - p[1] * Math.sin(aci), p[0] * Math.sin(aci) + p[1] * Math.cos(aci)]; });
  }
  function parselKoord(i) {
    var m = 111320, kx = m * Math.cos(i.lat * Math.PI / 180);
    var p = parselMetre(i).map(function (q) { return [i.lng + q[0] / kx, i.lat + q[1] / m]; });
    p.push(p[0]); return p;
  }
  function parselSvg(i, tip) {
    var r = tohum(i.no + "s"), W = 800, H = 600, pts = parselMetre(i), xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var gen = Math.max(Math.max.apply(0, xs) - Math.min.apply(0, xs), Math.max.apply(0, ys) - Math.min.apply(0, ys)), olc = 300 / gen;
    var P = pts.map(function (p) { return [W / 2 + p[0] * olc, H / 2 - p[1] * olc]; });
    var es = "";
    for (var k = 0; k < 9; k++) { var y0 = 40 + k * 66 + r() * 20, d = "M-20 " + y0.toFixed(0); for (var x = 0; x <= 840; x += 120) d += " Q" + (x + 60) + " " + (y0 + (r() * 60 - 30)).toFixed(0) + " " + (x + 120) + " " + (y0 + (r() * 30 - 15)).toFixed(0); es += '<path d="' + d + '" fill="none" stroke="#2c4a3b" stroke-width="1.2" opacity=".75"/>'; }
    var kenar = "";
    for (var j = 0; j < P.length; j++) { var a = P[j], b = P[(j + 1) % P.length], mm = Math.hypot(pts[j][0] - pts[(j + 1) % pts.length][0], pts[j][1] - pts[(j + 1) % pts.length][1]);
      kenar += '<text x="' + ((a[0] + b[0]) / 2).toFixed(0) + '" y="' + ((a[1] + b[1]) / 2 - 8).toFixed(0) + '" fill="#d9f7e6" font-size="17" font-family="IBM Plex Mono,monospace" text-anchor="middle">' + Math.round(mm) + ' m</text>'; }
    var poly = P.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    var ust = tip === "uydu" ? "#1d2a22" : "#13231b";
    return '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(baslik(i)) + '"><rect width="800" height="600" fill="' + ust + '"/>' + es +
      (tip === "uydu" ? '<g opacity=".5"><circle cx="160" cy="120" r="70" fill="#25382c"/><circle cx="650" cy="470" r="90" fill="#25382c"/><path d="M0 520 L800 430 L800 600 L0 600Z" fill="#1d4f63" opacity=".8"/></g>' : "") +
      '<polygon points="' + poly + '" fill="rgba(61,220,132,.16)" stroke="#3DDC84" stroke-width="4" stroke-linejoin="round"/>' + kenar +
      '<g transform="translate(400 300)"><path d="M0 -38 C-13 -38 -22 -28 -22 -16 C-22 -1 0 18 0 18 C0 18 22 -1 22 -16 C22 -28 13 -38 0 -38Z" fill="#D7263D" stroke="#fff" stroke-width="2.5"/><circle cx="0" cy="-17" r="7" fill="#fff"/></g>' +
      '<g transform="translate(740 70)" font-family="IBM Plex Mono,monospace"><path d="M0 -26 L10 8 L0 2 L-10 8Z" fill="#E2C48A"/><text y="28" fill="#E2C48A" font-size="15" text-anchor="middle">N</text></g>' +
      '<text x="24" y="40" fill="#E2C48A" font-size="18" font-family="IBM Plex Mono,monospace" letter-spacing="2">' + esc(i.no) + " · " + sayi(i.m2) + ' m²</text></svg>';
  }
  function gorselHtml(i, k) {
    if (i.kapak) return '<img src="' + i.kapak + '" alt="' + esc(baslik(i)) + '" loading="lazy" decoding="async" width="720" height="1280" style="object-position:50% 27%">';
    if (i.img) return '<img src="img/' + i.img[k || 0] + '" alt="' + esc(baslik(i)) + '" loading="lazy" decoding="async" width="1200" height="800">';
    return parselSvg(i, k ? "uydu" : "plan");
  }
  function galeriListe(i) { return i.img ? i.img.map(function (_, k) { return k; }) : [0, 1]; }

  /* ---------- Dil uygulama ---------- */
  function dilUygula(yeni, ilk) {
    dil = DILLER.indexOf(yeni) >= 0 ? yeni : "tr";
    if (!ilk) depoYaz("aao-dil", dil);
    document.documentElement.lang = dil;
    $("#dilKod").textContent = dil.toUpperCase();
    $$(".dil-liste button").forEach(function (b) { b.setAttribute("aria-current", b.dataset.dil === dil); });
    $$("[data-i18n]").forEach(function (e) { var k = e.getAttribute("data-i18n"); if (S[k]) e.textContent = t(k); });
    $$("[data-i18n-html]").forEach(function (e) { var k = e.getAttribute("data-i18n-html"); if (S[k]) e.innerHTML = t(k); });
    $$("[data-i18n-ph]").forEach(function (e) { e.placeholder = t(e.getAttribute("data-i18n-ph")); });
    $$("[data-i18n-aria]").forEach(function (e) { e.setAttribute("aria-label", t(e.getAttribute("data-i18n-aria"))); });
    $$(".wa-genel").forEach(function (a) { a.href = waLink(t("wa_genel")); });
    $("#gPuan").textContent = (4.2).toLocaleString(yerel());
    seceneklerKur(); rehberKur(); reelsKur(); cizIzgara(); acikMi(); hesapKira(); hesapKredi(); panelCiz(); karsBar(); sohbetDil(); ilanSecKur(); vitrinDil();
    if (window.AAOKonum) window.AAOKonum.dilDegisti();
    if (detayAcik) detayAc(detayAcik, true);
    if ($("#kars").open) karsAc();
  }

  /* ---------- Filtre seçenekleri ---------- */
  var M2MIN = [0, 100, 250, 500, 1000, 2500], M2MAX = [0, 150, 300, 1000, 2500, 5000];
  var FMIN = [0, 2500000, 5000000, 7500000, 10000000, 15000000], FMAX = [0, 5000000, 7500000, 10000000, 15000000, 20000000];
  function opts(sel, liste, deger) { var v = sel.value; sel.innerHTML = liste.map(function (o) { return '<option value="' + o[0] + '">' + esc(o[1]) + "</option>"; }).join(""); sel.value = deger != null ? deger : v; if (sel.selectedIndex < 0) sel.selectedIndex = 0; }
  function bolgeOpts(ilk) { return [["", ilk]].concat(Object.keys(BOLGE).map(function (k) { return [k, bolgeAd(k)]; })); }
  function seceneklerKur() {
    opts($("#fBolge"), bolgeOpts(t("tum_bolge")));
    opts($("#hBolge"), bolgeOpts(t("tum_bolge")));
    opts($("#vBolge"), Object.keys(BOLGE).map(function (k) { return [k, bolgeAd(k)]; }).concat([["diger", t("v_diger")]]));
    opts($("#fM2min"), M2MIN.map(function (n) { return [n, n ? sayi(n) + " m²" : t("f_min")]; }));
    opts($("#fM2max"), M2MAX.map(function (n) { return [n, n ? sayi(n) + " m²" : t("f_max")]; }));
    opts($("#fFmin"), FMIN.map(function (n) { return [n, n ? kisa(n) : t("f_min")]; }));
    opts($("#fFmax"), FMAX.map(function (n) { return [n, n ? kisa(n) : t("f_max")]; }));
    opts($("#fImar"), [["", t("tum")]].concat(IMAR.map(function (k) { return [k, imarAd(k)]; })));
    opts($("#vImar"), IMAR.map(function (k) { return [k, imarAd(k)]; }));
    opts($("#hButce"), [["", t("butce_hepsi")], ["0-5000000", "≤ " + kisa(5000000)], ["5000000-10000000", kisa(5000000) + " – " + kisa(10000000)], ["10000000-15000000", kisa(10000000) + " – " + kisa(15000000)], ["15000000-0", "≥ " + kisa(15000000)]]);
    opts($("#yIlan"), [["", t("y_karar")]].concat(ILAN.map(function (i) { return [i.no, i.no + " · " + baslik(i)]; })));
    var saatler = []; for (var h = 9; h <= 17; h++) { saatler.push([h + ":00", (h < 10 ? "0" : "") + h + ":00"]); saatler.push([h + ":30", (h < 10 ? "0" : "") + h + ":30"]); }
    opts($("#ySaat"), saatler);
  }

  /* ---------- Portföy ---------- */
  var F = { bolge: "", tur: "", m2min: 0, m2max: 0, fmin: 0, fmax: 0, imar: "", sira: "oner", fav: false, takas: false, tek: false };
  var favs = depoOku("aao-fav", []); if (!Array.isArray(favs)) favs = [];
  var kars = [];
  function filtreOku() {
    F.bolge = $("#fBolge").value; F.m2min = +$("#fM2min").value; F.m2max = +$("#fM2max").value; F.fmin = +$("#fFmin").value; F.fmax = +$("#fFmax").value;
    F.imar = $("#fImar").value; F.sira = $("#fSira").value; F.fav = $("#fFav").checked; F.takas = $("#fTakas").checked; F.tek = $("#fTek").checked;
  }
  function suz() {
    var l = ILAN.filter(function (i) {
      return (!F.bolge || i.bolge === F.bolge) && (!F.tur || i.tur === F.tur) && (!F.m2min || i.m2 >= F.m2min) && (!F.m2max || i.m2 <= F.m2max) &&
        (!F.fmin || i.fiyat >= F.fmin) && (!F.fmax || i.fiyat <= F.fmax) && (!F.imar || i.imar === F.imar) && (!F.fav || favs.indexOf(i.no) >= 0) && (!F.takas || i.takas) && (!F.tek || i.tek);
    });
    if (F.sira === "ucuz") l.sort(function (a, b) { return a.fiyat - b.fiyat; });
    if (F.sira === "pahali") l.sort(function (a, b) { return b.fiyat - a.fiyat; });
    if (F.sira === "m2") l.sort(function (a, b) { return b.m2 - a.m2; });
    return l;
  }
  function sonucYazi(n) {
    if (dil === "tr") return n + " ilan";
    if (dil === "en") return n === 1 ? "1 listing" : n + " listings";
    if (dil === "de") return n === 1 ? "1 Angebot" : n + " Angebote";
    var m10 = n % 10, m100 = n % 100; return n + (m10 === 1 && m100 !== 11 ? " объект" : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? " объекта" : " объектов");
  }
  var KALP = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
  var WAIKON = '<svg class="ikon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"/></svg>';
  function kartHtml(i) {
    var fv = favs.indexOf(i.no) >= 0, kv = kars.indexOf(i.no) >= 0;
    return '<article class="kart" data-no="' + i.no + '">' +
      '<div class="gorsel" data-ac="' + i.no + '">' + gorselHtml(i, 0) +
      '<div class="rozet-ust">' + etiketIlan(i) + '<span class="rz">' + turAd(i) + "</span></div>" +
      '<button class="kalp" type="button" data-fav="' + i.no + '" aria-pressed="' + fv + '" aria-label="' + esc(fv ? t("fav_cikar") : t("fav_ekle")) + '">' + KALP + "</button>" +
      (i.gercek ? "" : '<span class="gorsel-not">' + t("gorsel_not") + "</span>") + "</div>" +
      '<div class="govde"><div class="ust-bilgi"><span>' + bolgeAd(i.bolge) + "</span><span>" + i.no + "</span></div>" +
      '<h3 data-ac="' + i.no + '">' + esc(baslik(i)) + "</h3>" +
      '<div class="ozellik">' + ozetSatir(i) + "</div>" +
      '<div class="rozetler">' + rozetler(i) + "</div>" +
      '<div class="fiyat">' + fiyatHtml(i) + "</div>" +
      '<div class="eylem"><button class="dg ince kucuk" type="button" data-ac="' + i.no + '">' + t("detay") + '</button><label class="kars-cb"><input type="checkbox" data-kars="' + i.no + '"' + (kv ? " checked" : "") + "> " + t("karsilastir") + "</label>" +
      '<a class="dg wa kucuk" data-wa="' + i.no + '" href="' + waIlan(i) + '" target="_blank" rel="noopener">' + WAIKON + t("wa_ilan") + "</a></div></div></article>";
  }
  function cizIzgara() {
    filtreOku();
    var l = suz();
    $("#izgara").innerHTML = l.length ? l.map(kartHtml).join("") : '<div class="bos">' + t("bos") + "</div>";
    $("#sayac").textContent = sonucYazi(l.length);
    $("#favSay").textContent = favs.length;
  }
  function favDegis(no) {
    var k = favs.indexOf(no); if (k >= 0) favs.splice(k, 1); else favs.push(no);
    depoYaz("aao-fav", favs); tost(t(k >= 0 ? "tost_fav0" : "tost_fav"));
    $$('[data-fav="' + no + '"]').forEach(function (b) { b.setAttribute("aria-pressed", k < 0); b.setAttribute("aria-label", t(k < 0 ? "fav_cikar" : "fav_ekle")); });
    $("#favSay").textContent = favs.length;
    if (F.fav) cizIzgara();
  }
  function karsDegis(no, acik, kutu) {
    var k = kars.indexOf(no);
    if (acik && k < 0) { if (kars.length >= 3) { tost(t("kars_max")); if (kutu) kutu.checked = false; return; } kars.push(no); }
    if (!acik && k >= 0) kars.splice(k, 1);
    $$('[data-kars="' + no + '"]').forEach(function (c) { c.checked = kars.indexOf(no) >= 0; });
    karsBar();
  }
  function karsBar() {
    var b = $("#kbar"); b.classList.toggle("acik", kars.length > 0);
    $("#kSecili").innerHTML = kars.map(function (n) { return "<span>" + n + "</span>"; }).join("");
    $(".ad", b).textContent = t("kars_bar") + " (" + kars.length + "/3)";
  }

  /* ---------- Detay ---------- */
  var detayAcik = null, detayKonum = null, galeriK = 0;
  function odemeHtml(i) {
    var f = i.fiyat, c = function (a, b, s) { return "<div><span>" + a + "</span><b>" + b + "</b>" + (s ? "<small>" + s + "</small>" : "") + "</div>"; };
    if (i.plan === "taksit24" || i.plan === "taksit12") {
      var ay = i.plan === "taksit24" ? 24 : 12, p = f * 0.3, tk = (f - p) / ay;
      return c(t("d_pesinat") + " · %30", tl(p)) + c(t("d_taksit"), tl(Math.round(tk / 1000) * 1000), "× " + ay + " " + t("ay")) + c(t("d_vade"), ay + " " + t("ay"));
    }
    if (i.plan === "arsa50") return c(t("d_pesinat") + " · %50", tl(f * 0.5)) + c(t("d_tapuda") + " · %50", tl(f * 0.5)) + c(t("d_vade"), "—");
    return c(t("d_pesin"), tl(f)) + c(t("d_pesin_n"), "100%") + c(t("d_vade"), "—");
  }
  function galeriCiz(i) {
    var l = galeriListe(i);
    $("#gAna").innerHTML = gorselHtml(i, l[galeriK]) + '<div class="rozet-ust"><span class="rz ornek">' + t("ornek_ilan") + "</span></div>" + '<span class="gorsel-not">' + t("gorsel_not") + " · " + (galeriK + 1) + "/" + l.length + "</span>";
    $$("#gKucuk button").forEach(function (b, k) { b.setAttribute("aria-current", k === galeriK); });
  }
  function detayAc(no, yenile) {
    var i = ilanBul(no); if (!i) return;
    if (!yenile) galeriK = 0;
    detayAcik = no;
    var tablo = [[t("d_fiyat"), "<b>" + tl(i.fiyat) + "</b>" + (dil !== "tr" ? " · " + eur(euroKarsilik(i.fiyat)) : "")], [t("d_m2"), sayi(i.m2) + " m²"], [t("d_m2fiyat"), tl(Math.round(i.fiyat / i.m2))], [t("d_tur"), turAd(i)], [t("d_bolge"), bolgeAd(i.bolge) + ", Alanya"]];
    if (i.tur === "daire") tablo.push([t("d_oda"), i.oda], [t("d_kat"), i.kat], [t("d_yil"), i.yil]);
    if (i.gercek) {
      var ob = '<span class="not">' + t("ofis_bilgi") + "</span>";
      tablo.push([t("d_imar"), ob], [t("d_emsal"), ob], [t("d_kat_izin"), ob], [t("d_tek"), t("d_tek_m")], [t("d_takas"), t("evet")], [t("d_deniz"), t("d_deniz_v")], [t("d_altyapi"), t("d_altyapi_v")], [t("d_hafriyat"), t("d_hafriyat_v")], [t("d_tarih"), tarihYaz(i.tarih)]);
    } else {
      tablo.push([t("d_imar"), imarAd(i.imar)]);
      if (i.emsal) tablo.push([t("d_emsal"), i.emsal]);
      tablo.push([t("d_ada"), '<span class="not">' + t("d_ada_v") + "</span>"], [t("d_tek"), i.tek ? t("d_tek_v") : i.tur === "daire" ? t("d_hisse_v") : "—"], [t("d_takas"), i.takas ? t("evet") : t("hayir")]);
    }
    var fv = favs.indexOf(i.no) >= 0;
    $("#detayIc").innerHTML =
      '<div class="m-bas"><span class="no">' + i.no + '</span><h3 id="dBaslik">' + esc(baslik(i)) + '</h3><button class="kalp" style="position:static;flex:none" type="button" data-fav="' + i.no + '" aria-pressed="' + fv + '" aria-label="' + esc(t(fv ? "fav_cikar" : "fav_ekle")) + '">' + KALP + '</button><button class="ib" type="button" data-kapat aria-label="' + t("kapat") + '">✕</button></div>' +
      '<div class="m-govde">' + (i.video ? '<div class="galeri galeri-video">' + videoHtml(i) + '<p class="not" style="padding:0 14px 14px">' + t("vt_not") + "</p></div>" :
      '<div class="galeri"><div class="ana-g" id="gAna"></div>' +
      '<button class="ok-g sol" type="button" data-g="-1" aria-label="‹">‹</button><button class="ok-g sag" type="button" data-g="1" aria-label="›">›</button>' +
      '<div class="kucukler" id="gKucuk">' + galeriListe(i).map(function (k, n) { return '<button type="button" data-gk="' + n + '">' + gorselHtml(i, k) + "</button>"; }).join("") + "</div></div>") +
      '<div class="m-bilgi"><div class="rozetler">' + etiketIlan(i) + rozetler(i) + '</div><h2>' + esc(baslik(i)) + '</h2><p style="color:#c9d0da">' + esc(L(i.o)) + "</p>" +
      '<table class="tablo"><tbody>' + tablo.map(function (r) { return "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") + "</tbody></table>" +
      '<p class="not">' + t(i.gercek ? "d_gercek_not" : "d_tapu_not") + "</p>" +
      '<div class="m-eylem"><a class="dg wa" data-wa="' + i.no + '" href="' + waIlan(i) + '" target="_blank" rel="noopener">' + WAIKON + t("wa_ilan") + '</a><button class="dg ince" type="button" data-randevu="' + i.no + '">' + t("d_randevu") + "</button></div></div></div>" +
      '<div class="m-alt"><div><h4>' + t("d_ozellik") + '</h4><div class="etiketler">' + i.oz.map(function (o) { return "<span>" + t("oz_" + o) + "</span>"; }).join("") + "</div></div>" +
      "<div><h4>" + t("d_odeme") + "</h4>" + (i.plan ? '<div class="odeme">' + odemeHtml(i) + '</div><p class="not" style="margin-top:8px">' + t("d_odeme_not") + "</p>" : "<p>" + t("d_odeme_ofis") + "</p>") + "</div>" +
      "<div><h4>" + t("d_konum") + '</h4><div id="detayKonum"></div></div></div>';
    if (!i.video) galeriCiz(i);
    var dlg = $("#detay");
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); document.body.style.overflow = "hidden"; }
    if (detayKonum) { detayKonum.yokEt(); detayKonum = null; }
    if (window.AAOKonum) detayKonum = window.AAOKonum.kur($("#detayKonum"), i, { kok: $("#detayIc") });
  }
  function detayKapat() {
    var dlg = $("#detay"); if (dlg.open) dlg.close();
  }
  $("#detay").addEventListener("close", function () { detayAcik = null; document.body.style.overflow = ""; if (detayKonum) { detayKonum.yokEt(); detayKonum = null; } });

  /* ---------- Karşılaştırma ---------- */
  function karsAc() {
    if (kars.length < 2) { tost(t("kars_az")); return; }
    var l = kars.map(ilanBul), K = window.AAOKonum;
    var sk = l.map(function (i) { return K ? K.analiz(i) : null; });
    function enIyi(degerler, kucukIyi) { var v = degerler.filter(function (x) { return x != null; }); if (!v.length) return null; return kucukIyi ? Math.min.apply(0, v) : Math.max.apply(0, v); }
    var satirlar = [
      [t("d_fiyat"), l.map(function (i) { return i.fiyat; }), function (v, i) { return tl(v) + (dil !== "tr" ? "<br><small class='not'>" + eur(euroKarsilik(v)) + "</small>" : ""); }, true],
      [t("d_m2"), l.map(function (i) { return i.m2; }), function (v) { return sayi(v) + " m²"; }, false],
      [t("d_m2fiyat"), l.map(function (i) { return Math.round(i.fiyat / i.m2); }), function (v) { return tl(v); }, true],
      [t("d_tur"), l.map(function (i) { return turAd(i) + (i.oda ? " · " + i.oda : ""); }), null],
      [t("d_bolge"), l.map(function (i) { return bolgeAd(i.bolge); }), null],
      [t("d_imar"), l.map(function (i) { return imarAd(i.imar); }), null],
      [t("d_tek"), l.map(function (i) { return i.gercek ? t("d_tek_m") : i.tek ? t("d_tek_v") : i.tur === "daire" ? t("d_hisse_v") : "—"; }), null],
      [t("d_takas"), l.map(function (i) { return i.takas ? t("evet") : t("hayir"); }), null],
      [t("kt_skor"), sk.map(function (a) { return a ? a.skor : null; }), function (v) { return v == null ? "—" : v + " / 100"; }, false],
      [t("kt_deniz"), sk.map(function (a) { return a ? a.deniz : null; }), function (v) { return v == null ? "—" : K.km(v); }, true],
      [t("kt_gzp"), sk.map(function (a) { return a ? a.gzp : null; }), function (v) { return v == null ? "—" : K.km(v); }, true],
      [t("d_odeme"), l.map(function (i) { return !i.plan ? t("ofis_bilgi") : i.plan === "pesin" ? t("d_pesin") : i.plan === "arsa50" ? "50% + 50%" : "30% + " + (i.plan === "taksit24" ? 24 : 12) + " " + t("ay"); }), null]
    ];
    var govde = satirlar.map(function (s) {
      var best = s[2] && typeof s[1][0] === "number" ? enIyi(s[1], s[3]) : null;
      return "<tr><th>" + s[0] + "</th>" + s[1].map(function (v, k) { var h = s[2] ? s[2](v, l[k]) : esc(v); return "<td" + (best != null && v === best ? ' class="en-iyi"' : "") + ">" + h + "</td>"; }).join("") + "</tr>";
    }).join("");
    $("#karsIc").innerHTML = '<div class="m-bas"><span class="no">' + kars.length + '/3</span><h3>' + t("kars_bas") + '</h3><button class="ib" type="button" data-kapat aria-label="' + t("kapat") + '">✕</button></div>' +
      '<div class="kt-sar"><table class="kt"><thead><tr><th></th>' + l.map(function (i) { return '<td><div class="kg">' + gorselHtml(i, 0) + "</div>" + etiketIlan(i) + '<b style="margin-top:6px">' + esc(baslik(i)) + '</b><small class="not">' + i.no + "</small></td>"; }).join("") + "</tr></thead><tbody>" + govde +
      "<tr><th></th>" + l.map(function (i) { return '<td><a class="dg wa kucuk" style="white-space:normal" data-wa="' + i.no + '" href="' + waIlan(i) + '" target="_blank" rel="noopener">WhatsApp</a> <button class="dg ince kucuk" type="button" data-ac="' + i.no + '">' + t("detay") + "</button></td>"; }).join("") + "</tr></tbody></table>" +
      '<p class="not" style="margin-top:10px">' + t("kars_iyi") + "</p></div>";
    var d = $("#kars"); if (!d.open) { d.showModal ? d.showModal() : d.setAttribute("open", ""); }
  }

  /* ---------- Rehber, Reels, yıldız, QR ---------- */
  function rehberKur() {
    var acik = $$("#rehberListe details").map(function (d) { return d.open; });
    $("#rehberListe").innerHTML = REHBER.map(function (a, k) { var x = a[di()]; return "<details" + (acik[k] || (!acik.length && k === 0) ? " open" : "") + "><summary><i>0" + (k + 1) + "</i><b>" + esc(x[0]) + "</b></summary><p>" + esc(x[1]) + "</p></details>"; }).join("");
  }
  function reelsKur() {
    var R = [["f4.jpg", "ig_1", "0:42"], ["f1.jpg", "ig_2", "0:35"], ["s3.jpg", "ig_3", "1:00"], ["stok-k8.jpg", "ig_4", "0:58"]];
    $("#reels").innerHTML = R.map(function (r) { return '<a class="reel" href="https://www.instagram.com/alanyaarsaofisi/" target="_blank" rel="noopener"><img src="img/' + r[0] + '" alt="" loading="lazy"><span class="rz ornek">' + t("ornek_gor") + '</span><span class="oynat"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M7 4l13 8-13 8z"/></svg></span><span class="alt">' + t(r[1]) + "<small>Reels · " + r[2] + "</small></span></a>"; }).join("");
  }
  function yildizKur() {
    var y = function (dolu) { return '<svg viewBox="0 0 24 24"><defs><linearGradient id="yd' + dolu + '"><stop offset="' + dolu + '%" stop-color="#E8A317"/><stop offset="' + dolu + '%" stop-color="#cfd3cc"/></linearGradient></defs><path fill="url(#yd' + dolu + ')" d="M12 2l3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.6 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6z"/></svg>'; };
    $("#yildiz").innerHTML = y(100) + y(100) + y(100) + y(100) + y(20);
    $("#yildiz2").innerHTML = '<svg viewBox="0 0 24 24"><path fill="#cfd3cc" d="M12 2l3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.6 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6z"/></svg>'.repeat(5);
  }
  var QR = '<svg role="img" aria-label="QR: Google" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 37" shape-rendering="crispEdges"><rect width="37" height="37" fill="#fff"/><path d="M2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM13 2h1v1h-1zM15 2h1v1h-1zM16 2h1v1h-1zM19 2h1v1h-1zM20 2h1v1h-1zM21 2h1v1h-1zM22 2h1v1h-1zM23 2h1v1h-1zM25 2h1v1h-1zM28 2h1v1h-1zM29 2h1v1h-1zM30 2h1v1h-1zM31 2h1v1h-1zM32 2h1v1h-1zM33 2h1v1h-1zM34 2h1v1h-1zM2 3h1v1h-1zM8 3h1v1h-1zM11 3h1v1h-1zM12 3h1v1h-1zM13 3h1v1h-1zM14 3h1v1h-1zM15 3h1v1h-1zM16 3h1v1h-1zM17 3h1v1h-1zM18 3h1v1h-1zM19 3h1v1h-1zM22 3h1v1h-1zM24 3h1v1h-1zM26 3h1v1h-1zM28 3h1v1h-1zM34 3h1v1h-1zM2 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM13 4h1v1h-1zM15 4h1v1h-1zM17 4h1v1h-1zM18 4h1v1h-1zM19 4h1v1h-1zM20 4h1v1h-1zM21 4h1v1h-1zM23 4h1v1h-1zM25 4h1v1h-1zM28 4h1v1h-1zM30 4h1v1h-1zM31 4h1v1h-1zM32 4h1v1h-1zM34 4h1v1h-1zM2 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM10 5h1v1h-1zM11 5h1v1h-1zM12 5h1v1h-1zM14 5h1v1h-1zM16 5h1v1h-1zM18 5h1v1h-1zM22 5h1v1h-1zM25 5h1v1h-1zM28 5h1v1h-1zM30 5h1v1h-1zM31 5h1v1h-1zM32 5h1v1h-1zM34 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM14 6h1v1h-1zM17 6h1v1h-1zM19 6h1v1h-1zM20 6h1v1h-1zM23 6h1v1h-1zM24 6h1v1h-1zM25 6h1v1h-1zM26 6h1v1h-1zM28 6h1v1h-1zM30 6h1v1h-1zM31 6h1v1h-1zM32 6h1v1h-1zM34 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM10 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM14 7h1v1h-1zM17 7h1v1h-1zM18 7h1v1h-1zM19 7h1v1h-1zM22 7h1v1h-1zM24 7h1v1h-1zM26 7h1v1h-1zM28 7h1v1h-1zM34 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM26 8h1v1h-1zM28 8h1v1h-1zM29 8h1v1h-1zM30 8h1v1h-1zM31 8h1v1h-1zM32 8h1v1h-1zM33 8h1v1h-1zM34 8h1v1h-1zM10 9h1v1h-1zM12 9h1v1h-1zM13 9h1v1h-1zM16 9h1v1h-1zM17 9h1v1h-1zM23 9h1v1h-1zM24 9h1v1h-1zM2 10h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM11 10h1v1h-1zM15 10h1v1h-1zM17 10h1v1h-1zM18 10h1v1h-1zM19 10h1v1h-1zM24 10h1v1h-1zM26 10h1v1h-1zM28 10h1v1h-1zM29 10h1v1h-1zM30 10h1v1h-1zM31 10h1v1h-1zM32 10h1v1h-1zM5 11h1v1h-1zM7 11h1v1h-1zM9 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM16 11h1v1h-1zM20 11h1v1h-1zM21 11h1v1h-1zM22 11h1v1h-1zM23 11h1v1h-1zM25 11h1v1h-1zM26 11h1v1h-1zM28 11h1v1h-1zM29 11h1v1h-1zM31 11h1v1h-1zM32 11h1v1h-1zM33 11h1v1h-1zM34 11h1v1h-1zM2 12h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM11 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM17 12h1v1h-1zM20 12h1v1h-1zM23 12h1v1h-1zM27 12h1v1h-1zM30 12h1v1h-1zM32 12h1v1h-1zM2 13h1v1h-1zM3 13h1v1h-1zM4 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM16 13h1v1h-1zM17 13h1v1h-1zM18 13h1v1h-1zM21 13h1v1h-1zM22 13h1v1h-1zM23 13h1v1h-1zM25 13h1v1h-1zM26 13h1v1h-1zM30 13h1v1h-1zM31 13h1v1h-1zM32 13h1v1h-1zM34 13h1v1h-1zM2 14h1v1h-1zM3 14h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM8 14h1v1h-1zM9 14h1v1h-1zM12 14h1v1h-1zM14 14h1v1h-1zM17 14h1v1h-1zM20 14h1v1h-1zM21 14h1v1h-1zM30 14h1v1h-1zM31 14h1v1h-1zM3 15h1v1h-1zM7 15h1v1h-1zM11 15h1v1h-1zM12 15h1v1h-1zM13 15h1v1h-1zM14 15h1v1h-1zM15 15h1v1h-1zM16 15h1v1h-1zM17 15h1v1h-1zM18 15h1v1h-1zM19 15h1v1h-1zM22 15h1v1h-1zM24 15h1v1h-1zM25 15h1v1h-1zM26 15h1v1h-1zM27 15h1v1h-1zM28 15h1v1h-1zM29 15h1v1h-1zM32 15h1v1h-1zM33 15h1v1h-1zM34 15h1v1h-1zM2 16h1v1h-1zM4 16h1v1h-1zM8 16h1v1h-1zM9 16h1v1h-1zM11 16h1v1h-1zM12 16h1v1h-1zM15 16h1v1h-1zM21 16h1v1h-1zM24 16h1v1h-1zM27 16h1v1h-1zM28 16h1v1h-1zM29 16h1v1h-1zM30 16h1v1h-1zM32 16h1v1h-1zM33 16h1v1h-1zM2 17h1v1h-1zM11 17h1v1h-1zM12 17h1v1h-1zM14 17h1v1h-1zM15 17h1v1h-1zM16 17h1v1h-1zM18 17h1v1h-1zM21 17h1v1h-1zM22 17h1v1h-1zM23 17h1v1h-1zM24 17h1v1h-1zM25 17h1v1h-1zM26 17h1v1h-1zM27 17h1v1h-1zM28 17h1v1h-1zM32 17h1v1h-1zM5 18h1v1h-1zM6 18h1v1h-1zM7 18h1v1h-1zM8 18h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM13 18h1v1h-1zM19 18h1v1h-1zM20 18h1v1h-1zM21 18h1v1h-1zM24 18h1v1h-1zM27 18h1v1h-1zM29 18h1v1h-1zM30 18h1v1h-1zM31 18h1v1h-1zM34 18h1v1h-1zM12 19h1v1h-1zM14 19h1v1h-1zM15 19h1v1h-1zM18 19h1v1h-1zM19 19h1v1h-1zM20 19h1v1h-1zM21 19h1v1h-1zM23 19h1v1h-1zM25 19h1v1h-1zM28 19h1v1h-1zM29 19h1v1h-1zM31 19h1v1h-1zM32 19h1v1h-1zM33 19h1v1h-1zM34 19h1v1h-1zM2 20h1v1h-1zM3 20h1v1h-1zM4 20h1v1h-1zM6 20h1v1h-1zM7 20h1v1h-1zM8 20h1v1h-1zM9 20h1v1h-1zM13 20h1v1h-1zM14 20h1v1h-1zM15 20h1v1h-1zM16 20h1v1h-1zM17 20h1v1h-1zM18 20h1v1h-1zM19 20h1v1h-1zM22 20h1v1h-1zM26 20h1v1h-1zM27 20h1v1h-1zM29 20h1v1h-1zM30 20h1v1h-1zM32 20h1v1h-1zM3 21h1v1h-1zM5 21h1v1h-1zM6 21h1v1h-1zM10 21h1v1h-1zM12 21h1v1h-1zM16 21h1v1h-1zM17 21h1v1h-1zM19 21h1v1h-1zM20 21h1v1h-1zM22 21h1v1h-1zM23 21h1v1h-1zM24 21h1v1h-1zM26 21h1v1h-1zM27 21h1v1h-1zM29 21h1v1h-1zM30 21h1v1h-1zM31 21h1v1h-1zM32 21h1v1h-1zM33 21h1v1h-1zM34 21h1v1h-1zM2 22h1v1h-1zM3 22h1v1h-1zM5 22h1v1h-1zM7 22h1v1h-1zM8 22h1v1h-1zM9 22h1v1h-1zM10 22h1v1h-1zM18 22h1v1h-1zM22 22h1v1h-1zM30 22h1v1h-1zM31 22h1v1h-1zM2 23h1v1h-1zM3 23h1v1h-1zM4 23h1v1h-1zM6 23h1v1h-1zM7 23h1v1h-1zM12 23h1v1h-1zM15 23h1v1h-1zM16 23h1v1h-1zM17 23h1v1h-1zM19 23h1v1h-1zM20 23h1v1h-1zM24 23h1v1h-1zM25 23h1v1h-1zM26 23h1v1h-1zM27 23h1v1h-1zM28 23h1v1h-1zM29 23h1v1h-1zM31 23h1v1h-1zM32 23h1v1h-1zM34 23h1v1h-1zM2 24h1v1h-1zM4 24h1v1h-1zM6 24h1v1h-1zM7 24h1v1h-1zM8 24h1v1h-1zM13 24h1v1h-1zM15 24h1v1h-1zM17 24h1v1h-1zM18 24h1v1h-1zM19 24h1v1h-1zM22 24h1v1h-1zM24 24h1v1h-1zM27 24h1v1h-1zM28 24h1v1h-1zM31 24h1v1h-1zM32 24h1v1h-1zM33 24h1v1h-1zM2 25h1v1h-1zM5 25h1v1h-1zM7 25h1v1h-1zM9 25h1v1h-1zM11 25h1v1h-1zM13 25h1v1h-1zM14 25h1v1h-1zM15 25h1v1h-1zM17 25h1v1h-1zM23 25h1v1h-1zM24 25h1v1h-1zM26 25h1v1h-1zM27 25h1v1h-1zM29 25h1v1h-1zM30 25h1v1h-1zM32 25h1v1h-1zM2 26h1v1h-1zM5 26h1v1h-1zM6 26h1v1h-1zM7 26h1v1h-1zM8 26h1v1h-1zM9 26h1v1h-1zM10 26h1v1h-1zM11 26h1v1h-1zM13 26h1v1h-1zM14 26h1v1h-1zM16 26h1v1h-1zM17 26h1v1h-1zM19 26h1v1h-1zM20 26h1v1h-1zM24 26h1v1h-1zM26 26h1v1h-1zM27 26h1v1h-1zM28 26h1v1h-1zM29 26h1v1h-1zM30 26h1v1h-1zM31 26h1v1h-1zM10 27h1v1h-1zM12 27h1v1h-1zM18 27h1v1h-1zM21 27h1v1h-1zM22 27h1v1h-1zM23 27h1v1h-1zM25 27h1v1h-1zM26 27h1v1h-1zM30 27h1v1h-1zM32 27h1v1h-1zM33 27h1v1h-1zM34 27h1v1h-1zM2 28h1v1h-1zM3 28h1v1h-1zM4 28h1v1h-1zM5 28h1v1h-1zM6 28h1v1h-1zM7 28h1v1h-1zM8 28h1v1h-1zM12 28h1v1h-1zM14 28h1v1h-1zM17 28h1v1h-1zM18 28h1v1h-1zM20 28h1v1h-1zM25 28h1v1h-1zM26 28h1v1h-1zM28 28h1v1h-1zM30 28h1v1h-1zM32 28h1v1h-1zM2 29h1v1h-1zM8 29h1v1h-1zM10 29h1v1h-1zM11 29h1v1h-1zM14 29h1v1h-1zM15 29h1v1h-1zM22 29h1v1h-1zM23 29h1v1h-1zM25 29h1v1h-1zM26 29h1v1h-1zM30 29h1v1h-1zM31 29h1v1h-1zM32 29h1v1h-1zM33 29h1v1h-1zM34 29h1v1h-1zM2 30h1v1h-1zM4 30h1v1h-1zM5 30h1v1h-1zM6 30h1v1h-1zM8 30h1v1h-1zM10 30h1v1h-1zM11 30h1v1h-1zM12 30h1v1h-1zM13 30h1v1h-1zM15 30h1v1h-1zM17 30h1v1h-1zM20 30h1v1h-1zM21 30h1v1h-1zM23 30h1v1h-1zM26 30h1v1h-1zM27 30h1v1h-1zM28 30h1v1h-1zM29 30h1v1h-1zM30 30h1v1h-1zM31 30h1v1h-1zM33 30h1v1h-1zM2 31h1v1h-1zM4 31h1v1h-1zM5 31h1v1h-1zM6 31h1v1h-1zM8 31h1v1h-1zM10 31h1v1h-1zM11 31h1v1h-1zM12 31h1v1h-1zM15 31h1v1h-1zM17 31h1v1h-1zM18 31h1v1h-1zM19 31h1v1h-1zM22 31h1v1h-1zM23 31h1v1h-1zM25 31h1v1h-1zM26 31h1v1h-1zM27 31h1v1h-1zM30 31h1v1h-1zM32 31h1v1h-1zM33 31h1v1h-1zM34 31h1v1h-1zM2 32h1v1h-1zM4 32h1v1h-1zM5 32h1v1h-1zM6 32h1v1h-1zM8 32h1v1h-1zM10 32h1v1h-1zM11 32h1v1h-1zM19 32h1v1h-1zM21 32h1v1h-1zM24 32h1v1h-1zM26 32h1v1h-1zM28 32h1v1h-1zM29 32h1v1h-1zM31 32h1v1h-1zM2 33h1v1h-1zM8 33h1v1h-1zM11 33h1v1h-1zM14 33h1v1h-1zM18 33h1v1h-1zM21 33h1v1h-1zM22 33h1v1h-1zM23 33h1v1h-1zM24 33h1v1h-1zM25 33h1v1h-1zM27 33h1v1h-1zM30 33h1v1h-1zM32 33h1v1h-1zM2 34h1v1h-1zM3 34h1v1h-1zM4 34h1v1h-1zM5 34h1v1h-1zM6 34h1v1h-1zM7 34h1v1h-1zM8 34h1v1h-1zM10 34h1v1h-1zM11 34h1v1h-1zM12 34h1v1h-1zM13 34h1v1h-1zM14 34h1v1h-1zM15 34h1v1h-1zM16 34h1v1h-1zM19 34h1v1h-1zM21 34h1v1h-1zM24 34h1v1h-1zM26 34h1v1h-1zM29 34h1v1h-1zM31 34h1v1h-1zM33 34h1v1h-1z" fill="#0f1722"/></svg>';

  /* ---------- Açık / kapalı (İstanbul saati) ---------- */
  function acikMi() {
    var acik = false;
    try {
      var p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date()), o = {};
      p.forEach(function (x) { o[x.type] = x.value; });
      var dk = +o.hour * 60 + +o.minute; acik = o.weekday !== "Sun" && dk >= 510 && dk < 1080;
    } catch (e) {}
    $$(".acik-nokta").forEach(function (n) { n.classList.toggle("kapali", !acik); });
    $$(".acik-yazi").forEach(function (n) { n.textContent = t(acik ? "acik" : "kapali"); });
  }

  /* ---------- Hesaplayıcılar ---------- */
  var kParaB = "TRY";
  function paraY(n, p) { if (p === "TRY") return tl(n); return new Intl.NumberFormat(yerel(), { style: "currency", currency: p, maximumFractionDigits: 0 }).format(n); }
  function hesapKira() {
    var b = kParaB === "EUR" ? 1 / KUR : 1;
    var alim = +$("#rAlim").value * b, kira = +$("#rKiray").value * b, dol = +$("#rDol").value / 100, gid = +$("#rGider").value * b;
    $("#oAlim").textContent = paraY(alim, kParaB); $("#oKiray").textContent = paraY(kira, kParaB); $("#oDol").textContent = "%" + $("#rDol").value; $("#oGider").textContent = paraY(gid, kParaB);
    var yb = kira * 12 * dol, yn = yb - gid;
    $("#sBrut").textContent = "%" + sayi(yb / alim * 100, 1); $("#sNet").textContent = "%" + sayi(yn / alim * 100, 1);
    $("#sYil").textContent = paraY(yn, kParaB); $("#sAmorti").textContent = yn > 0 ? sayi(alim / yn, 1) + " " + t("yil") : "—";
    if (dil !== "tr") { $("#oDol").textContent = $("#rDol").value + "%"; $("#sBrut").textContent = sayi(yb / alim * 100, 1) + "%"; $("#sNet").textContent = sayi(yn / alim * 100, 1) + "%"; }
  }
  function hesapKredi() {
    var P = +$("#rTutar").value, r = +$("#rFaiz").value / 100, n = +$("#rVade").value;
    var tk = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
    $("#oTutar").textContent = tl(P); $("#oFaiz").textContent = (dil === "tr" ? "%" : "") + sayi(r * 100, 2) + (dil === "tr" ? "" : "%"); $("#oVade").textContent = n + " " + t("ay");
    $("#sTaksit").textContent = tl(tk); $("#sToplam").textContent = tl(tk * n); $("#sTfaiz").textContent = tl(tk * n - P); $("#sVade").textContent = n + " " + t("ay");
  }

  /* ---------- Panel maketi ---------- */
  var ORNEK_TALEP = [
    { g: 0, s: "09:12", k: "O. K.", ks: "yz", d: "RU", i: "AAO-101", du: "a" },
    { g: 0, s: "08:47", k: "M. Y.", ks: "wa", d: "TR", i: "AAO-103", du: "y" },
    { g: 1, s: "21:30", k: "J. S.", ks: "ig", d: "EN", i: "AAO-110", du: "a" },
    { g: 1, s: "17:05", k: "H. B.", ks: "form", d: "DE", i: "il_deger:kargicak", du: "t" },
    { g: 1, s: "11:20", k: "A. D.", ks: "rnd", d: "TR", i: "AAO-108", du: "t" },
    { g: 2, s: "19:44", k: "D. P.", ks: "yz", d: "RU", i: "il_oturum", du: "a" }
  ];
  var TABAN = { kaynak: { yz: 6, wa: 5, form: 3, rnd: 2, ig: 2 }, dil: { TR: 7, RU: 5, EN: 4, DE: 2 }, rnd: 5 };
  var canli = [];
  function gunAd(g) { if (g === 0) return t("zm_bugun"); if (g === 1) return t("zm_dun"); var d = new Date(); d.setDate(d.getDate() - g); return d.toLocaleDateString(yerel(), { weekday: "short" }); }
  function ilgiAd(x) { if (!x) return t("il_genel"); if (x.indexOf("il_") === 0) { var p = x.split(":"); return t(p[0]) + (p[1] ? " · " + bolgeAd(p[1]) : ""); } return x; }
  function panelEkle(ks, dl, ilgi, kisi, du) {
    canli.unshift({ yeni: true, ks: ks, d: dl, i: ilgi, k: kisi || "—", du: du || "y" });
    panelCiz();
  }
  function panelCiz() {
    var kay = JSON.parse(JSON.stringify(TABAN.kaynak)), dl = JSON.parse(JSON.stringify(TABAN.dil)), rnd = TABAN.rnd;
    canli.forEach(function (c) { kay[c.ks] = (kay[c.ks] || 0) + 1; dl[c.d] = (dl[c.d] || 0) + 1; if (c.ks === "rnd") rnd++; });
    var top = 0; for (var x in kay) top += kay[x];
    var yab = 0, dtop = 0; for (var y in dl) { dtop += dl[y]; if (y !== "TR") yab += dl[y]; }
    $("#kpiTalep").textContent = top; $("#kpiYab").textContent = Math.round(yab / dtop * 100) + "%"; $("#kpiRnd").textContent = rnd;
    var mx = Math.max.apply(0, Object.keys(kay).map(function (k) { return kay[k]; }));
    $("#grKaynak").innerHTML = ["yz", "wa", "form", "rnd", "ig"].map(function (k) { return '<div class="cubuk"><span>' + t("ks_" + k) + "</span><i><s style='width:" + (kay[k] / mx * 100) + "%'></s></i><em>" + kay[k] + "</em></div>"; }).join("");
    var mxd = Math.max.apply(0, Object.keys(dl).map(function (k) { return dl[k]; }));
    $("#grDil").innerHTML = ["TR", "RU", "EN", "DE"].map(function (k) { return '<div class="cubuk"><span>' + k + "</span><i><s style='width:" + (dl[k] / mxd * 100) + "%'></s></i><em>" + dl[k] + "</em></div>"; }).join("");
    $("#talepler").innerHTML = canli.concat(ORNEK_TALEP).slice(0, 9).map(function (r) {
      return "<tr" + (r.yeni ? ' class="yeni"' : "") + "><td>" + (r.yeni ? t("zm_simdi") : gunAd(r.g) + " " + r.s) + "</td><td>" + esc(r.k) + '</td><td><span class="kay ' + r.ks + '">' + t("ks_" + r.ks) + "</span></td><td>" + r.d + "</td><td>" + esc(ilgiAd(r.i)) + '</td><td><span class="durum ' + r.du + '">' + t("du_" + r.du) + "</span></td></tr>";
    }).join("");
  }

  /* ---------- Formlar ---------- */
  function telGecerli(v) { return String(v || "").replace(/[^\d]/g, "").length >= 10; }
  function maskeAd(v) { var p = String(v).trim().split(/\s+/); return p.map(function (x) { return x.charAt(0).toUpperCase() + "."; }).join(" "); }
  function talepNo(on) { return on + "-" + String(Date.now()).slice(-5); }
  function tesekkurHtml(baslikMetin, alt, satirlar, yerId, dilKod) {
    return '<div class="tesekkur" tabindex="-1"><span class="no">' + t("t_alindi").toUpperCase() + '</span><h3>' + baslikMetin + '</h3><p>' + alt + "</p><dl>" + satirlar.map(function (s) { return "<dt>" + s[0] + "</dt><dd>" + esc(s[1]) + "</dd>"; }).join("") + '</dl><p class="not">' + t("t_demo") + '</p><div class="eylem"><a class="dg ana kucuk" href="#panel">' + t("t_panel") + '</a><button class="dg ince kucuk" type="button" data-yeni="' + yerId + '">' + t("t_yeni") + "</button></div></div>";
  }
  var formYedek = {};
  function formKur(id, yerId, isle) {
    var f = $(id); formYedek[yerId] = f;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var h = isle(f);
      if (h) { $("#" + (yerId === "degerYer" ? "vHata" : "yHata")).textContent = h; return; }
    });
  }
  function hataBul(f) {
    if (!f.ad.value.trim()) return t("e_ad");
    if (!telGecerli(f.tel.value)) return t("e_tel");
    if (!f.kvkk.checked) return t("e_kvkk");
    return "";
  }

  /* ---------- Asistan ---------- */
  var sohbetEl, akis, gecmis = [], panelYazildi = false;
  var KELIME = {
    fiyat: ["fiyat", "kaç para", "kac para", "ne kadar", "bütçe", "butce", "ucuz", "price", "cost", "how much", "budget", "cheap", "цен", "стоим", "сколько", "бюджет", "preis", "kosten", "kostet", "wie viel", "wieviel", "budget"],
    tapu: ["tapu", "satın al", "satin al", "yabancı", "yabanci", "title", "deed", "buy", "foreigner", "purchase", "тапу", "купить", "покупк", "иностран", "оформ", "grundbuch", "kaufen", "ausländer", "auslander", "erwerb", "kauf"],
    oturum: ["oturum", "ikamet", "vatandaş", "vatandas", "residence", "permit", "citizenship", "visa", "внж", "вид на жительство", "гражданств", "резиденц", "aufenthalt", "staatsbürger", "visum"],
    kredi: ["kredi", "banka", "taksit", "mortgage", "loan", "finance", "bank", "instal", "кредит", "ипотек", "рассрочк", "банк", "kredit", "hypothek", "finanz", "raten"],
    randevu: ["randevu", "gezi", "görmek", "gormek", "ziyaret", "yer göster", "viewing", "visit", "appointment", "tour", "see the", "просмотр", "посмотреть", "встреч", "приехать", "besichtig", "termin", "ansehen", "besuch"],
    adres: ["adres", "nerede", "saat", "açık mı", "acik mi", "ofis", "address", "where", "hours", "open", "office", "адрес", "где", "часы", "офис", "adresse", "wo ist", "öffnungs", "büro", "buro"],
    insan: ["whatsapp", "danışman", "danisman", "insan", "aray", "human", "agent", "call", "person", "менеджер", "человек", "позвон", "консультант", "berater", "mensch", "anruf", "telefon"],
    selam: ["merhaba", "selam", "iyi günler", "hello", "hi ", "hey", "good morning", "привет", "здравств", "добрый", "hallo", "guten tag", "servus"]
  };
  var BOLGE_KELIME = { merkez: ["merkez", "saray", "centre", "center", "центр", "zentrum"], oba: ["oba", "оба"], cikcilli: ["cikcilli", "джикджилл"], tosmur: ["tosmur", "тосмур"], kestel: ["kestel", "кестел"], mahmutlar: ["mahmutlar", "махмутлар"], kargicak: ["kargıcak", "kargicak", "каргыджак"], dim: ["dim vadi", "dim valley", "dim-tal", "долина дим", "долине дим"], uzunoz: ["uzunöz", "uzunoz", "узуноз"] };
  function dilBul(m) {
    var s = " " + m.toLowerCase() + " ";
    if (/[а-яё]/i.test(m)) return "ru";
    if (/[äöüß]/.test(s) && !/[ğışç]/.test(s) || /\b(ich|und|ist|wie|was|eine?n?|kann|möchte|haben|sie|grundstück|wohnung|der|die|das|nicht)\b/.test(s)) return "de";
    if (/[ğışç]/.test(s) || /\b(ve|mi|mı|ne|için|nasıl|var|bir|kaç|istiyorum|arsa|daire)\b/.test(s)) return "tr";
    if (/\b(the|how|what|is|are|can|do|you|i|my|a|an|price|buy|want|land|flat|apartment)\b/.test(s)) return "en";
    return dil;
  }
  function niyetBul(m) {
    var s = " " + m.toLowerCase() + " ", n = [];
    for (var k in KELIME) for (var j = 0; j < KELIME[k].length; j++) if (s.indexOf(KELIME[k][j]) >= 0) { n.push(k); break; }
    var b = null;
    Object.keys(BOLGE_KELIME).some(function (bk) { return BOLGE_KELIME[bk].some(function (w) { var hit = w === "оба" ? /(^|[\s,.!?])оба([\s,.!?]|$)/.test(s) : s.indexOf(w) >= 0; if (hit) b = bk; return hit; }); });
    return { n: n, b: b };
  }
  function ts(d, k, v) { var s = S[k] ? S[k][DILLER.indexOf(d)] : k; if (v) for (var x in v) s = s.split("{" + x + "}").join(v[x]); return s; }
  var CEVAP = {
    selam: ["Merhaba, Alanya Arsa Ofisi'ne hoş geldiniz. Arsa mı daire mi bakıyorsunuz? Fiyat, tapu, oturum izni, kredi ya da yer gösterme hakkında sorabilirsiniz.", "Hello and welcome to Alanya Arsa Ofisi. Are you looking for land or an apartment? Ask me about prices, title deeds, residence permits, mortgages or viewings.", "Здравствуйте! Добро пожаловать в Alanya Arsa Ofisi. Вы ищете участок или квартиру? Спрашивайте о ценах, тапу, ВНЖ, кредитах или просмотрах.", "Hallo und willkommen bei Alanya Arsa Ofisi. Suchen Sie ein Grundstück oder eine Wohnung? Fragen Sie mich zu Preisen, Grundbuch, Aufenthalt, Finanzierung oder Besichtigungen."],
    fiyat: ["Örnek portföyümüzde daireler {d1} – {d2}, arsalar {a1} – {a2} aralığında. Bütçenizi ve bölgenizi yazarsanız uygun ilanları süzerim.", "In our sample portfolio, apartments range from {d1} to {d2} and land from {a1} to {a2}. Tell me your budget and preferred area and I'll filter suitable listings.", "В нашем примерном каталоге квартиры стоят от {d1} до {d2}, участки — от {a1} до {a2}. Напишите бюджет и район — подберу подходящие варианты.", "In unserem Beispielportfolio kosten Wohnungen {d1} bis {d2} und Grundstücke {a1} bis {a2}. Nennen Sie mir Budget und Wunschgegend, dann filtere ich passende Angebote."],
    tapu: ["Yabancı uyruklu alıcılar Türkiye'de konut ve arsa satın alabilir; işlemler tapu müdürlüğünde yapılır. Kısaca: vergi numarası, SPK lisanslı değerleme raporu, askeri bölge kontrolü, harç ödemesi ve tercüman eşliğinde imza. Tarım arazisinde yabancılar için ek şartlar vardır.", "Foreign nationals can buy homes and land in Turkey; the transfer takes place at the land registry. In short: tax number, a valuation report from an SPK-licensed company, a military zone check, payment of fees and signing with a sworn interpreter. Extra conditions apply to farmland.", "Иностранцы могут покупать в Турции жильё и землю; сделка проходит в кадастровом управлении. Кратко: налоговый номер, отчёт об оценке от компании с лицензией SPK, проверка военных зон, оплата сборов и подписание с переводчиком. Для с/х земли действуют дополнительные условия.", "Ausländer können in der Türkei Wohnungen und Grundstücke kaufen; die Umschreibung erfolgt beim Grundbuchamt. Kurz: Steuernummer, Wertgutachten eines SPK-lizenzierten Unternehmens, Prüfung militärischer Sperrgebiete, Gebühren und Unterschrift mit vereidigtem Dolmetscher. Für Agrarland gelten zusätzliche Bedingungen."],
    oturum: ["Türkiye'de konut sahibi olmak, kısa dönem ikamet izni başvurusunda dayanak olarak kullanılabilir. Konut değeri için yasal bir alt sınır uygulanır ve bazı mahalleler yeni ikamet başvurularına kapalı olabilir; ilanın uygunluğunu başvurudan önce birlikte kontrol ederiz. Vatandaşlık için ayrı ve daha yüksek bir yatırım eşiği vardır; güncel tutarı danışmanımız teyit eder.", "Owning a home in Turkey can be used as the basis for a short-term residence permit application. A legal minimum property value applies and some neighbourhoods may be closed to new residence applications, so we check a listing's eligibility with you beforehand. Citizenship by investment has a separate, higher threshold; our adviser will confirm the current amount.", "Владение жильём в Турции может быть основанием для получения краткосрочного ВНЖ. Действует установленная законом минимальная стоимость объекта, а некоторые районы могут быть закрыты для новых заявлений, поэтому мы заранее проверяем подходящий ли объект. Для гражданства действует отдельный, более высокий порог инвестиций — актуальную сумму подтвердит консультант.", "Wohneigentum in der Türkei kann als Grundlage für eine kurzfristige Aufenthaltserlaubnis dienen. Es gilt ein gesetzlicher Mindestwert der Immobilie, und manche Viertel sind für neue Anträge gesperrt – deshalb prüfen wir die Eignung vorab mit Ihnen. Für die Staatsbürgerschaft gilt eine eigene, höhere Investitionsschwelle; den aktuellen Betrag bestätigt unser Berater."],
    kredi: ["Türk bankaları belirli koşullarla konut kredisi kullandırır; yabancı alıcılar için şartlar bankaya göre değişir. Bazı yeni projelerde satıcı taksiti de var. Sayfadaki hesaplayıcıyla aylık taksidi hemen görebilirsiniz.", "Turkish banks offer mortgages under certain conditions; for foreign buyers the terms vary by bank. Some new-build projects also offer seller instalments. You can see a monthly payment right away with the calculator on this page.", "Турецкие банки выдают ипотеку на определённых условиях; для иностранцев требования зависят от банка. В некоторых новостройках есть рассрочка от продавца. Ежемесячный платёж можно сразу посчитать калькулятором на этой странице.", "Türkische Banken vergeben Immobilienkredite unter bestimmten Bedingungen; für ausländische Käufer variieren sie je nach Bank. Manche Neubauprojekte bieten auch Ratenzahlung beim Verkäufer. Die Monatsrate sehen Sie sofort mit dem Rechner auf dieser Seite."],
    randevu: ["Yer göstermeyi Pazartesi–Cumartesi 08:30–18:00 arasında planlıyoruz. Randevu formunda ilanı, tarihi, saati ve dili seçin; danışmanımız teyit için sizi arasın.", "We arrange viewings Monday to Saturday, 08:30–18:00. Choose the listing, date, time and language in the viewing form and our adviser will call to confirm.", "Просмотры проводим с понедельника по субботу, 08:30–18:00. Выберите в форме объект, дату, время и язык — консультант позвонит для подтверждения.", "Besichtigungen bieten wir Montag bis Samstag, 08:30–18:00 Uhr an. Wählen Sie im Formular Angebot, Datum, Uhrzeit und Sprache – unser Berater ruft zur Bestätigung an."],
    adres: ["Ofisimiz: Saray Mah., Gülen Sk. No: 11/A, Alanya. Pazartesi–Cumartesi 08:30–18:00 açığız, pazar kapalı. Telefon: 0533 381 96 41.", "Our office: Saray Mah., Gülen Sk. No: 11/A, Alanya. Open Monday to Saturday 08:30–18:00, closed on Sundays. Phone: +90 533 381 96 41.", "Наш офис: Saray Mah., Gülen Sk. No: 11/A, Алания. Пн–Сб 08:30–18:00, воскресенье — выходной. Телефон: +90 533 381 96 41.", "Unser Büro: Saray Mah., Gülen Sk. No: 11/A, Alanya. Geöffnet Montag bis Samstag 08:30–18:00 Uhr, sonntags geschlossen. Telefon: +90 533 381 96 41."],
    insan: ["Elbette. WhatsApp'tan yazarsanız konuşmanın özetiyle birlikte danışmanımıza iletilir ve kaldığınız yerden devam eder.", "Of course. If you message us on WhatsApp, your question goes to our adviser together with a summary of this chat.", "Конечно. Напишите нам в WhatsApp — консультант получит ваш вопрос вместе с кратким содержанием этого чата.", "Gern. Wenn Sie uns per WhatsApp schreiben, erhält unser Berater Ihre Frage zusammen mit einer Zusammenfassung dieses Chats."],
    bolge: ["{b} bölgesindeki örnek ilanlarımız ({n}):", "Sample listings in {b} ({n}):", "Примеры объектов в районе {b} ({n}):", "Beispielangebote in {b} ({n}):"],
    yok: ["Bu soruyu danışmanımıza iletmem daha doğru olur; uydurma bilgi vermek istemem. WhatsApp'tan devam ederseniz kısa sürede yanıt alırsınız. Bu arada şunları sorabilirsiniz:", "It's better if I pass this question on to our adviser – I don't want to guess. Continue on WhatsApp for a quick reply. Meanwhile, you can ask me about:", "Этот вопрос лучше передать консультанту — не хочу давать неточную информацию. Продолжите в WhatsApp, и вам быстро ответят. А пока можете спросить о:", "Diese Frage gebe ich lieber an unseren Berater weiter – ich möchte nichts Falsches sagen. Schreiben Sie per WhatsApp für eine schnelle Antwort. Inzwischen können Sie mich fragen zu:"]
  };
  function aralik(tur, d) {
    var l = ILAN.filter(function (i) { return i.tur === tur; }).map(function (i) { return i.fiyat; });
    var f = function (n) { var o = YEREL[d]; var s = tlYaz(n, o); if (d !== "tr") s += " (≈ " + new Intl.NumberFormat(o, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(euroKarsilik(n)) + ")"; return s; };
    return [f(Math.min.apply(0, l)), f(Math.max.apply(0, l))];
  }
  function balon(kim, html, dugmeler) {
    var b = document.createElement("div"); b.className = "bal " + kim; b.innerHTML = html;
    if (dugmeler && dugmeler.length) { var g = document.createElement("div"); g.className = "dgs"; g.innerHTML = dugmeler.join(""); b.appendChild(g); }
    akis.appendChild(b); akis.scrollTop = akis.scrollHeight; return b;
  }
  function ozetWa(d) {
    var son = gecmis.filter(function (g) { return g.kim === "b"; }).slice(-3).map(function (g) { return "• " + g.m; }).join("\n");
    var bas = ["Merhaba, sitenizdeki asistanla konuştum. Sorularım:", "Hello, I chatted with the assistant on your website. My questions:", "Здравствуйте! Я общался(ась) с ассистентом на вашем сайте. Мои вопросы:", "Guten Tag, ich habe mit dem Assistenten auf Ihrer Website gechattet. Meine Fragen:"][DILLER.indexOf(d)];
    return waLink(bas + "\n" + son);
  }
  function dgWa(d) { return '<a class="wa-l" data-wa-sohbet href="' + ozetWa(d) + '" target="_blank" rel="noopener">' + ts(d, "c_wa") + "</a>"; }
  function dgGit(d, k, hedef) { return '<button type="button" data-git="' + hedef + '">' + ts(d, k) + "</button>"; }
  function cevapla(m) {
    var d = dilBul(m), r = niyetBul(m), n = r.n, dk = DILLER.indexOf(d), parca = [], dg = [];
    if (!panelYazildi) { panelYazildi = true; panelEkle("yz", d.toUpperCase(), r.b ? "il_deger:" + r.b : n.indexOf("oturum") >= 0 ? "il_oturum" : null, ["Ziyaretçi", "Visitor", "Посетитель", "Besucher"][dk]); }
    if (r.b) {
      var l = ILAN.filter(function (i) { return i.bolge === r.b; });
      var bt = BOLGE[r.b][dk];
      parca.push(CEVAP.bolge[dk].replace("{b}", bt).replace("{n}", l.length) + "\n" + l.slice(0, 3).map(function (i) { var o = YEREL[d], f = tlYaz(i.fiyat, o) + (d !== "tr" ? " (≈ " + new Intl.NumberFormat(o, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(euroKarsilik(i.fiyat)) + ")" : ""); return "• " + i.no + " · " + i.b[dk] + " — " + f; }).join("\n"));
      dg.push('<button type="button" data-bolge-git="' + r.b + '">' + ts(d, "c_bolge") + "</button>");
      n = n.filter(function (x) { return x !== "fiyat"; });
    }
    var sira = ["fiyat", "tapu", "oturum", "kredi", "randevu", "adres", "insan"];
    sira.forEach(function (k) {
      if (n.indexOf(k) < 0) return;
      if (k === "fiyat") { var a = aralik("daire", d), b = aralik("arsa", d); parca.push(CEVAP.fiyat[dk].replace("{d1}", a[0]).replace("{d2}", a[1]).replace("{a1}", b[0]).replace("{a2}", b[1])); dg.push(dgGit(d, "c_portfoy", "#portfoy")); }
      else { parca.push(CEVAP[k][dk]); if (k === "tapu") dg.push(dgGit(d, "c_rehber", "#rehber")); if (k === "kredi") dg.push(dgGit(d, "c_hesap", "#hesapla")); if (k === "randevu") dg.push(dgGit(d, "c_form", "#randevu")); }
    });
    if (!parca.length && n.indexOf("selam") >= 0) parca.push(CEVAP.selam[dk]);
    var bilinmez = !parca.length;
    if (bilinmez) parca.push(CEVAP.yok[dk]);
    dg.push(dgWa(d));
    return { m: parca.join("\n\n"), dg: dg, d: d, hizli: bilinmez };
  }
  function sor(m) {
    m = String(m || "").trim(); if (!m) return;
    gecmis.push({ kim: "b", m: m }); balon("b", esc(m));
    var y = balon("o", '<span class="yaziyor"><i></i><i></i><i></i></span>'); y.style.padding = "0";
    setTimeout(function () {
      var c = cevapla(m); y.remove(); y.style.padding = "";
      var b = balon("o", esc(c.m), c.dg);
      gecmis.push({ kim: "o", m: c.m });
      if (c.hizli) hizliKur(c.d);
    }, 650);
  }
  function hizliKur(d) {
    d = d || dil;
    var k = ["c_fiyat", "c_tapu", "c_oturum", "c_kredi", "c_randevu"];
    $(".s-hizli", sohbetEl).innerHTML = k.map(function (x) { return '<button type="button" data-hizli="' + x + '">' + ts(d, x) + "</button>"; }).join("");
  }
  var HIZLI_SORU = { c_fiyat: ["Fiyatlar ne kadar?", "How much are the prices?", "Сколько стоят объекты?", "Wie hoch sind die Preise?"], c_tapu: ["Yabancı olarak tapu alabilir miyim?", "Can I buy a title deed as a foreigner?", "Может ли иностранец оформить тапу?", "Kann ich als Ausländer ins Grundbuch eingetragen werden?"], c_oturum: ["Ev alırsam oturum izni alabilir miyim?", "Can I get a residence permit if I buy a home?", "Можно ли получить ВНЖ при покупке жилья?", "Bekomme ich mit einer Wohnung eine Aufenthaltserlaubnis?"], c_kredi: ["Kredi ile alabilir miyim?", "Can I buy with a mortgage?", "Можно ли купить в ипотеку?", "Kann ich mit einem Kredit kaufen?"], c_randevu: ["Yer görmek için randevu almak istiyorum.", "I'd like to book a viewing.", "Хочу записаться на просмотр.", "Ich möchte eine Besichtigung vereinbaren."] };
  function sohbetKur() {
    sohbetEl = document.createElement("div"); sohbetEl.className = "sohbet";
    sohbetEl.innerHTML = '<div class="s-bas"><span class="av">AO</span><div><b class="s-ad"></b><small><i class="nokta"></i><span class="s-durum"></span></small></div><div class="sag"><button class="ib s-sifir" type="button" title="">↺</button><button class="ib s-kapat gizli" type="button" aria-label="✕">✕</button></div></div>' +
      '<div class="s-akis" aria-live="polite"></div><div class="s-hizli"></div><form class="s-form"><input type="text" autocomplete="off" maxlength="300"><button type="submit"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg></button></form>';
    akis = $(".s-akis", sohbetEl);
    $("#sohbetYer").appendChild(sohbetEl);
    $(".s-form", sohbetEl).addEventListener("submit", function (e) { e.preventDefault(); var i = $("input", this); sor(i.value); i.value = ""; });
    sohbetEl.addEventListener("click", function (e) {
      var h = e.target.closest("[data-hizli]"); if (h) { sor(HIZLI_SORU[h.dataset.hizli][di()]); return; }
      var g = e.target.closest("[data-git]"); if (g) { sohbetPenKapat(); var hedef = $(g.dataset.git); if (hedef) hedef.scrollIntoView({ behavior: "smooth" }); if (g.dataset.git === "#hesapla") sekme("kredi"); return; }
      var bg = e.target.closest("[data-bolge-git]"); if (bg) { sohbetPenKapat(); $("#fBolge").value = bg.dataset.bolgeGit; cizIzgara(); $("#portfoy").scrollIntoView({ behavior: "smooth" }); return; }
      var w = e.target.closest("[data-wa-sohbet]"); if (w) { w.href = ozetWa(dilBul(gecmis.length ? gecmis.filter(function (x) { return x.kim === "b"; }).slice(-1)[0].m : "") ); panelEkle("wa", dil.toUpperCase(), null, "—"); }
      if (e.target.closest(".s-sifir")) { akis.innerHTML = ""; gecmis = []; ilkMesaj(); }
      if (e.target.closest(".s-kapat")) sohbetPenKapat();
    });
    ilkMesaj();
  }
  function ilkMesaj() { balon("o", esc(CEVAP.selam[di()])); hizliKur(); }
  function sohbetDil() {
    if (!sohbetEl) return;
    $(".s-ad", sohbetEl).textContent = t("a_ad"); $(".s-durum", sohbetEl).textContent = t("a_durum");
    $("input", sohbetEl).placeholder = t("a_yaz"); $(".s-form button", sohbetEl).setAttribute("aria-label", t("a_gonder")); $(".s-sifir", sohbetEl).title = t("a_temizle"); $(".s-sifir", sohbetEl).setAttribute("aria-label", t("a_temizle"));
    if (gecmis.length === 0) { akis.innerHTML = ""; ilkMesaj(); } else hizliKur();
  }
  function sohbetPenAc() { var p = $("#sohbetPen"); p.appendChild(sohbetEl); p.classList.add("acik"); $(".s-kapat", sohbetEl).classList.remove("gizli"); $("#balonDg").setAttribute("aria-expanded", "true"); setTimeout(function () { $("input", sohbetEl).focus(); }, 50); }
  function sohbetPenKapat() { var p = $("#sohbetPen"); if (!p.classList.contains("acik")) return; p.classList.remove("acik"); $("#sohbetYer").appendChild(sohbetEl); $(".s-kapat", sohbetEl).classList.add("gizli"); $("#balonDg").setAttribute("aria-expanded", "false"); }

  /* ---------- Hesap sekmeleri ---------- */
  function sekme(ad) {
    $$(".sekmeler button").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.sekme === ad); });
    $("#hKira").classList.toggle("gizli", ad !== "kira"); $("#hKredi").classList.toggle("gizli", ad !== "kredi");
  }

  /* ---------- Konum bölümü ilan seçici ---------- */
  var anaKonum = null;
  function ilanSecKur() { var s = $("#kIlan"), v = s.value || "MAH-528"; s.innerHTML = ILAN.map(function (i) { return '<option value="' + i.no + '">' + i.no + " · " + esc(baslik(i)) + "</option>"; }).join(""); s.value = v; }

  /* ---------- Olaylar ---------- */
  function olaylar() {
    var ust = $("#ust");
    var kay = function () { ust.classList.toggle("dolu", window.scrollY > 40); document.body.classList.toggle("kaydi", window.scrollY > window.innerHeight * 0.55); };
    window.addEventListener("scroll", kay, { passive: true }); kay();
    $("#dilDg").addEventListener("click", function (e) { e.stopPropagation(); var a = $("#dil").classList.toggle("acik"); this.setAttribute("aria-expanded", a); });
    $$(".dil-liste button").forEach(function (b) { b.addEventListener("click", function () { $("#dil").classList.remove("acik"); dilUygula(b.dataset.dil); }); });
    document.addEventListener("click", function (e) { if (!e.target.closest("#dil")) $("#dil").classList.remove("acik"); });
    $("#hamb").addEventListener("click", function () { var a = $("#menu").classList.toggle("acik"); this.setAttribute("aria-expanded", a); });
    $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { $("#menu").classList.remove("acik"); }); });
    $("#favDg").addEventListener("click", function () { if (!favs.length) { tost(t("tost_favyok")); return; } $("#fFav").checked = true; cizIzgara(); $("#portfoy").scrollIntoView({ behavior: "smooth" }); });

    ["#fBolge", "#fM2min", "#fM2max", "#fFmin", "#fFmax", "#fImar", "#fSira", "#fFav", "#fTakas", "#fTek"].forEach(function (s) { $(s).addEventListener("change", cizIzgara); });
    $$("#fTur button").forEach(function (b) { b.addEventListener("click", function () { F.tur = b.dataset.v; $$("#fTur button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); cizIzgara(); }); });
    $("#fTemizle").addEventListener("click", function () { ["#fBolge", "#fM2min", "#fM2max", "#fFmin", "#fFmax", "#fImar"].forEach(function (s) { $(s).selectedIndex = 0; }); $("#fSira").value = "oner"; ["#fFav", "#fTakas", "#fTek"].forEach(function (s) { $(s).checked = false; }); F.tur = ""; $$("#fTur button").forEach(function (x, k) { x.setAttribute("aria-pressed", k === 0); }); cizIzgara(); });
    $("#heroAra").addEventListener("submit", function (e) {
      e.preventDefault();
      $("#fBolge").value = $("#hBolge").value; F.tur = $("#hTur").value; $$("#fTur button").forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.v === F.tur); });
      var b = ($("#hButce").value || "0-0").split("-"); $("#fFmin").value = b[0] || 0; $("#fFmax").value = b[1] || 0;
      if ($("#fFmin").selectedIndex < 0) $("#fFmin").selectedIndex = 0; if ($("#fFmax").selectedIndex < 0) $("#fFmax").selectedIndex = 0;
      cizIzgara(); $("#portfoy").scrollIntoView({ behavior: "smooth" });
    });

    document.addEventListener("click", function (e) {
      var f = e.target.closest("[data-fav]"); if (f) { e.preventDefault(); favDegis(f.dataset.fav); return; }
      var a = e.target.closest("[data-ac]"); if (a) { if ($("#kars").open) $("#kars").close(); detayAc(a.dataset.ac); return; }
      var k = e.target.closest("[data-kapat]"); if (k) { var d = k.closest("dialog"); if (d) d.close(); return; }
      var g = e.target.closest("[data-g]"); if (g && detayAcik) { var i = ilanBul(detayAcik), n = galeriListe(i).length; galeriK = (galeriK + +g.dataset.g + n) % n; galeriCiz(i); return; }
      var gk = e.target.closest("[data-gk]"); if (gk && detayAcik) { galeriK = +gk.dataset.gk; galeriCiz(ilanBul(detayAcik)); return; }
      var r = e.target.closest("[data-randevu]"); if (r) { $("#yIlan").value = r.dataset.randevu; detayKapat(); $("#randevu").scrollIntoView({ behavior: "smooth" }); return; }
      var w = e.target.closest("[data-wa]"); if (w) { panelEkle("wa", dil.toUpperCase(), w.dataset.wa, "—"); return; }
      var wg = e.target.closest(".wa-genel"); if (wg) { panelEkle("wa", dil.toUpperCase(), null, "—"); return; }
      var y = e.target.closest("[data-yeni]"); if (y) { var yer = $("#" + y.dataset.yeni); yer.innerHTML = ""; var fm = formYedek[y.dataset.yeni]; fm.reset(); yer.appendChild(fm); return; }
      var s = e.target.closest("[data-sor]"); if (s) { sor(s.dataset.sor); if (window.innerWidth < 900) $("#sohbetYer").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    });
    document.addEventListener("change", function (e) { var c = e.target.closest("[data-kars]"); if (c) karsDegis(c.dataset.kars, c.checked, c); });
    $("#kGor").addEventListener("click", karsAc);
    $("#kTemiz").addEventListener("click", function () { kars = []; $$("[data-kars]").forEach(function (c) { c.checked = false; }); karsBar(); });
    ["#detay", "#kars"].forEach(function (id) { $(id).addEventListener("click", function (e) { if (e.target === this) this.close(); }); });

    $("#balonDg").addEventListener("click", function () { if ($("#sohbetPen").classList.contains("acik")) sohbetPenKapat(); else sohbetPenAc(); });

    $$(".sekmeler button").forEach(function (b) { b.addEventListener("click", function () { sekme(b.dataset.sekme); }); });
    ["#rAlim", "#rKiray", "#rDol", "#rGider"].forEach(function (s) { $(s).addEventListener("input", hesapKira); });
    ["#rTutar", "#rFaiz", "#rVade"].forEach(function (s) { $(s).addEventListener("input", hesapKredi); });
    $$("#kPara button").forEach(function (b) { b.addEventListener("click", function () { kParaB = b.dataset.p; $$("#kPara button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); hesapKira(); }); });

    $$(".harita-sek button").forEach(function (b) { b.addEventListener("click", function () { $$(".harita-sek button").forEach(function (x) { x.setAttribute("aria-selected", x === b); }); var fr = $("#ofisHarita"); fr.src = fr.dataset[b.dataset.h]; }); });

    $("#kIlan").addEventListener("change", function () { if (anaKonum) anaKonum.ilanDegis(ilanBul(this.value)); });
    $("#kDetay").addEventListener("click", function () { detayAc($("#kIlan").value); });

    // Formlar
    var yarin = new Date(); yarin.setDate(yarin.getDate() + 1); $("#yTarih").min = yarin.toISOString().slice(0, 10);
    formKur("#degerForm", "degerYer", function (f) {
      var h = hataBul(f); if (h) return h;
      var no = talepNo("DG"), yer = $("#degerYer");
      var sat = [[t("t_no"), no], [t("f_bolge"), f.bolge.options[f.bolge.selectedIndex].text], [t("v_tur"), f.tur.options[f.tur.selectedIndex].text], [t("f_m2"), f.m2.value ? sayi(+f.m2.value) + " m²" : "—"], [t("f_imar"), f.imar.options[f.imar.selectedIndex].text], [t("tercih_dil"), f.dil.value]];
      panelEkle("form", f.dil.value, "il_deger:" + f.bolge.value, maskeAd(f.ad.value));
      $("#vHata").textContent = "";
      formYedek.degerYer = f; f.remove(); yer.innerHTML = tesekkurHtml(t("t_tesekkur") + ", " + esc(f.ad.value.trim().split(/\s+/)[0]) + ".", t("t_deger_p"), sat, "degerYer");
      $(".tesekkur", yer).focus(); return "";
    });
    formKur("#randevuForm", "randevuYer", function (f) {
      var h = hataBul(f); if (h) return h;
      if (!f.tarih.value || f.tarih.value < f.tarih.min) return t("e_tarih");
      var gun = new Date(f.tarih.value + "T12:00:00"); if (gun.getDay() === 0) return t("e_pazar");
      var no = talepNo("RV"), yer = $("#randevuYer");
      var sat = [[t("t_no"), no], [t("y_ilan"), f.ilan.options[f.ilan.selectedIndex].text], [t("y_tarih"), gun.toLocaleDateString(yerel(), { weekday: "long", day: "numeric", month: "long" })], [t("y_saat"), f.saat.options[f.saat.selectedIndex].text], [t("y_dil"), f.dil.value]];
      panelEkle("rnd", f.dil.value, f.ilan.value || null, maskeAd(f.ad.value));
      $("#yHata").textContent = "";
      f.remove(); yer.innerHTML = tesekkurHtml(t("t_tesekkur") + ", " + esc(f.ad.value.trim().split(/\s+/)[0]) + ".", t("t_rnd_p"), sat, "randevuYer");
      $(".tesekkur", yer).focus(); return "";
    });

    // Giriş hareketleri
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (g) { g.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("gor"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
      $$(".gir-y,.gir-x,.gir-o").forEach(function (e) { io.observe(e); });
    } else $$(".gir-y,.gir-x,.gir-o").forEach(function (e) { e.classList.add("gor"); });
    setInterval(acikMi, 60000);
  }

  /* ---------- Video vitrini ---------- */
  function vitrinKur() {
    var i = ilanBul("MAH-528"), y = $("#vitrinVideo"); if (!i || !y) return;
    y.innerHTML = videoHtml(i, "vitrin-v");
    $("#vitrinDg").setAttribute("data-ac", i.no);
    $("#vitrinWa").setAttribute("data-wa", i.no);
  }
  function vitrinDil() { var i = ilanBul("MAH-528"), w = $("#vitrinWa"); if (i && w) w.href = waIlan(i); }
  document.addEventListener("play", function (e) {
    if (!e.target || e.target.tagName !== "VIDEO") return;
    $$("video").forEach(function (v) { if (v !== e.target && !v.paused) v.pause(); });
    try { if (window.djIzle) window.djIzle("video:" + (e.target.getAttribute("data-video") || "")); } catch (x) {}
  }, true);

  /* ---------- Başlat ---------- */
  window.AAO = { ILAN: ILAN, t: t, tl: tl, eur: eur, sayi: sayi, imarAd: imarAd, baslik: baslik, euroKarsilik: euroKarsilik, parselKoord: parselKoord, dil: function () { return dil; }, yerel: yerel, waIlan: waIlan, ilanBul: ilanBul, detayAc: function (n) { detayAc(n); }, panelEkle: panelEkle };
  function baslat() {
    var kayitli = depoOku("aao-dil", null), ilk = kayitli;
    if (!ilk) { var nl = (navigator.language || "tr").slice(0, 2).toLowerCase(); ilk = DILLER.indexOf(nl) >= 0 ? nl : "tr"; }
    try { var q = new URLSearchParams(location.search).get("dil"); if (q && DILLER.indexOf(q) >= 0) ilk = q; } catch (e) {}
    $("#qrKod").innerHTML = QR;
    yildizKur(); vitrinKur(); sohbetKur(); olaylar();
    dilUygula(ilk, true);
    if (window.AAOKonum) anaKonum = window.AAOKonum.kur($("#konumAna"), ilanBul($("#kIlan").value), { ana: true });
    else document.addEventListener("aao-konum-hazir", function () { anaKonum = window.AAOKonum.kur($("#konumAna"), ilanBul($("#kIlan").value), { ana: true }); }, { once: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", baslat); else baslat();
})();
