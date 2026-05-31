-- ============================================================
-- Varvet CRM — Migration 003: Documents
-- ============================================================

create table if not exists documents (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  file_url    text not null,
  file_path   text not null,
  file_size   bigint,
  file_type   text,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists documents_created_at_idx on documents (created_at desc);
create index if not exists documents_file_type_idx  on documents (file_type);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table documents enable row level security;

create policy "Authenticated users can do everything on documents"
  on documents for all to authenticated using (true) with check (true);

create policy "Anon can read documents"
  on documents for select to anon using (true);
create policy "Anon can write documents"
  on documents for insert to anon with check (true);
create policy "Anon can update documents"
  on documents for update to anon using (true) with check (true);
create policy "Anon can delete documents"
  on documents for delete to anon using (true);

-- ============================================================
-- STORAGE BUCKET
-- Create in Supabase dashboard: Storage → New bucket
--   Name: documents
--   Public: true
--
-- Storage policies (run in SQL Editor):
-- create policy "Auth read documents" on storage.objects
--   for select to authenticated using (bucket_id = 'documents');
-- create policy "Auth upload documents" on storage.objects
--   for insert to authenticated with check (bucket_id = 'documents');
-- create policy "Auth delete documents" on storage.objects
--   for delete to authenticated using (bucket_id = 'documents');
-- create policy "Public read documents" on storage.objects
--   for select using (bucket_id = 'documents');
-- ============================================================
