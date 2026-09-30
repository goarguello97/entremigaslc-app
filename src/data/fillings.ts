// Colores de la ilustración según los ingredientes que se mencionan en el nombre
// (y si hace falta, en la descripción) de cada variedad cargada en la planilla.

const HAM = '#E59383';
const CHEESE = '#F1C23E';

const FILLINGS: [RegExp, string][] = [
  [/mortadela/, '#EBA9A1'],
  [/crudo/, '#B8503A'],
  [/jamon|paleta/, HAM],
  [/pollo/, '#E3C08F'],
  [/verdeo|lechuga|rucula|espinaca|acelga/, '#8E9458'],
  [/tomate/, '#C5583B'],
  [/morron|pimiento/, '#D0492F'],
  [/huevo/, '#F4D27A'],
  [/atun/, '#C7AC8A'],
  [/roquefort|queso azul/, '#B9C2C0'],
  [/nuez|nueces/, '#8A5A3C'],
  [/anana/, '#EDB93A'],
  [/palmito/, '#D9CFA8'],
  [/aceituna/, '#6B6B3A'],
  [/salame|salamin/, '#A8433A'],
  [/queso/, CHEESE],
];

export function normalizeText(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** Devuelve los dos colores de relleno, en el orden en que aparecen los ingredientes. */
export function fillingColors(name: string, description: string): [string, string] {
  const n = normalizeText(name);
  const d = normalizeText(description);

  const found = FILLINGS.map(([re, color]) => {
    const inName = n.search(re);
    const inDesc = d.search(re);
    const pos = inName >= 0 ? inName : inDesc >= 0 ? 1000 + inDesc : -1;
    return { pos, color };
  })
    .filter((f) => f.pos >= 0)
    .sort((a, b) => a.pos - b.pos)
    .map((f) => f.color);

  const unique = [...new Set(found)];
  const first = unique[0] ?? HAM;
  const second = unique[1] ?? (first === CHEESE ? HAM : CHEESE);
  return [first, second];
}
