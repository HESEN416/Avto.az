export type CountryId = "az" | "de" | "us" | "tr" | "ae" | "jp";
export type Kind = "digits" | "letters" | "kana" | "word" | "alnum";
export type Values = Record<string, string>;

export interface Field {
  key: string;
  /** Azerbaijani label (translation key). */
  label: string;
  kind: Kind;
  max: number;
  placeholder: string;
}

export interface Country {
  id: CountryId;
  label: string;
  fields: Field[];
  defaults: Values;
  /** Optional small line above the main text. */
  top: (v: Values) => string;
  /** Main text on one line (long plate). */
  main: (v: Values) => string;
  /** Two rows for the square plate. */
  rows: (v: Values) => [string, string];
  random: (rand: () => number) => Values;
}

const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const KANA = "さすせそたちつてとなにぬねのはひふほまみむめもやゆらりるろれわ";
export const AZ_REGIONS = ["10", "90", "99", "77", "01", "20", "30", "50", "60", "85"];
export const JP_REGIONS = ["品川", "練馬", "横浜", "大阪", "名古屋", "札幌", "神戸", "京都"];
export const US_STATES = ["CALIFORNIA", "TEXAS", "FLORIDA", "NEW YORK", "NEVADA", "OHIO"];

export function clean(kind: Kind, max: number, v: string): string {
  const s =
    kind === "digits" ? v.replace(/\D/g, "")
    : kind === "letters" ? v.toUpperCase().replace(/[^A-Z]/g, "")
    : kind === "alnum" ? v.toUpperCase().replace(/[^A-Z0-9]/g, "")
    : kind === "word" ? v.toUpperCase().replace(/[^A-Z ]/g, "")
    : v.replace(/[^\u3040-\u309f\u4e00-\u9faf]/g, "");
  return [...s].slice(0, max).join("");
}

const pick = <T,>(rand: () => number, a: ArrayLike<T>): T => a[Math.floor(rand() * a.length)] as T;
const digits = (rand: () => number, n: number) => Array.from({ length: n }, () => pick(rand, "0123456789")).join("");
const letters = (rand: () => number, n: number) => Array.from({ length: n }, () => pick(rand, L)).join("");
const f = (key: string, label: string, kind: Kind, max: number, placeholder: string): Field => ({ key, label, kind, max, placeholder });
const or = (v: string | undefined, d: string) => (v && v.length ? v : d);

export const COUNTRIES: Country[] = [
  {
    id: "az",
    label: "Azərbaycan (AZ)",
    fields: [f("region", "Bölgə kodu", "digits", 2, "10"), f("series", "Seriya hərfləri", "letters", 2, "AA"), f("number", "Nömrə", "digits", 3, "001")],
    defaults: { region: "10", series: "AZ", number: "777" },
    top: () => "",
    main: (v) => `${or(v["region"], "00")} ${or(v["series"], "AA")} ${or(v["number"], "000").padStart(3, "0")}`,
    rows: (v) => [`${or(v["region"], "00")} ${or(v["series"], "AA")}`, or(v["number"], "000").padStart(3, "0")],
    random: (r) => ({ region: pick(r, AZ_REGIONS), series: letters(r, 2), number: String(Math.floor(r() * 999) + 1).padStart(3, "0") }),
  },
  {
    id: "de",
    label: "Almaniya (DE)",
    fields: [f("city", "Şəhər kodu", "letters", 3, "B"), f("letters", "Hərflər", "letters", 2, "AB"), f("number", "Rəqəmlər", "digits", 4, "1234")],
    defaults: { city: "B", letters: "AZ", number: "1918" },
    top: () => "",
    main: (v) => `${or(v["city"], "B")} ${or(v["letters"], "A")} ${or(v["number"], "1")}`,
    rows: (v) => [`${or(v["city"], "B")} ${or(v["letters"], "A")}`, or(v["number"], "1")],
    random: (r) => ({ city: pick(r, ["B", "M", "HH", "K", "F", "S", "DD", "MUC"]), letters: letters(r, 1 + Math.floor(r() * 2)), number: String(Math.floor(r() * 9999) + 1) }),
  },
  {
    id: "us",
    label: "ABŞ (US)",
    fields: [f("state", "Ştat", "word", 14, "CALIFORNIA"), f("plate", "Nömrə", "alnum", 7, "8ABC123")],
    defaults: { state: "CALIFORNIA", plate: "8AZE123" },
    top: (v) => or(v["state"], "USA"),
    main: (v) => or(v["plate"], "ABC123"),
    rows: (v) => [or(v["plate"], "ABC123").slice(0, 3), or(v["plate"], "ABC123").slice(3)],
    random: (r) => ({ state: pick(r, US_STATES), plate: `${digits(r, 1)}${letters(r, 3)}${digits(r, 3)}` }),
  },
  {
    id: "tr",
    label: "Türkiyə (TR)",
    fields: [f("province", "İl kodu", "digits", 2, "34"), f("letters", "Hərflər", "letters", 3, "ABC"), f("number", "Rəqəmlər", "digits", 4, "123")],
    defaults: { province: "34", letters: "AZ", number: "1923" },
    top: () => "",
    main: (v) => `${or(v["province"], "34")} ${or(v["letters"], "A")} ${or(v["number"], "00")}`,
    rows: (v) => [`${or(v["province"], "34")} ${or(v["letters"], "A")}`, or(v["number"], "00")],
    random: (r) => ({ province: String(Math.floor(r() * 81) + 1).padStart(2, "0"), letters: letters(r, 1 + Math.floor(r() * 3)), number: digits(r, 2 + Math.floor(r() * 3)) }),
  },
  {
    id: "ae",
    label: "BƏƏ / Dubay (AE)",
    fields: [f("code", "Kod (hərf)", "letters", 2, "A"), f("number", "Rəqəmlər", "digits", 5, "12345")],
    defaults: { code: "AA", number: "777" },
    top: () => "DUBAI",
    main: (v) => `${or(v["code"], "A")} ${or(v["number"], "1")}`,
    rows: (v) => [or(v["code"], "A"), or(v["number"], "1")],
    random: (r) => ({ code: letters(r, 1 + Math.floor(r() * 2)), number: String(Math.floor(r() * 99999) + 1) }),
  },
  {
    id: "jp",
    label: "Yaponiya (JP)",
    fields: [f("region", "Bölgə (kanji)", "kana", 3, "品川"), f("cls", "Sinif kodu", "digits", 3, "300"), f("kana", "Hiragana", "kana", 1, "さ"), f("number", "Rəqəmlər", "digits", 4, "1234")],
    defaults: { region: "品川", cls: "300", kana: "さ", number: "1234" },
    top: (v) => `${or(v["region"], "品川")} ${or(v["cls"], "300")}`,
    main: (v) => `${or(v["kana"], "さ")} ${jpNumber(v["number"] ?? "")}`,
    rows: (v) => [`${or(v["region"], "品川")} ${or(v["cls"], "300")}`, `${or(v["kana"], "さ")} ${jpNumber(v["number"] ?? "")}`],
    random: (r) => ({ region: pick(r, JP_REGIONS), cls: digits(r, 3), kana: pick(r, KANA), number: String(Math.floor(r() * 9999) + 1) }),
  },
];

export const COUNTRY_BY_ID = Object.fromEntries(COUNTRIES.map((c) => [c.id, c])) as Record<CountryId, Country>;

/** Japanese plates pad short numbers with "・" and split 4 digits as "12-34". */
export function jpNumber(n: string): string {
  const d = n.replace(/\D/g, "").slice(0, 4);
  if (d.length === 4) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return d.padStart(4, "・").replace(/^(..)(..)$/, "$1 $2");
}
