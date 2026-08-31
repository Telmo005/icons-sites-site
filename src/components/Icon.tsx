import { ICONS } from "@/lib/icons";

/** Renders one icon from the catalog inline (no network request). The shape
 * markup comes from our own generated, trusted source files — never pass
 * user-supplied names/content here. */
export function Icon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const shapes = ICONS[name];
  if (!shapes) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: shapes }}
    />
  );
}
