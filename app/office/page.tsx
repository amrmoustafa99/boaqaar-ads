import type { Metadata } from "next";
import { OfficeIndex } from "@/components/office/office-index";

export const metadata: Metadata = {
  title: "شاشات المكاتب | بوعقار",
  description: "صفحة مراجعة لشاشات باقات المكاتب وإدارة المسوقين.",
};

export default function OfficePage() {
  return <OfficeIndex />;
}
