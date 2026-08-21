-- Corre esto una vez en el SQL Editor de tu proyecto de Supabase
-- (Dashboard -> SQL Editor -> New query -> pega esto -> Run)

create table if not exists designs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  bag_size text not null,
  items text[] not null default '{}',
  custom_items text[] not null default '{}'
);

-- Permite que la app (con la anon key) inserte y lea diseños.
-- Para un proyecto de clase esto es suficiente; en un negocio real
-- se restringiría más.
alter table designs enable row level security;

create policy "Allow inserts from anon" on designs
  for insert
  to anon
  with check (true);

create policy "Allow read from anon" on designs
  for select
  to anon
  using (true);
