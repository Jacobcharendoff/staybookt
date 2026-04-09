import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staybookt vs ServiceTitan | Comparison for Canadian Contractors",
  description: "Compare Staybookt and ServiceTitan side by side. See why Canadian service businesses are switching from ServiceTitan's enterprise pricing to Staybookt.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
