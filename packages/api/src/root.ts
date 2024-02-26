import { gameRouter } from "./router/game";
import { playerRouter } from "./router/player";
import { postRouter } from "./router/post";
import { teamsRouter } from "./router/team";
import { testRouter } from "./router/test";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  // auth: authRouter,
  post: postRouter,
  team: teamsRouter,
  game: gameRouter,
  player: playerRouter,
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
