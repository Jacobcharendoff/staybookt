import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "Growth OS™ - The Operating System for Service Business Growth",
  description: "The all-in-one CRM and pipeline management platform built for service businesses. Manage leads, automate follow-ups, and grow revenue.",
  keywords: "CRM, field service software, plumbing software, HVAC software, electrical software, contractor management, pipeline management, Canadian CRM",
  robots: "index, follow",
  openGraph: {
    title: "Growth OS™ — The CRM Built for Canadian Service Businesses",
    description: "Bilingual CRM with pipeline management, automations, and Canadian tax compliance. Built for plumbers, HVAC techs, electricians, and more.",
    type: "website",
    url: "https://growth-os-three-pied.vercel.app",
    images: [
      {
        url: "https://growth-os-three-pied.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Growth OS™",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://growth-os-three-pied.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
