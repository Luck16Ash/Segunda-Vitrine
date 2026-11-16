# Segunda Vitrine v9 — status e prompt de continuação

Site estático (HTML/CSS/JS puro). Páginas: `index`, `sobre`, `faq`, `estudantes`, `projetos`. Dados em `assets/js/data.js` (MEMBROS e PROJETOS), lógica em `assets/js/common.js`, estilos em `assets/css/style.css` (bloco "v9" no final).
Para rodar: `python -m http.server 8080` dentro da pasta e abrir http://localhost:8080

## ✅ Feito na v9
- **Sobre** em página própria (`sobre.html`): como surgiu (3 passos), **9 perfis atendidos** clicáveis com exemplos de como a tecnologia ajuda, e o que cada projeto mostra.
- **FAQ** (`faq.html`): responsabilidade, autorização de empresas (responsabilidade individual do estudante + política de bom uso), LGPD, segurança e dados.
- **Aviso de não vínculo**: saiu do cabeçalho e dos blocos coloridos. Agora é só uma nota curta no fim do rodapé de cada página.
- **Home enxuta**: removidos o bloco Tecnologia/Dados/Inovação/Parceria, a faixa de tecnologias, "Para empresas/alunos", os vídeos extras e os confetes. Menu com 5 itens: Sobre, Estudantes, Projetos, Como funciona, FAQ.
- **Filtros de estudantes** refeitos: grupos recolhíveis, contagem por opção, "Ver todas", filtros ativos removíveis, "Limpar tudo".
- **Projetos**: filtros novos (Tecnologia, Setor, Tipo de solução, Status, Equipe) e detalhe ao clicar, no formato do post sobre README: Problema → Para quem → O que a equipe fez → Tecnologias e por quê → Como rodar → Resultado, com botões GitHub e Site no ar e checklist de documentação (x/5).
- **Vídeos (v9.1):** Front-end e Mobile trocados pelos vídeos novos (`front.mp4/.jpg`, `mobile.mp4/.jpg`) e novo vídeo de planejamento ao lado de "Como funciona para a empresa" (`planejamento.mp4/.jpg`, bloco `.emp-split` no CSS).
- **v10:** nova página `empresas.html` (explica o passo a passo, com vídeo "mundo digital" `digital.mp4` e 3 fotos em `assets/img/empresa-*.jpg`); home com resumo "Para empresas"; menu e rodapé com "Empresas"; logo da iniciativa no Sobre; banner de Projetos com vídeo ao lado; cards de projetos e estudantes corrigidos (conflito da classe `.st` renomeado para `.pst`); ritmo de espaçamento unificado. **Revisar o texto da página Empresas** (passos 1–5 foram redigidos como rascunho).
- Já feito na v8: Habilidades removidas, 3 ícones por estudante, card de destaque (`destaque:true`), vídeo de Estudantes.

## ⏳ O que falta (3 etapas)
- **Etapa A (próxima) — conteúdo dos projetos.** Em `PROJETOS` preencher, por projeto: `deploy` (URL do site no ar), `print` (imagem da aplicação rodando em `assets/img/`), `porque`, `rodar` (passo a passo curto) e `resultado`. Conferir `status` (Studio = "Publicado" é suposição) e `tech`. Conferir também o `tech` do Studio Patty Leão: o `data.js` antigo dizia PostgreSQL, mas o projeto usa MongoDB.
- **Etapa C — dados reais dos estudantes.** Preencher `linkedin`, `github` e `curriculo`, adicionar fotos em `assets/membros/`, apagar os perfis `exemplo:true`. Currículo em PDF sem CPF, RG e endereço completo.
- **Etapa D — jurídico e contato.** Criar um e-mail de contato da iniciativa e colocar no FAQ (hoje o canal é o perfil do estudante). Pedir revisão do FAQ por um professor ou profissional do direito antes de divulgar.

## 👉 Prompt para a próxima etapa
> Estou na v9 do site Segunda Vitrine (ZIP anexo). Faça a **Etapa A**: vou enviar, por projeto, a URL do site no ar, prints e os textos de "por que essas tecnologias", "como rodar" e "resultado". Preencha em `PROJETOS` (data.js), comprima os prints (~1200px, .jpg/.webp), confira status e tecnologias, e devolva o ZIP completo e este PENDENCIAS.md atualizado (faltam 2 etapas; próxima: C).
