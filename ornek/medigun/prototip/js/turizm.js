/* Medigün · sağlık turizmi sayfası, TR / EN / DE */
(function () {
  "use strict";
  var M = {
    tr: {
      title: "Sağlık Turizmi · Medigün (Prototip · Dijitabela)",
      meta: "Medigün sağlık turizmi bilgilendirme sayfası: hizmet alanları, süreç ve bilgi talebi. Prototip.",
      skip: "İçeriğe geç", emergency: "Türkiye'de acil durumda:", home: "Medigün ana sayfası", brandSub: "Sağlık Turizmi", langLabel: "Dil seçin",
      eyebrow: "Uluslararası hastalar için bilgilendirme",
      h1: "Türkiye'de tedavi planlarken açık ve sakin bir süreç",
      lead: "Manisa ve İzmir'deki Medigün kurumlarında sunulan sağlık hizmetleri hakkında bilgi alın. Tıbbi belgeleriniz hekim tarafından değerlendirilir; tedavi kararını hekiminizle birlikte verirsiniz.",
      cta: "Bilgi talep edin", photoAlt: "Özel Medigün Hastanesi Soma binası", photoCap: "Özel Medigün Hastanesi Soma",
      areasEyebrow: "Hizmet alanları", areasH: "Hangi bölümlerde bilgi alabilirsiniz?",
      areasP: "Akhisar ve Soma hastanelerimizin resmî branş listesinden. Sağlık turizmi kapsamındaki bölümler hastane tarafından kesinleştirilecektir.",
      stepsEyebrow: "Süreç", stepsH: "Beş adımda nasıl ilerliyoruz?",
      steps: [
        ["Ön bilgi talebi", "Formu doldurursunuz; uluslararası hasta koordinatörü sizinle kendi dilinizde iletişime geçer."],
        ["Belgelerin değerlendirilmesi", "Raporlarınız ve görüntülemeleriniz güvenli kanaldan istenir, ilgili uzman hekim değerlendirir."],
        ["Tedavi planı ve bilgilendirme", "Hekim önerisi, olası riskler ve süreç size yazılı olarak açıklanır. Karar sizindir."],
        ["Geliş ve konaklama bilgisi", "Havalimanı ulaşımı, refakatçi ve konaklama seçenekleri hakkında bilgi verilir."],
        ["Tedaviden sonra takip", "Ülkenize döndükten sonra kontrol ve iletişim planı birlikte belirlenir."]
      ],
      formEyebrow: "Bilgi talebi · demo", formH: "Bize yazın",
      formP: "Uluslararası hasta koordinatörümüz size kendi dilinizde dönüş yapar. Bu prototipte form hiçbir yere gönderilmez.",
      licenseH: "Sağlık turizmi yetki belgesi", license: "Belge numarası bu alanda yayımlanır (Yönetmelik md. 8/1-b).",
      htLogo: "Resmî logo bu alanda yer alır (md. 8/1-e).",
      fName: "Ad soyad", fCountry: "Yaşadığınız ülke", fEmail: "E-posta", fTopic: "Hangi bölümle ilgili?", fNote: "Kısa not (isteğe bağlı)",
      fNoteHint: "Lütfen bu alana ayrıntılı sağlık bilgisi yazmayın; belgeleriniz güvenli kanaldan istenir.",
      fConsent: "Kişisel verilerimin bilgi talebimin yanıtlanması amacıyla işlenmesine ilişkin aydınlatma metnini okudum.",
      fSend: "Talebi gönder (demo)", fChoose: "Seçin",
      errName: "Lütfen adınızı yazın.", errEmail: "Lütfen geçerli bir e-posta adresi yazın.", errConsent: "Devam etmek için aydınlatma metnini onaylayın.",
      ok: "Bu bir demodur; talebiniz gönderilmedi.",
      footNote: "Bu sayfa yalnız yurt dışında yaşayan kişilere yönelik bilgilendirme amaçlıdır. Önerilen yapı: yayında Yönetmelik md. 8/1-a gereği yurt dışına yönelik ayrı bir alan adı. Sağlık bilgilendirme metinleri Medigün'ün yetkili hekimlerince hazırlanır ve onaylanır.",
      updated: "Son güncelleme", editor: "Site editörü iletişim: +90 850 260 1 222",
      proto: "Bu bir prototiptir; yalnız tanıtım ve bilgilendirme içerir.",
      areas: ["Kadın Hastalıkları ve Doğum", "Ortopedi ve Travmatoloji", "Genel Cerrahi", "Üroloji", "Göz Hastalıkları", "Kulak Burun Boğaz", "Beyin ve Sinir Cerrahisi", "Kardiyoloji", "Fizik Tedavi ve Rehabilitasyon", "Dahiliye (İç Hastalıkları)", "Çocuk Sağlığı ve Hastalıkları", "Check-up"]
    },
    en: {
      title: "Health Tourism · Medigün (Prototype · Dijitabela)",
      meta: "Medigün health tourism information page: medical departments, process and information request. Prototype.",
      skip: "Skip to content", emergency: "Emergency in Türkiye:", home: "Medigün home page", brandSub: "Health Tourism", langLabel: "Choose language",
      eyebrow: "Information for international patients",
      h1: "A clear and calm process when planning treatment in Türkiye",
      lead: "Learn about the healthcare services offered at Medigün facilities in Manisa and İzmir. Your medical records are reviewed by a physician, and you decide on treatment together with your doctor.",
      cta: "Request information", photoAlt: "Medigün Hospital Soma building", photoCap: "Medigün Hospital Soma",
      areasEyebrow: "Medical departments", areasH: "Which departments can you ask about?",
      areasP: "Taken from the official department lists of our Akhisar and Soma hospitals. Departments within the health tourism scope will be confirmed by the hospital.",
      stepsEyebrow: "Process", stepsH: "How it works, in five steps",
      steps: [
        ["Initial enquiry", "You fill in the form; an international patient coordinator contacts you in your language."],
        ["Review of your records", "Your reports and imaging are requested through a secure channel and reviewed by the relevant specialist."],
        ["Treatment plan and information", "The physician's recommendation, possible risks and the process are explained to you in writing. The decision is yours."],
        ["Travel and accommodation", "You receive information on airport transfer, companions and accommodation options."],
        ["Follow-up", "After you return home, a check-up and communication plan is agreed together."]
      ],
      formEyebrow: "Information request · demo", formH: "Write to us",
      formP: "Our international patient coordinator will reply in your language. In this prototype the form is not sent anywhere.",
      licenseH: "Health tourism authorisation certificate", license: "The certificate number is published here (Regulation art. 8/1-b).",
      htLogo: "The official logo appears here (art. 8/1-e).",
      fName: "Full name", fCountry: "Country of residence", fEmail: "E-mail", fTopic: "Which department?", fNote: "Short note (optional)",
      fNoteHint: "Please do not write detailed health information here; your records will be requested through a secure channel.",
      fConsent: "I have read the privacy notice on processing my personal data to answer my request.",
      fSend: "Send request (demo)", fChoose: "Select",
      errName: "Please enter your name.", errEmail: "Please enter a valid e-mail address.", errConsent: "Please confirm the privacy notice to continue.",
      ok: "This is a demo; your request was not sent.",
      footNote: "This page is intended only for people living outside Türkiye. Proposed structure: a separate international domain when live, as required by Regulation art. 8/1-a. All medical information is prepared and approved by Medigün's authorised physicians.",
      updated: "Last updated", editor: "Site editor contact: +90 850 260 1 222",
      proto: "This is a prototype; it contains information only.",
      areas: ["Obstetrics and Gynaecology", "Orthopaedics and Traumatology", "General Surgery", "Urology", "Ophthalmology", "Ear, Nose and Throat", "Neurosurgery", "Cardiology", "Physical Therapy and Rehabilitation", "Internal Medicine", "Paediatrics", "Check-up"]
    },
    de: {
      title: "Gesundheitstourismus · Medigün (Prototyp · Dijitabela)",
      meta: "Medigün Informationsseite für Gesundheitstourismus: Fachbereiche, Ablauf und Anfrage. Prototyp.",
      skip: "Zum Inhalt springen", emergency: "Notfall in der Türkei:", home: "Medigün Startseite", brandSub: "Gesundheitstourismus", langLabel: "Sprache wählen",
      eyebrow: "Informationen für internationale Patienten",
      h1: "Ein klarer und ruhiger Ablauf bei der Behandlungsplanung in der Türkei",
      lead: "Informieren Sie sich über die Gesundheitsleistungen der Medigün-Einrichtungen in Manisa und İzmir. Ihre medizinischen Unterlagen werden von einem Arzt geprüft; über die Behandlung entscheiden Sie gemeinsam mit Ihrem Arzt.",
      cta: "Informationen anfordern", photoAlt: "Gebäude des Medigün Krankenhauses Soma", photoCap: "Medigün Krankenhaus Soma",
      areasEyebrow: "Fachbereiche", areasH: "Zu welchen Fachbereichen erhalten Sie Auskunft?",
      areasP: "Aus den offiziellen Fachbereichslisten unserer Krankenhäuser in Akhisar und Soma. Die Fachbereiche im Rahmen des Gesundheitstourismus werden vom Krankenhaus bestätigt.",
      stepsEyebrow: "Ablauf", stepsH: "So gehen wir in fünf Schritten vor",
      steps: [
        ["Erste Anfrage", "Sie füllen das Formular aus; ein Koordinator für internationale Patienten meldet sich in Ihrer Sprache."],
        ["Prüfung der Unterlagen", "Ihre Befunde und Bilder werden über einen sicheren Kanal angefordert und vom zuständigen Facharzt geprüft."],
        ["Behandlungsplan und Aufklärung", "Die ärztliche Empfehlung, mögliche Risiken und der Ablauf werden Ihnen schriftlich erläutert. Die Entscheidung liegt bei Ihnen."],
        ["Anreise und Unterkunft", "Sie erhalten Informationen zu Flughafentransfer, Begleitpersonen und Unterkunft."],
        ["Nachsorge", "Nach Ihrer Rückkehr wird gemeinsam ein Kontroll- und Kommunikationsplan festgelegt."]
      ],
      formEyebrow: "Anfrage · Demo", formH: "Schreiben Sie uns",
      formP: "Unser Koordinator für internationale Patienten antwortet Ihnen in Ihrer Sprache. In diesem Prototyp wird das Formular nicht versendet.",
      licenseH: "Genehmigung für Gesundheitstourismus", license: "Die Genehmigungsnummer wird hier veröffentlicht (Verordnung Art. 8/1-b).",
      htLogo: "Das offizielle Logo erscheint hier (Art. 8/1-e).",
      fName: "Vor- und Nachname", fCountry: "Wohnsitzland", fEmail: "E-Mail", fTopic: "Welcher Fachbereich?", fNote: "Kurze Notiz (optional)",
      fNoteHint: "Bitte tragen Sie hier keine ausführlichen Gesundheitsdaten ein; Ihre Unterlagen werden über einen sicheren Kanal angefordert.",
      fConsent: "Ich habe die Datenschutzhinweise zur Verarbeitung meiner Daten für die Beantwortung meiner Anfrage gelesen.",
      fSend: "Anfrage senden (Demo)", fChoose: "Bitte wählen",
      errName: "Bitte geben Sie Ihren Namen ein.", errEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.", errConsent: "Bitte bestätigen Sie die Datenschutzhinweise.",
      ok: "Dies ist eine Demo; Ihre Anfrage wurde nicht gesendet.",
      footNote: "Diese Seite richtet sich ausschließlich an Personen mit Wohnsitz außerhalb der Türkei. Vorgeschlagene Struktur: im Livebetrieb eine separate internationale Domain gemäß Art. 8/1-a der Verordnung. Medizinische Informationen werden von den zuständigen Ärztinnen und Ärzten von Medigün erstellt und freigegeben.",
      updated: "Zuletzt aktualisiert", editor: "Kontakt Redaktion: +90 850 260 1 222",
      proto: "Dies ist ein Prototyp; er enthält ausschließlich Informationen.",
      areas: ["Gynäkologie und Geburtshilfe", "Orthopädie und Traumatologie", "Allgemeinchirurgie", "Urologie", "Augenheilkunde", "Hals-Nasen-Ohren-Heilkunde", "Neurochirurgie", "Kardiologie", "Physikalische Therapie und Rehabilitation", "Innere Medizin", "Kinderheilkunde", "Check-up"]
    }
  };

  var dil = "tr";
  try { var k = new URLSearchParams(location.search).get("lang") || localStorage.getItem("mg-dil"); if (M[k]) dil = k; } catch (e) {}

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function uygula(d, odak) {
    dil = d; var t = M[d];
    document.documentElement.lang = d;
    document.title = t.title;
    document.querySelectorAll("[data-t]").forEach(function (el) { var k = el.getAttribute("data-t"); if (t[k] != null) el.textContent = t[k]; });
    document.querySelectorAll("[data-t-attr]").forEach(function (el) {
      el.getAttribute("data-t-attr").split(";").forEach(function (p) { var a = p.split(":"); if (t[a[1]] != null) el.setAttribute(a[0], t[a[1]]); });
    });
    document.querySelectorAll(".dil-sec button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-dil") === d ? "true" : "false"); });
    document.getElementById("alanlar").innerHTML = t.areas.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("");
    document.getElementById("surec").innerHTML = t.steps.map(function (s) { return "<li><div><h3>" + esc(s[0]) + "</h3><p>" + esc(s[1]) + "</p></div></li>"; }).join("");
    var konu = document.getElementById("t-konu");
    konu.innerHTML = '<option value="">' + esc(t.fChoose) + "</option>" + t.areas.map(function (a) { return "<option>" + esc(a) + "</option>"; }).join("");
    document.getElementById("t-hata").textContent = "";
    try { localStorage.setItem("mg-dil", d); } catch (e) {}
    if (odak) { var b = document.querySelector('.dil-sec button[data-dil="' + d + '"]'); if (b) b.focus(); }
  }

  document.querySelector(".dil-sec").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-dil]"); if (b) uygula(b.getAttribute("data-dil"), true);
  });

  document.getElementById("talep-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = M[dil], h = document.getElementById("t-hata");
    var ad = document.getElementById("t-ad"), ep = document.getElementById("t-eposta"), on = document.getElementById("t-onay");
    if (ad.value.trim().length < 3) { h.textContent = t.errName; ad.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ep.value.trim())) { h.textContent = t.errEmail; ep.focus(); return; }
    if (!on.checked) { h.textContent = t.errConsent; on.focus(); return; }
    h.style.color = "#1D7444"; h.textContent = t.ok;
    e.target.reset();
    setTimeout(function () { h.style.color = "#A91917"; }, 4000);
  });

  uygula(dil);
})();
