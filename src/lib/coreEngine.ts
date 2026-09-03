import { Zone, ZONE_INFO } from "@/lib/designEngine";

export type CoreProfile = {
  id: string;
  title: string;
  zone: Zone;
  principles: string[];
  mantra: string;
  keywords: string[];
};

// Lógica basada en reglas (palabras clave), no IA generativa real.
// Cada perfil se activa cuando el texto del usuario menciona sus palabras clave.
export const CORE_PROFILES: CoreProfile[] = [
  {
    id: "movilidad-ligera",
    title: "Núcleo Movilidad Ligera",
    zone: "front",
    principles: [
      "Prioriza acceso rápido sobre capacidad de carga.",
      "Protege el equipo electrónico de la lluvia y los golpes.",
      "Un solo compartimento grande, sin subdivisiones que estorben.",
    ],
    mantra: "Ligera, rápida, lista para moverse.",
    keywords: [
      "oficina",
      "laptop",
      "trabajo",
      "bici",
      "computadora",
      "junta",
      "reunion",
    ],
  },
  {
    id: "organizacion-total",
    title: "Núcleo Organización Total",
    zone: "inner",
    principles: [
      "Separadores para que cada objeto chico tenga su propio lugar.",
      "Prioriza no perder ni tardar en encontrar lo pequeño.",
      "Evita un solo hueco grande donde todo se revuelve.",
    ],
    mantra: "Todo en su lugar, nada se pierde.",
    keywords: [
      "llaves",
      "maquillaje",
      "audifonos",
      "audífonos",
      "cargador",
      "lentes",
      "plumas",
    ],
  },
  {
    id: "viaje-constante",
    title: "Núcleo Viaje Constante",
    zone: "side",
    principles: [
      "Protege documentos y electrónicos de golpes durante el trayecto.",
      "Da acceso rápido a lo que pides seguido (pasaporte, tarjetas).",
      "Resiste el uso diario sin perder su forma.",
    ],
    mantra: "Preparada para lo que sea, donde sea.",
    keywords: ["viajo", "viaje", "pasaporte", "vuelo", "avion", "avión", "maleta"],
  },
  {
    id: "actividad-activa",
    title: "Núcleo Actividad Activa",
    zone: "main",
    principles: [
      "Espacio amplio para ropa extra o equipo.",
      "Resiste sudor, agua y movimiento constante.",
      "Fácil de limpiar y de cargar de un lado a otro.",
    ],
    mantra: "Lista para moverse contigo.",
    keywords: ["ejercicio", "deporte", "gym", "correr", "entreno", "bicicleta"],
  },
  {
    id: "estudiante-enfocada",
    title: "Núcleo Estudiante Enfocada",
    zone: "main",
    principles: [
      "Espacio dedicado para libros, cuadernos y laptop sin que se doblen.",
      "Bolsillo de acceso rápido para lo que usas entre clases.",
      "Ligera para cargarla todo el día en la escuela.",
    ],
    mantra: "Enfocada en lo que importa, clase tras clase.",
    keywords: ["escuela", "universidad", "clases", "cuadernos", "libros", "salon"],
  },
];

const DEFAULT_PROFILE: CoreProfile = {
  id: "equilibrado",
  title: "Núcleo Equilibrado",
  zone: "main",
  principles: [
    "Reparte el espacio entre lo esencial y lo ocasional.",
    "No sacrifica organización ni acceso rápido.",
    "Se adapta a días distintos sin rediseñarse.",
  ],
  mantra: "Un poco de todo, balance ante todo.",
  keywords: [],
};

export type CoreOutput = {
  title: string;
  zone: Zone;
  zoneLabel: string;
  principles: string[];
  mantra: string;
  isFallback: boolean;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function generateCore(inputText: string): CoreOutput {
  const normalized = normalize(inputText);

  let bestProfile = DEFAULT_PROFILE;
  let bestScore = 0;

  for (const profile of CORE_PROFILES) {
    const score = profile.keywords.reduce(
      (count, keyword) => (normalized.includes(normalize(keyword)) ? count + 1 : count),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestProfile = profile;
    }
  }

  return {
    title: bestProfile.title,
    zone: bestProfile.zone,
    zoneLabel: ZONE_INFO[bestProfile.zone].label,
    principles: bestProfile.principles,
    mantra: bestProfile.mantra,
    isFallback: bestProfile.id === DEFAULT_PROFILE.id,
  };
}
