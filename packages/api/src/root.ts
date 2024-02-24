import { gameRouter } from "./router/game";
import { playerRouter } from "./router/player";
import { postRouter } from "./router/post";
import { teamsRouter } from "./router/team";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  // auth: authRouter,
  post: postRouter,
  team: teamsRouter,
  game: gameRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
