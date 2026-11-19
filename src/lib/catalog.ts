import type { BrandId } from "@/data/brands";
import type { BodyType, Car, Era, FuelType } from "@/data/cars";

export const MAX_COMPARE = 4;
export const MIN_COMPARE = 2;

export interface Filters {
  brand: BrandId | "";
  model: string;
  generation: string;
  era: Era | "";
  body: BodyType | "";
  fuel: FuelType | "";
  hpMin: number;
  hpMax: number;
  accMax: number;
  query: string;
}

export const HP_LIMITS = { min: 0, max: 1200 } as const;
export const ACC_LIMIT = 21;

export const EMPTY_FILTERS: Filters = {
  brand: "",
  model: "",
  generation: "",
  era: "",
  body: "",
  fuel: "",
  hpMin: HP_LIMITS.min,
  hpMax: HP_LIMITS.max,
  accMax: ACC_LIMIT,
  query: "",
};

const uniq = <T,>(xs: T[]) => Array.from(new Set(xs));

/** Models available for the chosen brand (all models when no brand). */
export function modelsFor(cars: Car[], brand: Filters["brand"]): string[] {
  return uniq(cars.filter((c) => !brand || c.brand === brand).map((c) => c.model));
}

/** Generations for the chosen brand + model, oldest first. */
export function generationsFor(cars: Car[], brand: Filters["brand"], model: string): Car[] {
  if (!model) return [];
  return cars
    .filter((c) => (!brand || c.brand === brand) && c.model === model)
    .sort((a, b) => a.from - b.from);
}

/** Changing a parent select clears its dependent children. */
export function updateFilters(prev: Filters, patch: Partial<Filters>): Filters {
  const next = { ...prev, ...patch };
  if ("brand" in patch && patch.brand !== prev.brand) {
    next.model = "";
    next.generation = "";
  }
  if ("model" in patch && patch.model !== prev.model) {
    next.generation = "";
  }
  return next;
}

export function filterCars(cars: Car[], f: Filters): Car[] {
  const q = f.query.trim().toLocaleLowerCase("az");
  return cars.filter((c) => {
    if (f.brand && c.brand !== f.brand) return false;
    if (f.model && c.model !== f.model) return false;
    if (f.generation && c.id !== f.generation) return false;
    if (f.era && c.era !== f.era) return false;
    if (f.body && c.body !== f.body) return false;
    if (f.fuel && c.fuel !== f.fuel) return false;
    if (c.hp < f.hpMin || c.hp > f.hpMax) return false;
    if (c.acc > f.accMax) return false;
    if (q) {
      const hay = `${c.model} ${c.generation} ${c.trim} ${c.brand}`.toLocaleLowerCase("az");
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function activeFilterCount(f: Filters): number {
  let n = 0;
  if (f.brand) n++;
  if (f.model) n++;
  if (f.generation) n++;
  if (f.era) n++;
  if (f.body) n++;
  if (f.fuel) n++;
  if (f.hpMin !== HP_LIMITS.min || f.hpMax !== HP_LIMITS.max) n++;
  if (f.accMax !== ACC_LIMIT) n++;
  if (f.query.trim()) n++;
  return n;
}

/** Toggle a car in the compare list; never exceeds MAX_COMPARE. */
export function toggleCompare(ids: string[], id: string): { ids: string[]; rejected: boolean } {
  if (ids.includes(id)) return { ids: ids.filter((x) => x !== id), rejected: false };
  if (ids.length >= MAX_COMPARE) return { ids, rejected: true };
  return { ids: [...ids, id], rejected: false };
}

export const isElectric = (c: Car) => c.fuel === "Elektrik";

export function years(c: Car): string {
  return `${c.from}–${c.to ?? "hazırda"}`;
}

export function displacement(c: Car): string {
  return c.cc ? `${(c.cc / 1000).toFixed(1)} L · ${c.cc.toLocaleString("az")} sm³` : "Elektrik";
}

export function consumption(c: Car): string {
  return isElectric(c) ? `${c.cons} kWh/100km` : `${c.cons} L/100km`;
}

/** Range: EVs use the official figure; combustion cars derive it from tank and consumption. */
export function rangeKm(c: Car): number {
  if (c.range) return c.range;
  if (!c.tank || !c.cons) return 0;
  return Math.round((c.tank / c.cons) * 100);
}

export const fmt = (n: number) => n.toLocaleString("az").replace(/,/g, " ");
