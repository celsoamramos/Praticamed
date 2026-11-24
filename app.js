'use strict';
const NAV=[['home','⌂','Visão geral'],['library','▤','Biblioteca'],['register','＋','Registrar prática'],['charts','◫','Minha evolução'],['history','▦','Histórico'],['review','◈','Validar e comparar'],['feedback','✉','Sugestões'],['settings','⚙','Preferências'],['account','♙','Minha conta']];
const KEY='praticamed-prototipo-v1'; // preservado para manter registros anteriores
function read(){let base={period:1,areas:[],records:[],typePreference:'ambos'};try{let p=JSON.parse(localStorage.getItem(KEY));if(p&&Array.isArray(p.records)&&Array.isArray(p.areas))return {...base,...p,typePreference:['ambos','manobra','procedimento'].includes(p.typePreference)?p.typePreference:'ambos',areas:p.areas.filter(a=>AREAS.includes(a))};}catch(e){}return base}
let state=window.PMCloud?.enabled?{period:1,areas:[],records:[],typePreference:'ambos'}:read(); let screen='home',selectedSkill=SKILLS[0].id,term='',areaFilters=[],typeFilter=state.typePreference,chartFilter='all';
let quickTerm='',quickType=state.typePreference,quickContext='nao_informado',lastQuickId=null,pendingQuick=false;
let reviewSelected='h39',reviewFilter='all',reviewSearch='';
let historyTerm='',historyType='ambos',historyContext='all',historyRole='all',historyPeriod='all',historyLimit=25,editRecordId=null,pendingEdit=false;
function save(){if(window.PMCloud?.enabled)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){toast('Não foi possível salvar neste navegador.')}}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function fDate(s){const [y,m,d]=String(s).split('-');return y&&m&&d?`${d}/${m}/${y}`:''}
function tDate(){const n=new Date(), off=n.getTimezoneOffset();return new Date(n.getTime()-off*60000).toISOString().slice(0,10)}
function toast(msg){const x=document.querySelector('#toast');x.textContent=msg;x.classList.add('show');clearTimeout(toast._id);toast._id=setTimeout(()=>x.classList.remove('show'),4000)}
function go(s){screen=s;render();window.scrollTo({top:0,behavior:'smooth'})}
function skill(id){return SKILLS.find(s=>s.id===id)}
function matchesType(s,type=state.typePreference){return type==='ambos'||s.type===type}
function interestScore(s){return s.areas.filter(a=>state.areas.includes(a)).length}
function byInterest(){return [...SKILLS].sort((a,b)=>interestScore(b)-interestScore(a)||a.name.localeCompare(b.name,'pt-BR'))}
function selectedAreas(s){return s.areas.filter(a=>state.areas.includes(a))}
function counts(id){let r=state.records.filter(x=>!id||x.skillId===id);return{all:r.length,performed:r.filter(x=>x.role==='executei').length,observed:r.filter(x=>x.role==='observei').length,assisted:r.filter(x=>x.role==='auxiliei').length,real:r.filter(x=>x.context==='real'&&x.role==='executei').length,sim:r.filter(x=>x.context==='simulacao'&&x.role==='executei').length,unspecified:r.filter(x=>x.role==='executei'&&x.context!=='real'&&x.context!=='simulacao').length,success:r.filter(x=>x.role==='executei'&&x.result==='sucesso').length,assessed:r.filter(x=>x.role==='executei'&&['sucesso','insucesso'].includes(x.result)).length}}
function evidenceCard(item){
 if(!item)return '';
 const e=EVIDENCE[item.id],r=window.PMScience?.items?.[item.id];
 if(!r)return '<div class="info">Revisão bibliográfica indisponível nesta instalação.</div>';
 return `<div class="sciencebox"><div class="tagbar"><span class="chip gray">${esc(r.levelLabel)}</span><span class="chip orange">Meta piloto NÃO oficial</span></div>
 <h3>Referências e proposta educacional</h3><p><b>Treino exploratório:</b> ${esc(r.pilotGoal)}</p>
 <p><b>Resultado efetivamente documentado:</b> ${esc(r.statement)}</p>
 <p><b>População do estudo:</b> ${esc(r.population)}</p>
 <p><b>Desfecho estudado:</b> ${esc(r.endpoint)}</p>
 <p class="tiny"><b>Comparabilidade:</b> ${esc(r.comparison)}</p>
 <div class="sources"><b>Fontes:</b> ${r.sources.length?r.sources.map(x=>`<a target="_blank" rel="noopener noreferrer" href="${esc(x.url)}">${esc(x.title)} ↗</a>`).join(''):'Curva própria não verificada nesta revisão. Veja o relatório metodológico da atualização.'}</div>
 <p class="tiny">Revisão documental de 24/11/2026; pendente de validação por docentes. Meta piloto não equivale a obrigação, proficiência comprovada ou autorização para executar em pacientes.</p>
 <button class="btn secondary slim" type="button" data-review="${esc(item.id)}">Ver validação e curva</button></div>`;
}
function showNav(){for(let id of ['desktop-nav','mobile-nav']){document.getElementById(id).innerHTML=NAV.map(([k,icon,name])=>`<button type="button" class="${screen===k?'active':''}" data-nav="${k}"><span class="ico">${icon}</span> <span>${id==='mobile-nav'?({home:'Início',library:'Biblioteca',register:'Registrar',charts:'Evolução',history:'Histórico',review:'Validação',feedback:'Ideias',settings:'Preferências',account:'Conta'}[k]||name):name}</span></button>`).join('')}}
function head(title,sub){return `<header class="topbar"><div><div class="eyebrow">Portfólio de prática médica • 1º ao 12º período</div><h1>${title}</h1><p class="sub">${sub}</p></div><div class="status"><span class="dot"></span>${state.period}º período</div></header>`}
function metric(icon,n,label){return `<div class="metric"><span class="symbol">${icon}</span><strong>${n}</strong><small>${label}</small></div>`}
function home(){const c=counts();let picks=byInterest().filter(s=>matchesType(s)).slice(0,6);return head('Meu desenvolvimento prático','Manobras e procedimentos: registre experiências e acompanhe sua evolução.')+
 (state.areas.length?'':`<section class="onboard"><h3>Personalize suas prioridades</h3><p class="sub">Escolha suas áreas de interesse. A biblioteca completa permanecerá disponível.</p><button class="btn slim" data-nav="settings" style="margin-top:12px">Escolher áreas de interesse</button></section>`)+
 `<div class="grid">${metric('✓',c.performed,'Execuções registradas')}${metric('◈',c.sim,'Em simulação')}${metric('✚',c.real,'Em pacientes reais')}${metric('◉',c.unspecified,'Ambiente não informado')}</div>
 ${homeExtra()}
 <section class="card section science-summary"><div><span class="eyebrow">Biblioteca científica preliminar</span><h2>Metas factíveis de treino, sem confundir volume com competência</h2><p class="sub">45 habilidades mapeadas · resultados publicados para algumas técnicas; a maioria não tem limiar individual demonstrado. Nenhuma meta numérica é exigência universal de graduação. Confira o estudo e a proposta piloto em cada item.</p></div><button class="btn outline slim" data-nav="review">Consultar evidências</button></section>
 <div class="split section"><section class="card"><div class="card-top"><div><h2>Prioridades personalizadas</h2><p class="sub">${state.typePreference==='ambos'?'Manobras e procedimentos':state.typePreference==='manobra'?'Somente manobras':'Somente procedimentos'} · ${state.areas.length?state.areas.length+' áreas de interesse':'todas as áreas'}. O restante permanece na biblioteca.</p></div><button class="linkbutton" data-nav="library">Biblioteca completa →</button></div>${picks.map(s=>`<div class="miniitem"><div><strong>${esc(s.name)}</strong><small>${esc(s.area)} · ${s.type==='manobra'?'Manobra':'Procedimento'}${interestScore(s)?' · Interesse':''}</small></div><div class="quick-inline"><span class="tiny">${counts(s.id).performed} feitas</span><button class="quick-plus small" type="button" data-quickadd="${s.id}" aria-label="Adicionar uma execução de ${esc(s.name)}" title="Somar 1 execução">+</button></div></div>`).join('')}</section>
 <section class="card"><div class="card-top"><div><h2>Evolução da prática</h2><p class="sub">Execuções acumuladas por data.</p></div><button class="linkbutton" data-nav="charts">Abrir gráfico →</button></div>${drawChart('all',true)}<div class="info"><span class="infodot"></span>Este gráfico representa <b>experiência acumulada</b>, não proficiência comprovada. Os estudos e metas piloto estão nas fichas; modelos de curva só serão implementados após validação metodológica.</div></section></div><section class="card section feedback-invite"><div><span class="eyebrow">Projeto piloto colaborativo</span><h2>Ajude a aprimorar o PráticaMed</h2><p class="sub">Sentiu falta de alguma manobra, procedimento ou funcionalidade? Envie uma sugestão.</p></div><button class="btn secondary" data-nav="feedback">Enviar uma ideia →</button></section><div class="hint">ⓘ Nesta versão, não há tutoriais nem reprodução do UpToDate. Metas piloto são sugestões de treino, não requisitos de graduação.</div>`}
function homeExtra(){
 const done=state.records.filter(r=>r.role==='executei');
 const last30=done.filter(r=>r.date>=daysAgoLocal(29));
 const unique=new Set(done.map(r=>r.skillId)).size;
 const recent=[...state.records].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).slice(0,4);
 return `<section class="card section home-extra"><div class="card-top"><div><span class="eyebrow">Visão rápida do piloto</span><h2>Seu resumo de atividades</h2><p class="sub">Contagem autodeclarada — não corresponde a competência certificada.</p></div><button class="btn outline slim" data-nav="history">Abrir histórico</button></div>
 <div class="home-chips"><span class="home-chip"><b>${last30.length}</b> execuções em 30 dias</span><span class="home-chip"><b>${unique}</b> habilidades diferentes</span><span class="home-chip"><b>${state.records.length}</b> lançamentos no histórico</span></div>
 <div class="recent-grid">${recent.length?recent.map(r=>`<div class="recent-entry"><div><strong>${esc(skill(r.skillId)?.name||'Habilidade indisponível')}</strong><small>${fDate(r.date)} · ${r.context==='simulacao'?'Simulação':r.context==='real'?'Paciente real (autodeclarado)':'Ambiente não informado'}</small></div><span class="chip gray">${r.role==='executei'?'Execução':r.role==='observei'?'Observação':'Auxílio'}</span></div>`).join(''):'<div class="empty">Seu histórico começará após o primeiro registro.</div>'}</div></section>`;
}
function library(){
 const results=byInterest().filter(s=>s.name.toLocaleLowerCase('pt-BR').includes(term.toLocaleLowerCase('pt-BR'))&&(!areaFilters.length||s.areas.some(a=>areaFilters.includes(a)))&&matchesType(s,typeFilter));
 const s=results.find(x=>x.id===selectedSkill)||results[0];if(s)selectedSkill=s.id;
 const c=s?counts(s.id):null;
 return head('Biblioteca de habilidades','45 itens com triagem bibliográfica e propostas de treino; validação por docentes ainda pendente.')+
 `<section class="filters card"><div class="filter-heading"><div><h2>Filtrar habilidades</h2><p class="sub">Escolha o tipo e uma ou várias áreas. Os filtros são reversíveis.</p></div><button class="btn outline slim" id="resetfilters">Mostrar tudo</button></div>
 <div class="filtertype"><label for="type-filter">Quais atividades deseja visualizar?</label><select id="type-filter" aria-label="Tipo de atividade"><option value="ambos" ${typeFilter==='ambos'?'selected':''}>Ambos: manobras e procedimentos</option><option value="manobra" ${typeFilter==='manobra'?'selected':''}>Somente manobras</option><option value="procedimento" ${typeFilter==='procedimento'?'selected':''}>Somente procedimentos</option></select></div>
 <div class="filter-heading" style="margin-top:15px"><div><strong style="font-size:13px">Áreas da biblioteca — seleção múltipla</strong><p class="tiny">Sem áreas marcadas = mostrar todas.</p></div><button class="linkbutton" id="clearareas" ${!areaFilters.length?'disabled':''}>Limpar seleção</button></div>
 <div class="checkbox-group scrollchecks">${AREAS.map(a=>`<label class="checkchip"><input type="checkbox" data-filterarea="true" value="${esc(a)}" ${areaFilters.includes(a)?'checked':''}>${esc(a)}</label>`).join('')}</div>
 <div class="filter-bottom"><span class="tiny">Interesses salvos: <strong>${state.areas.length?state.areas.map(esc).join(', '):'Nenhum selecionado'}</strong></span><button class="linkbutton" data-nav="settings">Editar meus interesses</button></div></section>
 <div class="searchrow"><input class="field searchbox" id="search" placeholder="Buscar manobra ou procedimento..." value="${esc(term)}" aria-label="Buscar habilidades"></div>
 <div class="library-layout"><section class="card"><div class="card-top"><div><h2>Habilidades disponíveis</h2><p class="sub">${results.length} de ${SKILLS.length} itens · ${typeFilter==='ambos'?'Ambos':typeFilter==='manobra'?'Manobras':'Procedimentos'}</p></div><span class="chip">Acervo revisado</span></div><div class="catalog" id="catalog">${results.length?results.map(x=>`<div class="catalogrow ${selectedSkill===x.id?'selected':''}" data-skill="${x.id}" role="button" tabindex="0"><div><strong>${esc(x.name)}</strong><small>${esc(x.area)}${interestScore(x)?' · ★ Prioritário':''}</small></div><span class="chip ${x.type==='manobra'?'gray':''}">${x.type==='manobra'?'Manobra':'Procedimento'}</span></div>`).join(''):`<div class="empty">Nenhuma habilidade encontrada com esses filtros.<div style="margin-top:12px"><button class="btn outline slim" id="resetfilters">Limpar filtros</button></div></div>`}</div></section>
 ${s?`<section class="card details"><span class="eyebrow">Detalhe da habilidade</span><h2 class="details-title">${esc(s.name)}</h2><div class="tagbar"><span class="chip">${esc(s.area)}</span><span class="chip gray">${s.type==='manobra'?'Manobra':'Procedimento'}</span>${selectedAreas(s).length?'<span class="chip orange">★ Relacionada aos interesses</span>':''}</div><div class="statrow"><div><b>${c.performed}</b><span>Execuções</span></div><div><b>${c.sim}</b><span>Em simulação</span></div><div><b>${c.real}</b><span>Em paciente real</span></div></div><div class="info"><b>Indicador previsto:</b> ${s.metric==='sucesso'?'Sucesso/insucesso técnico por tentativa, com contexto e supervisão.':'Execuções e avaliação da técnica, quando observada.'}<br><b>Evidência científica:</b> exibida separadamente dos seus registros, quando publicada.<br><b>Status:</b> auditoria documental preliminar; revisão docente e validação de preceptor pendentes.<br><b>Tutoriais:</b> não incluídos no MVP.</div>${evidenceCard(s)}<button class="btn block" data-quickadd="${s.id}">＋ Somar 1 execução</button><button class="btn outline block" style="margin-top:9px" data-chart="${s.id}">Visualizar evolução</button></section>`:`<section class="card details"><div class="empty">Ajuste os filtros para visualizar um item da biblioteca.</div></section>`}</div>`
}
function register(){
 const results=byInterest().filter(s=>matchesType(s,quickType)&&s.name.toLocaleLowerCase('pt-BR').includes(quickTerm.toLocaleLowerCase('pt-BR')));
 return head('Registrar prática','Encontre a manobra ou procedimento e toque em + para acrescentar uma execução.')+
 `<section class="quick-banner"><div class="quick-banner-icon">＋</div><div><h2>Um toque = uma execução autodeclarada</h2><p>Sem formulário. Cada toque salva <b>1 execução autodeclarada</b> na data de hoje. Você pode desfazer um toque acidental.</p></div><span class="chip">${counts().performed} registradas</span></section>
 <section class="card quick-panel"><div class="quick-controls">
 <div class="formfield"><label for="quick-search">Buscar manobra ou procedimento</label><input class="field" id="quick-search" placeholder="Ex.: Romberg, sutura, intubação..." value="${esc(quickTerm)}" autocomplete="off"></div>
 <div class="formfield"><label for="quick-type">Mostrar</label><select id="quick-type"><option value="ambos" ${quickType==='ambos'?'selected':''}>Ambos</option><option value="manobra" ${quickType==='manobra'?'selected':''}>Manobras</option><option value="procedimento" ${quickType==='procedimento'?'selected':''}>Procedimentos</option></select></div>
 <div class="formfield"><label for="quick-context">Ambiente (opcional)</label><select id="quick-context"><option value="nao_informado" ${quickContext==='nao_informado'?'selected':''}>Não informar</option><option value="simulacao" ${quickContext==='simulacao'?'selected':''}>Simulação</option><option value="real" ${quickContext==='real'?'selected':''}>Paciente real supervisionado</option></select></div>
 </div><p class="tiny quick-note">Escolha o ambiente uma vez para os próximos toques, se quiser. "Paciente real supervisionado" declara que houve supervisão. Sem escolha, o ambiente fica como "não informado". Nenhum toque atribui sucesso, proficiência ou validação do preceptor.</p>
 <div class="quick-list-head"><h2>Minhas habilidades</h2><span class="tiny">${results.length} itens · toque em + para somar</span></div>
 <div class="quick-list">${results.length?results.map(s=>`<div class="quick-row"><div class="quick-name"><strong>${esc(s.name)}</strong><small>${esc(s.area)} · ${s.type==='manobra'?'Manobra':'Procedimento'}${interestScore(s)?' · ★ Área de interesse':''}</small></div><div class="quick-action"><span class="quick-count" aria-label="${counts(s.id).performed} execuções registradas">${counts(s.id).performed}</span><button class="quick-plus" type="button" data-quickadd="${s.id}" aria-label="Adicionar uma execução de ${esc(s.name)}" title="Somar 1 execução de ${esc(s.name)}">+</button></div></div>`).join(''):`<div class="empty">Nenhuma habilidade encontrada. Limpe a busca ou altere o filtro.</div>`}</div>
 </section><p class="hint">ⓘ ${window.PMCloud?.enabled?'Registros vinculados à sua conta, após confirmação no servidor.':'Registros somente neste navegador.'} Não registre dados de pacientes. Contagem não equivale a competência técnica.</p>`;
}
async function quickAdd(id){
 const s=skill(id);if(!s||pendingQuick)return;
 const recordId=(typeof crypto!=='undefined'&&crypto.randomUUID)?crypto.randomUUID():'r'+Date.now()+'-'+Math.random().toString(36).slice(2);
 const context=quickContext;
 const rec={id:recordId,skillId:id,date:tDate(),context,role:'executei',result:'na',supervision:context==='real'?'sim':'na'};
 pendingQuick=true;
 try{
  if(window.PMCloud?.enabled)await window.PMCloud.addRecord(rec);
  state.records.push(rec);lastQuickId=recordId;selectedSkill=id;save();render();
  const x=document.querySelector('#toast');if(x){x.innerHTML=`<span>+1 em <b>${esc(s.name)}</b>. ${window.PMCloud?.enabled?'Salvo na sua conta.':'Registrado neste navegador.'}</span> <button type="button" class="toast-undo" data-undo-quick="${esc(recordId)}">Desfazer</button>`;x.classList.add('show');clearTimeout(toast._id);toast._id=setTimeout(()=>x.classList.remove('show'),6500)}
 }catch(err){toast('Não foi possível salvar a prática: '+String(err.message).slice(0,180))}
 finally{pendingQuick=false;}
}

function drawChart(filter='all',small=false){const records=state.records.filter(r=>r.role==='executei'&&(filter==='all'||r.skillId===filter)&&(!window.PMQuality||window.PMQuality.assess(r,SKILLS).usableForVolume)).sort((a,b)=>a.date.localeCompare(b.date));if(!records.length)return `<div class="empty" style="padding:${small?'42px':'66px'} 20px">Ainda não existem execuções registradas.<br>Adicione uma prática para iniciar seu gráfico.</div>`;const byDay=new Map();for(const r of records){let v=byDay.get(r.date)||{date:r.date,sim:0,real:0,unknown:0};const key=r.context==='real'?'real':r.context==='simulacao'?'sim':'unknown';v[key]++;byDay.set(r.date,v)}const days=[...byDay.values()].sort((a,b)=>a.date.localeCompare(b.date));let cumSim=0,cumReal=0,cumUnknown=0;const values=days.map(d=>({date:d.date,sim:cumSim+=d.sim,real:cumReal+=d.real,unknown:cumUnknown+=d.unknown}));const w=640,h=260,l=46,right=17,top=18,bottom=40;let max=Math.max(2,...values.map(v=>v.sim+v.real+v.unknown));let x=i=>l+(w-l-right)*(values.length===1?.5:i/(values.length-1));let y=n=>top+(h-top-bottom)*(1-n/max);let line=key=>values.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(v[key]).toFixed(1)).join(' ');let total=values.map(v=>({...v,total:v.sim+v.real+v.unknown}));let totalLine=total.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(v.total).toFixed(1)).join(' ');const ticks=[0,.25,.5,.75,1].map(t=>{let yy=y(max*t).toFixed(1);return `<line x1="${l}" y1="${yy}" x2="${w-right}" y2="${yy}" stroke="#e3ecfa"/><text x="${l-9}" y="${+yy+4}" font-size="11" fill="#7588a2" text-anchor="end">${Math.round(max*t)}</text>`}).join('');return `<div class="chartbox"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Gráfico de execuções acumuladas entre ${fDate(days[0].date)} e ${fDate(days[days.length-1].date)}; total de ${records.length}"><g>${ticks}</g><path d="${totalLine}" stroke="#1769c2" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" fill="none"/><path d="${line('real')}" stroke="#6d9fde" stroke-width="2.5" stroke-linejoin="round" fill="none"/><circle cx="${x(values.length-1)}" cy="${y(total.at(-1).total)}" r="5" fill="#1769c2"/><text x="${l}" y="${h-13}" font-size="11" fill="#778ba4">${fDate(days[0].date)}</text><text x="${w-right}" y="${h-13}" font-size="11" text-anchor="end" fill="#778ba4">${fDate(days[days.length-1].date)}</text></svg><div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:11px;color:#607b99"><span><b style="color:#1769c2">━</b> Total executado</span><span><b style="color:#6d9fde">━</b> Paciente real</span><span>Sem ambiente informado: ${records.filter(r=>r.context!=='real'&&r.context!=='simulacao').length}</span></div></div>`}
function daysAgoLocal(days){
 const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-days);
 return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}
function evolutionOverview(filter='all'){
 const valid=state.records.filter(r=>r.role==='executei'&&(filter==='all'||r.skillId===filter)&&skill(r.skillId));
 const last7=valid.filter(r=>r.date>=daysAgoLocal(6));
 const last30=valid.filter(r=>r.date>=daysAgoLocal(29));
 const unique=new Set(valid.map(r=>r.skillId)).size;
 const sim=valid.filter(r=>r.context==='simulacao').length;
 const real=valid.filter(r=>r.context==='real').length;
 const unspecified=valid.length-sim-real;
 const items=[{label:'Simulação',n:sim,kind:'sim'},{label:'Paciente real (autodeclarado)',n:real,kind:'real'},{label:'Não informado',n:unspecified,kind:'other'}];
 const bars=items.map(item=>`<div class="insight-bar-row"><span>${item.label}</span><div class="insight-track" role="img" aria-label="${item.n} execuções: ${item.label}"><div class="insight-fill ${item.kind}" style="width:${valid.length?item.n/valid.length*100:0}%"></div></div><b>${item.n}</b></div>`).join('');
 const byArea=new Map();
 for(const r of valid){const k=skill(r.skillId).area;byArea.set(k,(byArea.get(k)||0)+1);}
 const topAreas=[...byArea.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'pt-BR')).slice(0,5);
 const areaBars=topAreas.length?topAreas.map(([name,count])=>`<div class="insight-bar-row"><span>${esc(name)}</span><div class="insight-track" role="img" aria-label="${count} execuções em ${esc(name)}"><div class="insight-fill area" style="width:${count/topAreas[0][1]*100}%"></div></div><b>${count}</b></div>`).join(''):'<p class="tiny">Registre uma prática para visualizar as áreas mais praticadas.</p>';
 return `<section class="card section"><div class="card-top"><div><h2>Resumo da minha prática</h2><p class="sub">Indicadores calculados somente com suas execuções registradas.</p></div></div>
 <div class="insight-metrics"><div><strong>${last7.length}</strong><small>Últimos 7 dias</small></div><div><strong>${last30.length}</strong><small>Últimos 30 dias</small></div><div><strong>${unique}</strong><small>Habilidades diferentes</small></div><div><strong>${valid.length}</strong><small>Execuções acumuladas</small></div></div>
 <div class="insight-columns"><div><h3>Por ambiente</h3>${bars}</div><div><h3>Áreas com mais registros</h3>${areaBars}</div></div>
 <p class="tiny">Os dados são autodeclarados. Contagens e distribuição de experiências não demonstram proficiência, qualidade técnica ou autorização para atuação independente.</p></section>`;
}
function charts(){let c=counts(chartFilter==='all'?null:chartFilter);let rel=state.records.filter(r=>r.role==='executei'&&(chartFilter==='all'||r.skillId===chartFilter));return head('Minha evolução','Histórico quantitativo das execuções documentadas, com estudos documentados nas fichas, sem metas oficiais presumidas.')+`<section class="card"><div class="card-top"><div><h2>Curva de experiência</h2><p class="sub">Soma acumulada de execuções registradas, por data.</p></div><select style="max-width:260px" id="chart-filter"><option value="all">Todas as habilidades</option>${SKILLS.map(s=>`<option value="${s.id}" ${chartFilter===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>${drawChart(chartFilter)}${chartFilter==='all'?'':evidenceCard(skill(chartFilter))}<div class="summary"><div><strong>${c.performed}</strong><small>Execuções</small></div><div><strong>${c.observed}</strong><small>Observações</small></div><div><strong>${c.assisted}</strong><small>Auxílios</small></div>${c.assessed&&chartFilter!=='all'&&skill(chartFilter)?.metric==='sucesso'?`<div><strong>${Math.round(c.success/c.assessed*100)}%</strong><small>Sucesso técnico em ${c.assessed} execuções avaliadas</small></div>`:''}</div><div class="info"><span class="infodot"></span><b>Traçado pessoal = volume de práticas autodeclaradas.</b> Os dados publicados de pesquisa aparecem em painel separado para não confundir quantidade com sucesso clínico.</div></section>${chartFilter==='all'?'':individualPerformance(chartFilter)+scientificPanel(chartFilter)}${evolutionOverview(chartFilter)}
 <section class="card section"><div class="card-top"><div><h2>Histórico completo</h2><p class="sub">Consulte e corrija datas e ambientes das práticas, ou exporte os registros filtrados.</p></div><button class="btn secondary slim" data-nav="history">Abrir Histórico</button></div></section>`}


function studyPoints(r){
 if(!r?.points?.length)return '';
 const arr=r.points, maxX=Math.max(5,...arr.map(p=>p.x)), w=560,h=220,x=n=>42+(w-60)*(n/maxX),y=n=>172-(n/100)*140;
 const grid=[0,25,50,75,100].map(n=>`<line x1="42" y1="${y(n)}" x2="${w-14}" y2="${y(n)}" stroke="#dce8f6"/><text x="34" y="${y(n)+4}" text-anchor="end" fill="#607994" font-size="11">${n}%</text>`).join('');
 return `<div class="study-graph"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Pontos publicados no estudo: ${arr.map(p=>'tentativa ou encontro '+p.x+': '+p.y+'%').join('; ')}"><g>${grid}</g>${arr.map(p=>`<circle cx="${x(p.x)}" cy="${y(p.y)}" r="6" fill="#1769c2"/><text x="${x(p.x)}" y="${y(p.y)-13}" text-anchor="middle" font-size="12" font-weight="700" fill="#123b70">${String(p.y).replace('.',',')}%</text><text x="${x(p.x)}" y="191" text-anchor="middle" fill="#5b7696" font-size="11">${p.x}</text>`).join('')}<text x="${w/2}" y="213" fill="#5b7696" font-size="11" text-anchor="middle">Ordem da experiência (grupo estudado)</text></svg></div><p class="tiny">Somente pontos publicados — não há interpolação, metas individuais nem ajuste ao seu histórico.</p>`;
}
function scientificPanel(id){
 const sk=skill(id),r=window.PMScience?.items?.[id];if(!sk||!r)return '';
 return `<section class="card section"><div class="card-top"><div><span class="eyebrow">Revisão científica · 24/11/2026</span><h2>${esc(sk.name)}</h2><p class="sub">${esc(r.levelLabel)} · avaliação docente pendente</p></div><button class="btn outline slim" type="button" data-review="${esc(id)}">Revisão completa</button></div>
 ${studyPoints(r)}<p>${esc(r.statement)}</p><p class="tiny"><b>Contexto:</b> ${esc(r.population)}. <b>Desfecho:</b> ${esc(r.endpoint)}.</p>
 <p class="tiny"><b>Não comparar diretamente:</b> ${esc(r.comparison)}</p><div class="sources">${r.sources.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)} ↗</a>`).join('')||'<span class="tiny">Sem estudo específico confirmado para esta habilidade.</span>'}</div></section>`;
}
function individualPerformance(id){
 const sk=skill(id), q=window.PMQuality;if(!sk||!q)return '';
 const audit=q.audit(state.records,SKILLS);
 const records=audit.items.filter(a=>a.record.skillId===id&&a.usableForOutcome).map(a=>a.record);
 const groups=[{v:'simulacao',label:'Simulação'},{v:'real',label:'Paciente real'}];
 const summaries=groups.map(g=>{const arr=records.filter(r=>r.context===g.v);const good=arr.filter(r=>r.result==='sucesso').length;
 const interval=q.wilson(good,arr.length);return `<div class="performance-tile"><strong>${g.label}</strong><p class="tiny">${arr.length} execuções com resultado registrado</p>${arr.length>=10&&sk.metric==='sucesso'?`<b>${interval.rate.toFixed(1).replace('.',',')}% sucesso autorrelatado</b><small>Intervalo de Wilson 95%: ${interval.lower.toFixed(0)}–${interval.upper.toFixed(0)}% (somente incerteza amostral)</small>`:'<span class="chip gray">Sem dados suficientes para proporção</span>'}</div>`;}).join('');
 return `<section class="card section"><h2>Desfechos informados pelo estudante</h2><p class="sub">Relato individual, sem validação clínica independente. Exigimos ao menos 10 execuções com desfecho conhecido por ambiente antes de exibir uma proporção exploratória; esse limiar é uma regra de apresentação, não critério de proficiência.</p><div class="performance-grid">${summaries}</div><div class="info">O botão + não atribui sucesso. Se você quiser informar um resultado autodeclarado, abra Histórico → Editar. Desfechos de simulação e paciente real não são somados. Ausência de avaliação por preceptor impede interpretar estes percentuais como competência.</div></section>`;
}
function review(){
 const entries=SKILLS.filter(s=>(reviewFilter==='all'||window.PMScience.items[s.id].level===reviewFilter)&&`${s.name} ${s.area}`.toLocaleLowerCase('pt-BR').includes(reviewSearch.toLocaleLowerCase('pt-BR')));
 const r=window.PMScience.items[reviewSelected],s=skill(reviewSelected),src=window.PMScience.sources;
 const tallies=Object.values(window.PMScience.items),n=x=>tallies.filter(a=>a.level===x).length;
 return head('Validação e curvas','Revisão científica das 45 habilidades e auditoria dos registros. Metas piloto não são números obrigatórios para a formatura.')+
 `<div class="grid review-metrics">${metric('▤',SKILLS.length,'Habilidades revisadas')}${metric('◈',n('quantitativa'),'Estudos quantitativos específicos')}${metric('⌁',n('metodo'),'Estudo de método de curva')}${metric('◌',n('sem_curva'),'Sem curva própria verificada')}</div>
 <div class="info"><b>Validação científica ≠ validação de registro.</b> Publicações fornecem dados de grupos; seus registros são autodeclarados. Nenhuma meta foi oficialmente homologada por uma faculdade ou preceptor. A seção permite consultar pontos de estudos, mas não declara o estudante apto ou inapto.</div>
 <div class="review-layout section"><section class="card"><h2>Escolha uma habilidade</h2><div class="searchrow"><input class="field searchbox" id="review-search" type="search" placeholder="Buscar entre 45 habilidades" value="${esc(reviewSearch)}"><select id="review-filter" class="selectbox"><option value="all">Todas as evidências</option><option value="quantitativa" ${reviewFilter==='quantitativa'?'selected':''}>Quantitativa</option><option value="metodo" ${reviewFilter==='metodo'?'selected':''}>Método estudado</option><option value="indireta" ${reviewFilter==='indireta'?'selected':''}>Indireta</option><option value="diretriz" ${reviewFilter==='diretriz'?'selected':''}>Diretriz</option><option value="sem_curva" ${reviewFilter==='sem_curva'?'selected':''}>Sem curva própria</option></select></div>
 <div class="review-list">${entries.map(i=>`<button type="button" class="review-option ${reviewSelected===i.id?'active':''}" data-review="${i.id}"><strong>${esc(i.name)}</strong><span>${esc(window.PMScience.items[i.id].levelLabel)}</span></button>`).join('')||'<p class="tiny">Nenhuma habilidade atende ao filtro.</p>'}</div></section>
 <section class="card review-detail"><span class="eyebrow">Estudo da habilidade</span><h2>${esc(s.name)}</h2><div class="tagbar"><span class="chip">${esc(s.area)}</span><span class="chip orange">${esc(r.levelLabel)}</span></div>
 ${studyPoints(r)}<p>${esc(r.statement)}</p><div class="study-facts"><div><b>População/ambiente</b><span>${esc(r.population)}</span></div><div><b>Desfecho</b><span>${esc(r.endpoint)}</span></div><div><b>Meta piloto (não validada)</b><span>${esc(r.pilotGoal)}</span></div></div>
 <div class="info"><b>Por que não é uma meta oficial?</b> ${esc(r.comparison)} A demonstração de competência depende da avaliação técnica por profissionais habilitados e de requisitos locais.</div>
 <div class="sources">${r.sources.map(v=>`<a target="_blank" rel="noopener noreferrer" href="${esc(v.url)}">${esc(v.title)} ↗</a>`).join('')||'<span class="tiny">Referência específica de curva não identificada nesta revisão.</span>'}</div><div class="form-actions"><button class="btn secondary" type="button" data-chart="${esc(s.id)}">Meu volume de prática</button></div></section></div>
 ${qualityDashboard()}<section class="card section"><h2>Critérios usados nesta versão</h2><p class="sub">Literatura científica consultada até 24/11/2026; estudos de grupos só representam o resultado efetivamente publicado. Não extrapolamos um estudo de exame abdominal completo para cada sinal; nem igualamos ponto simples, tentativa, sessão, procedimento e paciente.</p>
 <p class="tiny">A curva individual CUSUM/LC-CUSUM não é calculada nesta versão: seriam necessárias definições específicas de sucesso/erro, sequência de tentativas padronizadas, parâmetros estatísticos e validação de preceptor. O contador + não produz esses dados.</p>
 <div class="sources"><a href="${esc(src.dcn.url)}" target="_blank" rel="noopener noreferrer">DCNs 2025 (referência normativa geral) ↗</a><a href="${esc(src.aha2025.url)}" target="_blank" rel="noopener noreferrer">AHA 2025 (ensino da RCP) ↗</a></div></section>`;
}
function qualityDashboard(){
 const q=window.PMQuality?.audit(state.records,SKILLS);
 if(!q)return '';
 const flagged=q.flagged.slice(0,30);
 return `<section class="card section" id="audit-section"><div class="card-top"><div><span class="eyebrow">Auditoria de qualidade dos dados</span><h2>Seus registros: consistência e completude</h2><p class="sub">Checagem automática; não há verificação de execução clínica por preceptor.</p></div><button class="btn outline slim" type="button" data-nav="history">Abrir histórico</button></div>
 <div class="audit-metrics"><div><strong>${q.total}</strong><small>Registros</small></div><div><strong>${q.ok}</strong><small>Sem alerta estrutural</small></div><div><strong>${q.attention}</strong><small>A conferir</small></div><div><strong>${q.invalid}</strong><small>Incompatíveis</small></div><div><strong>${q.usableOutcome}</strong><small>Desfechos utilizáveis*</small></div></div>
 <p class="tiny">*Desfecho utilizável para estatística descritiva: execução autodeclarada, contexto conhecido, resultado sucesso/insucesso e registro consistente; não significa resultado verificado.</p>
 ${flagged.length?`<div class="audit-list">${flagged.map(x=>`<div class="audit-row"><div><b>${esc(skill(x.record.skillId)?.name||'Habilidade desconhecida')} — ${esc(x.record.date||'Sem data')}</b><small>${[...x.errors,...x.warnings].map(esc).join('; ')}</small></div>${x.record?.id?`<button class="btn outline slim" data-edit="${esc(x.record.id)}" type="button">Corrigir</button>`:''}</div>`).join('')}</div>${q.flagged.length>30?`<p class="tiny">Exibindo os primeiros 30 alertas de ${q.flagged.length}.</p>`:''}`:'<div class="info">Nenhuma inconsistência ou ausência de ambiente foi detectada nesta verificação automática. Os registros continuam autodeclarados.</div>'}
 <p class="tiny">Vários registros no mesmo dia podem ser legítimos: não são tratados automaticamente como duplicatas. Dados originais nunca são alterados ou apagados pela auditoria.</p></section>`;
}

function historyFiltered(){
 const q=historyTerm.trim().toLocaleLowerCase('pt-BR');
 const minDate=historyPeriod==='all'?'':daysAgoLocal(Number(historyPeriod)-1);
 return state.records.filter(r=>{
   const s=skill(r.skillId); if(!s)return false;
   if(q&&!`${s.name} ${s.area}`.toLocaleLowerCase('pt-BR').includes(q))return false;
   if(historyType!=='ambos'&&s.type!==historyType)return false;
   if(historyContext!=='all'&&r.context!==historyContext)return false;
   if(historyRole!=='all'&&r.role!==historyRole)return false;
   if(minDate&&r.date<minDate)return false;
   return true;
 }).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
}
function historyEditor(){
 if(!editRecordId)return '';
 const r=state.records.find(x=>x.id===editRecordId);
 if(!r)return '';
 return `<div class="modal-backdrop"><section class="edit-dialog card" role="dialog" aria-modal="true" aria-labelledby="edit-title">
 <div class="card-top"><div><span class="eyebrow">Corrigir lançamento</span><h2 id="edit-title">${esc(skill(r.skillId)?.name||'Registro')}</h2></div><button class="icon-close" type="button" data-cancel-edit aria-label="Fechar edição">✕</button></div>
 <form id="edit-record-form"><p class="sub">Você pode corrigir a data, o ambiente e a participação. Informar um resultado é opcional e permanece autodeclarado. Para modificar a habilidade, exclua o registro e faça outro.</p>
 <div class="formfield" style="margin-top:16px"><label for="edit-date">Data da prática</label><input class="field" type="date" id="edit-date" min="2000-01-01" max="${tDate()}" value="${esc(r.date)}" required></div>
 <div class="formfield" style="margin-top:14px"><label for="edit-context">Ambiente</label><select id="edit-context" class="field"><option value="nao_informado" ${r.context==='nao_informado'?'selected':''}>Não informado</option><option value="simulacao" ${r.context==='simulacao'?'selected':''}>Simulação</option><option value="real" ${r.context==='real'?'selected':''}>Paciente real supervisionado</option></select></div>
 <div class="formfield" style="margin-top:14px"><label for="edit-role">Participação</label><select id="edit-role" class="field"><option value="executei" ${r.role==='executei'?'selected':''}>Executei</option><option value="observei" ${r.role==='observei'?'selected':''}>Observei</option><option value="auxiliei" ${r.role==='auxiliei'?'selected':''}>Auxiliei</option></select></div>
 <div class="formfield" style="margin-top:14px"><label for="edit-result">Resultado autodeclarado (opcional)</label><select id="edit-result" class="field"><option value="na" ${r.result==='na'?'selected':''}>Não avaliado / não informar</option>${skill(r.skillId)?.metric==='sucesso'?`<option value="sucesso" ${r.result==='sucesso'?'selected':''}>Sucesso (autodeclarado)</option><option value="insucesso" ${r.result==='insucesso'?'selected':''}>Insucesso (autodeclarado)</option>`:`<option value="adequada" ${r.result==='adequada'?'selected':''}>Técnica adequada (autoavaliação)</option><option value="melhorar" ${r.result==='melhorar'?'selected':''}>Preciso melhorar (autoavaliação)</option>`}</select></div>
 <p class="tiny">Somente execuções podem ter resultado. Esta informação não é uma validação por professor nem substitui uma avaliação prática observada.</p>
 <p class="tiny" style="margin-top:14px">"Paciente real supervisionado" é uma autodeclaração, não uma validação por preceptor. Nunca registre identificadores do paciente.</p>
 <div class="form-actions"><button class="btn" type="submit" ${pendingEdit?'disabled':''}>Salvar correção</button><button class="btn outline" type="button" data-cancel-edit>Cancelar</button></div>
 </form></section></div>`;
}
function history(){
 const all=historyFiltered(),shown=all.slice(0,historyLimit);
 const done=all.filter(r=>r.role==='executei');
 const unique=new Set(all.map(r=>r.skillId)).size;
 const byContext=(n)=>done.filter(r=>r.context===n).length;
 return head('Histórico de práticas','Pesquise, filtre e corrija seus lançamentos sem abrir um formulário para cada prática.')+
 `<section class="card history-screen"><div class="card-top"><div><h2>Meus registros</h2><p class="sub">Os filtros afetam a lista e o CSV exportado.</p></div><button class="btn secondary slim" type="button" id="history-export">Exportar seleção (CSV)</button></div>
 <div class="history-filters">
 <div class="formfield search-area"><label for="history-search">Buscar habilidade ou área</label><input id="history-search" class="field" type="search" placeholder="Ex.: sutura, neurologia..." value="${esc(historyTerm)}"></div>
 <div class="formfield"><label for="history-period">Período</label><select id="history-period"><option value="all" ${historyPeriod==='all'?'selected':''}>Todo o histórico</option>${[7,30,90].map(n=>`<option value="${n}" ${historyPeriod===String(n)?'selected':''}>Últimos ${n} dias</option>`).join('')}</select></div>
 <div class="formfield"><label for="history-type">Tipo</label><select id="history-type"><option value="ambos" ${historyType==='ambos'?'selected':''}>Manobras e procedimentos</option><option value="manobra" ${historyType==='manobra'?'selected':''}>Manobras</option><option value="procedimento" ${historyType==='procedimento'?'selected':''}>Procedimentos</option></select></div>
 <div class="formfield"><label for="history-context">Ambiente</label><select id="history-context"><option value="all" ${historyContext==='all'?'selected':''}>Todos</option><option value="simulacao" ${historyContext==='simulacao'?'selected':''}>Simulação</option><option value="real" ${historyContext==='real'?'selected':''}>Paciente real</option><option value="nao_informado" ${historyContext==='nao_informado'?'selected':''}>Não informado</option></select></div>
 <div class="formfield"><label for="history-role">Participação</label><select id="history-role"><option value="all" ${historyRole==='all'?'selected':''}>Todas</option><option value="executei" ${historyRole==='executei'?'selected':''}>Execução</option><option value="observei" ${historyRole==='observei'?'selected':''}>Observação</option><option value="auxiliei" ${historyRole==='auxiliei'?'selected':''}>Auxílio</option></select></div>
 </div>
 <div class="history-toolbar"><span class="tiny">${all.length} registros encontrados</span><button class="linkbutton" type="button" id="history-reset">Limpar filtros</button></div>
 <div class="history-statgrid"><div><strong>${done.length}</strong><small>Execuções filtradas</small></div><div><strong>${unique}</strong><small>Habilidades diferentes</small></div><div><strong>${byContext('simulacao')}</strong><small>Em simulação</small></div><div><strong>${byContext('real')}</strong><small>Em pacientes reais*</small></div></div>
 <div class="history-rows">${shown.length?shown.map(r=>`<div class="history-row"><div class="history-row-body"><strong>${esc(skill(r.skillId)?.name||'Habilidade indisponível')}</strong><small>${fDate(r.date)} · ${esc(skill(r.skillId)?.area||'')} · ${r.context==='simulacao'?'Simulação':r.context==='real'?'Paciente real*':'Ambiente não informado'}</small><span class="chip gray">${r.role==='executei'?'Execução':r.role==='observei'?'Observação':'Auxílio'} · Autodeclarado</span></div><div class="history-actions"><button class="btn outline slim" type="button" data-edit="${esc(r.id)}">Editar</button><button class="btn outline slim delete-button" type="button" data-del="${esc(r.id)}">Excluir</button></div></div>`).join(''):'<div class="empty">Nenhuma prática encontrada para os filtros selecionados.</div>'}</div>
 ${all.length>shown.length?`<div class="history-more"><button class="btn secondary" id="history-more" type="button">Mostrar mais registros (${all.length-shown.length} restantes)</button></div>`:''}
 <div class="info">*Paciente real: registro autodeclarado. O PráticaMed não verifica a identidade do preceptor, a qualidade técnica ou a competência do estudante. Não registre informações de pacientes.</div>
 </section>${historyEditor()}`;
}

function settings(){return head('Minhas preferências','Escolha o tipo de atividade e selecione quantas áreas desejar; tudo pode ser alterado depois.')+
 `<section class="card" style="max-width:900px"><div class="formfield" style="max-width:280px"><label for="period">Período atual da graduação</label><select id="period">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${state.period===i+1?'selected':''}>${i+1}º período</option>`).join('')}</select></div>
 <h2 style="margin-top:25px">Que atividades deseja ver prioritariamente?</h2><p class="sub" style="margin-bottom:13px">Este filtro altera sua visualização inicial. Você pode mudar e acessar o restante da biblioteca quando quiser.</p>
 <fieldset class="radiogrp"><legend>Tipo de atividade</legend><label class="checkchip"><input type="radio" name="typePreference" value="ambos" ${state.typePreference==='ambos'?'checked':''}>Ambos</label><label class="checkchip"><input type="radio" name="typePreference" value="manobra" ${state.typePreference==='manobra'?'checked':''}>Somente manobras</label><label class="checkchip"><input type="radio" name="typePreference" value="procedimento" ${state.typePreference==='procedimento'?'checked':''}>Somente procedimentos</label></fieldset>
 <h2 style="margin-top:25px">Minhas áreas de interesse</h2><p class="sub" style="margin-bottom:15px">Você pode marcar várias especialidades ao mesmo tempo. Elas destacam itens relacionados, mas não excluem outras áreas.</p><div class="checkbox-group">${AREAS.map(a=>`<label class="checkchip"><input type="checkbox" value="${esc(a)}" data-area="true" ${state.areas.includes(a)?'checked':''}>${esc(a)}</label>`).join('')}</div>
 <div class="form-actions"><button class="btn" id="saveprefs">Salvar preferências</button><button class="btn outline" data-nav="library">Ver biblioteca</button></div></section>
 <section class="card section" style="max-width:900px"><h2>Dados e privacidade do protótipo</h2><p class="sub" style="margin-top:9px">${window.PMCloud?.enabled?'Seus registros são armazenados no Supabase com proteção por usuário (RLS). Não utilize dados de pacientes. Esta versão continua em avaliação e exige revisão de privacidade e segurança antes de uso amplo.':'Sem configuração de contas, esta versão ainda salva registros somente neste navegador. Antes do piloto com contas, configure o Supabase.'}</p><div class="form-actions"><button class="btn secondary" id="backupjson">Baixar backup completo (JSON)</button><button class="btn outline" id="restorejson">Restaurar backup (JSON)</button><input type="file" id="restorefile" accept=".json,application/json" hidden><button class="btn outline" id="exportsettings">Exportar meus registros (CSV)</button><button class="btn outline" id="clearrecords" style="color:#a14a41;border-color:#e6cfc9">${window.PMCloud?.enabled?'Apagar todos os registros da conta':'Apagar registros deste navegador'}</button></div><p class="tiny" style="margin-top:12px">O backup JSON inclui período, interesses e registros. Guarde-o em local seguro. ${window.PMCloud?.enabled?'Na conta, uma restauração mescla os registros do backup sem apagar os demais.':'No modo local, restaurar substitui os dados deste navegador.'}</p></section>`}
function feedback(){
 const endpoint=String(window.PRATICAMED_CONFIG?.feedbackEndpoint||'').trim();
 const enabled=/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint);
 return head('Sugestões dos estudantes','Participe da construção do PráticaMed. As sugestões ajudam a definir as próximas atualizações.')+
 `<section class="feedback-layout section"><div class="card"><span class="eyebrow">Pesquisa com usuários piloto</span><h2 style="margin:8px 0 10px">Conte sua ideia</h2><p class="sub" style="margin-bottom:20px">Descreva algo que facilitaria o registro ou o acompanhamento de manobras e procedimentos.</p>
 <form id="feedbackform" novalidate>
 <div class="formfield"><label for="feedbackcategory">Categoria da sugestão</label><select id="feedbackcategory" name="categoria" required><option value="Nova manobra ou procedimento">Nova manobra ou procedimento</option><option value="Melhoria de uma funcionalidade">Melhoria de uma funcionalidade</option><option value="Correção de problema">Correção de problema</option><option value="Curvas e gráficos">Curvas e gráficos</option><option value="Outra sugestão">Outra sugestão</option></select></div>
 <div class="formfield feedback-gap"><label for="feedbackmessage">Sua sugestão <span class="required">*</span></label><textarea class="field feedback-textarea" id="feedbackmessage" name="mensagem" minlength="15" maxlength="2000" rows="7" required placeholder="Ex.: Gostaria de registrar a manobra de ... e acompanhar a evolução por ..."></textarea><small class="tiny">Mínimo de 15 e máximo de 2.000 caracteres. Não inclua dados de pacientes.</small></div>
 <div class="formfield feedback-gap"><label for="feedbackemail">Seu e-mail (opcional)</label><input class="field" type="email" id="feedbackemail" name="email" maxlength="120" autocomplete="email" placeholder="Para receber uma resposta, se desejar"></div>
 <div class="honeypot" aria-hidden="true"><label for="feedbackgotcha">Não preencher</label><input id="feedbackgotcha" type="text" name="_gotcha" autocomplete="off" tabindex="-1"></div>
 <label class="consentline"><input type="checkbox" id="feedbackconsent" required> <span>Concordo com o envio desta sugestão ao responsável pelo projeto e com seu processamento pelo serviço de formulário. Não incluí informações de pacientes.</span></label>
 <div class="form-actions"><button class="btn" id="feedbacksend" type="submit" ${enabled?'':'disabled'}>Enviar sugestão</button><button class="btn outline" type="button" id="feedbackcopy">Copiar texto</button></div>
 <div class="feedback-status ${enabled?'online':'offline'}" id="feedbackstatus" role="status" aria-live="polite">${enabled?'Formulário conectado. O envio será feito pelo serviço externo de formulários.':'Envio ainda não configurado pelo responsável do projeto. Você pode escrever e copiar o texto; não há envio automático nesta demonstração.'}</div>
 </form></div>
 <aside class="card feedback-side"><h2>O que queremos melhorar?</h2><p class="sub">Seu feedback ajuda a priorizar melhorias reais.</p><div class="feedback-tip"><b>01 · Biblioteca</b><span>Novas manobras e procedimentos relevantes à graduação.</span></div><div class="feedback-tip"><b>02 · Registro</b><span>Menos etapas para registrar uma prática.</span></div><div class="feedback-tip"><b>03 · Evolução</b><span>Gráficos claros e indicadores científicos adequados.</span></div><div class="feedback-tip"><b>04 · Uso no celular</b><span>Navegação, acessibilidade e organização das áreas de interesse.</span></div><div class="info" style="margin-top:22px">A pesquisa é voluntária. Para proteger a privacidade, não envie dados de pacientes, prontuários, nomes ou informações sensíveis. O e-mail é opcional e destinado apenas a eventual resposta. Quando configurado, o formulário utiliza o Formspree, um serviço externo.</div></aside></section>`;
}


function account(){
 const c=window.PMCloud;
 if(!c?.enabled)return head('Minha conta','Cadastro de estudantes')+`<section class="card account-card"><h2>Cadastro ainda não ativado</h2><p class="sub">O aplicativo segue em modo local. Para habilitar cadastro e sincronização, configure supabase-config.js e execute o banco de dados do pacote 2.0.</p><div class="info">Antes de ativar, faça backup dos registros em Preferências.</div></section>`;
 return head('Minha conta','Seus dados pessoais e registros vinculados à sua autenticação.')+
 `<section class="card account-card"><div class="eyebrow">Conta autenticada</div><h2>${esc(c.profile?.display_name||'Estudante')}</h2><p class="sub">${esc(c.user?.email||'E-mail indisponível')}</p>${c.profile?.institution?`<p class="sub">Faculdade: ${esc(c.profile.institution)}</p>`:''}
 <div class="account-sync"><div><b>Sincronização com a conta</b><p class="sub">Última conferência com o Supabase: ${c.lastSyncAt?new Date(c.lastSyncAt).toLocaleString('pt-BR'):'Ainda não confirmada'}. As atualizações de outros aparelhos aparecem após recarregar os dados.</p></div><button class="btn secondary slim" type="button" id="pm-sync-now">↻ Atualizar dados</button></div>
 <div class="form-actions"><button class="btn outline" id="pm-logout">Sair da minha conta</button><button class="btn secondary" data-nav="settings">Editar preferências</button></div>
 <hr style="border:0;border-top:1px solid #dce8f6;margin:25px 0"><h2>Trazer registros da versão antiga</h2>
 <p class="sub">Se você já usava o PráticaMed antes do login, pode importar as práticas deste navegador para sua conta. Confirme que elas são suas antes de importar. Os dados locais originais não serão apagados.</p>
 <div class="form-actions"><button class="btn secondary" id="pm-migrate-legacy">Importar registros antigos deste navegador</button><button class="btn outline" id="backupjson">Baixar backup da minha conta</button></div>
 <p class="tiny" style="margin-top:14px">As contas não permitem visualizar práticas de outros estudantes. Uma conta registrada não equivale a validação das práticas por preceptor.</p></section>`;
}
async function migrateLegacy(){
 const c=window.PMCloud;
 if(!c?.enabled||c.status!=='signed_in')return;
 let backup=read(),rows=backup.records.filter(r=>r&&skill(r.skillId)&&typeof r.id==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(r.id)&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&['simulacao','real','nao_informado'].includes(r.context)&&['executei','observei','auxiliei'].includes(r.role)&&['na','sucesso','insucesso','adequada','melhorar'].includes(r.result)&&['sim','na'].includes(r.supervision));
 if(!rows.length){toast('Não há registros locais antigos para importar.');return;}
 if(!confirm(`Importar ${rows.length} práticas deste navegador para a conta ${c.user.email}? Importe apenas registros que são seus; dados de outros usuários deste dispositivo não devem ser importados.`))return;
 try{await c.mergeRecords(rows);await c.reload();toast('Registros antigos importados para sua conta.');}
 catch(err){toast('Não foi possível concluir a importação: '+err.message+'. Verifique sua conta antes de repetir.');}
}
function render(){
 if(window.PMCloud?.enabled&&window.PMCloud.status!=='signed_in'){
  document.getElementById('desktop-nav').innerHTML='';document.getElementById('mobile-nav').innerHTML='';
  document.querySelector('#view').innerHTML=window.PMCloud.screen();return;
 }
 showNav();const views={home,library,register,charts,history,review,feedback,settings,account};document.querySelector('#view').innerHTML=views[screen]();
}
window.pmRender=render;
window.pmToast=toast;
window.pmCloudLoaded=(data)=>{state={period:data.period||1,areas:(data.areas||[]).filter(a=>AREAS.includes(a)),typePreference:['ambos','manobra','procedimento'].includes(data.typePreference)?data.typePreference:'ambos',records:data.records||[]};typeFilter=state.typePreference;quickType=state.typePreference;areaFilters=[];lastQuickId=null;screen=window.PMCloud?.refreshing?screen:'home';render();};
window.pmCloudLoggedOut=()=>{state={period:1,areas:[],typePreference:'ambos',records:[]};screen='home';lastQuickId=null;render();};
function csvExport(rows=state.records,name='praticamed-registros'){if(!rows.length){toast('Não há registros para exportar.');return}const cols=['data','habilidade','area','tipo','ambiente','participacao','resultado','supervisao','status'];let csv=[cols.join(';'),...rows.map(r=>{let s=skill(r.skillId);let vals=[r.date,s?.name||'',s?.area||'',s?.type||'',r.context,r.role,r.result,r.supervision,'Autodeclarado'];return vals.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(';')})].join('\r\n');let url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Arquivo CSV exportado.')}
function downloadJsonBackup(){
 const payload={format:'praticamed-backup',schemaVersion:1,exportedAt:new Date().toISOString(),data:{period:state.period,areas:state.areas,typePreference:state.typePreference,records:state.records}};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='praticamed-backup-'+tDate()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Backup completo salvo. Guarde-o em um local seguro.');
}
async function importJsonBackup(file){
 try{
  if(!file||file.size>4_000_000)throw Error('Arquivo ausente ou maior que 4 MB.');
  const payload=JSON.parse(await file.text());
  if(payload?.format!=='praticamed-backup'||payload?.schemaVersion!==1||!payload.data)throw Error('Formato de backup incompatível.');
  const data=payload.data;
  if(!Number.isInteger(data.period)||data.period<1||data.period>12||!Array.isArray(data.areas)||!Array.isArray(data.records)||data.records.length>10000||!['ambos','manobra','procedimento'].includes(data.typePreference))throw Error('Dados do backup inválidos.');
  const areaSet=new Set(AREAS),idSet=new Set();
  if(!data.areas.every(x=>typeof x==='string'&&areaSet.has(x)))throw Error('Áreas de interesse desconhecidas.');
  const validRecords=data.records.every(r=>{
   if(!r||typeof r!=='object'||typeof r.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(r.id)||idSet.has(r.id))return false;
   idSet.add(r.id);
   if(!skill(r.skillId)||typeof r.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||r.date>tDate())return false;
   const [y,m,d]=r.date.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));
   if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==m-1||dt.getUTCDate()!==d)return false;
   return ['simulacao','real','nao_informado'].includes(r.context)&&['observei','auxiliei','executei'].includes(r.role)&&['sucesso','insucesso','adequada','melhorar','na'].includes(r.result)&&['sim','na'].includes(r.supervision);
  });
  if(!validRecords)throw Error('Registros do backup inválidos ou incompatíveis.');
  if(!confirm(`${window.PMCloud?.enabled?'Mesclar':'Restaurar'} ${data.records.length} registros? ${window.PMCloud?.enabled?'Os registros já existentes na conta serão mantidos.':'Esta operação substituirá os dados salvos neste navegador.'} Faça antes um backup, se necessário.`))return;
  const restored={period:data.period,areas:[...new Set(data.areas)],typePreference:data.typePreference,records:data.records.map(r=>({id:r.id,skillId:r.skillId,date:r.date,context:r.context,role:r.role,result:r.result,supervision:r.supervision}))};
  if(window.PMCloud?.enabled){
   await window.PMCloud.mergeRecords(restored.records);
   await window.PMCloud.saveProfile(restored);
   await window.PMCloud.reload();go('home');toast('Registros do backup mesclados à sua conta.');
  }else{localStorage.setItem(KEY,JSON.stringify(restored));state=restored;typeFilter=restored.typePreference;areaFilters=[];chartFilter='all';go('home');toast('Backup restaurado neste navegador.');}
 }catch(error){toast('Não foi possível restaurar: '+error.message)}
}
document.addEventListener('click',async e=>{if(e.target.closest('#pm-sync-now')){const btn=e.target.closest('#pm-sync-now');btn.disabled=true;try{await window.PMCloud.reload();toast('Dados atualizados a partir da sua conta.');}catch(err){toast('Falha ao atualizar: '+String(err.message).slice(0,180));}finally{if(btn.isConnected)btn.disabled=false;}return;}if(e.target.id==='history-export'){csvExport(historyFiltered(),'praticamed-historico-filtrado');return;}
if(e.target.id==='history-reset'){historyTerm='';historyType='ambos';historyContext='all';historyRole='all';historyPeriod='all';historyLimit=25;render();return;}
if(e.target.id==='history-more'){historyLimit+=25;render();return;}
const edit=e.target.closest('[data-edit]');if(edit){editRecordId=edit.dataset.edit;screen='history';render();document.getElementById('edit-date')?.focus();return;}
if(e.target.closest('[data-cancel-edit]')){editRecordId=null;render();return;}
const quick=e.target.closest('[data-quickadd]');if(quick){quickAdd(quick.dataset.quickadd);return}const undo=e.target.closest('[data-undo-quick]');if(undo){if(undo.dataset.undoQuick===lastQuickId){try{if(window.PMCloud?.enabled)await window.PMCloud.removeRecord(lastQuickId);state.records=state.records.filter(r=>r.id!==lastQuickId);lastQuickId=null;save();render();toast('Último registro rápido desfeito.')}catch(err){toast('Não foi possível desfazer: '+err.message)}}return}const rv=e.target.closest('[data-review]');if(rv){reviewSelected=rv.dataset.review;go('review');return;}const nav=e.target.closest('[data-nav]');if(nav){go(nav.dataset.nav);return}const select=e.target.closest('[data-skill]');if(select){selectedSkill=select.dataset.skill;render();return}const rec=e.target.closest('[data-record]');if(rec){selectedSkill=rec.dataset.record;go('register');return}const chart=e.target.closest('[data-chart]');if(chart){chartFilter=chart.dataset.chart;go('charts');return}if(e.target.id==='saveprefs'){
 const prefs={period:+document.getElementById('period').value,areas:[...document.querySelectorAll('[data-area]:checked')].map(x=>x.value),typePreference:document.querySelector('[name=typePreference]:checked').value};
 try{if(window.PMCloud?.enabled)await window.PMCloud.saveProfile(prefs);Object.assign(state,prefs);typeFilter=state.typePreference;quickType=state.typePreference;areaFilters=[];save();toast('Preferências salvas.');go('home');}catch(err){toast('Não foi possível salvar preferências: '+err.message)}return;}
 if(e.target.id==='pm-migrate-legacy'){await migrateLegacy();return;}if(e.target.id==='feedbackcopy'){
 const msg=document.getElementById('feedbackmessage')?.value?.trim()||'';
 if(msg.length<15){toast('Escreva uma sugestão com pelo menos 15 caracteres.');return}
 const txt='PráticaMed — Sugestão ('+(document.getElementById('feedbackcategory')?.value||'Geral')+')\n'+msg;
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(txt).then(()=>toast('Sugestão copiada.')).catch(()=>toast('Não foi possível copiar; selecione o texto manualmente.'))}
 else {const el=document.getElementById('feedbackmessage');el.focus();el.select();toast('Texto selecionado. Use Ctrl+C ou Copiar.')}return;
}if(e.target.id==='backupjson'){downloadJsonBackup();return}if(e.target.id==='restorejson'){document.getElementById('restorefile')?.click();return}if(e.target.id==='export'||e.target.id==='exportsettings'){csvExport();return}if(e.target.id==='resetfilters'){typeFilter='ambos';areaFilters=[];term='';render();return}if(e.target.id==='clearareas'){areaFilters=[];render();return}const del=e.target.closest('[data-del]');if(del){if(confirm('Excluir esta prática?')){try{if(window.PMCloud?.enabled)await window.PMCloud.removeRecord(del.dataset.del);state.records=state.records.filter(r=>r.id!==del.dataset.del);save();render();toast('Registro excluído.')}catch(err){toast('Falha ao excluir: '+err.message)}}return}if(e.target.id==='clearrecords'){if(confirm(window.PMCloud?.enabled?'Apagar definitivamente TODOS os registros da sua conta? Essa ação não pode ser desfeita.':'Deseja apagar permanentemente TODOS os registros salvos neste navegador?')){try{if(window.PMCloud?.enabled)await window.PMCloud.removeAllRecords();state.records=[];save();render();toast('Registros apagados.')}catch(err){toast('Falha ao apagar: '+err.message)}}}});
document.addEventListener('change',e=>{if(e.target.id==='restorefile'){const f=e.target.files?.[0];if(f)importJsonBackup(f);e.target.value='';return}if(e.target.matches('[data-filterarea]')){areaFilters=[...document.querySelectorAll('[data-filterarea]:checked')].map(x=>x.value);render()}if(e.target.id==='type-filter'){typeFilter=e.target.value;render()}if(e.target.id==='chart-filter'){chartFilter=e.target.value;render()}if(e.target.id==='quick-type'){quickType=e.target.value;render()}if(e.target.id==='quick-context'){quickContext=e.target.value;render()}if(e.target.id==='history-type'){historyType=e.target.value;historyLimit=25;render()}if(e.target.id==='history-context'){historyContext=e.target.value;historyLimit=25;render()}if(e.target.id==='history-role'){historyRole=e.target.value;historyLimit=25;render()}if(e.target.id==='history-period'){historyPeriod=e.target.value;historyLimit=25;render()}if(e.target.id==='review-filter'){reviewFilter=e.target.value;render()}});
document.addEventListener('input',e=>{if(['search','quick-search','history-search','review-search'].includes(e.target.id)){
const id=e.target.id;if(id==='quick-search')quickTerm=e.target.value;else if(id==='history-search'){historyTerm=e.target.value;historyLimit=25;}else if(id==='review-search')reviewSearch=e.target.value;else term=e.target.value;
const pos=e.target.selectionStart;render();const input=document.getElementById(id);input?.focus();if(input&&pos!==null)input.setSelectionRange(pos,pos);
}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&editRecordId){editRecordId=null;render();return;}const item=e.target.closest('[data-skill]');if(item&&!e.target.closest('button')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectedSkill=item.dataset.skill;render()}});
document.addEventListener('submit',async e=>{
 if(e.target.id==='edit-record-form'){
  e.preventDefault();if(pendingEdit)return;
  const r=state.records.find(x=>x.id===editRecordId);if(!r){toast('Registro não encontrado.');return;}
  const date=document.getElementById('edit-date')?.value||'';
  const context=document.getElementById('edit-context')?.value||'';
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date>tDate()||date<'2000-01-01'||!['nao_informado','simulacao','real'].includes(context)){toast('Verifique a data e o ambiente.');return;}
  const [y,m,d]=date.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));
  if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==m-1||dt.getUTCDate()!==d){toast('A data informada não é válida.');return;}
  const role=document.getElementById('edit-role')?.value;
  const rawResult=document.getElementById('edit-result')?.value||'na';
  if(!['executei','observei','auxiliei'].includes(role)){toast('Verifique a participação.');return;}
  const accepted=skill(r.skillId)?.metric==='sucesso'?['na','sucesso','insucesso']:['na','adequada','melhorar'];
  if(!accepted.includes(rawResult)){toast('Resultado incompatível com a habilidade.');return;}
  const result=role==='executei'?rawResult:'na';
  const updated={...r,date,context,role,result,supervision:context==='real'?'sim':'na'};
  pendingEdit=true;
  try{
   if(window.PMCloud?.enabled)await window.PMCloud.updateRecord(updated);
   state.records=state.records.map(x=>x.id===r.id?updated:x);save();editRecordId=null;render();toast('Prática corrigida com sucesso.');
  }catch(err){toast('Não foi possível corrigir: '+String(err.message).slice(0,140));}
  finally{pendingEdit=false;}
  return;
 }
 if(e.target.id!=='feedbackform')return;
 e.preventDefault();
 const form=e.target,endpoint=String(window.PRATICAMED_CONFIG?.feedbackEndpoint||'').trim();
 const msg=form.querySelector('#feedbackmessage')?.value?.trim()||'';
 const email=form.querySelector('#feedbackemail')?.value?.trim()||'';
 const consent=form.querySelector('#feedbackconsent')?.checked;
 const status=form.querySelector('#feedbackstatus'),btn=form.querySelector('#feedbacksend');
 if(!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint)){status.textContent='O responsável ainda não configurou o recebimento de sugestões.';return}
 if(msg.length<15||msg.length>2000){status.textContent='Escreva entre 15 e 2.000 caracteres.';return}
 if(email&&(email.length>120||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))){status.textContent='Verifique o e-mail ou deixe o campo em branco.';return}
 if(!consent){status.textContent='Confirme a autorização de envio da sugestão.';return}
 const payload=new FormData(form);
 payload.set('mensagem',msg);
 payload.set('periodo_academico',String(state.period));
 payload.set('versao_aplicativo','2.3.0');
 btn.disabled=true;btn.textContent='Enviando…';status.textContent='Enviando sua sugestão…';
 try{
  const response=await fetch(endpoint,{method:'POST',body:payload,headers:{'Accept':'application/json'}});
  if(!response.ok)throw Error('Falha no recebimento (HTTP '+response.status+').');
  form.reset();status.textContent='Sugestão enviada! Obrigado por ajudar a melhorar o PráticaMed.';status.className='feedback-status success';toast('Sua sugestão foi recebida pelo serviço de formulários.');
 }catch(error){status.textContent='Não foi possível confirmar o envio. Sua mensagem continua no campo; tente novamente. ('+error.message+')';status.className='feedback-status offline';}
 finally{btn.disabled=false;btn.textContent='Enviar sugestão';}
});
if(window.PMCloud?.enabled){render();window.PMCloud.boot();}else render();
