-- 026: Automatisk lagersynk mellan appen och Shopify.
--
-- Appens lager gäller. Synken (scripts/shopify-sync.mjs, körs av GitHub Actions) gör två saker:
--   1. Webbordrar från Shopify drar av appens lager, en gång per order (shopify_orders).
--   2. Appens saldon skrivs till Shopify, kopplat via sku.
-- Ordrar från före synkens start räknas inte (shopify_sync_state.orders_since).
--
-- Kör hela filen i Supabase SQL Editor.
-- Filen går att köra flera gånger. Ingen data raderas.

begin;

create table if not exists shopify_sync_state (
  id            boolean primary key default true check (id),
  orders_since  timestamptz not null default now(),
  last_run_at   timestamptz,
  last_result   text
);
insert into shopify_sync_state (id) values (true) on conflict do nothing;

-- En rad per Shopify-order som har dragits av lagret
create table if not exists shopify_orders (
  order_id      text primary key,
  order_name    text not null,
  created_at    timestamptz not null,
  lines         jsonb not null,
  unmatched     jsonb not null default '[]',
  processed_at  timestamptz not null default now()
);

alter table shopify_sync_state enable row level security;
alter table shopify_orders enable row level security;

drop policy if exists "authenticated read shopify_sync_state" on shopify_sync_state;
create policy "authenticated read shopify_sync_state" on shopify_sync_state for select to authenticated using (true);
drop policy if exists "authenticated read shopify_orders" on shopify_orders;
create policy "authenticated read shopify_orders" on shopify_orders for select to authenticated using (true);

-- Drar av lagret för en order. Gör ingenting om ordern redan är behandlad.
-- p_lines: [{"sku": "...", "quantity": 2, "title": "..."}]
create or replace function shopify_apply_order(
  p_order_id   text,
  p_order_name text,
  p_created_at timestamptz,
  p_lines      jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_line      jsonb;
  v_item_id   uuid;
  v_unmatched jsonb := '[]';
begin
  insert into shopify_orders (order_id, order_name, created_at, lines)
  values (p_order_id, p_order_name, p_created_at, p_lines)
  on conflict (order_id) do nothing;
  if not found then
    return false;
  end if;

  for v_line in select * from jsonb_array_elements(p_lines) loop
    select id into v_item_id from inventory where sku = v_line->>'sku';
    if v_item_id is null then
      v_unmatched := v_unmatched || jsonb_build_array(v_line);
      continue;
    end if;
    perform decrement_inventory_stock(v_item_id, (v_line->>'quantity')::integer);
  end loop;

  update shopify_orders set unmatched = v_unmatched where order_id = p_order_id;

  insert into activity_feed (action, entity_type, entity_name)
  values ('Webbförsäljning – lagret minskat', 'shopify_order', p_order_name);

  return true;
end;
$$;

revoke execute on function shopify_apply_order(text, text, timestamptz, jsonb) from public, anon, authenticated;
grant  execute on function shopify_apply_order(text, text, timestamptz, jsonb) to service_role;

commit;

-- Kontroll: en rad med orders_since = nu
select * from shopify_sync_state;
