import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

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

        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          Este documento é um modelo genérico e não constitui aconselhamento
          jurídico. Deve ser revisto por um advogado antes de o site aceitar
          pagamentos reais.
        </div>

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
