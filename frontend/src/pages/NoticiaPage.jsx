import { usePageMeta } from '../hooks/usePageMeta.js';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import EmptyState from '../components/EmptyState.jsx';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

export default function NoticiaPage() {
  usePageMeta({ titulo: 'Notícia' });
  const { id } = useParams();
  const { data, loading, error } = useSupabaseQuery(
    () => supabase.from('noticias').select('*').eq('id', id).eq('publicado', true),
    [id],
  );
  const noticia = data?.[0];

  return (
    <div className="container article-wrapper">
      <Link to="/jornal" className="text-link back-link"><ArrowLeft size={18} aria-hidden="true" /> Voltar ao jornal</Link>

      {loading && <p className="muted">Carregando notícia...</p>}
      {error && <p className="feedback feedback-erro">Não foi possível carregar a notícia.</p>}
      {!loading && !error && !noticia && (
        <EmptyState icon={SearchX} title="Notícia não encontrada" text="Ela pode ter sido removida ou ainda não foi publicada." />
      )}

      {noticia && (
        <article className="article">
          <span className="muted">{formatarData(noticia.publicado_em)}</span>
          <h1>{noticia.titulo}</h1>
          <p className="article-lead">{noticia.resumo}</p>
          {noticia.imagem_url && <img src={noticia.imagem_url} alt={noticia.titulo} className="article-image" />}
          <div className="article-body">{noticia.conteudo}</div>
        </article>
      )}
    </div>
  );
}
