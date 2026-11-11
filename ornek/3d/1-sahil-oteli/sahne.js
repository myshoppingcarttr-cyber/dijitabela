/* Sahne 1 · Sahil oteli: gün batımında sonsuzluk havuzu + Akdeniz. Tamamı tek fragment shader; görsel dosyası yok. */
window.SAHNE = { saat: 0.3, frag: `
#define PI 3.14159265
const float YP=8.0;      // havuz su kotu (deniz 0)
const float ZF=11.0;     // sonsuzluk kenarı
const float DER=1.35;    // havuz derinliği

vec3 gL,gSun; float gE,gIsik,gAlaca,gXl,gXr,gAz,gK;

float h2(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float ns(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*ns(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5; } return s; }
float fbm3(vec2 p){ float a=.5,s=0.; for(int i=0;i<3;i++){ s+=a*ns(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5; } return s; }
vec2 negim(vec2 p){ float e=.08,n=ns(p); return vec2(ns(p+vec2(e,0.))-n, ns(p+vec2(0.,e))-n)/e; }

// ---------- gökyüzü ----------
vec3 ufukRengi(vec3 rd){
  float e=gE;
  vec3 hs=mix(mix(vec3(.42,.17,.11),vec3(1.30,.50,.15),smoothstep(-1.,-.1,e)),vec3(1.40,.80,.38),smoothstep(0.,1.,e));
  vec3 hf=mix(mix(vec3(.05,.06,.15),vec3(.58,.34,.36),smoothstep(-1.,0.,e)),vec3(.86,.58,.42),smoothstep(0.,1.,e));
  float yon=pow(max(dot(normalize(rd.xz),normalize(gL.xz)),0.),4.);
  return mix(hf,hs,yon);
}
vec3 gok(vec3 rd,float kal){
  float y=max(rd.y,0.), e=gE;
  vec3 zen=mix(mix(vec3(.014,.025,.075),vec3(.075,.14,.37),smoothstep(-1.,0.,e)),vec3(.085,.23,.58),smoothstep(0.,1.,e));
  vec3 mid=mix(mix(vec3(.06,.07,.19),vec3(.60,.38,.42),smoothstep(-1.,0.,e)),vec3(.70,.63,.55),smoothstep(0.,1.,e));
  vec3 c=mix(ufukRengi(rd),mid,smoothstep(0.,.19,y));
  c=mix(c,zen,smoothstep(.04,.40,y));
  float sd=max(dot(rd,gL),0.);
  c+=gSun*(pow(sd,8.)*.012+pow(sd,90.)*.035+pow(sd,1500.)*.16)*gAlaca;
  c+=gSun*smoothstep(.99982,.99991,sd)*2.2;
  if(kal>-.5){
    vec2 q=rd.xz/(rd.y+.10);
    vec2 yon2=normalize(gL.xz);
    float yak=pow(sd,3.)*.75+.25;
    vec3 isikli=mix(vec3(1.5,.46,.28),vec3(2.1,1.05,.50),smoothstep(-.3,1.,e))*smoothstep(-1.05,-.25,e);
    vec3 koyu=mix(zen*.55,mid*.34,.5)+vec3(.018,.014,.028);
    // yüksek ince bulut
    vec2 qa=q*vec2(.22,1.05)+vec2(uT*.003,3.7);
    float d=fbm(qa);
    float cov=smoothstep(.40,.62,d)*smoothstep(.03,.14,rd.y)*(1.-smoothstep(.3,.9,rd.y)*.5);
    float kenar=.5;
    if(kal>.5){ float d2=fbm3(qa+yon2*vec2(.22,1.05)*.25+vec2(0.,-.12)); kenar=clamp((d-d2)*3.4+.45,0.,1.); }
    c=mix(c,mix(koyu,isikli*yak,kenar*(.35+.65*yak)),cov*.86);
    // ufka yakın bulut bandı
    vec2 qb=q*vec2(.07,.42)+vec2(-uT*.002,11.3);
    float b=fbm(qb);
    float cov2=smoothstep(.46,.60,b)*smoothstep(.012,.05,rd.y)*smoothstep(.20,.09,rd.y);
    float k2=.5;
    if(kal>.5){ float b2=fbm3(qb+yon2*vec2(.07,.42)*.5+vec2(0.,-.10)); k2=clamp((b-b2)*4.+.4,0.,1.); }
    c=mix(c,mix(koyu*.9,isikli*(.35+.9*yak),k2*(.25+.75*yak)),cov2*.85);
  }
  return c;
}
float sirt(float a,float k,float tohum){ return ns(vec2(a*k,tohum))*.6+ns(vec2(a*k*2.3,tohum+7.))*.27+ns(vec2(a*k*5.1,tohum+13.))*.13; }
vec3 daglar(vec3 rd,vec3 c){
  float a=atan(rd.x,rd.z)-gAz, el=rd.y/length(rd.xz);
  vec3 puus=ufukRengi(rd);
  float sd=pow(max(dot(normalize(vec3(rd.x,0.,rd.z)),normalize(vec3(gL.x,0.,gL.z))),0.),6.);
  float h1=(.02+.115*sirt(a,5.,3.))*smoothstep(-.34,.10,a)*(.55+.45*smoothstep(-.1,.5,a));
  float m1=smoothstep(h1+.0012,h1-.0012,el);
  vec3 k1=mix(vec3(.30,.27,.40)*(.35+.65*gIsik)+vec3(.02,.025,.05),puus,.52+.25*sd);
  c=mix(c,k1,m1);
  float h2_=(.008+.078*sirt(a,9.,11.))*smoothstep(.02,.42,a);
  float m2=smoothstep(h2_+.0012,h2_-.0012,el);
  vec3 k2=mix(vec3(.13,.12,.21)*(.3+.7*gIsik)+vec3(.012,.015,.03),puus,.26+.2*sd);
  c=mix(c,k2,m2);
  // akşam: kıyı ışıkları (yakın sırtın eteğinde)
  float id=floor(a*520.), ff=fract(a*520.);
  float r1=h2(vec2(id,2.)), r2=h2(vec2(id,5.));
  vec2 lp=vec2((ff-.2-.6*r2)/520., el-.0012-r1*r1*.012*smoothstep(.05,.5,a));
  float l=step(.42,r1)*exp(-dot(lp,lp)*3.2e6)*(.7+.3*sin(uT*1.7+id));
  c+=mix(vec3(1.,.66,.32),vec3(1.,.9,.75),r2)*l*smoothstep(.0,.12,a)*smoothstep(.2,-.6,gE)*2.2;
  return c;
}
// ---------- palmiye ----------
float yaprak(vec2 c,float th,float L,float dr,float ph,float aa){
  float cs=cos(th),sn=sin(th);
  vec2 p=vec2(cs*c.x+sn*c.y,-sn*c.x+cs*c.y), g=vec2(-sn,-cs);
  float s=clamp(p.x/L,0.,1.);
  s=clamp((p.x-L*dr*s*s*g.x)/L,0.,1.);
  s=clamp((p.x-L*dr*s*s*g.x)/L,0.,1.);
  float v=p.y-L*dr*s*s*g.y;
  float zarf=pow(sin(PI*pow(s,.7)),.5)*(1.-.45*s)*L*.19;
  float ts=s*21.-abs(v)*1.9+ph;
  float tarak=abs(fract(ts)-.5)*2.;
  float w=zarf*(.22+.78*smoothstep(.0,.8,tarak))*(.62+.38*h2(vec2(floor(ts),ph*31.+step(0.,v))));
  v+=zarf*.25*s;
  float a=smoothstep(w+aa,w-aa,abs(v));
  a=max(a,smoothstep(.022+aa,.022-aa,abs(v)));
  return a*step(.002,s)*smoothstep(1.,.96,s);
}
float palmiye(vec2 q,float H,float egik,float tohum,float aa){
  if(q.y<-.2||q.y>H+3.6||abs(q.x-egik)>4.2) return 0.;
  float ty=clamp(q.y/H,0.,1.);
  float cx=egik*pow(ty,1.7);
  float r=mix(.21,.13,smoothstep(0.,.6,ty))+.006*sin(q.y*14.);
  float a=smoothstep(r+aa,r-aa,abs(q.x-cx))*step(q.y,H+.1);
  vec2 c=q-vec2(egik,H);
  if(dot(c,c)<14.5){
    a=max(a,smoothstep(.34+aa,.34-aa,length(c*vec2(1.,.8))));
    for(int i=0;i<15;i++){
      float fi=float(i), r1=h2(vec2(fi,tohum)), r2=h2(vec2(fi+20.,tohum));
      float th=mix(-.95,PI+.95,(fi+r1*.9)/15.)+.035*sin(uT*.9+fi*1.7+tohum);
      float L=2.3+r2*1.4, dr=.42+.4*r1+.035*sin(uT*.7+fi+tohum*3.);
      a=max(a,yaprak(c,th,L,dr,r2,aa));
    }
  }
  return a;
}
// üç palmiye: (x, z, boy, eğim, tohum). Dönen: örtü (0..1)
float palmiyeler(vec3 o,vec3 d,float W){
  float a=0.,t; vec3 P;
  if(d.z>.001){
    t=(22.-o.z)/d.z; P=o+d*t; a=max(a,palmiye(P.xy-vec2(-W*22.*mix(1.08,1.01,gK),YP-5.),11.2,.9,1.,t*.0011));
    t=(30.-o.z)/d.z; P=o+d*t; a=max(a,palmiye(P.xy-vec2(W*30.*mix(2.2,.66,gK),YP-6.),11.0,.5,2.,t*.0011));
    t=(25.-o.z)/d.z; P=o+d*t; a=max(a,palmiye(P.xy-vec2(W*25.*mix(1.10,.96,gK),YP-5.),12.3,-1.2,3.,t*.0011));
  }
  return a;
}
vec3 cevre(vec3 o,vec3 d,float W,float palm){
  vec3 c=daglar(d,gok(d,0.));
  if(palm>.5){ float a=palmiyeler(o,d,W); c=mix(c,vec3(.012,.014,.012)+ufukRengi(d)*.02,a); }
  return c;
}
float kaustik(vec2 p,float t){
  vec2 q=p+.35*vec2(ns(p*1.7+t*.3),ns(p*1.7-t*.25+5.));
  float a=abs(sin(q.x*3.+t*.6)+sin(q.y*3.4-t*.5)+sin((q.x+q.y)*2.3+t*.4))/3.;
  return pow(1.-a,6.);
}
// ---------- deniz ----------
vec3 deniz(vec3 ro,vec3 rd){
  float ts=-ro.y/rd.y; vec3 P=ro+rd*ts; vec2 w=P.xz; float t=uT;
  vec2 g=vec2(0.); float s2=.00035, fd;
  // uzun ölü dalga
  float wr=ns(w*.021+t*.012)*6.283;
  fd=exp(-ts*.0009); g+=vec2(.35,-.94)*cos(dot(w,vec2(.35,-.94))*.19+t*.62+wr)*.022*fd;
  fd=exp(-ts*.0016); g+=vec2(-.5,-.87)*cos(dot(w,vec2(-.5,-.87))*.37+t*.9-wr*.7)*.022*fd;
  // rüzgâr çırpıntısı: gürültü eğimi, kreti x boyunca uzamış
  #define KAT(sx,sz,vx,vz,sl,kf) { fd=exp(-ts*kf); g+=negim(w*vec2(sx,sz)+vec2(vx,vz)*t)*vec2(sx,sz)*sl*fd; s2+=sl*sl*sz*sz*.9*(1.-fd*fd); }
  KAT(.11,.26,.10,.21,.20,.0030)
  KAT(.30,.62,-.22,.34,.085,.0075)
  KAT(.75,1.45,.33,.52,.036,.018)
  KAT(1.9,3.3,-.6,.9,.016,.045)
  KAT(4.6,7.2,.9,1.4,.007,.11)
  vec3 n=normalize(vec3(-g.x,1.,-g.y)), V=-rd;
  float nv=max(dot(n,V),0.);
  float F=.02+.98*pow(1.-nv,5.);
  vec3 R=reflect(rd,n); R.y=abs(R.y)+.012; R=normalize(R);
  vec3 yans=daglar(R,gok(R,0.));
  vec3 ufk=ufukRengi(rd);
  vec3 derin=vec3(.008,.044,.070)*(.25+1.0*gIsik)+vec3(.003,.008,.018);
  derin+=vec3(.015,.085,.085)*gIsik*clamp(g.y*4.+.15,0.,1.)*exp(-ts*.012);
  vec3 c=mix(derin,yans,F);
  vec3 H=normalize(gL+V); float nh=max(dot(n,H),1e-3);
  float tan2=(1.-nh*nh)/(nh*nh);
  float D=exp(-tan2/s2)/(PI*s2*nh*nh*nh*nh);
  float pk=exp(-ts*.006); float kv=ns(w*vec2(1.3,4.2)+t*vec2(.7,1.6)); kv=mix(1.,.25+2.2*kv*kv,pk);
  float spec=min(D*F*.25/max(nv,.03),140.)*kv;
  c+=gSun*spec*.020*smoothstep(-.012,.03,gL.y);
  c=mix(c,ufk*.90,1.-exp(-ts*.00040));
  return c;
}
// ---------- havuz ----------
vec3 havuz(vec3 P,vec3 rd,float tp,vec3 ro,float W){
  vec2 w=P.xz; float t=uT, az=1./(1.+tp*.07);
  vec2 g=vec2(0.);
  g+=vec2(.8,.6)*cos(dot(w,vec2(.8,.6))*2.1+t*1.0)*.013;
  g+=vec2(-.5,.86)*cos(dot(w,vec2(-.5,.86))*3.7-t*1.4)*.010;
  g+=vec2(.2,-.98)*cos(dot(w,vec2(.2,-.98))*6.3+t*1.9)*.007;
  g+=negim(w*1.6+vec2(t*.22,-t*.17))*.030;
  g+=negim(w*5.5-vec2(t*.3,t*.21))*.012*az;
  g*=.55+.45*az;
  vec3 n=normalize(vec3(-g.x,1.,-g.y));
  float nv=max(dot(n,-rd),0.);
  float F=.02+.98*pow(1.-nv,5.); F=mix(F,1.,.10);
  vec3 R=reflect(rd,n); R.y=abs(R.y)+.004; R=normalize(R);
  vec3 yans=cevre(P,R,W,1.);
  vec3 T=refract(rd,n,.752);
  float tb=DER/max(-T.y,.08); vec3 B=P+T*tb;
  vec2 tq=B.xz/.20, tf=abs(fract(tq)-.5);
  float uz=tb+tp;
  float derz=smoothstep(.465,.5,max(tf.x,tf.y))*exp(-uz*.16);
  float th=h2(floor(tq));
  vec3 alb=mix(vec3(.13,.47,.55),vec3(.20,.58,.64),th);
  alb=mix(alb,vec3(.70,.84,.84),derz*.55);
  float ka=kaustik(B.xz*3.1,t)*.6+kaustik(B.xz*1.3+7.,t*.8)*.4;
  vec3 zen=gok(vec3(0.,1.,0.),-1.), ufk=ufukRengi(vec3(gL.x,0.,gL.z));
  vec3 Lw=zen*.75+ufk*.22+gSun*max(gL.y,0.)*smoothstep(-.01,.04,gL.y)*(.06+ka*.30);
  vec3 govde=alb*Lw;
  float gece=smoothstep(.25,-.75,gE);
  float lx=.5+.5*cos((B.x-gXl-1.6)*PI*2./3.6); lx=lx*lx*lx;
  float lg=(.22+1.5*lx*exp(-(ZF-B.z)*.30)+.5*exp(-(B.x-gXl)*.5));
  govde+=vec3(.04,.40,.52)*gece*lg*(.7+.3*ka)*.62;
  govde*=exp(-vec3(.40,.065,.04)*(tb*.9+.4));
  govde+=vec3(.0,.035,.045)*(dot(Lw,vec3(.33))+gece*.5)*(1.-exp(-tb*.35));
  vec3 c=mix(govde,yans,F);
  // sonsuzluk kenarı: ince taşma dudağı
  float dudak=smoothstep(ZF-.16,ZF-.05,P.z);
  c=mix(c,c*.62+yans*.10,dudak);
  return c;
}
// ---------- teras ----------
vec3 teras(vec3 P,vec3 rd,float tp,float W){
  vec2 w=P.xz;
  vec2 tq=w/.9, tf=abs(fract(tq)-.5);
  float derz=smoothstep(.482,.5,max(tf.x,tf.y))*exp(-tp*.05);
  float doku=fbm3(w*3.1)*.5+fbm3(w*17.)*.5;
  vec3 alb=mix(vec3(.36,.31,.26),vec3(.50,.45,.38),doku)*(.92+.16*h2(floor(tq)));
  alb=mix(alb,vec3(.16,.14,.12),derz*.8);
  float golge=1.-palmiyeler(P+vec3(0.,.02,0.),gL,W)*.85;
  if(gL.y<=0.) golge=0.;
  vec3 zen=gok(vec3(0.,1.,0.),-1.), ufk=ufukRengi(vec3(gL.x,0.,gL.z));
  vec3 c=alb*(zen*.85+ufk*.30+gSun*max(gL.y,0.)*.42*golge*smoothstep(-.01,.05,gL.y));
  float gece=smoothstep(.25,-.75,gE);
  // akşam: havuz kenarı zemin aydınlatması
  float dx=min(abs(P.x-gXl),abs(P.x-gXr));
  c+=alb*vec3(1.,.62,.30)*gece*.42*exp(-dx*1.1)*(.5+.5*smoothstep(.2,.9,sin(P.z*2.2)));
  vec3 R=reflect(rd,vec3(0.,1.,0.)); R=normalize(R+vec3(0.,.02,0.));
  float F=.03+.97*pow(1.-max(-rd.y,0.),5.);
  c=mix(c,cevre(P,R,W,1.),F*(.30+.25*doku));
  return c;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y; float asp=uRes.x/uRes.y;
  float f=mix(1.0,1.55,smoothstep(.6,1.7,asp)), W=.5*asp/f;
  float el=mix(.165,-.135,uSaat);
  gAz=mix(.05,.235,smoothstep(.55,1.6,asp));
  gL=normalize(vec3(sin(gAz)*cos(el),sin(el),cos(gAz)*cos(el)));
  gE=clamp(el/.15,-1.,1.);
  gIsik=smoothstep(-1.,.6,gE);
  gAlaca=smoothstep(-1.15,-.1,gE);
  gSun=mix(vec3(1.,.26,.06),vec3(1.,.72,.42),smoothstep(-.03,.16,el))*(5.+26.*smoothstep(-.02,.14,el));
  gK=smoothstep(.6,1.4,asp);
  gXl=-W*10.5*.80; gXr=W*13.5*1.3;

  vec3 ro=vec3(uFare.x*.55,YP+1.72+uFare.y*.14,0.);
  float pitch=-.052-uKay*.06+uFare.y*.012, yaw=uFare.x*.022+sin(uT*.06)*.004;
  vec3 fw=normalize(vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch)));
  vec3 rt=normalize(cross(vec3(0.,1.,0.),fw)), up=cross(fw,rt);
  vec3 rd=normalize(uv.x*rt+uv.y*up+f*fw);

  vec3 c;
  float kz=0.,tp=0.; vec3 P=ro;
  if(rd.y<-.004){ tp=(YP-ro.y)/rd.y; P=ro+rd*tp; float aaz=tp*tp/(1.72*f*uRes.y)*1.3; kz=clamp((ZF-P.z)/aaz*.5+.5,0.,1.); }
  if(kz<1.){
    if(rd.y>=0.){
      c=gok(rd,1.);
      vec2 sq=rd.xy/(rd.z+1e-3)*230.; vec2 si=floor(sq);
      float sh=h2(si);
      float yil=step(.985,sh)*smoothstep(.45,.0,length(fract(sq)-.5))*(.6+.4*sin(uT*1.5+sh*90.));
      c+=vec3(.8,.85,1.)*yil*smoothstep(-.35,-1.,gE)*smoothstep(.05,.3,rd.y)*.8;
      c=daglar(rd,c);
    }else c=deniz(ro,rd);
    float pa=palmiyeler(ro,rd,W);
    if(pa>0.){
      float sp=pow(max(dot(rd,gL),0.),14.);
      vec3 pc=vec3(.013,.016,.012)+ufukRengi(rd)*.018+gSun*vec3(.9,.7,.25)*sp*.012*(1.-pa*.6);
      c=mix(c,pc,pa);
    }
  }
  if(kz>0.){
    float aax=tp/(f*uRes.y)*1.2;
    float kx=clamp((P.x-gXl)/aax*.5+.5,0.,1.)*clamp((gXr-P.x)/aax*.5+.5,0.,1.);
    vec3 ct=vec3(0.);
    if(kx>0.) ct=havuz(P,rd,tp,ro,W)*kx;
    if(kx<1.){
      vec3 cd=teras(P,rd,tp,W);
      float kn=max(smoothstep(.36,.32,abs(P.x-gXl)),smoothstep(.36,.32,abs(P.x-gXr)));
      cd=mix(cd,cd*1.22+.01,kn*.5);
      ct+=cd*(1.-kx);
    }
    c=mix(c,ct,kz);
  }
  // mercek: güneş çevresinde hafif parlama
  float sd=max(dot(rd,gL),0.);
  c+=gSun*pow(sd,30.)*.010*gAlaca;
  c*=.62*mix(1.,2.0,smoothstep(.2,-1.,gE));
  vec2 vq=gl_FragCoord.xy/uRes-.5;
  c*=1.-dot(vq,vq)*.55;
  c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);
  c=pow(clamp(c,0.,1.),vec3(.4545));
  c=mix(vec3(dot(c,vec3(.299,.587,.114))),c,1.16);
  c+=(h2(gl_FragCoord.xy+fract(uT)*61.)-.5)/255.*1.6;
  gl_FragColor=vec4(c,1.);
}
` };
