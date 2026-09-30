import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Wordmark } from './Wordmark';

export function Navbar() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="Entre Migas, inicio">
          <Wordmark className="text-[28px]" />
        </a>

        <button
          type="button"
          onClick={openCart}
          aria-label={itemCount > 0 ? `Ver pedido (${itemCount} variedades)` : 'Ver pedido (vacío)'}
          className="relative flex h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm font-semibold ring-1 ring-line transition hover:ring-ink/30 active:scale-[0.97]"
        >
          <ShoppingBag size={18} strokeWidth={2} />
          <span>Mi pedido</span>
          {itemCount > 0 && (
            <span
              key={itemCount}
              className="grid size-5.5 animate-pop place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-ink"
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
