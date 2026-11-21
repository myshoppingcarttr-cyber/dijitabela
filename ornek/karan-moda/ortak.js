/* Karan Moda örnek tasarım - ortak mantık. Görseller SVG ile çizilir, dış görsel yok. */
(function(){
var WA="905019452184";
var URUN=[
{id:"mont-1",ad:"Premium Mont",kat:"Mont",fiyat:2099,renk:"#1d2a3a",tip:"mont",not:"Kışlık, dolgulu"},
{id:"ceket-1",ad:"Premium Ceket",kat:"Ceket",fiyat:2000,renk:"#3b3a36",tip:"ceket",not:"Günlük şık"},
{id:"hirka-1",ad:"Premium Hırka · Antrasit",kat:"Hırka",fiyat:1099,renk:"#40454d",tip:"hirka",not:"Fermuarlı"},
{id:"hirka-2",ad:"Premium Hırka · Bordo",kat:"Hırka",fiyat:1099,renk:"#6b1f2c",tip:"hirka",not:"Fermuarlı"},
{id:"hirka-3",ad:"Premium Hırka · Haki",kat:"Hırka",fiyat:1099,renk:"#4b5a3c",tip:"hirka",not:"Fermuarlı"},
{id:"triko-1",ad:"Premium Triko · Lacivert",kat:"Triko",fiyat:1099,renk:"#1f3358",tip:"triko",not:"Yumuşak dokuma"},
{id:"triko-2",ad:"Premium Triko · Kum",kat:"Triko",fiyat:1099,renk:"#b9a07a",tip:"triko",not:"Yumuşak dokuma"},
{id:"sweat-1",ad:"Premium Sweat · Siyah",kat:"Sweat",fiyat:999.9,renk:"#17181c",tip:"sweat",not:"Üç iplik"},
{id:"sweat-2",ad:"Premium Sweat · Gri",kat:"Sweat",fiyat:999.9,renk:"#8a8f98",tip:"sweat",not:"Üç iplik"},
{id:"sweat-3",ad:"Premium Sweat · Krem",kat:"Sweat",fiyat:999.9,renk:"#d8ccb4",tip:"sweat",not:"Üç iplik"},
{id:"takim-1",ad:"Eşofman Takımı · Siyah",kat:"Eşofman Takımı",fiyat:null,renk:"#1a1b1f",tip:"takim",not:"Üst + alt"},
{id:"takim-2",ad:"Eşofman Takımı · Gri",kat:"Eşofman Takımı",fiyat:null,renk:"#767b84",tip:"takim",not:"Üst + alt"},
{id:"alt-1",ad:"Eşofman Altı · Siyah",kat:"Eşofman Altı",fiyat:null,renk:"#1a1b1f",tip:"alt",not:"Paça manşetli"},
{id:"alt-2",ad:"Eşofman Altı · Gri",kat:"Eşofman Altı",fiyat:null,renk:"#7b7f87",tip:"alt",not:"Paça manşetli"},
{id:"pant-1",ad:"Pantolon · Bej",kat:"Pantolon",fiyat:null,renk:"#bfae8e",tip:"pant",not:"Rahat kesim"},
{id:"pant-2",ad:"Pantolon · Antrasit",kat:"Pantolon",fiyat:null,renk:"#3a3e46",tip:"pant",not:"Rahat kesim"},
{id:"tisort-1",ad:"T-Shirt · Beyaz",kat:"T-Shirt",fiyat:null,renk:"#e9e9e6",tip:"tisort",not:"Bisiklet yaka"},
{id:"tisort-2",ad:"T-Shirt · Siyah",kat:"T-Shirt",fiyat:null,renk:"#18191d",tip:"tisort",not:"Bisiklet yaka"}
];
var KATS=["Tümü","Mont","Ceket","Hırka","Triko","Sweat","Eşofman Takımı","Eşofman Altı","Pantolon","T-Shirt"];
var BEDEN=["S","M","L","XL","XXL"];
function tl(n){if(n==null)return"Fiyat için yazın";return n.toLocaleString("tr-TR",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2})+" TL"}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function shade(h,a){var n=parseInt(h.slice(1),16),r=(n>>16)+a,g=((n>>8)&255)+a,b=(n&255)+a;r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return"rgb("+r+","+g+","+b+")"}
var P={
mont:'<path d="M30 22l18-8c4 6 20 6 24 0l18 8 14 54-14 4-4-26v52H34V54l-4 26-14-4z"/><path d="M60 20v86" class="ln"/><path d="M40 62h40M40 80h40" class="ln"/>',
ceket:'<path d="M32 20l16-6 12 14 12-14 16 6 14 50-12 4-4-22v48H34V52l-4 22-12-4z"/><path d="M60 28l-8 24 8 50 8-50z" class="ln"/><circle cx="60" cy="62" r="1.8" class="dt"/><circle cx="60" cy="76" r="1.8" class="dt"/>',
hirka:'<path d="M34 20l14-6c3 5 21 5 24 0l14 6 14 52-12 4-4-20v50H34V56l-4 20-12-4z"/><path d="M60 22v84" class="ln"/><path d="M48 14c2 8 22 8 24 0" class="ln"/><rect x="42" y="78" width="12" height="14" rx="2" class="ln"/>',
triko:'<path d="M34 22l14-8c4 6 20 6 24 0l14 8 14 50-12 4-4-18v50H34V58l-4 18-12-4z"/><path d="M34 100h52M34 94h52" class="ln"/><path d="M48 14c2 7 22 7 24 0" class="ln"/><path d="M44 40v40M54 40v40M66 40v40M76 40v40" class="ln fn"/>',
sweat:'<path d="M32 22l16-8c4 7 20 7 24 0l16 8 14 52-12 4-4-20v50H34V58l-4 20-12-4z"/><path d="M34 98h52" class="ln"/><path d="M48 14c2 12 22 12 24 0" class="ln"/><path d="M52 34l-2 16M68 34l2 16" class="ln"/>',
takim:'<path d="M30 12l12-4c3 4 13 4 16 0l12 4 10 30-10 3-3-10v22H33V35l-3 10-10-3z"/><path d="M38 70h44l4 40H68l-8-28-8 28H34z"/><path d="M38 76h44" class="ln"/>',
alt:'<path d="M38 12h44l6 40-8 64H66l-6-56-6 56H40l-8-64z"/><path d="M38 20h44" class="ln"/><path d="M60 20v30" class="ln"/><path d="M35 106h16M69 106h16" class="ln"/>',
pant:'<path d="M36 12h48l6 44-6 62H66l-6-62-6 62H42l-6-62z"/><path d="M36 20h48" class="ln"/><path d="M60 20v36" class="ln"/><path d="M48 28v8M72 28v8" class="ln"/>',
tisort:'<path d="M30 24l20-10c3 8 17 8 20 0l20 10 10 22-14 6-4-8v54H38V44l-4 8-14-6z"/><path d="M50 14c3 9 17 9 20 0" class="ln"/>'
};
function svg(tip,renk,klass){
 var d=P[tip]||P.sweat,dk=shade(renk,-38),lt=shade(renk,34),gid="g"+renk.slice(1);
 return '<svg class="gm '+(klass||'')+'" viewBox="0 0 120 124" role="img" aria-label="'+esc(tip)+'" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+lt+'"/><stop offset="1" stop-color="'+dk+'"/></linearGradient></defs><style>.ln{fill:none;stroke:rgba(0,0,0,.28);stroke-width:1.3;stroke-linecap:round}.fn{stroke:rgba(255,255,255,.14)}.dt{fill:rgba(0,0,0,.35)}</style><g fill="url(#'+gid+')" stroke="rgba(0,0,0,.22)" stroke-width="1">'+d+'</g></svg>';
}
function wa(t){return"https://wa.me/"+WA+"?text="+encodeURIComponent(t)}
var sepet=[];
try{sepet=JSON.parse(localStorage.getItem("karan_sepet")||"[]")}catch(e){sepet=[]}
function kaydet(){try{localStorage.setItem("karan_sepet",JSON.stringify(sepet))}catch(e){}}
function find(id){return URUN.filter(function(u){return u.id===id})[0]}
sepet=sepet.filter(function(s){return find(s.id)});
function toplam(){var t=0,sor=false;sepet.forEach(function(s){var u=find(s.id);if(u.fiyat==null)sor=true;else t+=u.fiyat*s.adet});return{t:t,sor:sor}}
function adetTop(){return sepet.reduce(function(a,s){return a+s.adet},0)}
function ekle(id,beden){var s=sepet.filter(function(x){return x.id===id&&x.beden===beden})[0];if(s)s.adet++;else sepet.push({id:id,beden:beden,adet:1});kaydet();cizSepet();toast(find(id).ad+" sepete eklendi")}
function toast(m){var t=document.getElementById("kr-toast");if(!t)return;t.textContent=m;t.classList.add("ac");clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove("ac")},1800)}
function cizSepet(){
 document.querySelectorAll("[data-sepet-say]").forEach(function(e){var n=adetTop();e.textContent=n;e.style.display=n?"":"none"});
 var b=document.getElementById("kr-sepet-ic");if(!b)return;
 if(!sepet.length){b.innerHTML='<p class="bos">Sepetiniz boş. Beğendiğiniz ürünü seçip beden belirleyin; siparişiniz tek dokunuşla WhatsApp\'a düşer.</p>';document.getElementById("kr-sepet-alt").innerHTML="";return}
 b.innerHTML=sepet.map(function(s,i){var u=find(s.id);return '<div class="sr"><div class="sg">'+svg(u.tip,u.renk)+'</div><div class="sb"><b>'+esc(u.ad)+'</b><small>Beden '+s.beden+' · '+tl(u.fiyat)+'</small><div class="ad"><button data-az="'+i+'" aria-label="Azalt">−</button><span>'+s.adet+'</span><button data-ar="'+i+'" aria-label="Artır">+</button></div></div></div>'}).join("");
 var tp=toplam();
 var msg="Merhaba, sipariş vermek istiyorum:\n"+sepet.map(function(s){var u=find(s.id);return "• "+u.ad+" / Beden "+s.beden+" x"+s.adet+(u.fiyat!=null?" ("+tl(u.fiyat*s.adet)+")":"")}).join("\n")+"\n"+(tp.t?"Toplam: "+tl(tp.t)+(tp.sor?" + fiyatı sorulacak ürünler":"")+"\n":"")+"Ad soyad / adres / telefon bilgilerimi yazıyorum.";
 document.getElementById("kr-sepet-alt").innerHTML='<div class="tp"><span>Ara toplam</span><b>'+(tp.t?tl(tp.t):"-")+(tp.sor?'<small> + fiyatı sorulacaklar</small>':'')+'</b></div><p class="kg">Ücretsiz kargo (mağaza bilgisi). Ödeme ve adres bilgisi WhatsApp\'ta netleşir.</p><a class="wab" target="_blank" rel="noopener" href="'+wa(msg)+'">WhatsApp\'tan siparişi gönder</a>';
}
function bedenOner(boy,kilo){
 var b=0; if(kilo<=62)b=0;else if(kilo<=72)b=1;else if(kilo<=82)b=2;else if(kilo<=92)b=3;else b=4;
 if(boy>=185&&b<4)b++; if(boy<168&&b>0&&kilo<80)b--;
 return BEDEN[b];
}
var KOMB={"Mont":["Pantolon","Eşofman Altı"],"Ceket":["Pantolon","T-Shirt"],"Hırka":["T-Shirt","Pantolon"],"Triko":["Pantolon"],"Sweat":["Pantolon","Eşofman Altı"],"Eşofman Takımı":["T-Shirt"],"Eşofman Altı":["Sweat","T-Shirt"],"Pantolon":["Triko","Sweat","Hırka"],"T-Shirt":["Hırka","Ceket","Pantolon"]};
function kombinCiz(kap){
 var secili=kap.getAttribute("data-secili")||"hirka-1";
 var u=find(secili),hedef=KOMB[u.kat]||[];
 var oner=URUN.filter(function(x){return hedef.indexOf(x.kat)>-1&&x.id!==u.id});
 var ilk={};oner=oner.filter(function(x){if(ilk[x.kat]>=2)return false;ilk[x.kat]=(ilk[x.kat]||0)+1;return true});
 kap.innerHTML='<div class="kb-sec"><label>Bir parça seçin</label><select>'+URUN.map(function(x){return '<option value="'+x.id+'"'+(x.id===secili?' selected':'')+'>'+esc(x.ad)+'</option>'}).join("")+'</select></div><div class="kb-satir"><div class="kb-ana">'+svg(u.tip,u.renk)+'<small>'+esc(u.ad)+'</small></div><span class="kb-art">+</span><div class="kb-liste">'+oner.map(function(x){return '<div class="kb-k">'+svg(x.tip,x.renk)+'<small>'+esc(x.ad)+'</small><select class="gz" aria-label="Beden">'+BEDEN.map(function(b){return '<option>'+b+'</option>'}).join("")+'</select><button data-ekle="'+x.id+'">Sepete</button></div>'}).join("")+'</div></div><p class="kb-not">Öneri kategori uyumuna göre otomatik çıkar. Yayında mağazanın kendi kombin seçimleri girilir.</p>';
 kap.querySelector("select").onchange=function(){kap.setAttribute("data-secili",this.value);kombinCiz(kap)};
}
function kart(u){
 return '<article class="uk" data-kat="'+u.kat+'"><div class="ug">'+svg(u.tip,u.renk)+'<span class="et">'+u.kat+'</span></div><div class="ui"><b>'+esc(u.ad)+'</b><small>'+esc(u.not)+'</small><div class="uf">'+(u.fiyat!=null?'<strong>'+tl(u.fiyat)+'</strong>':'<em>Fiyat için yazın</em>')+'</div><div class="ub"><select aria-label="Beden">'+BEDEN.map(function(b){return '<option>'+b+'</option>'}).join("")+'</select><button class="ek" data-ekle="'+u.id+'">Sepete ekle</button></div></div></article>';
}
function gridCiz(){
 document.querySelectorAll("[data-grid]").forEach(function(g){
  var lim=parseInt(g.getAttribute("data-grid"))||99,kat=g.getAttribute("data-aktif")||"Tümü";
  var l=URUN.filter(function(u){return kat==="Tümü"||u.kat===kat}).slice(0,lim);
  g.innerHTML=l.map(kart).join("");
 });
}
function chips(){
 document.querySelectorAll("[data-chips]").forEach(function(c){
  var g=document.querySelector(c.getAttribute("data-chips"));
  c.innerHTML=KATS.map(function(k,i){return '<button class="'+(i?'':'on')+'" data-k="'+k+'">'+k+'</button>'}).join("");
  c.onclick=function(e){var b=e.target.closest("button");if(!b)return;c.querySelectorAll("button").forEach(function(x){x.classList.remove("on")});b.classList.add("on");g.setAttribute("data-aktif",b.getAttribute("data-k"));g.setAttribute("data-grid","99");gridCiz()};
 });
}
function katSay(){document.querySelectorAll("[data-katlar]").forEach(function(k){
 var gr={};URUN.forEach(function(u){gr[u.kat]=gr[u.kat]||u});
 k.innerHTML=Object.keys(gr).map(function(a){var u=gr[a];return '<button class="kt" data-git="'+a+'">'+svg(u.tip,u.renk)+'<b>'+a+'</b></button>'}).join("")})}
function iskelet(){
 var d=document.createElement("div");d.innerHTML=
 '<div id="kr-toast" class="toast" role="status"></div>'+
 '<div id="kr-ort" class="ort"></div>'+
 '<aside id="kr-sepet" class="cek" aria-label="Sepet"><header><b>Sepetiniz</b><button data-kapat aria-label="Kapat">×</button></header><div id="kr-sepet-ic" class="icy"></div><div id="kr-sepet-alt" class="alty"></div></aside>'+
 '<div id="kr-beden" class="mdl" role="dialog" aria-label="Beden rehberi"><div class="mk"><button class="x" data-kapat aria-label="Kapat">×</button><h3>Beden rehberi</h3><p>Boy ve kilonuzu girin, yaklaşık bedeni söyleyelim. Kesinlik için WhatsApp\'tan sorabilirsiniz.</p><div class="bf"><label>Boy (cm)<input id="br-boy" type="number" inputmode="numeric" value="178" min="140" max="220"></label><label>Kilo (kg)<input id="br-kilo" type="number" inputmode="numeric" value="78" min="40" max="180"></label></div><div class="bs" id="br-sonuc"></div><a class="wab" id="br-wa" target="_blank" rel="noopener">Bedenimi WhatsApp\'ta sor</a></div></div>';
 while(d.firstChild)document.body.appendChild(d.firstChild);
 var ort=document.getElementById("kr-ort");
 function kapat(){document.getElementById("kr-sepet").classList.remove("ac");document.getElementById("kr-beden").classList.remove("ac");ort.classList.remove("ac")}
 ort.onclick=kapat;
 function bedenHes(){var boy=+document.getElementById("br-boy").value||0,kilo=+document.getElementById("br-kilo").value||0;if(boy<140||kilo<40){document.getElementById("br-sonuc").innerHTML="Değerleri kontrol edin";return}var b=bedenOner(boy,kilo);document.getElementById("br-sonuc").innerHTML='Önerilen beden: <strong>'+b+'</strong><small>Rahat kesimli ürünlerde bir beden küçük de tercih edilebilir.</small>';document.getElementById("br-wa").href=wa("Merhaba, boyum "+boy+" cm, kilom "+kilo+" kg. Hangi beden uygun olur? (Önerilen: "+b+")")}
 document.body.addEventListener("click",function(e){
  var t=e.target;
  if(t.closest("[data-kapat]"))return kapat();
  if(t.closest("[data-sepet-ac]")){document.getElementById("kr-sepet").classList.add("ac");ort.classList.add("ac");return}
  if(t.closest("[data-beden-ac]")){document.getElementById("kr-beden").classList.add("ac");ort.classList.add("ac");bedenHes();return}
  var ek=t.closest("[data-ekle]");
  if(ek){var kk=ek.closest(".uk,.kb-k"),sel=kk&&kk.querySelector("select");ekle(ek.getAttribute("data-ekle"),sel?sel.value:"M");return}
  var az=t.closest("[data-az]"),ar=t.closest("[data-ar]");
  if(az){var i=+az.getAttribute("data-az");sepet[i].adet--;if(sepet[i].adet<1)sepet.splice(i,1);kaydet();cizSepet();return}
  if(ar){sepet[+ar.getAttribute("data-ar")].adet++;kaydet();cizSepet();return}
  var git=t.closest("[data-git]");
  if(git){var k=git.getAttribute("data-git"),c=document.querySelector("[data-chips]");if(c){var b=[].filter.call(c.querySelectorAll("button"),function(x){return x.getAttribute("data-k")===k})[0];if(b)b.click();var g=document.querySelector("[data-grid]");if(g)g.scrollIntoView({behavior:"smooth",block:"start"})}}
 });
 document.addEventListener("keydown",function(e){if(e.key==="Escape")kapat()});
 document.getElementById("br-boy").oninput=bedenHes;document.getElementById("br-kilo").oninput=bedenHes;
}
function bant(){document.querySelectorAll("[data-bant]").forEach(function(b){var m=["Ücretsiz kargo","Sipariş WhatsApp'tan, hat 24 saat açık","Premium kalite tüm ürünler","Instagram: @karanpremiumgiyim"],i=0;b.textContent=m[0];setInterval(function(){i=(i+1)%m.length;b.style.opacity=0;setTimeout(function(){b.textContent=m[i];b.style.opacity=1},250)},3200)})}
function harita(){document.querySelectorAll("[data-harita]").forEach(function(h){
 var adr="893. Sokak 7, Sancaktepe Mah., 34200 Bağcılar İstanbul";
 h.innerHTML='<iframe title="Harita" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q='+encodeURIComponent(adr)+'&output=embed&z=15"></iframe>';
 document.querySelectorAll("[data-yol]").forEach(function(l){l.href="https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(adr);l.target="_blank";l.rel="noopener"});
})}
function waBaglar(){document.querySelectorAll("[data-wa]").forEach(function(a){a.href=wa(a.getAttribute("data-wa"));a.target="_blank";a.rel="noopener"})}
function basla(){
 iskelet();gridCiz();chips();katSay();bant();harita();waBaglar();cizSepet();
 document.querySelectorAll("[data-kombin]").forEach(kombinCiz);
}
window.KR={svg:svg,urun:URUN,tl:tl};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",basla);else basla();
})();
