import { Link } from 'react-router-dom';
import { CalendarDays, Newspaper, Lightbulb, Megaphone, Users, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { CATEGORIAS } from '../lib/categorias.js';
import MonthCalendar from '../components/MonthCalendar.jsx';
import { SkeletonLines } from '../components/Skeleton.jsx';
import '../styles/home.css';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
const formatarHora = (valor) =>
  new Date(valor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const FUNCIONALIDADES = [
  { to: '/calendario', titulo: 'Eventos', texto: 'Compromissos, avaliações e entregas.', Icone: CalendarDays, classe: 'tone-blue' },
  { to: '/coordenacao', titulo: 'Comunicados', texto: 'Avisos da coordenação e do Grêmio.', Icone: Megaphone, classe: 'tone-pink' },
  { to: '/propostas', titulo: 'Propostas', texto: 'Ideias apresentadas pelo Grêmio.', Icone: Lightbulb, classe: 'tone-yellow' },
  { to: '/participacao', titulo: 'Participe', texto: 'Envie sugestões e dúvidas.', Icone: Users, classe: 'tone-blue' },
];

export default function HomePage() {
  usePageMeta({ descricao: 'Painel do Grêmio Estudantil com compromissos, avisos e notícias da Chapa Connecta.' });
  const agora = new Date().toISOString();

  const proximos = useSupabaseQuery(
    () => supabase.from('eventos').select('*').gte('inicio', agora).order('inicio').limit(4),
    [],
  );
  const noticia = useSupabaseQuery(
    () => supabase.from('noticias').select('id, titulo, resumo, publicado_em').eq('publicado', true).order('publicado_em', { ascending: false }).limit(1),
    [],
  );
  const proposta = useSupabaseQuery(
    () => supabase.from('propostas').select('id, titulo, descricao').eq('publicada', true).order('criado_em', { ascending: false }).limit(1),
    [],
  );

  const evento = proximos.data?.[0];
  const destaqueNoticia = noticia.data?.[0];
  const destaqueProposta = proposta.data?.[0];

  return (
    <div className="home">
      <section className="hero" aria-labelledby="titulo-inicio">
        <div className="hero-copy">
          <p className="hero-badge"><Star size={16} aria-hidden="true" /> Grêmio Estudantil</p>
          <h1 id="titulo-inicio">Chapa <span className="hero-accent">Conecta</span></h1>
          <p className="hero-subtitle">Mais participação, mais conquistas</p>
          <p className="hero-lead">
            A plataforma do Grêmio Estudantil para você ficar por dentro, participar e fazer a diferença.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/propostas">Ver propostas <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="button button-outline" to="/calendario"><CalendarDays size={18} aria-hidden="true" /> Explorar calendário</Link>
          </div>
        </div>

        <div className="hero-cards" aria-label="Destaques">
          <Link to="/calendario" className="float-card float-card-a">
            <span className="float-card-icon tone-blue"><CalendarDays size={20} aria-hidden="true" /></span>
            <span className="float-card-label">Próximo evento</span>
            {proximos.loading && <SkeletonLines linhas={2} />}
            {!proximos.loading && evento && <strong>{evento.titulo}</strong>}
            {!proximos.loading && evento && <span className="muted">{formatarData(evento.inicio)}, {formatarHora(evento.inicio)}</span>}
            {!proximos.loading && !evento && <span className="muted">Nenhum evento cadastrado</span>}
          </Link>

          <Link to={destaqueNoticia ? `/jornal/${destaqueNoticia.id}` : '/jornal'} className="float-card float-card-b">
            <span className="float-card-icon tone-pink"><Newspaper size={20} aria-hidden="true" /></span>
            <span className="float-card-label">Última notícia</span>
            {noticia.loading && <SkeletonLines linhas={2} />}
            {!noticia.loading && destaqueNoticia && <strong>{destaqueNoticia.titulo}</strong>}
            {!noticia.loading && !destaqueNoticia && <span className="muted">Nenhuma notícia publicada</span>}
          </Link>

          <Link to="/propostas" className="float-card float-card-c">
            <span className="float-card-icon tone-yellow"><Lightbulb size={20} aria-hidden="true" /></span>
            <span className="float-card-label">Proposta em destaque</span>
            {proposta.loading && <SkeletonLines linhas={2} />}
            {!proposta.loading && destaqueProposta && <strong>{destaqueProposta.titulo}</strong>}
            {!proposta.loading && !destaqueProposta && <span className="muted">Nenhuma proposta publicada</span>}
          </Link>

          <span className="hero-star hero-star-1" aria-hidden="true" />
          <span className="hero-star hero-star-2" aria-hidden="true" />
          <span className="hero-dot" aria-hidden="true" />
        </div>
      </section>

      <section className="feature-row" aria-label="Funcionalidades">
        {FUNCIONALIDADES.map(({ to, titulo, texto, Icone, classe }) => (
          <Link key={to} to={to} className="feature-card">
            <span className={`feature-icon ${classe}`}><Icone size={22} aria-hidden="true" /></span>
            <span className="feature-text">
              <strong>{titulo}</strong>
              <span>{texto}</span>
            </span>
            <ChevronRight size={18} aria-hidden="true" className="feature-arrow" />
          </Link>
        ))}
      </section>

      <div className="home-columns">
        <section className="home-calendar card" aria-labelledby="titulo-calendario">
          <div className="home-calendar-header">
            <div>
              <h2 id="titulo-calendario">Calendário</h2>
              <p className="muted">Acompanhe os próximos eventos e atividades.</p>
            </div>
            <Link to="/calendario" className="button button-outline button-compact">Ver todos os eventos</Link>
          </div>
          <MonthCalendar />
        </section>

        <aside className="home-side" aria-label="Próximos eventos e participação">
          <section className="side-card side-invite">
            <h2>Participe do Grêmio</h2>
            <p>Envie dúvidas e sugestões e acompanhe as propostas e os projetos.</p>
            <Link to="/participacao" className="button button-primary">Enviar sugestão</Link>
          </section>

          <section className="side-card" aria-labelledby="titulo-agenda">
            <h2 id="titulo-agenda">Próximos eventos</h2>
            {proximos.loading && <SkeletonLines linhas={3} />}
            {!proximos.loading && (proximos.data ?? []).length === 0 && (
              <p className="muted">Nenhum evento cadastrado.</p>
            )}
            <ul className="agenda-list">
              {(proximos.data ?? []).map((item) => (
                <li key={item.id} className={`agenda-item ${CATEGORIAS[item.categoria]?.classe ?? ''}`}>
                  <span className="agenda-bar" aria-hidden="true" />
                  <span className="agenda-body">
                    <strong>{item.titulo}</strong>
                    <span className="muted">{formatarData(item.inicio)}, {formatarHora(item.inicio)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="side-card side-suggestion">
            <h2>Tem alguma sugestão?</h2>
            <p>Sua opinião ajuda a construir uma escola melhor para todos.</p>
            <Link to="/participacao" className="button button-outline">Ir para participação</Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
