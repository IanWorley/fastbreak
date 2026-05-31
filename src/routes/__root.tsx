import { ClerkProvider } from "@clerk/tanstack-react-start";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { ThemeProvider } from "~/components/ui/theme";
import { Toaster } from "~/components/ui/toast";
import { env } from "~/env";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fastbreak Analytics" },
      {
        name: "description",
        content: "Fastbreak Analytics a modern sports analytics platform",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <Outlet />
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </ClerkProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
        )}
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}
