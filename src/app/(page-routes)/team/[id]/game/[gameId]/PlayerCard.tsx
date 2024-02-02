"use client";

import type { player } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "~/app/_components/shadcn/ui/button";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface PlayerCardProps {
  player: player;
  toggleForDrawer: () => void;
  setPlayerSwap: (playerId: string) => void;
}

function PlayerCard(props: PlayerCardProps) {
  const { player, toggleForDrawer, setPlayerSwap } = props;
  const { players } = usePlayerForApp((state) => state);

  return (
    <div key={player.id} className="bg-primary-foreground p-10 ">
      <p className="p-4 text-3xl"> {player.name} </p>
      <div className="flex space-x-4  ">
        <Button
          className={"w-full  bg-green-500"}
          onClick={() => {
            if (players.length <= 5) {
              toast.info("You need at least 6 players to sub out");
              return;
            }
            setPlayerSwap(player.id);
            toggleForDrawer();
          }}
        >
          Sub Out
        </Button>
      </div>
    </div>
  );
}

export default PlayerCard;
