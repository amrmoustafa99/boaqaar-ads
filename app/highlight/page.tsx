import type { Metadata } from "next";
import { HighlightScreen } from "@/components/highlight/highlight-screen";

export const metadata: Metadata = {
  title: "تمييز إعلان | بوعقار",
  description: "اختر مدة تمييز الإعلان وعبارة الظهور على بوعقار.",
};

export default function HighlightPage() {
  return <HighlightScreen />;
}
