import { usePageMeta } from '../hooks/usePageMeta.js';
import { Link } from 'react-router-dom';
import { CalendarDays, Megaphone, ShieldCheck, Newspaper, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { CATEGORIAS } from '../lib/categorias.js';
import EmptyState from '../components/EmptyState.jsx';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

export default function StudentAreaPage() {
  usePageMeta({ titulo: 'Área do estudante', privada: true });
  const { perfil, erroPerfil, session, eAdministrador } = useAuth();
  const agora = new Date().toISOString();

  const proximos = useSupabaseQuery(
    () => supabase.from('eventos').select('*').gte('inicio', agora).order('inicio').limit(10),
    [],
  );
  const avisos = useSupabaseQuery(
    () => supabase.from('comunicados').select('*').eq('publicado', true).order('criado_em', { ascending: false }).limit(5),
    [],
  );

  const eventos = proximos.data ?? [];
  const avaliacoes = eventos.filter((e) => e.categoria === 'avaliacao').slice(0, 5);

  return (
    <div className="container">
      <h1>Olá, {perfil?.nome ?? 'estudante'}</h1>
      <p className="muted">{session?.user?.email}</p>

      <div className="grid-home">
        <section className="card" aria-labelledby="perfil-titulo">
          <h2 id="perfil-titulo">Meu perfil</h2>
          {erroPerfil && <p className="feedback feedback-erro">Não foi possível carregar o perfil: {erroPerfil}</p>}
          {!erroPerfil && !perfil && <p className="muted">Perfil não encontrado para esta conta.</p>}
          <ul className="list">
            <li><strong>Nome:</strong> {perfil?.nome}</li>
            <li><strong>Tipo de conta:</strong> {eAdministrador ? 'Administrador' : 'Estudante'}</li>
          </ul>
        </section>

        <section className="card" aria-labelledby="atalhos-titulo">
          <h2 id="atalhos-titulo">Atalhos</h2>
          <div className="shortcuts shortcuts-inline">
            <Link className="shortcut-card" to="/calendario"><CalendarDays size={20} aria-hidden="true" />Calendário</Link>
            <Link className="shortcut-card" to="/jornal"><Newspaper size={20} aria-hidden="true" />Jornal</Link>
            <Link className="shortcut-card" to="/coordenacao"><Megaphone size={20} aria-hidden="true" />Coordenação</Link>
            {eAdministrador && <Link className="shortcut-card" to="/admin"><ShieldCheck size={20} aria-hidden="true" />Painel</Link>}
          </div>
        </section>

        <section className="card" aria-labelledby="proximas-titulo">
          <h2 id="proximas-titulo">Próximos compromissos</h2>
          {proximos.loading && <p className="muted">Carregando...</p>}
          {!proximos.loading && eventos.length === 0 && (
            <EmptyState icon={Inbox} title="Nenhum compromisso cadastrado" text="Os próximos compromissos aparecerão aqui." />
          )}
          <ul className="list">
            {eventos.map((e) => (
              <li key={e.id} className={`event-item ${CATEGORIAS[e.categoria]?.classe ?? ''}`}>
                <span className="date-badge">{formatarData(e.inicio)}</span>
                <span>{e.titulo}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="avaliacoes-titulo">
          <h2 id="avaliacoes-titulo">Próximas avaliações</h2>
          {proximos.loading && <p className="muted">Carregando...</p>}
          {!proximos.loading && avaliacoes.length === 0 && (
            <EmptyState icon={Inbox} title="Nenhuma avaliação cadastrada" />
          )}
          <ul className="list">
            {avaliacoes.map((e) => (
              <li key={e.id} className="event-item cat-avaliacao">
                <span className="date-badge">{formatarData(e.inicio)}</span>
                <span>{e.titulo}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card-wide" aria-labelledby="avisos-titulo">
          <h2 id="avisos-titulo">Avisos importantes</h2>
          {avisos.loading && <p className="muted">Carregando...</p>}
          {!avisos.loading && (avisos.data ?? []).length === 0 && (
            <EmptyState icon={Inbox} title="Nenhum aviso cadastrado" />
          )}
          <ul className="list">
            {(avisos.data ?? []).map((a) => (
              <li key={a.id} className="list-block">
                <strong>{a.titulo}</strong>
                <span className="muted">{a.mensagem}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <button type="button" className="button button-secondary section-gap" onClick={() => supabase.auth.signOut()}>
        Sair da conta
      </button>
    </div>
  );
}
