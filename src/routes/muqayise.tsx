import { createFileRoute } from "@tanstack/react-router";
import { ComparePanel } from "@/components/avto/ComparePanel";
import { PageIntro } from "@/components/avto/PageIntro";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/muqayise")({
  head: () => ({
    meta: [
      { title: "Müqayisə — Avto.az" },
      { name: "description", content: "2–4 avtomobilin texniki göstəricilərini yan-yana müqayisə edin." },
      { property: "og:title", content: "Yan-yana müqayisə — Avto.az" },
      { property: "og:description", content: "Güc, sürətlənmə, sərfiyyat, ölçülər və daha çoxunu yan-yana müqayisə edin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { t } = useT();
  return (
    <>
      <PageIntro eyebrow={t("Müqayisə aləti")} title={t("Yan-yana müqayisə")} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <ComparePanel />
      </div>
    </>
  );
}
