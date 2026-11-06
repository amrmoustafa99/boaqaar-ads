import Link from "next/link";
import { BackArrowIcon } from "@/components/highlight/icons";

type AppHeaderProps = {
  title: string;
  surface?: "white" | "muted";
};

const surfaceClass = {
  white: "bg-white",
  muted: "bg-[#eef3f6]",
} as const;

export function AppHeader({ title, surface = "white" }: AppHeaderProps) {
  return (
    <>
      <header
        className={`sticky top-0 z-20 pt-[env(safe-area-inset-top)] lg:hidden ${surfaceClass[surface]}`}
      >
        <div className="relative mx-auto flex h-12 w-full max-w-md items-center justify-center px-4">
          <h1 className="text-[17px] font-bold text-slate-800">{title}</h1>
          <Link
            href="/"
            aria-label="رجوع"
            className="absolute start-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-slate-700 transition hover:bg-black/5"
          >
            <BackArrowIcon className="h-[22px] w-[22px]" />
          </Link>
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
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <BackArrowIcon className="h-4 w-4" />
            <span>رجوع</span>
          </Link>
        </div>
      </header>
    </>
  );
}
