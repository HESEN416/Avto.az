import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { BRANDS } from "@/data/brands";
import { CARS, CAR_BY_ID } from "@/data/cars";
import { useAvtoStore } from "@/lib/avto-store";
import { SmartImage } from "./SmartImage";

/** Brand cards; picking one opens the catalog filtered to that brand. */
export function BrandGrid() {
  const { resetFilters } = useAvtoStore();
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {BRANDS.map((b) => {
        const hero = CAR_BY_ID[b.heroCar];
        const cars = CARS.filter((c) => c.brand === b.id);
        const models = new Set(cars.map((c) => c.model)).size;
        const span = `${Math.min(...cars.map((c) => c.from))}–${cars.some((c) => !c.to) ? "hazırda" : Math.max(...cars.map((c) => c.to ?? 0))}`;
        return (
          <button
            key={b.id}
            onClick={() => {
              resetFilters({ brand: b.id });
              navigate({ to: "/kataloq" });
            }}
            className="group surface relative aspect-[4/5] overflow-hidden text-left transition-all hover:-translate-y-1 hover:border-primary/60"
          >
            <SmartImage
              srcs={hero.images}
              alt={`${b.name} ${hero.model} ${hero.generation}`}
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-all duration-500 group-hover:scale-110 group-hover:opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-4">
              <span className="font-display text-lg font-bold">{b.name}</span>
              <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {b.hq}, {b.country} · {b.founded}
              </span>
              <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                {models} model · {cars.length} nəsil · {span}
              </span>
              <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 font-mono text-[11px] font-semibold text-primary">
                Kataloqda bax <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
