-- 029: Beställningssida för Ístex Léttlopi (42 färger, 62 kr/nystan) och nytt pris på Xolla, 95 kr/nystan.
--
-- Samma funktion som i 028, med Léttlopi tillagt och pris per garn.
-- Kräver 028. Kör hela filen i Supabase SQL Editor.
-- Filen går att köra flera gånger. Ingen data raderas.

begin;

alter table kit_orders add column if not exists items jsonb;

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
  p_signed        boolean default false,
  p_items         jsonb default null
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
  v_items  jsonb := null;
  v_units  integer := 0;
  v_total  numeric(10,2);
  v_item   jsonb;
  v_color  text;
  v_qty    integer;
  -- Färgerna som finns i butiken (Shopify, 2026-11-25)
  c_lettlopi text[] := array['10005 Black Heather','10051 White','10052 Black Sheep','10053 Acorn Heather','10056 Ash Heather','10057 Grey Heather','10058 Dark Grey Heather','10059 Black','10085 Oatmeal Heather','10086 Light Beige Heather','10867 Chocolate Heather','11403 Lapis Blue Heather','11404 Glacier Blue Heather','11405 Bottle Green Heather','11407 Pine Green Heather','11409 Garnet Red Heather','11412 Pink Heather','11414 Violet Heather','11415 Rough Sea','11416 Moor','11417 Frostbite','11418 Straw','11419 Barley','11420 Murky','11700 Air Blue','11701 Fjord Blue','11702 Milkyway','11703 Mimosa','11704 Apricot','11705 Royal Fuchsia','11706 Lyme Grass','11707 Galaxy','19418 Stone Blue Heather','19419 Ocean Blue','19420 Navy Blue','19421 Celery Green Heather','19423 Lagoon Heather','19426 Golden Heather','19427 Rust Heather','19431 Brick Heather','19432 Grape Heather','19434 Crimson Red'];
  c_colors text[];
  v_price  integer;
  c_bauma  text[] := array['Alzina','Aram','Boixac','Bruc','Castanya','Cirera','Civada','Còdol',
    'Figa','Fum','Gaig','Garnatxa','Gavarró','Matafoc','Mel','Nigritella','Nit','Oceà','Oli',
    'Orquidia','Pardal','Pol·len','Rumex','Tahina','Tramuntana','Xarxet'];
  c_pastoreta text[] := array['Alzina','Aram','Boixac','Bruc','Burella','Castanya','Cirera','Civada','Còdol','Falguera','Figa','Fum','Gaig','Garnatxa','Gavarró','Marina','Matafoc','Mel','Nigritella','Nit','Oceà','Oli','Orquidia','Pardal','Pol·len','Rumex','Tahina','Tramuntana','Xarxet'];
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
  elsif v_kit in ('xolla-bauma', 'xolla-pastoreta', 'istex-lettlopi') then
    -- Bara färger i p_items. Xolla 95 kr/nystan, Léttlopi 62 kr/nystan
    c_colors := case v_kit when 'xolla-bauma' then c_bauma when 'xolla-pastoreta' then c_pastoreta else c_lettlopi end;
    v_price := case v_kit when 'istex-lettlopi' then 62 else 95 end;
    if v_dark + v_mid + v_light + v_book + v_acc > 0
       or p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 50 then
      raise exception 'invalid_items' using errcode = '22023';
    end if;
    v_items := '[]'::jsonb;
    for v_item in select * from jsonb_array_elements(p_items) loop
      v_color := v_item ->> 'color';
      v_qty := case when (v_item ->> 'qty') ~ '^\d{1,3}$' then (v_item ->> 'qty')::integer else -1 end;
      if v_color is null or not (v_color = any (c_colors)) or v_qty not between 0 and 50 then
        raise exception 'invalid_items' using errcode = '22023';
      end if;
      if v_qty > 0 then
        v_items := v_items || jsonb_build_object('color', v_color, 'qty', v_qty);
        v_units := v_units + v_qty;
      end if;
    end loop;
    v_total := v_units * v_price;
    v_signed := false;
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
  if v_dark + v_mid + v_light + v_book + v_acc + v_units = 0 then
    raise exception 'empty_order' using errcode = '22023';
  end if;
  -- Spärr mot skräpbeställningar: högst 3 per e-post och 30 totalt per timme
  if (select count(*) from kit_orders where email = v_email and created_at > now() - interval '1 hour') >= 3
     or (select count(*) from kit_orders where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'too_many_orders' using errcode = '22023';
  end if;

  insert into kit_orders (kit_slug, name, email, phone, delivery, address, size,
                          qty_dark, qty_mid, qty_light, qty_book, qty_accent,
                          accent_colors, message, total_sek, book_signed, items)
  values (v_kit, v_name, v_email,
          nullif(left(trim(coalesce(p_phone, '')), 40), ''),
          p_delivery,
          nullif(left(trim(coalesce(p_address, '')), 300), ''),
          nullif(left(trim(coalesce(p_size, '')), 40), ''),
          v_dark, v_mid, v_light, v_book, v_acc,
          nullif(left(trim(coalesce(p_accent_colors, '')), 200), ''),
          nullif(left(trim(coalesce(p_message, '')), 1000), ''),
          v_total, v_signed, v_items);
end;
$$;

revoke execute on function public.kit_order_create(text, text, text, text, text, text, text,
  integer, integer, integer, integer, integer, text, text, boolean, jsonb) from public;
grant  execute on function public.kit_order_create(text, text, text, text, text, text, text,
  integer, integer, integer, integer, integer, text, text, boolean, jsonb) to anon, authenticated;

commit;
