import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import Footer from './Footer.jsx';
import CookieNotice from './CookieNotice.jsx';

export default function Layout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <Header />
        <main id="conteudo" className="site-main">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CookieNotice />
    </div>
  );
}
