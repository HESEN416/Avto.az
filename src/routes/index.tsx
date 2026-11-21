import { createFileRoute } from "@tanstack/react-router";
import { HomeHero } from "@/components/avto/HomeHero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avto.az — Avtomobili tanı. Tarixini oxu." },
      {
        name: "description",
        content:
          "Mercedes-Benz, BMW, Audi, Volkswagen, Lada, BYD, Porsche, Bentley, Rolls-Royce və Volvo — klassik və yeni nəsillərin texniki göstəriciləri və tarixçəsi.",
      },
      { property: "og:title", content: "Avto.az — Qlobal Avtomobil Ensiklopediyası" },
      { property: "og:description", content: "10 marka, 76 model və nəsil: real fotolar, tam texniki göstəricilər və müqayisə." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeHero,
});
