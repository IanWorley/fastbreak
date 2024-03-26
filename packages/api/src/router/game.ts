import * as process from "process";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

import { eq, schema } from "@acme/db"; // Import the missing type

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cuid2, rateLimiter } from "../utils";

export const gameRouter = createTRPCRouter({
  grabGames: protectedProcedure
    .input(z.string().cuid2())
    .query(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);
      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input), eq(team.user_id, ctx.userId));
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      console.log("team found: ", team);

      // grab all games and all shots associated with the games
      // join would this require a join?
      //
      const gameData = await ctx.db.query.game.findMany({
        where: eq(schema.game.teamId, input),
      });

      // package games with shots from that game together

      const games = await Promise.all(
        gameData.map(async (game) => {
          const shots = await ctx.db.query.shot.findMany({
            where: eq(schema.shot.game_Id, game.id),
          });

          return {
            ...game,
            shots: shots ? shots : [],
          };
        }),
      );

      return games;
    }),

  deleteGame: protectedProcedure
    .input(z.object({ gameId: z.string().cuid2(), teamId: z.string().cuid2() }))
    .mutation(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.userId));
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      await ctx.db
        .delete(schema.shot)
        .where(eq(schema.shot.game_Id, input.gameId));

      await ctx.db.delete(schema.game).where(eq(schema.game.id, input.gameId));

      return { status: "success" };
    }),

  createGame: protectedProcedure
    .input(z.object({ teamId: z.string().cuid2(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.userId));
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      const id = cuid2();

      await ctx.db.insert(schema.game).values({
        id: id,
        name: input.name,
        teamId: input.teamId,
      });

      console.log("game created with id: ", id);

      return await ctx.db.query.game.findFirst({
        where: eq(schema.game.id, id),
      });
    }),

  grabGame: protectedProcedure
    .input(z.object({ gameId: z.string().cuid2(), teamId: z.string().cuid2() }))
    .query(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.userId));
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
    /***
     * @typedef {Object} grabPlayersShotsFromGameInput
     * @property {string} gameId - The id of the game
     * @property {string} teamId - The id of the team
     * @property {number| undefined} quarter - The quarter of the game
     * * NOTE: The undefine option is used to get all the shots from the game
     */

    .input(
      z.object({
        gameId: z.string().cuid2(),
        teamId: z.string().cuid2(),
        quarter: z.number().min(1).max(5).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) => {
          return and(eq(team.id, input.teamId), eq(team.user_id, ctx.userId));
        },
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      if (!input.quarter) {
        return await ctx.db.query.shot.findMany({
          where: (shot, { eq }) => {
            return (
              eq(shot.game_Id, input.gameId) && eq(shot.team_Id, input.teamId)
            );
          },
        });
      } else {
        // quater for a shot is not a required field
        return await ctx.db.query.shot.findMany({
          where: (shot, { eq }) => {
            return (
              eq(shot.game_Id, input.gameId) &&
              eq(shot.team_Id, input.teamId) &&
              eq(shot.quarter ?? 0, input.quarter ?? 0)
            );
          },
        });
      }
    }),
});
