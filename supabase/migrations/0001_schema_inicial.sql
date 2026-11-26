-- Esquema inicial da plataforma GEA (Chapa Connecta)
-- Leitura publica somente de conteudo publicado. Escrita restrita a administradores.

create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  papel text not null default 'estudante' check (papel in ('estudante', 'administrador')),
  criado_em timestamptz not null default now()
);

create table if not exists public.noticias (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  resumo text not null,
  conteudo text not null,
  imagem_url text,
  publicado boolean not null default false,
  publicado_em timestamptz,
  criado_em timestamptz not null default now()
);

create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  categoria text not null default 'evento' check (categoria in ('avaliacao', 'entrega', 'evento', 'atividade', 'cronograma')),
  inicio timestamptz not null,
  fim timestamptz,
  criado_em timestamptz not null default now()
);

create table if not exists public.comunicados (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  mensagem text not null,
  fixado boolean not null default false,
  publicado boolean not null default false,
  criado_em timestamptz not null default now()
);

create table if not exists public.coordenacao (
  id integer primary key default 1 check (id = 1),
  email text,
  telefone text,
  horario_atendimento text,
  atualizado_em timestamptz not null default now()
);
insert into public.coordenacao (id) values (1) on conflict (id) do nothing;

-- Funcao auxiliar: verifica se o usuario logado e administrador
create or replace function public.e_administrador()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid() and papel = 'administrador'
  );
$$;

-- Ativar regras de acesso por linha
alter table public.perfis enable row level security;
alter table public.noticias enable row level security;
alter table public.eventos enable row level security;
alter table public.comunicados enable row level security;
alter table public.coordenacao enable row level security;

-- Perfis: cada usuario ve o proprio perfil; administradores veem todos
create policy "perfil_proprio_leitura" on public.perfis
  for select using (id = auth.uid() or public.e_administrador());

-- Noticias: leitura publica apenas de publicadas; administradores gerenciam tudo
create policy "noticias_leitura_publica" on public.noticias
  for select using (publicado = true or public.e_administrador());
create policy "noticias_admin_escrita" on public.noticias
  for all using (public.e_administrador()) with check (public.e_administrador());

-- Eventos: leitura publica; escrita restrita a administradores
create policy "eventos_leitura_publica" on public.eventos
  for select using (true);
create policy "eventos_admin_escrita" on public.eventos
  for all using (public.e_administrador()) with check (public.e_administrador());

-- Comunicados: leitura publica apenas dos publicados
create policy "comunicados_leitura_publica" on public.comunicados
  for select using (publicado = true or public.e_administrador());
create policy "comunicados_admin_escrita" on public.comunicados
  for all using (public.e_administrador()) with check (public.e_administrador());

-- Coordenacao: leitura publica; escrita restrita a administradores
create policy "coordenacao_leitura_publica" on public.coordenacao
  for select using (true);
create policy "coordenacao_admin_escrita" on public.coordenacao
  for all using (public.e_administrador()) with check (public.e_administrador());
