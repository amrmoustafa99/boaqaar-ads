import { ChevronIcon } from "@/components/highlight/icons";

type SelectedBarProps = {
  /** Small muted line, e.g. "الباقة المختارة". */
  label: string;
  /** Bold line under the label, e.g. "Premium". */
  value: string;
  /** Render `value` left-to-right (Latin names). */
  valueLtr?: boolean;
  /** Text inside the grey pill, e.g. "86.000 د.ك". */
  amount: string;
  onClick: () => void;
  ariaLabel?: string;
};

/**
 * The collapsed bottom bar: chevron + label/value on one side, the amount
 * pill on the other. Callers place it (fixed wrapper on mobile, aside on desktop).
 */
export function SelectedBar({
  label,
  value,
  valueLtr = false,
  amount,
  onClick,
  ariaLabel,
}: SelectedBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-[22px] border border-line bg-white px-3 py-3 text-right shadow-[0_8px_28px_rgba(15,23,42,0.12)]"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f3f4f6] text-slate-700">
          <ChevronIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[12px] text-slate-500">{label}</span>
          <span
            dir={valueLtr ? "ltr" : undefined}
            className="block text-[16px] font-bold text-slate-900"
          >
            {value}
          </span>
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-[#f3f4f6] px-4 py-2 text-[15px] font-bold text-slate-800">
        {amount}
      </span>
    </button>
  );
}
