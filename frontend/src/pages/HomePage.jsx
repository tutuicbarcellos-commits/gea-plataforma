import { usePageMeta } from '../hooks/usePageMeta.js';
import { Link } from 'react-router-dom';
import { CalendarDays, Newspaper, Megaphone, ClipboardList, ArrowRight, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import EmptyState from '../components/EmptyState.jsx';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function HomePage() {
  usePageMeta({ titulo: 'Início', descricao: 'Painel do Grêmio Estudantil com compromissos, avisos e notícias da Chapa Connecta.' });
  const agora = new Date().toISOString();

  const eventos = useSupabaseQuery(
    () => supabase.from('eventos').select('*').gte('inicio', agora).order('inicio').limit(4),
    [],
  );
  const noticias = useSupabaseQuery(
    () => supabase.from('noticias').select('id, titulo, resumo, publicado_em').eq('publicado', true).order('publicado_em', { ascending: false }).limit(3),
    [],
  );
  const comunicados = useSupabaseQuery(
    () => supabase.from('comunicados').select('*').eq('publicado', true).order('criado_em', { ascending: false }).limit(3),
    [],
  );

  return (
    <div className="container">
      <section className="hero">
        <div>
          <h1>Bem-vindo à plataforma do GEA</h1>
          <p className="hero-text">
            Acompanhe provas, entregas, eventos e comunicados do Grêmio Estudantil em um só lugar.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/calendario">
              Ver calendário <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/jornal">Ler o Jornal do GEA</Link>
          </div>
        </div>
      </section>

      <div className="shortcuts" role="list" aria-label="Atalhos principais">
        <Link role="listitem" className="shortcut-card" to="/calendario"><CalendarDays size={22} aria-hidden="true" />Calendário</Link>
        <Link role="listitem" className="shortcut-card" to="/jornal"><Newspaper size={22} aria-hidden="true" />Jornal</Link>
        <Link role="listitem" className="shortcut-card" to="/coordenacao"><Megaphone size={22} aria-hidden="true" />Coordenação</Link>
        <Link role="listitem" className="shortcut-card" to="/area-do-estudante"><ClipboardList size={22} aria-hidden="true" />Minha área</Link>
      </div>

      <div className="grid-home">
        <section className="card" aria-labelledby="titulo-proximos">
          <h2 id="titulo-proximos">Próximos compromissos</h2>
          {eventos.loading && <p className="muted">Carregando...</p>}
          {eventos.error && <p className="error-text">Não foi possível carregar os compromissos.</p>}
          {!eventos.loading && !eventos.error && eventos.data.length === 0 && (
            <EmptyState icon={Inbox} title="Nenhum compromisso cadastrado" text="Os próximos eventos e avaliações aparecerão aqui." />
          )}
          <ul className="list">
            {eventos.data?.map((item) => (
              <li key={item.id}>
                <span className="date-badge">{formatarData(item.inicio)}</span>
                <span>{item.titulo}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="titulo-avisos">
          <h2 id="titulo-avisos">Avisos importantes</h2>
          {comunicados.loading && <p className="muted">Carregando...</p>}
          {comunicados.error && <p className="error-text">Não foi possível carregar os avisos.</p>}
          {!comunicados.loading && !comunicados.error && comunicados.data.length === 0 && (
            <EmptyState icon={Inbox} title="Nenhum aviso cadastrado" text="Comunicados publicados pelo Grêmio aparecerão aqui." />
          )}
          <ul className="list">
            {comunicados.data?.map((item) => (
              <li key={item.id} className="list-block">
                <strong>{item.titulo}</strong>
                <span className="muted">{item.mensagem}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card-wide" aria-labelledby="titulo-noticias">
          <div className="card-header">
            <h2 id="titulo-noticias">Últimas notícias do GEA</h2>
            <Link to="/jornal" className="text-link">Ver todas</Link>
          </div>
          {noticias.loading && <p className="muted">Carregando...</p>}
          {noticias.error && <p className="error-text">Não foi possível carregar as notícias.</p>}
          {!noticias.loading && !noticias.error && noticias.data.length === 0 && (
            <EmptyState icon={Newspaper} title="Nenhuma notícia publicada" text="As novidades do Jornal do GEA aparecerão aqui." />
          )}
          <div className="news-grid">
            {noticias.data?.map((item) => (
              <Link key={item.id} to={`/jornal/${item.id}`} className="news-card">
                <h3>{item.titulo}</h3>
                <p>{item.resumo}</p>
                <span className="muted">{formatarData(item.publicado_em)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
