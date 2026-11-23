# PráticaMed MVP 1.7.0 — Piloto colaborativo

O PráticaMed é um protótipo educacional de registro e acompanhamento de **manobras e procedimentos** para estudantes de Medicina (1º ao 12º período). **Não é uma ferramenta de decisão clínica.**

## Estrutura dos arquivos

- `index.html`: página de entrada do aplicativo.
- `assets/styles.css`: aparência (desktop e celular).
- `assets/catalogo.js`: catálogo de 45 itens e matriz preliminar de evidências; a revisão docente ainda está pendente.
- `assets/app.js`: navegação, cadastro de práticas, filtros, gráficos, backups e sugestões.
- `config.js`: **único local para configurar o envio das sugestões**. Preserve este arquivo ao fazer futuras atualizações.
- `CHANGELOG.md`: alterações por versão.
- `GUIA-PUBLICACAO.md`: passo a passo para colocar online e receber sugestões.

## Instalação rápida — GitHub Pages (apenas piloto)

1. Crie repositório público `praticamed` no GitHub.
2. Envie **o conteúdo desta pasta**, mantendo `index.html`, `config.js` e a pasta `assets` na raiz.
3. Abra Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.
4. Acesse `https://SEU_USUARIO.github.io/praticamed/` quando a publicação terminar.
5. Cada atualização poderá substituir os arquivos da aplicação no mesmo repositório, mantendo o endereço.

### Envio de sugestões

O formulário de sugestões já está implementado, porém vem **desconectado de propósito** para não fingir que mensagens são recebidas. A configuração de envio exige que o proprietário crie um formulário gratuito em https://formspree.io e cole seu endpoint em `config.js`. Consulte `GUIA-PUBLICACAO.md`.

## Privacidade e limitações

- Os registros de práticas continuam no **localStorage do navegador**: não existem contas, backup remoto ou sincronização entre aparelhos. Antes de mudar de dispositivo/endereço, exporte o backup JSON em Preferências.
- Não inclua nomes, prontuários, identificadores ou dados clínicos de pacientes, nem em registros nem em sugestões.
- Quando o Formspree for habilitado, apenas as mensagens do formulário (incluindo e-mail opcional e período informado) serão enviadas ao serviço externo, não os registros de práticas.
- Disponibilize aviso/política de privacidade e informações de contato do projeto antes de convidar estudantes reais.
- Os registros são autodeclarados; gráficos exibem **experiência acumulada, não competência comprovada**. Metas exibidas são exploratórias e não representam exigência para a formatura.
- GitHub Pages é uma opção para **protótipo não comercial**. Ao monetizar ou oferecer SaaS, migre a hospedagem para plataforma apropriada.
