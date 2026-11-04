-- Run this once in the SQL Editor of your Supabase project
-- (Dashboard -> SQL Editor -> New snippet -> paste this -> Run)
-- Tables for the bag advisor (/chat).
-- Both tables are WRITE-ONLY for visitors: they can insert rows but cannot read
-- anyone's chat. You read them in the Supabase Table Editor. The public page only
-- sees the aggregate view chat_stats (counts and averages, no messages).

create table if not exists chat_sessions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id uuid not null unique,
  tester text check (char_length(tester) <= 20),
  answers jsonb not null check (pg_column_size(answers) < 4000),
  recommendation jsonb not null check (pg_column_size(recommendation) < 4000),
  guardrail_hits text[] not null default '{}',
  needs_human boolean not null default false,
  human_reason text check (char_length(human_reason) <= 60)
);

create table if not exists chat_feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id uuid not null,
  thumbs text check (thumbs in ('up', 'down')),
  rating int check (rating between 1 and 5),
  comment text check (char_length(comment) <= 280),
  wants_human boolean not null default false
);

alter table chat_sessions enable row level security;
alter table chat_feedback enable row level security;

create policy "Allow inserts from anon" on chat_sessions
  for insert to anon with check (true);

create policy "Allow inserts from anon" on chat_feedback
  for insert to anon with check (true);

-- Aggregate numbers only. Sessions tagged "selftest" are my own checks and are
-- kept out of the external-test numbers.
create or replace view chat_stats as
select
  (select count(*) from chat_sessions) as total_chats,
  (select count(*) from chat_sessions where tester is not null and tester <> 'selftest') as external_chats,
  (select count(*) from chat_sessions where tester = 'selftest') as selftest_chats,
  (select count(*) from chat_sessions where needs_human) as flagged_chats,
  (select count(*) from chat_sessions where cardinality(guardrail_hits) > 0) as guardrail_chats,
  (select count(*) from chat_feedback f join chat_sessions s using (session_id)
     where f.rating is not null and s.tester is distinct from 'selftest') as ratings_count,
  (select round(avg(f.rating)::numeric, 2) from chat_feedback f join chat_sessions s using (session_id)
     where f.rating is not null and s.tester is distinct from 'selftest') as avg_rating,
  (select count(*) from chat_feedback f join chat_sessions s using (session_id)
     where f.thumbs = 'up' and s.tester is distinct from 'selftest') as thumbs_up,
  (select count(*) from chat_feedback f join chat_sessions s using (session_id)
     where f.thumbs = 'down' and s.tester is distinct from 'selftest') as thumbs_down,
  (select count(*) from chat_feedback where wants_human) as human_requests;

grant select on chat_stats to anon;
