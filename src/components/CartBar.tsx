import { ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

/** Barra flotante para mobile: acceso rápido al pedido cuando hay ítems. */
export function CartBar() {
  const { itemCount, total, isOpen, openCart } = useCart();
  if (itemCount === 0 || isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-sheet-up px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <button
        type="button"
        onClick={openCart}
        className="flex h-14 w-full items-center gap-3 rounded-full bg-ink pr-4 pl-2 text-paper shadow-[0_14px_30px_-12px_rgba(58,31,18,0.55)] active:scale-[0.98]"
      >
        <span className="grid size-10 place-items-center rounded-full bg-accent text-sm font-bold text-accent-ink">
          {itemCount}
        </span>
        <span className="flex-1 text-left font-semibold">Ver mi pedido</span>
        <span className="text-lg font-semibold tabular-nums">{formatPrice(total)}</span>
        <ChevronRight size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
