import type { Category, Product } from '../types';

export const CATEGORIES: { id: Category | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'clasicos', label: 'Clásicos' },
  { id: 'especiales', label: 'Especiales' },
  { id: 'veggie', label: 'Veggie' },
];

// Colores de relleno en la paleta de la marca (terracota, mostaza, salvia).
export const CATEGORY_TINT: Record<Category, string> = {
  clasicos: '#F7DE96',
  especiales: '#F2CDBD',
  veggie: '#DCDDB7',
};

const MORTADELA = '#EBA9A1';
const HAM = '#E59383';
const CHEESE = '#F1C23E';
const CHICKEN = '#E3C08F';
const VERDEO = '#8E9458';

// Menú de prueba. Precios de ejemplo: reemplazar por los reales.
export const PRODUCTS: Product[] = [
  {
    id: 'mortadela-queso',
    name: 'Mortadela y Queso',
    description: 'Mortadela, queso y mayonesa en pan de miga triple.',
    category: 'clasicos',
    priceDozen: 12000,
    priceHalfDozen: 6500,
    layers: [MORTADELA, CHEESE],
  },
  {
    id: 'jamon-queso',
    name: 'Jamón y Queso',
    description: 'Jamón cocido o paleta, queso y mayonesa en pan de miga triple.',
    category: 'clasicos',
    priceDozen: 13000,
    priceHalfDozen: 7000,
    layers: [HAM, CHEESE],
  },
  {
    id: 'pollo-verdeo-queso',
    name: 'Pollo, Verdeo y Queso',
    description: 'Pollo, cebolla de verdeo, queso y mayonesa en pan de miga triple.',
    category: 'especiales',
    priceDozen: 15000,
    priceHalfDozen: 8000,
    layers: [CHICKEN, VERDEO],
  },
];

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);
