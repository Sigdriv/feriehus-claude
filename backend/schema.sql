-- Feriehus AS – Databaseskjema
-- Kjør med: psql -d feriehus -f schema.sql

CREATE TABLE properties (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200)   NOT NULL,
  location    VARCHAR(200)   NOT NULL,
  description TEXT,
  price       NUMERIC(10,2)  NOT NULL,
  type        VARCHAR(10)    NOT NULL CHECK (type IN ('rent', 'sale')),
  area_m2     INTEGER,
  beds        INTEGER,
  baths       INTEGER,
  garages     INTEGER,
  image_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE property_images (
  id          SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  url         VARCHAR(500) NOT NULL,
  sort_order  INTEGER DEFAULT 0
);

-- Eksempeldata
INSERT INTO properties (name, location, description, price, type, area_m2, beds, baths, garages, image_url) VALUES
  ('Strandleilighet Sørvågen',  'Lofoten, Norge',    'Nydelig leilighet med panoramautsikt mot havet.',   8500,  'rent', 85,  3, 1, 0, 'assets/img/properties/property-1.jpg'),
  ('Fjellhytte Hemsedal',       'Hemsedal, Norge',   'Koselig hytte midt i skiområdet, peis og boblebad.', 12000, 'rent', 120, 4, 2, 1, 'assets/img/properties/property-2.jpg'),
  ('Sommerhus Hvaler',          'Hvaler, Norge',     'Idyllisk sommerhus med egen brygge og båt.',         9500,  'rent', 95,  4, 2, 1, 'assets/img/properties/property-3.jpg'),
  ('Leilighet Bergen Sentrum',  'Bergen, Norge',     'Moderne leilighet i hjertet av Bergen.',             7200,  'rent', 72,  2, 1, 0, 'assets/img/properties/property-4.jpg'),
  ('Cabin på Filefjell',        'Filefjell, Norge',  'Rolig og avskjermet hytte med flott natur rundt.',   6800,  'rent', 65,  2, 1, 0, 'assets/img/properties/property-5.jpg'),
  ('Villa Kristiansand',        'Kristiansand, Norge','Stor villa med hage, perfekt for familier.',         15000, 'rent', 210, 5, 3, 2, 'assets/img/properties/property-6.jpg');
