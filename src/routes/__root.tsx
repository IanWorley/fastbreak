import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import * as React from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '~/components/ui/theme'
import { Toaster } from '~/components/ui/toast'
import { TRPCReactProvider } from '~/trpc/react'
import { ClerkProvider } from '@clerk/tanstack-start'
import { cn } from '~/lib/utils'
import '~/styles/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Fastbreak Analytics',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
        </head>
        <body
          className={cn(
            'min-h-screen bg-background font-sans text-foreground antialiased',
            GeistSans.variable,
            GeistMono.variable,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TRPCReactProvider>
              <Outlet />
            </TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  )
}
