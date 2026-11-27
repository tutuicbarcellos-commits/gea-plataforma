import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ConfigMissing from './components/ConfigMissing.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import { configuracaoOk } from './lib/supabase.js';
import './styles/tokens.css';
import './styles/app.css';
import './styles/pages.css';
import './styles/home.css';
import './styles/system.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      {configuracaoOk ? (
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      ) : (
        <ConfigMissing />
      )}
    </ErrorBoundary>
  </StrictMode>,
);
