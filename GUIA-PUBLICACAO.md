# Guia passo a passo — Publique e atualize o PráticaMed

## Etapa 1 — Hospedar o aplicativo com endereço fixo

1. Crie uma conta em https://github.com/ caso ainda não tenha.
2. Clique em **New repository** e escolha o nome `praticamed`.
3. Selecione **Public** (o código ficará visível para qualquer pessoa). Não coloque dados pessoais, de pacientes, senhas ou chaves privadas nesse repositório.
4. Faça upload **do conteúdo extraído do ZIP**, não do ZIP como um arquivo só: `index.html`, `config.js`, pasta `assets`, `README.md` e demais arquivos.
5. Em **Settings → Pages**, configure **Deploy from a branch**, branch `main`, pasta `/(root)`, e salve.
6. Abra o endereço divulgado pelo GitHub, geralmente `https://SEU_USUARIO.github.io/praticamed/`.
7. Faça um registro fictício e exporte um backup JSON antes de convidar pilotos.

> O GitHub Pages hospeda apenas arquivos estáticos. Ele não recebe diretamente mensagens enviadas de formulários.

## Etapa 2 — Ativar o campo de sugestões (Formspree)

1. Entre em https://formspree.io e crie uma conta (faça a verificação do e-mail, caso solicitada).
2. Crie um formulário chamado **Sugestões PráticaMed** e selecione o e-mail de destino.
3. Abra **Integrations** do seu formulário e copie o endpoint de envio, com formato `https://formspree.io/f/XXXXXXXX`.
4. Abra `config.js` no GitHub e clique em **Edit** (ícone de lápis).
5. Altere **somente** esta linha:

   `feedbackEndpoint: ''`

   para a URL real recebida, por exemplo:

   `feedbackEndpoint: 'https://formspree.io/f/SEU_ID_REAL'`

   **Não use o exemplo como endpoint funcional.** O ID deve vir da sua conta.
6. Clique em **Commit changes**. O site receberá a nova configuração quando o GitHub Pages atualizar.
7. Abra a aba **Sugestões**, escreva uma mensagem de teste sem dados pessoais, marque o consentimento e pressione **Enviar sugestão**.
8. Confira no painel do Formspree **e no seu e-mail** se a mensagem chegou. Só depois convide os usuários piloto.

**Plano gratuito:** segundo a página de planos consultada em 23/11/2026, o Formspree oferece até 50 envios/mês e guarda um arquivo de mensagens por 30 dias; confirme os limites atuais antes do piloto. Se o envio falhar, o aplicativo mantém a mensagem digitada e mostra erro, não afirma sucesso.

## Etapa 3 — Atualizar sempre o MESMO aplicativo

1. Mantenha o repositório `praticamed` como fonte oficial, com a versão mais recente.
2. A cada atualização, faça primeiro o backup dos registros do navegador usando **Preferências → Baixar backup completo (JSON)**.
3. Atualize `assets/app.js` para novas funções, `assets/catalogo.js` para a biblioteca, `assets/styles.css` para o visual e `index.html` para a estrutura. Preserve o endpoint em `config.js`.
4. Teste antes de publicar, preferencialmente em uma branch de teste ou ambiente de prévia.
5. Envie as alterações ao repositório e confirme a publicação no GitHub Pages. O endereço **permanece o mesmo**.
6. Registre o que mudou em `CHANGELOG.md`, com número de versão (ex.: 1.7.1, 1.8.0).

Atenção: alterar a origem (domínio ou caminho) do site pode separar o armazenamento local do navegador. Preserve o endereço ou instrua os pilotos a restaurar o backup.

## Etapa 4 — Organizar o feedback recebido

Organize as mensagens em uma planilha ou quadro com colunas: **data**, **categoria**, **ideia**, **frequência**, **impacto**, **esforço estimado**, **prioridade** e **situação**. Nunca publique os e-mails dos participantes. Revise semanalmente e implemente primeiro as melhorias com maior impacto e menor risco.

## Etapa 5 — Migrar do piloto para uma aplicação real

- Criar cadastro/autenticação de estudantes.
- Migrar de `localStorage` para banco protegido e segregado por usuário.
- Implementar controles de privacidade, backup e exclusão de dados.
- Revisar com docentes as curvas científicas e as metas antes de apresentá-las como parâmetros institucionais.
- Adotar hospedagem e infraestrutura adequadas à operação comercial: o GitHub Pages **não se destina a SaaS/comércio eletrônico**.
- Formalizar política de privacidade e tratamento de dados pessoais conforme a LGPD.

## Links oficiais

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Formspree HTML: https://help.formspree.io/articles/building-your-form/building-an-html-form
- Formspree planos: https://formspree.io/plans
- Formspree JS: https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax
