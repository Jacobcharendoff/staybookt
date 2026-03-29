import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Growth OS™",
  description: "How Growth OS collects, uses, and protects your data. PIPEDA compliant. Canadian data privacy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
