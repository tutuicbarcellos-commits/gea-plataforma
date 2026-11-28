/** Grupo de estrelas e pontos usado como detalhe no convite da coluna lateral. */
export default function StarCluster() {
  return (
    <svg className="star-cluster" viewBox="0 0 120 80" width="120" height="80" aria-hidden="true" focusable="false">
      <path d="M52 6l6 14 15 2-11 10 3 15-13-8-13 8 3-15-11-10 15-2z" style={{ fill: 'var(--color-yellow)' }} />
      <path d="M96 30l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" style={{ fill: 'var(--color-pink)' }} />
      <circle cx="18" cy="54" r="7" style={{ fill: 'var(--color-turquoise)' }} />
      <circle cx="104" cy="66" r="4" style={{ fill: 'var(--color-blue-vivid)' }} />
    </svg>
  );
}
