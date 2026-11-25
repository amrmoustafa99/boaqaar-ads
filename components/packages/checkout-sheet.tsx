"use client";

import { useState, type FormEvent } from "react";
import type { AdPackage } from "@/lib/packages";
import {
  DocumentIcon,
  LockIcon,
  ShieldIcon,
} from "@/components/highlight/icons";
import { Sheet } from "@/components/shared/sheet";
import { SummaryRow } from "@/components/shared/summary-row";

type CheckoutSheetProps = {
  plan: AdPackage;
  couponCode: string;
  onCouponChange: (code: string) => void;
  onClose: () => void;
};

export function CheckoutSheet({
  plan,
  couponCode,
  onCouponChange,
  onClose,
}: CheckoutSheetProps) {
  const [draft, setDraft] = useState(couponCode);
  const [saved, setSaved] = useState(false);

  function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    onCouponChange(next);
  }

  return (
    <Sheet labelledBy="checkout-title" onClose={onClose}>
      <div className="relative text-center">
        <DocumentIcon className="absolute top-0.5 right-0 h-6 w-6 text-slate-400" />
        <h2 id="checkout-title" className="text-[18px] font-bold text-slate-900">
          إتمام شراء الباقة
        </h2>
        <p className="mt-1 text-[13px] text-slate-500">
          راجع تفاصيل الباقة قبل الدفع
        </p>
      </div>

      <form onSubmit={applyCoupon} className="mt-5 rounded-[20px] bg-[#f3f4f6] p-4">
        <p className="mb-3 text-right text-[14px] font-semibold text-slate-700">
          كود الخصم
        </p>
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="أدخل كود الخصم"
            aria-label="كود الخصم"
            autoComplete="off"
            className="h-12 min-w-0 flex-1 rounded-full border border-[#e6e8ec] bg-white px-4 text-right text-[14px] text-slate-800 outline-none placeholder:text-right placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
          />
          <button
            type="submit"
            disabled={draft.trim().length === 0}
            className="h-12 shrink-0 rounded-full bg-orange-500 px-5 text-[15px] font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed"
          >
            تطبيق
          </button>
        </div>
        {couponCode ? (
          <p className="mt-2 text-right text-[13px] text-slate-500">
            تم إدخال الكوبون{" "}
            <span dir="ltr" className="font-bold text-slate-800">
              {couponCode}
            </span>
          </p>
        ) : null}
      </form>

      <div className="mt-4 rounded-[20px] bg-[#f3f4f6] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">ملخص الباقة</h3>
          <DocumentIcon className="h-5 w-5 text-slate-400" />
        </div>
        <dl className="space-y-3.5 text-[14px]">
          <SummaryRow label="الباقة المختارة" value={plan.name} ltr />
          {plan.featuredDays ? (
            <SummaryRow
              label="مدة الإعلان المميز"
              value={`${plan.featuredDays} يوم`}
            />
          ) : (
            <SummaryRow
              label="صلاحية الإعلان"
              value={`${plan.adValidityDays} يوم`}
            />
          )}
          {!plan.featuredDays && plan.packageValidityDays ? (
            <SummaryRow
              label="صلاحية الباقة"
              value={`${plan.packageValidityDays} يوم`}
            />
          ) : null}
          <SummaryRow label="عدد الإعلانات" value={String(plan.count)} />
          <SummaryRow label="سعر الباقة" value={`${plan.priceKwd} د.ك`} />
          <SummaryRow
            label="المجموع الكلي"
            value={`${plan.priceKwd} د.ك`}
            emphasize
          />
        </dl>
      </div>

      {saved ? (
        <p className="mt-4 text-center text-[14px] font-semibold text-slate-700">
          تم حفظ اختيار باقة <span dir="ltr">{plan.name}</span>
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (saved) {
            onClose();
            return;
          }
          setSaved(true);
        }}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-[16px] font-bold text-white transition hover:bg-orange-600"
      >
        {saved ? null : <LockIcon className="h-5 w-5" />}
        <span>
          {saved ? "رجوع إلى الباقات" : `إتمام الشراء — ${plan.priceKwd} د.ك`}
        </span>
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-slate-400">
        <ShieldIcon className="h-4 w-4" />
        <span>بياناتك محمية وآمنة بنسبة 100%</span>
      </p>
    </Sheet>
  );
}
