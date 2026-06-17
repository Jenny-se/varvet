create table if not exists expenses (
  id          uuid primary key default uuid_generate_v4(),
  amount      numeric(10,2) not null,
  description text,
  category    text not null,
  supplier_id uuid references suppliers(id) on delete set null,
  paid        boolean not null default false,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

create index if not exists expenses_date_idx on expenses (date desc);
create index if not exists expenses_supplier_id_idx on expenses (supplier_id);

alter table expenses enable row level security;

create policy "Authenticated users can do everything on expenses"
  on expenses for all to authenticated using (true) with check (true);
