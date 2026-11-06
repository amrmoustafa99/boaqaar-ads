"use client";

import { useState, type FormEvent } from "react";
import { CouponIcon } from "./icons";

type CouponSectionProps = {
  code: string;
  onCodeChange: (code: string) => void;
};

export function CouponSection({ code, onCodeChange }: CouponSectionProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(code);

  function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    onCodeChange(next);
  }

  function clearCoupon() {
    setDraft("");
    onCodeChange("");
  }

  return (
    <section
      aria-labelledby="coupon-heading"
      className={`overflow-hidden border border-line bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] ${open ? "rounded-[22px]" : "rounded-full"}`}
    >
      <h2 id="coupon-heading" className="sr-only">
        كوبون الخصم
      </h2>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="coupon-panel"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-12 w-full items-center justify-center px-12"
      >
        <CouponIcon className="absolute right-4 h-6 w-6 text-orange-500" />
        <span className="text-[15px] font-medium text-slate-600">
          هل لديك كوبون خصم؟
        </span>
      </button>

      {!open && code ? (
        <p className="px-4 pb-4 text-[13px] text-slate-500">
          الكوبون المدخل:{" "}
          <span dir="ltr" className="font-bold text-slate-800">
            {code}
          </span>
        </p>
      ) : null}

      <div
        id="coupon-panel"
        inert={!open}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <form
            onSubmit={applyCoupon}
            className="border-t border-[#e7eef1] px-4 py-4"
          >
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="أدخل كود الخصم"
                aria-label="كود الخصم"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
              />
              <button
                type="submit"
                disabled={draft.trim().length === 0}
                className="h-11 shrink-0 rounded-xl bg-orange-500 px-4 text-[14px] font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                تطبيق
              </button>
            </div>
            {code ? (
              <div className="mt-3 flex items-center justify-between gap-3 text-[13px]">
                <p className="text-slate-500">
                  تم إدخال الكوبون{" "}
                  <span dir="ltr" className="font-bold text-slate-800">
                    {code}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={clearCoupon}
                  className="font-semibold text-orange-600"
                >
                  إزالة
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
