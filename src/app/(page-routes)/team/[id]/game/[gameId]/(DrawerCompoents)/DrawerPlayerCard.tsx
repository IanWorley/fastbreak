import { type player } from "@prisma/client";
import { Button } from "~/app/_components/shadcn/ui/button";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface DrawerPlayerCardProps {
  player: player;
  playerToSwap: string;
  onOpenChange: (open: boolean) => void;
}

function DrawerPlayerCard(props: DrawerPlayerCardProps) {
  const { player, playerToSwap, onOpenChange } = props;
  const { swapPlayersActive } = usePlayerForApp((state) => state);

  return (
    <div key={player.id} className="bg-primary-foreground md:mx-4 md:p-10 ">
      <p className="p-2 text-center text-xl md:p-4 md:text-3xl">
        {player.name}
      </p>
      <Button
        className="w-full"
        onClick={() => {
          swapPlayersActive(player.id, playerToSwap);
          onOpenChange(false);
        }}
      >
        Sub In
      </Button>
    </div>
  );
}

export default DrawerPlayerCard;
