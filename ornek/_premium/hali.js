// Halı yıkama premium modülü (ARGE-007, 14 Eki 2026; AKTARIM-SABLON: fiyat/süre/ücretsiz vaatleri kaldırıldı): ölçü + leke listesi (ölçü, koltuk, perde, leke) · alım randevusu · teslim takibi
(function () {
  var E = window.ESNAF;
  // [ad, ek gün, işlem, fotoğraf]
  var LEKE = [["Kahve / çay", 0, "Tanen lekesi için ön işlem: ılık enzimli çözelti, ardından durulama.", "t_kahve"], ["Kırmızı şarap / meyve suyu", 1, "Renk lekesi: oksijenli leke sökücü, liflere göre bekletme süresi.", "t_sarap"],
    ["Evcil hayvan (idrar / koku)", 1, "Enzimli koku giderici + derin durulama; koku kaynağı tabana kadar temizlenir.", "t_evcil"], ["Yağ / yemek", 0, "Yağ çözücü ön işlem, sıcak durulama.", "t_yikama"],
    ["Küf / rutubet kokusu", 1, "Anti-bakteriyel yıkama ve kurutma odasında tam kuruma.", "t_kurutma"], ["Mürekkep / boya", 1, "Solvent bazlı noktasal işlem; kalıcı olabilir, önce küçük alanda denenir.", "t_yikama"]];
  var TUR = [["Makine halısı", 1], ["El dokuma / yün", 1.6], ["İpek / viskon (hassas)", 2.2], ["Shaggy / uzun tüylü", 1.3]];
  function hesap(k) {
    var q = function (s) { return E.q(k, s); }, leke = {};
    function satirEkle(en, boy, tur) {
      var d = document.createElement("div"); d.className = "satir";
      d.innerHTML = '<div><label class="e">Tür</label><select class="h-tur">' + TUR.map(function (t, i) { return "<option value=\"" + i + "\"" + (i === (tur || 0) ? " selected" : "") + ">" + t[0] + "</option>"; }).join("") + '</select></div><div><label class="e">En (m)</label><input class="h-en" inputmode="decimal" value="' + en + '"></div><div><label class="e">Boy (m)</label><input class="h-boy" inputmode="decimal" value="' + boy + '"></div><button type="button" class="sil" aria-label="Satırı sil">×</button>';
      d.querySelector(".sil").onclick = function () { d.remove(); hes(); };
      d.querySelectorAll("input,select").forEach(function (e) { e.oninput = e.onchange = hes; });
      q(".h-satirlar").appendChild(d);
    }
    q(".h-leke").innerHTML = LEKE.map(function (l, i) { return '<button type="button" class="cip" data-i="' + i + '">' + l[0] + "</button>"; }).join("");
    k.querySelectorAll(".h-leke .cip").forEach(function (c) { c.onclick = function () { var i = c.dataset.i; if (leke[i]) delete leke[i]; else leke[i] = 1; c.classList.toggle("on", !!leke[i]); hes(); }; });
    var sayi = function (s) { return Math.max(0, parseFloat(String(s).replace(",", ".")) || 0); };
    function hes() {
      var toplamM2 = 0, hassas = false, satirlar = [];
      k.querySelectorAll(".satir").forEach(function (s) {
        var t = +s.querySelector(".h-tur").value, a = sayi(s.querySelector(".h-en").value) * sayi(s.querySelector(".h-boy").value);
        if (!a) return; toplamM2 += a; if (t >= 1) hassas = true; satirlar.push(TUR[t][0] + " " + a.toFixed(1).replace(".", ",") + " m²");
      });
      var koltuk = Math.floor(sayi(q(".h-koltuk").value)), perde = sayi(q(".h-perde").value);
      var L = Object.keys(leke).map(function (i) { return LEKE[i]; });
      if (!toplamM2 && !koltuk && !perde) { q(".h-sonuc").innerHTML = '<span class="not" style="margin:0">Bir halı ölçüsü, koltuk ya da perde girin.</span>'; return; }
      q(".h-sonuc").innerHTML = '<div class="buyuk">' + toplamM2.toFixed(1).replace(".", ",") + ' m²</div><p style="margin-top:6px"><b>' + satirlar.length + " halı</b>" + (koltuk ? " · " + koltuk + " oturak koltuk" : "") + (perde ? " · " + perde + " m perde" : "") + "</p>" + (hassas ? "<p>El dokuma, ipek ve uzun tüylü halılar türüne uygun, hassas programla yıkanır.</p>" : "") + (L.length ? '<ul class="plan" style="margin-top:8px">' + L.map(function (l) { return "<li><span><b style=\"min-width:0\">" + l[0] + ":</b> " + l[2] + "</span></li>"; }).join("") + "</ul>" : "") + '<p class="not">Fiyat ve teslim süresi halı görüldükten sonra işletme tarafından bildirilir. Keşif ve fiyat için arayın ya da listeyi gönderin.</p>';
      var f = L.length ? L[L.length - 1] : null;
      E.fotoDegis(q(".h-foto"), "../img/" + (f ? f[3] : koltuk && !toplamM2 ? "t_koltuk" : perde && !toplamM2 ? "t_perde" : "t_yikama") + ".jpg", f ? f[0] : "Halı yıkama");
      q(".h-alt").textContent = f ? "Leke işlemi: " + f[0].toLocaleLowerCase("tr") : "Her halı türüne uygun program ve kurutma odası";
      k._ozet = { satirlar: satirlar, koltuk: koltuk, perde: perde, leke: L.map(function (l) { return l[0]; }) };
    }
    satirEkle("2", "3", 0); satirEkle("1,6", "2,3", 1);
    q(".h-ekle").onclick = function () { satirEkle("", "", 0); };
    ["h-koltuk", "h-perde"].forEach(function (c) { q("." + c).oninput = hes; });
    hes();
    q(".h-gonder").onclick = function () {
      var o = k._ozet || {};
      waAc("Merhaba, halı/koltuk yıkama için fiyat ve alım bilgisi istiyorum.\n" + (o.satirlar || []).join("\n") + (o.koltuk ? "\nKoltuk: " + o.koltuk + " oturak" : "") + (o.perde ? "\nPerde: " + o.perde + " m" : "") + (o.leke && o.leke.length ? "\nLeke: " + o.leke.join(", ") : "") + "\nAdresim: ");
    };
  }
  // Teslim takibi: örnek fiş aşamaları
  var ASAMA = [["Teslim alındı", "Halılarınız ölçüldü, fişe işlendi."], ["Ön işlem", "Toz alma ve leke ön işlemi."], ["Yıkama", "Türe uygun program."], ["Kurutma", "Kurutma odasında, nem ölçülerek."], ["Paketleme", "Kokulu, naylon ambalaj."], ["Dağıtımda", "Servis aracı yolda."], ["Teslim edildi", "Afiyetle kullanın."]];
  function takip(k) {
    var q = function (s) { return E.q(k, s); };
    function goster() {
      var fis = q(".tk-fis").value.trim().toUpperCase(), n = fis.replace(/\D/g, "");
      if (!n) { q(".tk-liste").innerHTML = '<li class="bekler"><span>Fiş numarasını yazın.</span></li>'; return; }
      var simdi = (+n.slice(-2) % 5) + 1, b = new Date();
      q(".tk-liste").innerHTML = ASAMA.map(function (a, i) {
        var d = new Date(b); d.setHours(9 + i); var dur = i < simdi ? "tamam" : i === simdi ? "simdi" : "bekler";
        return '<li class="' + dur + '"><i>' + (i < simdi ? "✓" : i + 1) + "</i><span><b>" + a[0] + "</b>" + (dur !== "bekler" ? " · " + a[1] : "") + (i < simdi ? '<br><small class="not">' + d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + "</small>" : "") + "</span></li>";
      }).join("");
    }
    q(".tk-bak").onclick = goster; q(".tk-fis").onkeydown = function (e) { if (e.key === "Enter") goster(); }; goster();
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".hesap").forEach(hesap); document.querySelectorAll(".takip").forEach(takip);
    document.querySelectorAll(".rv").forEach(function (k) { E.randevu(k, ["Halı alımı", "Koltuk yıkama (yerinde)", "Perde alımı", "Yorgan / battaniye alımı", "Teslimat saati değişikliği"], [["Adres", ".rv-adres"], ["Parça", ".rv-parca"]]); });
  });
})();
