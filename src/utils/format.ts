import type { Product } from '../types';

const numberFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

export function formatPrice(amount: number): string {
  return `$${numberFormat.format(amount)}`;
}

/** Precio de una cantidad en medias docenas: docenas completas + media docena suelta. */
export function linePrice(product: Product, halfDozens: number): number {
  const dozens = Math.floor(halfDozens / 2);
  const half = halfDozens % 2;
  return dozens * product.priceDozen + half * product.priceHalfDozen;
}

/** 1 → "1/2 Docena", 2 → "1 Docena", 3 → "1 y 1/2 Docenas", 4 → "2 Docenas". */
export function formatQuantity(halfDozens: number): string {
  const dozens = Math.floor(halfDozens / 2);
  const hasHalf = halfDozens % 2 === 1;
  if (dozens === 0) return '1/2 Docena';
  if (!hasHalf) return `${dozens} ${dozens === 1 ? 'Docena' : 'Docenas'}`;
  return `${dozens} y 1/2 Docenas`;
}

/** Versión corta para la interfaz: "½ docena", "1 docena", "1½ docenas". */
export function formatQuantityShort(halfDozens: number): string {
  const dozens = Math.floor(halfDozens / 2);
  const half = halfDozens % 2 === 1 ? '½' : '';
  if (dozens === 0) return '½ docena';
  return `${dozens}${half} ${dozens === 1 && !half ? 'docena' : 'docenas'}`;
}

export function sandwichCount(halfDozens: number): number {
  return halfDozens * 6;
}
