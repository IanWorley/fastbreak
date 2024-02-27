import { gameRouter } from "./router/game";
import { playerRouter } from "./router/player";
import { teamsRouter } from "./router/team";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  team: teamsRouter,
  game: gameRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
