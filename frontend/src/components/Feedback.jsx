export default function Feedback({ status }) {
  if (!status) return null;
  return (
    <p className={status.tipo === 'erro' ? 'feedback feedback-erro' : 'feedback feedback-sucesso'} role="status">
      {status.texto}
    </p>
  );
}
