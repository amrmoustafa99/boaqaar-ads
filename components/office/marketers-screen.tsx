"use client";

import { useState } from "react";
import { AppHeader, HeaderIconButton } from "@/components/app-header";
import { PlusIcon } from "@/components/highlight/icons";
import { SelectedBar } from "@/components/shared/selected-bar";
import { formatKwdAmount } from "@/lib/highlight";
import {
  MARKETER_ACTIVATION_FEE_KWD,
  sortMarketers,
  sumValues,
  type Marketer,
} from "@/lib/office";
import { ActivationSheet } from "./activation-sheet";
import { MarketerCard } from "./marketer-card";
import { OfficeStatusCard } from "./office-status-card";
import { useOfficeStore } from "./office-store";

export function MarketersScreen() {
  const { state, activate, transfer, showToast } = useOfficeStore();
  const office = state.currentPackage;
  const editable = office.status === "valid";
  const marketers = sortMarketers(state.marketers);

  const [selection, setSelection] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, number>>({});
  const [activationOpen, setActivationOpen] = useState(false);

  // Only keep pending values that still apply to the current data
  // (a scenario reset or a purchase can change marketer statuses).
  const statusById = new Map(marketers.map((item) => [item.id, item.status]));
  const selectedIds = editable
    ? selection.filter((id) => statusById.get(id) === "not_activated")
    : [];
  const pendingTransfers: Record<string, number> = {};
  if (editable) {
    for (const [id, value] of Object.entries(drafts)) {
      if (value > 0 && statusById.get(id) === "active") pendingTransfers[id] = value;
    }
  }
  const pendingTotal = sumValues(pendingTransfers);
  const remaining = office.availableAds - pendingTotal;
  const activationTotal = selectedIds.length * MARKETER_ACTIVATION_FEE_KWD;
  const hasPending = selectedIds.length > 0 || pendingTotal > 0;

  function toggleSelect(id: string) {
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function changeTransfer(id: string, value: number) {
    setDrafts((current) => ({ ...current, [id]: value }));
  }

  function confirmTransfer() {
    if (pendingTotal === 0 || remaining < 0) return;
    transfer(
      Object.entries(pendingTransfers).map(([marketerId, ads]) => ({ marketerId, ads })),
    );
    setDrafts({});
    showToast(`تم تحويل ${pendingTotal} إعلان بنجاح`);
  }

  function payActivation() {
    if (selectedIds.length === 0) return;
    activate(selectedIds);
    setSelection([]);
    setActivationOpen(false);
    showToast("تم تفعيل المسوقين بنجاح");
  }

  const pendingActions = hasPending ? (
    <div className="space-y-2.5">
      {selectedIds.length > 0 ? (
        <SelectedBar
          label="تفعيل المسوقين"
          value={`${selectedIds.length} مسوق`}
          amount={`${formatKwdAmount(activationTotal)} د.ك`}
          onClick={() => setActivationOpen(true)}
        />
      ) : null}
      {pendingTotal > 0 ? (
        <div className="mx-auto w-full max-w-md rounded-[22px] border border-line bg-white px-3 pt-3 pb-3 shadow-[0_8px_28px_rgba(15,23,42,0.12)]">
          <p className="text-center text-[14px] text-slate-600">
            الرصيد المتبقي بعد التحويل:{" "}
            <span className="font-bold text-slate-900">{remaining} إعلان</span>
          </p>
          <button
            type="button"
            onClick={confirmTransfer}
            className="mt-2.5 flex h-14 w-full items-center justify-center rounded-full bg-orange-500 text-[16px] font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
          >
            تأكيد تحويل {pendingTotal} إعلان
          </button>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <div className="min-h-dvh bg-white text-slate-800">
      <AppHeader
        title="إدارة المسوقين"
        backHref="/office"
        raised
        action={
          <HeaderIconButton
            label="إضافة مسوق"
            onClick={() => showToast("سيتم ربطها بشاشة إضافة مسوق")}
            className="text-orange-500"
          >
            <PlusIcon className="h-6 w-6" />
          </HeaderIconButton>
        }
      />

      <main
        className={`mx-auto w-full max-w-md px-4 pt-4 lg:max-w-5xl lg:px-8 lg:pt-10 lg:pb-16 ${
          selectedIds.length > 0 && pendingTotal > 0
            ? "pb-64"
            : pendingTotal > 0
              ? "pb-44"
              : hasPending
                ? "pb-28"
                : "pb-10"
        }`}
      >
        <div className="lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start lg:gap-6">
          <aside className="lg:sticky lg:top-8">
            <OfficeStatusCard office={office} />
            {pendingActions ? <div className="mt-4 hidden lg:block">{pendingActions}</div> : null}
          </aside>

          <section aria-labelledby="marketers-heading" className="mt-6 lg:mt-0">
            {marketers.length > 0 ? (
              <>
                <h2
                  id="marketers-heading"
                  className="mb-3 text-[17px] font-bold text-slate-900"
                >
                  المسوقين ({marketers.length})
                </h2>
                <ul className="grid gap-4 lg:grid-cols-2">
                  {marketers.map((marketer) => (
                    <li key={marketer.id}>
                      <MarketerCard
                        marketer={marketer}
                        editable={editable}
                        selected={selectedIds.includes(marketer.id)}
                        onToggleSelect={toggleSelect}
                        transferValue={pendingTransfers[marketer.id] ?? 0}
                        transferMax={transferMax(marketer, office.availableAds, pendingTransfers)}
                        onTransferChange={changeTransfer}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <h2 id="marketers-heading" className="text-[17px] font-bold text-slate-900">
                  لا يوجد مسوقين بعد
                </h2>
                <p className="mt-2 text-[14px] leading-6 text-slate-500">
                  أضف مسوقيك لتتمكن من تحويل الإعلانات لهم.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {pendingActions ? (
        <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] lg:hidden">
          {pendingActions}
        </div>
      ) : null}

      {activationOpen && selectedIds.length > 0 ? (
        <ActivationSheet
          marketers={marketers.filter((item) => selectedIds.includes(item.id))}
          onClose={() => setActivationOpen(false)}
          onPay={payActivation}
        />
      ) : null}
    </div>
  );
}

function transferMax(
  marketer: Marketer,
  available: number,
  pending: Readonly<Record<string, number>>,
) {
  const others = sumValues(pending) - (pending[marketer.id] ?? 0);
  return Math.max(0, available - others);
}
