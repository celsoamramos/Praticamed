# Como instalar PráticaMed 2.3 no GitHub — atualização cumulativa

Esta atualização incorpora 2.1 e 2.2, além da auditoria dos dados e revisão das curvas. **Não precisa publicar as versões intermediárias.**

1. Entre com sua conta PráticaMed e baixe um backup JSON em Preferências. Guarde o arquivo fora do repositório público.
2. Baixe o ZIP 2.3, extraia e entre no repositório `https://github.com/celsoamramos/Praticamed` na branch `main`.
3. Em **Add file → Upload files**, envie para a **raiz** exatamente estes 6 arquivos: `index.html`, `app.js`, `cloud.js`, `styles.css`, `scientific-review.js`, `data-quality.js`. Substitua os quatro já existentes. Os novos arquivos devem ficar ao lado de `index.html`, e **não dentro de assets/**.
4. Clique em **Commit changes**. Abra `https://celsoamramos.github.io/Praticamed/` e pressione **Ctrl + Shift + R**. Em celular, reabra a página ou limpe o cache do site se necessário.
5. **Preserve sem substituir**: `catalogo.js`, `supabase-config.js`, `config.js` e seu `privacidade.html`. Nunca publique senha, chave secreta, `service_role` nem token SMTP.
6. **Não execute SQL adicional**: foram usados apenas os campos `role` e `result` já existentes na tabela `pm_practice_records`.

## Validação rápida após publicar

- Login com a primeira conta, Registrar prática → + → Histórico.
- Em Histórico → Editar, informe o ambiente e opcionalmente um resultado autodeclarado. Confirme em Validação e curvas.
- Escolha intubação na aba Validação e curvas: devem aparecer somente 3 pontos do estudo de 2011. Escolha sutura: deve aparecer a média observada, **sem** uma falsa curva.
- Em Minha evolução, escolha acesso venoso: o histórico pessoal e os dados do estudo devem estar em seções diferentes.
- Reabra a mesma conta em outro dispositivo, clique em Minha conta → Atualizar dados, confira a correção.
- Faça login com a segunda conta: não deve mostrar práticas da primeira.
- Teste envio de sugestão ao Formspree.
- Caso haja erro, use o histórico do GitHub para restaurar os 4 arquivos substituídos; remova os dois novos somente se reverter também `index.html` e `app.js`.

**Pendente:** validação científica formal e por preceptor, testes externos RLS, revisão legal de privacidade, integração real no seu Supabase e política de segurança de produção.
