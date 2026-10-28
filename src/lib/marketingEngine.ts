export type HeadlineCheck = {
  label: string;
  points: number;
  max: number;
};

export type HeadlineScore = {
  score: number;
  checks: HeadlineCheck[];
};

const HYPE_WORDS = [
  "revolutionary",
  "game-changing",
  "game changing",
  "cutting-edge",
  "cutting edge",
  "ai-powered",
  "best ever",
  "synergy",
  "next-generation",
];

const OUTCOME_WORDS = ["bag", "carry", "design", "place", "organize", "every day", "everything", "fit"];
const CONCRETE_WORDS = ["phone", "laptop", "keys", "charger", "bottle", "wallet", "notebook", "headphones"];
const ACTION_STARTS = ["design", "build", "stop", "get", "make", "give", "try", "plan", "carry"];

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Simulated, rule-based score: a heuristic, not real audience data.
export function scoreHeadline(text: string): HeadlineScore {
  const clean = text.trim();
  const lower = clean.toLowerCase();
  if (!clean) {
    return { score: 0, checks: [] };
  }

  const words = countWords(clean);
  const lengthPoints = words >= 5 && words <= 12 ? 25 : words >= 3 && words <= 16 ? 12 : 0;

  const speaksToReader =
    /\b(you|your|you're)\b/.test(lower) ||
    ACTION_STARTS.some((verb) => lower.startsWith(verb));

  const outcomeHits = OUTCOME_WORDS.filter((word) => lower.includes(word)).length;
  const outcomePoints = outcomeHits >= 2 ? 20 : outcomeHits === 1 ? 10 : 0;

  const concrete =
    /\d/.test(clean) || CONCRETE_WORDS.some((word) => lower.includes(word));

  const hype = HYPE_WORDS.some((word) => lower.includes(word));

  const checks: HeadlineCheck[] = [
    { label: "Length (5-12 words is best)", points: lengthPoints, max: 25 },
    { label: "Speaks to the reader", points: speaksToReader ? 20 : 0, max: 20 },
    { label: "Names the outcome (bag, carry, design, place)", points: outcomePoints, max: 20 },
    { label: "Concrete detail (a number or a real item)", points: concrete ? 15 : 0, max: 15 },
    { label: "No hype words", points: hype ? 0 : 20, max: 20 },
  ];

  return {
    score: checks.reduce((total, check) => total + check.points, 0),
    checks,
  };
}

export type Asset = { asset_type: string; title: string; content: string };

export function toMarkdown(assets: Asset[], heading = "Purse It marketing assets"): string {
  const body = assets
    .map((asset) => `## ${asset.title}\n\n_Type: ${asset.asset_type}_\n\n${asset.content.trim()}\n`)
    .join("\n");
  return `# ${heading}\n\n${body}`;
}
