# PráticaMed MVP 2.0 — Contas de estudantes

Atualização a partir do PráticaMed 1.9 azul e branco. Inclui login, cadastro com período acadêmico, recuperação de senha, isolamento por usuário com Supabase e sincronização das práticas.

**LEIA PRIMEIRO:** `GUIA-CADASTRO.md`. Contas não são ativadas apenas com o upload dos arquivos; você precisa configurar seu próprio Supabase e executar `supabase-schema.sql` com RLS.

Não substitua o `config.js` atual do GitHub: ele contém a integração Formspree de Sugestões. Mantenha também o `catalogo.js` existente.

Enquanto `supabase-config.js` tiver URL e chave vazias, o site continua em modo local. Depois de configurar uma URL de projeto e uma **publishable key pública** válidas, o login passa a ser obrigatório.

**Atenção:** prepare e personalize `privacidade.html`, especialmente o e-mail de contato do responsável, e configure SMTP para confirmação de contas antes de compartilhar com novos estudantes. Não publique chaves `service_role` ou `sb_secret`.
