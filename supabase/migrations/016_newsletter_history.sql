-- 016: Historik för nyhetsbrevsprenumeranter
--
-- Varje prenumerationsperiod blir en egen rad:
--   newsletter_optin_timestamp  – när personen anmälde sig
--   newsletter_optout_timestamp – när personen avslutade (null = aktiv)
--
-- Anmäler sig någon igen efter att ha avslutat skapas en NY rad, så den
-- gamla perioden finns kvar som historik. En adress kan bara ha en aktiv rad.
--
-- Befintliga rader behålls – kolumnerna byter bara namn.
-- Kör hela filen i Supabase SQL Editor. Filen går att köra flera gånger.

begin;

-- ─── 1. Byt namn på kolumnerna ──────────────────────────────────────────
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'newsletter_subscribers'
               and column_name = 'consented_at') then
    alter table newsletter_subscribers
      rename column consented_at to newsletter_optin_timestamp;
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'newsletter_subscribers'
               and column_name = 'unsubscribed_at') then
    alter table newsletter_subscribers
      rename column unsubscribed_at to newsletter_optout_timestamp;
  end if;
end $$;

-- ─── 2. Tillåt flera rader per adress, men bara en aktiv ────────────────
alter table newsletter_subscribers
  drop constraint if exists newsletter_subscribers_email_key;

create unique index if not exists newsletter_one_active_per_email
  on newsletter_subscribers (email)
  where newsletter_optout_timestamp is null;

create index if not exists newsletter_subscribers_email_idx
  on newsletter_subscribers (email);

alter table newsletter_subscribers
  drop constraint if exists newsletter_optout_after_optin;
alter table newsletter_subscribers
  add constraint newsletter_optout_after_optin
  check (newsletter_optout_timestamp is null
         or newsletter_optout_timestamp >= newsletter_optin_timestamp);

-- ─── 3. Anmälningsfunktionen: ny rad om ingen aktiv finns ───────────────
-- Samma namn och parametrar som förut, så hemsidan behöver inte ändras.
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
  on conflict (email) where newsletter_optout_timestamp is null do nothing;
end;
$$;

revoke execute on function public.newsletter_subscribe(text, text) from public;
grant  execute on function public.newsletter_subscribe(text, text) to anon, authenticated;

-- ─── 4. Vy med bara aktiva prenumeranter (för utskick/export) ───────────
-- security_invoker gör att vyn följer tabellens RLS, så anon ser inget.
create or replace view newsletter_active_subscribers
  with (security_invoker = true) as
select id, email, source, newsletter_optin_timestamp
from newsletter_subscribers
where newsletter_optout_timestamp is null;

revoke all on newsletter_active_subscribers from anon, public;
grant select on newsletter_active_subscribers to authenticated;

commit;

-- Kontroll: kolumnerna i tabellen.
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'newsletter_subscribers'
order by ordinal_position;
