import { useState } from 'react';
import { Mail, Phone, Clock, Send, Megaphone, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import EmptyState from '../components/EmptyState.jsx';
import Feedback from '../components/Feedback.jsx';

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

function FormularioSugestao() {
  const vazio = { nome: '', email: '', mensagem: '' };
  const [dados, setDados] = useState(vazio);
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState(null);

  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase.from('sugestoes').insert(dados);
    setEnviando(false);
    if (error) {
      setStatus({ tipo: 'erro', texto: 'Não foi possível enviar. Confira os campos e tente novamente.' });
      return;
    }
    setDados(vazio);
    setStatus({ tipo: 'sucesso', texto: 'Mensagem enviada. Obrigado pela participação.' });
  }

  return (
    <form className="card" onSubmit={enviar} noValidate>
      <h2>Enviar dúvida ou sugestão</h2>
      <div className="field">
        <label htmlFor="sug-nome">Nome</label>
        <input id="sug-nome" required minLength={2} maxLength={120} value={dados.nome} onChange={alterar('nome')} />
      </div>
      <div className="field">
        <label htmlFor="sug-email">E-mail</label>
        <input id="sug-email" type="email" required maxLength={200} value={dados.email} onChange={alterar('email')} />
      </div>
      <div className="field">
        <label htmlFor="sug-mensagem">Mensagem</label>
        <textarea id="sug-mensagem" required minLength={5} maxLength={2000} rows={5} value={dados.mensagem} onChange={alterar('mensagem')} />
      </div>
      <button type="submit" className="button button-primary" disabled={enviando}>
        <Send size={18} aria-hidden="true" /> {enviando ? 'Enviando...' : 'Enviar mensagem'}
      </button>
      <Feedback status={status} />
    </form>
  );
}

export default function CoordenacaoPage() {
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

      <div className="grid-two">
        <section className="card" aria-labelledby="contato-titulo">
          <h2 id="contato-titulo">Informações de contato</h2>
          {contato.loading && <p className="muted">Carregando...</p>}
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
        {comunicados.loading && <p className="muted">Carregando...</p>}
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
