import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Switch to Growth OS™ | Easy Migration from ServiceTitan, Jobber, or Housecall Pro",
  description: "Moving from another CRM? Growth OS makes switching easy. No long setup. No vendor lock-in. Bilingual, Canadian-first platform built for service businesses.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
