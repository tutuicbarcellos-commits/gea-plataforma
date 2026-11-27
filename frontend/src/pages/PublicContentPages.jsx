import { Link } from 'react-router-dom';
import { Lightbulb, FolderKanban, Info, MessagesSquare, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase.js';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery.js';
import { usePageMeta } from '../hooks/usePageMeta.js';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonLines } from '../components/Skeleton.jsx';
import FormularioSugestao from '../components/FormularioSugestao.jsx';

const SITUACOES = {
  planejado: { rotulo: 'Planejado', classe: 'status-planned' },
  em_andamento: { rotulo: 'Em andamento', classe: 'status-progress' },
  concluido: { rotulo: 'Concluído', classe: 'status-done' },
};

export function ApresentacaoPage() {
  usePageMeta({ titulo: 'Sobre o GEA', descricao: 'Apresentação do Grêmio Estudantil e da Chapa Connecta.' });
  const { data, loading, error } = useSupabaseQuery(() => supabase.from('apresentacao').select('*').eq('id', 1), []);
  const info = data?.[0];

  return (
    <div className="container">
      <h1>{info?.titulo ?? 'Sobre o GEA'}</h1>
      {loading && <SkeletonLines linhas={4} />}
      {error && <p className="feedback feedback-erro">Não foi possível carregar a apresentação.</p>}
      {!loading && !error && !info?.texto && (
        <EmptyState icon={Info} title="Apresentação em cadastro" text="A administração publicará aqui a apresentação do Grêmio e da Chapa Connecta." />
      )}
      {info?.texto && <article className="card article-body">{info.texto}</article>}
    </div>
  );
}

export function PropostasPage() {
  usePageMeta({ titulo: 'Propostas', descricao: 'Propostas estudantis publicadas pelo Grêmio Estudantil.' });
  const { data, loading, error } = useSupabaseQuery(
    () => supabase.from('propostas').select('*').eq('publicada', true).order('criado_em', { ascending: false }),
    [],
  );
  const itens = data ?? [];

  return (
    <div className="container">
      <h1>Propostas</h1>
      <p className="muted">Ideias apresentadas pelo Grêmio e pelos estudantes para a comunidade escolar.</p>
      {loading && <SkeletonLines linhas={3} />}
      {error && <p className="feedback feedback-erro">Não foi possível carregar as propostas.</p>}
      {!loading && !error && itens.length === 0 && (
        <EmptyState icon={Lightbulb} title="Nenhuma proposta publicada" text="As propostas publicadas pelo Grêmio aparecerão aqui." />
      )}
      <div className="content-grid">
        {itens.map((item) => (
          <article key={item.id} className="content-card">
            <Lightbulb size={20} aria-hidden="true" className="content-card-icon" />
            <h2>{item.titulo}</h2>
            <p>{item.descricao}</p>
            {item.autor && <span className="muted">Apresentada por {item.autor}</span>}
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProjetosPage() {
  usePageMeta({ titulo: 'Projetos', descricao: 'Projetos do Grêmio Estudantil e situação de cada um.' });
  const { data, loading, error } = useSupabaseQuery(
    () => supabase.from('projetos').select('*').eq('publicado', true).order('criado_em', { ascending: false }),
    [],
  );
  const itens = data ?? [];

  return (
    <div className="container">
      <h1>Projetos</h1>
      <p className="muted">Acompanhe o andamento dos projetos desenvolvidos pelo Grêmio Estudantil.</p>
      {loading && <SkeletonLines linhas={3} />}
      {error && <p className="feedback feedback-erro">Não foi possível carregar os projetos.</p>}
      {!loading && !error && itens.length === 0 && (
        <EmptyState icon={FolderKanban} title="Nenhum projeto publicado" text="Os projetos publicados pelo Grêmio aparecerão aqui." />
      )}
      <div className="content-grid">
        {itens.map((item) => {
          const situacao = SITUACOES[item.situacao] ?? SITUACOES.em_andamento;
          return (
            <article key={item.id} className="content-card">
              <FolderKanban size={20} aria-hidden="true" className="content-card-icon" />
              <span className={`status-pill ${situacao.classe}`}>{situacao.rotulo}</span>
              <h2>{item.titulo}</h2>
              <p>{item.descricao}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function ParticipacaoPage() {
  usePageMeta({ titulo: 'Participação', descricao: 'Como participar do Grêmio Estudantil e enviar sugestões à Chapa Connecta.' });

  return (
    <div className="container">
      <h1>Participação estudantil</h1>
      <p className="muted">Envie dúvidas e sugestões, e acompanhe as propostas e os projetos do Grêmio.</p>
      <div className="grid-two section-gap">
        <section className="card">
          <MessagesSquare size={22} aria-hidden="true" className="section-icon" />
          <h2>Como participar</h2>
          <p>
            Use o formulário ao lado para enviar uma dúvida ou sugestão. A mensagem chega somente à administração
            do Grêmio e não fica publicada no site.
          </p>
          <div className="participacao-links">
            <Link className="text-link" to="/propostas">Ver propostas</Link>
            <Link className="text-link" to="/projetos">Ver projetos</Link>
            <Link className="text-link" to="/privacidade">Como seus dados são usados</Link>
          </div>
        </section>
        <FormularioSugestao />
      </div>
    </div>
  );
}

export function PrivacidadePage() {
  usePageMeta({ titulo: 'Política de privacidade', descricao: 'Como o GEA coleta, usa e protege os dados de estudantes e visitantes.' });

  return (
    <div className="container article-wrapper">
      <h1>Política de privacidade</h1>
      <article className="card article-body">
        <ShieldCheck size={22} aria-hidden="true" className="section-icon" />
        <h2>Quais dados coletamos</h2>
        <p>
          Para criar uma conta de estudante, coletamos nome, e-mail e senha. A senha é armazenada de forma protegida pelo
          serviço de autenticação e não é exibida a ninguém, nem à administração.
        </p>
        <p>
          Para enviar dúvidas e sugestões, coletamos nome, e-mail e a mensagem enviada. Esses dados são usados somente
          para responder à mensagem.
        </p>
        <h2>Para que usamos os dados</h2>
        <p>
          Os dados servem exclusivamente para dar acesso à área do estudante, permitir a administração do conteúdo
          do Grêmio e responder às dúvidas e sugestões recebidas.
        </p>
        <h2>Rastreamento e publicidade</h2>
        <p>
          Não utilizamos ferramentas de rastreamento de terceiros nem publicidade. Não compartilhamos dados com
          empresas de marketing.
        </p>
        <h2>Armazenamento no navegador</h2>
        <p>
          O site guarda no seu navegador apenas o necessário para manter a sessão de login e para lembrar que o aviso
          de privacidade já foi visto.
        </p>
        <h2>Estudantes menores de idade</h2>
        <p>
          O site é destinado à comunidade escolar. Dados de estudantes menores de idade são tratados com o mesmo
          cuidado, coletando somente o necessário.
        </p>
        <h2>Seus direitos</h2>
        <p>
          Você pode pedir a correção ou a exclusão dos seus dados pelo formulário de dúvidas e sugestões, na página
          de participação.
        </p>
        <h2>Responsável pelos dados</h2>
        <p>
          Os dados de identificação do responsável pelo tratamento serão publicados pela administração do colégio
          antes da divulgação oficial deste site.
        </p>
      </article>
    </div>
  );
}
