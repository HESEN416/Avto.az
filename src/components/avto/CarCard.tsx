import { Check, Fuel, Gauge, GitCompareArrows, Timer, Zap, Cog } from "lucide-react";
import { BRAND_BY_ID } from "@/data/brands";
import type { Car } from "@/data/cars";
import { consumption, years } from "@/lib/catalog";
import { SmartImage } from "./SmartImage";
import { cn } from "@/lib/utils";

interface Props {
  car: Car;
  compared: boolean;
  onOpen: () => void;
  onToggleCompare: () => void;
}

export function CarCard({ car, compared, onOpen, onToggleCompare }: Props) {
  const brand = BRAND_BY_ID[car.brand];
  const specs = [
    { icon: Cog, label: "Mühərrik", value: car.cc ? `${(car.cc / 1000).toFixed(1)} L` : "Elektrik" },
    { icon: Zap, label: "Güc", value: `${car.hp} a.g.` },
    { icon: Timer, label: "0–100", value: `${car.acc} san` },
    { icon: Fuel, label: "Sərfiyyat", value: consumption(car).replace("/100km", "") },
    { icon: Gauge, label: "Maks.", value: `${car.vmax} km/s` },
  ];

  return (
    <article
      className={cn(
        "group surface flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50",
        compared && "border-primary/70 ring-1 ring-primary/40",
      )}
    >
      <button onClick={onOpen} className="relative block aspect-[16/10] overflow-hidden bg-muted" aria-label={`${brand.name} ${car.model} ${car.generation} — ətraflı bax`}>
        <SmartImage
          srcs={car.images}
          alt={`${brand.name} ${car.model} ${car.generation}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-photo-fade" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-background/80 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
            {car.era === "klassik" ? "Klassik" : "Yeni nəsil"}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur",
              car.fuel === "Elektrik" ? "bg-success/20 text-success" : car.fuel === "Hibrid" ? "bg-warning/20 text-warning" : "bg-background/80",
            )}
          >
            {car.fuel}
          </span>
        </div>
        <span className="absolute bottom-3 right-3 rounded-md bg-background/80 px-2 py-0.5 font-mono text-[11px] backdrop-blur">
          {car.images.length} foto
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <button onClick={onOpen} className="text-left">
          <p className="text-xs font-medium text-muted-foreground">{brand.name}</p>
          <h3 className="mt-0.5 text-base font-bold leading-tight">
            {car.model} <span className="text-primary">{car.generation}</span>
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {years(car)} · {car.trim} · {car.body}
          </p>
        </button>

        <dl className="mt-4 grid grid-cols-5 gap-1 border-t border-border pt-3">
          {specs.map((s) => (
            <div key={s.label} className="min-w-0 text-center">
              <s.icon className="mx-auto h-3.5 w-3.5 text-primary" />
              <dd className="mt-1 truncate font-mono text-[11px] font-semibold">{s.value}</dd>
              <dt className="truncate text-[10px] text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>

        <button
          onClick={onToggleCompare}
          aria-pressed={compared}
          className={cn(
            "mt-4 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            compared
              ? "border-primary bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground",
          )}
        >
          {compared ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
          {compared ? "Müqayisədədir" : "Müqayisə et"}
        </button>
      </div>
    </article>
  );
}
