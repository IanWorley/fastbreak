import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters
import { z } from "zod";
import { cuid2 } from "~/lib/utils";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const playerRouter = createTRPCRouter({
  addPlayer: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        jerseyNumber: z.number().positive(),
        teamId: z.string().cuid2(),
      }),
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

      const jerseyNumber = z.coerce.number().safeParse(input.jerseyNumber);

      if (!jerseyNumber.success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Jersey number not found",
        });
      }

      const team = await ctx.db.team.findUniqueOrThrow({
        where: {
          id: input.teamId,
          users_id: ctx.user.id,
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.player.create({
        data: {
          id: cuid2(),
          name: input.name,
          jersey: jerseyNumber.data,
          teamId: input.teamId,
        },
      });
    }),

  archivePlayer: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid2(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(30, "15 s"),
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

      const player = await ctx.db.player.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      const team = await ctx.db.team.findUnique({
        where: {
          id: player.teamId,
          users_id: ctx.user.id,
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.player.update({
        where: {
          id: input.id,
        },
        data: {
          archived: !player.archived,
        },
      });
    }),

  addShots: protectedProcedure
    .input(
      z.object({
        points: z.number().min(0).max(3),
        playerId: z.string().cuid2(),
        teamId: z.string().cuid2(),
        made: z.boolean(),
        x: z.number(),
        y: z.number(),
        gameId: z.string().cuid2(),
        isFreeThrow: z.optional(z.boolean()),
      }),
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

      const x = z.coerce.number().safeParse(input.x);
      const y = z.coerce.number().safeParse(input.y);
      const made = z.coerce.boolean().safeParse(input.made);

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

      if (!input.points) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Points not found",
        });
      }

      const team = await ctx.db.team.findUnique({
        where: {
          id: input.teamId,
          users_id: ctx.user.id,
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      const player = await ctx.db.player.findUnique({
        where: {
          id: input.playerId,
          teamId: input.teamId,
        },
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      if (player.teamId !== team.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      const shot = await ctx.db.shot.create({
        data: {
          id: cuid2(),
          playerId: input.playerId,
          made: made.data,
          xPoint: x.data,
          yPoint: y.data,
          gameId: input.gameId,
          teamId: input.teamId, // Add the missing teamId property
          points: input.points,
          isFreeThrow: input.isFreeThrow ?? false,
        },
      });

      if (!shot) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      await ctx.db.player.update({
        where: {
          id: input.playerId,
        },
        data: {
          totalPoints: {
            increment: input.points,
          },
        },
      });

      return shot;
    }),
});
