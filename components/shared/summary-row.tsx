import type { ReactNode } from "react";

type SummaryRowProps = {
  label: string;
  value: ReactNode;
  emphasize?: boolean;
  ltr?: boolean;
};

/** One label/value row inside a summary `<dl>`. */
export function SummaryRow({
  label,
  value,
  emphasize = false,
  ltr = false,
}: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd
        dir={ltr ? "ltr" : undefined}
        className={
          emphasize
            ? "text-[18px] font-bold text-slate-900"
            : "font-bold text-slate-800"
        }
      >
        {value}
      </dd>
    </div>
  );
}
