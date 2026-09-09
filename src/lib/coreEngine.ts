import { Zone, ZONE_INFO } from "@/lib/designEngine";

export type CoreProfile = {
  id: string;
  title: string;
  zone: Zone;
  principles: string[];
  mantra: string;
  keywords: string[];
};

// Rule-based logic (keyword matching), not a real generative AI model.
// Each profile activates when the user's text mentions its keywords.
export const CORE_PROFILES: CoreProfile[] = [
  {
    id: "movilidad-ligera",
    title: "Light Mobility Core",
    zone: "front",
    principles: [
      "Prioritize quick access over carrying capacity.",
      "Protect electronics from rain and bumps.",
      "One large compartment, no subdivisions getting in the way.",
    ],
    mantra: "Light, fast, ready to move.",
    keywords: [
      "office",
      "laptop",
      "work",
      "bike",
      "computer",
      "meeting",
      "commute",
    ],
  },
  {
    id: "organizacion-total",
    title: "Total Organization Core",
    zone: "inner",
    principles: [
      "Dividers so every small item has its own spot.",
      "Prioritize never losing or struggling to find the small stuff.",
      "Avoid one big pocket where everything gets jumbled together.",
    ],
    mantra: "Everything in its place, nothing gets lost.",
    keywords: [
      "keys",
      "makeup",
      "headphones",
      "charger",
      "glasses",
      "pens",
    ],
  },
  {
    id: "viaje-constante",
    title: "Constant Travel Core",
    zone: "side",
    principles: [
      "Protect documents and electronics from bumps during transit.",
      "Give quick access to what you reach for often (passport, cards).",
      "Hold up to daily use without losing its shape.",
    ],
    mantra: "Ready for anything, anywhere.",
    keywords: ["travel", "trip", "passport", "flight", "airplane", "suitcase"],
  },
  {
    id: "actividad-activa",
    title: "Active Lifestyle Core",
    zone: "main",
    principles: [
      "Roomy space for extra clothes or gear.",
      "Withstands sweat, water, and constant movement.",
      "Easy to clean and carry from place to place.",
    ],
    mantra: "Ready to move with you.",
    keywords: ["exercise", "sports", "gym", "running", "workout", "bicycle"],
  },
  {
    id: "estudiante-enfocada",
    title: "Focused Student Core",
    zone: "main",
    principles: [
      "Dedicated space for books, notebooks, and a laptop without bending them.",
      "Quick-access pocket for what you use between classes.",
      "Light enough to carry all day at school.",
    ],
    mantra: "Focused on what matters, class after class.",
    keywords: ["school", "university", "college", "classes", "notebooks", "books"],
  },
];

const DEFAULT_PROFILE: CoreProfile = {
  id: "equilibrado",
  title: "Balanced Core",
  zone: "main",
  principles: [
    "Splits the space between the essential and the occasional.",
    "Doesn't sacrifice organization or quick access.",
    "Adapts to different days without needing a redesign.",
  ],
  mantra: "A bit of everything, balance above all.",
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
    .replace(/[̀-ͯ]/g, "");
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
