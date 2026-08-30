const tiles: { rotate: string; accent?: boolean; path: React.ReactNode }[] = [
  {
    rotate: "-rotate-6",
    path: (
      <polygon points="12 2 14.9 8.6 22 9.3 16.5 14 18.2 21 12 17.3 5.8 21 7.5 14 2 9.3 9.1 8.6" />
    ),
  },
  {
    rotate: "rotate-3",
    accent: true,
    path: <polygon points="13 3 4 14 12 14 11 21 20 10 12 10" />,
  },
  {
    rotate: "rotate-6",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="8 12 11 15 16 9" />
      </>
    ),
  },
  {
    rotate: "-rotate-3",
    path: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    rotate: "rotate-6",
    accent: true,
    path: <polygon points="8 5 19 12 8 19" />,
  },
  {
    rotate: "-rotate-6",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

/** Purely decorative — a scattered cluster of generic icon glyphs standing in
 * for the real product until real pack artwork is uploaded. */
export function HeroIconCluster() {
  return (
    <div className="hidden flex-wrap items-center justify-center gap-4 sm:flex">
      {tiles.map((tile, i) => (
        <div
          key={i}
          className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface shadow-lg transition-transform hover:rotate-0 hover:scale-105 ${tile.rotate} ${
            tile.accent ? "text-accent" : "text-foreground"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            {tile.path}
          </svg>
        </div>
      ))}
    </div>
  );
}
