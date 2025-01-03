import { FaXmark } from "react-icons/fa6";

import { Button } from "~/app/_components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/app/_components/ui/drawer";

import { usePlayerForApp } from "~/store/PlayerForApp";
import DrawerPlayerCard from "./DrawerPlayerCard";

interface IPropsPlayerSubDrawer {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setPlayerShooting: (playerId: string) => void;
  playerShooting: string;
  playerToSwap: string;
  quarter: number;
}

function PlayerSubDrawer(props: IPropsPlayerSubDrawer) {
  const {
    open,
    onOpenChange,
    playerToSwap,
    quarter,
    setPlayerShooting,
    playerShooting,
  } = props;
  const { players } = usePlayerForApp((state) => state);

  return (
    <Drawer open={open} onOpenChange={(o: boolean) => onOpenChange(o)}>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-2xl">Player Sub In</DrawerTitle>
          <DrawerClose className="hidden p-4 md:block">
            <Button variant={"destructive"}>
              <FaXmark />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex grid-cols-4 grid-rows-4 flex-col gap-5 overflow-y-scroll md:grid">
          {players
            .filter((player) => player.isPlaying === false)
            .map((player) => (
              <DrawerPlayerCard
                key={player.id}
                player={player}
                playerToSwap={playerToSwap}
                onOpenChange={onOpenChange}
                quarter={quarter}
                setPlayerShooting={setPlayerShooting}
                playerShooting={playerShooting}
              />
            ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default PlayerSubDrawer;
