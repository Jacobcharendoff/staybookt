import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Staybookt",
  description: "Staybookt terms of service. Governed by Ontario, Canada law.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
