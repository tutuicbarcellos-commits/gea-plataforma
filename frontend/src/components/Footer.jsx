import { Link } from 'react-router-dom';

const institucional = [
  { to: '/apresentacao', rotulo: 'Sobre o GEA' },
  { to: '/propostas', rotulo: 'Propostas' },
  { to: '/projetos', rotulo: 'Projetos' },
  { to: '/participacao', rotulo: 'Participação' },
  { to: '/coordenacao', rotulo: 'Coordenação' },
  { to: '/privacidade', rotulo: 'Privacidade' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-brand">GEA | Chapa Connecta. Grêmio Estudantil.</p>
        <nav aria-label="Links institucionais">
          <ul className="footer-links">
            {institucional.map((item) => (
              <li key={item.to}><Link to={item.to}>{item.rotulo}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
