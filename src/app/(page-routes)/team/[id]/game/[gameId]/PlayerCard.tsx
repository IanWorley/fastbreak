"use client";

import { Button } from "~/app/_components/shadcn/ui/button";
import type { player } from "@prisma/client";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface PlayerCardProps {
  player: player;
  toggleForDrawer: () => void;
}

function PlayerCard(props: PlayerCardProps) {
  const { player, toggleForDrawer } = props;
  const toggleActive = usePlayerForApp((state) => state.togglePlayer);
  const sortPlayers = usePlayerForApp((state) => state.sortPlayers);

  const toggle = () => {
    toggleActive(player.id);
    sortPlayers();
  };

  return (
    <div key={player.id} className="bg-primary-foreground p-10 ">
      <p className="p-4 text-3xl"> {player.name} </p>
      <div className="flex space-x-4  ">
        <Button
          className={"w-full  bg-green-500"}
          onClick={() => {
            // toggle();
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
