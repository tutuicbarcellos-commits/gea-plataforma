import { Info } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <Info size={16} aria-hidden="true" />
      <span>Versão de demonstração em ajustes. Os conteúdos exibidos são apenas os cadastrados pela administração.</span>
    </div>
  );
}
