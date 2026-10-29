-- 020: Artiklar som finns i Shopify men saknades i appens lager.
-- Kör efter 018 och 019. Säker att köra flera gånger.
--
-- * Saxen "Big Ring Scissors" är nu "Sax med stora öglor" med tre färger
--   (25 st var, totalt 75 som tidigare). Orange behåller sitt artikelnummer.
-- * Varvet Chamotte läggs in med saldo 0 – rätt saldo kommer från inventeringen.
-- * Fyra nya ChiaoGoo-storlekar och fyra nya böcker med saldo, pris och inköp från Shopify.
--
-- Artikelnumren för Chamotte och saxen Grön/Turkos är satta i Shopify (2026-10-29).

begin;

-- Saxen: dela upp i tre färger
update inventory
set product_name      = 'Sax med stora öglor',
    colorway          = 'Orange',
    quantity_in_stock = 25,
    retail_price      = 135.00,
    updated_at        = now()
where sku = 'ESC-BIGRING-27'
  and colorway is null;

insert into inventory (sku, product_name, colorway, quantity_in_stock, retail_price, cost_price, category,
                       yarn_weight, fiber_content, meterage_per_skein, needle_size_recommendation)
values
  ('ESC-BIGRING-GRON',   'Sax med stora öglor', 'Grön',   25, 135.00,  35.00, 'accessories', null, null, null, null),
  ('ESC-BIGRING-TURKOS', 'Sax med stora öglor', 'Turkos', 25, 135.00,  35.00, 'accessories', null, null, null, null),

  ('VAR-CHAM-GRATT', 'Varvet Chamotte', 'Grått', 0, 250.00, 122.50, 'yarn', 'DK',
   'Finull, korsningsull och gotlandsull', 250, '3–4 mm'),
  ('VAR-CHAM-SVART', 'Varvet Chamotte', 'Svart', 0, 250.00, 122.50, 'yarn', 'DK',
   'Finull, korsningsull och gotlandsull', 250, '3–4 mm'),
  ('VAR-CHAM-VITT',  'Varvet Chamotte', 'Vitt',  0, 250.00, 122.50, 'yarn', 'DK',
   'Finull, korsningsull och gotlandsull', 250, '3–4 mm'),

  ('NOR-60750425', 'ChiaoGoo TWIST Lace ändstickor 10 cm 3 mm',    null, 6, 149.00, 71.60, 'needles', null, null, null, null),
  ('NOR-6070406',  'ChiaoGoo SS Red Lace rundsticka 100 cm 4 mm',   null, 3, 189.00, 79.60, 'needles', null, null, null, null),
  ('NOR-6070407',  'ChiaoGoo SS Red Lace rundsticka 100 cm 4.5 mm', null, 3, 189.00, 79.60, 'needles', null, null, null, null),
  ('NOR-60703210', 'ChiaoGoo SS Red Lace rundsticka 80 cm 6 mm',    null, 3, 189.00, 88.00, 'needles', null, null, null, null),

  ('MON-STICKA-TIDLOSA', 'Sticka tidlösa plagg – Anna Strandberg',    null, 50, 259.00, 180.00, 'accessories', null, null, null, null),
  ('BON-9789155274757',  'Stickat från kust till kust – Erika Åberg', null,  8, 185.00, 125.00, 'accessories', null, null, null, null),
  ('BON-9789178873111',  'Koftor – Maja Karlsson',                    null,  3, 329.00, 225.00, 'accessories', null, null, null, null),
  ('BON-9789178876174',  'Vinterstickat – Maja Karlsson',             null,  2, 339.00, 220.00, 'accessories', null, null, null, null)
on conflict (sku) where sku is not null do nothing;

commit;

-- Kontroll: ska ge 284 rader, alla med sku (samma antal som varianter i Shopify)
select count(*) as rader, count(sku) as med_sku from inventory;
