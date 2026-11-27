<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Catalog filters, sort and the compare list live in `AvtoStoreProvider` (src/lib/avto-store.tsx) mounted in `__root`, so they survive navigation between pages; compare ids persist in localStorage.
- Car data is static (src/data/cars.ts + car-images.json from Wikimedia Commons); every photo renders through `SmartImage`, which falls back through other photos to /images/fallback-car.jpg.
- Pure catalog rules (filtering, dependent selects, compare limit) live in src/lib/catalog.ts and are covered by src/test/catalog.test.ts.
- UI text goes through `useT()` from src/lib/i18n.tsx (keys are the AZ source strings; `tv()` localizes generated tech values/units) so every page switches AZ/EN/RU without reload.
- Plate formats per country live in src/lib/plate.ts (pure, tested in src/test/plate.test.ts); PlateBuilder renders SVG and exports PNG via canvas, so plate text uses system fonts + textLength.
