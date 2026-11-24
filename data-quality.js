/* Auditoria técnica local, sem acesso a pacientes e sem certificação clínica. */
(function(){'use strict';
const allowed={context:['simulacao','real','nao_informado'],role:['executei','observei','auxiliei'],result:['na','sucesso','insucesso','adequada','melhorar'],supervision:['sim','na']};
function isoDay(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return false;const [y,m,d]=value.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;}
function today(){const x=new Date(),o=x.getTimezoneOffset();return new Date(x.getTime()-o*60000).toISOString().slice(0,10);}
function assess(record, allSkills, cutoff=today()){
 const errors=[],warnings=[],notes=[];
 const sk=allSkills.find(s=>s.id===record?.skillId);
 if(!record||typeof record!=='object'){return {severity:'invalid',errors:['Registro vazio ou inválido'],warnings,notes,usableForVolume:false,usableForOutcome:false};}
 if(!sk)errors.push('Habilidade não encontrada no catálogo');
 if(typeof record.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(record.id))errors.push('Identificador do registro incompatível');
 if(!isoDay(record.date)||record.date<'2000-01-01'||record.date>cutoff)errors.push('Data ausente, impossível ou futura');
 if(!allowed.context.includes(record.context))errors.push('Ambiente inválido');
 if(!allowed.role.includes(record.role))errors.push('Tipo de participação inválido');
 if(!allowed.result.includes(record.result))errors.push('Resultado inválido');
 if(!allowed.supervision.includes(record.supervision))errors.push('Supervisão inválida');
 if(record.context==='nao_informado')warnings.push('Ambiente não informado: impede comparação por cenário');
 if(record.context==='real'&&record.supervision!=='sim')warnings.push('Paciente real sem indicação de supervisão: revisar declaração');
 if(record.role!=='executei'&&record.result!=='na')warnings.push('Resultado atribuído a observação/auxílio: conferir lançamento');
 if(sk?.metric!=='sucesso'&&['sucesso','insucesso'].includes(record.result))warnings.push('Resultado de sucesso usado em habilidade sem esse indicador no catálogo');
 if(sk?.metric==='sucesso'&&['adequada','melhorar'].includes(record.result))warnings.push('Avaliação qualitativa não corresponde à taxa de sucesso deste procedimento');
 if(sk?.metric==='sucesso'&&record.role==='executei'&&record.result==='na')notes.push('Não há desfecho de sucesso/insucesso; o registro serve apenas para volume');
 const severity=errors.length?'invalid':warnings.length?'attention':'ok';
 return {severity,errors,warnings,notes,usableForVolume:!errors.length&&record.role==='executei',
 usableForOutcome:!errors.length&&record.role==='executei'&&sk?.metric==='sucesso'&&['sucesso','insucesso'].includes(record.result)&&['real','simulacao'].includes(record.context)};
}
function audit(records,skills,cutoff=today()){
 const seen=new Set(),items=(Array.isArray(records)?records:[]).map((record,index)=>{
  const item=assess(record,skills,cutoff);
  if(seen.has(record?.id)){item.errors.push('Identificador repetido na lista; possível importação duplicada');item.severity='invalid';item.usableForVolume=false;item.usableForOutcome=false;}
  seen.add(record?.id);
  return {record,index,...item};
 });
 return {total:items.length,ok:items.filter(x=>x.severity==='ok').length,attention:items.filter(x=>x.severity==='attention').length,invalid:items.filter(x=>x.severity==='invalid').length,
 validVolume:items.filter(x=>x.usableForVolume).length,usableOutcome:items.filter(x=>x.usableForOutcome).length,
 missingContext:items.filter(x=>x.record?.context==='nao_informado').length, flagged:items.filter(x=>x.severity!=='ok'),items};
}
function wilson(success,n){if(!n)return null;const z=1.96,p=success/n,den=1+z*z/n,center=(p+z*z/(2*n))/den,half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den;return {rate:p*100,lower:Math.max(0,(center-half)*100),upper:Math.min(100,(center+half)*100)};}
window.PMQuality=Object.freeze({assess,audit,isoDay,wilson,today});
})();
