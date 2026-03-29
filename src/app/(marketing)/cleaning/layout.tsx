import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cleaning Business CRM | Reduce No-Shows & Fill Your Schedule | Growth OS™",
  description: "CRM for cleaning companies in Canada. Automate recurring bookings, reduce cancellations, get more 5-star reviews.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
