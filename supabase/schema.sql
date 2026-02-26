-- CRM Lite MVP schema (Supabase/Postgres)

create extension if not exists pgcrypto;

create type public.app_role as enum ('viewer', 'editor', 'admin');
create type public.activity_type as enum ('call', 'meeting');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vertical text,
  use_case text,
  pipeline_stage text not null check (
    pipeline_stage in ('Lead', 'Qualified', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')
  ),
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  type public.activity_type not null,
  notes text not null,
  activity_date date not null,
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now()
);

create index if not exists accounts_search_idx
  on public.accounts using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(vertical, '') || ' ' || coalesce(use_case, '')));

create index if not exists activities_account_id_idx on public.activities(account_id);

create or replace function public.set_accounts_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_accounts_updated_at_trigger
before update on public.accounts
for each row
execute procedure public.set_accounts_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

alter table public.users enable row level security;
alter table public.accounts enable row level security;
alter table public.activities enable row level security;

create or replace function public.current_user_role()
returns public.app_role as $$
  select role from public.users where id = auth.uid();
$$ language sql stable;

create policy users_select_all
  on public.users for select
  to authenticated
  using (true);

create policy users_admin_update
  on public.users for update
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy accounts_select_all
  on public.accounts for select
  to authenticated
  using (true);

create policy accounts_insert_editor_admin
  on public.accounts for insert
  to authenticated
  with check (public.current_user_role() in ('editor', 'admin') and created_by = auth.uid());

create policy accounts_update_owner_or_admin
  on public.accounts for update
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'admin')
  with check (created_by = auth.uid() or public.current_user_role() = 'admin');

create policy accounts_delete_owner_or_admin
  on public.accounts for delete
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'admin');

create policy activities_select_all
  on public.activities for select
  to authenticated
  using (true);

create policy activities_insert_editor_admin
  on public.activities for insert
  to authenticated
  with check (public.current_user_role() in ('editor', 'admin') and created_by = auth.uid());

create policy activities_update_owner_or_admin
  on public.activities for update
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'admin')
  with check (created_by = auth.uid() or public.current_user_role() = 'admin');

create policy activities_delete_owner_or_admin
  on public.activities for delete
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'admin');
