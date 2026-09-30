import { useId } from 'react';

// Ilustración en el lenguaje de la mascota de Entre Migas: miga triple con
// contorno marrón grueso, rellenos ondulados y carita. `waving` agrega brazos.

const INK = '#3A1F12';
const BREAD = '#FFF8EE';
const BREAD_TOP = '#FDF0DC';
const CHEEK = '#E8907A';

function wavePath(x0: number, x1: number, y: number, amp = 3.2, step = 9): string {
  let d = `M${x0} ${y}`;
  let up = true;
  for (let x = x0; x < x1; x += step) {
    const nx = Math.min(x + step, x1);
    d += ` Q${(x + nx) / 2} ${y + (up ? -amp : amp)} ${nx} ${y}`;
    up = !up;
  }
  return d;
}

const FRONT = 'M22 64 H146 V96 Q146 106 136 106 H32 Q22 106 22 96 Z';
const TOP = 'M22 64 L106 22 Q112 19 116 24 L146 64 Z';

interface SandwichArtProps {
  layers: [string, string];
  className?: string;
  waving?: boolean;
}

export function SandwichArt({ layers, className, waving = false }: SandwichArtProps) {
  // Id único por instancia: si se repite y la primera copia está oculta, el clip falla.
  const clip = `front-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg viewBox="0 0 170 124" className={className} aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <path d={FRONT} />
        </clipPath>
      </defs>

      {waving && (
        <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M22 86 Q6 86 10 99 Q13 106 24 101" />
          <path d="M12 58 L5 51" />
          <path d="M20 53 L16 44" />
        </g>
      )}

      <path d={TOP} fill={BREAD_TOP} />
      <g fill="#D9BC98">
        <circle cx="100" cy="36" r="1.8" />
        <circle cx="112" cy="42" r="1.8" />
        <circle cx="92" cy="47" r="1.8" />
      </g>

      <path d={FRONT} fill={BREAD} />
      <g clipPath={`url(#${clip})`} fill="none" strokeLinecap="round">
        <path d={wavePath(16, 152, 71)} stroke={layers[0]} strokeWidth="6.5" />
        <path d={wavePath(16, 54, 85, 2.8, 8)} stroke={layers[1]} strokeWidth="5" />
        <path d={wavePath(114, 152, 85, 2.8, 8)} stroke={layers[1]} strokeWidth="5" />
      </g>

      <g fill={INK}>
        <ellipse cx="73" cy="85" rx="2.8" ry="3.4" />
        <ellipse cx="95" cy="85" rx="2.8" ry="3.4" />
      </g>
      <path d="M79 91 Q84 97 89 91" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      <g fill={CHEEK} opacity="0.85">
        <circle cx="64" cy="92" r="3.8" />
        <circle cx="104" cy="92" r="3.8" />
      </g>

      <g fill="none" stroke={INK} strokeWidth="4.5" strokeLinejoin="round">
        <path d={TOP} />
        <path d={FRONT} />
      </g>

      {waving && (
        <g className="wave-arm">
          <path d="M146 80 Q162 72 159 50" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <circle cx="159" cy="45" r="6" fill={INK} />
        </g>
      )}
    </svg>
  );
}
