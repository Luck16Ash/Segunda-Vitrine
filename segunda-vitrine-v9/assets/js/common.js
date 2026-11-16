const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=v=>String(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const slug=v=>norm(v).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const ini=n=>String(n||"").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
const ic=(id,s=18)=>`<svg width="${s}" height="${s}" aria-hidden="true"><use href="#${id}"/></svg>`;
const safeUrl=v=>{try{const u=new URL(v,location.href);return!!v&&!/^#|exemplo\.com/.test(v)&&["http:","https:"].includes(u.protocol)}catch{return false}};
const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)");
const hue=n=>[...String(n)].reduce((a,c)=>a+c.charCodeAt(0),0)%40+200; /* azuis variados, coerentes com a marca */
const isReal=m=>m.nome&&!/^nome do integrante$/i.test(m.nome.trim());

/* Selo de tecnologia: logotipo (CDN) + nome sempre visível; se o logo falhar, fica só o texto. */
const col=n=>TECH_COLOR[n]||"#4A5B75";
const logo=(n,s=16)=>TECH[n]?`<img src="${TECH[n]}" alt="" width="${s}" height="${s}" loading="lazy" onerror="this.remove()">`:"";
const badge=n=>`<span class="tag tc" style="--c:${col(n)}" title="${esc(n)}">${logo(n)}${esc(n)}</span>`;
const shield=n=>`<span class="shield${TECH_LIGHT.includes(n)?" lt":""}" style="--c:${col(n)}"><i>${logo(n,20)}</i>${esc(n)}</span>`;
const stripBg=m=>{const c=(m.techs||[]).slice(0,4).map(col);return c.length>1?`linear-gradient(90deg,${c.join(",")})`:(c[0]||"var(--accent)")};
const softB=n=>{const[e,k]=SOFT[n]||["⭐","#0A6CFF"];return`<span class="soft" style="--c:${k}"><i>${e}</i>${esc(n)}</span>`};
const badges=a=>(a||[]).map(badge).join("");
const tags=a=>(a||[]).filter(Boolean).map(v=>`<span class="tag">${esc(v)}</span>`).join("");
const techOf=p=>String(p.tech||"").split("·").map(x=>x.trim()).filter(Boolean);
const avatar=m=>`<span class="av" style="--h:${hue(m.nome)}">${esc(ini(m.nome))}${m.foto?`<img src="${esc(m.foto)}" alt="Foto de ${esc(m.nome)}" loading="lazy" onerror="this.remove()">`:""}</span>`;

function cardMembro(m,i){return`<button class="card mem rv" type="button" data-i="${i}" aria-label="Ver perfil de ${esc(m.nome)}">
<span class="strip" style="background:${stripBg(m)}"></span>${m.exemplo?'<span class="ex">Perfil de exemplo</span>':""}${m.destaque?'<span class="star">★ Núcleo</span>':""}${avatar(m)}
<span class="mem-name">${esc(m.nome)}</span><span class="role">${esc(m.papel||"Integrante")}</span>
<span class="meta2"><b class="curso" style="--cc:${CURSO_COR[m.curso]||"#0B5CD5"}">${esc(m.curso||"")}</b><span>${esc(m.segmento||"")}</span></span>
<span class="tags">${badges((m.techs||[]).slice(0,4))}${(m.techs||[]).length>4?`<span class="tag more-t">+${m.techs.length-4}</span>`:""}</span>
<span class="see">Ver perfil ${ic("i-arrow",16)}</span></button>`}
function renderMembros(list){const g=$("#grid");if(!g)return;g.innerHTML=list.map(m=>cardMembro(m,MEMBROS.indexOf(m))).join("");reveal(g)}
const equipeOf=p=>p.equipe||MEMBROS.filter(m=>isReal(m)&&!m.exemplo&&(m.projetos||[]).includes(p.nome)).map(m=>m.nome);
const iconLink=(u,icon,t,who)=>safeUrl(u)?`<a class="ico-btn" href="${esc(u)}" target="_blank" rel="noopener noreferrer" aria-label="${t} de ${esc(who)} (abre em nova aba)" title="${t}">${ic(icon,22)}<span>${t}</span></a>`:`<span class="ico-btn off" role="img" aria-label="${t} ainda não informado" title="${t}: ainda não informado">${ic(icon,22)}<span>${t}</span></span>`;
function cardProjeto(p,i){
const media=p.imagem?`<div class="pimg"><img class="project-image" src="${esc(p.imagem)}" alt="${esc(p.alt||"Imagem do projeto "+p.nome)}" loading="lazy">${p.ilustrativa?'<span class="ilus">Imagem ilustrativa</span>':""}</div>`:`<div class="thumb" aria-hidden="true"><span>${esc(p.nome)}</span></div>`;
const t=techOf(p),eq=equipeOf(p);
return`<article class="card project-card rv" data-p="${i}">${media}<div class="project-content"><p class="pmeta">${p.status?`<span class="pst pst-${slug(p.status)}">${esc(p.status)}</span>`:""}${p.setor?`<span class="tag">${esc(p.setor)}</span>`:""}</p><h3>${esc(p.nome)}</h3><p>${esc(p.desc)}</p><div class="tags" aria-label="Tecnologias">${t.length?badges(t.slice(0,4))+(t.length>4?`<span class="tag more-t">+${t.length-4}</span>`:""):'<span class="tag">Tecnologias em atualização</span>'}</div>${eq.length?`<p class="project-team">👥 ${esc(eq.join(", "))}</p>`:""}<button class="btn btn-g proj-open" type="button" data-p="${i}" aria-label="Ver detalhes de ${esc(p.nome)}">Ver detalhes ${ic("i-arrow",15)}</button></div></article>`}
function renderProjetos(list){const g=$("#proj");if(!g)return;g.innerHTML=list.map(p=>cardProjeto(p,PROJETOS.indexOf(p))).join("");reveal(g)}

/* Filtros: grupos recolhíveis com contagem, filtros ativos e busca livre. OR dentro do grupo, AND entre grupos. */
function initFiltros(kind){
  const isM=kind==="membros",items=isM?MEMBROS.filter(isReal):PROJETOS,box=$("#filtros"),input=$("#q"),count=$("#n"),empty=$("#empty"),clear=$("#clr");
  if(!box||!input)return;
  const dims=isM?{curso:m=>[m.curso],segmento:m=>[m.segmento],tecnologia:m=>m.techs,projeto:m=>m.projetos}:{tecnologia:techOf,setor:p=>[p.setor],solucao:p=>[p.solucao],status:p=>[p.status],equipe:equipeOf};
  const labels={curso:"Curso",segmento:"Segmento",tecnologia:"Tecnologia",projeto:"Projeto",setor:"Setor",solucao:"Tipo de solução",status:"Status",equipe:"Equipe"};
  const icons={curso:"🎓",segmento:"🧭",tecnologia:"🧰",projeto:"📦",setor:"🏷️",solucao:"🧩",status:"🚦",equipe:"👥"};
  const sel={};Object.keys(dims).forEach(d=>sel[d]=new Set());
  const P=new URLSearchParams(location.search);
  const vals=d=>{const m=new Map();items.forEach(i=>[...new Set((dims[d](i)||[]).filter(Boolean))].forEach(v=>m.set(v,(m.get(v)||0)+1)));return[...m].sort((a,b)=>d==="tecnologia"?b[1]-a[1]||a[0].localeCompare(b[0]):a[0].localeCompare(b[0]))};
  box.innerHTML=`<div class="fhead"><b>Filtros</b><button id="limpar" type="button">Limpar tudo</button></div>`+Object.keys(dims).map((d,k)=>{const v=vals(d);if(!v.length)return"";const pre=P.get(d),has=v.some(x=>x[0]===pre),long=v.length>9&&!has;
    return`<details class="fs"${k<3||has?" open":""}><summary><span>${icons[d]} ${labels[d]}</span><b class="n" data-n="${d}"></b></summary><div class="chips${long?" long":""}">${v.map(([x,n])=>`<label class="chip"><input type="checkbox" data-d="${d}" value="${esc(x)}"><span>${d==="tecnologia"&&TECH[x]?`<img src="${TECH[x]}" alt="" width="16" height="16" onerror="this.remove()">`:""}${esc(x)} <em>${n}</em></span></label>`).join("")}</div>${long?`<button class="more-btn" type="button" data-more data-t="${v.length}" aria-expanded="false">Ver todas (${v.length})</button>`:""}</details>`}).join("");
  Object.keys(dims).forEach(d=>{const v=P.get(d),c=v&&$$(`input[data-d=${d}]`,box).find(x=>x.value===v);if(c){c.checked=true;sel[d].add(v)}});
  let at=$("#ativos");if(!at){at=document.createElement("div");at.id="ativos";at.className="ativos";at.setAttribute("aria-label","Filtros ativos");count.before(at)}
  const text=i=>isM?[i.nome,i.papel,i.curso,CURSOS[i.curso],i.segmento,...(i.areas||[]),...(i.techs||[]),...(i.projetos||[])].join(" "):[i.nome,i.desc,i.tech,i.setor,i.solucao,i.status,i.problema,i.publico,i.feito].join(" ");
  function run(){const q=norm(input.value.trim());
    const r=items.filter(i=>(!q||norm(text(i)).includes(q))&&Object.keys(dims).every(d=>!sel[d].size||(dims[d](i)||[]).some(v=>sel[d].has(v))));
    (isM?renderMembros:renderProjetos)(r);empty.hidden=r.length>0;clear.hidden=!input.value;
    at.innerHTML=Object.keys(sel).flatMap(d=>[...sel[d]].map(v=>`<button class="pill-a" type="button" data-d="${d}" data-v="${esc(v)}" aria-label="Remover filtro ${esc(v)}">${esc(v)} ✕</button>`)).join("");
    $$("b[data-n]",box).forEach(b=>{b.textContent=sel[b.dataset.n]?.size||""});
    const f=Object.values(sel).reduce((a,s)=>a+s.size,0);count.textContent=`${r.length} ${r.length===1?"resultado":"resultados"}${f?` · ${f} ${f===1?"filtro":"filtros"}`:""}`;
    const b=$("#abrir-f");if(b)b.dataset.n=f||""}
  box.addEventListener("change",e=>{const c=e.target.closest("input[data-d]");if(!c)return;c.checked?sel[c.dataset.d].add(c.value):sel[c.dataset.d].delete(c.value);run()});
  box.addEventListener("click",e=>{const m=e.target.closest("[data-more]");if(!m)return;const ex=m.previousElementSibling.classList.toggle("exp");m.textContent=ex?"Ver menos":`Ver todas (${m.dataset.t})`;m.setAttribute("aria-expanded",ex)});
  at.addEventListener("click",e=>{const b=e.target.closest(".pill-a");if(!b)return;const c=$$(`input[data-d=${b.dataset.d}]`,box).find(x=>x.value===b.dataset.v);if(c){c.checked=false;sel[b.dataset.d].delete(b.dataset.v);run()}});
  $("#limpar").addEventListener("click",()=>{$$("input[data-d]",box).forEach(c=>c.checked=false);Object.values(sel).forEach(s=>s.clear());input.value="";run()});
  input.addEventListener("input",run);clear.addEventListener("click",()=>{input.value="";run();input.focus()});
  const q=P.get("q");if(q)input.value=q;
  $("#abrir-f")?.addEventListener("click",e=>{const o=box.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)});
  run()}

/* Modal de perfil */
let lastFocus=null,prevOv="";
function openMemberProfile(i){const m=MEMBROS[i],md=$("#md"),pane=$("#pane");if(!m||!md)return;
  lastFocus=document.activeElement;prevOv=document.body.style.overflow;
  const ln=(u,icon,t)=>safeUrl(u)?`<a class="ico-btn" href="${esc(u)}" target="_blank" rel="noopener noreferrer" aria-label="${t} de ${esc(m.nome)} (abre em nova aba)" title="${t}">${ic(icon,22)}<span>${t}</span></a>`:`<span class="ico-btn off" role="img" aria-label="${t} ainda não informado" title="${t}: ainda não informado">${ic(icon,22)}<span>${t}</span></span>`;
  const L=ln(m.linkedin,"i-linkedin","LinkedIn")+ln(m.github,"i-github","GitHub")+ln(m.curriculo,"i-file","Currículo");
  const sec=(icon,t,body)=>body?`<section class="ps"><h3>${ic(icon)} ${t}</h3>${body}</section>`:"";
  pane.innerHTML=`<div class="phead" style="--h:${hue(m.nome)}"><button class="x" id="modal-close" type="button" aria-label="Fechar perfil">${ic("i-x",18)}</button>
  <div class="big">${avatar(m)}</div><div><h2 class="profile-title" id="profile-title">${esc(m.nome)}</h2><p class="role">${esc(m.papel||"Integrante")}</p>
  <p class="badges2"><b class="curso" style="--cc:${CURSO_COR[m.curso]||"#0B5CD5"}">${esc(m.curso||"")}</b>${m.segmento?`<span class="seg">${esc(m.segmento)}</span>`:""}${m.exemplo?'<span class="ex">Perfil de exemplo</span>':""}</p></div></div>
  <div class="pbody"><p class="sub">${esc(CURSOS[m.curso]||m.curso||"")} · FATEC Zona Sul</p>
  ${sec("i-code","Stack",m.techs?.length?`<div class="shields">${m.techs.map(shield).join("")}</div>`:"")}
  ${sec("i-target","Objetivo de carreira",m.objetivo?`<div class="goal"><p>${esc(m.objetivo)}</p></div>`:"")}
  ${sec("i-data","Áreas de atuação",m.areas?.length?`<div class="tags">${tags(m.areas)}</div>`:"")}
  ${m.destaque&&m.funcoes?.length?`<section class="ps"><div class="fn-card"><span class="fn-badge">★ Núcleo da iniciativa</span><h3>${ic("i-gear")} Funções na iniciativa</h3><ul>${m.funcoes.map(f=>`<li>${esc(f)}</li>`).join("")}</ul></div></section>`:sec("i-gear","Funções na iniciativa",m.funcoes?.length?`<div class="tags">${tags(m.funcoes)}</div>`:"")}
  ${sec("i-hand","Soft skills",m.soft?.length?`<div class="softs">${m.soft.map(softB).join("")}</div>`:"")}
  ${sec("i-box","Projetos na vitrine",m.projetos?.length?`<div class="tags">${tags(m.projetos)}</div>`:"")}
  <div class="links" aria-label="Links de ${esc(m.nome)}">${L}</div></div>`;
  md.setAttribute("aria-labelledby","profile-title");md.classList.add("open");md.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  $("#modal-close").focus();$("#modal-close").addEventListener("click",closeMemberProfile);history.replaceState(null,"","#"+slug(m.nome))}
function openProject(i){const p=PROJETOS[i],md=$("#md"),pane=$("#pane");if(!p||!md)return;
  lastFocus=document.activeElement;prevOv=document.body.style.overflow;
  const t=techOf(p),eq=equipeOf(p),vz='<p class="vazio">⏳ Em atualização pelo estudante responsável.</p>';
  const S=(em,tt,txt)=>`<section class="ps"><h3><span aria-hidden="true">${em}</span> ${tt}</h3>${txt?`<p class="ptxt">${esc(txt)}</p>`:vz}</section>`;
  const Q=[["Que problema resolve?",p.problema],["Pra quem foi feito?",p.publico],["O que a equipe fez?",p.feito],["Por que essas tecnologias?",p.porque],["Como rodar?",p.rodar]],ok=Q.filter(q=>q[1]).length;
  pane.innerHTML=`<div class="phead" style="--h:210"><button class="x" id="modal-close" type="button" aria-label="Fechar detalhes">${ic("i-x",18)}</button>
  <div class="big"><span class="av" style="--h:210">📦</span></div><div><h2 class="profile-title" id="profile-title">${esc(p.nome)}</h2><p class="role">${esc([p.setor,p.solucao].filter(Boolean).join(" · "))}</p>
  <p class="badges2">${p.status?`<span class="pst pst-${slug(p.status)}">${esc(p.status)}</span>`:""}</p></div></div>
  <div class="pbody"><p class="sub">${esc(p.desc)}</p>
  ${p.print?`<figure class="print"><img src="${esc(p.print)}" alt="Aplicação ${esc(p.nome)} em funcionamento" loading="lazy"></figure>`:'<p class="vazio">🖼️ Print da aplicação rodando: em breve.</p>'}
  ${S("🎯","Problema",p.problema)}${S("👥","Para quem",p.publico)}${S("⚙️","O que a equipe fez",p.feito)}
  <section class="ps"><h3><span aria-hidden="true">🧰</span> Tecnologias e por quê</h3>${t.length?`<div class="shields">${t.map(shield).join("")}</div>`:""}${p.porque?`<p class="ptxt">${esc(p.porque)}</p>`:vz}</section>
  ${S("▶️","Como rodar",p.rodar)}${S("📈","Resultado",p.resultado)}
  ${eq.length?`<section class="ps"><h3><span aria-hidden="true">🙋</span> Equipe</h3><div class="tags">${tags(eq)}</div></section>`:""}
  <section class="ps"><h3><span aria-hidden="true">📋</span> Documentação do projeto: ${ok}/5</h3><ul class="rd">${Q.map(q=>`<li class="${q[1]?"ok":""}"><span aria-hidden="true">${q[1]?"✅":"⏳"}</span> ${q[0]}</li>`).join("")}</ul></section>
  ${p.aviso?`<p class="aviso-p">ℹ️ ${esc(p.aviso)}</p>`:""}
  <div class="links" aria-label="Links do projeto">${iconLink(p.repo,"i-github","GitHub",p.nome)}${iconLink(p.deploy,"i-globe","Site no ar",p.nome)}</div>
  <p class="fine2">O uso do nome do negócio é de responsabilidade do estudante autor. <a href="faq.html">Veja o FAQ</a>.</p></div>`;
  md.setAttribute("aria-labelledby","profile-title");md.classList.add("open");md.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  $("#modal-close").focus();$("#modal-close").addEventListener("click",closeMemberProfile);history.replaceState(null,"","#projeto-"+slug(p.nome))}
function closeMemberProfile(){const md=$("#md");if(!md?.classList.contains("open"))return;md.classList.remove("open");md.setAttribute("aria-hidden","true");document.body.style.overflow=prevOv;
  if(MEMBROS.some(m=>slug(m.nome)===location.hash.slice(1))||PROJETOS.some(p=>"projeto-"+slug(p.nome)===location.hash.slice(1)))history.replaceState(null,"",location.pathname+location.search);lastFocus?.focus?.()}
document.addEventListener("click",e=>{const b=e.target.closest(".mem");if(b&&$("#md"))openMemberProfile(+b.dataset.i);const pc=e.target.closest(".project-card");if(pc&&$("#md")&&!e.target.closest("a"))openProject(+pc.dataset.p);if(e.target.id==="bd"||e.target.id==="md")closeMemberProfile()});
document.addEventListener("keydown",e=>{const md=$("#md");if(!md?.classList.contains("open"))return;if(e.key==="Escape"){e.preventDefault();closeMemberProfile();return}
  if(e.key!=="Tab")return;const f=$$('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])',md).filter(x=>x.getClientRects().length);if(!f.length)return;
  const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}});
function openProfileFromHash(){const h=decodeURIComponent(location.hash.slice(1)),i=MEMBROS.findIndex(m=>slug(m.nome)===h&&isReal(m)),j=PROJETOS.findIndex(p=>"projeto-"+slug(p.nome)===h);if(i>=0&&$("#md"))openMemberProfile(i);else if(j>=0&&$("#md"))openProject(j)}
addEventListener("hashchange",openProfileFromHash);

/* Menu mobile */
(function(){const t=$(".menu-toggle"),n=$("#menu-principal");if(!t||!n)return;
  const set=o=>{t.setAttribute("aria-expanded",o);t.setAttribute("aria-label",o?"Fechar menu":"Abrir menu");n.classList.toggle("is-open",o);document.body.classList.toggle("menu-open",o)};
  t.addEventListener("click",()=>set(t.getAttribute("aria-expanded")!=="true"));n.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
  addEventListener("keydown",e=>{if(e.key==="Escape")set(false)});addEventListener("resize",()=>{if(innerWidth>860)set(false)},{passive:true})})();

/* Entrada dos elementos (desligada com prefers-reduced-motion) */
let obs;function reveal(root=document){const els=$$(".rv:not(.in)",root);
  if(reduceMotion.matches||!("IntersectionObserver"in window)){els.forEach(e=>e.classList.add("in"));return}
  obs||=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");obs.unobserve(x.target)}}),{threshold:.1});
  els.forEach((e,i)=>{e.style.setProperty("--reveal-delay",`${(i%4)*60}ms`);obs.observe(e)})}
reveal();

/* Progresso e seção ativa */
const prog=$("#prog"),secs=$$("main section[id]"),links=$$('nav[aria-label="Principal"] a');let q=false;
function ui(){q=false;const r=document.documentElement,m=r.scrollHeight-r.clientHeight;if(prog)prog.style.width=(m>0?r.scrollTop/m*100:0)+"%";
  let cur="";secs.forEach(s=>{if(s.getBoundingClientRect().top<200)cur=s.id});
  links.forEach(a=>{const h=a.getAttribute("href")||"",on=!!cur&&h.endsWith("#"+cur);if(on)a.setAttribute("aria-current","location");else if(a.getAttribute("aria-current")==="location")a.removeAttribute("aria-current")})}
addEventListener("scroll",()=>{if(!q){q=true;requestAnimationFrame(ui)}},{passive:true});ui();

/* Tema claro/escuro: segue o sistema na primeira visita e lembra a escolha. */
(function(){const b=$("#tgl"),r=document.documentElement;if(!b)return;
  const sync=()=>{const d=r.dataset.theme==="dark";b.setAttribute("aria-pressed",d);b.title=d?"Mudar para modo claro":"Mudar para modo escuro";b.setAttribute("aria-label",b.title)};sync();
  b.addEventListener("click",()=>{const t=r.dataset.theme==="dark"?"light":"dark";r.dataset.theme=t;try{localStorage.setItem("sv-tema",t)}catch(_){}sync()})})();

/* Pilha 3D (CSS puro): uma camada por área, com as tecnologias realmente usadas nos perfis. */
function renderStack(){const el=$("#stack3d");if(!el)return;
  const G=[["Front-end",["HTML5","CSS3","JavaScript","TypeScript","React","Tailwind CSS","Figma"],"#1E9BFF"],["Back-end",["Java","Spring Boot","Node.js","PostgreSQL","MySQL","MongoDB","Docker"],"#5A9E2F"],["Dados",["Python","SQL","Power BI","Excel"],"#F2C811"],["Mobile",["Flutter","Kotlin"],"#7F52FF"]];
  const used=new Set(MEMBROS.flatMap(m=>m.techs||[])),L=G.map(g=>[g[0],g[1].filter(t=>used.has(t)),g[2]]).filter(g=>g[1].length);
  el.innerHTML=`<div class="st">${L.map((g,k)=>`<div class="slab" style="--i:${L.length-1-k};--c:${g[2]}"><b>${g[0]}</b><div class="ls">${g[1].map(t=>`<i title="${esc(t)}">${logo(t,22)}</i>`).join("")}</div></div>`).join("")}</div>`}
renderStack();
/* Vídeos decorativos: carregam só quando visíveis; sem movimento ou com economia de dados, ficam só no pôster. */
(function(){const vs=$$("video[data-src]");if(!vs.length)return;
  const still=reduceMotion.matches||navigator.connection?.saveData;if(still)return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{})}else v.pause()}),{threshold:.25});vs.forEach(v=>io.observe(v))})();

/* Como funciona: etapas acendem em sequência e terminam com confetes */
function confete(){const k=document.createElement("canvas");Object.assign(k.style,{position:"fixed",inset:0,pointerEvents:"none",zIndex:90});k.width=innerWidth;k.height=innerHeight;document.body.appendChild(k);const x=k.getContext("2d"),C=["#0A6CFF","#F59E0B","#16A34A","#7F52FF","#E11D48","#1E9BFF"],P=Array.from({length:150},()=>({x:innerWidth/2,y:innerHeight*.55,vx:(Math.random()-.5)*16,vy:-Math.random()*15-4,s:5+Math.random()*6,r:Math.random()*6,c:C[Math.random()*6|0]}));let f=0;(function t(){x.clearRect(0,0,k.width,k.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.35;p.vx*=.99;p.r+=.2;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});if(++f<170)requestAnimationFrame(t);else k.remove()})()}
function initFlow(){const fl=$("#flow");if(!fl)return;const L=$$("li",fl);let run=0;
  const play=()=>{const id=++run;L.forEach(l=>l.classList.remove("on"));fl.style.setProperty("--p",0);
    if(reduceMotion.matches){L.forEach(l=>l.classList.add("on"));fl.style.setProperty("--p",1);return}
    L.forEach((l,i)=>setTimeout(()=>{if(id!==run)return;l.classList.add("on");fl.style.setProperty("--p",i/(L.length-1));},500+i*900))};
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();play()}},{threshold:.5}).observe(fl);$("#replay").addEventListener("click",play)}

/* Vídeo do hero: sem animação para quem prefere menos movimento */
(function(){const v=document.querySelector(".hero-media video");if(v&&reduceMotion.matches){v.removeAttribute("autoplay");v.pause()}})();
