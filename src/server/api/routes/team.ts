import { router, protectedProcedure } from "@/src/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const teamsRouter = router({
  grabTeams: protectedProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.team.findMany({
      where: {
        users_id: ctx.user.id,
      },
    });
  }),
  grabPlayers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
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
});
