import { createTRPCContext } from "@/src/server/trpc";
import { appRouter } from "@/src/server/index";

// Use ServerClient to call procedures while using SSG or SSR
export const serverClient = appRouter.createCaller(createTRPCContext());
