import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/src/server/index";

export const trpc = createTRPCReact<AppRouter>({});
