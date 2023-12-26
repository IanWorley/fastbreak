"use client";

import { Button } from "@/src/components/ui/button";
import type { player } from "@prisma/client";
import { useState } from "react";
import { usePlayerForApp } from "@/src/store/PlayerForApp";

interface PlayerCardProps {
  player: player;
}

function PlayerCard(props: PlayerCardProps) {
  const { player } = props;
  const [active, setActive] = useState(false);
  const toggleActive = usePlayerForApp((state) => state.togglePlayer);

  const toggle = () => {
    setActive(!active);
    toggleActive(player.id);
  };

  return (
    <div key={player.id} className="bg-primary-foreground p-10 ">
      <p className="text-3xl p-4"> {player.name} </p>
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
