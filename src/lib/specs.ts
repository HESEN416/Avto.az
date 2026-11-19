import type { Car } from "@/data/cars";
import { consumption, displacement, fmt, isElectric, rangeKm, years } from "./catalog";

export interface SpecRow {
  label: string;
  value: (c: Car) => string;
  /** Numeric value for highlighting the best car in comparisons. */
  num?: (c: Car) => number | null;
  better?: "high" | "low";
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

export const SPEC_GROUPS: SpecGroup[] = [
  {
    title: "Mühərrik və Performans",
    rows: [
      { label: "Mühərrik", value: (c) => c.engine },
      { label: "Mühərrik həcmi", value: displacement },
      { label: "At gücü", value: (c) => `${c.hp} a.g.`, num: (c) => c.hp, better: "high" },
      { label: "Fırlanma momenti", value: (c) => `${fmt(c.nm)} Nm`, num: (c) => c.nm, better: "high" },
      { label: "0–100 km/saat", value: (c) => `${c.acc} san`, num: (c) => c.acc, better: "low" },
      { label: "Maksimal sürət", value: (c) => `${c.vmax} km/saat`, num: (c) => c.vmax, better: "high" },
    ],
  },
  {
    title: "Yanacaq və Məsafə",
    rows: [
      { label: "Yanacaq növü", value: (c) => c.fuel },
      {
        label: "Sərfiyyat (orta)",
        value: consumption,
        num: (c) => (isElectric(c) ? null : c.cons),
        better: "low",
      },
      { label: "Yanacaq çəni", value: (c) => (c.tank ? `${c.tank} L` : "—") },
      { label: "Batareya", value: (c) => (c.battery ? `${c.battery} kWh` : "—") },
      { label: "Məsafə (təxmini)", value: (c) => `${fmt(rangeKm(c))} km`, num: rangeKm, better: "high" },
    ],
  },
  {
    title: "Ölçülər və Çəki",
    rows: [
      { label: "Uzunluq", value: (c) => `${fmt(c.l)} mm` },
      { label: "En", value: (c) => `${fmt(c.w)} mm` },
      { label: "Hündürlük", value: (c) => `${fmt(c.h)} mm` },
      { label: "Təkər bazası", value: (c) => `${fmt(c.wb)} mm`, num: (c) => c.wb, better: "high" },
      { label: "Çəki", value: (c) => `${fmt(c.kg)} kq`, num: (c) => c.kg, better: "low" },
      { label: "Baqaj həcmi", value: (c) => `${c.trunk} L`, num: (c) => c.trunk, better: "high" },
    ],
  },
  {
    title: "Transmissiya və Şassi",
    rows: [
      { label: "Sürətlər qutusu", value: (c) => c.gearbox },
      { label: "Ötürücü", value: (c) => c.drive },
      { label: "Asqı / şassi", value: (c) => c.chassis },
      { label: "Ban növü", value: (c) => c.body },
      { label: "İstehsal illəri", value: years },
    ],
  },
];

/** Index of the best car for a row, or -1 when there is nothing to compare. */
export function bestIndex(row: SpecRow, cars: Car[]): number[] {
  if (!row.num || !row.better || cars.length < 2) return [];
  const vals = cars.map((c) => row.num!(c));
  const valid = vals.filter((v): v is number => v !== null && v > 0);
  if (valid.length < 2) return [];
  const target = row.better === "high" ? Math.max(...valid) : Math.min(...valid);
  return vals.flatMap((v, i) => (v === target ? [i] : []));
}
