import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import HomePage from './pages/HomePage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import JornalPage from './pages/JornalPage.jsx';
import NoticiaPage from './pages/NoticiaPage.jsx';
import CoordenacaoPage from './pages/CoordenacaoPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import StudentAreaPage from './pages/StudentAreaPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calendario" element={<CalendarPage />} />
        <Route path="jornal" element={<JornalPage />} />
        <Route path="jornal/:id" element={<NoticiaPage />} />
        <Route path="coordenacao" element={<CoordenacaoPage />} />
        <Route path="entrar" element={<LoginPage />} />
        <Route path="area-do-estudante" element={<RequireAuth><StudentAreaPage /></RequireAuth>} />
        <Route path="admin" element={<RequireAuth admin><AdminPage /></RequireAuth>} />
        <Route path="*" element={<PlaceholderPage titulo="Página não encontrada" />} />
      </Route>
    </Routes>
  );
}
