export type Category = 'clasicos' | 'especiales' | 'veggie';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  priceDozen: number;
  priceHalfDozen: number;
  /** Colores de los dos rellenos, usados para la ilustración. */
  layers: [string, string];
}

export interface CartLine {
  product: Product;
  /** Cantidad expresada en medias docenas (1 = 6 sándwiches). */
  halfDozens: number;
  subtotal: number;
}

export type DeliveryMethod = 'envio' | 'retiro';
export type PaymentMethod = 'efectivo' | 'transferencia';

export interface CustomerInfo {
  name: string;
  delivery: DeliveryMethod;
  address: string;
  payment: PaymentMethod;
  notes: string;
}
