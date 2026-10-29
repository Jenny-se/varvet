-- 021: Inventering.
-- En inventering (stocktakes) har en räknad rad per lagerartikel (stocktake_counts).
-- Flera kan räkna samtidigt; en ny räkning av samma artikel skriver över den förra.
-- apply_stocktake för in de räknade saldona i lagret. Säker att köra flera gånger.

begin;

create table if not exists stocktakes (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  status      text not null default 'open' check (status in ('open', 'applied', 'cancelled')),
  notes       text,
  created_by  text,
  created_at  timestamptz not null default now(),
  applied_at  timestamptz,
  applied_by  text
);

-- Högst en pågående inventering åt gången
create unique index if not exists stocktakes_one_open on stocktakes (status) where status = 'open';

create table if not exists stocktake_counts (
  id            uuid primary key default uuid_generate_v4(),
  stocktake_id  uuid not null references stocktakes (id) on delete cascade,
  inventory_id  uuid not null references inventory (id) on delete cascade,
  counted_qty   integer not null check (counted_qty >= 0),
  -- Appens saldo när artikeln räknades. Används för att räkna med försäljning
  -- som sker efter räkningen men innan inventeringen godkänns.
  system_qty    integer not null,
  counted_by    text,
  counted_at    timestamptz not null default now(),
  unique (stocktake_id, inventory_id)
);

create index if not exists stocktake_counts_stocktake_idx on stocktake_counts (stocktake_id);

alter table stocktakes enable row level security;
alter table stocktake_counts enable row level security;

drop policy if exists "Authenticated users can do everything on stocktakes" on stocktakes;
create policy "Authenticated users can do everything on stocktakes"
  on stocktakes for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can do everything on stocktake_counts" on stocktake_counts;
create policy "Authenticated users can do everything on stocktake_counts"
  on stocktake_counts for all to authenticated using (true) with check (true);

-- För in räknade saldon i lagret.
-- Nytt saldo = räknat + (nuvarande saldo − saldo vid räkningen), så att det som sålts
-- efter att artikeln räknades fortfarande dras av. Oräknade artiklar lämnas orörda.
-- Returnerar antal ändrade lagerrader.
create or replace function apply_stocktake(p_stocktake_id uuid)
returns integer
language plpgsql
security invoker
as $$
declare
  v_changed integer;
begin
  if not exists (select 1 from stocktakes where id = p_stocktake_id and status = 'open') then
    raise exception 'Inventeringen finns inte eller är redan avslutad';
  end if;

  with updated as (
    update inventory i
    set quantity_in_stock = greatest(0, c.counted_qty + (i.quantity_in_stock - c.system_qty)),
        updated_at        = now()
    from stocktake_counts c
    where c.stocktake_id = p_stocktake_id
      and c.inventory_id = i.id
      and i.quantity_in_stock <> greatest(0, c.counted_qty + (i.quantity_in_stock - c.system_qty))
    returning i.id
  )
  select count(*) into v_changed from updated;

  update stocktakes
  set status     = 'applied',
      applied_at = now(),
      applied_by = auth.jwt() ->> 'email'
  where id = p_stocktake_id;

  return v_changed;
end;
$$;

revoke execute on function apply_stocktake(uuid) from public, anon;
grant  execute on function apply_stocktake(uuid) to authenticated;

commit;
