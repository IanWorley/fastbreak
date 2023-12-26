"use client";
import React, { ReactNode, use, useState } from "react";
import BasketballCourt from "./BasketballCourt";
import { useQuery } from "@tanstack/react-query";
import Modal from "./Model";
import { useParams } from "next/navigation";
import { z } from "zod";
import type { player } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import PlayerCard from "./PlayerCard";
import { usePlayerForApp } from "@/src/state/PlayerForApp";
import PlayerList from "./PlayerList";

function GameClient() {
  const { id } = useParams<{ id: string }>();
  const teamId = z.coerce.number().parse(id);
  console.log(teamId);

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
      <BasketballCourt toggle={toggle} />
      <div className="flex justify-evenly">
        <div className="grid grid-cols-2 gap-16">
          <PlayerList />
        </div>
      </div>

      <Modal open={isOpen} toggle={toggle} />
    </div>
  );
}

export default GameClient;
