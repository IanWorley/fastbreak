import { router, protectedProcedure } from "@/src/server/trpc";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

export const gameRouter = router({
  grabGames: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: false,

        prefix: "@upstash/ratelimit",
      });

      const { success } = await ratelimit.limit(ctx.user.id);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      const teamId = z.coerce.number().safeParse(input);

      if (!teamId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      try {
        ctx.db.team.findUniqueOrThrow({
          where: {
            id: teamId.data,
            users_id: ctx.user.id,
          },
        });

        return await ctx.db.game.findMany({
          where: {
            teamId: teamId.data,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }
    }),

  createGame: protectedProcedure
    .input(z.object({ teamId: z.number().positive(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: false,

        prefix: "@upstash/ratelimit",
      });

      const { success } = await ratelimit.limit(ctx.user.id);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      const teamId = z.coerce.number().safeParse(input.teamId);

      if (!teamId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      try {
        ctx.db.team.findUniqueOrThrow({
          where: {
            id: teamId.data,
            users_id: ctx.user.id,
          },
        });

        return await ctx.db.game.create({
          data: {
            name: input.name,
            teamId: teamId.data,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }
    }),

  grabGame: protectedProcedure
    .input(z.object({ gameId: z.string(), teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: false,

        prefix: "@upstash/ratelimit",
      });

      const { success } = await ratelimit.limit(ctx.user.id);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      const gameId = z.coerce.number().safeParse(input.gameId);
      const teamId = z.coerce.number().safeParse(input.teamId);

      if (!gameId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }
      if (!teamId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      try {
        ctx.db.team.findUniqueOrThrow({
          where: {
            id: teamId.data,
            users_id: ctx.user.id,
          },
        });

        return await ctx.db.game.findUnique({
          where: {
            id: gameId.data,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }
    }),

  grabPlayersShotsFromGame: protectedProcedure
    .input(z.object({ gameId: z.string(), teamId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "10 s"),
        analytics: false,

        prefix: "@upstash/ratelimit",
      });

      const { success } = await ratelimit.limit(ctx.user.id);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      const gameId = z.coerce.number().safeParse(input.gameId);
      const teamId = z.coerce.number().safeParse(input.teamId);

      if (!gameId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }
      if (!teamId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      try {
        ctx.db.team.findUniqueOrThrow({
          where: {
            id: teamId.data,
            users_id: ctx.user.id,
          },
        });

        return await ctx.db.shot.findMany({
          where: {
            gameId: gameId.data,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }
    }),
});
