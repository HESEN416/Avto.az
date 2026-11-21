import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/avto/Header";
import { AvtoStoreProvider, useAvtoStore } from "@/lib/avto-store";
import { MAX_COMPARE } from "@/lib/catalog";
import { GitCompareArrows } from "lucide-react";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Səhifə tapılmadı</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Axtardığınız səhifə mövcud deyil və ya köçürülüb.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Səhifə yüklənmədi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Xəta baş verdi. Səhifəni yeniləyin və ya ana səhifəyə qayıdın.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Yenidən cəhd et
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ana səhifəyə qayıt
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Avto.az — Avtomobil Ensiklopediyası" },
      { name: "description", content: "Avto.az — markalar, modellər, nəsillər və texniki göstəricilər kataloqu." },
      { name: "author", content: "Avto.az" },
      { name: "theme-color", content: "#0b0f17" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "preconnect", href: "https://upload.wikimedia.org" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="az" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <AvtoStoreProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <CompareFab />
        <Toaster position="bottom-center" />
      </AvtoStoreProvider>
    </QueryClientProvider>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:px-6">
        <span className="font-display font-bold text-foreground">
          Avto<span className="text-primary">.az</span>
        </span>
        <span>Məlumat və texniki ensiklopediya kataloqu. Göstəricilər təxminidir və versiyadan asılı dəyişə bilər.</span>
        <span>Fotolar: Wikimedia Commons</span>
      </div>
    </footer>
  );
}

/** Floating shortcut to the compare page while cars are selected. */
function CompareFab() {
  const { compareIds } = useAvtoStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (compareIds.length === 0 || pathname === "/muqayise") return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 animate-in slide-in-from-bottom-4">
      <Button variant="hero" size="lg" className="rounded-full" asChild>
        <Link to="/muqayise">
          <GitCompareArrows /> Müqayisəyə bax ({compareIds.length}/{MAX_COMPARE})
        </Link>
      </Button>
    </div>
  );
}
