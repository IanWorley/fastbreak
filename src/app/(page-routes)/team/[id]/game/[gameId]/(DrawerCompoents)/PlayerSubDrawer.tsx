import { FaXmark } from "react-icons/fa6";
import { Button } from "~/app/_components/shadcn/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/app/_components/shadcn/ui/drawer";
import { usePlayerForApp } from "~/store/PlayerForApp";
import DrawerPlayerCard from "./DrawerPlayerCard";
interface IPropsPlayerSubDrawer {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerToSwap: string;
}

function PlayerSubDrawer(props: IPropsPlayerSubDrawer) {
  const { open, onOpenChange, playerToSwap } = props;
  const { players } = usePlayerForApp((state) => state);

  return (
    <Drawer open={open} onOpenChange={(o) => onOpenChange(o)}>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-2xl">Player Sub In</DrawerTitle>
          <DrawerClose className="hidden p-4 md:block">
            <Button variant={"destructive"}>
              <FaXmark />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="grid grid-cols-4 grid-rows-4 gap-5">
          {players
            .filter((player) => player.isPlaying === false)
            .map((player) => (
              <DrawerPlayerCard
                key={player.id}
                player={player}
                playerToSwap={playerToSwap}
                onOpenChange={onOpenChange}
              />
            ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default PlayerSubDrawer;
