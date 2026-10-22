-- Ghar Tak database schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/rsqmhhjwhosdcdczsyil/sql

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists stores (
  id text primary key,
  name text not null,
  description text,
  category text,
  image_url text,
  rating numeric(3,1) default 0,
  delivery_time text,
  lat numeric(9,6),
  lng numeric(9,6),
  address text,
  created_at timestamptz default now()
);

create table if not exists products (
  id text primary key,
  name text not null,
  price numeric(10,2) not null,
  category text,
  image_url text,
  store_id text references stores(id) on delete cascade,
  service_provider_id text,
  created_at timestamptz default now()
);

create table if not exists service_categories (
  id text primary key,
  name text not null,
  icon text
);

create table if not exists service_providers (
  id text primary key,
  name text not null,
  service_category text references service_categories(id),
  lat numeric(9,6),
  lng numeric(9,6),
  address text,
  availability text,
  rating numeric(3,1) default 0,
  image_url text,
  description text,
  products_sold text[],
  created_at timestamptz default now()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (read-only for anon)
-- ============================================================

alter table stores enable row level security;
alter table products enable row level security;
alter table service_categories enable row level security;
alter table service_providers enable row level security;

create policy "Public read stores" on stores for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read service_categories" on service_categories for select using (true);
create policy "Public read service_providers" on service_providers for select using (true);

-- ============================================================
-- SEED DATA
-- ============================================================

insert into service_categories (id, name, icon) values
  ('plumber',      'Plumbers',      'tool'),
  ('cleaner',      'Cleaners',      'wind'),
  ('hairdresser',  'Hairdressers',  'scissors'),
  ('car_repair',   'Car Repair',    'truck'),
  ('tech_repair',  'Tech Repair',   'cpu'),
  ('general_repair','General Repair','settings'),
  ('jobs',         'Jobs',          'briefcase'),
  ('beauty',       'Beauty',        'star'),
  ('home_repair',  'Home Repair',   'home'),
  ('wellness',     'Wellness',      'heart'),
  ('training',     'Training',      'book-open'),
  ('pest_control', 'Pest Control',  'shield'),
  ('rental',       'Rentals',       'key')
on conflict (id) do nothing;

insert into stores (id, name, description, category, image_url, rating, delivery_time, lat, lng, address) values
  ('store1','Downtown Fresh Mart','Your friendly neighborhood grocery store with fresh produce and daily essentials.','Grocery','https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',4.5,'25-35 min',40.7128,-74.006,'12 Maple St, Downtown'),
  ('store2','City Tech Central','Latest gadgets and accessories. Your one-stop tech shop.','Electronics','https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80',4.8,'30-40 min',40.7135,-74.0072,'55 Tech Ave, Downtown'),
  ('store3','Uptown Quick Bites','Quick and delicious meals delivered to your doorstep.','Restaurant','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',4.2,'20-30 min',40.758,-73.9855,'88 Restaurant Row, Uptown'),
  ('store4','Riverside Fabrics','High-quality fabrics and fashion wear.','Fashion','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',4.6,'1-2 days',40.7095,-74.0115,'21 River View, Riverside'),
  ('store5','The Spice House','Authentic spices and exotic ingredients from around the world.','Grocery','https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',4.9,'2-3 days',40.7145,-74.008,'Spice Alley, Downtown')
on conflict (id) do nothing;

insert into products (id, name, price, category, image_url, store_id) values
  ('prod1','Organic Apples',3.99,'Produce','','store1'),
  ('prod2','Fresh Milk (1 Gallon)',4.50,'Dairy','','store1'),
  ('prod9','Whole Wheat Bread',3.20,'Bakery','','store1'),
  ('prod3','Wireless Earbuds',79.99,'Audio','','store2'),
  ('prod4','Mobile Charger',25.00,'Accessories','','store2'),
  ('prod5','Classic Cheeseburger',12.50,'Burgers','','store3'),
  ('prod6','Pepperoni Pizza',18.00,'Pizza','','store3')
on conflict (id) do nothing;

insert into service_providers (id, name, service_category, lat, lng, address, availability, rating, image_url, description, products_sold) values
  ('sp1','Mike''s Plumbing Services','plumber',40.715,-74.008,'Downtown','Mon-Sat 9am-7pm',4.7,'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80','Expert plumbing services for residential and commercial properties.',ARRAY['Pipe Wrench (10 inch)','Drain Cleaner Liquid']),
  ('sp2','Sparkle Cleaners','cleaner',40.758,-73.9855,'Uptown','Available 24/7',4.9,'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80','Professional cleaning services for homes and offices.',NULL),
  ('sp3','Style Salon','hairdresser',40.718,-74.012,'Riverside','Tue-Sun 11am-8pm',4.6,'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80','Trendy haircuts and styling by experienced professionals.',NULL),
  ('sp4','Metro Auto Care','car_repair',40.71,-74.005,'Downtown','Mon-Fri 9am-6pm',4.4,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80','Reliable car repair and maintenance services.',NULL),
  ('sp5','Gadget Fix','tech_repair',40.755,-73.98,'Uptown','Mon-Sat 10am-8pm',4.8,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80','Expert repairs for phones, laptops, and tablets.',ARRAY['Mobile Screen Protector','USB-C Cable (Durable)']),
  ('sp6','Handyman Solutions','general_repair',40.712,-74.015,'Riverside','Mon-Fri 9am-6pm',4.5,'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80','All-around handyman for your home repair needs.',NULL)
on conflict (id) do nothing;
