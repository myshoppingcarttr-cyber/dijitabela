/* ortak yardımcılar */
(function () {
  var U = window.U = {};
  U.$ = function (s, k) { return (k || document).querySelector(s); };
  U.$$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  U.tl = function (n) { return "₺" + Math.round(n).toLocaleString("tr-TR"); };
  U.yuvarla = function (n, a) { a = a || 50; return Math.round(n / a) * a; };
  U.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  U.saat = function () { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); };
  U.tost = function (m, sure) {
    var k = document.getElementById("tost"); if (!k) { k = document.createElement("div"); k.id = "tost"; document.body.appendChild(k); }
    var t = document.createElement("div"); t.className = "tost"; t.innerHTML = m; k.appendChild(t);
    setTimeout(function () { t.style.transition = "opacity .4s"; t.style.opacity = 0; setTimeout(function () { t.remove(); }, 400); }, sure || 3200);
  };
  /* WhatsApp telefon önizlemesi */
  U.waTelefon = function (kok, o) {
    o = o || {};
    kok.innerHTML = '<div class="tel-cer"><div class="tel-ekr"><div class="wa-ust"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg><div class="av"><img src="img/bb-logo.png" alt=""></div><div><b>' + (o.baslik || "Antalya BB Bilgisayar") + '</b><small>' + (o.alt || "İşletme hesabı · çevrimiçi") + '</small></div></div><div class="wa-akis"><div class="wa-gun">BUGÜN</div></div><div class="wa-yaz"><span>Mesaj yazın</span><i><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12z"/></svg></i></div></div></div>';
    var akis = kok.querySelector(".wa-akis");
    return {
      ekle: function (metin, kim, dugme) {
        var m = document.createElement("div"); m.className = "wa-m" + (kim === "ben" ? " ben" : "");
        m.innerHTML = metin.replace(/((?:antalyabilgisayarservisi\.com|g\.page)\/[^\s<]+)/g, '<span class="lnk">$1</span>') + (dugme ? '<span class="wa-dg">' + dugme + "</span>" : "") + "<time>" + U.saat() + "</time>";
        akis.appendChild(m); akis.scrollTop = akis.scrollHeight; return m;
      },
      temizle: function () { akis.innerHTML = '<div class="wa-gun">BUGÜN</div>'; }
    };
  };
  /* görünme gözlemcisi */
  U.gorunme = function () {
    if (!("IntersectionObserver" in window)) { U.$$("[data-gir]").forEach(function (e) { e.classList.add("gor"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("gor"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    U.$$("[data-gir]").forEach(function (e) { io.observe(e); });
  };
  /* düğme ışığı */
  document.addEventListener("pointermove", function (e) {
    var b = e.target.closest && e.target.closest(".dg"); if (!b) return;
    var r = b.getBoundingClientRect(); b.style.setProperty("--mx", (e.clientX - r.left) + "px"); b.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
  document.addEventListener("click", function (e) {
    var m = e.target.closest && e.target.closest(".menu-dg"); if (m) { U.$(".ust nav").classList.toggle("acik"); return; }
    if (e.target.closest && e.target.closest(".ust nav a")) U.$(".ust nav").classList.remove("acik");
  });
})();
