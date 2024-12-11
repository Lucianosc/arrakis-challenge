import { type PropsWithChildren } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import { Header } from "~~/components/Header";
import { Providers } from "~~/providers/Providers";
import "~~/styles/globals.css";

// Metadata Next.js 14
export const metadata: Metadata = {
  title: "Arrakis Vault",
  description: "Arrakis challenge",
};

// Using proper TypeScript types for layout components
export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen bg-neutral-800 relative">
            <Header />
            <main className="relative flex flex-col flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
