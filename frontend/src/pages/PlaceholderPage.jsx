import { usePageMeta } from '../hooks/usePageMeta.js';
import { Construction } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';

export default function PlaceholderPage({ titulo }) {
  usePageMeta({ titulo, privada: true });
  return (
    <div className="container">
      <h1>{titulo}</h1>
      <EmptyState icon={Construction} title="Em desenvolvimento" text="Esta área será implementada na próxima etapa." />
    </div>
  );
}
