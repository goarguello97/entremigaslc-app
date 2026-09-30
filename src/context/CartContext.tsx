import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { MAX_HALF_DOZENS } from '../config';
import { PRODUCTS_BY_ID } from '../data/products';
import type { CartLine } from '../types';
import { linePrice } from '../utils/format';

/** productId → cantidad en medias docenas */
type CartState = Record<string, number>;

type CartAction =
  | { type: 'add'; id: string; halfDozens: number }
  | { type: 'set'; id: string; halfDozens: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

const STORAGE_KEY = 'miga-cart-v1';

const clamp = (n: number) => Math.min(MAX_HALF_DOZENS, Math.max(1, Math.round(n)));

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      return { ...state, [action.id]: clamp((state[action.id] ?? 0) + action.halfDozens) };
    case 'set':
      return { ...state, [action.id]: clamp(action.halfDozens) };
    case 'remove': {
      const next = { ...state };
      delete next[action.id];
      return next;
    }
    case 'clear':
      return {};
  }
}

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const state: CartState = {};
    for (const [id, qty] of Object.entries(parsed)) {
      // Descarta productos que ya no existen o cantidades corruptas.
      if (PRODUCTS_BY_ID[id] && typeof qty === 'number' && qty > 0) state[id] = clamp(qty);
    }
    return state;
  } catch {
    return {};
  }
}

interface CartContextValue {
  lines: CartLine[];
  total: number;
  /** Cantidad de variedades distintas en el carrito. */
  itemCount: number;
  isOpen: boolean;
  getQuantity: (id: string) => number;
  addItem: (id: string, halfDozens: number) => void;
  setQuantity: (id: string, halfDozens: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Sin storage (modo privado, etc.): el carrito vive solo en memoria.
    }
  }, [state]);

  const lines = useMemo<CartLine[]>(
    () =>
      Object.entries(state).map(([id, halfDozens]) => {
        const product = PRODUCTS_BY_ID[id];
        return { product, halfDozens, subtotal: linePrice(product, halfDozens) };
      }),
    [state],
  );

  const total = useMemo(() => lines.reduce((sum, l) => sum + l.subtotal, 0), [lines]);

  const getQuantity = useCallback((id: string) => state[id] ?? 0, [state]);
  const addItem = useCallback(
    (id: string, halfDozens: number) => dispatch({ type: 'add', id, halfDozens }),
    [],
  );
  const setQuantity = useCallback(
    (id: string, halfDozens: number) => dispatch({ type: 'set', id, halfDozens }),
    [],
  );
  const removeItem = useCallback((id: string) => dispatch({ type: 'remove', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      total,
      itemCount: lines.length,
      isOpen,
      getQuantity,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    }),
    [lines, total, isOpen, getQuantity, addItem, setQuantity, removeItem, clearCart, openCart, closeCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
