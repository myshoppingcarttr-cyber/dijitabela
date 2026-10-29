/* ============================================================
   PATRON ONAYI BEKLİYOR — Dijitabela ücretleri henüz onaylanmadı (araştırılıyor, değişecek).
   Sunumdaki "Dijitabela'nın işi" bölümü rakamları YALNIZ buradan okur.
   gizli   : true → hiçbir rakam görünmez; "Ücret ve çalışma modeli görüşmede konuşulacak" yazar.
   kurulum : tek seferlik kurulum (TL, KDV hariç) · null → kart gizlenir
   aylik   : aylık sabit büyüme yönetimi (TL, KDV hariç) · null → kart gizlenir
   prim    : ciro artışı primi METNİ (ör. "Ciro artışının %3'ü") · null → kart gizlenir
   Örnek açık hali: { gizli:false, kurulum:<TL>, aylik:<TL>, prim:"Ciro artışının %_ kadarı" }
   Not: gizliyken rakamlar da null tutulur; sayfa kaynağı herkese açık olduğu için onaysız rakam burada durmasın.
   ============================================================ */
window.FIYAT = { gizli: true, kurulum: null, aylik: null, prim: null };
