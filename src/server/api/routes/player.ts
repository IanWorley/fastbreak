import { router, publicProcedure, protectedProcedure } from "@/src/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters

export const playerRouter = router({
  addPlayer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        jerseyNumber: z.number().positive(),
        teamId: z.string(),
      })
    )
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
      const jerseyNumber = z.coerce.number().safeParse(input.jerseyNumber);

      if (!jerseyNumber.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Jersey number not found",
        });
      }

      if (!teamId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      try {
        const team = await ctx.db.team.findUniqueOrThrow({
          where: {
            id: teamId.data,
            users_id: ctx.user.id,
          },
        });

        return await ctx.db.player.create({
          data: {
            name: input.name,
            jersey: jerseyNumber.data,
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

  addShots: protectedProcedure
    .input(
      z.object({
        points: z.number().min(0).max(3),
        playerId: z.string(),
        teamId: z.string(),
        made: z.boolean(),
        x: z.number(),
        y: z.number(),
        gameId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(30, "15 s"),
        analytics: false,

        prefix: "@upstash/ratelimit",
      });

      const ratelimitKey = `addShots:${ctx.user.id}`;

      const { success } = await ratelimit.limit(ratelimitKey);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      const playerId = z.coerce.number().safeParse(input.playerId);
      const teamId = z.coerce.number().safeParse(input.teamId);
      const x = z.coerce.number().safeParse(input.x);
      const y = z.coerce.number().safeParse(input.y);
      const gameId = z.coerce.number().safeParse(input.gameId);
      const made = z.coerce.boolean().safeParse(input.made);

      if (!playerId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }
      if (!teamId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      if (!made.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Made not found",
        });
      }

      if (!x.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "X not found",
        });
      }
      if (!y.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Y not found",
        });
      }

      if (!gameId.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        });
      }

      if (!input.points) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Points not found",
        });
      }

      try {
        const team = await ctx.db.team.findUniqueOrThrow({
          where: {
            id: teamId.data,
            users_id: ctx.user.id,
          },
        });

        const player = await ctx.db.player.findUniqueOrThrow({
          where: {
            id: playerId.data,
            teamId: teamId.data,
          },
        });

        if (player.teamId !== team.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Player not found",
          });
        }

        return await ctx.db.shot.create({
          data: {
            playerId: playerId.data,
            made: made.data,
            xPoint: x.data,
            yPoint: y.data,
            gameId: gameId.data,
            teamId: teamId.data, // Add the missing teamId property
            points: input.points,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }
    }),
});
