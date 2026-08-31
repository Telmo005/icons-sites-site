"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { ICON_NAMES, buildStandaloneSvg } from "@/lib/icons";
import { labelOf } from "@/lib/icon-labels";

function download(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function IconCustomizer() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(ICON_NAMES[0]);
  const [color, setColor] = useState("#111827");
  const [size, setSize] = useState(128);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICON_NAMES;
    return ICON_NAMES.filter(
      (name) => name.toLowerCase().includes(q) || labelOf(name).toLowerCase().includes(q)
    );
  }, [query]);

  function downloadSvg() {
    const svg = buildStandaloneSvg(selected, color, size);
    download(`${selected}.svg`, new Blob([svg], { type: "image/svg+xml" }));
  }

  function downloadPng() {
    const svg = buildStandaloneSvg(selected, color, size);
    const svgBlob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) download(`${selected}.png`, blob);
      }, "image/png");
    };
    img.src = url;
  }

  return (
    <div className="grid gap-8 sm:grid-cols-[1fr_320px]">
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar ícone…"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {filtered.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelected(name)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-colors ${
                selected === name
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface hover:bg-border/30"
              }`}
            >
              <Icon name={name} className="h-6 w-6" />
              <span className="truncate text-[10px] text-muted">{labelOf(name)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-6">
        <div
          className="flex h-40 w-40 items-center justify-center rounded-xl border border-border"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          }}
        >
          <Icon
            name={selected}
            style={{ color, width: Math.min(size, 120), height: Math.min(size, 120) }}
          />
        </div>

        <label className="flex w-full flex-col gap-1 text-sm">
          Cor
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border border-border bg-surface"
          />
        </label>

        <label className="flex w-full flex-col gap-1 text-sm">
          Tamanho: {size}px
          <input
            type="range"
            min={16}
            max={512}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>

        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={downloadSvg}
            className="flex-1 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            SVG
          </button>
          <button
            type="button"
            onClick={downloadPng}
            className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-border/40"
          >
            PNG
          </button>
        </div>
      </div>
    </div>
  );
}
