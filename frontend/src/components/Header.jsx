import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

const links = [
  { to: '/', label: 'Início' },
  { to: '/calendario', label: 'Calendário' },
  { to: '/jornal', label: 'Jornal do GEA' },
  { to: '/coordenacao', label: 'Coordenação' },
  { to: '/area-do-estudante', label: 'Área do estudante' },
];

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const { usuarioLogado, eAdministrador, sair } = useAuth();
  const navigate = useNavigate();

  async function encerrarSessao() {
    setAberto(false);
    await sair();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Página inicial da Chapa Connecta">
          <img src="/logo-chapa-connecta.webp" width="600" height="573" alt="Logo da Chapa Connecta" className="brand-logo" />
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto((v) => !v)}
        >
          {aberto ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <nav id="menu-principal" className={`main-nav ${aberto ? 'is-open' : ''}`} aria-label="Navegação principal">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-link" onClick={() => setAberto(false)}>
              {item.label}
            </NavLink>
          ))}
          {eAdministrador && (
            <NavLink to="/admin" className="nav-link" onClick={() => setAberto(false)}>
              <ShieldCheck size={16} aria-hidden="true" /> Painel
            </NavLink>
          )}
          {usuarioLogado ? (
            <button type="button" className="nav-link nav-button" onClick={encerrarSessao}>
              <LogOut size={16} aria-hidden="true" /> Sair
            </button>
          ) : (
            <NavLink to="/entrar" className="nav-link" onClick={() => setAberto(false)}>
              <LogIn size={16} aria-hidden="true" /> Entrar
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
