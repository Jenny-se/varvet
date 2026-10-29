-- 019: Priser i appens lager från Shopify (Shopify har de senast satta priserna).
-- Uppdaterar försäljningspris (retail_price) och inköpspris (cost_price) per artikelnummer.
-- Kör efter 018. Ändrar inga lagersaldon. Säker att köra flera gånger.

begin;

update inventory as i
set retail_price = v.retail_price,
    cost_price   = v.cost_price,
    updated_at   = now()
from (values
  ('ESC-BIGRING-27', 125.00, 35.00),  -- Big Ring Scissors with 3 Colors: –/3.5 -> 125/35
  ('NOR-602501S', 69.00, 27.60),  -- ChiaoGoo kabelanslutning [S] (2 st): 145/27.6 -> 69/27.6
  ('NOR-6070400', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 100 cm 2 mm: 145/71.6 -> 169/71.6
  ('NOR-6070401', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 100 cm 2.25 mm: 145/71.6 -> 169/71.6
  ('NOR-6070408', 189.00, 79.60),  -- ChiaoGoo SS Red Lace rundsticka 100 cm 5 mm: 145/79.6 -> 189/79.6
  ('NOR-6070242', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 2.75 mm: 145/71.6 -> 169/71.6
  ('NOR-60702425', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 3 mm: 145/71.6 -> 169/71.6
  ('NOR-6070243', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 3.25 mm: 145/71.6 -> 169/71.6
  ('NOR-6070244', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 3.5 mm: 145/71.6 -> 169/71.6
  ('NOR-6070245', 189.00, 79.60),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 3.75 mm: 145/79.6 -> 189/79.6
  ('NOR-6070247', 189.00, 79.60),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 4.5 mm: 145/79.6 -> 189/79.6
  ('NOR-6070248', 189.00, 79.60),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 5 mm: 145/79.6 -> 189/79.6
  ('NOR-6070249', 189.00, 88.00),  -- ChiaoGoo SS Red Lace rundsticka 60 cm 5.5 mm: 145/88 -> 189/88
  ('NOR-6070320', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 80 cm 2 mm: 145/71.6 -> 169/71.6
  ('NOR-6070321', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 80 cm 2.25 mm: 145/71.6 -> 169/71.6
  ('NOR-6070322', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 80 cm 2.75 mm: 145/71.6 -> 169/71.6
  ('NOR-6070323', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 80 cm 3.25 mm: 145/71.6 -> 169/71.6
  ('NOR-6070324', 169.00, 71.60),  -- ChiaoGoo SS Red Lace rundsticka 80 cm 3.5 mm: 145/71.6 -> 169/71.6
  ('NOR-6070325', 189.00, 79.60),  -- ChiaoGoo SS Red Lace rundsticka 80 cm 3.75 mm: 145/79.6 -> 189/79.6
  ('NOR-6070328', 189.00, 79.60),  -- ChiaoGoo SS Red Lace rundsticka 80 cm 5 mm: 145/79.6 -> 189/79.6
  ('NOR-6075041', 149.00, 71.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 2.25 mm: 145/71.6 -> 149/71.6
  ('NOR-60750415', 149.00, 71.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 2.5 mm: 145/71.6 -> 149/71.6
  ('NOR-6075042', 149.00, 71.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 2.75 mm: 145/71.6 -> 149/71.6
  ('NOR-6075043', 149.00, 71.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 3.25 mm: 145/71.6 -> 149/71.6
  ('NOR-6075045', 149.00, 79.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 3.75 mm: 145/79.6 -> 149/79.6
  ('NOR-6075046', 149.00, 79.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 4 mm: 145/79.6 -> 149/79.6
  ('NOR-6075047', 149.00, 79.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 4.5 mm: 145/79.6 -> 149/79.6
  ('NOR-6075048', 149.00, 79.60),  -- ChiaoGoo TWIST Lace ändstickor 10 cm 5 mm: 145/79.6 -> 149/79.6
  ('NOR-6075052', 169.00, 71.60),  -- ChiaoGoo TWIST Lace ändstickor 13 cm 2.75 mm: 145/71.6 -> 169/71.6
  ('NOR-6075053', 169.00, 71.60),  -- ChiaoGoo TWIST Lace ändstickor 13 cm 3.25 mm: 145/71.6 -> 169/71.6
  ('NOR-6075055', 195.00, 79.60),  -- ChiaoGoo TWIST Lace ändstickor 13 cm 3.75 mm: 145/79.6 -> 195/79.6
  ('NOR-6075058', 195.00, 79.60),  -- ChiaoGoo TWIST Lace ändstickor 13 cm 5 mm: 145/79.6 -> 195/79.6
  ('NOR-607530S', 135.00, 57.60),  -- ChiaoGoo TWIST Red kabel Small 75 cm: 145/57.6 -> 135/57.6
  ('NOR-607537S', 135.00, 57.60),  -- ChiaoGoo TWIST Red kabel Small 93 cm: 145/57.6 -> 135/57.6
  ('LAINE-FOUNDATIONS20', 450.00, 280.50),  -- Foundations: 20 Knitted Accessories: –/– -> 450/280.5
  ('NOR-9350304', 1099.00, 499.50),  -- Lantern Moon Charm - Set med ändstickor (5 par, 13 cm): –/499.5 -> 1099/499.5
  ('NOR-9350312', 1099.00, 499.50),  -- Lantern Moon Heritage - Set med ändstickor (5 par, 10 cm): –/499.5 -> 1099/499.5
  ('RAU-FINULL-0044076', 60.00, 23.40),  -- Rauma Finull 0044076 Mørk sennepsgul: 60/– -> 60/23.4
  ('RAU-FINULL-004414', 60.00, 23.40),  -- Rauma Finull 004414 Koksgrå Melert: 60/– -> 60/23.4
  ('RAU-FINULL-004436', 60.00, 23.40),  -- Rauma Finull 004436 Svart: 60/– -> 60/23.4
  ('RAU-FINULL-004466', 60.00, 23.40),  -- Rauma Finull 004466 Mørk gammelrosa: 60/– -> 60/23.4
  ('RAU-LAMULL-01011', 69.00, 28.44),  -- Rauma Lamull 01011 Natur: 69/– -> 69/28.44
  ('RAU-LAMULL-010112', 69.00, 28.44),  -- Rauma Lamull 010112 Spiregrønn: 69/– -> 69/28.44
  ('RAU-LAMULL-01031', 69.00, 28.44),  -- Rauma Lamull 01031 Dyp grønn: 69/– -> 69/28.44
  ('RAU-LAMULL-010411', 69.00, 28.44),  -- Rauma Lamull 010411 Brun melert: 69/– -> 69/28.44
  ('LAINE-SHETLANDSHADES', 425.00, 200.00),  -- Shetland Shades: Stories in Wool: –/– -> 425/200
  ('ESC-SUNFLOWER-25', 125.00, 35.00),  -- Sunflower Scissors bright yellow: –/3.5 -> 125/35
  ('NOR-80547', 259.00, 103.60),  -- Wool Soap Lopi 500 ml: –/103.6 -> 259/103.6
  ('NOR-80548', 259.00, 103.60),  -- Wool Softener Lopi 500 ml: –/103.6 -> 259/103.6
  ('XOL-BAUMA-ALZINA', 90.00, 45.98),  -- Xolla Bauma Alzina: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-ARAM', 90.00, 45.98),  -- Xolla Bauma Aram: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-BOIXAC', 90.00, 45.98),  -- Xolla Bauma Boixac: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-BRUC', 90.00, 45.98),  -- Xolla Bauma Bruc: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-CASTANYA', 90.00, 45.98),  -- Xolla Bauma Castanya: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-CIRERA', 90.00, 45.98),  -- Xolla Bauma Cirera: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-CIVADA', 90.00, 45.98),  -- Xolla Bauma Civada: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-CODOL', 90.00, 45.98),  -- Xolla Bauma Còdol: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-FIGA', 90.00, 45.98),  -- Xolla Bauma Figa: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-FUM', 90.00, 45.98),  -- Xolla Bauma Fum: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-GAIG', 90.00, 45.98),  -- Xolla Bauma Gaig: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-GARNATXA', 90.00, 45.98),  -- Xolla Bauma Garnatxa: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-GAVARRO', 90.00, 45.98),  -- Xolla Bauma Gavarró: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-MATAFOC', 90.00, 45.98),  -- Xolla Bauma Matafoc: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-MEL', 90.00, 45.98),  -- Xolla Bauma Mel: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-NIGRITELLA', 90.00, 45.98),  -- Xolla Bauma Nigritella: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-NIT', 90.00, 45.98),  -- Xolla Bauma Nit: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-OCEA', 90.00, 45.98),  -- Xolla Bauma Oceà: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-OLI', 90.00, 45.98),  -- Xolla Bauma Oli: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-ORQUIDIA', 90.00, 45.98),  -- Xolla Bauma Orquidia: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-PARDAL', 90.00, 45.98),  -- Xolla Bauma Pardal: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-POLLEN', 90.00, 45.98),  -- Xolla Bauma Pol·len: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-RUMEX', 90.00, 45.98),  -- Xolla Bauma Rumex: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-TAHINA', 90.00, 45.98),  -- Xolla Bauma Tahina: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-TRAMUNTANA', 90.00, 45.98),  -- Xolla Bauma Tramuntana: 90/4.18 -> 90/45.98
  ('XOL-BAUMA-XARXET', 90.00, 45.98),  -- Xolla Bauma Xarxet: 90/4.18 -> 90/45.98
  ('XOL-PAISSA-ABISSAL', 95.00, 51.20),  -- Xolla Païssa Abissal: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-BREVA', 95.00, 51.20),  -- Xolla Païssa Breva: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-BRISA', 95.00, 51.20),  -- Xolla Païssa Brisa: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-CARAMEL', 95.00, 51.20),  -- Xolla Païssa Caramel: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-CARBASSA', 95.00, 51.20),  -- Xolla Païssa Carbassa: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-COLOM', 95.00, 51.20),  -- Xolla Païssa Colom: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-COURE', 95.00, 51.20),  -- Xolla Païssa Coure: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-DALIA', 95.00, 51.20),  -- Xolla Païssa Dalia: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-DROME', 95.00, 51.20),  -- Xolla Païssa Drôme: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-FESTUC', 95.00, 51.20),  -- Xolla Païssa Festuc: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-GALLARET', 95.00, 51.20),  -- Xolla Païssa Gallaret: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-GAVARRO', 95.00, 51.20),  -- Xolla Païssa Gavarró: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-GENCIANA', 95.00, 51.20),  -- Xolla Païssa Genciana: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-MARCOLIC', 95.00, 51.20),  -- Xolla Païssa Marcòlic: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-MAROR', 95.00, 51.20),  -- Xolla Païssa Maror: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-MOLSA', 95.00, 51.20),  -- Xolla Païssa Molsa: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-MOST', 95.00, 51.20),  -- Xolla Païssa Most: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-ORXATA', 95.00, 51.20),  -- Xolla Païssa Orxata: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-SESAM', 95.00, 51.20),  -- Xolla Païssa Sèsam: 95/4.66 -> 95/51.2
  ('XOL-PAISSA-VALERIANA', 95.00, 51.20),  -- Xolla Païssa Valeriana: 95/4.66 -> 95/51.2
  ('XOL-PASTORETA-ALZINA', 90.00, 45.98),  -- Xolla Pastoreta Alzina: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-ARAM', 90.00, 45.98),  -- Xolla Pastoreta Aram: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-BOIXAC', 90.00, 45.98),  -- Xolla Pastoreta Boixac: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-BRUC', 90.00, 45.98),  -- Xolla Pastoreta Bruc: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-BURELLA', 90.00, 45.98),  -- Xolla Pastoreta Burella: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-CASTANYA', 90.00, 45.98),  -- Xolla Pastoreta Castanya: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-CIRERA', 90.00, 45.98),  -- Xolla Pastoreta Cirera: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-CIVADA', 90.00, 45.98),  -- Xolla Pastoreta Civada: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-CODOL', 90.00, 45.98),  -- Xolla Pastoreta Còdol: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-FALGUERA', 90.00, 45.98),  -- Xolla Pastoreta Falguera: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-FIGA', 90.00, 45.98),  -- Xolla Pastoreta Figa: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-FUM', 90.00, 45.98),  -- Xolla Pastoreta Fum: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-GAIG', 90.00, 45.98),  -- Xolla Pastoreta Gaig: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-GARNATXA', 90.00, 45.98),  -- Xolla Pastoreta Garnatxa: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-GAVARRO', 90.00, 45.98),  -- Xolla Pastoreta Gavarró: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-MARINA', 90.00, 45.98),  -- Xolla Pastoreta Marina: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-MATAFOC', 90.00, 45.98),  -- Xolla Pastoreta Matafoc: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-MEL', 90.00, 45.98),  -- Xolla Pastoreta Mel: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-NIGRITELLA', 90.00, 45.98),  -- Xolla Pastoreta Nigritella: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-NIT', 90.00, 45.98),  -- Xolla Pastoreta Nit: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-OCEA', 90.00, 45.98),  -- Xolla Pastoreta Oceà: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-OLI', 90.00, 45.98),  -- Xolla Pastoreta Oli: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-ORQUIDIA', 90.00, 45.98),  -- Xolla Pastoreta Orquidia: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-PARDAL', 90.00, 45.98),  -- Xolla Pastoreta Pardal: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-POLLEN', 90.00, 45.98),  -- Xolla Pastoreta Pol·len: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-RUMEX', 90.00, 45.98),  -- Xolla Pastoreta Rumex: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-TAHINA', 90.00, 45.98),  -- Xolla Pastoreta Tahina: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-TRAMUNTANA', 90.00, 45.98),  -- Xolla Pastoreta Tramuntana: 90/4.18 -> 90/45.98
  ('XOL-PASTORETA-XARXET', 90.00, 45.98),  -- Xolla Pastoreta Xarxet: 90/4.18 -> 90/45.98
  ('XOL-PEULLA-ABISSAL', 95.00, 50.68),  -- Xolla Peülla Abissal: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-BREVA', 95.00, 50.68),  -- Xolla Peülla Breva: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-BRISA', 95.00, 50.68),  -- Xolla Peülla Brisa: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-CAPUTXINA', 95.00, 50.68),  -- Xolla Peülla Caputxina: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-CARAMEL', 95.00, 50.68),  -- Xolla Peülla Caramel: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-CARBASSA', 95.00, 50.68),  -- Xolla Peülla Carbassa: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-COLOM', 95.00, 50.68),  -- Xolla Peülla Colom: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-COURE', 95.00, 50.68),  -- Xolla Peülla Coure: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-DALIA', 95.00, 50.68),  -- Xolla Peülla Dalia: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-DROME', 95.00, 50.68),  -- Xolla Peülla Drôme: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-FESTUC', 95.00, 50.68),  -- Xolla Peülla Festuc: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-GALLARET', 95.00, 50.68),  -- Xolla Peülla Gallaret: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-GAVARRO', 95.00, 50.68),  -- Xolla Peülla Gavarró: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-GENCIANA', 95.00, 50.68),  -- Xolla Peülla Genciana: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-MARCOLIC', 95.00, 50.68),  -- Xolla Peülla Marcòlic: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-MAROR', 95.00, 50.68),  -- Xolla Peülla Maror: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-MOLSA', 95.00, 50.68),  -- Xolla Peülla Molsa: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-MOST', 95.00, 50.68),  -- Xolla Peülla Most: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-ORXATA', 95.00, 50.68),  -- Xolla Peülla Orxata: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-SESAM', 95.00, 50.68),  -- Xolla Peülla Sèsam: 95/4.61 -> 95/50.68
  ('XOL-PEULLA-VALERIANA', 95.00, 50.68)  -- Xolla Peülla Valeriana: 95/4.61 -> 95/50.68
) as v(sku, retail_price, cost_price)
where i.sku = v.sku;

commit;
