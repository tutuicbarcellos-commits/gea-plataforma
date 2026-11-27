import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import { AuthProvider } from '../hooks/useAuth.jsx';

vi.mock('../lib/supabase.js', () => {
  const consulta = () => {
    const builder = {};
    for (const metodo of ['select', 'eq', 'gte', 'lt', 'order', 'limit', 'insert', 'update', 'delete']) {
      builder[metodo] = () => builder;
    }
    builder.maybeSingle = () => Promise.resolve({ data: null, error: null });
    builder.then = (resolve, reject) => Promise.resolve({ data: [], error: null }).then(resolve, reject);
    return builder;
  };
  return {
    configuracaoOk: true,
    supabase: {
      from: () => consulta(),
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signOut: async () => ({}),
        signInWithPassword: async () => ({ data: null, error: null }),
        signUp: async () => ({ data: null, error: null }),
      },
    },
  };
});

function renderizar(rota) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

const ROTAS_PUBLICAS = [
  '/',
  '/calendario',
  '/jornal',
  '/jornal/123',
  '/apresentacao',
  '/propostas',
  '/projetos',
  '/participacao',
  '/coordenacao',
  '/privacidade',
  '/entrar',
  '/rota-inexistente',
];

describe('rotas publicas', () => {
  for (const rota of ROTAS_PUBLICAS) {
    it(`renderiza ${rota} com titulo principal`, async () => {
      renderizar(rota);
      await waitFor(() => expect(document.querySelector('h1')).not.toBeNull());
    });
  }

  it('envia a area do estudante para a entrada quando nao ha sessao', async () => {
    renderizar('/area-do-estudante');
    await waitFor(() => expect(screen.getByRole('heading', { name: /acesse sua área/i })).toBeTruthy(), { timeout: 4000 });
  });

  it('mostra o aviso de privacidade na primeira visita', async () => {
    window.localStorage.clear();
    renderizar('/');
    await waitFor(() => expect(document.querySelector('.privacy-notice')).not.toBeNull());
  });
});
