/* PráticaMed 2.4 — estatísticas pessoais: descritivas, não medem proficiência. */
(function(){'use strict';
function safe(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function round(n){return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:1});}
function validEntries(records,skills,skillId){
 const q=window.PMQuality;
 return records.filter(r=>r.skillId===skillId && r.role==='executei' && (!q||q.assess(r,skills).usableForVolume))
    .sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
}
function successSeries(records,skills,skillId,context){
 const q=window.PMQuality,sk=skills.find(s=>s.id===skillId);
 if(!sk||sk.metric!=='sucesso'||!q)return [];
 const subset=records.filter(r=>r.skillId===skillId && r.context===context && q.assess(r,skills).usableForOutcome)
      .sort((a,b)=>a.date.localeCompare(b.date));
 // Registros antigos têm apenas a DATA, não horário ou ordem de tentativa.
 // Agrupar desfechos do mesmo dia impede inventar sequência entre procedimentos.
 const days=new Map();
 for(const r of subset){const v=days.get(r.date)||{n:0,success:0};v.n++;if(r.result==='sucesso')v.success++;days.set(r.date,v);}
 let n=0,success=0;
 return [...days.entries()].map(([date,v])=>{n+=v.n;success+=v.success;return {date,n,rate:100*success/n,success};});
}
function lineChart(series,context){
 const total=series.at(-1)?.n||0;
 if(total<5||series.length<2)return `<div class="info">Para mostrar uma curva temporal, precisamos de pelo menos <b>5 resultados conhecidos em 2 dias diferentes</b> no mesmo ambiente. Esta é apenas uma regra de apresentação, não um critério validado de proficiência.</div>`;
 const w=640,h=245,l=46,right=20,top=15,bottom=38;
 const x=i=>l+(w-l-right)*(series.length===1?.5:i/(series.length-1));
 const y=p=>top+(h-top-bottom)*(1-p/100);
 const ticks=[0,25,50,75,100].map(p=>`<line x1="${l}" y1="${y(p)}" x2="${w-right}" y2="${y(p)}" stroke="#e0eaf8"/><text x="${l-8}" y="${y(p)+4}" text-anchor="end" font-size="11" fill="#63809f">${p}%</text>`).join('');
 const points=series.map((d,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(d.rate).toFixed(1)).join(' ');
 const last=series.at(-1);
 return `<div class="chartbox pm24-chart"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Proporção acumulada de sucesso autodeclarado ao longo de ${series.length} dias com resultados, no ambiente ${safe(context)}"><g>${ticks}</g><path d="${points}" stroke="#1769c2" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none"/><circle cx="${x(series.length-1)}" cy="${y(last.rate)}" r="5" fill="#1769c2"/><text x="${l}" y="${h-10}" font-size="11" fill="#63809f">${safe(series[0].date)}</text><text x="${w-right}" y="${h-10}" font-size="11" fill="#63809f" text-anchor="end">${safe(last.date)}</text></svg></div><p class="tiny"><b>${round(last.rate)}%</b> de sucesso acumulado autodeclarado em <b>${total}</b> execuções com desfecho conhecido em ${context==='simulacao'?'simulação':'paciente real'}, distribuídas em ${series.length} dias. A linha é uma proporção descritiva por data, não uma curva de proficiência validada. O botão + não atribui sucesso automaticamente.</p>`;
}
function goalCard(id,records){
 const cfg=window.PMGoalCatalog?.items?.[id];
 if(!cfg||!['piloto','institucional'].includes(cfg.status)||!Number.isInteger(cfg.quantity)||cfg.quantity<=0||!cfg.unit||!['simulacao','real'].includes(cfg.context)||!cfg.approvedBy||!cfg.approvedAt||!cfg.sourceTitle)return `<div class="info"><b>Meta quantitativa:</b> ainda não cadastrada com unidade, cenário e aprovação verificáveis para esta habilidade. Resultados de artigos e metas piloto textuais não são mínimos obrigatórios. A curva pessoal de volume permanece disponível.</div>`;
 const isComparable=cfg.unit==='execucao';
 const eligible=isComparable?records.filter(r=>r.role==='executei'&&r.context===cfg.context):[];
 const label=cfg.status==='institucional'?'Meta curricular institucional':'Meta exploratória do piloto';
 const sourceText=cfg.sourceTitle?`<span class="tiny">Fonte: ${safe(cfg.sourceTitle)}</span>`:'';
 const caveat=cfg.status==='piloto'?'Ainda não aprovada como requisito curricular.':'Aplicável somente à instituição e ao contexto informados.';
 const footer=`<div class="tiny">${safe(caveat)} Unidade: ${safe(cfg.unit)}; cenário: ${safe(cfg.context)}. ${sourceText}</div>`;
 if(!isComparable)return `<div class="info"><b>${label}:</b> ${cfg.quantity} ${safe(cfg.unit)}. ${safe(cfg.context)}. Sem percentual automático: a unidade da meta difere da unidade registrada pelo botão +. ${footer}</div>`;
 const done=eligible.length, percent=100*done/cfg.quantity;
 return `<div class="pm24-goal"><strong>${label}: ${done} de ${cfg.quantity} execuções em ${safe(cfg.context)}</strong><div class="pm24-track"><div class="pm24-fill" style="width:${Math.min(100,Math.max(0,percent))}%"></div></div><small>${round(percent)}% de volume documentado — não é indicador de competência</small>${footer}</div>`;
}
function render(id,records,skills){
 const skill=skills.find(s=>s.id===id);if(!skill)return '';
 const valid=validEntries(records,skills,id);
 const sim=valid.filter(r=>r.context==='simulacao').length,real=valid.filter(r=>r.context==='real').length,unknown=valid.length-sim-real;
 const dateSet=new Set(valid.map(r=>r.date));
 const resultKnown=valid.filter(r=>['sucesso','insucesso','adequada','melhorar'].includes(r.result)).length;
 let detail='';
 if(skill.metric==='sucesso'){
  const s=successSeries(records,skills,id,'simulacao'),r=successSeries(records,skills,id,'real');
  detail=`<div class="pm24-panels"><div><h3>Desempenho autodeclarado — simulação</h3>${lineChart(s,'simulacao')}</div><div><h3>Desempenho autodeclarado — paciente real</h3>${lineChart(r,'real')}</div></div>`;
 }else{
  detail='<div class="info">Para esta manobra ou procedimento, a contagem de execuções não basta para mostrar aquisição de competência. Após a validação de um checklist técnico e de avaliações por preceptor, será possível gerar uma curva de desempenho observável.</div>';
 }
 return `<section class="card section pm24-learning" id="personal-learning-curve"><div class="card-top"><div><span class="eyebrow">MEU HISTÓRICO • CURVA INDIVIDUAL</span><h2>Minha curva — ${safe(skill.name)}</h2><p class="sub">Dados desta conta; nenhuma comparação automática com dados de outros estudantes.</p></div></div>
 <div class="insight-metrics"><div><strong>${valid.length}</strong><small>Execuções consistentes</small></div><div><strong>${sim}</strong><small>Simulações</small></div><div><strong>${real}</strong><small>Paciente real*</small></div><div><strong>${dateSet.size}</strong><small>Dias de prática</small></div></div>
 <p class="tiny">${unknown} execuções com ambiente não informado; ${resultKnown} com desfecho/avaliação autodeclarados. *O cenário paciente real é informado pelo estudante e não comprovado pelo sistema.</p>
 <h3>Meta de formação e unidade de medida</h3>${goalCard(id,valid)}<h3 style="margin-top:18px">Evolução do desempenho</h3>${detail}
 <p class="tiny">As execuções observadas ou auxiliadas não entram na contagem de execuções realizadas. Séries de simulação e de paciente real permanecem separadas. Números da literatura são evidências populacionais e não certificam competência pessoal.</p></section>`;
}
window.PMLearning=Object.freeze({render,validEntries,successSeries,goalCard});
})();
