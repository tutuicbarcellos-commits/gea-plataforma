import { usePageMeta } from '../hooks/usePageMeta.js';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonLines } from '../components/Skeleton.jsx';
import { CATEGORIAS } from '../lib/categorias.js';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const inicioMes = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const fimMes = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1);
const inicioSemana = (d) => {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() - r.getDay());
  return r;
};
const mesmoDia = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function calcularIntervalo(visao, base) {
  if (visao === 'semana') {
    const inicio = inicioSemana(base);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 7);
    return { inicio, fim };
  }
  return { inicio: inicioMes(base), fim: fimMes(base) };
}

function gradeDoMes(base) {
  const primeiro = inicioMes(base);
  const inicio = new Date(primeiro);
  inicio.setDate(primeiro.getDate() - primeiro.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + i);
    return dia;
  });
}

const formatarHora = (valor) =>
  new Date(valor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const formatarDataLonga = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

export default function CalendarPage() {
  usePageMeta({ titulo: 'Calendário escolar', descricao: 'Avaliações, entregas, eventos e atividades do Grêmio Estudantil.' });
  const [visao, setVisao] = useState('mes');
  const [cursor, setCursor] = useState(() => new Date());
  const hoje = new Date();

  const intervalo = calcularIntervalo(visao, cursor);
  const inicioISO = intervalo.inicio.toISOString();
  const fimISO = intervalo.fim.toISOString();

  const { data, loading, error } = useSupabaseQuery(
    () => supabase.from('eventos').select('*').gte('inicio', inicioISO).lt('inicio', fimISO).order('inicio'),
    [inicioISO, fimISO],
  );
  const eventos = data ?? [];

  const eventosDoDia = (dia) => eventos.filter((e) => mesmoDia(new Date(e.inicio), dia));

  function deslocar(sentido) {
    setCursor((atual) => {
      if (visao === 'semana') {
        const novo = new Date(atual);
        novo.setDate(novo.getDate() + 7 * sentido);
        return novo;
      }
      return new Date(atual.getFullYear(), atual.getMonth() + sentido, 1);
    });
  }

  const titulo =
    visao === 'semana'
      ? `Semana de ${inicioSemana(cursor).toLocaleDateString('pt-BR')}`
      : `${MESES[cursor.getMonth()]} de ${cursor.getFullYear()}`;

  const semana = Array.from({ length: 7 }, (_, i) => {
    const dia = inicioSemana(cursor);
    dia.setDate(dia.getDate() + i);
    return dia;
  });

  return (
    <div className="container">
      <h1>Calendário escolar</h1>

      <div className="cal-toolbar">
        <div className="cal-nav">
          <button type="button" className="icon-button" aria-label="Período anterior" onClick={() => deslocar(-1)}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <h2 className="cal-title" aria-live="polite">{titulo}</h2>
          <button type="button" className="icon-button" aria-label="Próximo período" onClick={() => deslocar(1)}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="segmented" role="group" aria-label="Modo de visualização">
          {[
            { id: 'mes', rotulo: 'Mês' },
            { id: 'semana', rotulo: 'Semana' },
            { id: 'lista', rotulo: 'Lista' },
          ].map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              className={`segment ${visao === opcao.id ? 'is-active' : ''}`}
              aria-pressed={visao === opcao.id}
              onClick={() => setVisao(opcao.id)}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      </div>

      <ul className="legend" aria-label="Legenda de categorias">
        {Object.entries(CATEGORIAS).map(([chave, cat]) => (
          <li key={chave}><span className={`legend-dot ${cat.classe}`} aria-hidden="true" />{cat.rotulo}</li>
        ))}
      </ul>

      {loading && <SkeletonLines linhas={4} />}
      {error && <p className="feedback feedback-erro">Não foi possível carregar o calendário.</p>}

      {!loading && !error && visao === 'mes' && (
        <div className="cal-grid" role="grid" aria-label="Calendário mensal">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="cal-head" role="columnheader">{d}</div>
          ))}
          {gradeDoMes(cursor).map((dia) => {
            const fora = dia.getMonth() !== cursor.getMonth();
            const itens = eventosDoDia(dia);
            return (
              <div
                key={dia.toISOString()}
                role="gridcell"
                className={`cal-cell ${fora ? 'is-outside' : ''} ${mesmoDia(dia, hoje) ? 'is-today' : ''}`}
              >
                <span className="cal-day">{dia.getDate()}</span>
                {itens.map((e) => (
                  <span key={e.id} className={`cal-chip ${CATEGORIAS[e.categoria]?.classe ?? ''}`} title={e.titulo}>
                    {e.titulo}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && visao === 'semana' && (
        <div className="cal-week">
          {semana.map((dia) => {
            const itens = eventosDoDia(dia);
            return (
              <section key={dia.toISOString()} className={`cal-week-day ${mesmoDia(dia, hoje) ? 'is-today' : ''}`}>
                <h3>{DIAS_SEMANA[dia.getDay()]} {dia.getDate()}</h3>
                {itens.length === 0 && <p className="muted">Sem compromissos</p>}
                <ul className="list">
                  {itens.map((e) => (
                    <li key={e.id} className={`event-item ${CATEGORIAS[e.categoria]?.classe ?? ''}`}>
                      <span className="event-time">{formatarHora(e.inicio)}</span>
                      <span>{e.titulo}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {!loading && !error && visao === 'lista' && (
        eventos.length === 0 ? (
          <EmptyState icon={CalendarDays} title="Nenhum compromisso cadastrado neste período" text="Use as setas para navegar entre os meses." />
        ) : (
          <ul className="event-list">
            {eventos.map((e) => (
              <li key={e.id} className={`event-item event-item-card ${CATEGORIAS[e.categoria]?.classe ?? ''}`}>
                <span className="event-date">{formatarDataLonga(e.inicio)} às {formatarHora(e.inicio)}</span>
                <strong>{e.titulo}</strong>
                {e.descricao && <span className="muted">{e.descricao}</span>}
                <span className="cat-tag">{CATEGORIAS[e.categoria]?.rotulo}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
