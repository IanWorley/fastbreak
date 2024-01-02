import { gameRouter } from "./api/routes/game";
import { playerRouter } from "./api/routes/player";
import { teamsRouter } from "./api/routes/team";
import { protectedProcedure, router } from "./trpc";

//* Define your routes here and state if there using either `publicProcedure` or `privateProcedure`
//TODO Add two route types one for view dashboard and one for view teams and games

export const appRouter = router({
  getTodos: protectedProcedure.query(async () => {
    return [10, 20, 30];
  }),
  TeamRouter: teamsRouter,
  GameRouter: gameRouter,
  PlayerRouter: playerRouter,
});

export type AppRouter = typeof appRouter;
