import {
  HIGHLIGHT_DURATION_NOTE,
  MAX_HIGHLIGHT_DAYS,
  MIN_HIGHLIGHT_DAYS,
  highlightDayUnit,
} from "@/lib/highlight";
import { MinusIcon, PlusIcon } from "./icons";

type DurationSelectorProps = {
  days: number;
  onChange: (days: number) => void;
};

export function DurationSelector({ days, onChange }: DurationSelectorProps) {
  const atMin = days <= MIN_HIGHLIGHT_DAYS;
  const atMax = days >= MAX_HIGHLIGHT_DAYS;
  const unit = highlightDayUnit(days);

  return (
    <section aria-labelledby="duration-heading">
      <h2
        id="duration-heading"
        className="mb-1.5 text-[14px] font-semibold text-slate-600"
      >
        مدة التمييز
      </h2>
      <div className="rounded-[18px] border border-line bg-white px-4 py-3 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
        <div dir="ltr" className="flex items-center justify-center gap-8">
          <button
            type="button"
            aria-label="إنقاص المدة"
            disabled={atMin}
            onClick={() => onChange(Math.max(MIN_HIGHLIGHT_DAYS, days - 1))}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#eef2f3] text-slate-400 transition hover:bg-[#e6ebec] active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <MinusIcon className="h-5 w-5" />
          </button>

          <p
            dir="rtl"
            aria-live="polite"
            className="flex min-w-16 items-center justify-center gap-1.5 text-slate-800"
          >
            <span className="text-[26px] font-bold leading-none tabular-nums">
              {days}
            </span>
            <span className="text-[15px] font-medium text-slate-500">
              {unit}
            </span>
          </p>

          <button
            type="button"
            aria-label="زيادة المدة"
            disabled={atMax}
            onClick={() => onChange(Math.min(MAX_HIGHLIGHT_DAYS, days + 1))}
            className="grid h-11 w-11 place-items-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-[12px] leading-5 text-slate-500">
          {HIGHLIGHT_DURATION_NOTE}
        </p>
      </div>
    </section>
  );
}
