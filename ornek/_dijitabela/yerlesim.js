// Dijitabela prototip yerleşimleri: dergi / uygulama (yerlesim.css ile birlikte). 1. tasarım (vitrin) dokunulmaz.
(function () {
  const y = document.documentElement.dataset.yerlesim; if (!y) return;
  let bols = [...document.querySelectorAll("section.bol")];
  if (!bols.length) bols = [...document.querySelectorAll("section")].filter((s) => !s.matches(".hero, .kah") && s.querySelector("h2"));
  const liste = bols.map((s, i) => {
    if (!s.id) s.id = "b" + (i + 1);
    const et = s.querySelector(".etiket"), h = s.querySelector("h2");
    const ad = ((et && et.textContent) || (h && h.textContent) || "Bölüm " + (i + 1)).replace(/^[^p{L}p{N}]+/u, "").split(/s+[·|]s+/)[0].trim();
    return { s, et, h, ad };
  });
  const kisa = (t) => (t.length > 16 ? t.split(/\s+/).slice(0, 2).join(" ") : t);
  const ust = document.querySelector("header.ust, header.ust-cubuk");
  if (y === "dergi") {
    const nav = document.createElement("nav"); nav.className = "yz-dergi-nav";
    nav.innerHTML = liste.map((l) => `<a href="#${l.s.id}">${l.ad}</a>`).join("");
    if (ust) ust.after(nav); else document.body.prepend(nav);
    const yer = () => (nav.style.top = (ust ? ust.offsetHeight : 0) + "px"); yer(); addEventListener("resize", yer);
    liste.forEach((l, i) => l.et && (l.et.dataset.no = String(i + 2).padStart(2, "0")));
  }
  if (y === "uygulama") {
    const hero = document.querySelector(".kah, section.hero"), host = hero && (hero.closest("section") || hero);
    const st = document.createElement("div"); st.className = "yz-hikaye";
    st.innerHTML = liste.slice(0, 10).map((l) => `<a href="#${l.s.id}"><i>${l.ad.charAt(0).toLocaleUpperCase("tr")}</i><span>${l.ad}</span></a>`).join("");
    if (host) host.after(st);
    liste.forEach((l, i) => {
      if (!l.h) return;
      l.s.classList.add("yz-panel"); if (i > 0) l.s.classList.add("kapali");
      const b = document.createElement("button"); b.type = "button"; b.className = "yz-bas";
      b.innerHTML = `<span>${l.et && l.et !== l.h ? `<small>${l.et.textContent}</small>` : ""}${l.h.textContent}</span><b>⌄</b>`;
      l.s.prepend(b); b.addEventListener("click", () => l.s.classList.toggle("kapali"));
      l.h.classList.add("yz-gizle"); if (l.et) l.et.classList.add("yz-gizle");
    });
    // bağlantı kapalı bir panele gidiyorsa önce aç
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return;
      const t = document.querySelector(a.getAttribute("href")); const p = t && t.closest(".yz-panel");
      if (p && p.classList.contains("kapali")) p.classList.remove("kapali");
    }, true);
    const tel = document.querySelector('a[href^="tel:"]');
    const wa = [...document.querySelectorAll('a[href*="wa.me/"]')].find((a) => !a.href.includes("905019452184"));
    const ikon = ["◉", "◆", "▲", "✦"];
    const bar = document.createElement("nav"); bar.className = "yz-alt";
    bar.innerHTML = liste.slice(0, wa ? 3 : 4).map((l, i) => `<a href="#${l.s.id}"><i>${ikon[i]}</i>${kisa(l.ad)}</a>`).join("") + (wa ? `<a href="${wa.getAttribute("href")}" target="_blank" rel="noopener"><i>💬</i>WhatsApp</a>` : "") + (tel ? `<a class="ara" href="${tel.getAttribute("href")}"><i>📞</i>Ara</a>` : "");
    document.body.append(bar);
  }
})();
