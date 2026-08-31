export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="14" width="24" height="9" rx="2.5" fill="currentColor" opacity="0.35" />
      <rect x="4" y="8" width="20" height="9" rx="2.5" fill="currentColor" opacity="0.65" />
      <rect x="6" y="2" width="16" height="9" rx="2.5" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark className="h-7 w-7 text-accent" />
      <span className="text-lg font-bold tracking-tight">IconStack</span>
    </span>
  );
}
