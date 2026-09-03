-- Corre esto una vez en el SQL Editor de tu proyecto de Supabase
-- (Dashboard -> SQL Editor -> New query -> pega esto -> Run)
-- Tabla para el "Núcleo de diseño" (/core).

create table if not exists core_outputs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  input_text text not null,
  title text not null,
  zone text not null,
  principles text[] not null default '{}',
  mantra text not null
);

-- Permite que la app (con la anon key) inserte y lea núcleos guardados.
alter table core_outputs enable row level security;

create policy "Allow inserts from anon" on core_outputs
  for insert
  to anon
  with check (true);

create policy "Allow read from anon" on core_outputs
  for select
  to anon
  using (true);
