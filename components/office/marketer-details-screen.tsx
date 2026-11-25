"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppHeader, HeaderIconButton } from "@/components/app-header";
import {
  CalendarIcon,
  CheckIcon,
  DotsIcon,
  MegaphoneIcon,
  PencilIcon,
  PhoneIcon,
  TransferIcon,
  UserIcon,
} from "@/components/highlight/icons";
import {
  MARKETER_TABS,
  marketerBalanceStatus,
  MOCK_TODAY,
  parseMarketerTab,
  parseOfficeDate,
  totalTransferred,
  type Marketer,
  type MarketerTabId,
} from "@/lib/office";
import { useOfficeStore } from "./office-store";
import { OfficeCard, StatPanel, StatusTag } from "./office-ui";

const EDIT_TOAST = "سيتم ربطها بشاشة تعديل بيانات المسوق";

/** Reads the active tab from `?tab=`. Must render inside `<Suspense>`. */
export function MarketerDetailsFromUrl({ marketerId }: { marketerId: string }) {
  const searchParams = useSearchParams();
  return (
    <MarketerDetailsScreen
      marketerId={marketerId}
      tab={parseMarketerTab(searchParams.get("tab"))}
    />
  );
}

export function MarketerDetailsScreen({
  marketerId,
  tab,
}: {
  marketerId: string;
  tab: MarketerTabId;
}) {
  const { state, showToast } = useOfficeStore();
  const marketer = state.marketers.find((item) => item.id === marketerId);

  if (!marketer) {
    return (
      <div className="min-h-dvh bg-white text-slate-800">
        <AppHeader title="تفاصيل المسوق" backHref="/office/marketers" raised />
        <main className="mx-auto w-full max-w-md px-6 py-16 text-center lg:max-w-5xl">
          <p className="text-[16px] font-bold text-slate-900">المسوق غير موجود</p>
          <Link
            href="/office/marketers"
            className="mt-4 inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold text-orange-600 hover:bg-orange-50"
          >
            إدارة المسوقين
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-slate-800">
      <AppHeader
        title={marketer.name}
        backHref="/office/marketers"
        raised
        action={
          <HeaderIconButton label="خيارات">
            <DotsIcon className="h-5 w-5" />
          </HeaderIconButton>
        }
      />

      <main className="mx-auto w-full max-w-md px-4 pt-2 pb-10 lg:max-w-5xl lg:px-8 lg:pt-8 lg:pb-16">
        <MarketerTabs marketerName={marketer.name} active={tab} />

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="pt-4 lg:pt-6"
        >
          {tab === "data" ? (
            <DataTab marketer={marketer} onEdit={() => showToast(EDIT_TOAST)} />
          ) : null}
          {tab === "ads" ? <EmptyText text="لا توجد إعلانات لهذا المسوق" /> : null}
          {tab === "transfers" ? <TransfersTab marketer={marketer} /> : null}
        </div>
      </main>
    </div>
  );
}

function MarketerTabs({
  marketerName,
  active,
}: {
  marketerName: string;
  active: MarketerTabId;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label={`أقسام المسوق ${marketerName}`}
      className="grid grid-cols-3 border-b border-line lg:max-w-md"
    >
      {MARKETER_TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            onClick={() => router.replace(`${pathname}?tab=${tab.id}`, { scroll: false })}
            className={`-mb-px h-12 border-b-[3px] text-[15px] transition ${
              selected
                ? "border-orange-500 font-bold text-orange-600"
                : "border-transparent font-medium text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function DataTab({ marketer, onEdit }: { marketer: Marketer; onEdit: () => void }) {
  const status = marketerBalanceStatus(marketer, parseOfficeDate(MOCK_TODAY));
  const transferred = totalTransferred(marketer);
  const used = Math.max(0, transferred - marketer.balance);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <OfficeCard>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f3f4f6] text-orange-500">
              <UserIcon className="h-6 w-6" />
            </span>
            <h2 className="min-w-0 flex-1 text-[17px] font-bold text-slate-900">
              {marketer.name}
            </h2>
            <button
              type="button"
              aria-label="تعديل"
              onClick={onEdit}
              className="-me-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-orange-500 transition hover:bg-orange-50"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>

          <dl className="mt-4 divide-y divide-[#e7eaee] rounded-[18px] bg-[#f7f8f9] px-4">
            <InfoRow
              icon={<PhoneIcon className="h-5 w-5" />}
              label="رقم الهاتف"
              value={marketer.phone}
            />
            <InfoRow
              icon={<CalendarIcon className="h-5 w-5" />}
              label="تاريخ الانضمام"
              value={marketer.joinedOn}
            />
          </dl>
        </OfficeCard>

        <OfficeCard>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[17px] font-bold text-slate-900">الباقة</h2>
            {status ? <StatusTag status={status} /> : null}
          </div>
          <div className="mt-3 space-y-2.5">
            <StatPanel
              cells={[
                {
                  icon: <MegaphoneIcon className="h-5 w-5" />,
                  value: `${marketer.balance} إعلان`,
                  label: "الرصيد الحالي",
                },
                {
                  icon: <CalendarIcon className="h-5 w-5" />,
                  value: marketer.validUntil ?? "—",
                  label: "صالحة حتى",
                  ltr: marketer.validUntil !== null,
                },
              ]}
            />
            <StatPanel
              cells={[
                {
                  icon: <TransferIcon className="h-5 w-5" />,
                  value: transferred > 0 ? `${transferred} إعلان` : "—",
                  label: "إجمالي المحول",
                },
                {
                  icon: <CheckIcon className="h-5 w-5" />,
                  value: transferred > 0 ? `${used} إعلان` : "—",
                  label: "المستخدم من الرصيد",
                },
              ]}
            />
          </div>
        </OfficeCard>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-[16px] font-bold text-white transition hover:bg-orange-600 active:scale-[0.99] lg:mx-auto lg:max-w-sm"
      >
        <PencilIcon className="h-5 w-5" />
        <span>تعديل بيانات المسوق</span>
      </button>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-3 py-3">
      <dt className="flex items-center gap-2.5 text-[14px] text-slate-500">
        <span className="text-orange-500">{icon}</span>
        {label}
      </dt>
      <dd dir="ltr" className="text-[15px] font-bold text-slate-900">
        {value}
      </dd>
    </div>
  );
}

function TransfersTab({ marketer }: { marketer: Marketer }) {
  if (marketer.transfers.length === 0) {
    return <EmptyText text="لا توجد عمليات تحويل لهذا المسوق" />;
  }

  return (
    <ul className="grid gap-3 lg:grid-cols-2">
      {marketer.transfers.map((transfer) => (
        <li
          key={transfer.id}
          className="flex items-center gap-3 rounded-[22px] border border-line bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff4ec] text-orange-500">
            <TransferIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-slate-900">{transfer.source}</span>
            <span dir="ltr" className="block text-right text-[13px] text-slate-500">
              {transfer.date}
            </span>
          </span>
          <span dir="ltr" className="shrink-0 px-1 text-[18px] font-bold text-slate-900">
            +{transfer.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}

function EmptyText({ text }: { text: string }) {
  return <p className="px-6 py-16 text-center text-[15px] text-slate-500">{text}</p>;
}
