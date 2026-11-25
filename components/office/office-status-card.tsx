import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  MegaphoneIcon,
  TransferIcon,
} from "@/components/highlight/icons";
import type { CurrentOfficePackage } from "@/lib/office";
import { OfficeCard, StatPanel, StatusTag } from "./office-ui";

/** "باقة المكتب" card at the top of marketers management (F3 / F5). */
export function OfficeStatusCard({ office }: { office: CurrentOfficePackage }) {
  const expired = office.status === "expired";

  return (
    <OfficeCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] text-slate-500">باقة المكتب</p>
          <p dir="ltr" className="text-right text-[22px] font-bold leading-8 text-slate-900">
            {office.name}
          </p>
        </div>
        {office.status === "none" ? null : (
          <span className="mt-2">
            <StatusTag status={expired ? "expired" : "valid"} />
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2.5">
        <StatPanel
          cells={[
            expired
              ? {
                  icon: <CalendarIcon className="h-5 w-5" />,
                  value: office.expiredOn ?? office.validUntil,
                  label: "انتهت في",
                  ltr: true,
                  tone: "danger",
                }
              : {
                  icon: <CalendarIcon className="h-5 w-5" />,
                  value: office.validUntil,
                  label: "صالحة حتى",
                  ltr: true,
                },
            {
              icon: <MegaphoneIcon className="h-5 w-5" />,
              value: `${office.availableAds} إعلان`,
              label: "الرصيد المتاح",
            },
          ]}
        />
        <StatPanel
          cells={[
            {
              icon: <TransferIcon className="h-5 w-5" />,
              value: `${office.transferredAds} إعلان`,
              label: "المحول للمسوقين",
            },
            {
              icon: <ClockIcon className="h-5 w-5" />,
              value: `${office.unusedAds} إعلان`,
              label: "غير مستخدم",
            },
          ]}
        />
      </div>

      {expired ? (
        <>
          <p className="mt-4 text-[14px] leading-7 text-slate-700">
            انتهت صلاحية الباقة. جدّد الباقة لتتمكن من تحويل الإعلانات لمسوقيك.
          </p>
          <Link
            href="/office/packages"
            className="mt-3 flex h-14 items-center justify-center rounded-full bg-orange-500 text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(254,110,0,0.25)] transition hover:bg-orange-600"
          >
            تجديد الباقة
          </Link>
        </>
      ) : null}
    </OfficeCard>
  );
}
