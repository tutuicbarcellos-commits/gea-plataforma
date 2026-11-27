import { Mail, Phone, Clock, Megaphone, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonLines } from '../components/Skeleton.jsx';
import FormularioSugestao from '../components/FormularioSugestao.jsx';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

export default function CoordenacaoPage() {
  usePageMeta({
    titulo: 'Coordenação Pedagógica',
    descricao: 'Contatos, horários de atendimento e comunicados da Coordenação Pedagógica.',
  });
  const contato = useSupabaseQuery(() => supabase.from('coordenacao').select('*').eq('id', 1), []);
  const comunicados = useSupabaseQuery(
    () => supabase.from('comunicados').select('*').eq('publicado', true).order('fixado', { ascending: false }).order('criado_em', { ascending: false }),
    [],
  );
  const info = contato.data?.[0];
  const temContato = info && (info.email || info.telefone || info.horario_atendimento);

  return (
    <div className="container">
      <h1>Coordenação Pedagógica</h1>
      <p className="muted">Contatos, horários de atendimento, comunicados e canal para dúvidas e sugestões.</p>

      <div className="grid-two section-gap">
        <section className="card" aria-labelledby="contato-titulo">
          <h2 id="contato-titulo">Informações de contato</h2>
          {contato.loading && <SkeletonLines linhas={3} />}
          {!contato.loading && !temContato && (
            <EmptyState icon={Inbox} title="Informações não cadastradas" text="Os contatos e horários serão exibidos aqui quando forem cadastrados pela administração." />
          )}
          {temContato && (
            <ul className="list">
              {info.email && <li><Mail size={18} aria-hidden="true" /> {info.email}</li>}
              {info.telefone && <li><Phone size={18} aria-hidden="true" /> {info.telefone}</li>}
              {info.horario_atendimento && <li><Clock size={18} aria-hidden="true" /> {info.horario_atendimento}</li>}
            </ul>
          )}
        </section>

        <FormularioSugestao />
      </div>

      <section className="card section-gap" aria-labelledby="comunicados-titulo">
        <h2 id="comunicados-titulo"><Megaphone size={20} aria-hidden="true" /> Comunicados da coordenação</h2>
        {comunicados.loading && <SkeletonLines linhas={3} />}
        {!comunicados.loading && (comunicados.data ?? []).length === 0 && (
          <EmptyState icon={Inbox} title="Nenhum comunicado cadastrado" />
        )}
        <ul className="list">
          {(comunicados.data ?? []).map((c) => (
            <li key={c.id} className="list-block">
              <span className="muted">{formatarData(c.criado_em)}{c.fixado ? ' | Fixado' : ''}</span>
              <strong>{c.titulo}</strong>
              <span>{c.mensagem}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
