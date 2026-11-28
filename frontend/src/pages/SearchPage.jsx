import { Link, useSearchParams } from 'react-router-dom';
import { Search, Newspaper, CalendarDays } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonLines } from '../components/Skeleton.jsx';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function SearchPage() {
  usePageMeta({ titulo: 'Busca', descricao: 'Resultados da busca no GEA.', privada: true });
  const [params] = useSearchParams();
  // Remove caracteres de padrao do LIKE para que a busca seja literal
  const termo = (params.get('q') ?? '').trim().slice(0, 80).replace(/[%_*,()]/g, '');
  const valido = termo.length >= 2;

  const noticias = useSupabaseQuery(
    () => valido
      ? supabase.from('noticias').select('id, titulo, resumo, publicado_em').eq('publicado', true).ilike('titulo', `%${termo}%`).limit(10)
      : Promise.resolve({ data: [], error: null }),
    [termo, valido],
  );
  const eventos = useSupabaseQuery(
    () => valido
      ? supabase.from('eventos').select('id, titulo, inicio, categoria').ilike('titulo', `%${termo}%`).order('inicio').limit(10)
      : Promise.resolve({ data: [], error: null }),
    [termo, valido],
  );

  const carregando = noticias.loading || eventos.loading;
  const total = (noticias.data?.length ?? 0) + (eventos.data?.length ?? 0);

  return (
    <div className="container">
      <h1>Busca</h1>
      <p className="muted">
        {valido ? `Resultados para "${termo}"` : 'Digite pelo menos duas letras na barra de busca.'}
      </p>

      {!valido && <EmptyState icon={Search} title="Pesquise notícias e eventos" text="Use a barra no topo da página." />}
      {valido && carregando && <SkeletonLines linhas={4} />}
      {valido && !carregando && total === 0 && (
        <EmptyState icon={Search} title="Nenhum resultado" text="Tente outras palavras." />
      )}

      {valido && !carregando && (noticias.data?.length ?? 0) > 0 && (
        <section className="card section-gap" aria-labelledby="resultado-noticias">
          <h2 id="resultado-noticias"><Newspaper size={18} aria-hidden="true" /> Notícias</h2>
          <ul className="list">
            {noticias.data.map((item) => (
              <li key={item.id} className="list-block">
                <Link className="text-link" to={`/jornal/${item.id}`}>{item.titulo}</Link>
                <span className="muted">{formatarData(item.publicado_em)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {valido && !carregando && (eventos.data?.length ?? 0) > 0 && (
        <section className="card section-gap" aria-labelledby="resultado-eventos">
          <h2 id="resultado-eventos"><CalendarDays size={18} aria-hidden="true" /> Compromissos</h2>
          <ul className="list">
            {eventos.data.map((item) => (
              <li key={item.id} className="list-block">
                <Link className="text-link" to="/calendario">{item.titulo}</Link>
                <span className="muted">{formatarData(item.inicio)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
