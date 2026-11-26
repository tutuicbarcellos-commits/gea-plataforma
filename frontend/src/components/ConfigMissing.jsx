export default function ConfigMissing() {
  return (
    <main className="fallback">
      <h1>Configuração incompleta</h1>
      <p>
        As variáveis de conexão com o banco de dados não foram encontradas. Verifique se
        VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY estão configuradas no ambiente de publicação
        e faça um novo deploy.
      </p>
    </main>
  );
}
