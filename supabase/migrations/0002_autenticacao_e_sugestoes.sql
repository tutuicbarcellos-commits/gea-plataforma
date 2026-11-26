-- Cria automaticamente o perfil de estudante quando uma conta e cadastrada.
create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfis (id, nome, papel)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', 'Estudante'), 'estudante');
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- Canal de duvidas e sugestoes enviadas pelos estudantes.
create table if not exists public.sugestoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (length(nome) between 2 and 120),
  email text not null check (length(email) between 5 and 200),
  mensagem text not null check (length(mensagem) between 5 and 2000),
  criado_em timestamptz not null default now()
);

alter table public.sugestoes enable row level security;

create policy "sugestoes_envio_publico" on public.sugestoes
  for insert with check (true);

create policy "sugestoes_leitura_administrador" on public.sugestoes
  for select using (public.e_administrador());

-- Para tornar uma conta administradora, execute no SQL Editor:
-- update public.perfis set papel = 'administrador' where id = 'UUID-DO-USUARIO';
