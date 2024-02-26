import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters
import { z } from "zod";

import { schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cuid2 } from "../utils";

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

      const { success } = await ratelimit.limit(ctx.userId);

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

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) =>
          and(eq(team.id, input.teamId), eq(team.user_id, ctx.userId)),
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      const id = cuid2();

      await ctx.db.insert(schema.player).values({
        id: id,
        name: input.name,
        jerseyNumber: jerseyNumber.data,
        team_id: input.teamId,
      });

      return await ctx.db.query.player.findFirst({
        where: (player, { eq }) => eq(player.id, id),
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

      const { success } = await ratelimit.limit(ctx.userId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }

      const player = await ctx.db.query.player.findFirst({
        where: (player, { eq }) => eq(player.id, input.id),
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) =>
          and(eq(team.id, player.team_id), eq(team.user_id, ctx.userId)),
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      await ctx.db.update(schema.player).set({
        archived: !player.archived,
      });

      return await ctx.db.query.player.findFirst({
        where: (player, { eq }) => eq(player.id, input.id),
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

      const ratelimitKey = `addShots:${ctx.userId}`;

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

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) =>
          and(eq(team.id, input.teamId), eq(team.user_id, ctx.userId)),
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      const player = await ctx.db.query.player.findFirst({
        where: (player, { and, eq }) =>
          and(eq(player.id, input.playerId), eq(player.team_id, input.teamId)),
      });

      if (!player) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      if (player.team_id !== team.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }

      const id = cuid2();

      await ctx.db.insert(schema.shot).values({
        id: id,
        player_Id: input.playerId,
        made: made.data,
        xPoint: x.data,
        yPoint: y.data,
        game_Id: input.gameId,
        team_Id: input.teamId, // Add the missing teamId property
        points: input.points,
        isFreeThrow: input.isFreeThrow ?? false,
      });

      const shot = await ctx.db.query.shot.findFirst({
        where: (shot, { eq }) => eq(shot.id, id),
      });

      if (!shot) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return shot;
    }),
});
