-- ============================================================
-- 007 — Receipts (kvittosystem)
-- ============================================================

-- Product pricelist managed in admin
create table if not exists receipt_products (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  default_price numeric(10,2) not null default 0,
  vat_rate     numeric(5,2) not null default 25,
  active       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists receipt_products_active_idx on receipt_products(active, sort_order);

-- Receipts
create table if not exists receipts (
  id             uuid primary key default uuid_generate_v4(),
  receipt_number text not null unique,
  receipt_date   date not null default current_date,
  customer_name  text,
  payment_method text not null default 'swish'
                   check (payment_method in ('swish','kontant','kort','faktura')),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists receipts_date_idx   on receipts(receipt_date desc);
create index if not exists receipts_number_idx on receipts(receipt_number);

-- Line items
create table if not exists receipt_items (
  id                  uuid primary key default uuid_generate_v4(),
  receipt_id          uuid not null references receipts(id) on delete cascade,
  product_name        text not null,
  receipt_product_id  uuid references receipt_products(id) on delete set null,
  quantity            integer not null default 1,
  unit_price          numeric(10,2) not null,
  vat_rate            numeric(5,2) not null default 25,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now()
);

create index if not exists receipt_items_receipt_idx on receipt_items(receipt_id, sort_order);

-- updated_at triggers
create trigger receipt_products_updated_at
  before update on receipt_products
  for each row execute function set_updated_at();

create trigger receipts_updated_at
  before update on receipts
  for each row execute function set_updated_at();

-- Function: auto-generate next receipt number (V0001, V0002 ...)
create or replace function next_receipt_number()
returns text as $$
declare
  max_num integer;
begin
  select coalesce(max(cast(substring(receipt_number from 2) as integer)), 0)
  into max_num
  from receipts
  where receipt_number ~ '^V\d+$';
  return 'V' || lpad((max_num + 1)::text, 4, '0');
end;
$$ language plpgsql security definer;

-- RLS
alter table receipt_products enable row level security;
alter table receipts         enable row level security;
alter table receipt_items    enable row level security;

create policy "Authenticated users can do everything on receipt_products"
  on receipt_products for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on receipts"
  on receipts for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on receipt_items"
  on receipt_items for all to authenticated using (true) with check (true);
