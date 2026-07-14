begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(15);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'user_settings', 'settings table exists');
select has_column('public', 'tasks', 'tag', 'tasks have tags');
select has_column(
  'public', 'task_decisions', 'request_id', 'decisions have idempotency keys'
);
select ok(
  (
    select bool_and(relrowsecurity)
    from pg_catalog.pg_class
    where oid in ('public.profiles'::regclass, 'public.user_settings'::regclass)
  ),
  'new public tables have RLS'
);

insert into auth.users (id, aud, role, email, created_at, updated_at)
values (
  '10000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'one@example.com',
  now(),
  now()
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select lives_ok(
  $$
    insert into public.profiles (user_id, display_name)
    values ('10000000-0000-0000-0000-000000000001', 'One')
  $$,
  'a user can create their profile'
);

select lives_ok(
  $$
    insert into public.user_settings (user_id, time_zone)
    values ('10000000-0000-0000-0000-000000000001', 'Asia/Seoul')
  $$,
  'a user can create valid settings'
);

select throws_ok(
  $$
    update public.user_settings
    set time_zone = 'Not/A_Time_Zone'
    where user_id = '10000000-0000-0000-0000-000000000001'
  $$,
  'P0001',
  'Invalid time zone',
  'invalid time zones are rejected'
);

insert into public.tasks (id, user_id, title, scheduled_for, status, tag)
values (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Ship phase one',
  '2026-07-14',
  'planned',
  'work'
);

insert into public.commitments (
  id, task_id, user_id, commitment_date, slot
) values (
  '30000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  '2026-07-14',
  1
);

update public.commitments
set outcome = 'completed'
where id = '30000000-0000-0000-0000-000000000001';

select isnt(
  (
    select resolved_at from public.commitments
    where id = '30000000-0000-0000-0000-000000000001'
  ),
  null,
  'resolution time is derived by the database'
);

select is(
  (
    select status from public.tasks
    where id = '20000000-0000-0000-0000-000000000001'
  ),
  'completed',
  'resolving a commitment updates its task'
);

select throws_ok(
  $$
    update public.commitments
    set outcome = 'deferred'
    where id = '30000000-0000-0000-0000-000000000001'
  $$,
  'P0001',
  'A resolved commitment cannot be changed',
  'a resolved outcome is immutable'
);

insert into public.task_decisions (
  task_id, user_id, decision, next_date, request_id
) values (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'reschedule',
  '2026-07-20',
  '40000000-0000-0000-0000-000000000001'
);

select is(
  (
    select previous_date from public.task_decisions
    where request_id = '40000000-0000-0000-0000-000000000001'
  ),
  '2026-07-14'::date,
  'a decision captures the previous date'
);

select is(
  (
    select scheduled_for from public.tasks
    where id = '20000000-0000-0000-0000-000000000001'
  ),
  '2026-07-20'::date,
  'a decision updates its task atomically'
);

select lives_ok(
  $$
    insert into public.task_decisions (
      task_id, user_id, decision, next_date, request_id
    ) values (
      '20000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'reschedule',
      '2026-07-20',
      '40000000-0000-0000-0000-000000000001'
    ) on conflict (user_id, request_id) do nothing
  $$,
  'retrying a decision is safe'
);

select is(
  (
    select count(*) from public.task_decisions
    where request_id = '40000000-0000-0000-0000-000000000001'
  ),
  1::bigint,
  'a retry does not duplicate the decision'
);

select * from finish();
rollback;
