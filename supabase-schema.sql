-- PRÁTICAMED 2.0 — executar no Supabase SQL Editor, UMA única vez.
-- Projetado para acesso pelo navegador com publishable key e RLS.
-- Não execute em outro projeto que tenha tabelas homônimas sem revisar.

create table if not exists public.pm_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  institution text not null default '' check (char_length(institution) <= 120),
  period integer not null default 1 check (period between 1 and 12),
  areas text[] not null default '{}',
  type_preference text not null default 'ambos' check (type_preference in ('ambos','manobra','procedimento')),
  created_at timestamptz not null default now()
);
create table if not exists public.pm_practice_records (
  id text primary key check (char_length(id) between 1 and 100 and id ~ '^[a-zA-Z0-9_-]+$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id text not null check (char_length(skill_id) between 1 and 100),
  practice_date date not null,
  context text not null default 'nao_informado' check (context in ('nao_informado','simulacao','real')),
  role text not null default 'executei' check (role in ('executei','observei','auxiliei')),
  result text not null default 'na' check (result in ('na','sucesso','insucesso','adequada','melhorar')),
  supervision text not null default 'na' check (supervision in ('sim','na')),
  created_at timestamptz not null default now()
);
create index if not exists pm_practice_records_user_date on public.pm_practice_records(user_id,created_at);

alter table public.pm_profiles enable row level security;
alter table public.pm_practice_records enable row level security;

-- Somente usuários autenticados recebem acesso via Data API.
revoke all on public.pm_profiles from anon;
revoke all on public.pm_practice_records from anon;
grant select, insert, update on public.pm_profiles to authenticated;
grant select, insert, update, delete on public.pm_practice_records to authenticated;

-- Perfis: cada estudante vê e altera somente seu próprio perfil.
drop policy if exists pm_profiles_select_own on public.pm_profiles;
create policy pm_profiles_select_own on public.pm_profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists pm_profiles_insert_own on public.pm_profiles;
create policy pm_profiles_insert_own on public.pm_profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists pm_profiles_update_own on public.pm_profiles;
create policy pm_profiles_update_own on public.pm_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Registros: acesso restrito ao próprio autor.
drop policy if exists pm_practice_select_own on public.pm_practice_records;
create policy pm_practice_select_own on public.pm_practice_records for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists pm_practice_insert_own on public.pm_practice_records;
create policy pm_practice_insert_own on public.pm_practice_records for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists pm_practice_update_own on public.pm_practice_records;
create policy pm_practice_update_own on public.pm_practice_records for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists pm_practice_delete_own on public.pm_practice_records;
create policy pm_practice_delete_own on public.pm_practice_records for delete to authenticated using ((select auth.uid()) = user_id);
