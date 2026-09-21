-- ============================================================
-- Shopify produktimport for Varvet CRM
-- Kör i Supabase SQL Editor. Säkert att köra flera gånger.
-- ============================================================

-- 1. Produktlista för kvitton (receipt_products)
-- 28 unika produkter
-- ============================================================
INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Rauma Finull', 60, 25, true, 1
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Rauma Finull');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Rauma Lamull', 69, 25, true, 2
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Rauma Lamull');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Rauma Fivel', 54, 25, true, 3
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Rauma Fivel');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Rauma Plum', 0, 25, true, 4
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Rauma Plum');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Ístex Lettlopi', 62, 25, true, 5
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Ístex Lettlopi');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Big Ring Scissors with 3 Colors', 0, 25, true, 6
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Big Ring Scissors with 3 Colors');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Sunflower Scissors bright yellow', 0, 25, true, 7
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Sunflower Scissors bright yellow');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Xolla Pastoreta', 90, 25, true, 8
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Xolla Pastoreta');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Xolla Bauma', 90, 25, true, 9
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Xolla Bauma');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Xolla Païssa', 95, 25, true, 10
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Xolla Païssa');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Xolla Peülla', 95, 25, true, 11
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Xolla Peülla');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Empty Needle Case-Ändsticka', 0, 25, true, 12
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Empty Needle Case-Ändsticka');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Ändstickor fodral Black Grey Ikat', 0, 25, true, 13
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Ändstickor fodral Black Grey Ikat');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Lantern Moon Heritage - Set med ändstickor (5 par, 10 cm)', 0, 25, true, 14
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Lantern Moon Heritage - Set med ändstickor (5 par, 10 cm)');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm', 0, 25, true, 15
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'ChiaoGoo SS Red Lace rundsticka 60 cm');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm', 0, 25, true, 16
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'ChiaoGoo SS Red Lace rundsticka 80 cm');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'ChiaoGoo SS Red Lace rundsticka 100 cm', 0, 25, true, 17
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'ChiaoGoo SS Red Lace rundsticka 100 cm');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm', 0, 25, true, 18
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'ChiaoGoo TWIST Lace ändstickor 10 cm');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'ChiaoGoo TWIST Lace ändstickor 13 cm', 0, 25, true, 19
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'ChiaoGoo TWIST Lace ändstickor 13 cm');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'ChiaoGoo TWIST Red kabel Small', 0, 25, true, 20
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'ChiaoGoo TWIST Red kabel Small');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'ChiaoGoo kabelanslutning [S] (2 st)', 0, 25, true, 21
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'ChiaoGoo kabelanslutning [S] (2 st)');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Aluminium flätstickor set av 2 st (2.50,4.00mm)', 0, 25, true, 22
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Aluminium flätstickor set av 2 st (2.50,4.00mm)');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Flätstickor art 60610 SVF-5 kartor/fp (860610)', 0, 25, true, 23
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Flätstickor art 60610 SVF-5 kartor/fp (860610)');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Wool Softener Lopi 500 ml', 0, 25, true, 24
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Wool Softener Lopi 500 ml');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Wool Soap Lopi 500 ml', 0, 25, true, 25
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Wool Soap Lopi 500 ml');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Lantern Moon Charm - Set med ändstickor (5 par, 13 cm)', 0, 25, true, 26
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Lantern Moon Charm - Set med ändstickor (5 par, 13 cm)');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Foundations: 20 Knitted Accessories', 0, 6, true, 27
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Foundations: 20 Knitted Accessories');

INSERT INTO receipt_products (name, default_price, vat_rate, active, sort_order)
SELECT 'Shetland Shades: Stories in Wool', 0, 6, true, 28
WHERE NOT EXISTS (SELECT 1 FROM receipt_products WHERE name = 'Shetland Shades: Stories in Wool');


-- 2. Lager (inventory) — alla varianter
-- ============================================================
INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044076 Mørk sennepsgul', 0, 60, NULL, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044076'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044076 Mørk sennepsgul');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004414 Koksgrå Melert', 0, 60, NULL, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004414'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004414 Koksgrå Melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004436 Svart', 0, 60, NULL, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004436'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004436 Svart');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004466 Mørk gammelrosa', 0, 60, NULL, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004466'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004466 Mørk gammelrosa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004400 Hvit', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004400'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004400 Hvit');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004401 Natur', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004401'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004401 Natur');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044014 Skogsgrønn', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044014'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044014 Skogsgrønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004403 Lys grå Melert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004403'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004403 Lys grå Melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044036 Jeansblå', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044036'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044036 Jeansblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004405 Mørk grå Melert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004405'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004405 Mørk grå Melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004406 Beige Melert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004406'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004406 Beige Melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044078 Lys beige melert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044078'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044078 Lys beige melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004410 Sauesvart', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004410'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004410 Sauesvart');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004411 Brun Melert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004411'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004411 Brun Melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044120 Rød mørkmelert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044120'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044120 Rød mørkmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044122 Mørk grønn mørk melert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044122'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044122 Mørk grønn mørk melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044123 Mørk Petrol mørkmelert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044123'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044123 Mørk Petrol mørkmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044124 Blå mørkmelert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044124'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044124 Blå mørkmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044125 Okergul mørkmelert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044125'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044125 Okergul mørkmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044127 Petrol mørkmelert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044127'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044127 Petrol mørkmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044129 Mosegrønn mørkmelert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044129'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044129 Mosegrønn mørkmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044130 Grønn mørkmelert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044130'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044130 Grønn mørkmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044133 Lys rosa lysmelert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044133'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044133 Lys rosa lysmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044136 Mintgrønn lysmelert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044136'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044136 Mintgrønn lysmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044139 Lys blå lysmelert', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044139'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044139 Lys blå lysmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004418 Høyrød', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004418'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004418 Høyrød');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044215 Jadegrønn', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044215'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044215 Jadegrønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004422 Mørk brun', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004422'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004422 Mørk brun');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004432 Dyp grønn', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004432'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004432 Dyp grønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004435 Mørk rød', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004435'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004435 Mørk rød');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004438 Bondeblå', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004438'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004438 Bondeblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044423 Bunadsgrønn', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044423'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044423 Bunadsgrønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044447 Bunadsblå', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044447'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044447 Bunadsblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004449 Mørk blå', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004449'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004449 Mørk blå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004452 Gråbeige', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004452'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004452 Gråbeige');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044571 Gammelrosa', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044571'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044571 Gammelrosa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004459 Marineblå', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004459'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004459 Marineblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004464 Rødbrun Melert', 20, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004464'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004464 Rødbrun Melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '004467 Kongeblå', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-004467'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '004467 Kongeblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Finull', '0044686 Skarp rosa', 10, 60, 23.4, 'yarn', ARRAY['garn','ull','rauma','finull']::text[], 5, 'SKU: RAU-FINULL-0044686'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Finull' AND colorway = '0044686 Skarp rosa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01011 Natur', 0, 69, NULL, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01011'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01011 Natur');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '010112 Spiregrønn', 0, 69, NULL, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-010112'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '010112 Spiregrønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01031 Dyp grønn', 0, 69, NULL, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01031'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01031 Dyp grønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '010411 Brun melert', 0, 69, NULL, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-010411'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '010411 Brun melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01005 Mørk grå melert', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01005'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01005 Mørk grå melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01010 Hvit', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01010'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01010 Hvit');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '010105 Lavendel', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-010105'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '010105 Lavendel');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '010125 Kasjmir', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-010125'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '010125 Kasjmir');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01013 Grå melert', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01013'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01013 Grå melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01022 Lys blå', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01022'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01022 Lys blå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01026 Gråblå', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01026'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01026 Gråblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01027 Guloransje', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01027'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01027 Guloransje');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01029 Kobberrød', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01029'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01029 Kobberrød');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01034 Brun', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01034'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01034 Brun');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01035 Mørk rød', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01035'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01035 Mørk rød');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01037 Blå puddel', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01037'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01037 Blå puddel');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01038 Rosa sky', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01038'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01038 Rosa sky');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '0104078 Lys beige melert', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-0104078'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '0104078 Lys beige melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '010422 Mørk brun', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-010422'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '010422 Mørk brun');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '010437 Blå', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-010437'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '010437 Blå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '010496 Rødlilla', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-010496'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '010496 Rødlilla');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01051 Himmelblå', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01051'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01051 Himmelblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01054 Jadegrønn', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01054'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01054 Jadegrønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01057 Marineblå', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01057'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01057 Marineblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01068 Bondeblå', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01068'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01068 Bondeblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01070 Lys turkis', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01070'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01070 Lys turkis');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01094 Mørk grønn', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01094'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01094 Mørk grønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Lamull', '01095 Tomatrød', 10, 69, 28.44, 'yarn', ARRAY['garn','ull','rauma','lamull']::text[], 5, 'SKU: RAU-LAMULL-01095'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Lamull' AND colorway = '01095 Tomatrød');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02001 Natur', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02001'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02001 Natur');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02002 Mørk rød', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02002'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02002 Mørk rød');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02003 Mørk blå', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02003'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02003 Mørk blå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02004 Gråbeige', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02004'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02004 Gråbeige');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02007 Himmelblå', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02007'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02007 Himmelblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02009 Marineblå', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02009'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02009 Marineblå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02013 Rosa', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02013'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02013 Rosa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02015 Lys rosa', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02015'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02015 Lys rosa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02016 Skogsgrønn', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02016'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02016 Skogsgrønn');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '020206 Beige melert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-020206'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '020206 Beige melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02021 Blå', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02021'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02021 Blå');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '020214 Koksgrå melert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-020214'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '020214 Koksgrå melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '020300 Lys grå naturmelert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-020300'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '020300 Lys grå naturmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '020302 Sand melert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-020302'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '020302 Sand melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '02036 Svart', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-02036'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '02036 Svart');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '020400 Mørk grå naturmelert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-020400'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '020400 Mørk grå naturmelert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '020402 Mørk petrol melert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-020402'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '020402 Mørk petrol melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '020403 Mørk sjokolade melert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-020403'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '020403 Mørk sjokolade melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Fivel', '0204078 Lys beige melert', 10, 54, 22.32, 'yarn', ARRAY['garn','ull','rauma','fivel']::text[], 5, 'SKU: RAU-FIVEL-0204078'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Fivel' AND colorway = '0204078 Lys beige melert');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Rauma Plum', '286080 MOHAIR Mørk brun', 10, NULL, 21.8, 'yarn', ARRAY['garn','ull','rauma','plum']::text[], 5, 'SKU: RAU-PLUM-286080'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Rauma Plum' AND colorway = '286080 MOHAIR Mørk brun');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11404 Glacier Blue Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11404'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11404 Glacier Blue Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11405 Bottle Green Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11405'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11405 Bottle Green Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11407 Pine Green Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11407'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11407 Pine Green Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11409 Garnet Red Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11409'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11409 Garnet Red Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11412 Pink Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11412'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11412 Pink Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11414 Violet Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11414'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11414 Violet Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11415 Rough Sea', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11415'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11415 Rough Sea');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11416 Moor', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11416'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11416 Moor');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11417 Frostbite', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11417'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11417 Frostbite');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11418 Straw', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11418'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11418 Straw');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11419 Barley', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11419'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11419 Barley');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11420 Murky', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11420'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11420 Murky');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11700 Air Blue', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11700'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11700 Air Blue');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11701 Fjord Blue', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11701'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11701 Fjord Blue');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11702 Milkyway', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11702'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11702 Milkyway');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11703 Mimosa', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11703'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11703 Mimosa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11704 Apricot', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11704'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11704 Apricot');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11705 Royal Fuchsia', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11705'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11705 Royal Fuchsia');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11706 Lyme Grass', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11706'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11706 Lyme Grass');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11707 Galaxy', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11707'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11707 Galaxy');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19418 Stone Blue Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19418'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19418 Stone Blue Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19419 Ocean Blue', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19419'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19419 Ocean Blue');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19420 Navy Blue', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19420'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19420 Navy Blue');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19421 Celery Green Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19421'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19421 Celery Green Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19423 Lagoon Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19423'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19423 Lagoon Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19426 Golden Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19426'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19426 Golden Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19431 Brick Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19431'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19431 Brick Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19432 Grape Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19432'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19432 Grape Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19434 Crimson Red', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19434'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19434 Crimson Red');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10057 Grey Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10057'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10057 Grey Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '19427 Rust Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-19427'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '19427 Rust Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10867 Chocolate Heather', 30, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10867'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10867 Chocolate Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10005 Black Heather', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10005'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10005 Black Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10051 White', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10051'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10051 White');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10052 Black Sheep', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10052'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10052 Black Sheep');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10053 Acorn Heather', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10053'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10053 Acorn Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10056 Ash Heather', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10056'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10056 Ash Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10058 Dark Grey Heather', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10058'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10058 Dark Grey Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10059 Black', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10059'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10059 Black');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10085 Oatmeal Heather', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10085'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10085 Oatmeal Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '10086 Light Beige Heather', 20, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-10086'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '10086 Light Beige Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ístex Lettlopi', '11403 Lapis Blue Heather', 10, 62, 27.6, 'yarn', ARRAY['garn','ull','istex','lettlopi']::text[], 5, 'SKU: LET-11403'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ístex Lettlopi' AND colorway = '11403 Lapis Blue Heather');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Big Ring Scissors with 3 Colors', NULL, 75, NULL, 3.5, 'accessories', ARRAY['tillbehör','sax','broderisax']::text[], 5, 'SKU: ESC-BIGRING-27'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Big Ring Scissors with 3 Colors' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Sunflower Scissors bright yellow', NULL, 25, NULL, 3.5, 'accessories', ARRAY['tillbehör','sax','broderisax']::text[], 5, 'SKU: ESC-SUNFLOWER-25'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Sunflower Scissors bright yellow' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Fum', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-FUM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Fum');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Civada', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-CIVADA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Civada');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Pol·len', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-POLLEN'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Pol·len');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Boixac', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-BOIXAC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Boixac');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Aram', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-ARAM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Aram');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Rumex', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-RUMEX'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Rumex');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Gavarró', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-GAVARRO'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Gavarró');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Cirera', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-CIRERA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Cirera');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Garnatxa', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-GARNATXA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Garnatxa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Nigritella', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-NIGRITELLA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Nigritella');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Matafoc', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-MATAFOC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Matafoc');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Bruc', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-BRUC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Bruc');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Orquidia', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-ORQUIDIA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Orquidia');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Figa', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-FIGA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Figa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Gaig', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-GAIG'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Gaig');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Marina', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-MARINA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Marina');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Oceà', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-OCEA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Oceà');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Nit', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-NIT'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Nit');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Tramuntana', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-TRAMUNTANA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Tramuntana');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Xarxet', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-XARXET'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Xarxet');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Oli', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-OLI'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Oli');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Alzina', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-ALZINA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Alzina');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Falguera', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-FALGUERA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Falguera');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Tahina', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-TAHINA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Tahina');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Mel', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-MEL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Mel');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Castanya', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-CASTANYA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Castanya');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Còdol', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-CODOL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Còdol');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Pardal', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-PARDAL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Pardal');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Pastoreta', 'Burella', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','pastoreta','spanien','non-superwash']::text[], 5, 'SKU: XOL-PASTORETA-BURELLA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Pastoreta' AND colorway = 'Burella');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Fum', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-FUM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Fum');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Civada', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-CIVADA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Civada');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Pol·len', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-POLLEN'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Pol·len');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Boixac', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-BOIXAC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Boixac');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Aram', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-ARAM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Aram');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Rumex', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-RUMEX'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Rumex');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Gavarró', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-GAVARRO'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Gavarró');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Cirera', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-CIRERA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Cirera');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Garnatxa', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-GARNATXA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Garnatxa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Nigritella', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-NIGRITELLA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Nigritella');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Matafoc', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-MATAFOC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Matafoc');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Bruc', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-BRUC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Bruc');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Orquidia', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-ORQUIDIA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Orquidia');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Figa', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-FIGA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Figa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Gaig', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-GAIG'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Gaig');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Oceà', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-OCEA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Oceà');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Nit', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-NIT'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Nit');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Tramuntana', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-TRAMUNTANA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Tramuntana');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Xarxet', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-XARXET'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Xarxet');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Oli', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-OLI'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Oli');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Alzina', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-ALZINA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Alzina');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Tahina', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-TAHINA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Tahina');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Mel', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-MEL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Mel');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Castanya', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-CASTANYA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Castanya');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Còdol', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-CODOL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Còdol');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Bauma', 'Pardal', 10, 90, 4.18, 'yarn', ARRAY['garn','ull','xolla','bauma','spanien','non-superwash']::text[], 5, 'SKU: XOL-BAUMA-PARDAL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Bauma' AND colorway = 'Pardal');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Orxata', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-ORXATA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Orxata');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Colom', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-COLOM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Colom');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Caramel', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-CARAMEL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Caramel');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Sèsam', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-SESAM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Sèsam');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Carbassa', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-CARBASSA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Carbassa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Coure', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-COURE'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Coure');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Gavarró', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-GAVARRO'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Gavarró');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Gallaret', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-GALLARET'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Gallaret');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Most', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-MOST'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Most');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Valeriana', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-VALERIANA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Valeriana');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Marcòlic', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-MARCOLIC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Marcòlic');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Dalia', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-DALIA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Dalia');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Breva', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-BREVA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Breva');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Genciana', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-GENCIANA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Genciana');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Brisa', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-BRISA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Brisa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Maror', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-MAROR'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Maror');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Drôme', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-DROME'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Drôme');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Abissal', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-ABISSAL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Abissal');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Festuc', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-FESTUC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Festuc');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Païssa', 'Molsa', 10, 95, 4.655, 'yarn', ARRAY['garn','ull','xolla','paissa','spanien','non-superwash']::text[], 5, 'SKU: XOL-PAISSA-MOLSA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Païssa' AND colorway = 'Molsa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Orxata', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-ORXATA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Orxata');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Colom', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-COLOM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Colom');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Caramel', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-CARAMEL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Caramel');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Sèsam', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-SESAM'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Sèsam');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Carbassa', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-CARBASSA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Carbassa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Coure', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-COURE'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Coure');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Gavarró', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-GAVARRO'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Gavarró');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Gallaret', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-GALLARET'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Gallaret');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Most', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-MOST'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Most');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Valeriana', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-VALERIANA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Valeriana');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Marcòlic', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-MARCOLIC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Marcòlic');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Dalia', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-DALIA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Dalia');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Caputxina', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-CAPUTXINA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Caputxina');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Breva', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-BREVA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Breva');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Genciana', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-GENCIANA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Genciana');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Brisa', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-BRISA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Brisa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Maror', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-MAROR'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Maror');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Drôme', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-DROME'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Drôme');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Abissal', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-ABISSAL'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Abissal');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Festuc', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-FESTUC'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Festuc');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Xolla Peülla', 'Molsa', 10, 95, 4.6075, 'yarn', ARRAY['garn','ull','xolla','peulla','spanien','non-superwash']::text[], 5, 'SKU: XOL-PEULLA-MOLSA'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Xolla Peülla' AND colorway = 'Molsa');

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Empty Needle Case-Ändsticka', NULL, 1, NULL, 174.5, 'accessories', ARRAY['tillbehör','nordana','crafts']::text[], 5, 'SKU: NOR-9350704'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Empty Needle Case-Ändsticka' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Ändstickor fodral Black Grey Ikat', NULL, 1, NULL, 174.5, 'accessories', ARRAY['tillbehör','nordana','crafts']::text[], 5, 'SKU: NOR-9350723'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Ändstickor fodral Black Grey Ikat' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Lantern Moon Heritage - Set med ändstickor (5 par, 10 cm)', NULL, 2, NULL, 499.5, 'needles', ARRAY['stickor','lantern','moon']::text[], 5, 'SKU: NOR-9350312'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Lantern Moon Heritage - Set med ändstickor (5 par, 10 cm)' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 3.25 mm', NULL, 6, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-6070243'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 3.25 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 3.5 mm', NULL, 6, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-6070244'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 3.5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 3.75 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-6070245'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 3.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 2.75 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-6070242'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 2.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 3 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-60702425'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 3 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 4.5 mm', NULL, 6, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-6070247'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 4.5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 5 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-6070248'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 60 cm 5.5 mm', NULL, 3, NULL, 88, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','60 cm']::text[], 5, 'SKU: NOR-6070249'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 60 cm 5.5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm 2 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','80 cm']::text[], 5, 'SKU: NOR-6070320'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 80 cm 2 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm 2.25 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','80 cm']::text[], 5, 'SKU: NOR-6070321'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 80 cm 2.25 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm 2.75 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','80 cm']::text[], 5, 'SKU: NOR-6070322'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 80 cm 2.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm 3.25 mm', NULL, 6, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','80 cm']::text[], 5, 'SKU: NOR-6070323'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 80 cm 3.25 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm 3.5 mm', NULL, 6, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','80 cm']::text[], 5, 'SKU: NOR-6070324'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 80 cm 3.5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm 3.75 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','80 cm']::text[], 5, 'SKU: NOR-6070325'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 80 cm 3.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 80 cm 5 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','80 cm']::text[], 5, 'SKU: NOR-6070328'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 80 cm 5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 100 cm 5 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','100 cm']::text[], 5, 'SKU: NOR-6070408'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 100 cm 5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 100 cm 2 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','100 cm']::text[], 5, 'SKU: NOR-6070400'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 100 cm 2 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo SS Red Lace rundsticka 100 cm 2.25 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','rundsticka','red lace','100 cm']::text[], 5, 'SKU: NOR-6070401'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo SS Red Lace rundsticka 100 cm 2.25 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 2.75 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-6075042'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 2.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 3.25 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-6075043'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 3.25 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 3.75 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-6075045'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 3.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 4 mm', NULL, 6, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-6075046'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 4 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 4.5 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-6075047'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 4.5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 5 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-6075048'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 2.25 mm', NULL, 6, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-6075041'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 2.25 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 10 cm 2.5 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','10 cm']::text[], 5, 'SKU: NOR-60750415'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 10 cm 2.5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 13 cm 2.75 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','13 cm']::text[], 5, 'SKU: NOR-6075052'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 13 cm 2.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 13 cm 3.25 mm', NULL, 3, NULL, 71.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','13 cm']::text[], 5, 'SKU: NOR-6075053'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 13 cm 3.25 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 13 cm 3.75 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','13 cm']::text[], 5, 'SKU: NOR-6075055'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 13 cm 3.75 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Lace ändstickor 13 cm 5 mm', NULL, 3, NULL, 79.6, 'needles', ARRAY['stickor','chiaogoo','ändstickor','twist lace','13 cm']::text[], 5, 'SKU: NOR-6075058'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Lace ändstickor 13 cm 5 mm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Red kabel Small 75 cm', NULL, 3, NULL, 57.6, 'accessories', ARRAY['tillbehör','chiaogoo','kabel','twist','small']::text[], 5, 'SKU: NOR-607530S'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Red kabel Small 75 cm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo TWIST Red kabel Small 93 cm', NULL, 6, NULL, 57.6, 'accessories', ARRAY['tillbehör','chiaogoo','kabel','twist','small']::text[], 5, 'SKU: NOR-607537S'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo TWIST Red kabel Small 93 cm' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'ChiaoGoo kabelanslutning [S] (2 st)', NULL, 6, NULL, 27.6, 'accessories', ARRAY['tillbehör','chiaogoo']::text[], 5, 'SKU: NOR-602501S'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'ChiaoGoo kabelanslutning [S] (2 st)' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Aluminium flätstickor set av 2 st (2.50,4.00mm)', NULL, 3, NULL, 15.6, 'accessories', ARRAY['tillbehör','nordana','crafts']::text[], 5, 'SKU: NOR-945501'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Aluminium flätstickor set av 2 st (2.50,4.00mm)' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Flätstickor art 60610 SVF-5 kartor/fp (860610)', NULL, 5, NULL, 12, 'accessories', ARRAY['tillbehör','nordana','crafts']::text[], 5, 'SKU: NOR-266058'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Flätstickor art 60610 SVF-5 kartor/fp (860610)' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Wool Softener Lopi 500 ml', NULL, 3, NULL, 103.6, 'accessories', ARRAY['tillbehör','istex']::text[], 5, 'SKU: NOR-80548'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Wool Softener Lopi 500 ml' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Wool Soap Lopi 500 ml', NULL, 3, NULL, 103.6, 'accessories', ARRAY['tillbehör','istex']::text[], 5, 'SKU: NOR-80547'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Wool Soap Lopi 500 ml' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Lantern Moon Charm - Set med ändstickor (5 par, 13 cm)', NULL, 1, NULL, 499.5, 'needles', ARRAY['stickor','lantern','moon']::text[], 5, 'SKU: NOR-9350304'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Lantern Moon Charm - Set med ändstickor (5 par, 13 cm)' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Foundations: 20 Knitted Accessories', NULL, 2, NULL, NULL, 'accessories', ARRAY['bok','stickning','laine publishing','engelska']::text[], 5, 'SKU: LAINE-FOUNDATIONS20'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Foundations: 20 Knitted Accessories' AND colorway IS NULL);

INSERT INTO inventory (product_name, colorway, quantity_in_stock, retail_price, cost_price, category, tags, low_stock_threshold, notes)
SELECT 'Shetland Shades: Stories in Wool', NULL, 5, NULL, NULL, 'accessories', ARRAY['bok','stickning','laine publishing','engelska']::text[], 5, 'SKU: LAINE-SHETLANDSHADES'
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_name = 'Shetland Shades: Stories in Wool' AND colorway IS NULL);

-- Klart!

