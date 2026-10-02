-- Link receipt items to inventory rows so we can deduct stock on sale
alter table receipt_items
  add column if not exists inventory_id uuid references inventory(id) on delete set null;
