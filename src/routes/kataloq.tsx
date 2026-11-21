import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarCard } from "@/components/avto/CarCard";
import { FilterBar } from "@/components/avto/FilterBar";
import { PageIntro } from "@/components/avto/PageIntro";
import { CARS, type Car } from "@/data/cars";
import { filterCars } from "@/lib/catalog";
import { useAvtoStore, type Sort } from "@/lib/avto-store";

export const Route = createFileRoute("/kataloq")({
  head: () => ({
    meta: [
      { title: "Kataloq — Avto.az" },
      { name: "description", content: "Marka, model, nəsil, ban növü, yanacaq və at gücünə görə avtomobil kataloqu." },
      { property: "og:title", content: "Avtomobil kataloqu — Avto.az" },
      { property: "og:description", content: "76 model və nəslin texniki göstəriciləri bir kataloqda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

const SORTS: Record<Sort, { label: string; fn: (a: Car, b: Car) => number }> = {
  brand: { label: "Marka üzrə", fn: () => 0 },
  newest: { label: "Ən yeni", fn: (a, b) => b.from - a.from },
  oldest: { label: "Ən köhnə", fn: (a, b) => a.from - b.from },
  power: { label: "Ən güclü", fn: (a, b) => b.hp - a.hp },
  accel: { label: "Ən sürətli (0–100)", fn: (a, b) => a.acc - b.acc },
};
const PAGE = 16;

function CatalogPage() {
  const { filters, setFilters, resetFilters, sort, setSort, compareIds, toggle } = useAvtoStore();
  const [limit, setLimit] = useState(PAGE);
  const results = useMemo(() => [...filterCars(CARS, filters)].sort(SORTS[sort].fn), [filters, sort]);
  const visible = results.slice(0, limit);

  return (
    <>
      <PageIntro eyebrow="Kataloq" title="Texniki kataloq">
        Klassik və yeni nəsil modelləri filtrləyin, karta klikləyərək tam məlumat səhifəsini açın.
      </PageIntro>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <FilterBar
          filters={filters}
          onChange={(patch) => {
            setLimit(PAGE);
            setFilters(patch);
          }}
          onReset={() => resetFilters()}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length}</span> nəticə
          </span>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-9 w-52 bg-secondary/50" aria-label="Sıralama">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORTS).map(([k, s]) => (
                <SelectItem key={k} value={k}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {results.length === 0 ? (
          <div className="surface mt-5 flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground" />
            <p className="font-display font-bold">Uyğun avtomobil tapılmadı</p>
            <p className="text-sm text-muted-foreground">Filtrləri genişləndirin və ya sıfırlayın.</p>
            <Button variant="glass" onClick={() => resetFilters()}>
              Filtrləri sıfırla
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((car) => (
                <CarCard key={car.id} car={car} compared={compareIds.includes(car.id)} onToggleCompare={() => toggle(car.id)} />
              ))}
            </div>
            {results.length > limit && (
              <div className="mt-8 text-center">
                <Button variant="glass" size="lg" onClick={() => setLimit((l) => l + PAGE)}>
                  Daha çox göstər ({results.length - limit})
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
