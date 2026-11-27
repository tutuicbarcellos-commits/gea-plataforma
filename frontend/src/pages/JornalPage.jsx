import { usePageMeta } from '../hooks/usePageMeta.js';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import EmptyState from '../components/EmptyState.jsx';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

export default function JornalPage() {
  usePageMeta({ titulo: 'Jornal do GEA', descricao: 'Notícias, comunicados, projetos e eventos publicados pelo Grêmio Estudantil.' });
  const { data, loading, error } = useSupabaseQuery(
    () => supabase.from('noticias').select('*').eq('publicado', true).order('publicado_em', { ascending: false }),
    [],
  );
  const noticias = data ?? [];

  return (
    <div className="container">
      <h1>Jornal do GEA</h1>
      <p className="muted">Notícias do colégio, comunicados do Grêmio, projetos e eventos.</p>

      {loading && <p className="muted">Carregando notícias...</p>}
      {error && <p className="feedback feedback-erro">Não foi possível carregar o jornal.</p>}
      {!loading && !error && noticias.length === 0 && (
        <EmptyState icon={Newspaper} title="Nenhuma notícia publicada" text="As novidades aparecerão aqui assim que forem publicadas." />
      )}

      <div className="news-grid news-grid-page">
        {noticias.map((item) => (
          <Link key={item.id} to={`/jornal/${item.id}`} className="news-card news-card-full">
            {item.imagem_url && <img src={item.imagem_url} alt={item.titulo} className="news-image" loading="lazy" />}
            <span className="muted">{formatarData(item.publicado_em)}</span>
            <h3>{item.titulo}</h3>
            <p>{item.resumo}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
