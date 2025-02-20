import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "drizzle-orm";
import { schema } from "~/server/db/schema/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cuid2, rateLimiter } from "../utils";

export const teamsRouter = createTRPCRouter({
  grabTeams: protectedProcedure.query(async ({ ctx }) => {
    await rateLimiter(ctx.userId, 10);

    const teams = await ctx.db.query.team.findMany({
      where: (team, { eq }) => eq(team.user_id, ctx.userId),
    });

    return teams;
  }),

  deleteTeam: protectedProcedure
    .input(z.string().cuid2())
    .mutation(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) =>
          and(eq(team.id, input), eq(team.user_id, ctx.userId)),
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      await ctx.db.delete(schema.shot).where(eq(schema.shot.team_Id, input));

      await ctx.db.delete(schema.game).where(eq(schema.game.teamId, input));

      await ctx.db
        .delete(schema.player)
        .where(eq(schema.player.team_id, input));

      await ctx.db.delete(schema.team).where(eq(schema.team.id, input));

      return true;
    }),

  grabPlayers: protectedProcedure
    .input(z.string().cuid2())
    .query(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);

      const team = await ctx.db.query.team.findFirst({
        where: (team, { and, eq }) =>
          and(eq(team.id, input), eq(team.user_id, ctx.userId)),
      });

      if (!team) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      return await ctx.db.query.player.findMany({
        where: (player, { eq }) => eq(player.team_id, input),
      });
    }),

  createTeam: protectedProcedure
    .input(z.object({ name: z.string().min(3).max(255) }))
    .mutation(async ({ ctx, input }) => {
      await rateLimiter(ctx.userId, 10);

      const id = cuid2();

      await ctx.db
        .insert(schema.team)
        .values({ id, name: input.name, user_id: ctx.userId });

      // const team = await ctx.db.team.create({
      //   data: {
      //     id: cuid2(),
      //     name: input.name,
      //     users_id: ctx.userId,
      //   },
      // });

      return await ctx.db.query.team.findFirst({
        where: eq(schema.team.id, id),
      });
    }),
});
