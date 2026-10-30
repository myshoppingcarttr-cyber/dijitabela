/* bensay Mimarlık · ortak betik (30 Eki 2026): içerik yükleme (Supabase → veri/icerik.json), yeniden çizim, dil, menü, WhatsApp, filtre, keşif formu, takip */
(function(){
"use strict";
var H=document.documentElement,$=function(s,k){return(k||document).querySelector(s)},$$=function(s,k){return[].slice.call((k||document).querySelectorAll(s))};
var CFG=window.BENSAY=window.BENSAY||{};
var SAYFA=H.getAttribute("data-sayfa")||"index";
var Q=new URLSearchParams(location.search);
var CTX={p:Q.get("p"),y:Q.get("y"),onizleme:Q.has("onizleme")};
function wa(){return String(CFG.wa||"").replace(/\D/g,"")}
window.bnWa=function(m){return"https://wa.me/"+wa()+"?text="+encodeURIComponent(m)};
window.bnEn=function(){return H.classList.contains("en")};

/* ---------- içerik ---------- */
function zamanli(p,ms){return Promise.race([p,new Promise(function(_,r){setTimeout(function(){r(new Error("zaman aşımı"))},ms)})])}
function yerelIcerik(){return fetch("veri/icerik.json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw 0;return r.json()})}
function sbIcerik(){var sb=CFG.sb;if(!sb||!sb.url)return Promise.reject(0);
 return zamanli(fetch(sb.url+"/rest/v1/site_icerik?site=eq."+encodeURIComponent(CFG.site||"bensay")+"&select=veri,guncelleme",{headers:{apikey:sb.key}}),2500)
  .then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){var v=j&&j[0]&&j[0].veri;if(!v||!v.sayfalar)throw 0;v.meta=v.meta||{};v.meta.guncelleme=j[0].guncelleme;return v})}
function icerikYukle(){
 if(CTX.onizleme)return new Promise(function(coz){var bitti=false;
  window.addEventListener("message",function(e){if(e.origin!==location.origin||!e.data||e.data.tip!=="bn-icerik")return;
   if(!bitti){bitti=true;coz({ic:e.data.veri,ciz:true})}else{window.BN_ICERIK=e.data.veri;ciz(e.data.veri)}});
  try{parent.postMessage({tip:"bn-hazir"},location.origin)}catch(e){}
  setTimeout(function(){if(!bitti){bitti=true;yerelIcerik().then(function(ic){coz({ic:ic,ciz:false})},function(){coz({ic:null})})}},4000)});
 return sbIcerik().then(function(ic){return{ic:ic,ciz:ic.meta.guncelleme!==CFG.guncelleme}},function(){return yerelIcerik().then(function(ic){return{ic:ic,ciz:false}},function(){return{ic:null}})});
}
function ciz(ic){if(!window.BNRender)return;var y=window.scrollY;window.BNRender.yenidenCiz(ic,SAYFA,CTX);dil(bnEn(),false);baglantilar();davranislar();if(CTX.onizleme)window.scrollTo(0,y)}

/* ---------- dil ---------- */
function dil(en,kaydet){if(!H.getAttribute("data-title-tr"))H.setAttribute("data-title-tr",document.title);
 H.classList.toggle("en",en);H.lang=en?"en":"tr";document.title=en?(H.getAttribute("data-title-en")||H.getAttribute("data-title-tr")):H.getAttribute("data-title-tr");
 var b=$("#dil");if(b){b.textContent=en?"TR":"EN";b.setAttribute("aria-label",en?"Türkçe'ye geç":"Switch to English")}
 $$("[data-ph-en]").forEach(function(x){if(!x.dataset.phTr)x.dataset.phTr=x.placeholder||"";x.placeholder=en?x.dataset.phEn:x.dataset.phTr});
 $$("[data-al-en]").forEach(function(x){if(!x.dataset.alTr)x.dataset.alTr=x.getAttribute("aria-label")||"";x.setAttribute("aria-label",en?x.dataset.alEn:x.dataset.alTr)});
 if(kaydet)try{localStorage.setItem("bensay_dil",en?"en":"tr")}catch(e){}
 document.dispatchEvent(new CustomEvent("bn:dil"))}
function dilBaslat(){var q=/[?&]lang=(en|tr)/.exec(location.search),s=null;try{s=localStorage.getItem("bensay_dil")}catch(e){}dil(q?q[1]==="en":s==="en",!!q)}

/* ---------- üst menü, dil düğmesi, WhatsApp ---------- */
function baglantilar(){
 var db=$("#dil");if(db)db.onclick=function(){dil(!bnEn(),true)};
 var mb=$("#menuDg"),mn=$("#menu");if(mb&&mn)mb.onclick=function(){var a=mn.classList.toggle("ac");mb.setAttribute("aria-expanded",a)};
 if(mn)$$("a",mn).forEach(function(a){a.addEventListener("click",function(){mn.classList.remove("ac");mb&&mb.setAttribute("aria-expanded","false")})});
 $$("[data-wa]").forEach(function(a){a.href=bnWa(bnEn()&&a.dataset.waEn?a.dataset.waEn:a.dataset.wa);a.target="_blank";a.rel="noopener"});
}
document.addEventListener("bn:dil",function(){$$("[data-wa]").forEach(function(a){a.href=bnWa(bnEn()&&a.dataset.waEn?a.dataset.waEn:a.dataset.wa)})});

/* ---------- sayfa davranışları ---------- */
function davranislar(){
 /* proje filtresi */
 var fl=$("#filtre"),izg=$("#projeIzg");
 if(fl&&izg)$$("button",fl).forEach(function(b){b.addEventListener("click",function(){$$("button",fl).forEach(function(x){x.setAttribute("aria-pressed",x===b)});
  var f=b.dataset.f,n=0;$$(".pk",izg).forEach(function(k){var g=f==="hepsi"||k.dataset.kat===f;k.hidden=!g;if(g)n++});var bo=$("#filtreBos");if(bo)bo.hidden=n>0})});
 /* takip */
 var tk=$("#kodBak");
 if(tk){var tg=function(){var k=($("#kod").value||"").toUpperCase().replace(/[^A-Z0-9]/g,""),P=$("#portal");
  var t=function(o){return!o?"":typeof o==="string"?o:(bnEn()&&o.en?o.en:o.tr||"")},e=window.BNRender?BNRender.esc:String;
  fetch("veri/takip-demo.json",{cache:"no-cache"}).then(function(r){return r.json()}).then(function(D){var p=D[k];
   if(!p){P.innerHTML='<p class="acik"><span data-l="tr">Bu kodla proje bulunamadı. Deneme kodu: DEMO-2481</span><span data-l="en" lang="en">No project found for this code. Demo code: DEMO-2481</span></p>';return}
   P.innerHTML='<div class="etiket">'+e(t(p.baslik))+'</div><div class="top">%'+p.yuzde+'</div><div class="ilerleme"><i style="width:'+p.yuzde+'%"></i></div>'+p.asamalar.map(function(a,j){return'<div class="adim '+a.d+'"><b>'+(a.d==="ok"?"✓":j+1)+'</b><div><strong>'+e(t(a.ad))+'</strong><br><small class="not">'+e(t(a.not))+'</small></div></div>'}).join("")+'<p class="not">'+e(t(D._not))+'</p>'})};
  tk.addEventListener("click",tg);$("#kod").addEventListener("keydown",function(e){if(e.key==="Enter")tg()})}
 /* keşif formu */
 var rf=$("#randevuForm");
 if(rf){var msj=function(){var v=function(id){var e=$("#"+id);return e?e.value.trim():""};var tr=!bnEn();var s=function(id){var e=$("#"+id);return e&&e.selectedOptions[0]?e.selectedOptions[0].textContent:"-"};
   var g=v("rGun")?v("rGun").split("-").reverse().join("."):"";
   return(tr?"Merhaba, web sitenizden keşif talep ediyorum.":"Hello, I'd like to request a site visit via your website.")+
   "\n"+(tr?"Ad soyad: ":"Name: ")+(v("rAd")||"-")+"\n"+(tr?"Telefon: ":"Phone: ")+(v("rTel")||"-")+"\n"+(tr?"Alan tipi: ":"Space type: ")+s("rKonu")+"\n"+(tr?"Hizmet: ":"Service: ")+s("rHiz")+
   "\n"+(tr?"Konum: ":"Location: ")+(v("rKonum")||"-")+"\n"+(tr?"Tercih edilen gün: ":"Preferred day: ")+(g||"-")+(v("rNot")?"\n"+(tr?"Not: ":"Note: ")+v("rNot"):"")+(function(){var o=window.BN_MALIYET_OZET;try{o=o||sessionStorage.getItem("bn_maliyet_ozet")}catch(e){}return o?"\n"+o:""})()};
  var guncel=function(){$("#rMesaj").textContent=msj();$("#rGonder").href=bnWa(msj())};
  rf.addEventListener("input",guncel);rf.addEventListener("change",guncel);document.addEventListener("bn:dil",guncel);guncel();
  rf.addEventListener("submit",function(e){e.preventDefault();window.open(bnWa(msj()),"_blank","noopener")})}
 /* maliyet hesaplayıcı + araçlar */
 if(window.BNMaliyet&&window.BN_ICERIK)window.BNMaliyet.kur(window.BN_ICERIK);
 if(window.bnAraclarBaslat&&$("#planlayici")&&!window.bnAraclarKuruldu){window.bnAraclarKuruldu=1;window.bnAraclarBaslat()}
}

/* ---------- başlat ---------- */
function basla(){
 dilBaslat();baglantilar();
 var dinamik=SAYFA==="proje"&&CTX.p||SAYFA==="yazi"&&CTX.y;
 icerikYukle().then(function(s){
  if(s.ic){window.BN_ICERIK=s.ic;if(s.ciz||dinamik){ciz(s.ic);return}}
  davranislar();
 }).catch(function(){davranislar()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",basla);else basla();
})();
