import { normalizeText } from './fillings';

// Fotos incluidas en la app: src/assets/productos/<nombre>.jpg|png|webp.
// Vite les agrega un hash al publicar, así que se resuelven acá y no se guardan en caché.
const files = import.meta.glob<string>('../assets/productos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const toKey = (s: string) =>
  normalizeText(s)
    .replace(/\.(jpe?g|png|webp)$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const BUNDLED: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [toKey(path.split('/').pop() ?? ''), url]),
);

/**
 * Links de Google Drive ("Compartir > Copiar enlace") apuntan a una página, no a la imagen.
 * Se convierten al endpoint de miniaturas, que sirve el archivo si es público.
 */
function driveImageUrl(url: string): string | undefined {
  if (!/drive\.google\.com|docs\.google\.com/i.test(url)) return undefined;
  const id = url.match(/\/d\/([\w-]{10,})/)?.[1] ?? url.match(/[?&]id=([\w-]{10,})/)?.[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1200` : undefined;
}

/**
 * Foto de una variedad. `raw` es la columna `imagen` de la planilla:
 * - link de Google Drive: se convierte a imagen directa;
 * - otro link (https://...): se usa tal cual;
 * - nombre de archivo: se busca entre las fotos incluidas en la app;
 * - vacío: se busca una foto con el mismo id que la variedad (ej. "jamon-y-queso.jpg").
 */
export function resolveImage(id: string, raw = ''): string | undefined {
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) return driveImageUrl(value) ?? value;
  if (value) return BUNDLED[toKey(value)];
  return BUNDLED[id];
}
