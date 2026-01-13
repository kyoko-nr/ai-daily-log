create or replace function public.list_daily_logs_by_year_month(
  p_year_month text
) returns table (
  id uuid,
  log_date date,
  log_text text,
  created_at timestamptz
)
language plpgsql
stable
as $$
declare
  v_year int;
  v_month int;
  v_start_date date;
  v_end_date date;
begin
  -- NOTE: Postgres regexで \\d は環境差で期待通りに動かないため、数字クラスを明示する。
  if p_year_month is null or p_year_month !~ '^[0-9]{4}-[0-9]{2}$' then
    raise exception 'Invalid yearMonth' using errcode = '22023';
  end if;

  v_year := substring(p_year_month, 1, 4)::int;
  v_month := substring(p_year_month, 6, 2)::int;

  if v_month < 1 or v_month > 12 then
    raise exception 'Invalid yearMonth' using errcode = '22023';
  end if;

  v_start_date := make_date(v_year, v_month, 1);
  v_end_date := (v_start_date + interval '1 month')::date;

  return query
    select dl.id, dl.log_date, dl.log_text, dl.created_at
    from public.daily_logs as dl
    where dl.user_id = auth.uid()
      and dl.log_date >= v_start_date
      and dl.log_date < v_end_date
    order by dl.log_date desc, dl.created_at desc;
end;
$$;
