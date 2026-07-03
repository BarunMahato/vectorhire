import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VectorHire | Autonomous AI Job Hunting",
  description:
    "VectorHire helps students and recruiters discover opportunities, sync job intelligence, and generate personalized application drafts with AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
