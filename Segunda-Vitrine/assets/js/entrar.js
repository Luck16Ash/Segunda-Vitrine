/* Login por link mágico (Supabase Auth, e-mail OTP). Sem senha. */
(function(){
  const f=$("#f-login"),em=$("#email"),btn=$("#btn-enviar"),msg=$("#msg"),s1=$("#passo1"),s2=$("#passo2");
  const say=(t,tipo="info")=>{msg.className="alert "+tipo;msg.textContent=t;msg.hidden=!t};
  if(!window.SV_ON||!window.supabase){say("O login ainda não foi configurado neste site (falta preencher assets/js/config.js).","err");btn.disabled=true;return}
  const sb=supabase.createClient(SV_CONFIG.url,SV_CONFIG.anonKey);
  const volta=new URL("painel.html",location.href).href;
  sb.auth.getSession().then(({data})=>{if(data.session)location.replace("painel.html")});
  if(new URLSearchParams(location.search).get("conta")==="excluida")say("Sua conta e seus dados foram excluídos.","ok");
  const er=new URLSearchParams(location.search).get("erro");
  if(er)say(/expired|otp/i.test(er)?"Esse link expirou ou já foi usado. Alguns provedores de e-mail abrem o link antes de você. Peça outro abaixo ou digite o código de 6 dígitos que vem no mesmo e-mail.":"Não conseguimos concluir o login. Peça um novo link.","err");

  let timer=null,email="";
  const cooldown=(s)=>{clearInterval(timer);btn.disabled=true;const t0=btn.dataset.t||btn.textContent;btn.dataset.t=t0;
    timer=setInterval(()=>{s--;if(s<=0){clearInterval(timer);btn.disabled=false;btn.textContent=t0}else btn.textContent=`Aguarde ${s}s para reenviar`},1000);btn.textContent=`Aguarde ${s}s para reenviar`};

  f.addEventListener("submit",async e=>{e.preventDefault();
    email=em.value.trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){say("Digite um e-mail válido.","err");em.focus();return}
    btn.disabled=true;say("Enviando…");
    const{error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:volta,shouldCreateUser:true}});
    if(error){
      const m=error.message||"";btn.disabled=false;
      if(error.status===429||/rate|seconds|too many/i.test(m))say("Muitos pedidos em pouco tempo. Aguarde alguns minutos e tente de novo.","err");
      else if(/sinal de \+/.test(m))say("Use o e-mail sem o sinal de + (apelidos não são aceitos).","err");
      else if(error.status===403||/autoriz/i.test(m))say("Este e-mail não está autorizado a criar conta. Use o e-mail institucional ou fale com a coordenação da iniciativa.","err");
      else say("Não foi possível enviar o link agora. Tente de novo em instantes.","err");
      return}
    say("");s1.hidden=true;s2.hidden=false;$("#email-ok").textContent=email;$("#codigo").focus();
    cooldown(60);$("#reenviar").onclick=()=>{s2.hidden=true;s1.hidden=false;em.value=email;em.focus()};
  });

  $("#f-codigo").addEventListener("submit",async e=>{e.preventDefault();
    const token=$("#codigo").value.replace(/\s/g,"");
    if(!/^\d{6,10}$/.test(token)){say("O código tem de 6 a 10 números.","err");return}
    const b=$("#btn-codigo");b.disabled=true;say("Verificando…");
    let r=await sb.auth.verifyOtp({email,token,type:"email"});
    if(r.error)r=await sb.auth.verifyOtp({email,token,type:"signup"});
    if(r.error){b.disabled=false;say("Código inválido ou expirado. Confira o e-mail mais recente.","err");return}
    location.replace("painel.html");
  });
})();
