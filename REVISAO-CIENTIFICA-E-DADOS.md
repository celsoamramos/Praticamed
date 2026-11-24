# PráticaMed 2.3 — Auditoria dos dados e revisão científica das curvas

**Data da revisão:** 24 de novembro de 2026.

## O que foi efetivamente validado

- **Validação técnica automatizada:** checagem estrutural de datas impossíveis/futuras, IDs, habilidades, ambiente, participação, resultados incompatíveis e supervisão autodeclarada. Os alertas aparecem para correção manual. Esta checagem NÃO confirma a execução em paciente nem a qualidade técnica.
- **Revisão documental científica:** conferência de achados publicados para as quatro habilidades com evidência específica selecionada (intubação, acesso venoso, sutura simples, manobras de Leopold), mais referências indiretas para exame abdominal e diretrizes de RCP.
- **Ainda não validado:** 45 metas por docentes brasileiros, competência individual, calibração LC-CUSUM, instrumento observacional, precisão dos registros autodeclarados, normas locais.

## Classificação da revisão

- `diretriz`: 1 habilidades.
- `indireta`: 4 habilidades.
- `metodo`: 1 habilidades.
- `quantitativa`: 3 habilidades.
- `sem_curva`: 36 habilidades.

## Evitando falsa precisão

1. Contagem acumulada é **curva de volume**, não de proficiência.
2. Percentual de sucesso aparece apenas se houver ao menos 10 desfechos autodeclarados em ambiente homogêneo (simulação/real), sempre com aviso. Esse 10 é um gatilho visual arbitrário, não um limiar validado.
3. Intubação: pontos de grupo publicados (1/17/23 encontros, taxas 73,6/90,4/93,7%); análise individual exige avaliação padronizada e supervisão. Revisão 2016 estimou número muito maior de intubações para diferentes públicos/desfecho.
4. Sutura: média de 41 ± 15 **pontos simples praticados**, não 41 pacientes ou procedimentos. O botão + não define a unidade ponto, portanto não calcula progresso contra essa média.
5. Acesso venoso: dados retrospectivos autorreferidos 47% na 1ª e 86% na 5ª tentativa; não parametrizar um modelo individual a partir deles.
6. Leopold: estudo piloto com LC-CUSUM; sem parâmetros publicados adaptados e validados para nossa população.
7. Exame físico abdominal: estudo refere-se ao **exame completo**, não estabelece 4 repetições como mínimo para Murphy, Blumberg, Rovsing ou macicez móvel.
8. Diretrizes AHA 2025: feedback e prática distribuída em RCP, não meta de ocorrências reais.

## Fichas revisadas

| ID | Habilidade | Estado da evidência | Meta exploratória antiga (NÃO VALIDADA) | Fonte específica |
|---|---|---|---|---|
| h01 | Teste de Romberg | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h02 | Teste de Lasègue (elevação da perna estendida) | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h03 | Pesquisa do sinal de Babinski | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h04 | Pesquisa de reflexos osteotendíneos | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h05 | Prova dedo-nariz | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h06 | Pesquisa do reflexo fotomotor pupilar | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h07 | Teste de força muscular segmentar | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h08 | Ausculta cardíaca | Sem curva específica verificada | 6–10 práticas distribuídas + 1 avaliação observada | Nenhuma curva específica verificada nesta revisão |
| h09 | Palpação de pulsos periféricos | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h10 | Aferição da pressão arterial | Sem curva específica verificada | 5 mensurações praticadas + 1 checagem observada | Nenhuma curva específica verificada nesta revisão |
| h11 | Estimativa clínica da pressão venosa jugular | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h12 | Ausculta pulmonar | Sem curva específica verificada | 6–10 práticas distribuídas + 1 avaliação observada | Nenhuma curva específica verificada nesta revisão |
| h13 | Percussão torácica | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h14 | Avaliação da expansibilidade torácica | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h15 | Pesquisa do frêmito toracovocal | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h16 | Pesquisa do sinal de Murphy | Evidência indireta | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | [Exame físico abdominal — coorte 2021](https://pubmed.ncbi.nlm.nih.gov/34917424/) |
| h17 | Pesquisa de dor à descompressão abdominal (Blumberg) | Evidência indireta | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | [Exame físico abdominal — coorte 2021](https://pubmed.ncbi.nlm.nih.gov/34917424/) |
| h18 | Pesquisa do sinal de Rovsing | Evidência indireta | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | [Exame físico abdominal — coorte 2021](https://pubmed.ncbi.nlm.nih.gov/34917424/) |
| h19 | Punho-percussão lombar (sinal de Giordano) | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h20 | Pesquisa de macicez móvel à percussão abdominal | Evidência indireta | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | [Exame físico abdominal — coorte 2021](https://pubmed.ncbi.nlm.nih.gov/34917424/) |
| h21 | Teste de Lachman | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h22 | Teste de McMurray | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h23 | Teste de Phalen | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h24 | Pesquisa do sinal de Tinel | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h25 | Teste de Neer | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h26 | Manobras de Leopold | Método de curva estudado | 4–8 ciclos em simulador, com desempenho avaliado individualmente | [Manobras de Leopold com LC-CUSUM — piloto 2015](https://pubmed.ncbi.nlm.nih.gov/26426558/) |
| h27 | Mensuração da altura uterina | Sem curva específica verificada | 5 mensurações praticadas + 1 checagem observada | Nenhuma curva específica verificada nesta revisão |
| h28 | Ausculta dos batimentos cardíacos fetais | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h29 | Exame ginecológico com espéculo | Sem curva específica verificada | 3–5 exames simulados + 1 avaliação estruturada | Nenhuma curva específica verificada nesta revisão |
| h30 | Pesquisa de reflexos primitivos no lactente | Sem curva específica verificada | 4 ciclos de treino em contexto de ensino + 1 demonstração observada | Nenhuma curva específica verificada nesta revisão |
| h31 | Aferição de sinais vitais pediátricos | Sem curva específica verificada | 5 mensurações praticadas + 1 checagem observada | Nenhuma curva específica verificada nesta revisão |
| h32 | Otoscopia | Sem curva específica verificada | 3 sessões de prática em simulador + 1 checklist observado | Nenhuma curva específica verificada nesta revisão |
| h33 | Sutura simples | Quantidade observada em estudo | 30–50 pontos simples em modelo + avaliação OSATS/checklist | [Sutura simples e retenção — estudo 2015](https://pubmed.ncbi.nlm.nih.gov/25785695/) |
| h34 | Retirada de pontos de sutura | Sem curva específica verificada | 3–5 práticas simuladas + 1 execução supervisionada avaliada | Nenhuma curva específica verificada nesta revisão |
| h35 | Curativo de ferida simples | Sem curva específica verificada | 5 curativos simulados/supervisionados + 1 checklist | Nenhuma curva específica verificada nesta revisão |
| h36 | Preparo antisséptico do campo operatório | Sem curva específica verificada | 5 montagens/antissepsias simuladas + 1 checklist | Nenhuma curva específica verificada nesta revisão |
| h37 | Ressuscitação cardiopulmonar (RCP) | Diretriz educacional | 2 sessões práticas de RCP com feedback + reavaliação periódica | [AHA 2025 — educação em ressuscitação](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/resuscitation-education-science) |
| h38 | Ventilação com bolsa-válvula-máscara | Sem curva específica verificada | 3–5 práticas em manequim + 1 avaliação observada | Nenhuma curva específica verificada nesta revisão |
| h39 | Intubação orotraqueal | Curva de grupo publicada | 10–20 tentativas em simulador + 1 avaliação observada | [Intubação em graduandos — estudo 2011](https://pubmed.ncbi.nlm.nih.gov/21892258/), [Intubação — revisão sistemática 2016](https://pubmed.ncbi.nlm.nih.gov/26711127/) |
| h40 | Estabilização cervical em trauma | Sem curva específica verificada | 3–5 cenários em simulador + 1 checklist | Nenhuma curva específica verificada nesta revisão |
| h41 | Acesso venoso periférico | Achado quantitativo observacional | 5 tentativas de acesso supervisionadas quando houver oportunidade apropriada + avaliação técnica | [Acesso venoso periférico — estudo 2016](https://pubmed.ncbi.nlm.nih.gov/27565071/), [Cateterização venosa supervisionada — coorte 2026](https://link.springer.com/article/10.1186/s12909-026-10891-7) |
| h42 | Sondagem vesical | Sem curva específica verificada | 3–5 sondagens em simulador + 1 avaliação estruturada | Nenhuma curva específica verificada nesta revisão |
| h43 | Punção arterial | Sem curva específica verificada | 3–5 punções simuladas + 1 DOPS observado | Nenhuma curva específica verificada nesta revisão |
| h44 | Sondagem nasogástrica | Sem curva específica verificada | 3–5 passagens em simulador + 1 checklist supervisionado | Nenhuma curva específica verificada nesta revisão |
| h45 | Mensuração de glicemia capilar por punção digital | Sem curva específica verificada | 5 mensurações praticadas + 1 checagem observada | Nenhuma curva específica verificada nesta revisão |

## Limitações metodológicas

Esta é uma revisão documental dirigida, não revisão sistemática PRISMA nem painel de consenso. Ausência de curva identificada não prova inexistência na literatura. A escolha de 45 habilidades, metas de treinamento e estatística pessoal requer revisão pelos docentes/preceptores. A métrica “sucesso” não pode ser derivada do simples botão +, e repetições realizadas em ambiente real só são legítimas quando clinicamente indicadas e sob supervisão.

## Segurança e dados

A auditoria acontece no navegador usando registros da própria conta. Não cria nova tabela no Supabase; não modifica registros automaticamente nem expõe dados de outras contas. Resultados são autodeclarados, sem assinatura digital do preceptor. Não insira nomes, prontuários ou dados identificáveis de pacientes.
