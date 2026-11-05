-- 025: Fler beställningssidor i kit_orders – boken Sticka tidlösa plagg (kan fås signerad).
--
-- kit_order_create räknar nu priset per kit och tar bara emot kända kit.
-- Hemsidans formulär för Haugvag fungerar som förut (p_signed har standardvärde).
--
-- Kräver 023. Kör hela filen i Supabase SQL Editor.
-- Filen går att köra flera gånger. Ingen data raderas.

begin;

alter table kit_orders add column if not exists book_signed boolean not null default false;

-- Den gamla versionen (14 parametrar) tas bort, annars blir anropet tvetydigt
drop function if exists public.kit_order_create(text, text, text, text, text, text, text,
  integer, integer, integer, integer, integer, text, text);

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
  p_message       text,
  p_signed        boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kit    text := lower(trim(p_kit));
  v_name   text := trim(p_name);
  v_email  text := lower(trim(p_email));
  v_dark   integer := coalesce(p_qty_dark, 0);
  v_mid    integer := coalesce(p_qty_mid, 0);
  v_light  integer := coalesce(p_qty_light, 0);
  v_book   integer := coalesce(p_qty_book, 0);
  v_acc    integer := coalesce(p_qty_accent, 0);
  v_signed boolean := coalesce(p_signed, false);
  v_total  numeric(10,2);
begin
  -- Priser per kit
  if v_kit = 'haugvag-chamotte' then
    -- Chamotte 250 kr/100 g, boken Ön och skogen 395 kr, accentfärg 60 kr/20 g
    v_total := (v_dark + v_mid + v_light) * 250 + v_book * 395 + v_acc * 60;
    v_signed := false;
  elsif v_kit = 'sticka-tidlosa-plagg' then
    -- Bara boken, 259 kr, signerad om man vill
    if v_dark + v_mid + v_light + v_acc > 0 then
      raise exception 'invalid_items' using errcode = '22023';
    end if;
    v_total := v_book * 259;
  else
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
                          accent_colors, message, total_sek, book_signed)
  values (v_kit, v_name, v_email,
          nullif(left(trim(coalesce(p_phone, '')), 40), ''),
          p_delivery,
          nullif(left(trim(coalesce(p_address, '')), 300), ''),
          nullif(left(trim(coalesce(p_size, '')), 40), ''),
          v_dark, v_mid, v_light, v_book, v_acc,
          nullif(left(trim(coalesce(p_accent_colors, '')), 200), ''),
          nullif(left(trim(coalesce(p_message, '')), 1000), ''),
          v_total, v_signed);
end;
$$;

revoke execute on function public.kit_order_create(text, text, text, text, text, text, text,
  integer, integer, integer, integer, integer, text, text, boolean) from public;
grant  execute on function public.kit_order_create(text, text, text, text, text, text, text,
  integer, integer, integer, integer, integer, text, text, boolean) to anon, authenticated;

commit;
