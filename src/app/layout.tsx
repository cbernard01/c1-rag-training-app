import { Providers } from "@/providers";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "C1 Northstar",
  description: "C1 Northstar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="C1 Northstar" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
