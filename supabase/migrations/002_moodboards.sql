-- ============================================================
-- Varvet CRM — Migration 002: Moodboards
-- ============================================================

-- ============================================================
-- MOODBOARDS
-- ============================================================
create table if not exists moodboards (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists moodboards_created_at_idx on moodboards (created_at desc);

-- ============================================================
-- MOODBOARD ITEMS
-- ============================================================
create table if not exists moodboard_items (
  id           uuid primary key default uuid_generate_v4(),
  moodboard_id uuid not null references moodboards (id) on delete cascade,
  type         text not null check (type in ('image', 'color', 'note')),
  position     integer not null default 0,
  image_url    text,
  color_hex    text,
  label        text,
  note_text    text,
  created_at   timestamptz not null default now()
);

create index if not exists moodboard_items_board_idx on moodboard_items (moodboard_id, position);

-- ============================================================
-- LINK MOODBOARD TO KANBAN CARDS
-- ============================================================
alter table kanban_cards
  add column if not exists moodboard_id uuid references moodboards (id) on delete set null;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create trigger moodboards_updated_at
  before update on moodboards
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table moodboards      enable row level security;
alter table moodboard_items enable row level security;

create policy "Authenticated users can do everything on moodboards"
  on moodboards for all to authenticated using (true) with check (true);

create policy "Authenticated users can do everything on moodboard_items"
  on moodboard_items for all to authenticated using (true) with check (true);

create policy "Anon can read moodboards"
  on moodboards for select to anon using (true);
create policy "Anon can write moodboards"
  on moodboards for insert to anon with check (true);
create policy "Anon can update moodboards"
  on moodboards for update to anon using (true) with check (true);
create policy "Anon can delete moodboards"
  on moodboards for delete to anon using (true);

create policy "Anon can read moodboard_items"
  on moodboard_items for select to anon using (true);
create policy "Anon can write moodboard_items"
  on moodboard_items for insert to anon with check (true);
create policy "Anon can update moodboard_items"
  on moodboard_items for update to anon using (true) with check (true);
create policy "Anon can delete moodboard_items"
  on moodboard_items for delete to anon using (true);

-- ============================================================
-- STORAGE BUCKET (run separately if not created via dashboard)
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('moodboard-images', 'moodboard-images', true)
-- on conflict do nothing;

-- Storage RLS (paste in dashboard → Storage → Policies if needed)
-- create policy "Public read moodboard images"
--   on storage.objects for select using (bucket_id = 'moodboard-images');
-- create policy "Anon upload moodboard images"
--   on storage.objects for insert to anon with check (bucket_id = 'moodboard-images');
-- create policy "Anon delete moodboard images"
--   on storage.objects for delete to anon using (bucket_id = 'moodboard-images');
