import type { Metadata } from "next";
import { PackagesScreen } from "@/components/packages/packages-screen";

export const metadata: Metadata = {
  title: "باقات بوعقار الإعلانية | بوعقار",
  description: "باقات الإعلان One و One + على بوعقار.",
};

export default function PackagesPage() {
  return <PackagesScreen />;
}
