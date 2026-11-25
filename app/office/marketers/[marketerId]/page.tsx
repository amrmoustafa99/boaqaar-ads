import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  MarketerDetailsFromUrl,
  MarketerDetailsScreen,
} from "@/components/office/marketer-details-screen";
import { MOCK_MARKETER_IDS } from "@/lib/office";

export const metadata: Metadata = {
  title: "تفاصيل المسوق | بوعقار",
  description: "بيانات المسوق وإعلاناته وعمليات التحويل له.",
};

export function generateStaticParams() {
  return MOCK_MARKETER_IDS.map((marketerId) => ({ marketerId }));
}

export default function MarketerPage({
  params,
}: PageProps<"/office/marketers/[marketerId]">) {
  // Known ids resolve at build time, so this boundary is part of the
  // prerendered page; only unknown ids wait for the request.
  return (
    <Suspense fallback={null}>
      <MarketerDetails params={params} />
    </Suspense>
  );
}

async function MarketerDetails({
  params,
}: Pick<PageProps<"/office/marketers/[marketerId]">, "params">) {
  const { marketerId } = await params;
  if (!MOCK_MARKETER_IDS.includes(marketerId)) notFound();

  // `?tab=` is read on the client. Until then the page shows the default
  // tab with real data, so there is no loading state.
  return (
    <Suspense fallback={<MarketerDetailsScreen marketerId={marketerId} tab="data" />}>
      <MarketerDetailsFromUrl marketerId={marketerId} />
    </Suspense>
  );
}
