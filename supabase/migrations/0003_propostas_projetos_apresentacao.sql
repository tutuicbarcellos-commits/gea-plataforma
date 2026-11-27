-- Propostas estudantis, projetos do GEA e apresentacao institucional.
-- Leitura publica somente de conteudo publicado. Escrita restrita a administradores.

create table if not exists public.propostas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null,
  autor text,
  publicada boolean not null default false,
  criado_em timestamptz not null default now()
);

create table if not exists public.projetos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null,
  situacao text not null default 'em_andamento' check (situacao in ('planejado', 'em_andamento', 'concluido')),
  publicado boolean not null default false,
  criado_em timestamptz not null default now()
);

create table if not exists public.apresentacao (
  id integer primary key default 1 check (id = 1),
  titulo text not null default 'Sobre o GEA',
  texto text,
  atualizado_em timestamptz not null default now()
);
insert into public.apresentacao (id) values (1) on conflict (id) do nothing;

alter table public.propostas enable row level security;
alter table public.projetos enable row level security;
alter table public.apresentacao enable row level security;

create policy "propostas_leitura_publica" on public.propostas
  for select using (publicada = true or public.e_administrador());
create policy "propostas_admin_escrita" on public.propostas
  for all using (public.e_administrador()) with check (public.e_administrador());

create policy "projetos_leitura_publica" on public.projetos
  for select using (publicado = true or public.e_administrador());
create policy "projetos_admin_escrita" on public.projetos
  for all using (public.e_administrador()) with check (public.e_administrador());

create policy "apresentacao_leitura_publica" on public.apresentacao
  for select using (true);
create policy "apresentacao_admin_escrita" on public.apresentacao
  for all using (public.e_administrador()) with check (public.e_administrador());

-- Permissoes de tabela (sem elas o site nao consegue ler ou gravar, mesmo com as regras acima)
grant select on public.propostas, public.projetos, public.apresentacao to anon, authenticated;
grant insert, update, delete on public.propostas, public.projetos, public.apresentacao to authenticated;
