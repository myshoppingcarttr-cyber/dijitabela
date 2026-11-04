/* Attelia: hareket ve kliniğe özel modüller. Ağ isteği yok. */
(function () {
  "use strict";
  var L = ["tr", "en", "de", "ru", "ar"], ind = function () { return Math.max(0, L.indexOf(document.documentElement.lang)); };
  var t = function (k) { var v = window.KLD[k]; return v ? v[ind()] : k; };
  var azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* görünürken belirme */
  function belir() {
    var l = [].slice.call(document.querySelectorAll(".gir"));
    if (azHareket || !("IntersectionObserver" in window)) { l.forEach(function (e) { e.classList.add("ac"); }); return; }
    var io = new IntersectionObserver(function (g) { g.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("ac"); io.unobserve(x.target); } }); }, { threshold: 0.12 });
    l.forEach(function (e) { io.observe(e); });
  }

  /* kelime kelime açılan manifesto */
  function kelimeler() {
    [].forEach.call(document.querySelectorAll("[data-kelime]"), function (e) {
      var kk = e.querySelector("[data-t]") || e; if (kk.dataset.bol === document.documentElement.lang + kk.textContent.length) return;
      var m = kk.textContent; kk.innerHTML = m.split(/\s+/).map(function (w) { return '<i class="kl">' + esc(w) + "</i>"; }).join(" ");
      kk.dataset.bol = document.documentElement.lang + kk.textContent.length;
    });
  }

  /* kaydırma */
  var bilgi = { kah: document.querySelector("[data-kahraman]"), yol: document.querySelector("[data-yol]") };
  function kaydir() {
    var h = innerHeight;
    if (bilgi.kah) { var p = Math.min(1, Math.max(0, scrollY / h)); bilgi.kah.style.setProperty("--p", p.toFixed(3)); }
    [].forEach.call(document.querySelectorAll("[data-kelime]"), function (e) {
      var r = e.getBoundingClientRect(), o = Math.max(0, Math.min(1, (h * 0.86 - r.top) / (r.height + h * 0.42)));
      var k = e.querySelectorAll(".kl"), n = Math.floor(o * k.length * 1.08);
      for (var i = 0; i < k.length; i++) k[i].classList.toggle("yan", i < n || azHareket);
    });
    if (bilgi.yol) {
      var ss = [].slice.call(bilgi.yol.querySelectorAll("[data-durak]")), ak = 0;
      ss.forEach(function (s, i) { var b = s.getBoundingClientRect(); if (b.top < h * 0.58) ak = i; });
      [].forEach.call(bilgi.yol.querySelectorAll("[data-kare]"), function (f, i) { f.classList.toggle("ak", i === ak); });
      ss.forEach(function (s, i) { s.classList.toggle("ak", i === ak); });
      var c = bilgi.yol.querySelector("[data-cizgi]"); if (c) c.style.transform = "scaleY(" + ((ak + 1) / ss.length) + ")";
      var no = bilgi.yol.querySelector("[data-no]"); if (no) no.textContent = "0" + (ak + 1);
    }
    var u = document.querySelector("[data-ust]"); if (u) u.classList.toggle("dolu", scrollY > h * 0.82);
  }
  var bekle = false;
  addEventListener("scroll", function () { if (bekle) return; bekle = true; requestAnimationFrame(function () { bekle = false; kaydir(); }); }, { passive: true });
  addEventListener("resize", kaydir);

  /* video: hareket azaltılmışsa durur */
  [].forEach.call(document.querySelectorAll("video[data-oto]"), function (v) { if (azHareket) { v.removeAttribute("autoplay"); v.pause(); } else { var q = v.play(); if (q && q.catch) q.catch(function () {}); } });

  /* laboratuvar satırı üstünde görsel değişimi */
  [].forEach.call(document.querySelectorAll("[data-lab]"), function (kap) {
    kap.addEventListener("mouseover", function (e) { var s = e.target.closest("[data-gorsel]"); if (!s) return; [].forEach.call(kap.querySelectorAll("[data-lab-g]"), function (g) { g.classList.toggle("ak", g.getAttribute("data-lab-g") === s.getAttribute("data-gorsel")); }); });
  });

  /* dört beyaz */
  var TON = { natural: ["#EFE7D6", "#FBF6EA", "Natural White"], cool: ["#E8ECEA", "#F7FAF9", "Cool White"], pure: ["#F2F1EC", "#FFFFFD", "Pure White"], million: ["#F7F6F3", "#FFFFFF", "Million Dollar White"] };
  function beyaz(el, s) {
    var o = TON[s]; el.querySelector("[data-tas]").style.background = "linear-gradient(155deg," + o[1] + " 8%," + o[0] + " 62%," + o[1] + ")";
    var a = el.querySelector("[data-tonad]"); if (a) a.textContent = o[2];
    [].forEach.call(el.querySelectorAll("[data-ton]"), function (b) { var on = b.getAttribute("data-ton") === s; b.classList.toggle("ak", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
  }
  [].forEach.call(document.querySelectorAll("[data-beyaz]"), function (el) {
    beyaz(el, "natural");
    el.addEventListener("click", function (e) { var b = e.target.closest("[data-ton]"); if (b) beyaz(el, b.getAttribute("data-ton")); });
  });

  /* tek satırlık mektup formu */
  var konu = ["a_tr1", "a_tr3", "a_tr4", "a_tr5", "a_tr6"], ulke = ["c_uk", "c_de", "c_nl", "c_ru", "c_sa", "c_ot"];
  var ME = { ad: "", tel: "", u: 0, k: 0 };
  function mektup(el) {
    var se = function (id, l, s) { return '<select id="' + id + '" aria-label="' + esc(t(l[0])) + '">' + l.map(function (x, i) { return '<option value="' + i + '"' + (i === s ? " selected" : "") + ">" + esc(t(x)) + "</option>"; }).join("") + "</select>"; };
    el.innerHTML = '<form novalidate><p class="sa-t">' + esc(t("b_m1")) + ' <input id="man" aria-label="' + esc(t("b_ad")) + '" placeholder="' + esc(t("b_ad")) + '" value="' + esc(ME.ad) + '"> ' + esc(t("b_m2")) + " " + se("mul", ulke, ME.u) + " " + esc(t("b_m3")) + " " + esc(t("b_m4")) + " " + se("mko", konu, ME.k) + ". " + esc(t("b_m5")) + ' <input id="mte" inputmode="tel" aria-label="' + esc(t("f_phone")) + '" placeholder="' + esc(t("b_te")) + '" value="' + esc(ME.tel) + '">.</p><label class="on-k"><input type="checkbox" id="mon"><span>' + esc(t("f_consent")) + '</span></label><p class="hata" id="mha" role="alert"></p><button class="dg" type="submit">' + esc(t("b_mg")) + '</button><p class="tm" id="mok" role="status"></p></form>';
    el.querySelector("form").onsubmit = function (e) {
      e.preventDefault();
      ME.ad = el.querySelector("#man").value; ME.tel = el.querySelector("#mte").value; ME.u = +el.querySelector("#mul").value; ME.k = +el.querySelector("#mko").value;
      var h = el.querySelector("#mha"); h.textContent = "";
      if (!ME.ad.trim()) { h.textContent = t("f_err_name"); return; }
      if (ME.tel.replace(/\D/g, "").length < 10) { h.textContent = t("f_err_phone"); return; }
      if (!el.querySelector("#mon").checked) { h.textContent = t("f_err_consent"); return; }
      window.KLM.ekle({ ad: ME.ad, tel: ME.tel, kaynak: "Mesaj", konu: konu[ME.k], not: window.KLD[ulke[ME.u]][0] + ". Tek satırlık formdan geldi." });
      el.querySelector("#mok").textContent = "✓ " + t("b_mo");
    };
  }

  /* biniş kartı */
  var KOD = { c_uk: "LHR", c_de: "BER", c_nl: "AMS", c_ru: "SVO", c_sa: "RUH", c_ot: "···" };
  var BI = { ad: "", tel: "", u: "c_uk", k: "a_tr4", z: "u_w2", g: 7 };
  function bilet(el) {
    var sec = function (id, l, s) { return '<select class="g" id="' + id + '">' + l.map(function (x) { return '<option value="' + x + '"' + (x === s ? " selected" : "") + ">" + esc(t(x)) + "</option>"; }).join("") + "</select>"; };
    el.innerHTML = '<div class="bk" aria-live="polite"><div class="bk-s"><div class="bk-u"><span class="bk-m">ATTELIA</span><span class="bk-p">' + esc(t("c_ga")) + '</span></div><div class="bk-r"><div><small>' + esc(t("c_nereden")) + "</small><b>" + KOD[BI.u] + '</b></div><svg viewBox="0 0 64 16" aria-hidden="true"><path d="M1 8h56m-6-6 7 6-7 6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg><div><small>' + esc(t("c_nereye")) + '</small><b>AYT</b></div></div><dl><div><dt>' + esc(t("c_yolcu")) + "</dt><dd>" + esc(BI.ad || "—") + "</dd></div><div><dt>" + esc(t("c_kapi")) + "</dt><dd>" + esc(t(BI.k)) + "</dd></div><div><dt>" + esc(t("c_ay")) + "</dt><dd>" + esc(t(BI.z)) + "</dd></div><div><dt>" + esc(t("c_kal")) + "</dt><dd>" + BI.g + " " + esc(t("a_gun")) + '</dd></div></dl></div><div class="bk-k" aria-hidden="true"></div></div>'
      + '<div class="bk-f"><label class="e">' + esc(t("f_name")) + '<input class="g" id="ba" value="' + esc(BI.ad) + '"></label><label class="e">' + esc(t("c_nereden")) + sec("bu", ulke, BI.u) + '</label><label class="e">' + esc(t("c_kapi")) + sec("bk", konu, BI.k) + '</label><label class="e">' + esc(t("c_ay")) + sec("bz", ["u_w1", "u_w2", "u_w3", "u_w4"], BI.z) + '</label><label class="e">' + esc(t("c_kal")) + ': <b id="bgs">' + BI.g + '</b><input type="range" id="bg" min="2" max="21" value="' + BI.g + '"></label><label class="e">' + esc(t("f_phone")) + '<input class="g" id="bt" inputmode="tel" value="' + esc(BI.tel) + '"></label><label class="on-k"><input type="checkbox" id="bo"><span>' + esc(t("f_consent")) + '</span></label><p class="hata" id="bh" role="alert"></p><button type="button" class="dg" id="bs">' + esc(t("c_kaydet")) + '</button><p class="tm" id="bok" role="status"></p></div>';
    var yeniden = function () { var c = el.querySelector("#bo").checked; bilet(el); el.querySelector("#bo").checked = c; };
    el.querySelector("#bu").onchange = function (e) { BI.u = e.target.value; yeniden(); };
    el.querySelector("#bk").onchange = function (e) { BI.k = e.target.value; yeniden(); };
    el.querySelector("#bz").onchange = function (e) { BI.z = e.target.value; yeniden(); };
    el.querySelector("#bg").onchange = function (e) { BI.g = +e.target.value; yeniden(); };
    el.querySelector("#bg").oninput = function (e) { el.querySelector("#bgs").textContent = e.target.value; };
    el.querySelector("#ba").onchange = function (e) { BI.ad = e.target.value; yeniden(); };
    el.querySelector("#bt").oninput = function (e) { BI.tel = e.target.value; };
    el.querySelector("#bs").onclick = function () {
      BI.ad = el.querySelector("#ba").value; var h = el.querySelector("#bh"); h.textContent = "";
      if (!BI.ad.trim()) { h.textContent = t("f_err_name"); return; }
      if (BI.tel.replace(/\D/g, "").length < 10) { h.textContent = t("f_err_phone"); return; }
      if (!el.querySelector("#bo").checked) { h.textContent = t("f_err_consent"); return; }
      window.KLM.ekle({ ad: BI.ad, tel: BI.tel, kaynak: "Yurt dışı talep", konu: BI.k, not: window.KLD[BI.u][0] + ". " + window.KLD[BI.z][0] + ". Kalış " + BI.g + " gün." });
      el.querySelector("#bok").textContent = "✓ " + t("c_ok");
    };
  }

  function dilDegisti() {
    kelimeler(); kaydir();
    [].forEach.call(document.querySelectorAll("[data-mektup]"), mektup);
    [].forEach.call(document.querySelectorAll("[data-bilet]"), bilet);
  }
  document.addEventListener("kl-dil", dilDegisti);
  document.addEventListener("DOMContentLoaded", function () { belir(); dilDegisti(); });
})();
