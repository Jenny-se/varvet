-- ============================================================
-- Varvet CRM — Initial Migration
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- SUPPLIERS
-- ============================================================
create table if not exists suppliers (
  id                    uuid primary key default uuid_generate_v4(),
  company_name          text not null,
  contact_person        text,
  email                 text,
  phone                 text,
  website               text,
  country_of_origin     text,
  address               text,
  notes                 text,
  fiber_specialties     text[] not null default '{}',
  certifications        text[] not null default '{}',
  minimum_order_quantity integer,
  lead_time_days        integer,
  status                text not null default 'active' check (status in ('active', 'inactive')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists suppliers_status_idx         on suppliers (status);
create index if not exists suppliers_country_idx        on suppliers (country_of_origin);
create index if not exists suppliers_company_name_idx   on suppliers using gin (to_tsvector('simple', company_name));

-- ============================================================
-- INVENTORY
-- ============================================================
create table if not exists inventory (
  id                       uuid primary key default uuid_generate_v4(),
  product_name             text not null,
  colorway                 text,
  dye_lot                  text,
  yarn_weight              text check (yarn_weight in ('lace','fingering','DK','worsted','bulky')),
  fiber_content            text,
  meterage_per_skein       integer,
  needle_size_recommendation text,
  quantity_in_stock        integer not null default 0,
  cost_price               numeric(10,2),
  retail_price             numeric(10,2),
  supplier_id              uuid references suppliers (id) on delete set null,
  low_stock_threshold      integer not null default 5,
  category                 text not null default 'yarn' check (category in ('yarn','needles','accessories')),
  tags                     text[] not null default '{}',
  notes                    text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists inventory_supplier_idx   on inventory (supplier_id);
create index if not exists inventory_weight_idx     on inventory (yarn_weight);
create index if not exists inventory_category_idx   on inventory (category);
create index if not exists inventory_low_stock_idx  on inventory (quantity_in_stock, low_stock_threshold);

-- ============================================================
-- KANBAN COLUMNS
-- ============================================================
create table if not exists kanban_columns (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists kanban_columns_position_idx on kanban_columns (position);

-- Seed default columns
insert into kanban_columns (title, position) values
  ('Idéer',     0),
  ('Att göra',  1),
  ('Pågående',  2),
  ('Klart',     3)
on conflict do nothing;

-- ============================================================
-- KANBAN CARDS
-- ============================================================
create table if not exists kanban_cards (
  id             uuid primary key default uuid_generate_v4(),
  column_id      uuid not null references kanban_columns (id) on delete cascade,
  title          text not null,
  description    text,
  due_date       date,
  priority       text not null default 'medium' check (priority in ('low','medium','high')),
  category_tag   text check (category_tag in ('Workshop','Order','Marketing','Admin','Event')),
  supplier_id    uuid references suppliers (id) on delete set null,
  inventory_id   uuid references inventory (id) on delete set null,
  position       integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists kanban_cards_column_idx    on kanban_cards (column_id);
create index if not exists kanban_cards_position_idx  on kanban_cards (column_id, position);
create index if not exists kanban_cards_due_date_idx  on kanban_cards (due_date);
create index if not exists kanban_cards_priority_idx  on kanban_cards (priority);

-- ============================================================
-- ACTIVITY FEED
-- ============================================================
create table if not exists activity_feed (
  id          uuid primary key default uuid_generate_v4(),
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  entity_name text,
  created_at  timestamptz not null default now()
);

create index if not exists activity_feed_created_at_idx on activity_feed (created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger suppliers_updated_at
  before update on suppliers
  for each row execute function set_updated_at();

create trigger inventory_updated_at
  before update on inventory
  for each row execute function set_updated_at();

create trigger kanban_cards_updated_at
  before update on kanban_cards
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table suppliers      enable row level security;
alter table inventory      enable row level security;
alter table kanban_columns enable row level security;
alter table kanban_cards   enable row level security;
alter table activity_feed  enable row level security;

-- Allow all operations for authenticated users (single-user CRM)
create policy "Authenticated users can do everything on suppliers"
  on suppliers for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on inventory"
  on inventory for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on kanban_columns"
  on kanban_columns for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on kanban_cards"
  on kanban_cards for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on activity_feed"
  on activity_feed for all to authenticated using (true) with check (true);

-- Read-only access for anon key (for development/demo)
create policy "Anon can read suppliers"
  on suppliers for select to anon using (true);

create policy "Anon can read inventory"
  on inventory for select to anon using (true);

create policy "Anon can read kanban_columns"
  on kanban_columns for select to anon using (true);

create policy "Anon can read kanban_cards"
  on kanban_cards for select to anon using (true);

create policy "Anon can read activity_feed"
  on activity_feed for select to anon using (true);

-- Write access for anon (dev mode — restrict in production)
create policy "Anon can write suppliers"
  on suppliers for insert to anon with check (true);
create policy "Anon can update suppliers"
  on suppliers for update to anon using (true) with check (true);
create policy "Anon can delete suppliers"
  on suppliers for delete to anon using (true);

create policy "Anon can write inventory"
  on inventory for insert to anon with check (true);
create policy "Anon can update inventory"
  on inventory for update to anon using (true) with check (true);
create policy "Anon can delete inventory"
  on inventory for delete to anon using (true);

create policy "Anon can write kanban_columns"
  on kanban_columns for insert to anon with check (true);
create policy "Anon can update kanban_columns"
  on kanban_columns for update to anon using (true) with check (true);
create policy "Anon can delete kanban_columns"
  on kanban_columns for delete to anon using (true);

create policy "Anon can write kanban_cards"
  on kanban_cards for insert to anon with check (true);
create policy "Anon can update kanban_cards"
  on kanban_cards for update to anon using (true) with check (true);
create policy "Anon can delete kanban_cards"
  on kanban_cards for delete to anon using (true);

create policy "Anon can write activity_feed"
  on activity_feed for insert to anon with check (true);
