"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import {
  CalendarIcon,
  CheckIcon,
  MegaphoneIcon,
  SparklesIcon,
} from "@/components/highlight/icons";
import {
  AD_PACKAGES,
  DEFAULT_PACKAGE_ID,
  findPackage,
  type AdPackage,
  type AdPackageId,
} from "@/lib/packages";
import { SelectedBar } from "@/components/shared/selected-bar";
import { CheckoutSheet } from "./checkout-sheet";

export function PackagesScreen() {
  const [selectedId, setSelectedId] = useState<AdPackageId>(DEFAULT_PACKAGE_ID);
  const [couponCode, setCouponCode] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const selected = findPackage(selectedId);

  return (
    <div className="min-h-dvh bg-white text-slate-800">
      <AppHeader title="باقات بوعقار الإعلانية" />

      <main className="mx-auto w-full max-w-md px-4 pt-5 pb-32 lg:max-w-5xl lg:px-8 lg:pt-10 lg:pb-16">
        <h2 className="mb-6 hidden text-center text-[28px] font-bold text-slate-900 lg:block">
          باقات بوعقار الإعلانية
        </h2>
        <DesktopCoupon couponCode={couponCode} onCouponChange={setCouponCode} />

        <div
          role="radiogroup"
          aria-label="باقات الإعلان"
          className="space-y-5 lg:hidden"
        >
          {AD_PACKAGES.map((plan) => (
            <MobilePackageCard
              key={plan.id}
              plan={plan}
              selected={plan.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <div className="hidden gap-6 lg:grid lg:grid-cols-2">
          {AD_PACKAGES.map((plan) => (
            <DesktopPackageCard
              key={plan.id}
              plan={plan}
              selected={plan.id === selectedId}
              onSelect={setSelectedId}
              onSubscribe={() => {
                setSelectedId(plan.id);
                setCheckoutOpen(true);
              }}
            />
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] lg:hidden">
        <SelectedBar
          label="الباقة المختارة"
          value={selected.name}
          valueLtr
          amount={`${selected.priceKwd} د.ك`}
          onClick={() => setCheckoutOpen(true)}
        />
      </div>

      {checkoutOpen ? (
        <CheckoutSheet
          plan={selected}
          couponCode={couponCode}
          onCouponChange={setCouponCode}
          onClose={() => setCheckoutOpen(false)}
        />
      ) : null}
    </div>
  );
}

function MobilePackageCard({
  plan,
  selected,
  onSelect,
}: {
  plan: AdPackage;
  selected: boolean;
  onSelect: (id: AdPackageId) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(plan.id)}
      className={`w-full rounded-[22px] border px-4 py-4 text-right transition ${
        selected
          ? "border-orange-200 bg-[#fff4ec] shadow-[0_8px_24px_rgba(254,110,0,0.1)]"
          : "border-line bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="flex items-end gap-2">
          <span className="text-[34px] font-bold leading-none text-slate-900">
            {plan.count}
          </span>
          <span className="pb-0.5 text-[15px] font-semibold text-slate-600">
            {plan.title}
          </span>
        </span>
        <span className="flex flex-col items-center gap-1">
          <span
            className={
              selected
                ? "grid h-7 w-7 place-items-center rounded-full bg-orange-500 text-white"
                : "h-7 w-7 rounded-full border-2 border-[#d5dbe0] bg-white"
            }
          >
            {selected ? <CheckIcon className="h-4 w-4" /> : null}
          </span>
          <span dir="ltr" className="text-[12px] font-medium text-slate-500">
            {plan.name}
          </span>
        </span>
      </span>

      {plan.pinnedNote ? (
        <span className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5">
          <SparklesIcon className="h-4 w-4 shrink-0 text-[#c25c1e]" />
          <span className="text-right text-[13px] font-semibold leading-5 text-[#c25c1e]">
            {plan.pinnedNote}
          </span>
        </span>
      ) : (
        <span className="mt-3 grid grid-cols-2 gap-2">
          <MetaChip
            icon={<MegaphoneIcon className="h-4 w-4 text-orange-500" />}
            value={`${plan.adValidityDays} يوم`}
            label="صلاحية الإعلان"
          />
          {plan.packageValidityDays ? (
            <MetaChip
              icon={<CalendarIcon className="h-4 w-4 text-orange-500" />}
              value={`${plan.packageValidityDays} يوم`}
              label="صلاحية الباقة"
            />
          ) : null}
        </span>
      )}

      {plan.featuredDays ? (
        <span className="mt-2 flex items-center gap-2 rounded-2xl bg-white px-3 py-3">
          <MegaphoneIcon className="h-4 w-4 shrink-0 text-orange-500" />
          <span className="text-right">
            <span className="block text-[15px] font-bold text-slate-800">
              {plan.featuredDays} يوم
            </span>
            <span className="block text-[12px] text-slate-500">مدة الإعلان المميز</span>
          </span>
        </span>
      ) : null}

      <span
        className={`mt-3 flex h-12 items-center justify-center rounded-full bg-white text-[26px] font-bold leading-none shadow-[0_10px_24px_rgba(15,23,42,0.22)] ${
          selected ? "text-orange-500" : "text-slate-800"
        }`}
      >
        {plan.priceKwd}
        <span className="ms-1 text-[14px] font-semibold">د.ك</span>
      </span>
    </button>
  );
}

function MetaChip({
  icon,
  value,
  label,
  roomy = false,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  roomy?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-2 rounded-2xl bg-[#f7f8f9] ${
        roomy ? "px-4 py-3" : "px-2.5 py-2"
      }`}
    >
      {icon}
      <span className="text-right">
        <span
          className={`block font-bold text-slate-800 ${roomy ? "text-[15px]" : "text-[13px]"}`}
        >
          {value}
        </span>
        <span className={`block text-slate-500 ${roomy ? "text-[12px]" : "text-[11px]"}`}>
          {label}
        </span>
      </span>
    </span>
  );
}

function DesktopPackageCard({
  plan,
  selected,
  onSelect,
  onSubscribe,
}: {
  plan: AdPackage;
  selected: boolean;
  onSelect: (id: AdPackageId) => void;
  onSubscribe: () => void;
}) {
  return (
    <article
      className={`flex h-full flex-col rounded-[24px] border p-6 ${
        selected
          ? "border-orange-200 bg-[#fff4ec] shadow-[0_10px_28px_rgba(254,110,0,0.12)]"
          : "border-line bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(plan.id)}
        className="flex flex-1 flex-col text-right"
      >
        <span className="flex items-start justify-between gap-4">
          <span className="flex items-end gap-2.5">
            <span className="text-[42px] font-bold leading-none text-slate-900">
              {plan.count}
            </span>
            <span className="pb-1 text-[16px] font-semibold text-slate-600">
              {plan.title}
            </span>
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <span
              className={
                selected
                  ? "grid h-8 w-8 place-items-center rounded-full bg-orange-500 text-white"
                  : "h-8 w-8 rounded-full border-2 border-[#d5dbe0] bg-white"
              }
            >
              {selected ? <CheckIcon className="h-4 w-4" /> : null}
            </span>
            <span dir="ltr" className="text-[13px] font-medium text-slate-500">
              {plan.name}
            </span>
          </span>
        </span>

        {plan.pinnedNote ? (
          <span className="mt-5 flex items-center gap-2 rounded-2xl bg-white px-4 py-3">
            <SparklesIcon className="h-5 w-5 shrink-0 text-[#c25c1e]" />
            <span className="text-right text-[14px] font-semibold leading-6 text-[#c25c1e]">
              {plan.pinnedNote}
            </span>
          </span>
        ) : (
          <span className="mt-5 grid grid-cols-2 gap-3">
            <MetaChip
              roomy
              icon={<MegaphoneIcon className="h-5 w-5 text-orange-500" />}
              value={`${plan.adValidityDays} يوم`}
              label="صلاحية الإعلان"
            />
            {plan.packageValidityDays ? (
              <MetaChip
                roomy
                icon={<CalendarIcon className="h-5 w-5 text-orange-500" />}
                value={`${plan.packageValidityDays} يوم`}
                label="صلاحية الباقة"
              />
            ) : null}
          </span>
        )}

        {plan.featuredDays ? (
          <span className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-4 py-3.5">
            <MegaphoneIcon className="h-5 w-5 shrink-0 text-orange-500" />
            <span className="text-right">
              <span className="block text-[16px] font-bold text-slate-800">
                {plan.featuredDays} يوم
              </span>
              <span className="block text-[13px] text-slate-500">مدة الإعلان المميز</span>
            </span>
          </span>
        ) : null}

        <span className="mt-auto block pt-6">
          <span
            className={`flex h-14 items-center justify-center rounded-full bg-white text-[28px] font-bold leading-none shadow-[0_10px_24px_rgba(15,23,42,0.18)] ${
              selected ? "text-orange-500" : "text-slate-800"
            }`}
          >
            {plan.priceKwd}
            <span className="ms-1 text-[15px] font-semibold">د.ك</span>
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={onSubscribe}
        className="mt-4 h-12 rounded-xl border border-slate-200 bg-white text-[15px] font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
      >
        اشتراك
      </button>
    </article>
  );
}

function DesktopCoupon({
  couponCode,
  onCouponChange,
}: {
  couponCode: string;
  onCouponChange: (code: string) => void;
}) {
  const [draft, setDraft] = useState(couponCode);

  function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    onCouponChange(next);
  }

  return (
    <form onSubmit={applyCoupon} className="mx-auto mb-8 hidden w-full max-w-sm lg:block">
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="كود الخصم"
          aria-label="كود الخصم"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 text-[14px] outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
        />
        <button
          type="submit"
          disabled={draft.trim().length === 0}
          className="h-11 shrink-0 rounded-xl bg-orange-500 px-4 text-[14px] font-bold text-white disabled:opacity-40"
        >
          تطبيق
        </button>
      </div>
      {couponCode ? (
        <p className="mt-2 text-center text-[13px] text-slate-500">
          تم إدخال الكوبون{" "}
          <span dir="ltr" className="font-bold text-slate-800">
            {couponCode}
          </span>
        </p>
      ) : null}
    </form>
  );
}
