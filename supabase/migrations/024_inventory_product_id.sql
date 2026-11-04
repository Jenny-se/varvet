-- Produkt ↔ färger: varje lagerrad (en färg/variant) pekar på sin produkt i
-- receipt_products (Admin) med ett id, i stället för att kopplas via namnet.
-- Admin-raden äger moms, pris, knappordning och aktiv; lagerraden äger färg och saldo.
-- Säker att köra flera gånger.

alter table inventory
  add column if not exists product_id uuid references receipt_products(id) on delete set null;
create index if not exists inventory_product_id_idx on inventory(product_id);

-- Bästa produkt för ett lagernamn: det längsta Admin-namnet som ingår i lagernamnet
-- ("ChiaoGoo SS Red Lace rundsticka 60 cm 3 mm" → "ChiaoGoo SS Red Lace rundsticka 60 cm")
create or replace function match_receipt_product(p_name text) returns uuid
language sql stable set search_path = public as $$
  select id from receipt_products
  where position(lower(name) in lower(p_name)) > 0
  order by length(name) desc
  limit 1
$$;

-- 1. Produkter där namnen skiljer sig åt
update inventory i set product_id = rp.id
from receipt_products rp
where i.product_id is null and (rp.name, i.product_name) in (
  ('Chamotte 100g', 'Varvet Chamotte'),
  ('Sax stora öglor', 'Sax med stora öglor'),
  ('Sax Solros', 'Sunflower Scissors bright yellow'),
  ('Ullbalsam Lopi 500 ml', 'Wool Softener Lopi 500 ml'),
  ('Ulltvål Lopi 500 ml', 'Wool Soap Lopi 500 ml')
);

-- 2. Böcker som bara fanns i lagret blir egna produkter (bokmoms 6 %)
insert into receipt_products (name, default_price, vat_rate, active, sort_order)
select b.name, coalesce(i.retail_price, 0), 6, true,
       (select coalesce(max(sort_order), 0) from receipt_products) + b.n
from (values
  ('Koftor – Maja Karlsson', 1),
  ('Vinterstickat – Maja Karlsson', 2),
  ('Sticka tidlösa plagg – Anna Strandberg', 3),
  ('Stickat från kust till kust – Erika Åberg', 4)
) as b(name, n)
left join lateral (select retail_price from inventory where product_name = b.name limit 1) i on true
where exists (select 1 from inventory where product_name = b.name)
  and not exists (select 1 from receipt_products where name = b.name);

-- 3. Resten via namnet
update inventory set product_id = match_receipt_product(product_name)
where product_id is null;

-- Nya lagerrader utan produkt kopplas automatiskt (även från importskript):
-- först samma produkt som andra färger med samma namn, annars via namnet
create or replace function inventory_set_product_id() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.product_id is null then
    new.product_id := (select product_id from inventory
      where product_name = new.product_name and product_id is not null
      limit 1);
  end if;
  if new.product_id is null then
    new.product_id := match_receipt_product(new.product_name);
  end if;
  return new;
end $$;

drop trigger if exists inventory_set_product_id on inventory;
create trigger inventory_set_product_id
  before insert on inventory
  for each row execute function inventory_set_product_id();
