/* Altera · Firma Paneli (İşçi C). Yalnız #panel-kok'a yazar.
   Dinler: altera:sekme {sekme}, altera:basvuru {ad, tel, cevaplar, puan, programlar:[{kod,ad,puan}]}, altera:dil {dil}
   Metinler AI18N.ekle ile 'p.' önekiyle kaydedilir (AI18N yoksa yerel sözlük kullanılır).
   Demo verisi gerçek kişi değildir; arama/WhatsApp düğmeleri hiçbir şey göndermez. */
(function () {
  'use strict';
  var kok = document.getElementById('panel-kok');
  if (!kok || kok.__pn) return;
  kok.__pn = true;

  var AZ_HAREKET = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SIMDI = Date.now();
  var DK = 60000, GUN = 86400000;

  /* =====================================================================
     SÖZLÜK (p.)
     ===================================================================== */
  var SOZ = {
    tr: {
      'p.demo': 'Demo verisi · gerçek kişi değildir',
      'p.baslik': 'Başvuru paneli',
      'p.giris': 'Uygunluk testini dolduran adaylar burada sıralanır: hangi programa yakın, ne kadar sıcak, hangi belgesi eksik. Puanlar ön değerlendirmedir; kesin bilgi danışmanla görüşmede verilir.',
      'p.canli': 'Canlı',
      'p.csv': 'Listeyi indir (CSV)',
      'p.kpi.hafta': 'Bu hafta başvuru', 'p.kpi.hafta.alt': '{fark} geçen haftaya göre',
      'p.kpi.sicak': 'Sıcak aday', 'p.kpi.sicak.alt': '{n} tanesi bu hafta geldi',
      'p.kpi.eksik': 'Eksik belgeli', 'p.kpi.eksik.alt': 'toplam {n} belge bekleniyor',
      'p.kpi.ort': 'Ortalama puan', 'p.kpi.ort.alt': 'ön değerlendirme · {u} ülkeden aday',
      'p.g.puan': 'Puan dağılımı', 'p.g.puan.alt': 'Çubuğa dokunun: o sıcaklığa göre süzer.',
      'p.g.esik': 'sıcak eşiği 75',
      'p.g.aday': 'aday', 'p.g.aria.hist': 'Puan dağılımı: {liste}', 'p.g.aralik': '{a} puan: {n} aday',
      'p.g.alt45': '45 altı',
      'p.g.prog': 'Program dağılımı', 'p.g.prog.alt': 'Programa dokunun, tablo süzülsün.',
      'p.g.huni': 'Takip hunisi', 'p.g.huni.alt': 'Adaylar hangi aşamada?',
      'p.g.huni.not': '{n} sıcak aday henüz aranmadı — önce bunlar.',
      'p.g.huni.not0': 'Tüm sıcak adaylarla ilk temas kuruldu.',
      'p.lej.soguk': 'Soğuk <55', 'p.lej.ilik': 'Ilık 55-74', 'p.lej.sicak': 'Sıcak 75+',
      'p.s.ara': 'Ad, şehir, ülke ya da program ara', 'p.s.ara.et': 'Aday ara', 'p.s.aria': 'Aday süzgeci',
      'p.s.prog': 'Program', 'p.s.tumprog': 'Tüm programlar', 'p.s.sic': 'Sıcaklık', 'p.s.tumu': 'Tümü',
      'p.s.ulke': 'Ülke', 'p.s.tumulke': 'Tüm ülkeler',
      'p.s.sirala': 'Sırala', 'p.s.say': '{n} / {t} aday gösteriliyor',
      'p.sr.zaman-1': 'En yeni başvuru', 'p.sr.puan-1': 'Puan (yüksekten)', 'p.sr.puan1': 'Puan (düşükten)',
      'p.sr.sicaklik-1': 'Sıcaklık', 'p.sr.eksik-1': 'Eksik belge (çoktan)', 'p.sr.ad1': 'Ad (A-Z)', 'p.sr.durum1': 'Durum', 'p.sr.konum1': 'Konum (A-Z)',
      'p.th.ad': 'Aday', 'p.th.konum': 'Şehir · ülke', 'p.th.program': 'Program', 'p.th.puan': 'Puan', 'p.th.sicaklik': 'Sıcaklık',
      'p.th.eksik': 'Eksik belge', 'p.th.durum': 'Durum', 'p.th.zaman': 'Başvuru',
      'p.tablo.cap': 'Aday listesi. Satıra tıklayın ya da Enter tuşuna basın; aday ayrıntısı açılır.',
      'p.satir.aria': '{ad}, {konum}, {prog}, puan {puan}, {sic}. Ayrıntı için Enter.',
      'p.eksik.n': '{n} eksik', 'p.eksik.0': 'tamam',
      'p.dahafazla': 'Daha fazla göster · {n} aday daha', 'p.bos': 'Bu süzgeçle eşleşen aday yok.', 'p.sifirla': 'Süzgeci temizle',
      'p.alt.not': 'Puanlar uygunluk testine göre ön değerlendirmedir; kesin bilgi danışmanla görüşmede verilir.',
      'p.alt.guncel': 'Son güncelleme {s}',
      'p.yeni': 'YENİ',
      'p.sic.sicak': 'Sıcak', 'p.sic.ilik': 'Ilık', 'p.sic.soguk': 'Soğuk',
      'p.d.yeni': 'Yeni', 'p.d.arandi': 'Arandı', 'p.d.gorusme': 'Görüşme', 'p.d.dosya': 'Dosya',
      'p.pr.eb5': 'EB-5 · Green Card yolu', 'p.pr.bluecard': 'AB Mavi Kart', 'p.pr.calisma': 'Çalışma vizesi', 'p.pr.ogrenci': 'Öğrenci vizesi', 'p.pr.ret': 'Ret sonrası yeniden başvuru',
      'p.prk.eb5': 'EB-5', 'p.prk.bluecard': 'Mavi Kart', 'p.prk.calisma': 'Çalışma', 'p.prk.ogrenci': 'Öğrenci', 'p.prk.ret': 'Ret sonrası',
      'p.ck.kapat': 'Ayrıntıyı kapat (Esc)', 'p.ck.ara': 'Ara', 'p.ck.wa': 'WhatsApp',
      'p.ck.demo': 'Demo: düğmeler gerçek arama ya da mesaj başlatmaz; işlem kayda düşer.',
      'p.ck.asama': 'Aşama', 'p.ck.uygun': 'Program uygunluğu', 'p.ck.on': 'ön değerlendirme',
      'p.ck.cevap': 'Test cevapları özeti', 'p.ck.belge': 'Belge kontrolü', 'p.ck.belge.aria': 'Belge tamamlanma',
      'p.ck.hatirlat': 'Eksik belge hatırlatması hazırla',
      'p.ck.not': 'Danışman notu', 'p.ck.not.ph': 'Görüşme notu, uygun arama saati...',
      'p.ck.not.bilgi': 'Not yalnız bu demoda, bu sekmede saklanır.', 'p.ck.not.kaydet': 'Notu kaydet',
      'p.ck.not.ok': 'Not kaydedildi.', 'p.ck.not.sil': 'Not temizlendi.',
      'p.ck.gecmis': 'Geçmiş',
      'p.bd.tamam': 'Tamam', 'p.bd.eksik': 'Eksik', 'p.bd.inceleme': 'İncelemede',
      'p.h.test': 'Uygunluk testini tamamladı · ön değerlendirme puanı {puan}',
      'p.h.durum': 'Durum: {d}', 'p.h.ara': 'Arama kaydı oluşturuldu (demo)',
      'p.h.wa': 'WhatsApp mesaj taslağı hazırlandı (demo, gönderilmedi)',
      'p.h.hatirlat': 'Eksik belge hatırlatma taslağı: {liste}', 'p.h.not': 'Not: {m}',
      'p.t.ara': 'Demo: gerçek arama başlatılmadı. Arama kayda işlendi.',
      'p.t.wa': 'Demo: mesaj gönderilmedi. Taslak kayda işlendi.',
      'p.t.hatirlat': 'Hatırlatma taslağı hazırlandı (gönderilmedi).',
      'p.t.csv': '{n} adaylık demo liste indirildi.', 'p.t.csvhata': 'İndirme bu tarayıcıda açılamadı.',
      'p.bl.sicak': 'Sıcak aday · yeni başvuru', 'p.bl.yeni': 'Yeni başvuru · {s}', 'p.bl.bekliyor': 'Sıcak aday · aranmayı bekliyor',
      'p.bl.ac': 'Adayı aç', 'p.bl.kapat': 'Bildirimi kapat', 'p.bl.puan': 'puan {n}',
      'p.az': 'az önce',
      'p.c.yas': 'Yaş aralığı', 'p.c.egitim': 'Eğitim', 'p.c.dil': 'Yabancı dil', 'p.c.deneyim': 'Mesleki deneyim',
      'p.c.butce': 'Bütçe aralığı', 'p.c.hedef': 'Hedef ülke', 'p.c.zaman': 'Zamanlama', 'p.c.ret': 'Daha önce ret', 'p.c.kaynak': 'Kaynak',
      'p.v.lise': 'Lise', 'p.v.onlisans': 'Ön lisans', 'p.v.lisans': 'Lisans', 'p.v.ylisans': 'Yüksek lisans', 'p.v.doktora': 'Doktora',
      'p.v.baslangic': 'Başlangıç', 'p.v.orta': 'Orta', 'p.v.iyi': 'İyi', 'p.v.ileri': 'İleri',
      'p.v.yok': 'Yok', 'p.v.d1': '1-3 yıl', 'p.v.d3': '3-7 yıl', 'p.v.d7': '7+ yıl',
      'p.v.belirsiz': 'Belirlemedim', 'p.v.sinirli': 'Sınırlı', 'p.v.ortab': 'Orta', 'p.v.yuksek': 'Yüksek',
      'p.v.z3': '3 ay içinde', 'p.v.z6': '3-6 ay', 'p.v.z12': '6-12 ay', 'p.v.zb': 'Henüz belirsiz',
      'p.v.evet': 'Evet', 'p.v.hayir': 'Hayır', 'p.v.web': 'Uygunluk testi (web)',
      'p.not.0': 'Akşam 18:00 sonrası aranmak istiyor.', 'p.not.1': 'Eşiyle birlikte başvurmayı düşünüyor.',
      'p.not.2': 'Diploma denkliği için bilgi bekliyor.', 'p.not.3': 'Önce ön görüşme talep etti.', 'p.not.4': 'Belgelerini hafta sonu tamamlayacak.',
      'p.b.pasaport': 'Pasaport', 'p.b.fon': 'Fon kaynağı belgeleri', 'p.b.vergi': 'Son 5 yıl vergi kayıtları', 'p.b.banka': 'Banka hesap dökümleri',
      'p.b.sicil': 'Adli sicil kaydı', 'p.b.denklik': 'Diploma ve denklik', 'p.b.isteklif': 'İş teklifi / sözleşme', 'p.b.cv': 'Özgeçmiş (Europass)',
      'p.b.dil': 'Dil belgesi', 'p.b.teklif': 'İş teklifi', 'p.b.diploma': 'Diploma', 'p.b.deneyim': 'Deneyim yazıları',
      'p.b.kabul': 'Kabul mektubu', 'p.b.transkript': 'Transkript', 'p.b.sinav': 'Dil sınavı sonucu', 'p.b.mali': 'Mali yeterlilik belgesi',
      'p.b.ret': 'Ret yazısı', 'p.b.onceki': 'Önceki başvuru dosyası', 'p.b.guncel': 'Güncel mali belgeler', 'p.b.niyet': 'Niyet mektubu',
      'p.csv.bas': 'Aday;Şehir;Ülke;Telefon (maskeli);Program;Puan;Sıcaklık;Eksik belge;Durum;Başvuru',
      'p.csv.dosya': 'altera-adaylar-demo.csv'
    },
    en: {
      'p.demo': 'Demo data · not real people',
      'p.baslik': 'Applicant dashboard',
      'p.giris': 'Everyone who completes the eligibility check lands here, ranked: which route fits best, how warm the lead is, and which documents are still missing. Scores are a preliminary assessment; definitive advice comes from a consultant.',
      'p.canli': 'Live',
      'p.csv': 'Export list (CSV)',
      'p.kpi.hafta': 'Applications this week', 'p.kpi.hafta.alt': '{fark} vs last week',
      'p.kpi.sicak': 'Hot leads', 'p.kpi.sicak.alt': '{n} arrived this week',
      'p.kpi.eksik': 'Missing documents', 'p.kpi.eksik.alt': '{n} documents outstanding in total',
      'p.kpi.ort': 'Average score', 'p.kpi.ort.alt': 'preliminary · applicants from {u} countries',
      'p.g.puan': 'Score distribution', 'p.g.puan.alt': 'Tap a bar to filter by that lead temperature.',
      'p.g.esik': 'hot threshold 75',
      'p.g.aday': 'applicants', 'p.g.aria.hist': 'Score distribution: {liste}', 'p.g.aralik': '{a} points: {n} applicants',
      'p.g.alt45': 'under 45',
      'p.g.prog': 'Route mix', 'p.g.prog.alt': 'Tap a route to filter the table.',
      'p.g.huni': 'Follow-up pipeline', 'p.g.huni.alt': 'Where does each applicant stand?',
      'p.g.huni.not': '{n} hot leads not yet contacted — start with these.',
      'p.g.huni.not0': 'Every hot lead has been contacted.',
      'p.lej.soguk': 'Cold <55', 'p.lej.ilik': 'Warm 55-74', 'p.lej.sicak': 'Hot 75+',
      'p.s.ara': 'Search name, city, country or route', 'p.s.ara.et': 'Search applicants', 'p.s.aria': 'Applicant filters',
      'p.s.prog': 'Route', 'p.s.tumprog': 'All routes', 'p.s.sic': 'Temperature', 'p.s.tumu': 'All',
      'p.s.ulke': 'Country', 'p.s.tumulke': 'All countries',
      'p.s.sirala': 'Sort', 'p.s.say': 'Showing {n} of {t} applicants',
      'p.sr.zaman-1': 'Newest first', 'p.sr.puan-1': 'Score (high to low)', 'p.sr.puan1': 'Score (low to high)',
      'p.sr.sicaklik-1': 'Temperature', 'p.sr.eksik-1': 'Missing documents (most)', 'p.sr.ad1': 'Name (A-Z)', 'p.sr.durum1': 'Stage', 'p.sr.konum1': 'Location (A-Z)',
      'p.th.ad': 'Applicant', 'p.th.konum': 'City · country', 'p.th.program': 'Route', 'p.th.puan': 'Score', 'p.th.sicaklik': 'Temperature',
      'p.th.eksik': 'Missing docs', 'p.th.durum': 'Stage', 'p.th.zaman': 'Applied',
      'p.tablo.cap': 'Applicant list. Click a row or press Enter to open the applicant details.',
      'p.satir.aria': '{ad}, {konum}, {prog}, score {puan}, {sic}. Press Enter for details.',
      'p.eksik.n': '{n} missing', 'p.eksik.0': 'complete',
      'p.dahafazla': 'Show more · {n} more applicants', 'p.bos': 'No applicants match these filters.', 'p.sifirla': 'Clear filters',
      'p.alt.not': 'Scores are a preliminary assessment based on the eligibility check; definitive advice is given in a consultation.',
      'p.alt.guncel': 'Last updated {s}',
      'p.yeni': 'NEW',
      'p.sic.sicak': 'Hot', 'p.sic.ilik': 'Warm', 'p.sic.soguk': 'Cold',
      'p.d.yeni': 'New', 'p.d.arandi': 'Contacted', 'p.d.gorusme': 'Consultation', 'p.d.dosya': 'File opened',
      'p.pr.eb5': 'EB-5 · Green Card route', 'p.pr.bluecard': 'EU Blue Card', 'p.pr.calisma': 'Work visa', 'p.pr.ogrenci': 'Student visa', 'p.pr.ret': 'Reapplication after refusal',
      'p.prk.eb5': 'EB-5', 'p.prk.bluecard': 'Blue Card', 'p.prk.calisma': 'Work', 'p.prk.ogrenci': 'Student', 'p.prk.ret': 'Reapplication',
      'p.ck.kapat': 'Close details (Esc)', 'p.ck.ara': 'Call', 'p.ck.wa': 'WhatsApp',
      'p.ck.demo': 'Demo: these buttons do not place a call or send a message; the action is logged only.',
      'p.ck.asama': 'Stage', 'p.ck.uygun': 'Route fit', 'p.ck.on': 'preliminary',
      'p.ck.cevap': 'Answers at a glance', 'p.ck.belge': 'Document check', 'p.ck.belge.aria': 'Documents completed',
      'p.ck.hatirlat': 'Draft a missing-documents reminder',
      'p.ck.not': 'Consultant note', 'p.ck.not.ph': 'Call notes, best time to reach them...',
      'p.ck.not.bilgi': 'Notes stay in this demo tab only.', 'p.ck.not.kaydet': 'Save note',
      'p.ck.not.ok': 'Note saved.', 'p.ck.not.sil': 'Note cleared.',
      'p.ck.gecmis': 'Activity',
      'p.bd.tamam': 'Received', 'p.bd.eksik': 'Missing', 'p.bd.inceleme': 'In review',
      'p.h.test': 'Completed the eligibility check · preliminary score {puan}',
      'p.h.durum': 'Stage: {d}', 'p.h.ara': 'Call logged (demo)',
      'p.h.wa': 'WhatsApp draft prepared (demo, not sent)',
      'p.h.hatirlat': 'Missing-documents reminder drafted: {liste}', 'p.h.not': 'Note: {m}',
      'p.t.ara': 'Demo: no call was placed. The call has been logged.',
      'p.t.wa': 'Demo: no message was sent. The draft has been logged.',
      'p.t.hatirlat': 'Reminder drafted (not sent).',
      'p.t.csv': 'Demo list of {n} applicants downloaded.', 'p.t.csvhata': 'Download is not available in this browser.',
      'p.bl.sicak': 'Hot lead · new application', 'p.bl.yeni': 'New application · {s}', 'p.bl.bekliyor': 'Hot lead · awaiting a call',
      'p.bl.ac': 'Open applicant', 'p.bl.kapat': 'Dismiss notification', 'p.bl.puan': 'score {n}',
      'p.az': 'just now',
      'p.c.yas': 'Age range', 'p.c.egitim': 'Education', 'p.c.dil': 'Foreign language', 'p.c.deneyim': 'Work experience',
      'p.c.butce': 'Budget range', 'p.c.hedef': 'Target country', 'p.c.zaman': 'Timeline', 'p.c.ret': 'Previous refusal', 'p.c.kaynak': 'Source',
      'p.v.lise': 'High school', 'p.v.onlisans': 'Associate degree', 'p.v.lisans': "Bachelor's", 'p.v.ylisans': "Master's", 'p.v.doktora': 'PhD',
      'p.v.baslangic': 'Beginner', 'p.v.orta': 'Intermediate', 'p.v.iyi': 'Good', 'p.v.ileri': 'Advanced',
      'p.v.yok': 'None', 'p.v.d1': '1-3 years', 'p.v.d3': '3-7 years', 'p.v.d7': '7+ years',
      'p.v.belirsiz': 'Not decided', 'p.v.sinirli': 'Limited', 'p.v.ortab': 'Moderate', 'p.v.yuksek': 'High',
      'p.v.z3': 'Within 3 months', 'p.v.z6': '3-6 months', 'p.v.z12': '6-12 months', 'p.v.zb': 'Not sure yet',
      'p.v.evet': 'Yes', 'p.v.hayir': 'No', 'p.v.web': 'Eligibility check (web)',
      'p.not.0': 'Prefers calls after 6 pm.', 'p.not.1': 'Considering applying together with spouse.',
      'p.not.2': 'Waiting for details on diploma recognition.', 'p.not.3': 'Asked for an initial consultation first.', 'p.not.4': 'Will complete documents over the weekend.',
      'p.b.pasaport': 'Passport', 'p.b.fon': 'Source-of-funds documents', 'p.b.vergi': 'Tax records (last 5 years)', 'p.b.banka': 'Bank statements',
      'p.b.sicil': 'Criminal record certificate', 'p.b.denklik': 'Diploma and recognition', 'p.b.isteklif': 'Job offer / contract', 'p.b.cv': 'CV (Europass)',
      'p.b.dil': 'Language certificate', 'p.b.teklif': 'Job offer', 'p.b.diploma': 'Diploma', 'p.b.deneyim': 'Employment references',
      'p.b.kabul': 'Letter of acceptance', 'p.b.transkript': 'Transcript', 'p.b.sinav': 'Language test result', 'p.b.mali': 'Proof of financial means',
      'p.b.ret': 'Refusal letter', 'p.b.onceki': 'Previous application file', 'p.b.guncel': 'Up-to-date financial documents', 'p.b.niyet': 'Statement of purpose',
      'p.csv.bas': 'Applicant;City;Country;Phone (masked);Route;Score;Temperature;Missing docs;Stage;Applied',
      'p.csv.dosya': 'altera-applicants-demo.csv'
    }
  };
  function kaydet() { try { if (window.AI18N && typeof window.AI18N.ekle === 'function' && !kaydet.ok) { window.AI18N.ekle(SOZ); kaydet.ok = true; } } catch (e) { } }
  kaydet();
  var sonDil = null;
  function dil() {
    var d = sonDil || (window.AI18N && window.AI18N.dil) || '';
    if (!d) { try { d = new URLSearchParams(location.search).get('dil') || ''; } catch (e) { } }
    if (!d) d = (document.documentElement.lang || 'tr').slice(0, 2);
    return SOZ[d] ? d : 'tr';
  }
  function yerel() { return dil() === 'en' ? 'en-GB' : 'tr-TR'; }
  function T(k, v) {
    var s = null;
    try { if (window.AI18N && typeof window.AI18N.t === 'function') { s = window.AI18N.t(k, v); if (s === k || s == null || s === '') s = null; } } catch (e) { s = null; }
    if (s == null) s = (SOZ[dil()] && SOZ[dil()][k]) || SOZ.tr[k] || k;
    if (v) s = String(s).replace(/\{(\w+)\}/g, function (m, a) { return v[a] != null ? v[a] : m; });
    return s;
  }
  function sayi(n) { try { return new Intl.NumberFormat(yerel()).format(n); } catch (e) { return String(n); } }

  /* =====================================================================
     SABİTLER
     ===================================================================== */
  var PROG_SIRA = ['eb5', 'bluecard', 'calisma', 'ogrenci', 'ret'];
  var PROG_RENK = { eb5: 'var(--pn-altin)', bluecard: 'var(--pn-mavi)', calisma: 'var(--pn-iyi)', ogrenci: 'var(--pn-mor)', ret: 'var(--pn-kotu)' };
  function progAd(k) { return T('p.pr.' + k); }
  function progKisa(k) { return T('p.prk.' + k); }
  var SIC_SIRA = { sicak: 3, ilik: 2, soguk: 1 };
  var SIC_RENK = { sicak: 'var(--pn-iyi)', ilik: 'var(--pn-uyari)', soguk: 'var(--pn-soluk)' };
  var DURUMLAR = ['yeni', 'arandi', 'gorusme', 'dosya'];
  var BELGE = {
    eb5: ['pasaport', 'fon', 'vergi', 'banka', 'sicil'],
    bluecard: ['pasaport', 'denklik', 'isteklif', 'cv', 'dil'],
    calisma: ['pasaport', 'teklif', 'diploma', 'deneyim', 'dil'],
    ogrenci: ['pasaport', 'kabul', 'transkript', 'sinav', 'mali'],
    ret: ['pasaport', 'ret', 'onceki', 'guncel', 'niyet']
  };
  // Şehirler: [tr, en, ülke kodu]
  var YER = {
    kadikoy: ['Kadıköy, İstanbul', 'Kadıköy, Istanbul', 'TR'], besiktas: ['Beşiktaş, İstanbul', 'Beşiktaş, Istanbul', 'TR'],
    atasehir: ['Ataşehir, İstanbul', 'Ataşehir, Istanbul', 'TR'], uskudar: ['Üsküdar, İstanbul', 'Üsküdar, Istanbul', 'TR'],
    sisli: ['Şişli, İstanbul', 'Şişli, Istanbul', 'TR'], bakirkoy: ['Bakırköy, İstanbul', 'Bakırköy, Istanbul', 'TR'],
    sariyer: ['Sarıyer, İstanbul', 'Sarıyer, Istanbul', 'TR'], maltepe: ['Maltepe, İstanbul', 'Maltepe, Istanbul', 'TR'],
    kartal: ['Kartal, İstanbul', 'Kartal, Istanbul', 'TR'], umraniye: ['Ümraniye, İstanbul', 'Ümraniye, Istanbul', 'TR'],
    basaksehir: ['Başakşehir, İstanbul', 'Başakşehir, Istanbul', 'TR'], beyoglu: ['Beyoğlu, İstanbul', 'Beyoğlu, Istanbul', 'TR'],
    ankara: ['Çankaya, Ankara', 'Çankaya, Ankara', 'TR'], izmir: ['Karşıyaka, İzmir', 'Karşıyaka, Izmir', 'TR'],
    antalya: ['Muratpaşa, Antalya', 'Muratpaşa, Antalya', 'TR'], bursa: ['Nilüfer, Bursa', 'Nilüfer, Bursa', 'TR'],
    baku: ['Bakü', 'Baku', 'AZ'], dubai: ['Dubai', 'Dubai', 'AE'], londra: ['Londra', 'London', 'GB'],
    berlin: ['Berlin', 'Berlin', 'DE'], amsterdam: ['Amsterdam', 'Amsterdam', 'NL'], tiflis: ['Tiflis', 'Tbilisi', 'GE'],
    doha: ['Doha', 'Doha', 'QA'], almati: ['Almatı', 'Almaty', 'KZ']
  };
  var TEL_ON = { TR: '+90 5••', AZ: '+994 5•', AE: '+971 5•', GB: '+44 7•••', DE: '+49 1••', NL: '+31 6', GE: '+995 5••', QA: '+974 ••', KZ: '+7 7••', US: '+1 •••' };
  var ULKE_YEDEK = {
    tr: { TR: 'Türkiye', AZ: 'Azerbaycan', AE: 'BAE', GB: 'Birleşik Krallık', DE: 'Almanya', NL: 'Hollanda', GE: 'Gürcistan', QA: 'Katar', KZ: 'Kazakistan', US: 'ABD', CA: 'Kanada', IE: 'İrlanda', IT: 'İtalya', AT: 'Avusturya' },
    en: { TR: 'Türkiye', AZ: 'Azerbaijan', AE: 'UAE', GB: 'United Kingdom', DE: 'Germany', NL: 'Netherlands', GE: 'Georgia', QA: 'Qatar', KZ: 'Kazakhstan', US: 'United States', CA: 'Canada', IE: 'Ireland', IT: 'Italy', AT: 'Austria' }
  };
  var ulkeAdCache = {};
  function ulkeAd(kod) {
    if (!kod) return '';
    var d = dil(), a = d + kod;
    if (ulkeAdCache[a]) return ulkeAdCache[a];
    var s = ULKE_YEDEK[d] && ULKE_YEDEK[d][kod];
    try { if (!s && window.Intl && Intl.DisplayNames) s = new Intl.DisplayNames([yerel()], { type: 'region' }).of(kod); } catch (e) { }
    return (ulkeAdCache[a] = s || kod);
  }
  function sehirAd(a) { return a.yer ? YER[a.yer][dil() === 'en' ? 1 : 0] : (a.sehirHam || '—'); }

  /* ---------- İkonlar (çizgi SVG) ---------- */
  function ik(ad, sinif) {
    var p = {
      zil: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0"/>',
      tel: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
      mesaj: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/>',
      x: '<path d="M18 6 6 18M6 6l12 12"/>',
      tamam: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16 9.8"/>',
      eksik: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.4v.1"/>',
      saat: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      ara: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      indir: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
      ok: '<path d="m6 15 6-6 6 6"/>',
      alev: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-1 2-2 3-3.5 3.5C11 7 10 5 10 3 7 5 5 9 5 15a7 7 0 0 0 7 7z"/>',
      belge: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
      hedef: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
      sifirla: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
      konum: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'
    }[ad] || '';
    return '<svg class="pn-ik' + (sinif ? ' ' + sinif : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + p + '</svg>';
  }

  /* ---------- Yardımcılar ---------- */
  function kac(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function kucuk(s) { return String(s || '').toLocaleLowerCase('tr-TR'); }
  function sicaklikOf(p) { return p >= 75 ? 'sicak' : p >= 55 ? 'ilik' : 'soguk'; }
  function basHarf(ad) { return ad.split(/\s+/).map(function (x) { return x.charAt(0); }).join('').slice(0, 2).toLocaleUpperCase('tr-TR'); }
  function maskeTel(ulke, son2) { return (TEL_ON[ulke] || '+••') + ' ••• •• ' + son2; }
  function maskeAd(ad) {
    var p = String(ad || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return '—';
    var ilk = p[0].charAt(0).toLocaleUpperCase('tr-TR') + p[0].slice(1).toLocaleLowerCase('tr-TR');
    if (p.length > 1) ilk += ' ' + p[p.length - 1].charAt(0).toLocaleUpperCase('tr-TR') + '.';
    return ilk.slice(0, 40);
  }
  function goreli(t) {
    var f = Date.now() - t;
    if (f < 90 * 1000) return T('p.az');
    try {
      var rtf = new Intl.RelativeTimeFormat(yerel(), { numeric: 'auto' });
      if (f < 3600000) return rtf.format(-Math.round(f / DK), 'minute');
      if (f < GUN) return rtf.format(-Math.round(f / 3600000), 'hour');
      return rtf.format(-Math.floor(f / GUN), 'day');
    } catch (e) { return Math.round(f / 3600000) + ' h'; }
  }
  function saatYaz(t) {
    try {
      return new Intl.DateTimeFormat(yerel(), { day: '2-digit', month: 'short' }).format(t) + ' · ' + new Intl.DateTimeFormat(yerel(), { hour: '2-digit', minute: '2-digit' }).format(t);
    } catch (e) { return new Date(t).toISOString().slice(0, 16); }
  }
  function sadeceSaat() { try { return new Intl.DateTimeFormat(yerel(), { hour: '2-digit', minute: '2-digit' }).format(Date.now()); } catch (e) { return ''; } }
  function rastgele(tohum) { // mulberry32 — her açılışta aynı demo verisi
    return function () {
      tohum |= 0; tohum = tohum + 0x6D2B79F5 | 0;
      var t = Math.imul(tohum ^ tohum >>> 15, 1 | tohum);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* =====================================================================
     DEMO VERİSİ (24 aday)
     ===================================================================== */
  var R = rastgele(20261014);
  function sec(a) { return a[Math.floor(R() * a.length)]; }
  var TOHUM = [
    ['Mert', 'K', 'kadikoy', 'eb5', 88], ['Elif', 'S', 'berlin', 'bluecard', 81], ['Burak', 'T', 'atasehir', 'calisma', 64],
    ['Zeynep', 'A', 'izmir', 'ogrenci', 77], ['Can', 'Y', 'dubai', 'eb5', 92], ['Deniz', 'Ö', 'bakirkoy', 'ret', 48],
    ['Selin', 'D', 'sariyer', 'bluecard', 70], ['Emre', 'Ç', 'ankara', 'calisma', 58], ['Leyla', 'M', 'baku', 'ogrenci', 66],
    ['Kerem', 'B', 'besiktas', 'eb5', 79], ['İrem', 'U', 'londra', 'bluecard', 52], ['Onur', 'E', 'kartal', 'ret', 61],
    ['Ece', 'M', 'uskudar', 'ogrenci', 84], ['Barış', 'Ş', 'antalya', 'calisma', 43], ['Gizem', 'P', 'umraniye', 'bluecard', 76],
    ['Kaan', 'İ', 'doha', 'eb5', 71], ['Melis', 'R', 'beyoglu', 'ogrenci', 59], ['Tolga', 'Z', 'maltepe', 'ret', 37],
    ['Nazlı', 'H', 'amsterdam', 'calisma', 68], ['Arda', 'L', 'sisli', 'bluecard', 86], ['Nino', 'G', 'tiflis', 'ogrenci', 45],
    ['Umut', 'V', 'basaksehir', 'eb5', 83], ['Aruzhan', 'S', 'almati', 'calisma', 55], ['Hakan', 'O', 'bursa', 'ret', 74]
  ];
  var YAS = ['18-24', '25-34', '35-44', '45-54', '55+'];
  var EGITIM = ['lise', 'onlisans', 'lisans', 'ylisans', 'doktora'];
  var DILV = ['baslangic', 'orta', 'iyi', 'ileri'];
  var DENEYIM = ['yok', 'd1', 'd3', 'd7'];
  var BUTCE = ['belirsiz', 'sinirli', 'ortab', 'yuksek'];
  var ZAMAN = ['z3', 'z6', 'z12', 'zb'];
  var HEDEF2 = { eb5: ['US'], bluecard: ['DE', 'NL', 'AT'], calisma: ['CA', 'DE', 'IE'], ogrenci: ['NL', 'IT', 'US', 'DE'], ret: ['US', 'GB', 'DE'] };

  var adaylar = TOHUM.map(function (t, i) {
    var kod = t[3], puan = t[4], yer = t[2], ulke = YER[yer][2];
    var programlar = PROG_SIRA.map(function (k) {
      var p = k === kod ? puan : Math.max(8, Math.min(puan - 4, Math.round(puan - 10 - R() * 45)));
      return { kod: k, puan: p };
    });
    var dk = i < 10 ? Math.round(i * i * 95 + 6 + R() * 50) : Math.round((7.3 + (i - 10) * 0.95 + R() * 0.6) * 1440);
    var zaman = SIMDI - dk * DK;
    var belgeler = BELGE[kod].map(function (b, j) {
      var r = R();
      return { k: b, durum: j === 0 ? 'tamam' : r < 0.55 ? 'tamam' : r < 0.78 ? 'eksik' : 'inceleme' };
    });
    var yasG = kod === 'ogrenci' ? sec(YAS.slice(0, 2)) : kod === 'eb5' ? sec(YAS.slice(2)) : sec(YAS.slice(1, 4));
    var durum = i < 4 ? 'yeni' : dk > 9 * 1440 ? sec(['arandi', 'gorusme', 'dosya', 'dosya']) : sec(['yeni', 'arandi', 'arandi', 'gorusme']);
    // cevap: [etiket anahtarı, değer, tür] tür: 'k' = sözlük anahtarı, 'u' = ülke kodu, 'h' = ham metin
    var cevaplar = [
      ['p.c.yas', yasG, 'h'],
      ['p.c.egitim', 'p.v.' + (kod === 'ogrenci' ? sec(['lise', 'lisans']) : sec(EGITIM.slice(1))), 'k'],
      ['p.c.dil', 'p.v.' + sec(DILV), 'k'],
      ['p.c.deneyim', 'p.v.' + (kod === 'ogrenci' ? sec(DENEYIM.slice(0, 2)) : sec(DENEYIM.slice(1))), 'k'],
      ['p.c.butce', 'p.v.' + (kod === 'eb5' ? sec(['ortab', 'yuksek', 'yuksek']) : sec(BUTCE)), 'k'],
      ['p.c.hedef', sec(HEDEF2[kod]), 'u'],
      ['p.c.zaman', 'p.v.' + sec(ZAMAN), 'k'],
      ['p.c.ret', 'p.v.' + (kod === 'ret' ? 'evet' : sec(['hayir', 'hayir', 'hayir', 'evet'])), 'k']
    ];
    var gecmis = [{ t: zaman, k: 'p.h.test', v: { puan: puan } }];
    if (durum !== 'yeni') gecmis.push({ t: zaman + Math.round((2 + R() * 20) * 3600000), k: 'p.h.durum', dk: durum });
    var son2 = String(10 + Math.floor(R() * 89));
    return {
      id: 'a' + (i + 1), ad: t[0] + ' ' + t[1] + '.', yer: yer, ulke: ulke, tel: maskeTel(ulke, son2),
      program: kod, puan: puan, programlar: programlar, sicaklik: sicaklikOf(puan),
      belgeler: belgeler, zaman: zaman, durum: durum, cevaplar: cevaplar,
      not: i % 5 === 2 ? { k: 'p.not.' + (i % 5) } : null, gecmis: gecmis, yeni: false
    };
  });
  adaylar.forEach(function (a) { a.eksik = a.belgeler.filter(function (b) { return b.durum === 'eksik'; }).length; });
  function notMetni(a) { return !a.not ? '' : a.not.k ? T(a.not.k) : a.not.m; }
  function cevapDeger(c) { return c[2] === 'k' ? T(c[1]) : c[2] === 'u' ? ulkeAd(c[1]) : c[1]; }
  function cevapEtiket(c) { return c[3] ? c[0] : T(c[0]); } // c[3] = ham etiket (yeni başvuru)
  function gecmisMetni(g) {
    if (g.m) return g.m;
    if (g.k === 'p.h.durum') return T('p.h.durum', { d: T('p.d.' + g.dk) });
    if (g.k === 'p.h.hatirlat') return T('p.h.hatirlat', { liste: g.belgeler.map(function (b) { return T('p.b.' + b); }).join(', ') });
    return T(g.k, g.v);
  }

  /* =====================================================================
     DURUM
     ===================================================================== */
  var S = { goster: 8, program: 'hepsi', sic: 'hepsi', ulke: 'hepsi', ara: '', siraK: 'zaman', siraY: -1, cizildi: false, demoBildirim: false };
  var sayacOnce = null;
  var bekleyenBildirim = [];
  var ic = document.createElement('div'); ic.className = 'pn-ic';
  kok.appendChild(ic);
  function $(ad) { return kok.querySelector('[data-pn="' + ad + '"]'); }

  /* ---------- İskelet (dil değişince yeniden kurulur) ---------- */
  function th(k) { return '<th scope="col" data-k="' + k + '"><button type="button" data-sirala="' + k + '">' + T('p.th.' + k) + ik('ok', 'pn-ok') + '</button></th>'; }
  function ulkeListesi() {
    var u = {}; adaylar.forEach(function (a) { if (a.ulke) u[a.ulke] = 1; });
    return Object.keys(u).sort(function (x, y) { return x === 'TR' ? -1 : y === 'TR' ? 1 : ulkeAd(x).localeCompare(ulkeAd(y), yerel()); });
  }
  function ulkeSecenek() {
    return '<option value="hepsi">' + T('p.s.tumulke') + '</option>' + ulkeListesi().map(function (u) { return '<option value="' + u + '"' + (S.ulke === u ? ' selected' : '') + '>' + kac(ulkeAd(u)) + '</option>'; }).join('');
  }
  function iskelet() {
    var SR = ['zaman:-1', 'puan:-1', 'puan:1', 'sicaklik:-1', 'eksik:-1', 'ad:1', 'konum:1', 'durum:1'];
    ic.innerHTML =
      '<span class="pn-demo-not"><i aria-hidden="true"></i>' + T('p.demo') + '</span>' +
      '<div class="pn-ust">' +
      '<div><h2>' + T('p.baslik') + '</h2><p>' + T('p.giris') + '</p></div>' +
      '<div class="pn-ust-sag"><span class="pn-canli"><b aria-hidden="true"></b><span data-pn="saat"></span></span>' +
      '<button type="button" class="pn-dugme" data-pn="csv">' + ik('indir') + T('p.csv') + '</button></div>' +
      '</div>' +
      '<div class="pn-kpi" data-pn="kpi" aria-live="polite"></div>' +
      '<div class="pn-grafikler" data-pn="grafikler">' +
      '<section class="pn-grafik" aria-labelledby="pn-g1"><h3 id="pn-g1">' + T('p.g.puan') + '</h3><p class="pn-gr-alt">' + T('p.g.puan.alt') + '</p><div class="pn-hist" data-pn="hist"></div>' +
      '<div class="pn-hist-lejant"><span><i style="background:var(--pn-soluk)"></i>' + kac(T('p.lej.soguk')) + '</span><span><i style="background:var(--pn-uyari)"></i>' + kac(T('p.lej.ilik')) + '</span><span><i style="background:var(--pn-iyi)"></i>' + kac(T('p.lej.sicak')) + '</span></div></section>' +
      '<section class="pn-grafik" aria-labelledby="pn-g2"><h3 id="pn-g2">' + T('p.g.prog') + '</h3><p class="pn-gr-alt">' + T('p.g.prog.alt') + '</p><div class="pn-halka-sar" data-pn="halka"></div></section>' +
      '<section class="pn-grafik" aria-labelledby="pn-g3"><h3 id="pn-g3">' + T('p.g.huni') + '</h3><p class="pn-gr-alt">' + T('p.g.huni.alt') + '</p><ul class="pn-huni" data-pn="huni"></ul><p class="pn-huni-not" data-pn="huni-not"></p></section>' +
      '</div>' +
      '<div class="pn-suzgec" role="search" aria-label="' + kac(T('p.s.aria')) + '">' +
      '<label class="pn-ara"><span class="pn-gizli">' + T('p.s.ara.et') + '</span>' + ik('ara') + '<input type="search" data-pn="ara" placeholder="' + kac(T('p.s.ara')) + '" autocomplete="off" value="' + kac(S.ara) + '"></label>' +
      '<label class="pn-gizli" for="pn-prog-sec">' + T('p.s.prog') + '</label>' +
      '<select class="pn-secim" id="pn-prog-sec" data-pn="prog"><option value="hepsi">' + T('p.s.tumprog') + '</option>' +
      PROG_SIRA.map(function (k) { return '<option value="' + k + '"' + (S.program === k ? ' selected' : '') + '>' + progAd(k) + '</option>'; }).join('') + '</select>' +
      '<label class="pn-gizli" for="pn-ulke-sec">' + T('p.s.ulke') + '</label>' +
      '<select class="pn-secim" id="pn-ulke-sec" data-pn="ulke">' + ulkeSecenek() + '</select>' +
      '<div class="pn-segment" role="group" aria-label="' + kac(T('p.s.sic')) + '" data-pn="sic">' +
      '<button type="button" data-v="hepsi" aria-pressed="' + (S.sic === 'hepsi') + '">' + T('p.s.tumu') + '</button>' +
      ['sicak', 'ilik', 'soguk'].map(function (k) { return '<button type="button" data-v="' + k + '" aria-pressed="' + (S.sic === k) + '"><i style="background:' + SIC_RENK[k] + '" aria-hidden="true"></i>' + T('p.sic.' + k) + '</button>'; }).join('') +
      '</div>' +
      '<label class="pn-siralama-mobil"><span>' + T('p.s.sirala') + '</span><select class="pn-secim" data-pn="mobil-sira">' +
      SR.map(function (v) { return '<option value="' + v + '">' + T('p.sr.' + v.replace(':', '')) + '</option>'; }).join('') +
      '</select></label>' +
      '<span class="pn-sonuc-say" data-pn="say" aria-live="polite"></span>' +
      '</div>' +
      '<div class="pn-tablo-sar"><table class="pn-tablo"><caption class="pn-gizli">' + T('p.tablo.cap') + '</caption><thead><tr>' +
      th('ad') + th('konum') + th('program') + th('puan') + th('sicaklik') + th('eksik') + th('durum') + th('zaman') +
      '</tr></thead><tbody data-pn="govde"></tbody></table></div>' +
      '<div class="pn-alt-cubuk"><span>' + T('p.alt.not') + '</span><span data-pn="guncel"></span></div>';
  }

  /* =====================================================================
     SAYAÇLAR — hepsi aynı `adaylar` dizisinden
     ===================================================================== */
  function hesapla() {
    var haftaBas = SIMDI - 7 * GUN, onceki = SIMDI - 14 * GUN;
    var h = { hafta: 0, gecen: 0, sicak: 0, sicakHafta: 0, eksikli: 0, eksikToplam: 0, top: 0, ulke: {} };
    adaylar.forEach(function (a) {
      if (a.zaman >= haftaBas) { h.hafta++; if (a.sicaklik === 'sicak') h.sicakHafta++; }
      else if (a.zaman >= onceki) h.gecen++;
      if (a.sicaklik === 'sicak') h.sicak++;
      if (a.eksik > 0) h.eksikli++;
      h.eksikToplam += a.eksik; h.top += a.puan;
      if (a.ulke) h.ulke[a.ulke] = 1;
    });
    h.gunluk = [];
    for (var g = 13; g >= 0; g--) {
      var bas = SIMDI - (g + 1) * GUN, son = SIMDI - g * GUN;
      h.gunluk.push(adaylar.filter(function (a) { return a.zaman > bas && (g === 0 || a.zaman <= son); }).length);
    }
    h.ort = adaylar.length ? Math.round(h.top / adaylar.length) : 0;
    h.toplam = adaylar.length; h.ulkeSay = Object.keys(h.ulke).length;
    return h;
  }
  function spark(d) {
    var w = 92, h = 34, mx = Math.max.apply(null, d.concat([1]));
    var pts = d.map(function (v, i) { return [(i / (d.length - 1)) * w, h - 3 - (v / mx) * (h - 8)]; });
    var yol = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return '<svg class="pn-spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><path class="pn-spark-alan" d="' + yol + ' L' + w + ' ' + h + ' L0 ' + h + ' Z"/><path d="' + yol + '"/></svg>';
  }
  function kpi(k, ikon, et, sayiV, ek, alt, sp) {
    return '<div data-kpi="' + k + '"><span class="pn-kpi-isik" aria-hidden="true"></span><div class="pn-kpi-et">' + ikon + et + '</div>' + sp +
      '<div class="pn-kpi-sayi"><span data-sayi data-v="' + sayiV + '">' + sayi(sayiV) + '</span>' + (ek ? '<small>' + ek + '</small>' : '') + '<span class="pn-artis" aria-hidden="true"></span></div>' +
      '<div class="pn-kpi-alt">' + alt + '</div></div>';
  }
  function kpiCiz(vurgu) {
    var h = hesapla(), fark = h.hafta - h.gecen;
    var kutu = $('kpi');
    kutu.innerHTML =
      kpi('hafta', ik('saat'), T('p.kpi.hafta'), h.hafta, '', T('p.kpi.hafta.alt', { fark: '<b>' + (fark >= 0 ? '+' : '−') + sayi(Math.abs(fark)) + '</b>' }), spark(h.gunluk)) +
      kpi('sicak', ik('alev'), T('p.kpi.sicak'), h.sicak, '', T('p.kpi.sicak.alt', { n: '<b>' + sayi(h.sicakHafta) + '</b>' }), '') +
      kpi('eksik', ik('belge'), T('p.kpi.eksik'), h.eksikli, '/ ' + sayi(h.toplam), T('p.kpi.eksik.alt', { n: '<b>' + sayi(h.eksikToplam) + '</b>' }), '') +
      kpi('ort', ik('hedef'), T('p.kpi.ort'), h.ort, '/ ' + sayi(100), T('p.kpi.ort.alt', { u: '<b>' + sayi(h.ulkeSay) + '</b>' }), '');
    var yeni = { hafta: h.hafta, sicak: h.sicak, eksik: h.eksikli, ort: h.ort };
    Object.keys(yeni).forEach(function (k) {
      var el = kutu.querySelector('[data-kpi="' + k + '"] [data-sayi]');
      if (vurgu === 'say') sayYuru(el, 0, yeni[k]);
      else if (vurgu && sayacOnce && yeni[k] !== sayacOnce[k]) {
        sayYuru(el, sayacOnce[k], yeni[k]);
        var kap = kutu.querySelector('[data-kpi="' + k + '"]');
        var art = kap.querySelector('.pn-artis'), d = yeni[k] - sayacOnce[k];
        art.textContent = (d > 0 ? '+' : '−') + sayi(Math.abs(d));
        requestAnimationFrame(function () { kap.classList.add('pn-parla'); art.classList.add('pn-gor'); });
        setTimeout(function () { art.classList.remove('pn-gor'); kap.classList.remove('pn-parla'); }, 2600);
      }
    });
    sayacOnce = yeni;
  }
  function sayYuru(el, bas, son) {
    if (!el) return;
    if (AZ_HAREKET || bas === son) { el.textContent = sayi(son); return; }
    var t0 = performance.now(), sure = 900;
    (function ad(t) {
      var p = Math.min(1, (t - t0) / sure), e = 1 - Math.pow(1 - p, 3);
      el.textContent = sayi(Math.round(bas + (son - bas) * e));
      if (p < 1) requestAnimationFrame(ad);
    })(t0);
  }

  /* =====================================================================
     GRAFİKLER — animasyon yalnız transform + opacity
     ===================================================================== */
  var KENAR = [0, 45, 55, 65, 75, 85, 101], ETIKET = ['<45', '45-54', '55-64', '65-74', '75-84', '85+'];
  function histCiz() {
    var kutu = $('hist');
    var kovalar = ETIKET.map(function () { return 0; });
    adaylar.forEach(function (a) { for (var i = 0; i < 6; i++) if (a.puan >= KENAR[i] && a.puan < KENAR[i + 1]) { kovalar[i]++; break; } });
    var W = 340, H = 186, sol = 24, alt = 22, ust = 34;
    var enCok = Math.max.apply(null, kovalar.concat([1]));
    var adim = enCok <= 4 ? 1 : enCok <= 8 ? 2 : enCok <= 16 ? 4 : 5;
    var mx = Math.ceil((enCok + 1) / adim) * adim; // tepe çubuğun üstünde değer etiketi için boşluk
    var bw = (W - sol) / kovalar.length;
    var yk = function (v) { return H - alt - (v / mx) * (H - alt - ust); };
    var liste = kovalar.map(function (v, i) { return T('p.g.aralik', { a: i === 0 ? T('p.g.alt45') : ETIKET[i], n: v }); }).join(', ');
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + kac(T('p.g.aria.hist', { liste: liste })) + '">';
    var cizgiAdim = adim * Math.max(1, Math.round(mx / adim / 3));
    for (var g = 0; g <= mx; g += cizgiAdim) {
      s += '<line class="pn-izgara" x1="' + sol + '" x2="' + W + '" y1="' + yk(g) + '" y2="' + yk(g) + '"/><text class="pn-eksen" x="' + (sol - 7) + '" y="' + (yk(g) + 3) + '" text-anchor="end">' + sayi(g) + '</text>';
    }
    // Eşik: çizgi çubuk alanında, etiketi grafiğin en üst satırında (çubuk değerleri bu satıra hiç çıkmaz)
    var esX = sol + 4 * bw;
    s += '<line class="pn-esik" x1="' + esX + '" x2="' + esX + '" y1="4" y2="' + (H - alt) + '"/>';
    s += '<text class="pn-esik-yazi" x="' + (esX + 6) + '" y="11">' + kac(T('p.g.esik')) + ' →</text>';
    kovalar.forEach(function (v, i) {
      var sic = KENAR[i] >= 75 ? 'sicak' : KENAR[i] >= 55 ? 'ilik' : 'soguk';
      var h = (v / mx) * (H - alt - ust), x = sol + i * bw + 7, w = bw - 14, y = H - alt - h;
      var et = T('p.g.aralik', { a: i === 0 ? T('p.g.alt45') : ETIKET[i], n: v });
      s += '<g class="pn-hist-g" data-sic="' + sic + '" style="--i:' + i + '">' +
        '<rect class="pn-hist-alan" x="' + (x - 5) + '" y="' + ust + '" width="' + (w + 10) + '" height="' + (H - alt - ust) + '" fill="transparent"/>' +
        '<rect class="pn-hist-cubuk" x="' + x + '" y="' + y + '" width="' + w + '" height="' + Math.max(h, 0.5) + '" rx="4" style="fill:' + SIC_RENK[sic] + '"><title>' + kac(et) + '</title></rect>' +
        '<text class="pn-hist-deger" x="' + (x + w / 2) + '" y="' + (y - 6) + '" text-anchor="middle">' + sayi(v) + '</text></g>';
      s += '<text class="pn-eksen" x="' + (x + w / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + kac(ETIKET[i]) + '</text>';
    });
    kutu.innerHTML = s + '</svg>';
    kutu.classList.toggle('pn-ciz', S.cizildi);
  }
  function halkaCiz() {
    var kutu = $('halka'), say = {}, top = adaylar.length;
    PROG_SIRA.forEach(function (k) { say[k] = 0; });
    adaylar.forEach(function (a) { say[a.program]++; });
    var r = 46, C = 2 * Math.PI * r, bas = 0, bosluk = 2;
    var s = '<svg viewBox="0 0 120 120" role="img" aria-label="' + kac(T('p.g.prog') + ': ' + PROG_SIRA.map(function (k) { return progKisa(k) + ' ' + say[k]; }).join(', ')) + '">' +
      '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="rgba(244,239,230,.07)" stroke-width="14"/>' +
      '<g class="pn-halka-don"><g transform="rotate(-90 60 60)">';
    PROG_SIRA.forEach(function (k, i) {
      var uz = top ? (say[k] / top) * C : 0, gor = Math.max(0, uz - bosluk);
      s += '<circle class="pn-halka-dilim" data-prog="' + k + '" cx="60" cy="60" r="' + r + '" fill="none" stroke="#888" style="stroke:' + PROG_RENK[k] + ';--i:' + i + '" stroke-width="14" stroke-dashoffset="' + (-bas).toFixed(2) + '" stroke-dasharray="' + gor.toFixed(2) + ' ' + (C - gor).toFixed(2) + '"/>';
      bas += uz;
    });
    s += '</g></g><text class="pn-halka-orta" x="60" y="62" text-anchor="middle">' + sayi(top) + '</text><text class="pn-halka-orta-alt" x="60" y="77" text-anchor="middle">' + kac(T('p.g.aday').toLocaleUpperCase(yerel())) + '</text></svg>';
    s += '<ul class="pn-lejant">' + PROG_SIRA.map(function (k) {
      return '<li><button type="button" data-prog-sec="' + k + '" aria-pressed="' + (S.program === k) + '"><i style="background:' + PROG_RENK[k] + '" aria-hidden="true"></i><span>' + progKisa(k) + '</span><b>' + sayi(say[k]) + '</b></button></li>';
    }).join('') + '</ul>';
    kutu.innerHTML = s;
    kutu.classList.toggle('pn-ciz', S.cizildi);
    halkaVurgu();
  }
  function halkaVurgu() {
    kok.querySelectorAll('.pn-halka-dilim').forEach(function (c) { c.classList.toggle('pn-soluk-dilim', !(S.program === 'hepsi' || c.getAttribute('data-prog') === S.program)); });
    kok.querySelectorAll('[data-prog-sec]').forEach(function (b) { b.setAttribute('aria-pressed', String(S.program === b.getAttribute('data-prog-sec'))); });
  }
  function huniCiz() {
    var say = { yeni: 0, arandi: 0, gorusme: 0, dosya: 0 };
    adaylar.forEach(function (a) { say[a.durum]++; });
    var mx = Math.max(1, adaylar.length);
    $('huni').innerHTML = DURUMLAR.map(function (d, i) {
      var w = say[d] / mx;
      return '<li><span>' + T('p.d.' + d) + '</span><span class="pn-huni-ray"><span class="pn-huni-dol" style="--o:' + w.toFixed(3) + ';--i:' + i + '"></span></span><b>' + sayi(say[d]) + '</b></li>';
    }).join('');
    $('huni').classList.toggle('pn-ciz', S.cizildi);
    var bekleyen = adaylar.filter(function (a) { return a.durum === 'yeni' && a.sicaklik === 'sicak'; }).length;
    $('huni-not').innerHTML = bekleyen ? T('p.g.huni.not', { n: '<b>' + sayi(bekleyen) + '</b>' }) : T('p.g.huni.not0');
  }
  function grafikleriCiz() { histCiz(); halkaCiz(); huniCiz(); }
  function animasyonBaslat() {
    if (S.cizildi) return;
    S.cizildi = true;
    var kutular = [$('hist'), $('halka'), $('huni')];
    kutular.forEach(function (k) { k.classList.remove('pn-ciz'); });
    void kok.offsetWidth;
    requestAnimationFrame(function () { requestAnimationFrame(function () { kutular.forEach(function (k) { k.classList.add('pn-ciz'); }); }); });
    kpiCiz('say');
  }

  /* =====================================================================
     TABLO
     ===================================================================== */
  function konumMetni(a) { return sehirAd(a) + (a.ulke ? ' · ' + ulkeAd(a.ulke) : ''); }
  function suzulmus() {
    var q = kucuk(S.ara).trim();
    var l = adaylar.filter(function (a) {
      if (S.program !== 'hepsi' && a.program !== S.program) return false;
      if (S.sic !== 'hepsi' && a.sicaklik !== S.sic) return false;
      if (S.ulke !== 'hepsi' && a.ulke !== S.ulke) return false;
      if (q) {
        var metin = kucuk([a.ad, a.yer ? YER[a.yer][0] + ' ' + YER[a.yer][1] : a.sehirHam, ulkeAd(a.ulke), ULKE_YEDEK.tr[a.ulke], ULKE_YEDEK.en[a.ulke], progAd(a.program), progKisa(a.program), T('p.sic.' + a.sicaklik), T('p.d.' + a.durum)].join(' '));
        if (metin.indexOf(q) < 0) return false;
      }
      return true;
    });
    var k = S.siraK, y = S.siraY, loc = yerel();
    l.sort(function (a, b) {
      if (a.yeni !== b.yeni) return a.yeni ? -1 : 1; // yeni başvurular en üstte kalır
      var x, z;
      if (k === 'ad') return a.ad.localeCompare(b.ad, loc) * y;
      if (k === 'konum') return konumMetni(a).localeCompare(konumMetni(b), loc) * y;
      if (k === 'program') return progKisa(a.program).localeCompare(progKisa(b.program), loc) * y || (b.puan - a.puan);
      if (k === 'sicaklik') { x = SIC_SIRA[a.sicaklik]; z = SIC_SIRA[b.sicaklik]; }
      else if (k === 'durum') { x = DURUMLAR.indexOf(a.durum); z = DURUMLAR.indexOf(b.durum); }
      else { x = a[k]; z = b[k]; }
      return ((x > z) - (x < z)) * y || (b.puan - a.puan);
    });
    return l;
  }
  function satir(a) {
    var konum = konumMetni(a);
    return '<tr tabindex="0" data-id="' + a.id + '" class="' + (a.yeni ? 'pn-yeni' : '') + '" aria-label="' + kac(T('p.satir.aria', { ad: a.ad, konum: konum, prog: progAd(a.program), puan: a.puan, sic: T('p.sic.' + a.sicaklik) })) + '">' +
      '<td data-k="ad"><div class="pn-ad"><span class="pn-avatar" aria-hidden="true">' + kac(basHarf(a.ad)) + '</span><div class="pn-ad-m"><strong>' + kac(a.ad) + (a.yeni ? '<span class="pn-yeni-et">' + T('p.yeni') + '</span>' : '') + '</strong><small>' + kac(a.tel) + '</small></div></div></td>' +
      '<td data-k="konum" data-et="' + kac(T('p.th.konum')) + '"><span class="pn-konum">' + kac(sehirAd(a)) + '<small>' + kac(ulkeAd(a.ulke)) + '</small></span></td>' +
      '<td data-k="program" data-et="' + kac(T('p.th.program')) + '"><span class="pn-prog"><i style="background:' + PROG_RENK[a.program] + '" aria-hidden="true"></i>' + progAd(a.program) + '</span></td>' +
      '<td data-k="puan" data-et="' + kac(T('p.th.puan')) + '"><div class="pn-puan"><b>' + sayi(a.puan) + '</b><span aria-hidden="true"><i style="transform:scaleX(' + (a.puan / 100) + ');background:' + SIC_RENK[a.sicaklik] + '"></i></span></div></td>' +
      '<td data-k="sicaklik"><span class="pn-sic pn-sic-' + a.sicaklik + '">' + T('p.sic.' + a.sicaklik) + '</span></td>' +
      '<td data-k="eksik" data-et="' + kac(T('p.th.eksik')) + '"><span class="pn-eksik ' + (a.eksik ? 'pn-var' : 'pn-yok') + '">' + ik(a.eksik ? 'eksik' : 'tamam') + (a.eksik ? T('p.eksik.n', { n: sayi(a.eksik) }) : T('p.eksik.0')) + '</span></td>' +
      '<td data-k="durum" data-et="' + kac(T('p.th.durum')) + '"><span class="pn-durum pn-d-' + a.durum + '">' + T('p.d.' + a.durum) + '</span></td>' +
      '<td data-k="zaman" data-et="' + kac(T('p.th.zaman')) + '"><span class="pn-zaman" title="' + kac(saatYaz(a.zaman)) + '">' + kac(goreli(a.zaman)) + '</span></td></tr>';
  }
  function tabloCiz() {
    var l = suzulmus(), g = $('govde');
    var dar = window.matchMedia && window.matchMedia('(max-width: 1080px)').matches;
    var gor = dar && l.length > S.goster + 2 ? l.slice(0, S.goster) : l;
    g.innerHTML = l.length ? gor.map(satir).join('') + (gor.length < l.length ? '<tr class="pn-bos-sat pn-daha-sat"><td colspan="8"><button type="button" class="pn-dugme pn-genis" data-pn="dahafazla">' + T('p.dahafazla', { n: sayi(l.length - gor.length) }) + '</button></td></tr>' : '') :
      '<tr class="pn-bos-sat"><td colspan="8" class="pn-bos">' + T('p.bos') + '<br><button type="button" class="pn-dugme" data-pn="sifirla">' + ik('sifirla') + T('p.sifirla') + '</button></td></tr>';
    $('say').textContent = T('p.s.say', { n: sayi(l.length), t: sayi(adaylar.length) });
    kok.querySelectorAll('.pn-tablo th').forEach(function (t) {
      if (t.getAttribute('data-k') === S.siraK) t.setAttribute('aria-sort', S.siraY > 0 ? 'ascending' : 'descending');
      else t.removeAttribute('aria-sort');
    });
    var ms = $('mobil-sira'), v = S.siraK + ':' + S.siraY;
    if (ms.querySelector('option[value="' + v + '"]')) ms.value = v;
    $('guncel').textContent = T('p.alt.guncel', { s: sadeceSaat() });
  }
  function tumunuCiz(vurgu) { kpiCiz(vurgu); grafikleriCiz(); tabloCiz(); saatTazele(); }

  /* ---------- Süzgeç / sıralama olayları (temsilci: dil değişiminde iskelet yeniden kurulsa da çalışır) ---------- */
  var araZ;
  kok.addEventListener('input', function (e) {
    if (e.target.getAttribute('data-pn') !== 'ara') return;
    clearTimeout(araZ);
    araZ = setTimeout(function () { S.ara = e.target.value; tabloCiz(); }, 120);
  });
  kok.addEventListener('change', function (e) {
    var p = e.target.getAttribute('data-pn');
    if (p === 'prog') { S.program = e.target.value; halkaVurgu(); tabloCiz(); }
    else if (p === 'ulke') { S.ulke = e.target.value; tabloCiz(); }
    else if (p === 'mobil-sira') { var v = e.target.value.split(':'); S.siraK = v[0]; S.siraY = +v[1]; tabloCiz(); }
  });
  function sicSec(v) {
    S.sic = v;
    $('sic').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-v') === v)); });
    tabloCiz();
  }
  kok.addEventListener('click', function (e) {
    var t = e.target;
    if (!ic.contains(t)) return;
    var sb = t.closest('[data-pn="sic"] button'); if (sb) { sicSec(sb.getAttribute('data-v')); return; }
    var sr = t.closest('[data-sirala]');
    if (sr) {
      var k = sr.getAttribute('data-sirala');
      if (S.siraK === k) S.siraY = -S.siraY;
      else { S.siraK = k; S.siraY = (k === 'ad' || k === 'program' || k === 'durum' || k === 'konum') ? 1 : -1; }
      tabloCiz(); return;
    }
    var ps = t.closest('[data-prog-sec]');
    if (ps) {
      var pk = ps.getAttribute('data-prog-sec');
      S.program = S.program === pk ? 'hepsi' : pk;
      $('prog').value = S.program; halkaVurgu(); tabloCiz(); return;
    }
    var hc = t.closest('.pn-hist-g');
    if (hc) { var hs = hc.getAttribute('data-sic'); sicSec(S.sic === hs ? 'hepsi' : hs); return; }
    if (t.closest('[data-pn="sifirla"]')) {
      S.program = 'hepsi'; S.sic = 'hepsi'; S.ulke = 'hepsi'; S.ara = '';
      $('ara').value = ''; $('prog').value = 'hepsi'; $('ulke').value = 'hepsi'; halkaVurgu(); sicSec('hepsi');
      $('ara').focus(); return;
    }
    if (t.closest('[data-pn="csv"]')) { csvIndir(); return; }
    if (t.closest('[data-pn="dahafazla"]')) { var once = S.goster; S.goster += 8; tabloCiz(); var sr2 = kok.querySelectorAll('tbody tr[data-id]')[once]; if (sr2) sr2.focus({ preventScroll: true }); return; }
    var tr = t.closest('tbody tr[data-id]');
    if (tr) cekmeceAc(tr.getAttribute('data-id'), tr);
  });
  kok.addEventListener('keydown', function (e) {
    var tr = e.target.closest && e.target.closest('tbody tr[data-id]'); if (!tr) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cekmeceAc(tr.getAttribute('data-id'), tr); }
    else if (e.key === 'ArrowDown' && tr.nextElementSibling) { e.preventDefault(); tr.nextElementSibling.focus(); }
    else if (e.key === 'ArrowUp' && tr.previousElementSibling) { e.preventDefault(); tr.previousElementSibling.focus(); }
  });

  function csvIndir() {
    var l = suzulmus();
    var bas = T('p.csv.bas').split(';');
    var sat = l.map(function (a) { return [a.ad, sehirAd(a), ulkeAd(a.ulke), a.tel, progAd(a.program), a.puan, T('p.sic.' + a.sicaklik), a.eksik, T('p.d.' + a.durum), saatYaz(a.zaman)]; });
    var csv = '﻿' + [bas].concat(sat).map(function (r) { return r.map(function (h) { return '"' + String(h).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    try {
      var url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      var a = document.createElement('a'); a.href = url; a.download = T('p.csv.dosya');
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      tost(T('p.t.csv', { n: sayi(l.length) }));
    } catch (err) { tost(T('p.t.csvhata')); }
  }

  /* =====================================================================
     ÇEKMECE
     ===================================================================== */
  var perde = document.createElement('div'); perde.className = 'pn-perde'; perde.hidden = true;
  var ck = document.createElement('aside');
  ck.className = 'pn-cekmece'; ck.hidden = true;
  ck.setAttribute('role', 'dialog'); ck.setAttribute('aria-modal', 'true'); ck.setAttribute('aria-labelledby', 'pn-ck-baslik');
  var bildirimKutu = document.createElement('div'); bildirimKutu.className = 'pn-bildirimler'; bildirimKutu.setAttribute('aria-live', 'polite');
  var tostEl = document.createElement('div'); tostEl.className = 'pn-tost'; tostEl.setAttribute('role', 'status'); tostEl.setAttribute('aria-live', 'polite');
  var katman = document.createElement('div'); katman.id = 'pn-katman'; 
  katman.appendChild(perde); katman.appendChild(ck); katman.appendChild(bildirimKutu); katman.appendChild(tostEl);
  document.body.appendChild(katman);
  function katmanGuncelle() { katman.hidden = !panelGorunur(); }
  var ckAday = null, ckDonus = null, ckZ, notTaslak = null;

  function cekmeceAc(id, donus) {
    var a = adaylar.filter(function (x) { return x.id === id; })[0]; if (!a) return;
    ckAday = a; ckDonus = donus || document.activeElement; notTaslak = null;
    a.yeni = false;
    cekmeceIcerik();
    clearTimeout(ckZ);
    ck.classList.remove('pn-ciz');
    perde.hidden = false; ck.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    void ck.offsetWidth;
    perde.classList.add('pn-acik'); ck.classList.add('pn-acik');
    setTimeout(function () { ck.classList.add('pn-ciz'); }, AZ_HAREKET ? 0 : 200);
    ck.querySelector('.pn-ck-kapat').focus({ preventScroll: true });
  }
  function cekmeceKapat() {
    if (!ckAday) return;
    var id = ckAday.id;
    ckAday = null;
    perde.classList.remove('pn-acik'); ck.classList.remove('pn-acik');
    document.documentElement.style.overflow = '';
    ckZ = setTimeout(function () { perde.hidden = true; ck.hidden = true; ck.classList.remove('pn-ciz'); }, AZ_HAREKET ? 0 : 430);
    tabloCiz();
    var hedef = kok.querySelector('tbody tr[data-id="' + id + '"]');
    (hedef || (ckDonus && document.contains(ckDonus) ? ckDonus : $('ara'))).focus({ preventScroll: true });
  }
  function cekmeceIcerik() {
    var a = ckAday;
    var tamam = a.belgeler.filter(function (b) { return b.durum === 'tamam'; }).length;
    var bIk = { tamam: 'tamam', eksik: 'eksik', inceleme: 'saat' };
    var pp = a.programlar.slice().sort(function (x, y) { return y.puan - x.puan; });
    var notDeger = notTaslak != null ? notTaslak : notMetni(a);
    ck.innerHTML =
      '<div class="pn-ck-bas"><span class="pn-avatar" aria-hidden="true">' + kac(basHarf(a.ad)) + '</span><div style="min-width:0">' +
      '<h3 id="pn-ck-baslik">' + kac(a.ad) + '</h3><p>' + kac(konumMetni(a)) + '</p><p>' + kac(a.tel) + '</p>' +
      '<p class="pn-ck-rozet"><span class="pn-sic pn-sic-' + a.sicaklik + '">' + T('p.sic.' + a.sicaklik) + ' · ' + sayi(a.puan) + '</span><span class="pn-sic pn-sic-notr">' + progKisa(a.program) + '</span></p>' +
      '</div><button type="button" class="pn-ck-kapat" aria-label="' + kac(T('p.ck.kapat')) + '">' + ik('x') + '</button></div>' +
      '<div class="pn-ck-govde">' +
      '<div class="pn-ck-bolum"><div class="pn-ck-eylem">' +
      '<button type="button" class="pn-dugme pn-ana" data-eylem="ara">' + ik('tel') + T('p.ck.ara') + '</button>' +
      '<button type="button" class="pn-dugme" data-eylem="wa">' + ik('mesaj') + T('p.ck.wa') + '</button></div>' +
      '<p class="pn-ck-uyari">' + T('p.ck.demo') + '</p></div>' +
      '<div class="pn-ck-bolum"><h4 id="pn-durum-et">' + T('p.ck.asama') + '</h4><div class="pn-durum-sec" role="radiogroup" aria-labelledby="pn-durum-et">' +
      DURUMLAR.map(function (d) { var s = d === a.durum; return '<button type="button" role="radio" aria-checked="' + s + '" tabindex="' + (s ? 0 : -1) + '" data-durum="' + d + '">' + T('p.d.' + d) + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="pn-ck-bolum"><h4>' + T('p.ck.uygun') + ' <span>' + T('p.ck.on') + '</span></h4><ul class="pn-pp">' +
      pp.map(function (p, i) {
        return '<li class="' + (i === 0 ? 'pn-enust' : '') + '"><span title="' + kac(progAd(p.kod)) + '">' + progAd(p.kod) + '</span><span class="pn-pp-ray" aria-hidden="true"><span class="pn-pp-dol" style="--o:' + (Math.max(0, Math.min(100, p.puan)) / 100) + ';--i:' + i + ';background:' + PROG_RENK[p.kod] + '"></span></span><b>' + sayi(p.puan) + '</b></li>';
      }).join('') + '</ul></div>' +
      '<div class="pn-ck-bolum"><h4>' + T('p.ck.cevap') + '</h4><dl class="pn-cevap">' +
      a.cevaplar.map(function (c) { return '<dt>' + kac(cevapEtiket(c)) + '</dt><dd>' + kac(cevapDeger(c)) + '</dd>'; }).join('') + '</dl></div>' +
      '<div class="pn-ck-bolum"><h4>' + T('p.ck.belge') + ' <span>' + sayi(tamam) + ' / ' + sayi(a.belgeler.length) + '</span></h4>' +
      '<div class="pn-ilerleme" role="progressbar" aria-label="' + kac(T('p.ck.belge.aria')) + '" aria-valuemin="0" aria-valuemax="' + a.belgeler.length + '" aria-valuenow="' + tamam + '"><i style="--o:' + (tamam / a.belgeler.length).toFixed(3) + '"></i></div>' +
      '<ul class="pn-belge">' + a.belgeler.map(function (b) { return '<li class="pn-b-' + b.durum + '">' + ik(bIk[b.durum]) + '<span>' + kac(T('p.b.' + b.k)) + '</span><em>' + T('p.bd.' + b.durum) + '</em></li>'; }).join('') + '</ul>' +
      (a.eksik ? '<button type="button" class="pn-dugme pn-genis" data-eylem="hatirlat">' + ik('belge') + T('p.ck.hatirlat') + '</button>' : '') +
      '</div>' +
      '<div class="pn-ck-bolum pn-not"><h4><label for="pn-not-alan">' + T('p.ck.not') + '</label></h4><textarea id="pn-not-alan" placeholder="' + kac(T('p.ck.not.ph')) + '">' + kac(notDeger) + '</textarea>' +
      '<div class="pn-not-sat"><small data-pn-not-durum>' + T('p.ck.not.bilgi') + '</small><button type="button" class="pn-dugme" data-eylem="not">' + T('p.ck.not.kaydet') + '</button></div></div>' +
      '<div class="pn-ck-bolum"><h4>' + T('p.ck.gecmis') + '</h4><ol class="pn-gecmis">' +
      a.gecmis.slice().reverse().map(function (g) { return '<li><time>' + kac(saatYaz(g.t)) + '</time>' + kac(gecmisMetni(g)) + '</li>'; }).join('') + '</ol></div>' +
      '</div>';
  }
  function gecmisEkle(g) { g.t = Date.now(); ckAday.gecmis.push(g); }
  ck.addEventListener('input', function (e) { if (e.target.id === 'pn-not-alan') notTaslak = e.target.value; });
  ck.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('.pn-ck-kapat')) { cekmeceKapat(); return; }
    var dr = t.closest('[data-durum]');
    if (dr) { durumYap(dr.getAttribute('data-durum'), true); return; }
    var ey = t.closest('[data-eylem]'); if (!ey) return;
    var e2 = ey.getAttribute('data-eylem');
    if (e2 === 'ara') {
      gecmisEkle({ k: 'p.h.ara' });
      if (ckAday.durum === 'yeni') durumYap('arandi', false); else yenidenCizCekmece();
      tost(T('p.t.ara'));
    } else if (e2 === 'wa') {
      gecmisEkle({ k: 'p.h.wa' }); yenidenCizCekmece(); tost(T('p.t.wa'));
    } else if (e2 === 'hatirlat') {
      gecmisEkle({ k: 'p.h.hatirlat', belgeler: ckAday.belgeler.filter(function (b) { return b.durum === 'eksik'; }).map(function (b) { return b.k; }) });
      yenidenCizCekmece(); tost(T('p.t.hatirlat'));
    } else if (e2 === 'not') {
      var v = ck.querySelector('#pn-not-alan').value.trim();
      ckAday.not = v ? { m: v } : null; notTaslak = null;
      if (v) gecmisEkle({ m: T('p.h.not', { m: v.slice(0, 140) }) });
      yenidenCizCekmece('[data-eylem="not"]');
      var nd = ck.querySelector('[data-pn-not-durum]'); if (nd) nd.textContent = T(v ? 'p.ck.not.ok' : 'p.ck.not.sil');
    }
  });
  function durumYap(k, odak) {
    if (!ckAday || ckAday.durum === k) return;
    ckAday.durum = k; gecmisEkle({ k: 'p.h.durum', dk: k });
    yenidenCizCekmece(odak ? '[data-durum="' + k + '"]' : null);
    huniCiz(); tabloCiz();
  }
  function yenidenCizCekmece(odakSec) {
    var govde = ck.querySelector('.pn-ck-govde'), sc = govde ? govde.scrollTop : 0;
    var akt = document.activeElement, eylem = akt && akt.getAttribute && akt.getAttribute('data-eylem');
    var odakNot = akt && akt.id === 'pn-not-alan';
    ck.classList.add('pn-anlik');
    cekmeceIcerik();
    ck.querySelector('.pn-ck-govde').scrollTop = sc;
    void ck.offsetWidth; ck.classList.remove('pn-anlik');
    var od = odakSec ? ck.querySelector(odakSec) : odakNot ? ck.querySelector('#pn-not-alan') : eylem ? ck.querySelector('[data-eylem="' + eylem + '"]') : null;
    (od || ck.querySelector('.pn-ck-kapat')).focus({ preventScroll: true });
  }
  ck.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cekmeceKapat(); return; }
    var r = e.target.closest('[role="radio"]');
    if (r && /^Arrow(Right|Left|Down|Up)$/.test(e.key)) {
      e.preventDefault();
      var i = DURUMLAR.indexOf(r.getAttribute('data-durum'));
      i = (i + ((e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1) + 4) % 4;
      durumYap(DURUMLAR[i], true); return;
    }
    if (e.key === 'Tab') { // odak tuzağı
      var od = Array.prototype.filter.call(ck.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'), function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!od.length) return;
      var ilk = od[0], son = od[od.length - 1];
      if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus(); }
      else if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus(); }
    }
  });
  perde.addEventListener('click', cekmeceKapat);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ckAday) cekmeceKapat(); });

  /* ---------- Tost ---------- */
  var tostZ;
  function tost(m) {
    tostEl.textContent = m; tostEl.classList.add('pn-gor');
    clearTimeout(tostZ); tostZ = setTimeout(function () { tostEl.classList.remove('pn-gor'); }, 3200);
  }

  /* =====================================================================
     BİLDİRİM
     ===================================================================== */
  function panelGorunur() { return kok.offsetParent !== null || kok.getClientRects().length > 0; }
  function bildirimBaslik(b) { return b.k === 'p.bl.yeni' ? T('p.bl.yeni', { s: T('p.sic.' + b.a.sicaklik).toLocaleLowerCase(yerel()) }) : T(b.k); }
  function bildirimIc(el, b) {
    var a = b.a;
    el.querySelector('[data-bl-baslik]').textContent = bildirimBaslik(b);
    el.querySelector('[data-bl-metin]').innerHTML = '<b>' + kac(a.ad) + '</b> · ' + kac(progKisa(a.program)) + ' · ' + kac(T('p.bl.puan', { n: sayi(a.puan) })) +
      '<br><span class="pn-bl-alt">' + kac(konumMetni(a)) + ' · ' + kac(goreli(a.zaman)) + '</span>';
    el.querySelector('[data-bl-ac]').textContent = T('p.bl.ac');
    el.querySelector('.pn-bl-kapat').setAttribute('aria-label', T('p.bl.kapat'));
  }
  function bildirimGoster(a, k) {
    var b = { a: a, k: k };
    if (!panelGorunur()) { bekleyenBildirim.push(b); return; }
    var el = document.createElement('div');
    el.className = 'pn-bildirim'; el.setAttribute('role', 'status'); el.__b = b;
    el.innerHTML = '<span class="pn-zil">' + ik('zil') + '<span class="pn-zil-halka" aria-hidden="true"></span></span>' +
      '<div><strong data-bl-baslik></strong><p data-bl-metin></p>' +
      '<button type="button" class="pn-dugme pn-ana" data-bl-ac="' + a.id + '"></button></div>' +
      '<button type="button" class="pn-bl-kapat">' + ik('x') + '</button><span class="pn-sure" aria-hidden="true"></span>';
    bildirimIc(el, b);
    bildirimKutu.insertBefore(el, bildirimKutu.firstChild);
    while (bildirimKutu.children.length > 3) bildirimKutu.removeChild(bildirimKutu.lastChild);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('pn-gor'); }); });
    var kalan = 9000, bas = Date.now(), z = null, durdu = false;
    function kur() { bas = Date.now(); z = setTimeout(kapat, kalan); }
    function dur() { if (!durdu) { durdu = true; clearTimeout(z); kalan -= Date.now() - bas; } }
    function kapat() {
      clearTimeout(z);
      el.classList.remove('pn-gor'); el.classList.add('pn-cik');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, AZ_HAREKET ? 0 : 450);
    }
    el.addEventListener('mouseenter', dur);
    el.addEventListener('focusin', dur);
    el.addEventListener('mouseleave', function () { if (durdu && !el.contains(document.activeElement)) { durdu = false; kur(); } });
    el.addEventListener('click', function (e) {
      if (e.target.closest('.pn-bl-kapat')) { kapat(); return; }
      if (e.target.closest('[data-bl-ac]')) { kapat(); cekmeceAc(a.id, kok.querySelector('tbody tr[data-id="' + a.id + '"]')); }
    });
    kur();
  }

  /* ---------- Yeni başvuru (altera:basvuru) ---------- */
  var yeniSay = 0;
  function cevapDonustur(c) {
    var l = [];
    if (Array.isArray(c)) {
      c.forEach(function (x, i) {
        if (x == null) return;
        if (typeof x === 'object') l.push([x.soru || x.etiket || x.baslik || x.k || ('#' + (i + 1)), x.cevap != null ? x.cevap : x.deger != null ? x.deger : x.v || '']);
        else l.push(['#' + (i + 1), x]);
      });
    } else if (c && typeof c === 'object') {
      var A = window.AI18N, varMi = function (x) { try { return A && typeof A.var === 'function' ? A.var(x) : false; } catch (e) { return false; } };
      Object.keys(c).forEach(function (k) {
        var v = c[k];
        // B'nin test kodları (t.q.<k>.e / t.o.<k>.<v>) varsa dile duyarlı anahtar olarak sakla
        if (typeof v === 'string' && varMi('t.o.' + k + '.' + v)) { l.push({ anahtar: [varMi('t.q.' + k + '.e') ? 't.q.' + k + '.e' : k, 't.o.' + k + '.' + v, 'k', varMi('t.q.' + k + '.e') ? 0 : 1, k] }); return; }
        if (v && typeof v === 'object') v = v.etiket || v.ad || v.cevap || v.deger || (Array.isArray(v) ? v.join(', ') : '');
        var et = k.replace(/[_-]+/g, ' ').replace(/([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g, '$1 $2');
        l.push([et.charAt(0).toLocaleUpperCase('tr-TR') + et.slice(1), v, k]);
      });
    }
    // [etiket, değer, 'h' (ham), 1 (ham etiket), özgün anahtar]
    return l.slice(0, 14).map(function (p) { if (p.anahtar) return p.anahtar; return [String(p[0]).slice(0, 60), String(p[1] == null ? '' : p[1]).slice(0, 140), 'h', 1, p[2] || p[0]]; });
  }
  function basvuruEkle(d) {
    d = d || {};
    yeniSay++;
    var progs = Array.isArray(d.programlar) ? d.programlar.filter(function (p) { return p && PROG_RENK[p.kod]; }) : [];
    var puan = Math.max(0, Math.min(100, Math.round(+d.puan || 0)));
    if (!puan && progs.length) puan = Math.max.apply(null, progs.map(function (p) { return +p.puan || 0; }));
    var enIyi = progs.slice().sort(function (x, y) { return (+y.puan || 0) - (+x.puan || 0); })[0];
    var kod = enIyi ? enIyi.kod : 'calisma';
    var programlar = PROG_SIRA.map(function (k) {
      var p = progs.filter(function (x) { return x.kod === k; })[0];
      return { kod: k, puan: p ? Math.max(0, Math.min(100, Math.round(+p.puan || 0))) : 0 };
    });
    var rakam = String(d.tel || '').replace(/\D/g, '');
    var son2 = rakam.length >= 2 ? rakam.slice(-2) : '••';
    var ulke = 'TR';
    if (/^(\+|00)/.test(String(d.tel || '').trim())) {
      var r2 = rakam.replace(/^00/, '');
      [['994', 'AZ'], ['971', 'AE'], ['974', 'QA'], ['995', 'GE'], ['44', 'GB'], ['49', 'DE'], ['31', 'NL'], ['90', 'TR'], ['7', 'KZ'], ['1', 'US']].some(function (p) { if (r2.indexOf(p[0]) === 0) { ulke = p[1]; return true; } return false; });
    }
    var cev = cevapDonustur(d.cevaplar);
    var sehir = '';
    cev.forEach(function (c) { if (/ilçe|ilce|semt|şehir|sehir|city|konum/.test(kucuk(c[4] + ' ' + c[0]))) sehir = c[1]; });
    var belgeler = BELGE[kod].map(function (b, j) { return { k: b, durum: j === 0 ? 'inceleme' : 'eksik' }; });
    var a = {
      id: 'y' + yeniSay + '-' + Date.now().toString(36), ad: maskeAd(d.ad), yer: null, sehirHam: sehir || (ulke === 'TR' ? 'İstanbul' : '—'), ulke: ulke, tel: maskeTel(ulke, son2),
      program: kod, puan: puan, programlar: programlar, sicaklik: sicaklikOf(puan), belgeler: belgeler,
      zaman: Date.now(), durum: 'yeni', cevaplar: cev.length ? cev : [['p.c.kaynak', 'p.v.web', 'k']], not: null,
      gecmis: [{ t: Date.now(), k: 'p.h.test', v: { puan: puan } }], yeni: true
    };
    a.eksik = belgeler.filter(function (b) { return b.durum === 'eksik'; }).length;
    adaylar.unshift(a);
    var ul = $('ulke'); if (ul) ul.innerHTML = ulkeSecenek();
    tumunuCiz(true);
    var yeniSatir = kok.querySelector('tbody tr[data-id="' + a.id + '"]');
    if (yeniSatir) yeniSatir.classList.add('pn-giris');
    bildirimGoster(a, a.sicaklik === 'sicak' ? 'p.bl.sicak' : 'p.bl.yeni');
  }
  window.addEventListener('altera:basvuru', function (e) { try { basvuruEkle(e.detail); } catch (err) { if (window.console) console.warn('Panel:', err); } });

  /* ---------- Dil değişimi: süzgeç ve açık çekmece korunur ---------- */
  function dilDegisti(yeniDil) {
    if (yeniDil && SOZ[yeniDil]) sonDil = yeniDil;
    kaydet();
    var odakId = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('data-pn');
    var ckSc = ckAday && ck.querySelector('.pn-ck-govde') ? ck.querySelector('.pn-ck-govde').scrollTop : 0;
    iskelet();
    sayacOnce = null;
    tumunuCiz(false);
    if (ckAday) {
      cekmeceIcerik();
      ck.classList.add('pn-ciz');
      ck.querySelector('.pn-ck-govde').scrollTop = ckSc;
      ck.querySelector('.pn-ck-kapat').focus({ preventScroll: true });
    } else if (odakId && $(odakId)) $(odakId).focus({ preventScroll: true });
    Array.prototype.forEach.call(bildirimKutu.children, function (el) { if (el.__b) bildirimIc(el, el.__b); });
  }
  window.addEventListener('altera:dil', function (e) { dilDegisti(e.detail && e.detail.dil); });

  /* ---------- Sekme / açılış ---------- */
  function panelAcildi() {
    katman.hidden = false;
    animasyonBaslat();
    if (bekleyenBildirim.length) {
      var l = bekleyenBildirim.splice(0);
      setTimeout(function () { l.forEach(function (b, i) { setTimeout(function () { bildirimGoster(b.a, b.k); }, i * 600); }); }, 500);
    }
    if (!S.demoBildirim) {
      S.demoBildirim = true;
      setTimeout(function () {
        if (!panelGorunur()) { S.demoBildirim = false; return; }
        var a = adaylar.filter(function (x) { return x.id === 'a5'; })[0] || adaylar[0];
        bildirimGoster(a, 'p.bl.bekliyor');
      }, 4000);
    }
  }
  window.addEventListener('altera:sekme', function (e) {
    var s = e.detail && e.detail.sekme;
    if (s === 'panel') { katman.hidden = false; setTimeout(panelAcildi, 60); }
    else { if (ckAday) cekmeceKapat(); katman.hidden = true; }
  });

  /* Saat + göreli zamanları tazele */
  function saatTazele() {
    var s = $('saat'); if (s) s.textContent = T('p.canli') + ' · ' + sadeceSaat();
    kok.querySelectorAll('tbody tr[data-id]').forEach(function (tr) {
      var a = adaylar.filter(function (x) { return x.id === tr.getAttribute('data-id'); })[0];
      var z = tr.querySelector('.pn-zaman'); if (a && z) z.textContent = goreli(a.zaman);
    });
  }
  setInterval(saatTazele, 30000);

  iskelet();
  tumunuCiz(false);
  katmanGuncelle();
  if (panelGorunur()) setTimeout(panelAcildi, 300);
  else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (g) { if (g[0].isIntersecting) { io.disconnect(); panelAcildi(); } });
    io.observe(kok);
  }
  document.addEventListener('DOMContentLoaded', kaydet);
})();
