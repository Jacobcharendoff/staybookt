import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth OS vs ServiceTitan | Comparison for Canadian Contractors",
  description: "Compare Growth OS and ServiceTitan side by side. See why Canadian service businesses are switching from ServiceTitan's enterprise pricing to Growth OS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
