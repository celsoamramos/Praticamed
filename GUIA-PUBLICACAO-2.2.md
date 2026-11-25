# PráticaMed 2.2 — Atualização segura

Esta atualização mantém a biblioteca e as configurações existentes. Não executa migração de banco de dados.

## Antes de publicar
1. No aplicativo, em **Preferências**, baixe o backup JSON; guarde com segurança.
2. Salve a versão atual do repositório GitHub (ou use o histórico de commits para reverter).
3. Confira que suas contas de teste funcionam normalmente.

## Publicar
1. Descompacte `praticamed-v2.2-robusto-atualizacao.zip`.
2. Abra `https://github.com/celsoamramos/Praticamed`.
3. Em **Add file → Upload files**, envie **somente** `index.html`, `app.js`, `cloud.js` e `styles.css` para a **raiz** do repositório, substituindo os arquivos existentes.
4. Faça **Commit changes**; depois acesse `https://celsoamramos.github.io/Praticamed/` e recarregue ignorando o cache (Ctrl+Shift+R).
5. **Não** substitua `supabase-config.js`, `config.js`, `catalogo.js` ou `privacidade.html` da sua instalação.
6. **Não** execute novamente o SQL: a atualização só utiliza campos já existentes.

## Teste de aceitação (duas contas)
1. Em uma conta, registre Romberg pelo **+**; veja a prática em **Histórico**.
2. Use **Editar** para mudar a data (dia anterior) e o ambiente para **Simulação**. Verifique a linha no histórico e a atualização em **Minha evolução**.
3. Faça login com a mesma conta no celular ou segundo navegador; em **Minha conta** clique **Atualizar dados**. Confirme que a correção apareceu.
4. Entre na segunda conta: ela **não** deve mostrar o registro da primeira.
5. Teste filtro por ambiente/tipo/período, **Exportar seleção (CSV)** e a exclusão de um registro fictício.
6. Envie uma sugestão de teste e confirme no Formspree.

## Limitações e segurança
- O piloto não é um registro clínico. **Não insira nomes, prontuários ou outros identificadores de pacientes.**
- Registros são autodeclarados; não há validação de preceptor nem autorização de execução independente.
- Gráficos são volumes de prática, **não** curvas de proficiência validadas.
- A atualização não altera configurações do SMTP, limites de e-mail ou políticas RLS.
- O Histórico permite corrigir apenas data e ambiente. Para mudar a habilidade ou participação, apague a entrada incorreta e crie outra.
- O botão de atualizar sincroniza **sob demanda**; não há sincronização instantânea entre telas abertas.
- Para usuários reais, política de privacidade, plano de retenção, segurança/RLS e testes institucionais seguem pendentes.
