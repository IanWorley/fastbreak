"use client";
import React, { useState } from "react";
import BasketballCourt from "./BasketballCourt";
import { useQuery } from "@tanstack/react-query";
import Modal from "./Model";
import { useParams } from "next/navigation";
import { z } from "zod";
import { usePlayerForApp } from "@/src/store/PlayerForApp";
import PlayerList from "./PlayerList";
import { appRouter } from "@/src/server";
import { trpc } from "@/src/app/_trpc/client";

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

  const { data, isLoading, isError } = trpc.TeamRouter.grabPlayers.useQuery(
    teamId.toString(),
    {
      queryKey: ["players"],
    }
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
        <div className="grid grid-cols-2 gap-16">
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
