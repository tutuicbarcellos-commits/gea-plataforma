import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroPerfil, setErroPerfil] = useState(null);

  const carregarPerfil = useCallback(async (userId) => {
    if (!userId) {
      setPerfil(null);
      return;
    }
    const { data, error } = await supabase.from('perfis').select('*').eq('id', userId).maybeSingle();
    setErroPerfil(error ? `${error.code ?? ''} ${error.message}`.trim() : null);
    setPerfil(data ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await carregarPerfil(data.session?.user?.id);
      setCarregando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_evento, novaSessao) => {
      setCarregando(true);
      setSession(novaSessao);
      await carregarPerfil(novaSessao?.user?.id);
      setCarregando(false);
    });

    return () => listener.subscription.unsubscribe();
  }, [carregarPerfil]);

  const value = {
    session,
    perfil,
    erroPerfil,
    carregando,
    usuarioLogado: Boolean(session),
    eAdministrador: perfil?.papel === 'administrador',
    entrar: (email, senha) => supabase.auth.signInWithPassword({ email, password: senha }),
    cadastrar: (email, senha, nome) =>
      supabase.auth.signUp({ email, password: senha, options: { data: { nome } } }),
    sair: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return contexto;
}
