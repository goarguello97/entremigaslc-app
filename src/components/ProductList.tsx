import { Info } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import type { Category } from '../types';
import { ProductCard } from './ProductCard';

// Los filtros solo aparecen cuando el menú es lo bastante largo para necesitarlos.
const usedCategories = CATEGORIES.filter(
  (c) => c.id === 'todos' || PRODUCTS.some((p) => p.category === c.id),
);
const SHOW_FILTERS = PRODUCTS.length > 6 && usedCategories.length > 2;

export function ProductList() {
  const [category, setCategory] = useState<Category | 'todos'>('todos');
  const visible =
    category === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-16 sm:px-6 md:pt-24"
    >
      <h2 id="menu-title" className="text-4xl font-semibold tracking-tight md:text-5xl">
        El menú
      </h2>
      <p className="mt-3 max-w-[52ch] text-ink-soft">
        Todos llevan mayonesa. Pedí por docena o media docena y combiná las variedades que
        quieras.
      </p>

      <p
        id="availability-note"
        className="mt-6 flex max-w-2xl gap-3 rounded-2xl bg-paper-2 px-4 py-3 text-sm leading-snug ring-1 ring-line"
      >
        <Info size={18} strokeWidth={2} className="mt-px shrink-0 text-accent" aria-hidden="true" />
        <span>
          <strong className="font-semibold">Los pedidos quedan sujetos a disponibilidad.</strong>{' '}
          Te confirmamos por WhatsApp antes de prepararlo.
        </span>
      </p>

      {SHOW_FILTERS && (
        <div
          role="tablist"
          aria-label="Filtrar por categoría"
          className="-mx-4 mt-8 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0"
        >
          {usedCategories.map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c.id)}
                className={`h-10 shrink-0 snap-start rounded-full px-5 text-sm font-semibold transition active:scale-[0.97] ${
                  active ? 'bg-ink text-paper' : 'bg-surface text-ink ring-1 ring-line hover:ring-ink/30'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Si queda una card sola en la última fila, ocupa todo el ancho. */}
      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:gap-4 md:[&>*:last-child:nth-child(odd)]:col-span-2">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
