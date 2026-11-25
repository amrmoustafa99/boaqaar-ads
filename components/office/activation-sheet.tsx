"use client";

import {
  DocumentIcon,
  LockIcon,
  ShieldIcon,
} from "@/components/highlight/icons";
import { Sheet, SheetHeader } from "@/components/shared/sheet";
import { SummaryRow } from "@/components/shared/summary-row";
import { formatKwdAmount } from "@/lib/highlight";
import { MARKETER_ACTIVATION_FEE_KWD, type Marketer } from "@/lib/office";

type ActivationSheetProps = {
  marketers: readonly Marketer[];
  onClose: () => void;
  onPay: () => void;
};

/** S5 · تفعيل المسوقين: activation fees for the selected marketers. */
export function ActivationSheet({ marketers, onClose, onPay }: ActivationSheetProps) {
  const fee = `${formatKwdAmount(MARKETER_ACTIVATION_FEE_KWD)} د.ك`;
  const total = `${formatKwdAmount(marketers.length * MARKETER_ACTIVATION_FEE_KWD)} د.ك`;

  return (
    <Sheet labelledBy="activation-title" onClose={onClose}>
      <SheetHeader
        titleId="activation-title"
        title="تفعيل المسوقين"
        subtitle="راجع رسوم التفعيل قبل الدفع"
        onClose={onClose}
      />

      <div className="mt-5 rounded-[20px] bg-[#f3f4f6] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">ملخص التفعيل</h3>
          <DocumentIcon className="h-5 w-5 text-slate-400" />
        </div>
        <dl className="space-y-3.5 text-[14px]">
          <SummaryRow label="عدد المسوقين" value={String(marketers.length)} />
          <SummaryRow label="رسوم المسوق الواحد" value={fee} />
          <div className="space-y-3.5 border-t border-[#e3e6ea] pt-3.5">
            {marketers.map((marketer) => (
              <SummaryRow key={marketer.id} label={marketer.name} value={fee} />
            ))}
          </div>
          <div className="border-t border-[#e3e6ea] pt-3.5">
            <SummaryRow label="المجموع الكلي" value={total} emphasize />
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={onPay}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-[16px] font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
      >
        <LockIcon className="h-5 w-5" />
        <span>إتمام الدفع — {total}</span>
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-slate-400">
        <ShieldIcon className="h-4 w-4" />
        <span>بياناتك محمية وآمنة بنسبة 100%</span>
      </p>
    </Sheet>
  );
}
