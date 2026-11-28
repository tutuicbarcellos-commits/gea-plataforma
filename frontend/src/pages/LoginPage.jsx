import { usePageMeta } from '../hooks/usePageMeta.js';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import Feedback from '../components/Feedback.jsx';

const traduzirErro = (mensagem = '') => {
  if (mensagem.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (mensagem.includes('already registered')) return 'Este e-mail já está cadastrado.';
  if (mensagem.includes('Password should be')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (mensagem.includes('Email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  return 'Não foi possível concluir a ação. Tente novamente.';
};

export default function LoginPage() {
  usePageMeta({ titulo: 'Entrar', privada: true });
  const { entrar, cadastrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from?.pathname ?? '/area-do-estudante';

  const [modo, setModo] = useState('entrar');
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState(null);

  const alterar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setStatus(null);

    const resultado =
      modo === 'entrar'
        ? await entrar(form.email, form.senha)
        : await cadastrar(form.email, form.senha, form.nome);

    setEnviando(false);

    if (resultado.error) {
      setStatus({ tipo: 'erro', texto: traduzirErro(resultado.error.message) });
      return;
    }
    if (modo === 'cadastrar' && !resultado.data.session) {
      setStatus({ tipo: 'sucesso', texto: 'Conta criada. Confirme seu e-mail para concluir o cadastro.' });
      return;
    }
    navigate(destino, { replace: true });
  }

  return (
    <div className="container narrow">
      <div className="card">
        <img src="/logo-chapa-connecta.webp" width="600" height="600" alt="Logo da Chapa Connecta" className="login-logo" />
        <div className="segmented" role="group" aria-label="Escolha a ação">
          <button type="button" className={`segment ${modo === 'entrar' ? 'is-active' : ''}`} aria-pressed={modo === 'entrar'} onClick={() => setModo('entrar')}>
            Entrar
          </button>
          <button type="button" className={`segment ${modo === 'cadastrar' ? 'is-active' : ''}`} aria-pressed={modo === 'cadastrar'} onClick={() => setModo('cadastrar')}>
            Criar conta
          </button>
        </div>

        <h1 className="login-title">{modo === 'entrar' ? 'Acesse sua área' : 'Crie sua conta de estudante'}</h1>

        <form onSubmit={enviar} noValidate>
          {modo === 'cadastrar' && (
            <div className="field">
              <label htmlFor="login-nome">Nome completo</label>
              <input id="login-nome" required minLength={2} value={form.nome} onChange={alterar('nome')} autoComplete="name" />
            </div>
          )}
          <div className="field">
            <label htmlFor="login-email">E-mail</label>
            <input id="login-email" type="email" required value={form.email} onChange={alterar('email')} autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="login-senha">Senha</label>
            <input
              id="login-senha"
              type="password"
              required
              minLength={6}
              value={form.senha}
              onChange={alterar('senha')}
              autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
            />
          </div>
          <button type="submit" className="button button-primary full-width" disabled={enviando}>
            {modo === 'entrar' ? <LogIn size={18} aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
            {enviando ? 'Aguarde...' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
        <Feedback status={status} />
      </div>
    </div>
  );
}
