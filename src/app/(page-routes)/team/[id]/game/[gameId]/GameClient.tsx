"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { usePlayerForApp } from "~/store/PlayerForApp";
import { api } from "~/trpc/react";
import PlayerSubDrawer from "./(DrawerCompoents)/PlayerSubDrawer";
import BasketballCourt from "./BasketballCourt";
import Modal from "./Model";
import PlayerList from "./PlayerList";

function GameClient() {
  const parms = useParams<{ id: string; gameId: string }>();
  const teamId = z.string().cuid2().parse(parms.id);
  const gameId = z.string().cuid2().parse(parms.gameId);

  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);

  const setCords = (x: number, y: number) => {
    setXPos(x);
    setYPos(y);
  };

  const [playerSwap, setPlayerSwap] = useState("");

  const [PlayerSubDrawerState, setPlayerSubDrawerState] = useState(false);

  const togglePlayerSubDrawerState = () => {
    setPlayerSubDrawerState(!PlayerSubDrawerState);
  };

  const addPlayers = usePlayerForApp((state) => state.addPlayers);

  const { data, isLoading, isError } = api.team.grabPlayers.useQuery(teamId);

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
        gameId={gameId}
        teamId={teamId}
      />

      <div className="flex justify-evenly">
        <PlayerList
          toggleForDrawer={togglePlayerSubDrawerState}
          setPlayerSwap={setPlayerSwap}
        />
      </div>
      <Modal
        gameId={gameId}
        teamid={teamId}
        open={isOpen}
        toggle={toggle}
        x={xPos}
        y={yPos}
      />

      <PlayerSubDrawer
        open={PlayerSubDrawerState}
        onOpenChange={setPlayerSubDrawerState}
        playerToSwap={playerSwap}
      />
    </div>
  );
}

export default GameClient;
