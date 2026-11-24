# PráticaMed — Alterações do MVP 2.0

- Cadastro de estudantes com e-mail, senha, nome de exibição opcional, instituição opcional e período.
- Login, logout e recuperação de senha.
- Perfis e registros por usuário, com políticas RLS no Supabase.
- Conserva registro pelo `+`, gráficos, filtros e áreas de interesse múltiplas.
- Preferências salvas na conta e disponíveis em outros dispositivos.
- Exportação JSON/CSV e importação de registros locais, por ação expressa.
- Integração Formspree preservada em `config.js` preexistente.
- Compatibilidade com modo local caso Supabase ainda não esteja configurado.

**Pendente:** configuração real do banco, do SMTP e validação de privacidade e segurança com contas reais.
