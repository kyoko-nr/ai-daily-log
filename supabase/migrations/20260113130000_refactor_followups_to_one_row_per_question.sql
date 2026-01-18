create table if not exists public.daily_log_followups_v2 (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references public.daily_logs (id) on delete cascade,
  question text not null,
  answer text not null default '',
  created_at timestamptz not null default now()
);

alter table public.daily_log_followups_v2 enable row level security;

create policy "daily_log_followups_select_own" on public.daily_log_followups_v2
  for select using (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups_v2.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

create policy "daily_log_followups_insert_own" on public.daily_log_followups_v2
  for insert with check (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups_v2.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

create policy "daily_log_followups_update_own" on public.daily_log_followups_v2
  for update using (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups_v2.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups_v2.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

create policy "daily_log_followups_delete_own" on public.daily_log_followups_v2
  for delete using (
    exists (
      select 1
      from public.daily_logs
      where public.daily_logs.id = daily_log_followups_v2.log_id
        and public.daily_logs.user_id = auth.uid()
    )
  );

insert into public.daily_log_followups_v2 (log_id, question, answer, created_at)
select
  legacy.log_id,
  btrim(question_part),
  coalesce(legacy.answer, ''),
  legacy.created_at
from public.daily_log_followups as legacy
cross join lateral unnest(
  string_to_array(coalesce(legacy.question, ''), ',')
) as question_part
where btrim(question_part) <> '';

drop table public.daily_log_followups;

alter table public.daily_log_followups_v2 rename to daily_log_followups;

create index if not exists daily_log_followups_log_id_idx
  on public.daily_log_followups (log_id);

drop function if exists public.create_daily_log_with_followups(
  date,
  text,
  text[],
  text
);

create or replace function public.create_daily_log_with_followups(
  p_log_date date,
  p_log_text text,
  p_followups jsonb default null
) returns uuid
language plpgsql
as $$
declare
  v_log_id uuid;
  v_followup jsonb;
  v_question text;
  v_answer text;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  insert into public.daily_logs (user_id, log_date, log_text)
  values (auth.uid(), p_log_date, p_log_text)
  returning id into v_log_id;

  if
    p_followups is not null
    and jsonb_typeof(p_followups) = 'array'
    and jsonb_array_length(p_followups) > 0
  then
    for v_followup in select * from jsonb_array_elements(p_followups) loop
      v_question := btrim(coalesce(v_followup->>'question', ''));

      if v_question = '' then
        continue;
      end if;

      v_answer := coalesce(btrim(v_followup->>'answer'), '');

      insert into public.daily_log_followups (log_id, question, answer)
      values (v_log_id, v_question, v_answer);
    end loop;
  end if;

  return v_log_id;
end;
$$;
