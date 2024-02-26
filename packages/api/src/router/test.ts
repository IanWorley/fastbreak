import { createTRPCRouter, publicProcedure } from "../trpc";

export const testRouter = createTRPCRouter({
  all: publicProcedure.query(() => {
    return "Hello, world!";
  }),
});
