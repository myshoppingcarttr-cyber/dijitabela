// Dijitabela sitesi · yapay zekâ asistanı sohbet penceresi. Cevaplar sunucudaki "asistan" fonksiyonundan (Gemini) gelir.
// Konuşma kimliği tarayıcıda saklanır; sayfa değişse de sohbet sürer. WhatsApp düğmesi her zaman yedek kanal olarak durur.
(function () {
  var A = window.AJANS || {}; if (!A.supabaseUrl) return;
  var URL_ = A.supabaseUrl + "/functions/v1/asistan";
  var oturum; try { oturum = localStorage.getItem("dj-asistan"); if (!oturum) { oturum = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()); localStorage.setItem("dj-asistan", oturum); } } catch (e) { oturum = String(Math.random()).slice(2) + Date.now(); }
  var gecmis = []; try { gecmis = JSON.parse(sessionStorage.getItem("dj-asistan-gecmis") || "[]"); } catch (e) {}
  var css = document.createElement("style");
  css.textContent = ".dja-d{position:fixed;right:20px;bottom:92px;z-index:90;width:60px;height:60px;border-radius:50%;border:2px solid #16181D;background:#FFB000;color:#16181D;font-size:26px;cursor:pointer;box-shadow:0 14px 30px -10px rgba(0,0,0,.45);transition:transform .2s}.dja-d:hover{transform:scale(1.07)}" +
    ".dja-i{position:fixed;right:90px;bottom:104px;z-index:90;background:#fff;color:#16181D;border:2px solid #16181D;padding:10px 14px;font:600 14px/1.35 'Plus Jakarta Sans',system-ui,sans-serif;max-width:230px;box-shadow:0 12px 24px -14px rgba(0,0,0,.4)}" +
    ".dja{position:fixed;right:20px;bottom:92px;z-index:95;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100vh - 130px));background:#F4F3EF;border:2px solid #16181D;display:flex;flex-direction:column;font:15px/1.5 'Plus Jakarta Sans',system-ui,sans-serif;color:#16181D;box-shadow:0 30px 70px -30px rgba(0,0,0,.6)}" +
    ".dja[hidden],.dja-i[hidden]{display:none}.dja-b{background:#16181D;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}.dja-b i{font-style:normal;width:36px;height:36px;border-radius:50%;background:#FFB000;color:#16181D;display:grid;place-items:center;font-weight:800}.dja-b b{display:block;line-height:1.1}.dja-b small{opacity:.75;font-size:12px}.dja-b button{margin-left:auto;background:none;border:0;color:#fff;font-size:22px;cursor:pointer}" +
    ".dja-a{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}.dja-m{max-width:86%;padding:9px 13px;white-space:pre-line;word-wrap:break-word}.dja-m.z{align-self:flex-end;background:#16181D;color:#fff}.dja-m.a{align-self:flex-start;background:#fff;border:1px solid #ddd}.dja-m a{color:#8A5A00;font-weight:700}" +
    ".dja-h{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 8px}.dja-h button{border:1px solid #16181D;background:#fff;padding:5px 10px;font:600 12px system-ui;cursor:pointer}" +
    ".dja-f{display:flex;border-top:2px solid #16181D}.dja-f input{flex:1;border:0;padding:13px;font:inherit;background:#fff;min-width:0}.dja-f button{border:0;background:#FFB000;font-weight:800;padding:0 16px;cursor:pointer}" +
    ".dja-n{font-size:11px;color:#5F646D;text-align:center;padding:6px 10px}.dja-y span{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:#999;animation:djz 1s infinite}.dja-y span:nth-child(2){animation-delay:.15s}.dja-y span:nth-child(3){animation-delay:.3s}@keyframes djz{50%{transform:translateY(-4px)}}" +
    "@media(max-width:600px){.dja-d{bottom:84px;right:14px}.dja{right:8px;bottom:80px}.dja-i{display:none}}";
  document.head.appendChild(css);
  var d = document.createElement("button"); d.className = "dja-d"; d.setAttribute("aria-label", "Yapay zekâ asistanı ile konuşun"); d.textContent = "✦";
  var ip = document.createElement("p"); ip.className = "dja-i"; ip.hidden = true; ip.textContent = "Merhaba 👋 İşletmeniz için ne yapabileceğimizi 1 dakikada anlatayım mı?";
  var p = document.createElement("div"); p.className = "dja"; p.hidden = true; p.setAttribute("role", "dialog"); p.setAttribute("aria-label", "Dijitabela asistanı");
  p.innerHTML = "<div class='dja-b'><i>D</i><div><b>Dijitabela asistanı</b><small>Yapay zekâ · genellikle anında cevaplar</small></div><button aria-label='Kapat'>×</button></div><div class='dja-a'></div>" +
    "<div class='dja-h'><button>Fiyatlarınız nedir?</button><button>Web sitem yok, ne yapmalıyım?</button><button>WhatsApp asistanı nasıl çalışır?</button></div>" +
    "<form class='dja-f'><input maxlength='1000' placeholder='Sorunuzu yazın…' aria-label='Mesaj'><button aria-label='Gönder'>➤</button></form><p class='dja-n'>Yapay zekâ asistanıdır; bilgileriniz yalnızca size dönüş için kullanılır (<a href='kvkk.html'>KVKK</a>).</p>";
  document.body.appendChild(d); document.body.appendChild(ip); document.body.appendChild(p);
  var akis = p.querySelector(".dja-a"), form = p.querySelector("form"), girdi = form.querySelector("input");
  function linkle(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/(https?:\/\/[^\s)]+|wa\.me\/\d+)/g, function (u) { return "<a target='_blank' rel='noopener' href='" + (u.indexOf("http") ? "https://" + u : u) + "'>" + u + "</a>"; }).replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>"); }
  function yaz(metin, kim, kaydet) { var m = document.createElement("div"); m.className = "dja-m " + kim; m.innerHTML = linkle(metin); akis.appendChild(m); akis.scrollTop = akis.scrollHeight;
    if (kaydet) { gecmis.push([kim, metin]); try { sessionStorage.setItem("dj-asistan-gecmis", JSON.stringify(gecmis.slice(-30))); } catch (e) {} } }
  function ac() { p.hidden = false; d.hidden = true; ip.hidden = true;
    if (!akis.children.length) { if (gecmis.length) gecmis.forEach(function (g) { yaz(g[1], g[0], false); }); else yaz("Merhaba! 👋 Ben Dijitabela'nın yapay zekâ asistanıyım. İşletmeniz ne iş yapıyor, size nasıl yardımcı olabilirim?", "a", true); }
    setTimeout(function () { girdi.focus(); }, 50); }
  function kapat() { p.hidden = true; d.hidden = false; }
  d.onclick = ac; p.querySelector(".dja-b button").onclick = kapat;
  p.querySelectorAll(".dja-h button").forEach(function (b) { b.onclick = function () { gonder(b.textContent); }; });
  var bekliyor = false;
  function gonder(metin) { metin = (metin || "").trim(); if (!metin || bekliyor) return; bekliyor = true; yaz(metin, "z", true); girdi.value = "";
    var y = document.createElement("div"); y.className = "dja-m a dja-y"; y.innerHTML = "<span></span><span></span><span></span>"; akis.appendChild(y); akis.scrollTop = akis.scrollHeight;
    fetch(URL_, { method: "POST", headers: { "Content-Type": "application/json", apikey: A.supabaseAnonKey }, body: JSON.stringify({ oturum: oturum, mesaj: metin }) })
      .then(function (r) { return r.json(); }).then(function (j) { y.remove(); yaz(j.cevap || ("Şu an cevap veremiyorum. WhatsApp: wa.me/" + (A.whatsapp || "")), "a", true); })
      .catch(function () { y.remove(); yaz("Bağlantı sorunu oldu. Hemen yardım için WhatsApp: wa.me/" + (A.whatsapp || ""), "a", false); })
      .then(function () { bekliyor = false; }); }
  form.onsubmit = function (e) { e.preventDefault(); gonder(girdi.value); };
  addEventListener("keydown", function (e) { if (e.key === "Escape" && !p.hidden) kapat(); });
  setTimeout(function () { if (p.hidden && !sessionStorage.getItem("dj-ipucu")) { ip.hidden = false; try { sessionStorage.setItem("dj-ipucu", "1"); } catch (e) {} setTimeout(function () { ip.hidden = true; }, 9000); } }, 7000);
})();
