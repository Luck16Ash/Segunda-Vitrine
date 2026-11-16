-- =====================================================================
-- Segunda Vitrine — schema do CRUD (Supabase / PostgreSQL)
-- Rode INTEIRO no SQL Editor do Supabase (idempotente: pode rodar de novo).
-- =====================================================================

-- ---------- 1. Quem pode criar conta (allowlist) ----------
-- Sem nenhuma linha aqui NINGUÉM consegue entrar (falha fechada, de propósito).
create table if not exists public.acesso_permitido (
  tipo  text not null check (tipo in ('dominio','email')),
  valor text not null check (valor = lower(valor)),
  primary key (tipo, valor)
);
alter table public.acesso_permitido enable row level security;  -- sem policy = invisível pela API
revoke all on public.acesso_permitido from anon, authenticated;

-- EXEMPLOS (edite e descomente):
-- insert into public.acesso_permitido values ('dominio','fatec.sp.gov.br');   -- todos os alunos com e-mail institucional
-- insert into public.acesso_permitido values ('email','seu.email@gmail.com'); -- exceções individuais

-- Hook "Before User Created": rejeita o cadastro ANTES de criar o usuário e de enviar e-mail.
-- Ative em: Authentication > Hooks > Before User Created > Postgres function > public.hook_before_user_created
create or replace function public.hook_before_user_created(event jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_email text := lower(trim(coalesce(event->'user'->>'email','')));
  v_local text := split_part(v_email,'@',1);
  v_dom   text := split_part(v_email,'@',2);
begin
  if v_email = '' or position('@' in v_email) = 0 then
    return jsonb_build_object('error', jsonb_build_object('message','E-mail inválido.','http_code',400));
  end if;
  -- bloqueia "apelidos" (nome+qualquercoisa@...) para impedir várias contas da mesma pessoa
  if position('+' in v_local) > 0 then
    return jsonb_build_object('error', jsonb_build_object('message','Use o e-mail sem o sinal de +.','http_code',400));
  end if;
  if exists (select 1 from public.acesso_permitido
             where (tipo = 'email' and valor = v_email) or (tipo = 'dominio' and valor = v_dom)) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object('message','E-mail não autorizado.','http_code',403));
end $$;

grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_before_user_created(jsonb) from authenticated, anon, public;

-- ---------- 2. Funções auxiliares ----------
create or replace function public.arr_ok(a text[], max_len int)
returns boolean language sql immutable as $$
  select coalesce(bool_and(char_length(x) between 1 and max_len and x !~ '[·<>]'), true) from unnest(a) x
$$;

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

-- ---------- 3. Perfis ----------
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  nome             text not null check (char_length(nome) between 2 and 80),
  papel            text check (char_length(papel) <= 80),
  curso            text check (curso in ('DSM','ADS')),
  segmento         text check (char_length(segmento) <= 40),
  objetivo         text check (char_length(objetivo) <= 300),
  foto_path        text check (foto_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9._-]{1,80}$'),
  linkedin         text check (linkedin ~ '^https://([a-z0-9-]+\.)?linkedin\.com/[^\s]{1,200}$'),
  github           text check (github   ~ '^https://(www\.)?github\.com/[^\s]{1,150}$'),
  curriculo        text check (curriculo ~ '^https://[^\s]{4,300}$'),
  areas            text[] not null default '{}' check (cardinality(areas)  <= 8  and public.arr_ok(areas, 40)),
  techs            text[] not null default '{}' check (cardinality(techs)  <= 20 and public.arr_ok(techs, 40)),
  soft             text[] not null default '{}' check (cardinality(soft)   <= 5  and public.arr_ok(soft, 40)),
  funcoes          text[] not null default '{}' check (cardinality(funcoes)<= 6  and public.arr_ok(funcoes, 60)),
  publicado        boolean not null default false,
  consentimento_em timestamptz,                       -- preenchido pelo trigger ao publicar
  bloqueado        boolean not null default false,    -- só a coordenação altera (moderação)
  destaque         boolean not null default false,    -- só a coordenação altera (núcleo)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint publicar_exige_consentimento check (not publicado or consentimento_em is not null),
  constraint publicar_exige_curso check (not publicado or curso is not null)
);

create or replace function public.profiles_before() returns trigger language plpgsql as $$
begin
  if new.publicado and new.consentimento_em is null then new.consentimento_em := now(); end if;
  if new.foto_path is not null and split_part(new.foto_path,'/',1) <> new.id::text then
    raise exception 'foto_path precisa estar na pasta do próprio usuário';
  end if;
  return new;
end $$;
drop trigger if exists trg_profiles_before on public.profiles;
create trigger trg_profiles_before before insert or update on public.profiles
  for each row execute function public.profiles_before();
drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

create index if not exists profiles_publico_idx on public.profiles (publicado, bloqueado);

-- ---------- 4. Projetos ----------
create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references public.profiles(id) on delete cascade,
  nome           text not null check (char_length(nome) between 2 and 80),
  descricao      text not null check (char_length(descricao) between 10 and 280),
  tech           text[] not null default '{}' check (cardinality(tech) <= 15 and public.arr_ok(tech, 40)),
  setor          text check (char_length(setor) <= 60),
  solucao        text check (char_length(solucao) <= 60),
  status         text not null default 'Em desenvolvimento' check (status in ('Em desenvolvimento','Publicado')),
  repo           text check (repo   ~ '^https://(www\.)?(github|gitlab)\.com/[^\s]{1,200}$'),
  deploy         text check (deploy ~ '^https://[^\s]{4,300}$'),
  imagem_path    text check (imagem_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9._-]{1,80}$'),
  problema       text check (char_length(problema)  <= 600),
  publico        text check (char_length(publico)   <= 300),
  feito          text check (char_length(feito)     <= 800),
  porque         text check (char_length(porque)    <= 600),
  rodar          text check (char_length(rodar)     <= 800),
  resultado      text check (char_length(resultado) <= 600),
  aviso          text check (char_length(aviso)     <= 300),
  equipe         text[] not null default '{}' check (cardinality(equipe) <= 10 and public.arr_ok(equipe, 80)),
  publicado      boolean not null default false,
  autorizacao_ok boolean not null default false,      -- "tenho autorização para citar o negócio, ou é fictício"
  bloqueado      boolean not null default false,      -- só a coordenação altera
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint publicar_exige_autorizacao check (not publicado or autorizacao_ok)
);
create unique index if not exists projects_owner_nome_uq on public.projects (owner_id, lower(nome));
create index if not exists projects_publico_idx on public.projects (publicado, bloqueado, created_at desc);

create or replace function public.projects_before() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' and (select count(*) from public.projects where owner_id = new.owner_id) >= 10 then
    raise exception 'Limite de 10 projetos por estudante';
  end if;
  if new.imagem_path is not null and split_part(new.imagem_path,'/',1) <> new.owner_id::text then
    raise exception 'imagem_path precisa estar na pasta do próprio usuário';
  end if;
  return new;
end $$;
drop trigger if exists trg_projects_before on public.projects;
create trigger trg_projects_before before insert or update on public.projects
  for each row execute function public.projects_before();
drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------- 5. Permissões por coluna (o aluno NUNCA grava bloqueado/destaque) ----------
revoke all on public.profiles from anon, authenticated;
revoke all on public.projects from anon, authenticated;

-- publicado/bloqueado entram na lista porque as policies de RLS (inclusive a subconsulta de projects) referenciam essas colunas.
grant select (id,nome,papel,curso,segmento,objetivo,foto_path,linkedin,github,curriculo,areas,techs,soft,funcoes,destaque,publicado,bloqueado,created_at)
  on public.profiles to anon;
grant select on public.profiles to authenticated;
grant insert (id,nome,papel,curso,segmento,objetivo,foto_path,linkedin,github,curriculo,areas,techs,soft,funcoes,publicado)
  on public.profiles to authenticated;
grant update (nome,papel,curso,segmento,objetivo,foto_path,linkedin,github,curriculo,areas,techs,soft,funcoes,publicado)
  on public.profiles to authenticated;
grant delete on public.profiles to authenticated;

grant select (id,owner_id,nome,descricao,tech,setor,solucao,status,repo,deploy,imagem_path,problema,publico,feito,porque,rodar,resultado,aviso,equipe,publicado,bloqueado,created_at)
  on public.projects to anon;
grant select on public.projects to authenticated;
grant insert (owner_id,nome,descricao,tech,setor,solucao,status,repo,deploy,imagem_path,problema,publico,feito,porque,rodar,resultado,aviso,equipe,publicado,autorizacao_ok)
  on public.projects to authenticated;
grant update (nome,descricao,tech,setor,solucao,status,repo,deploy,imagem_path,problema,publico,feito,porque,rodar,resultado,aviso,equipe,publicado,autorizacao_ok)
  on public.projects to authenticated;
grant delete on public.projects to authenticated;

-- ---------- 6. RLS ----------
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

drop policy if exists profiles_select_publico on public.profiles;
create policy profiles_select_publico on public.profiles for select to anon, authenticated
  using (publicado and not bloqueado);
drop policy if exists profiles_select_proprio on public.profiles;
create policy profiles_select_proprio on public.profiles for select to authenticated
  using (id = (select auth.uid()));
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid()) and not bloqueado) with check (id = (select auth.uid()));
drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles for delete to authenticated
  using (id = (select auth.uid()));

drop policy if exists projects_select_publico on public.projects;
create policy projects_select_publico on public.projects for select to anon, authenticated
  using (publicado and not bloqueado and exists (
    select 1 from public.profiles p where p.id = owner_id and p.publicado and not p.bloqueado));
drop policy if exists projects_select_proprio on public.projects;
create policy projects_select_proprio on public.projects for select to authenticated
  using (owner_id = (select auth.uid()));
drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects for insert to authenticated
  with check (owner_id = (select auth.uid()));
drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects for update to authenticated
  using (owner_id = (select auth.uid()) and not bloqueado) with check (owner_id = (select auth.uid()));
drop policy if exists projects_delete on public.projects;
create policy projects_delete on public.projects for delete to authenticated
  using (owner_id = (select auth.uid()));

-- ---------- 7. Storage (fotos e imagens) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars','avatars',true,2097152,array['image/jpeg','image/png','image/webp']),
  ('projetos','projetos',true,3145728,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Leitura pública é feita pela URL pública do bucket. Estas policies só liberam ao DONO mexer na PRÓPRIA pasta (<uid>/...).
drop policy if exists sv_storage_select on storage.objects;
create policy sv_storage_select on storage.objects for select to authenticated
  using (bucket_id in ('avatars','projetos') and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists sv_storage_insert on storage.objects;
create policy sv_storage_insert on storage.objects for insert to authenticated
  with check (bucket_id in ('avatars','projetos') and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists sv_storage_update on storage.objects;
create policy sv_storage_update on storage.objects for update to authenticated
  using (bucket_id in ('avatars','projetos') and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id in ('avatars','projetos') and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists sv_storage_delete on storage.objects;
create policy sv_storage_delete on storage.objects for delete to authenticated
  using (bucket_id in ('avatars','projetos') and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------- 8. Exclusão da própria conta (direito de eliminação da LGPD) ----------
-- O front apaga os arquivos do Storage primeiro e depois chama esta função (apaga auth.users -> cascata em profiles/projects).
create or replace function public.excluir_minha_conta() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'não autenticado'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.excluir_minha_conta() from public, anon;
grant execute on function public.excluir_minha_conta() to authenticated;

-- ---------- 9. Moderação (rode manualmente quando precisar) ----------
-- update public.profiles set bloqueado = true where id = '<uuid>';
-- update public.projects set bloqueado = true where id = '<uuid>';
-- update public.profiles set destaque = true where id = '<uuid>';   -- núcleo da iniciativa
