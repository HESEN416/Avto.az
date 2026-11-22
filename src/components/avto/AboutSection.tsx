import { Link, useNavigate } from "@tanstack/react-router";
import { Archive, BookOpenCheck, Gauge } from "lucide-react";
import { BRAND_BY_ID, type BrandId } from "@/data/brands";
import type { Era } from "@/data/cars";
import { useAvtoStore } from "@/lib/avto-store";
import { cn } from "@/lib/utils";

type Item =
  | { kind: "route"; label: string; to: "/kataloq" | "/markalar" | "/muqayise" }
  | { kind: "anchor"; label: string; href: string }
  | { kind: "brand"; label: string; brand: BrandId }
  | { kind: "era"; label: string; era: Era }
  | { kind: "text"; label: string };

const COLUMNS: { title: string; items: Item[] }[] = [
  {
    title: "LAYİHƏ",
    items: [
      { kind: "anchor", label: "Haqqımızda", href: "#haqqimizda" },
      { kind: "anchor", label: "Məqsədimiz", href: "#meqsedimiz" },
      { kind: "route", label: "Kataloq", to: "/kataloq" },
      { kind: "route", label: "Müqayisə", to: "/muqayise" },
    ],
  },
  {
    title: "MARKALAR",
    items: (["mercedes", "bmw", "audi", "porsche", "byd"] as BrandId[]).map((b) => ({
      kind: "brand" as const,
      brand: b,
      label: BRAND_BY_ID[b].name,
    })),
  },
  {
    title: "BÖLMƏLƏR",
    items: [
      { kind: "era", label: "Klassik modellər", era: "klassik" },
      { kind: "era", label: "Yeni nəsillər", era: "yeni" },
      { kind: "route", label: "Texniki göstəricilər", to: "/kataloq" },
      { kind: "route", label: "Foto qalereya", to: "/markalar" },
    ],
  },
  {
    title: "QAYDALAR",
    items: [
      { kind: "text", label: "Məlumat məqsədi" },
      { kind: "text", label: "Məxfilik" },
      { kind: "text", label: "İstifadə şərtləri" },
      { kind: "text", label: "Əlaqə" },
    ],
  },
];

const ICONS = [
  { icon: Gauge, label: "Dəqiq zavod göstəriciləri" },
  { icon: Archive, label: "Klassik və müasir arxiv" },
  { icon: BookOpenCheck, label: "100% məlumat yönümlü" },
];

const ITEM_CLS = "text-sm text-muted-foreground transition-colors hover:text-primary";

function CatalogItem({ item }: { item: Item }) {
  const { resetFilters } = useAvtoStore();
  const navigate = useNavigate();

  const openCatalog = (patch: { brand?: BrandId; era?: Era }) => {
    resetFilters(patch);
    navigate({ to: "/kataloq" });
  };

  if (item.kind === "route") {
    return (
      <Link to={item.to} className={ITEM_CLS}>
        {item.label}
      </Link>
    );
  }

  if (item.kind === "anchor") {
    return (
      <a href={item.href} className={ITEM_CLS}>
        {item.label}
      </a>
    );
  }

  if (item.kind === "brand") {
    return (
      <button type="button" onClick={() => openCatalog({ brand: item.brand })} className={cn(ITEM_CLS, "text-left")}>
        {item.label}
      </button>
    );
  }

  if (item.kind === "era") {
    return (
      <button type="button" onClick={() => openCatalog({ era: item.era })} className={cn(ITEM_CLS, "text-left")}>
        {item.label}
      </button>
    );
  }

  return <span className={ITEM_CLS}>{item.label}</span>;
}

/** Home page only: dark, logo-free, four-column info block under the hero. */
export function AboutSection() {
  return (
    <section id="haqqimizda" className="dark scroll-mt-20 border-t border-border bg-about text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] lg:gap-14">
          <div id="meqsedimiz" className="scroll-mt-24">
            <p className="eyebrow">Haqqımızda</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Avto.az haqqında</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Avto.az — klassik və müasir avtomobil modellərinin texniki göstəricilərini, nəsillərini və zavod foto
              arxivini bir araya gətirən məlumat kataloqudur.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {ICONS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  role="img"
                  aria-label={label}
                  title={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-about-panel text-primary ring-1 ring-border"
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[11px] font-semibold tracking-[0.18em] text-primary">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <CatalogItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
