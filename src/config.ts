import type { Settings } from './types';

// Planilla de Google publicada como CSV (Archivo > Compartir > Publicar en la Web).
// Son links públicos de solo lectura; se pueden reemplazar con variables de entorno.
const SHEET_BASE =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTu1uJPno7EI-iHJy74Y702vi_GYWXmur5HpsXxxZSUdwd_IeIxpqTLUoKDK-XXCg0byJP3rCbb0eYn/pub';

export const SHEET_MENU_URL =
  import.meta.env.VITE_SHEET_MENU_URL ?? `${SHEET_BASE}?gid=0&single=true&output=csv`;
export const SHEET_CONFIG_URL =
  import.meta.env.VITE_SHEET_CONFIG_URL ?? `${SHEET_BASE}?gid=729520028&single=true&output=csv`;

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
