import { publicProcedure, protectedProcedure, router } from "./trpc";

//* Define your routes here and state if there using either `publicProcedure` or `privateProcedure`
//TODO Add two route types one for view dashboard and one for view teams and games

export const appRouter = router({
  getTodos: protectedProcedure.query(async () => {
    return [10, 20, 30];
  }),
});

export type AppRouter = typeof appRouter;
