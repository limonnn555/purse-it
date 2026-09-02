export type Zone = "main" | "front" | "side" | "inner";

export type ItemOption = {
  id: string;
  label: string;
  zone: Zone;
};

export const ITEM_OPTIONS: ItemOption[] = [
  { id: "celular", label: "Celular", zone: "front" },
  { id: "laptop", label: "Laptop / tablet", zone: "main" },
  { id: "botella", label: "Botella de agua", zone: "side" },
  { id: "libreta", label: "Libreta / cuaderno", zone: "main" },
  { id: "plumas", label: "Plumas y lápices", zone: "inner" },
  { id: "cartera", label: "Cartera", zone: "front" },
  { id: "llaves", label: "Llaves", zone: "inner" },
  { id: "audifonos", label: "Audífonos", zone: "inner" },
  { id: "maquillaje", label: "Maquillaje", zone: "inner" },
  { id: "cargador", label: "Cargador", zone: "inner" },
];

export const ZONE_INFO: Record<Zone, { label: string; hint: string }> = {
  main: {
    label: "Compartimento principal",
    hint: "Espacio amplio, ideal para lo más grande que cargas.",
  },
  front: {
    label: "Bolsillo frontal",
    hint: "Acceso rápido, para lo que usas todo el tiempo.",
  },
  side: {
    label: "Bolsillo lateral",
    hint: "Elástico, para lo que no quieres que se moje o se caiga.",
  },
  inner: {
    label: "Organizador interior",
    hint: "Con separadores, para objetos chicos.",
  },
};

export type BagSizeId = "mini" | "mediana" | "grande";

export const BAG_SIZES: { id: BagSizeId; label: string; description: string }[] = [
  {
    id: "mini",
    label: "Mini",
    description: "Bolsa de mano, lo esencial.",
  },
  {
    id: "mediana",
    label: "Mediana",
    description: "Bolsa de día, para lo de todos los días.",
  },
  {
    id: "grande",
    label: "Grande",
    description: "Mochila o tote, para cargar de todo.",
  },
];

export type GeneratedDesign = {
  size: BagSizeId;
  zones: Record<Zone, string[]>;
  custom: string[];
};

export function generateDesign(
  size: BagSizeId,
  selectedItemIds: string[],
  customText: string
): GeneratedDesign {
  const zones: Record<Zone, string[]> = {
    main: [],
    front: [],
    side: [],
    inner: [],
  };

  for (const id of selectedItemIds) {
    const item = ITEM_OPTIONS.find((option) => option.id === id);
    if (item) {
      zones[item.zone].push(item.label);
    }
  }

  const custom = customText
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return { size, zones, custom };
}
