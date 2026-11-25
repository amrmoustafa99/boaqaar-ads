"use client";

import { useState, type FormEvent } from "react";

type CouponFormProps = {
  /** The code currently applied, shown under the field. Empty for none. */
  appliedCode: string;
  onApply: (code: string) => void;
  /** Error shown under the field instead of the applied code. */
  error?: string;
};

/** Grey "كود الخصم" panel used in the checkout sheets. */
export function CouponForm({ appliedCode, onApply, error }: CouponFormProps) {
  const [draft, setDraft] = useState(appliedCode);

  function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    onApply(next);
  }

  return (
    <form onSubmit={applyCoupon} className="mt-5 rounded-[20px] bg-[#f3f4f6] p-4">
      <p className="mb-3 text-right text-[14px] font-semibold text-slate-700">
        كود الخصم
      </p>
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="أدخل كود الخصم"
          aria-label="كود الخصم"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "coupon-error" : undefined}
          autoComplete="off"
          className="h-12 min-w-0 flex-1 rounded-full border border-[#e6e8ec] bg-white px-4 text-right text-[14px] text-slate-800 outline-none placeholder:text-right placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 aria-invalid:border-[#d9534f]"
        />
        <button
          type="submit"
          disabled={draft.trim().length === 0}
          className="h-12 shrink-0 rounded-full bg-orange-500 px-5 text-[15px] font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed"
        >
          تطبيق
        </button>
      </div>
      {error ? (
        <p id="coupon-error" role="alert" className="mt-2 text-right text-[13px] font-semibold text-[#b23a33]">
          {error}
        </p>
      ) : appliedCode ? (
        <p className="mt-2 text-right text-[13px] text-slate-500">
          تم إدخال الكوبون{" "}
          <span dir="ltr" className="font-bold text-slate-800">
            {appliedCode}
          </span>
        </p>
      ) : null}
    </form>
  );
}
