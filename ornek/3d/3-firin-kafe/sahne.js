/* Sahne 3 · Fırın / kafe: sabah ışığında cam önü tezgâh, taze ekmek, simit, tüten kahve.
   İki geçiş: (1) sahne ışın izlemeyle (SDF) bir kez, şeritler hâlinde dokuya çizilir; (2) her karede yalnız
   buhar, ışık huzmesi, toz ve derinliğe bağlı paralaks eklenir. Bu yüzden telefonda da akıcıdır. Görsel dosyası yok. */
(function () {
var ORTAK = `
#define PI 3.14159265
float h2(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float ns(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
float fbm3(vec2 p){ float a=.5,s=0.; for(int i=0;i<3;i++){ s+=a*ns(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5; } return s; }
float fbm(vec2 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*ns(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5; } return s; }
vec3 gLoaf,gCup,gSim,gRo,gFw,gRt,gUp; float gK,gF,gXw;
const float ZW=-.55;
void duzen(vec2 res){
  float asp=res.x/res.y; gK=smoothstep(.6,1.5,asp);
  gLoaf=mix(vec3(-.045,0.,-.13),vec3(-.07,0.,-.17),gK);
  gCup=mix(vec3(.070,0.,.15),vec3(.120,0.,.075),gK);
  gSim=mix(vec3(.115,0.,-.27),vec3(.215,0.,-.25),gK);
  gXw=mix(.03,.12,gK);
  gF=mix(1.35,2.3,gK);
  vec3 hedef=mix(vec3(0.,.235,0.),vec3(-.105,.085,0.),gK);
  gRo=hedef+mix(vec3(0.,.13,1.25),vec3(0.,.17,.95),gK);
  gFw=normalize(hedef-gRo); gRt=normalize(cross(gFw,vec3(0.,1.,0.))); gUp=cross(gRt,gFw);
}
vec2 izdusum(vec3 P){ vec3 d=P-gRo; float z=dot(d,gFw); return vec2(dot(d,gRt),dot(d,gUp))*gF/z; }
`;
var SAHNE = ORTAK + `
vec3 gL,gSunC,gSkyC,gLampP; float gSunI,gLampI,gS;
float sdEll(vec3 p,vec3 r){ float k0=length(p/r),k1=length(p/(r*r)); return k0*(k0-1.)/k1; }
float sdTor(vec3 p,vec2 t){ return length(vec2(length(p.xz)-t.x,p.y))-t.y; }
float sdCyl(vec3 p,float r,float h,float rr){ vec2 d=vec2(length(p.xz)-r+rr,abs(p.y)-h+rr); return min(max(d.x,d.y),0.)+length(max(d,0.))-rr; }
float sdKon(vec3 p,float r1,float r2,float h){ float r=mix(r1,r2,clamp(p.y/h,0.,1.)); return max((length(p.xz)-r)*.96,max(-p.y,p.y-h)); }
vec2 map(vec3 p){
  vec2 res=vec2(p.y,1.);
  vec3 q=p-gLoaf;
  float d=sdCyl(q-vec3(0.,.007,0.),.158,.007,.003);
  if(d<res.x) res=vec2(d,2.);
  // ekşi maya somun
  vec3 l=q-vec3(0.,.072,0.);
  d=sdEll(l,vec3(.110,.066,.100));
  if(d<.03){
    float ust=smoothstep(.0,.045,l.y);
    vec2 s=mat2(.82,-.57,.57,.82)*l.xz;
    float gr=min(abs(s.x+.036),min(abs(s.x-.036),abs(s.x)));
    float yar=smoothstep(.011,.0,gr)*ust*smoothstep(.088,.055,abs(s.y));
    d+=yar*.0065-smoothstep(.022,.013,gr)*smoothstep(.007,.013,gr)*ust*.0032*smoothstep(.088,.055,abs(s.y));
    d-=(fbm3(l.xz*36.+l.y*19.)-.5)*.0052;
  }
  if(d<res.x) res=vec2(d,3.);
  // fincan + tabak
  vec3 c=p-gCup;
  d=sdCyl(c-vec3(0.,.005,0.),.077,.005,.004);
  d=min(d,sdTor(c-vec3(0.,.0085,0.),vec2(.070,.0045)));
  float govde=sdKon(c-vec3(0.,.011,0.),.027,.043,.058);
  float ic=sdKon(c-vec3(0.,.0155,0.),.0236,.0398,.075);
  float fin=max(govde,-ic);
  fin=min(fin,sdTor(c-vec3(0.,.0688,0.),vec2(.0414,.0019)));
  vec3 hq=c-vec3(.053,.041,0.);
  float kulp=length(vec2(length(hq.xy*vec2(1.,.82))-.0185,hq.z))-.0050;
  fin=min(fin,max(kulp,-govde));
  d=min(d,fin);
  if(d<res.x) res=vec2(d,4.);
  float kahve=max(ic,c.y-.058);
  if(kahve<res.x) res=vec2(kahve,5.);
  // iki simit
  vec3 s1=p-gSim-vec3(0.,.0175,0.);
  if(length(s1)<.16){
    float a=atan(s1.z,s1.x), b=atan(s1.y,length(s1.xz)-.056);
    d=sdTor(s1,vec2(.056,.0170))-.0020*sin(a*15.+b*2.);
    vec3 s2=p-gSim-vec3(-.034,.047,.012);
    s2.xy=mat2(.86,.51,-.51,.86)*s2.xy; s2.yz=mat2(.97,-.24,.24,.97)*s2.yz;
    a=atan(s2.z,s2.x); b=atan(s2.y,length(s2.xz)-.054);
    d=min(d,sdTor(s2,vec2(.054,.0165))-.0020*sin(a*15.+b*2.+1.));
    if(d<res.x) res=vec2(d,6.);
  }
  return res;
}
vec3 normal(vec3 p){ vec2 e=vec2(.0006,0.);
  return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x,map(p+e.yxy).x-map(p-e.yxy).x,map(p+e.yyx).x-map(p-e.yyx).x)); }
float golge(vec3 ro,vec3 rd,float k){
  float r=1.,t=.004;
  for(int i=0;i<40;i++){ float h=map(ro+rd*t).x; r=min(r,k*h/t); t+=clamp(h,.004,.04); if(r<.01||t>.9) break; }
  return clamp(r,0.,1.);
}
float ao(vec3 p,vec3 n){ float o=0.,s=1.; for(int i=1;i<=5;i++){ float h=.006+.022*float(i); o+=(h-map(p+n*h).x)*s; s*=.72; } return clamp(1.-o*5.5,0.,1.); }
// camın dışı: odak dışı sokak, ağaç, gökyüzü
vec3 disari(vec2 h){
  float n=fbm3(h*1.7+3.), n2=fbm3(h*3.6+9.);
  vec3 gokc=mix(vec3(1.35,1.02,.66),vec3(1.70,1.46,1.12),smoothstep(.25,1.,h.y));
  vec3 agac=mix(vec3(.12,.15,.045),vec3(.62,.50,.16),smoothstep(.30,.72,n2));
  float am=smoothstep(.66,.30,h.y+n*.46-.10);
  vec3 c=mix(gokc,agac,am*.80);
  c=mix(c,vec3(.36,.25,.15)*(.7+.6*n2),smoothstep(.22,.02,h.y+n*.08)*.85);
  // yaprak arasından süzülen ışık: yumuşak, iri odak dışı diskler
  for(int k=0;k<2;k++){
    float S=k==0?5.5:9.5;
    vec2 g=h*S+float(k)*3.7, id=floor(g), f=fract(g)-.5;
    vec2 o=vec2(h2(id+2.)-.5,h2(id+9.)-.5)*.5;
    float r=.22+.2*h2(id+4.);
    float dsk=smoothstep(r,r*.45,length(f-o))*step(.55,h2(id+13.));
    c+=vec3(1.3,.95,.42)*dsk*am*(.16+.24*h2(id+6.));
  }
  vec3 safak=mix(vec3(.05,.085,.17),vec3(.16,.20,.30),smoothstep(.1,.9,h.y))*(.7+.6*n);
  return mix(safak,c*(.55+.75*gSunI),smoothstep(.0,.55,gS));
}
float pencere(vec2 h){   // 1 = cam, 0 = doğrama
  float dx=gXw-h.x;
  float dik=abs(fract(dx/.47+.5)-.5)*.47;
  float m=smoothstep(.0,.060,dik)*smoothstep(.0,.060,abs(h.y-.70));
  return m*smoothstep(-.03,.03,dx);
}
vec3 arka(vec3 ro,vec3 rd){
  float t=(ZW-ro.z)/min(rd.z,-1e-3); vec2 h=(ro+rd*t).xy;
  float dx=gXw-h.x;
  float cam=smoothstep(-.03,.03,dx);
  float dik=abs(fract(dx/.47+.5)-.5)*.47;
  float dog=max(smoothstep(.040,.016,dik),smoothstep(.042,.018,abs(h.y-.70)));
  vec3 c=mix(disari(h),vec3(.030,.022,.016)+gSkyC*.02,dog);
  // sağdaki koyu duvar + raf, odak dışı sıcak noktalar
  vec3 duvar=vec3(.040,.026,.017)*(.35+.65*gSunI)+vec3(.008,.006,.005);
  duvar*=.50+1.1*exp(-max(-dx,0.)*4.5)+.25*fbm3(h*3.);
  duvar*=.80+.20*smoothstep(.004,.012,abs(fract(h.x/.11)-.5)*.11);
  float raf=smoothstep(.03,.0,abs(h.y-.46))*.5;
  duvar=mix(duvar,duvar*.45,raf);
  vec2 lp=h-vec2(gXw+.30,.80);
  float lam=exp(-dot(lp,lp)*42.);
  duvar+=vec3(1.,.55,.20)*lam*(.75+1.6*gLampI)+vec3(1.,.5,.18)*exp(-dot(lp,lp)*420.)*(2.+4.*gLampI);
  vec2 bp=h-vec2(gXw+.17,.53); duvar+=vec3(.75,.42,.16)*exp(-dot(bp,bp)*210.)*.30;
  bp=h-vec2(gXw+.43,.55); duvar+=vec3(.6,.36,.16)*exp(-dot(bp,bp)*160.)*.22;
  return mix(duvar,c,cam);
}
// yansıma ortamı: pencere parlak, iç mekân koyu
vec3 ortam(vec3 p,vec3 r){
  vec3 c=vec3(.035,.026,.020)*(.4+.6*gSunI)+vec3(1.,.55,.2)*gLampI*.05*max(r.y,0.);
  if(r.z<-.02){
    float t=(ZW-p.z)/r.z; vec2 h=(p+r*t).xy;
    float m=smoothstep(-.06,.06,gXw-h.x)*smoothstep(-.02,.06,h.y)*smoothstep(1.25,1.05,h.y);
    float dik=abs(fract((gXw-h.x)/.47+.5)-.5)*.47;
    m*=.25+.75*smoothstep(.006,.03,dik)*smoothstep(.01,.035,abs(h.y-.70));
    c=mix(c,disari(h)*1.15,m);
  }
  return c;
}
vec3 boya(vec3 ro,vec3 rd,out float derin){
  float t=.25; vec2 m=vec2(1.,0.);
  for(int i=0;i<110;i++){ m=map(ro+rd*t); if(m.x<.0004*t||t>2.6) break; t+=m.x*.92; }
  derin=t;
  float tw=(ZW-ro.z)/min(rd.z,-1e-3);
  if(t>tw||t>2.6){ derin=tw; return arka(ro,rd); }
  vec3 p=ro+rd*t, n=normal(p), v=-rd;
  float id=m.y;
  vec3 alb=vec3(.5); float puruz=.5, f0=.04, sss=0., yansi=0.;
  if(id<1.5){        // tezgâh: koyu ceviz
    float tahta=floor(p.z/.24+.3), fz=fract(p.z/.24+.3);
    float bk=fbm3(vec2(p.x*4.+tahta*3.,p.z*7.));
    vec2 w=vec2(p.x*3.1+tahta*7.3,p.z*58.+bk*5.);
    float damar=fbm(w);
    float ince=ns(vec2(p.x*9.+tahta,p.z*420.+bk*30.));
    alb=mix(vec3(.060,.030,.015),vec3(.215,.115,.052),damar*.80+ince*.22);
    alb*=.82+.30*h2(vec2(tahta,3.));
    alb*=.80+.35*fbm3(p.xz*vec2(2.,9.)+tahta);
    float aralik=smoothstep(.0035,.0008,min(fz,1.-fz)*.24);
    alb*=1.-aralik*.80;
    n=normalize(n+vec3((ince-.5)*.035,0.,(damar-.5)*.07+(ince-.5)*.05));
    puruz=.30+.22*damar; f0=.05; yansi=.70;
  }else if(id<2.5){  // kesme tahtası: açık meşe
    vec3 q=p-gLoaf;
    float damar=fbm(vec2(q.x*40.,q.z*3.+fbm3(q.xz*6.)*2.));
    alb=mix(vec3(.40,.25,.12),vec3(.64,.45,.25),damar);
    puruz=.55; yansi=.15;
  }else if(id<3.5){  // ekmek kabuğu
    vec3 l=p-gLoaf-vec3(0.,.072,0.);
    vec2 s=mat2(.82,-.57,.57,.82)*l.xz;
    float gr=min(abs(s.x+.036),min(abs(s.x-.036),abs(s.x)));
    float ust=smoothstep(.0,.045,l.y)*smoothstep(.088,.055,abs(s.y));
    float yar=smoothstep(.010,.002,gr)*ust;
    float k=fbm(l.xz*22.+l.y*30.);
    alb=mix(vec3(.37,.190,.075),vec3(.15,.064,.026),smoothstep(.30,.75,k)*.9+smoothstep(.015,.03,gr)*smoothstep(.03,.015,gr)*ust*.0);
    alb=mix(alb,vec3(.17,.065,.022),smoothstep(.024,.012,gr)*smoothstep(.006,.013,gr)*ust*.85);   // kulak: iyi kızarmış
    alb=mix(alb,vec3(.74,.55,.31),yar);                                                           // yarık içi
    float un=smoothstep(.42,.70,fbm(l.xz*55.+7.))*smoothstep(.15,.85,n.y)*(1.-yar)*.78;
    alb=mix(alb,vec3(.80,.74,.64),un);
    float cat=smoothstep(.46,.5,abs(fbm3(l.xz*90.+l.y*60.)-.5)+.44);
    alb*=.82+.18*cat; n=normalize(n+(vec3(ns(l.xz*260.),ns(l.zy*260.+3.),ns(l.xy*260.+7.))-.5)*.22);
    puruz=.92; sss=.34;
  }else if(id<4.5){  // porselen
    alb=vec3(.86,.83,.78); puruz=.09; f0=.055; yansi=1.;
  }else if(id<5.5){  // kahve + krema halkası
    vec3 c=p-gCup; float r=length(c.xz)/.039;
    float kr=smoothstep(.55,1.,r+.25*fbm3(c.xz*120.));
    alb=mix(vec3(.050,.022,.010),vec3(.42,.24,.10),kr*.85);
    n=normalize(vec3(0.,1.,0.)+vec3(.02*sin(r*40.-1.),0.,.0));
    puruz=.06; f0=.03; yansi=1.;
  }else{             // simit + susam
    vec3 s1=p-gSim;
    float k=fbm(s1.xz*30.+s1.y*40.);
    alb=mix(vec3(.50,.215,.055),vec3(.26,.095,.025),smoothstep(.3,.8,k));
    vec2 su=vec2(atan(s1.z,s1.x)*9.5,(s1.y+length(s1.xz))*150.);
    vec2 si=floor(su), sf=fract(su)-.5;
    vec2 so=vec2(h2(si)-.5,h2(si+7.)-.5)*.5;
    float sus=smoothstep(.30,.16,length((sf-so)*vec2(1.,1.9)))*step(.22,h2(si+3.));
    alb=mix(alb,vec3(.84,.66,.36),sus*.92);
    n=normalize(n+vec3(0.,sus*.25,0.));
    puruz=mix(.55,.35,sus); sss=.35; yansi=.25; f0=.045;
  }
  float nl=dot(n,gL);
  float cv=golge(p+n*.0015,gL,22.);
  // güneş yalnız pencere camından girer
  float tw2=(ZW-p.z)/min(gL.z,-1e-3); vec2 hh=(p+gL*tw2).xy;
  float gir=pencere(hh)*smoothstep(1.3,1.1,hh.y);
  float gun=cv*gir*gSunI;
  float o=ao(p,n);
  float dif=mix(max(nl,0.),pow(max(nl+.4,0.)/1.4,1.4),sss);
  vec3 penYon=normalize(vec3(-.25,.35,-.9));
  vec3 isik=gSunC*dif*gun;
  isik+=gSkyC*(.30+.70*max(dot(n,penYon)*.6+.4,0.))*o;
  isik+=vec3(.24,.13,.065)*(.25+.75*gSunI)*max(-n.y*.5+.5,0.)*mix(o,1.,.35);                       // tezgâhtan seken sıcak ışık
  vec3 ld=gLampP-p; float lm=length(ld); ld/=lm;
  isik+=vec3(1.,.56,.24)*gLampI*max(dot(n,ld),0.)*o*.55/(lm*lm+.4);
  vec3 c=alb*isik;
  // arkadan gelen ışıkla kenar parlaması (ekmek, simit)
  c+=alb*gSunC*sss*pow(1.-max(dot(n,v),0.),3.)*max(dot(-v,gL)*.5+.5,0.)*gun*.5;
  // yansıma + parlama
  vec3 h=normalize(gL+v);
  float a2=puruz*puruz+.002, nh=max(dot(n,h),0.);
  float D=a2/(PI*pow(nh*nh*(a2-1.)+1.,2.)+1e-5);
  float F=f0+(1.-f0)*pow(1.-max(dot(n,v),0.),5.);
  c+=gSunC*min(D,60.)*F*.25*max(nl,0.)*gun;
  vec3 r=reflect(rd,n);
  vec3 ort=ortam(p,r);
  c+=ort*F*yansi*mix(1.,.25,puruz)*(.35+.65*o);
  return c;
}
void main(){
  duzen(uRes);
  gS=uSaat;
  float yuk=mix(.20,.40,gS);
  gL=normalize(vec3(-.92,yuk,-.40));
  gSunI=smoothstep(.12,.75,gS);
  gSunC=mix(vec3(1.,.50,.22),vec3(1.,.80,.56),gS)*5.2;
  gSkyC=mix(vec3(.10,.15,.27),vec3(.50,.47,.42),smoothstep(0.,.7,gS))*.62;
  gLampI=1.-smoothstep(.15,.8,gS);
  gLampP=vec3(gXw+.36,.62,-.25);
  vec3 top=vec3(0.); float der=0.;
  for(int i=0;i<4;i++){
    if(uMobil>.5&&i>1) break;
    vec2 of=(i==0)?vec2(.125,.375):((i==1)?vec2(-.375,-.125):((i==2)?vec2(.375,-.125):vec2(-.125,-.375)));
    if(uMobil>.5) of*=1.2;
    vec2 uv=(gl_FragCoord.xy+of-.5*uRes)/uRes.y;
    vec3 rd=normalize(uv.x*gRt+uv.y*gUp+gF*gFw);
    float d; vec3 c=boya(gRo,rd,d);
    c*=1.05;
    c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);
    top+=pow(clamp(c,0.,1.),vec3(.4545)); der+=d;
  }
  float nn=uMobil>.5?2.:4.;
  top/=nn; der/=nn;
  gl_FragColor=vec4(top,clamp((1.9-der)/1.4,0.,1.));
}
`;
var BIRLESIM = ORTAK + `
float duman(vec2 q,float t,float tohum){   // q: kaynağa göre (x, yukarı), birim = ekran yüksekliği
  if(q.y<-.01||q.y>.42||abs(q.x)>.2) return 0.;
  float y=q.y;
  float sal=.022*sin(y*13.-t*.9+tohum)+.012*sin(y*29.-t*1.7+tohum*2.)+y*.06*sin(t*.23+tohum);
  float x=q.x-sal*smoothstep(0.,.12,y);
  float gen=.012+y*.20;
  float govde=exp(-x*x/(gen*gen));
  float n=fbm(vec2(x*16.+tohum,y*8.-t*.42))*.65+fbm3(vec2(x*38.-tohum,y*18.-t*.8))*.35;
  float d=govde*smoothstep(.36,.92,n+govde*.22);
  return d*smoothstep(-.005,.03,y)*smoothstep(.42,.10,y);
}
void main(){
  duzen(uRes);
  vec2 p=gl_FragCoord.xy/uRes; float asp=uRes.x/uRes.y;
  float yak=texture2D(uOn,p).a;
  vec2 kay=uFare*vec2(-.010,-.006)*(yak-.42)*2.;
  kay.y+=uKay*.02*(yak-.3);
  vec2 pu=clamp(p+kay,vec2(.001),vec2(.999));
  vec4 tx=texture2D(uOn,pu);
  vec3 col=tx.rgb;
  float gun=smoothstep(.12,.75,uSaat);
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  // pencereden süzülen ışık huzmeleri
  vec2 hz=vec2(uv.x*.86+uv.y*.50,-uv.x*.50+uv.y*.86);
  float huz=ns(vec2(hz.x*5.+uT*.015,1.))*.55+ns(vec2(hz.x*13.-uT*.01,7.))*.30+ns(vec2(hz.x*31.,3.))*.15;
  huz=smoothstep(.38,.80,huz);
  float sol=smoothstep(.50*asp,-.50*asp,uv.x)*smoothstep(-.60,.30,uv.y);
  col+=vec3(1.,.80,.52)*huz*sol*gun*.075*(1.-tx.a*.6);
  // havada asılı toz
  for(int k=0;k<2;k++){
    float S=k==0?16.:27.;
    vec2 g=(uv+uFare*.012*float(k+1)+vec2(uT*.004,uT*.006*float(k+1)))*S;
    vec2 id=floor(g), f=fract(g)-.5;
    vec2 o=vec2(h2(id+float(k)*9.)-.5,h2(id+5.+float(k))-.5)*.7;
    o+=.12*vec2(sin(uT*.5+h2(id)*40.),cos(uT*.4+h2(id+2.)*40.));
    float par=smoothstep(.055,.0,length(f-o))*step(.80,h2(id+11.));
    col+=vec3(1.,.86,.62)*par*(.25+.75*huz)*sol*gun*.5*(.5+.5*sin(uT*1.3+h2(id+1.)*30.));
  }
  // buhar: kahve ve taze ekmek
  vec2 kf=izdusum(gCup+vec3(0.,.060,0.));
  float bol=1./max(dot(gCup+vec3(0.,.06,0.)-gRo,gFw),.2);
  float d1=duman((uv-kf)/(bol*gF*.43),uT,1.3);
  vec2 ef=izdusum(gLoaf+vec3(.01,.135,0.));
  float bol2=1./max(dot(gLoaf+vec3(0.,.13,0.)-gRo,gFw),.2);
  float d2=duman((uv-ef)/(bol2*gF*.62)*vec2(.55,1.),uT*.8,7.1)*.55;
  vec3 dc=mix(vec3(.55,.60,.72),vec3(1.,.90,.74),gun);
  col=mix(col,col+dc*(.26+.36*gun),clamp(d1*.75+d2*.55,0.,1.));
  vec2 vq=p-.5; col*=1.-dot(vq,vq)*.42;
  col+=(h2(gl_FragCoord.xy+fract(uT)*61.)-.5)/255.*1.8;
  gl_FragColor=vec4(col,1.);
}
`;
window.SAHNE = { saat: 0.72, frag: BIRLESIM, on: { frag: SAHNE, statik: true, serit: 18 }, maxDpr: 1.5 };
})();
