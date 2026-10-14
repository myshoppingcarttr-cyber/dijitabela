/* Altera Global · Uygunluk testi + sonuç + danışmanlık formu (İşçi B) · TR/EN
   Kökler: #test-kok, #sonuc-kok, #form-kok
   Olaylar: altera:test-basla (dinler) · altera:dil (dinler, durumu koruyarak yeniden çizer) · altera:basvuru (yayar)
   Metinler: AI18N.ekle({tr,en}) ile "t." önekli anahtarlar. Fiyat/tutar, garanti ve süre vaadi YOKTUR. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var AZ = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA_NO = "447432154682";

  /* =====================================================================
     SÖZLÜK · her anahtar [tr, en]
     ===================================================================== */
  var S = {
    "t.etiket": ["Uygunluk testi", "Eligibility check"],
    "t.tamam": ["%{n} tamam", "{n}% complete"],
    "t.cik": ["Çık", "Exit"], "t.cikAria": ["Testten çık", "Exit the check"],
    "t.geri": ["Geri", "Back"], "t.ileri": ["İleri", "Next"], "t.sonucuGor": ["Sonucu gör", "See my results"],
    "t.klavye": ["<kbd>1</kbd>–<kbd>4</kbd> seç · <kbd>Enter</kbd> ileri · <kbd>←</kbd> geri", "<kbd>1</kbd>–<kbd>4</kbd> select · <kbd>Enter</kbd> next · <kbd>←</kbd> back"],
    "t.soruNo": ["Soru {i} / {n}", "Question {i} of {n}"],
    "t.analizBas": ["Yol haritanız hazırlanıyor", "Preparing your roadmap"],
    "t.analiz1": ["Cevaplarınız okunuyor", "Reading your answers"],
    "t.analiz2": ["5 programın kuralları karşılaştırılıyor", "Comparing the rules of 5 programmes"],
    "t.analiz3": ["Süreç adımları ve belge listesi hazırlanıyor", "Building process steps and a document list"],
    "t.degerlendiriliyor": ["Değerlendiriliyor", "Evaluating"],

    /* sorular */
    "t.q.amac.e": ["Amaç", "Goal"], "t.q.amac.t": ["Yurt dışında öncelikli hedefiniz ne?", "What is your main goal abroad?"],
    "t.q.amac.h": ["Size en yakın olanı seçin; danışmanınız diğer seçenekleri de görüşmede ele alır.", "Pick the closest one — your consultant will cover the other options in your call."],
    "t.o.amac.yasam": ["Yerleşip yaşamak", "Settle and live"], "t.o.amac.yasam.s": ["Uzun vadeli oturum, aileyle taşınma", "Long-term residence, moving with family"],
    "t.o.amac.calisma": ["Çalışmak", "Work"], "t.o.amac.calisma.s": ["İş teklifiyle ya da meslekle gitmek", "Move with a job offer or your profession"],
    "t.o.amac.egitim": ["Eğitim almak", "Study"], "t.o.amac.egitim.s": ["Lisans, yüksek lisans, dil okulu", "Bachelor's, master's, language school"],
    "t.o.amac.yatirim": ["Yatırımla oturum", "Residence by investment"], "t.o.amac.yatirim.s": ["Yatırım yoluyla daimi oturum izni", "Permanent residence through investment"],
    "t.q.bolge.e": ["Hedef bölge", "Destination"], "t.q.bolge.t": ["Hangi bölgeyi hedefliyorsunuz?", "Which region are you aiming for?"],
    "t.q.bolge.h": ["Kararsızsanız “Diğer” seçin; seçenekleri birlikte daraltırız.", "Not sure yet? Choose “Other” — we will narrow it down together."],
    "t.o.bolge.abd": ["Amerika Birleşik Devletleri", "United States"], "t.o.bolge.abd.s": ["Green Card, çalışma ve öğrenci vizeleri", "Green Card, work and student visas"],
    "t.o.bolge.avrupa": ["Avrupa Birliği", "European Union"], "t.o.bolge.avrupa.s": ["Almanya, Hollanda, İrlanda ve diğerleri", "Germany, the Netherlands, Ireland and more"],
    "t.o.bolge.diger": ["Diğer / kararsızım", "Other / not sure"], "t.o.bolge.diger.s": ["Kanada, Birleşik Krallık, Körfez ülkeleri…", "Canada, the UK, the Gulf…"],
    "t.q.yas.e": ["Yaş", "Age"], "t.q.yas.t": ["Yaş aralığınız?", "Your age range?"],
    "t.q.yas.h": ["Öğrenci ve çalışma programlarında yaş, süreç planını etkiler.", "For study and work routes, age shapes the plan."],
    "t.o.yas.18": ["18 – 24", "18 – 24"], "t.o.yas.25": ["25 – 34", "25 – 34"], "t.o.yas.35": ["35 – 44", "35 – 44"], "t.o.yas.45": ["45 ve üzeri", "45 and over"],
    "t.q.egitim.e": ["Eğitim", "Education"], "t.q.egitim.t": ["Tamamladığınız en yüksek eğitim?", "Your highest completed education?"],
    "t.q.egitim.h": ["Mavi Kart gibi programlarda tanınan bir yükseköğrenim diploması temel şarttır.", "Routes such as the EU Blue Card require a recognised higher-education degree."],
    "t.o.egitim.lise": ["Lise", "High school"], "t.o.egitim.lise.s": ["Ya da devam eden lisans", "Or a degree in progress"],
    "t.o.egitim.meslek": ["Meslek eğitimi", "Vocational training"], "t.o.egitim.meslek.s": ["Ön lisans, ustalık ya da sertifika", "Associate degree, trade or certificate"],
    "t.o.egitim.lisans": ["Üniversite (lisans)", "University (bachelor's)"], "t.o.egitim.lisans.s": ["Dört yıllık diploma", "Four-year degree"],
    "t.o.egitim.yl": ["Yüksek lisans / doktora", "Master's / PhD"], "t.o.egitim.yl.s": ["Lisansüstü diploma", "Postgraduate degree"],
    "t.q.dil.e": ["Yabancı dil", "Languages"], "t.q.dil.t": ["Yabancı dil seviyeniz?", "Your foreign-language level?"],
    "t.q.dil.h": ["İngilizce ya da hedef ülkenin dili; kabaca bir seviye yeterli.", "English or the destination's language — a rough level is enough."],
    "t.o.dil.baslangic": ["Başlangıç", "Beginner"], "t.o.dil.baslangic.s": ["Temel kelimeler, kısa cümleler", "Basic words, short sentences"],
    "t.o.dil.orta": ["Orta", "Intermediate"], "t.o.dil.orta.s": ["Günlük konuşma ve yazışma", "Everyday conversation and email"],
    "t.o.dil.ileri": ["İleri", "Advanced"], "t.o.dil.ileri.s": ["Akıcı konuşma, iş yazışması", "Fluent, comfortable at work"],
    "t.o.dil.cokdil": ["İleri + ikinci dil", "Advanced + second language"], "t.o.dil.cokdil.s": ["Hedef ülke dilini de biliyorum", "I also speak the destination's language"],
    "t.q.butce.e": ["Bütçe aralığı", "Budget range"], "t.q.butce.t": ["Yatırım ve bütçe aralığınız?", "Your investment and budget range?"],
    "t.q.butce.h": ["Rakam vermeniz gerekmez; yalnız program seçiminde yön göstermesi için soruyoruz.", "No figures needed — this only helps point you to the right programme."],
    "t.o.butce.belirsiz": ["Belirlemedim", "Not decided"], "t.o.butce.belirsiz.s": ["Önce seçenekleri görmek istiyorum", "I'd like to see the options first"],
    "t.o.butce.sinirli": ["Sınırlı", "Limited"], "t.o.butce.sinirli.s": ["Başvuru ve yaşam giderleri kadar", "Enough for application and living costs"],
    "t.o.butce.orta": ["Orta", "Moderate"], "t.o.butce.orta.s": ["Eğitim ya da yerleşim için birikimim var", "Savings set aside for study or relocation"],
    "t.o.butce.yuksek": ["Yüksek", "High"], "t.o.butce.yuksek.s": ["Yatırım programlarını değerlendirebilirim", "I can consider investment programmes"],
    "t.q.ret.e": ["Vize reddi", "Visa refusal"], "t.q.ret.t": ["Daha önce bir vize başvurunuz reddedildi mi?", "Have you ever had a visa refused?"],
    "t.q.ret.h": ["Ret bir son değildir; doğru okunan ret gerekçesi yeni başvurunun haritasıdır.", "A refusal is not the end — read correctly, the reasons map out a stronger application."],
    "t.o.ret.hayir": ["Hayır", "No"], "t.o.ret.hayir.s": ["İlk başvurum olacak ya da ret almadım", "First application, or never refused"],
    "t.o.ret.evet": ["Evet, ret aldım", "Yes, I was refused"], "t.o.ret.evet.s": ["Yeniden başvurmayı düşünüyorum", "I'm thinking of reapplying"],

    /* programlar */
    "t.p.eb5.ad": ["EB-5 Yatırımcı Programı", "EB-5 Immigrant Investor Programme"], "t.p.eb5.kisa": ["EB-5", "EB-5"], "t.p.eb5.ulke": ["ABD", "United States"],
    "t.p.eb5.etk": ["Yatırımla daimi oturum (Green Card) yolu", "A route to permanent residence (Green Card) through investment"],
    "t.p.eb5.surec": ["Uzun", "Long"], "t.p.eb5.dil": ["Resmî dil şartı aranmaz; görüşmeler için temel İngilizce yararlıdır", "No formal language requirement; basic English helps at interviews"],
    "t.p.eb5.aile": ["Evet: eş ve 21 yaş altı bekâr çocuklar", "Yes: spouse and unmarried children under 21"],
    "t.p.eb5.sart": ["Yasal kaynağı belgelenmiş yatırım ve iş yaratma koşulu", "An investment with documented lawful source, plus job-creation requirements"],
    "t.p.eb5.ek": ["EB-5 bir oturum (Green Card) yoludur; vatandaşlık bu programın parçası değildir ve şartlar oluşunca ayrı bir süreçle başvurulur.", "EB-5 leads to residence (Green Card); citizenship is not part of the programme and is a separate application once eligible."],
    "t.p.eb5.a1": ["Ön görüşme ve kaynak planı", "Initial review and source-of-funds plan"], "t.p.eb5.a1d": ["Yatırımın yasal kaynağının nasıl belgeleneceği planlanır.", "How the lawful source of the investment will be documented."],
    "t.p.eb5.a2": ["Proje seçimi ve inceleme", "Project selection and due diligence"], "t.p.eb5.a2d": ["Uygun proje ve sözleşme bağımsız olarak incelenir.", "The project and its agreements are reviewed independently."],
    "t.p.eb5.a3": ["Dilekçenin hazırlanması ve sunulması", "Preparing and filing the petition"], "t.p.eb5.a3d": ["Kaynak belgeleri ve iş planıyla birlikte başvuru dosyası.", "The petition, with source-of-funds evidence and business plan."],
    "t.p.eb5.a4": ["Değerlendirme ve vize görüşmesi", "Adjudication and visa interview"], "t.p.eb5.a4d": ["Resmî inceleme sonrası konsolosluk görüşmesi.", "Consular interview after the official review."],
    "t.p.eb5.a5": ["Koşullu oturum", "Conditional residence"], "t.p.eb5.a5d": ["ABD'ye giriş ve koşullu daimi oturum dönemi.", "Entry to the US and the conditional residence period."],
    "t.p.eb5.a6": ["Koşulların kaldırılması", "Removing conditions"], "t.p.eb5.a6d": ["Yatırım ve iş yaratma koşulları belgelenerek kalıcı oturuma geçilir.", "Evidence of the investment and job creation to obtain permanent residence."],
    "t.p.eb5.b1": ["Pasaport ve nüfus kayıt örneği", "Passport and civil registry record"], "t.p.eb5.b2": ["Yatırım fonunun yasal kaynağını gösteren belgeler", "Evidence of the lawful source of investment funds"],
    "t.p.eb5.b3": ["Son yıllara ait banka hesap hareketleri", "Bank statements for recent years"], "t.p.eb5.b4": ["Vergi beyannameleri", "Tax returns"],
    "t.p.eb5.b5": ["Şirket, mülk ya da satış belgeleri (kaynak varsa)", "Company, property or sale documents (if relevant)"], "t.p.eb5.b6": ["Evlilik ve doğum belgeleri (yeminli tercüme)", "Marriage and birth certificates (certified translation)"], "t.p.eb5.b7": ["Adli sicil kaydı", "Police clearance certificate"],

    "t.p.bluecard.ad": ["AB Mavi Kart (EU Blue Card)", "EU Blue Card"], "t.p.bluecard.kisa": ["Mavi Kart", "Blue Card"], "t.p.bluecard.ulke": ["Avrupa Birliği", "European Union"],
    "t.p.bluecard.etk": ["Nitelikli çalışanlar için oturum ve çalışma izni", "Residence and work permit for qualified professionals"],
    "t.p.bluecard.surec": ["Orta", "Medium"], "t.p.bluecard.dil": ["Çoğu meslekte Almanca şartı aranmaz; düzenlenmiş mesleklerde istenebilir", "Most occupations do not require German; regulated professions may"],
    "t.p.bluecard.aile": ["Evet: aile birleşiminde kolaylıklar", "Yes: eased family reunification"],
    "t.p.bluecard.sart": ["Tanınan yükseköğrenim diploması ve eşik maaşı karşılayan iş teklifi", "A recognised degree and a job offer meeting the salary threshold"],
    "t.p.bluecard.ek": ["Düzenlenmiş mesleklerde (ör. sağlık, hukuk) ek denklik ve dil belgesi istenebilir.", "Regulated professions (e.g. healthcare, law) may need extra recognition and language certificates."],
    "t.p.bluecard.a1": ["Diploma denkliği kontrolü", "Degree recognition check"], "t.p.bluecard.a1d": ["Diplomanın hedef ülkede tanınıp tanınmadığı (ör. anabin) kontrol edilir.", "We check whether your degree is recognised in the destination (e.g. anabin)."],
    "t.p.bluecard.a2": ["Özgeçmiş ve iş arama", "CV and job search"], "t.p.bluecard.a2d": ["Hedef ülke formatında özgeçmiş ve başvuru planı.", "A destination-style CV and an application plan."],
    "t.p.bluecard.a3": ["İş teklifi ve sözleşme", "Job offer and contract"], "t.p.bluecard.a3d": ["Eşik maaş ve meslek şartlarına uyan teklif.", "An offer that meets salary and occupation requirements."],
    "t.p.bluecard.a4": ["Konsolosluk randevusu ve başvuru", "Consular appointment and application"], "t.p.bluecard.a4d": ["Vize dosyasının eksiksiz sunulması.", "Submitting a complete visa file."],
    "t.p.bluecard.a5": ["Varış ve oturum kartı", "Arrival and residence card"], "t.p.bluecard.a5d": ["Adres kaydı ve Mavi Kart'ın teslimi.", "Address registration and issuing of the Blue Card."],
    "t.p.bluecard.b1": ["Pasaport", "Passport"], "t.p.bluecard.b2": ["Diploma ve transkript (yeminli tercüme)", "Degree and transcript (certified translation)"],
    "t.p.bluecard.b3": ["Diploma denklik / tanınma belgesi", "Degree recognition statement"], "t.p.bluecard.b4": ["İş sözleşmesi ya da bağlayıcı iş teklifi", "Employment contract or binding job offer"],
    "t.p.bluecard.b5": ["Güncel özgeçmiş", "Up-to-date CV"], "t.p.bluecard.b6": ["Sağlık sigortası", "Health insurance"], "t.p.bluecard.b7": ["Dil belgesi (meslek gerektiriyorsa)", "Language certificate (if the occupation requires it)"],

    "t.p.calisma.ad": ["Çalışma Vizesi ve İş Yerleştirme", "Work Visa and Job Placement"], "t.p.calisma.kisa": ["Çalışma vizesi", "Work visa"], "t.p.calisma.ulke": ["Ülkeye göre", "Varies by country"],
    "t.p.calisma.etk": ["İşveren teklifine dayalı çalışma izni", "A work permit based on an employer's offer"],
    "t.p.calisma.surec": ["Orta", "Medium"], "t.p.calisma.dil": ["Mesleğe ve ülkeye göre değişir; müşteriyle temas eden işlerde beklenir", "Depends on the role and country; expected in client-facing jobs"],
    "t.p.calisma.aile": ["Ülkeye göre; çoğunlukla sonradan", "Depends on the country; often later"],
    "t.p.calisma.sart": ["İşveren teklifi ya da sponsorluk; bazı ülkelerde meslek listesi", "An employer offer or sponsorship; shortage lists in some countries"],
    "t.p.calisma.ek": ["Kota, meslek listesi ve işveren yükümlülükleri ülkeden ülkeye değişir.", "Quotas, occupation lists and employer duties vary by country."],
    "t.p.calisma.a1": ["Meslek ve ülke eşleştirmesi", "Matching profession and country"], "t.p.calisma.a1d": ["Mesleğinizin aranan meslek listelerinde olup olmadığına bakılır.", "We check whether your profession appears on shortage lists."],
    "t.p.calisma.a2": ["Dosya ve özgeçmiş hazırlığı", "File and CV preparation"], "t.p.calisma.a2d": ["Referanslar, belgeler ve hedef ülke formatında özgeçmiş.", "References, documents and a destination-style CV."],
    "t.p.calisma.a3": ["İşveren görüşmeleri", "Employer interviews"], "t.p.calisma.a3d": ["Görüşmeler ve iş teklifi süreci.", "Interviews and the offer stage."],
    "t.p.calisma.a4": ["Çalışma izni ve vize başvurusu", "Work permit and visa application"], "t.p.calisma.a4d": ["İşveren ve başvuru sahibi tarafının belgeleri.", "Documents from both employer and applicant."],
    "t.p.calisma.a5": ["Varış ve yerel kayıt", "Arrival and local registration"], "t.p.calisma.a5d": ["Oturum, vergi ve sigorta kayıtları.", "Residence, tax and insurance registration."],
    "t.p.calisma.b1": ["Pasaport", "Passport"], "t.p.calisma.b2": ["Özgeçmiş ve referans mektupları", "CV and reference letters"], "t.p.calisma.b3": ["Diploma ya da mesleki yeterlilik belgeleri", "Degree or professional qualifications"],
    "t.p.calisma.b4": ["İş teklifi ya da sözleşme", "Job offer or contract"], "t.p.calisma.b5": ["Dil belgesi (istenirse)", "Language certificate (if required)"], "t.p.calisma.b6": ["Adli sicil kaydı", "Police clearance certificate"],

    "t.p.ogrenci.ad": ["Öğrenci Vizesi ve Okul Kabulü", "Student Visa and Admission"], "t.p.ogrenci.kisa": ["Öğrenci vizesi", "Student visa"], "t.p.ogrenci.ulke": ["Okulun ülkesi", "Where you study"],
    "t.p.ogrenci.etk": ["Eğitim yoluyla yurt dışı deneyimi", "Building a life abroad through education"],
    "t.p.ogrenci.surec": ["Kısa", "Short"], "t.p.ogrenci.dil": ["Okulun istediği dil sınavı (ör. IELTS / TOEFL) ya da dil okulu", "The school's language test (e.g. IELTS / TOEFL) or a language course"],
    "t.p.ogrenci.aile": ["Sınırlı; ülkeye göre", "Limited; depends on the country"],
    "t.p.ogrenci.sart": ["Okul kabulü ve maddi yeterliliğin belgelenmesi", "An offer of admission and proof of funds"],
    "t.p.ogrenci.ek": ["Bazı ülkelerde öğrenim sırasında ve mezuniyet sonrasında sınırlı çalışma hakkı bulunur.", "Some countries allow limited work during and after studies."],
    "t.p.ogrenci.a1": ["Bölüm ve okul seçimi", "Choosing a course and school"], "t.p.ogrenci.a1d": ["Hedef, bütçe aralığı ve kabul şartlarına göre kısa liste.", "A shortlist based on goals, budget range and entry requirements."],
    "t.p.ogrenci.a2": ["Dil sınavı ve başvuru dosyası", "Language test and application"], "t.p.ogrenci.a2d": ["Niyet mektubu, referanslar, transkript.", "Statement of purpose, references, transcript."],
    "t.p.ogrenci.a3": ["Kabul mektubu", "Offer of admission"], "t.p.ogrenci.a3d": ["Okuldan resmî kabul ve kayıt belgeleri.", "Official admission and enrolment documents."],
    "t.p.ogrenci.a4": ["Maddi yeterlilik ve vize başvurusu", "Proof of funds and visa application"], "t.p.ogrenci.a4d": ["Banka belgeleri, sigorta ve vize görüşmesi.", "Bank documents, insurance and the visa interview."],
    "t.p.ogrenci.a5": ["Varış ve kayıt", "Arrival and enrolment"], "t.p.ogrenci.a5d": ["Okul kaydı ve oturum işlemleri.", "School enrolment and residence formalities."],
    "t.p.ogrenci.b1": ["Pasaport", "Passport"], "t.p.ogrenci.b2": ["Kabul mektubu", "Offer of admission"], "t.p.ogrenci.b3": ["Transkript ve diploma (tercümeli)", "Transcript and diploma (translated)"],
    "t.p.ogrenci.b4": ["Dil sınavı sonucu", "Language test result"], "t.p.ogrenci.b5": ["Maddi yeterlilik belgeleri", "Proof of funds"], "t.p.ogrenci.b6": ["Sağlık sigortası", "Health insurance"], "t.p.ogrenci.b7": ["Niyet mektubu ve referanslar", "Statement of purpose and references"],

    "t.p.ret.ad": ["Ret Sonrası Yeniden Başvuru", "Reapplying After a Refusal"], "t.p.ret.kisa": ["Yeniden başvuru", "Reapplication"], "t.p.ret.ulke": ["Önceki hedef", "Previous destination"],
    "t.p.ret.etk": ["Ret gerekçesine göre güçlendirilmiş yeni dosya", "A new file strengthened around the refusal reasons"],
    "t.p.ret.surec": ["Kısa – orta", "Short – medium"], "t.p.ret.dil": ["İlk başvurudaki programla aynı", "Same as the original programme"],
    "t.p.ret.aile": ["Önceki başvurunun türüne bağlı", "Depends on the original application"],
    "t.p.ret.sart": ["Ret gerekçesinin doğru okunup giderilmesi", "Understanding and addressing the refusal reasons"],
    "t.p.ret.ek": ["Ret gerekçesi giderilmeden aynı dosyayla tekrar başvurmak önerilmez.", "Reapplying with the same file, without addressing the reasons, is not advised."],
    "t.p.ret.a1": ["Ret yazısının incelenmesi", "Reviewing the refusal letter"], "t.p.ret.a1d": ["Gerekçe ve önceki dosya satır satır okunur.", "The reasons and the previous file, line by line."],
    "t.p.ret.a2": ["Eksik ve risk tespiti", "Identifying gaps and risks"], "t.p.ret.a2d": ["Bağlar, mali durum, seyahat amacı netleştirilir.", "Ties, finances and purpose of travel are clarified."],
    "t.p.ret.a3": ["Dosyanın yeniden kurgulanması", "Rebuilding the file"], "t.p.ret.a3d": ["Gerekçeyi karşılayan belgeler eklenir.", "Adding evidence that answers each reason."],
    "t.p.ret.a4": ["Görüşme hazırlığı", "Interview preparation"], "t.p.ret.a4d": ["Olası sorular üzerine prova.", "Rehearsing likely questions."],
    "t.p.ret.a5": ["Yeni başvuru ve takip", "New application and follow-up"], "t.p.ret.a5d": ["Başvuru sunulur, süreç izlenir.", "Filing and tracking the application."],
    "t.p.ret.b1": ["Ret yazısı ve önceki başvuru kopyaları", "Refusal letter and copies of the previous application"], "t.p.ret.b2": ["Pasaport (önceki vizeler dahil)", "Passport (including previous visas)"],
    "t.p.ret.b3": ["Güncel mali durum belgeleri", "Current financial documents"], "t.p.ret.b4": ["İş, aile ya da mülk bağlarını gösteren belgeler", "Evidence of work, family or property ties"], "t.p.ret.b5": ["Seyahat planı ve davet belgeleri", "Travel plan and invitation letters"],

    /* süre etiketleri (nitel; vaat değil) */
    "t.sure.hafta": ["Birkaç hafta", "A few weeks"], "t.sure.kisa": ["Kısa", "Short"], "t.sure.orta": ["Orta", "Medium"], "t.sure.uzun": ["Uzun", "Long"],

    /* gerekçeler */
    "t.r.arti": ["{x} bu yolla örtüşüyor.", "Your {x} fits this route well."],
    "t.r.eksi": ["{x} bu yol için zayıf bir nokta.", "Your {x} is a weaker point for this route."],
    "t.g.amac.yasam": ["Uzun vadeli yerleşme hedefiniz", "goal of settling long-term"], "t.g.amac.calisma": ["Çalışma odaklı hedefiniz", "work-focused goal"],
    "t.g.amac.egitim": ["Eğitim hedefiniz", "study goal"], "t.g.amac.yatirim": ["Yatırım yoluyla oturum hedefiniz", "goal of residence through investment"],
    "t.g.bolge.abd": ["ABD hedefiniz", "focus on the United States"], "t.g.bolge.avrupa": ["Avrupa Birliği hedefiniz", "focus on the European Union"], "t.g.bolge.diger": ["Farklı ülkelere açık olmanız", "openness to several countries"],
    "t.g.yas.18": ["18–24 yaş aralığınız", "age range (18–24)"], "t.g.yas.25": ["25–34 yaş aralığınız", "age range (25–34)"], "t.g.yas.35": ["35–44 yaş aralığınız", "age range (35–44)"], "t.g.yas.45": ["45 ve üzeri yaş aralığınız", "age range (45+)"],
    "t.g.egitim.lise": ["Lise düzeyi eğitiminiz", "high-school education"], "t.g.egitim.meslek": ["Meslek eğitiminiz", "vocational training"], "t.g.egitim.lisans": ["Üniversite diplomanız", "university degree"], "t.g.egitim.yl": ["Lisansüstü diplomanız", "postgraduate degree"],
    "t.g.dil.baslangic": ["Başlangıç düzeyi dil bilginiz", "beginner language level"], "t.g.dil.orta": ["Orta düzey dil bilginiz", "intermediate language level"], "t.g.dil.ileri": ["İleri düzey dil bilginiz", "advanced language level"], "t.g.dil.cokdil": ["Hedef ülke dilini de bilmeniz", "knowledge of the destination's language"],
    "t.g.butce.belirsiz": ["Bütçe aralığınızın henüz belli olmaması", "undecided budget range"], "t.g.butce.sinirli": ["Sınırlı bütçe aralığınız", "limited budget range"], "t.g.butce.orta": ["Orta bütçe aralığınız", "moderate budget range"], "t.g.butce.yuksek": ["Yüksek bütçe aralığınız", "high budget range"],
    "t.d.eb5.butce": ["Bu yol, yasal kaynağı belgelenmiş önemli bir yatırım gerektirir; bütçe aralığınız görüşmede netleşmeli.", "This route requires a significant investment with a documented lawful source; your budget range should be clarified in the call."],
    "t.d.eb5.bolge": ["Program yalnız ABD içindir; hedef bölgenizle örtüşmüyor.", "This programme is US-only and does not match your destination."],
    "t.d.bluecard.egitim": ["Mavi Kart tanınan bir yükseköğrenim diploması ister; meslek eğitimiyle başka yollar daha uygun olabilir.", "The Blue Card requires a recognised degree; other routes may suit vocational profiles better."],
    "t.d.bluecard.bolge": ["Program AB ülkeleri içindir; hedef bölgenizle örtüşmüyor.", "This programme covers EU countries and does not match your destination."],
    "t.d.calisma.dil": ["Dil seviyesini yükseltmek iş görüşmelerinde belirgin fark yaratır.", "Improving your language level makes a clear difference in interviews."],
    "t.d.calisma.yas": ["Bazı ülkelerin puan sistemlerinde yaş etkisi vardır; ülke seçimi önem kazanır.", "Some points-based systems weigh age, so the choice of country matters more."],
    "t.d.ogrenci.yas": ["Bu yaş aralığında öğrenci vizesi mümkün olsa da amacın inandırıcı anlatılması önem kazanır.", "A student visa is possible at this age, but a convincing study purpose becomes important."],
    "t.d.ogrenci.amac": ["Asıl hedefiniz eğitim değil; okul yolu ancak ara basamak olarak düşünülebilir.", "Study is not your main goal; this route works only as a stepping stone."],
    "t.d.ogrenci.butce": ["Öğrenci vizesinde maddi yeterlilik belgelenmelidir.", "Student visas require documented proof of funds."],
    "t.x.eb5": ["Aile (eş ve 21 yaş altı bekâr çocuklar) aynı başvuruya dahil edilebilir.", "Your spouse and unmarried children under 21 can be included in the same application."],
    "t.x.bluecard": ["Çoğu meslekte Almanca şartı aranmaz; düzenlenmiş mesleklerde istenebilir (kaynak: BAMF).", "Most occupations do not require German; regulated professions may (source: BAMF)."],
    "t.x.calisma": ["Mesleğiniz aranan meslek listelerindeyse süreç kolaylaşabilir.", "If your profession is on a shortage list, the process can be smoother."],
    "t.x.ogrenci": ["Bazı ülkelerde öğrenim sırasında sınırlı çalışma hakkı bulunur.", "Some countries allow limited work while you study."],
    "t.x.ret1": ["Önceki ret kaydınız, gerekçeye göre güçlendirilmiş yeni bir dosyayı öne çıkarıyor.", "Your previous refusal puts a rebuilt, reason-focused application first."],
    "t.x.ret": ["Ret gerekçesi giderilip dosya yeniden kurgulandığında yeni başvuru güçlenir; eski konsolosluk deneyimi bu aşamada işe yarar.", "Addressing the reasons and rebuilding the file strengthens a new application — this is where former consular experience helps."],

    /* sonuç ekranı */
    "t.s.etiket": ["Ön değerlendirme sonucu", "Preliminary assessment"],
    "t.s.baslik": ["Profilinize en yakın yollar", "The routes closest to your profile"],
    "t.s.aciklama": ["Genel uygunluk puanı, cevaplarınızın programların temel şartlarıyla ne kadar örtüştüğünü gösterir.", "Your overall score shows how closely your answers match each programme's core requirements."],
    "t.s.guclu": ["Güçlü uyum", "Strong match"], "t.s.orta": ["Değerlendirilebilir uyum", "Worth exploring"], "t.s.zayif": ["Hazırlık gerektirir", "Needs preparation"],
    "t.s.puanAria": ["Genel uygunluk puanı 100 üzerinden {n}", "Overall eligibility score {n} out of 100"],
    "t.s.cevaplar": ["Cevaplarınız", "Your answers"], "t.s.degistir": ["{e}: {v}. Cevabı değiştir", "{e}: {v}. Change answer"],
    "t.s.onRozet": ["Ön değerlendirme · kesin değil", "Preliminary · not a decision"],
    "t.s.not": ["Bu bir ön değerlendirmedir; kesin bilgi danışmanınızla görüşmede verilir. Sonuç garanti, onay ya da süre taahhüdü anlamına gelmez.", "This is a preliminary assessment; your consultant will give you definitive guidance. It is not a guarantee, an approval or a timeline commitment."],
    "t.s.b1": ["01 · Öneriler", "01 · Recommendations"], "t.s.b1b": ["Size en uygun {n} program", "Your {n} best-fit programmes"],
    "t.s.b2": ["02 · Karşılaştırma", "02 · Comparison"], "t.s.b2b": ["Beş program yan yana", "Five programmes side by side"],
    "t.s.b3": ["03 · Yol haritası", "03 · Roadmap"], "t.s.b3b": ["Adım adım süreç ve belgeler", "Step-by-step process and documents"],
    "t.s.enUygun": ["En uygun", "Best fit"], "t.s.alternatif": ["Alternatif yol", "Alternative route"],
    "t.s.uyum": ["Uyum", "Fit"], "t.s.uyumAria": ["Uyum {n} / 100", "Fit {n} / 100"],
    "t.s.neden": ["Neden uygun", "Why it fits"], "t.s.dikkat": ["Dikkat edilecekler", "Things to consider"],
    "t.s.haritaGoster": ["Yol haritasını göster", "Show the roadmap"],
    "t.s.olcut": ["Ölçüt", "Criteria"], "t.s.sizeUygun": ["Size uygun", "Your fit"],
    "t.s.kSurec": ["Süreç uzunluğu", "Process length"], "t.s.kDil": ["Dil beklentisi", "Language"], "t.s.kAile": ["Aile dahil mi", "Family included?"], "t.s.kSart": ["Temel şart", "Core requirement"],
    "t.s.tabloCap": ["Programların nitel karşılaştırması (ücret bilgisi içermez)", "Qualitative comparison of programmes (no fees included)"],
    "t.s.tabloDip": ["Süreler yalnız göreli karşılaştırmadır; süre taahhüdü verilmez. Kesin şartlar ülkeye, döneme ve kişisel dosyaya göre değişir.", "Process lengths are relative only — no timeline is promised. Exact requirements vary by country, period and personal file."],
    "t.s.kaynak": ["Mavi Kart dil bilgisi kaynağı: BAMF (Almanya Federal Göç ve Mülteciler Dairesi).", "Blue Card language note source: BAMF (German Federal Office for Migration and Refugees)."],
    "t.s.sekmeAria": ["Program seçin", "Choose a programme"],
    "t.s.onerilmez": ["Cevaplarınıza göre öne çıkmıyor", "Not highlighted by your answers"],
    "t.s.zaman": ["Zaman çizelgesi", "Timeline"], "t.s.sure": ["Göreli süre: {s}", "Relative length: {s}"],
    "t.s.belgeler": ["Belge listesi", "Document checklist"], "t.s.hazir": ["{a} / {n} hazır", "{a} / {n} ready"],
    "t.s.belgeDip": ["Elinizde olanları işaretleyin; danışmanınız eksikleri görüşmede tamamlamanıza yardım eder. Liste örnektir, kişiye göre değişir.", "Tick what you already have; your consultant will help with the rest. The list is indicative and varies per person."],
    "t.s.danis": ["Ücretsiz danışmanlık al", "Book a free consultation"],
    "t.s.yazdir": ["Kişisel yol haritası · Yazdır / PDF", "Personal roadmap · Print / PDF"],
    "t.s.tekrar": ["Testi yeniden çöz", "Retake the check"],

    /* yazdır */
    "t.y.baslik": ["Kişisel yol haritası", "Personal roadmap"], "t.y.genel": ["Genel uygunluk", "Overall eligibility"],
    "t.y.oneri": ["Önerilen programlar", "Recommended programmes"], "t.y.adimlar": ["Süreç adımları · {p}", "Process steps · {p}"],
    "t.y.belge": ["Belge listesi · {a} / {n} hazır", "Document checklist · {a} / {n} ready"], "t.y.dikkat": ["Dikkat", "Note"],
    "t.y.son": ["Bu belge bir garanti, onay, süre taahhüdü ya da resmî karar değildir. · Altera Global · Hazırlayan: Dijitabela (örnek prototip)", "This document is not a guarantee, approval, timeline commitment or official decision. · Altera Global · Prepared by Dijitabela (sample prototype)"],

    /* form */
    "t.f.etiket": ["Son adım · ücretsiz", "Final step · free"],
    "t.f.baslik": ["Sonuçlarınızı bir danışmanla birlikte okuyun", "Go through your results with a consultant"],
    "t.f.metin": ["Danışmanınız ön değerlendirmenizi ({p} öne çıkıyor) önceden görerek arar; hangi belgelerle başlayacağınızı birlikte netleştirirsiniz.", "Your consultant reviews your assessment ({p} leads) before calling, so together you can decide which documents to start with."],
    "t.f.a1": ["Görüşme ücretsizdir, bağlayıcı değildir", "The call is free and non-binding"],
    "t.f.a2": ["Eski konsolosluk deneyimine sahip ekip", "A team with former consular experience"],
    "t.f.a3": ["Bilgileriniz yalnız geri dönüş için kullanılır", "Your details are used only to call you back"],
    "t.f.not": ["Bu bir ön değerlendirmedir; kesin bilgi danışmanınızla görüşmede verilir.", "This is a preliminary assessment; definitive guidance comes from your consultant."],
    "t.f.ad": ["Adınız soyadınız", "Full name"], "t.f.adPh": ["Ör. Ayşe Yılmaz", "e.g. Ayşe Yılmaz"],
    "t.f.tel": ["Cep telefonu (Türkiye)", "Mobile number (Turkey)"],
    "t.f.saat": ["Size uygun arama saati", "Best time to call"],
    "t.f.sabah": ["Sabah", "Morning"], "t.f.ogle": ["Öğle", "Midday"], "t.f.ikindi": ["Öğleden sonra", "Afternoon"], "t.f.aksam": ["Akşam", "Evening"],
    "t.f.kvkkOn": ["", "I have read the "], "t.f.kvkkLink": ["Aydınlatma metnini", "privacy notice"],
    "t.f.kvkk": [" okudum; bilgilerimin geri dönüş için işlenmesini kabul ediyorum.", " (KVKK) and agree to my details being processed for a call-back."],
    "t.f.kvkkBas": ["KVKK aydınlatma metni (örnek)", "Privacy notice under KVKK (sample)"],
    "t.f.kvkkMetin": ["Bu metin prototip içindir. Ad, telefon ve test cevaplarınız, 6698 sayılı Kanun kapsamında yalnız sizinle iletişime geçmek ve ön değerlendirmenizi görüşmek amacıyla işlenir; üçüncü kişilerle paylaşılmaz. Başvuru, düzeltme ve silme haklarınızı veri sorumlusuna iletebilirsiniz.", "This text is for the prototype only. Under Turkish Law No. 6698, your name, phone number and answers are processed solely to contact you and discuss your assessment, and are not shared with third parties. You may request access, correction or deletion from the data controller."],
    "t.f.gonder": ["Ücretsiz danışmanlık al", "Book my free consultation"],
    "t.f.demo": ["Demo: bu formda gerçek gönderim yapılmaz.", "Demo: nothing is actually sent from this form."],
    "t.f.hAd": ["Lütfen adınızı ve soyadınızı yazın.", "Please enter your first and last name."],
    "t.f.hTel": ["05 ile başlayan 11 haneli bir cep numarası girin.", "Enter an 11-digit Turkish mobile number starting with 05."],
    "t.f.hKvkk": ["Devam etmek için aydınlatma metnini onaylayın.", "Please accept the privacy notice to continue."],
    "t.f.tesekkur": ["Teşekkürler, {ad}.", "Thank you, {ad}."],
    "t.f.arayacak": ["Danışmanınız sizi arayacak.", "Your consultant will call you."],
    "t.f.saatSecim": ["Tercih ettiğiniz saat: <b>{s}</b>. Ön değerlendirmeniz danışmanınıza iletildi (demo).", "Preferred time: <b>{s}</b>. Your assessment has been passed to your consultant (demo)."],
    "t.f.wa": ["WhatsApp'tan yaz", "Message us on WhatsApp"],
    "t.f.panel": ["Firma panelinde nasıl göründüğüne bakın", "See how it appears in the firm's dashboard"],
    "t.f.waMetin": ["Merhaba, ben {ad}. Altera Global uygunluk testini doldurdum.\nGenel uygunluk: {g}/100\nÖne çıkan programlar: {p}\nAmaç: {a} · Hedef: {b} · Vize reddi: {r}\nUygun arama saatim: {s}. Ücretsiz ön görüşme rica ediyorum.",
      "Hello, I'm {ad}. I've completed the Altera Global eligibility check.\nOverall score: {g}/100\nTop programmes: {p}\nGoal: {a} · Destination: {b} · Previous refusal: {r}\nBest time to call: {s}. I'd like to book a free initial consultation."]
  };
  var SOZ = { tr: {}, en: {} };
  Object.keys(S).forEach(function (k) { SOZ.tr[k] = S[k][0]; SOZ.en[k] = S[k][1]; });
  var ekli = false;
  function sozlukEkle() { if (!ekli && window.AI18N && typeof window.AI18N.ekle === "function") { try { window.AI18N.ekle(SOZ); ekli = true; } catch (e) { } } }
  sozlukEkle();

  function dil() {
    var d = (window.AI18N && window.AI18N.dil) || document.documentElement.lang || "tr";
    return /^en/i.test(d) ? "en" : "tr";
  }
  function T(k, v) {
    var s = null;
    if (window.AI18N && typeof window.AI18N.t === "function") { try { s = window.AI18N.t(k); } catch (e) { s = null; } }
    if (typeof s !== "string" || s === k) s = (SOZ[dil()] && SOZ[dil()][k]) != null ? SOZ[dil()][k] : (SOZ.tr[k] != null ? SOZ.tr[k] : k);
    if (v) s = String(s).replace(/\{(\w+)\}/g, function (m, n) { return v[n] != null ? v[n] : m; });
    return s;
  }
  function yerel() { return dil() === "en" ? "en-GB" : "tr-TR"; }

  /* ---------- SVG çizgi ikonlar (emoji yok) ---------- */
  var IK = {
    ev: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
    canta: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7"/><path d="M3 12.5h18"/><path d="M11 12.5v2h2v-2"/>',
    kep: '<path d="M2 9.5L12 5l10 4.5L12 14z"/><path d="M6 11.5V16c3.5 2.4 8.5 2.4 12 0v-4.5"/><path d="M22 9.5V15"/>',
    yatirim: '<path d="M3 20h18"/><path d="M5 16l5-5 4 3 6-7"/><path d="M15 7h5v5"/>',
    bayrak: '<path d="M5 21V4"/><path d="M5 4.5h13l-2.5 4 2.5 4H5"/>',
    kure: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3.2 3.2 3.2 14.8 0 18"/><path d="M12 3c-3.2 3.2-3.2 14.8 0 18"/>',
    pusula: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    kitap: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2z"/><path d="M8 7h8"/>',
    anahtar: '<path d="M14.5 5.5a4 4 0 0 0 4.9 5.2L11 19.1a2 2 0 0 1-2.9-2.9l8.4-8.4"/><path d="M14.5 5.5l2.3 2.3"/>',
    diploma: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M7 8h7M7 11h4"/><circle cx="16.5" cy="15.5" r="2.5"/><path d="M15 17.5l-.8 3.5 2.3-1 2.3 1-.8-3.5"/>',
    takvim: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    soru: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.6"/><path d="M12 16.8v.2"/>',
    red: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M9.5 12.5l5 5M14.5 12.5l-5 5"/>',
    onay: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/>',
    tik: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    uyari: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.2v.1"/>',
    ok: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    geri: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    yazici: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    tekrar: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
    tel: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    sohbet: '<path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/>',
    kalem: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 20V9"/>',
    kilit: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    kalkan: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M12 8v5M12 16v.1"/>'
  };
  function ikon(ad, sinif) {
    return '<svg class="t-ik' + (sinif ? " " + sinif : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (IK[ad] || "") + "</svg>";
  }
  function seviye(n, top) {
    var h = "";
    for (var i = 0; i < top; i++) { var y = 18 - i * 4; h += '<rect x="' + (4 + i * 4.6) + '" y="' + y + '" width="3" height="' + (21 - y) + '" rx="1"' + (i < n ? ' fill="currentColor"' : "") + "/>"; }
    return '<svg class="t-ik" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true" focusable="false">' + h + "</svg>";
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- Sorular (metinler sözlükte) ---------- */
  var SORULAR = [
    { k: "amac", o: [["yasam", "ev"], ["calisma", "canta"], ["egitim", "kep"], ["yatirim", "yatirim"]] },
    { k: "bolge", o: [["abd", "bayrak"], ["avrupa", "kure"], ["diger", "pusula"]] },
    { k: "yas", o: [["18", "takvim"], ["25", "takvim"], ["35", "takvim"], ["45", "takvim"]] },
    { k: "egitim", o: [["lise", "kitap"], ["meslek", "anahtar"], ["lisans", "kep"], ["yl", "diploma"]] },
    { k: "dil", o: [["baslangic", "#1"], ["orta", "#2"], ["ileri", "#3"], ["cokdil", "#4"]] },
    { k: "butce", o: [["belirsiz", "soru"], ["sinirli", "$1"], ["orta", "$2"], ["yuksek", "$3"]] },
    { k: "ret", o: [["hayir", "onay"], ["evet", "red"]] }
  ];
  function secenekIkon(s) {
    if (s.charAt(0) === "#") return seviye(+s.slice(1), 4);
    if (s.charAt(0) === "$") return seviye(+s.slice(1), 3);
    return ikon(s);
  }
  function qE(k) { return T("t.q." + k + ".e"); }
  function etiket(k, v) { return v ? T("t.o." + k + "." + v) : "—"; }

  /* ---------- Programlar (yapı; metinler sözlükte) ---------- */
  var PROG = {
    eb5: { adim: ["hafta", "hafta", "orta", "uzun", "uzun", "uzun"], belge: 7 },
    bluecard: { adim: ["hafta", "orta", "orta", "kisa", "kisa"], belge: 7 },
    calisma: { adim: ["kisa", "kisa", "orta", "orta", "kisa"], belge: 6 },
    ogrenci: { adim: ["kisa", "orta", "orta", "kisa", "kisa"], belge: 7 },
    ret: { adim: ["kisa", "kisa", "orta", "kisa", "orta"], belge: 5 }
  };
  var SURECN = { eb5: 3, bluecard: 2, calisma: 2, ogrenci: 1, ret: 2 };
  var SIRA = ["eb5", "bluecard", "calisma", "ogrenci", "ret"];
  function P(kod, alan) { return T("t.p." + kod + "." + alan); }

  /* ---------- Kural tabanlı puan tablosu (açık) ----------
     puan = taban + her cevabın katkısı, 12–95 arasına sıkıştırılır.
     "ret" programı yalnız ret = evet ise listeye girer ve en öne alınır.
     Katkı ≥ +8 → "neden uygun" gerekçesi; ≤ −8 → "dikkat" maddesi. */
  var TABLO = {
    eb5: { taban: 10,
      amac: { yasam: 12, calisma: 0, egitim: -10, yatirim: 30 }, bolge: { abd: 22, avrupa: -14, diger: 2 },
      yas: { "18": -2, "25": 2, "35": 4, "45": 4 }, egitim: { lise: 0, meslek: 0, lisans: 2, yl: 2 },
      dil: { baslangic: 0, orta: 2, ileri: 3, cokdil: 3 }, butce: { belirsiz: -6, sinirli: -30, orta: -10, yuksek: 32 }, ret: { evet: -3, hayir: 0 } },
    bluecard: { taban: 12,
      amac: { yasam: 12, calisma: 28, egitim: 0, yatirim: -6 }, bolge: { abd: -16, avrupa: 24, diger: 4 },
      yas: { "18": 2, "25": 6, "35": 5, "45": 0 }, egitim: { lise: -24, meslek: -10, lisans: 14, yl: 18 },
      dil: { baslangic: -4, orta: 4, ileri: 7, cokdil: 9 }, butce: { belirsiz: 0, sinirli: 2, orta: 2, yuksek: 0 }, ret: { evet: -3, hayir: 0 } },
    calisma: { taban: 18,
      amac: { yasam: 10, calisma: 26, egitim: -4, yatirim: -4 }, bolge: { abd: 4, avrupa: 6, diger: 8 },
      yas: { "18": 4, "25": 6, "35": 3, "45": -4 }, egitim: { lise: 0, meslek: 8, lisans: 8, yl: 8 },
      dil: { baslangic: -8, orta: 4, ileri: 10, cokdil: 12 }, butce: { belirsiz: 0, sinirli: 2, orta: 0, yuksek: 0 }, ret: { evet: -4, hayir: 0 } },
    ogrenci: { taban: 10,
      amac: { yasam: 6, calisma: 2, egitim: 36, yatirim: -10 }, bolge: { abd: 6, avrupa: 6, diger: 6 },
      yas: { "18": 18, "25": 10, "35": -2, "45": -10 }, egitim: { lise: 6, meslek: 4, lisans: 6, yl: 2 },
      dil: { baslangic: -2, orta: 5, ileri: 8, cokdil: 8 }, butce: { belirsiz: 0, sinirli: -6, orta: 6, yuksek: 6 }, ret: { evet: -3, hayir: 0 } },
    ret: { taban: 66,
      amac: { yasam: 0, calisma: 2, egitim: 2, yatirim: 0 }, bolge: { abd: 4, avrupa: 2, diger: 0 },
      yas: { "18": 0, "25": 2, "35": 2, "45": 0 }, egitim: { lise: 0, meslek: 0, lisans: 2, yl: 3 },
      dil: { baslangic: -2, orta: 2, ileri: 4, cokdil: 4 }, butce: { belirsiz: 0, sinirli: 0, orta: 3, yuksek: 4 }, ret: { evet: 0, hayir: -999 } }
  };
  var GALAN = ["amac", "bolge", "yas", "egitim", "dil", "butce"];
  var DOZEL = { eb5: ["butce", "bolge"], bluecard: ["egitim", "bolge"], calisma: ["dil", "yas"], ogrenci: ["yas", "amac", "butce"] };
  function buyukHarf(s) { return s.charAt(0).toLocaleUpperCase(yerel()) + s.slice(1); }

  function hesapla(c) {
    var sonuc = SIRA.map(function (kod) {
      var t = TABLO[kod], p = t.taban, arti = [], eksi = [];
      GALAN.concat(["ret"]).forEach(function (k) {
        var v = c[k], d = (t[k] && t[k][v]) || 0; p += d;
        if (k === "ret") return;
        var x = T("t.g." + k + "." + v);
        if (d >= 8) arti.push({ d: d, m: buyukHarf(T("t.r.arti", { x: x })) });
        else if (d <= -8) eksi.push({ d: d, m: (DOZEL[kod] && DOZEL[kod].indexOf(k) > -1) ? T("t.d." + kod + "." + k) : buyukHarf(T("t.r.eksi", { x: x })) });
      });
      arti.sort(function (a, b) { return b.d - a.d; }); eksi.sort(function (a, b) { return a.d - b.d; });
      var neden = arti.slice(0, 3).map(function (x) { return x.m; });
      if (kod === "ret") neden = [T("t.x.ret1")];
      neden.push(T("t.x." + kod));
      return { kod: kod, ad: P(kod, "ad"), puan: Math.max(12, Math.min(95, Math.round(p))), neden: neden, dikkat: eksi.slice(0, 2).map(function (x) { return x.m; }) };
    }).filter(function (x) { return x.kod !== "ret" || c.ret === "evet"; });
    sonuc.sort(function (a, b) {
      if (a.kod === "ret") return -1; if (b.kod === "ret") return 1;
      return b.puan - a.puan;
    });
    return sonuc;
  }
  function oneri(liste) { var o = liste.slice(0, 2); if (liste[2] && liste[2].puan >= 45) o.push(liste[2]); return o; }
  function genelPuan(c, liste) {
    var en = liste.filter(function (x) { return x.kod !== "ret"; })[0], p = en ? en.puan : 50;
    if (c.ret === "evet") p = Math.round(p * 0.92);
    if (c.dil === "baslangic") p -= 3;
    return Math.max(15, Math.min(94, p));
  }
  function seviyeYazi(p) { return p >= 75 ? [T("t.s.guclu"), "iyi"] : p >= 55 ? [T("t.s.orta"), "uyari"] : [T("t.s.zayif"), "kotu"]; }

  /* ---------- Durum ---------- */
  var K = {}, cevap = {}, adim = 0, liste = [], oner = [], secili = null, genel = 0, belgeDurum = {},
    gonderildi = null, formDurum = null, gecisSuruyor = false, ilerleZaman = 0, analizde = false;

  function kokleriBul() { K.test = $("#test-kok"); K.sonuc = $("#sonuc-kok"); K.form = $("#form-kok"); return K.test && K.sonuc && K.form; }
  function goster(el, acik) { if (el) el.hidden = !acik; }
  function kaydir(el) { if (!el) return; try { el.scrollIntoView({ behavior: AZ ? "auto" : "smooth", block: "start" }); } catch (e) { el.scrollIntoView(); } }
  function odak(el) { if (el) try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }

  /* =====================================================================
     TEST
     ===================================================================== */
  var HC = 2 * Math.PI * 26, SEG = HC / 7;
  function halkaSeg(sinif) {
    var h = "";
    for (var i = 0; i < 7; i++) h += '<circle class="' + sinif + '" cx="32" cy="32" r="26" stroke-dasharray="' + (SEG - 3.2).toFixed(2) + " " + (HC - SEG + 3.2).toFixed(2) + '" transform="rotate(' + (-90 + i * 360 / 7 + 2.5).toFixed(2) + ' 32 32)"/>';
    return h;
  }
  function testIskelet() {
    K.test.classList.add("t-kok");
    K.test.innerHTML =
      '<div class="t-ic">' +
      '<div class="t-ust">' +
      '<div class="t-halka" aria-hidden="true"><svg viewBox="0 0 64 64">' + halkaSeg("t-halka-iz") + halkaSeg("t-halka-dolu") + '</svg><span class="t-halka-no"></span></div>' +
      '<div class="t-ust-yazi"><span class="t-etiket"><span class="t-et-ad"></span> · <span class="t-adim-etk"></span></span><span class="t-adim-ad"></span></div>' +
      '<button type="button" class="t-kapat t-dug t-dug-ince" data-is="cik"></button>' +
      "</div>" +
      '<div class="t-sahne" aria-live="polite"></div>' +
      '<div class="t-alt"><button type="button" class="t-dug t-dug-ince" data-is="geri">' + ikon("geri") + '<span class="t-y"></span></button>' +
      '<p class="t-ipucu-klavye" aria-hidden="true"></p>' +
      '<button type="button" class="t-dug t-dug-ana" data-is="ileri"><span class="t-y"></span>' + ikon("ok") + "</button></div>" +
      "</div>";
    K.sahne = $(".t-sahne", K.test);
    if (!K.test.__bagli) { K.test.addEventListener("click", testTik); K.test.addEventListener("keydown", testTus); K.test.__bagli = true; }
    iskeletMetin();
  }
  function iskeletMetin() {
    K.test.setAttribute("aria-label", T("t.etiket"));
    $(".t-et-ad", K.test).textContent = T("t.etiket");
    var c = $('[data-is="cik"]', K.test); c.textContent = T("t.cik"); c.setAttribute("aria-label", T("t.cikAria"));
    $('[data-is="geri"] .t-y', K.test).textContent = T("t.geri");
    $(".t-ipucu-klavye", K.test).innerHTML = T("t.klavye");
  }
  function soruHTML(i) {
    var q = SORULAR[i], sec = cevap[q.k];
    return '<div class="t-slayt" data-i="' + i + '">' + '<span class="t-dev" aria-hidden="true">0' + (i + 1) + "</span>" +
      '<span class="t-etiket t-soru-no">' + esc(T("t.soruNo", { i: i + 1, n: SORULAR.length })) + "</span>" +
      '<h2 class="t-soru" id="t-soru-' + i + '" tabindex="-1">' + esc(T("t.q." + q.k + ".t")) + "</h2>" +
      '<p class="t-yardim">' + esc(T("t.q." + q.k + ".h")) + "</p>" +
      '<div class="t-secenekler t-n' + q.o.length + '" role="radiogroup" aria-labelledby="t-soru-' + i + '">' +
      q.o.map(function (o, j) {
        var on = sec === o[0], tab = on || (!sec && j === 0) ? "0" : "-1", ak = "t.o." + q.k + "." + o[0] + ".s", alt = S[ak] ? T(ak) : "";
        return '<button type="button" class="t-secenek' + (on ? " on" : "") + '" role="radio" aria-checked="' + on + '" tabindex="' + tab + '" data-v="' + o[0] + '" style="--g:' + (j * 50) + 'ms">' +
          '<span class="t-sec-no" aria-hidden="true">' + (j + 1) + "</span>" +
          '<span class="t-sec-ik">' + secenekIkon(o[1]) + "</span>" +
          '<span class="t-sec-yazi"><b>' + esc(T("t.o." + q.k + "." + o[0])) + "</b>" + (alt ? "<small>" + esc(alt) + "</small>" : "") + "</span>" +
          '<span class="t-sec-isaret" aria-hidden="true">' + ikon("tik") + "</span></button>";
      }).join("") + "</div></div>";
  }
  function ustGuncelle() {
    var tamam = SORULAR.filter(function (q) { return cevap[q.k]; }).length;
    $$(".t-halka-dolu", K.test).forEach(function (c, i) { c.setAttribute("class", "t-halka-dolu" + (cevap[SORULAR[i].k] ? " ok" : i === adim ? " su" : "")); });
    $(".t-halka-no", K.test).textContent = (adim + 1) + "/" + SORULAR.length;
    $(".t-adim-etk", K.test).textContent = T("t.tamam", { n: Math.round(tamam / SORULAR.length * 100) });
    $(".t-adim-ad", K.test).textContent = qE(SORULAR[adim].k);
    var g = $('[data-is="geri"]', K.test), il = $('[data-is="ileri"]', K.test);
    g.disabled = adim === 0;
    il.disabled = !cevap[SORULAR[adim].k];
    $(".t-y", il).textContent = adim === SORULAR.length - 1 ? T("t.sonucuGor") : T("t.ileri");
  }
  function soruAc(i, yon) {
    var eski = $(".t-slayt", K.sahne);
    adim = i;
    var tmp = document.createElement("div"); tmp.innerHTML = soruHTML(i);
    var yeni = tmp.firstChild;
    if (eski && !AZ && yon) {
      gecisSuruyor = true;
      eski.classList.add("t-cik", yon > 0 ? "t-sola" : "t-saga");
      yeni.classList.add("t-gir", yon > 0 ? "t-sagdan" : "t-soldan");
      K.sahne.appendChild(yeni);
      void yeni.offsetWidth;
      yeni.classList.add("t-yerinde");
      setTimeout(function () {
        if (eski.parentNode) eski.parentNode.removeChild(eski);
        yeni.classList.remove("t-gir", "t-sagdan", "t-soldan", "t-yerinde");
        gecisSuruyor = false; odakla();
      }, 460);
    } else { K.sahne.innerHTML = ""; K.sahne.appendChild(yeni); odakla(); }
    ustGuncelle();
  }
  function odakla() { odak($(".t-slayt:not(.t-cik) .t-secenek.on", K.sahne) || $(".t-slayt:not(.t-cik) .t-secenek", K.sahne)); }
  function sec(v, ilerle) {
    var q = SORULAR[adim]; cevap[q.k] = v;
    $$(".t-slayt:not(.t-cik) .t-secenek", K.sahne).forEach(function (b) {
      var on = b.getAttribute("data-v") === v; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1;
      if (on) { b.classList.remove("t-nabiz"); void b.offsetWidth; b.classList.add("t-nabiz"); }
    });
    ustGuncelle();
    clearTimeout(ilerleZaman);
    if (ilerle) ilerleZaman = setTimeout(ileri, AZ ? 60 : 380);
  }
  function ileri() {
    clearTimeout(ilerleZaman);
    if (gecisSuruyor) { ilerleZaman = setTimeout(ileri, 120); return; } /* hızlı tıklamada ilerleme kuyruğa alınır */
    if (analizde || !cevap[SORULAR[adim].k]) return;
    if (adim < SORULAR.length - 1) soruAc(adim + 1, 1); else analiz();
  }
  function geri() { if (!gecisSuruyor && !analizde && adim > 0) { clearTimeout(ilerleZaman); soruAc(adim - 1, -1); } }
  function testTik(e) {
    var b = e.target.closest("button"); if (!b || !K.test.contains(b)) return;
    if (b.classList.contains("t-secenek")) { if (!b.closest(".t-cik")) sec(b.getAttribute("data-v"), true); return; }
    var is = b.getAttribute("data-is");
    if (is === "geri") geri(); else if (is === "ileri") ileri(); else if (is === "cik") cik();
  }
  function testTus(e) {
    if (analizde || !$(".t-slayt", K.sahne) || e.altKey || e.ctrlKey || e.metaKey) return;
    var q = SORULAR[adim], butonlar = $$(".t-slayt:not(.t-cik) .t-secenek", K.sahne), i = butonlar.indexOf(document.activeElement), k = e.key;
    if (/^[1-9]$/.test(k) && +k <= q.o.length) { e.preventDefault(); odak(butonlar[+k - 1]); sec(q.o[+k - 1][0], true); return; }
    if (k === "ArrowDown" || k === "ArrowUp") {
      e.preventDefault(); var n = i < 0 ? 0 : (i + (k === "ArrowDown" ? 1 : -1) + butonlar.length) % butonlar.length;
      butonlar.forEach(function (b, j) { b.tabIndex = j === n ? 0 : -1; }); odak(butonlar[n]); return;
    }
    if (k === "ArrowRight") { if (cevap[q.k]) { e.preventDefault(); ileri(); } return; }
    if (k === "ArrowLeft" || (k === "Backspace" && i >= 0)) { e.preventDefault(); geri(); return; }
    if ((k === "Enter" || k === " ") && i >= 0) { e.preventDefault(); sec(butonlar[i].getAttribute("data-v"), true); return; }
    if (k === "Escape") cik();
  }
  function cik() {
    clearTimeout(ilerleZaman); goster(K.test, false);
    var b = $("#basla"); if (b) { kaydir($("#karsilama") || b); odak(b); }
  }
  function analizCiz() {
    $$(".t-halka-dolu", K.test).forEach(function (c) { c.setAttribute("class", "t-halka-dolu ok"); });
    $(".t-halka-no", K.test).textContent = "7/7";
    $(".t-adim-etk", K.test).textContent = T("t.tamam", { n: 100 });
    $(".t-adim-ad", K.test).textContent = T("t.degerlendiriliyor");
    $(".t-alt", K.test).hidden = true;
    K.sahne.innerHTML = '<div class="t-slayt t-analiz" role="status"><h2 class="t-soru" tabindex="-1">' + esc(T("t.analizBas")) + '</h2><ul class="t-analiz-liste">' +
      ["t.analiz1", "t.analiz2", "t.analiz3"].map(function (a, i) { return '<li style="--g:' + (i * 520) + 'ms">' + ikon("onay") + "<span>" + esc(T(a)) + "</span></li>"; }).join("") + "</ul></div>";
  }
  function analiz() {
    analizde = true; analizCiz();
    odak($(".t-analiz .t-soru", K.sahne));
    setTimeout(function () {
      analizde = false; goster(K.test, false); $(".t-alt", K.test).hidden = false;
      sonucKur(false);
    }, AZ ? 250 : 1800);
  }
  function testBaslat(korunsun, soruNo) {
    clearTimeout(ilerleZaman); analizde = false;
    if (!korunsun) { cevap = {}; belgeDurum = {}; gonderildi = null; formDurum = null; secili = null; }
    if (!K.sahne) testIskelet();
    $(".t-alt", K.test).hidden = false;
    goster(K.test, true); goster(K.sonuc, false); goster(K.form, false);
    K.sahne.innerHTML = "";
    soruAc(soruNo || 0, 0);
    kaydir(K.test);
  }

  /* =====================================================================
     SONUÇ
     ===================================================================== */
  var NSEG = 60;
  function gostergeSVG() {
    var iz = "", dolu = "";
    for (var i = 0; i < NSEG; i++) {
      var a = (i / NSEG) * 2 * Math.PI - Math.PI / 2, r1 = 44, r2 = 55, ca = Math.cos(a), sa = Math.sin(a);
      var l = 'x1="' + (60 + r1 * ca).toFixed(2) + '" y1="' + (60 + r1 * sa).toFixed(2) + '" x2="' + (60 + r2 * ca).toFixed(2) + '" y2="' + (60 + r2 * sa).toFixed(2) + '"';
      iz += "<line " + l + "/>"; dolu += '<line class="s-seg" style="transition-delay:' + (i * 22) + 'ms" ' + l + "/>";
    }
    return '<svg viewBox="0 0 120 120" aria-hidden="true"><g class="s-g-iz">' + iz + '</g><g class="s-g-dolu">' + dolu + '</g><g class="s-ibre"><circle cx="60" cy="2" r="2.6"/></g></svg>';
  }
  function sonucKur(sessiz) {
    liste = hesapla(cevap); oner = oneri(liste); genel = genelPuan(cevap, liste);
    if (!secili || !sessiz) secili = oner[0].kod;
    var sv = seviyeYazi(genel);
    K.sonuc.classList.add("t-kok", "s-kok");
    K.sonuc.classList.toggle("s-hemen", !!sessiz);
    K.sonuc.innerHTML =
      '<div class="s-ic">' +
      '<header class="s-bas">' +
      '<div class="s-gosterge s-' + sv[1] + '" role="img" aria-label="' + esc(T("t.s.puanAria", { n: genel })) + '">' + gostergeSVG() +
      '<div class="s-g-yazi"><b class="s-g-sayi">' + (sessiz || AZ ? genel : 0) + "</b><small>/ 100</small></div></div>" +
      '<div class="s-bas-yazi"><span class="s-on-rozet">' + ikon("kalkan") + "<span>" + esc(T("t.s.onRozet")) + "</span></span>" +
      '<h2 class="s-baslik" tabindex="-1">' + esc(T("t.s.baslik")) + "</h2>" +
      '<p class="s-seviye"><span class="s-rozet s-' + sv[1] + '">' + esc(sv[0]) + "</span> " + esc(T("t.s.aciklama")) + "</p>" +
      '<ul class="s-cevaplar" aria-label="' + esc(T("t.s.cevaplar")) + '">' + SORULAR.map(function (q, i) {
        return '<li><button type="button" class="s-cevap" data-soru="' + i + '" aria-label="' + esc(T("t.s.degistir", { e: qE(q.k), v: etiket(q.k, cevap[q.k]) })) + '"><small>' + esc(qE(q.k)) + "</small><span>" + esc(etiket(q.k, cevap[q.k])) + "</span>" + ikon("kalem", "s-kalem") + "</button></li>";
      }).join("") + "</ul></div></header>" +
      '<p class="s-not" role="note">' + ikon("uyari") + "<span><b>" + esc(T("t.s.etiket")) + ".</b> " + esc(T("t.s.not")) + "</span></p>" +

      '<section class="s-bolum" aria-labelledby="s-b1"><span class="t-etiket">' + esc(T("t.s.b1")) + '</span><h3 id="s-b1" class="s-alt-baslik">' + esc(T("t.s.b1b", { n: oner.length })) + "</h3>" +
      '<div class="s-kartlar s-k' + oner.length + '">' + oner.map(kartHTML).join("") + "</div></section>" +

      '<section class="s-bolum" aria-labelledby="s-b2"><span class="t-etiket">' + esc(T("t.s.b2")) + '</span><h3 id="s-b2" class="s-alt-baslik">' + esc(T("t.s.b2b")) + "</h3>" +
      karsilastirmaHTML() + "</section>" +

      '<section class="s-bolum" aria-labelledby="s-b3"><span class="t-etiket">' + esc(T("t.s.b3")) + '</span><h3 id="s-b3" class="s-alt-baslik">' + esc(T("t.s.b3b")) + "</h3>" +
      '<div class="s-sekme" role="tablist" aria-label="' + esc(T("t.s.sekmeAria")) + '">' + SIRA.map(function (k) {
        var on = k === secili;
        return '<button type="button" role="tab" class="s-sekme-d' + (on ? " on" : "") + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" aria-controls="s-harita" data-prog="' + k + '">' + esc(P(k, "kisa")) + "</button>";
      }).join("") + "</div>" +
      '<div id="s-harita" class="s-harita" role="tabpanel"></div></section>' +

      '<div class="s-eylem">' +
      '<button type="button" class="t-dug t-dug-ana" data-is="danis">' + ikon("tel") + "<span>" + esc(T("t.s.danis")) + "</span></button>" +
      '<button type="button" class="t-dug t-dug-cizgi" data-is="yazdir">' + ikon("yazici") + "<span>" + esc(T("t.s.yazdir")) + "</span></button>" +
      '<button type="button" class="t-dug t-dug-ince" data-is="tekrar">' + ikon("tekrar") + "<span>" + esc(T("t.s.tekrar")) + "</span></button></div>" +
      "</div>";
    if (!K.sonuc.__bagli) { K.sonuc.addEventListener("click", sonucTik); K.sonuc.addEventListener("change", sonucDegis); K.sonuc.addEventListener("keydown", sonucTus); K.sonuc.__bagli = true; }
    haritaCiz();
    goster(K.sonuc, true);
    formKur();
    if (!sessiz) { kaydir(K.sonuc); odak($(".s-baslik", K.sonuc)); }
    gostergeOynat(sessiz);
  }
  function gostergeOynat(hemen) {
    var n = Math.round(genel / 100 * NSEG), seg = $$(".s-seg", K.sonuc), sayi = $(".s-g-sayi", K.sonuc), ibre = $(".s-ibre", K.sonuc);
    var ac = function () {
      seg.forEach(function (s, i) { if (i < n) s.classList.add("on"); });
      ibre.style.transform = "rotate(" + (genel / 100 * 360).toFixed(1) + "deg)";
      $$(".s-kart-cubuk i", K.sonuc).forEach(function (i) { i.style.transform = "scaleX(" + (+i.getAttribute("data-p") / 100) + ")"; });
    };
    if (hemen || AZ) { ac(); sayi.textContent = genel; return; }
    requestAnimationFrame(function () { requestAnimationFrame(ac); });
    var t0 = null, sure = n * 22 + 300;
    function kare(t) {
      if (!t0) t0 = t; var x = Math.min(1, (t - t0) / sure), e = 1 - Math.pow(1 - x, 3);
      sayi.textContent = Math.round(genel * e);
      if (x < 1) requestAnimationFrame(kare);
    }
    requestAnimationFrame(kare);
  }
  function kartHTML(x, i) {
    var k = x.kod;
    return '<article class="s-kart' + (i === 0 ? " s-bir" : "") + '" style="--g:' + (i * 120) + 'ms">' +
      '<div class="s-kart-ust"><span class="s-sira">' + (i + 1) + '</span><div><span class="t-etiket">' + (i === 0 ? esc(T("t.s.enUygun")) + " · " : x.puan < 50 ? esc(T("t.s.alternatif")) + " · " : "") + esc(P(k, "ulke")) + "</span>" +
      "<h4>" + esc(P(k, "ad")) + '</h4><p class="s-etk">' + esc(P(k, "etk")) + "</p></div></div>" +
      '<div class="s-kart-puan"><span>' + esc(T("t.s.uyum")) + '</span><span class="s-kart-cubuk" role="img" aria-label="' + esc(T("t.s.uyumAria", { n: x.puan })) + '"><i data-p="' + x.puan + '"></i></span><b>' + x.puan + "</b></div>" +
      '<p class="s-k-bas">' + esc(T("t.s.neden")) + '</p><ul class="s-neden">' + x.neden.map(function (n) { return "<li>" + ikon("tik") + "<span>" + esc(n) + "</span></li>"; }).join("") + "</ul>" +
      (x.dikkat.length ? '<p class="s-k-bas">' + esc(T("t.s.dikkat")) + '</p><ul class="s-dikkat">' + x.dikkat.map(function (n) { return "<li>" + ikon("uyari") + "<span>" + esc(n) + "</span></li>"; }).join("") + "</ul>" : "") +
      '<p class="s-ek">' + esc(P(k, "ek")) + "</p>" +
      '<button type="button" class="t-dug t-dug-cizgi s-kart-d" data-prog="' + k + '"><span>' + esc(T("t.s.haritaGoster")) + "</span>" + ikon("ok") + "</button></article>";
  }
  function karsilastirmaHTML() {
    var satir = [["surec", "t.s.kSurec"], ["dil", "t.s.kDil"], ["aile", "t.s.kAile"], ["sart", "t.s.kSart"]];
    var ok = oner.map(function (x) { return x.kod; }), on = function (k) { return ok.indexOf(k) > -1; };
    var hucre = function (k, a) { return a === "surec" ? surecRozet(k) : esc(P(k, a)) + (k === "bluecard" && a === "dil" ? '<sup class="s-kaynak-isaret">*</sup>' : ""); };
    var tablo = '<div class="s-tablo-sar"><table class="s-tablo"><caption class="t-gizli">' + esc(T("t.s.tabloCap")) + '</caption><thead><tr><th scope="col">' + esc(T("t.s.olcut")) + "</th>" +
      SIRA.map(function (k) { return '<th scope="col" class="' + (on(k) ? "s-onerilen" : "") + '">' + esc(P(k, "kisa")) + (on(k) ? "<small>" + esc(T("t.s.sizeUygun")) + "</small>" : "") + "</th>"; }).join("") + "</tr></thead><tbody>" +
      satir.map(function (s) { return '<tr><th scope="row">' + esc(T(s[1])) + "</th>" + SIRA.map(function (k) { return '<td class="' + (on(k) ? "s-onerilen" : "") + '">' + hucre(k, s[0]) + "</td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div>";
    var kartlar = '<div class="s-kars-kartlar">' + SIRA.map(function (k) {
      return '<div class="s-kk' + (on(k) ? " s-onerilen" : "") + '"><h4>' + esc(P(k, "kisa")) + (on(k) ? " <small>" + esc(T("t.s.sizeUygun")) + "</small>" : "") + "</h4><dl>" +
        satir.map(function (s) { return "<dt>" + esc(T(s[1])) + "</dt><dd>" + hucre(k, s[0]) + "</dd>"; }).join("") + "</dl></div>";
    }).join("") + "</div>";
    return tablo + kartlar + '<p class="s-dipnot">' + esc(T("t.s.tabloDip")) + '</p><p class="s-dipnot s-kaynak">* ' + esc(T("t.s.kaynak")) + "</p>";
  }
  function surecRozet(k) {
    return '<span class="s-surec s-surec-' + SURECN[k] + '"><i></i><i></i><i></i><span>' + esc(P(k, "surec")) + "</span></span>";
  }
  function haritaCiz() {
    var Pd = PROG[secili], n = Pd.belge, d = belgeDurum[secili] || (belgeDurum[secili] = []);
    var hazir = 0; for (var j = 0; j < n; j++) if (d[j]) hazir++;
    var x = liste.filter(function (y) { return y.kod === secili; })[0];
    $("#s-harita", K.sonuc).innerHTML =
      '<div class="s-harita-bas"><h4>' + esc(P(secili, "ad")) + "</h4>" + '<span class="s-rozet">' + (x ? esc(T("t.s.uyumAria", { n: x.puan })) : esc(T("t.s.onerilmez"))) + "</span></div>" +
      '<div class="s-harita-ic">' +
      '<div><p class="s-k-bas">' + esc(T("t.s.zaman")) + '</p><ol class="s-zaman">' + Pd.adim.map(function (s, i) {
        return '<li style="--g:' + (i * 90) + 'ms"><span class="s-z-no">' + (i + 1) + "</span><div><b>" + esc(P(secili, "a" + (i + 1))) + "</b><p>" + esc(P(secili, "a" + (i + 1) + "d")) + '</p><span class="s-z-sure">' + esc(T("t.s.sure", { s: T("t.sure." + s) })) + "</span></div></li>";
      }).join("") + "</ol></div>" +
      '<div class="s-belgeler"><p class="s-k-bas">' + esc(T("t.s.belgeler")) + ' <span class="s-sayac" aria-live="polite">' + esc(T("t.s.hazir", { a: hazir, n: n })) + "</span></p>" +
      '<div class="s-belge-cubuk" aria-hidden="true"><i style="transform:scaleX(' + (hazir / n) + ')"></i></div>' +
      '<ul class="s-belge-liste">' + Array.apply(null, Array(n)).map(function (_, i) {
        var id = "s-b-" + secili + "-" + i;
        return '<li><input type="checkbox" id="' + id + '" data-belge="' + i + '"' + (d[i] ? " checked" : "") + '><label for="' + id + '"><span class="s-kutu" aria-hidden="true">' + ikon("tik") + "</span><span>" + esc(P(secili, "b" + (i + 1))) + "</span></label></li>";
      }).join("") + "</ul>" +
      '<p class="s-dipnot">' + esc(T("t.s.belgeDip")) + "</p></div></div>";
  }
  function sonucTik(e) {
    var b = e.target.closest("button"); if (!b || !K.sonuc.contains(b)) return;
    var p = b.getAttribute("data-prog");
    if (p) { programSec(p, b.classList.contains("s-kart-d")); return; }
    var s = b.getAttribute("data-soru");
    if (s != null) { formOku(); testBaslat(true, +s); return; }
    var is = b.getAttribute("data-is");
    if (is === "yazdir") yazdir();
    else if (is === "tekrar") testBaslat(false, 0);
    else if (is === "danis") { kaydir(K.form); var a = $("#f-ad", K.form); if (a) setTimeout(function () { odak(a); }, AZ ? 0 : 500); }
  }
  function programSec(p, kaydirsin) {
    secili = p;
    $$(".s-sekme-d", K.sonuc).forEach(function (t) { var on = t.getAttribute("data-prog") === p; t.classList.toggle("on", on); t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    haritaCiz();
    if (kaydirsin) { kaydir($(".s-sekme", K.sonuc)); odak($(".s-sekme-d.on", K.sonuc)); }
  }
  function sonucTus(e) {
    var t = e.target; if (!t.classList || !t.classList.contains("s-sekme-d")) return;
    var d = $$(".s-sekme-d", K.sonuc), i = d.indexOf(t), n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % d.length; else if (e.key === "ArrowLeft") n = (i - 1 + d.length) % d.length;
    else if (e.key === "Home") n = 0; else if (e.key === "End") n = d.length - 1;
    if (n > -1) { e.preventDefault(); programSec(d[n].getAttribute("data-prog")); $$(".s-sekme-d", K.sonuc)[n].focus(); }
  }
  function sonucDegis(e) {
    var c = e.target; if (!c.hasAttribute || !c.hasAttribute("data-belge")) return;
    belgeDurum[secili][+c.getAttribute("data-belge")] = c.checked;
    var n = PROG[secili].belge, hazir = 0; for (var j = 0; j < n; j++) if (belgeDurum[secili][j]) hazir++;
    $(".s-sayac", K.sonuc).textContent = T("t.s.hazir", { a: hazir, n: n });
    $(".s-belge-cubuk i", K.sonuc).style.transform = "scaleX(" + (hazir / n) + ")";
  }

  /* ---------- YAZDIR / PDF ---------- */
  function yazdir() {
    var eski = $(".yh-yazdir"); if (eski) eski.parentNode.removeChild(eski);
    var n = PROG[secili].belge, d = belgeDurum[secili] || [], hazir = 0; for (var j = 0; j < n; j++) if (d[j]) hazir++;
    var tarih = new Intl.DateTimeFormat(yerel(), { day: "numeric", month: "long", year: "numeric" }).format(new Date());
    var k = document.createElement("div"); k.className = "yh-yazdir"; k.setAttribute("aria-hidden", "true"); k.lang = dil();
    k.innerHTML =
      '<div class="yh-bas"><img src="img/logo-400.png" alt="Altera Global"><div><b>Altera Global</b><span>' + esc(T("t.y.baslik")) + " · " + esc(tarih) + "</span></div></div>" +
      '<p class="yh-not"><b>' + esc(T("t.s.onRozet")) + ".</b> " + esc(T("t.s.not")) + "</p>" +
      "<h1>" + esc(T("t.y.baslik")) + "</h1>" +
      '<div class="yh-iki"><div><h2>' + esc(T("t.s.cevaplar")) + "</h2><table>" + SORULAR.map(function (q) { return "<tr><th>" + esc(qE(q.k)) + "</th><td>" + esc(etiket(q.k, cevap[q.k])) + "</td></tr>"; }).join("") + "</table></div>" +
      '<div class="yh-puan"><h2>' + esc(T("t.y.genel")) + "</h2><b>" + genel + "</b><span>/ 100 · " + esc(seviyeYazi(genel)[0]) + "</span></div></div>" +
      "<h2>" + esc(T("t.y.oneri")) + "</h2>" + oner.map(function (x, i) {
        return '<div class="yh-prog"><h3>' + (i + 1) + ". " + esc(P(x.kod, "ad")) + " <small>" + esc(T("t.s.uyumAria", { n: x.puan })) + "</small></h3><p>" + esc(P(x.kod, "etk")) + "</p><ul>" +
          x.neden.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + x.dikkat.map(function (m) { return "<li>" + esc(T("t.y.dikkat")) + ": " + esc(m) + "</li>"; }).join("") + "</ul><p><i>" + esc(P(x.kod, "ek")) + "</i></p></div>";
      }).join("") +
      "<h2>" + esc(T("t.y.adimlar", { p: P(secili, "ad") })) + "</h2><ol>" + PROG[secili].adim.map(function (s, i) { return "<li><b>" + esc(P(secili, "a" + (i + 1))) + "</b> · " + esc(P(secili, "a" + (i + 1) + "d")) + " (" + esc(T("t.s.sure", { s: T("t.sure." + s) })) + ")</li>"; }).join("") + "</ol>" +
      "<h2>" + esc(T("t.y.belge", { a: hazir, n: n })) + '</h2><ul class="yh-belge">' + Array.apply(null, Array(n)).map(function (_, i) { return '<li><span class="yh-k">' + (d[i] ? "&#10003;" : "") + "</span>" + esc(P(secili, "b" + (i + 1))) + "</li>"; }).join("") + "</ul>" +
      '<p class="yh-son">' + esc(T("t.s.kaynak")) + "<br>" + esc(T("t.y.son")) + "</p>";
    document.body.appendChild(k);
    document.documentElement.classList.add("yh-baski");
    var bitir = function () { document.documentElement.classList.remove("yh-baski"); window.removeEventListener("afterprint", bitir); };
    window.addEventListener("afterprint", bitir);
    var img = $("img", k), bas = function () { try { window.print(); } catch (e) { } setTimeout(bitir, 1000); };
    if (img.complete) bas(); else img.onload = img.onerror = bas;
  }

  /* =====================================================================
     FORM
     ===================================================================== */
  var SAATLER = [["sabah", "09–12"], ["ogle", "12–15"], ["ikindi", "15–18"], ["aksam", "18–21"]];
  function saatYazi(v) { var s = SAATLER.filter(function (x) { return x[0] === v; })[0] || SAATLER[3]; return T("t.f." + s[0]) + " (" + s[1] + ")"; }
  function formOku() {
    if (!K.form || gonderildi || !$(".f-form", K.form)) return;
    formDurum = { ad: $("#f-ad", K.form).value, tel: $("#f-tel", K.form).value, saat: ($('input[name="saat"]:checked', K.form) || {}).value, kvkk: $("#f-kvkk", K.form).checked, metin: !$("#f-kvkk-metin", K.form).hidden };
  }
  function formKur() {
    K.form.classList.add("t-kok", "f-kok");
    var en = oner[0];
    var sol = '<div class="f-sol"><span class="t-etiket">' + esc(T("t.f.etiket")) + '</span><h2 class="f-baslik">' + esc(T("t.f.baslik")) + "</h2>" +
      "<p>" + esc(T("t.f.metin", { p: P(en.kod, "kisa") })) + "</p>" +
      '<ul class="f-arti"><li>' + ikon("onay") + "<span>" + esc(T("t.f.a1")) + "</span></li><li>" + ikon("onay") + "<span>" + esc(T("t.f.a2")) + "</span></li><li>" + ikon("kilit") + "<span>" + esc(T("t.f.a3")) + "</span></li></ul>" +
      '<p class="f-not">' + esc(T("t.f.not")) + "</p></div>";
    if (gonderildi) { K.form.innerHTML = '<div class="f-ic">' + sol + basariHTML() + "</div>"; basariBagla(true); goster(K.form, true); return; }
    var fd = formDurum || {};
    K.form.innerHTML = '<div class="f-ic">' + sol +
      '<form class="f-form" novalidate>' +
      '<div class="f-alan"><label for="f-ad">' + esc(T("t.f.ad")) + '</label><input id="f-ad" name="ad" autocomplete="name" placeholder="' + esc(T("t.f.adPh")) + '" required aria-describedby="f-ad-h"><p class="f-hata" id="f-ad-h" aria-live="polite"></p></div>' +
      '<div class="f-alan"><label for="f-tel">' + esc(T("t.f.tel")) + '</label><div class="f-tel"><span aria-hidden="true">' + ikon("tel") + '</span><input id="f-tel" name="tel" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="05xx xxx xx xx" maxlength="14" required aria-describedby="f-tel-h"></div><p class="f-hata" id="f-tel-h" aria-live="polite"></p></div>' +
      '<fieldset class="f-alan f-saat"><legend>' + esc(T("t.f.saat")) + '</legend><div class="f-saatler">' + SAATLER.map(function (s) {
        var on = (fd.saat || "aksam") === s[0];
        return '<label><input type="radio" name="saat" value="' + s[0] + '"' + (on ? " checked" : "") + "><span><b>" + esc(T("t.f." + s[0])) + "</b><small>" + s[1] + "</small></span></label>";
      }).join("") + "</div></fieldset>" +
      '<div class="f-alan f-kvkk"><div class="f-onay"><input type="checkbox" id="f-kvkk" required aria-describedby="f-kvkk-h"' + (fd.kvkk ? " checked" : "") + '><label for="f-kvkk" class="s-kutu" aria-hidden="true">' + ikon("tik") + "</label>" +
      '<span class="f-onay-yazi">' + (T("t.f.kvkkOn") ? '<label for="f-kvkk">' + esc(T("t.f.kvkkOn")) + "</label>" : "") + '<button type="button" class="f-link" data-is="kvkk" aria-expanded="' + !!fd.metin + '" aria-controls="f-kvkk-metin">' + esc(T("t.f.kvkkLink")) + '</button><label for="f-kvkk">' + esc(T("t.f.kvkk")) + "</label></span></div>" +
      '<div id="f-kvkk-metin" class="f-kvkk-metin"' + (fd.metin ? "" : " hidden") + "><b>" + esc(T("t.f.kvkkBas")) + "</b><p>" + esc(T("t.f.kvkkMetin")) + "</p></div>" +
      '<p class="f-hata" id="f-kvkk-h" aria-live="polite"></p></div>' +
      '<button type="submit" class="t-dug t-dug-ana f-gonder"><span>' + esc(T("t.f.gonder")) + "</span>" + ikon("ok") + "</button>" +
      '<p class="f-alt">' + esc(T("t.f.demo")) + "</p></form></div>";
    var f = $(".f-form", K.form), tel = $("#f-tel", K.form), ad = $("#f-ad", K.form);
    ad.value = fd.ad || ""; tel.value = fd.tel || "";
    tel.addEventListener("input", function () { var p = tel.selectionStart === tel.value.length; tel.value = telBicim(tel.value); if (p) tel.setSelectionRange(tel.value.length, tel.value.length); if (tel.getAttribute("aria-invalid")) dogrula(true); });
    ad.addEventListener("input", function () { if (ad.getAttribute("aria-invalid")) dogrula(true); });
    $("#f-kvkk", K.form).addEventListener("change", function () { dogrula(true); });
    f.addEventListener("submit", gonder);
    $('[data-is="kvkk"]', K.form).addEventListener("click", function (e) {
      e.preventDefault(); var m = $("#f-kvkk-metin", K.form); m.hidden = !m.hidden; this.setAttribute("aria-expanded", !m.hidden);
    });
    goster(K.form, true);
  }
  function telBicim(v) {
    var d = v.replace(/\D/g, "");
    if (d.indexOf("90") === 0 && d.length > 11) d = d.slice(2);
    if (d && d.charAt(0) !== "0") d = "0" + d;
    d = d.slice(0, 11);
    return [d.slice(0, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean).join(" ");
  }
  function hata(id, m, el) {
    $("#" + id, K.form).textContent = m;
    if (el) { if (m) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); }
  }
  function dogrula(sessiz) {
    var ad = $("#f-ad", K.form), tel = $("#f-tel", K.form), kv = $("#f-kvkk", K.form), ilk = null;
    var a = ad.value.trim().replace(/\s+/g, " "), t = tel.value.replace(/\D/g, "");
    var adOk = a.length >= 3 && /\s/.test(a) && /^[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛûÄäËëÉéÈèÁáÀàÑñ' .-]+$/.test(a);
    var telOk = /^05\d{9}$/.test(t);
    if (!sessiz || ad.getAttribute("aria-invalid")) hata("f-ad-h", adOk ? "" : T("t.f.hAd"), ad);
    if (!sessiz || tel.getAttribute("aria-invalid")) hata("f-tel-h", telOk ? "" : T("t.f.hTel"), tel);
    if (!sessiz || $("#f-kvkk-h", K.form).textContent) hata("f-kvkk-h", kv.checked ? "" : T("t.f.hKvkk"), kv);
    if (!adOk) ilk = ad; else if (!telOk) ilk = tel; else if (!kv.checked) ilk = kv;
    return { ok: adOk && telOk && kv.checked, ilk: ilk, ad: a, tel: t };
  }
  function basariHTML() {
    var g = gonderildi;
    var progs = oner.map(function (p) { return P(p.kod, "kisa") + " (" + p.puan + ")"; }).join(", ");
    var mesaj = T("t.f.waMetin", { ad: g.ad, g: genel, p: progs, a: etiket("amac", cevap.amac), b: etiket("bolge", cevap.bolge), r: etiket("ret", cevap.ret), s: saatYazi(g.saat) });
    var wa = "https://wa.me/" + WA_NO + "?text=" + encodeURIComponent(mesaj);
    return '<div class="f-basari" role="status" tabindex="-1">' +
      '<svg class="f-tik" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28"/><path d="M20 33l8 8 16-17"/></svg>' +
      "<h3>" + esc(T("t.f.tesekkur", { ad: g.ad.split(" ")[0] })) + '</h3><p class="f-buyuk">' + esc(T("t.f.arayacak")) + "</p>" +
      "<p>" + T("t.f.saatSecim", { s: esc(saatYazi(g.saat)) }) + "</p>" +
      '<div class="f-basari-d"><a class="t-dug t-dug-wa" href="' + esc(wa) + '" target="_blank" rel="noopener">' + ikon("sohbet") + "<span>" + esc(T("t.f.wa")) + "</span></a>" +
      '<button type="button" class="t-dug t-dug-cizgi" data-is="panele">' + ikon("panel") + "<span>" + esc(T("t.f.panel")) + "</span></button></div>" +
      '<p class="f-not">' + esc(T("t.f.not")) + "</p></div>";
  }
  function basariBagla(sessiz) {
    var pb = $('[data-is="panele"]', K.form);
    pb.addEventListener("click", function () { var t = $('[data-sekme="panel"]'); if (t) t.click(); });
    if (sessiz) K.form.classList.add("f-hemen"); else { K.form.classList.remove("f-hemen"); odak($(".f-basari", K.form)); }
  }
  function gonder(e) {
    e.preventDefault();
    var s = dogrula(false);
    if (!s.ok) { odak(s.ilk); var f = $(".f-form", K.form); f.classList.remove("f-salla"); void f.offsetWidth; f.classList.add("f-salla"); return; }
    var saatV = ($('input[name="saat"]:checked', K.form) || {}).value || "aksam";
    var progs = oner.map(function (x) { return { kod: x.kod, ad: P(x.kod, "ad"), puan: x.puan }; });
    var telG = s.tel.replace(/^(\d{4})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4");
    var ceva = {}; SORULAR.forEach(function (q) { ceva[q.k] = cevap[q.k]; });
    try { window.dispatchEvent(new CustomEvent("altera:basvuru", { detail: { ad: s.ad, tel: telG, cevaplar: ceva, puan: genel, programlar: progs } })); } catch (er) { }
    gonderildi = { ad: s.ad, saat: saatV };
    var tmp = document.createElement("div"); tmp.innerHTML = basariHTML();
    var f2 = $(".f-form", K.form); f2.parentNode.replaceChild(tmp.firstChild, f2);
    basariBagla(false);
  }

  /* =====================================================================
     DİL DEĞİŞİMİ · durumu koruyarak yeniden çiz
     ===================================================================== */
  function dilDegisti() {
    sozlukEkle();
    if (!K.test) return;
    if (K.sahne) {
      iskeletMetin();
      if (analizde) analizCiz();
      else if (!K.test.hidden && $(".t-slayt", K.sahne)) { clearTimeout(ilerleZaman); gecisSuruyor = false; K.sahne.innerHTML = ""; soruAc(adim, 0); }
    }
    if (liste.length) { formOku(); if (!K.sonuc.hidden) sonucKur(true); }
    var y = $(".yh-yazdir"); if (y) y.parentNode.removeChild(y);
  }

  /* ---------- Başlat ---------- */
  function kur() {
    if (!kokleriBul()) return;
    sozlukEkle();
    [K.test, K.sonuc, K.form].forEach(function (el) { if (!el.children.length) el.hidden = true; });
    window.addEventListener("altera:test-basla", function () { testBaslat(false, 0); });
    window.addEventListener("altera:dil", dilDegisti);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();
  window.AlteraTest = { hesapla: hesapla, TABLO: TABLO }; /* inceleme / test için */
})();
