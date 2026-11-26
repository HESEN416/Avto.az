import { createFileRoute } from "@tanstack/react-router";
import { BrandGrid } from "@/components/avto/BrandGrid";
import { PageIntro } from "@/components/avto/PageIntro";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/markalar")({
  head: () => ({
    meta: [
      { title: "Markalar — Avto.az" },
      { name: "description", content: "Mercedes-Benz, BMW, Audi, Volkswagen, Lada, BYD, Porsche, Bentley, Rolls-Royce və Volvo markaları." },
      { property: "og:title", content: "10 avtomobil markası — Avto.az" },
      { property: "og:description", content: "Markanı seçin və onun klassik və yeni nəsil modellərini kəşf edin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const { t } = useT();
  return (
    <>
      <PageIntro eyebrow={t("Markalar")} title={t("10 markanı kəşf et")}>
        {t("Markaya kliklədikdə kataloq yalnız həmin markanın modelləri ilə açılır.")}
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <BrandGrid />
      </div>
    </>
  );
}
