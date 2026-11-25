# PráticaMed 2.4 — Curvas pessoais e governança de metas

## O que mudou
- Em **Minha evolução**, selecione uma habilidade para visualizar a curva pessoal correspondente.
- A curva de **execuções acumuladas por data** continua existente para todas as habilidades.
- Em procedimentos cujo catálogo marca indicador de **sucesso**, a nova tela apresenta **proporção cumulativa de sucessos autodeclarados por data**, separando simulação e paciente real, quando existirem pelo menos 5 registros consistentes com sucesso/insucesso por ambiente, distribuídos em 2 dias diferentes. Essa regra de apresentação não é competência nem garantia estatística.
- Os resultados clínicos não são preenchidos automaticamente ao tocar +; podem ser informados depois em Histórico → Editar.
- Cadastro do **N de referência** em `goals-config.js`, inicialmente vazio e não utilizado para emitir qualquer mínimo. O app só mostrará progresso para uma meta se ela tiver status, quantidade, unidade e cenário definidos. Meta com unidade incompatível com o botão + não gera porcentagem enganosa.
- `METAS-PARA-VALIDACAO.csv` apresenta 45 linhas sem mínimos inventados para preencher após revisão docente. Não envie informações de pacientes.

## Regras científicas para preencher metas
- Defina `skill_id`, número `quantity`, **unidade** (execução, ponto de sutura, sessão, tentativa, etc.), **contexto** (simulacao / real), fonte, situação (institucional ou piloto) e responsável pela aprovação.
- Números de estudos (por exemplo, 41 **pontos de sutura praticados em um protocolo**, ou 17 **encontros clínicos supervisionados de intubação**) **não são mínimos universais de graduação**.
- O botão + registra **uma execução da habilidade**, não ponto de sutura, tentativa múltipla nem avaliação por preceptor. Não converter automaticamente unidades distintas.
- Nunca confundir taxa acumulada autorrelatada com curva de proficiência; LC-CUSUM só após avaliação formal de critérios de sucesso/erro e parâmetros estatísticos apropriados.

## Publicação no mesmo repositório
Faça backup antes. Envie à **raiz** do GitHub `index.html`, `app.js`, `styles.css`, `personal-curves.js`, `goals-config.js`. Confirme que sua versão 2.3 já inclui `scientific-review.js` e `data-quality.js`. Não sobrescreva os `config.js`, `supabase-config.js`, `cloud.js` ou `catalogo.js` existentes. Sem SQL novo nesta versão. Faça atualização forçada no navegador após o deploy.

## Testes necessários depois da publicação
1. Registrar uma prática pelo botão + e verificar contagem e curva da habilidade;
2. Em Histórico → Editar, colocar resultado em pelo menos cinco práticas feitas no mesmo ambiente (apenas resultados verdadeiros; dados sintéticos unicamente em contas de teste);
3. Conferir que a curva de desempenho só aparece em procedimentos com indicador sucesso, sem juntar simulação e pacientes reais;
4. Sair e voltar, verificar a sincronização usando a mesma conta e a separação entre duas contas;
5. Verificar que não aparecem mínimos obrigatórios não homologados.

## Limitações
Testes de código local não substituem homologação científica, teste real na conta Supabase, revisão de segurança RLS e monitoramento de privacidade. A curva pessoal gerada é descritiva, não uma certificação de competência.
