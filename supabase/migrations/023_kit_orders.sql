-- 023: Beställningar av stickkit från hemsidan (t.ex. Haugvag i Chamotte).
--
-- Hemsidan beställer via funktionen kit_order_create och kan aldrig läsa listan.
-- Priser sparas med beställningen så att de stämmer även om de ändras senare.
--
-- Kräver 014. Kör hela filen i Supabase SQL Editor.
-- Filen går att köra flera gånger. Ingen data raderas.

begin;

create table if not exists kit_orders (
  id             uuid primary key default gen_random_uuid(),
  kit_slug       text not null,
  name           text not null,
  email          text not null,
  phone          text,
  delivery       text not null default 'hamta',
  address        text,
  size           text,
  qty_dark       integer not null default 0,
  qty_mid        integer not null default 0,
  qty_light      integer not null default 0,
  qty_book       integer not null default 0,
  qty_accent     integer not null default 0,
  accent_colors  text,
  message        text,
  total_sek      numeric(10,2) not null default 0,
  status         text not null default 'ny',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint kit_orders_slug_format check (kit_slug ~ '^[a-z0-9-]{1,60}$'),
  constraint kit_orders_delivery    check (delivery in ('hamta', 'skicka')),
  constraint kit_orders_status      check (status in ('ny', 'bekraftad', 'skickad', 'hamtad', 'avbruten')),
  constraint kit_orders_qty_range   check (
    qty_dark between 0 and 50 and qty_mid between 0 and 50 and qty_light between 0 and 50
    and qty_book between 0 and 10 and qty_accent between 0 and 50)
);

create index if not exists kit_orders_created_idx on kit_orders (created_at desc);

alter table kit_orders enable row level security;

drop policy if exists "Authenticated users can do everything on kit_orders" on kit_orders;
create policy "Authenticated users can do everything on kit_orders"
  on kit_orders for all to authenticated using (true) with check (true);

create or replace function public.kit_order_create(
  p_kit           text,
  p_name          text,
  p_email         text,
  p_phone         text,
  p_delivery      text,
  p_address       text,
  p_size          text,
  p_qty_dark      integer,
  p_qty_mid       integer,
  p_qty_light     integer,
  p_qty_book      integer,
  p_qty_accent    integer,
  p_accent_colors text,
  p_message       text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kit   text := lower(trim(p_kit));
  v_name  text := trim(p_name);
  v_email text := lower(trim(p_email));
  v_dark  integer := coalesce(p_qty_dark, 0);
  v_mid   integer := coalesce(p_qty_mid, 0);
  v_light integer := coalesce(p_qty_light, 0);
  v_book  integer := coalesce(p_qty_book, 0);
  v_acc   integer := coalesce(p_qty_accent, 0);
begin
  if v_kit is null or v_kit !~ '^[a-z0-9-]{1,60}$' then
    raise exception 'invalid_kit' using errcode = '22023';
  end if;
  if v_name is null or length(v_name) not between 1 and 100 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;
  if v_email is null
     or length(v_email) > 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if p_delivery not in ('hamta', 'skicka') then
    raise exception 'invalid_delivery' using errcode = '22023';
  end if;
  -- Postadress krävs för alla beställningar, även vid hämtning i studion
  if length(trim(coalesce(p_address, ''))) < 10 then
    raise exception 'missing_address' using errcode = '22023';
  end if;
  if v_dark + v_mid + v_light + v_book + v_acc = 0 then
    raise exception 'empty_order' using errcode = '22023';
  end if;
  -- Spärr mot skräpbeställningar: högst 3 per e-post och 30 totalt per timme
  if (select count(*) from kit_orders where email = v_email and created_at > now() - interval '1 hour') >= 3
     or (select count(*) from kit_orders where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'too_many_orders' using errcode = '22023';
  end if;

  insert into kit_orders (kit_slug, name, email, phone, delivery, address, size,
                          qty_dark, qty_mid, qty_light, qty_book, qty_accent,
                          accent_colors, message, total_sek)
  values (v_kit, v_name, v_email,
          nullif(left(trim(coalesce(p_phone, '')), 40), ''),
          p_delivery,
          nullif(left(trim(coalesce(p_address, '')), 300), ''),
          nullif(left(trim(coalesce(p_size, '')), 40), ''),
          v_dark, v_mid, v_light, v_book, v_acc,
          nullif(left(trim(coalesce(p_accent_colors, '')), 200), ''),
          nullif(left(trim(coalesce(p_message, '')), 1000), ''),
          -- Priser för Haugvag-kitet: Chamotte 250 kr/100 g, bok 395 kr, accentfärg 60 kr/20 g
          (v_dark + v_mid + v_light) * 250 + v_book * 395 + v_acc * 60);
end;
$$;

revoke execute on function public.kit_order_create(text, text, text, text, text, text, text,
  integer, integer, integer, integer, integer, text, text) from public;
grant  execute on function public.kit_order_create(text, text, text, text, text, text, text,
  integer, integer, integer, integer, integer, text, text) to anon, authenticated;

commit;
