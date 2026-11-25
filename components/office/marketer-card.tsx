import Link from "next/link";
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronEndIcon,
  LockIcon,
  MegaphoneIcon,
  PlusCircleIcon,
} from "@/components/highlight/icons";
import { formatKwdAmount } from "@/lib/highlight";
import {
  MARKETER_ACTIVATION_FEE_KWD,
  marketerPackageLabel,
  type Marketer,
} from "@/lib/office";
import { OfficeCard, StatPanel, StepperRow } from "./office-ui";

type MarketerCardProps = {
  marketer: Marketer;
  /** False when the office package is expired: no activation, no transfers. */
  editable: boolean;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  transferValue: number;
  transferMax: number;
  onTransferChange: (id: string, value: number) => void;
};

const fee = `${formatKwdAmount(MARKETER_ACTIVATION_FEE_KWD)} د.ك`;

export function MarketerCard({
  marketer,
  editable,
  selected,
  onToggleSelect,
  transferValue,
  transferMax,
  onTransferChange,
}: MarketerCardProps) {
  return (
    <OfficeCard className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[17px] font-bold leading-7 text-slate-900">{marketer.name}</p>
          <p dir="ltr" className="text-right text-[14px] text-slate-500">
            {marketer.phone}
          </p>
        </div>
        <Link
          href={`/office/marketers/${marketer.id}`}
          className="-me-2 inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-2 text-[14px] font-semibold text-orange-600 transition hover:bg-orange-50"
        >
          <span>التفاصيل</span>
          <ChevronEndIcon className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-2 text-[13px] text-slate-500">
        الباقة: {marketerPackageLabel(marketer.status)}
      </p>

      <div className="mt-3">
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
      </div>

      {editable && marketer.status === "not_activated" ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onToggleSelect(marketer.id)}
          className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border text-[15px] font-bold transition active:scale-[0.99] ${
            selected
              ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
              : "border-orange-400 bg-white text-orange-600 hover:bg-orange-50"
          }`}
        >
          {selected ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <PlusCircleIcon className="h-5 w-5" />
          )}
          <span>{selected ? `تم الاختيار — ${fee}` : `تفعيل التحويل — ${fee}`}</span>
        </button>
      ) : null}

      {editable && marketer.status === "active" ? (
        <div className="mt-3">
          <StepperRow
            label="تحويل إعلانات"
            value={transferValue}
            max={transferMax}
            subject={marketer.name}
            onChange={(value) => onTransferChange(marketer.id, value)}
          />
        </div>
      ) : null}

      {editable && marketer.status === "locked" ? (
        <p className="mt-3 flex items-start gap-2 text-[13px] leading-6 text-slate-500">
          <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>رصيد من دورة مكتب سابقة — لا يمكن التحويل حتى انتهائه</span>
        </p>
      ) : null}
    </OfficeCard>
  );
}
