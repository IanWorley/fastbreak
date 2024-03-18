"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";

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
  const [QTR, setQTR] = useState("1");

  const toggle = () => setIsOpen(!isOpen);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center ">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline h-10 w-10 animate-spin fill-gray-600 text-gray-200 dark:fill-gray-300 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (isError) {
    return <div>Error</div>;
  }

  addPlayers(data ?? []);

  return (
    <div className="">
      <BasketballCourt
        toggle={toggle}
        setCords={setCords}
        quarter={z.coerce.number().parse(QTR)}
      />
      <div className="flex items-center justify-center p-4">
        <div>
          <Select
            value={QTR}
            defaultValue={QTR}
            onValueChange={(o) => setQTR(o)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a QTR" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>QTR</SelectLabel>
                <SelectItem value="1">1 QTR</SelectItem>
                <SelectItem value="2">2 QTR</SelectItem>
                <SelectItem value="3">3 QTR</SelectItem>
                <SelectItem value="4">4 QTR</SelectItem>
                <SelectItem value="5">OT</SelectItem>
                {/*! Value five is OT */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-evenly">
        <PlayerList
          toggleForDrawer={togglePlayerSubDrawerState}
          setPlayerSwap={setPlayerSwap}
          quarter={z.coerce.number().parse(QTR)}
        />
      </div>
      <Modal
        gameId={gameId}
        teamid={teamId}
        open={isOpen}
        toggle={toggle}
        x={xPos}
        y={yPos}
        quarter={z.coerce.number().parse(QTR)}
      />

      <PlayerSubDrawer
        open={PlayerSubDrawerState}
        onOpenChange={setPlayerSubDrawerState}
        playerToSwap={playerSwap}
        quarter={z.coerce.number().parse(QTR)}
      />
    </div>
  );
}

export default GameClient;
