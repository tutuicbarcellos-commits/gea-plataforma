import { useEffect, useState } from 'react';
import { Lightbulb, FolderKanban, Info, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import Feedback from '../Feedback.jsx';

const sucesso = (texto) => ({ tipo: 'sucesso', texto });
const erro = (texto) => ({ tipo: 'erro', texto });

export function PropostaForm() {
  const vazio = { titulo: '', descricao: '', autor: '', publicada: true };
  const [dados, setDados] = useState(vazio);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (e) =>
    setDados({ ...dados, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase.from('propostas').insert({ ...dados, autor: dados.autor || null });
    setEnviando(false);
    if (error) return setStatus(erro('Não foi possível salvar a proposta.'));
    setDados(vazio);
    setStatus(sucesso('Proposta salva.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><Lightbulb size={20} aria-hidden="true" /> Cadastrar proposta</h2>
      <div className="field"><label htmlFor="p-titulo">Título</label><input id="p-titulo" required value={dados.titulo} onChange={alterar('titulo')} /></div>
      <div className="field"><label htmlFor="p-descricao">Descrição</label><textarea id="p-descricao" required rows={4} value={dados.descricao} onChange={alterar('descricao')} /></div>
      <div className="field"><label htmlFor="p-autor">Apresentada por (opcional)</label><input id="p-autor" value={dados.autor} onChange={alterar('autor')} /></div>
      <label className="checkbox"><input type="checkbox" checked={dados.publicada} onChange={alterar('publicada')} /> Publicar agora</label>
      <button type="submit" className="button button-primary" disabled={enviando}><Save size={18} aria-hidden="true" /> Salvar proposta</button>
      <Feedback status={status} />
    </form>
  );
}

export function ProjetoForm() {
  const vazio = { titulo: '', descricao: '', situacao: 'em_andamento', publicado: true };
  const [dados, setDados] = useState(vazio);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (e) =>
    setDados({ ...dados, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase.from('projetos').insert(dados);
    setEnviando(false);
    if (error) return setStatus(erro('Não foi possível salvar o projeto.'));
    setDados(vazio);
    setStatus(sucesso('Projeto salvo.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><FolderKanban size={20} aria-hidden="true" /> Cadastrar projeto</h2>
      <div className="field"><label htmlFor="pr-titulo">Título</label><input id="pr-titulo" required value={dados.titulo} onChange={alterar('titulo')} /></div>
      <div className="field"><label htmlFor="pr-descricao">Descrição</label><textarea id="pr-descricao" required rows={4} value={dados.descricao} onChange={alterar('descricao')} /></div>
      <div className="field">
        <label htmlFor="pr-situacao">Situação</label>
        <select id="pr-situacao" value={dados.situacao} onChange={alterar('situacao')}>
          <option value="planejado">Planejado</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>
      <label className="checkbox"><input type="checkbox" checked={dados.publicado} onChange={alterar('publicado')} /> Publicar agora</label>
      <button type="submit" className="button button-primary" disabled={enviando}><Save size={18} aria-hidden="true" /> Salvar projeto</button>
      <Feedback status={status} />
    </form>
  );
}

export function ApresentacaoForm() {
  const [dados, setDados] = useState({ titulo: '', texto: '' });
  const [carregado, setCarregado] = useState(false);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    supabase.from('apresentacao').select('*').eq('id', 1).then(({ data }) => {
      const info = data?.[0];
      if (info) setDados({ titulo: info.titulo ?? '', texto: info.texto ?? '' });
      setCarregado(true);
    });
  }, []);

  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase
      .from('apresentacao')
      .update({ titulo: dados.titulo, texto: dados.texto || null, atualizado_em: new Date().toISOString() })
      .eq('id', 1);
    setEnviando(false);
    setStatus(error ? erro('Não foi possível atualizar a apresentação.') : sucesso('Apresentação atualizada.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><Info size={20} aria-hidden="true" /> Apresentação do GEA</h2>
      {!carregado && <p className="muted">Carregando...</p>}
      <div className="field"><label htmlFor="ap-titulo">Título</label><input id="ap-titulo" required value={dados.titulo} onChange={alterar('titulo')} /></div>
      <div className="field"><label htmlFor="ap-texto">Texto de apresentação</label><textarea id="ap-texto" rows={8} value={dados.texto} onChange={alterar('texto')} /></div>
      <button type="submit" className="button button-primary" disabled={enviando || !carregado}><Save size={18} aria-hidden="true" /> Atualizar apresentação</button>
      <Feedback status={status} />
    </form>
  );
}
