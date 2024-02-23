import { type player } from "@prisma/client";
import { useParams } from "next/navigation";
import { z } from "zod";
import { Button } from "~/app/_components/shadcn/ui/button";
import { useShotsForGame } from "~/hooks/ShotHooks";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface DrawerPlayerCardProps {
  player: player;
  playerToSwap: string;
  onOpenChange: (open: boolean) => void;
}

function DrawerPlayerCard(props: DrawerPlayerCardProps) {
  const parms = useParams<{ id: string; gameId: string }>();

  const teamId = z.string().cuid2().parse(parms.id);
  const gameId = z.string().cuid2().parse(parms.gameId);

  const { player, playerToSwap, onOpenChange } = props;
  const { swapPlayersActive } = usePlayerForApp((state) => state);

  const shots = useShotsForGame(gameId, teamId);

  const { freethrow, twopoint, threepoint } = shots
    .filter((shot) => shot.playerId === player.id && shot.gameId === gameId)
    .reduce(
      (acc, shot) => {
        if (shot.made) {
          if (shot.isFreeThrow) {
            acc.freethrow++;
          }
          if (shot.isFreeThrow === false && shot.points === 2) {
            acc.twopoint++;
          }
          if (shot.points === 3) {
            acc.threepoint++;
          }
        }
        return acc;
      },
      { freethrow: 0, twopoint: 0, threepoint: 0 },
    );

  return (
    <div key={player.id} className="bg-primary-foreground  md:mx-2 md:p-2 ">
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

      <div className=" flex items-center justify-evenly ">
        <div>
          <p className=" text-center"> {freethrow} </p>
          <p className=" text-center"> Free Throw </p>
        </div>
        <div>
          <p className=" text-center"> {twopoint} </p>
          <p className="text-center"> 2 Point </p>
        </div>
        <div>
          <p className=" text-center"> {threepoint} </p>
          <p className="text-center"> 3 Point </p>
        </div>
      </div>
    </div>
  );
}

export default DrawerPlayerCard;
