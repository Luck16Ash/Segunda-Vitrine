/* ===== Configuração do Supabase =====
   1. Copie este arquivo para config.js (mesma pasta)
   2. Preencha com os valores de Project Settings > API no Supabase
   3. config.js está no .gitignore — nunca será commitado

   A chave "anon"/"publishable" É PÚBLICA por desenho:
   quem protege os dados são as policies RLS (supabase/schema.sql).
   NUNCA coloque aqui a chave "service_role" / "secret". */

window.SV_CONFIG = {
  url: "",      // ex.: "https://abcdxyz.supabase.co"
  anonKey: ""   // ex.: "eyJ..." (anon) ou "sb_publishable_..."
};
window.SV_ON = !!(SV_CONFIG.url && SV_CONFIG.anonKey);
