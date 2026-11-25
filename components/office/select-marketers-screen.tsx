"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { CheckIcon, LockIcon } from "@/components/highlight/icons";
import { SelectedBar } from "@/components/shared/selected-bar";
import { SummaryRow } from "@/components/shared/summary-row";
import { formatKwdAmount } from "@/lib/highlight";
import {
  findOfficePackage,
  MARKETER_ACTIVATION_FEE_KWD,
  orderTotals,
  sumValues,
  type Marketer,
  type OfficePackageId,
} from "@/lib/office";
import { useOfficeStore } from "./office-store";
import { StepperRow } from "./office-ui";
import { OrderSummarySheet } from "./order-summary-sheet";

const fee = `${formatKwdAmount(MARKETER_ACTIVATION_FEE_KWD)} د.ك`;

/** S2 · اختيار المسوقين: pick marketers to activate with the package. */
export function SelectMarketersScreen({ packageId }: { packageId: OfficePackageId }) {
  const plan = findOfficePackage(packageId);
  const { state } = useOfficeStore();
  const available = state.marketers.filter((item) => item.status === "not_activated");
  const unavailable = state.marketers.filter((item) => item.status !== "not_activated");

  // Selected marketer id → ads transferred to it with the purchase.
  const [selection, setSelection] = useState<Record<string, number>>({});
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Drop selections that no longer apply (for example after a scenario reset).
  const transfers: Record<string, number> = {};
  for (const marketer of available) {
    const value = selection[marketer.id];
    if (value !== undefined) transfers[marketer.id] = value;
  }
  const totals = orderTotals(plan, transfers);
  const total = `${formatKwdAmount(totals.subtotalKwd)} د.ك`;

  function toggle(id: string) {
    setSelection((current) => {
      if (id in current) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: 0 };
    });
  }

  function changeTransfer(id: string, value: number) {
    setSelection((current) => ({ ...current, [id]: value }));
  }

  function maxFor(id: string) {
    return Math.max(0, plan.ads - (sumValues(transfers) - (transfers[id] ?? 0)));
  }

  return (
    <div className="min-h-dvh bg-white text-slate-800">
      <AppHeader title="اختيار المسوقين" backHref="/office/packages" raised />

      <main className="mx-auto w-full max-w-md px-4 pt-4 pb-32 lg:max-w-5xl lg:px-8 lg:pt-10 lg:pb-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,36rem)_22rem] lg:items-start lg:justify-between lg:gap-12">
          <div>
            <div className="flex items-start justify-between gap-3 rounded-[22px] border border-[#eff1f3] bg-[#f6f7f8] px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <p className="flex items-end gap-2">
                <span className="text-[34px] font-bold leading-none text-slate-900">
                  {plan.ads}
                </span>
                <span className="pb-0.5 text-[15px] font-semibold text-slate-600">إعلان عادي</span>
              </p>
              <p className="flex flex-col items-center gap-1">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-500 text-white">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <span dir="ltr" className="text-[13px] font-bold text-orange-600">
                  {plan.name}
                </span>
              </p>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              اختر المسوقين الذين تريد تفعيلهم. يمكنك تحويل إعلانات لهم الآن أو لاحقاً من صفحة «إدارة المسوقين».
            </p>

            {available.length > 0 ? (
              <ul aria-label="المسوقين المتاحين" className="mt-4 space-y-3">
                {available.map((marketer) => (
                  <li key={marketer.id}>
                    <AvailableMarketerCard
                      marketer={marketer}
                      selected={marketer.id in transfers}
                      transfer={transfers[marketer.id] ?? 0}
                      max={maxFor(marketer.id)}
                      onToggle={toggle}
                      onTransferChange={changeTransfer}
                    />
                  </li>
                ))}
              </ul>
            ) : null}

            {unavailable.length > 0 ? (
              <section aria-labelledby="unavailable-heading" className="mt-7">
                <h2 id="unavailable-heading" className="mb-3 text-[17px] font-bold text-slate-900">
                  غير متاحين حالياً
                </h2>
                <ul className="space-y-3">
                  {unavailable.map((marketer) => (
                    <li key={marketer.id}>
                      <UnavailableMarketerCard marketer={marketer} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="hidden lg:sticky lg:top-8 lg:block">
            <div className="rounded-[24px] border border-line bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
              <h2 className="text-[18px] font-bold text-slate-900">ملخص الباقة</h2>
              <dl className="mt-5 space-y-4 text-[14px]">
                <SummaryRow label="الباقة المختارة" value={plan.name} ltr />
                <SummaryRow label="سعر الباقة" value={`${formatKwdAmount(plan.priceKwd)} د.ك`} />
                <SummaryRow label="رسوم المسوقين" value={`${formatKwdAmount(totals.feesKwd)} د.ك`} />
                <SummaryRow label="الإعلانات المحولة" value={String(totals.transferredAds)} />
                <div className="border-t border-[#e7eef1] pt-4">
                  <SummaryRow label="المجموع الكلي" value={total} emphasize />
                </div>
              </dl>
              <button
                type="button"
                onClick={() => setSummaryOpen(true)}
                className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-orange-500 text-[16px] font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
              >
                متابعة
              </button>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] lg:hidden">
        <SelectedBar
          label="الباقة المختارة"
          value={plan.name}
          valueLtr
          amount={total}
          onClick={() => setSummaryOpen(true)}
        />
      </div>

      {summaryOpen ? (
        <OrderSummarySheet
          plan={plan}
          transfers={transfers}
          onClose={() => setSummaryOpen(false)}
        />
      ) : null}
    </div>
  );
}

function AvailableMarketerCard({
  marketer,
  selected,
  transfer,
  max,
  onToggle,
  onTransferChange,
}: {
  marketer: Marketer;
  selected: boolean;
  transfer: number;
  max: number;
  onToggle: (id: string) => void;
  onTransferChange: (id: string, value: number) => void;
}) {
  return (
    <div
      className={`rounded-[22px] border transition ${
        selected
          ? "border-orange-200 bg-[#fff4ec] shadow-[0_8px_24px_rgba(254,110,0,0.1)]"
          : "border-line bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onToggle(marketer.id)}
        className="flex min-h-[76px] w-full items-center justify-between gap-3 px-4 py-4 text-right"
      >
        <span className="min-w-0">
          <span className="block text-[17px] font-bold leading-7 text-slate-900">
            {marketer.name}
          </span>
          <span className="block text-[13px] text-slate-500">رسوم التفعيل {fee}</span>
        </span>
        <span
          aria-hidden="true"
          className={
            selected
              ? "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-white"
              : "h-7 w-7 shrink-0 rounded-full border-2 border-orange-400 bg-white"
          }
        >
          {selected ? <CheckIcon className="h-4 w-4" /> : null}
        </span>
      </button>

      {selected ? (
        <div className="px-4 pb-4">
          <StepperRow
            label="إعلانات محولة"
            value={transfer}
            max={max}
            subject={marketer.name}
            onChange={(value) => onTransferChange(marketer.id, value)}
          />
        </div>
      ) : null}
    </div>
  );
}

function UnavailableMarketerCard({ marketer }: { marketer: Marketer }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[22px] bg-[#f3f4f6] px-4 py-4">
      <div className="min-w-0">
        <p className="text-[16px] font-bold text-slate-700">{marketer.name}</p>
        <p className="mt-0.5 text-[13px] leading-6 text-slate-500">
          لديه باقة رصيد محول سارية حتى{" "}
          <span dir="ltr" className="inline-block">
            {marketer.validUntil ?? "—"}
          </span>{" "}
          — {marketer.balance} رصيد
        </p>
      </div>
      <LockIcon className="h-5 w-5 shrink-0 text-slate-400" />
    </div>
  );
}
