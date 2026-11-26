import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Início' },
  { to: '/calendario', label: 'Calendário' },
  { to: '/jornal', label: 'Jornal do GEA' },
  { to: '/coordenacao', label: 'Coordenação' },
  { to: '/area-do-estudante', label: 'Área do estudante' },
];

export default function Header() {
  const [aberto, setAberto] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Página inicial da Chapa Connecta">
          <img src="/logo-chapa-connecta.png" alt="Logo da Chapa Connecta" className="brand-logo" />
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
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className="nav-link"
              onClick={() => setAberto(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
