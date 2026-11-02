-- 022: Marknadsdata från garnr.se (stock_snapshots).
-- Uppskattar försäljning per färg som minskningen i lager från en dag till nästa.
-- Slutsålda färger sparas inte av skrapan; de dagarna räknas som 0 i lager.
-- Vyerna följer tabellens RLS (security_invoker), så bara inloggade ser datan.
-- Säker att köra flera gånger.

begin;

-- Ett värde per färg och dag, från färgens första mätning till senaste mätdagen för garnet
create or replace view market_daily
  with (security_invoker = true) as
with days as (
  select distinct product_url, snapshot_date from stock_snapshots
),
colors as (
  select product_url, color_number, min(snapshot_date) as first_date
  from stock_snapshots
  group by product_url, color_number
),
filled as (
  select c.product_url, c.color_number, d.snapshot_date, coalesce(s.quantity, 0) as quantity
  from colors c
  join days d on d.product_url = c.product_url and d.snapshot_date >= c.first_date
  left join stock_snapshots s
    on s.product_url = c.product_url and s.color_number = c.color_number and s.snapshot_date = d.snapshot_date
)
select product_url, color_number, snapshot_date, quantity,
       lag(quantity) over (partition by product_url, color_number order by snapshot_date) as prev_quantity
from filled;

-- Nyckeltal per färg
create or replace view market_color_stats
  with (security_invoker = true) as
select m.product_url,
       m.color_number,
       (select s.color_name from stock_snapshots s
         where s.product_url = m.product_url and s.color_number = m.color_number
         order by s.snapshot_date desc limit 1)                                         as color_name,
       min(m.snapshot_date)                                                              as first_date,
       max(m.snapshot_date)                                                              as last_date,
       coalesce(sum(greatest(m.prev_quantity - m.quantity, 0)), 0)::int                  as sold_total,
       coalesce(sum(greatest(m.prev_quantity - m.quantity, 0))
         filter (where m.snapshot_date > current_date - 28), 0)::int                     as sold_28d,
       count(*) filter (where m.quantity = 0)::int                                       as out_days,
       count(*) filter (where m.quantity = 0 and m.snapshot_date > current_date - 28)::int as out_days_28d,
       (array_agg(m.quantity order by m.snapshot_date desc))[1]                          as current_quantity
from market_daily m
group by m.product_url, m.color_number;

-- Uppskattad försäljning per garn och vecka (måndag)
create or replace view market_weekly
  with (security_invoker = true) as
select product_url,
       date_trunc('week', snapshot_date)::date                  as week,
       sum(greatest(prev_quantity - quantity, 0))::int           as sold
from market_daily
where prev_quantity is not null
group by product_url, date_trunc('week', snapshot_date);

grant select on market_daily, market_color_stats, market_weekly to authenticated;

commit;
