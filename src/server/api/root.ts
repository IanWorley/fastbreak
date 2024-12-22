import { gameRouter } from "./routers/game";
import { playerRouter } from "./routers/player";
import { teamsRouter } from "./routers/team";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  team: teamsRouter,
  game: gameRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
