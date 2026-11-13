-- Week 6: ratings from people who try the /demo walkthrough.
-- Run once in the Supabase SQL Editor. Write-only for visitors, like the chat tables:
-- the public key can insert a rating but cannot read anyone's comment back.

create table if not exists demo_feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  tester text check (tester is null or char_length(tester) <= 20),
  rating smallint not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 280)
);

alter table demo_feedback enable row level security;

create policy "Allow inserts from anon" on demo_feedback
  for insert to anon with check (true);

-- Totals only. The 'selftest' tag (my own checks) is excluded from the external numbers.
create or replace view demo_stats as
select
  (select count(*) from demo_feedback) as total_ratings,
  (select count(*) from demo_feedback where coalesce(tester, '') <> 'selftest') as external_ratings,
  (select round(avg(rating)::numeric, 1) from demo_feedback where coalesce(tester, '') <> 'selftest') as avg_rating;

grant select on demo_stats to anon;
