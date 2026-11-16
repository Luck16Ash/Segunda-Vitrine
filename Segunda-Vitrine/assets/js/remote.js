/* Leitura pública (sem login) dos perfis e projetos publicados no Supabase.
   Usa fetch direto na API REST: as páginas públicas não precisam carregar a biblioteca do Supabase.
   Se o Supabase não estiver configurado ou estiver fora do ar, o site continua com os dados de data.js. */
const svUrl=p=>`${SV_CONFIG.url}/storage/v1/object/public/${p}`;
async function svGet(path){
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),6000);
  try{const r=await fetch(`${SV_CONFIG.url}/rest/v1/${path}`,{headers:{apikey:SV_CONFIG.anonKey},signal:ctl.signal});
    if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}finally{clearTimeout(t)}}

async function loadRemote(){
  if(!window.SV_ON)return false;
  try{
    const [ps,js]=await Promise.all([
      svGet("profiles?select=id,nome,papel,curso,segmento,objetivo,foto_path,linkedin,github,curriculo,areas,techs,soft,funcoes,destaque,created_at&publicado=eq.true&bloqueado=eq.false&order=created_at.asc&limit=1000"),
      svGet("projects?select=id,owner_id,nome,descricao,tech,setor,solucao,status,repo,deploy,imagem_path,problema,publico,feito,porque,rodar,resultado,aviso,equipe,created_at&publicado=eq.true&bloqueado=eq.false&order=created_at.desc&limit=1000")]);
    const dono=new Map(ps.map(p=>[p.id,p]));
    const estM=new Map(MEMBROS.map(m=>[norm(m.nome),m])),estP=new Map(PROJETOS.map(p=>[norm(p.nome),p]));
    const projDb=js.filter(j=>dono.has(j.owner_id)).map(j=>({
      nome:j.nome,desc:j.descricao,tech:(j.tech||[]).join(" · "),setor:j.setor||"",solucao:j.solucao||"",status:j.status,
      repo:j.repo||"",deploy:j.deploy||"",imagem:j.imagem_path?svUrl("projetos/"+j.imagem_path):"",print:j.imagem_path?svUrl("projetos/"+j.imagem_path):"",
      alt:"Imagem do projeto "+j.nome,problema:j.problema||"",publico:j.publico||"",feito:j.feito||"",porque:j.porque||"",rodar:j.rodar||"",resultado:j.resultado||"",aviso:j.aviso||"",
      equipe:[...new Set([dono.get(j.owner_id).nome,...(j.equipe||[])])],_owner:j.owner_id}));
    const membDb=ps.map(p=>{const old=estM.get(norm(p.nome));
      const nomes=projDb.filter(j=>j._owner===p.id).map(j=>j.nome);
      return{nome:p.nome,papel:p.papel||"",curso:p.curso||"",segmento:p.segmento||"",objetivo:p.objetivo||"",foto:p.foto_path?svUrl("avatars/"+p.foto_path):"",
        linkedin:p.linkedin||"",github:p.github||"",curriculo:p.curriculo||"",areas:p.areas||[],techs:p.techs||[],soft:p.soft||[],funcoes:p.funcoes||[],
        destaque:!!p.destaque||!!old?.destaque,projetos:[...new Set([...nomes,...(old?.projetos||[])])]}});
    const dbM=new Set(membDb.map(m=>norm(m.nome))),dbP=new Set(projDb.map(p=>norm(p.nome)));
    /* DB vence dados estáticos de mesmo nome; perfis de exemplo somem quando o Supabase responde */
    const m=[...membDb.filter(x=>x.destaque),...MEMBROS.filter(x=>!x.exemplo&&!dbM.has(norm(x.nome))),...membDb.filter(x=>!x.destaque)];
    const p=[...projDb,...PROJETOS.filter(x=>!dbP.has(norm(x.nome)))];
    MEMBROS.splice(0,MEMBROS.length,...m);PROJETOS.splice(0,PROJETOS.length,...p);
    if(typeof renderStack==="function")renderStack();
    return true;
  }catch(e){console.warn("Supabase indisponível; usando data.js",e);return false}
}
