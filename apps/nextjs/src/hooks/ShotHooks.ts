import { api } from "~/trpc/react";

export const useShotsForGame = (
  gameId: string,
  teamId: string,
  quarter: number,
) => {
  const shots = api.game.grabPlayersShotsFromGame.useQuery(
    { gameId, teamId, quarter },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return shots.data ?? [];
};
