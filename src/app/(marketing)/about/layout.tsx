import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Staybookt | Built by Operators, for Operators",
  description: "Staybookt was built in Canada to give every service business the growth tools that used to be reserved for companies with big budgets.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
