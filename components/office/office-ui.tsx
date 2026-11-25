import type { ReactNode } from "react";
import { MinusIcon, PlusIcon } from "@/components/highlight/icons";

export type StatCell = {
  icon: ReactNode;
  value: string;
  label: string;
  /** Render the value left-to-right (dates, phone numbers). */
  ltr?: boolean;
  tone?: "default" | "danger";
};

/** Grey two-column panel: icon + bold value + muted label in each half. */
export function StatPanel({ cells }: { cells: readonly [StatCell, StatCell] }) {
  return (
    <div className="grid grid-cols-2 rounded-[18px] bg-[#f7f8f9] py-3">
      {cells.map((cell, index) => (
        <div
          key={cell.label}
          className={`flex min-w-0 items-center gap-2 px-3 ${
            index === 1 ? "border-s border-[#e3e6ea]" : ""
          }`}
        >
          <span className="shrink-0 text-orange-500">{cell.icon}</span>
          <span className="min-w-0 text-right">
            <span
              dir={cell.ltr ? "ltr" : undefined}
              className={`block whitespace-nowrap text-[15px] font-bold leading-6 ${
                cell.tone === "danger" ? "text-[#b23a33]" : "text-slate-800"
              }`}
            >
              {cell.value}
            </span>
            <span className="block whitespace-nowrap text-[12px] leading-5 text-slate-500">
              {cell.label}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function StatusTag({ status }: { status: "valid" | "expired" }) {
  return status === "valid" ? (
    <span className="inline-flex h-7 items-center rounded-full bg-[#e9f5ee] px-3 text-[12px] font-bold text-[#1f7a50]">
      سارية
    </span>
  ) : (
    <span className="inline-flex h-7 items-center rounded-full bg-[#fbedec] px-3 text-[12px] font-bold text-[#b23a33]">
      منتهية
    </span>
  );
}

type StepperRowProps = {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** Used in the buttons' aria-labels, e.g. the marketer's name. */
  subject: string;
};

/** Grey row: label on the start side, [−] value [+] on the end side. */
export function StepperRow({ label, value, max, onChange, subject }: StepperRowProps) {
  const atMin = value <= 0;
  const atMax = value >= max;

  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] bg-[#f7f8f9] py-2 ps-4 pe-2">
      <span className="text-[14px] font-medium text-slate-700">{label}</span>
      <div dir="ltr" className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`إنقاص الإعلانات المحولة لـ ${subject}`}
          disabled={atMin}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MinusIcon className="h-5 w-5" />
        </button>
        <output
          aria-live="polite"
          aria-label={`${label}: ${value}`}
          className="min-w-8 text-center text-[18px] font-bold tabular-nums text-slate-900"
        >
          {value}
        </output>
        <button
          type="button"
          aria-label={`زيادة الإعلانات المحولة لـ ${subject}`}
          disabled={atMax}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/** White card with the soft shadow used by the package cards. */
export function OfficeCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-line bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
