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
/* 13 Kas 2026 egress duzeltmesi: veritabanindaki icerik hala Supabase Storage adresi tasiyorsa, yerelde sikiştırılmış karşılığı olan görselleri yerel yola cevirir (metin/duzen degismez). */
var YEREL_GORSEL={"mw5jx737-rn1po":"mw5jx737-rn1po.webp","mw5k8618-dta7z":"mw5k8618-dta7z.webp","mw5k87o0-4l1wo":"mw5k87o0-4l1wo.webp","mw5k8bbc-2vxkz":"mw5k8bbc-2vxkz.webp","mw5k8ei3-z82h8":"mw5k8ei3-z82h8.webp","mw5k8hpz-kwk4j":"mw5k8hpz-kwk4j.webp","mw5k8jlr-ynx4m":"mw5k8jlr-ynx4m.webp","mw5k8laq-u27r0":"mw5k8laq-u27r0.webp","mw5k8mga-9ukz0":"mw5k8mga-9ukz0.webp","mw5k8ns5-zndta":"mw5k8ns5-zndta.webp","mw5k8p41-5vnuz":"mw5k8p41-5vnuz.webp","mw5k8r5v-cgncm":"mw5k8r5v-cgncm.webp","mw5k8tfm-8r9h3":"mw5k8tfm-8r9h3.webp","mw5k8vi1-7cg5q":"mw5k8vi1-7cg5q.webp","mw5kfota-6kuux":"mw5kfota-6kuux.webp","mw5kfqn9-v73fp":"mw5kfqn9-v73fp.webp","mw5kfux3-7602e":"mw5kfux3-7602e.webp","mw5kg2x3-7ujcu":"mw5kg2x3-7ujcu.webp","mw5krrai-82ku3":"mw5krrai-82ku3.webp","mw5krumu-b0mfw":"mw5krumu-b0mfw.webp","mw5kry4m-sm9p4":"mw5kry4m-sm9p4.webp","mw5krzqb-a2edb":"mw5krzqb-a2edb.webp","mw5ks6ch-9mz9c":"mw5ks6ch-9mz9c.webp","mw5ksbpe-xk661":"mw5ksbpe-xk661.webp","mw5kszxu-t3tia":"mw5kszxu-t3tia.webp","mw5l6tnj-kchgq":"mw5l6tnj-kchgq.webp","mw5l70h0-3wkak":"mw5l70h0-3wkak.webp","mw5l71x8-r1dmo":"mw5l71x8-r1dmo.webp","mw5l78vh-48wp2":"mw5l78vh-48wp2.webp","mw5l7fny-2o7o5":"mw5l7fny-2o7o5.webp","mw5l7m3e-84a47":"mw5l7m3e-84a47.webp","mw5l9z6q-ma0p6":"mw5l9z6q-ma0p6.webp","mw5lbp9b-90viy":"mw5lbp9b-90viy.webp","mw5lco1n-uxj5h":"mw5lco1n-uxj5h.webp","mw5lcpny-t6uye":"mw5lcpny-t6uye.webp","mw5lf7no-ycqlw":"mw5lf7no-ycqlw.webp","mw5lf8g8-cez84":"mw5lf8g8-cez84.webp","mw5lf91j-0y0dl":"mw5lf91j-0y0dl.webp","mw5nhgu8-rlxh9":"mw5nhgu8-rlxh9.png","mw5niseb-pky2e":"mw5niseb-pky2e.png","mw5nqb78-7squo":"mw5nqb78-7squo.png","mw5nso7v-qj5iq":"mw5nso7v-qj5iq.svg","mw5nswpf-iu5bk":"mw5nswpf-iu5bk.png","mw5oa1by-ae0bz":"mw5oa1by-ae0bz.webp","mw5oa7g1-xci8k":"mw5oa7g1-xci8k.webp","mw5oabhn-107ub":"mw5oabhn-107ub.webp","mw5oaci7-cymbq":"mw5oaci7-cymbq.webp","mw5oadzq-6ikrn":"mw5oadzq-6ikrn.webp","mw5obawo-j6pj5":"mw5obawo-j6pj5.webp","mw696667-foa87":"mw696667-foa87.webp","mw696djr-8iimh":"mw696djr-8iimh.webp","mw696git-xsgql":"mw696git-xsgql.webp","mw696ib9-nbn41":"mw696ib9-nbn41.webp","mw696lht-3tr1o":"mw696lht-3tr1o.webp","mw696o8g-ml028":"mw696o8g-ml028.webp","mw696qjr-cyb23":"mw696qjr-cyb23.webp","mw696t9b-klxjl":"mw696t9b-klxjl.webp","mw69pgpb-mdsud":"mw69pgpb-mdsud.webp","mw6al3xa-350m3":"mw6al3xa-350m3.webp","mw6bhkgo-9y2gx":"mw6bhkgo-9y2gx.png","mwccialb-oknk9":"mwccialb-oknk9.jpeg","mwdi63pk-7bwdn":"mwdi63pk-7bwdn.webp","mwdi69d3-7goi8":"mwdi69d3-7goi8.webp","mwdi6cmm-hr6tq":"mwdi6cmm-hr6tq.webp","mwdi6ere-t6qt2":"mwdi6ere-t6qt2.webp","mwdi6gw8-86f5i":"mwdi6gw8-86f5i.webp","mwdi6j1h-94k90":"mwdi6j1h-94k90.webp","mwdi6lqr-rqed7":"mwdi6lqr-rqed7.webp","mwdi6nuj-942z7":"mwdi6nuj-942z7.webp","mwdi6s7f-tmerk":"mwdi6s7f-tmerk.webp","mwdi6u2i-tdt7v":"mwdi6u2i-tdt7v.webp","mwdi6w30-uvlvr":"mwdi6w30-uvlvr.webp","mwdi70nq-cagf2":"mwdi70nq-cagf2.webp","mwdi745f-ziucw":"mwdi745f-ziucw.webp","mwdi7b4i-39ybr":"mwdi7b4i-39ybr.webp","mwext6uw-jlohq":"mwext6uw-jlohq.webp","mwextft5-cgoin":"mwextft5-cgoin.webp","mwextjf8-yx08w":"mwextjf8-yx08w.webp","mwextn6y-k8ewr":"mwextn6y-k8ewr.webp"};
function gorselYerel(v){try{return JSON.parse(JSON.stringify(v).replace(/https:\/\/ctlbhwbccqgwmtqbwtfs\.supabase\.co\/storage\/v1\/object\/public\/site-gorsel\/bensay\/([A-Za-z0-9_-]+)\.(?:png|svg|jpe?g)/g,function(m,b){return YEREL_GORSEL[b]?"gorsel/"+YEREL_GORSEL[b]:m}))}catch(e){return v}}
function sbIcerik(){var sb=CFG.sb;if(!sb||!sb.url)return Promise.reject(0);
 return zamanli(fetch(sb.url+"/rest/v1/site_icerik?site=eq."+encodeURIComponent(CFG.site||"bensay")+"&select=veri,guncelleme",{headers:{apikey:sb.key}}),2500)
  .then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){var v=j&&j[0]&&j[0].veri;if(!v||!v.sayfalar)throw 0;v=gorselYerel(v);v.meta=v.meta||{};v.meta.guncelleme=j[0].guncelleme;return v})}
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
 cerezBagla();
}
/* ---------- 7 Kas: çerez bandı + ölçüm (GA4 / GTM / Meta piksel) — panelden; kapalı/boşsa hiçbir şey yüklenmez ---------- */
var CEREZ_ANAHTAR="bensay_cerez";
function cerezKarar(){try{return localStorage.getItem(CEREZ_ANAHTAR)}catch(e){return null}}
function cerezBagla(){var c=$("#bnCerez");if(!c)return;
 if(!CTX.onizleme&&cerezKarar())return;c.hidden=false;
 $$("[data-cerez]",c).forEach(function(b){b.onclick=function(){var k=b.getAttribute("data-cerez");if(!CTX.onizleme)try{localStorage.setItem(CEREZ_ANAHTAR,k)}catch(e){}c.hidden=true;if(k==="kabul")izleyiciler(window.BN_ICERIK)}})}
var izYuklendi=false;
function betik(src){var s=document.createElement("script");s.async=true;s.src=src;document.head.appendChild(s)}
function izleyiciler(ic){
 if(izYuklendi||!ic||CTX.onizleme)return;var st=ic.site||{};if(!st.yayinda)return;
 if((ic.cerez||{}).ac&&cerezKarar()!=="kabul")return;
 var ga=String(st.ga||"").trim(),gtm=String(st.gtm||"").trim(),px=String(st.metaPiksel||"").trim();
 if(/^(G|AW)-[A-Z0-9]{4,20}$/i.test(ga)){izYuklendi=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",ga);betik("https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(ga))}
 if(/^GTM-[A-Z0-9]{4,12}$/i.test(gtm)){izYuklendi=true;window.dataLayer=window.dataLayer||[];dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});betik("https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(gtm))}
 if(/^\d{6,20}$/.test(px)){izYuklendi=true;var n=window.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!window._fbq)window._fbq=n;n.push=n;n.loaded=true;n.version="2.0";n.queue=[];betik("https://connect.facebook.net/en_US/fbevents.js");fbq("init",px);fbq("track","PageView")}
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
   return(tr?(rf.getAttribute("data-giris")||"Merhaba, web sitenizden keşif talep ediyorum."):(rf.getAttribute("data-giris-en")||"Hello, I'd like to request a site visit via your website."))+
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
  if(s.ic){window.BN_ICERIK=s.ic;izleyiciler(s.ic);if(s.ciz||dinamik){ciz(s.ic);return}}
  davranislar();
 }).catch(function(){davranislar()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",basla);else basla();
})();
