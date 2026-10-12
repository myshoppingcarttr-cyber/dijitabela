/* Ilıcalılar Oral and Dental Health · diş kliniği · ortak model (3 yerleşim aynı motoru kullanır).
   Kaynak işletme bilgisi: alanyailicalilar.com (Şekerhane Mah. Tevfikiye Sk. No:13/1, Alanya; 0536 776 44 43). Sitede Türkçe ve İngilizce sürüm var; prototip TR/EN geçişlidir.
   Tedavi başlıkları, açıklamalar, sorular ve boş saatler ÖRNEKTİR; kliniğin gerçek listesi/takvimi değildir. Tıbbi tavsiye değildir. Hiçbir form gönderim yapmaz. */
(function () {
  "use strict";
  var D = {"ad":"Ilıcalılar Oral and Dental Health","slug":"ilicalilar-dis","adres":"Şekerhane Mah. Tevfikiye Sk. No:13/1, Alanya","tel":"0536 776 44 43","wa":"905367764443","kaynak":"https://alanyailicalilar.com/en/","haritaSorgu":"Ilıcalılar Oral and Dental Health Şekerhane Mah. Tevfikiye Sk. No:13/1 Alanya"};
  D.lang = "tr";
  try { var kl = localStorage.getItem("dj-" + D.slug + "-dil"); if (kl === "en" || kl === "tr") D.lang = kl; } catch (e) {}
  D.waLink = function (m) { return "https://wa.me/" + D.wa + "?text=" + encodeURIComponent(m); };
  D.harita = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(D.haritaSorgu);
  /* Arayüz metinleri: [tr, en] */
  var S = {
    ara: ["Ara", "Call"], rand: ["Randevu", "Appointment"], ted: ["Tedaviler", "Treatments"], sss: ["Sık sorulanlar", "FAQ"], klinik: ["Klinik", "Clinic"],
    adim1: ["Şikayetiniz ne?", "What brings you in?"], adim2: ["Ne zaman?", "How soon?"], adim3: ["Gün ve saat", "Day and time"], adim4: ["Hazır mesaj", "Your message"],
    dis: ["Dişinizi işaretleyin", "Tap the tooth"], disAlt: ["Üst çene · alt çene (FDI numaraları)", "Upper jaw · lower jaw (FDI numbers)"],
    ornek: ["ÖRNEK", "SAMPLE"], hazirla: ["Mesajı hazırla", "Prepare message"], wa: ["WhatsApp’ta aç (gönderilmedi)", "Open in WhatsApp (not sent)"],
    ad: ["Adınız (isteğe bağlı)", "Your name (optional)"], not: ["Notunuz (isteğe bağlı)", "Your note (optional)"],
    sec: ["Seçiminiz", "Your selection"], bos: ["Henüz seçim yok", "Nothing selected yet"], temizle: ["Temizle", "Clear"],
    ipucu: ["Bu yönlendirme muayene yerine geçmez; hekim değerlendirmesi gerekir.", "This is not a diagnosis; a dentist has to examine you."],
    ilgili: ["İlgili olabilecek başlıklar", "Topics that may be related"], yol: ["Yol tarifi", "Directions"], yaz: ["WhatsApp’tan yaz", "Message on WhatsApp"],
    adres: ["Adres", "Address"], tel: ["Telefon", "Phone"], kayit: ["Rehber kaydı", "Directory listing"],
    aciliyet: [["Bu hafta içinde", "This week"], ["Bu ay içinde", "This month"], ["Sadece bilgi almak istiyorum", "Just information"], ["Acil, bugün", "Urgent, today"]],
    ileri: ["Devam", "Next"], geri: ["Geri", "Back"], tamam: ["Tamam", "Done"], hepsi: ["Tüm tedaviler", "All treatments"]
  };
  D.t = function (k) { var v = S[k]; return v ? v[D.lang === "en" ? 1 : 0] : k; };
  D.ac = function (i) { var v = S.aciliyet[i]; return v[D.lang === "en" ? 1 : 0]; };
  D.L = function (a) { return a[D.lang === "en" ? 1 : 0]; };
  D.dilDeg = function (d) { D.lang = d; try { localStorage.setItem("dj-" + D.slug + "-dil", d); } catch (e) {} document.documentElement.lang = d; if (D.render) D.render(); };
  D.ted = [
    { id: 1, ad: ["Muayene ve kontrol", "Check-up and examination"], ac: ["İlk görüşme, genel durum değerlendirmesi ve plan.", "First visit, overall assessment and a plan."], ik: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3" },
    { id: 2, ad: ["Diş taşı temizliği", "Scaling and polishing"], ac: ["Düzenli bakım ve temizlik seansı.", "Routine hygiene and cleaning."], ik: "M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4zM18 16l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" },
    { id: 3, ad: ["Dolgu", "Fillings"], ac: ["Çürük sonrası diş yapısının onarımı.", "Restoring a tooth after decay."], ik: "M7 3h10l1 6-3 12h-2l-1-7-1 7H9L6 9z" },
    { id: 4, ad: ["Kanal tedavisi", "Root canal treatment"], ac: ["Hekim değerlendirmesine göre planlanır.", "Planned after the dentist’s assessment."], ik: "M8 3c-2 0-3 2-3 4 0 4 2 5 2 9 0 2 .5 5 2 5s1.5-4 3-4 1.5 4 3 4 2-3 2-5c0-4 2-5 2-9 0-2-1-4-3-4-2 0-3 1-4 1S10 3 8 3zM12 8v9" },
    { id: 5, ad: ["İmplant", "Dental implants"], ac: ["Eksik diş için kalıcı çözüm seçeneği; uygunluk muayeneyle belirlenir.", "A permanent option for a missing tooth; suitability is decided at the exam."], ik: "M9 3h6v5H9zM10 8l.5 5M14 8l-.5 5M8.5 15h7M9 18h6M10 21h4" },
    { id: 6, ad: ["Diş beyazlatma", "Teeth whitening"], ac: ["Estetik amaçlı ton açma seçeneği.", "A cosmetic option to lighten tooth shade."], ik: "M12 2v3M5 5l2 2M19 5l-2 2M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
    { id: 7, ad: ["Ortodonti", "Orthodontics"], ac: ["Diş dizilimi için tel ya da şeffaf plak seçenekleri.", "Braces or clear aligners for alignment."], ik: "M3 12h18M6 8v8M10 8v8M14 8v8M18 8v8" },
    { id: 8, ad: ["Kaplama ve estetik", "Crowns and aesthetics"], ac: ["Kırık, renkli ya da aşınmış dişler için seçenekler.", "Options for broken, discoloured or worn teeth."], ik: "M5 9c0-3 3-5 7-5s7 2 7 5-1 4-2 8l-1 3h-2l-1-4h-2l-1 4H8l-1-3c-1-4-2-5-2-8z" }
  ];
  D.sik = [
    { k: "agri", ad: ["Ağrı", "Pain"], ted: [1, 3, 4] },
    { k: "hassas", ad: ["Sıcak soğuk hassasiyeti", "Sensitivity"], ted: [1, 3, 2] },
    { k: "kanama", ad: ["Diş eti kanaması", "Bleeding gums"], ted: [1, 2] },
    { k: "kirik", ad: ["Kırık ya da çatlak diş", "Broken or cracked tooth"], ted: [1, 3, 8] },
    { k: "eksik", ad: ["Eksik diş", "Missing tooth"], ted: [1, 5, 8] },
    { k: "estetik", ad: ["Gülüş estetiği", "Smile aesthetics"], ted: [6, 7, 8] },
    { k: "kontrol", ad: ["Kontrol ve temizlik", "Check-up and cleaning"], ted: [1, 2] }
  ];
  D.sss = [
    { s: ["İlk randevu için nasıl yazabilirim?", "How do I book a first appointment?"], c: ["Bu sayfadan şikayetinizi ve uygun gün/saati seçin; hazır mesaj oluşur, kliniğe WhatsApp’tan siz gönderirsiniz.", "Pick your concern and a day/time here; a ready message is created and you send it to the clinic on WhatsApp."] },
    { s: ["Randevuya ne getirmeliyim?", "What should I bring?"], c: ["Varsa eski röntgen ve kullandığınız ilaçların listesi hekime yardımcı olur. Klinik kendi isteklerini ayrıca bildirir (örnek metin).", "Old X-rays and a list of your medication, if you have them. The clinic will tell you anything else it needs (sample text)."] },
    { s: ["Tedavi fiyatı nasıl belirlenir?", "How is the price decided?"], c: ["Tedavi planı muayeneden sonra netleşir; kesin tutar klinik tarafından yazılı bildirilir (örnek metin).", "The plan is set after the exam; the clinic confirms the exact amount in writing (sample text)."] },
    { s: ["Randevumu değiştirebilir miyim?", "Can I change my appointment?"], c: ["Değişiklik için aynı WhatsApp konuşmasından klinikle yazışabilirsiniz (örnek metin).", "Message the clinic on the same WhatsApp chat to change it (sample text)."] },
    { s: ["Mesajım otomatik gönderiliyor mu?", "Is my message sent automatically?"], c: ["Hayır. Mesaj yalnız hazırlanır; WhatsApp’ı siz açar ve gönderirsiniz.", "No. It is only prepared; you open WhatsApp and send it yourself."] }
  ];
  D.bul = function (id) { return D.ted.filter(function (t) { return t.id === Number(id); })[0]; };
  /* FDI diş numaraları ve yay çizimi */
  D.ustDis = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  D.altDis = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  D.disSvg = function (sec) {
    sec = sec || [];
    function sira(liste, ust) {
      var s = "";
      liste.forEach(function (no, i) {
        var t = (i + .5) / 16, a = Math.PI * (1 - t), cx = 200 + Math.cos(a) * 168, cy = (ust ? 126 - Math.sin(a) * 106 : 152 + Math.sin(a) * 106), rot = (ust ? 90 - (a * 180 / Math.PI) : (a * 180 / Math.PI) - 90);
        var on = sec.indexOf(no) > -1, ön = i > 3 && i < 12, w = ön ? 17 : 19, h = ön ? 28 : 27;
        s += '<g class="dis' + (on ? " on" : "") + '" data-d="' + no + '" tabindex="0" role="button" aria-pressed="' + on + '" aria-label="Diş ' + no + '" transform="translate(' + cx.toFixed(1) + " " + cy.toFixed(1) + ") rotate(" + rot.toFixed(1) + ')"><rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (ön ? 7 : 9) + '"/><text y="' + (ust ? -h / 2 - 5 : h / 2 + 12) + '" text-anchor="middle" transform="rotate(' + (-rot).toFixed(1) + ' 0 ' + (ust ? -h / 2 - 5 : h / 2 + 12) + ')">' + no + "</text></g>";
      });
      return s;
    }
    return '<svg class="dis-svg" viewBox="0 -4 400 296" role="group" aria-label="Diş haritası (FDI numaraları)" xmlns="http://www.w3.org/2000/svg">' + sira(D.ustDis, true) + sira(D.altDis, false) + "</svg>";
  };
  D.disDeg = function (arr, no) { no = Number(no); var i = arr.indexOf(no); if (i > -1) arr.splice(i, 1); else arr.push(no); arr.sort(function (a, b) { return a - b; }); return arr; };
  D.ilgili = function (sikK) {
    var s = D.sik.filter(function (x) { return sikK.indexOf(x.k) > -1; }), ids = [];
    s.forEach(function (x) { x.ted.forEach(function (t) { if (ids.indexOf(t) < 0) ids.push(t); }); });
    return ids;
  };
  D.saatler = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  D.gunler = function (n) {
    var ad = [["Paz", "Sun"], ["Pzt", "Mon"], ["Sal", "Tue"], ["Çar", "Wed"], ["Per", "Thu"], ["Cum", "Fri"], ["Cmt", "Sat"]], ay = [["Oca", "Jan"], ["Şub", "Feb"], ["Mar", "Mar"], ["Nis", "Apr"], ["May", "May"], ["Haz", "Jun"], ["Tem", "Jul"], ["Ağu", "Aug"], ["Eyl", "Sep"], ["Eki", "Oct"], ["Kas", "Nov"], ["Ara", "Dec"]], r = [], d = new Date();
    for (var i = 1; r.length < n; i++) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i); r.push({ g: ad[x.getDay()], n: x.getDate(), a: ay[x.getMonth()], idx: i }); }
    return r;
  };
  D.gy = function (g) { return D.L(g.g); };
  D.ay = function (g) { return D.L(g.a); };
  D.dolu = function (gi, si) { return ((gi * 3 + si * 5 + si * si) % 6) < 2; };
  D.mesaj = function (o) {
    var en = D.lang === "en", sk = (o.sik || []).map(function (k) { return D.L(D.sik.filter(function (x) { return x.k === k; })[0].ad); });
    if (en) return "Hello, I would like to book an appointment" + (o.gun ? " for " + o.gun : "") + (o.saat ? " around " + o.saat : "") + ".\nConcern: " + (sk.length ? sk.join(", ") : "(not selected, I need information)") + (o.dis && o.dis.length ? "\nTeeth (FDI): " + o.dis.join(", ") : "") + (o.ac ? "\nTiming: " + o.ac : "") + (o.ad ? "\nName: " + o.ad : "") + (o.not ? "\nNote: " + o.not : "");
    return "Merhaba, randevu almak istiyorum" + (o.gun ? ": " + o.gun : "") + (o.saat ? " " + o.saat + " civarı" : "") + ".\nŞikayet: " + (sk.length ? sk.join(", ") : "(seçmedim, bilgi almak istiyorum)") + (o.dis && o.dis.length ? "\nDişler (FDI): " + o.dis.join(", ") : "") + (o.ac ? "\nZamanlama: " + o.ac : "") + (o.ad ? "\nAd: " + o.ad : "") + (o.not ? "\nNot: " + o.not : "");
  };
  D.toast = function (m) { var t = document.getElementById("ts"); if (!t) return; t.textContent = m; t.classList.add("a"); clearTimeout(D._tt); D._tt = setTimeout(function () { t.classList.remove("a"); }, 2400); };
  D.iz = function (x) { try { window.djIzle && window.djIzle(x); } catch (e) {} };
  document.documentElement.lang = D.lang;
  window.KLINIK = D;
})();
