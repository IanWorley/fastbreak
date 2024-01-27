import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "~/app/_components/shadcn/ui/drawer";
import { usePlayerForApp } from "~/store/PlayerForApp";
import DrawerPlayerCard from "./DrawerPlayerCard";
interface IPropsPlayerSubDrawer {
  open: boolean;
  onOpenChange: () => void;
}

function PlayerSubDrawer(props: IPropsPlayerSubDrawer) {
  const { open, onOpenChange } = props;
  const { players } = usePlayerForApp((state) => state);

  return (
    <Drawer open={open}>
      <DrawerContent>
        <DrawerTitle>
          {" "}
          <h3 className="p-4 text-2xl font-semibold">Player Sub In</h3>
        </DrawerTitle>
        <div className="grid grid-cols-4 grid-rows-4 gap-5">
          {players
            .filter((player) => player.isPlaying === false)
            .map((player) => (
              <DrawerPlayerCard key={player.id} player={player} />
            ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default PlayerSubDrawer;
