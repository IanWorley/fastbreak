import { router, publicProcedure, protectedProcedure } from "@/src/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const playerRouter = router({
  addShots: protectedProcedure
    .input(
      z.object({
        playerId: z.string(),
        teamId: z.string(),
        made: z.boolean(),
        x: z.number(),
        y: z.number(),
        gameId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
