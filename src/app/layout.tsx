import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "pg 50",
  description: "para alexa",
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
