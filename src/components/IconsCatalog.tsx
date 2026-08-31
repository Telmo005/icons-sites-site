"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CATEGORIES, categoryOf } from "@/lib/icon-categories";
import { labelOf } from "@/lib/icon-labels";
import { ESSENCIAL_ICON_NAMES, iconPacks } from "@/lib/products";

const CATEGORY_NAMES = ["Todas", ...Object.keys(CATEGORIES)];

export function IconsCatalog({
  iconNames,
  initialQuery = "",
}: {
  iconNames: string[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("Todas");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return iconNames.filter((name) => {
      const matchesQuery = !q || name.toLowerCase().includes(q) || labelOf(name).toLowerCase().includes(q);
      const matchesCategory = category === "Todas" || categoryOf(name) === category;
      return matchesQuery && matchesCategory;
    });
  }, [iconNames, query, category]);

  const selectedPacks = selected
    ? iconPacks.filter((pack) =>
        pack.id === "icons-essencial" ? ESSENCIAL_ICON_NAMES.includes(selected) : true
      )
    : [];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar (ex: coração, casa, seta…)"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-9 text-sm focus:border-accent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar pesquisa"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_NAMES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">{filtered.length} ícones</p>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {filtered.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setSelected(name)}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-lg"
          >
            <Icon name={name} className="h-8 w-8" />
            <span className="truncate text-xs text-muted">{labelOf(name)}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-border">
              <Icon name={selected} className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{labelOf(selected)}</h3>
            <p className="mt-1 text-sm text-muted">Categoria: {categoryOf(selected)}</p>
            <p className="mt-4 text-sm text-muted">
              Incluído em: {selectedPacks.map((p) => p.name).join(", ")}
            </p>
            <Link
              href="/#icones"
              onClick={() => setSelected(null)}
              className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Ver pacotes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
