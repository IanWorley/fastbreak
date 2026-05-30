import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { createStart } from "@tanstack/react-start";

import { env } from "./env";

export const startInstance = createStart(() => ({
  requestMiddleware: [
    clerkMiddleware({
      publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKey: env.CLERK_SECRET_KEY,
    }),
  ],
}));
