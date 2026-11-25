"use client";

import Link from "next/link";
import { OFFICE_SCENARIOS } from "@/lib/office";
import { useOfficeStore } from "./office-store";

const links = [
  { href: "/office/packages", label: "باقات المكاتب" },
  { href: "/office/packages/premium/marketers", label: "اختيار المسوقين" },
  { href: "/office/marketers", label: "إدارة المسوقين" },
  { href: "/office/marketers/m6", label: "تفاصيل المسوق" },
] as const;

/** Demo index for reviewing the office flow (no design). */
export function OfficeIndex() {
  const { state, setScenario } = useOfficeStore();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
      <p className="text-center text-[28px] font-extrabold text-orange-500">بوعقار</p>
      <h1 className="mt-2 text-center text-[16px] font-semibold text-slate-600">
        شاشات المكاتب
      </h1>

      <section aria-labelledby="scenario-heading" className="mt-8">
        <h2 id="scenario-heading" className="mb-3 text-[14px] font-semibold text-slate-600">
          السيناريو
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {OFFICE_SCENARIOS.map((scenario) => {
            const active = scenario.id === state.scenario;
            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={active}
                onClick={() => setScenario(scenario.id)}
                className={`min-h-12 rounded-2xl border px-2 text-[13px] font-bold transition ${
                  active
                    ? "border-orange-500 bg-[#fff4ec] text-orange-600"
                    : "border-line bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {scenario.label}
              </button>
            );
          })}
        </div>
      </section>

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
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-full text-[15px] font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          الرئيسية
        </Link>
      </div>
    </main>
  );
}
