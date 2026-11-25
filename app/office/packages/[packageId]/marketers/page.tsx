import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SelectMarketersScreen } from "@/components/office/select-marketers-screen";
import { isOfficePackageId, OFFICE_PACKAGES } from "@/lib/office";

export const metadata: Metadata = {
  title: "اختيار المسوقين | بوعقار",
  description: "اختر المسوقين الذين تريد تفعيلهم مع باقة المكتب.",
};

export function generateStaticParams() {
  return OFFICE_PACKAGES.map((plan) => ({ packageId: plan.id }));
}

export default function SelectMarketersPage({
  params,
}: PageProps<"/office/packages/[packageId]/marketers">) {
  // Known package ids resolve at build time, so this boundary is part of
  // the prerendered page; only unknown ids wait for the request.
  return (
    <Suspense fallback={null}>
      <SelectMarketers params={params} />
    </Suspense>
  );
}

async function SelectMarketers({
  params,
}: Pick<PageProps<"/office/packages/[packageId]/marketers">, "params">) {
  const { packageId } = await params;
  if (!isOfficePackageId(packageId)) notFound();
  return <SelectMarketersScreen packageId={packageId} />;
}
