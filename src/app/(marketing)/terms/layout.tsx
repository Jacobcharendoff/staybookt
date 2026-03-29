import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Growth OS™",
  description: "Growth OS terms of service. Governed by Ontario, Canada law.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
