<div align="center">

<img src="assets/banner-linkedin.png" alt="Segunda Vitrine — Tecnologia que transforma negócios" width="100%">

# Segunda Vitrine

**Tecnologia que transforma negócios.**

Vitrine de projetos feitos por estudantes de tecnologia da FATEC Zona Sul que resolvem problemas de negócios reais da região.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Iniciativa independente](https://img.shields.io/badge/iniciativa-independente-0A6CFF)

</div>

---

## Sumário

- [Sobre a iniciativa](#sobre-a-iniciativa)
- [Aviso de independência](#aviso-de-independência)
- [O problema que queremos resolver](#o-problema-que-queremos-resolver)
- [O que o site oferece](#o-que-o-site-oferece)
- [Como funciona para as empresas](#como-funciona-para-as-empresas)
- [Projetos na vitrine](#projetos-na-vitrine)
- [Arquitetura](#arquitetura)
- [Stack](#stack)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Rodando localmente](#rodando-localmente)
- [Ligando o CRUD (Supabase)](#ligando-o-crud-supabase)
- [Modelo de dados](#modelo-de-dados)
- [Segurança e LGPD](#segurança-e-lgpd)
- [Moderação e operação](#moderação-e-operação)
- [Como contribuir](#como-contribuir)
- [Deploy](#deploy)
- [Status e roadmap](#status-e-roadmap)
- [Licença](#licença)
- [Contato](#contato)

---

## Sobre a iniciativa

A **Segunda Vitrine** é uma iniciativa independente fundada por estudantes de **Desenvolvimento de Software Multiplataforma (DSM)** da **FATEC Zona Sul**, em novembro de 2026.

Nosso propósito é conectar talentos estudantis ao mercado de trabalho por meio do desenvolvimento de soluções tecnológicas para empresas e negócios reais, valorizando a experiência prática e o potencial de cada estudante.

Atuamos na idealização e no desenvolvimento de:

- sites;
- sistemas;
- aplicativos;
- soluções de dados;
- automação de processos.

Também trabalhamos para dar **visibilidade aos projetos e às contribuições individuais** dos estudantes, apresentando suas competências, as tecnologias utilizadas e as soluções desenvolvidas.

### Como surgiu

A Segunda Vitrine já atuava como uma empresa fictícia. Como a universidade não oferece o modelo de Empresa Júnior, os estudantes se organizaram por conta própria. A cada semestre, os projetos integradores atendem uma necessidade real da população da região da Zona Sul, e a iniciativa reúne a divulgação desses projetos em um só lugar, para que todos entendam o que foi feito e o que mudou.

## Aviso de independência

> A Segunda Vitrine **não possui vínculo institucional nem representação oficial da FATEC Zona Sul**. É uma iniciativa construída por estudantes. Os projetos e o conteúdo publicados são de responsabilidade dos próprios estudantes.

## O problema que queremos resolver

Muitos negócios da Zona Sul ainda não existem na internet, e hoje boa parte dos clientes pesquisa no celular antes de ir até a loja: horários, preços, localização, opiniões. Quem não aparece online pode simplesmente não ser encontrado.

Ao mesmo tempo, estudantes constroem projetos valiosos durante o curso, mas esses trabalhos raramente ganham visibilidade fora da sala de aula. A Segunda Vitrine liga as duas pontas:

| Para os negócios | Para os estudantes |
| --- | --- |
| Ver, na prática, como o negócio pode aparecer no mundo digital | Experiência com demandas reais |
| Sem custo de desenvolvimento do projeto acadêmico | Portfólio público com tecnologias e contribuições individuais |
| Decidir os próximos passos com o resultado em mãos | Visibilidade para o mercado de trabalho |

## O que o site oferece

O site é composto pelas seguintes páginas:

| Página | Arquivo | Descrição |
| --- | --- | --- |
| Início | `index.html` | Apresentação, equipe, áreas de atuação, projetos em destaque e fluxo "Como funciona" |
| Sobre | `sobre.html` | Como a iniciativa surgiu, quem atendemos e o que cada projeto mostra |
| Estudantes | `estudantes.html` | Galeria de perfis com filtros, stack, soft skills, links e projetos de cada pessoa |
| Projetos | `projetos.html` | Catálogo de projetos com problema, público, solução, tecnologias, status e equipe |
| Empresas | `empresas.html` | Explicação do processo para negócios interessados |
| FAQ | `faq.html` | Dúvidas sobre responsabilidade, autorização, LGPD, segurança e dados |
| Entrar | `entrar.html` | Login do estudante por link mágico enviado ao e-mail |
| Painel | `painel.html` | Área do estudante para gerenciar o próprio perfil e projetos |

### Recursos do front-end

- Tema **claro/escuro**, respeitando a preferência do sistema e lembrando a escolha do usuário.
- Perfis e projetos abertos em modal, com **link compartilhável** por âncora (`#nome-do-perfil`, `#projeto-nome-do-projeto`).
- Filtros e busca em Estudantes e Projetos.
- Ícones de tecnologias com cores por stack e selos como **"Imagem ilustrativa"** e **"Perfil de exemplo"**.
- Campos ainda vazios aparecem como **"Em atualização"**, sem quebrar o layout.
- Preocupação com acessibilidade: `aria-label`, links externos sinalizados ("abre em nova aba") e `rel="noopener noreferrer"`.

### Painel do estudante

Depois de entrar com link mágico, cada estudante pode:

- editar o **próprio perfil**: foto, dados, curso, áreas, stack, soft skills, links (LinkedIn, GitHub, currículo) e escolher publicar ou despublicar;
- cadastrar até **10 projetos**, cada um com imagem, status, texto no formato README, equipe e confirmação de autorização para citar o negócio (ou de que ele é fictício);
- **excluir a própria conta** e todos os seus dados (direito de eliminação previsto na LGPD).

## Como funciona para as empresas

1. **Conversa:** a empresa conta como funciona o negócio e o que gostaria de ter online.
2. **Planejamento:** a equipe de estudantes organiza o que será feito, em etapas.
3. **Desenvolvimento:** os estudantes constroem o site ou sistema como projeto acadêmico.
4. **Visualização:** a empresa vê o projeto pronto para o seu negócio e conhece as tecnologias usadas.
5. **Próximos passos:** com o resultado em mãos, a empresa decide como seguir.

**Sem custos** pelo desenvolvimento do projeto acadêmico. Hospedagem e manutenção são tratadas em uma conversa à parte, já que manter um projeto no ar exige um serviço de hospedagem mais seguro, em plano pago.

Atendemos comércio de bairro, alimentação, beleza, artesanato, serviços, profissionais autônomos e ONGs.

> **Regra de ouro:** nomes de clientes e negócios só são publicados com autorização. Projetos fictícios ou com dados de demonstração trazem aviso explícito.

## Projetos na vitrine

Os projetos abaixo estão cadastrados em `assets/js/data.js`. Cada um pode ser assumido pelo seu dono no painel e, quando isso acontece, a versão do banco substitui a estática.

| Projeto | Setor | Solução | Stack | Status |
| --- | --- | --- | --- | --- |
| **Studio Patty Leão** | Beleza e estética | Sistema de gestão (agenda, estoque, finanças, BI e vitrine com reservas) | Node.js, Express, MongoDB, EJS | Publicado |
| **BarberShop do Gui** | Beleza e estética | Agendamento online com painéis por perfil | Java, Spring Boot, PostgreSQL, Supabase | Em desenvolvimento |
| **PM Bem-Casados** | Alimentação e eventos | Vitrine digital e organização de pedidos | Java, Spring Boot, Angular, TypeScript, Ionic, PostgreSQL, Python, Docker | Em desenvolvimento |
| **Tica Artesanato** | Artesanato | Vitrine digital e registro de pedidos, com coleta mínima de dados (LGPD) | Java, Spring Boot, Angular, TypeScript, Ionic, PostgreSQL, Supabase, Python, Docker | Em desenvolvimento |

> Os dados exibidos nas telas e vídeos do BarberShop do Gui são fictícios e servem apenas para demonstrar a tecnologia.

## Arquitetura

O site é **estático** (HTML, CSS e JavaScript puros, sem etapa de build) e usa o **Supabase** como back-end opcional para login, banco de dados, regras de acesso e armazenamento de imagens.

```
┌────────────────────┐        leitura pública (REST, sem login)        ┌───────────────────────┐
│  Site estático     │ ─────────────────────────────────────────────▶ │  Supabase             │
│  HTML + CSS + JS   │                                                 │  • Auth (link mágico) │
│                    │ ◀───────────────────────────────────────────── │  • PostgreSQL + RLS   │
│  data.js (fallback)│        painel autenticado (CRUD + upload)       │  • Storage (imagens)  │
└────────────────────┘                                                 └───────────────────────┘
```

Pontos importantes do desenho:

- **Funciona sem backend.** Sem configurar o Supabase, o site usa apenas os dados de `data.js`; só o botão Entrar/Painel mostra "não configurado".
- **Degradação graciosa.** Se o Supabase estiver fora do ar (ou o projeto gratuito pausado), as páginas públicas continuam funcionando com `data.js`.
- **Mesclagem de dados.** Perfis e projetos do banco vencem os de `data.js` com o mesmo nome. Perfis marcados com `exemplo: true` desaparecem quando o Supabase responde.
- **Leitura pública leve.** As páginas públicas usam `fetch` direto na API REST do Supabase, sem carregar a biblioteca completa. A biblioteca (`supabase-2.118.0.js`, com sua licença) é usada apenas no login e no painel.

## Stack

| Camada | Tecnologias |
| --- | --- |
| Front-end | HTML5, CSS3, JavaScript (vanilla), Google Fonts |
| Back-end como serviço | Supabase (Auth, PostgreSQL, Row Level Security, Storage) |
| Ícones de tecnologias | [Devicon](https://devicon.dev/) e [Simple Icons](https://simpleicons.org/) via CDN (opcionalmente baixados localmente) |
| Hospedagem | Qualquer host estático (GitHub Pages, Render Static, Netlify, Vercel) |

## Estrutura do repositório

```
segunda-vitrine-github/
├── index.html              # Início
├── sobre.html              # Sobre a iniciativa
├── estudantes.html         # Galeria de estudantes
├── projetos.html           # Catálogo de projetos
├── empresas.html           # Para empresas
├── faq.html                # Dúvidas frequentes
├── entrar.html             # Login por link mágico
├── painel.html             # Painel do estudante (CRUD)
├── assets/
│   ├── css/style.css       # Estilos e temas claro/escuro
│   ├── js/
│   │   ├── data.js         # Dados estáticos: membros, projetos, mapa de tecnologias
│   │   ├── common.js       # Renderização, filtros, modais, tema, animações
│   │   ├── remote.js       # Leitura pública do Supabase e mesclagem com data.js
│   │   ├── entrar.js       # Fluxo de login (link mágico + código numérico)
│   │   ├── painel.js       # CRUD de perfil e projetos, upload, exclusão de conta
│   │   ├── config.example.js  # Modelo da configuração do Supabase
│   │   ├── config.js       # Sua configuração local (ignorada pelo Git)
│   │   └── vendor/         # Biblioteca do Supabase e licença
│   ├── img/                # Logos, favicon e imagens ilustrativas
│   ├── media/              # Vídeos e capas das seções
│   ├── membros/            # Fotos dos integrantes
│   └── icons/              # Logotipos de tecnologias (gerados por script)
├── supabase/
│   └── schema.sql          # Tabelas, RLS, triggers, storage e funções
├── scripts/
│   └── baixar-icones.sh    # Baixa logotipos de tecnologias para assets/icons/
├── SETUP-SUPABASE.md       # Passo a passo detalhado do back-end
├── PENDENCIAS.md           # Status da versão e pendências
└── .gitignore
```

## Rodando localmente

Não há dependências para instalar. Basta servir a pasta com qualquer servidor estático:

```bash
# dentro da pasta do projeto
python -m http.server 8080
```

Abra <http://localhost:8080>.

Nesse modo o site já funciona por completo com os dados de `assets/js/data.js`. Para habilitar login e painel, siga a próxima seção.

### Ícones locais (opcional)

Por padrão, os logotipos de tecnologias vêm de CDNs. Para baixar alguns deles para `assets/icons/`:

```bash
bash scripts/baixar-icones.sh
```

## Ligando o CRUD (Supabase)

Resumo; o passo a passo completo está em [`SETUP-SUPABASE.md`](SETUP-SUPABASE.md).

1. **Crie um projeto** em [supabase.com](https://supabase.com) (região *South America – São Paulo*).
2. No **SQL Editor**, rode o arquivo [`supabase/schema.sql`](supabase/schema.sql) inteiro. Ele é idempotente e pode ser executado de novo.
3. **Cadastre quem pode entrar** (sem nenhuma linha, ninguém consegue criar conta, de propósito):
   ```sql
   insert into public.acesso_permitido values ('dominio','fatec.sp.gov.br');  -- confirme o domínio real dos alunos
   insert into public.acesso_permitido values ('email','alguem@gmail.com');   -- exceções individuais (minúsculas)
   ```
4. **Ative o hook** em *Authentication → Hooks → Before User Created*, apontando para `public.hook_before_user_created`. É ele que realmente barra e-mails não autorizados; o filtro no JS é apenas conforto.
5. Em *Authentication → URL Configuration*, defina a *Site URL* e as *Redirect URLs* (`https://SEU-SITE/painel.html` e, para testes, `http://localhost:8080/painel.html`).
6. Configure um **SMTP próprio** (Resend, Brevo ou similar). O SMTP padrão do Supabase serve apenas para testes.
7. Edite os **templates de e-mail** *Confirm signup* e *Magic Link* com o link e o código numérico de fallback.
8. Copie o modelo de configuração e preencha com a URL do projeto e a chave pública:
   ```bash
   cp assets/js/config.example.js assets/js/config.js
   ```
   ```js
   window.SV_CONFIG = {
     url: "https://SEU-PROJETO.supabase.co",
     anonKey: "SUA_CHAVE_ANON_OU_PUBLISHABLE"
   };
   ```
   > ⚠️ Use somente a chave `anon`/`publishable`. **Nunca** coloque a `service_role`/`secret` no front-end. O `config.js` está no `.gitignore`.
9. **Teste** em <http://localhost:8080/entrar.html>.

### Checklist de validação

- [ ] E-mail fora da allowlist é recusado.
- [ ] Perfil não publicado não aparece em Estudantes.
- [ ] Com outra conta, tentar alterar um registro alheio falha.
- [ ] O link do e-mail funciona quando aberto em outro dispositivo.
- [ ] Excluir uma conta de teste remove perfil, projetos e arquivos.

## Modelo de dados

Definido em [`supabase/schema.sql`](supabase/schema.sql).

| Tabela / recurso | Finalidade |
| --- | --- |
| `acesso_permitido` | Allowlist de domínios e e-mails que podem criar conta (invisível pela API) |
| `profiles` | Perfil público do estudante: nome, papel, curso (DSM/ADS), segmento, objetivo, foto, links, áreas, techs, soft skills e funções |
| `projects` | Projetos do estudante (até 10 por pessoa): descrição, tecnologias, setor, solução, status, repositório, deploy, imagem e textos no formato README |
| Buckets `avatars` e `projetos` | Imagens (JPEG, PNG ou WebP), com limite de 2 MB e 3 MB, respectivamente |
| `excluir_minha_conta()` | Função que apaga o usuário e, em cascata, perfil e projetos |

Campos de moderação (`bloqueado` e `destaque`) **só podem ser alterados pela coordenação**.

## Segurança e LGPD

A segurança é aplicada **no servidor**, não apenas no navegador:

- **Row Level Security** em todas as tabelas: o público só enxerga registros `publicado` e não `bloqueado`; cada estudante só edita o que é seu.
- **Permissões por coluna (`GRANT`)**: o aluno nunca consegue gravar `bloqueado` nem `destaque`.
- **Hook de allowlist** antes da criação do usuário, que também bloqueia e-mails com `+` para impedir várias contas da mesma pessoa.
- **Validação de formato no banco** (`CHECK`): URLs de LinkedIn, GitHub e repositórios, limites de tamanho e caracteres proibidos em listas.
- **Storage restrito**: cada pessoa só mexe na própria pasta (`<uid>/...`), com tipo e tamanho de arquivo limitados.
- **Publicação exige consentimento** (perfil) e **autorização de uso do nome do negócio** (projeto); o momento do consentimento é registrado.
- **Direito de eliminação**: o estudante exclui a própria conta, e todos os seus dados somem.
- **Coleta mínima**: a plataforma coleta apenas e-mail, nome, foto e links.
- Saídas HTML escapadas e URLs validadas no front-end.

> A chave `anon`/`publishable` do Supabase é pública por desenho; quem protege os dados são as políticas RLS.

## Moderação e operação

```sql
update public.profiles set bloqueado = true where id = '<uuid>';  -- some do site e perde edição
update public.projects set bloqueado = true where id = '<uuid>';
update public.profiles set destaque  = true where id = '<uuid>';  -- destaque no "Núcleo" da iniciativa
```

Cuidados operacionais:

- O projeto **gratuito** do Supabase pausa após cerca de uma semana sem uso. O site público continua no ar (usa `data.js`), mas ninguém consegue entrar no painel até reativá-lo.
- Faça **backups** periódicos (*Database → Backups* ou `pg_dump`).
- Se houver abuso no login, ative os limites de taxa e um CAPTCHA (Turnstile ou hCaptcha).

## Como contribuir

### Estudantes: entrar na vitrine

1. Peça à coordenação a liberação do seu e-mail na allowlist.
2. Acesse **Entrar**, receba o link mágico e abra o **Painel**.
3. Preencha seu perfil e cadastre seus projetos. Só aparecem no site quando você marca **publicar**.
4. Confirme a autorização de uso do nome do negócio (ou que ele é fictício) antes de publicar um projeto.

### Editando dados estáticos

Perfis e projetos iniciais ficam em `assets/js/data.js`, nos arrays `MEMBROS` e `PROJETOS`. Algumas convenções:

- `curso`: `"DSM"` ou `"ADS"`.
- `techs`: use os nomes exatos do mapa `TECH` no mesmo arquivo.
- `linkedin`, `github`, `curriculo`: URLs completas (`https://...`); vazio deixa o ícone apagado.
- `foto`: caminho dentro de `assets/membros/`.
- `exemplo: true` marca perfis de demonstração (com selo próprio); apague-os ou troque por dados reais.
- `ilustrativa: true` mostra o selo "Imagem ilustrativa" (para imagens de banco de imagens).
- Campo vazio em um projeto aparece como "Em atualização".
- **Nunca publique nomes de clientes ou negócios sem autorização.**

### Contribuições de código

1. Faça um fork e crie uma branch (`git checkout -b minha-melhoria`).
2. Mantenha o padrão do projeto: HTML, CSS e JS puros, sem etapa de build.
3. Nunca faça commit de chaves ou do `config.js`.
4. Abra um Pull Request descrevendo a mudança.

## Deploy

Por ser estático, o site pode ser publicado em **GitHub Pages**, **Render Static**, **Netlify** ou **Vercel**. Lembre-se de:

- incluir `assets/js/config.js` no ambiente de deploy (ele é ignorado pelo Git, então precisa ser gerado ou enviado pelo host);
- cadastrar a URL final em *Redirect URLs* no Supabase;
- definir cabeçalhos de segurança no host sempre que possível.

## Status e roadmap

Versão atual: **v11**.

### Concluído

- [x] Site estático completo (início, sobre, estudantes, projetos, empresas e FAQ).
- [x] Login por link mágico, com código numérico de fallback.
- [x] Painel com CRUD de perfil e projetos, upload de imagens e exclusão de conta.
- [x] Leitura pública do Supabase com fallback para `data.js`.
- [x] Segurança no servidor: RLS, permissões por coluna, hook de allowlist, validações e restrições de storage.
- [x] FAQ atualizado para refletir login e cadastro.

### Pendente

- [ ] Executar o setup do Supabase em produção (schema, allowlist, hook, redirect URLs, SMTP, templates e `config.js`).
- [ ] Definir a regra de acesso (domínio institucional ou lista de e-mails) e quem faz a moderação.
- [ ] Completar os campos de deploy, print, "por quê", "como rodar" e resultado dos quatro projetos iniciais, pelo painel de cada dono.
- [ ] Definir e-mail de contato da iniciativa; revisão jurídica do FAQ e criação de uma **Política de Privacidade** própria.
- [ ] Endurecer o cabeçalho CSP (`script-src 'self' …`): exige mover ou aplicar hash nos scripts inline das páginas.
- [ ] Paginação em Estudantes e Projetos (hoje carrega até 1000 registros de cada uma de uma vez).
- [ ] Resolver slugs duplicados: perfis ou projetos com o mesmo nome compartilham o link `#nome`.

Mais detalhes em [`PENDENCIAS.md`](PENDENCIAS.md).

## Licença

Ainda **não há uma licença definida** para este repositório. Enquanto isso, todos os direitos permanecem com os autores. Recomenda-se escolher uma licença (por exemplo, MIT) antes de aceitar contribuições externas. Os conteúdos dos projetos dos estudantes são de responsabilidade e autoria de cada um.

A biblioteca do Supabase incluída em `assets/js/vendor/` mantém sua própria licença (`supabase-LICENSE.txt`).

## Contato

- **LinkedIn:** página da Segunda Vitrine
- **E-mail da iniciativa:** *a definir*

---

<div align="center">

**Segunda Vitrine** · Iniciativa independente de estudantes de DSM da FATEC Zona Sul, sem vínculo institucional oficial.

</div>
