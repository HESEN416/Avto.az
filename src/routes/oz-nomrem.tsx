import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/avto/PageIntro";
import { PlateBuilder } from "@/components/avto/PlateBuilder";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/oz-nomrem")({
  head: () => ({
    meta: [
      { title: "Öz nömrəm — Avto.az" },
      { name: "description", content: "Azərbaycan dövlət qeydiyyat nişanının vizualını yaradın və PNG kimi yükləyin." },
      { property: "og:title", content: "Öz nömrəni yarat — Avto.az" },
      { property: "og:description", content: "İnteraktiv Azərbaycan avtomobil nömrəsi konstruktoru." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlatePage,
});

function PlatePage() {
  const { t } = useT();
  return (
    <>
      <PageIntro eyebrow={t("İnteraktiv alət")} title={t("Öz nömrəni yarat")}>
        {t("Azərbaycan dövlət qeydiyyat nişanının vizualını yaradın və şəkil kimi yükləyin. Yalnız əyləncə və vizual məqsədlidir.")}
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <PlateBuilder />
      </div>
    </>
  );
}
