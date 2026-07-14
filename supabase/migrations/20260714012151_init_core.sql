create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function private.set_updated_at() from public, anon, authenticated;

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 500),
  scheduled_for date,
  status text not null default 'planned'
    check (status in ('planned', 'in_progress', 'completed', 'deferred', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create index tasks_user_date_idx on public.tasks (user_id, scheduled_for);

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function private.set_updated_at();

create table public.commitments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null,
  user_id uuid not null,
  commitment_date date not null,
  slot smallint not null check (slot between 1 and 3),
  outcome text check (outcome in ('completed', 'deferred', 'abandoned')),
  declared_at timestamptz not null default now(),
  resolved_at timestamptz,
  foreign key (task_id, user_id)
    references public.tasks (id, user_id) on delete cascade,
  unique (user_id, commitment_date, slot),
  unique (task_id, commitment_date),
  check (
    (outcome is null and resolved_at is null)
    or (outcome is not null and resolved_at is not null)
  )
);

create table public.task_decisions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null,
  user_id uuid not null,
  decision text not null
    check (decision in ('today', 'reschedule', 'someday', 'abandon')),
  previous_date date,
  next_date date,
  reason text check (reason is null or char_length(reason) <= 500),
  created_at timestamptz not null default now(),
  foreign key (task_id, user_id)
    references public.tasks (id, user_id) on delete cascade,
  check (
    (decision in ('today', 'reschedule') and next_date is not null)
    or (decision in ('someday', 'abandon') and next_date is null)
  )
);

create index task_decisions_user_created_idx
  on public.task_decisions (user_id, created_at desc);
create index task_decisions_task_idx on public.task_decisions (task_id);

alter table public.tasks enable row level security;
alter table public.commitments enable row level security;
alter table public.task_decisions enable row level security;

create policy "users manage own tasks"
on public.tasks for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "users view own commitments"
on public.commitments for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users create own commitments"
on public.commitments for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "users resolve own commitments"
on public.commitments for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "users view own task decisions"
on public.task_decisions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users create own task decisions"
on public.task_decisions for insert
to authenticated
with check ((select auth.uid()) = user_id);

revoke all on public.tasks, public.commitments, public.task_decisions
  from anon, authenticated;

grant select, delete on public.tasks to authenticated;
grant insert (id, user_id, title, scheduled_for, status)
  on public.tasks to authenticated;
grant update (title, scheduled_for, status) on public.tasks to authenticated;
grant select on public.commitments to authenticated;
grant insert (id, task_id, user_id, commitment_date, slot)
  on public.commitments to authenticated;
grant update (outcome, resolved_at) on public.commitments to authenticated;
grant select on public.task_decisions to authenticated;
grant insert (id, task_id, user_id, decision, previous_date, next_date, reason)
  on public.task_decisions to authenticated;

grant all on public.tasks, public.commitments, public.task_decisions to service_role;
