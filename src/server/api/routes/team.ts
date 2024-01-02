import { router, protectedProcedure } from "@/src/server/trpc";
import { team } from "@prisma/client";

const grabUserTeams = async (ctx) => {
  const teams = await ctx.db.team.findMany({
    where: {
      users_id: ctx.user.id,
    },
  });

  return teams as team[];
};

export const teamsRouter = router({
  grabTeam: protectedProcedure.query(async ({ ctx, input }) => {
    return await grabUserTeams(ctx);
  }),
});
