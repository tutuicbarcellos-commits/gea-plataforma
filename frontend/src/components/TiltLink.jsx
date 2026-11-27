import { useRef } from 'react';
import { Link } from 'react-router-dom';

const PERMITE_EFEITO = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** Link com inclinacao sutil em 3D que acompanha o cursor, somente em dispositivos com ponteiro e sem reducao de movimento. */
export default function TiltLink({ to, className, children }) {
  const ref = useRef(null);

  function mover(e) {
    if (!window.matchMedia(PERMITE_EFEITO).matches || !ref.current) return;
    const area = ref.current.getBoundingClientRect();
    const x = (e.clientX - area.left) / area.width - 0.5;
    const y = (e.clientY - area.top) / area.height - 0.5;
    ref.current.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
    ref.current.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`);
  }

  function restaurar() {
    if (!ref.current) return;
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  }

  return (
    <Link ref={ref} to={to} className={className} onPointerMove={mover} onPointerLeave={restaurar}>
      {children}
    </Link>
  );
}
