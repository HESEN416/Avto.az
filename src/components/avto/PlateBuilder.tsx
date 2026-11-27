import { useRef, useState } from "react";
import { Download, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES, COUNTRY_BY_ID, clean, type CountryId, type Values } from "@/lib/plate";
import { useT } from "@/lib/i18n";

type Size = "long" | "square";

// Real-world plate artwork colours (a physical object, not the UI theme).
const C = {
  ink: "#141414", white: "#ffffff", metal: "#eef0f3", edge: "#d5d9df",
  euBlue: "#003399", star: "#ffcc00", azBlue: "#00b5e2", azRed: "#ef3340", azGreen: "#509e2f",
  usRed: "#b3122e", usBlue: "#1d3f8f", jpGreen: "#1f6b3a", aeRed: "#c8102e",
};
// Narrow, tall plate lettering; textLength squeezes glyphs so it renders the same in the PNG.
const FONT = "'DIN Condensed','Arial Narrow','Roboto Condensed',Arial,sans-serif";
const JP_FONT = "'Hiragino Sans','Noto Sans JP','Yu Gothic',sans-serif";

function AzFlag({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w / 2, s = h / 3, cx = x + w / 2, cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={s} fill={C.azBlue} />
      <rect x={x} y={y + s} width={w} height={s} fill={C.azRed} />
      <rect x={x} y={y + 2 * s} width={w} height={s} fill={C.azGreen} />
      <circle cx={cx - s * 0.1} cy={cy} r={s * 0.4} fill={C.white} />
      <circle cx={cx} cy={cy} r={s * 0.32} fill={C.azRed} />
      <polygon fill={C.white} points={Array.from({ length: 16 }, (_, i) => {
        const r = i % 2 ? s * 0.08 : s * 0.18, a = (Math.PI / 8) * i;
        return `${cx + s * 0.38 + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ")} />
    </g>
  );
}

function EuStars({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g fill={C.star}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI / 6) * i;
        return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={r * 0.16} />;
      })}
    </g>
  );
}

/** Text that always fits its box: tall glyphs, width forced via textLength. */
function Fit({ x, y, w, size, text, color = C.ink, font = FONT, weight = 700 }: { x: number; y: number; w: number; size: number; text: string; color?: string; font?: string; weight?: number }) {
  const natural = [...text].length * size * (font === JP_FONT ? 0.95 : 0.46);
  const len = Math.min(w, natural);
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fontFamily={font} fontWeight={weight} fill={color}
      textLength={len} lengthAdjust="spacingAndGlyphs" filter="url(#emboss)">
      {text}
    </text>
  );
}

function PlateSvg({ country, v, size, chip, label, svgRef }: { country: CountryId; v: Values; size: Size; chip: boolean; label: string; svgRef: React.Ref<SVGSVGElement> }) {
  const def = COUNTRY_BY_ID[country];
  const long = size === "long";
  const W = long ? 520 : 300, H = long ? 112 : 210;
  const hasBand = country === "az" || country === "de" || country === "tr";
  const band = hasBand ? (long ? 50 : 58) : 0;
  const border = country === "jp" ? C.jpGreen : C.ink;
  const ink = country === "jp" ? C.jpGreen : C.ink;
  const top = def.top(v);
  const x0 = 10 + band + (hasBand ? 8 : 6), x1 = W - 16;
  const cx = (x0 + x1) / 2, avail = x1 - x0;
  const rows = def.rows(v);

  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full drop-shadow-2xl">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.white} /><stop offset="0.55" stopColor={C.metal} /><stop offset="1" stopColor={C.edge} />
        </linearGradient>
        <filter id="emboss" x="-5%" y="-10%" width="110%" height="120%">
          <feDropShadow dx="0.8" dy="1.2" stdDeviation="0.5" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <rect x="1.5" y="1.5" width={W - 3} height={H - 3} rx="9" fill="url(#metal)" stroke={border} strokeWidth="3" />
      <rect x="6" y="6" width={W - 12} height={H - 12} rx="6" fill="none" stroke={border} strokeWidth={country === "jp" ? 3 : 2} />

      {/* Left band */}
      {country === "az" && (
        <g>
          <AzFlag x={14} y={long ? 16 : 24} w={band - 8} />
          <text x={10 + band / 2} y={long ? 62 : 82} textAnchor="middle" fontSize={long ? 18 : 22} fontFamily={FONT} fontWeight={700} fill={C.ink}>AZ</text>
          {chip && (
            <g>
              <rect x={10 + band / 2 - 7} y={long ? 76 : 100} width="14" height="10" rx="2" fill="#c9a227" stroke={C.ink} strokeWidth="0.6" />
              <path d={`M${10 + band / 2} ${long ? 76 : 100}v10M${10 + band / 2 - 7} ${long ? 81 : 105}h14`} stroke={C.ink} strokeWidth="0.5" />
            </g>
          )}
          <line x1={10 + band + 3} y1="12" x2={10 + band + 3} y2={H - 12} stroke={C.ink} strokeWidth="1" opacity="0.2" />
        </g>
      )}
      {(country === "de" || country === "tr") && (
        <g>
          <path d={`M10 8h${band}v${H - 16}h-${band}a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z`} fill={C.euBlue} />
          {country === "de" && <EuStars cx={10 + band / 2} cy={long ? 34 : 50} r={long ? 13 : 16} />}
          <text x={10 + band / 2} y={long ? 92 : 170} textAnchor="middle" fontSize={long ? 26 : 30} fontFamily={FONT} fontWeight={700} fill={C.white}>
            {country === "de" ? "D" : "TR"}
          </text>
        </g>
      )}

      {/* Header line (US state, Dubai, Japan region) */}
      {country === "us" && (
        <g>
          <Fit x={W / 2} y={long ? 28 : 34} w={W * 0.6} size={long ? 22 : 26} text={top} color={C.usRed} font="'Brush Script MT',cursive" weight={400} />
          <rect x="14" y={H - 22} width={W - 28} height="10" fill={C.usBlue} opacity="0.9" />
        </g>
      )}
      {country === "ae" && (
        <g>
          <rect x="12" y="12" width={long ? 86 : W - 24} height={long ? H - 24 : 40} rx="4" fill={C.aeRed} />
          <Fit x={long ? 55 : W / 2} y={long ? 64 : 41} w={long ? 70 : 120} size={long ? 24 : 26} text="DUBAI" color={C.white} />
        </g>
      )}

      {/* Main text */}
      {long ? (
        country === "jp" ? (
          <g>
            <Fit x={cx} y={42} w={avail * 0.6} size={28} text={top} color={ink} font={JP_FONT} />
            <Fit x={cx} y={96} w={avail * 0.9} size={54} text={def.main(v)} color={ink} font={JP_FONT} />
          </g>
        ) : country === "ae" ? (
          <Fit x={(110 + x1) / 2} y={84} w={x1 - 116} size={76} text={def.main(v)} />
        ) : country === "us" ? (
          <Fit x={cx} y={84} w={avail * 0.9} size={62} text={def.main(v)} color={C.usBlue} />
        ) : (
          <Fit x={cx} y={86} w={avail} size={80} text={def.main(v)} />
        )
      ) : country === "jp" ? (
        <g>
          <Fit x={cx} y={70} w={avail * 0.7} size={42} text={rows[0]} color={ink} font={JP_FONT} />
          <Fit x={cx} y={170} w={avail * 0.95} size={80} text={rows[1]} color={ink} font={JP_FONT} />
        </g>
      ) : (
        <g>
          <Fit x={cx} y={country === "ae" ? 120 : country === "us" ? 112 : 98} w={avail * 0.95} size={country === "ae" ? 60 : 76} text={rows[0]} color={country === "us" ? C.usBlue : C.ink} />
          <Fit x={cx} y={country === "us" ? 176 : 186} w={avail * 0.95} size={country === "us" ? 60 : 80} text={rows[1]} color={country === "us" ? C.usBlue : C.ink} />
        </g>
      )}
    </svg>
  );
}

function Choice<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
      {options.map(([v, l]) => (
        <Button key={v} type="button" variant="chip" className="h-auto min-h-10 whitespace-normal py-2 text-xs" data-active={value === v} aria-pressed={value === v} onClick={() => onChange(v)}>
          {l}
        </Button>
      ))}
    </div>
  );
}

export function PlateBuilder() {
  const { t } = useT();
  const [country, setCountry] = useState<CountryId>("az");
  const [values, setValues] = useState<Values>(COUNTRY_BY_ID.az.defaults);
  const [size, setSize] = useState<Size>("long");
  const [chip, setChip] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const def = COUNTRY_BY_ID[country];
  const label = t("Qeydiyyat nişanı: {p}", { p: `${def.top(values)} ${def.main(values)}`.trim() });

  const changeCountry = (id: CountryId) => {
    setCountry(id);
    setValues(COUNTRY_BY_ID[id].defaults);
  };

  const download = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const vb = svg.viewBox.baseVal;
    const scale = 4;
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = vb.width * scale;
      canvas.height = vb.height * scale;
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = `avto-az-${country}-${def.main(values).replace(/\s+/g, "-")}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      toast.success(t("Şəkil yükləndi"));
    };
    img.src = url;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
      <div className="surface grid min-h-80 place-items-center bg-grid p-6 sm:p-10">
        <div className={size === "long" ? "w-full max-w-2xl" : "w-full max-w-xs"}>
          <PlateSvg country={country} v={values} size={size} chip={chip} label={label} svgRef={svgRef} />
        </div>
      </div>

      <div className="surface space-y-5 p-5">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("Ölkə / Standart")}</span>
          <Select value={country} onValueChange={(v) => changeCountry(v as CountryId)}>
            <SelectTrigger className="h-10 bg-secondary/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => <SelectItem key={c.id} value={c.id}>{t(c.label)}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${def.fields.length}, minmax(0,1fr))` }}>
          {def.fields.map((fl) => (
            <label key={fl.key} className="block min-w-0">
              <span className="mb-1.5 block truncate text-xs font-medium text-muted-foreground" title={t(fl.label)}>{t(fl.label)}</span>
              <Input value={values[fl.key] ?? ""} placeholder={fl.placeholder} inputMode={fl.kind === "digits" ? "numeric" : "text"}
                className="h-11 bg-secondary/50 px-2 text-center font-mono text-base font-bold uppercase tracking-wider"
                onChange={(e) => setValues((s) => ({ ...s, [fl.key]: clean(fl.kind, fl.max, e.target.value) }))} />
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {t(country === "az" ? "Format: 2 rəqəm — 2 hərf — 3 rəqəm. Yalnız Latın hərfləri (A–Z)." : "Seçilmiş ölkənin formatına uyğun doldurun.")}
        </p>
        <Button variant="glass" className="w-full" onClick={() => setValues(def.random(Math.random))}>
          <Shuffle /> {t("Təsadüfi nömrə yarat")}
        </Button>
        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("Nömrə ölçüsü")}</span>
          <Choice value={size} onChange={setSize} options={[["long", t("Standart uzun (520×110 mm)")], ["square", t("Kvadrat / 2 qat")]]} />
        </div>
        {country === "az" && (
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("Standart")}</span>
            <Choice value={chip ? "chip" : "plain"} onChange={(v) => setChip(v === "chip")} options={[["chip", t("Çipli")], ["plain", t("Çipsiz")]]} />
          </div>
        )}
        <Button variant="hero" size="lg" className="w-full" onClick={download}>
          <Download /> {t("Şəkil kimi yüklə (PNG)")}
        </Button>
      </div>
    </div>
  );
}
