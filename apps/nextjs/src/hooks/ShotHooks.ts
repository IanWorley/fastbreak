import { api } from "~/trpc/react";

export const useShotsForGame = (gameId: string, teamId: string) => {
  const shots = api.game.grabPlayersShotsFromGame.useQuery(
    { gameId, teamId },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  return shots.data;
};
