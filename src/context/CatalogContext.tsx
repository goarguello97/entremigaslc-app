import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_SETTINGS, SHEET_MENU_URL } from '../config';
import { LOCAL_PRODUCTS } from '../data/products';
import { fetchCatalog } from '../data/sheet';
import type { Catalog, Product, Settings } from '../types';

const CACHE_KEY = 'miga-catalog-v1';
const TIMEOUT_MS = 10_000;

type Status = 'loading' | 'ready' | 'error';

interface CatalogState {
  status: Status;
  catalog: Catalog | null;
  /** true cuando los datos vienen de la planilla en esta visita (no del caché). */
  fresh: boolean;
}

function readCache(): Catalog | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Catalog;
    if (!Array.isArray(parsed.products) || typeof parsed.settings !== 'object') return null;
    return { products: parsed.products, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
  } catch {
    return null;
  }
}

function writeCache(catalog: Catalog) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(catalog));
  } catch {
    // Sin storage: la próxima visita vuelve a esperar a la planilla.
  }
}

function initialState(): CatalogState {
  if (!SHEET_MENU_URL) {
    return {
      status: 'ready',
      catalog: { products: LOCAL_PRODUCTS, settings: DEFAULT_SETTINGS },
      fresh: true,
    };
  }
  // Si hay una copia de la visita anterior, se muestra al instante y se actualiza en segundo plano.
  const cached = readCache();
  return cached
    ? { status: 'ready', catalog: cached, fresh: false }
    : { status: 'loading', catalog: null, fresh: false };
}

interface CatalogContextValue {
  status: Status;
  fresh: boolean;
  products: Product[];
  productsById: Record<string, Product>;
  settings: Settings;
  retry: () => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(initialState);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!SHEET_MENU_URL) return;
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    fetchCatalog(controller.signal)
      .then((catalog) => {
        if (cancelled) return;
        writeCache(catalog);
        setState({ status: 'ready', catalog, fresh: true });
      })
      .catch(() => {
        if (cancelled) return;
        // Con una copia en caché se sigue mostrando esa; sin copia, se muestra el error.
        setState((s) => (s.catalog ? s : { status: 'error', catalog: null, fresh: false }));
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState((s) => (s.catalog ? s : { ...s, status: 'loading' }));
    setAttempt((a) => a + 1);
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const products = state.catalog?.products ?? [];
    return {
      status: state.status,
      fresh: state.fresh,
      products,
      productsById: Object.fromEntries(products.map((p) => [p.id, p])),
      settings: state.catalog?.settings ?? DEFAULT_SETTINGS,
      retry,
    };
  }, [state, retry]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog debe usarse dentro de <CatalogProvider>');
  return ctx;
}
