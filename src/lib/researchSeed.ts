import type { ResearchEntry } from "./researchEngine";

// Same 13 researched entries as supabase/research_schema.sql. Shown only when
// the live database does not respond, so /research is never empty.
export const SEED_ENTRIES: ResearchEntry[] = [
  { id: 1, name: "Timbuk2", category: "Global Example", region: "Global", description: "Build-your-own bag: choose fabric, color, and hardware, made to order.", threat_level: "Medium", url: "https://www.timbuk2.com/collections/custom-bags-backpacks" },
  { id: 2, name: "Boundary Supply", category: "Global Example", region: "Global", description: "Modular backpack systems you reconfigure for work, travel, or everyday carry.", threat_level: "Medium", url: "https://www.boundarysupply.com/collections/modular-pack-systems" },
  { id: 3, name: "Contrado", category: "Global Example", region: "Global", description: "Design your own bag using your own photos or artwork, printed to order.", threat_level: "Low", url: "https://www.contrado.com/design-your-own-backpack" },
  { id: 4, name: "YouCustomizeIt", category: "Global Example", region: "Global", description: "Online bag design studio with live preview and 500+ starting templates.", threat_level: "Low", url: "https://www.youcustomizeit.com" },
  { id: 5, name: "Cancha", category: "Global Example", region: "Global", description: "Modular backpack built around a core compartment with clip-on accessory pouches.", threat_level: "Medium", url: "https://canchagear.com" },
  { id: 6, name: "Printify", category: "Competitor", region: "Global", description: "Print-on-demand backpack customization platform, no order minimums.", threat_level: "Low", url: "https://printify.com/custom-backpacks/" },
  { id: 7, name: "Zazzle", category: "Competitor", region: "Global", description: "Marketplace offering free print customization on backpacks.", threat_level: "Low", url: "https://www.zazzle.com/custom/backpacks" },
  { id: 8, name: "Sea to Summit Packing Cubes", category: "Substitute", region: "Global", description: "Buy an organizer insert instead of a custom-designed bag; works inside any bag you already own.", threat_level: "High", url: "https://www.seatosummit.com" },
  { id: 9, name: "Bagly", category: "Substitute", region: "Global", description: "Packing and organization app that suggests what to bring, without changing the bag itself.", threat_level: "Low", url: "https://www.withbagly.com/en" },
  { id: 10, name: "JanSport / Herschel (generic backpacks)", category: "Substitute", region: "Global", description: "Off-the-shelf backpacks with zero customization, the lowest-friction and cheapest default option.", threat_level: "High", url: null },
  { id: 11, name: "Mayor Bag", category: "Competitor", region: "Mexico", description: "Mexican manufacturer of promotional and made-to-order backpacks, mostly wholesale/B2B.", threat_level: "Medium", url: "https://mayorbag.com" },
  { id: 12, name: "Mochilas Especializadas", category: "Competitor", region: "Mexico", description: "100% Mexican company producing specialized backpacks by fabric and use case.", threat_level: "Medium", url: "https://mochilasespecializadas.com.mx" },
  { id: 13, name: "Talabartería artesanal mexicana", category: "Substitute", region: "Mexico", description: "Handmade, made-to-order leather bags from local artisans; bespoke but no digital design tool or saved history.", threat_level: "Medium", url: null },
].map((entry) => ({ ...entry, created_at: "2026-09-28T00:00:00Z" })) as ResearchEntry[];
