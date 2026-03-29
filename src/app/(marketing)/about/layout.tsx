import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Growth OS™ | Built by Operators, for Operators",
  description: "Growth OS was built in Canada to give every service business the growth tools that used to be reserved for companies with big budgets.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
