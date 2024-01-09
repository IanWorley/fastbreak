import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "../lib/utils";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Provider from "./_trpc/Provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <SpeedInsights />
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Provider>{children}</Provider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
