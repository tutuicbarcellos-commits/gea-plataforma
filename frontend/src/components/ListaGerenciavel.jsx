import { useState } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import Feedback from './Feedback.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

const MARCADOR_IMAGEM = '/storage/v1/object/public/noticias/';

/** Extrai o nome do arquivo no bucket a partir do endereco publico. Imagens fora do bucket retornam null. */
function caminhoDaImagem(url) {
  const posicao = url.indexOf(MARCADOR_IMAGEM);
  if (posicao === -1) return null;
  return decodeURIComponent(url.slice(posicao + MARCADOR_IMAGEM.length).split('?')[0]);
}

const formatarData = (valor) =>
  new Date(valor).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function ListaGerenciavel({ titulo, tabela, campoTitulo, campoPublicado, campoData, ordem, ascendente = false }) {
  const [versao, setVersao] = useState(0);
  const [status, setStatus] = useState(null);
  const [pendente, setPendente] = useState(null);

  const { data, loading, error } = useSupabaseQuery(
    () => supabase.from(tabela).select('*').order(ordem, { ascending: ascendente }),
    [tabela, versao],
  );
  const itens = data ?? [];

  async function alternarPublicacao(item) {
    const novo = !item[campoPublicado];
    const alteracao = { [campoPublicado]: novo };
    if (tabela === 'noticias' && novo && !item.publicado_em) {
      alteracao.publicado_em = new Date().toISOString();
    }
    const { error: falha } = await supabase.from(tabela).update(alteracao).eq('id', item.id);
    if (falha) return setStatus({ tipo: 'erro', texto: 'Não foi possível alterar a publicação.' });
    setStatus({ tipo: 'sucesso', texto: novo ? 'Item publicado.' : 'Item ocultado do site.' });
    setVersao((v) => v + 1);
  }

  function pedirExclusao(item) {
    setPendente(item);
  }

  async function confirmarExclusao() {
    const item = pendente;
    setPendente(null);
    const { error: falha } = await supabase.from(tabela).delete().eq('id', item.id);
    if (falha) return setStatus({ tipo: 'erro', texto: 'Não foi possível excluir o item.' });

    if (tabela === 'noticias' && item.imagem_url) {
      const caminho = caminhoDaImagem(item.imagem_url);
      if (caminho) {
        const { error: falhaImagem } = await supabase.storage.from('noticias').remove([caminho]);
        if (falhaImagem) {
          setVersao((v) => v + 1);
          return setStatus({ tipo: 'erro', texto: 'Notícia excluída, mas a imagem não pôde ser removida do armazenamento.' });
        }
      }
    }
    setStatus({ tipo: 'sucesso', texto: 'Item excluído.' });
    setVersao((v) => v + 1);
  }

  return (
    <section className="card manage-block" aria-labelledby={`gerenciar-${tabela}`}>
      <h2 id={`gerenciar-${tabela}`}>{titulo}</h2>
      {loading && <p className="muted">Carregando...</p>}
      {error && <p className="feedback feedback-erro">Não foi possível carregar os itens.</p>}
      {!loading && !error && itens.length === 0 && <p className="muted">Nenhum item cadastrado.</p>}
      <ul className="manage-list">
        {itens.map((item) => (
          <li key={item.id} className="manage-item">
            <div className="manage-info">
              <strong>{item[campoTitulo]}</strong>
              <span className="muted">{formatarData(item[campoData])}</span>
              {campoPublicado && (
                <span className={`status-tag ${item[campoPublicado] ? 'is-live' : ''}`}>
                  {item[campoPublicado] ? 'Publicado' : 'Oculto'}
                </span>
              )}
            </div>
            <div className="manage-actions">
              {campoPublicado && (
                <button type="button" className="icon-button" aria-label={item[campoPublicado] ? `Ocultar ${item[campoTitulo]}` : `Publicar ${item[campoTitulo]}`} onClick={() => alternarPublicacao(item)}>
                  {item[campoPublicado] ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              )}
              <button type="button" className="icon-button icon-button-danger" aria-label={`Excluir ${item[campoTitulo]}`} onClick={() => pedirExclusao(item)}>
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Feedback status={status} />
      <ConfirmDialog
        aberto={pendente !== null}
        titulo="Excluir item"
        mensagem={pendente ? `Excluir "${pendente[campoTitulo]}"? Esta ação não pode ser desfeita.` : ''}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setPendente(null)}
      />
    </section>
  );
}
