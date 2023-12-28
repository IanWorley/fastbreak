"use client";
import React, { useState } from "react";
import BasketballCourt from "./BasketballCourt";
import { useQuery } from "@tanstack/react-query";
import Modal from "./Model";
import { useParams } from "next/navigation";
import { z } from "zod";
import { usePlayerForApp } from "@/src/store/PlayerForApp";
import PlayerList from "./PlayerList";

function GameClient() {
  const { id, gameId } = useParams<{ id: string; gameId: string }>();
  const teamId = z.coerce.number().parse(id);
  console.log(gameId);

  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const setCords = (x: number, y: number) => {
    setXPos(x);
    setYPos(y);
  };

  const addPlayers = usePlayerForApp((state) => state.addPlayers);

  const { isLoading, data, isError } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const response = await fetch(`/api/team/${teamId}/players`);

      const data = await response.json();

      return data;
    },
  });

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
      <BasketballCourt toggle={toggle} setCords={setCords} />
      <div className="flex justify-evenly">
        <div className="grid grid-cols-2 gap-16">
          <PlayerList />
        </div>
      </div>
      <Modal
        gameId={gameId}
        teamid={id}
        open={isOpen}
        toggle={toggle}
        x={xPos}
        y={yPos}
      />
    </div>
  );
}

export default GameClient;
