/* CSB Yol Yapı prototipleri — ortak veri ve çalışan özellikler (fiyat ve proje verileri temsilî; gerçek tarife/projeler firmadan alınınca değişir) */
(function(){
var $=function(s,k){return (k||document).querySelector(s);},$$=function(s,k){return [].slice.call((k||document).querySelectorAll(s));};
function h(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function saat(){var d=new Date();return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);}
function tl(n){return Math.round(n).toLocaleString("tr-TR");}
var GUN=["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"];

var D={
 ekipman:[
  {k:"bekoloder",ad:"Kazıcı yükleyici (bekoloder)",o:"Kanal, kazı, yükleme",g:8500,op:true,ag:true,img:"saha"},
  {k:"mini",ad:"Mini ekskavatör 1,7 t",o:"Dar alan, bahçe, altyapı",g:5500,op:true,ag:false,img:"ekskavator"},
  {k:"ekskavator",ad:"Paletli ekskavatör 20 t",o:"Toprak işleri, yarma",g:14000,op:true,ag:true,img:"ekskavator"},
  {k:"silindir10",ad:"Tandem silindir 10 t",o:"Asfalt sıkıştırma",g:11000,op:true,ag:true,img:"kah-silindir"},
  {k:"silindir25",ad:"Küçük silindir 2,5 t",o:"Asfalt sıkıştırma, otopark, yama",g:4500,op:true,ag:false,img:"kompaktor"},
  {k:"finiser",ad:"Asfalt finişeri",o:"Sıcak asfalt serimi",g:22000,op:true,ag:true,img:"finiser"},
  {k:"greyder",ad:"Greyder",o:"Stabilize, tesviye",g:15000,op:true,ag:true,img:"greyder"},
  {k:"damper",ad:"Damperli kamyon",o:"Malzeme ve hafriyat taşıma",g:7500,op:true,ag:false,img:"kamyon"},
  {k:"kesme",ad:"Asfalt kesme makinesi",o:"Derz ve yama kesimi",g:2500,op:false,ag:false,img:"kesme"},
  {k:"kompaktor",ad:"Plakalı kompaktör",o:"Parke altı, kanal dolgusu",g:1200,op:false,ag:false,img:"parke"}
 ],
 ilce:[["Muratpaşa",10],["Kepez",15],["Konyaaltı",20],["Aksu",20],["Döşemealtı",30],["Serik",40],["Kemer",45],["Korkuteli",55],["Manavgat",75],["Alanya",135]],
 proje:[
  {kat:"Asfalt",ad:"Site içi yol asfaltı",yer:"Lara, Muratpaşa",m:"4.200 m² · 5 cm aşınma",sure:"3 gün",ek:"Finişer, 10 t silindir, 2 kamyon",img:"bitmis"},
  {kat:"Asfalt",ad:"Otopark kaplama",yer:"Kepez",m:"2.800 m²",sure:"2 gün",ek:"Finişer, 2,5 t silindir",img:"kompaktor"},
  {kat:"Parke",ad:"Kilit parke ve bordür",yer:"Konyaaltı",m:"1.600 m² · 420 m bordür",sure:"6 gün",ek:"Plakalı kompaktör, bekoloder",img:"parke"},
  {kat:"Altyapı",ad:"Yağmur suyu kanalı kazısı",yer:"Aksu",m:"380 m hat",sure:"5 gün",ek:"Ekskavatör, damperli kamyon",img:"ekskavator"},
  {kat:"Altyapı",ad:"Stabilize yol ve tesviye",yer:"Döşemealtı",m:"1,2 km",sure:"4 gün",ek:"Greyder, 10 t silindir",img:"greyder"},
  {kat:"Kiralama",ad:"Operatörlü silindir kiralama",yer:"Serik",m:"12 gün",sure:"12 gün",ek:"10 t tandem silindir",img:"kah-silindir"}
 ],
 blog:[
  {id:"asfalt-kalinlik",kat:"Asfalt",ad:"Site içi yol ve otopark asfaltı kaç cm olmalı?",dk:4,img:"bitmis",
   ozet:"Binek araç otoparkı ile kamyon giren yolun kalınlığı aynı olmaz. Alt temel atlanırsa asfalt bir kışta oturur.",
   g:"<p>Asfaltın ömrünü üstteki birkaç santim değil, altındaki temel belirler. Sıkıştırılmış kırmataş alt temel ve temel tabakası olmadan dökülen asfalt ilk yağmur sezonunda oturur.</p><h4>Kabaca ayrım</h4><p>Yalnız binek araç giren otopark ve site içi yollarda tek kat aşınma tabakası çoğu zaman yeterlidir. Servis aracı, çöp kamyonu ya da tır giriyorsa binder + aşınma olarak iki kat ve daha kalın temel gerekir.</p><h4>Doğru kalınlık için</h4><p>Zemin, trafik ve eğim yerinde görülmeden kesin kalınlık söylenmez. Keşifte bu üçüne bakar, metrajı ona göre çıkarırız.</p>",
   seo:"Hedef arama: \"asfalt kaç cm olmalı\", \"otopark asfalt fiyatı Antalya\" · iç bağlantı: metraj hesabı"},
  {id:"silindir-secimi",kat:"Kiralama",ad:"Silindir kiralarken hangi tonaj? 2,5 t ile 10 t farkı",dk:3,img:"kah-silindir",
   ozet:"Küçük alanda büyük silindir zor döner, bordürü zorlar; geniş yolda küçük silindir sıkıştırmayı tutturamaz.",
   g:"<p><b>Küçük tandem silindir (2-3 t):</b> otopark, site içi, yama, kaldırım kenarı. Dar alanda döner, taşıması ucuzdur.</p><p><b>Tandem silindir (8-10 t):</b> cadde ve yol asfaltı, finişer arkası.</p><p><b>Toprak silindiri:</b> dolgu ve stabilize işleri; asfaltta kullanılmaz.</p>",
   seo:"Hedef arama: \"silindir kiralama Antalya\", \"operatörlü silindir günlük fiyat\""},
  {id:"parke-asfalt",kat:"Parke",ad:"Site yolu için parke taşı mı, asfalt mı?",dk:4,img:"parke",
   ozet:"Parke sökülüp geri döşenebilir ama yavaş; asfalt hızlı ve sessiz ama yaması iz bırakır.",
   g:"<p><b>Parke:</b> altından boru/kablo geçecekse sökülüp aynı taşla geri döşenebilir. Döşeme süresi uzundur; kum yatağı ve bordür şarttır.</p><p><b>Asfalt:</b> geniş alanda bir iki günde biter, araç gürültüsü azdır. Kazı sonrası yaması belli olur.</p><h4>Pratik kural</h4><p>Altyapısı sık kazılacak yerde parke; altyapısı oturmuş, trafiği yoğun yerde asfalt.</p>",
   seo:"Hedef arama: \"parke taşı mı asfalt mı\", \"site yolu parke fiyatı\""},
  {id:"is-deneyim",kat:"İhale",ad:"Kamu işlerinde iş deneyimi: alt yüklenicinin saklaması gereken belgeler",dk:4,img:"greyder",
   ozet:"Belediye ve kamu işlerinde yeterlik için iş deneyimi istenir. Yaptığınız işi belgelemek için bugünden tutmanız gerekenler.",
   g:"<p>Kamu ihalelerinde iş deneyimi, idarenin düzenlediği belgelerle gösterilir. Alt yüklenici olarak çalışıyorsanız sözleşmeler ve idareye bildirilen alt yüklenici kaydı önem taşır.</p><h4>Şimdiden yapılacaklar</h4><p>Her işin sözleşmesini, hakediş ve faturalarını, iş bitim tutanağını ayrı klasörde saklayın; fotoğrafları tarihli tutun.</p><p class='cg-not'>Genel bilgidir; başvuru öncesi güncel mevzuatı ve ilgili idareyi kontrol edin.</p>",
   seo:"Hedef arama: \"alt yüklenici iş deneyim\", \"yol yapım ihale yeterlik\""}
 ],
 soz:{
  tr:{ust:"Yol yapımı · asfalt · iş makinesi kiralama · Antalya",bas:"Yolu yapar, makinesini getiririz.",alt:"Asfalt, parke, altyapı ve operatörlü iş makinesi kiralama. Müsait makineyi görün, kiralama teklifini anında alın.",cta:"Makine kirala",cta2:"Keşif ve teklif"},
  en:{ust:"Road works · asphalt · equipment rental · Antalya",bas:"We build the road and bring the machines.",alt:"Asphalt, paving, infrastructure and equipment rental with operator. See what is available and get a rental quote instantly.",cta:"Rent equipment",cta2:"Site visit & quote"},
  ar:{ust:"إنشاء الطرق · الأسفلت · تأجير المعدات · أنطاليا",bas:"نبني الطريق ونحضر المعدات.",alt:"أسفلت، رصف، بنية تحتية، وتأجير معدات ثقيلة مع مشغّل. اطّلع على المعدات المتاحة واحصل على عرض فوري.",cta:"استأجر معدة",cta2:"معاينة وعرض سعر"}
 }
};

var U={D:D};
U.fil=function(){var a=document.createElement("a");a.className="cg-fil";a.href="https://dijitabela.com.tr/";a.target="_blank";a.rel="noopener";a.textContent="ÖRNEK · DİJİTABELA";document.body.appendChild(a);};

U.dil=function(){
 $$(".cg-dil").forEach(function(k){k.innerHTML=["tr","en","ar"].map(function(l){return '<button type="button" data-l="'+l+'" aria-label="'+l.toUpperCase()+'"><span>'+l.toUpperCase()+'</span></button>';}).join("");
  $$("button",k).forEach(function(b){b.onclick=function(){U.dilSec(b.getAttribute("data-l"));};});});
 U.dilSec("tr");
};
U.dilSec=function(l){var s=D.soz[l];$$("[data-d]").forEach(function(e){var v=s[e.getAttribute("data-d")];if(v)e.textContent=v;});
 $$(".cg-dil-alan").forEach(function(e){e.setAttribute("dir",l==="ar"?"rtl":"ltr");e.setAttribute("lang",l);});
 $$(".cg-dil button").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-l")===l);});};

/* SEKTÖRDE İLK: ekipman müsaitlik takvimi + anında kiralama teklifi */
function doluMu(ek,i){var s=0;for(var c=0;c<ek.k.length;c++)s+=ek.k.charCodeAt(c);return ((i*7+s)%9===0)||((i+s)%11===0);}
U.kirala=function(el,secili){
 var bugun=new Date();bugun.setHours(0,0,0,0);
 var st={ek:D.ekipman.filter(function(e){return e.k===secili;})[0]||D.ekipman[3],bas:null,son:null,ilce:"Muratpaşa",op:true};
 function gun(i){var d=new Date(bugun);d.setDate(d.getDate()+i+1);return d;}
 function tr(d){return d.toLocaleDateString("tr-TR",{day:"numeric",month:"short"});}
 function ciz(){
  var e=st.ek;
  var html='<div class="cg-form"><label>Makine<select id="kE">'+D.ekipman.map(function(x){return '<option value="'+x.k+'"'+(x.k===e.k?" selected":"")+'>'+x.ad+' · '+tl(x.g)+' TL/gün</option>';}).join("")+'</select></label></div>';
  html+='<p class="cg-not" style="margin:10px 0 6px">Önümüzdeki 21 gün · başlangıç ve bitiş gününe dokunun · çizgili = dolu</p><div class="cg-tak">';
  for(var i=0;i<21;i++){var d=gun(i),dolu=doluMu(e,i),sec=st.bas!==null&&i>=st.bas&&i<=(st.son===null?st.bas:st.son);
   html+='<button type="button" data-g="'+i+'" class="'+(dolu?"dolu ":"")+(sec?"sec":"")+'"'+(dolu?' aria-disabled="true" title="Dolu"':"")+'><small>'+GUN[d.getDay()]+'</small>'+d.getDate()+'</button>';}
  html+='</div><div class="cg-form" style="margin-top:12px"><div class="iki"><label>Şantiye (ilçe)<select id="kI">'+D.ilce.map(function(x){return '<option'+(x[0]===st.ilce?" selected":"")+'>'+x[0]+'</option>';}).join("")+'</select></label><label>Operatör<select id="kO"'+(e.op?"":" disabled")+'><option value="1"'+(st.op&&e.op?" selected":"")+'>Operatörlü</option><option value="0"'+(!(st.op&&e.op)?" selected":"")+'>Operatörsüz</option></select></label></div></div><div id="kS" style="margin-top:12px"></div>';
  el.innerHTML=html;
  $("#kE",el).onchange=function(){st.ek=D.ekipman.filter(function(x){return x.k===$("#kE",el).value;})[0];st.bas=st.son=null;ciz();};
  $("#kI",el).onchange=function(){st.ilce=this.value;sonuc();};
  $("#kO",el).onchange=function(){st.op=this.value==="1";sonuc();};
  $$(".cg-tak button",el).forEach(function(b){b.onclick=function(){var i=+b.getAttribute("data-g");if(doluMu(st.ek,i))return;
   if(st.bas===null||st.son!==null){st.bas=i;st.son=null;}else if(i<st.bas){st.bas=i;}else{st.son=i;}ciz();};});
  sonuc();
 }
 function sonuc(){var e=st.ek,k=$("#kS",el);
  if(st.bas===null){k.innerHTML='<p class="cg-not">Gün seçin; fiyat ve müsaitlik anında hesaplanır.</p>';return;}
  var son=st.son===null?st.bas:st.son,n=son-st.bas+1,cak=0;
  for(var i=st.bas;i<=son;i++)if(doluMu(e,i))cak++;
  if(cak){var grup=e.o.split(",")[0];var alt=D.ekipman.filter(function(x){if(x.k===e.k||x.o.split(",")[0]!==grup)return false;for(var j=st.bas;j<=son;j++)if(doluMu(x,j))return false;return true;})[0];
   var bos=null;for(var s=0;s+n<=21&&bos===null;s++){var ok=true;for(var j=s;j<s+n;j++)if(doluMu(e,j)){ok=false;break;}if(ok)bos=s;}
   k.innerHTML='<div class="cg-sonuc"><b>Seçtiğiniz '+n+' günün '+cak+' günü dolu.</b>'+(bos!==null?'<span>'+e.ad+' için ilk boş '+n+' gün: <b>'+tr(gun(bos))+' – '+tr(gun(bos+n-1))+'</b></span><button type="button" class="cg-btn ikincil" id="kB">Bu tarihlere al</button>':'<span>21 gün içinde bu uzunlukta boş aralık yok; ekip sizi arayıp planlasın.</span>')+(alt?'<span>Aynı tarihlerde boş benzer makine: <b>'+alt.ad+'</b></span>':"")+'</div>';
   var kb=$("#kB",k);if(kb)kb.onclick=function(){st.bas=bos;st.son=bos+n-1;ciz();};return;}
  var ind=n>=26?0.30:n>=6?0.15:0,opsuz=(e.op&&!st.op)?0.25:0;
  var kira=e.g*n*(1-ind)*(1-opsuz),km=(D.ilce.filter(function(x){return x[0]===st.ilce;})[0]||[0,10])[1];
  var nak=e.ag?Math.max(3500,km*2*90):Math.max(1200,km*2*35),ara=kira+nak,kdv=ara*0.2;
  var no="CSB-K"+(100+Math.floor(Math.random()*900));
  k.innerHTML='<div class="cg-sonuc"><small>Anında kiralama teklifi · '+no+'</small><span><b>'+e.ad+'</b> · '+n+' gün · '+tr(gun(st.bas))+' – '+tr(gun(son))+' · '+st.ilce+' · '+(e.op&&st.op?"operatörlü":"operatörsüz")+'</span>'+
   '<table class="cg-kt"><tr><td>Kira ('+tl(e.g)+' TL × '+n+' gün'+(ind?' · %'+ind*100+' uzun süre indirimi':"")+(opsuz?' · operatörsüz −%25':"")+')</td><td>'+tl(kira)+' TL</td></tr><tr><td>Nakliye gidiş-dönüş ('+(e.ag?"lowbed":"kamyonet")+', ~'+km+' km)</td><td>'+tl(nak)+' TL</td></tr><tr><td>KDV %20</td><td>'+tl(kdv)+' TL</td></tr><tr class="t"><td>Toplam</td><td>'+tl(ara+kdv)+' TL</td></tr></table>'+
   '<button type="button" class="cg-btn" id="kR">Makineyi 2 saat ayırt</button><small>Yakıt kiralayana aittir'+(e.op&&st.op?"; operatör dahil":"")+'. Ayırma isteği ekibe WhatsApp\'tan tek satır özetle düşer. Örnek fiyatlar temsilîdir.</small></div>';
  $("#kR",k).onclick=function(){this.outerHTML='<span style="font-weight:700">✓ '+no+' 2 saatliğine ayrıldı; ekip 15 dk içinde arayıp teyit eder. (Örnekte kayıt yapılmaz.)</span>';};
 }
 ciz();
};

/* metraj hesabı: asfalt tonajı / parke adedi */
U.metraj=function(el){
 el.innerHTML='<div class="cg-blog-f"><button type="button" class="on" data-m="asfalt">Asfalt</button><button type="button" data-m="parke">Parke + bordür</button></div><div id="mF"></div><div class="cg-sonuc" id="mS" style="margin-top:12px"></div><p class="cg-not" style="margin-top:6px">Ön hesap; kesin metraj keşifte çıkar.</p>';
 var mod="asfalt";
 function form(){$("#mF",el).innerHTML=mod==="asfalt"?'<div class="cg-form"><div class="iki"><label>Alan (m²)<input id="mA" inputmode="decimal" value="1500"></label><label>Kalınlık<select id="mK"><option value="4">4 cm · binek otopark</option><option value="5" selected>5 cm · site içi yol</option><option value="7">7 cm · servis aracı</option><option value="10">10 cm · 2 kat, ağır trafik</option></select></label></div></div>':'<div class="cg-form"><div class="iki"><label>Alan (m²)<input id="mA" inputmode="decimal" value="600"></label><label>Taş<select id="mK"><option value="50">Kilit parke 20×10 cm (50 adet/m²)</option><option value="25">Kare parke 20×20 cm (25 adet/m²)</option><option value="11">Kare parke 30×30 cm (≈11 adet/m²)</option></select></label></div><label>Bordür (metre)<input id="mB" inputmode="decimal" value="120"></label></div>';
  $$("input,select",$("#mF",el)).forEach(function(x){x.oninput=x.onchange=hesap;});hesap();}
 function hesap(){var a=parseFloat($("#mA",el).value)||0,k=parseFloat($("#mK",el).value);
  if(mod==="asfalt"){var ton=a*k/100*2.4,kam=Math.ceil(ton/25),gun=Math.max(1,Math.ceil(ton/350));
   $("#mS",el).innerHTML='<small>'+tl(a)+' m² × '+k+' cm × 2,4 t/m³</small><span class="b">≈ '+tl(ton)+' ton asfalt</span><span>≈ '+kam+' kamyon sefer · ≈ <b>'+gun+' iş günü</b></span><span>Makineler: asfalt finişeri, '+(a>2500?"10 t tandem silindir":"2,5 t + 10 t silindir")+', damperli kamyon</span><a class="cg-btn ikincil" href="#kirala" style="margin-top:6px">Bu iş için makine ayırt →</a>';}
  else{var b=parseFloat($("#mB",el).value)||0,adet=a*k*1.03,bor=Math.ceil(b*2*1.02),kum=a*0.05;
   $("#mS",el).innerHTML='<small>'+tl(a)+' m² · %3 fire dahil</small><span class="b">≈ '+tl(adet)+' adet parke</span><span>'+tl(bor)+' adet bordür (50 cm) · ≈ '+tl(kum)+' m³ yatak kumu · ≈ <b>'+Math.max(1,Math.ceil(a/180))+' iş günü</b></span><span>Makineler: plakalı kompaktör, bekoloder</span>';}}
 $$("[data-m]",el).forEach(function(b){b.onclick=function(){mod=b.getAttribute("data-m");$$("[data-m]",el).forEach(function(x){x.classList.toggle("on",x===b);});form();};});
 form();
};

/* proje referansları + şantiye galerisi */
U.proje=function(el,kok){kok=kok||"../";var kats=["Tümü","Asfalt","Parke","Altyapı","Kiralama"];
 el.innerHTML='<div class="cg-blog-f">'+kats.map(function(k,i){return '<button type="button" class="'+(i?"":"on")+'" data-k="'+k+'">'+k+'</button>';}).join("")+'</div><div class="cg-proje"></div><p class="cg-not" style="margin-top:8px">Temsilî projeler ve görseller; kendi işleriniz, tarih ve fotoğraflarıyla değişir.</p>';
 function ciz(k){$(".cg-proje",el).innerHTML=D.proje.filter(function(p){return k==="Tümü"||p.kat===k;}).map(function(p){return '<figure class="pj"><img src="'+kok+'img/k/'+p.img+'.jpg" alt="'+h(p.ad)+'" loading="lazy"><figcaption><small>'+p.kat+' · '+p.yer+'</small><b>'+p.ad+'</b><span>'+p.m+' · '+p.sure+'</span><span class="ek">'+p.ek+'</span></figcaption></figure>';}).join("");}
 $$(".cg-blog-f button",el).forEach(function(b){b.onclick=function(){$$(".cg-blog-f button",el).forEach(function(x){x.classList.toggle("on",x===b);});ciz(b.getAttribute("data-k"));};});
 ciz("Tümü");
};

U.blog=function(el,kok){kok=kok||"../";var kats=["Tümü"].concat(D.blog.map(function(b){return b.kat;}).filter(function(v,i,a){return a.indexOf(v)===i;}));
 el.innerHTML='<div class="cg-blog-f">'+kats.map(function(k,i){return '<button type="button" class="'+(i?"":"on")+'" data-k="'+k+'">'+k+'</button>';}).join("")+'</div><div class="cg-blog-l"></div>';
 function ciz(k){$(".cg-blog-l",el).innerHTML=D.blog.filter(function(b){return k==="Tümü"||b.kat===k;}).map(function(b){return '<a class="bk" href="#'+b.id+'" data-oku="'+b.id+'"><img src="'+kok+'img/k/'+b.img+'.jpg" alt="" loading="lazy"><div><small>'+b.kat+' · '+b.dk+' dk okuma</small><h3>'+b.ad+'</h3><p>'+b.ozet+'</p></div></a>';}).join("");
  $$("[data-oku]",el).forEach(function(a){a.onclick=function(e){e.preventDefault();U.oku(a.getAttribute("data-oku"),kok);};});}
 $$(".cg-blog-f button",el).forEach(function(b){b.onclick=function(){$$(".cg-blog-f button",el).forEach(function(x){x.classList.toggle("on",x===b);});ciz(b.getAttribute("data-k"));};});
 ciz("Tümü");
};
U.oku=function(id,kok){var b=D.blog.filter(function(x){return x.id===id;})[0];var o=$(".cg-okur");if(!o){o=document.createElement("div");o.className="cg-okur";o.onclick=function(e){if(e.target===o)o.classList.remove("ac");};document.body.appendChild(o);}
 o.innerHTML='<article role="dialog" aria-modal="true" aria-label="'+h(b.ad)+'"><button class="kapat" aria-label="Kapat">×</button><small>'+b.kat+' · '+b.dk+' dk okuma · CSB Yol Yapı Blog</small><h3>'+b.ad+'</h3><img src="'+kok+'img/'+b.img+'.jpg" alt="" style="width:100%;border-radius:4px;margin:8px 0">'+b.g+'<div class="seo"><b>SEO notu (yalnız örnekte görünür):</b> '+b.seo+'. Her yazı Google\'da kendi adresiyle listelenir; ayda 4 yazı aylık pakette.</div></article>';
 $(".kapat",o).onclick=function(){o.classList.remove("ac");};o.classList.add("ac");};

/* 3 dilli asistan — demo */
U.asistan=function(){
 var b=document.createElement("button");b.className="cg-as-ac";b.type="button";b.innerHTML='<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.3-.7-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4Z"/></svg>Sorun, hemen yanıtlayalım';
 var p=document.createElement("div");p.className="cg-as";p.innerHTML='<header><div><b>CSB Yol Yapı</b><small>Asistan · TR · EN · AR</small></div><button type="button" aria-label="Kapat">×</button></header><div class="akis"></div><div class="hiz"><button type="button">Yarın silindir boş mu?</button><button type="button">Otopark asfaltı m² kaç para?</button><button type="button">Do you rent an excavator with operator?</button><button type="button">هل لديكم فينيشر أسفلت؟</button></div><form><input placeholder="Mesaj yazın (TR / EN / AR)" aria-label="Mesaj"><button aria-label="Gönder">➤</button></form><div class="not">Örnek: cevaplar demo verisiyle. Gerçekte asistan yalnız firmanın onayladığı bilgiyi kullanır; fiyat pazarlığını ekibe devreder.</div>';
 document.body.appendChild(b);document.body.appendChild(p);
 var akis=$(".akis",p),soru=0;
 function bal(t,k){var d=document.createElement("div");d.className="cg-bal "+k;d.innerHTML=h(t)+(k==="ozet"?"":'<time>'+saat()+'</time>');akis.appendChild(d);akis.scrollTop=1e6;}
 function cevap(m){var l=/[؀-ۿ]/.test(m)?"ar":/\b(rent|excavator|price|do you|how|the|roller)\b/i.test(m)?"en":"tr";var t=m.toLocaleLowerCase("tr");
  var C={
   tr:[/silindir|bekoloder|ekskavat|kepçe|finişer|greyder|boş mu|müsait|kirala/,"Yarın 10 t tandem silindir boş. Operatörlü günlük 11.000 TL + KDV, nakliye ilçeye göre. Şantiye hangi ilçede? Takvimden tarihi seçerseniz makineyi 2 saat sizin için ayırırım.",/asfalt|m²|metrekare|otopark|parke/,"Fiyat alan, kalınlık ve zemine göre değişiyor. Kaç m² ve hangi araçlar girecek (binek / servis / kamyon)? Metraj hesabından tonajı görüp ücretsiz keşif günü ayarlayabiliriz.",/keşif|gelir misiniz|adres/,"Antalya merkez ilçelerde keşif ücretsiz, genelde 1-2 gün içinde. Uygun gün ve saatinizi yazar mısınız?","Mesajınızı aldım. Ekibimiz mesai saatinde döner; şantiye yeri ve iş türünü yazarsanız hazırlığa başlarız."],
   en:[/excavator|roller|rent|operator|paver/,"Yes. 20 t tracked excavator with operator: 14,000 TRY/day + VAT, transport by district. Which dates and where is the site? You can hold a machine for 2 hours from the calendar.",/price|asphalt|cost/,"Price depends on area, thickness and base. How many m² and what traffic? Site visits in central Antalya are free.","Thanks! Our team will reply during working hours. Please share the site location and job type."],
   ar:[/فينيشر|معدة|حفار|تأجير|مدحلة/,"نعم، لدينا فينيشر أسفلت مع مشغّل. السعر اليومي 22,000 ليرة + الضريبة، والنقل حسب الموقع. ما التاريخ وموقع المشروع؟",/سعر|كم/,"السعر حسب المساحة والسماكة. كم مترًا مربعًا؟ المعاينة مجانية في مركز أنطاليا.","شكرًا! سيرد فريقنا خلال ساعات العمل."]
  }[l];
  for(var i=0;i<C.length-1;i+=2){if(C[i].test(t))return C[i+1];}return C[C.length-1];}
 function gonder(m){if(!m)return;bal(m,"ben");var y=document.createElement("div");y.className="cg-bal o";y.textContent="…";akis.appendChild(y);
  setTimeout(function(){y.remove();bal(cevap(m),"o");soru++;if(soru===2)bal("Ekibe düşen özet: "+new Date().toLocaleDateString("tr-TR")+" · yeni müşteri · konu: \""+m.slice(0,60)+"\" · dil otomatik · dönüş bekliyor","ozet");},900);}
 b.onclick=function(){p.classList.toggle("ac");if(!akis.children.length)bal("Merhaba, CSB Yol Yapı'ya hoş geldiniz. Makine kiralama, asfalt, parke ya da keşif; Türkçe, İngilizce veya Arapça yazabilirsiniz.","o");};
 $("header button",p).onclick=function(){p.classList.remove("ac");};
 $$(".hiz button",p).forEach(function(x){x.onclick=function(){gonder(x.textContent);};});
 $("form",p).onsubmit=function(e){e.preventDefault();var i=$("input",p);gonder(i.value.trim());i.value="";};
 U.asistanAc=function(){p.classList.add("ac");if(!akis.children.length)b.onclick();};
};

U.basla=function(kok,sec){U.fil();U.dil();var k=$("#kirala-arac");if(k)U.kirala(k,sec);var m=$("#metraj");if(m)U.metraj(m);var pr=$("#projeler");if(pr)U.proje(pr,kok);var bl=$("#blog");if(bl)U.blog(bl,kok);U.asistan();
 $$("[data-asistan]").forEach(function(x){x.onclick=function(e){e.preventDefault();U.asistanAc();};});
 $$("[data-ek]").forEach(function(x){x.addEventListener("click",function(){var s=$("#kE");if(s){s.value=x.getAttribute("data-ek");s.dispatchEvent(new Event("change"));}});});};
window.CG=U;
})();
