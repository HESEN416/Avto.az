import { useState } from "react";
import { ArrowRight, Compass, Gauge, Timer, Zap, Fuel, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRANDS, BRAND_BY_ID, type BrandId } from "@/data/brands";
import { CARS, CAR_BY_ID, type Car } from "@/data/cars";
import { displacement, years } from "@/lib/catalog";
import { SmartImage } from "./SmartImage";
import { scrollToSection } from "./Header";
import { cn } from "@/lib/utils";

const FEATURED = ["mb-w223", "porsche-992", "bmw-e30", "rr-cullinan", "byd-seal"];

interface Props {
  onOpenCar: (id: string) => void;
  onPickBrand: (brand: BrandId) => void;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <div className="mt-1 font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

export function ShowcaseSection({ onOpenCar, onPickBrand }: Props) {
  const [featuredId, setFeaturedId] = useState(FEATURED[0]);
  const car: Car = CAR_BY_ID[featuredId];
  const brand = BRAND_BY_ID[car.brand];

  return (
    <section id="vitrin" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Left: headline */}
          <div className="animate-rise">
            <p className="eyebrow">Qlobal avtomobil ensiklopediyası</p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl xl:text-6xl">
              Avto.az — <span className="text-gradient">Avtomobili tanı.</span>
              <br />
              Tarixini oxu.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              10 məşhur markanın klassik və yeni nəsil modelləri: real zavod fotoları, mühərrik və
              performans göstəriciləri, ölçülər və hər modelin qısa tarixçəsi — bir yerdə.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" onClick={() => scrollToSection("kataloq")}>
                Kataloqa bax <ArrowRight />
              </Button>
              <Button variant="glass" size="xl" onClick={() => scrollToSection("markalar")}>
                <Compass /> Markaları kəşf et
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
              <div>
                <dt className="text-xs text-muted-foreground">Marka</dt>
                <dd className="font-display text-2xl font-bold">{BRANDS.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Model və nəsil</dt>
                <dd className="font-display text-2xl font-bold">{CARS.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Dövr</dt>
                <dd className="font-display text-2xl font-bold">1965–2025</dd>
              </div>
            </dl>
          </div>

          {/* Right: featured car */}
          <div className="animate-rise [animation-delay:120ms]">
            <div className="surface overflow-hidden">
              <button
                onClick={() => onOpenCar(car.id)}
                className="group relative block aspect-[16/10] w-full overflow-hidden bg-muted"
                aria-label={`${brand.name} ${car.model} ${car.generation} — ətraflı bax`}
              >
                <SmartImage
                  key={car.id}
                  srcs={car.images}
                  alt={`${brand.name} ${car.model} ${car.generation}`}
                  loading="eager"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 animate-in fade-in"
                />
                <div className="absolute inset-0 bg-photo-fade" />
                <span className="absolute left-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider backdrop-blur">
                  Seçilmiş model
                </span>
              </button>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{brand.name}</p>
                    <h2 className="text-2xl font-bold">
                      {car.model} <span className="text-primary">{car.generation}</span>
                    </h2>
                  </div>
                  <Button variant="glass" size="sm" onClick={() => onOpenCar(car.id)}>
                    Ətraflı bax <ArrowRight />
                  </Button>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  <Stat icon={Calendar} label="İstehsal" value={years(car)} />
                  <Stat icon={Zap} label="Güc" value={`${car.hp} a.g.`} />
                  <Stat icon={Timer} label="0–100 km/s" value={`${car.acc} san`} />
                  <Stat icon={Gauge} label="Maks. sürət" value={`${car.vmax} km/s`} />
                  <Stat icon={Fuel} label="Mühərrik" value={displacement(car).split(" · ")[0]} />
                  <Stat icon={Fuel} label="Yanacaq" value={car.fuel} />
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-thin" role="tablist" aria-label="Seçilmiş modellər">
              {FEATURED.map((id) => {
                const c = CAR_BY_ID[id];
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={id === featuredId}
                    onClick={() => setFeaturedId(id)}
                    className={cn(
                      "relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      id === featuredId ? "border-primary" : "border-transparent opacity-60 hover:opacity-100",
                    )}
                    title={`${BRAND_BY_ID[c.brand].name} ${c.model} ${c.generation}`}
                  >
                    <SmartImage srcs={c.images} alt={`${c.model} ${c.generation}`} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brand quick picks */}
        <div id="markalar" className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Markalar</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">10 markanı sürətli seç</h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Markaya kliklədikdə kataloq yalnız həmin markanın modelləri ilə filtrlənir.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {BRANDS.map((b) => {
              const hero = CAR_BY_ID[b.heroCar];
              const count = CARS.filter((c) => c.brand === b.id).length;
              return (
                <button
                  key={b.id}
                  onClick={() => onPickBrand(b.id)}
                  className="group surface relative aspect-[4/3] overflow-hidden text-left transition-all hover:-translate-y-1 hover:border-primary/60"
                >
                  <SmartImage
                    srcs={hero.images}
                    alt={`${b.name} ${hero.model}`}
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-3.5">
                    <span className="font-display text-sm font-bold sm:text-base">{b.name}</span>
                    <span className="mt-0.5 text-[11px] text-muted-foreground">
                      {b.country} · {b.founded}
                    </span>
                    <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                      {count} model <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
