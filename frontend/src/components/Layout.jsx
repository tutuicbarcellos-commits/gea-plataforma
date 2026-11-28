import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import CookieNotice from './CookieNotice.jsx';

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo" className="site-main">
        <Outlet />
      </main>
      <Footer />
      <CookieNotice />
    </>
  );
}
