import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import { CATEGORIAS } from '../lib/categorias.js';
import { SkeletonLines } from './Skeleton.jsx';

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const inicioMes = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const fimMes = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1);
const mesmoDia = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const capitalizar = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);
const formatarHora = (valor) => new Date(valor).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

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

/** Calendario mensal compacto para a Home: indicadores coloridos, dia selecionado e retorno a data atual. */
export default function MonthCalendar() {
  const hoje = new Date();
  const [cursor, setCursor] = useState(() => inicioMes(new Date()));
  const [selecionado, setSelecionado] = useState(() => new Date());

  const inicioISO = inicioMes(cursor).toISOString();
  const fimISO = fimMes(cursor).toISOString();
  const { data, loading, error } = useSupabaseQuery(
    () => supabase.from('eventos').select('*').gte('inicio', inicioISO).lt('inicio', fimISO).order('inicio'),
    [inicioISO, fimISO],
  );
  const eventos = data ?? [];
  const eventosDoDia = (dia) => eventos.filter((e) => mesmoDia(new Date(e.inicio), dia));

  function irParaHoje() {
    setCursor(inicioMes(new Date()));
    setSelecionado(new Date());
  }

  function deslocar(sentido) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + sentido, 1));
  }

  const doDiaSelecionado = eventosDoDia(selecionado);

  return (
    <div className="month-calendar">
      <div className="month-header">
        <h2 className="month-title" aria-live="polite">{capitalizar(MESES[cursor.getMonth()])} de {cursor.getFullYear()}</h2>
        <div className="month-controls">
          <button type="button" className="icon-button" aria-label="Mês anterior" onClick={() => deslocar(-1)}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" className="icon-button" aria-label="Próximo mês" onClick={() => deslocar(1)}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <button type="button" className="button button-outline button-compact" onClick={irParaHoje}>Hoje</button>
        </div>
      </div>

      {loading && <SkeletonLines linhas={4} />}
      {error && <p className="feedback feedback-erro">Não foi possível carregar o calendário.</p>}

      {!loading && !error && (
        <div className="month-grid" role="grid" aria-label="Calendário mensal">
          {DIAS.map((d) => (
            <div key={d} className="month-head" role="columnheader">{d}</div>
          ))}
          {gradeDoMes(cursor).map((dia) => {
            const fora = dia.getMonth() !== cursor.getMonth();
            const itens = eventosDoDia(dia);
            const ativo = mesmoDia(dia, selecionado);
            return (
              <button
                key={dia.toISOString()}
                type="button"
                role="gridcell"
                aria-pressed={ativo}
                aria-label={`${dia.getDate()} de ${MESES[dia.getMonth()]}${itens.length ? `, ${itens.length} compromisso(s)` : ''}`}
                className={`month-day ${fora ? 'is-outside' : ''} ${mesmoDia(dia, hoje) ? 'is-today' : ''} ${ativo ? 'is-selected' : ''}`}
                onClick={() => setSelecionado(dia)}
              >
                <span className="month-day-number">{dia.getDate()}</span>
                <span className="month-dots" aria-hidden="true">
                  {itens.slice(0, 3).map((e) => (
                    <span key={e.id} className={`month-dot ${CATEGORIAS[e.categoria]?.classe ?? ''}`} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!loading && !error && (
        <div className="month-selected" aria-live="polite">
          <h3>{selecionado.getDate()} de {MESES[selecionado.getMonth()]}</h3>
          {doDiaSelecionado.length === 0 && <p className="muted">Nenhum compromisso neste dia.</p>}
          <ul className="list">
            {doDiaSelecionado.map((e) => (
              <li key={e.id} className={`agenda-item ${CATEGORIAS[e.categoria]?.classe ?? ''}`}>
                <span className="agenda-time">{formatarHora(e.inicio)}</span>
                <span>{e.titulo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
