-- Ejecutar en el editor SQL del proyecto Supabase.
create table if not exists public.records (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  payload jsonb not null
);
create index if not exists records_user_id_idx on public.records(user_id);
alter table public.records enable row level security;
revoke all on public.records from anon;
revoke all on public.records from authenticated;
grant select, insert on public.records to authenticated;
drop policy if exists "Read own records" on public.records;
create policy "Read own records" on public.records for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own records" on public.records;
create policy "Insert own records" on public.records for insert to authenticated with check ((select auth.uid()) = user_id);
