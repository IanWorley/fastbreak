import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { AppRouter, appRouter } from "@/src/server/index";
import { createTRPCContext } from "@/src/server/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
