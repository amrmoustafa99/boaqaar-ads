import type { ReactNode } from "react";

/** Small grey chip: icon, bold value, muted label (package validity etc.). */
export function MetaChip({
  icon,
  value,
  label,
  roomy = false,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  roomy?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-2 rounded-2xl bg-[#f7f8f9] ${
        roomy ? "px-4 py-3" : "px-2.5 py-2"
      }`}
    >
      {icon}
      <span className="text-right">
        <span
          className={`block font-bold text-slate-800 ${roomy ? "text-[15px]" : "text-[13px]"}`}
        >
          {value}
        </span>
        <span className={`block text-slate-500 ${roomy ? "text-[12px]" : "text-[11px]"}`}>
          {label}
        </span>
      </span>
    </span>
  );
}
