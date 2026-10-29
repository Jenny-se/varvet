-- 017: Anmälningar till event (t.ex. AVSTICKAREN)
--
-- Varje event har en kort kod (event_slug), t.ex. 'avstickaren-2026-11-12'.
-- Hemsidan anmäler via funktionen event_register och kan aldrig läsa listan.
-- Anmäler sig samma e-post igen till samma event uppdateras anmälan.
--
-- Kräver 014–016. Kör hela filen i Supabase SQL Editor.
-- Filen går att köra flera gånger. Ingen data raderas.

begin;

create table if not exists event_registrations (
  id           uuid primary key default gen_random_uuid(),
  event_slug   text not null,
  name         text not null,
  email        text not null,
  guests       integer not null default 1,
  wants_soup   boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  cancelled_at timestamptz,
  constraint event_reg_slug_format  check (event_slug ~ '^[a-z0-9-]{1,60}$'),
  constraint event_reg_name_length  check (length(name) between 1 and 100),
  constraint event_reg_email_lower  check (email = lower(email)),
  constraint event_reg_guests_range check (guests between 1 and 6)
);

create unique index if not exists event_reg_one_active_per_email
  on event_registrations (event_slug, email)
  where cancelled_at is null;

alter table event_registrations enable row level security;

drop policy if exists "Authenticated users can do everything on event_registrations"
  on event_registrations;
create policy "Authenticated users can do everything on event_registrations"
  on event_registrations for all to authenticated using (true) with check (true);

create or replace function public.event_register(
  p_event      text,
  p_name       text,
  p_email      text,
  p_guests     integer default 1,
  p_wants_soup boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event text := lower(trim(p_event));
  v_name  text := trim(p_name);
  v_email text := lower(trim(p_email));
begin
  if v_event is null or v_event !~ '^[a-z0-9-]{1,60}$' then
    raise exception 'invalid_event' using errcode = '22023';
  end if;
  if v_name is null or length(v_name) not between 1 and 100 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;
  if v_email is null
     or length(v_email) > 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if p_guests is null or p_guests not between 1 and 6 then
    raise exception 'invalid_guests' using errcode = '22023';
  end if;

  insert into event_registrations (event_slug, name, email, guests, wants_soup)
  values (v_event, v_name, v_email, p_guests, coalesce(p_wants_soup, false))
  on conflict (event_slug, email) where cancelled_at is null do update
    set name       = excluded.name,
        guests     = excluded.guests,
        wants_soup = excluded.wants_soup,
        updated_at = now();
end;
$$;

revoke execute on function public.event_register(text, text, text, integer, boolean) from public;
grant  execute on function public.event_register(text, text, text, integer, boolean) to anon, authenticated;

-- Sammanställning per event: antal anmälningar, personer och soppor.
create or replace view event_registration_summary
  with (security_invoker = true) as
select event_slug,
       count(*)                                   as anmalningar,
       sum(guests)                                as personer,
       sum(case when wants_soup then guests end)  as soppor
from event_registrations
where cancelled_at is null
group by event_slug;

revoke all on event_registration_summary from anon, public;
grant select on event_registration_summary to authenticated;

commit;

-- Kontroll: kolumnerna i tabellen.
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'event_registrations'
order by ordinal_position;
