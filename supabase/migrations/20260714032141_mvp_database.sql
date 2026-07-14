-- DB phase 1: profiles, settings, and atomic core state changes.

alter table public.tasks
  add column tag text
    check (tag is null or char_length(btrim(tag)) between 1 and 50);

alter table public.task_decisions
  add column request_id uuid not null default gen_random_uuid(),
  add constraint task_decisions_user_request_key unique (user_id, request_id);

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null
    check (char_length(btrim(display_name)) between 1 and 40),
  avatar_path text
    check (avatar_path is null or char_length(avatar_path) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create table public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  time_zone text not null default 'Asia/Seoul',
  rest_weekdays smallint[] not null default array[0, 6]::smallint[]
    check (
      cardinality(rest_weekdays) <= 7
      and rest_weekdays <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]
    ),
  reminder_daily_limit smallint not null default 3
    check (reminder_daily_limit between 0 and 10),
  reminder_start time not null default '09:00',
  reminder_end time not null default '21:00',
  updated_at timestamptz not null default now(),
  check (reminder_start < reminder_end)
);

create function private.validate_time_zone()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1 from pg_catalog.pg_timezone_names where name = new.time_zone
  ) then
    raise exception 'Invalid time zone';
  end if;
  return new;
end;
$$;

revoke execute on function private.validate_time_zone()
  from public, anon, authenticated;

create trigger user_settings_validate_time_zone
before insert or update of time_zone on public.user_settings
for each row execute function private.validate_time_zone();

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function private.set_updated_at();

create function private.guard_commitment_resolution()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.outcome is not null and new.outcome is distinct from old.outcome then
    raise exception 'A resolved commitment cannot be changed';
  end if;

  new.resolved_at := case
    when new.outcome is null then null
    else coalesce(old.resolved_at, now())
  end;
  return new;
end;
$$;

revoke execute on function private.guard_commitment_resolution()
  from public, anon, authenticated;

create trigger commitments_guard_resolution
before update of outcome on public.commitments
for each row execute function private.guard_commitment_resolution();

create function private.sync_task_from_commitment()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.outcome is not null and new.outcome is distinct from old.outcome then
    update public.tasks
    set status = new.outcome
    where id = new.task_id and user_id = new.user_id;
  end if;
  return null;
end;
$$;

revoke execute on function private.sync_task_from_commitment()
  from public, anon, authenticated;

create trigger commitments_sync_task
after update of outcome on public.commitments
for each row execute function private.sync_task_from_commitment();

create function private.capture_task_decision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select scheduled_for into new.previous_date
  from public.tasks
  where id = new.task_id and user_id = new.user_id
  for update;

  if not found then
    raise exception 'Task not found';
  end if;
  return new;
end;
$$;

revoke execute on function private.capture_task_decision()
  from public, anon, authenticated;

create trigger task_decisions_capture
before insert on public.task_decisions
for each row execute function private.capture_task_decision();

create function private.apply_task_decision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.decision in ('today', 'reschedule') then
    update public.tasks
    set scheduled_for = new.next_date, status = 'planned'
    where id = new.task_id and user_id = new.user_id;
  elsif new.decision = 'someday' then
    update public.tasks
    set scheduled_for = null, status = 'planned'
    where id = new.task_id and user_id = new.user_id;
  else
    update public.tasks
    set scheduled_for = null, status = 'abandoned'
    where id = new.task_id and user_id = new.user_id;
  end if;
  return null;
end;
$$;

revoke execute on function private.apply_task_decision()
  from public, anon, authenticated;

create trigger task_decisions_apply
after insert on public.task_decisions
for each row execute function private.apply_task_decision();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

create policy "users manage own profile"
on public.profiles for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "users manage own settings"
on public.user_settings for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on public.profiles, public.user_settings from anon, authenticated;
grant select on public.profiles, public.user_settings to authenticated;
grant insert (user_id, display_name, avatar_path) on public.profiles to authenticated;
grant update (display_name, avatar_path) on public.profiles to authenticated;
grant insert (
  user_id, time_zone, rest_weekdays, reminder_daily_limit,
  reminder_start, reminder_end
) on public.user_settings to authenticated;
grant update (
  time_zone, rest_weekdays, reminder_daily_limit, reminder_start, reminder_end
) on public.user_settings to authenticated;

grant insert (tag), update (tag) on public.tasks to authenticated;
grant insert (request_id) on public.task_decisions to authenticated;
revoke update (outcome, resolved_at) on public.commitments from authenticated;
grant update (outcome) on public.commitments to authenticated;

grant all on public.profiles, public.user_settings to service_role;
