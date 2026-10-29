-- 015: Ta bort anon-reglerna i filarkivet (Storage)
--
-- "Anon upload" och "Anon delete" lades till för moodboard-bilder och lät
-- vem som helst med den publika nyckeln ladda upp och radera filer.
-- Moodboards används inte längre. Inga filer raderas av det här skriptet.
--
-- Kör hela filen i Supabase SQL Editor.

begin;

drop policy if exists "Anon upload" on storage.objects;
drop policy if exists "Anon delete" on storage.objects;

commit;

-- Kontroll: visar alla regler som finns kvar i filarkivet.
select policyname,
       roles,
       cmd,
       coalesce(qual, with_check) as villkor
from pg_policies
where schemaname = 'storage'
order by policyname;
