export type Zone = "main" | "front" | "side" | "inner";

export type ItemOption = {
  id: string;
  label: string;
  zone: Zone;
};

export const ITEM_OPTIONS: ItemOption[] = [
  { id: "celular", label: "Phone", zone: "front" },
  { id: "laptop", label: "Laptop / tablet", zone: "main" },
  { id: "botella", label: "Water bottle", zone: "side" },
  { id: "libreta", label: "Notebook", zone: "main" },
  { id: "plumas", label: "Pens & pencils", zone: "inner" },
  { id: "cartera", label: "Wallet", zone: "front" },
  { id: "llaves", label: "Keys", zone: "inner" },
  { id: "audifonos", label: "Headphones", zone: "inner" },
  { id: "maquillaje", label: "Makeup", zone: "inner" },
  { id: "cargador", label: "Charger", zone: "inner" },
];

export const ZONE_INFO: Record<Zone, { label: string; hint: string }> = {
  main: {
    label: "Main compartment",
    hint: "Roomy space, ideal for the biggest thing you carry.",
  },
  front: {
    label: "Front pocket",
    hint: "Quick access, for what you use all the time.",
  },
  side: {
    label: "Side pocket",
    hint: "Stretchy, for what you don't want to get wet or fall out.",
  },
  inner: {
    label: "Inner organizer",
    hint: "With dividers, for small items.",
  },
};

export type BagSizeId = "mini" | "mediana" | "grande";

export const BAG_SIZES: { id: BagSizeId; label: string; description: string }[] = [
  {
    id: "mini",
    label: "Mini",
    description: "Handbag, just the essentials.",
  },
  {
    id: "mediana",
    label: "Medium",
    description: "Day bag, for everyday use.",
  },
  {
    id: "grande",
    label: "Large",
    description: "Backpack or tote, for carrying everything.",
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
