import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { GitCompareArrows } from "lucide-react";
import { Header, scrollToSection } from "@/components/avto/Header";
import { ShowcaseSection } from "@/components/avto/ShowcaseSection";
import { CatalogSection } from "@/components/avto/CatalogSection";
import { CarModal } from "@/components/avto/CarModal";
import { Button } from "@/components/ui/button";
import { CAR_BY_ID } from "@/data/cars";
import { EMPTY_FILTERS, MAX_COMPARE, toggleCompare, updateFilters, type Filters } from "@/lib/catalog";
import type { BrandId } from "@/data/brands";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avto.az — Avtomobili tanı. Tarixini oxu." },
      {
        name: "description",
        content:
          "Mercedes-Benz, BMW, Audi, Volkswagen, Lada, BYD, Porsche, Bentley, Rolls-Royce və Volvo — klassik və yeni nəsillərin texniki göstəriciləri, tarixçəsi və müqayisəsi.",
      },
      { property: "og:title", content: "Avto.az — Qlobal Avtomobil Ensiklopediyası" },
      {
        property: "og:description",
        content: "10 marka, 76 model və nəsil: real fotolar, tam texniki göstəricilər və yan-yana müqayisə.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggleCompare = (id: string) => {
    const { ids, rejected } = toggleCompare(compareIds, id);
    if (rejected) {
      toast.error(`Maksimum ${MAX_COMPARE} avtomobil müqayisə etmək olar`, {
        description: "Yenisini əlavə etmək üçün birini çıxarın.",
      });
      return;
    }
    setCompareIds(ids);
  };

  const pickBrand = (brand: BrandId) => {
    setFilters(updateFilters(EMPTY_FILTERS, { brand }));
    scrollToSection("kataloq");
  };

  return (
    <div className="min-h-screen">
      <Header compareCount={compareIds.length} />
      <main>
        <ShowcaseSection onOpenCar={setOpenId} onPickBrand={pickBrand} />
        <CatalogSection
          filters={filters}
          onFiltersChange={(patch) => setFilters((f) => updateFilters(f, patch))}
          onResetFilters={() => setFilters(EMPTY_FILTERS)}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onClearCompare={() => setCompareIds([])}
          onOpenCar={setOpenId}
        />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:px-6">
          <span className="font-display font-bold text-foreground">
            Avto<span className="text-primary">.az</span>
          </span>
          <span>Məlumat və texniki ensiklopediya kataloqu. Göstəricilər təxminidir və versiyadan asılı dəyişə bilər.</span>
          <span>Fotolar: Wikimedia Commons</span>
        </div>
      </footer>

      {compareIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 animate-in slide-in-from-bottom-4">
          <Button variant="hero" size="lg" className="rounded-full" onClick={() => scrollToSection("muqayise")}>
            <GitCompareArrows /> Müqayisəyə bax ({compareIds.length}/{MAX_COMPARE})
          </Button>
        </div>
      )}

      <CarModal
        car={openId ? CAR_BY_ID[openId] : null}
        compared={!!openId && compareIds.includes(openId)}
        onClose={() => setOpenId(null)}
        onToggleCompare={() => openId && handleToggleCompare(openId)}
      />
    </div>
  );
}
