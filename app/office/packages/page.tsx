import type { Metadata } from "next";
import { OfficePackagesScreen } from "@/components/office/office-packages-screen";

export const metadata: Metadata = {
  title: "باقات المكاتب | بوعقار",
  description: "باقات بوعقار الإعلانية الخاصة بالمكاتب العقارية.",
};

export default function OfficePackagesPage() {
  return <OfficePackagesScreen />;
}
