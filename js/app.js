(()=>{
document.documentElement.classList.add("js");
let A=window.DADOS,T=[],B="",tot=[],topics=0,cur=null,done=new Set();

const PAL={ti:[305,60],hu:[28,50],en:[48,24],ge:[175,40],sa:[185,30]};
A.forEach(a=>{const p=PAL[a.id]||[a.h,60];a.h=p[0];a.t.forEach(t=>{t.h=Math.round(p[0]+((t.h%360)/360-.5)*p[1])})});
A.forEach(a=>{a.tot=a.t.map(t=>t.s.reduce((s,x)=>s+x[1].length,0));a.top=a.tot.reduce((s,n)=>s+n,0);a.subs=a.t.reduce((s,t)=>s+t.s.length,0);a.links=a.t.reduce((s,t)=>s+t.s.reduce((b,x)=>b+x[1].reduce((c,y)=>c+1+y[2].length,0),0),0)});
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const keyOf=a=>a.id==="ti"?"ti-done":"done-"+a.id;
const readDone=a=>{try{return new Set(JSON.parse(localStorage.getItem(keyOf(a))||"[]"))}catch(e){return new Set()}};
const save=()=>{try{localStorage.setItem(keyOf(cur),JSON.stringify([...done]))}catch(e){}};
try{const m=localStorage.getItem("ti-theme");if(m)document.documentElement.dataset.theme=m}catch(e){}
try{const MV=window.MIGRACOES||[],g=i=>{try{return new Set(JSON.parse(localStorage.getItem(i==="ti"?"ti-done":"done-"+i)||"[]"))}catch(e){return new Set()}},s={},ch={};
MV.forEach(([c,f,t])=>{s[f]=s[f]||g(f);s[t]=s[t]||g(t);if(s[f].has(c)&&!s[t].has(c)){s[t].add(c);ch[t]=1}});
for(const t in ch)localStorage.setItem(t==="ti"?"ti-done":"done-"+t,JSON.stringify([...s[t]]))}catch(e){}
const R=18,C=2*Math.PI*R,pad=i=>String(i+1).padStart(2,"0");
const item=(x,k)=>`<li class="step" data-id="${x[0]}" data-k="${esc(norm(x[1]+" "+x[0]+" "+x[2].join(" ")))}"><button class="node" type="button" role="checkbox" aria-checked="false" aria-label="Marcar como estudada: ${esc(x[1])}"></button><div class="row"><span class="n">${k+1}</span><div class="c"><a class="t" href="${x[3]||B}${x[0]}/index.html" target="_blank" rel="noopener">${esc(x[1])}</a><code>${x[0]}</code>${x[2].map(a=>`<a class="alt" href="${x[3]||B}${a}/index.html" target="_blank" rel="noopener" title="Versão alternativa desta aula">alt ${a}</a>`).join("")}</div></div></li>`;
function loadArea(a){
 cur=a;T=a.t;B=a.base;tot=a.tot;topics=a.top;done=readDone(a);flt="all";
 $("#q").value="";$$(".chips button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.f==="all"));
 $("#ah1").innerHTML=a.h1;$("#alead").textContent=a.d;$("#abadge span").textContent="DIREÇÃO "+pad(A.indexOf(a))+" · SEQUÊNCIA DE ESTUDO";
 $("#stats").innerHTML=[[a.links,"links no total"],[a.top,"aulas únicas"],[T.length,"temas"],[a.subs,"subtemas"]].map(([n,l])=>`<div class="stat"><b data-n="${n}">0</b><span>${l}</span></div>`).join("");
 $("#bento").innerHTML=T.map((t,i)=>`<a class="card rv" href="#/${a.id}/t${i}" data-i="${i}" style="--h:${t.h};--d:${i*45}ms"><span class="idx">${pad(i)}</span><svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="${R}"/><circle class="fg" cx="22" cy="22" r="${R}" stroke-dasharray="0 ${C}"/></svg><h3>${esc(t.n)}</h3><p>${t.s.length} subtemas · ${tot[i]} aulas</p><b class="pc">0%</b></a>`).join("");
 $("#themes").innerHTML=T.map((t,i)=>`<details class="theme" id="t${i}" style="--h:${t.h}"><summary><span class="idx">${pad(i)}</span><div class="th"><h2>${esc(t.n)}</h2><p>${esc(t.d)}</p></div><div class="mini"><div class="bar"><i></i></div><small></small></div><span class="chev" aria-hidden="true"></span></summary><div class="subs">${t.s.map((s,j)=>`<section class="sub rv"><h3><span class="sn">${i+1}.${j+1}</span>${esc(s[0])}<small>${s[1].length} aulas</small></h3><ol class="steps">${s[1].map(item).join("")}</ol></section>`).join("")}</div></details>`).join("");
 so.disconnect();$$(".theme").forEach(t=>so.observe(t));so.observe($("#top"));so.observe($("#bento"));
 bindCards($("#bento"),k=>T[k].h);
 $$("#area .rv").forEach(el=>io.observe(el));
 upd();apply();
}
function upd(){
 let D=0;
 $$(".step").forEach(l=>{const on=done.has(l.dataset.id);l.classList.toggle("done",on);$(".node",l).setAttribute("aria-checked",on)});
 T.forEach((t,i)=>{
  const th=$("#t"+i),d=$$(".step.done",th).length,p=tot[i]?d/tot[i]:0;D+=d;
  $(".mini small",th).textContent=d+" / "+tot[i]+" concluídas";
  $(".mini .bar i",th).style.width=(p*100)+"%";
  const c=$(`#bento .card[data-i="${i}"]`);
  $(".fg",c).setAttribute("stroke-dasharray",`${p*C} ${C}`);
  $(".pc",c).textContent=Math.round(p*100)+"%";
 });
 $("#obar").style.width=(D/(topics||1)*100)+"%";
 $("#otxt").textContent=`${D} de ${topics} aulas concluídas · ${Math.round(D/(topics||1)*100)}%`;
}
let flt="all";
function apply(){
 const q=norm($("#q").value.trim()),act=!!q||flt!=="all";let n=0;
 T.forEach((t,i)=>{
  const th=$("#t"+i);let tv=0;
  $$(".sub",th).forEach(sub=>{
   let sv=0;
   $$(".step",sub).forEach(l=>{
    const st=flt==="all"||(flt==="done")===done.has(l.dataset.id);
    const ok=(!q||l.dataset.k.includes(q))&&st;l.hidden=!ok;if(ok)sv++;
   });
   sub.hidden=!sv;tv+=sv;
  });
  th.hidden=!tv;n+=tv;if(act&&tv)th.open=true;
  $(`#bento .card[data-i="${i}"]`).classList.toggle("dim",act&&!tv);
 });
 $("#empty").hidden=n>0;$("#empty").textContent=T.length?"Nenhuma aula encontrada. Tente outro termo ou limpe os filtros.":"O conteúdo desta área está em preparação.";
 $("#rc").textContent=act?n+(n===1?" aula encontrada":" aulas encontradas"):"";
}
$("#themes").addEventListener("click",e=>{
 const nd=e.target.closest(".node");if(!nd)return;
 const id=nd.closest(".step").dataset.id;
 const was=done.has(id);
 was?done.delete(id):done.add(id);
 save();upd();if(flt!=="all")apply();
 if(!was){
  const th=nd.closest(".theme"),i=+th.id.slice(1),r=nd.getBoundingClientRect();
  spawn(r.left+r.width/2,r.top+r.height/2,34,T[i].h,1.2);
  if($$(".step.done",th).length===tot[i]){toast("Tema concluído: "+T[i].n);spawn(innerWidth/2,innerHeight/3,90,T[i].h,2.2)}
  if(done.size===topics)toast("Trilha completa! Parabéns.");
 }
});
$("#q").addEventListener("input",apply);
$$(".chips button").forEach(b=>b.addEventListener("click",()=>{
 flt=b.dataset.f;$$(".chips button").forEach(x=>x.setAttribute("aria-pressed",x===b));apply();
}));
$("#bento").addEventListener("click",e=>{
 const c=e.target.closest(".card");if(!c)return;e.preventDefault();
 const th=$("#t"+c.dataset.i);if(th.hidden)return;th.open=true;
 th.scrollIntoView({behavior:rm?"auto":"smooth",block:"start"});
 try{history.replaceState(null,"","#/"+cur.id+"/t"+c.dataset.i)}catch(x){}
});
$("#next").addEventListener("click",()=>{
 const l=$$(".step").find(x=>!x.hidden&&!done.has(x.dataset.id));
 if(!l){$("#rc").textContent="Nenhuma aula pendente neste filtro.";return}
 l.closest("details").open=true;
 requestAnimationFrame(()=>{l.scrollIntoView({behavior:rm?"auto":"smooth",block:"center"});l.classList.add("flash");setTimeout(()=>l.classList.remove("flash"),1900)});
});
$("#exp").addEventListener("click",()=>$$(".theme").forEach(t=>{if(!t.hidden)t.open=true}));
$("#col").addEventListener("click",()=>$$(".theme").forEach(t=>t.open=false));
$$(".mode").forEach(b=>b.addEventListener("click",()=>{
 const r=document.documentElement,cur=r.dataset.theme||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark");
 const nx=cur==="dark"?"light":"dark";r.dataset.theme=nx;
 try{localStorage.setItem("ti-theme",nx)}catch(e){}
}));
addEventListener("keydown",e=>{
 const typing=/INPUT|TEXTAREA/.test(document.activeElement.tagName);
 if(!$("#area").hidden&&(((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k")||(!typing&&e.key==="/"))){e.preventDefault();$("#q").focus();$("#q").select()}
 else if(e.key==="Escape"&&document.activeElement===$("#q")){$("#q").value="";apply();$("#q").blur()}
});
addEventListener("pointermove",e=>{document.body.style.setProperty("--mx",e.clientX+"px");document.body.style.setProperty("--my",e.clientY+"px");document.body.style.setProperty("--ax",((e.clientX/innerWidth-.5)*-46).toFixed(1)+"px");document.body.style.setProperty("--ay",((e.clientY/innerHeight-.5)*-34).toFixed(1)+"px")},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.06});
const runCounters=(c=document)=>$$("[data-n]",c).forEach(el=>{
 const n=+el.dataset.n;if(rm){el.textContent=n;return}
 const t0=performance.now(),f=t=>{const p=Math.min(1,(t-t0)/1100);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};
 requestAnimationFrame(f);
});
const root=document.documentElement,fine=matchMedia("(pointer:fine)").matches;
const isLight=()=>{const t=root.dataset.theme;return t?t==="light":matchMedia("(prefers-color-scheme:light)").matches};
let gh=260,ght=260,act=260;
const setHue=v=>{ght=v};
function hueStep(k=.07){const d=((ght-gh+540)%360)-180;if(Math.abs(d)>.05){gh=(gh+d*k+360)%360;root.style.setProperty("--gh",gh.toFixed(1))}}
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.id;act=/^t\d+$/.test(id)?T[+id.slice(1)].h:(cur?cur.h:260);setHue(act)}}),{rootMargin:"-45% 0px -50% 0px"});
function bindCards(box,hf){
 $$(".card[data-i]",box).forEach(c=>{
  const v=hf(+c.dataset.i);
  c.addEventListener("pointerenter",()=>setHue(v));c.addEventListener("pointerleave",()=>setHue(act));
  if(rm)return;
  c.addEventListener("pointermove",e=>{
   if(e.pointerType!=="mouse")return;
   const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
   c.style.setProperty("--rx",((.5-y)*9).toFixed(2)+"deg");c.style.setProperty("--ry",((x-.5)*11).toFixed(2)+"deg");
   c.style.setProperty("--px",(x*100).toFixed(1)+"%");c.style.setProperty("--py",(y*100).toFixed(1)+"%");
  });
  c.addEventListener("pointerleave",()=>{c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")});
 });
}
const fx=$("#fx"),fc=fx.getContext("2d");let F=[],fl=false;
function fsize(){const r=devicePixelRatio||1;fx.width=innerWidth*r;fx.height=innerHeight*r;fc.setTransform(r,0,0,r,0,0)}
function spawn(px,py,n,hue,sp=1){
 if(rm)return;
 for(let i=0;i<n;i++){const a=Math.random()*6.283,s=(1.5+Math.random()*4)*sp;F.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1.2,l:1,h:hue+Math.random()*90,r:2+Math.random()*3})}
 if(!fl){fl=true;requestAnimationFrame(ftick)}
}
function ftick(){
 fc.clearRect(0,0,innerWidth,innerHeight);F=F.filter(p=>p.l>0);
 for(const p of F){p.x+=p.vx;p.y+=p.vy;p.vy+=.07;p.vx*=.985;p.l-=.017;fc.globalAlpha=Math.max(p.l,0);fc.fillStyle=`hsl(${p.h%360} 95% 62%)`;fc.beginPath();fc.arc(p.x,p.y,p.r*p.l+.5,0,6.3);fc.fill()}
 fc.globalAlpha=1;
 if(F.length)requestAnimationFrame(ftick);else{fl=false;fc.clearRect(0,0,innerWidth,innerHeight)}
}
function toast(s){const t=$("#toast");t.textContent=s;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),2800)}
if(fine){
 if(!rm)$$(".btn,.chips button").forEach(b=>{
  b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(((e.clientX-r.left)/r.width-.5)*9).toFixed(1)}px,${(((e.clientY-r.top)/r.height-.5)*9).toFixed(1)}px)`});
  b.addEventListener("pointerleave",()=>{b.style.transform=""});
 });
}
addEventListener("scroll",()=>{$("#sp").style.transform=`scaleX(${Math.min(1,scrollY/Math.max(1,root.scrollHeight-innerHeight))})`},{passive:true});
const cv=$("#bg"),g=cv.getContext("2d");let W,H,P=[],m={x:-999,y:-999};
function size(){
 const r=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*r;cv.height=H*r;g.setTransform(r,0,0,r,0,0);fsize();
 const n=Math.min(80,Math.floor(W*H/17000));
 P=Array.from({length:n},()=>{const bx=(Math.random()-.5)*.38,by=(Math.random()-.5)*.38;return{x:Math.random()*W,y:Math.random()*H,bx,by,vx:bx,vy:by}});
}
let last=0;
function draw(t=0){
 const dt=last?Math.min(t-last,120):16;last=t;hueStep(1-Math.exp(-dt/150));
 const L=isLight(),ca=`hsl(${gh} 95% ${L?42:68}%)`,cb=`hsl(${(gh+70)%360} 95% ${L?34:62}%)`;
 g.clearRect(0,0,W,H);
 for(let i=0;i<P.length;i++){
  const p=P[i];let near=0;
  if(!rm){
   const dx=p.x-m.x,dy=p.y-m.y,dm=Math.hypot(dx,dy);
   near=dm<170?1-dm/170:0;
   if(dm<150&&dm>1){const f=(1-dm/150)*.45;p.vx+=dx/dm*f;p.vy+=dy/dm*f}
   p.vx+=(p.bx-p.vx)*.03;p.vy+=(p.by-p.vy)*.03;p.x+=p.vx;p.y+=p.vy;
   if(p.x<0){p.x=0;p.vx=Math.abs(p.vx);p.bx=Math.abs(p.bx)}
   if(p.x>W){p.x=W;p.vx=-Math.abs(p.vx);p.bx=-Math.abs(p.bx)}
   if(p.y<0){p.y=0;p.vy=Math.abs(p.vy);p.by=Math.abs(p.by)}
   if(p.y>H){p.y=H;p.vy=-Math.abs(p.vy);p.by=-Math.abs(p.by)}
  }
  g.globalAlpha=.75;g.fillStyle=cb;g.beginPath();g.arc(p.x,p.y,1.6+near*2.2,0,6.3);g.fill();
  for(let j=i+1;j<P.length;j++){const q=P[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<140){g.strokeStyle=ca;g.globalAlpha=(1-d/140)*.34;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}}
  if(near>0){g.strokeStyle=cb;g.globalAlpha=near*.6;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(m.x,m.y);g.stroke()}
 }
 g.globalAlpha=1;
 if(!rm)requestAnimationFrame(draw);
}
addEventListener("resize",()=>{size();if(rm)draw()});
addEventListener("pointermove",e=>{m.x=e.clientX;m.y=e.clientY},{passive:true});
addEventListener("pointerdown",e=>{
 if(rm)return;
 spawn(e.clientX,e.clientY,10,gh,.6);
 P.forEach(p=>{const dx=p.x-e.clientX,dy=p.y-e.clientY,dm=Math.hypot(dx,dy)||1;if(dm<300){const f=(1-dm/300)*6;p.vx+=dx/dm*f;p.vy+=dy/dm*f}});
});
size();draw();
$$(".hero>*").forEach((el,i)=>el.style.setProperty("--i",i));
const ov=$("#ov");let ended=false,tm;
function endIntro(){
 if(ended)return;ended=true;clearTimeout(tm);ov.remove();root.classList.remove("intro");
 const hm=location.hash.match(/\/t(\d+)$/),t=hm&&!$("#area").hidden&&$("#t"+hm[1]);
 if(t)t.scrollIntoView();else scrollTo(0,0);
 runCounters();
}
function skipIntro(){if(ended||ov.classList.contains("skip"))return;clearTimeout(tm);ov.classList.add("skip");tm=setTimeout(endIntro,460)}
root.classList.add("intro");
tm=setTimeout(endIntro,rm?3000:5350);
$("#skip").addEventListener("click",e=>{e.stopPropagation();skipIntro()});
ov.addEventListener("click",skipIntro);
addEventListener("keydown",e=>{if(!ended&&(e.key==="Escape"||e.key==="Enter"||e.key===" ")){e.preventDefault();skipIntro()}},true);
const SYM="!<>-_\\/[]{}—=+*^?#",rs=()=>SYM[Math.random()*SYM.length|0],enc=t=>t.replace(/\S/g,rs);
function morph(el,to,reveal,dur){
 cancelAnimationFrame(el._r);
 const from=el.textContent,n=to.length,t0=performance.now(),T=[...to].map((_,i)=>i/n*dur*.7+Math.random()*dur*.3);
 el.classList.add("scr");
 (function f(t){
  const e=t-t0;let o="",done=true;
  for(let i=0;i<n;i++){
   const c=to[i];
   if(c===" "){o+=" ";continue}
   if(reveal){if(e>=T[i])o+=c;else{o+=rs();done=false}}
   else if(e<T[i]){o+=from[i]||c;done=false}else if(e<T[i]+90){o+=rs();done=false}else o+=c;
  }
  el.textContent=o;
  if(!done)el._r=requestAnimationFrame(f);else el.classList.remove("scr");
 })(t0);
}
function initScramble(){$$(".dir .d").forEach(p=>{const s=$(".sc",p);s.textContent=p.dataset.t;s.removeAttribute("aria-hidden");$(".sr",p).hidden=true})}
let leaving=false,fxT=[],fxR=0,fxI=[];
$("#dirs").addEventListener("click",e=>{
 const c=e.target.closest(".dir[href]");if(!c||leaving||e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;
 e.preventDefault();const id=c.getAttribute("href").slice(2);
 if(rm){location.hash="#/"+id;return}
 leaving=true;$("#dirs").classList.add("go");c.classList.add("leaving");c.dataset.x=id;
 if(id==="ti")[$(".sc",c),$("h3",c)].forEach(el=>morph(el,enc(el.textContent),false,380));
 setTimeout(()=>{leaving=false;location.hash="#/"+id},520);
});
function tnodes(root){
 const out=[],w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 for(let n;(n=w.nextNode())&&out.length<160;){
  const v=n.nodeValue,p=n.parentElement;
  if(!v.trim()||!p||/^(SCRIPT|STYLE|CODE)$/.test(p.tagName)||p.offsetParent===null)continue;
  const r=p.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight*1.1)continue;
  out.push({n,o:v});
 }
 return out;
}
function animText(items,mode,delay,dur){
 fxI=fxI.concat(items);
 items.forEach(x=>x.n.nodeValue=mode==="dec"?enc(x.o):"");
 fxT.push(setTimeout(()=>{
  const t0=performance.now(),T=items.map(x=>[...x.o].map((_,i)=>i/x.o.length*dur*.8+Math.random()*dur*.2));
  (function f(t){
   const e=t-t0;let go=false;
   items.forEach((x,k)=>{let s="";
    if(mode==="dec"){for(let i=0;i<x.o.length;i++){const c=x.o[i];if(c===" "||e>=T[k][i])s+=c;else{s+=rs();go=true}}}
    else{const m=Math.min(x.o.length,Math.floor(e/dur*x.o.length));s=x.o.slice(0,m);if(m<x.o.length)go=true}
    x.n.nodeValue=s});
   if(go)fxR=requestAnimationFrame(f);else items.forEach(x=>x.n.nodeValue=x.o);
  })(t0);
 },delay));
}
function playEntry(a){
 const ar=$("#area");
 fxT.forEach(clearTimeout);fxT=[];cancelAnimationFrame(fxR);fxI.forEach(x=>x.n.nodeValue=x.o);fxI=[];
 ar.className=ar.className.replace(/\bfx-[\w-]+/g,"").trim();$$(".scan").forEach(x=>x.remove());
 if(rm)return;
 const id=a.id,done=ms=>fxT.push(setTimeout(()=>ar.classList.remove("fx-"+id,"fx-en-go"),ms));
 if(id==="ti"){animText(tnodes(ar),"dec",700,450)}
 else if(id==="hu"){ar.classList.remove("enter");ar.classList.add("fx-hu");animText(tnodes($("#ah1")).concat(tnodes($("#alead"))),"type",350,950);done(1700)}
 else if(id==="en"){ar.classList.add("fx-en");fxT.push(setTimeout(()=>{ar.classList.add("fx-en-go");ar.classList.remove("fx-en")},1000));done(1900)}
 else if(id==="ge"){$$("#area :is(.top,h1,.lead,.stat,.tools>*,.overall,.card,.theme)").forEach((el,i)=>el.style.setProperty("--k",Math.min(i,22)));ar.classList.add("fx-ge");done(2400)}
 else if(id==="sa"){ar.classList.remove("enter");ar.classList.add("fx-sa");const s=document.createElement("div");s.className="scan";s.addEventListener("animationend",()=>s.remove());document.body.appendChild(s);done(1100)}
}
function renderHub(){
 const tl=A.reduce((s,a)=>s+a.links,0),tt=A.reduce((s,a)=>s+a.top,0);
 $("#hstats").innerHTML=[[A.length,A.length===1?"direção":"direções"],[tt,"aulas únicas"],[tl,"links no total"]].map(([n,l])=>`<div class="stat"><b data-n="${n}">0</b><span>${l}</span></div>`).join("");
 $("#dirs").innerHTML=A.map((a,i)=>{const d=readDone(a).size,p=a.top?Math.min(100,Math.round(d/a.top*100)):0;
  return `<a class="card dir rv" href="#/${a.id}" data-i="${i}" style="--h:${a.h};--d:${i*70}ms"><span class="idx">${pad(i)}</span><h3>${esc(a.n)}</h3><p class="d" data-t="${esc(a.d)}"><span class="sc" aria-hidden="true"></span><span class="sr">${esc(a.d)}</span></p><div class="bar"><i style="width:${p}%"></i></div><div class="meta">${a.t.length?`${a.t.length} temas · ${a.top} aulas · ${p}% concluído`:"conteúdo em preparação"}</div><div class="go"><span>Entrar nesta direção</span><i>▸</i></div></a>`}).join("");
 bindCards($("#dirs"),k=>A[k].h);
 $$("#hub .rv").forEach(el=>io.observe(el));runCounters($("#hub"));initScramble();
}
const enter=el=>{el.classList.remove("enter");void el.offsetWidth;el.classList.add("enter")};
function showHub(){
 root.dataset.view="hub";delete root.dataset.dir;$("#dirs").classList.remove("go");leaving=false;$("#area").hidden=true;$("#hub").hidden=false;enter($("#hub"));renderHub();
 act=260;setHue(260);document.title="Trilhas de Ensino — escolha sua direção";scrollTo(0,0);
}
function showArea(a,ti){
 root.dataset.view="area";root.dataset.dir=a.id;const fresh=cur!==a||$("#area").hidden;
 if(cur!==a)loadArea(a);
 $("#hub").hidden=true;const ar=$("#area");ar.hidden=false;
 if(fresh){enter(ar);runCounters(ar);playEntry(a)}
 act=a.h;setHue(a.h);document.title=a.n+" — Trilhas de Ensino";
 const t=ti!=null&&$("#t"+ti);
 if(t){t.open=true;requestAnimationFrame(()=>t.scrollIntoView())}else scrollTo(0,0);
}
function route(){
 const m=location.hash.match(/^#\/([a-z0-9-]+)(?:\/t(\d+))?$/),a=m&&A.find(x=>x.id===m[1]);
 a?showArea(a,m[2]):showHub();
}
addEventListener("hashchange",route);
$("#back").addEventListener("click",()=>{location.hash="#/"});
route();
})();
