# PráticaMed 2.3 — Relatório de testes locais

Data: 24/11/2026

## Verificações concluídas

- Validação de sintaxe JavaScript com `node --check`: `app.js`, `cloud.js`, `data-quality.js`, `scientific-review.js`.
- A tela inicial e a navegação até **Validação e curvas** renderizaram em ambiente local.
- Revisão: estudo de intubação mostrou somente os três pontos documentados e seus valores, sem interpolação.
- Busca científica por sutura: média de 41 (DP 15), sem criar curva inexistente.
- Registro rápido + de acesso venoso: contador aumentou em 1.
- Um registro sem ambiente foi sinalizado para revisão; a correção para simulação retirou o alerta.
- Editar resultado como 'sucesso autodeclarado' funcionou sem transformar o registro em competência certificada.
- A visualização de proporção de sucesso foi bloqueada com amostra insuficiente.
- Auditoria de data inválida (29/02/2026) e de registro real sem supervisão declarada classificou os casos corretamente.
- Interface renderizada em 1440 px e 390 px; sem exceções JavaScript durante os testes automatizados locais.

## Não testado em produção

- Login e troca de contas reais no Supabase do proprietário.
- RLS de isolamento de dados entre dois usuários reais (há políticas SQL, mas não auditoria de segurança externa).
- Sincronização real entre dispositivos.
- E-mail SMTP e entrega pelo Formspree real.
- Validação docente da biblioteca, indicadores e metas, e avaliação por preceptor.

**Para o piloto com usuários externos, execute os testes manuais do GUIA-PUBLICACAO-2.3.md antes de convidar novos estudantes.**
