-- 014: Lås ner anon-nyckeln + nyhetsbrevsprenumeranter
--
-- Anon-nyckeln ska läggas publikt på hemsidan (varvetgarn.se) för
-- nyhetsbrevsformuläret. Därför får den inte längre ha någon åtkomst till
-- CRM-tabellerna. Appen kräver inloggning och använder rollen
-- `authenticated`, och skripten använder service role – båda påverkas inte.
--
-- Kör hela filen i Supabase SQL Editor. Allt körs som en enda transaktion:
-- blir något fel ändras ingenting. Filen går att köra flera gånger.

begin;

-- ─── 1. Ta bort alla anon-policys från dev-läget (001–003) ───────────────
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and 'anon' = any(roles)
  loop
    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- ─── 2. Funktioner får bara anropas av inloggade ─────────────────────────
-- Utan detta kan vem som helst med anon-nyckeln anropa dem via /rpc,
-- t.ex. räkna ner lagersaldon.
revoke execute on function public.next_receipt_number() from public, anon;
grant  execute on function public.next_receipt_number() to authenticated;

revoke execute on function public.decrement_inventory_stock(uuid, integer) from public, anon;
grant  execute on function public.decrement_inventory_stock(uuid, integer) to authenticated;

-- ─── 3. Nyhetsbrevsprenumeranter ─────────────────────────────────────────
create table if not exists newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  source          text not null default 'nyhetsbrev',
  consented_at    timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now(),
  constraint newsletter_email_lowercase check (email = lower(email))
);

alter table newsletter_subscribers enable row level security;

-- Inloggade (CRM-appen) får läsa, ändra och ta bort.
drop policy if exists "Authenticated users can do everything on newsletter_subscribers"
  on newsletter_subscribers;
create policy "Authenticated users can do everything on newsletter_subscribers"
  on newsletter_subscribers for all to authenticated using (true) with check (true);

-- Anon får INGEN direkt åtkomst till tabellen – inte ens att lägga till.
-- Hemsidan anmäler i stället via funktionen nedan, som bara kan lägga till
-- en adress och aldrig avslöjar om adressen redan fanns.
create or replace function public.newsletter_subscribe(p_email text, p_source text default 'nyhetsbrev')
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if v_email is null
     or length(v_email) > 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  insert into newsletter_subscribers (email, source)
  values (v_email, left(coalesce(nullif(trim(p_source), ''), 'nyhetsbrev'), 50))
  on conflict (email) do update
    set unsubscribed_at = null,
        consented_at    = now()
    where newsletter_subscribers.unsubscribed_at is not null;
end;
$$;

revoke execute on function public.newsletter_subscribe(text, text) from public;
grant  execute on function public.newsletter_subscribe(text, text) to anon, authenticated;

commit;

-- ─── 4. Kontroll ─────────────────────────────────────────────────────────
-- Ska ge "No rows returned". Visas rader: hör av dig innan hemsidan
-- publiceras.
select 'policy som gäller anon/alla' as problem,
       schemaname || '.' || tablename || ' – ' || policyname || ' (' || cmd || ')' as detalj
from pg_policies
where schemaname in ('public', 'storage')
  and roles && array['anon', 'public']::name[]
union all
select 'tabell utan RLS', 'public.' || tablename
from pg_tables
where schemaname = 'public' and not rowsecurity;
