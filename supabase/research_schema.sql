-- Run this once in the SQL Editor of your Supabase project
-- (Dashboard -> SQL Editor -> New query -> paste this -> Run)
-- Table for the Research + Benchmarking Dashboard (/research).

create table if not exists research_entries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  category text not null, -- 'Global Example' | 'Competitor' | 'Substitute'
  region text not null,
  description text not null,
  threat_level text not null, -- 'Low' | 'Medium' | 'High'
  url text
);

-- Lets the app (anon key) insert and read research entries.
alter table research_entries enable row level security;

create policy "Allow inserts from anon" on research_entries
  for insert
  to anon
  with check (true);

create policy "Allow read from anon" on research_entries
  for select
  to anon
  using (true);

-- Seed data: 5 real global examples + 8 real competitors/substitutes
-- (researched via web search, not invented). Region "Mexico" entries
-- cover the Mexico localization requirement.
insert into research_entries (name, category, region, description, threat_level, url)
values
  ('Timbuk2', 'Global Example', 'Global', 'Build-your-own bag: choose fabric, color, and hardware, made to order.', 'Medium', 'https://www.timbuk2.com/collections/custom-bags-backpacks'),
  ('Boundary Supply', 'Global Example', 'Global', 'Modular backpack systems you reconfigure for work, travel, or everyday carry.', 'Medium', 'https://www.boundarysupply.com/collections/modular-pack-systems'),
  ('Contrado', 'Global Example', 'Global', 'Design your own bag using your own photos or artwork, printed to order.', 'Low', 'https://www.contrado.com/design-your-own-backpack'),
  ('YouCustomizeIt', 'Global Example', 'Global', 'Online bag design studio with live preview and 500+ starting templates.', 'Low', 'https://www.youcustomizeit.com'),
  ('Cancha', 'Global Example', 'Global', 'Modular backpack built around a core compartment with clip-on accessory pouches.', 'Medium', 'https://canchagear.com'),
  ('Printify', 'Competitor', 'Global', 'Print-on-demand backpack customization platform, no order minimums.', 'Low', 'https://printify.com/custom-backpacks/'),
  ('Zazzle', 'Competitor', 'Global', 'Marketplace offering free print customization on backpacks.', 'Low', 'https://www.zazzle.com/custom/backpacks'),
  ('Sea to Summit Packing Cubes', 'Substitute', 'Global', 'Buy an organizer insert instead of a custom-designed bag; works inside any bag you already own.', 'High', 'https://www.seatosummit.com'),
  ('Bagly', 'Substitute', 'Global', 'Packing and organization app that suggests what to bring, without changing the bag itself.', 'Low', 'https://www.withbagly.com/en'),
  ('JanSport / Herschel (generic backpacks)', 'Substitute', 'Global', 'Off-the-shelf backpacks with zero customization, the lowest-friction and cheapest default option.', 'High', null),
  ('Mayor Bag', 'Competitor', 'Mexico', 'Mexican manufacturer of promotional and made-to-order backpacks, mostly wholesale/B2B.', 'Medium', 'https://mayorbag.com'),
  ('Mochilas Especializadas', 'Competitor', 'Mexico', '100% Mexican company producing specialized backpacks by fabric and use case.', 'Medium', 'https://mochilasespecializadas.com.mx'),
  ('Talabartería artesanal mexicana', 'Substitute', 'Mexico', 'Handmade, made-to-order leather bags from local artisans; bespoke but no digital design tool or saved history.', 'Medium', null)
on conflict do nothing;
