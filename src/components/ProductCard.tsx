import { Check, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MAX_HALF_DOZENS } from '../config';
import { useCart } from '../context/CartContext';
import { CATEGORY_TINT } from '../data/products';
import type { Product } from '../types';
import { formatPrice, formatQuantityShort, linePrice } from '../utils/format';
import { QuantityStepper } from './QuantityStepper';
import { SandwichArt } from './SandwichArt';

export function ProductCard({ product }: { product: Product }) {
  const { addItem, getQuantity } = useCart();
  // Por defecto, 1 docena (2 medias docenas).
  const [halfDozens, setHalfDozens] = useState(2);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = getQuantity(product.id);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1400);
    return () => clearTimeout(t);
  }, [justAdded]);

  const handleAdd = () => {
    addItem(product.id, halfDozens);
    setJustAdded(true);
  };

  return (
    <article className="reveal grid grid-cols-[84px_1fr] gap-x-4 gap-y-4 rounded-3xl bg-surface p-3 ring-1 ring-line sm:grid-cols-[112px_1fr] sm:p-4">
      <div
        className="relative grid aspect-square place-items-center rounded-2xl"
        style={{ backgroundColor: CATEGORY_TINT[product.category] }}
      >
        <SandwichArt layers={product.layers} className="w-[88%]" />
      </div>

      <div className="min-w-0 self-center">
        <h3 className="text-lg leading-tight font-semibold">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink-soft">
          {product.description}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          <span className="font-semibold text-ink tabular-nums">
            {formatPrice(product.priceDozen)}
          </span>{' '}
          la docena, <span className="tabular-nums">{formatPrice(product.priceHalfDozen)}</span>{' '}
          la media
        </p>
      </div>

      <div className="col-span-2 flex items-center gap-2">
        <QuantityStepper
          className="flex-1"
          value={halfDozens}
          onChange={setHalfDozens}
          max={MAX_HALF_DOZENS}
          label={formatQuantityShort(halfDozens)}
          itemName={product.name}
        />
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Agregar ${formatQuantityShort(halfDozens)} de ${product.name} al pedido`}
          className={`flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-full px-5 font-semibold whitespace-nowrap transition active:scale-[0.97] ${
            justAdded ? 'bg-ink text-paper' : 'bg-accent text-accent-ink hover:brightness-110'
          }`}
        >
          {justAdded ? (
            <>
              <Check size={18} strokeWidth={2.5} /> Listo
            </>
          ) : (
            <>
              <Plus size={18} strokeWidth={2.5} /> Agregar
              <span className="hidden tabular-nums sm:inline">
                {formatPrice(linePrice(product, halfDozens))}
              </span>
            </>
          )}
        </button>
      </div>

      {inCart > 0 && (
        <p className="col-span-2 -mt-1 text-center text-xs text-ink-soft">
          Ya tenés {formatQuantityShort(inCart)} en tu pedido
        </p>
      )}
    </article>
  );
}
