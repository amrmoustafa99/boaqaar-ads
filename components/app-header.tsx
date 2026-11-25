import Link from "next/link";
import type { ReactNode } from "react";
import { BackArrowIcon } from "@/components/highlight/icons";

type AppHeaderProps = {
  title: string;
  surface?: "white" | "muted";
  /** Where the back button goes. Defaults to the home page. */
  backHref?: string;
  /** Optional icon button on the end side, usually a `HeaderIconButton`. */
  action?: ReactNode;
  /**
   * Mobile only: put the back button in a raised white circle and give the
   * header a little more height for its shadow. Used by the office screens.
   */
  raised?: boolean;
};

const surfaceClass = {
  white: "bg-white",
  muted: "bg-[#eef3f6]",
} as const;

/** White circle with a soft shadow, as behind the app's header icons. */
export const RAISED_ICON_CLASS =
  "grid h-11 w-11 place-items-center rounded-full bg-white shadow-[0_4px_16px_rgba(15,23,42,0.12)] transition hover:bg-slate-50 active:scale-95";

/** Icon-only header button in a raised white circle (for "+" or "⋮"). */
export function HeaderIconButton({
  label,
  onClick,
  className = "text-slate-700",
  children,
}: {
  label: string;
  onClick?: () => void;
  /** Icon colour, e.g. "text-orange-500". */
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`${RAISED_ICON_CLASS} ${className}`}
    >
      {children}
    </button>
  );
}

export function AppHeader({
  title,
  surface = "white",
  backHref = "/",
  action,
  raised = false,
}: AppHeaderProps) {
  return (
    <>
      <header
        className={`sticky top-0 z-20 pt-[env(safe-area-inset-top)] lg:hidden ${surfaceClass[surface]}`}
      >
        <div
          className={`relative mx-auto flex w-full max-w-md items-center justify-center px-4 ${
            raised ? "h-16" : "h-12"
          }`}
        >
          <h1 className="text-[17px] font-bold text-slate-800">{title}</h1>
          <Link
            href={backHref}
            aria-label="رجوع"
            className={
              raised
                ? `absolute start-4 top-1/2 -translate-y-1/2 text-slate-700 ${RAISED_ICON_CLASS}`
                : "absolute start-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-slate-700 transition hover:bg-black/5"
            }
          >
            <BackArrowIcon className="h-[22px] w-[22px]" />
          </Link>
          {action ? (
            <div
              className={`absolute top-1/2 -translate-y-1/2 ${raised ? "end-4" : "end-1"}`}
            >
              {action}
            </div>
          ) : null}
        </div>
      </header>

      <header className="hidden border-b border-slate-200/80 bg-white lg:block">
        <div className="mx-auto flex h-[72px] w-full max-w-5xl items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[22px] font-extrabold text-orange-500">
              بوعقار
            </Link>
            <span className="h-5 w-px bg-slate-200" aria-hidden="true" />
            <h1 className="text-[18px] font-bold text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {action}
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <BackArrowIcon className="h-4 w-4" />
              <span>رجوع</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
