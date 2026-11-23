# PráticaMed MVP 1.8 — Registro com +

## O que mudou
- Tela Registrar prática: lista de habilidades com botão + ao lado de cada item.
- Cada toque no + adiciona **uma execução autodeclarada** com data atual.
- Campo opcional de ambiente é configurado uma vez para os toques seguintes. Por padrão: não informado.
- Desfazer o último toque em até alguns segundos.
- Filtros Ambos, Manobras, Procedimentos; pesquisa; áreas de interesse continuam funcionando.
- Gráficos, CSV e backup distinguem ambiente não informado de simulação ou paciente real.
- Mantém a chave de armazenamento antigo `praticamed-prototipo-v1`, sem apagar registros anteriores.
- Não registra sucesso, competência, detalhes de paciente nem validação de preceptores.

## Publicação no seu repositório existente
1. Faça backup dos dados em Preferências.
2. Descompacte este ZIP.
3. Em https://github.com/celsoamramos/Praticamed, use Add file > Upload files.
4. Envie **index.html, app.js e styles.css** para a **raiz** do repositório. Substitua os arquivos existentes (Commit changes).
5. Não substitua seu `config.js` (Formspree) nem `catalogo.js`; eles permanecem no GitHub.
6. Após a publicação, abra https://celsoamramos.github.io/Praticamed/ e pressione Ctrl+Shift+R.
7. Teste +, Desfazer, Minha evolução, filtros e backup.

**Esta versão mantém arquivos na raiz** porque essa é a organização do repositório atualmente publicado. Não os coloque na pasta assets.
