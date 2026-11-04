// Rule-based logic for the /chat bag advisor. It is not an AI model: every reply
// comes from the fixed rules below, which is also why the page can label itself
// honestly. Kept free of imports so it can be unit-tested directly with node.

export type Context = "office" | "school" | "travel" | "gym" | "everywhere";
export type Frustration = "cant_find" | "too_heavy" | "damaged" | "messy" | "other";
export type GuardrailCategory = "pii" | "abuse" | "advice" | "order" | "off_topic";
export type SizeId = "mini" | "mediana" | "grande";

export const QUESTIONS = [
  {
    key: "items",
    text: "What do you carry every day?",
    hint: "Pick as many as you like, or type them.",
    chips: ["Laptop", "Phone", "Wallet", "Keys", "Charger", "Water bottle", "Notebook", "Makeup", "Headphones"],
    multi: true,
  },
  {
    key: "context",
    text: "Where does your day take you?",
    hint: "Pick one, or type it.",
    chips: ["Office", "School", "Travel", "Gym or sports", "Everywhere"],
    multi: false,
  },
  {
    key: "frustration",
    text: "What bugs you most about your current bag?",
    hint: "Pick one, or type it.",
    chips: ["Can't find things", "Too heavy", "Things get damaged", "Looks messy"],
    multi: false,
  },
] as const;

export const MAX_MESSAGE_LENGTH = 200;
export const MAX_COMMENT_LENGTH = 280;

// Item ids match ITEM_OPTIONS in designEngine.ts.
const ITEM_KEYWORDS: Record<string, string[]> = {
  celular: ["phone", "cellphone", "cell", "mobile", "iphone", "smartphone"],
  laptop: ["laptop", "tablet", "computer", "macbook", "ipad"],
  botella: ["water", "bottle", "flask", "thermos"],
  libreta: ["notebook", "notebooks", "journal", "book", "books", "sketchbook", "planner"],
  plumas: ["pen", "pens", "pencil", "pencils"],
  cartera: ["wallet", "cards", "cash"],
  llaves: ["key", "keys"],
  audifonos: ["headphones", "earbuds", "airpods", "earphones"],
  maquillaje: ["makeup", "cosmetics", "lipstick"],
  cargador: ["charger", "cable", "cables", "powerbank"],
};

const CONTEXT_KEYWORDS: [Context, string[]][] = [
  ["office", ["office", "work", "job", "commute"]],
  ["school", ["school", "college", "university", "class", "campus"]],
  ["travel", ["travel", "trip", "flight", "airport", "vacation"]],
  ["gym", ["gym", "sport", "sports", "workout", "run", "running", "exercise"]],
];

const FRUSTRATION_KEYWORDS: [Frustration, string[]][] = [
  ["cant_find", ["find", "lost", "dig", "digging", "search", "searching", "buried"]],
  ["too_heavy", ["heavy", "weight", "shoulder", "bulky"]],
  ["damaged", ["damage", "damaged", "break", "broken", "scratch", "scratched", "crack", "leak", "spill", "wet"]],
  ["messy", ["messy", "mess", "chaos", "chaotic", "tidy", "clutter", "organize", "organized", "disorganized"]],
];

function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z']+/g) ?? [];
}

export function sanitizeTester(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const clean = raw.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 20);
  return clean || null;
}

export function parseItems(text: string): { ids: string[]; custom: string[] } {
  const ids = new Set<string>();
  const custom: string[] = [];
  const tokens = text
    .split(/,|;|\band\b|&|\+|\//i)
    .map((token) => token.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const tokenWords = words(token);
    let matched = false;
    for (const [id, keywords] of Object.entries(ITEM_KEYWORDS)) {
      if (tokenWords.some((word) => keywords.includes(word))) {
        ids.add(id);
        matched = true;
      }
    }
    if (!matched && /[a-z]{2}/i.test(token) && tokenWords.length <= 3 && token.length <= 30) {
      custom.push(token);
    }
  }
  return { ids: [...ids], custom: custom.slice(0, 5) };
}

export function parseContext(text: string): Context {
  const tokenWords = words(text);
  for (const [context, keywords] of CONTEXT_KEYWORDS) {
    if (tokenWords.some((word) => keywords.includes(word))) return context;
  }
  return "everywhere";
}

export function parseFrustration(text: string): Frustration {
  const tokenWords = words(text);
  for (const [frustration, keywords] of FRUSTRATION_KEYWORDS) {
    if (tokenWords.some((word) => keywords.includes(word))) return frustration;
  }
  return "other";
}

// Size rule: by item count, then adjusted for a laptop or a long day out.
export function pickSize(itemCount: number, hasLaptop: boolean, context: Context): SizeId {
  let size: SizeId = itemCount <= 3 ? "mini" : itemCount <= 6 ? "mediana" : "grande";
  if (hasLaptop && size === "mini") size = "mediana";
  if ((context === "travel" || context === "gym") && size === "mini") size = "mediana";
  return size;
}

export const SIZE_LABEL: Record<SizeId, string> = { mini: "Mini", mediana: "Medium", grande: "Large" };

export function sizeReason(itemCount: number, hasLaptop: boolean, context: Context, size: SizeId): string {
  if (hasLaptop && itemCount <= 3) return "A laptop does not fit a mini bag, so I moved you up to Medium.";
  if ((context === "travel" || context === "gym") && size === "mediana" && itemCount <= 3) {
    return "Travel and sports days need a bit more room, so I moved you up to Medium.";
  }
  return `${itemCount} item${itemCount === 1 ? "" : "s"} fit${itemCount === 1 ? "s" : ""} a ${SIZE_LABEL[size]} bag.`;
}

export const FRUSTRATION_TIPS: Record<Frustration, string> = {
  cant_find: "Give small things like keys and your charger the inner organizer, and keep your phone in the front pocket so it is always within reach.",
  too_heavy: "Put the heaviest item (usually the laptop) in the main compartment and leave the extras at home. Fewer, well-placed items feel lighter.",
  damaged: "Keep fragile items like your laptop and phone in their own compartments, and the water bottle in the side pocket so it cannot leak onto them.",
  messy: "A fixed place for every item keeps the bag tidy. The inner organizer handles the small stuff so nothing floats around.",
  other: "Start with one rule: every item gets a fixed place, and the things you grab most often go closest to the opening.",
};

export const CONTEXT_TO_CORE_WORD: Record<Context, string> = {
  office: "office",
  school: "school",
  travel: "travel",
  gym: "gym",
  everywhere: "",
};

// ---------- Guardrails ----------

const PII_PATTERNS = [
  /[\w.+-]+@[\w-]+\.[\w.-]+/i, // email
  /(?:\d[\s().-]*){9,}/, // phone or card numbers (9+ digits)
  /\b(?:password|passcode|pin code|my address is|my phone is|my number is|my email is)\b/i,
];

const ABUSE_WORDS = ["fuck", "shit", "bitch", "asshole", "idiot", "stupid", "dumb", "hate you", "shut up"];
const ADVICE_WORDS = [
  "diagnose", "diagnosis", "prescription", "medication", "medicine", "symptom", "doctor",
  "lawyer", "lawsuit", "legal advice", "sue", "invest", "stock market", "crypto", "loan", "tax",
];
const ORDER_WORDS = [
  "buy", "order", "purchase", "price", "prices", "cost", "how much", "ship", "shipping",
  "delivery", "discount", "refund", "payment", "pay", "checkout",
];

const ON_TOPIC_WORDS = new Set([
  "bag", "bags", "backpack", "purse", "tote", "pocket", "pockets", "carry", "carrying", "size", "sizes",
  "design", "designer", "daily", "everyday", "stuff", "things", "items", "item", "fit", "fits", "organizer",
  "compartment", "compartments", "zone", "zones", "core", "layout", "heavy", "messy", "light",
  ...Object.values(ITEM_KEYWORDS).flat(),
  ...CONTEXT_KEYWORDS.flatMap(([, list]) => list),
  ...FRUSTRATION_KEYWORDS.flatMap(([, list]) => list),
]);

export function containsPii(text: string): boolean {
  return PII_PATTERNS.some((pattern) => pattern.test(text));
}

function includesPhrase(lower: string, list: string[]): boolean {
  const tokens = new Set(words(lower));
  return list.some((entry) => (entry.includes(" ") ? lower.includes(entry) : tokens.has(entry)));
}

export function isOnTopic(text: string): boolean {
  return words(text).some((word) => ON_TOPIC_WORDS.has(word));
}

// Order matters: personal data is caught first so it is never echoed or stored.
export function classify(text: string): GuardrailCategory | "ok" {
  const lower = text.toLowerCase();
  if (containsPii(text)) return "pii";
  if (includesPhrase(lower, ABUSE_WORDS)) return "abuse";
  if (includesPhrase(lower, ADVICE_WORDS)) return "advice";
  if (includesPhrase(lower, ORDER_WORDS)) return "order";
  return "ok";
}

// Used for free-text answers: long, unrelated sentences are treated as off topic.
export function isOffTopicAnswer(text: string): boolean {
  return !isOnTopic(text) && words(text).length >= 4;
}

export const GUARDRAIL_REPLY: Record<GuardrailCategory, string> = {
  pii: "Please don't share personal details like emails, phone numbers, or card numbers. I did not save that message. Let's keep going with your bag.",
  abuse: "Let's keep it friendly. I'm here to help you choose and organize a bag.",
  advice: "I can only help with choosing and organizing a bag. I can't give medical, legal, or financial advice. Want to continue with your bag?",
  order: "Purse It can't take orders or promise prices, shipping, or discounts yet. I've marked this chat for a person to review. Meanwhile, I can still help you plan your bag.",
  off_topic: "That's outside what I can help with. I only help with choosing and organizing a bag. Want to continue?",
};

export const HUMAN_REASONS = {
  order: "order_or_price_request",
  low_confidence: "low_confidence",
  user_request: "user_requested",
} as const;

export type FollowUp = "size" | "organizer" | "front" | "core" | "restart" | "none";

export function followUpIntent(text: string): FollowUp {
  const lower = text.toLowerCase();
  if (/start over|restart|again|reset/.test(lower)) return "restart";
  if (/size|big|small|fit|large|medium|mini/.test(lower)) return "size";
  if (/organizer|inner|key|charger|small things|cable/.test(lower)) return "organizer";
  if (/front|phone|wallet|quick/.test(lower)) return "front";
  if (/core|principle|design|why/.test(lower)) return "core";
  return "none";
}

export const FOLLOW_UP_REPLIES: Record<Exclude<FollowUp, "restart" | "none">, string> = {
  size: "I pick the size from how many items you carry, then move you up if you carry a laptop or have a travel or sports day. Mini is up to 3 items, Medium is 4 to 6, and Large is 7 or more.",
  organizer: "The inner organizer has dividers for small things like keys, chargers, headphones, and makeup, so they stay put and you can find them fast.",
  front: "The front pocket is for what you grab all day, like your phone and wallet, so you never have to open the main compartment.",
  core: "A design core turns your routine into a few principles and a priority zone for your bag. You can see yours on the Core page.",
};

export const FOLLOW_UP_FALLBACK =
  "I can explain your size, where your small items go, or what the front pocket is for. You can also start over.";

export const FOLLOW_UP_CHIPS = ["Why this size?", "Where do my keys go?", "What's the front pocket for?", "Start over"];
