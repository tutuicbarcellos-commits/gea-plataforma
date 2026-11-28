import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Topbar() {
  const [termo, setTermo] = useState('');
  const { usuarioLogado, perfil } = useAuth();
  const navigate = useNavigate();

  function buscar(evento) {
    evento.preventDefault();
    const limpo = termo.trim().slice(0, 80);
    navigate(`/busca?q=${encodeURIComponent(limpo)}`);
  }

  const inicial = perfil?.nome?.charAt(0)?.toUpperCase();

  return (
    <header className="topbar">
      <form className="topbar-search" role="search" onSubmit={buscar}>
        <label htmlFor="busca-global" className="visually-hidden">Buscar notícias e eventos</label>
        <Search size={18} aria-hidden="true" />
        <input
          id="busca-global"
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar notícias e eventos"
          maxLength={80}
        />
      </form>
      <Link to={usuarioLogado ? '/area-do-estudante' : '/entrar'} className="topbar-profile">
        <span className="topbar-avatar" aria-hidden="true">{inicial ?? <UserRound size={18} />}</span>
        <span>{usuarioLogado ? (perfil?.nome ?? 'Minha área') : 'Entrar'}</span>
      </Link>
    </header>
  );
}
