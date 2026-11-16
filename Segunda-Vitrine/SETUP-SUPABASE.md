# Segunda Vitrine v11 — Como ligar o CRUD (Supabase)

O site continua estático (HTML/CSS/JS). O Supabase entrega: login por link mágico, banco (perfis e projetos), regras de acesso (RLS) e armazenamento de imagens.
**Sem passar por estes passos o site funciona como antes** (usa `data.js`); só o botão Entrar/Painel mostra "não configurado".

## 1. Projeto
1. Crie um projeto em supabase.com (região South America – São Paulo).
2. SQL Editor → cole e rode `supabase/schema.sql` inteiro.
3. **Antes de convidar alguém**, cadastre quem pode entrar (sem isso ninguém consegue criar conta):
   ```sql
   insert into public.acesso_permitido values ('dominio','fatec.sp.gov.br');      -- confirme o domínio real dos alunos
   insert into public.acesso_permitido values ('email','alguem@gmail.com');        -- exceções individuais (minúsculas)
   ```

## 2. Autenticação
1. **Authentication → Hooks → Before User Created** → tipo *Postgres* → função `public.hook_before_user_created`. (É isto que impede e-mail não autorizado; o filtro no JS é só conforto.)
2. **Authentication → URL Configuration**: *Site URL* = endereço do site; *Redirect URLs* = `https://SEU-SITE/painel.html` (e `http://localhost:8080/painel.html` para testes). Sem isso o link do e-mail não volta para o painel.
3. **Authentication → Providers → Email**: habilitado. Reduza a validade do link/código (*Email OTP Expiration*) para ~900 s.
4. **SMTP próprio (obrigatório na prática)**: *Authentication → SMTP Settings*. O SMTP padrão do Supabase é só para teste (limite baixíssimo e, em projetos novos, só entrega para e-mails da equipe do projeto). Use Resend, Brevo ou similar; confira os limites atuais do plano. Ideal: remetente com domínio próprio (SPF/DKIM) — hoje a iniciativa ainda não tem e-mail/domínio (pendência da Etapa D).
5. **Email Templates**: edite **os dois** — *Confirm signup* (usado no 1º acesso) e *Magic Link* (acessos seguintes) — com o mesmo conteúdo:
   ```html
   <h2>Seu acesso à Segunda Vitrine</h2>
   <p><a href="{{ .ConfirmationURL }}">Entrar no meu painel</a></p>
   <p>Se o link não funcionar (alguns provedores de e-mail o invalidam ao abrir), digite este código na página de login: <b>{{ .Token }}</b></p>
   <p>Não pediu este acesso? Ignore este e-mail.</p>
   ```
6. Opcional: *Authentication → Rate Limits* e CAPTCHA (Turnstile/hCaptcha) se houver abuso.

## 3. Chaves no site
Project Settings → API → copie *Project URL* e a chave `anon`/`publishable` para `assets/js/config.js`. **Nunca** use a `service_role`/`secret` no front.

## 4. Testar
```
python -m http.server 8080      # dentro da pasta do site
```
Abra http://localhost:8080/entrar.html → e-mail autorizado → link no e-mail → painel.

Checklist: (a) e-mail fora da allowlist é recusado; (b) perfil não publicado não aparece em Estudantes; (c) com outra conta, tente alterar um registro alheio (deve falhar); (d) abra o link do e-mail em outro dispositivo; (e) exclua uma conta de teste e confirme que sumiram perfil, projetos e arquivos.

## 5. Moderação e operação
```sql
update public.profiles set bloqueado = true where id = '<uuid>';   -- some do site e perde edição
update public.projects set bloqueado = true where id = '<uuid>';
update public.profiles set destaque = true  where id = '<uuid>';   -- "Núcleo" (Max, Alexandre, Luca)
```
- Perfis/projetos de `data.js` com o mesmo nome de um perfil/projeto do banco são substituídos pelo do banco. Os de `exemplo:true` somem quando o Supabase responde.
- Projeto gratuito do Supabase **pausa após ~1 semana sem uso**: o site público continua (cai em `data.js`), mas ninguém consegue entrar no painel até você reativar. Faça backup periódico (Database → Backups / `pg_dump`).
- Hospedagem estática (GitHub Pages, Render Static, Netlify, Vercel) serve; defina cabeçalhos de segurança no host quando possível.
