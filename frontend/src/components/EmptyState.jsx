export default function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={28} aria-hidden="true" />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
    </div>
  );
}
