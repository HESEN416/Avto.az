export interface Plate {
  region: string;
  series: string;
  number: string;
}

/** Common Azerbaijani region codes used by the random generator. */
export const REGION_CODES = ["10", "90", "99", "77", "01", "20", "30", "50", "60", "85"];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const cleanRegion = (v: string) => v.replace(/\D/g, "").slice(0, 2);
export const cleanSeries = (v: string) => v.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
export const cleanNumber = (v: string) => v.replace(/\D/g, "").slice(0, 3);

/** Text shown on the plate; empty slots are padded so the layout never collapses. */
export function plateText(p: Plate) {
  return {
    region: p.region.padEnd(2, "0"),
    series: p.series.padEnd(2, "A"),
    number: p.number.padStart(3, "0"),
  };
}

export function randomPlate(rand: () => number = Math.random): Plate {
  const pick = (s: string) => s[Math.floor(rand() * s.length)] ?? "A";
  return {
    region: REGION_CODES[Math.floor(rand() * REGION_CODES.length)] ?? "10",
    series: pick(LETTERS) + pick(LETTERS),
    number: String(Math.floor(rand() * 999) + 1).padStart(3, "0"),
  };
}
