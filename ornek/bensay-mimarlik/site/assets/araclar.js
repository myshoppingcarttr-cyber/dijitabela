/* bensay · mimarlık araçları: süre planlayıcı, önce/sonra, ruhsat listesi, stil seçici */
window.bnAraclarBaslat=function(){
"use strict";
var $=function(s){return document.querySelector(s)},$$=function(s){return[].slice.call(document.querySelectorAll(s))},E=function(){return window.bnEn()},L=function(tr,en){return E()?en:tr};
/* 1) süre planlayıcı */
var AS={avan:[["Konsept + avan","Concept + schematic"],3],uyg:[["Uygulama projesi","Construction drawings"],5],ruh:[["Ruhsat süreci","Permit process"],6],ic:[["İç mimari","Interior design"],4],den:[["Uygulama denetimi","Site supervision"],16]};
var TK={konut:1,villa:.9,ticari:1.15,ic:.6,rest:1.3};
function plan(){var tur=$("#tur").value,m2=+$("#m2").value||100,kat=+$("#kat").value||1;
 var sec=$$("#hizmetler input:checked").map(function(x){return x.value});var olcek=TK[tur]*(.75+Math.min(2.2,Math.sqrt(m2/250))*.35)*(1+Math.min(kat,10)*.03);
 var t=1,sat=[[L("Keşif + rölöve","Survey + site visit"),0,1]],den=null;
 sec.forEach(function(k){var a=AS[k],s=Math.max(1,Math.round(a[1]*(k==="ruh"?1:olcek)));var ad=L(a[0][0],a[0][1]);if(k==="den"){den=[ad,0,s]}else{sat.push([ad,t,s]);t+=s}});
 if(den){den[1]=t;sat.push(den)}
 var top=Math.max.apply(null,sat.map(function(s){return s[1]+s[2]}));var txt="≈ "+Math.round(top*.85)+"–"+Math.round(top*1.2)+L(" hafta"," weeks");$("#top").textContent=txt;
 $("#asamalar").innerHTML=sat.map(function(s){return'<div class="asama"><span>'+s[0]+'</span><div class="cubuk" role="img" aria-label="'+s[0]+': '+s[2]+L(" hafta"," weeks")+'"><i style="left:'+(s[1]/top*100)+'%;width:'+(s[2]/top*100)+'%"></i></div></div>'}).join("");
 $("#planGonder").href=window.bnWa(L("Merhaba, sitenizdeki planlayıcıdan yazıyorum.\nProje: ","Hello, I'm writing from your website's planner.\nProject: ")+$("#tur").selectedOptions[0].textContent+", "+m2+" m², "+kat+L(" kat"," floors")+L("\nHizmetler: ","\nServices: ")+sec.map(function(k){return L(AS[k][0][0],AS[k][0][1])}).join(", ")+L("\nTahmini süre: ","\nEstimated duration: ")+txt)}
if($("#tur")){$$("#planlayici input,#planlayici select").forEach(function(x){x.addEventListener("input",plan);x.addEventListener("change",plan)});plan();document.addEventListener("bn:dil",plan)}
/* 2) önce / sonra (klavye ve dokunmatik erişilebilir) */
var os=$("#os"),ar=$("#osAr");
if(os&&ar){var kay=function(p){os.querySelector(".sonra").style.clipPath="inset(0 0 0 "+p+"%)";os.querySelector(".cz").style.left=p+"%"};
 ar.addEventListener("input",function(){kay(ar.value)});var sur=false,px=function(x){var r=os.getBoundingClientRect();var p=Math.max(0,Math.min(100,(x-r.left)/r.width*100));ar.value=p;kay(p)};
 os.addEventListener("pointerdown",function(e){sur=true;px(e.clientX)});addEventListener("pointermove",function(e){if(sur)px(e.clientX)});addEventListener("pointerup",function(){sur=false});kay(50)}
/* 3) ruhsat belge listesi */
var bl=$$("#belgeler input");
function belge(){if(!bl.length)return;var n=bl.filter(function(x){return x.checked}).length,ad=function(x){return x.closest("label").querySelector(E()?"[data-l=en]":"[data-l=tr]").textContent};
 $("#hazir").textContent=n+" / "+bl.length;$("#hazirCubuk").style.width=(n/bl.length*100)+"%";var eks=bl.filter(function(x){return!x.checked}).map(ad);
 $("#hazirNot").textContent=n===bl.length?L("Belgeleriniz tamam görünüyor; başvuru öncesi birlikte kontrol edelim.","Your documents look complete; let's review them together before applying."):L("Eksik: ","Missing: ")+eks.slice(0,3).join(", ")+(eks.length>3?"…":"");
 $("#belgeSor").href=window.bnWa(L("Merhaba, ruhsat için belgelerim: ","Hello, my permit documents: ")+n+"/"+bl.length+L(" hazır. Eksikler: "," ready. Missing: ")+eks.join(", ")+L(". Yardımcı olur musunuz?",". Could you help?"))}
bl.forEach(function(x){x.addEventListener("change",belge)});belge();document.addEventListener("bn:dil",belge);
/* 4) iç mimari stil seçici */
var ST=[[["Minimal","Minimal"],["#F5F4F0","#D9D6CE","#8E8B84","#2B2B2B"],["Beyaz meşe, mikro beton, mat siyah armatür, keten","White oak, micro-concrete, matte black fittings, linen"],"minimal"],
[["Modern","Modern"],["#E9E6E1","#B7B2AA","#3C3C3C","#C2A27A"],["Ceviz, siyah çelik, cam, terrazzo","Walnut, black steel, glass, terrazzo"],"modern"],
[["Sıcak Doğal","Warm Natural"],["#EFE6D8","#C9A27E","#7A5A3A","#5E6B4E"],["Traverten, masif ahşap, rattan, kil sıva","Travertine, solid wood, rattan, clay plaster"],"sicak"],
[["Klasik","Classic"],["#F3EEE6","#D8C7A8","#8B6B4A","#3E3A35"],["Mermer, pirinç detay, boiserie, kadife","Marble, brass details, boiserie, velvet"],"klasik"]];
var si=0;function stil(i){si=i;var s=ST[i],ad=L(s[0][0],s[0][1]);$$("#stiller button").forEach(function(b,j){b.setAttribute("aria-pressed",j===i)});
 $("#palet").innerHTML=s[1].map(function(c){return'<i style="background:'+c+'" title="'+c+'"></i>'}).join("");$("#malzeme").textContent=L("Önerilen malzemeler: ","Suggested materials: ")+L(s[2][0],s[2][1]);
 var g=$("#stilGorsel");g.src="img/stil"+i+".jpg";g.alt=ad+L(" iç mimari örneği"," interior example");$("#stilEtiket").textContent=ad+L(" · örnek görsel"," · sample image");
 
 $("#stilGonder").href=window.bnWa(L("Merhaba, iç mimaride "+ad+" tarzı düşünüyorum ("+s[2][0]+"). Görüşebilir miyiz?","Hello, I'm considering a "+ad+" interior style ("+s[2][1]+"). Can we talk?"))}
if($("#stiller")){$$("#stiller button").forEach(function(b,j){b.addEventListener("click",function(){stil(j)})});stil(0);document.addEventListener("bn:dil",function(){stil(si)})}
};
