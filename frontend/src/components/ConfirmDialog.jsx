import { useEffect, useRef } from 'react';

export default function ConfirmDialog({ aberto, titulo, mensagem, textoConfirmar = 'Excluir', onConfirmar, onCancelar }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (aberto && !dialog.open) dialog.showModal();
    if (!aberto && dialog.open) dialog.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby="confirmar-titulo"
      aria-describedby="confirmar-mensagem"
      onCancel={(evento) => {
        evento.preventDefault();
        onCancelar();
      }}
    >
      <h2 id="confirmar-titulo">{titulo}</h2>
      <p id="confirmar-mensagem">{mensagem}</p>
      <div className="confirm-actions">
        <button type="button" className="button button-outline" onClick={onCancelar}>Cancelar</button>
        <button type="button" className="button button-danger" onClick={onConfirmar}>{textoConfirmar}</button>
      </div>
    </dialog>
  );
}
