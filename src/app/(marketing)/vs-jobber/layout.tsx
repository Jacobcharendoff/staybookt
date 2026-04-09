import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staybookt vs Jobber | Comparison for Canadian Service Businesses",
  description: "Compare Staybookt and Jobber side by side. See why Canadian contractors choose Staybookt for bilingual support, Canadian tax compliance, and growth automation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
