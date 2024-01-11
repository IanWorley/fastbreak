"use client";

import { Button } from "~/app/_components/shadcn/ui/button";
import type { player } from "@prisma/client";
import { useState } from "react";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface PlayerCardProps {
  player: player;
}

function PlayerCard(props: PlayerCardProps) {
  const { player } = props;
  const [active, setActive] = useState(false);
  const toggleActive = usePlayerForApp((state) => state.togglePlayer);
  const sortPlayers = usePlayerForApp((state) => state.sortPlayers);

  const toggle = () => {
    setActive(!active);
    toggleActive(player.id);
    sortPlayers();
  };

  return (
    <div key={player.id} className="bg-primary-foreground p-10 ">
      <p className="p-4 text-3xl"> {player.name} </p>
      <div className="flex space-x-4  ">
        <Button
          className={"w-full " + `${active ? "bg-green-500" : "bg-red-600"}`}
          onClick={() => {
            toggle();
          }}
        >
          {active ? "Playing" : "Not Playing"}
        </Button>
      </div>
    </div>
  );
}

export default PlayerCard;
