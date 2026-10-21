
const WA="905542540253";const wa=m=>"https://wa.me/"+WA+"?text="+encodeURIComponent(m);
// dil
let en=false;document.getElementById("dil").onclick=e=>{en=!en;document.querySelectorAll("[data-tr]").forEach(x=>x.hidden=en);document.querySelectorAll("[data-en]").forEach(x=>x.hidden=!en);e.target.textContent=en?"TR":"EN";document.documentElement.lang=en?"en":"tr"};
/* etiket dil + dergi menusu (nav, yerlesim.js textContent ile iki dili birlestiriyordu) */
const etDil=()=>{document.querySelectorAll("[data-etr]").forEach(e=>{e.textContent=en?e.dataset.een:e.dataset.etr});navDil()};
const navDil=()=>{document.querySelectorAll(".yz-dergi-nav a").forEach(a=>{const h=a.getAttribute("href");const s=h&&h.length>1?document.querySelector(h):null;const e=s&&s.querySelector(".etiket");if(!e)return;const t=e.querySelector("[data-tr]"),n=e.querySelector("[data-en]");const tx=e.dataset.etr?(en?e.dataset.een:e.dataset.etr):(t&&n?(en?n.textContent:t.textContent):e.textContent);a.textContent=tx.split(" · ")[0].trim()})};
document.getElementById("dil").addEventListener("click",etDil);addEventListener("load",()=>setTimeout(navDil,50));

// portföy + görüntüleyici
const prs=[...document.querySelectorAll(".pr")];document.querySelectorAll(".filtre button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filtre button").forEach(x=>x.classList.remove("on"));b.classList.add("on");prs.forEach(p=>p.style.display=(b.dataset.f==="hepsi"||p.dataset.k===b.dataset.f)?"":"none")});
const isik=document.getElementById("isik");let ai=0;const gor=()=>prs.filter(p=>p.style.display!=="none");
const goster=i=>{const g=gor();ai=(i+g.length)%g.length;isik.querySelector("img").src=g[ai].querySelector("img").src;isik.querySelector("p").textContent=g[ai].querySelector("span").textContent;isik.classList.add("ac")};
prs.forEach(p=>p.onclick=()=>goster(gor().indexOf(p)));isik.querySelector(".k").onclick=()=>isik.classList.remove("ac");isik.querySelector(".o").onclick=()=>goster(ai-1);isik.querySelector(".s").onclick=()=>goster(ai+1);
document.addEventListener("keydown",e=>{if(!isik.classList.contains("ac"))return;if(e.key==="Escape")isik.classList.remove("ac");if(e.key==="ArrowLeft")goster(ai-1);if(e.key==="ArrowRight")goster(ai+1)});
// önce/sonra
const os=document.getElementById("os"),ust=os.querySelector(".ust2"),cz=os.querySelector(".cz");const kay=x=>{const r=os.getBoundingClientRect();const p=Math.max(0,Math.min(100,(x-r.left)/r.width*100));ust.style.clipPath="inset(0 0 0 "+p+"%)";cz.style.left=p+"%"};
let surukle=false;os.addEventListener("pointerdown",e=>{surukle=true;kay(e.clientX)});addEventListener("pointermove",e=>surukle&&kay(e.clientX));addEventListener("pointerup",()=>surukle=false);
// proje planlayıcı
const AS={avan:["Konsept + avan",3,1.0],uyg:["Uygulama projesi",5,1.0],ruh:["Ruhsat süreci",6,.5],ic:["İç mimari",4,.8],den:["Uygulama denetimi",16,1.2]};
const TK={konut:1,villa:.9,ticari:1.15,ic:.6,rest:1.3};
function plan(){const tur=document.getElementById("tur").value,m2=+document.getElementById("m2").value||100,kat=+document.getElementById("kat").value||1;
const sec=[...document.querySelectorAll(".secim input:checked")].map(x=>x.value);const olcek=TK[tur]*(.75+Math.min(2.2,Math.sqrt(m2/250))*.35)*(1+Math.min(kat,10)*.03);
let t=1;const satir=[["Keşif + rölöve",0,1]];sec.forEach(k=>{const[a,h,c]=AS[k];const s=Math.max(1,Math.round(h*(k==="ruh"?1:olcek)));satir.push([a,t,s]);t+=k==="den"?0:s});
const den=satir.find(s=>s[0]==="Uygulama denetimi");if(den){den[1]=t;t+=den[2]}
const top=Math.max(...satir.map(s=>s[1]+s[2]));document.getElementById("top").textContent="≈ "+Math.round(top*.85)+"–"+Math.round(top*1.2)+" hafta";
document.getElementById("asamalar").innerHTML=satir.map(([a,b,s])=>'<div class="asama"><span>'+a+'</span><div class="cubuk"><i style="left:'+(b/top*100)+'%;width:'+(s/top*100)+'%"></i></div></div>').join("");
document.getElementById("planGonder").href=wa("Merhaba, sitenizdeki planlayıcıdan yazıyorum.\nProje: "+document.getElementById("tur").selectedOptions[0].text+", "+m2+" m², "+kat+" kat\nHizmetler: "+sec.map(k=>AS[k][0]).join(", ")+"\nTahmini süre: "+document.getElementById("top").textContent+"\nGörüşmek isterim.")}
document.querySelectorAll("#planlayici input,#planlayici select").forEach(x=>x.oninput=plan);plan();
// ruhsat listesi
const bl=[...document.querySelectorAll("#belgeler input")];function belge(){const n=bl.filter(x=>x.checked).length;document.getElementById("hazir").textContent=n+" / "+bl.length;document.getElementById("hazirCubuk").style.width=(n/bl.length*100)+"%";
const eks=bl.filter(x=>!x.checked).map(x=>x.nextElementSibling.textContent);document.getElementById("hazirNot").textContent=n===bl.length?"Hazırsınız, başvuruya geçebiliriz.":"Eksik: "+eks.slice(0,3).join(", ")+(eks.length>3?"…":"");
document.getElementById("belgeSor").href=wa("Merhaba, ruhsat için belgelerim: "+n+"/"+bl.length+" hazır. Eksiklerim: "+eks.join(", ")+". Yardımcı olur musunuz?")}
document.querySelectorAll("#belgeler li").forEach(li=>li.onclick=e=>{if(e.target.tagName!=="INPUT"){const c=li.querySelector("input");c.checked=!c.checked}belge()});belge();
// proje takip (demo)
document.getElementById("kodBak").onclick=()=>window.EKTakip&&window.EKTakip.goster(document.getElementById("kod").value);
// stil seçici
const ST=[["#F5F4F0","#D9D6CE","#8E8B84","#2B2B2B","Beyaz meşe, mikro beton, mat siyah armatür, keten"],["#E9E6E1","#B7B2AA","#3C3C3C","#C2A27A","Ceviz, siyah çelik, cam, terrazzo"],["#EFE6D8","#C9A27E","#7A5A3A","#5E6B4E","Traverten, masif ahşap, rattan, kil sıva"],["#F3EEE6","#D8C7A8","#8B6B4A","#3E3A35","Mermer, pirinç detay, boiserie, kadife"]];
const STG=["../img/stil0.jpg","../img/stil1.jpg","../img/stil2.jpg","../img/stil3.jpg"];STG.forEach(u=>{const im=new Image();im.src=u});
function stil(i){const s=ST[i];window.DJMaliyet&&DJMaliyet.stilSec(["minimal","modern","sicak","klasik"][i]);{const g=document.getElementById("stilGorsel"),e=document.getElementById("stilEtiket"),ad=document.querySelectorAll("#stiller button")[i].textContent;if(g&&g.getAttribute("src")!==STG[i]){g.style.opacity=0;g.style.transform="scale(1.02)";setTimeout(()=>{g.src=STG[i];g.alt=ad+" iç mimari örneği";g.onload=()=>{g.style.opacity=1;g.style.transform="scale(1)"};if(e)e.textContent=ad+" · örnek görsel"},180)}}document.getElementById("palet").innerHTML=s.slice(0,4).map(c=>'<i style="background:'+c+'"></i>').join("");document.getElementById("malzeme").textContent="Önerilen malzemeler: "+s[4];
document.getElementById("stilGonder").href=wa("Merhaba, iç mimaride "+document.querySelectorAll("#stiller button")[i].textContent+" tarzı düşünüyorum ("+s[4]+"). Görüşebilir miyiz?")}
document.querySelectorAll("#stiller button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#stiller button").forEach(x=>x.classList.remove("on"));b.classList.add("on");stil(+b.dataset.s)});stil(0);
// randevu
document.getElementById("randevu").onclick=()=>{const ad=document.getElementById("rAd").value||"",g=document.getElementById("rGun").value,k=document.getElementById("rKonu").value;location.href=wa("Merhaba, ben "+ad+". "+k+" için keşif randevusu almak istiyorum"+(g?" ("+g.split("-").reverse().join(".")+" tercihimdir)":"")+".")};
