import { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import Feedback from './Feedback.jsx';

export default function FormularioSugestao() {
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
        <input id="sug-nome" required minLength={2} maxLength={120} value={dados.nome} onChange={alterar('nome')} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="sug-email">E-mail</label>
        <input id="sug-email" type="email" required maxLength={200} value={dados.email} onChange={alterar('email')} autoComplete="email" />
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
