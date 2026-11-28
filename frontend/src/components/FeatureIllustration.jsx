/** Ilustracoes proprias das funcionalidades. Formas simples em cores da paleta oficial. */
export default function FeatureIllustration({ tipo }) {
  const cores = {
    corpo: { fill: 'var(--color-white)' },
    faixa: { fill: 'var(--color-pink)' },
    detalhe: { fill: 'var(--color-turquoise)' },
    destaque: { fill: 'var(--color-yellow)' },
    contorno: { fill: 'var(--color-deep)' },
  };

  if (tipo === 'eventos') {
    return (
      <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
        <rect x="6" y="10" width="44" height="40" rx="8" style={cores.corpo} stroke="var(--color-deep)" strokeWidth="2" />
        <rect x="6" y="10" width="44" height="12" rx="8" style={cores.faixa} />
        <rect x="16" y="6" width="5" height="10" rx="2.5" style={cores.contorno} />
        <rect x="35" y="6" width="5" height="10" rx="2.5" style={cores.contorno} />
        <circle cx="18" cy="32" r="2.6" style={cores.detalhe} />
        <circle cx="28" cy="32" r="2.6" style={cores.detalhe} />
        <circle cx="38" cy="32" r="2.6" style={cores.destaque} />
        <circle cx="18" cy="42" r="2.6" style={cores.detalhe} />
        <circle cx="28" cy="42" r="2.6" style={cores.destaque} />
      </svg>
    );
  }
  if (tipo === 'comunicados') {
    return (
      <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
        <path d="M10 22h8l20-10v32l-20-10h-8z" style={cores.faixa} stroke="var(--color-deep)" strokeWidth="2" strokeLinejoin="round" />
        <rect x="10" y="22" width="8" height="12" rx="2" style={cores.detalhe} />
        <path d="M42 22c3 2 3 10 0 12" fill="none" stroke="var(--color-deep)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M46 18c4 3 4 17 0 20" fill="none" stroke="var(--color-deep)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M16 38l3 8h5l-2-7" style={cores.detalhe} />
      </svg>
    );
  }
  if (tipo === 'propostas') {
    return (
      <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
        <circle cx="28" cy="24" r="16" style={cores.destaque} stroke="var(--color-deep)" strokeWidth="2" />
        <rect x="20" y="40" width="16" height="7" rx="3" style={cores.faixa} />
        <rect x="23" y="47" width="10" height="3" rx="1.5" style={cores.contorno} />
        <path d="M22 26c2-4 4-6 6-6" fill="none" stroke="var(--color-white)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="46" cy="10" r="2.5" style={cores.faixa} />
        <circle cx="10" cy="16" r="2" style={cores.detalhe} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
      <circle cx="21" cy="19" r="8" style={cores.faixa} />
      <circle cx="37" cy="19" r="8" style={cores.detalhe} />
      <path d="M8 46c0-9 6-15 13-15s13 6 13 15z" style={cores.faixa} />
      <path d="M28 46c0-9 6-15 13-15s7 6 7 15z" style={cores.detalhe} />
      <circle cx="46" cy="10" r="2.5" style={cores.destaque} />
    </svg>
  );
}
