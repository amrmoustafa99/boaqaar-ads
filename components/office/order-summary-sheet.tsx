"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DocumentIcon, LockIcon, ShieldIcon } from "@/components/highlight/icons";
import { CouponForm } from "@/components/shared/coupon-form";
import { Sheet, SheetHeader } from "@/components/shared/sheet";
import { SummaryRow } from "@/components/shared/summary-row";
import { formatKwdAmount } from "@/lib/highlight";
import {
  couponDiscountKwd,
  isValidCoupon,
  OFFICE_PACKAGE_VALIDITY_DAYS,
  orderTotals,
  type OfficePackageOffer,
} from "@/lib/office";
import { useOfficeStore } from "./office-store";

type OrderSummarySheetProps = {
  plan: OfficePackageOffer;
  /** Selected marketer id → ads transferred to it. Empty without marketers. */
  transfers: Readonly<Record<string, number>>;
  onClose: () => void;
};

const kwd = (amount: number) => `${formatKwdAmount(amount)} د.ك`;

/** S3 · إتمام شراء الباقة: order summary, mock coupon and mock payment. */
export function OrderSummarySheet({ plan, transfers, onClose }: OrderSummarySheetProps) {
  const router = useRouter();
  const { purchase, showToast } = useOfficeStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const totals = orderTotals(plan, transfers);
  const discount = couponCode ? couponDiscountKwd(totals.subtotalKwd) : 0;
  const total = kwd(totals.subtotalKwd - discount);

  function applyCoupon(code: string) {
    if (isValidCoupon(code)) {
      setCouponCode(code.toUpperCase());
      setCouponError("");
    } else {
      setCouponCode("");
      setCouponError("كود الخصم غير صحيح");
    }
  }

  function pay() {
    purchase(
      plan.id,
      Object.entries(transfers).map(([marketerId, ads]) => ({ marketerId, ads })),
    );
    showToast("تم شراء الباقة بنجاح");
    // Close first: Next keeps the previous page mounted (hidden), so an
    // open sheet would still be open when the user comes back.
    onClose();
    router.push("/office/marketers");
  }

  return (
    <Sheet labelledBy="order-title" onClose={onClose}>
      <SheetHeader
        titleId="order-title"
        title="إتمام شراء الباقة"
        subtitle="راجع تفاصيل الباقة قبل الدفع"
        onClose={onClose}
      />

      <CouponForm appliedCode={couponCode} onApply={applyCoupon} error={couponError} />

      <div className="mt-4 rounded-[20px] bg-[#f3f4f6] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">ملخص الباقة</h3>
          <DocumentIcon className="h-5 w-5 text-slate-400" />
        </div>
        <dl className="space-y-3.5 text-[14px]">
          <SummaryRow label="الباقة المختارة" value={plan.name} ltr />
          <SummaryRow label="مدة الصلاحية" value={`${OFFICE_PACKAGE_VALIDITY_DAYS} يوم`} />
          <SummaryRow label="عدد الإعلانات" value={String(plan.ads)} />
          <SummaryRow label="سعر الباقة" value={kwd(plan.priceKwd)} />
          <SummaryRow label="رسوم المسوقين" value={kwd(totals.feesKwd)} />
          <SummaryRow label="الإعلانات المحولة" value={String(totals.transferredAds)} />
          <SummaryRow label="الرصيد المتبقي للمكتب" value={String(totals.remainingAds)} />
          {discount > 0 ? (
            <SummaryRow
              label="الخصم"
              value={
                // Isolate the signed number so the minus stays before the digits.
                <>
                  <span dir="ltr">-{formatKwdAmount(discount)}</span> د.ك
                </>
              }
            />
          ) : null}
          <div className="border-t border-[#e3e6ea] pt-3.5">
            <SummaryRow label="المجموع الكلي" value={total} emphasize />
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={pay}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-[16px] font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
      >
        <LockIcon className="h-5 w-5" />
        <span>إتمام الشراء — {total}</span>
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-slate-400">
        <ShieldIcon className="h-4 w-4" />
        <span>بياناتك محمية وآمنة بنسبة 100%</span>
      </p>
    </Sheet>
  );
}
