/* GELİŞTİRİCİ PANELİ — adrese ?gelistirici=1 eklenince açılır. Müşteriyle canlı denge ayarı için:
   bölge/bölüm atlama, ölümsüzlük, sınırsız mermi, zorluk çarpanı, zombi doğurma, FPS. */
(function () {
  const SV = (window.SV = window.SV || {});
  SV.Gelistirici = {
    kur() {
      if (document.getElementById("gelistirici")) return;
      const p = document.createElement("div"); p.id = "gelistirici";
      p.innerHTML = `
<style>
#gelistirici{position:fixed;top:8px;left:8px;z-index:9;font:12px/1.4 Barlow,Arial,sans-serif;color:#efe9dc;background:rgba(6,8,12,.9);border:1px solid rgba(242,193,78,.4);border-radius:10px;padding:8px 10px;width:230px;max-height:calc(100vh - 16px);overflow:auto}
#gelistirici.kapali .ic{display:none}
#gelistirici b{color:#f2c14e;letter-spacing:.08em}
#gelistirici button{font:600 11px Barlow,Arial;background:#1a1f2b;color:#efe9dc;border:1px solid #39404f;border-radius:6px;padding:4px 6px;margin:2px 2px 0 0;cursor:pointer}
#gelistirici button:hover{border-color:#f2c14e}
#gelistirici label{display:flex;align-items:center;gap:6px;margin-top:4px}
#gelistirici input[type=range]{width:100%}
#gfps{float:right;color:#6ad18a;font-weight:700}
</style>
<div><b>GELİŞTİRİCİ</b> <span id="gfps">--</span> <button id="gkapat" style="float:right;margin-right:8px">_</button></div>
<div class="ic">
 <div style="margin-top:6px">Bölüm: <button data-b="b1">1 · Mahalle</button><button data-b="b2">2 · Liman</button></div>
 <div>Bölge: <button id="gatla">Bölgeyi geç ⏭</button><button id="gboss">Boss'a git</button></div>
 <label><input type="checkbox" id="golum"> Ölümsüzlük</label>
 <label><input type="checkbox" id="gmermi"> Sınırsız mermi</label>
 <label><input type="checkbox" id="gsilah"> Tüm silahlar (yeniden başlatınca)</label>
 <div style="margin-top:6px">Zorluk çarpanı: <b id="gzv">1.0</b> <small>(bölge yeniden başlayınca)</small><input type="range" id="gz" min="0.5" max="2.5" step="0.1" value="1"></div>
 <div style="margin-top:6px">Doğur: <button data-z="aylak">Aylak</button><button data-z="kosucu">Koşucu</button><button data-z="hantal">Hantal</button></div>
 <div><button id="gcan">Can doldur</button><button id="gyeniden">Bölgeyi yeniden başlat</button></div>
 <div><button id="gmenu">Menü</button><button id="gsifir">Kaydı sıfırla</button></div>
 <div style="margin-top:6px;color:#9a9488">Değerler: veri/denge.json · silahlar.json · bolumler.json</div>
</div>`;
      document.body.appendChild(p);
      const O = () => SV.aktifOyun, G = SV.gelistirici, q = (s) => p.querySelector(s);
      q("#gkapat").onclick = () => p.classList.toggle("kapali");
      p.querySelectorAll("[data-b]").forEach((b) => (b.onclick = () => { const m = SV.oyun.scene; ["Oyun", "Arayuz", "Menu", "Hikaye", "Sonuc"].forEach((s) => m.isActive(s) && m.stop(s)); m.start("Oyun", { bolumId: b.dataset.b }); }));
      q("#gatla").onclick = () => O() && O().bolgeAtla();
      q("#gboss").onclick = () => { const o = O(); if (!o) return; const i = o.B.bolgeler.findIndex((b) => b.tip === "boss"); o.scene.restart({ bolumId: o.B.id, bolge: i }); };
      q("#golum").onchange = (e) => (G.olumsuz = e.target.checked);
      q("#gmermi").onchange = (e) => (G.sinirsizMermi = e.target.checked);
      q("#gsilah").onchange = (e) => (G.tumSilahlar = e.target.checked);
      q("#gz").oninput = (e) => { G.zorlukCarpani = +e.target.value; q("#gzv").textContent = (+e.target.value).toFixed(1); };
      p.querySelectorAll("[data-z]").forEach((b) => (b.onclick = () => O() && O().zombiDogur(b.dataset.z, "sag")));
      q("#gcan").onclick = () => O() && (O().kahraman.can = O().kahraman.canMax);
      q("#gyeniden").onclick = () => O() && O().yenidenDene();
      q("#gmenu").onclick = () => { const m = SV.oyun.scene; ["Oyun", "Arayuz", "Hikaye", "Sonuc"].forEach((s) => m.isActive(s) && m.stop(s)); m.start("Menu"); };
      q("#gsifir").onclick = () => { SV.Kayit.sifirla(); alert("Kayıt sıfırlandı"); };
      setInterval(() => { if (SV.oyun) q("#gfps").textContent = Math.round(SV.oyun.loop.actualFps) + " FPS"; }, 500);
    }
  };
})();
