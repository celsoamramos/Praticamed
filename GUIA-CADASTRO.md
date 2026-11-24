# PráticaMed MVP 2.0 — Ativação das contas individuais

## Antes de alterar o site

1. Abra o PráticaMed 1.9 e, em **Preferências**, faça um **backup JSON** de seus registros atuais.
2. Preserve uma cópia do último pacote funcional e o histórico do GitHub.
3. O pacote foi gerado a partir da versão 1.9 azul e branca, sem acesso direto à sua configuração atual do Formspree. **Não substitua seu `config.js`**.

## 1. Criar banco de dados e autenticação

1. Acesse https://supabase.com/dashboard e crie um projeto Supabase sob sua conta.
2. No projeto, abra **SQL Editor > New query** e cole o conteúdo de `supabase-schema.sql`. Execute e confira a criação das tabelas `pm_profiles` e `pm_practice_records`.
3. Confirme que **RLS está habilitada**, que as sete políticas estão presentes e teste com duas contas distintas antes de convidar usuários.
4. Em **Authentication > Providers > Email**, habilite cadastro com e-mail/senha e **manter confirmação de e-mail ativada**.
5. Em **Authentication > URL Configuration**, defina:
   - Site URL: `https://celsoamramos.github.io/Praticamed/`
   - Additional Redirect URL: `https://celsoamramos.github.io/Praticamed/`
6. **Importante:** o envio de e-mail padrão do Supabase é limitado aos integrantes da equipe do projeto e a 2 mensagens por hora, nas regras verificadas em novembro de 2026. Configure **Authentication > SMTP Settings / Custom SMTP** com um provedor próprio para confirmação de contas dos amigos e recuperação de senha. Sem isso, o cadastro pode falhar com *Email address not authorized*.
7. Em **Project Settings > API Keys**, obtenha somente a **Publishable key** (chave que começa por `sb_publishable_` ou chave pública anon, conforme o projeto) e a **Project URL** (`https://...supabase.co`). **Não copie `service_role`, `sb_secret_...` ou qualquer chave secreta.**

## 2. Preencher a configuração pública

Edite `supabase-config.js`:

```js
window.PRATICAMED_SUPABASE = Object.freeze({
  url: 'https://SEU-PROJETO.supabase.co',
  publishableKey: 'sb_publishable_SUA_CHAVE_PUBLICA'
});
```

Esses valores públicos podem aparecer no código cliente desde que RLS esteja correta; credenciais de administração nunca devem ser públicas.

## 3. Publicar sem perder as sugestões

No repositório `https://github.com/celsoamramos/Praticamed` (branch `main`), faça upload para a **raiz** dos arquivos:

- `index.html` (substituir)
- `app.js` (substituir)
- `styles.css` (substituir)
- `cloud.js` (novo)
- `supabase-config.js` (novo, preenchido)
- `supabase-schema.sql` (opcional; para documentação)
- `privacidade.html` (novo; personalize o contato antes de abrir cadastros)
- `GUIA-CADASTRO.md` (opcional)

**Mantenha `catalogo.js` e o `config.js` existente**, que contém seu endpoint Formspree. Confirme o resultado do commit e abra `https://celsoamramos.github.io/Praticamed/` com Ctrl+Shift+R.

**Ativação gradual:** se `supabase-config.js` estiver vazio, o aplicativo continua em modo local, sem contas. Ao preenchê-lo com URL e chave válidas e publicar, o aplicativo exige login.

## 4. Validar antes de convidar amigos

- Faça cadastro de teste com seu e-mail; confirme no e-mail; entre.
- Escolha múltiplas áreas, registre uma prática pelo `+`, saia e entre novamente. Confirme que o registro reaparece.
- Abra outro navegador ou celular, entre na mesma conta e confirme que as práticas reaparecem.
- Crie uma **segunda conta**, confirme que ela não vê registros da primeira e que não consegue ler os dados da primeira por consultas no Supabase.
- Teste `Sugestões` e o recebimento pelo Formspree.
- Para importar registros antigos, entre em **Minha conta > Importar registros antigos deste navegador**. Antes, verifique que são seus registros, não os de um colega em navegador compartilhado. Importar não apaga os dados locais.
- Em **Preferências**, baixe um backup da conta e teste a mesclagem de um backup JSON de teste.
- Teste o fluxo **Esqueci minha senha** por e-mail; revise o aviso de privacidade e disponibilize contato.

## Limitações

- Não existe ainda painel administrativo institucional, validação do preceptor ou curvas científicas calculadas.
- O cadastro pode ser acessado por qualquer visitante do site quando estiver habilitado; para um piloto restrito, revise controles de inscrição, proteção contra abuso e regras de convite.
- O acesso fica protegido por autenticação e políticas RLS, mas isso não substitui revisão de segurança, adequação à LGPD, retenção e atendimento a titulares.
- Um usuário logado em dispositivo compartilhado deve sempre fazer logout; registros antigos sem login ainda podem existir no armazenamento local, por isso oriente a excluir backups e limpar dispositivos compartilhados com cuidado.
- A nova versão preserva o botão `+`, a biblioteca, os filtros, preferências e a integração com Formspree, mas depende de configuração externa para sincronizar.
