import { PrismaClient } from "@prisma/client/edge";
import { teamsRouter } from "./api/routes/team";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import { User } from "@clerk/nextjs/server";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";

//* Define your routes here and state if there using either `publicProcedure` or `privateProcedure`
//TODO Add two route types one for view dashboard and one for view teams and games

type Context = {
  prisma: PrismaClient<PrismaClientOptions, never, DefaultArgs>;
  user: User;
};

export const appRouter = router({
  getTodos: protectedProcedure.query(async () => {
    return [10, 20, 30];
  }),
  TeamRouter: teamsRouter,
});

export type AppRouter = typeof appRouter;
