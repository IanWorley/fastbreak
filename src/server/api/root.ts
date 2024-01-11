import { createTRPCRouter } from "~/server/api/trpc";
import { teamsRouter } from "./routers/team";
import { gameRouter } from "./routers/game";
import { playerRouter } from "./routers/player";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  team: teamsRouter,
  game: gameRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
