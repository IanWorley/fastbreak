import "~/styles/globals.css";

import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./_components/ThemeProvider";
import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { CSPostHogProvider } from "./_components/providers";
export const metadata: Metadata = {
  title: "FastBreak Analytics ",
  description: "A revolutionary sports analytics platform for basketball.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${GeistSans.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CSPostHogProvider>
              <TRPCReactProvider cookies={cookies().toString()}>
                {children}
                <Toaster />
                <Analytics />
                <SpeedInsights />
              </TRPCReactProvider>
            </CSPostHogProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
