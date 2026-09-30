import { useState } from 'react';
import { CATEGORY_TINT } from '../data/products';
import { resolveImage } from '../data/images';
import type { Product } from '../types';
import { SandwichArt } from './SandwichArt';

interface ProductMediaProps {
  product: Product;
  /** Tamaño y forma del contenedor (aspect, width, radius). */
  className?: string;
  artClassName?: string;
}

/** Foto de la variedad; si no hay o no carga (ej. link de Drive privado), muestra la ilustración. */
export function ProductMedia({ product, className = '', artClassName = 'w-2/5' }: ProductMediaProps) {
  const src = resolveImage(product.id, product.image);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={`Sándwiches de miga de ${product.name}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailedSrc(src)}
        className={`bg-paper-2 object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`grid place-items-center ${className}`}
      style={{ backgroundColor: CATEGORY_TINT[product.category] }}
    >
      <SandwichArt layers={product.layers} className={artClassName} />
    </div>
  );
}
