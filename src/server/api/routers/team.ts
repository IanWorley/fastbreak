import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

export const teamsRouter = createTRPCRouter({
  grabTeams: protectedProcedure.query(async ({ ctx, input }) => {
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

    return await ctx.db.team.findMany({
      where: {
        users_id: ctx.user.id,
      },
    });
  }),

  deleteTeam: protectedProcedure
    .input(z.string())
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

      const teamId = z.coerce.number().safeParse(input);

      if (!teamId.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid team ID",
        });
      }

      const team = await ctx.db.team.findUnique({
        where: {
          id: teamId.data,
          users_id: ctx.user.id,
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      await ctx.db.shot.deleteMany({
        where: {
          teamId: teamId.data,
        },
      });

      await ctx.db.game.deleteMany({
        where: {
          teamId: teamId.data,
        },
      });

      await ctx.db.player.deleteMany({
        where: {
          teamId: teamId.data,
        },
      });

      await ctx.db.team.delete({
        where: {
          id: teamId.data,
        },
      });

      return true;
    }),

  grabPlayers: protectedProcedure
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
          code: "BAD_REQUEST",
          message: "Invalid team ID",
        });
      }

      const team = await ctx.db.team.findUnique({
        where: {
          id: teamId.data,
          users_id: ctx.user.id,
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.player.findMany({
        where: {
          teamId: teamId.data,
        },
      });
    }),

  createTeam: protectedProcedure
    .input(z.object({ name: z.string() }))
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

      const teamName = z.coerce.string().min(3).max(255).safeParse(input);

      if (!teamName.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid team name",
        });
      }

      const team = await ctx.db.team.create({
        data: {
          name: teamName.data,
          users_id: ctx.user.id,
        },
      });

      return team;
    }),
});