-- Run this once in the SQL Editor of your Supabase project
-- (Dashboard -> SQL Editor -> New query -> paste this -> Run)
-- Table for saved pricing scenarios (/pricing).

create table if not exists pricing_scenarios (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  scenario text not null, -- 'Conservative' | 'Base' | 'Optimistic' | 'Custom'
  assumptions jsonb not null,
  monthly_revenue numeric not null,
  annual_revenue numeric not null
);

-- Lets the app (anon key) insert and read saved scenarios.
alter table pricing_scenarios enable row level security;

create policy "Allow inserts from anon" on pricing_scenarios
  for insert
  to anon
  with check (true);

create policy "Allow read from anon" on pricing_scenarios
  for select
  to anon
  using (true);
