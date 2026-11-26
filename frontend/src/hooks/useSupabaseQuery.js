import { useEffect, useState } from 'react';

/**
 * Executa uma consulta ao Supabase e controla os estados de carregamento e erro.
 * @param {() => PromiseLike<{ data: any, error: any }>} queryFn funcao que retorna a consulta
 * @param {Array} deps dependencias para refazer a consulta
 */
export function useSupabaseQuery(queryFn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let ativo = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    queryFn().then(({ data, error }) => {
      if (!ativo) return;
      setState({ data: data ?? [], error: error ?? null, loading: false });
    });

    return () => {
      ativo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
