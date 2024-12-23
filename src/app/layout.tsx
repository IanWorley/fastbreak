import { ClerkProvider } from "@clerk/nextjs";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "~/app/_components/ui/theme";
import { Toaster } from "~/app/_components/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import { cn } from "~/lib/utils";
import "~/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://fastbreak.vercel.app"
      : "http://localhost:3000",
  ),
  title: "Fastbreak Analytics",
  description: "Fastbreak Analytics a modern sports analytics platform",
  openGraph: {
    title: "Fastbreak Analytics",
    description: "Fastbreak Analytics a modern sports analytics platform",
    url: "https://fastbreak.vercel.app",
    siteName: "Fastbreak Analytics",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@jullerino",
  //   creator: "@jullerino",
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
