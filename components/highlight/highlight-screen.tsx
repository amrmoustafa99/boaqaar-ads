"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import {
  DEFAULT_HIGHLIGHT_DAYS,
  DEFAULT_HIGHLIGHT_PHRASE_ID,
  formatKwdAmount,
  HIGHLIGHT_PRICE_KWD,
  highlightDayUnit,
  highlightPhraseLabel,
  type HighlightPhraseId,
} from "@/lib/highlight";
import { CouponSection } from "./coupon-section";
import { DurationSelector } from "./duration-selector";
import { HighlightActionButton } from "./highlight-action-button";
import { PhraseSelector } from "./phrase-selector";

export function HighlightScreen() {
  const [days, setDays] = useState(DEFAULT_HIGHLIGHT_DAYS);
  const [phraseId, setPhraseId] = useState<HighlightPhraseId>(
    DEFAULT_HIGHLIGHT_PHRASE_ID,
  );
  const [couponCode, setCouponCode] = useState("");

  const phraseLabel = highlightPhraseLabel(phraseId);
  const dayUnit = highlightDayUnit(days);
  const priceAmount = formatKwdAmount(HIGHLIGHT_PRICE_KWD);

  return (
    <div className="min-h-dvh bg-white text-slate-800">
      <AppHeader title="تمييز إعلان" />

      <main className="mx-auto w-full max-w-md px-4 pt-5 pb-28 lg:max-w-5xl lg:px-8 lg:pt-10 lg:pb-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,36rem)_22rem] lg:items-start lg:justify-between lg:gap-12">
          <div>
            <DurationSelector days={days} onChange={setDays} />
            <div className="mt-6 lg:mt-6">
              <PhraseSelector value={phraseId} onChange={setPhraseId} />
            </div>
            <div className="mt-3.5 lg:mt-6">
              <CouponSection code={couponCode} onCodeChange={setCouponCode} />
            </div>
          </div>

          <aside className="mt-8 hidden lg:sticky lg:top-8 lg:mt-0 lg:block">
            <div className="rounded-[24px] border border-line bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
              <h2 className="text-[18px] font-bold text-slate-900">
                ملخص التمييز
              </h2>
              <dl className="mt-5 space-y-4 text-[14px]">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">مدة التمييز</dt>
                  <dd className="font-bold text-slate-900">
                    {days} {dayUnit}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-500">عبارة التمييز</dt>
                  <dd className="font-bold text-slate-900">{phraseLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-[#e7eef1] pt-4">
                  <dt className="text-slate-500">السعر</dt>
                  <dd className="font-bold text-slate-900">
                    <span className="tabular-nums">{priceAmount}</span> د.ك
                  </dd>
                </div>
                {couponCode ? (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">الكوبون</dt>
                    <dd dir="ltr" className="font-bold text-slate-900">
                      {couponCode}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-6">
                <HighlightActionButton />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto w-full max-w-md rounded-[22px] border border-line bg-white px-3 py-2.5 shadow-[0_8px_28px_rgba(15,23,42,0.12)]">
          <HighlightActionButton />
        </div>
      </div>
    </div>
  );
}
