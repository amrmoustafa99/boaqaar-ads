import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "بوعقار",
  description: "تمييز الإعلان وباقات بوعقار الإعلانية.",
};

const links = [
  { href: "/highlight", label: "تمييز الإعلان" },
  { href: "/packages", label: "باقات بوعقار الإعلانية" },
  { href: "/office/packages", label: "باقات المكاتب" },
  { href: "/office/marketers", label: "إدارة المسوقين" },
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
      <p className="text-center text-[28px] font-extrabold text-orange-500">بوعقار</p>
      <h1 className="mt-2 text-center text-[16px] font-semibold text-slate-600">
        خدمات الإعلان
      </h1>
      <div className="mt-8 flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex h-14 items-center justify-center rounded-full bg-orange-500 px-5 text-center text-[16px] font-bold text-white transition hover:bg-orange-600"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
