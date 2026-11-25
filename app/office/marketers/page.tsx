import type { Metadata } from "next";
import { MarketersScreen } from "@/components/office/marketers-screen";

export const metadata: Metadata = {
  title: "إدارة المسوقين | بوعقار",
  description: "تفعيل المسوقين وتحويل الإعلانات لهم من باقة المكتب.",
};

export default function MarketersPage() {
  return <MarketersScreen />;
}
