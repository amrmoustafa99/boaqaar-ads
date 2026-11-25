import type { ReactNode } from "react";
import { CloseIcon, DocumentIcon } from "@/components/highlight/icons";

type SheetProps = {
  /** id of the element that names the dialog (usually the title). */
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Bottom sheet on mobile, centered modal on desktop.
 * The backdrop closes it; the content decides its own header.
 */
export function Sheet({ labelledBy, onClose, children }: SheetProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center lg:items-center lg:p-6">
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-slate-900/45"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white px-5 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(15,23,42,0.16)] lg:rounded-[28px]"
      >
        {children}
      </section>
    </div>
  );
}

type SheetHeaderProps = {
  titleId: string;
  title: string;
  subtitle: string;
  onClose: () => void;
};

/**
 * Header of the office sheets (L3 / L6): grab handle, document icon and
 * title on the start side, close button on the end side.
 */
export function SheetHeader({ titleId, title, subtitle, onClose }: SheetHeaderProps) {
  return (
    <>
      <div aria-hidden="true" className="mx-auto -mt-1 mb-4 h-1.5 w-12 rounded-full bg-slate-200 lg:hidden" />
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#f3f4f6] text-slate-500">
          <DocumentIcon className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 id={titleId} className="text-[18px] font-bold leading-7 text-slate-900">
            {title}
          </h2>
          <p className="text-[13px] text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          aria-label="إغلاق"
          onClick={onClose}
          className="-me-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
