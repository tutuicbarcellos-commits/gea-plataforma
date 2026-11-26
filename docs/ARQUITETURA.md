# Arquitetura do projeto GEA

Monorepo com npm workspaces:

- `backend/`: Node.js com Fastify. APIs, regras de negócio e validação dos dados.
- `frontend/`: React com Vite. Interface baseada em componentes.
- `docs/`: documentação técnica e arquivos de referência (logo).

## Banco de dados e serviços: Supabase

O Supabase é um PostgreSQL gerenciado. Ele será usado para:

- Banco de dados relacional (tabelas de notícias, eventos, avaliações, comunicados e perfis).
- Autenticação de estudantes e administradores.
- Armazenamento de imagens das notícias (Supabase Storage).
- Regras de acesso por linha (Row Level Security), que restringem o que cada tipo de usuário pode ler ou alterar.

Decisões relacionadas:

- O Prisma deixa de ser usado. O acesso ao banco será feito pelo cliente oficial `@supabase/supabase-js` no backend, e as migrações ficarão como arquivos SQL versionados no projeto.
- A chave `service_role` do Supabase fica somente no backend, em variáveis de ambiente. Nunca vai para o frontend.
- O frontend usa apenas a chave pública (`anon`), protegida pelas regras de acesso.
- Credenciais ficam em arquivos `.env`, que não são versionados.

## Status atual

Base estrutural criada (health check, configuração, roteamento inicial e paleta de cores extraída da logo).

Pendências:

- Criar o projeto no Supabase e informar a URL e a chave pública (`anon`).
- Confirmar a arquitetura geral.
