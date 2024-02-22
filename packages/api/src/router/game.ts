import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { eq } from "@acme/db";

import { cuid2 } from "~/lib/utils";
import { game } from "../../../db/src/schema/game";
import { shot } from "../../../db/src/schema/shot";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gameRouter = createTRPCRouter({
  grabGames: protectedProcedure
    .input(z.string().cuid2())
    .query(async ({ ctx, input }) => {
      //! Ignore this error this is code runs fine and should not be changed vscode is just being dumb and not recognizing the code
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

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input), eq(team.user_id, ctx.user.id));
        },
      });

      // const team = await ctx.db.team.findUniqueOrThrow({
      //   where: {
      //     id: input,
      //     users_id: ctx.user.id,
      //   },
      // });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.query.game.findMany({
        where: (game, { eq }) => {
          return eq(game.teamId, input);
        },
        with: {
          shots: true,
        },
      });

      // return await ctx.db.game.findMany({
      //   where: {
      //     teamId: input,
      //   },
      //   include: {
      //     shots: true,
      //   },
      // });
    }),

  deleteGame: protectedProcedure
    .input(z.object({ gameId: z.string().cuid2(), teamId: z.string().cuid2() }))
    .mutation(async ({ ctx, input }) => {
      //! Ignore this error this is code runs fine and should not be changed vscode is just being dumb and not recognizing the code

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

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.user.id));
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      await ctx.db.delete(shot).where(eq(shot.game_Id, input.gameId));

      await ctx.db.delete(game).where(eq(game.id, input.gameId));

      return { status: "success" };
    }),

  createGame: protectedProcedure
    .input(z.object({ teamId: z.string().cuid2(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //! Ignore this error this is code runs fine and should not be changed vscode is just being dumb and not recognizing the code
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

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.user.id));
        },
      });

      // const team = await ctx.db.team.findUnique({
      //   where: {
      //     id: input.teamId,
      //     users_id: ctx.user.id,
      //   },
      // });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.game.create({
        data: {
          id: cuid2(),
          name: input.name,
          teamId: input.teamId,
        },
      });
    }),

  grabGame: protectedProcedure
    .input(z.object({ gameId: z.string().cuid2(), teamId: z.string().cuid2() }))
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

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.user.id));
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.query.game.findFirst({
        where: (game, { and, eq }) => {
          return and(eq(game.id, input.gameId), eq(game.teamId, input.teamId));
        },
      });
    }),

  grabPlayersShotsFromGame: protectedProcedure
    .input(z.object({ gameId: z.string().cuid2(), teamId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      //! Ignore this error this is code runs fine and should not be changed vscode is just being dumb and not recognizing the code
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

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.user.id));
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.query.shot.findMany({
        where: (shot, { eq }) => {
          return eq(shot.game_Id, input.gameId);
        },
      });
    }),
});
