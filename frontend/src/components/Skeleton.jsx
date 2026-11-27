export function SkeletonLines({ linhas = 3 }) {
  return (
    <div className="skeleton-group" aria-hidden="true">
      {Array.from({ length: linhas }, (_, i) => (
        <span key={i} className="skeleton-line" style={{ width: `${92 - i * 12}%` }} />
      ))}
    </div>
  );
}
