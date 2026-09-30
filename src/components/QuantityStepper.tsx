import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  label: string;
  /** Nombre del producto, para las etiquetas accesibles. */
  itemName: string;
  size?: 'md' | 'sm';
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  label,
  itemName,
  size = 'md',
  className = '',
}: QuantityStepperProps) {
  const btn = size === 'md' ? 'size-10' : 'size-8';
  const icon = size === 'md' ? 17 : 15;

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full bg-surface p-1 ring-1 ring-line ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Quitar media docena de ${itemName}`}
        className={`${btn} grid shrink-0 place-items-center rounded-full text-ink transition hover:bg-paper-2 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <Minus size={icon} strokeWidth={2} />
      </button>
      <output
        aria-live="polite"
        className={`min-w-0 flex-1 text-center font-semibold tracking-tight whitespace-nowrap tabular-nums ${
          size === 'md' ? 'text-[15px]' : 'text-sm'
        }`}
      >
        {label}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Sumar media docena de ${itemName}`}
        className={`${btn} grid shrink-0 place-items-center rounded-full bg-ink text-paper transition hover:opacity-85 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30`}
      >
        <Plus size={icon} strokeWidth={2} />
      </button>
    </div>
  );
}
