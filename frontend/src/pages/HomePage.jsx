import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardCheck, Megaphone, Newspaper, ArrowRight, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { CATEGORIAS } from '../lib/categorias.js';
import EmptyState from '../components/EmptyState.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';
import { SkeletonLines } from '../components/Skeleton.jsx';
import '../styles/home.css';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

const formatarHora = (valor) =>
  new Date(valor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function HomePage() {
  usePageMeta({
    descricao: 'Painel do Grêmio Estudantil com compromissos, avisos e notícias da Chapa Connecta.',
  });
  const { perfil, usuarioLogado } = useAuth();
  const agora = new Date().toISOString();

  const eventos = useSupabaseQuery(
    () => supabase.from('eventos').select('*').gte('inicio', agora).order('inicio').limit(4),
    [],
  );
  const avaliacoes = useSupabaseQuery(
    () => supabase.from('eventos').select('*').eq('categoria', 'avaliacao').gte('inicio', agora).order('inicio').limit(1),
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

  const saudacao = usuarioLogado && perfil?.nome ? `Olá, ${perfil.nome}` : 'Tudo do Grêmio em um só lugar';
  const proximoEvento = eventos.data?.[0];
  const proximaAvaliacao = avaliacoes.data?.[0];
  const ultimoAviso = comunicados.data?.[0];
  const ultimaNoticia = noticias.data?.[0];

  return (
    <div className="container home">
      <section className="home-hero" aria-labelledby="titulo-inicio">
        <div className="home-hero-text">
          <h1 id="titulo-inicio">{saudacao}</h1>
          <p className="home-hero-lead">
            Acompanhe avaliações, entregas, eventos e comunicados do Grêmio Estudantil em um só lugar.
          </p>
          <div className="home-hero-actions">
            <Link className="button button-primary" to="/calendario">
              Ver calendário <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-outline" to="/jornal">Ler o Jornal do GEA</Link>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="home-info" aria-label="Resumo">
        <InfoCard icone={CalendarDays} classe="icon-blue" rotulo="Próximo evento"
          titulo={proximoEvento?.titulo} texto={proximoEvento ? `${formatarData(proximoEvento.inicio)}, ${formatarHora(proximoEvento.inicio)}` : null}
          vazio="Nenhum evento cadastrado" carregando={eventos.loading} to="/calendario" />
        <InfoCard icone={ClipboardCheck} classe="icon-pink" rotulo="Próxima avaliação"
          titulo={proximaAvaliacao?.titulo} texto={proximaAvaliacao ? formatarData(proximaAvaliacao.inicio) : null}
          vazio="Nenhuma avaliação cadastrada" carregando={avaliacoes.loading} to="/calendario" />
        <InfoCard icone={Megaphone} classe="icon-pink" rotulo="Último aviso"
          titulo={ultimoAviso?.titulo} texto={ultimoAviso?.mensagem}
          vazio="Nenhum aviso cadastrado" carregando={comunicados.loading} to="/coordenacao" />
        <InfoCard icone={Newspaper} classe="icon-blue" rotulo="Última notícia"
          titulo={ultimaNoticia?.titulo} texto={ultimaNoticia?.resumo}
          vazio="Nenhuma notícia publicada" carregando={noticias.loading} to="/jornal" />
      </section>

      <div className="home-grid">
        <section className="home-panel" aria-labelledby="titulo-proximos">
          <h2 id="titulo-proximos">Próximos compromissos</h2>
          {eventos.loading && <SkeletonLines linhas={3} />}
          {eventos.error && <p className="feedback feedback-erro">Não foi possível carregar os compromissos.</p>}
          {!eventos.loading && !eventos.error && (eventos.data ?? []).length === 0 && (
            <EmptyState icon={Inbox} title="Nenhum compromisso cadastrado" text="Os próximos eventos e avaliações aparecerão aqui." />
          )}
          <ul className="list">
            {(eventos.data ?? []).map((item) => (
              <li key={item.id} className={`home-event ${CATEGORIAS[item.categoria]?.classe ?? ''}`}>
                <span className="home-event-date">{formatarData(item.inicio)} | {formatarHora(item.inicio)}</span>
                <span>{item.titulo}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-panel" aria-labelledby="titulo-avisos">
          <h2 id="titulo-avisos">Avisos importantes</h2>
          {comunicados.loading && <SkeletonLines linhas={2} />}
          {comunicados.error && <p className="feedback feedback-erro">Não foi possível carregar os avisos.</p>}
          {!comunicados.loading && !comunicados.error && (comunicados.data ?? []).length === 0 && (
            <EmptyState icon={Inbox} title="Nenhum aviso cadastrado" text="Comunicados publicados pelo Grêmio aparecerão aqui." />
          )}
          {(comunicados.data ?? []).map((item) => (
            <div key={item.id} className="home-notice">
              <strong>{item.titulo}</strong>
              <span>{item.mensagem}</span>
            </div>
          ))}
        </section>

        <section className="home-panel home-wide" aria-labelledby="titulo-noticias">
          <div className="home-panel-header">
            <h2 id="titulo-noticias">Últimas notícias do GEA</h2>
            <Link to="/jornal" className="home-link">Ver todas</Link>
          </div>
          {noticias.loading && <SkeletonLines linhas={3} />}
          {noticias.error && <p className="feedback feedback-erro">Não foi possível carregar as notícias.</p>}
          {!noticias.loading && !noticias.error && (noticias.data ?? []).length === 0 && (
            <EmptyState icon={Newspaper} title="Nenhuma notícia publicada" text="As novidades do Jornal do GEA aparecerão aqui." />
          )}
          <div className="home-news">
            {(noticias.data ?? []).map((item) => (
              <Link key={item.id} to={`/jornal/${item.id}`} className="home-news-card">
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

function InfoCard({ icone: Icone, classe, rotulo, titulo, texto, vazio, carregando, to }) {
  return (
    <Link to={to} className="home-info-card">
      <span className={`home-info-icon ${classe}`}>
        <Icone size={22} aria-hidden="true" />
      </span>
      <p className="home-info-label">{rotulo}</p>
      {carregando && <SkeletonLines linhas={2} />}
      {!carregando && titulo && <p className="home-info-title">{titulo}</p>}
      {!carregando && texto && <p className="home-info-text">{texto}</p>}
      {!carregando && !titulo && <p className="home-info-text">{vazio}</p>}
    </Link>
  );
}
