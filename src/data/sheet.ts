import { DEFAULT_SETTINGS, SHEET_CONFIG_URL, SHEET_MENU_URL } from '../config';
import type { Catalog, Category, Product, Settings } from '../types';
import { parseCsv } from '../utils/csv';
import { fillingColors, normalizeText } from './fillings';

const CATEGORIES: Category[] = ['clasicos', 'especiales', 'veggie'];
const HIDDEN_VALUES = new Set(['no', 'false', 'falso', '0']);

/**
 * Convierte precios escritos a mano: "20000", "$20.000", "20.000,50", "20,000".
 * Devuelve NaN si no hay número.
 */
export function parsePrice(raw: string): number {
  const s = raw.replace(/[^\d.,]/g, '');
  if (!s) return NaN;
  let normalized: string;
  if (s.includes(',') && !/^\d{1,3}(,\d{3})+$/.test(s)) {
    // Formato argentino: puntos de miles y coma decimal.
    normalized = s.replace(/\./g, '').replace(',', '.');
  } else {
    // Sin coma decimal: puntos y comas son separadores de miles.
    normalized = s.replace(/[.,]/g, '');
  }
  return Math.round(Number(normalized));
}

function slugify(s: string): string {
  return normalizeText(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Lee la pestaña Menu. Las filas incompletas o con precio inválido se descartan. */
export function parseMenu(csv: string): Product[] {
  const rows = parseCsv(csv);
  const headerIndex = rows.findIndex((r) => r.some((c) => normalizeText(c.trim()) === 'nombre'));
  if (headerIndex < 0) return [];

  const headers = rows[headerIndex].map((h) => normalizeText(h.trim()));
  const col = (name: string) => headers.indexOf(name);
  const idx = {
    name: col('nombre'),
    description: col('descripcion'),
    dozen: col('precio_docena'),
    half: col('precio_media'),
    available: col('disponible'),
    category: col('categoria'),
  };
  const cell = (row: string[], i: number) => (i >= 0 ? (row[i] ?? '').trim() : '');

  const products: Product[] = [];
  const usedIds = new Set<string>();

  for (const row of rows.slice(headerIndex + 1)) {
    const name = cell(row, idx.name);
    const priceDozen = parsePrice(cell(row, idx.dozen));
    if (!name || !(priceDozen > 0)) continue;
    // Solo se ocultan las filas marcadas explícitamente como no disponibles.
    if (HIDDEN_VALUES.has(normalizeText(cell(row, idx.available)))) continue;

    const halfRaw = parsePrice(cell(row, idx.half));
    const priceHalfDozen = halfRaw > 0 ? halfRaw : Math.round(priceDozen / 2);
    const description = cell(row, idx.description);
    const categoryRaw = normalizeText(cell(row, idx.category)) as Category;
    const category = CATEGORIES.includes(categoryRaw) ? categoryRaw : 'clasicos';

    // El id sale del nombre: es lo que guarda el carrito del cliente.
    let id = slugify(name) || 'variedad';
    for (let n = 2; usedIds.has(id); n++) id = `${slugify(name)}-${n}`;
    usedIds.add(id);

    products.push({
      id,
      name,
      description,
      category,
      priceDozen,
      priceHalfDozen,
      layers: fillingColors(name, description),
    });
  }

  return products;
}

/** Lee la pestaña Config (clave / valor). Ignora claves desconocidas y valores vacíos. */
export function parseSettings(csv: string): Settings {
  const map = new Map<string, string>();
  for (const [key = '', value = ''] of parseCsv(csv)) {
    map.set(normalizeText(key.trim()), value.trim());
  }

  const settings: Settings = { ...DEFAULT_SETTINGS };
  const whatsapp = (map.get('whatsapp') ?? '').replace(/\D/g, '');
  if (whatsapp.length >= 10 && whatsapp.length <= 15) settings.whatsapp = whatsapp;
  if (map.get('nombre')) settings.storeName = map.get('nombre')!;
  const instagram = (map.get('instagram') ?? '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/[@/]/g, '');
  if (instagram) settings.instagram = instagram;
  if (map.get('localidad')) settings.location = map.get('localidad')!;
  if (map.get('aviso')) settings.notice = map.get('aviso')!;
  return settings;
}

async function fetchText(url: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} al leer ${url}`);
  return res.text();
}

/** Descarga menú y configuración. Si falla solo la configuración, usa los valores por defecto. */
export async function fetchCatalog(signal: AbortSignal): Promise<Catalog> {
  const [menuCsv, configCsv] = await Promise.all([
    fetchText(SHEET_MENU_URL, signal),
    SHEET_CONFIG_URL ? fetchText(SHEET_CONFIG_URL, signal).catch(() => null) : null,
  ]);
  return {
    products: parseMenu(menuCsv),
    settings: configCsv ? parseSettings(configCsv) : DEFAULT_SETTINGS,
  };
}
