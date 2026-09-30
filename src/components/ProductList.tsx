import { Info, RotateCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { CATEGORIES } from '../data/products';
import type { Category } from '../types';
import { ProductCard } from './ProductCard';

// Si queda una card sola en la última fila, ocupa todo el ancho.
const GRID = 'mt-6 grid gap-3 md:grid-cols-2 lg:gap-4 md:[&>*:last-child:nth-child(odd)]:col-span-2';

/** Placeholder con la misma forma que ProductCard mientras llega la planilla. */
function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid animate-pulse grid-cols-[84px_1fr] gap-x-4 gap-y-4 rounded-3xl bg-surface p-3 ring-1 ring-line sm:grid-cols-[112px_1fr] sm:p-4"
    >
      <div className="aspect-square rounded-2xl bg-paper-2" />
      <div className="flex flex-col justify-center gap-2">
        <div className="h-5 w-2/3 rounded-full bg-paper-2" />
        <div className="h-3.5 w-full rounded-full bg-paper-2" />
        <div className="h-3.5 w-1/2 rounded-full bg-paper-2" />
      </div>
      <div className="col-span-2 h-12 rounded-full bg-paper-2" />
    </div>
  );
}

/** Resalta la primera oración del aviso que el negocio escribe en la planilla. */
function Notice({ text }: { text: string }) {
  const match = text.match(/^(.+?[.!?])\s+(.+)$/s);
  return (
    <p
      id="availability-note"
      className="mt-6 flex max-w-2xl gap-3 rounded-2xl bg-paper-2 px-4 py-3 text-sm leading-snug ring-1 ring-line"
    >
      <Info size={18} strokeWidth={2} className="mt-px shrink-0 text-accent" aria-hidden="true" />
      {match ? (
        <span>
          <strong className="font-semibold">{match[1]}</strong> {match[2]}
        </span>
      ) : (
        <strong className="font-semibold">{text}</strong>
      )}
    </p>
  );
}

export function ProductList() {
  const { status, products, settings, retry } = useCatalog();
  const [category, setCategory] = useState<Category | 'todos'>('todos');

  // Los filtros solo aparecen cuando el menú es lo bastante largo para necesitarlos.
  const usedCategories = useMemo(
    () =>
      CATEGORIES.filter((c) => c.id === 'todos' || products.some((p) => p.category === c.id)),
    [products],
  );
  const showFilters = products.length > 6 && usedCategories.length > 2;
  const visible =
    !showFilters || category === 'todos'
      ? products
      : products.filter((p) => p.category === category);

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      aria-busy={status === 'loading'}
      className="mx-auto max-w-6xl scroll-mt-16 px-4 pt-16 sm:px-6 md:pt-24"
    >
      <h2 id="menu-title" className="text-4xl font-semibold tracking-tight md:text-5xl">
        El menú
      </h2>
      <p className="mt-3 max-w-[52ch] text-ink-soft">
        Todos llevan mayonesa. Pedí por docena o media docena y combiná las variedades que
        quieras.
      </p>

      {settings.notice && <Notice text={settings.notice} />}

      {showFilters && (
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

      {status === 'loading' && (
        <div className={GRID}>
          <span className="sr-only">Cargando el menú…</span>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 flex max-w-2xl flex-col items-start gap-4 rounded-3xl bg-surface p-6 ring-1 ring-line">
          <div>
            <p className="text-lg font-semibold">No pudimos cargar el menú.</p>
            <p className="mt-1 text-ink-soft">Revisá tu conexión y probá de nuevo.</p>
          </div>
          <button
            type="button"
            onClick={retry}
            className="flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-paper transition hover:opacity-90 active:scale-[0.97]"
          >
            <RotateCw size={17} strokeWidth={2} />
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && products.length === 0 && (
        <p className="mt-6 max-w-2xl rounded-3xl bg-surface p-6 text-ink-soft ring-1 ring-line">
          Por ahora no hay variedades disponibles. Volvé a mirar más tarde.
        </p>
      )}

      {status === 'ready' && products.length > 0 && (
        <div className={GRID}>
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
