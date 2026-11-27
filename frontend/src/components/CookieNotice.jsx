import { useState } from 'react';
import { Link } from 'react-router-dom';

const CHAVE = 'gea-aviso-privacidade-lido';

function jaLido() {
  try {
    return window.localStorage.getItem(CHAVE) === 'sim';
  } catch {
    return true;
  }
}

export default function CookieNotice() {
  const [visivel, setVisivel] = useState(() => !jaLido());

  function confirmar() {
    try {
      window.localStorage.setItem(CHAVE, 'sim');
    } catch {
      /* Sem armazenamento disponivel, o aviso apenas deixa de aparecer nesta visita. */
    }
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <aside className="privacy-notice" aria-label="Aviso de privacidade">
      <p>
        Este site usa somente o armazenamento necessário para manter sua sessão e lembrar que este aviso já foi visto.
        Não há rastreamento nem publicidade. Veja a <Link to="/privacidade">política de privacidade</Link>.
      </p>
      <button type="button" className="button button-primary" onClick={confirmar}>Entendi</button>
    </aside>
  );
}
