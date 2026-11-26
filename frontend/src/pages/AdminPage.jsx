import { useEffect, useState } from 'react';
import { Newspaper, CalendarPlus, Megaphone, Building2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import Feedback from '../components/Feedback.jsx';
import { CATEGORIAS } from './CalendarPage.jsx';

const sucesso = (texto) => ({ tipo: 'sucesso', texto });
const erro = (texto) => ({ tipo: 'erro', texto });
const paraISO = (valor) => (valor ? new Date(valor).toISOString() : null);

function NoticiaForm() {
  const vazio = { titulo: '', resumo: '', conteudo: '', imagem_url: '', publicado: true };
  const [dados, setDados] = useState(vazio);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (e) =>
    setDados({ ...dados, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase.from('noticias').insert({
      titulo: dados.titulo,
      resumo: dados.resumo,
      conteudo: dados.conteudo,
      imagem_url: dados.imagem_url || null,
      publicado: dados.publicado,
      publicado_em: dados.publicado ? new Date().toISOString() : null,
    });
    setEnviando(false);
    if (error) return setStatus(erro('Não foi possível salvar a notícia. Verifique os campos.'));
    setDados(vazio);
    setStatus(sucesso('Notícia salva.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><Newspaper size={20} aria-hidden="true" /> Publicar notícia</h2>
      <div className="field"><label htmlFor="n-titulo">Título</label><input id="n-titulo" required value={dados.titulo} onChange={alterar('titulo')} /></div>
      <div className="field"><label htmlFor="n-resumo">Resumo</label><textarea id="n-resumo" required rows={2} value={dados.resumo} onChange={alterar('resumo')} /></div>
      <div className="field"><label htmlFor="n-conteudo">Texto completo</label><textarea id="n-conteudo" required rows={6} value={dados.conteudo} onChange={alterar('conteudo')} /></div>
      <div className="field"><label htmlFor="n-imagem">Endereço da imagem (opcional)</label><input id="n-imagem" type="url" value={dados.imagem_url} onChange={alterar('imagem_url')} /></div>
      <label className="checkbox"><input type="checkbox" checked={dados.publicado} onChange={alterar('publicado')} /> Publicar agora</label>
      <button type="submit" className="button button-primary" disabled={enviando}><Save size={18} aria-hidden="true" /> Salvar notícia</button>
      <Feedback status={status} />
    </form>
  );
}

function EventoForm() {
  const vazio = { titulo: '', descricao: '', categoria: 'evento', inicio: '', fim: '' };
  const [dados, setDados] = useState(vazio);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase.from('eventos').insert({
      titulo: dados.titulo,
      descricao: dados.descricao || null,
      categoria: dados.categoria,
      inicio: paraISO(dados.inicio),
      fim: paraISO(dados.fim),
    });
    setEnviando(false);
    if (error) return setStatus(erro('Não foi possível salvar o compromisso. Verifique os campos.'));
    setDados(vazio);
    setStatus(sucesso('Compromisso adicionado ao calendário.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><CalendarPlus size={20} aria-hidden="true" /> Adicionar ao calendário</h2>
      <div className="field"><label htmlFor="e-titulo">Título</label><input id="e-titulo" required value={dados.titulo} onChange={alterar('titulo')} /></div>
      <div className="field">
        <label htmlFor="e-categoria">Categoria</label>
        <select id="e-categoria" value={dados.categoria} onChange={alterar('categoria')}>
          {Object.entries(CATEGORIAS).map(([chave, cat]) => <option key={chave} value={chave}>{cat.rotulo}</option>)}
        </select>
      </div>
      <div className="field"><label htmlFor="e-inicio">Início</label><input id="e-inicio" type="datetime-local" required value={dados.inicio} onChange={alterar('inicio')} /></div>
      <div className="field"><label htmlFor="e-fim">Término (opcional)</label><input id="e-fim" type="datetime-local" value={dados.fim} onChange={alterar('fim')} /></div>
      <div className="field"><label htmlFor="e-descricao">Descrição (opcional)</label><textarea id="e-descricao" rows={3} value={dados.descricao} onChange={alterar('descricao')} /></div>
      <button type="submit" className="button button-primary" disabled={enviando}><Save size={18} aria-hidden="true" /> Salvar compromisso</button>
      <Feedback status={status} />
    </form>
  );
}

function ComunicadoForm() {
  const vazio = { titulo: '', mensagem: '', publicado: true, fixado: false };
  const [dados, setDados] = useState(vazio);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const alterar = (campo) => (e) =>
    setDados({ ...dados, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase.from('comunicados').insert(dados);
    setEnviando(false);
    if (error) return setStatus(erro('Não foi possível publicar o comunicado.'));
    setDados(vazio);
    setStatus(sucesso('Comunicado salvo.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><Megaphone size={20} aria-hidden="true" /> Publicar comunicado</h2>
      <div className="field"><label htmlFor="c-titulo">Título</label><input id="c-titulo" required value={dados.titulo} onChange={alterar('titulo')} /></div>
      <div className="field"><label htmlFor="c-mensagem">Mensagem</label><textarea id="c-mensagem" required rows={4} value={dados.mensagem} onChange={alterar('mensagem')} /></div>
      <label className="checkbox"><input type="checkbox" checked={dados.publicado} onChange={alterar('publicado')} /> Publicar agora</label>
      <label className="checkbox"><input type="checkbox" checked={dados.fixado} onChange={alterar('fixado')} /> Fixar no topo</label>
      <button type="submit" className="button button-primary" disabled={enviando}><Save size={18} aria-hidden="true" /> Salvar comunicado</button>
      <Feedback status={status} />
    </form>
  );
}

function CoordenacaoForm() {
  const [dados, setDados] = useState({ email: '', telefone: '', horario_atendimento: '' });
  const [carregado, setCarregado] = useState(false);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    supabase.from('coordenacao').select('*').eq('id', 1).then(({ data }) => {
      const info = data?.[0];
      if (info) setDados({ email: info.email ?? '', telefone: info.telefone ?? '', horario_atendimento: info.horario_atendimento ?? '' });
      setCarregado(true);
    });
  }, []);

  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);
    const { error } = await supabase
      .from('coordenacao')
      .update({ ...dados, email: dados.email || null, telefone: dados.telefone || null, horario_atendimento: dados.horario_atendimento || null, atualizado_em: new Date().toISOString() })
      .eq('id', 1);
    setEnviando(false);
    setStatus(error ? erro('Não foi possível atualizar as informações.') : sucesso('Informações da coordenação atualizadas.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><Building2 size={20} aria-hidden="true" /> Informações da coordenação</h2>
      {!carregado && <p className="muted">Carregando...</p>}
      <div className="field"><label htmlFor="co-email">E-mail</label><input id="co-email" type="email" value={dados.email} onChange={alterar('email')} /></div>
      <div className="field"><label htmlFor="co-telefone">Telefone</label><input id="co-telefone" value={dados.telefone} onChange={alterar('telefone')} /></div>
      <div className="field"><label htmlFor="co-horario">Horário de atendimento</label><input id="co-horario" value={dados.horario_atendimento} onChange={alterar('horario_atendimento')} /></div>
      <button type="submit" className="button button-primary" disabled={enviando || !carregado}><Save size={18} aria-hidden="true" /> Atualizar informações</button>
      <Feedback status={status} />
    </form>
  );
}

export default function AdminPage() {
  return (
    <div className="container">
      <h1>Painel administrativo</h1>
      <p className="muted">Área restrita. As alterações aparecem no site assim que forem salvas.</p>
      <div className="admin-grid">
        <NoticiaForm />
        <EventoForm />
        <ComunicadoForm />
        <CoordenacaoForm />
      </div>
    </div>
  );
}
