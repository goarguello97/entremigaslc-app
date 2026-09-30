import type { Settings } from './types';

// Pestañas de la planilla de Google publicadas como CSV (Archivo > Compartir > Publicar en la Web).
// Se definen en .env (local) o en las variables de entorno del hosting.
export const SHEET_MENU_URL = import.meta.env.VITE_SHEET_MENU_URL?.trim() ?? '';
export const SHEET_CONFIG_URL = import.meta.env.VITE_SHEET_CONFIG_URL?.trim() ?? '';

/**
 * Sin link del menú: en desarrollo se usa el menú local de src/data/products.ts;
 * en producción se muestra el estado de error para que la falta de configuración no pase inadvertida.
 */
export const USE_LOCAL_MENU = !SHEET_MENU_URL && import.meta.env.DEV;

if (!SHEET_MENU_URL) {
  console.warn(
    import.meta.env.DEV
      ? '[menú] Falta VITE_SHEET_MENU_URL: se usa el menú local de src/data/products.ts.'
      : '[menú] Falta VITE_SHEET_MENU_URL en las variables de entorno del build.',
  );
}

/** Valores por defecto: se usan si la pestaña Config no carga o le falta algún dato. */
export const DEFAULT_SETTINGS: Settings = {
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491112345678',
  storeName: import.meta.env.VITE_STORE_NAME ?? 'Entre Migas',
  instagram: 'entremigas.lc',
  location: 'Los Cóndores, Córdoba',
  notice:
    'Los pedidos quedan sujetos a disponibilidad. Te confirmamos por WhatsApp antes de prepararlo.',
};

// Máximo de medias docenas por variedad (20 docenas).
export const MAX_HALF_DOZENS = 40;
