import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IconsCatalog } from "@/components/IconsCatalog";
import { ICON_NAMES } from "@/lib/icons";
import { getSignedInUserEmail } from "@/lib/auth";

export const metadata = {
  title: "Catálogo de ícones",
  description: "Pesquise e filtre centenas de ícones vetoriais por nome ou categoria.",
};

export default async function IconesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={userEmail} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Catálogo de ícones</h1>
        <p className="mt-2 text-muted">
          Pesquise e filtre todo o catálogo. Clique num ícone para ver detalhes.
        </p>
        <div className="mt-10">
          <IconsCatalog iconNames={ICON_NAMES} initialQuery={params.q ?? ""} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
