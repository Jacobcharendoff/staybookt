import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth OS vs Jobber | Comparison for Canadian Service Businesses",
  description: "Compare Growth OS and Jobber side by side. See why Canadian contractors choose Growth OS for bilingual support, Canadian tax compliance, and growth automation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
