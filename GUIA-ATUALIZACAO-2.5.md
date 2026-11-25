# PráticaMed 2.5 — Registro rápido em duas escolhas

## O que mudou
Ao tocar no botão **+** em qualquer área do aplicativo, aparece uma janela curta:
1. Onde praticou: **Simulação** ou **Pessoa real (paciente sob supervisão)**.
2. Resultado: **Sim**, **Não** ou **Não avaliado**.
3. Toque em **Salvar prática**. O registro será adicionado **somente após** a confirmação de salvamento.

As manobras usam uma **autoavaliação da execução técnica** (adequada/preciso melhorar). Os procedimentos com indicador de sucesso usam **sucesso/insucesso**. Dados existentes não são alterados. O registro é autodeclarado e não comprova competência ou supervisão por preceptor.

**Não insira nomes, prontuários ou outros dados de pacientes.** Práticas com colegas em cenário de ensino simulado devem ser registradas como simulação.

## Como publicar sem perder as configurações
1. Antes de qualquer alteração, entre em **Preferências** do aplicativo e baixe o backup JSON. Guarde também uma cópia dos arquivos anteriores no computador.
2. Abra o repositório existente `https://github.com/celsoamramos/Praticamed`.
3. Clique em **Add file → Upload files** e envie para a **raiz** do repositório somente os arquivos `index.html`, `app.js` e `styles.css` deste pacote.
4. Substitua as versões anteriores e confirme **Commit changes**.
5. Reabra `https://celsoamramos.github.io/Praticamed/` e pressione Ctrl+Shift+R.
6. Faça um teste na sua própria conta: + → Simulação → Sim → Salvar. Veja se o histórico e a evolução mudaram. Repita com Não e confira se os registros permanecem após atualizar a página.

**Não substitua** `config.js`, `supabase-config.js`, `cloud.js`, `catalogo.js`, `scientific-review.js`, `data-quality.js`, `goals-config.js` ou `personal-curves.js`. Suas configurações e metas continuam em uso.

Não há novas tabelas nem alterações de SQL.

## Testes e limitações
Os testes automatizados locais validaram a geração da janela, resultados correspondentes a procedimentos e manobras, persistência local, auditoria de qualidade e uma simulação de inserção no servidor. O comportamento no Supabase real e a interface em navegadores móveis precisam ser verificados após a publicação. O botão **Desfazer** continua disponível depois de salvar.
