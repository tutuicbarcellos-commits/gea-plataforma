import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import DemoBanner from './DemoBanner.jsx';

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <DemoBanner />
      <Header />
      <main id="conteudo" className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>GEA | Chapa Connecta. Grêmio Estudantil.</p>
        </div>
      </footer>
    </>
  );
}
