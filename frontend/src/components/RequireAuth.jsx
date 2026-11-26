import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function RequireAuth({ children, admin = false }) {
  const { carregando, usuarioLogado, eAdministrador } = useAuth();
  const location = useLocation();

  if (carregando) return <p className="muted">Carregando...</p>;
  if (!usuarioLogado) return <Navigate to="/entrar" replace state={{ from: location }} />;
  if (admin && !eAdministrador) return <Navigate to="/" replace />;
  return children;
}
