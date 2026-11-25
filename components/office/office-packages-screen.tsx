"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import {
  BadgeCheckIcon,
  BookIcon,
  CalendarIcon,
  CheckIcon,
  MegaphoneIcon,
  StorefrontIcon,
  TagIcon,
} from "@/components/highlight/icons";
import { MetaChip } from "@/components/shared/meta-chip";
import { formatKwdAmount } from "@/lib/highlight";
import {
  findOfficePackage,
  OFFICE_AD_VALIDITY_DAYS,
  OFFICE_PACKAGE_VALIDITY_DAYS,
  OFFICE_PACKAGES,
  type OfficePackageId,
  type OfficePackageOffer,
} from "@/lib/office";
import { useOfficeStore } from "./office-store";
import { OrderSummarySheet } from "./order-summary-sheet";

const BENEFITS: readonly { icon: ReactNode; text: string }[] = [
  {
    icon: <StorefrontIcon className="h-5 w-5" />,
    text: "الحصول على صفحة احترافية خاصة بمكتبك تضم بيانات التواصل، حسابات التواصل الاجتماعي، فريق المسوقين، وجميع إعلاناتك العقارية.",
  },
  {
    icon: <BookIcon className="h-5 w-5" />,
    text: "إدراج مكتبك ضمن دليل المكاتب العقارية المرخصة لزيادة الظهور والمصداقية أمام العملاء.",
  },
  {
    icon: <BadgeCheckIcon className="h-5 w-5" />,
    text: "الحصول على علامة التوثيق «مكتب مرخص» التي تظهر في صفحة مكتبك وجميع إعلاناتك المنشورة.",
  },
  {
    icon: <TagIcon className="h-5 w-5" />,
    text: "إظهار اسم وشعار مكتبك على جميع إعلاناتك النشطة لتعزيز الهوية التجارية وبناء الثقة مع الباحثين عن العقارات.",
  },
];

/** S1 · باقات بوعقار الإعلانية (office packages catalog). */
export function OfficePackagesScreen() {
  const router = useRouter();
  const { state } = useOfficeStore();
  const [selectedId, setSelectedId] = useState<OfficePackageId | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const hasMarketers = state.marketers.length > 0;

  function choose(id: OfficePackageId) {
    setSelectedId(id);
    if (hasMarketers) {
      router.push(`/office/packages/${id}/marketers`);
    } else {
      // Nothing to select in S2, so go straight to the order summary.
      setSummaryOpen(true);
    }
  }

  return (
    <div className="min-h-dvh bg-white text-slate-800">
      <AppHeader title="باقات بوعقار الإعلانية" backHref="/office" />

      <main className="mx-auto w-full max-w-md px-4 pt-4 pb-10 lg:max-w-5xl lg:px-8 lg:pt-10 lg:pb-16">
        <section aria-labelledby="benefits-heading" className="lg:mx-auto lg:max-w-3xl">
          <h2
            id="benefits-heading"
            className="text-[15px] font-bold leading-relaxed text-slate-800 lg:text-[17px]"
          >
            تمكّنك باقات بوعقار الإعلانية الخاصة بالمكاتب من:
          </h2>
          <ul className="mt-3 space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit.text} className="flex items-start gap-2.5">
                <span className="mt-1 shrink-0 text-slate-500">{benefit.icon}</span>
                <span className="text-[15px] leading-relaxed text-slate-600">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-7 grid gap-5 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {OFFICE_PACKAGES.map((plan) => (
            <OfficePackageCard
              key={plan.id}
              plan={plan}
              selected={plan.id === selectedId}
              onChoose={choose}
            />
          ))}
        </div>
      </main>

      {summaryOpen && selectedId ? (
        <OrderSummarySheet
          plan={findOfficePackage(selectedId)}
          transfers={NO_TRANSFERS}
          onClose={() => setSummaryOpen(false)}
        />
      ) : null}
    </div>
  );
}

const NO_TRANSFERS: Readonly<Record<string, number>> = {};

/** Same look as the `/packages` mobile card: count, selection circle, chips, price. */
function OfficePackageCard({
  plan,
  selected,
  onChoose,
}: {
  plan: OfficePackageOffer;
  selected: boolean;
  onChoose: (id: OfficePackageId) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`باقة ${plan.name}، ${plan.ads} إعلان عادي، ${formatKwdAmount(plan.priceKwd)} د.ك`}
      onClick={() => onChoose(plan.id)}
      className={`w-full rounded-[22px] border px-4 py-4 text-right transition lg:rounded-[24px] lg:p-5 ${
        selected
          ? "border-orange-200 bg-[#fff4ec] shadow-[0_8px_24px_rgba(254,110,0,0.1)]"
          : "border-line bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-orange-200"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="flex items-end gap-2">
          <span className="text-[34px] font-bold leading-none text-slate-900">{plan.ads}</span>
          <span className="pb-0.5 text-[15px] font-semibold text-slate-600">إعلان عادي</span>
        </span>
        <span className="flex flex-col items-center gap-1">
          <span
            className={
              selected
                ? "grid h-7 w-7 place-items-center rounded-full bg-orange-500 text-white"
                : "h-7 w-7 rounded-full border-2 border-[#d5dbe0] bg-white"
            }
          >
            {selected ? <CheckIcon className="h-4 w-4" /> : null}
          </span>
          <span
            dir="ltr"
            className={`text-[12px] font-medium ${selected ? "text-orange-600" : "text-slate-500"}`}
          >
            {plan.name}
          </span>
        </span>
      </span>

      <span className="mt-3 grid grid-cols-2 gap-2">
        <MetaChip
          icon={<MegaphoneIcon className="h-4 w-4 text-orange-500" />}
          value={`${OFFICE_AD_VALIDITY_DAYS} يوم`}
          label="صلاحية الإعلان"
        />
        <MetaChip
          icon={<CalendarIcon className="h-4 w-4 text-orange-500" />}
          value={`${OFFICE_PACKAGE_VALIDITY_DAYS} يوم`}
          label="صلاحية الباقة"
        />
      </span>

      <span
        className={`mt-3 flex h-12 items-center justify-center rounded-full bg-white text-[26px] font-bold leading-none shadow-[0_10px_24px_rgba(15,23,42,0.22)] ${
          selected ? "text-orange-500" : "text-slate-800"
        }`}
      >
        {formatKwdAmount(plan.priceKwd)}
        <span className="ms-1 text-[14px] font-semibold">د.ك</span>
      </span>
    </button>
  );
}
