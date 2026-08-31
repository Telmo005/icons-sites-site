import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { LEGAL_ENTITY } from "@/lib/site-config";

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted">Última atualização: {updatedAt}</p>
        <p className="mt-1 text-sm text-muted">
          {LEGAL_ENTITY.name} · NUIT {LEGAL_ENTITY.taxId} · {LEGAL_ENTITY.address}
        </p>

        <div
          className="mt-8 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold
          [&_p]:mt-3 [&_p]:text-muted
          [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted
          [&_li]:mt-1"
        >
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
