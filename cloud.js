/* PráticaMed 2.0 — autenticação e dados por usuário, via Supabase.
   Dados científicos da biblioteca continuam públicos; dados individuais ficam em tabelas com RLS. */
(function () {
  'use strict';
  const conf = window.PRATICAMED_SUPABASE || {};
  const url = String(conf.url || '').trim();
  const key = String(conf.publishableKey || '').trim();
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url) && key.length > 15;
  const sdk = window.supabase;
  const db = configured && sdk?.createClient ? sdk.createClient(url.replace(/\/$/, ''), key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }) : null;
  const cm = {
    enabled: configured,
    ready: false,
    status: configured ? 'loading' : 'disabled',
    view: 'login',
    message: '',
    user: null,
    profile: null,
    lastSyncAt: null,
    refreshing: false,
    _db: db,
    _loading: null,
    _loadingId: null,
    _generation: 0
  };
  const base = () => ({period: 1, areas: [], records: [], typePreference: 'ambos'});
  const render = () => window.pmRender?.();
  const redirect = () => window.location.origin + window.location.pathname;
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function explain(err) {
    const s = String(err?.message || 'Não foi possível completar a operação.');
    if (/email address not authorized|not authorized/i.test(s)) return 'O Supabase ainda não permite enviar e-mails para este endereço. Configure um provedor SMTP no Supabase antes de cadastrar seus amigos.';
    if (/invalid login credentials/i.test(s)) return 'E-mail ou senha incorretos, ou conta ainda não confirmada.';
    if (/email not confirmed/i.test(s)) return 'Confirme sua conta pelo e-mail antes de entrar.';
    if (/network|fetch failed|failed to fetch/i.test(s)) return 'Falha de conexão com o Supabase. Verifique sua internet e tente novamente.';
    return s.slice(0, 220);
  }
  async function loadUser(user) {
    if (!user?.id) return;
    if (cm._loading && cm._loadingId === user.id) return cm._loading;
    cm._loadingId = user.id;
    const generation = ++cm._generation;
    cm.status = 'loading';
    render();
    cm._loading = (async () => {
      const response = await db.from('pm_profiles').select('id,display_name,institution,period,areas,type_preference').eq('id', user.id).maybeSingle();
      if (response.error) throw response.error;
      let profile = response.data;
      if (!profile) {
        const data = {
          id: user.id,
          display_name: String(user.user_metadata?.display_name || '').slice(0, 80),
          institution: String(user.user_metadata?.institution || '').slice(0, 120),
          period: Number(user.user_metadata?.period) >= 1 && Number(user.user_metadata?.period) <= 12 ? Number(user.user_metadata?.period) : 1,
          areas: [], type_preference: 'ambos'
        };
        const created = await db.from('pm_profiles').upsert(data, {onConflict:'id'}).select('id,display_name,institution,period,areas,type_preference').single();
        if (created.error) throw created.error;
        profile = created.data;
      }
      const records = [];
      for (let from=0; ; from+=500) {
        const page = await db.from('pm_practice_records')
          .select('id,skill_id,practice_date,context,role,result,supervision,created_at')
          .eq('user_id', user.id).order('created_at', {ascending: true}).order('id',{ascending:true}).range(from,from+499);
        if (page.error) throw page.error;
        records.push(...(page.data || []));
        if ((page.data || []).length < 500) break;
        if (from > 100000) throw Error('Quantidade inesperada de registros.');
      }
      if (generation !== cm._generation) return;
      cm.user = user;
      cm.profile = profile;
      cm.status = 'signed_in';
      cm.lastSyncAt = new Date().toISOString();
      cm.message = '';
      const mapped = {
        period: profile.period || 1,
        areas: Array.isArray(profile.areas) ? profile.areas : [],
        typePreference: profile.type_preference || 'ambos',
        records: records.map(row => ({id:row.id,skillId:row.skill_id,date:row.practice_date,context:row.context,
          role:row.role,result:row.result,supervision:row.supervision}))
      };
      window.pmCloudLoaded?.(mapped);
    })();
    try { await cm._loading; }
    catch (err) {
      if (generation === cm._generation) {
        cm.status = 'error';cm.message = 'Não foi possível carregar seus registros: ' + explain(err);
        render();
      }
    }
    finally { cm._loading = null; cm._loadingId = null; }
  }
  cm.boot = async function() {
    if (!configured) return;
    if (!db) {cm.status='error';cm.message='Biblioteca de conexão não carregou. Atualize a página.';render();return;}
    db.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {cm.status='recovery';cm.view='reset';render();return;}
      if (event === 'SIGNED_OUT') {++cm._generation;cm.user=null;cm.profile=null;cm.lastSyncAt=null;cm.status='signed_out';cm.view='login';window.pmCloudLoggedOut?.();render();return;}
      if (event === 'SIGNED_IN' && session?.user?.id && cm.user?.id !== session.user.id) {
        Promise.resolve().then(() => loadUser(session.user));
      }
    });
    try {
      const {data,error} = await db.auth.getUser();
      if (error && !/auth session missing/i.test(error.message)) throw error;
      if (data?.user) await loadUser(data.user);
      else if (cm.status === 'loading') {cm.status='signed_out';render();}
    } catch (err) {cm.status='error';cm.message=explain(err);render();}
  };
  cm.screen = function() {
    if (cm.status === 'loading') return `<section class="auth-layout"><div class="card auth-card"><h1>Preparando sua conta…</h1><p class="sub">Conectando com segurança ao PráticaMed.</p></div></section>`;
    if (cm.status === 'error') return `<section class="auth-layout"><div class="card auth-card"><h1>Não foi possível conectar</h1><p class="auth-note">${escapeHtml(cm.message)}</p><button class="btn" id="pm-auth-retry" type="button">Tentar novamente</button></div></section>`;
    if (cm.status === 'recovery' || cm.view === 'reset') return `<section class="auth-layout"><div class="card auth-card"><div class="eyebrow">PráticaMed 2.0</div><h1>Definir nova senha</h1><p class="sub">Escolha uma senha de pelo menos 8 caracteres.</p><form id="pm-auth-reset" class="auth-form"><div class="formfield"><label for="pm-new-pass">Nova senha</label><input class="field" id="pm-new-pass" type="password" autocomplete="new-password" minlength="8" required></div><button class="btn block" type="submit">Salvar nova senha</button></form><p class="auth-message" role="status">${escapeHtml(cm.message)}</p></div></section>`;
    let form;
    if (cm.view === 'register') {
      form = `<h1>Criar minha conta</h1><p class="sub">Guarde seus registros e acompanhe sua evolução em outros dispositivos.</p>
        <form id="pm-auth-register" class="auth-form">
          <div class="formfield"><label for="pm-name">Nome de exibição (opcional)</label><input class="field" id="pm-name" maxlength="80" autocomplete="nickname" placeholder="Como prefere ser chamado"></div>
          <div class="formfield"><label for="pm-institution">Faculdade (opcional)</label><input class="field" id="pm-institution" maxlength="120" placeholder="Nome da instituição"></div>
          <div class="formfield"><label for="pm-period">Período atual</label><select id="pm-period" class="field">${Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}º período</option>`).join('')}</select></div>
          <div class="formfield"><label for="pm-email-register">E-mail</label><input class="field" id="pm-email-register" type="email" autocomplete="email" required maxlength="254"></div>
          <div class="formfield"><label for="pm-password-register">Senha (mínimo 8 caracteres)</label><input class="field" id="pm-password-register" type="password" autocomplete="new-password" minlength="8" required></div>
          <div class="formfield"><label for="pm-password-repeat">Repita a senha</label><input class="field" id="pm-password-repeat" type="password" autocomplete="new-password" minlength="8" required></div>
          <label class="auth-confirm"><input type="checkbox" id="pm-acknowledge" required><span>Entendo que esta é uma versão piloto, não incluirei dados de pacientes e li o aviso de privacidade.</span></label>
          <button class="btn block" type="submit">Criar conta</button></form>
          <p class="auth-switch">Já possui cadastro? <button type="button" data-auth-view="login">Entrar</button></p>`;
    } else if (cm.view === 'forgot') {
      form = `<h1>Recuperar senha</h1><p class="sub">Enviaremos instruções para o e-mail cadastrado.</p>
        <form id="pm-auth-forgot" class="auth-form"><div class="formfield"><label for="pm-forgot-email">E-mail</label><input class="field" id="pm-forgot-email" type="email" autocomplete="email" required maxlength="254"></div><button class="btn block" type="submit">Enviar recuperação</button></form><p class="auth-switch"><button type="button" data-auth-view="login">Voltar ao login</button></p>`;
    } else {
      form = `<h1>Entre na sua conta</h1><p class="sub">Seus registros ficam vinculados ao seu e-mail e protegidos por autenticação.</p>
        <form id="pm-auth-login" class="auth-form"><div class="formfield"><label for="pm-email">E-mail</label><input class="field" id="pm-email" type="email" autocomplete="email" required maxlength="254"></div><div class="formfield"><label for="pm-password">Senha</label><input class="field" id="pm-password" type="password" autocomplete="current-password" required></div><button class="btn block" type="submit">Entrar</button></form>
        <p class="auth-switch">Ainda não possui conta? <button type="button" data-auth-view="register">Criar cadastro</button></p><p class="auth-switch"><button type="button" data-auth-view="forgot">Esqueci minha senha</button></p>`;
    }
    return `<section class="auth-layout"><div class="card auth-card"><div class="eyebrow">PRÁTICAMED • CONTAS INDIVIDUAIS</div>${form}<p class="auth-message" role="status">${escapeHtml(cm.message)}</p><div class="auth-privacy"><b>Privacidade no piloto</b><p>Não registre nomes, prontuários ou outros dados de pacientes. Seus registros são autodeclarados e não representam competência comprovada. Consulte <a href="privacidade.html" target="_blank" rel="noopener">o aviso de privacidade</a>.</p></div></div></section>`;
  };
  cm.signup = async ({email, password, display_name, institution, period}) => {
    const {data,error}=await db.auth.signUp({email,password,options:{
      data:{display_name,institution,period}, emailRedirectTo:redirect()
    }});
    if (error) throw error;
    if (data.session && data.user) {await loadUser(data.user);return 'Conta criada e acesso liberado.';}
    cm.view='login';cm.status='signed_out';render();
    return 'Cadastro solicitado. Verifique seu e-mail, confirme a conta e depois entre com sua senha.';
  };
  cm.login = async (email,password) => {
    const {data,error}=await db.auth.signInWithPassword({email,password});
    if(error) throw error;
    if(data.user) await loadUser(data.user);
  };
  cm.logout = async () => {
    const {error}=await db.auth.signOut(); if(error) throw error;
    ++cm._generation;cm.user=null;cm.profile=null;cm.lastSyncAt=null;cm.status='signed_out';cm.view='login';window.pmCloudLoggedOut?.();render();
  };
  cm.forgot = async email => {
    const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:redirect()});
    if(error) throw error;
    cm.message='Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.';render();
  };
  cm.changePassword = async password => {
    const {error}=await db.auth.updateUser({password});if(error)throw error;
    cm.status='signed_in';cm.view='login';cm.message='Senha atualizada.';
    const {data}=await db.auth.getUser();if(data?.user)await loadUser(data.user);
  };
  cm.saveProfile = async prefs => {
    if (!cm.user) throw Error('Entre na sua conta.');
    const {error}=await db.from('pm_profiles').update({period:prefs.period,areas:prefs.areas,type_preference:prefs.typePreference}).eq('id',cm.user.id);
    if(error)throw error;
    Object.assign(cm.profile,{period:prefs.period,areas:prefs.areas,type_preference:prefs.typePreference});
  };
  cm.addRecord = async record => {
    if (!cm.user) throw Error('Entre na sua conta.');
    const {error}=await db.from('pm_practice_records').insert({
      id:record.id,user_id:cm.user.id,skill_id:record.skillId,practice_date:record.date,
      context:record.context,role:record.role,result:record.result,supervision:record.supervision
    }); if(error)throw error;cm.lastSyncAt=new Date().toISOString();
  };
  cm.updateRecord = async record => {
    if(!cm.user)throw Error('Entre na sua conta.');
    const {data,error}=await db.from('pm_practice_records')
      .update({practice_date:record.date,context:record.context,supervision:record.supervision,role:record.role,result:record.result})
      .eq('user_id',cm.user.id).eq('id',record.id).select('id').maybeSingle();
    if(error)throw error;
    if(!data)throw Error('O registro não foi encontrado nesta conta. Atualize os dados antes de editar.');
    cm.lastSyncAt=new Date().toISOString();
  };
  cm.removeRecord = async id => {
    if (!cm.user) throw Error('Entre na sua conta.');
    const {error}=await db.from('pm_practice_records').delete().eq('user_id',cm.user.id).eq('id',id);if(error)throw error;cm.lastSyncAt=new Date().toISOString();
  };
  cm.removeAllRecords = async () => {
    if (!cm.user) throw Error('Entre na sua conta.');
    const {error}=await db.from('pm_practice_records').delete().eq('user_id',cm.user.id);if(error)throw error;
  };
  cm.mergeRecords = async records => {
    if (!cm.user) throw Error('Entre na sua conta.');
    for(let start=0;start<records.length;start+=100){
      const rows=records.slice(start,start+100).map(r=>({id:r.id,user_id:cm.user.id,skill_id:r.skillId,practice_date:r.date,
        context:r.context,role:r.role,result:r.result,supervision:r.supervision}));
      const {error}=await db.from('pm_practice_records').upsert(rows,{onConflict:'id'});
      if(error)throw error;
    }
  };
  cm.reload = async () => {
    if(!cm.user)throw Error('Entre na sua conta para atualizar os registros.');
    cm.refreshing=true;
    try {
      await loadUser(cm.user);
      if(cm.status !== 'signed_in')throw Error(cm.message || 'Não foi possível atualizar os registros.');
      return true;
    } finally {cm.refreshing=false;}
  };
  document.addEventListener('click', async event => {
    const sw=event.target.closest('[data-auth-view]');
    if(sw){cm.view=sw.dataset.authView;cm.message='';render();return;}
    if(event.target.closest('#pm-auth-retry')) {cm.message='';cm.status='loading';render();await cm.boot();return;}
    if(event.target.closest('#pm-logout')) {
      try{await cm.logout();}catch(err){window.pmToast?.('Não foi possível sair: '+explain(err));}return;
    }
  });
  document.addEventListener('submit', async event => {
    const form=event.target;
    if (!['pm-auth-login','pm-auth-register','pm-auth-forgot','pm-auth-reset'].includes(form.id))return;
    event.preventDefault();
    if(!form.reportValidity())return;
    const button=form.querySelector('button[type="submit"]');
    if(button?.disabled)return;
    if(button)button.disabled=true;
    cm.message='';
    try{
      if(form.id==='pm-auth-register'){
        const p=form.querySelector('#pm-password-register').value,repeat=form.querySelector('#pm-password-repeat').value;
        if(p!==repeat)throw Error('As senhas não coincidem.');
        if(!form.querySelector('#pm-acknowledge').checked)throw Error('Confirme que leu o aviso de privacidade.');
        const msg=await cm.signup({email:form.querySelector('#pm-email-register').value.trim(),password:p,
          display_name:form.querySelector('#pm-name').value.trim(),institution:form.querySelector('#pm-institution').value.trim(),period:Number(form.querySelector('#pm-period').value)});
        cm.message=msg;render();
      } else if(form.id==='pm-auth-login') {
        await cm.login(form.querySelector('#pm-email').value.trim(),form.querySelector('#pm-password').value);
      } else if(form.id==='pm-auth-forgot')await cm.forgot(form.querySelector('#pm-forgot-email').value.trim());
      else await cm.changePassword(form.querySelector('#pm-new-pass').value);
    }catch(err){cm.message=explain(err);render();}
    finally {if(button?.isConnected)button.disabled=false;}
  });
  window.PMCloud = cm;
})();
