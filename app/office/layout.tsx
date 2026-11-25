import { OfficeStoreProvider } from "@/components/office/office-store";

export default function OfficeLayout({ children }: LayoutProps<"/office">) {
  return <OfficeStoreProvider>{children}</OfficeStoreProvider>;
}
