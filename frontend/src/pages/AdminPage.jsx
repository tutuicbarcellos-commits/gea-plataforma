import { usePageMeta } from '../hooks/usePageMeta.js';
import { useEffect, useState } from 'react';
import { Newspaper, CalendarPlus, Megaphone, Building2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import Feedback from '../components/Feedback.jsx';
import { CATEGORIAS } from '../lib/categorias.js';
import ListaGerenciavel from '../components/ListaGerenciavel.jsx';
import { PropostaForm, ProjetoForm, ApresentacaoForm } from '../components/admin/FormulariosInstitucionais.jsx';

const sucesso = (texto) => ({ tipo: 'sucesso', texto });
const erro = (texto) => ({ tipo: 'erro', texto });
const paraISO = (valor) => (valor ? new Date(valor).toISOString() : null);

const TIPOS_IMAGEM = ['image/jpeg', 'image/png', 'image/webp'];
const LIMITE_IMAGEM = 2 * 1024 * 1024;

function NoticiaForm() {
  const vazio = { titulo: '', resumo: '', conteudo: '', publicado: true };
  const [dados, setDados] = useState(vazio);
  const [arquivo, setArquivo] = useState(null);
  const [previa, setPrevia] = useState(null);
  const [status, setStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa);
    };
  }, [previa]);

  const alterar = (campo) => (e) =>
    setDados({ ...dados, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  function escolherImagem(e) {
    const escolhido = e.target.files?.[0];
    setStatus(null);
    if (!escolhido) {
      setArquivo(null);
      setPrevia(null);
      return;
    }
    if (!TIPOS_IMAGEM.includes(escolhido.type)) {
      e.target.value = '';
      setStatus(erro('Use uma imagem nos formatos JPG, PNG ou WebP.'));
      return;
    }
    if (escolhido.size > LIMITE_IMAGEM) {
      e.target.value = '';
      setStatus(erro('A imagem deve ter no máximo 2 MB.'));
      return;
    }
    setArquivo(escolhido);
    setPrevia(URL.createObjectURL(escolhido));
  }

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);

    let imagemUrl = null;
    if (arquivo) {
      const extensao = arquivo.type === 'image/png' ? 'png' : arquivo.type === 'image/webp' ? 'webp' : 'jpg';
      const caminho = `${crypto.randomUUID()}.${extensao}`;
      const { error: falhaEnvio } = await supabase.storage
        .from('noticias')
        .upload(caminho, arquivo, { contentType: arquivo.type, cacheControl: '31536000' });
      if (falhaEnvio) {
        setEnviando(false);
        setStatus(erro('Não foi possível enviar a imagem. Tente novamente.'));
        return;
      }
      imagemUrl = supabase.storage.from('noticias').getPublicUrl(caminho).data.publicUrl;
    }

    const { error } = await supabase.from('noticias').insert({
      titulo: dados.titulo,
      resumo: dados.resumo,
      conteudo: dados.conteudo,
      imagem_url: imagemUrl,
      publicado: dados.publicado,
      publicado_em: dados.publicado ? new Date().toISOString() : null,
    });
    setEnviando(false);
    if (error) return setStatus(erro('Não foi possível salvar a notícia. Verifique os campos.'));

    setDados(vazio);
    setArquivo(null);
    setPrevia(null);
    e.target.reset();
    setStatus(sucesso('Notícia salva.'));
  }

  return (
    <form className="card admin-form" onSubmit={enviar}>
      <h2><Newspaper size={20} aria-hidden="true" /> Publicar notícia</h2>
      <div className="field"><label htmlFor="n-titulo">Título</label><input id="n-titulo" required value={dados.titulo} onChange={alterar('titulo')} /></div>
      <div className="field"><label htmlFor="n-resumo">Resumo</label><textarea id="n-resumo" required rows={2} value={dados.resumo} onChange={alterar('resumo')} /></div>
      <div className="field"><label htmlFor="n-conteudo">Texto completo</label><textarea id="n-conteudo" required rows={6} value={dados.conteudo} onChange={alterar('conteudo')} /></div>
      <div className="field">
        <label htmlFor="n-imagem">Imagem de capa (opcional, até 2 MB, JPG, PNG ou WebP)</label>
        <input id="n-imagem" type="file" accept="image/jpeg,image/png,image/webp" onChange={escolherImagem} />
      </div>
      {previa && <img src={previa} alt="Pré-visualização da imagem de capa" className="upload-preview" />}
      <label className="checkbox"><input type="checkbox" checked={dados.publicado} onChange={alterar('publicado')} /> Publicar agora</label>
      <button type="submit" className="button button-primary" disabled={enviando}><Save size={18} aria-hidden="true" /> {enviando ? 'Salvando...' : 'Salvar notícia'}</button>
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

const SECOES = [
  { id: 'publicar', rotulo: 'Publicar conteúdo' },
  { id: 'institucional', rotulo: 'Páginas institucionais' },
  { id: 'coordenacao', rotulo: 'Coordenação' },
  { id: 'gerenciar', rotulo: 'Gerenciar itens' },
];

export default function AdminPage() {
  usePageMeta({ titulo: 'Painel administrativo', privada: true });

  return (
    <div className="container admin-shell">
      <aside className="admin-nav" aria-label="Seções do painel">
        <ul>
          {SECOES.map((secao) => (
            <li key={secao.id}><a href={`#${secao.id}`}>{secao.rotulo}</a></li>
          ))}
        </ul>
      </aside>

      <div className="admin-content">
        <h1>Painel administrativo</h1>
        <p className="muted">Área restrita. As alterações aparecem no site assim que forem salvas.</p>

        <section id="publicar" className="admin-section" aria-labelledby="t-publicar">
          <h2 id="t-publicar" className="section-title">Publicar conteúdo</h2>
          <div className="admin-grid">
            <NoticiaForm />
            <EventoForm />
            <ComunicadoForm />
          </div>
        </section>

        <section id="institucional" className="admin-section" aria-labelledby="t-institucional">
          <h2 id="t-institucional" className="section-title">Páginas institucionais</h2>
          <div className="admin-grid">
            <ApresentacaoForm />
            <PropostaForm />
            <ProjetoForm />
          </div>
        </section>

        <section id="coordenacao" className="admin-section" aria-labelledby="t-coordenacao">
          <h2 id="t-coordenacao" className="section-title">Coordenação</h2>
          <div className="admin-grid">
            <CoordenacaoForm />
          </div>
        </section>

        <section id="gerenciar" className="admin-section" aria-labelledby="t-gerenciar">
          <h2 id="t-gerenciar" className="section-title">Gerenciar itens</h2>
          <p className="muted">Publique ou oculte itens, ou exclua o que não for mais necessário.</p>
          <div className="admin-grid">
            <ListaGerenciavel titulo="Notícias" tabela="noticias" campoTitulo="titulo" campoPublicado="publicado" campoData="criado_em" ordem="criado_em" />
            <ListaGerenciavel titulo="Compromissos" tabela="eventos" campoTitulo="titulo" campoData="inicio" ordem="inicio" ascendente />
            <ListaGerenciavel titulo="Comunicados" tabela="comunicados" campoTitulo="titulo" campoPublicado="publicado" campoData="criado_em" ordem="criado_em" />
            <ListaGerenciavel titulo="Propostas" tabela="propostas" campoTitulo="titulo" campoPublicado="publicada" campoData="criado_em" ordem="criado_em" />
            <ListaGerenciavel titulo="Projetos" tabela="projetos" campoTitulo="titulo" campoPublicado="publicado" campoData="criado_em" ordem="criado_em" />
          </div>
        </section>
      </div>
    </div>
  );
}
