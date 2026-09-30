import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MAX_HALF_DOZENS } from '../config';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { formatPrice, formatQuantityShort, linePrice } from '../utils/format';
import { ProductMedia } from './ProductMedia';
import { QuantityStepper } from './QuantityStepper';

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
    <article className="reveal flex flex-col rounded-3xl bg-surface p-3 ring-1 ring-line">
      <ProductMedia
        product={product}
        className="card-media aspect-[16/10] w-full overflow-hidden rounded-2xl"
      />

      <div className="flex flex-1 flex-col px-1 pt-4">
        <h3 className="text-xl leading-tight font-semibold">{product.name}</h3>
        <p className="mt-1.5 text-sm leading-snug text-ink-soft">{product.description}</p>
        <p className="mt-3 text-sm text-ink-soft">
          <span className="text-base font-semibold text-ink tabular-nums">
            {formatPrice(product.priceDozen)}
          </span>{' '}
          la docena, <span className="tabular-nums">{formatPrice(product.priceHalfDozen)}</span>{' '}
          la media
        </p>

        <div className="mt-auto flex items-center gap-2 pt-4">
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
            className={`flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 font-semibold whitespace-nowrap transition active:scale-[0.97] ${
              justAdded ? 'bg-ink text-paper' : 'bg-accent text-accent-ink hover:brightness-110'
            }`}
          >
            {justAdded ? (
              <>
                <Check size={18} strokeWidth={2.5} /> Listo
              </>
            ) : (
              <>
                Agregar
                <span className="hidden tabular-nums xl:inline">
                  {formatPrice(linePrice(product, halfDozens))}
                </span>
              </>
            )}
          </button>
        </div>

        {inCart > 0 && (
          <p className="mt-2 text-center text-xs text-ink-soft">
            Ya tenés {formatQuantityShort(inCart)} en tu pedido
          </p>
        )}
      </div>
    </article>
  );
}
