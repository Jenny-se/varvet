-- Atomically decrements inventory stock; never goes below zero
create or replace function decrement_inventory_stock(p_id uuid, p_quantity integer)
returns void
language sql
security definer
as $$
  update inventory
  set quantity_in_stock = greatest(0, quantity_in_stock - p_quantity),
      updated_at = now()
  where id = p_id;
$$;
