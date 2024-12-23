"use client";

import { Button } from "~/app/_components/ui/button";
import { type playerType } from "~/server/db/schema/schema";

interface IPropsStatsDrawer {
  onOpenChange: (open: boolean) => void;
  setPlayerToSwap: (player: string) => void;
  playerToSwap: string;
  players: playerType[];
}

function PlayerSelectDrawer(props: IPropsStatsDrawer) {
  const { onOpenChange, setPlayerToSwap, playerToSwap, players } = props;

  return (
    <div className="flex grid-cols-4 grid-rows-4 flex-col gap-5 overflow-y-scroll md:grid">
      {players
        .filter((player) => player.id !== playerToSwap)
        .map((player) => (
          <Button
            key={player.id}
            onClick={() => {
              setPlayerToSwap(player.id);
              onOpenChange(false);
            }}
          >
            {player.name}
          </Button>
        ))}
    </div>
  );
}

export default PlayerSelectDrawer;
