"use client";

import { FaXmark } from "react-icons/fa6";

import type { playerType } from "@acme/db";
import { Button } from "@acme/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@acme/ui/drawer";

import ListPlayer from "./ListPlayer";

interface IPropsStatsDrawer {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerToSwap: string;
  setPlayerToSwap: (player: string) => void;
  players: playerType[];
}

function DrawerPlayer(props: IPropsStatsDrawer) {
  const { open, onOpenChange, setPlayerToSwap, playerToSwap, players } = props;

  return (
    <Drawer
      onOpenChange={(o) => {
        onOpenChange(o);
      }}
      open={open}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-2xl">Player To View</DrawerTitle>
          <DrawerClose className="hidden p-4 md:block">
            <Button variant={"destructive"}>
              <FaXmark />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <ListPlayer
          onOpenChange={onOpenChange}
          setPlayerToSwap={setPlayerToSwap}
          playerToSwap={playerToSwap}
          players={players}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerPlayer;
