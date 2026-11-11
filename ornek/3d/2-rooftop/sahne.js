/* Sahne 2 · Rooftop bar: gece şehri, cama vuran yağmur, içeriden sıcak ışık.
   İki geçiş: (1) şehir 1024x512 dokuya çizilir (mipmap = bulanıklık), (2) cam + damlalar bu dokuyu kırarak örnekler.
   Damla algoritması Dijitabela'ya özgü yazıldı; görsel dosyası yok. */
(function () {
var ORTAK = `
float h1(float n){ return fract(sin(n*127.1)*43758.5453); }
float h2(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
vec3 h3(vec2 p){ vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); q+=dot(q,q.yxz+33.33); return fract((q.xxy+q.yzz)*q.zyx); }
float ns(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
float fbm3(vec2 p){ float a=.5,s=0.; for(int i=0;i<3;i++){ s+=a*ns(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5; } return s; }
`;
var SEHIR = ORTAK + `
const float H0=.46;
vec3 isikRenk(float r){
  return r<.52?vec3(1.,.56,.20):(r<.78?vec3(1.,.80,.55):(r<.94?vec3(.72,.85,1.):(r<.975?vec3(1.,.24,.18):vec3(.35,.85,.8))));
}
float kiyi(float d){ return .74-d*1.5+.035*sin(d*23.)+.02*sin(d*61.); }
float yogun(vec2 w){
  float d=H0-w.y; if(d<0.) return 0.;
  float xk=kiyi(d);
  float kara=smoothstep(xk-.01,xk+.02,w.x);
  float dn=(exp(-d*11.)*.42+.03+.13*smoothstep(.45,.8,ns(w*vec2(7.,24.))))*kara;
  dn+=exp(-abs(w.x-xk-.012)*90.)*.75*smoothstep(.0,.02,d);
  // karşı kıyı (dağ eteği) ışıkları
  dn+=smoothstep(.012,.0,d)*step(w.x,.74)*.55*step(.35,ns(vec2(w.x*40.,1.)));
  return clamp(dn,0.,1.);
}
vec3 bokeh(vec2 P,float S,float seed,float rmin,float rmax,float guc){
  vec2 g=P*S, id=floor(g), f=fract(g);
  vec3 r=h3(id+seed*31.7);
  float R=mix(rmin,rmax,r.z*r.z);
  vec2 c=vec2(.5)+(r.xy-.5)*(1.-2.*R);
  float dn=yogun((id+c)/S);
  float on=step(1.-dn*guc,h2(id*1.31+seed));
  float d=length(f-c)/R;
  float disc=smoothstep(1.,.80,d)*(.72+.28*smoothstep(.5,.95,d));
  float tw=.82+.18*sin(uT*(.7+2.5*r.x)+r.y*40.);
  return isikRenk(h2(id+seed*7.))*disc*on*tw*(.35+.65*r.x);
}
void kule(vec2 P,float cw,float seed,float hmin,float hmax,float pus,vec3 alt,inout vec3 c){
  float g=P.x/cw, id=floor(g), fx=fract(g);
  vec3 r=h3(vec2(id,seed));
  if(r.x<.30||(id+.5)*cw<.80) return;
  float w=mix(.5,.92,r.y), x0=(1.-w)*r.z;
  float top=H0+mix(hmin,hmax,pow(h2(vec2(id+.5,seed)),2.4));
  if(fx>x0&&fx<x0+w&&P.y<top){
    vec3 b=mix(vec3(.010,.013,.024),alt*.42,pus);
    float nx=floor(mix(4.,9.,r.y));
    vec2 wg=vec2((fx-x0)/w*nx,(top-P.y)/(cw*.15)), wi=floor(wg), wf=fract(wg);
    float kat=h2(vec2(wi.y,id+seed));
    float lit=step(.76-.3*step(.85,kat),h2(wi+id*3.1+seed));
    float box=smoothstep(.10,.22,wf.x)*smoothstep(.90,.78,wf.x)*smoothstep(.20,.34,wf.y)*smoothstep(.86,.72,wf.y);
    vec3 wc=mix(vec3(1.,.70,.36),vec3(.72,.84,1.),step(.78,h2(wi*1.7+id)));
    b+=wc*lit*box*(1.-pus*.55)*.8*step(.6,wg.y);
    // çatı ikaz ışığı
    vec2 bp=vec2((fx-x0-w*.5)*cw,P.y-top-.004);
    b+=vec3(1.,.12,.08)*smoothstep(.0045,.001,length(bp))*step(.72,r.z)*(.5+.5*sin(uT*2.+id))*2.;
    c=b;
  }
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; vec2 P=vec2(uv.x*2.,uv.y);
  float gece=uSaat, y=uv.y;
  float yy=max(y-H0,0.)/(1.-H0);
  vec3 ust=mix(vec3(.006,.020,.075),vec3(.0012,.0035,.014),gece);
  vec3 alt=mix(vec3(.16,.070,.065),vec3(.040,.022,.024),gece);
  vec3 c=mix(alt,ust,pow(yy,.30));
  // şehir ışığıyla alttan aydınlanan alçak bulut
  float bl=fbm3(vec2(P.x*3.+uT*.004,yy*7.+2.));
  c+=mix(vec3(.10,.05,.05),vec3(.035,.021,.02),gece)*smoothstep(.42,.75,bl)*exp(-yy*2.6)*.9;
  // dağ silüeti (körfezin karşısı)
  float sr=ns(vec2(P.x*4.,3.))*.6+ns(vec2(P.x*9.,7.))*.27+ns(vec2(P.x*21.,11.))*.13;
  float dag=H0+(.015+.13*sr)*smoothstep(1.05,.30,P.x);
  c=mix(c,mix(vec3(.012,.016,.035),alt,.22),smoothstep(dag+.003,dag-.003,y));
  if(y<H0){
    float d=H0-y, xk=kiyi(d);
    float kara=smoothstep(xk-.006,xk+.012,P.x);
    vec3 deniz=mix(vec3(.008,.015,.036),vec3(.002,.004,.010),gece)+alt*exp(-d*26.)*.35;
    // kıyı ışıklarının sudaki uzun yansıması
    float yn=fbm3(vec2(P.x*70.,y*5.+uT*.05));
    deniz+=vec3(1.,.62,.28)*smoothstep(.50,.85,yn)*exp(-abs(P.x-xk)*9.)*.20*smoothstep(0.,.03,d);
    vec3 zemin=vec3(.005,.006,.010)+alt*exp(-d*16.)*.5;
    zemin+=vec3(.05,.027,.015)*ns(P*vec2(60.,160.))*exp(-d*6.)*.5;
    c=mix(deniz,zemin,kara);
  }
  kule(P,.050,1.,-.02,.10,.62,alt,c);
  kule(P,.074,2.,-.06,.20,.34,alt,c);
  kule(P,.118,3.,-.20,.30,.08,alt,c);
  c+=alt*exp(-abs(y-H0)*13.)*.16;
  // odak dışı ışıklar
  c+=bokeh(P,110.,1.,.20,.40,1.)*1.0;
  c+=bokeh(P+.013,62.,2.,.22,.44,.8)*1.25;
  c+=bokeh(P+.031,34.,3.,.24,.46,.5)*1.35;
  c+=bokeh(P+.007,19.,4.,.28,.46,.30*smoothstep(.03,.3,H0-y))*1.2;
  // sahil yolunda araç farları
  for(int i=0;i<9;i++){
    float fi=float(i), s=fract(fi/9.+uT*.011+h1(fi)*.05), d=s*s*.42+.004;
    vec2 a=vec2(kiyi(d)+.030+d*.05,H0-d);
    float R=.0022+.010*d;
    c+=vec3(1.,.93,.80)*smoothstep(R,R*.6,length(P-a))*1.6;
    s=fract(fi/9.-uT*.009+.07); d=s*s*.42+.004;
    a=vec2(kiyi(d)+.044+d*.07,H0-d); R=.0020+.009*d;
    c+=vec3(1.,.10,.06)*smoothstep(R,R*.6,length(P-a))*1.3;
  }
  gl_FragColor=vec4(sqrt(clamp(c*.25,0.,1.)),1.);
}
`;
var CAM = ORTAK + `
vec3 sehir(vec2 u,float b){ vec3 v=texture2D(uOn,u,b).rgb; return v*v*4.; }
void mercek(vec2 d,float R,float sc,float alfa,inout vec4 o){
  float q=length(d)/R;
  if(q<1.){
    float m=smoothstep(1.,.84,q)*alfa;
    if(m>o.z){
      vec3 n=normalize(vec3(d/R,sqrt(1.-q*q)*.9+.12));
      float sp=pow(max(dot(n,normalize(vec3(-.42,.62,.66))),0.),70.);
      float sp2=pow(max(dot(n,normalize(vec3(.35,-.75,.55))),0.),18.)*.22;
      o=vec4(-d*(1.3+1.4*q*q)*sc,m,(sp+sp2)-smoothstep(.70,1.,q)*.55);
    }
  }
}
// camda duran boncuklar: yavaşça büyür, ağırlaşınca kaybolur
void boncuk(vec2 p,float S,float seed,float dens,inout vec4 o){
  vec2 g=p*S, id=floor(g), f=fract(g)-.5;
  vec3 r=h3(id+seed*13.3);
  if(r.x>dens) return;
  float omur=fract(uT*mix(.012,.035,r.y)+r.z);
  float R=mix(.10,.36,r.y*r.y)*(.55+.45*smoothstep(0.,.6,omur));
  vec2 c=(h3(id*1.7+seed).xy-.5)*(1.-2.*R);
  vec2 d=f-c; d.y*=d.y>0.?.92:1.08; d.x+=.05*R*sin(d.y*9./R+r.z*6.);
  mercek(d,R,1./S,smoothstep(0.,.06,omur)*smoothstep(1.,.90,omur),o);
}
// camdan süzülen damla: tut-bırak hareketi, arkasında ıslak iz ve minik boncuklar
void kayan(vec2 p,float S,float seed,float hizK,inout vec4 o,inout float iz){
  float cw=1./S, col=floor(p.x/cw), fx=p.x/cw-col-.5;
  float r0=h1(col+seed*17.3), ch=cw*6.;
  float T=uT*mix(.045,.12,r0)*hizK+r0*9.; T+=.86*sin(T*6.2832)/6.2832;
  float yy=p.y/ch+T, row=floor(yy), fy=yy-row;
  vec3 r=h3(vec2(col,row)+seed*5.1);
  if(r.x<.42) return;
  float R=mix(.15,.27,r.y);
  float py=p.y*S;
  float xo=(r.z-.5)*.34+.085*sin(py*1.1+r.y*20.)+.045*sin(py*2.9+r.x*9.)+.02*sin(py*7.3);
  vec2 d=vec2(fx-xo,(fy-.16)*6.);
  d.y*=d.y>0.?.70:1.12;
  mercek(d,R,cw,1.,o);
  float ty=(fy-.16)/.84;
  if(ty>0.){
    float w=R*.62*(1.-ty*.75)*(.65+.35*r.x);
    float a=smoothstep(w,w*.35,abs(fx-xo))*pow(1.-ty,.7);
    iz=max(iz,a);
    // izde kalan minik boncuklar (cama göre sabit)
    float by=floor(py*1.6), bf=fract(py*1.6)-.5;
    float br=h2(vec2(by,col+seed));
    vec2 bd=vec2(fx-xo-(br-.5)*w*1.2,bf/1.6);
    mercek(bd,.035+.05*br,cw,step(.45,br)*smoothstep(.02,.12,ty)*(1.-ty),o);
  }
}
float lamba(vec2 q,vec2 c,float R){ float d=length(q-c)/R; return .35*exp(-d*d*1.2)+1.6*exp(-d*d*16.)+3.*exp(-d*d*160.); }
void main(){
  vec2 p=gl_FragCoord.xy/uRes; float asp=uRes.x/uRes.y; vec2 q=vec2(p.x*asp,p.y);
  float olc=mix(1.25,1.,smoothstep(.6,1.5,asp));     // dar ekranda damlalar biraz iri
  vec2 qd=q/olc;
  vec4 o=vec4(0.); float iz=0.;
  boncuk(qd,46.,3.,.50,o);
  boncuk(qd+3.7,21.,2.,.42,o);
  boncuk(qd+9.1,9.5,1.,.30,o);
  kayan(qd+vec2(.37,0.),15.,2.,1.3,o,iz);
  kayan(qd,7.5,1.,1.,o,iz);
  o.xy*=olc;
  float acik=max(o.z,iz*.82);
  float hv=.60;
  vec2 c=vec2(.5+(p.x-.5)*hv*asp*.5,.5+(p.y-.5)*hv);
  c+=vec2(-uFare.x*.016,-uFare.y*.010-uKay*.03);
  vec2 cu=c+o.xy*vec2(.5,1.)*hv*1.9;
  float b=mix(2.2,.0,acik);
  vec3 col=sehir(cu,b>.6?b+.35:0.);
  if(b>.6){
    float e=.0034*b*hv; vec2 ek=vec2(.5,1.)*e; float bb=b+.35;
    col+=sehir(cu+ek*vec2(1.,0.),bb)+sehir(cu+ek*vec2(-.5,.866),bb)+sehir(cu+ek*vec2(-.5,-.866),bb)
        +sehir(cu+ek*vec2(-1.,0.),bb)+sehir(cu+ek*vec2(.5,-.866),bb)+sehir(cu+ek*vec2(.5,.866),bb)
        +sehir(cu+ek*vec2(0.,.5),bb)+sehir(cu+ek*vec2(.433,-.25),bb)+sehir(cu+ek*vec2(-.433,-.25),bb);
    col*=.1;
  }
  // buğu: siyahı kaldırır, damla ve izde cam temizdir
  float bugu=1.-acik;
  col=mix(col,col*.84+vec3(.009,.010,.015)+.07*dot(col,vec3(.33)),bugu*.85);
  col*=1.-iz*(1.-o.z)*.18;
  // iç mekân: cama yansıyan sarkıt lambalar (çift cam = çift görüntü)
  vec2 lq=q+uFare*vec2(.012,.006);
  float fl=.92+.08*sin(uT*7.)*sin(uT*3.1);
  float L=lamba(lq,vec2(asp*.16,.865),.060)+lamba(lq,vec2(asp*.52,.80),.050)+lamba(lq,vec2(asp*.86,.90),.066)
         +.45*(lamba(lq,vec2(asp*.16+.012,.858),.060)+lamba(lq,vec2(asp*.52+.012,.793),.050)+lamba(lq,vec2(asp*.86+.012,.893),.066));
  col+=vec3(1.,.50,.16)*L*.20*(1.-.35*o.z);
  // masadaki mum: alt köşelerde iri, odak dışı sıcak ışık
  float m1=exp(-pow(length((q-vec2(asp*.90,.04))/vec2(.26,.20)),2.)*1.5), m2=exp(-pow(length((q-vec2(asp*.06,-.02))/vec2(.30,.18)),2.)*1.5);
  col+=vec3(1.,.48,.15)*(m1*.34+m2*.20)*fl;
  col+=vec3(.9,.42,.14)*pow(1.-p.y,3.)*.05;
  // damla: sıcak parıltı + koyu kenar
  col*=1.-max(-o.w,0.)*o.z;
  col+=vec3(1.,.74,.42)*max(o.w,0.)*o.z*1.7;
  vec2 vq=p-.5; col*=1.-dot(vq,vq)*.75;
  col*=1.05;
  col=(col*(2.51*col+.03))/(col*(2.43*col+.59)+.14);
  col=pow(clamp(col,0.,1.),vec3(.4545));
  col+=(h2(gl_FragCoord.xy+fract(uT)*61.)-.5)/255.*1.8;
  gl_FragColor=vec4(col,1.);
}
`;
window.SAHNE = { saat: 0.55, frag: CAM, on: { frag: SEHIR, w: 1024, h: 512, mip: true } };
})();
