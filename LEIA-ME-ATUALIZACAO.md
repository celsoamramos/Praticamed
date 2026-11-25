# PráticaMed 2.1 — Atualização dos indicadores do piloto

## O que foi implementado

- **Minha evolução**: resumos das últimas 7 e 30 datas corridas, quantidade de habilidades distintas, distribuição por ambiente (simulação, paciente real autodeclarado, não informado) e áreas com mais registros. Os indicadores mudam com o filtro por habilidade.
- **Minha conta → Atualizar dados**: busca novamente os registros e preferências no Supabase, útil após adicionar uma execução em outro aparelho. Exibe a data/hora da última conferência bem-sucedida.
- Preservados: login, cadastros, cores azul e branco, seleção múltipla de interesses, filtro de manobras/procedimentos, botão +, sugestões e backup.

## Como instalar no GitHub Pages

1. **Antes de modificar qualquer arquivo**, no PráticaMed atual acesse Preferências e salve um backup JSON; conserve uma cópia da versão anterior.
2. Em `https://github.com/celsoamramos/Praticamed`, mantenha a branch `main` e abra `Add file → Upload files`.
3. Envie **apenas** `index.html`, `app.js`, `cloud.js` e `styles.css` da pasta do pacote, diretamente na raiz do repositório, substituindo os arquivos correspondentes.
4. Faça `Commit changes`; aguarde o GitHub Pages publicar. Abra `https://celsoamramos.github.io/Praticamed/` e pressione Ctrl+Shift+R.
5. **Não substitua** `supabase-config.js`, `config.js` nem `catalogo.js` do seu GitHub. Suas configurações e a biblioteca em produção permanecem como estão.
6. Não é necessário executar novo SQL nem alterar o SMTP.

## Testes

- Com sua conta autenticada, registre uma prática por `+`. Em Minha evolução, confira as estatísticas.
- Abra a mesma conta em outro aparelho; registre uma prática por lá. Na primeira tela, vá a Minha conta e clique em **Atualizar dados**. Confirme que o número mudou.
- Entre com uma segunda conta e verifique que ela não possui os registros da primeira.
- Confira o envio de uma sugestão ao Formspree.
- Caso algo não funcione, restaure os arquivos anteriores usando o histórico de commits no GitHub.

## Limitações importantes

- O botão Atualizar dados consulta o servidor **sob demanda**. Não é sincronização em tempo real entre abas abertas.
- Não atribuímos nenhuma competência clínica, curva científica ou meta obrigatória com base apenas na quantidade.
- Este pacote não inclui nem altera credenciais, chaves, políticas RLS, e-mails, tabelas ou dados de pacientes.
- As telas foram testadas localmente; não há acesso autenticado à sua conta real do Supabase nem autorização para alterar seu GitHub automaticamente.
