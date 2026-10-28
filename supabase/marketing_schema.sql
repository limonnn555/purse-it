-- Run this once in the SQL Editor of your Supabase project
-- (Dashboard -> SQL Editor -> New query -> paste this -> Run)
-- Tables for the marketing engine (/marketing) and the homepage A/B tests.

create table if not exists marketing_assets (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  asset_type text not null, -- 'brand' | 'persona' | 'landing' | 'post' | 'video' | 'calendar' | 'headline'
  title text not null,
  content text not null
);

create table if not exists ab_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  test_id text not null,    -- 'hero_headline' | 'hero_cta'
  variant text not null,    -- 'A' | 'B'
  event text not null,      -- 'view' | 'click'
  visitor_id text not null,
  is_test boolean not null default false
);

alter table marketing_assets enable row level security;
alter table ab_events enable row level security;

create policy "Allow inserts from anon" on marketing_assets
  for insert to anon with check (true);
create policy "Allow read from anon" on marketing_assets
  for select to anon using (true);

create policy "Allow inserts from anon" on ab_events
  for insert to anon with check (true);
create policy "Allow read from anon" on ab_events
  for select to anon using (true);
