-- Inköpspris per kvittorad, för vinst på kvittosidan.
-- receipt_items.cost_price = inköpspris per styck exkl. moms när kvittot skrevs (null = okänt).
-- Sätts automatiskt från lagerraden, annars från produkten (snittet av dess lagerrader,
-- eller receipt_products.cost_price för produkter utan lager, t.ex. Chamotte 20g).
-- Säker att köra flera gånger.

alter table receipt_items add column if not exists cost_price numeric(10,2);
alter table receipt_products add column if not exists cost_price numeric(10,2);

-- Produkter utan lagerrad som har ett känt inköpspris
update receipt_products set cost_price = v.cost
from (values
  ('Chamotte 20g', 24.50),
  ('Fodral till sax', 0),
  ('Projektpåse', 0)
) as v(name, cost)
where receipt_products.name = v.name and receipt_products.cost_price is null;

create or replace function receipt_item_cost(p_inventory_id uuid, p_product_name text) returns numeric
language sql stable set search_path = public as $$
  select coalesce(
    (select cost_price from inventory where id = p_inventory_id),
    (select coalesce(
        (select round(avg(i.cost_price), 2) from inventory i where i.product_id = rp.id and i.cost_price > 0),
        rp.cost_price)
     from receipt_products rp
     where rp.id = coalesce(
       (select id from receipt_products where lower(name) = lower(trim(p_product_name)) limit 1),
       match_receipt_product(p_product_name)))
  )
$$;

create or replace function receipt_items_set_cost() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.cost_price is null then
    new.cost_price := receipt_item_cost(new.inventory_id, new.product_name);
  end if;
  return new;
end $$;

drop trigger if exists receipt_items_set_cost on receipt_items;
create trigger receipt_items_set_cost
  before insert on receipt_items
  for each row execute function receipt_items_set_cost();

-- Gamla kvittorader
update receipt_items set cost_price = receipt_item_cost(inventory_id, product_name)
where cost_price is null;

-- Gamla namn som inte matchar någon produkt (inköpspriser från Jenny 2026-11-10)
update receipt_items set cost_price = 35
where cost_price is null and product_name ilike '%sax%' and product_name not ilike 'fodral%';
update receipt_items set cost_price = 35
where product_name = 'Sax + Fodral till sax';
update receipt_items set cost_price = case when unit_price <= 60 then 24.50 else 122.50 end
where cost_price is null and product_name = 'Chamotte';
update receipt_items set cost_price = v.cost
from (values
  ('Markör', 10), ('Markörer', 10), ('Våg', 10), ('Stickhållare', 10), ('Bandgrind', 0),
  ('Paissa breva', 51.20), ('Lettlopi', 27.60), ('Ön & skogen', 240.83)
) as v(name, cost)
where receipt_items.cost_price is null and receipt_items.product_name = v.name;
