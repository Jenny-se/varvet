create table if not exists stock_snapshots (
  id           uuid primary key default uuid_generate_v4(),
  product_url  text not null,
  color_name   text,
  color_number text,
  quantity     integer not null,
  snapshot_date date not null default current_date,
  scraped_at   timestamptz not null default now()
);

create index if not exists stock_snapshots_date_idx on stock_snapshots (snapshot_date desc);
create index if not exists stock_snapshots_color_idx on stock_snapshots (color_name, snapshot_date desc);

alter table stock_snapshots enable row level security;

create policy "Authenticated users can read stock snapshots"
  on stock_snapshots for select to authenticated using (true);

create policy "Service role can insert stock snapshots"
  on stock_snapshots for insert to authenticated using (true) with check (true);
