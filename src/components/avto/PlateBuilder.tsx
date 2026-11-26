import { forwardRef, useRef, useState } from "react";
import { Download, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanNumber, cleanRegion, cleanSeries, plateText, randomPlate, type Plate } from "@/lib/plate";
import { useT } from "@/lib/i18n";

type Size = "long" | "square";

// Real-world plate artwork colours (physical object, not UI theme).
const INK = "#111111";
const PLATE = "#f4f5f7";
const AZ_BLUE = "#00b5e2";
const AZ_RED = "#ef3340";
const AZ_GREEN = "#509e2f";
const FONT = "'Arial Black', 'Arial', sans-serif";

function Flag({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w / 2;
  const s = h / 3;
  return (
    <g>
      <rect x={x} y={y} width={w} height={s} fill={AZ_BLUE} />
      <rect x={x} y={y + s} width={w} height={s} fill={AZ_RED} />
      <rect x={x} y={y + 2 * s} width={w} height={s} fill={AZ_GREEN} />
      <circle cx={x + w / 2 - s * 0.08} cy={y + h / 2} r={s * 0.38} fill="#fff" />
      <circle cx={x + w / 2 + s * 0.02} cy={y + h / 2} r={s * 0.31} fill={AZ_RED} />
      <polygon
        fill="#fff"
        points={Array.from({ length: 16 }, (_, i) => {
          const r = i % 2 ? s * 0.09 : s * 0.2;
          const a = (Math.PI / 8) * i;
          return `${x + w / 2 + s * 0.33 + r * Math.cos(a)},${y + h / 2 + r * Math.sin(a)}`;
        }).join(" ")}
      />
    </g>
  );
}

const PlateSvg = forwardRef<SVGSVGElement, { plate: Plate; size: Size; chip: boolean; label: string }>(
  ({ plate, size, chip, label }, ref) => {
    const p = plateText(plate);
    const long = size === "long";
    const W = long ? 520 : 280;
    const H = long ? 110 : 200;
    const band = long ? 46 : 52;
    const text = { fill: INK, fontFamily: FONT, fontWeight: 900, filter: "url(#emboss)" } as const;
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full drop-shadow-2xl">
        <defs>
          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor={PLATE} />
            <stop offset="1" stopColor="#d9dce1" />
          </linearGradient>
          <filter id="emboss" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1.2" dy="1.6" stdDeviation="0.6" floodColor="#000" floodOpacity="0.45" />
            <feDropShadow dx="-0.6" dy="-0.6" stdDeviation="0.3" floodColor="#fff" floodOpacity="0.9" />
          </filter>
        </defs>
        <rect x="1.5" y="1.5" width={W - 3} height={H - 3} rx="10" fill="url(#metal)" stroke={INK} strokeWidth="3" />
        <rect x="7" y="7" width={W - 14} height={H - 14} rx="6" fill="none" stroke={INK} strokeWidth="3" />
        {/* left band: flag + AZ (+ chip) */}
        <Flag x={12} y={long ? 16 : 22} w={band - 10} />
        <text x={12 + (band - 10) / 2} y={long ? 70 : 82} textAnchor="middle" fontSize={long ? 20 : 22} {...text}>AZ</text>
        {chip && (
          <g>
            <rect x={14} y={long ? 78 : 100} width={band - 14} height={long ? 18 : 22} rx="3" fill="#c9a227" stroke={INK} strokeWidth="1" />
            <path d={`M${14 + (band - 14) / 2} ${long ? 78 : 100}v${long ? 18 : 22}M14 ${long ? 87 : 111}h${band - 14}`} stroke={INK} strokeWidth="0.8" />
          </g>
        )}
        <line x1={band + 8} y1="10" x2={band + 8} y2={H - 10} stroke={INK} strokeWidth="1.5" opacity="0.25" />
        {long ? (
          <text x={(W + band + 8) / 2} y="80" textAnchor="middle" fontSize="66" letterSpacing="4" {...text}>
            {p.region} - {p.series} - {p.number}
          </text>
        ) : (
          <>
            <text x={(W + band + 8) / 2} y="92" textAnchor="middle" fontSize="70" letterSpacing="4" {...text}>
              {p.region}-{p.series}
            </text>
            <text x={(W + band + 8) / 2} y="176" textAnchor="middle" fontSize="76" letterSpacing="8" {...text}>
              {p.number}
            </text>
          </>
        )}
      </svg>
    );
  },
);
PlateSvg.displayName = "PlateSvg";

function Choice<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
      {options.map(([v, l]) => (
        <Button key={v} type="button" variant="chip" className="h-10" data-active={value === v} aria-pressed={value === v} onClick={() => onChange(v)}>
          {l}
        </Button>
      ))}
    </div>
  );
}

export function PlateBuilder() {
  const { t } = useT();
  const [plate, setPlate] = useState<Plate>({ region: "10", series: "AZ", number: "777" });
  const [size, setSize] = useState<Size>("long");
  const [chip, setChip] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const p = plateText(plate);
  const label = t("Azərbaycan dövlət qeydiyyat nişanı: {p}", { p: `${p.region}-${p.series}-${p.number}` });

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
      a.download = `avto-az-${p.region}-${p.series}-${p.number}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      toast.success(t("Şəkil yükləndi"));
    };
    img.src = url;
  };

  const field = "h-11 bg-secondary/50 text-center font-mono text-lg font-bold uppercase tracking-widest";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
      <div className="surface grid min-h-80 place-items-center bg-grid p-6 sm:p-10">
        <div className={size === "long" ? "w-full max-w-2xl" : "w-full max-w-xs"}>
          <PlateSvg ref={svgRef} plate={plate} size={size} chip={chip} label={label} />
        </div>
      </div>

      <div className="surface space-y-5 p-5">
        <div className="grid grid-cols-[1fr_1fr_1.3fr] gap-2">
          {([
            ["region", t("Bölgə kodu"), cleanRegion, "10"],
            ["series", t("Seriya hərfləri"), cleanSeries, "AA"],
            ["number", t("Nömrə"), cleanNumber, "001"],
          ] as const).map(([k, l, clean, ph]) => (
            <label key={k} className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{l}</span>
              <Input value={plate[k]} placeholder={ph} inputMode={k === "series" ? "text" : "numeric"} className={field}
                onChange={(e) => setPlate((s) => ({ ...s, [k]: clean(e.target.value) }))} />
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{t("Format: 2 rəqəm — 2 hərf — 3 rəqəm. Yalnız Latın hərfləri (A–Z).")}</p>
        <Button variant="glass" className="w-full" onClick={() => setPlate(randomPlate())}>
          <Shuffle /> {t("Təsadüfi nömrə yarat")}
        </Button>
        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("Nömrə ölçüsü")}</span>
          <Choice value={size} onChange={setSize} options={[["long", t("Standart uzun (520×110 mm)")], ["square", t("Kvadrat / 2 qat")]]} />
        </div>
        <div>
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("Standart")}</span>
          <Choice value={chip ? "chip" : "plain"} onChange={(v) => setChip(v === "chip")} options={[["chip", t("Çipli")], ["plain", t("Çipsiz")]]} />
        </div>
        <Button variant="hero" size="lg" className="w-full" onClick={download}>
          <Download /> {t("Şəkil kimi yüklə (PNG)")}
        </Button>
      </div>
    </div>
  );
}
