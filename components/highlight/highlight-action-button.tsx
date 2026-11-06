import { formatKwdAmount, HIGHLIGHT_PRICE_KWD } from "@/lib/highlight";
import { SparklesIcon } from "./icons";

type HighlightActionButtonProps = {
  className?: string;
};

export function HighlightActionButton({ className = "" }: HighlightActionButtonProps) {
  const amount = formatKwdAmount(HIGHLIGHT_PRICE_KWD);

  return (
    <button
      type="button"
      className={`flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-white transition hover:bg-orange-600 active:scale-[0.99] ${className}`}
    >
      <span className="inline-flex items-baseline gap-1.5">
        <span className="text-[17px] font-bold tabular-nums">{amount}</span>
        <span className="text-[14px] font-semibold">د.ك</span>
      </span>
      <SparklesIcon className="h-[22px] w-[22px]" />
    </button>
  );
}
