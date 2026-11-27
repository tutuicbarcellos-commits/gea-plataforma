import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import HomePage from './pages/HomePage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

const CalendarPage = lazy(() => import('./pages/CalendarPage.jsx'));
const JornalPage = lazy(() => import('./pages/JornalPage.jsx'));
const NoticiaPage = lazy(() => import('./pages/NoticiaPage.jsx'));
const CoordenacaoPage = lazy(() => import('./pages/CoordenacaoPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const StudentAreaPage = lazy(() => import('./pages/StudentAreaPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const ApresentacaoPage = lazy(() => import('./pages/PublicContentPages.jsx').then((m) => ({ default: m.ApresentacaoPage })));
const PropostasPage = lazy(() => import('./pages/PublicContentPages.jsx').then((m) => ({ default: m.PropostasPage })));
const ProjetosPage = lazy(() => import('./pages/PublicContentPages.jsx').then((m) => ({ default: m.ProjetosPage })));
const ParticipacaoPage = lazy(() => import('./pages/PublicContentPages.jsx').then((m) => ({ default: m.ParticipacaoPage })));
const PrivacidadePage = lazy(() => import('./pages/PublicContentPages.jsx').then((m) => ({ default: m.PrivacidadePage })));

export default function App() {
  return (
    <Suspense fallback={<p className="muted container">Carregando...</p>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="jornal" element={<JornalPage />} />
          <Route path="jornal/:id" element={<NoticiaPage />} />
          <Route path="apresentacao" element={<ApresentacaoPage />} />
          <Route path="propostas" element={<PropostasPage />} />
          <Route path="projetos" element={<ProjetosPage />} />
          <Route path="participacao" element={<ParticipacaoPage />} />
          <Route path="coordenacao" element={<CoordenacaoPage />} />
          <Route path="privacidade" element={<PrivacidadePage />} />
          <Route path="entrar" element={<LoginPage />} />
          <Route path="area-do-estudante" element={<RequireAuth><StudentAreaPage /></RequireAuth>} />
          <Route path="admin" element={<RequireAuth admin><AdminPage /></RequireAuth>} />
          <Route path="*" element={<PlaceholderPage titulo="Página não encontrada" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
