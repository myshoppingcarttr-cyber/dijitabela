/* Laz Rent A Car — ortak motor (rezervasyon, karşılama, dijital teslim, dil, SSS)
   Örnek tasarım · Dijitabela. Fiyatlar örnektir. */
(function () {
  'use strict';
  var WA = '905535446161';
  var TEL = '0553 544 61 61';

  /* ---------- FİLO (araçlar firmanın Google fotoğraflarından tanındı) ---------- */
  var FILO = [
    { id: 'symbol', ad: 'Renault Symbol', sinif: 'ekonomi', img: 'symbol', gun: 1250, kisi: 5, bagaj: 2 },
    { id: 'egea', ad: 'Fiat Egea Sedan', sinif: 'ekonomi', img: 'egea-sedan', gun: 1350, kisi: 5, bagaj: 3 },
    { id: 'p301', ad: 'Peugeot 301', sinif: 'ekonomi', img: 'peugeot-301', gun: 1350, kisi: 5, bagaj: 3 },
    { id: 'taliant', ad: 'Renault Taliant', sinif: 'ekonomi', img: 'taliant', gun: 1400, kisi: 5, bagaj: 3 },
    { id: 'accent', ad: 'Hyundai Accent Blue', sinif: 'ekonomi', img: 'accent-blue', gun: 1450, kisi: 5, bagaj: 3 },
    { id: 'i20', ad: 'Hyundai i20', sinif: 'kompakt', img: 'i20', gun: 1500, kisi: 5, bagaj: 2 },
    { id: 'clio', ad: 'Renault Clio', sinif: 'kompakt', img: 'clio-gri', gun: 1750, kisi: 5, bagaj: 2 },
    { id: 'cross', ad: 'Fiat Egea Cross', sinif: 'kompakt', img: 'egea-cross-on', gun: 1950, kisi: 5, bagaj: 3 },
    { id: 'qashqai', ad: 'Nissan Qashqai', sinif: 'suv', img: 'qashqai-on', gun: 2750, kisi: 5, bagaj: 4 },
    { id: 'scudo', ad: 'Fiat Scudo 8+1', sinif: 'minivan', img: 'scudo-yan', gun: 3900, kisi: 9, bagaj: 6 }
  ];
  var YERLER = [
    { id: 'ofis', ucret: 0 },
    { id: 't1', ucret: 500, hava: true },
    { id: 't2', ucret: 500, hava: true },
    { id: 'ic', ucret: 500, hava: true },
    { id: 'otel', ucret: 400 }
  ];
  var EKSTRA = [
    { id: 'bebek', gunluk: 150 },
    { id: 'surucu', gunluk: 100 },
    { id: 'kasko', gunluk: 400 }
  ];

  /* ---------- DİL ---------- */
  var S = {
    tr: {
      'm.filo': 'Filo', 'm.rez': 'Rezervasyon', 'm.kar': 'Havalimanı', 'm.tes': 'Dijital teslim', 'm.sss': 'Şartlar', 'm.ile': 'İletişim',
      'g.ara': 'Ara', 'g.wa': 'WhatsApp', 'g.rez': 'Rezervasyon', 'g.yol': 'Yol tarifi', 'g.sec': 'Bu aracı seç', 'g.gun': '/ gün', 'g.kisi': 'kişi', 'g.bagaj': 'bavul', 'g.ornek': 'örnek fiyat', 'g.kapat': 'Kapat',
      'g.acik': 'Şu an açık', 'g.kapali': 'Şu an kapalı', 'g.saat': 'Pzt–Cmt 08:30–23:30 · Paz 12:00–18:30', 'g.yorum': 'Google yorumu', 'g.tumyorum': 'Tüm yorumları Google’da oku',
      's.ekonomi': 'Ekonomi', 's.kompakt': 'Kompakt', 's.suv': 'SUV', 's.minivan': 'Minivan · 8+1', 's.hepsi': 'Tümü',
      'r.baslik': 'Online rezervasyon', 'r.alt': 'Aracı, yeri ve tarihi seçin; fiyat anında hesaplanır, talebiniz hazır metinle WhatsApp’a gider.',
      'r.a1': 'Araç', 'r.a2': 'Yer ve tarih', 'r.a3': 'Ekstralar', 'r.a4': 'Özet',
      'r.sinif': 'Araç sınıfı', 'r.arac': 'Araç', 'r.alis': 'Alış yeri', 'r.donus': 'Dönüş yeri', 'r.alist': 'Alış tarihi ve saati', 'r.donust': 'Dönüş tarihi ve saati',
      'r.ucus': 'Uçuş numarası', 'r.inis': 'İniş saati', 'r.otel': 'Otel adı / adres', 'r.ad': 'Ad Soyad', 'r.not': 'Notunuz (isteğe bağlı)',
      'r.ileri': 'Devam', 'r.geri': 'Geri', 'r.gonder': 'WhatsApp’tan talep gönder', 'r.toplam': 'Tahmini toplam', 'r.gunsay': 'gün', 'r.kira': 'Kira', 'r.indirim': 'Uzun kiralama indirimi', 'r.teslim': 'Teslim / alma ücreti', 'r.ekstra': 'Ekstralar',
      'r.uyari': 'Fiyatlar örnektir; kesin fiyat ve müsaitlik WhatsApp’ta onaylanır.', 'r.hata.tarih': 'Dönüş, alıştan sonra olmalı.', 'r.hata.gecmis': 'Alış zamanı geçmişte olamaz.', 'r.hata.arac': 'Lütfen bir araç seçin.', 'r.hata.ucus': 'Uçuş numarasını yazın (ör. TK 2412).', 'r.hata.otel': 'Otel adını veya adresi yazın.',
      'y.ofis': 'Ofis · Yenigün, Muratpaşa', 'y.t1': 'Antalya Havalimanı · Dış Hatlar T1', 'y.t2': 'Antalya Havalimanı · Dış Hatlar T2', 'y.ic': 'Antalya Havalimanı · İç Hatlar', 'y.otel': 'Otele / adrese teslim',
      'e.bebek': 'Bebek koltuğu', 'e.surucu': 'Ek sürücü', 'e.kasko': 'Tam kasko (muafiyetsiz)', 'e.bebek.a': 'ISOFIX, 0–4 yaş', 'e.surucu.a': 'İkinci sürücü kayda eklenir', 'e.kasko.a': 'Hasarda ek ödeme yok',
      'k.n1': 'Uçuşunuzu canlı takip ederiz', 'k.n2': 'Rötarda bekleme ücreti yok', 'k.n3': 'Adınızın yazdığı tabelayla çıkışta karşılama', 'k.baslik': 'Havalimanı karşılama', 'k.alt': 'Uçuş numaranızı ve iniş saatinizi bırakın; aracınızla terminal çıkışında bekleyelim.', 'k.terminal': 'Terminal', 'k.kisi': 'Yolcu sayısı', 'k.tarih': 'İniş tarihi', 'k.gonder': 'Karşılama talebini WhatsApp’a ekle',
      't.baslik': 'Dijital teslim kontrolü', 't.alt': 'Aracı birlikte dolaşıyoruz: şemaya dokunup çizik ve göçükleri işaretleyin, tutanak iki tarafta da kalsın.',
      't.tur': 'İşaret türü', 't.cizik': 'Çizik', 't.gocuk': 'Göçük', 't.kirik': 'Kırık / çatlak', 't.tas': 'Taş izi', 't.geri': 'Son işareti sil', 't.temizle': 'Temizle',
      't.plaka': 'Plaka', 't.km': 'Kilometre', 't.yakit': 'Yakıt', 't.tarih': 'Tarih ve saat', 't.islem': 'İşlem', 't.teslim': 'Teslim (çıkış)', 't.iade': 'İade (dönüş)', 't.not': 'Notlar', 't.musteri': 'Müşteri adı',
      't.olustur': 'Tutanağı oluştur', 't.yazdir': 'Yazdır / PDF', 't.wa': 'WhatsApp’a gönder', 't.yok': 'Henüz işaret yok. Şemaya dokunun.', 't.ozet': 'Teslim tutanağı', 't.ipucu': 'Şemada işarete dokunursanız silinir.',
      'f.baslik': 'Depozito ve kiralama şartları', 'yorum.baslik': 'Müşterilerimiz ne diyor', 'ile.baslik': 'Ofis, harita ve 360° görünüm', 'ile.adres': 'Meta Apt, Yenigün, 1055. Sk. 25/C, 07310 Muratpaşa / Antalya', 'ile.sv': '360° sokak görünümü'
    },
    en: {
      'm.filo': 'Fleet', 'm.rez': 'Booking', 'm.kar': 'Airport', 'm.tes': 'Digital handover', 'm.sss': 'Terms', 'm.ile': 'Contact',
      'g.ara': 'Call', 'g.wa': 'WhatsApp', 'g.rez': 'Book', 'g.yol': 'Directions', 'g.sec': 'Choose this car', 'g.gun': '/ day', 'g.kisi': 'seats', 'g.bagaj': 'bags', 'g.ornek': 'sample price', 'g.kapat': 'Close',
      'g.acik': 'Open now', 'g.kapali': 'Closed now', 'g.saat': 'Mon–Sat 08:30–23:30 · Sun 12:00–18:30', 'g.yorum': 'Google reviews', 'g.tumyorum': 'Read all reviews on Google',
      's.ekonomi': 'Economy', 's.kompakt': 'Compact', 's.suv': 'SUV', 's.minivan': 'Minivan · 8+1', 's.hepsi': 'All',
      'r.baslik': 'Online booking', 'r.alt': 'Pick the car, place and dates; the price is calculated instantly and your request goes to WhatsApp as a ready message.',
      'r.a1': 'Car', 'r.a2': 'Place & date', 'r.a3': 'Extras', 'r.a4': 'Summary',
      'r.sinif': 'Car class', 'r.arac': 'Car', 'r.alis': 'Pick-up', 'r.donus': 'Drop-off', 'r.alist': 'Pick-up date & time', 'r.donust': 'Return date & time',
      'r.ucus': 'Flight number', 'r.inis': 'Landing time', 'r.otel': 'Hotel name / address', 'r.ad': 'Full name', 'r.not': 'Note (optional)',
      'r.ileri': 'Next', 'r.geri': 'Back', 'r.gonder': 'Send request via WhatsApp', 'r.toplam': 'Estimated total', 'r.gunsay': 'days', 'r.kira': 'Rental', 'r.indirim': 'Long-rental discount', 'r.teslim': 'Delivery / collection fee', 'r.ekstra': 'Extras',
      'r.uyari': 'Prices are samples; final price and availability are confirmed on WhatsApp.', 'r.hata.tarih': 'Return must be after pick-up.', 'r.hata.gecmis': 'Pick-up time cannot be in the past.', 'r.hata.arac': 'Please choose a car.', 'r.hata.ucus': 'Enter your flight number (e.g. TK 2412).', 'r.hata.otel': 'Enter the hotel name or address.',
      'y.ofis': 'Office · Yenigün, Muratpaşa', 'y.t1': 'Antalya Airport · Int. Terminal 1', 'y.t2': 'Antalya Airport · Int. Terminal 2', 'y.ic': 'Antalya Airport · Domestic', 'y.otel': 'Hotel / address delivery',
      'e.bebek': 'Baby seat', 'e.surucu': 'Additional driver', 'e.kasko': 'Full insurance (no excess)', 'e.bebek.a': 'ISOFIX, 0–4 yrs', 'e.surucu.a': 'Second driver registered', 'e.kasko.a': 'No extra charge for damage',
      'k.n1': 'We track your flight live', 'k.n2': 'No waiting fee for delays', 'k.n3': 'Meet at the exit with your name sign', 'k.baslik': 'Airport meet & greet', 'k.alt': 'Leave your flight number and landing time; we wait with your car at the terminal exit.', 'k.terminal': 'Terminal', 'k.kisi': 'Passengers', 'k.tarih': 'Landing date', 'k.gonder': 'Add meet & greet to WhatsApp',
      't.baslik': 'Digital handover check', 't.alt': 'We walk around the car together: tap the diagram to mark scratches and dents, both sides keep the record.',
      't.tur': 'Mark type', 't.cizik': 'Scratch', 't.gocuk': 'Dent', 't.kirik': 'Crack / broken', 't.tas': 'Stone chip', 't.geri': 'Undo last', 't.temizle': 'Clear',
      't.plaka': 'Plate', 't.km': 'Mileage', 't.yakit': 'Fuel', 't.tarih': 'Date & time', 't.islem': 'Type', 't.teslim': 'Handover (out)', 't.iade': 'Return (in)', 't.not': 'Notes', 't.musteri': 'Customer name',
      't.olustur': 'Create report', 't.yazdir': 'Print / PDF', 't.wa': 'Send to WhatsApp', 't.yok': 'No marks yet. Tap the diagram.', 't.ozet': 'Handover report', 't.ipucu': 'Tap a mark on the diagram to remove it.',
      'f.baslik': 'Deposit and rental terms', 'yorum.baslik': 'What our customers say', 'ile.baslik': 'Office, map and 360° view', 'ile.adres': 'Meta Apt, Yenigün, 1055. Sk. 25/C, 07310 Muratpaşa / Antalya', 'ile.sv': '360° street view'
    },
    de: {
      'm.filo': 'Flotte', 'm.rez': 'Buchung', 'm.kar': 'Flughafen', 'm.tes': 'Digitale Übergabe', 'm.sss': 'Bedingungen', 'm.ile': 'Kontakt',
      'g.ara': 'Anrufen', 'g.wa': 'WhatsApp', 'g.rez': 'Buchen', 'g.yol': 'Route', 'g.sec': 'Dieses Auto wählen', 'g.gun': '/ Tag', 'g.kisi': 'Sitze', 'g.bagaj': 'Koffer', 'g.ornek': 'Beispielpreis', 'g.kapat': 'Schließen',
      'g.acik': 'Jetzt geöffnet', 'g.kapali': 'Jetzt geschlossen', 'g.saat': 'Mo–Sa 08:30–23:30 · So 12:00–18:30', 'g.yorum': 'Google-Bewertungen', 'g.tumyorum': 'Alle Bewertungen bei Google',
      's.ekonomi': 'Economy', 's.kompakt': 'Kompakt', 's.suv': 'SUV', 's.minivan': 'Minivan · 8+1', 's.hepsi': 'Alle',
      'r.baslik': 'Online-Buchung', 'r.alt': 'Auto, Ort und Datum wählen; der Preis wird sofort berechnet und Ihre Anfrage geht als fertige Nachricht an WhatsApp.',
      'r.a1': 'Auto', 'r.a2': 'Ort & Datum', 'r.a3': 'Extras', 'r.a4': 'Übersicht',
      'r.sinif': 'Fahrzeugklasse', 'r.arac': 'Auto', 'r.alis': 'Abholung', 'r.donus': 'Rückgabe', 'r.alist': 'Abholdatum und -zeit', 'r.donust': 'Rückgabedatum und -zeit',
      'r.ucus': 'Flugnummer', 'r.inis': 'Landezeit', 'r.otel': 'Hotel / Adresse', 'r.ad': 'Vor- und Nachname', 'r.not': 'Notiz (optional)',
      'r.ileri': 'Weiter', 'r.geri': 'Zurück', 'r.gonder': 'Anfrage per WhatsApp senden', 'r.toplam': 'Geschätzter Gesamtpreis', 'r.gunsay': 'Tage', 'r.kira': 'Miete', 'r.indirim': 'Langzeitrabatt', 'r.teslim': 'Zustell- / Abholgebühr', 'r.ekstra': 'Extras',
      'r.uyari': 'Preise sind Beispiele; Endpreis und Verfügbarkeit werden per WhatsApp bestätigt.', 'r.hata.tarih': 'Rückgabe muss nach der Abholung liegen.', 'r.hata.gecmis': 'Abholzeit darf nicht in der Vergangenheit liegen.', 'r.hata.arac': 'Bitte ein Auto wählen.', 'r.hata.ucus': 'Flugnummer eingeben (z. B. TK 2412).', 'r.hata.otel': 'Hotel oder Adresse eingeben.',
      'y.ofis': 'Büro · Yenigün, Muratpaşa', 'y.t1': 'Flughafen Antalya · Terminal 1 (Int.)', 'y.t2': 'Flughafen Antalya · Terminal 2 (Int.)', 'y.ic': 'Flughafen Antalya · Inland', 'y.otel': 'Lieferung zum Hotel / zur Adresse',
      'e.bebek': 'Kindersitz', 'e.surucu': 'Zusatzfahrer', 'e.kasko': 'Vollkasko (ohne SB)', 'e.bebek.a': 'ISOFIX, 0–4 J.', 'e.surucu.a': 'Zweiter Fahrer eingetragen', 'e.kasko.a': 'Keine Zuzahlung bei Schaden',
      'k.n1': 'Wir verfolgen Ihren Flug live', 'k.n2': 'Keine Wartegebühr bei Verspätung', 'k.n3': 'Empfang am Ausgang mit Namensschild', 'k.baslik': 'Flughafen-Abholung', 'k.alt': 'Flugnummer und Landezeit angeben; wir warten mit Ihrem Auto am Terminalausgang.', 'k.terminal': 'Terminal', 'k.kisi': 'Passagiere', 'k.tarih': 'Landedatum', 'k.gonder': 'Abholung zu WhatsApp hinzufügen',
      't.baslik': 'Digitale Übergabeprüfung', 't.alt': 'Wir gehen gemeinsam ums Auto: Kratzer und Dellen auf der Skizze markieren, beide Seiten behalten das Protokoll.',
      't.tur': 'Markierung', 't.cizik': 'Kratzer', 't.gocuk': 'Delle', 't.kirik': 'Riss / Bruch', 't.tas': 'Steinschlag', 't.geri': 'Letzte löschen', 't.temizle': 'Leeren',
      't.plaka': 'Kennzeichen', 't.km': 'Kilometerstand', 't.yakit': 'Tank', 't.tarih': 'Datum und Uhrzeit', 't.islem': 'Vorgang', 't.teslim': 'Übergabe', 't.iade': 'Rückgabe', 't.not': 'Notizen', 't.musteri': 'Kundenname',
      't.olustur': 'Protokoll erstellen', 't.yazdir': 'Drucken / PDF', 't.wa': 'An WhatsApp senden', 't.yok': 'Noch keine Markierung. Skizze antippen.', 't.ozet': 'Übergabeprotokoll', 't.ipucu': 'Markierung antippen zum Entfernen.',
      'f.baslik': 'Kaution und Mietbedingungen', 'yorum.baslik': 'Das sagen unsere Kunden', 'ile.baslik': 'Büro, Karte und 360°-Ansicht', 'ile.adres': 'Meta Apt, Yenigün, 1055. Sk. 25/C, 07310 Muratpaşa / Antalya', 'ile.sv': '360°-Straßenansicht'
    },
    ru: {
      'm.filo': 'Автопарк', 'm.rez': 'Бронирование', 'm.kar': 'Аэропорт', 'm.tes': 'Цифровая передача', 'm.sss': 'Условия', 'm.ile': 'Контакты',
      'g.ara': 'Позвонить', 'g.wa': 'WhatsApp', 'g.rez': 'Бронь', 'g.yol': 'Маршрут', 'g.sec': 'Выбрать авто', 'g.gun': '/ сутки', 'g.kisi': 'мест', 'g.bagaj': 'чемод.', 'g.ornek': 'пример цены', 'g.kapat': 'Закрыть',
      'g.acik': 'Сейчас открыто', 'g.kapali': 'Сейчас закрыто', 'g.saat': 'Пн–Сб 08:30–23:30 · Вс 12:00–18:30', 'g.yorum': 'отзывов в Google', 'g.tumyorum': 'Все отзывы в Google',
      's.ekonomi': 'Эконом', 's.kompakt': 'Компакт', 's.suv': 'Кроссовер', 's.minivan': 'Минивэн · 8+1', 's.hepsi': 'Все',
      'r.baslik': 'Онлайн-бронирование', 'r.alt': 'Выберите авто, место и даты — цена считается сразу, заявка уходит в WhatsApp готовым сообщением.',
      'r.a1': 'Авто', 'r.a2': 'Место и дата', 'r.a3': 'Опции', 'r.a4': 'Итог',
      'r.sinif': 'Класс авто', 'r.arac': 'Авто', 'r.alis': 'Место получения', 'r.donus': 'Место возврата', 'r.alist': 'Дата и время получения', 'r.donust': 'Дата и время возврата',
      'r.ucus': 'Номер рейса', 'r.inis': 'Время посадки', 'r.otel': 'Отель / адрес', 'r.ad': 'Имя и фамилия', 'r.not': 'Комментарий (необяз.)',
      'r.ileri': 'Далее', 'r.geri': 'Назад', 'r.gonder': 'Отправить заявку в WhatsApp', 'r.toplam': 'Примерная сумма', 'r.gunsay': 'сут.', 'r.kira': 'Аренда', 'r.indirim': 'Скидка за длительную аренду', 'r.teslim': 'Доставка / забор', 'r.ekstra': 'Опции',
      'r.uyari': 'Цены примерные; точная цена и наличие подтверждаются в WhatsApp.', 'r.hata.tarih': 'Возврат должен быть позже получения.', 'r.hata.gecmis': 'Время получения не может быть в прошлом.', 'r.hata.arac': 'Выберите автомобиль.', 'r.hata.ucus': 'Укажите номер рейса (напр. TK 2412).', 'r.hata.otel': 'Укажите отель или адрес.',
      'y.ofis': 'Офис · Енигюн, Муратпаша', 'y.t1': 'Аэропорт Анталья · Терминал 1 (межд.)', 'y.t2': 'Аэропорт Анталья · Терминал 2 (межд.)', 'y.ic': 'Аэропорт Анталья · Внутр. линии', 'y.otel': 'Доставка в отель / по адресу',
      'e.bebek': 'Детское кресло', 'e.surucu': 'Доп. водитель', 'e.kasko': 'Полная страховка (без франшизы)', 'e.bebek.a': 'ISOFIX, 0–4 года', 'e.surucu.a': 'Второй водитель в договоре', 'e.kasko.a': 'Без доплат за повреждения',
      'k.n1': 'Отслеживаем ваш рейс онлайн', 'k.n2': 'Без платы за ожидание при задержке', 'k.n3': 'Встреча у выхода с табличкой с вашим именем', 'k.baslik': 'Встреча в аэропорту', 'k.alt': 'Оставьте номер рейса и время посадки — встретим с автомобилем у выхода из терминала.', 'k.terminal': 'Терминал', 'k.kisi': 'Пассажиров', 'k.tarih': 'Дата посадки', 'k.gonder': 'Добавить встречу в WhatsApp',
      't.baslik': 'Цифровой акт передачи', 't.alt': 'Осматриваем авто вместе: отметьте царапины и вмятины на схеме — акт остаётся у обеих сторон.',
      't.tur': 'Тип отметки', 't.cizik': 'Царапина', 't.gocuk': 'Вмятина', 't.kirik': 'Трещина / скол', 't.tas': 'След от камня', 't.geri': 'Удалить последнюю', 't.temizle': 'Очистить',
      't.plaka': 'Госномер', 't.km': 'Пробег', 't.yakit': 'Топливо', 't.tarih': 'Дата и время', 't.islem': 'Операция', 't.teslim': 'Выдача', 't.iade': 'Возврат', 't.not': 'Примечания', 't.musteri': 'Имя клиента',
      't.olustur': 'Создать акт', 't.yazdir': 'Печать / PDF', 't.wa': 'Отправить в WhatsApp', 't.yok': 'Отметок пока нет. Нажмите на схему.', 't.ozet': 'Акт передачи', 't.ipucu': 'Нажмите на отметку, чтобы удалить её.',
      'f.baslik': 'Депозит и условия аренды', 'yorum.baslik': 'Отзывы клиентов', 'ile.baslik': 'Офис, карта и панорама 360°', 'ile.adres': 'Meta Apt, Yenigün, 1055. Sk. 25/C, 07310 Muratpaşa / Antalya', 'ile.sv': 'Панорама 360°'
    }
  };

  /* SSS: TR + EN (DE/RU için EN gösterilir) */
  var SSS = {
    tr: [
      ['Depozito ne kadar, ne zaman iade ediliyor?', 'Örnek: ekonomi ve kompakt sınıfta 5.000 ₺, SUV ve minivanda 10.000 ₺. Tam kasko alındığında depozito yarıya iner. Araç hasarsız ve dolu depoyla döndüğünde depozito aynı gün, teslim noktasında iade edilir.'],
      ['Hangi belgeler gerekiyor?', 'Kimlik veya pasaport ve en az 2 yıllık sürücü belgesi. Yabancı misafirler için uluslararası ehliyet ya da Latin harfli ulusal ehliyet yeterlidir.'],
      ['Yaş sınırı var mı?', 'Ekonomi ve kompakt sınıfta 21, SUV ve minivanda 25 yaş ve üzeri.'],
      ['Yakıt ve kilometre kuralı nedir?', 'Araç hangi seviyede alındıysa o seviyede iade edilir. Günlük 300 km sınırı vardır; uzun yol planınızı rezervasyonda yazarsanız sınırsız paket sunulur.'],
      ['Hasar olursa ne oluyor?', 'Teslimde ve iadede aracı birlikte dolaşıp dijital teslim tutanağını dolduruyoruz; işaretlenen her nokta fotoğraf ve saatle iki tarafa da gönderilir. Tam kaskoda muafiyet ödenmez; kaza durumunda polis veya anlaşmalı tutanak gerekir.'],
      ['Havalimanına teslim yapıyor musunuz?', 'Evet. Dış Hatlar T1, T2 ve İç Hatlar’da uçuşunuzu takip ederek terminal çıkışında karşılıyoruz. Rötar olursa ek ücret yoktur.'],
      ['Ödeme nasıl yapılıyor?', 'Nakit, banka kartı veya kredi kartı. Rezervasyon için ön ödeme alınmaz; talebiniz WhatsApp’ta onaylanır.']
    ],
    en: [
      ['How much is the deposit and when is it returned?', 'Sample: 5,000 TRY for economy and compact, 10,000 TRY for SUV and minivan. Full insurance halves the deposit. It is refunded the same day at the return point when the car comes back undamaged with the same fuel level.'],
      ['Which documents do I need?', 'ID or passport and a driving licence held for at least 2 years. International licence or a national licence in Latin letters is accepted.'],
      ['Is there an age limit?', '21+ for economy and compact, 25+ for SUV and minivan.'],
      ['Fuel and mileage policy?', 'Return the car with the same fuel level. 300 km per day is included; unlimited packages are available for long trips.'],
      ['What happens if there is damage?', 'At handover and return we walk around the car together and fill in the digital handover report; every mark is shared with both sides with time stamp. With full insurance no excess is charged; an accident requires a police or mutual report.'],
      ['Do you deliver to the airport?', 'Yes. We track your flight and meet you at the exit of Int. T1, T2 or Domestic. No extra charge for delays.'],
      ['How do I pay?', 'Cash, debit or credit card. No prepayment for booking; your request is confirmed on WhatsApp.']
    ]
  };

  var YORUMLAR = [
    ['E.A.', { tr: 'Antalya tatilim sırasında araç kiraladım, çok memnun kaldım. Depozito konusunda hiçbir sorun yaşamadım.' }],
    ['N.K.', { tr: 'Hizmetleri ve araçlarının konforundan bir kadın sürücü olarak çok memnun kaldım. Gönül rahatlığı ile tercih edebilirsiniz.' }],
    ['E.E.', { tr: 'Araçlar temiz, bakımlı ve güvenilir. Firma son derece dürüst ve müşteri odaklı çalışıyor.' }],
    ['S.B.', { tr: 'Uzun yol için araç kiraladım, sorunsuzca gittim ve geldim. Kesinlikle öneririm.' }]
  ];

  var dil = 'tr';
  try { var kd = localStorage.getItem('laz-dil'); if (kd && S[kd]) dil = kd; } catch (e) {}
  var EK = window.LAZ_EK || {};
  function t(k) { var d = (EK[dil] && EK[dil][k]) || (S[dil] && S[dil][k]); if (d == null) d = (EK.tr && EK.tr[k]) || S.tr[k] || k; return d; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function tl(n) { return Math.round(n).toLocaleString('tr-TR') + ' ₺'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function arac(id) { for (var i = 0; i < FILO.length; i++) if (FILO[i].id === id) return FILO[i]; return null; }
  function yer(id) { for (var i = 0; i < YERLER.length; i++) if (YERLER[i].id === id) return YERLER[i]; return YERLER[0]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function yerelISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function tarihYaz(v) { if (!v) return '-'; var d = new Date(v); if (isNaN(d)) return v; return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function waLink(metin) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(metin); }
  var IMG = (document.documentElement.getAttribute('data-img') || '../img/');

  /* ---------- ÇEVİRİ UYGULA ---------- */
  function cevir() {
    document.documentElement.lang = dil;
    $$('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    $$('[data-t-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-t-ph'))); });
    $$('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-t-aria'))); });
    $$('[data-dil]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-dil') === dil ? 'true' : 'false'); });
  }
  function dilSec(d) {
    if (!S[d]) return; dil = d;
    try { localStorage.setItem('laz-dil', d); } catch (e) {}
    cevir(); ciz();
    document.dispatchEvent(new CustomEvent('laz:dil', { detail: d }));
  }

  /* ---------- AÇIK / KAPALI ---------- */
  function acikMi() {
    var p;
    try {
      p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    } catch (e) { return null; }
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    var dk = parseInt(o.hour, 10) % 24 * 60 + parseInt(o.minute, 10);
    if (o.weekday === 'Sun') return dk >= 720 && dk < 1110;
    return dk >= 510 && dk < 1410;
  }
  function durumCiz() {
    var a = acikMi();
    $$('[data-laz="acik"]').forEach(function (el) {
      if (a === null) { el.hidden = true; return; }
      el.className = el.className.replace(/\s?(acik|kapali)\b/g, '') + (a ? ' acik' : ' kapali');
      el.innerHTML = '<i aria-hidden="true"></i>' + esc(a ? t('g.acik') : t('g.kapali'));
    });
  }

  /* ---------- FİLO ---------- */
  var filtre = 'hepsi';
  function filoCiz() {
    $$('[data-laz="filo"]').forEach(function (kap) {
      var siniflar = ['hepsi', 'ekonomi', 'kompakt', 'suv', 'minivan'];
      var filtreHtml = kap.hasAttribute('data-filtre') ? '<div class="filo-filtre" role="tablist">' + siniflar.map(function (s) {
        return '<button type="button" role="tab" data-sinif="' + s + '" aria-selected="' + (s === filtre) + '">' + esc(t('s.' + s)) + '</button>';
      }).join('') + '</div>' : '';
      var liste = FILO.filter(function (a) { return filtre === 'hepsi' || a.sinif === filtre; });
      kap.innerHTML = filtreHtml + '<div class="filo-liste">' + liste.map(function (a, i) {
        return '<article class="arac" data-id="' + a.id + '">' +
          '<figure class="arac-foto"><img src="' + IMG + a.img + '-k.jpg" alt="' + esc(a.ad) + '" loading="lazy" width="600" height="800"></figure>' +
          '<div class="arac-govde"><p class="arac-sinif"><span class="arac-no">' + pad(i + 1) + '</span>' + esc(t('s.' + a.sinif)) + '</p>' +
          '<h3 class="arac-ad" lang="en">' + esc(a.ad) + '</h3>' +
          '<p class="arac-ozellik"><span>' + a.kisi + ' ' + esc(t('g.kisi')) + '</span><span>' + a.bagaj + ' ' + esc(t('g.bagaj')) + '</span><span>A/C</span></p>' +
          '<p class="arac-fiyat"><b>' + tl(a.gun) + '</b> <span>' + esc(t('g.gun')) + '</span> <small>' + esc(t('g.ornek')) + '</small></p>' +
          '<button type="button" class="arac-sec" data-sec="' + a.id + '">' + esc(t('g.sec')) + '</button></div></article>';
      }).join('') + '</div>';
    });
  }
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-sinif]');
    if (f && f.closest('[data-laz="filo"]')) { filtre = f.getAttribute('data-sinif'); filoCiz(); return; }
    var s = e.target.closest('[data-sec]');
    if (s) {
      R.arac = s.getAttribute('data-sec'); R.sinif = arac(R.arac).sinif; R.adim = 1;
      rezCiz();
      var ev = new CustomEvent('laz:sec', { detail: R.arac, cancelable: true });
      if (document.dispatchEvent(ev)) { var hedef = $('#rezervasyon'); if (hedef) hedef.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    var d = e.target.closest('[data-dil]'); if (d) dilSec(d.getAttribute('data-dil'));
  });

  /* ---------- REZERVASYON SİHİRBAZI ---------- */
  var simdi = new Date(); simdi.setMinutes(0, 0, 0);
  var bas = new Date(simdi.getTime() + 24 * 3600e3); bas.setHours(10);
  var bit = new Date(bas.getTime() + 3 * 24 * 3600e3);
  var R = { adim: 0, sinif: 'ekonomi', arac: 'symbol', alis: 'ofis', donus: 'ofis', alisT: yerelISO(bas), donusT: yerelISO(bit), ucus: '', inis: '', otel: '', ek: {}, ad: '', not: '', hata: '' };

  function hesap() {
    var a = arac(R.arac);
    var ms = new Date(R.donusT) - new Date(R.alisT);
    var gun = Math.max(1, Math.ceil(ms / 864e5));
    if (!isFinite(gun)) gun = 1;
    var kira = a ? a.gun * gun : 0;
    var oran = gun >= 7 ? 0.10 : gun >= 3 ? 0.05 : 0;
    var indirim = Math.round(kira * oran);
    var teslim = yer(R.alis).ucret + yer(R.donus).ucret;
    var ekstra = 0; EKSTRA.forEach(function (x) { if (R.ek[x.id]) ekstra += x.gunluk * gun; });
    return { gun: gun, kira: kira, oran: oran, indirim: indirim, teslim: teslim, ekstra: ekstra, toplam: kira - indirim + teslim + ekstra };
  }
  function dogrula(adim) {
    if (adim >= 0 && !arac(R.arac)) return t('r.hata.arac');
    if (adim >= 1) {
      var a = new Date(R.alisT), d = new Date(R.donusT);
      if (isNaN(a) || isNaN(d) || d <= a) return t('r.hata.tarih');
      if (a < new Date(Date.now() - 36e5)) return t('r.hata.gecmis');
      if (yer(R.alis).hava && !/^[A-Za-z0-9]{2}\s?\d{1,4}[A-Za-z]?$/.test(R.ucus.trim())) return t('r.hata.ucus');
      if ((R.alis === 'otel' || R.donus === 'otel') && R.otel.trim().length < 3) return t('r.hata.otel');
    }
    return '';
  }
  function rezMetin() {
    var a = arac(R.arac), h = hesap();
    var L = ['Merhaba Laz Rent A Car, web sitenizden rezervasyon talebi:', ''];
    L.push('Araç: ' + a.ad + ' (' + S.tr['s.' + a.sinif] + ')');
    L.push('Alış: ' + S.tr['y.' + R.alis] + ' - ' + tarihYaz(R.alisT));
    L.push('Dönüş: ' + S.tr['y.' + R.donus] + ' - ' + tarihYaz(R.donusT));
    if (yer(R.alis).hava) L.push('Uçuş: ' + R.ucus.trim().toUpperCase() + (R.inis ? ' - iniş ' + R.inis : ''));
    if (R.otel.trim()) L.push('Otel/adres: ' + R.otel.trim());
    var e = EKSTRA.filter(function (x) { return R.ek[x.id]; }).map(function (x) { return S.tr['e.' + x.id]; });
    L.push('Ekstralar: ' + (e.length ? e.join(', ') : 'yok'));
    L.push('Süre: ' + h.gun + ' gün');
    L.push('Tahmini toplam (örnek fiyat): ' + tl(h.toplam));
    if (R.ad.trim()) L.push('Ad Soyad: ' + R.ad.trim());
    if (R.not.trim()) L.push('Not: ' + R.not.trim());
    if (dil !== 'tr') L.push('Dil: ' + dil.toUpperCase());
    L.push('', 'Müsaitlik ve kesin fiyatı teyit eder misiniz?');
    return L.join('\n');
  }
  function sec(ad, deger, secenekler) {
    return '<select name="' + ad + '">' + secenekler.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === deger ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>';
  }
  function alan(etiket, ic, cls) { return '<label class="alan' + (cls ? ' ' + cls : '') + '"><span>' + esc(etiket) + '</span>' + ic + '</label>'; }

  function rezCiz() {
    $$('[data-laz="rezervasyon"]').forEach(function (kap) {
      var h = hesap(), a = arac(R.arac);
      var adimlar = ['r.a1', 'r.a2', 'r.a3', 'r.a4'];
      var ust = '<ol class="rez-adimlar">' + adimlar.map(function (k, i) {
        return '<li class="' + (i === R.adim ? 'su-an' : i < R.adim ? 'bitti' : '') + '"><button type="button" data-adim="' + i + '"' + (i > R.adim ? ' disabled' : '') + '><b>' + (i + 1) + '</b><span>' + esc(t(k)) + '</span></button></li>';
      }).join('') + '</ol>';
      var govde = '';
      if (R.adim === 0) {
        govde = '<div class="rez-siniflar">' + ['ekonomi', 'kompakt', 'suv', 'minivan'].map(function (s) {
          return '<button type="button" class="rez-sinif" data-rsinif="' + s + '" aria-pressed="' + (R.sinif === s) + '">' + esc(t('s.' + s)) + '</button>';
        }).join('') + '</div><div class="rez-araclar">' + FILO.filter(function (x) { return x.sinif === R.sinif; }).map(function (x) {
          return '<label class="rez-arac' + (x.id === R.arac ? ' secili' : '') + '"><input type="radio" name="arac" value="' + x.id + '"' + (x.id === R.arac ? ' checked' : '') + '>' +
            '<img src="' + IMG + x.img + '-k.jpg" alt="" loading="lazy"><span class="ra-ad">' + esc(x.ad) + '</span><span class="ra-fiyat">' + tl(x.gun) + ' ' + esc(t('g.gun')) + '</span></label>';
        }).join('') + '</div>';
      } else if (R.adim === 1) {
        var yo = YERLER.map(function (y) { return [y.id, t('y.' + y.id) + (y.ucret ? ' (+' + tl(y.ucret) + ')' : '')]; });
        govde = '<div class="rez-izgara">' +
          alan(t('r.alis'), sec('alis', R.alis, yo)) + alan(t('r.donus'), sec('donus', R.donus, yo)) +
          alan(t('r.alist'), '<input type="datetime-local" name="alisT" value="' + R.alisT + '" step="900">') +
          alan(t('r.donust'), '<input type="datetime-local" name="donusT" value="' + R.donusT + '" step="900">') +
          (yer(R.alis).hava ? alan(t('r.ucus'), '<input name="ucus" value="' + esc(R.ucus) + '" placeholder="TK 2412" autocomplete="off" maxlength="8" style="text-transform:uppercase">') + alan(t('r.inis'), '<input type="time" name="inis" value="' + esc(R.inis) + '">') : '') +
          ((R.alis === 'otel' || R.donus === 'otel') ? alan(t('r.otel'), '<input name="otel" value="' + esc(R.otel) + '" placeholder="Lara, Kundu, Konyaaltı…">', 'genis') : '') +
          '</div>';
      } else if (R.adim === 2) {
        govde = '<div class="rez-ekstralar">' + EKSTRA.map(function (x) {
          return '<label class="rez-ek' + (R.ek[x.id] ? ' secili' : '') + '"><input type="checkbox" name="ek" value="' + x.id + '"' + (R.ek[x.id] ? ' checked' : '') + '><span class="re-ad">' + esc(t('e.' + x.id)) + '</span><span class="re-acik">' + esc(t('e.' + x.id + '.a')) + '</span><span class="re-fiyat">+' + tl(x.gunluk) + ' ' + esc(t('g.gun')) + '</span></label>';
        }).join('') + '</div>' +
          '<div class="rez-izgara">' + alan(t('r.ad'), '<input name="ad" value="' + esc(R.ad) + '" autocomplete="name">') + alan(t('r.not'), '<input name="not" value="' + esc(R.not) + '">') + '</div>';
      } else {
        govde = '<div class="rez-ozet-metin"><pre>' + esc(rezMetin()) + '</pre></div>';
      }
      var satir = function (k, v) { return '<div><dt>' + esc(k) + '</dt><dd>' + v + '</dd></div>'; };
      var ozet = '<aside class="rez-fiyat" aria-live="polite">' +
        '<figure><img src="' + IMG + a.img + '-k.jpg" alt=""><figcaption>' + esc(a.ad) + '</figcaption></figure>' +
        '<dl>' + satir(t('r.kira') + ' · ' + h.gun + ' ' + t('r.gunsay'), tl(h.kira)) +
        (h.indirim ? satir(t('r.indirim') + ' %' + Math.round(h.oran * 100), '−' + tl(h.indirim)) : '') +
        (h.teslim ? satir(t('r.teslim'), tl(h.teslim)) : '') + (h.ekstra ? satir(t('r.ekstra'), tl(h.ekstra)) : '') +
        '</dl><p class="rez-toplam"><span>' + esc(t('r.toplam')) + '</span><b>' + tl(h.toplam) + '</b></p><p class="rez-uyari">' + esc(t('r.uyari')) + '</p></aside>';
      var alt = '<div class="rez-alt"><p class="rez-hata" role="alert">' + esc(R.hata) + '</p>' +
        (R.adim > 0 ? '<button type="button" class="rez-geri" data-git="-1">' + esc(t('r.geri')) + '</button>' : '') +
        (R.adim < 3 ? '<button type="button" class="rez-ileri" data-git="1">' + esc(t('r.ileri')) + '</button>'
          : '<a class="rez-gonder" target="_blank" rel="noopener" href="' + waLink(rezMetin()) + '" data-wa-rez>' + esc(t('r.gonder')) + '</a>') + '</div>';
      kap.innerHTML = '<form class="rez" novalidate onsubmit="return false">' + ust + '<div class="rez-ic"><div class="rez-adim">' + govde + alt + '</div>' + ozet + '</div></form>';
    });
  }
  function rezGuncelle(e) {
    var el = e.target, kap = el.closest('[data-laz="rezervasyon"]'); if (!kap) return;
    var n = el.name;
    if (n === 'arac') { R.arac = el.value; }
    else if (n === 'ek') { R.ek[el.value] = el.checked; }
    else if (n === 'alisT') {
      var eski = new Date(R.alisT), yeni = new Date(el.value), sure = new Date(R.donusT) - eski;
      R.alisT = el.value; if (!isNaN(yeni) && sure > 0) R.donusT = yerelISO(new Date(yeni.getTime() + sure));
    }
    else if (n in R) { R[n] = el.value; }
    // Serbest metin alanlarında yeniden çizme yok (odak ve tıklama kaybolmasın)
    var metin = el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'time' || el.type === '' || el.type === 'search');
    if (metin) return;
    R.hata = '';
    rezCiz();
  }
  document.addEventListener('change', rezGuncelle);
  document.addEventListener('input', function (e) { if (e.target.closest('[data-laz="rezervasyon"]') && e.target.type !== 'datetime-local' && e.target.tagName === 'INPUT' && e.target.type !== 'radio' && e.target.type !== 'checkbox') { R[e.target.name] = e.target.value; } });
  document.addEventListener('click', function (e) {
    var rs = e.target.closest('[data-rsinif]');
    if (rs) { R.sinif = rs.getAttribute('data-rsinif'); var ilk = FILO.filter(function (x) { return x.sinif === R.sinif; })[0]; R.arac = ilk.id; rezCiz(); return; }
    var g = e.target.closest('[data-git]');
    if (g && g.closest('[data-laz="rezervasyon"]')) {
      var y = parseInt(g.getAttribute('data-git'), 10);
      if (y > 0) { var h = dogrula(R.adim); if (h) { R.hata = h; rezCiz(); return; } }
      R.adim = Math.max(0, Math.min(3, R.adim + y)); R.hata = ''; rezCiz();
      var k = g.closest('[data-laz="rezervasyon"]'); if (k && k.getBoundingClientRect().top < 0) k.scrollIntoView({ block: 'start' });
      return;
    }
    var ad = e.target.closest('[data-adim]');
    if (ad && !ad.disabled) { R.adim = parseInt(ad.getAttribute('data-adim'), 10); R.hata = ''; rezCiz(); }
  });

  /* ---------- HAVALİMANI KARŞILAMA ---------- */
  var K = { ucus: '', tarih: yerelISO(bas).slice(0, 10), inis: '', terminal: 't1', kisi: '2', arac: '' };
  function karMetin() {
    var L = ['Merhaba Laz Rent A Car, havalimanı karşılama talebi:', ''];
    L.push('Uçuş: ' + (K.ucus.trim().toUpperCase() || '-'));
    L.push('İniş: ' + (K.tarih ? K.tarih.split('-').reverse().join('.') : '-') + ' ' + (K.inis || ''));
    L.push('Terminal: ' + S.tr['y.' + K.terminal]);
    L.push('Yolcu: ' + K.kisi);
    if (K.arac) L.push('İstenen araç: ' + arac(K.arac).ad);
    if (dil !== 'tr') L.push('Dil: ' + dil.toUpperCase());
    L.push('', 'Rötar olursa uçuşu takip edebilir misiniz?');
    return L.join('\n');
  }
  function karCiz() {
    $$('[data-laz="karsilama"]').forEach(function (kap) {
      var to = YERLER.filter(function (y) { return y.hava; }).map(function (y) { return [y.id, t('y.' + y.id).split(' · ').pop()]; });
      var ao = [['', '—']].concat(FILO.map(function (a) { return [a.id, a.ad]; }));
      kap.innerHTML = '<form class="kar" novalidate onsubmit="return false"><div class="rez-izgara">' +
        alan(t('r.ucus'), '<input name="k-ucus" value="' + esc(K.ucus) + '" placeholder="TK 2412" maxlength="8" autocomplete="off" style="text-transform:uppercase">') +
        alan(t('k.tarih'), '<input type="date" name="k-tarih" value="' + K.tarih + '">') +
        alan(t('r.inis'), '<input type="time" name="k-inis" value="' + esc(K.inis) + '">') +
        alan(t('k.terminal'), sec('k-terminal', K.terminal, to)) +
        alan(t('k.kisi'), sec('k-kisi', K.kisi, [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6+', '6+']])) +
        alan(t('r.arac'), sec('k-arac', K.arac, ao)) +
        '</div><p class="rez-hata kar-hata" role="alert"></p><a class="kar-gonder" target="_blank" rel="noopener" href="' + waLink(karMetin()) + '">' + esc(t('k.gonder')) + '</a><ul class="kar-not"><li>' + esc(t('k.n1')) + '</li><li>' + esc(t('k.n2')) + '</li><li>' + esc(t('k.n3')) + '</li></ul></form>';
    });
  }
  function karGuncelle(e) {
    var el = e.target; if (!el.name || el.name.indexOf('k-') !== 0) return;
    K[el.name.slice(2)] = el.value;
    var f = el.closest('form'); var a = f.querySelector('.kar-gonder'); a.href = waLink(karMetin());
    var gecerli = /^[A-Za-z0-9]{2}\s?\d{1,4}[A-Za-z]?$/.test(K.ucus.trim()) && K.inis;
    a.classList.toggle('pasif', !gecerli);
  }
  document.addEventListener('input', karGuncelle);
  document.addEventListener('change', karGuncelle);
  document.addEventListener('click', function (e) {
    var a = e.target.closest('.kar-gonder'); if (!a) return;
    var h = a.parentNode.querySelector('.kar-hata');
    if (!/^[A-Za-z0-9]{2}\s?\d{1,4}[A-Za-z]?$/.test(K.ucus.trim()) || !K.inis) { e.preventDefault(); h.textContent = t('r.hata.ucus') + (K.inis ? '' : ' · ' + t('r.inis')); }
    else h.textContent = '';
  });

  /* ---------- DİJİTAL TESLİM ---------- */
  var TUR = { cizik: '#d9480f', gocuk: '#1c7ed6', kirik: '#c2255c', tas: '#5f3dc4' };
  var T = { tur: 'cizik', isaret: [], plaka: '', km: '', yakit: '4/4', tarih: yerelISO(new Date()), islem: 'teslim', not: '', musteri: '', ozet: false };
  function bolge(x, y) {
    var yan = x < 48 ? 'Sol ' : x > 152 ? 'Sağ ' : '';
    if (yan) {
      if (y < 105) return yan + 'ön çamurluk';
      if (y < 200) return yan + 'ön kapı';
      if (y < 285) return yan + 'arka kapı';
      return yan + 'arka çamurluk';
    }
    if (y < 52) return 'Ön tampon';
    if (y < 132) return 'Kaput';
    if (y < 168) return 'Ön cam';
    if (y < 268) return 'Tavan';
    if (y < 300) return 'Arka cam';
    if (y < 350) return 'Bagaj kapağı';
    return 'Arka tampon';
  }
  var SEMA = '<svg class="sema" viewBox="0 0 200 400" role="img" aria-label="Araç şeması">' +
    '<text x="100" y="12" text-anchor="middle" class="sema-yon">ÖN</text><text x="100" y="396" text-anchor="middle" class="sema-yon">ARKA</text>' +
    '<rect x="14" y="70" width="18" height="52" rx="6" class="teker"/><rect x="168" y="70" width="18" height="52" rx="6" class="teker"/>' +
    '<rect x="14" y="282" width="18" height="52" rx="6" class="teker"/><rect x="168" y="282" width="18" height="52" rx="6" class="teker"/>' +
    '<path class="govde" d="M60 22 Q100 12 140 22 Q168 30 170 70 L172 330 Q170 378 140 384 Q100 390 60 384 Q30 378 28 330 L30 70 Q32 30 60 22Z"/>' +
    '<path class="cam" d="M50 140 Q100 122 150 140 L144 172 Q100 160 56 172Z"/><path class="cam" d="M56 268 Q100 278 144 268 L150 298 Q100 314 50 298Z"/>' +
    '<rect x="56" y="176" width="88" height="88" rx="10" class="tavan"/>' +
    '<path class="cizgi" d="M38 200 L162 200 M36 286 L164 286 M60 52 Q100 44 140 52 M60 352 Q100 360 140 352"/>' +
    '<path class="cizgi" d="M30 140 L18 150 L30 156 M170 140 L182 150 L170 156"/>' +
    '<g class="isaretler"></g></svg>';
  function tesCiz() {
    $$('[data-laz="teslim"]').forEach(function (kap) {
      var turlar = Object.keys(TUR).map(function (k) { return '<button type="button" data-tur="' + k + '" aria-pressed="' + (T.tur === k) + '"><i style="background:' + TUR[k] + '"></i>' + esc(t('t.' + k)) + '</button>'; }).join('');
      var liste = T.isaret.length ? '<ol class="tes-liste">' + T.isaret.map(function (m, i) {
        return '<li><b style="background:' + TUR[m.tur] + '">' + (i + 1) + '</b><span>' + esc(t('t.' + m.tur)) + ' · ' + esc(m.yer) + '</span><button type="button" data-sil="' + i + '" aria-label="Sil">×</button></li>';
      }).join('') + '</ol>' : '<p class="tes-bos">' + esc(t('t.yok')) + '</p>';
      var yo = [['4/4', '4/4'], ['3/4', '3/4'], ['2/4', '2/4'], ['1/4', '1/4'], ['Rezerv', 'Rezerv']];
      var ao = FILO.map(function (a) { return [a.id, a.ad]; });
      kap.innerHTML = '<div class="tes"><div class="tes-sema"><div class="tes-turler" role="group" aria-label="' + esc(t('t.tur')) + '">' + turlar + '</div>' + SEMA +
        '<p class="tes-ipucu">' + esc(t('t.ipucu')) + '</p><div class="tes-dugmeler"><button type="button" data-tgeri>' + esc(t('t.geri')) + '</button><button type="button" data-ttemizle>' + esc(t('t.temizle')) + '</button></div></div>' +
        '<div class="tes-form">' + liste + '<div class="rez-izgara">' +
        alan(t('t.islem'), sec('t-islem', T.islem, [['teslim', t('t.teslim')], ['iade', t('t.iade')]])) +
        alan(t('r.arac'), sec('t-arac', T.arac || R.arac, ao)) +
        alan(t('t.plaka'), '<input name="t-plaka" value="' + esc(T.plaka) + '" placeholder="07 ABC 123" maxlength="12" style="text-transform:uppercase">') +
        alan(t('t.km'), '<input name="t-km" inputmode="numeric" value="' + esc(T.km) + '" placeholder="48 250">') +
        alan(t('t.yakit'), sec('t-yakit', T.yakit, yo)) +
        alan(t('t.tarih'), '<input type="datetime-local" name="t-tarih" value="' + T.tarih + '">') +
        alan(t('t.musteri'), '<input name="t-musteri" value="' + esc(T.musteri) + '">', 'genis') +
        alan(t('t.not'), '<textarea name="t-not" rows="2">' + esc(T.not) + '</textarea>', 'genis') +
        '</div><button type="button" class="tes-olustur" data-tolustur>' + esc(t('t.olustur')) + '</button></div></div>' +
        (T.ozet ? tutanak() : '');
      var g = kap.querySelector('.isaretler');
      g.innerHTML = T.isaret.map(function (m, i) {
        return '<g class="isaret" data-sil="' + i + '" transform="translate(' + m.x + ' ' + m.y + ')"><circle r="9" fill="' + TUR[m.tur] + '"/><text y="3.6" text-anchor="middle">' + (i + 1) + '</text></g>';
      }).join('');
    });
  }
  function tutanak() {
    var a = arac(T.arac || R.arac);
    var satir = function (k, v) { return '<tr><th>' + esc(k) + '</th><td>' + esc(v || '-') + '</td></tr>'; };
    var sema = SEMA.replace('<g class="isaretler"></g>', '<g>' + T.isaret.map(function (m, i) { return '<g transform="translate(' + m.x + ' ' + m.y + ')"><circle r="9" fill="' + TUR[m.tur] + '"/><text y="3.6" text-anchor="middle">' + (i + 1) + '</text></g>'; }).join('') + '</g>');
    return '<section class="tutanak" id="tutanak"><header><p>Laz Rent A Car · ' + esc(TEL) + '</p><h3>' + esc(t('t.ozet')) + '</h3></header><div class="tut-ic"><div class="tut-sema">' + sema + '</div><div>' +
      '<table>' + satir(t('t.islem'), T.islem === 'iade' ? t('t.iade') : t('t.teslim')) + satir(t('r.arac'), a.ad) + satir(t('t.plaka'), T.plaka.toUpperCase()) + satir(t('t.km'), T.km) + satir(t('t.yakit'), T.yakit) + satir(t('t.tarih'), tarihYaz(T.tarih)) + satir(t('t.musteri'), T.musteri) + '</table>' +
      (T.isaret.length ? '<ol class="tut-liste">' + T.isaret.map(function (m) { return '<li>' + esc(t('t.' + m.tur)) + ' — ' + esc(m.yer) + '</li>'; }).join('') + '</ol>' : '<p>' + esc(t('t.yok').split('.')[0]) + '.</p>') +
      (T.not ? '<p class="tut-not">' + esc(T.not) + '</p>' : '') +
      '<div class="tut-imza"><span>Laz Rent A Car</span><span>' + esc(t('t.musteri')) + '</span></div></div></div>' +
      '<div class="tut-dugmeler"><button type="button" data-tyazdir>' + esc(t('t.yazdir')) + '</button><a target="_blank" rel="noopener" href="' + waLink(tesMetin()) + '">' + esc(t('t.wa')) + '</a></div></section>';
  }
  function tesMetin() {
    var a = arac(T.arac || R.arac);
    var L = ['Laz Rent A Car - Dijital teslim tutanağı', ''];
    L.push('İşlem: ' + (T.islem === 'iade' ? 'İade (dönüş)' : 'Teslim (çıkış)'));
    L.push('Araç: ' + a.ad + (T.plaka ? ' - ' + T.plaka.toUpperCase() : ''));
    L.push('Km: ' + (T.km || '-') + ' · Yakıt: ' + T.yakit);
    L.push('Tarih: ' + tarihYaz(T.tarih));
    if (T.musteri) L.push('Müşteri: ' + T.musteri);
    L.push('', 'Hasar noktaları (' + T.isaret.length + '):');
    if (!T.isaret.length) L.push('- Hasar işaretlenmedi');
    T.isaret.forEach(function (m, i) { L.push((i + 1) + '. ' + S.tr['t.' + m.tur] + ' - ' + m.yer); });
    if (T.not) L.push('', 'Not: ' + T.not);
    return L.join('\n');
  }
  document.addEventListener('click', function (e) {
    var kap = e.target.closest('[data-laz="teslim"]'); if (!kap) return;
    var svg = e.target.closest('.tes-sema svg.sema');
    var silEl = e.target.closest('[data-sil]');
    if (silEl) { T.isaret.splice(parseInt(silEl.getAttribute('data-sil'), 10), 1); T.ozet = false; tesCiz(); return; }
    if (svg) {
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(svg.getScreenCTM().inverse());
      if (p.x < 6 || p.x > 194 || p.y < 16 || p.y > 388) return;
      T.isaret.push({ x: Math.round(p.x), y: Math.round(p.y), tur: T.tur, yer: bolge(p.x, p.y) }); T.ozet = false; tesCiz(); return;
    }
    var tr = e.target.closest('[data-tur]'); if (tr) { T.tur = tr.getAttribute('data-tur'); tesCiz(); return; }
    if (e.target.closest('[data-tgeri]')) { T.isaret.pop(); T.ozet = false; tesCiz(); return; }
    if (e.target.closest('[data-ttemizle]')) { T.isaret = []; T.ozet = false; tesCiz(); return; }
    if (e.target.closest('[data-tolustur]')) { T.ozet = true; tesCiz(); var tt = kap.querySelector('.tutanak'); if (tt) tt.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return; }
    if (e.target.closest('[data-tyazdir]')) {
      var b = document.createElement('div'); b.className = 'tutanak-baski'; b.innerHTML = kap.querySelector('.tutanak').outerHTML;
      document.body.appendChild(b); document.documentElement.classList.add('tutanak-yazdir');
      window.print();
      setTimeout(function () { document.documentElement.classList.remove('tutanak-yazdir'); b.remove(); }, 800);
    }
  });
  function tesGuncelle(e) {
    var el = e.target; if (!el.name || el.name.indexOf('t-') !== 0) return;
    T[el.name.slice(2)] = el.value;
    if (T.ozet) { T.ozet = false; var tt = el.closest('[data-laz="teslim"]').querySelector('.tutanak'); if (tt) tt.remove(); }
  }
  document.addEventListener('input', tesGuncelle);
  document.addEventListener('change', tesGuncelle);

  /* ---------- SSS ve YORUMLAR ---------- */
  function sssCiz() {
    var liste = SSS[dil] || SSS.en;
    $$('[data-laz="sss"]').forEach(function (kap) {
      kap.innerHTML = liste.map(function (q, i) {
        return '<details class="sss"' + (i === 0 && kap.hasAttribute('data-ilk-acik') ? ' open' : '') + '><summary><span class="sss-no">' + pad(i + 1) + '</span><span class="sss-s">' + esc(q[0]) + '</span><i aria-hidden="true"></i></summary><div class="sss-c"><p>' + esc(q[1]) + '</p></div></details>';
      }).join('');
    });
  }
  function yorumCiz() {
    $$('[data-laz="yorumlar"]').forEach(function (kap) {
      kap.innerHTML = YORUMLAR.map(function (y) {
        return '<blockquote class="yorum"><p class="yildiz" aria-label="5 yıldız">★★★★★</p><p class="yorum-m">“' + esc(y[1].tr) + '”</p><footer>' + esc(y[0]) + ' · Google</footer></blockquote>';
      }).join('');
    });
  }

  function ciz() { filoCiz(); rezCiz(); karCiz(); tesCiz(); sssCiz(); yorumCiz(); durumCiz(); }

  window.LAZ = {
    filo: FILO, dil: function () { return dil; }, t: t, wa: waLink, dilSec: dilSec,
    aracSec: function (id) { R.arac = id; R.sinif = arac(id).sinif; R.adim = 1; rezCiz(); },
    rezMetin: rezMetin, karMetin: karMetin, tesMetin: tesMetin, hesap: hesap, R: R, K: K, T: T, ciz: ciz
  };
  function basla() { cevir(); ciz(); setInterval(durumCiz, 60000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', basla); else basla();
})();
