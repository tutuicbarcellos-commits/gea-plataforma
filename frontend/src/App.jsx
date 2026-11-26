import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calendario" element={<PlaceholderPage titulo="Calendário escolar" />} />
        <Route path="jornal" element={<PlaceholderPage titulo="Jornal do GEA" />} />
        <Route path="jornal/:id" element={<PlaceholderPage titulo="Notícia" />} />
        <Route path="coordenacao" element={<PlaceholderPage titulo="Coordenação Pedagógica" />} />
        <Route path="area-do-estudante" element={<PlaceholderPage titulo="Área do estudante" />} />
        <Route path="*" element={<PlaceholderPage titulo="Página não encontrada" />} />
      </Route>
    </Routes>
  );
}
