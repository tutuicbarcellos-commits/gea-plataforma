import { NavLink, Link } from 'react-router-dom';
import { CalendarDays, Newspaper, Lightbulb, FolderKanban, MessagesSquare, Megaphone, UserRound, House } from 'lucide-react';

const ITENS = [
  { to: '/', rotulo: 'Início', Icone: House, fim: true },
  { to: '/calendario', rotulo: 'Calendário', Icone: CalendarDays },
  { to: '/jornal', rotulo: 'Jornal do GEA', Icone: Newspaper },
  { to: '/propostas', rotulo: 'Propostas', Icone: Lightbulb },
  { to: '/projetos', rotulo: 'Projetos', Icone: FolderKanban },
  { to: '/participacao', rotulo: 'Participação', Icone: MessagesSquare },
  { to: '/coordenacao', rotulo: 'Coordenação', Icone: Megaphone },
  { to: '/area-do-estudante', rotulo: 'Minha área', Icone: UserRound },
];

export default function Sidebar() {
  return (
    <aside className="app-sidebar" aria-label="Navegação principal">
      <Link to="/" className="sidebar-brand" aria-label="Página inicial da Chapa Connecta">
        <img src="/logo-chapa-connecta.webp" width="600" height="600" alt="Logo da Chapa Connecta" className="sidebar-logo" />
      </Link>
      <nav>
        <ul className="sidebar-list">
          {ITENS.map(({ to, rotulo, Icone, fim }) => (
            <li key={to}>
              <NavLink to={to} end={fim} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
                <Icone size={20} aria-hidden="true" />
                <span>{rotulo}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
