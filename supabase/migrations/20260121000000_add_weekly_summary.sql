-- ユーザー設定テーブル
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  summary_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "user_settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);

create policy "user_settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);

create policy "user_settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 週次サマリーテーブル
create table if not exists public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null,
  summary_text text not null,
  log_count integer not null,
  created_at timestamptz not null default now(),

  unique (user_id, week_start)
);

create index if not exists weekly_summaries_user_id_idx
  on public.weekly_summaries (user_id);

create index if not exists weekly_summaries_week_start_idx
  on public.weekly_summaries (week_start);

alter table public.weekly_summaries enable row level security;

create policy "weekly_summaries_select_own" on public.weekly_summaries
  for select using (auth.uid() = user_id);

-- 通常ユーザーからの INSERT は禁止（service_role は RLS をバイパス）
create policy "weekly_summaries_insert_deny" on public.weekly_summaries
  for insert with check (false);

-- 週次ログ取得用の関数
-- 指定した週（月曜始まり）のログとフォローアップを取得
create or replace function public.get_weekly_logs_with_followups(
  p_user_id uuid,
  p_week_start date
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_week_end date;
  v_result jsonb;
begin
  -- 週の終わり（日曜日）を計算
  v_week_end := p_week_start + interval '6 days';

  select jsonb_agg(
    jsonb_build_object(
      'log_id', dl.id,
      'log_date', dl.log_date,
      'log_text', dl.log_text,
      'followups', coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'question', dlf.question,
              'answer', dlf.answer
            )
            order by dlf.created_at
          )
          from public.daily_log_followups dlf
          where dlf.log_id = dl.id
        ),
        '[]'::jsonb
      )
    )
    order by dl.log_date
  )
  into v_result
  from public.daily_logs dl
  where dl.user_id = p_user_id
    and dl.log_date >= p_week_start
    and dl.log_date <= v_week_end;

  return coalesce(v_result, '[]'::jsonb);
end;
$$;

-- サマリー有効なユーザーと前週のログ数を取得する関数
-- Cron ジョブで使用
-- user_settings にレコードがあり summary_enabled = true のユーザーのみ対象
create or replace function public.get_users_for_weekly_summary(
  p_week_start date
) returns table (
  user_id uuid,
  log_count bigint
)
language plpgsql
security definer
as $$
declare
  v_week_end date;
begin
  v_week_end := p_week_start + interval '6 days';

  return query
  select
    us.user_id,
    count(dl.id) as log_count
  from public.user_settings us
  inner join public.daily_logs dl
    on dl.user_id = us.user_id
    and dl.log_date >= p_week_start
    and dl.log_date <= v_week_end
  where us.summary_enabled = true
  group by us.user_id
  having count(dl.id) > 0;
end;
$$;
