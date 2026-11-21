import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { CarDetail } from "@/components/avto/CarDetail";
import { Button } from "@/components/ui/button";
import { BRAND_BY_ID } from "@/data/brands";
import { CAR_BY_ID } from "@/data/cars";

export const Route = createFileRoute("/avtomobil/$id")({
  loader: ({ params }) => {
    const car = CAR_BY_ID[params.id];
    if (!car) throw notFound();
    return { id: car.id };
  },
  head: ({ loaderData }) => {
    const car = loaderData ? CAR_BY_ID[loaderData.id] : undefined;
    if (!car) return { meta: [{ title: "Avtomobil tapılmadı — Avto.az" }, { name: "robots", content: "noindex" }] };
    const name = `${BRAND_BY_ID[car.brand].name} ${car.model} ${car.generation}`;
    const desc = `${name} (${car.from}–${car.to ?? "hazırda"}): ${car.hp} a.g., 0–100 km/saat ${car.acc} san, foto qalereya və tarixçə.`;
    return {
      meta: [
        { title: `${name} — Avto.az` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — Avto.az` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: car.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: car.cover },
      ],
    };
  },
  component: CarPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Avtomobil tapılmadı</h1>
      <p className="mt-2 text-sm text-muted-foreground">Bu model kataloqda mövcud deyil.</p>
      <Button variant="hero" className="mt-6" asChild>
        <Link to="/kataloq">Kataloqa qayıt</Link>
      </Button>
    </div>
  ),
});

function CarPage() {
  const { id } = Route.useLoaderData();
  return <CarDetail car={CAR_BY_ID[id]} />;
}
