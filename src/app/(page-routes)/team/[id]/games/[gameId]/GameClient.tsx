"use client";
import React, { ReactNode, useState } from "react";
import BasketballCourt from "./BasketballCourt";
import { useQuery } from "@tanstack/react-query";
import Modal from "./Model";
import { useParams } from "next/navigation";
import { z } from "zod";
import type { player } from "@prisma/client";
import { Button } from "@/src/components/ui/button";

function GameClient() {
  const { id } = useParams<{ id: string }>();
  const teamId = z.coerce.number().parse(id);
  console.log(teamId);

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

  return (
    <div className="">
      <BasketballCourt toggle={toggle} />
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-7">
          {data.map((player: player) => (
            <div key={player.id} className="bg-primary-foreground p-10 ">
              <p className="text-3xl p-4"> {player.name} </p>
              <div className="flex space-x-4  ">
                <Button className="w-full bg-green-500"> Made </Button>
                <Button className="w-full bg-red-500"> Missed </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={isOpen} toggle={toggle} />
    </div>
  );
}

export default GameClient;
