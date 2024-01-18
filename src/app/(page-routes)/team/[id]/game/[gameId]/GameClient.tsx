"use client";
import React, { useState } from "react";
import BasketballCourt from "./BasketballCourt";
import Modal from "./Model";
import { useParams } from "next/navigation";
import { z } from "zod";
import { usePlayerForApp } from "~/store/PlayerForApp";
import PlayerList from "./PlayerList";
import { api } from "~/trpc/react";

function GameClient() {
  const parms = useParams<{ id: string; gameId: string }>();
  const teamId = z.coerce.number().parse(parms.id);
  const gameId = z.coerce.number().parse(parms.gameId);

  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const setCords = (x: number, y: number) => {
    setXPos(x);
    setYPos(y);
  };

  const addPlayers = usePlayerForApp((state) => state.addPlayers);

  const { data, isLoading, isError } = api.team.grabPlayers.useQuery(
    teamId.toString(),
  );

  // is open state
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  addPlayers(data);

  return (
    <div className="">
      <BasketballCourt
        toggle={toggle}
        setCords={setCords}
        gameId={gameId.toString()}
        teamId={teamId}
      />
      <div className="flex justify-evenly">
        <div className="  grid  grid-cols-1 gap-16 md:grid-cols-2">
          <PlayerList />
        </div>
      </div>
      <Modal
        gameId={gameId.toString()}
        teamid={teamId.toString()}
        open={isOpen}
        toggle={toggle}
        x={xPos}
        y={yPos}
      />
    </div>
  );
}

export default GameClient;
