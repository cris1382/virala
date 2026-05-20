import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virala — AI Video & Image Generation",
  description: "Generate stunning videos and images with AI-powered tools.",
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
