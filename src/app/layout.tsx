import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEO Snapshot Scorer",
  description:
    "AI-driven AEO snapshot tool — modular, explainable brand positioning analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
