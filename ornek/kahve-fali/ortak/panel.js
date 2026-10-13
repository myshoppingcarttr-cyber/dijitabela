/* Fincan Falı - falcı paneli ve yönetici paneli (demo). Veri: fal.js ile aynı localStorage. Gerçek kurulumda şifreli giriş + sunucu. */
(function () {
  "use strict";
  var F = window.FAL, S, Q = function (s, r) { return (r || document).querySelector(s); }, QA = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); }, esc;
  function basla() {
    F = window.FAL; if (!F) return setTimeout(basla, 30); S = F.S; esc = F.esc;
    var kok = Q("#panel-kok"), giris = Q("#panel-giris");
    var sek0 = "falci";
    function oturum() { try { return sessionStorage.getItem("fc-panel") === "1"; } catch (e) { return window.__fcp; } }
    function ac() { giris.hidden = true; kok.hidden = false; ciz(); }
    Q("#giris-form").addEventListener("submit", function (e) {
      e.preventDefault(); var u = Q("#gk").value.trim(), p = Q("#gs").value;
      if (u === "demo" && p === "demo") { try { sessionStorage.setItem("fc-panel", "1"); } catch (x) { window.__fcp = true; } ac(); }
      else Q("#giris-h").textContent = "Kullanıcı adı ya da şifre hatalı (demo: demo / demo).";
    });
    if (/[?&]yon=1/.test(location.search)) sek0 = "yonetici";
    var sek = sek0, secF = (S.falcilar[0] || {}).id, goster = "bekleyen";
    if (oturum() || /[?&]giris=1/.test(location.search)) ac();
    function ciz() {
      kok.innerHTML = '<div class="fc-sek"><button type="button" data-s="falci" class="' + (sek === "falci" ? "sec" : "") + '">Falcı paneli</button><button type="button" data-s="yonetici" class="' + (sek === "yonetici" ? "sec" : "") + '">Yönetici paneli</button><button type="button" class="fc-btn alt kucuk" data-cik style="margin-left:auto">Çıkış</button></div><div id="icerik"></div>';
      QA("[data-s]", kok).forEach(function (b) { b.onclick = function () { sek = b.getAttribute("data-s"); ciz(); }; });
      Q("[data-cik]", kok).onclick = function () { try { sessionStorage.removeItem("fc-panel"); } catch (x) {} window.__fcp = false; location.reload(); };
      sek === "falci" ? falciPanel(Q("#icerik")) : yonetici(Q("#icerik"));
    }
    function adT(f) { return (S.turler[f.tur] || {}).ad || f.tur; }
    function falciPanel(h) {
      var fc = F.falci(secF) || S.falcilar[0]; secF = fc.id;
      var hepsi = S.fallar.filter(function (f) { return f.falciId === fc.id; }).slice().reverse();
      var bek = hepsi.filter(function (f) { return f.kaynak !== "falci"; }), bit = hepsi.filter(function (f) { return f.kaynak === "falci"; });
      var liste = goster === "bekleyen" ? bek : bit;
      h.innerHTML = '<div class="fc-kart" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">' + F.avatar(fc) + '<div style="flex:1;min-width:200px"><label class="fc-et" style="margin:0 0 4px">Falcı (demo kimliği)</label><select class="fc-in" id="fsec">' + S.falcilar.map(function (f) { return '<option value="' + f.id + '"' + (f.id === fc.id ? " selected" : "") + ">" + esc(f.ad) + (f.aktif ? "" : " (pasif)") + "</option>"; }).join("") + '</select></div><div><label class="fc-online' + (fc.online ? "" : " off") + '" style="cursor:pointer"><input type="checkbox" id="fonl"' + (fc.online ? " checked" : "") + '> Çevrimiçiyim</label></div></div>' +
        '<div class="fc-grid fc-g3" style="margin:14px 0"><div class="fc-kart"><small>Gelen / bekleyen</small><h3 style="margin:0">' + bek.length + '</h3></div><div class="fc-kart"><small>Yanıtladığım</small><h3 style="margin:0">' + bit.length + '</h3></div><div class="fc-kart"><small>Kullanıcı puan ortalaması</small><h3 style="margin:0">' + (function () { var p = hepsi.filter(function (f) { return f.puan; }); return p.length ? (p.reduce(function (a, f) { return a + f.puan; }, 0) / p.length).toFixed(1) : "-"; })() + "</h3></div></div>" +
        '<div class="fc-sek"><button type="button" data-g="bekleyen" class="' + (goster === "bekleyen" ? "sec" : "") + '">Gelen fallar (' + bek.length + ')</button><button type="button" data-g="bitti" class="' + (goster === "bitti" ? "sec" : "") + '">Yanıtlananlar (' + bit.length + ")</button></div>" +
        (liste.length ? liste.map(function (f) {
          return '<div class="fc-kuyruk" data-id="' + f.id + '"><b>' + esc(adT(f)) + "</b> · " + new Date(f.tarih).toLocaleString("tr-TR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }) + (f.kaynak === "otomatik" ? ' <span class="fc-chip">otomatik örnek yanıt gitti</span>' : "") + '<br><small style="color:var(--soluk)">Burç: ' + esc(f.burc || "-") + " · İlişki: " + esc(f.iliski || "-") + "</small>" +
            (f.not ? '<p style="margin:6px 0">Niyet: "' + esc(f.not) + '"</p>' : "") +
            '<div class="th">' + (f.foto || []).map(function (u) { return '<img alt="Gelen fotoğraf" src="' + esc(u) + '">'; }).join("") + (f.foto && f.foto.length ? "" : "<small>Fotoğraf gerekmeyen fal türü.</small>") + "</div>" +
            (goster === "bekleyen" ? '<textarea class="fc-in" placeholder="Yanıtınızı yazın…"></textarea><div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="fc-btn kucuk" type="button" data-y="' + f.id + '">Yanıtı gönder</button><button class="fc-btn alt kucuk" type="button" data-sb="' + f.id + '">Şablon yaz</button></div><div class="fc-hata" data-eh></div>' : (f.yanit || []).map(function (p) { return "<p style=\"margin:4px 0\">" + esc(p) + "</p>"; }).join("") + (f.puan ? '<p class="fc-ok">Kullanıcı puanı: ' + "★".repeat(f.puan) + (f.yorum ? " · " + esc(f.yorum) : "") + "</p>" : "")) + "</div>";
        }).join("") : '<div class="fc-kart fc-bos">' + (goster === "bekleyen" ? "Kuyrukta fal yok. Kullanıcı tarafından bir fal gönderin (aynı tarayıcıda)." : "Henüz yanıtlanan fal yok.") + "</div>");
      Q("#fsec", h).onchange = function () { secF = this.value; ciz(); };
      Q("#fonl", h).onchange = function () { fc.online = this.checked; F.kaydet(); ciz(); };
      QA("[data-g]", h).forEach(function (b) { b.onclick = function () { goster = b.getAttribute("data-g"); ciz(); }; });
      QA("[data-sb]", h).forEach(function (b) { b.onclick = function () { var f = F.fal(b.getAttribute("data-sb")); Q("textarea", b.closest(".fc-kuyruk")).value = F.yorumUret(f).join("\n\n"); }; });
      QA("[data-y]", h).forEach(function (b) { b.onclick = function () {
        var f = F.fal(b.getAttribute("data-y")), kutu = b.closest(".fc-kuyruk"), t = Q("textarea", kutu).value.trim();
        if (t.length < 20) { Q("[data-eh]", kutu).textContent = "Yanıt en az 20 karakter olmalı."; return; }
        f.yanit = t.split(/\n{1,}/).filter(Boolean); f.kaynak = "falci"; f.durum = "hazir"; f.bildirildi = false; f.okundu = false; F.kaydet(); F.bildirimKontrol(); ciz();
        F.toast("Yanıt gönderildi", "Kullanıcının geçmişine düştü."); }; });
    }
    function yonetici(h) {
      var gn = [6, 9, 7, 12, 15, 21, 18], gun = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], mx = Math.max.apply(null, gn);
      var tak = {}; S.odemeler.forEach(function (o) { tak[o.taksit] = (tak[o.taksit] || 0) + 1; });
      h.innerHTML = '<div class="fc-uyari"><b>Demo giriş: demo / demo.</b> Gerçek kurulumda şifreli giriş (e-posta + tek kullanımlık kod) ve sunucu veritabanı kullanılır. Bu ekrandaki değişiklikler yalnızca bu tarayıcıda saklanır.</div>' +
        '<div class="fc-kart"><h3>Falcılar</h3><div class="fc-sar"><table class="fc-tablo"><tr><th>Falcı</th><th>Uzmanlık</th><th>Durum</th><th></th></tr>' + S.falcilar.map(function (f) { return "<tr><td>" + esc(f.ad) + "</td><td>" + esc(f.uz) + '</td><td><span class="fc-durum ' + (f.aktif ? "h" : "") + '">' + (f.aktif ? "Aktif" : "Pasif") + '</span></td><td><button class="fc-btn alt kucuk" type="button" data-ft="' + f.id + '">' + (f.aktif ? "Pasif yap" : "Aktif yap") + "</button></td></tr>"; }).join("") + '</table></div>' +
        '<h4 style="margin-top:18px">Falcı ekle</h4><form id="fekle" class="fc-grid fc-g3" novalidate><input class="fc-in" id="fe-ad" placeholder="Ad"><input class="fc-in" id="fe-uz" placeholder="Uzmanlık (örn. Kahve falı)"><select class="fc-in" id="fe-tur"><option value="kahve">Kahve falı</option><option value="tarot">Tarot</option><option value="el">El falı</option><option value="yildizname">Yıldızname</option></select><button class="fc-btn kucuk" type="submit">Ekle</button></form><div class="fc-hata" id="fe-h"></div></div>' +
        '<div class="fc-kart" style="margin-top:16px"><h3>Fal türleri ve fiyatlar</h3><p style="margin:0;color:var(--soluk)">Tekil fal ücreti boş bırakılır; sahibi kurulumda belirler. Jeton karşılığı fal başına düşen jetondur.</p><div class="fc-sar"><table class="fc-tablo"><tr><th>Tür</th><th>Jeton karşılığı</th><th>Tekil fal ücreti</th></tr>' + Object.keys(S.turler).map(function (k) { return "<tr><td>" + esc(S.turler[k].ad) + '</td><td><input class="fc-in" style="max-width:90px" type="number" min="1" max="20" data-tj="' + k + '" value="' + S.turler[k].jeton + '"></td><td><input class="fc-in" data-tf="' + k + '" placeholder="Siz belirlersiniz" value="' + esc(S.turler[k].fiyat) + '"></td></tr>'; }).join("") + "</table></div></div>" +
        '<div class="fc-kart" style="margin-top:16px"><h3>Jeton paketleri</h3><div class="fc-sar"><table class="fc-tablo"><tr><th>Paket</th><th>Jeton</th><th>Bonus</th><th>Fiyat</th><th>Durum</th></tr>' + S.paketler.map(function (p) { return '<tr><td><input class="fc-in" data-pa="' + p.id + '" value="' + esc(p.ad) + '"></td><td><input class="fc-in" style="max-width:80px" type="number" min="1" data-pj="' + p.id + '" value="' + p.jeton + '"></td><td><input class="fc-in" style="max-width:80px" type="number" min="0" data-pb="' + p.id + '" value="' + p.bonus + '"></td><td><input class="fc-in" placeholder="Siz belirlersiniz"></td><td><button class="fc-btn alt kucuk" type="button" data-pt="' + p.id + '">' + (p.aktif ? "Aktif" : "Pasif") + "</button></td></tr>"; }).join("") + '</table></div><button class="fc-btn kucuk" type="button" id="pekle" style="margin-top:10px">Paket ekle</button></div>' +
        '<div class="fc-kart" style="margin-top:16px"><h3>Kampanya kodları</h3><div class="fc-sar"><table class="fc-tablo"><tr><th>Kod</th><th>Hediye jeton</th><th>Durum</th></tr>' + S.kodlar.map(function (k) { return "<tr><td>" + esc(k.kod) + "</td><td>" + k.jeton + '</td><td><button class="fc-btn alt kucuk" type="button" data-kt="' + esc(k.kod) + '">' + (k.aktif ? "Aktif" : "Pasif") + "</button></td></tr>"; }).join("") + '</table></div><form id="kekle" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px" novalidate><input class="fc-in" style="flex:1;min-width:140px" id="ke-k" placeholder="YENIKOD"><input class="fc-in" style="max-width:110px" id="ke-j" type="number" min="1" max="50" value="1"><button class="fc-btn kucuk" type="submit">Kod ekle</button></form></div>' +
        '<div class="fc-kart" style="margin-top:16px"><h3>Kazanç raporu <span class="fc-not">örnek veri</span></h3><p style="margin:0;color:var(--soluk)">Örnek: haftalık gönderilen fal adedi. Bu grafik tasarım gösterimidir; gerçek kurulumda ödeme kayıtlarınızdan oluşur. Tutar gösterilmez.</p><div class="fc-grafik" id="graf">' + gn.map(function (v) { return '<div style="height:' + Math.round(v / mx * 100) + '%"><span>' + v + "</span></div>"; }).join("") + '</div><div class="fc-etiketler">' + gun.map(function (g) { return "<span>" + g + "</span>"; }).join("") + '</div>' +
        '<div class="fc-grid fc-g4" style="margin-top:14px"><div><small>Bu tarayıcıda gönderilen fal</small><h3 style="margin:0">' + S.fallar.length + '</h3></div><div><small>Demo ödeme kaydı</small><h3 style="margin:0">' + S.odemeler.length + '</h3></div><div><small>12 taksit seçilen</small><h3 style="margin:0">' + (tak[12] || 0) + '</h3></div><div><small>Tek çekim seçilen</small><h3 style="margin:0">' + (tak[1] || 0) + "</h3></div></div></div>" +
        '<p style="margin-top:16px"><button class="fc-btn alt kucuk" type="button" data-sifirla>Demo verisini sıfırla</button></p>';
      if (window.gsap) gsap.from(QA("#graf div", h), { scaleY: 0, duration: .9, stagger: .08, ease: "power3.out" });
      QA("[data-ft]", h).forEach(function (b) { b.onclick = function () { var f = F.falci(b.getAttribute("data-ft")); f.aktif = !f.aktif; F.kaydet(); ciz(); }; });
      Q("#fekle", h).addEventListener("submit", function (e) {
        e.preventDefault(); var ad = Q("#fe-ad", h).value.trim(), uz = Q("#fe-uz", h).value.trim(), tr = Q("#fe-tur", h).value;
        if (ad.length < 2) { Q("#fe-h", h).textContent = "Falcı adını yazın."; return; }
        var r = ["sal", "uzun", "kisa"][S.falcilar.length % 3];
        S.falcilar.push({ id: "f" + F.rk(4), ad: ad, uz: uz || "Genel yorum", turler: [tr], puan: 4.5, online: true, aktif: true, tip: r, sk: "#e5b48a", sc: r === "sal" ? "#9b72d0" : "#3a2214", kl: "#8c2f4b", b1: "#2d1b4a", b2: "#8a5a2b", kisa: "Yeni eklenen falcı (örnek profil)." });
        F.kaydet(); ciz();
      });
      QA("[data-tj]", h).forEach(function (i) { i.onchange = function () { S.turler[i.getAttribute("data-tj")].jeton = Math.max(1, +i.value || 1); F.kaydet(); }; });
      QA("[data-tf]", h).forEach(function (i) { i.onchange = function () { S.turler[i.getAttribute("data-tf")].fiyat = i.value; F.kaydet(); }; });
      function pk(id) { return S.paketler.filter(function (p) { return p.id === id; })[0]; }
      QA("[data-pa]", h).forEach(function (i) { i.onchange = function () { pk(i.getAttribute("data-pa")).ad = i.value; F.kaydet(); }; });
      QA("[data-pj]", h).forEach(function (i) { i.onchange = function () { pk(i.getAttribute("data-pj")).jeton = Math.max(1, +i.value || 1); F.kaydet(); }; });
      QA("[data-pb]", h).forEach(function (i) { i.onchange = function () { pk(i.getAttribute("data-pb")).bonus = Math.max(0, +i.value || 0); F.kaydet(); }; });
      QA("[data-pt]", h).forEach(function (b) { b.onclick = function () { var p = pk(b.getAttribute("data-pt")); p.aktif = !p.aktif; F.kaydet(); ciz(); }; });
      Q("#pekle", h).onclick = function () { S.paketler.push({ id: "p" + F.rk(3), ad: "Yeni paket", jeton: 5, bonus: 0, rozet: "", aktif: true }); F.kaydet(); ciz(); };
      QA("[data-kt]", h).forEach(function (b) { b.onclick = function () { var k = S.kodlar.filter(function (x) { return x.kod === b.getAttribute("data-kt"); })[0]; k.aktif = !k.aktif; F.kaydet(); ciz(); }; });
      Q("#kekle", h).addEventListener("submit", function (e) { e.preventDefault(); var k = Q("#ke-k", h).value.trim().toUpperCase().replace(/[^A-Z0-9]/g, ""), j = +Q("#ke-j", h).value || 1; if (k.length < 3) return; S.kodlar.push({ kod: k, jeton: Math.min(50, j), aktif: true }); F.kaydet(); ciz(); });
      Q("[data-sifirla]", h).onclick = F.sifirla;
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", basla); else basla();
})();
