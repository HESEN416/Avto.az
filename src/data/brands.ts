export type BrandId =
  | "mercedes"
  | "bmw"
  | "audi"
  | "volkswagen"
  | "lada"
  | "byd"
  | "porsche"
  | "bentley"
  | "rolls-royce"
  | "volvo";

export interface Brand {
  id: BrandId;
  name: string;
  country: string;
  founded: number;
  hq: string;
  /** Car id whose cover photo represents the brand card. */
  heroCar: string;
}

export const BRANDS: Brand[] = [
  { id: "mercedes", name: "Mercedes-Benz", country: "Almaniya", founded: 1926, hq: "Ştutqart", heroCar: "mb-w223" },
  { id: "bmw", name: "BMW", country: "Almaniya", founded: 1916, hq: "Münhen", heroCar: "bmw-e30" },
  { id: "audi", name: "Audi", country: "Almaniya", founded: 1909, hq: "İnqolştadt", heroCar: "audi-etron-gt" },
  { id: "volkswagen", name: "Volkswagen", country: "Almaniya", founded: 1937, hq: "Volfsburq", heroCar: "vw-golf-mk2" },
  { id: "lada", name: "Lada", country: "Rusiya", founded: 1966, hq: "Tolyatti", heroCar: "lada-2106" },
  { id: "byd", name: "BYD", country: "Çin", founded: 1995, hq: "Şençjen", heroCar: "byd-seal" },
  { id: "porsche", name: "Porsche", country: "Almaniya", founded: 1931, hq: "Ştutqart", heroCar: "porsche-930" },
  { id: "bentley", name: "Bentley", country: "Böyük Britaniya", founded: 1919, hq: "Kru", heroCar: "bentley-cgt" },
  { id: "rolls-royce", name: "Rolls-Royce", country: "Böyük Britaniya", founded: 1906, hq: "Qudvud", heroCar: "rr-cullinan" },
  { id: "volvo", name: "Volvo", country: "İsveç", founded: 1927, hq: "Göteborq", heroCar: "volvo-240" },
];

export const BRAND_BY_ID = Object.fromEntries(BRANDS.map((b) => [b.id, b])) as Record<BrandId, Brand>;
