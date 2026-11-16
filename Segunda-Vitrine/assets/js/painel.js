/* Painel do estudante: CRUD do próprio perfil e dos próprios projetos (Supabase + RLS). */
(async function(){
  const app=$("#app"),toast=$("#toast");
  const aviso=(t,tipo="ok")=>{toast.className="alert "+tipo;toast.textContent=t;toast.hidden=!t;if(t)toast.scrollIntoView({block:"nearest",behavior:"smooth"})};
  if(!window.SV_ON||!window.supabase){app.innerHTML='<p class="alert err">O painel ainda não foi configurado (falta preencher <code>assets/js/config.js</code>).</p>';return}
  const sb=supabase.createClient(SV_CONFIG.url,SV_CONFIG.anonKey);

  const h=new URLSearchParams(location.hash.slice(1));
  if(h.get("error")){location.replace("entrar.html?erro="+encodeURIComponent(h.get("error_code")||"erro"));return}
  const{data:{session}}=await sb.auth.getSession();
  if(!session){location.replace("entrar.html");return}
  sb.auth.onAuthStateChange((ev)=>{if(ev==="SIGNED_OUT")location.replace("entrar.html")});
  const uid=session.user.id,email=session.user.email;

  /* ---------- utilidades ---------- */
  const SEGMENTOS=["Back-end","Front-end","Full stack","Mobile","Dados e BI","Ciência de dados","Qualidade e testes","UX/UI","Cloud e DevOps","Segurança","Outro"];
  const SETORES=["Beleza e estética","Alimentação e eventos","Artesanato","Educação","Saúde","Comércio","Serviços","Finanças","Outro"];
  const SOLUCOES=["Sistema de gestão","Agendamento online","Vitrine e pedidos","Painel de dados (BI)","Aplicativo mobile","Site institucional","Automação","Outro"];
  const nul=v=>{v=(v||"").trim();return v?v:null};
  function url(v,rx,msg){v=(v||"").trim();if(!v)return{v:null};if(!/^https?:\/\//i.test(v))v="https://"+v;
    try{const u=new URL(v);if(u.protocol!=="https:")return{err:"O link precisa ser https://"};v=u.href.replace(/\/$/,"")}catch{return{err:"Link inválido"}}
    return rx.test(v)?{v}:{err:msg}}
  const RX={li:/^https:\/\/([a-z0-9-]+\.)?linkedin\.com\/\S{1,200}$/,gh:/^https:\/\/(www\.)?github\.com\/\S{1,150}$/,any:/^https:\/\/\S{4,300}$/,repo:/^https:\/\/(www\.)?(github|gitlab)\.com\/\S{1,200}$/};
  function erroAmigavel(e){const c=e?.code,m=e?.message||"";
    if(/publicar_exige_curso/.test(m))return"Para publicar o perfil, escolha o curso.";
    if(/publicar_exige_autorizacao/.test(m))return"Para publicar o projeto, confirme a autorização de uso do nome do negócio (ou que é fictício).";
    if(c==="23514")return"Algum campo está fora do formato permitido. Confira os tamanhos e se os links começam com https://.";
    if(c==="23505")return"Você já tem um projeto com esse nome.";
    if(/Limite de 10/.test(m))return"Limite de 10 projetos por estudante.";
    if(c==="42501"||/row-level security|permission denied/i.test(m))return"Sem permissão para essa ação. Se o problema continuar, sua conta pode ter sido bloqueada pela coordenação.";
    if(/Failed to fetch|Network/i.test(m))return"Sem conexão com o servidor. Tente de novo.";
    return"Não foi possível concluir agora. Tente novamente."}
  async function prepararImagem(file,lado,quadrada){
    if(!/^image\/(jpeg|png|webp)$/.test(file.type))throw new Error("Use uma imagem JPG, PNG ou WebP.");
    if(file.size>12*1024*1024)throw new Error("Imagem muito grande (máx. 12 MB antes da compressão).");
    const bmp=await createImageBitmap(file,{imageOrientation:"from-image"});
    let sx=0,sy=0,sw=bmp.width,sh=bmp.height;
    if(quadrada){const s=Math.min(sw,sh);sx=(sw-s)/2;sy=(sh-s)/2;sw=sh=s}
    const r=Math.min(1,lado/Math.max(sw,sh)),w=Math.round(sw*r),hh=Math.round(sh*r);
    const c=document.createElement("canvas");c.width=w;c.height=hh;c.getContext("2d").drawImage(bmp,sx,sy,sw,sh,0,0,w,hh);
    /* redesenhar no canvas descarta EXIF (inclusive GPS) */
    let blob=await new Promise(res=>c.toBlob(res,"image/webp",.85));
    if(!blob||blob.type!=="image/webp")blob=await new Promise(res=>c.toBlob(res,"image/jpeg",.85));
    return{blob,ext:blob.type==="image/webp"?"webp":"jpg"}}
  const nomeArq=(pref,ext)=>`${pref}-${Date.now().toString(36)}${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}.${ext}`;
  async function subir(bucket,pref,img){const path=`${uid}/${nomeArq(pref,img.ext)}`;
    const{error}=await sb.storage.from(bucket).upload(path,img.blob,{contentType:img.blob.type,cacheControl:"31536000",upsert:false});
    if(error)throw error;return path}
  const apagar=(bucket,path)=>path?sb.storage.from(bucket).remove([path]).catch(()=>{}):Promise.resolve();
  const pub=(b,p)=>`${SV_CONFIG.url}/storage/v1/object/public/${b}/${p}`;

  /* ---------- componentes de formulário ---------- */
  function chips(host,{options,value=[],max}){
    const sel=new Set(value),all=[...new Set([...options,...value])];
    host.innerHTML='<input type="search" class="ch-q" placeholder="Filtrar a lista…" aria-label="Filtrar a lista"><div class="ch-list" role="group"></div><p class="hint ch-n" aria-live="polite"></p>';
    const list=$(".ch-list",host),q=$(".ch-q",host),n=$(".ch-n",host);
    const cnt=()=>n.textContent=`${sel.size} de ${max} selecionadas`;
    const draw=()=>{const f=norm(q.value);list.innerHTML=all.filter(o=>!f||norm(o).includes(f)).map(o=>`<label class="chip"><input type="checkbox" value="${esc(o)}"${sel.has(o)?" checked":""}><span>${esc(o)}</span></label>`).join("");cnt()};
    list.addEventListener("change",e=>{const c=e.target;if(c.checked){if(sel.size>=max){c.checked=false;return}sel.add(c.value)}else sel.delete(c.value);cnt()});
    q.addEventListener("keydown",e=>{if(e.key==="Enter")e.preventDefault()});q.addEventListener("input",draw);draw();
    return{get:()=>[...sel]}}
  function tagIn(host,{value=[],max,maxLen,ph}){
    const arr=[...value];
    host.innerHTML=`<div class="tg-list"></div><div class="tg-row"><input type="text" class="tg-in" maxlength="${maxLen}" placeholder="${esc(ph)}" aria-label="${esc(ph)}"><button type="button" class="btn btn-g tg-add">Adicionar</button></div><p class="hint tg-n" aria-live="polite"></p>`;
    const list=$(".tg-list",host),inp=$(".tg-in",host),n=$(".tg-n",host);
    const draw=()=>{list.innerHTML=arr.map((t,i)=>`<span class="tag">${esc(t)} <button type="button" class="tg-x" data-i="${i}" aria-label="Remover ${esc(t)}">✕</button></span>`).join("");n.textContent=`${arr.length} de ${max}`};
    const add=()=>{const v=inp.value.trim().replace(/[·<>]/g,"");if(!v||arr.length>=max||arr.some(x=>norm(x)===norm(v))){inp.value="";return}arr.push(v);inp.value="";draw()};
    $(".tg-add",host).addEventListener("click",add);inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();add()}});
    list.addEventListener("click",e=>{const b=e.target.closest(".tg-x");if(!b)return;arr.splice(+b.dataset.i,1);draw()});draw();
    return{get:()=>{add();return[...arr]}}}
  const opts=(a,v)=>a.map(o=>`<option${o===v?" selected":""}>${esc(o)}</option>`).join("");
  const fld=(id,rot,campo,dica)=>`<div class="fld"><label for="${id}">${rot}</label>${campo}${dica?`<p class="hint">${dica}</p>`:""}</div>`;
  const cnt=(n)=>`maxlength="${n}"`;

  /* ---------- estado e carga ---------- */
  let perfil=null,projetos=[],aba="perfil";
  async function carregar(){
    const[a,b]=await Promise.all([sb.from("profiles").select("*").eq("id",uid).maybeSingle(),sb.from("projects").select("*").eq("owner_id",uid).order("created_at",{ascending:false})]);
    if(a.error||b.error)throw(a.error||b.error);perfil=a.data;projetos=b.data||[]}

  function moldura(){
    app.innerHTML=`<div class="pn-top"><div><p class="eyebrow">Meu painel</p><h1 class="pn-h">${perfil?esc(perfil.nome):"Bem-vindo(a)!"}</h1><p class="hint">Conectado como <b>${esc(email)}</b> · o e-mail não aparece no site.</p></div><button class="btn btn-g" id="sair" type="button">Sair</button></div>
    <div class="tabs" role="tablist"><button role="tab" id="t-perfil" aria-selected="${aba==="perfil"}" data-a="perfil">Meu perfil</button><button role="tab" id="t-proj" aria-selected="${aba==="proj"}" data-a="proj">Meus projetos${projetos.length?` (${projetos.length})`:""}</button></div>
    <div id="vista" role="tabpanel"></div>`;
    $("#sair").onclick=async()=>{await sb.auth.signOut();location.replace("entrar.html")};
    $$(".tabs [role=tab]").forEach(b=>b.onclick=()=>{if(!perfil&&b.dataset.a==="proj"){aviso("Salve seu perfil primeiro; os projetos ficam ligados a ele.","err");return}aba=b.dataset.a;moldura();aba==="perfil"?vistaPerfil():vistaProjetos()})}

  /* ---------- PERFIL ---------- */
  function vistaPerfil(){
    const p=perfil||{},v=$("#vista");let foto={novo:null,rem:false,prev:p.foto_path?pub("avatars",p.foto_path):""};
    v.innerHTML=`<form class="frm card" id="f-perfil" novalidate>
      ${!perfil?'<p class="alert info">Primeiro acesso: preencha seu perfil e salve. Ele só aparece no site quando você marcar “publicar” no final.</p>':""}
      <h2>Foto</h2>
      <div class="upl"><span class="av upl-av" id="foto-av">${esc(ini(p.nome||"?"))}</span>
        <div><input type="file" id="foto" accept="image/jpeg,image/png,image/webp" hidden><button type="button" class="btn btn-g" id="foto-btn">Escolher foto</button> <button type="button" class="btn btn-g" id="foto-rm"${foto.prev?"":" hidden"}>Remover</button>
        <p class="hint">JPG, PNG ou WebP. Recortamos em quadrado e reduzimos no seu navegador; dados de localização da foto são descartados.</p></div></div>
      <h2>Dados</h2>
      <div class="fg2">
      ${fld("nome","Nome completo *",`<input id="nome" required ${cnt(80)} value="${esc(p.nome||"")}" autocomplete="name">`)}
      ${fld("papel","Como você se apresenta",`<input id="papel" ${cnt(80)} value="${esc(p.papel||"")}" placeholder="Ex.: Desenvolvedor back-end">`)}
      ${fld("curso","Curso *",`<select id="curso"><option value="">Selecione</option>${Object.keys(CURSOS).map(k=>`<option value="${k}"${k===p.curso?" selected":""}>${k} — ${esc(CURSOS[k])}</option>`).join("")}</select>`)}
      ${fld("segmento","Segmento",`<select id="segmento"><option value="">Selecione</option>${opts(SEGMENTOS,p.segmento)}</select>`)}
      </div>
      ${fld("objetivo","Objetivo de carreira",`<textarea id="objetivo" rows="3" ${cnt(300)}>${esc(p.objetivo||"")}</textarea>`,"Até 300 caracteres. Ex.: Estágio em desenvolvimento back-end Java.")}
      <h2>Stack e áreas</h2>
      <div class="fld"><span class="lab">Tecnologias (até 20)</span><div id="techs"></div></div>
      <div class="fld"><span class="lab">Áreas de atuação (até 8)</span><div id="areas"></div></div>
      <div class="fld"><span class="lab">Soft skills (até 5)</span><div id="soft"></div></div>
      <div class="fld"><span class="lab">Funções na iniciativa (opcional, até 6)</span><div id="funcoes"></div></div>
      <h2>Links</h2>
      <div class="fg2">
      ${fld("linkedin","LinkedIn",`<input id="linkedin" inputmode="url" value="${esc(p.linkedin||"")}" placeholder="https://www.linkedin.com/in/seu-perfil">`)}
      ${fld("github","GitHub",`<input id="github" inputmode="url" value="${esc(p.github||"")}" placeholder="https://github.com/seu-usuario">`)}
      </div>
      ${fld("curriculo","Currículo (link)",`<input id="curriculo" inputmode="url" value="${esc(p.curriculo||"")}" placeholder="https://…">`,"Cole o link de um PDF (Drive, site pessoal…). <b>Sem CPF, RG ou endereço completo.</b> Esse link fica público se você publicar o perfil.")}
      <h2>Publicação</h2>
      <label class="ck"><input type="checkbox" id="publicado"${p.publicado?" checked":""}><span>Quero que meu perfil apareça <b>publicamente</b> na página Estudantes. Entendo que nome, foto, curso, tecnologias, objetivo e links ficam visíveis a qualquer pessoa e que posso despublicar ou excluir tudo quando quiser. <a href="faq.html#lgpd" target="_blank" rel="noopener">Saiba mais</a></span></label>
      <div class="acts"><button class="btn btn-p" type="submit" id="salvar">Salvar perfil</button></div>
    </form>
    <section class="card perigo"><h2>Excluir minha conta</h2><p>Apaga seu perfil, seus projetos, suas imagens e o acesso por e-mail. Não dá para desfazer.</p>
      <form id="f-del" class="tg-row"><input id="del-ok" placeholder="Digite EXCLUIR para confirmar" autocomplete="off" aria-label="Digite EXCLUIR para confirmar"><button class="btn btn-d" type="submit">Excluir tudo</button></form></section>`;
    const avEl=$("#foto-av"),draw=()=>{avEl.innerHTML=esc(ini($("#nome").value||"?"))+(foto.prev?`<img src="${esc(foto.prev)}" alt="Pré-visualização da foto">`:"")};draw();
    $("#foto-btn").onclick=()=>$("#foto").click();
    $("#foto").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const img=await prepararImagem(f,512,true);foto={novo:img,rem:false,prev:URL.createObjectURL(img.blob)};$("#foto-rm").hidden=false;draw()}catch(x){aviso(x.message,"err")}};
    $("#foto-rm").onclick=()=>{foto={novo:null,rem:true,prev:""};$("#foto").value="";$("#foto-rm").hidden=true;draw()};
    const T=chips($("#techs"),{options:Object.keys(TECH),value:p.techs||[],max:20}),S=chips($("#soft"),{options:SOFTK,value:p.soft||[],max:5}),
      A=tagIn($("#areas"),{value:p.areas||[],max:8,maxLen:40,ph:"Ex.: Back-end, APIs REST"}),F=tagIn($("#funcoes"),{value:p.funcoes||[],max:6,maxLen:60,ph:"Ex.: Revisão de código"});
    $("#f-perfil").addEventListener("submit",async e=>{e.preventDefault();
      const nome=$("#nome").value.trim();if(nome.length<2){aviso("Informe seu nome.","err");$("#nome").focus();return}
      const li=url($("#linkedin").value,RX.li,"O LinkedIn precisa ser um link de linkedin.com"),gh=url($("#github").value,RX.gh,"O GitHub precisa ser um link de github.com"),cv=url($("#curriculo").value,RX.any,"Link inválido");
      const bad=[["LinkedIn",li],["GitHub",gh],["Currículo",cv]].find(x=>x[1].err);if(bad){aviso(`${bad[0]}: ${bad[1].err}`,"err");return}
      const publicado=$("#publicado").checked;if(publicado&&!$("#curso").value){aviso("Para publicar, escolha o curso.","err");return}
      const b=$("#salvar");b.disabled=true;aviso("Salvando…","info");let novoPath=null;
      try{
        const row={nome,papel:nul($("#papel").value),curso:$("#curso").value||null,segmento:nul($("#segmento").value),objetivo:nul($("#objetivo").value),linkedin:li.v,github:gh.v,curriculo:cv.v,
          areas:A.get(),techs:T.get(),soft:S.get(),funcoes:F.get(),publicado};
        if(foto.novo){novoPath=await subir("avatars","foto",foto.novo);row.foto_path=novoPath}else if(foto.rem)row.foto_path=null;
        const q=perfil?sb.from("profiles").update(row).eq("id",uid):sb.from("profiles").insert({id:uid,...row});
        const{data,error}=await q.select().single();if(error)throw error;
        const velha=perfil?.foto_path;perfil=data;if((foto.novo||foto.rem)&&velha&&velha!==data.foto_path)apagar("avatars",velha);
        foto={novo:null,rem:false,prev:data.foto_path?pub("avatars",data.foto_path):""};
        aviso(publicado?"Perfil salvo e publicado. Já aparece em Estudantes.":"Perfil salvo (rascunho: ainda não aparece no site).","ok");moldura();vistaPerfil();
      }catch(x){if(novoPath)apagar("avatars",novoPath);console.error(x);aviso(erroAmigavel(x),"err");b.disabled=false}});
    $("#f-del").addEventListener("submit",async e=>{e.preventDefault();
      if($("#del-ok").value.trim()!=="EXCLUIR"){aviso("Digite EXCLUIR (em maiúsculas) para confirmar.","err");return}
      try{aviso("Excluindo…","info");
        for(const bk of["avatars","projetos"]){const{data}=await sb.storage.from(bk).list(uid,{limit:1000});if(data?.length)await sb.storage.from(bk).remove(data.map(f=>`${uid}/${f.name}`))}
        const{error}=await sb.rpc("excluir_minha_conta");if(error)throw error;
        await sb.auth.signOut().catch(()=>{});location.replace("entrar.html?conta=excluida")
      }catch(x){console.error(x);aviso("Não foi possível excluir agora. Tente de novo ou fale com a coordenação.","err")}})
  }

  /* ---------- PROJETOS ---------- */
  function estado(p){return p.bloqueado?'<span class="pst pst-bloqueado">Bloqueado pela coordenação</span>':p.publicado?(perfil?.publicado?'<span class="pst pst-publicado">Publicado</span>':'<span class="pst pst-rascunho">Aguardando perfil público</span>'):'<span class="pst pst-rascunho">Rascunho</span>'}
  function vistaProjetos(){
    const v=$("#vista");
    v.innerHTML=`${perfil&&!perfil.publicado?'<p class="alert info">Seu perfil ainda não está público. Seus projetos só aparecem no site depois que o perfil for publicado.</p>':""}
      <div class="pn-top"><h2 style="margin:0">Meus projetos</h2><button class="btn btn-p" id="novo" type="button"${projetos.length>=10?" disabled":""}>+ Novo projeto</button></div>
      ${projetos.length?`<ul class="pj-list">${projetos.map(p=>`<li class="card pj-item"><div><h3>${esc(p.nome)}</h3><p class="hint">${esc(p.descricao)}</p><p>${estado(p)} <span class="tag">${esc(p.status)}</span></p></div><div class="acts"><button class="btn btn-g" data-ed="${p.id}" type="button">Editar</button><button class="btn btn-d" data-del="${p.id}" type="button">Excluir</button></div></li>`).join("")}</ul>`:'<p class="empty">Você ainda não cadastrou projetos. Clique em “Novo projeto”.</p>'}`;
    $("#novo").onclick=()=>formProjeto(null);
    $$("[data-ed]",v).forEach(b=>b.onclick=()=>formProjeto(projetos.find(p=>p.id===b.dataset.ed)));
    $$("[data-del]",v).forEach(b=>b.onclick=async()=>{const p=projetos.find(x=>x.id===b.dataset.del);if(!confirm(`Excluir o projeto “${p.nome}”? Não dá para desfazer.`))return;
      const{error}=await sb.from("projects").delete().eq("id",p.id);if(error){aviso(erroAmigavel(error),"err");return}
      apagar("projetos",p.imagem_path);projetos=projetos.filter(x=>x.id!==p.id);aviso("Projeto excluído.","ok");moldura();vistaProjetos()})}

  function formProjeto(p0){
    const p=p0||{},v=$("#vista");let img={novo:null,rem:false,prev:p.imagem_path?pub("projetos",p.imagem_path):""};
    v.innerHTML=`<form class="frm card" id="f-proj" novalidate><h2>${p0?"Editar projeto":"Novo projeto"}</h2>
      <div class="fg2">
      ${fld("pnome","Nome do projeto *",`<input id="pnome" required ${cnt(80)} value="${esc(p.nome||"")}">`)}
      ${fld("pstatus","Status",`<select id="pstatus">${opts(["Em desenvolvimento","Publicado"],p.status||"Em desenvolvimento")}</select>`,"“Publicado” = já está no ar.")}
      ${fld("psetor","Setor",`<input id="psetor" list="dl-setor" ${cnt(60)} value="${esc(p.setor||"")}"><datalist id="dl-setor">${SETORES.map(o=>`<option>${esc(o)}</option>`).join("")}</datalist>`)}
      ${fld("psol","Tipo de solução",`<input id="psol" list="dl-sol" ${cnt(60)} value="${esc(p.solucao||"")}"><datalist id="dl-sol">${SOLUCOES.map(o=>`<option>${esc(o)}</option>`).join("")}</datalist>`)}
      </div>
      ${fld("pdesc","Descrição curta * (10 a 280 caracteres)",`<textarea id="pdesc" rows="2" required ${cnt(280)}>${esc(p.descricao||"")}</textarea>`)}
      <div class="fld"><span class="lab">Imagem ou print da aplicação rodando</span><div class="upl"><div class="upl-pv" id="img-pv"></div><div><input type="file" id="img" accept="image/jpeg,image/png,image/webp" hidden><button type="button" class="btn btn-g" id="img-btn">Escolher imagem</button> <button type="button" class="btn btn-g" id="img-rm"${img.prev?"":" hidden"}>Remover</button><p class="hint">Use dados fictícios nos prints. Reduzimos para 1200 px no navegador.</p></div></div></div>
      <div class="fld"><span class="lab">Tecnologias (até 15)</span><div id="ptech"></div></div>
      <div class="fg2">
      ${fld("prepo","Repositório (GitHub ou GitLab)",`<input id="prepo" inputmode="url" value="${esc(p.repo||"")}" placeholder="https://github.com/…">`)}
      ${fld("pdeploy","Site no ar",`<input id="pdeploy" inputmode="url" value="${esc(p.deploy||"")}" placeholder="https://…">`)}
      </div>
      ${fld("pprob","Que problema resolve?",`<textarea id="pprob" rows="3" ${cnt(600)}>${esc(p.problema||"")}</textarea>`)}
      ${fld("ppub","Para quem foi feito?",`<textarea id="ppub" rows="2" ${cnt(300)}>${esc(p.publico||"")}</textarea>`)}
      ${fld("pfeito","O que a equipe fez?",`<textarea id="pfeito" rows="4" ${cnt(800)}>${esc(p.feito||"")}</textarea>`)}
      ${fld("pporque","Por que essas tecnologias?",`<textarea id="pporque" rows="3" ${cnt(600)}>${esc(p.porque||"")}</textarea>`)}
      ${fld("prodar","Como rodar?",`<textarea id="prodar" rows="4" ${cnt(800)}>${esc(p.rodar||"")}</textarea>`,"Passo a passo curto. Nunca coloque senhas, chaves ou tokens.")}
      ${fld("pres","Resultado",`<textarea id="pres" rows="3" ${cnt(600)}>${esc(p.resultado||"")}</textarea>`)}
      ${fld("paviso","Aviso (opcional)",`<input id="paviso" ${cnt(300)} value="${esc(p.aviso||"")}" placeholder="Ex.: Os dados exibidos são fictícios.">`)}
      <div class="fld"><span class="lab">Outros integrantes da equipe (até 10; seu nome já entra automaticamente)</span><div id="peq"></div></div>
      <h2>Publicação</h2>
      <label class="ck"><input type="checkbox" id="pauto"${p.autorizacao_ok?" checked":""}><span>Tenho autorização do negócio para citar o nome, logo e informações dele <b>ou</b> o projeto/cliente é fictício. <a href="faq.html" target="_blank" rel="noopener">Política de bom uso</a></span></label>
      <label class="ck"><input type="checkbox" id="ppubl"${p.publicado?" checked":""}><span>Publicar este projeto no site (só aparece se o seu perfil também estiver público).</span></label>
      <div class="acts"><button class="btn btn-p" type="submit" id="psalvar">${p0?"Salvar alterações":"Criar projeto"}</button><button class="btn btn-g" type="button" id="pcancel">Cancelar</button></div></form>`;
    const pv=$("#img-pv"),draw=()=>{pv.innerHTML=img.prev?`<img src="${esc(img.prev)}" alt="Pré-visualização da imagem do projeto">`:"<span>Sem imagem</span>"};draw();
    $("#img-btn").onclick=()=>$("#img").click();
    $("#img").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const x=await prepararImagem(f,1200,false);img={novo:x,rem:false,prev:URL.createObjectURL(x.blob)};$("#img-rm").hidden=false;draw()}catch(er){aviso(er.message,"err")}};
    $("#img-rm").onclick=()=>{img={novo:null,rem:true,prev:""};$("#img").value="";$("#img-rm").hidden=true;draw()};
    const T=chips($("#ptech"),{options:Object.keys(TECH),value:p.tech||[],max:15}),E=tagIn($("#peq"),{value:(p.equipe||[]).filter(n=>norm(n)!==norm(perfil.nome)),max:10,maxLen:80,ph:"Nome de um colega"});
    $("#pcancel").onclick=()=>{aviso("");vistaProjetos()};
    $("#f-proj").addEventListener("submit",async e=>{e.preventDefault();
      const nome=$("#pnome").value.trim(),desc=$("#pdesc").value.trim();
      if(nome.length<2){aviso("Informe o nome do projeto.","err");return}if(desc.length<10){aviso("A descrição precisa ter pelo menos 10 caracteres.","err");return}
      const rp=url($("#prepo").value,RX.repo,"O repositório precisa ser de github.com ou gitlab.com"),dp=url($("#pdeploy").value,RX.any,"Link inválido");
      const bad=[["Repositório",rp],["Site no ar",dp]].find(x=>x[1].err);if(bad){aviso(`${bad[0]}: ${bad[1].err}`,"err");return}
      const publicado=$("#ppubl").checked,auto=$("#pauto").checked;if(publicado&&!auto){aviso("Para publicar, confirme a autorização de uso do nome do negócio (ou que é fictício).","err");return}
      const b=$("#psalvar");b.disabled=true;aviso("Salvando…","info");let novo=null;
      try{
        const row={nome,descricao:desc,tech:T.get(),setor:nul($("#psetor").value),solucao:nul($("#psol").value),status:$("#pstatus").value,repo:rp.v,deploy:dp.v,
          problema:nul($("#pprob").value),publico:nul($("#ppub").value),feito:nul($("#pfeito").value),porque:nul($("#pporque").value),rodar:nul($("#prodar").value),resultado:nul($("#pres").value),aviso:nul($("#paviso").value),
          equipe:E.get().filter(n=>norm(n)!==norm(perfil.nome)),publicado,autorizacao_ok:auto};
        if(img.novo){novo=await subir("projetos","proj",img.novo);row.imagem_path=novo}else if(img.rem)row.imagem_path=null;
        const q=p0?sb.from("projects").update(row).eq("id",p0.id):sb.from("projects").insert({owner_id:uid,...row});
        const{data,error}=await q.select().single();if(error)throw error;
        if(p0&&(img.novo||img.rem)&&p0.imagem_path&&p0.imagem_path!==data.imagem_path)apagar("projetos",p0.imagem_path);
        projetos=p0?projetos.map(x=>x.id===data.id?data:x):[data,...projetos];
        aviso(publicado?"Projeto salvo e publicado.":"Projeto salvo (rascunho).","ok");moldura();vistaProjetos();
      }catch(x){if(novo)apagar("projetos",novo);console.error(x);aviso(erroAmigavel(x),"err");b.disabled=false}})
  }

  try{await carregar()}catch(x){console.error(x);app.innerHTML='<p class="alert err">Não foi possível carregar seus dados. Verifique se o <code>supabase/schema.sql</code> foi executado e recarregue a página.</p>';return}
  aba="perfil";moldura();vistaPerfil();
})();
