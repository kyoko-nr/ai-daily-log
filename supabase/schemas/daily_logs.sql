create extension if not exists "pgcrypto";

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  log_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_log_followups (
  log_id uuid primary key references public.daily_logs (id) on delete cascade,
  question text,
  answer text,
  created_at timestamptz not null default now()
);

alter table public.daily_logs enable row level security;
alter table public.daily_log_followups enable row level security;

create policy "daily_logs_select_own" on public.daily_logs
  for select using (auth.uid() = user_id);

create policy "daily_logs_insert_own" on public.daily_logs
  for insert with check (auth.uid() = user_id);

create policy "daily_logs_update_own" on public.daily_logs
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "daily_logs_delete_own" on public.daily_logs
  for delete using (auth.uid() = user_id);

create policy "daily_log_followups_select_own" on public.daily_log_followups
  for select using (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

create policy "daily_log_followups_insert_own" on public.daily_log_followups
  for insert with check (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

create policy "daily_log_followups_update_own" on public.daily_log_followups
  for update using (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

create policy "daily_log_followups_delete_own" on public.daily_log_followups
  for delete using (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

create or replace function public.create_daily_log_with_followups(
  p_log_date date,
  p_log_text text,
  p_questions text[] default null,
  p_answer text default null
) returns uuid
language plpgsql
as $$
declare
  v_log_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  insert into public.daily_logs (user_id, log_date, log_text)
  values (auth.uid(), p_log_date, p_log_text)
  returning id into v_log_id;

  if
    p_questions is not null
    and array_length(p_questions, 1) is not null
    and array_length(p_questions, 1) > 0
  then
    insert into public.daily_log_followups (log_id, question, answer)
    values (
      v_log_id,
      array_to_string(p_questions, ','),
      nullif(btrim(p_answer), '')
    );
  end if;

  return v_log_id;
end;
$$;
