# Segunda Vitrine v11 — status

Site estático (HTML/CSS/JS) + Supabase para o CRUD. Setup: `SETUP-SUPABASE.md`. Banco: `supabase/schema.sql`.
Rodar: `python -m http.server 8080` na pasta → http://localhost:8080

## ✅ v11 (novo)
- `entrar.html`: login por link mágico (e-mail → link; fallback com código numérico do mesmo e-mail).
- `painel.html`: CRUD do próprio perfil (foto, dados, stack, links, publicar/despublicar) e dos próprios projetos (até 10, com imagem, status, texto no formato README, equipe, autorização de uso do nome do negócio). Excluir conta (LGPD).
- Estudantes/Projetos/Home leem do Supabase (sem login) e mesclam com `data.js` (banco vence por nome; exemplos somem).
- Segurança no servidor (RLS + grants por coluna + hook de allowlist + checks de formato + bucket com tipo/tamanho). `bloqueado` e `destaque` só a coordenação altera.
- FAQ atualizado (não é mais verdade que "não há login/cadastro").

## ⏳ Pendente
1. **Rodar o setup** (`SETUP-SUPABASE.md`): schema, allowlist, hook, redirect URLs, SMTP próprio, templates, `config.js`.
2. **Definir a regra de acesso** (domínio institucional vs. lista de e-mails) e quem modera (`bloqueado`).
3. Etapa A: os 4 projetos de `data.js` ainda têm `deploy/print/porque/rodar/resultado` vazios — agora cada dono pode criar o projeto no painel (o do banco substitui o de `data.js` pelo mesmo nome).
4. Etapa D: e-mail de contato da iniciativa; revisão jurídica do FAQ e de uma Política de Privacidade (não existe página própria; o painel coleta e-mail, foto, nome e links).
5. Cabeçalho CSP (`script-src 'self' …`): as páginas ainda têm scripts inline; endurecer exige mover/hashear.
6. Paginação de Estudantes/Projetos (hoje carrega até 1000 de cada de uma vez).
7. Slugs: dois perfis/projetos com o mesmo nome compartilham o link `#nome`.
