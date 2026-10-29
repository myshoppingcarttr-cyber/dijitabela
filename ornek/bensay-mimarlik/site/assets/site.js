/* bensay Mimarlık · ortak betik: dil, menü, WhatsApp, projeler, takip, randevu */
(function(){
"use strict";
var H=document.documentElement,$=function(s,k){return(k||document).querySelector(s)},$$=function(s,k){return[].slice.call((k||document).querySelectorAll(s))};
var CFG=window.BENSAY||{};var WA=(CFG.wa||"").replace(/\D/g,"");
window.bnWa=function(m){return"https://wa.me/"+WA+"?text="+encodeURIComponent(m)};
window.bnEn=function(){return H.classList.contains("en")};
/* dil */
var TT={tr:document.title,en:H.getAttribute("data-title-en")||document.title};
function dil(en,kaydet){H.classList.toggle("en",en);H.lang=en?"en":"tr";document.title=en?TT.en:TT.tr;
 var b=$("#dil");if(b){b.textContent=en?"TR":"EN";b.setAttribute("aria-label",en?"Türkçe'ye geç":"Switch to English")}
 $$("[data-ph-en]").forEach(function(x){if(!x.dataset.phTr)x.dataset.phTr=x.placeholder||"";x.placeholder=en?x.dataset.phEn:x.dataset.phTr});
 $$("[data-al-en]").forEach(function(x){if(!x.dataset.alTr)x.dataset.alTr=x.getAttribute("aria-label")||"";x.setAttribute("aria-label",en?x.dataset.alEn:x.dataset.alTr)});
 if(kaydet)try{localStorage.setItem("bensay_dil",en?"en":"tr")}catch(e){}
 document.dispatchEvent(new CustomEvent("bn:dil"))}
var q=/[?&]lang=(en|tr)/.exec(location.search),s=null;try{s=localStorage.getItem("bensay_dil")}catch(e){}
dil(q?q[1]==="en":s==="en",!!q);
var db=$("#dil");if(db)db.addEventListener("click",function(){dil(!bnEn(),true)});
/* menü */
var mb=$("#menuDg"),mn=$("#menu");if(mb&&mn)mb.addEventListener("click",function(){var a=mn.classList.toggle("ac");mb.setAttribute("aria-expanded",a)});
/* WhatsApp bağlantıları */
$$("[data-wa]").forEach(function(a){a.href=bnWa(bnEn()&&a.dataset.waEn?a.dataset.waEn:a.dataset.wa);a.target="_blank";a.rel="noopener"});
document.addEventListener("bn:dil",function(){$$("[data-wa]").forEach(function(a){a.href=bnWa(bnEn()&&a.dataset.waEn?a.dataset.waEn:a.dataset.wa)})});
/* yardımcı */
function t(o){if(!o)return"";if(typeof o==="string")return o;return(bnEn()&&o.en)?o.en:(o.tr||"")}
function esc(x){return String(x==null?"":x).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var EV='<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M8 82h104M18 82V40l42-30 42 30v42M42 82V56h20v26M74 48h16v14H74zM30 48h0"/><path d="M60 10v-6"/></svg>';
function yakinda(){return'<div class="yakinda">'+EV+'<span data-l="tr">Proje görseli yakında</span><span data-l="en" lang="en">Project image coming soon</span></div>'}
var TUR={mimari:{tr:"Mimarlık",en:"Architecture"},ic:{tr:"İç Mimarlık",en:"Interior Design"},yonetim:{tr:"Proje Yönetimi",en:"Project Management"}};
function no(i){return(i<9?"0":"")+(i+1)}
function veri(cb){fetch((CFG.kok||"")+"veri/projeler.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(j){cb(j.projeler||[])}).catch(function(){cb([])})}
/* proje kartları */
var izg=$("#projeIzg");
if(izg)veri(function(P){var lim=+izg.dataset.limit||P.length;
 function ciz(f){izg.innerHTML=P.slice(0,lim).map(function(p,i){if(f&&f!=="hepsi"&&p.tur!==f)return"";var ad=t(p.ad),g=(p.gorseller||[])[0];
  return'<a class="pk" href="proje.html?p='+esc(p.id)+'"><div class="g">'+(g?'<img src="'+esc(g)+'" alt="'+esc(ad)+'" loading="lazy" width="800" height="600">':yakinda())+'</div><div class="m"><b>'+(ad?esc(ad):'<span data-l="tr">Proje '+no(i)+'</span><span data-l="en" lang="en">Project '+no(i)+'</span>')+'</b><small>'+([p.tur?t(TUR[p.tur]):"",p.konum,p.yil].filter(Boolean).map(esc).join(" · ")||'<span data-l="tr">Bilgiler hazırlanıyor</span><span data-l="en" lang="en">Details in preparation</span>')+'</small></div></a>'}).join("")}
 ciz();var fl=$("#filtre");if(fl){var var_=P.some(function(p){return p.tur});fl.hidden=!var_;
  $$("button",fl).forEach(function(b){b.addEventListener("click",function(){$$("button",fl).forEach(function(x){x.setAttribute("aria-pressed",x===b)});ciz(b.dataset.f)})})}
 document.addEventListener("bn:dil",function(){var a=fl&&$("button[aria-pressed=true]",fl);ciz(a?a.dataset.f:null)})});
/* proje detay */
var dt=$("#projeDetay");
if(dt)veri(function(P){var id=(/[?&]p=([\w-]+)/.exec(location.search)||[])[1];var i=Math.max(0,P.findIndex(function(p){return p.id===id}));var p=P[i]||{};
 function ciz(){var ad=t(p.ad),bek='<span class="bekliyor"><span data-l="tr">eklenecek</span><span data-l="en" lang="en">to be added</span></span>';
  $("#pdAd").innerHTML=ad?esc(ad):'<span data-l="tr">Proje '+no(i)+'</span><span data-l="en" lang="en">Project '+no(i)+'</span>';
  $("#pdOzet").innerHTML=t(p.ozet)?esc(t(p.ozet)):'<span data-l="tr">Bu projenin açıklaması, görselleri ve künyesi ofisimizden gelince burada yer alacak.</span><span data-l="en" lang="en">The description, images and credits of this project will appear here once provided by our office.</span>';
  $("#pdTur").innerHTML=p.tur?esc(t(TUR[p.tur])):bek;$("#pdKonum").innerHTML=p.konum?esc(p.konum):bek;$("#pdYil").innerHTML=p.yil?esc(p.yil):bek;$("#pdAlan").innerHTML=p.alan?esc(p.alan):bek;
  var G=p.gorseller||[];$("#pdGaleri").innerHTML=(G.length?G:[0,0,0]).map(function(g){return g?'<img src="'+esc(g)+'" alt="'+esc(ad)+'" loading="lazy">':yakinda()}).join("");
  var o=P[(i-1+P.length)%P.length],s=P[(i+1)%P.length];if(o)$("#pdOnce").href="proje.html?p="+o.id;if(s)$("#pdSonra").href="proje.html?p="+s.id;
  if(ad)document.title=ad+" · bensay Mimarlık"}
 ciz();document.addEventListener("bn:dil",ciz)});
/* proje takip */
var tk=$("#kodBak");
if(tk){var tg=function(){var k=($("#kod").value||"").toUpperCase().replace(/[^A-Z0-9]/g,""),P=$("#portal");
 fetch("veri/takip-demo.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(D){var p=D[k];
  if(!p){P.innerHTML='<p class="acik"><span data-l="tr">Bu kodla proje bulunamadı. Deneme kodu: DEMO-2481</span><span data-l="en" lang="en">No project found for this code. Demo code: DEMO-2481</span></p>';return}
  P.innerHTML='<div class="etiket">'+esc(t(p.baslik))+'</div><div class="top">%'+p.yuzde+'</div><div class="ilerleme"><i style="width:'+p.yuzde+'%"></i></div>'+p.asamalar.map(function(a,j){return'<div class="adim '+a.d+'"><b>'+(a.d==="ok"?"✓":j+1)+'</b><div><strong>'+esc(t(a.ad))+'</strong><br><small class="not">'+esc(t(a.not))+'</small></div></div>'}).join("")+'<p class="not">'+esc(t(D._not))+'</p>'})};
 tk.addEventListener("click",tg);$("#kod").addEventListener("keydown",function(e){if(e.key==="Enter")tg()})}
/* randevu formu */
var rf=$("#randevuForm");
if(rf){var msj=function(){var v=function(id){var e=$("#"+id);return e?e.value.trim():""};var tr=!bnEn();
  var g=v("rGun")?v("rGun").split("-").reverse().join("."):"";
  return(tr?"Merhaba, web sitenizden keşif randevusu istiyorum.":"Hello, I'd like to book a site visit via your website.")+
  "\n"+(tr?"Ad soyad: ":"Name: ")+(v("rAd")||"-")+"\n"+(tr?"Telefon: ":"Phone: ")+(v("rTel")||"-")+"\n"+(tr?"Proje: ":"Project: ")+($("#rKonu").selectedOptions[0].textContent)+
  "\n"+(tr?"Konum: ":"Location: ")+(v("rKonum")||"-")+"\n"+(tr?"Tercih edilen gün: ":"Preferred day: ")+(g||"-")+" "+($("#rSaat").selectedOptions[0].textContent)+(v("rNot")?"\n"+(tr?"Not: ":"Note: ")+v("rNot"):"")};
 var guncel=function(){$("#rMesaj").textContent=msj();$("#rGonder").href=bnWa(msj())};
 rf.addEventListener("input",guncel);rf.addEventListener("change",guncel);document.addEventListener("bn:dil",guncel);guncel();
 rf.addEventListener("submit",function(e){e.preventDefault();window.open(bnWa(msj()),"_blank","noopener")})}
})();
